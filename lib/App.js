const DirtyTracker = require('./DirtyTracker')
const EventHandler = require('./EventHandler')
const Register = require('./Register')
const Tree = require('./Tree')
const TreeView = require('./TreeView')

class App {

  constructor () {
    this.dirtyTracker = new DirtyTracker()
    this.tree = new Tree(this)

    this.events = new Register('event')
    this.filters = new Register('filter')
    this.queries = new Register('query')
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

  event (name) {
    const eventHandler = new EventHandler(this, name, this.events.find(name))
    return payload => eventHandler.call(payload)
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
