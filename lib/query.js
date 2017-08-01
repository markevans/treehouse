const shallowCompare = require('./utils/shallow_compare')
const filterable = require('./mixins/filterable')

class Query {

  constructor (app, name, getDependencies, args, getter, setter) {
    this.name = name
    this.app = app
    this.treeView = app.pick(getDependencies || {})
    this.args = args
    this.getter = getter
    this.setter = setter
    this.state = null
  }

  get () {
    let currentState = this.treeView.get()
    if (!this.state || !shallowCompare(this.state, currentState)) {
      this.result = this.getter(currentState, this.args)
      this.state = currentState
    }
    return this.result
  }

  set (value) {
    if (this.setter) {
      this.setter(value, this.treeView.streams(), this.args)
    } else {
      throw new Error(`Query '${this.name}' doesn't implement set`)
    }
  }

  channels () {
    return this.treeView.channels()
  }
}

filterable(Query)

module.exports = Query