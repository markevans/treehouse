let branchesFromPathMap = (pathMap) => {
  let branches = [], key
  for (key in pathMap) {
    branches.push(pathMap[key][0])
  }
  return branches
}

class Watcher {
  constructor (tree, dirtyTracker, pathMap, callback) {
    this.tree = tree
    this.dirtyTracker = dirtyTracker
    this.pathMap = pathMap
    this.callback = callback

    this.branches = branchesFromPathMap(pathMap)
    this.multiCursor = this.tree.pick(pathMap)
    this.dirtyTracker.track(this, this.branches)
  }

  get () {
    return this.multiCursor.get()
  }

  set (data) {
    return this.multiCursor.set(data)
  }

  call () {
    this.callback.call(this, this)
    return this
  }

  isDirty () {
    return this.dirtyTracker.isDirty(this)
  }

  markClean () {
    this.dirtyTracker.markClean(this)
    return this
  }

  cancel () {
    this.dirtyTracker.untrack(this, this.branches)
  }
}

export default Watcher
