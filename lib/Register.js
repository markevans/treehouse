class Register {

  constructor (type) {
    this.type = type
    this.specs = {}
    this.items = {}
  }

  register (name, spec) {
    this.specs[name] = spec
    this.items[name] = this.build(name, spec)
  }

  registerMany (specs) {
    let name
    for (name in specs) {
      this.register(name, specs[name])
    }
  }

  // Can be overridden
  build (name, spec) {
    return spec // Default to just returning the registered spec
  }

  find (name) {
    if (!this.specs.hasOwnProperty(name)) {
      throw new Error(`Can't find ${this.type} '${name}' as it hasn't been registered`)
    }
    return this.items[name]
  }

  findSpec (name) {
    return this.specs[name]
  }

}

module.exports = Register
