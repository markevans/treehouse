import React from 'react'

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

let branchesFrom = (cursors) => {
  let key, branches = []
  for (key in cursors) {
    var branch = branchFromPath(cursors[key].path)
    branches.push(branch)
  }
  return branches
}

let resolveCursors = (cursors) => {
  let key, data = {}
  for (key in cursors) {
    data[key] = cursors[key].get()
  }
  return data
}

class Component extends React.Component {

  app () {
    throw new Error("Override me!")
  }

  actions () {
    return this.app().actions
  }

  dirtyTracker () {
    return this.app().dirtyTracker
  }

  tree () {
    return this.app().tree
  }

  stateFromTree () {
    return {}
  }

  getCursors () {
    var key, path, cursors = {},
        paths = this.stateFromTree()
    for ( key in paths ) {
      path = paths[key]
      cursors[key] = this.tree().at(path)
    }
    return cursors
  }

  syncWithTree () {
    this.setState(resolveCursors(this.cursors))
  }

  componentWillMount () {
    this.cursors = this.getCursors()
    this.relevantAppTreeBranches = branchesFrom(this.cursors)
    this.dirtyTracker().register(this, this.relevantAppTreeBranches)
    this.syncWithTree()
  }

  shouldComponentUpdate (nextProps, nextState) {
    console.log('shouldComponentUpdate', this.componentName, this._reactInternalInstance._rootNodeID)
    return !elementsAreEqual(this.state, nextState) ||
      !elementsAreEqual(this.props, nextProps)
  }

  componentWillUpdate () {
    console.log('render', this.componentName, this._reactInternalInstance._rootNodeID)
  }

  componentDidUpdate () {
    this.dirtyTracker().markComponentClean(this)
  }

  componentWillUnmount () {
    this.dirtyTracker().unregister(this, this.relevantAppTreeBranches)
  }

  //--------------------------------------------------

  action (name, payload) {
    this.actions().do(name, payload)
  }

}

export default Component
