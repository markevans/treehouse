class MultiCursor {
  constructor (tree, pathMap) {
    this.tree = tree
    this.pathMap = pathMap
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

  get () {
    let data = {}, cursors = this.cursors(), key
    for (key in cursors) {
      data[key] = cursors[key].get()
    }
    return data
  }

}

export default MultiCursor
