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

  track (item, branches) {
    this.all.add(item)
    branches.forEach(b => this.branch(b).add(item))
  }

  untrack (item, branches) {
    this.all.delete(item)
    this.dirty.delete(item)
    branches.forEach(b => this.branch(b).delete(item))
  }

  markBranchDirty (branch) {
    let subscriptions = branch ? this.branch(branch) : this.all
    subscriptions.forEach(s => this.dirty.add(s))
  }

  markClean (item) {
    this.dirty.delete(item)
  }

  isDirty (item) {
    return this.dirty.has(item)
  }

  cleanAllDirty () {
    this.dirty.forEach((item) => {
      item.call()
      this.markClean(item)
    })
  }
}

export default DirtyTracker
