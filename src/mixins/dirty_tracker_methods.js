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

    markClean () {
      if (this.dirtyTrackerSubscription) {
        this.dirtyTrackerSubscription.markClean()
      }
    },

    watchTree () {
      this.dirtyTrackerSubscription = this.dirtyTracker().watch(this.relevantBranches(), () => {
        if (this.syncWithTree) {
          this.syncWithTree()
        } else {
          console.log("You need to define syncWithTree. In it you can make use of this.currentTreeState()", this)
        }
      }, {callNow: true})
    },

    unwatchTree () {
      if (this.dirtyTrackerSubscription) {
        this.dirtyTrackerSubscription.cancel()
      }
    }

  }
}
