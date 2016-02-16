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

  track (callback, branches) {
    this.all.add(callback)
    branches.forEach(b => this.branch(b).add(callback))
  }

  untrack (callback, branches) {
    this.all.delete(callback)
    this.dirty.delete(callback)
    branches.forEach(b => this.branch(b).delete(callback))
  }

  markBranchDirty (branch) {
    let subscriptions = branch ? this.branch(branch) : this.all
    subscriptions.forEach(s => this.dirty.add(s))
  }

  markClean (callback) {
    this.dirty.delete(callback)
  }

  isDirty (callback) {
    return this.dirty.has(callback)
  }

  cleanAllDirty () {
    this.dirty.forEach((callback) => {
      callback()
      this.markClean(callback)
    })
  }
}

export default DirtyTracker
