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
    this.action('addTodo', {title: this.state.newTitle})
    this.setState({newTitle: ''})
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
      item: t.at('items', this.props.itemID)
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

let generateID = () => Math.random()*1e16
treehouse.registerActions({

  addTodo (tree, {title}) {
    let newTodo = {id: generateID(), title: title, created: Date.now()}
    tree.at('items').setWith('setAttribute', newTodo.id, newTodo)
  },

  removeTodo (tree, {id}) {
    tree.at('items').setWith('delete', id)
  }

})

// Queries

treehouse.registerQueries({

  itemsByRecent: {
    deps: (t) => {
      return {
        items: t.at('items').filter('values')
      }
    },
    get: ({items}) => {
      return items.sort((a, b) => {
        return a.created < b.created
      })
    }
  }

})

// Filters

treehouse.registerFilters({

  values (object) {
    let values = []
    for (let key in object) {
      values.push(object[key])
    }
    return values
  }

})

// Mutators

treehouse.registerMutators({
})

// Initialize App

treehouse.init({
  items: {
    id1: {title: 'Run home', id: 'id1', created: Date.now()},
    id2: {title: 'Wash up', id: 'id2', created: Date.now()},
    id3: {title: 'Solve Quantum Gravity', id: 'id3', created: Date.now()}
  }
})

import ReactDOM from 'react-dom'
ReactDOM.render(<App/>, document.getElementById('app'))
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
Create a "TreeView" by picking which tree paths you care about
```javascript
let treeView = treehouse.pick((t) => {
  return {
    user: t.at('path', 'to', 'user'),
    colour: t.query('colourOfTheDay')
  }
})
```
Get data
```javascript
treeView.get()   // {
                 //   user: "Mark",
                 //   colour: "red"
                 // }
```
You can set on the tree again in the same form
```javascript
treeView.set({user: "Don", colour: "blue"})
```
To watch for data changes at any of the specified paths
```javascript
treeView.watch((tv) => {
  // (the callback yields the treeView itself)
})
```
To unwatch
```javascript
treeView.unwatch()
```
