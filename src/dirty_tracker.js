class Subscription {
  constructor (dirtyTracker, pathMap, callback) {
    this.dirtyTracker = dirtyTracker
    this.pathMap = pathMap
    this.callback = callback
  }

  branches () {
    if (!this._branches) {
      let branches = [], key
      for (key in this.pathMap) {
        branches.push(this.pathMap[key][0])
      }
      this._branches = branches
    }
    return this._branches
  }

  call () {
    this.callback.call()
  }

  isDirty () {
    return this.dirtyTracker.dirty.has(this)
  }

  markClean () {
    this.dirtyTracker.markClean(this)
  }

  cancel () {
    this.dirtyTracker.unwatch(this)
  }
}

class DirtyTracker {
  constructor () {
    this.all = new Set()
    this.branches = {}
    this.dirty = new Set()
  }

  branch (name) {
    if (!this.branches[name]) {
      this.branches[name] = new Set()
    }
    return this.branches[name]
  }

  watch (pathMap, callback, options) {
    let subscription = new Subscription(this, pathMap, callback)
    this.all.add(subscription)
    subscription.branches().forEach(b => this.branch(b).add(subscription))
    return subscription
  }

  unwatch (subscription) {
    this.all.delete(subscription)
    this.dirty.delete(subscription)
    subscription.branches().forEach(b => this.branch(b).delete(subscription))
  }

  markBranchDirty (branch) {
    let subscriptions = branch ? this.branch(branch) : this.all
    subscriptions.forEach(s => this.dirty.add(s))
  }

  markClean (subscription) {
    this.dirty.delete(subscription)
  }

  cleanAllDirty () {
    this.dirty.forEach((subscription) => {
      subscription.call()
      this.markClean(subscription)
    })
  }
}

export default DirtyTracker
