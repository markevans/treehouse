import i from './immutable_adapter'

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
    return i.getIn(this.tree.getData(), normalizePath(this.path.concat(path)))
  }

  update (value) {
    if (typeof value === 'function') {
      let currentValue = i.getIn(this.tree.getData(), this.path)
      value = value(currentValue)
    }
    if (value === undefined) {
      throw new Error("You tried to set a value on the tree with undefined")
    }
    value = i.fromJS(value) // ensure it's immutable
    this.tree.setData(i.updateIn(this.tree.getData(), this.path, () => value), this.path)

    return this
  }

  set (path, value) {
    return this.at(path).update(value)
  }

  merge (object) {
    return this.update(obj => i.merge(obj, object))
  }

  commit () {
    this.tree.commit()
    return this
  }
}

export default Cursor
