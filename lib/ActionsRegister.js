const Register = require('./Register')

class ActionsRegister extends Register {

  constructor (type, updateFunction) {
    super(type)
    this.updateFunction = updateFunction
  }

  build (name, spec) {
    if (typeof(spec) === 'function') {
      return spec
    } else if (spec === null) {
      return () => {}
    } else if (typeof(spec) === 'string') {
      return payload => this.updateFunction(spec, payload)
    }
  }

}

module.exports = ActionsRegister
