const DirtyTracker = require('./DirtyTracker')
const Register = require('./Register')
const Tree = require('./Tree')
const TreeView = require('./TreeView')

class App {

  constructor () {
    this.tree = new Tree(this)
    this.dirtyTracker = new DirtyTracker()
    this.actions = new Register('action')
    this.filters = new Register('filter')
    this.queries = new Register('query')
  }

  init (data) {
    this.tree.init(data)
  }

  registerQueries (specs) {
    this.queries.registerMany(specs)
  }

  registerFilters (specs) {
    this.filters.registerMany(specs)
  }

  registerActions (specs) {
    this.actions.registerMany(specs)
  }

  pick (picker) {
    return new TreeView(this.tree, picker, this.dirtyTracker)
  }

  commitChanges () {
    this.tree.applyChanges(changes => {
      changes.forEach(change => {
        this.dirtyTracker.markChannelDirty(change.path[0])
      })
    })
    this.dirtyTracker.flush()
  }

  action (name, payload) {
    return this.actions.build(name, payload)
  }

}

module.exports = App
