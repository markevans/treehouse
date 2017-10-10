class Register {

  constructor (type) {
    this.type = type
    this.specs = {}
  }

  registerMany (specs) {
    Object.assign(this.specs, specs)
  }

  find (name) {
    const spec = this.specs[name]
    if (!spec) {
      throw new Error(`Can't find ${this.type} '${name}' as it hasn't been registered`)
    }
    return spec
  }
}

module.exports = Register
