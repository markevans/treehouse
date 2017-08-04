const shallowCompare = require('./utils/shallowCompare')
const filterable = require('./mixins/filterable')

class Query {

  constructor (app, name, getDependencies, args, getter, changer) {
    this.name = name
    this.app = app
    this.treeView = app.treeView(getDependencies || {})
    this.args = args
    this.getter = getter
    this.changer = changer
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

  putBack (value) {
    if (!this.changer) {
      throw new Error(`Query '${this.name}' doesn't implement change`)
    }

    let changeObject = this.changer(value, this.treeView.get(), this.args),
        streams = this.treeView.streams(),
        changes = [],
        key
    for (key in changeObject) {
      let stream = streams[key]
      if (!stream) {
        throw new Error(`Query '${this.name}' change function returned unrecognised key '${key}'`)
      }
      changes.push(...stream.putBack(changeObject[key]))
    }
    return changes
  }

  channels () {
    return this.treeView.channels()
  }
}

filterable(Query)

module.exports = Query
