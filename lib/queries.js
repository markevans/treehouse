const Query = require('./query')

class Queries {

  constructor (app) {
    this.querySpecs = {}
    this.app = app
  }

  register(specs) {
    Object.assign(this.querySpecs, specs)
  }

  build (name, args) {
    let spec = this.querySpecs[name]
    if (spec) {
      return new Query(this.app, name, spec.deps, args, spec.get, spec.set)
    } else {
      throw new Error(`Can't build query '${name}' as it's not defined`)
    }
  }

}

module.exports = Queries
