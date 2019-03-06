import { WatchCallback } from './types'

export default class DirtyTracker {

  all: Set<WatchCallback>
  channels: { [name: string]: Set<WatchCallback> }
  dirty: Set<WatchCallback>

  constructor () {
    this.all = new Set()
    this.channels = {}
    this.dirty = new Set()
  }

  channel (name: string) {
    if (!this.channels[name]) {
      this.channels[name] = new Set()
    }
    return this.channels[name]
  }

  track (callback: WatchCallback, channel: string) {
    this.all.add(callback)
    this.channel(channel).add(callback)
  }

  untrack (callback: WatchCallback, channel: string) {
    this.all.delete(callback)
    this.dirty.delete(callback)
    this.channel(channel).delete(callback)
  }

  markChannelDirty (channel: string) {
    let subscriptions = channel ? this.channel(channel) : this.all
    subscriptions.forEach((s: WatchCallback) => this.dirty.add(s))
  }

  markClean (callback: WatchCallback) {
    this.dirty.delete(callback)
  }

  isDirty (callback: WatchCallback) {
    return this.dirty.has(callback)
  }

  flush () {
    this.dirty.forEach((callback: WatchCallback) => {
      callback()
      this.markClean(callback)
    })
  }
}
