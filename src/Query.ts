import shallowCompare from './utils/shallowCompare'
import FilteredPipe from './FilteredPipe'

const normalizeSpec = spec =>
  Array.isArray(spec)
    ?
      {
        state: db => db.at(spec),
        get: v => v,
        set: v => v,
      }
    :
      spec

export default class Query {

  constructor (db, spec, args) {
    this.db = db
    this.spec = normalizeSpec(spec)
    this.args = args

    this.state = null
    this.result = null
  }

  dbView () {
    if (!this._dbView) {
      this._dbView = this.db.view(this.spec.state, this.args)
    }
    return this._dbView
  }

  pull () {
    let currentState = this.dbView().pull()
    if (!this.state || !shallowCompare(this.state, currentState)) {
      this.result = this.spec.get(currentState, this.args)
      this.state = currentState
    }
    return this.result
  }

  push (value) {
    if (!this.spec.set) {
      throw new Error(`Query doesn't implement set`)
    }

    const dbView = this.dbView(),
      changes = this.spec.set(value, dbView.pull(), this.args)

    dbView.push(changes)
  }

  watch (callback) {
    this.dbView().watch(callback)
  }

  unwatch () {
    this.dbView().unwatch()
  }

  filter (spec, args) {
    return new FilteredPipe(this, spec, args)
  }
}
