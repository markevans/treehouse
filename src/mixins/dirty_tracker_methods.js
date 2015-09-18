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

    syncWithTree () {
      console.log("You need to define syncWithTree. In it you can make use of this.currentTreeState()", this)
    },

    registerWithDirtyTracker () {
      this.dirtyTrackerSubscription = this.dirtyTracker().watch(this.relevantBranches(), this.syncWithTree.bind(this))
    },

    markCleanWithDirtyTracker () {
      if (this.dirtyTrackerSubscription) {
        this.dirtyTrackerSubscription.markClean()
      }
    },

    unregisterWithDirtyTracker () {
      if (this.dirtyTrackerSubscription) {
        this.dirtyTrackerSubscription.cancel()
      }
    },

    watchTree () {
      this.registerWithDirtyTracker()
      this.syncWithTree()
    }

  }
}
