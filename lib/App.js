const Register = require('./Register')
const Tree = require('./Tree')
const TreeView = require('./TreeView')

class App {

  constructor () {
    this.tree = new Tree(this)
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
    return new TreeView(this, this.tree, picker)
  }

  action (name, payload) {
    return this.actions.build(name, payload)
  }

}

module.exports = App
