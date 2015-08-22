import React from 'react'

let state, actions, dirtyTracker

let areEqual = (var1, var2) => {
  if ( var1.equals ) {
    return var1.equals(var2)
  } else {
    return var1 == var2
  }
}

// assumes objects are the same length
let elementsAreEqual = (obj1, obj2) => {
  let key
  for ( key in obj1 ) {
    if ( !areEqual(obj1[key], obj2[key]) ) {
      return false
    }
  }
  return true
}

// "a.b.c" -> "a" or ["a", "b", "c" ] -> "a"
let branchFromPath = (path) => {
  if (typeof path === 'string') {
    path = path.split('.')
  }
  return path[0]
}

class Component extends React.Component {

  stateCursors: {}

  appStateCursors () {
    var key, path, cursors = {}
    for ( key in this.stateCursors ) {
      path = this.stateCursors[key]
      cursors[key] = state.at(path)
    }
    return cursors
  }

  appStateData () {
    let key, data = {}
    for (key in this.cursors) {
      data[key] = this.cursors[key].get()
    }
    return data
  }

  appStateBranches () {
    let key, branches = []
    for (key in this.stateCursors) {
      var branch = branchFromPath(this.stateCursors[key])
      branches.push(branch)
    }
    return branches
  }

  componentWillMount () {
    this.cursors = this.appStateCursors()
    this.currentAppStateData = this.appStateData()
    this.relevantAppStateBranches = this.appStateBranches()
    dirtyTracker.register(this, this.relevantAppStateBranches)
  }

  shouldComponentUpdate (nextProps, nextState) {
    console.log('shouldComponentUpdate', this.componentName, this._reactInternalInstance._rootNodeID)
    return !elementsAreEqual(this.state, nextState) ||
      !elementsAreEqual(this.props, nextProps) ||
      !elementsAreEqual(this.currentAppStateData, this.appStateData())
  }

  componentWillUpdate () {
    this.currentAppStateData = this.appStateData()
    console.log('render', this.componentName, this._reactInternalInstance._rootNodeID)
  }

  componentDidUpdate () {
    dirtyTracker.markComponentClean(this)
  }

  componentWillUnmount () {
    dirtyTracker.unregister(this, this.relevantAppStateBranches)
  }

  //--------------------------------------------------

  action (name, payload) {
    actions.call(name, payload)
  }

}

Component.setAppState = (s) => { state = s }
Component.setActions = (a) => { actions = a }
Component.setDirtyTracker = (d) => { dirtyTracker = d }

export default Component
