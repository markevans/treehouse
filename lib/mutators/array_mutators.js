import objectMutators from './object_mutators'

export default {

  push (array, ...args) {
    return objectMutators.clone(array, (a) => {
      a.push(...args)
    })
  },

  concat (array, ...args) {
    return array.concat(...args)
  }

}
