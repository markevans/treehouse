const clone = require('../utils/clone')

module.exports = {

  clone: (object, modifier) => {
    if (modifier) {
      let newObject = clone(object)
      modifier(newObject)
      return newObject
    } else {
      return clone(object)
    }
  },

  merge (object, ...args) {
    return Object.assign({}, object, ...args)
  },

  setAttribute (object, key, value) {
    return this.clone(object, (o) => {
      o[key] = value
    })
  },

  delete (object, key) {
    return this.clone(object, (o) => {
      delete o[key]
    })
  }

}
