class TreeView {
  constructor (app, tree, picker) {
    this.app = app
    this.tree = tree
    this.picker = picker
  }

  channels () {
    if (!this._channels) {
      const channels = new Set(), sources = this.sources()
      let key
      for (key in sources) {
        sources[key].channels().forEach(c => channels.add(c))
      }
      this._channels = channels
    }
    return this._channels
  }

  sources () {
    if (!this._sources) {
      this._sources = this.picker(this.tree)
    }
    return this._sources
  }

  pull () {
    let data = {}, sources = this.sources(), key
    for (key in sources) {
      data[key] = sources[key].pull()
    }
    return data
  }

  push (data) {
    let key,
        sources = this.sources()
    for (key in data) {
      if (!sources[key]) {
        throw new Error(`Can't push change to non-existent source '${key}'`)
      }
      sources[key].push(data[key])
    }
  }
}

module.exports = TreeView
