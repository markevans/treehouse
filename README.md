TODO: UPDATE THIS README!

#Treehouse JS

[![Code Climate](https://codeclimate.com/github/markevans/treehouse/badges/gpa.svg)](https://codeclimate.com/github/markevans/treehouse)

[![Build Status](https://travis-ci.org/markevans/treehouse.svg?branch=master)](https://travis-ci.org/markevans/treehouse)

## Overall Flow

All wiring is done for you. There are no events to bind to - if you follow the strict pattern laid out below you should get from zero to app hero in no time!

The basic flow as as follows:

  - ALL the state about the system is kept in one state tree.
    The tree is JSON serializable, i.e. contains only objects, arrays, strings and numbers.

  - EVERY single input enters the system via the actions. An "input" includes:
    - user interaction with the DOM, e.g. a click
    - a message from a websocket
    - a timer/interval callback
    - a URL update
    - etc. etc.
    The actions simply update the state, at the relevant points on the tree, and then (automatically) call "commit", which is a way of saying "I'm done, anything that cares about the changes can update yourselves now"

  - Treehouse extends React components to be aware of the tree and of actions. The components:
    - declare which parts of the tree they care about
    - ensure that `this.state` includes the relevant parts picked from the tree
    - already get updated efficiently, i.e. when the part of the tree they care about changes
    - should call an action when a user interaction happens

## Basic usage (examples in ES6)

A typical small app might look like this:

Define the actions
```javascript
// actions/egg_actions.js

export default {

  selectEgg (tree, {eggID}) {
    tree.at(['selectedEggID']).set(eggID)
  }
}
```

Write some components
```javascript
// components/app.js
import React from 'react'
import Egg from './egg'

export default class App extends React.Component {

  // Declare which parts of the tree you care about
  treehouseState () {
    return {
      selectedEggID: ['selectedEggID'], // (key on this.state): (path to point on tree)
      eggs: ['eggs']
    }
  }

  // don't worry about shouldComponentUpdate - it's done for you and should be super-efficient

  render () {
    return (<div>
      The currently selected egg ID is: {this.state.selectedEggID}
      {this.state.eggs.map((egg, i) => {
        return <Egg eggID={i} key={i} />
      })}

    </div>)
  }
}
```

```javascript
// components/egg.js
import React from 'react'

export default class Egg extends React.Component {

  treehouseState () {
    return {
      egg: ['eggs', this.props.eggID]
    }
  }

  handleClick () {
    this.action('selectEgg', {eggID: this.props.eggID})
  }

  render () {
    return (<div onClick={this.handleClick}>
      I am a {this.state.egg.name} egg
    </div>)
  }
}
```

Then start the app

```javascript
// app.js
import React from 'react'
import treehouse from 'treehouse'
import App from './components/app'

treehouse.extendReact(React.Component.prototype)
treehouse.actions.register(require('./actions/egg_actions'))

treehouse.init({
  eggs: {
    id1: {name: 'big'},
    id2: {name: 'small'},
    id3: {name: 'bad'}
  },
  selectedEggID: null
})

React.render(<App/>, document.body)
```

### Updating the tree from inside actions
The 'tree' yielded inside actions is actually a cursor on the trunk of the tree
A cursor is a bit like a treehouse sitting on some branch in the tree, that has knowledge of a particular path, and can get/set attributes on it.
```javascript
tree.at(['some', 'path'])     // can also use an array
tree.at(['eggs', 1])          // works on arrays too
```
Cursors allow you to update the tree, and will do the necessary updates all the way up to the trunk of the tree (because we treat the tree as immutable, any change somewhere on the tree means its parent needs changing, as does its grandparent, and so on, all the way up to the trunk.
```javascript
tree.at(['some', 'path'])                     // cursor
    .set({hello: 'guys'})                     // replaces the data at the cursor path
```
### Asynchronous actions
After changing the tree asynchronously in an action, you should commit the changes manually, using the yielded function
```javascript
getUsersFromServer: (tree, payload, commit) => {  // this is a registered action
  server.getUsers().then((data) => {
    tree.at(['users']).set(data)
    commit()
  })
}
```

### Using treehouse outside of React Components
Any input into the system (message over websocket, url change, etc.) should call an action
```javascript
treehouse.actions.do('someAction', {some: 'payload'})
```
Create a "TreeView" by picking which tree paths you care about
```javascript
let treeView = treehouse.pick({
  user: ['path', 'to', 'user'],    // Specify paths, naming each with a key
  colour: ['car', 4, 'colour']
}
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
treeView.set({user: "Don", colour: "blue"})   // This updates at paths ['path', 'to', 'user'] and ['car', 4, 'colour']
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
