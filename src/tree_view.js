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

  platforms () {
    if (!this._platforms) {
      let platforms = {}, key
      for (key in this.pathMap) {
        let path = this.pathMap[key]
        platforms[key] = new Platform(path)
      }
      this._platforms = platforms
    }
    return this._platforms
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
    let data = {}, platforms = this.platforms(), key
    for (key in platforms) {
      data[key] = platforms[key].get()
    }
    return data
  }

  set (data) {
    let key, platforms = this.platforms()
    for (key in data) {
      platforms[key].set(data[key])
    }
  }

  setter (data) {
    return () => this.set(data)
  }

}

export default TreeView
