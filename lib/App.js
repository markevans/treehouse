const DirtyTracker = require('./DirtyTracker')
const Register = require('./Register')
const Tree = require('./Tree')
const TreeView = require('./TreeView')

class App {

  constructor () {
    this.tree = new Tree(this)
    this.dirtyTracker = new DirtyTracker()
    this.events = new Register('event')
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

  registerEvents (specs) {
    this.events.registerMany(specs)
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

}

module.exports = App
