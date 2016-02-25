class Mutators {

  constructor (app) {
    this.mutators = {}
    this.app = app
  }

  register (mutators) {
    Object.assign(this.mutators, mutators)
  }

  call (name, data, ...args) {
    if ( this.mutators[name] ) {
      let result = this.mutators[name](data, ...args)
      if (result === undefined) {
        throw new Error(`Mutator '${name}' didn't return anything`)
      } else if (result === data) {
        throw new Error(`Mutator '${name}' returned the same object. It should not modify existing objects.`)
      }
      return result
    } else {
      throw new Error(`Mutator '${name}' not found`)
    }
  }

}

export default Mutators
