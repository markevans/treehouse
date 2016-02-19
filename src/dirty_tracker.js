class DirtyTracker {
  constructor () {
    this.all = new Set()
    this.channels = {}
    this.dirty = new Set()
  }

  channel (name) {
    if (!this.channels[name]) {
      this.channels[name] = new Set()
    }
    return this.channels[name]
  }

  track (callback, channels) {
    this.all.add(callback)
    channels.forEach(b => this.channel(b).add(callback))
  }

  untrack (callback, channels) {
    this.all.delete(callback)
    this.dirty.delete(callback)
    channels.forEach(b => this.channel(b).delete(callback))
  }

  markChannelDirty (channel) {
    let subscriptions = channel ? this.channel(channel) : this.all
    subscriptions.forEach(s => this.dirty.add(s))
  }

  markClean (callback) {
    this.dirty.delete(callback)
  }

  isDirty (callback) {
    return this.dirty.has(callback)
  }

  cleanAllDirty () {
    this.dirty.forEach((callback) => {
      callback()
      this.markClean(callback)
    })
  }
}

export default DirtyTracker
