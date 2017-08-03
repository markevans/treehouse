const Actions = require('./Actions')
const Cursor = require('./Cursor')
const DirtyTracker = require('./DirtyTracker')
const Filters = require('./Filters')
const Queries = require('./Queries')
const Reducers = require('./Reducers')
const TreeView = require('./TreeView')

class App {

  constructor (data={}) {
    this._tree = data
    this.actions = new Actions(this)
    this.dirtyTracker = new DirtyTracker()
    this.filters = new Filters(this)
    this.queries = new Queries(this)
    this.reducers = new Reducers(this)
  }

  // Tree

  tree () {
    return this._tree
  }

  setTree (data, channels) {
    this._tree = data
    this.dirtyTracker.markChannelDirty(channels)
  }

  init (data) {
    this.setTree(data)
  }

  // Cursors

  trunk () {
    return (this._trunk = this._trunk || this.at([]))
  }

  at (...path) {
    if (Array.isArray(path[0])) {
      path = path[0]
    }
    return new Cursor(this, path)
  }

  // Queries

  registerQueries (queries) {
    this.queries.register(queries)
  }

  query (name, args) {
    return this.queries.build(name, args)
  }

  // Filters

  registerFilters (filters) {
    this.filters.register(filters)
  }

  buildFilteredStream (name, source, args) {
    return this.filters.buildStream(name, source, args)
  }

  // TreeView

  treeView (callback) {
    return new TreeView(this, callback)
  }

  // Actions

  registerActions (actions) {
    this.actions.register(actions)
  }

  action (name, payload) {
    return this.actions.build(name, payload)
  }

  // Reducers

  registerReducers (reducers) {
    this.reducers.register(reducers)
  }

  reducer (name) {
    return this.reducers.find(name)
  }

  // Dirty Tracker

  commit () {
    this.dirtyTracker.cleanAllDirty()
  }

  // Log

  log (message) {
    if (global.console && global.console.log) {
      global.console.log(message)
    }
  }

}

module.exports = App
