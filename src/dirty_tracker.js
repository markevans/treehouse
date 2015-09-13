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

  register (object, branches) {
    this.all.add(object)
    branches.forEach(b => this.branch(b).add(object))
    this.branchesEachObjectCaresAbout.set(object, branches)
  }

  unregister (object) {
    this.all.delete(object)
    this.dirty.delete(object)
    this.branchesEachObjectCaresAbout.get(object).forEach((b) => {
      this.branch(b).delete(object)
    })
    this.branchesEachObjectCaresAbout.delete(object)
  }

  markBranchDirty (branch) {
    let objects = branch ? this.branch(branch) : this.all
    objects.forEach(c => this.dirty.add(c))
  }

  markClean (object) {
    this.dirty.delete(object)
  }

  cleanAllDirty (callback) {
    this.dirty.forEach((object) => {
      callback(object)
      this.markClean(object)
    })
  }
}

export default DirtyTracker
