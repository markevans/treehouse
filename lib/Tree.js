const Cursor = require('./Cursor')
const Query = require('./Query')
const clone = require('./utils/clone')

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
//
// Immutable operation; returns a new object
let setIn = (data, path, twigValue, level=0) => {
  if (path.length == 0) {
    return twigValue
  }

  let newData = clone(data),
      branch = path[level],
      value
  if (level+1 < path.length) {
    value = setIn(newData[branch], path, twigValue, level+1)
  } else {
    value = twigValue
  }
  newData[branch] = value
  return newData
}
