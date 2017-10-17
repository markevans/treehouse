class Bundle {
  constructor (sources) {
    this.sources = sources
  }

  channels () {
    if (!this._channels) {
      const channels = new Set(), sources = this.sources
      let key
      for (key in sources) {
        sources[key].channels().forEach(c => channels.add(c))
      }
      this._channels = channels
    }
    return this._channels
  }

  pull () {
    let data = {}, sources = this.sources, key
    for (key in sources) {
      data[key] = sources[key].pull()
    }
    return data
  }

  push (data) {
    let key,
        sources = this.sources
    for (key in data) {
      if (!sources[key]) {
        throw new Error(`Can't push change to non-existent source '${key}'`)
      }
      sources[key].push(data[key])
    }
  }
}

module.exports = Bundle
