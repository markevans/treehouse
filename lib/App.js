const DirtyTracker = require('./DirtyTracker')
const Register = require('./Register')
const ActionsRegister = require('./ActionsRegister')
const Tree = require('./Tree')
const TreeView = require('./TreeView')

class App {

  constructor () {
    this.dirtyTracker = new DirtyTracker()
    this.tree = new Tree(this)

    this.boundUpdate = this.update.bind(this)
    this.boundGetState = this.getState.bind(this)

    this.actions = new ActionsRegister('action', this.boundUpdate)
    this.updates = new Register('update')
    this.filters = new Register('filter')
    this.queries = new Register('query')

    this.actionHandler = (name, payload) => {
      this.actions.find(name)(payload, this.boundUpdate, this.boundGetState)
    }
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
    const previousActionHandler = this.actionHandler
    this.actionHandler = (name, payload) => {
      decorator(previousActionHandler, name, payload)
    }
  }

  action (name, payload) {
    this.actionHandler(name, payload)
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
