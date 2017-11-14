const DirtyTracker = require('./DirtyTracker')
const EventHandler = require('./EventHandler')
const Register = require('./Register')
const Tree = require('./Tree')
const TreeView = require('./TreeView')

const createEventHandler = (name, scope, spec, app) => {
  const eventHandler = new EventHandler(app, name, spec)
  return eventHandler.call.bind(eventHandler)
}

class App {

  constructor () {
    this.dirtyTracker = new DirtyTracker()
    this.tree = new Tree(this)

    this.events = new Register('event')
    this.filters = new Register('filter')
    this.queries = new Register('query')

    this.createEventHandler = createEventHandler
  }

  init (data) {
    this.tree.init(data)
  }

  registerQuery (name, spec) {
    this.queries.register(name, spec)
  }

  registerQueries (specs) {
    this.queries.registerMany(specs)
  }

  registerFilter (name, spec) {
    this.filters.register(name, spec)
  }

  registerFilters (specs) {
    this.filters.registerMany(specs)
  }

  registerEvent (name, spec) {
    this.events.register(name, spec)
  }

  registerEvents (specs) {
    this.events.registerMany(specs)
  }

  decorateEvent (decorator) {
    const previousCreateEventHandler = this.createEventHandler
    this.createEventHandler = (name, scope, spec, app) => {
      const handler = previousCreateEventHandler(name, scope, spec, app)
      return payload => decorator(handler, payload, { name, spec, app, scope })
    }
  }

  event (name, scope) {
    const spec = this.events.find(name)
    return this.createEventHandler(name, scope, spec, this)
  }

  pick (picker) {
    return new TreeView(this.tree, picker, this.dirtyTracker)
  }

  commitChanges () {
    this.tree.applyChanges()
    this.dirtyTracker.flush()
  }

}

module.exports = App
