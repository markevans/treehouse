class Reducers {

  constructor (app) {
    this.app = app
    this.reducers = {}
  }

  register (reducers) {
    Object.assign(this.reducers, reducers)
  }

  find (name) {
    let reducer = this.reducers[name]
    if (!reducer) {
      throw new Error(`Can't find reducer '${name}' as it's not defined`)
    }
    return reducer
  }
}

module.exports = Reducers
