export default class DirtyTracker {
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

  track (callback, channel) {
    this.all.add(callback)
    this.channel(channel).add(callback)
  }

  untrack (callback, channel) {
    this.all.delete(callback)
    this.dirty.delete(callback)
    this.channel(channel).delete(callback)
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

  flush () {
    this.dirty.forEach((callback) => {
      callback()
      this.markClean(callback)
    })
  }
}
