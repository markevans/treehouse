const FilteredPipe = require('./FilteredPipe')

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


class Cursor {
  constructor (app, tree, path=[]) {
    this.app = app
    this.tree = tree
    this.path = path
  }

  pull () {
    return getIn(this.tree.pull(), this.path)
  }

  push (value) {
    this.tree.push({path: this.path, value})
  }

  at (...path) {
    if (Array.isArray(path[0])) {
      path = path[0]
    }
    return new this.constructor(
      this.app,
      this.tree,
      this.path.concat(path)
    )
  }

  filter (name, args) {
    return new FilteredPipe(this.app, this, name, this.app.filters.find(name), args)
  }

  channels () {
    if (!this._channels) {
      this._channels = new Set(this.path.slice(0,1))
    }
    return this._channels
  }
}

module.exports = Cursor
