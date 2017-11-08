const Bundle = require('./Bundle')

class TreeView {

  constructor (tree, picker, dirtyTracker) {
    this.tree = tree
    this.picker = picker
    this.dirtyTracker = dirtyTracker
    this.watchCallback = null
  }

  source () {
    if (!this._source) {
      const src = this.picker(this.tree)
      this._source = (src.constructor === Object ? new Bundle(src) : src)
    }
    return this._source
  }

  watch (callback) {
    this.watchCallback = () => callback(this.source().pull())
    this.dirtyTracker.track(this.watchCallback, this.source().channels())
  }

  unwatch () {
    this.dirtyTracker.untrack(this.watchCallback, this.source().channels())
    this.watchCallback = null
  }

  markClean () {
    this.dirtyTracker.markClean(this.watchCallback)
  }

  push (data) {
    this.source().push(data)
  }

  pull () {
    return this.source().pull()
  }

  channels () {
    return this.source().channels()
  }

}

TreeView.prototype.get = TreeView.prototype.pull

module.exports = TreeView
