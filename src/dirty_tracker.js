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

  register (component, branches) {
    this.all.add(component)
    branches.forEach(b => this.branch(b).add(component))
  }

  unregister (component, branches) {
    this.all.delete(component)
    this.dirty.delete(component)
    branches.forEach(b => this.branch(b).delete(component))
  }

  markBranchDirty (branch) {
    let components = branch ? this.branch(branch) : this.all
    components.forEach(c => this.dirty.add(c))
  }

  markComponentClean (component) {
    this.dirty.delete(component)
  }

  eachDirtyComponent (callback) {
    this.dirty.forEach(callback)
  }
}

export default DirtyTracker
