import filterable from './mixins/filterable'

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

let clone = (object) => {
  if (Array.isArray(object)) {
    return object.slice()
  } else {
    return Object.assign({}, object)
  }
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
    if (typeof value === 'function') {
      value = value(this)
    }
    if (value === undefined) {
      throw new Error("You tried to set a value on the tree with undefined")
    }
    let data = setIn(this.app.tree(), this.path, value)
    this.app.setTree(data, this.channels())
  }

  mutate (name, ...args) {
    this.set(this.app.mutate(name, this.get(), ...args))
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
}

filterable(Cursor)

export default Cursor
