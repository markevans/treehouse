#Treehouse JS

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

  - Treehouse components inherit from React components. They:
    - declare which parts of the tree they care about
    - ensure that `this.state` includes the relevant parts picked from the tree
    - already get updated efficiently, i.e. when the part of the tree they care about changes
    - should call an action when a user interaction happens

## Basic usage (examples in ES6)

A typical small app might look like this:

Define the actions
```javascript
# actions/egg_actions.js

export default {

  init (tree) {
    tree.set({
      eggs: {
        id1: {name: 'big'},
        id2: {name: 'small'},
        id3: {name: 'bad'}
      }
    }).commit()
  }

  selectEgg (tree, {eggID}) {
    tree.set('selectedEgg', eggID).commit()
  }
}
```

Write some components
```javascript
# components/app.js
import React from 'react'
import Egg from './egg'

export default class App extends React.Component {

  // Declare which parts of the tree you care about
  stateFromTree () {
    return {
      selectedEgg: ['selectedEgg'], // (key on this.state): (path to point on tree)
      eggs: 'eggs' // paths can either be an array or a dot separated string like 'path.to.thing'
    }
  }

  // don't worry about shouldComponentUpdate - it's done for you and should be super-efficient

  render () {
    return (<div>
      The currently selected egg is: {this.state.selectedEgg}
      {this.state.eggs.map((egg, i) => {
        return <Egg eggID={i} key={i} />
      })}

    </div>)
  }
}
```

```javascript
# components/egg.js
import React from 'react'

export default class Egg extends React.Component {

  stateFromTree (props) {
    return {
      selectedEgg: 'selectedEgg',
      egg: ['eggs', props.eggID]
    }
  }

  handleClick () {
    this.action('selectEgg', {eggID: this.props.eggID})
  }

  render () {
    return (<div onClick={this.handleClick}>
      I'm a {this.state.egg.get('name')} egg
    </div>)    // remember objects are immutable.js maps, hence ".get('name')"
  }
}
```

Then start the app and call the 'init' action.

```javascript
# app.js
import React from 'react'
import treehouse from 'treehouse'
import App from './components/app'

treehouse.addComponentMethods(React.Component.prototype)
treehouse.actions.register(require('./actions/egg_actions'))
treehouse.actions.do('init')
React.render(<App/>, document.body)
```
