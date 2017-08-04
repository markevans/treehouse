const clone = require('./utils/clone')
const filterable = require('./mixins/filterable')

let getIn = (data, path) => {
  let i, value = data
  for(i=0; i<path.length; i++) {
    value = value[path[i]]
    if (value === undefined) {
      return undefined
    }
  }
  return value
}

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

class Cursor {
  constructor (app, path=[]) {
    this.app = app
    this.path = path
  }

  get () {
    return getIn(this.app.tree(), this.path)
  }

  set (value) {
    let currentValue = this.get()
    if (value === undefined) {
      throw new Error(`You tried to set the tree at path '${this.pathString()}' with undefined`)
    }
    if (value === currentValue && typeof value === 'object') {
      this.app.log(`You tried to set the tree at path '${this.pathString()}' with the same object. Remember the tree should be immutable`)
    }
    let data = setIn(this.app.tree(), this.path, value)
    this.app.setTree(data, this.channels())
    return this
  }

  putBack (value) {
    return {
      path: this.path,
      value: value
    }
  }

  update (reducer, ...args) {
    let currentValue = this.get()
    if (typeof reducer === 'string') {
      reducer = this.app.reducer(reducer)
    }
    this.set(reducer(currentValue, ...args))
    return this
  }

  at (...path) {
    if (Array.isArray(path[0])) {
      path = path[0]
    }
    return new this.constructor(
      this.app,
      this.path.concat(path)
    )
  }

  channels () {
    return (this._channels = this._channels || [this.path[0]])
  }

  pathString () {
    return this.path.join('/')
  }
}

Cursor.prototype.$ = Cursor.prototype.update

filterable(Cursor)

module.exports = Cursor
