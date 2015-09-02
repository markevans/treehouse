import immutable from "immutable"

// "users.edgar" -> ['users', 'edgar']
let normalizePath = (path) => {
  let pathArray = []
  if (path.forEach) { // array
    path.forEach((p) => {
      pathArray = pathArray.concat(normalizePath(p))
    })
  } else { // string/number
    pathArray = pathArray.concat((''+path).split('.'))
  }
  return pathArray
}

class Cursor {
  constructor (tree, path=[]) {
    this.tree = tree
    this.path = normalizePath(path)
  }

  at (...path) {
    return new this.constructor(
      this.tree,
      this.path.concat(path)
    )
  }

  get (...path) {
    return this.tree.getData().getIn(normalizePath(this.path.concat(path)))
  }

  map (callback) {
    return this.get().map( (item, i) => {
      return callback(this.at(i), i)
    })
  }

  equals (other) {
    if (other.equals) {
      return other.equals(this.get())
    } else {
      return false
    }
  }

  set (...args) {
    let pathToAttr, valueArg
    if (args.length == 2) { // set(attr, value)
      pathToAttr = this.path.concat(normalizePath(args[0]))
      valueArg = args[1]
    } else { // set(value)
      pathToAttr = this.path
      valueArg = args[0]
    }

    let value
    if (typeof valueArg === 'function') {
      let currentValue = this.tree.getData().getIn(pathToAttr)
      value = valueArg(currentValue)
    } else {
      value = valueArg
    }
    if (value === undefined) {
      throw new Error("You can't call 'set' with value undefined")
    }
    value = immutable.fromJS(value) // ensure it's immutable
    this.tree.setData(this.tree.getData().updateIn(pathToAttr, () => value), pathToAttr)

    return this
  }

  commit () {
    this.tree.commit()
    return this
  }
}

export default Cursor
