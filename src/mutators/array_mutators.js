export default {

  push (array, ...args) {
    return this.clone(array, (a) => {
      a.push(...args)
    })
  },

  concat (array, ...args) {
    return array.concat(...args)
  }

}
