class Register {

  constructor (type) {
    this.type = type
    this.specs = {}
  }

  register (name, spec) {
    this.specs[name] = spec
  }

  registerMany (specs) {
    Object.assign(this.specs, specs)
  }

  find (name) {
    if (!this.specs.hasOwnProperty(name)) {
      throw new Error(`Can't find ${this.type} '${name}' as it hasn't been registered`)
    }
    return this.specs[name]
  }
}

module.exports = Register
