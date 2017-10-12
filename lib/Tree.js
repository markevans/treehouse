const Cursor = require('./Cursor')
const Query = require('./Query')
const setIn = require('./utils/setIn')

class Tree {

  constructor (app) {
    this.app = app
    this.data = null
    this._changes = []
  }

  init (data) {
    this.data = data
  }

  push (change) {
    this._changes.push(change)
  }

  pull () {
    return this.data;
  }

  changes () {
    return this._changes
  }

  applyChanges () {
    this._changes.forEach(change => this.applyChange(change))
    this._changes = []
  }

  applyChange (change) {
    this.data = setIn(this.data, change.path, change.value)
  }

  at (...path) {
    if (Array.isArray(path[0])) {
      path = path[0]
    }
    return new Cursor(this.app, this, path)
  }

  query (name, args) {
    return new Query(this.app, name, this.app.queries.find(name), args)
  }

}

module.exports = Tree
