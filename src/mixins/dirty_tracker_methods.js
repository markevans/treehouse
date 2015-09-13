export default (app) => {
  return {

    dirtyTracker () {
      return app.dirtyTracker
    },

    // needs this.cursors() to work
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

    registerWithDirtyTracker () {
      this.dirtyTracker().register(this, this.relevantBranches())
    },

    markCleanWithDirtyTracker () {
      this.dirtyTracker().markComponentClean(this)
    },

    unregisterWithDirtyTracker () {
      this.dirtyTracker().unregister(this)
    }

  }
}
