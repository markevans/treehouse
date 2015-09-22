export default (app) => {
  return {

    dirtyTracker () {
      return app.dirtyTracker
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
