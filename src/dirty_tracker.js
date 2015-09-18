class Subscription {
  constructor (dirtyTracker, callback) {
    this.dirtyTracker = dirtyTracker
    this.callback = callback
  }

  markClean () {
    this.dirtyTracker.markClean(this.callback)
  }

  cancel () {
    this.dirtyTracker.unwatch(this.callback)
  }
}

class DirtyTracker {
  constructor () {
    this.all = new Set()
    this.branches = {}
    this.dirty = new Set()
    this.branchesEachObjectCaresAbout = new Map()
  }

  branch (name) {
    if (!this.branches[name]) {
      this.branches[name] = new Set()
    }
    return this.branches[name]
  }

  watch (branches, callback) {
    this.all.add(callback)
    branches.forEach(b => this.branch(b).add(callback))
    this.branchesEachObjectCaresAbout.set(callback, branches)
    return new Subscription(this, callback)
  }

  unwatch (callback) {
    this.all.delete(callback)
    this.dirty.delete(callback)
    this.branchesEachObjectCaresAbout.get(callback).forEach((b) => {
      this.branch(b).delete(callback)
    })
    this.branchesEachObjectCaresAbout.delete(callback)
  }

  markBranchDirty (branch) {
    let callbacks = branch ? this.branch(branch) : this.all
    callbacks.forEach(c => this.dirty.add(c))
  }

  markClean (callback) {
    this.dirty.delete(callback)
  }

  cleanAllDirty () {
    this.dirty.forEach((callback) => {
      callback()
      this.markClean(callback)
    })
  }
}

export default DirtyTracker
