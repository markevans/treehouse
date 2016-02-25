#Treehouse JS

[![Code Climate](https://codeclimate.com/github/markevans/treehouse/badges/gpa.svg)](https://codeclimate.com/github/markevans/treehouse)

[![Build Status](https://travis-ci.org/markevans/treehouse.svg?branch=master)](https://travis-ci.org/markevans/treehouse)

## Overview
Treehouse is an opinionated small javascript framework for writing web apps.

The basic flow as as follows:

  - ALL the state about the system is kept in one immutable state tree.
    The tree should be normalized (no duplicated data) and JSON serializable, i.e. contains only objects, arrays, strings and numbers.

  - EVERY single input enters the system via an "action". An "input" means:
    - user interaction with the DOM, e.g. a click
    - a message from a websocket
    - a timer/interval callback
    - a URL update

  - An action updates the tree in some way. As the tree is immutable, the whole tree needs to be changed. Treehouse provides "cursor" objects to make this extremely easy.

  - It works with React via an extension

## To-do app
Below is a working to-do app using React, written in JSX, that should give an idea of how it works.

```javascript
import treehouse from 'treehouse'

// Initialize state tree
treehouse.init({
  // Storing collections of objects keyed by ID is a REALLY GOOD IDEA!
  // Turning it into an array is super-easy with a "query" (see below)
  items: {
    id1: {title: 'Run home', id: 'id1', created: Date.now()},
    id2: {title: 'Wash up', id: 'id2', created: Date.now()},
    id3: {title: 'Solve Quantum Gravity', id: 'id3', created: Date.now()}
  }
})

// React Components
import React from 'react'
treehouse.extendReact(React.Component.prototype)

class App extends React.Component {
  render () {
    return (
      <div className="app">
        <AddForm/>
        <List/>
      </div>
    )
  }
}

class AddForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {newTitle: ''}
  }

  onChange (e) {
    this.setState({newTitle: e.target.value})
  }


  onSubmit (e) {
    e.preventDefault()

    // this.action is given by the treehouse extension
    // It's very simple - this.action('actionName', {some: 'payload'})
    // does the registered (see below) action "actionName", passing in the payload
    this.action('addTodo', {title: this.state.newTitle})

    this.setState({newTitle: ''}) // to reset the text field
  }

  render () {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <input autoComplete="off" onChange={this.onChange.bind(this)} name="title" value={this.state.newTitle} />
        <button>Add</button>
      </form>
    )
  }
}

class List extends React.Component {

  // treehouseState tells treehouse which parts of the tree this component
  // cares about. Each item declared will be added to this.state
  // Cursors (pointers) to a path on the tree are declared with
  //     t.at('some', 'path')
  // and pre-registered (see below) queries are declared with
  //     t.query('queryName', {some: 'args'})
  treehouseState (t) {
    return {
      items: t.query('itemsByRecent')
    }
  }

  render () {
    return (
      <ul className="list">
        {this.state.items.map((item) => {
          return <Item itemID={item.id} key={item.id}/>
        })}
      </ul>
    )
  }
}

class Item extends React.Component {
  treehouseState (t) {
    return {
      item: t.at('items', this.props.itemID) // cursor to path ['items', itemID]
    }
  }

  handleDelete () {
    this.action('removeTodo', {id: this.props.itemID})
  }

  render () {
    return (
      <li>
        {this.state.item.title}
        <a onClick={this.handleDelete.bind(this)}> X</a>
      </li>
    )
  }
}

// Actions
treehouse.registerActions({

  // Each action's main job is to update the state tree.
  // As the tree is immutable, the entire tree needs to be changed each time.
  // The easiest way to do this is using cursors, e.g. tree.at('some', 'path')
  // Then use set
  //     tree.at('some', 'path').set(newValue)
  // Or with a function
  //     tree.at('some', 'path').set(oldValue => oldValue*2)
  //
  // The tree itself should not be changed, so you need to return a NEW OBJECT
  //
  // "mutators" (functions that return a NEW modified object, see below)
  // can be used by setting with a callback
  //     tree.at('some', 'path').set((oldValue, mutators) => {
  //       return mutators.push(oldValue, 5)
  //     })
  // Or use the convenience method
  //     tree.at('some', 'path').push(5)

  addTodo (tree, {title}) {
    // Using Math.random is not ideal but this illustrates the concept
    let newTodo = {id: Math.random(), title: title, created: Date.now()}
    tree.at('items').setAttribute(newTodo.id, newTodo)
  },

  removeTodo (tree, {id}) {
    tree.at('items').delete(id)
  }

})

// Queries

// Queries query the tree and return data. They are automatically cached,
// and only change when any parts of the tree it cares about are changed.

treehouse.registerQueries({

  itemsByRecent: {
    deps: (t) => { // Declare dependencies, uses same syntax as treehouseState()
      return {
        items: t.at('items').filter('values')  // Uses a registered filter
      }                                        // (see below)
    },
    get: ({items}) => {
      return items.sort((a, b) => {
        return a.created < b.created
      })
    }
  }

})

// Filters

// Cursors, e.g. treehouse.at('some', 'path') and queries, e.g.
// treehouse.query('someQuery', {some: 'args'}) can be streamed through a
// filter, e.g.
//     treehouse.at('some', 'path').filter('orderBy', {key: 'date'})
// Registering one is very easy - just give a function that takes data and
// returns the filtered data, e.g.
//    orderBy: (array, args) => {
//     ...return new ordered array
//    }

treehouse.registerFilters({

  // "values" filter returns the values of an object as an array
  values (object) {
    let values = []
    for (let key in object) {
      values.push(object[key])
    }
    return values
  }

})

// Render into DOM
import ReactDOM from 'react-dom'
ReactDOM.render(<App/>, document.getElementById('app'))
```

## Mutators
Mutators are useful when setting parts of the tree.
To be able to do, e.g. `tree.at('path', 'to', 'names').reverse()`,
you can register `"reverse"` like so:

```javascript
treehouse.registerMutators({

  reverse (array) {
    // 'this' is the mutators object that has all previously registered
    // mutators on it. A useful one that comes by default is 'clone'
    return this.clone(array, (a) => {  // clone the array...
      a.reverse() // ... then modify the new object
    })
  }

})
```

## Asynchronous actions
If you change the tree asynchronously in an action, you should commit the changes manually, using the yielded function
```javascript
getUsersFromServer: (tree, payload, commit) => {  // this is a registered action
  server.getUsers().then((data) => {
    tree.at('users').set(data)
    commit() // Call commit to tell treehouse to update
  })
}
```

## Using treehouse outside of React Components
Any input into the system (message over websocket, url change, etc.) should call an action
```javascript
treehouse.action('someAction', {some: 'payload'})
```
Create a "TreeView" by picking the items you care about
```javascript
let treeView = treehouse.pick((t) => {
  return {
    messages: t.at('path', 'to', 'messages').filter('latest'),
    unread: t.query('numUnreadMessages')
  }
})
```
Get data
```javascript
treeView.get()   // {
                 //   messages: [...],
                 //   unread: 7462964
                 // }
```
To watch for data changes at any of the specified paths
```javascript
treeView.watch((t) => { // (the callback yields the treeView itself)
  // ...
})
```
To unwatch
```javascript
treeView.unwatch()
```

## Setting through filters and queries
Very occasionally, you may want an easy way of creating a 1-1 map between parts of the
tree and something else (this is how the treehouse router works, mapping between the URL
  and parts of the tree).

Given a cursor `treehouse.at('selectedUserID')` we can both `get()` and `set(value)`.

But what about something that's been filtered,
e.g. `treehouse.at('users').filter('objectToArray')`,
or a query, e.g. `treehouse.query('selectedUserName')`?

### Setting through filters
If a filter is two-way e.g. to filter between
```javascript
{                                               [
  id1: {name: 'Mark', id: 'id1'},    <-->         {name: 'Mark', id: 'id1'},
  id2: {name: 'Doogie', id: 'id2'}                {name: 'Doogie', id: 'id2'}
}                                               ]
```
then we can register both a forward and reverse filter function
```javascript
treehouse.registerFilters({
  objectToArray: {
    forward: (object) => {
      let array = [], key
      for(key in object) { array.push(object[key]) }
      return array
    },
    reverse: (array) => {
      return array.reduce((obj, item) => {
        obj[item.id] = item
        return obj
      }, {})
    }
  }
})
```
Then
```javascript
treehouse.at('users').filter('objectToArray')
```
does what we expect, i.e. can be set with an array!

### Setting through queries
We can add a `set` option to the query declaration
```javascript
treehouse.registerQueries({
  selectedUserName: {
    deps (t) {
      return {
        users: t.at('userList'),
        id: t.at('selectedUserID')
      }
    },
    get ({users, id}) {
      return users[id]
    },
    set (name, {users, id}) { // Second arg is object of cursor-like objects with "set"
      let user = users.find(user => user.name == name)
      id.set(user.id)
    }
  }
})
```
Then
```javascript
treehouse.query('selectedUserName').set('Robinson Crusoe')
```
does what we expect, i.e. sets the selectedUserID to the one we want!

### Setting through a treeView
A treeview simply calls `get()` or `set()` on each item and collates them into
an object
```javascript
let treeView = treehouse.pick((t) => {
  return {
    thing: t.at('some', 'path'),
    latestUsers: t.at('users').filter('latest'),
    runners: t.query('fastestRunners')
  }
})
```
Just as calling `get()` returns something like
```javascript
treeView.get() // ==> {
               //  thing: ...
               //  latestUsers: ...
               //  runners: ...
               // }
```
You can call `set()` with
```javascript
treeView.set({
  thing: ...
  latestUsers: ...
  runners: ...
})
```
Obviously this only works if each item implements `set`, as above.
