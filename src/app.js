require('./polyfill')

import React from 'react'
global.React = React

import App from './components/app'
import State from './state'
import Actions from './actions'
import DirtyTracker from './dirty_tracker'
import component from './components/component'

let state = new State()
component.setAppState(state)
global.state = state

let actions = new Actions()
actions.setState(state)
actions.registerActions(require('./actions/shared'))
component.setActions(actions)
global.actions = actions

let dirtyTracker = new DirtyTracker()
component.setDirtyTracker(dirtyTracker)
state.onChange(({path}) => {
  dirtyTracker.markBranchDirty(path[0])
})
state.onCommit(() => {
  let nada = {}
  dirtyTracker.eachDirtyComponent( c => c.setState(nada) )
  dirtyTracker.clear()
})
global.dirtyTracker = dirtyTracker

actions.call('init')
React.render(<App/>, document.body)
