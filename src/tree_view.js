class TreeView {
  constructor (app, pathMap) {
    this.app = app
    this.dirtyTracker = app.dirtyTracker
    this.pathMap = pathMap
    this.callback = null
  }

  platforms () {
    if (!this._platforms) {
      let platforms = {}, key
      for (key in this.pathMap) {
        let path = this.pathMap[key]
        platforms[key] = this.app.at(path)
      }
      this._platforms = platforms
    }
    return this._platforms
  }

  channels () {
    if (!this._channels) {
      let channels = [], platforms = this.platforms(), key
      for (key in platforms) {
        platforms[key].channels().forEach((c) => {
          if (channels.indexOf(c) == -1) { channels.push(c) }
        })
      }
      this._channels = channels
    }
    return this._channels
  }

  watch (callback) {
    this.callback = () => { callback(this) }
    this.dirtyTracker.track(this.callback, this.channels())
  }

  unwatch () {
    this.dirtyTracker.untrack(this.callback, this.channels())
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
