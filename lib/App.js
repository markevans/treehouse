const DirtyTracker = require('./DirtyTracker')
const Register = require('./Register')
const Tree = require('./Tree')
const TreeView = require('./TreeView')

const createActionHandler = (name, spec, app) => {
  if (typeof(spec) === 'function') {
    return payload => {
      spec(payload, app.boundUpdate, app.boundGetState)
    }
  } else if (spec === null) {
    return () => {}
  } else if (typeof(spec) === 'string') {
    return payload => app.boundUpdate(spec, payload)
  }
}

class App {

  constructor () {
    this.dirtyTracker = new DirtyTracker()
    this.tree = new Tree(this)

    this.actions = new Register('action')
    this.updates = new Register('update')
    this.filters = new Register('filter')
    this.queries = new Register('query')

    this.createActionHandler = createActionHandler

    this.boundUpdate = this.update.bind(this)
    this.boundGetState = this.getState.bind(this)
  }

  init (data) {
    this.tree.init(data)
  }

  getState () {
    return this.tree.pull()
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

  registerUpdate (name, spec) {
    this.updates.register(name, spec)
  }

  registerUpdates (specs) {
    this.updates.registerMany(specs)
  }

  decorateAction (decorator) {
    const previousCreateActionHandler = this.createActionHandler
    this.createActionHandler = (name, spec, app) => {
      const handler = previousCreateActionHandler(name, spec, app)
      return payload => decorator(handler, payload, { name, spec, app })
    }
  }

  action (name) {
    const spec = this.actions.find(name)
    return this.createActionHandler(name, spec, this)
  }

  update(name, payload) {
    const spec = this.updates.find(name)
    const treeView = this.pick(spec.pick)
    const changes = spec.update(treeView.pull(), payload)
    treeView.push(changes)
    this.commitChanges()
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
