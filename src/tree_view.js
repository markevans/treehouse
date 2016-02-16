let branchesFromPathMap = (pathMap) => {
  let branches = [], key
  for (key in pathMap) {
    branches.push(pathMap[key][0])
  }
  return branches
}

class TreeView {
  constructor (tree, dirtyTracker, pathMap) {
    this.tree = tree
    this.dirtyTracker = dirtyTracker
    this.pathMap = pathMap
    this.callback = null
    this.branches = branchesFromPathMap(this.pathMap)
  }

  cursors () {
    if (!this._cursors) {
      let cursors = {}, key
      for (key in this.pathMap) {
        let path = this.pathMap[key]
        cursors[key] = this.tree.at(path)
      }
      this._cursors = cursors
    }
    return this._cursors
  }

  watch (callback) {
    this.callback = () => { callback(this) }
    this.dirtyTracker.track(this.callback, this.branches)
  }

  unwatch () {
    this.dirtyTracker.untrack(this.callback, this.branches)
    this.callback = null
  }

  markClean () {
    this.dirtyTracker.markClean(this.callback)
    return this
  }

  get () {
    let data = {}, cursors = this.cursors(), key
    for (key in cursors) {
      data[key] = cursors[key].get()
    }
    return data
  }

  set (data) {
    let key, cursors = this.cursors()
    for (key in data) {
      cursors[key].update(data[key])
    }
  }

}

export default TreeView
