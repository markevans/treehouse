let PureRenderMixin = require('react/addons').addons.PureRenderMixin

let componentMethods = (app) => {
  return {

    actions () {
      return app.actions
    },

    action (name, payload) {
      this.actions().do(name, payload)
    },

    //-------------------------------------------------

    tree () {
      return app.tree
    },

    stateFromTree () {
      return {}
    },

    cursors () {
      if (!this._cursors) {
        var key, path, cursors = {},
            paths = this.stateFromTree()
        for ( key in paths ) {
          path = paths[key]
          cursors[key] = this.tree().at(path)
        }
        this._cursors = cursors
      }
      return this._cursors
    },

    relevantBranches () {
      if (!this._relevantBranches) {
        let key, branches = [], cursors = this.cursors()
        for (key in cursors) {
          let path = cursors[key].path,
              normalizedPath = (typeof path === 'string') ? path.split('.') : path
          branches.push(normalizedPath[0])
        }
        this._relevantBranches = branches
      }
      return this._relevantBranches
    },

    currentTreeState () {
      let key, data = {}, cursors = this.cursors()
      for (key in cursors) {
        data[key] = cursors[key].get()
      }
      return data
    },

    //-------------------------------------------------

    initForTreehouse () {
      this.registerWithDirtyTracker()
      this.syncWithTree()
    },

    //-------------------------------------------------

    dirtyTracker () {
      return app.dirtyTracker
    },

    registerWithDirtyTracker () {
      this.dirtyTracker().register(this, this.relevantBranches())
    },

    markCleanWithDirtyTracker () {
      this.dirtyTracker().markComponentClean(this)
    },

    unregisterWithDirtyTracker () {
      this.dirtyTracker().unregister(this)
    },

    //-------------------------------------------------

    syncWithTree () {
      this.setState(this.currentTreeState())
    },

    componentWillMount () {
      this.initForTreehouse()
    },

    shouldComponentUpdate: PureRenderMixin.shouldComponentUpdate,

    componentDidUpdate () {
      this.markCleanWithDirtyTracker()
    },

    componentWillUnmount () {
      this.unregisterWithDirtyTracker()
    }
  }
}

export default componentMethods
