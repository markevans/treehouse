class Watcher {

  constructor (dirtyTracker, source, callback) {
    this.dirtyTracker = dirtyTracker
    this.source = source
    this.callback = callback
    this.dtCallback = null
  }

  start () {
    this.dtCallback = () => this.callback(this.source.pull())
    this.dirtyTracker.track(this.dtCallback, this.source.channels())
  }

  stop () {
    this.dirtyTracker.untrack(this.dtCallback, this.source.channels())
    this.dtCallback = null
  }

}

module.exports = Watcher
