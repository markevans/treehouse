import Query from './query'

let pathToKey = (path) => {
  return path.join('/')
}

class Queries {

  constructor (app) {
    this.queries = {}
    this.app = app
  }

  register(queries) {
    queries.forEach((spec) => {
      this.queries[pathToKey(spec.path)] = new Query(this.app, spec.deps, spec.get)
    })
  }

  find (path) {
    return this.queries[pathToKey(path)]
  }

}

export default Queries
