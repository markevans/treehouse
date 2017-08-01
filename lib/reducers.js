module.exports = {

  // Object
  remove (object, key) {
    let newObject = Object.assign({}, object)
    delete newObject[key]
    return newObject
  },

  merge (object, ...args) {
    return Object.assign({}, object, ...args)
  },

  setAttribute (object, key, value) {
    let attrs = {}
    attrs[key] = value
    return Object.assign(attrs, object)
  },

  // Array
  push (array, ...args) {
    let newArray = array.slice()
    newArray.push(...args)
    return newArray
  }

}
