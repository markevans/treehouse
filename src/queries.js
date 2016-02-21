import Query from './query'

class Queries {

  constructor (app) {
    this.queries = {}
    this.app = app
  }

  register(queries) {
    let key, spec
    for (key in queries) {
      spec = queries[key]
      this.queries[key] = new Query(this.app, spec.deps, spec.get)
    }
  }

  find (name) {
    return this.queries[name]
  }

}

export default Queries
