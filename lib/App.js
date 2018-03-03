const DirtyTracker = require('./DirtyTracker')
const ActionHandler = require('./ActionHandler')
const Register = require('./Register')
const Tree = require('./Tree')
const TreeView = require('./TreeView')

const createActionHandler = (name, scope, spec, app) => {
  const actionHandler = new ActionHandler(app, name, spec)
  return actionHandler.call.bind(actionHandler)
}

class App {

  constructor () {
    this.dirtyTracker = new DirtyTracker()
    this.tree = new Tree(this)

    this.actions = new Register('action')
    this.filters = new Register('filter')
    this.queries = new Register('query')

    this.createActionHandler = createActionHandler
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

  registerAction (name, spec) {
    this.actions.register(name, spec)
  }

  registerActions (specs) {
    this.actions.registerMany(specs)
  }

  decorateAction (decorator) {
    const previousCreateActionHandler = this.createActionHandler
    this.createActionHandler = (name, scope, spec, app) => {
      const handler = previousCreateActionHandler(name, scope, spec, app)
      return payload => decorator(handler, payload, { name, spec, app, scope })
    }
  }

  action (name, scope) {
    const spec = this.actions.find(name)
    return this.createActionHandler(name, scope, spec, this)
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
