const Cursor = require('./cursor')
const arrayMutators = require('./mutators/array_mutators')
const objectMutators = require('./mutators/object_mutators')
const Queries = require('./queries')
const Filters = require('./filters')
const TreeView = require('./tree_view')
const Actions = require('./actions')
const DirtyTracker = require('./dirty_tracker')

class App {

  constructor (data={}) {
    this._tree = data
    this.dirtyTracker = new DirtyTracker()
    this.actions = new Actions(this)
    this._mutators = {}
    this.queries = new Queries(this)
    this.filters = new Filters(this)

    this.registerMutators(arrayMutators)
    this.registerMutators(objectMutators)
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

  // Mutators

  registerMutators (mutators) {
    Object.assign(this._mutators, mutators)
  }

  mutators () {
    return this._mutators
  }

  // Filters

  registerFilters (filters) {
    this.filters.register(filters)
  }

  buildFilteredStream (name, source, args) {
    return this.filters.buildStream(name, source, args)
  }

  // TreeView

  pick (callback) {
    return new TreeView(this, callback)
  }

  // Actions

  registerActions (actions) {
    this.actions.register(actions)
  }

  action (name, payload) {
    this.actions.do(name, payload)
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
