export default {

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
