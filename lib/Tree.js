const Cursor = require('./Cursor')
const Query = require('./Query')
const setIn = require('./utils/setIn')

class Tree {

  constructor (app) {
    this.app = app
    this.dirtyTracker = app.dirtyTracker
    this.data = null
    this._changes = []
    this.applyChange = this.applyChange.bind(this)
  }

  init (data) {
    this.data = data
  }

  push (change) {
    this._changes.push(change)
    if (change.channels) {
      change.channels.forEach(c => this.dirtyTracker.markChannelDirty(c))
    }
  }

  pull () {
    return this.data;
  }

  changes () {
    return this._changes
  }

  applyChanges () {
    this._changes.forEach(this.applyChange)
    this._changes = []
  }

  applyChange (change) {
    this.data = setIn(this.data, change.path, change.value)
  }

  at (...path) {
    if (Array.isArray(path[0])) {
      path = path[0]
    }
    return new Cursor(this.app, path)
  }

  query (name, args) {
    return new Query(this.app, name, this.app.queries.find(name), args)
  }

}

module.exports = Tree
