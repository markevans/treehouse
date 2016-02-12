#Treehouse JS

[![Code Climate](https://codeclimate.com/github/markevans/treehouse/badges/gpa.svg)](https://codeclimate.com/github/markevans/treehouse)

[![Build Status](https://travis-ci.org/markevans/treehouse.svg?branch=master)](https://travis-ci.org/markevans/treehouse)

## Overall Flow

All wiring is done for you. There are no events to bind to - if you follow the strict pattern laid out below you should get from zero to app hero in no time!

The basic flow as as follows:

  - ALL the state about the system is kept in one state tree.
    The tree is JSON serializable, i.e. contains only objects, arrays, strings and numbers.
    Treehouse ensures that the state tree is made up of immutable data structures, using the immutable.js library.
    Check the docs at [https://facebook.github.io/immutable-js/docs](https://facebook.github.io/immutable-js/docs) to see how it works, specifically those for `List` and `Map`, as these are the only objects Treehouse is concerned with.

  - EVERY single input enters the system via the actions. An "input" includes:
    - user interaction with the DOM, e.g. a click
    - a message from a websocket
    - a timer/interval callback
    - a URL update
    - etc. etc.
    The actions simply update the state, at the relevant points on the tree, and then call "commit", which is a way of saying "I'm done, anything that cares about the changes can update yourselves now"

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

  init (tree) {
    tree.update({
      eggs: {
        id1: {name: 'big'},
        id2: {name: 'small'},
        id3: {name: 'bad'}
      },
      selectedEggID: null
    }).commit()     // commit says "I've finished", and components will update
  }

  selectEgg (tree, {eggID}) {
    tree.set('selectedEggID', eggID).commit()
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
  stateFromTree () {
    return {
      selectedEggID: ['selectedEggID'], // (key on this.state): (path to point on tree)
      eggs: 'eggs' // paths can either be an array or a dot separated string like 'path.to.thing'
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

  stateFromTree () {
    return {
      egg: ['eggs', this.props.eggID]
    }
  }

  handleClick () {
    this.action('selectEgg', {eggID: this.props.eggID})
  }

  render () {
    // remember that objects are immutable.js maps, hence "egg.get('name')"
    return (<div onClick={this.handleClick}>
      I am a {this.state.egg.get('name')} egg
    </div>)
  }
}
```

Then start the app and call the 'init' action.

```javascript
// app.js
import React from 'react'
import treehouse from 'treehouse'
import App from './components/app'

treehouse.extendReact(React.Component.prototype)
treehouse.actions.register(require('./actions/egg_actions'))
treehouse.actions.do('init')
React.render(<App/>, document.body)
```

### Updating the tree from inside actions
The 'tree' yielded inside actions is actually a cursor to the root of the tree.
A cursor is a bit like a window (or maybe... a treehouse!) looking onto the tree, that has knowledge of a particular path, and can get/set attributes on it.
```javascript
tree.at('some.path')          // cursor to tree['some']['path']
tree.at(['some', 'path'])     // can also use an array
tree.at(['eggs', 1])          // works on arrays too
```
Cursors allow you to update the tree, and will do the necessary updates all the way up to the root of the tree (as the tree is immutable, any change on the tree means its parent needs changing, as does its grandparent, and so on, all the way up to the root.
```javascript
tree.at('some.path')                          // cursor
  .update({hello: 'guys'})                    // replaces the data at the cursor path
  .update((data) => {
    return data.set('hello', 'gals')          // or use a function which yields the current value at the cursor
  })
  .set('colour', 'yellow')                    // sets an attribute
  .set('colour', (currentColour) => {
    return 'dark '+currentColour              // or use a function
  })
  .merge({new: 'stuff'})                      // merges in an object, overwriting keys that already exist
  .reverseMerge({colour: 'defaultColour'})    // merges in an object but doesn't overwrite pre-existing elements
  .commit()                                   // tell components/other objects that care that you've finished
```

### Facets
The tree should contain normalized data, hypothetically JSON serializable/deserializable.

Facets are like a "view" of the data, made up from specified parts of the tree. They can be registered globally then used inside a component.

Define (assumes that the tree looks like it does in the examples above),
```javascript
// facets/egg_facets.js
export default {

  selectedEgg: {   // name of the facet
    cursors: {     // declare the paths on the tree you care about
      id: ['selectedEggID'],
      eggs: ['eggs']
    },
    evaluate: ({eggs, id}) => {   // the specified data from the tree is yielded to evaluate
      return eggs.get(id)  // remember eggs is an immutable.js data structure
    }
  }

}
```

register,
```javascript
// app.js
treehouse.facets.register(require('./facets/egg_facets'))
```

and use in a component:
```javascript
// components/selected_egg.js
import React from 'react'

export default class SelectedEgg extends React.Component {

  // Declare which facets you care about
  stateFromFacets () {
    return {
      egg: 'selectedEgg' // (key on this.state): (registered facet name)
    }
  }

  stateFromTree () {
    // ...
  }

  render () {
    return (<div>
      The currently selected egg name is: {this.state.egg.get('name')}
      ...
    </div>)
  }
}
```

The result is internally memoized, so the evaluate function is only called if the state it cares about has changed. This makes it especially useful for expensive algorithms (e.g. sorted arrays, etc.).

### Using treehouse outside of React Components
Any input into the system (message over websocket, url change, etc.) should call an action
```javascript
treehouse.actions.do('someAction', {some: 'payload'})
```
You can watch for tree changes with
```javascript
let watcher = treehouse.watch({
  user: ['path', 'to', 'user'],    // Specify the paths you want to watch, naming each with a key
  colour: ['car', 4, 'colour']
}, (multiCursor, tree) => {
  // the callback yields a "multicursor" object, keyed in the same way, e.g.
  multiCursor.get()    // {user: 'Mark', colour: 'red'}
})
```
To unsubscribe
```javascript
watcher.cancel()
```
To call the callback immediately
```javascript
watcher.call()  // returns self
```
