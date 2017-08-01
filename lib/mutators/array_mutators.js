const objectMutators = require('./object_mutators')

module.exports = {

  push (array, ...args) {
    return objectMutators.clone(array, (a) => {
      a.push(...args)
    })
  },

  concat (array, ...args) {
    return array.concat(...args)
  }

}
