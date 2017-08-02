class TreeView {
  constructor (app, streams) {
    this.app = app
    this.dirtyTracker = app.dirtyTracker
    this._streams = streams
    this.callback = null
  }

  channels () {
    if (!this._channels) {
      let channels = [], streams = this.streams(), key
      for (key in streams) {
        streams[key].channels().forEach((c) => {
          if (channels.indexOf(c) == -1) { channels.push(c) }
        })
      }
      this._channels = channels
    }
    return this._channels
  }

  streams () {
    if (!this._resolvedStreams) {
      this._resolvedStreams = typeof(this._streams) == 'function' ? this._streams(this.app) : (this._streams || {})
    }
    return this._resolvedStreams
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
    let data = {}, streams = this.streams(), key
    for (key in streams) {
      data[key] = streams[key].get()
    }
    return data
  }

  set (data) {
    let key, streams = this.streams()
    for (key in data) {
      streams[key].set(data[key])
    }
  }

}

module.exports = TreeView
