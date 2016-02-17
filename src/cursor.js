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
    this.bough = this.path[0]
  }

  get () {
    return getIn(this.app.tree(), this.path)
  }

  set (value) {
    let data = setIn(this.app.tree(), this.path, value)
    this.app.setTree(data, this.bough)
  }
}

export default Cursor
