const shallowCompare = require('./utils/shallowCompare')
const FilteredPipe = require('./FilteredPipe')

class Query {

  constructor (app, name, spec, args) {
    this.name = name
    this.app = app
    this.spec = spec
    this.args = args

    this.state = null
    this.result = null
  }

  treeView () {
    if (!this._treeView) {
      this._treeView = this.app.pick(this.spec.pick)
    }
    return this._treeView
  }

  pull () {
    let currentState = this.treeView().pull()
    if (!this.state || !shallowCompare(this.state, currentState)) {
      this.result = this.spec.get(currentState, this.args)
      this.state = currentState
    }
    return this.result
  }

  push (value) {
    if (!this.spec.set) {
      throw new Error(`Query '${this.name}' doesn't implement set`)
    }

    const treeView = this.treeView(),
      changes = this.spec.set(value, treeView.pull(), this.args)

    treeView.push(changes)
  }

  channels () {
    return this.treeView.channels()
  }

  filter (name, args) {
    return new FilteredPipe(this.app, this, this.app.filters.find(name), args)
  }
}

module.exports = Query
