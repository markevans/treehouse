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

  treeCursors: {}

  appTreeCursors () {
    var key, path, cursors = {}
    for ( key in this.treeCursors ) {
      path = this.treeCursors[key]
      cursors[key] = this.tree().at(path)
    }
    return cursors
  }

  appTreeData () {
    let key, data = {}
    for (key in this.cursors) {
      data[key] = this.cursors[key].get()
    }
    return data
  }

  appTreeBranches () {
    let key, branches = []
    for (key in this.treeCursors) {
      var branch = branchFromPath(this.treeCursors[key])
      branches.push(branch)
    }
    return branches
  }

  componentWillMount () {
    this.cursors = this.appTreeCursors()
    this.currentAppTreeData = this.appTreeData()
    this.relevantAppTreeBranches = this.appTreeBranches()
    this.dirtyTracker().register(this, this.relevantAppTreeBranches)
  }

  shouldComponentUpdate (nextProps, nextTree) {
    console.log('shouldComponentUpdate', this.componentName, this._reactInternalInstance._rootNodeID)
    return !elementsAreEqual(this.tree, nextTree) ||
      !elementsAreEqual(this.props, nextProps) ||
      !elementsAreEqual(this.currentAppTreeData, this.appTreeData())
  }

  componentWillUpdate () {
    this.currentAppTreeData = this.appTreeData()
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
