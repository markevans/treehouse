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

let componentMethods = (app) => {
  return {
    actions () {
      return app.actions
    },

    dirtyTracker () {
      return app.dirtyTracker
    },

    tree () {
      return app.tree
    },

    action (name, payload) {
      this.actions().do(name, payload)
    },

    stateFromTree () {
      return {}
    },

    getCursors () {
      var key, path, cursors = {},
          paths = this.stateFromTree()
      for ( key in paths ) {
        path = paths[key]
        cursors[key] = this.tree().at(path)
      }
      return cursors
    },

    syncWithTree () {
      this.setState(resolveCursors(this.cursors))
    },

    //-------------------------------------------------

    initForTreehouse () {
      this.cursors = this.getCursors()
      this.registerWithDirtyTracker()
      this.syncWithTree()
    },

    //-------------------------------------------------

    registerWithDirtyTracker () {
      this.relevantAppTreeBranches = branchesFrom(this.cursors)
      this.dirtyTracker().register(this, this.relevantAppTreeBranches)
    },

    markCleanWithDirtyTracker () {
      this.dirtyTracker().markComponentClean(this)
    },

    unregisterWithDirtyTracker () {
      this.dirtyTracker().unregister(this, this.relevantAppTreeBranches)
    },

    //-------------------------------------------------

    componentWillMount () {
      this.initForTreehouse()
    },

    shouldComponentUpdate (nextProps, nextState) {
      return !elementsAreEqual(this.state, nextState) ||
        !elementsAreEqual(this.props, nextProps)
    },

    componentDidUpdate () {
      this.markCleanWithDirtyTracker()
    },

    componentWillUnmount () {
      this.unregisterWithDirtyTracker()
    }
  }
}

export default componentMethods
