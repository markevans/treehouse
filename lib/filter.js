class Filter {

  constructor (name, spec) {
    this.name = name
    if (typeof spec == 'function' ) {
      this.forward = spec
      this.reverse = () => { throw new Error(`Filter '${this.name}' doesn't implement reverse`) }
    } else {
      this.forward = spec.forward
      this.reverse = spec.reverse
    }
  }

}

module.exports = Filter
