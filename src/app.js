import DirtyTracker from './dirty_tracker'
import Actions from './actions'
import Mutators from './mutators'
import arrayMutators from './mutators/array_mutators'
import objectMutators from './mutators/object_mutators'
import Queries from './queries'
import Cursor from './cursor'
import TreeView from './tree_view'
import reactComponentMethods from './react_component_methods'

class App {

  constructor (data={}) {
    this._tree = data
    this.dirtyTracker = new DirtyTracker()
    this.actions = new Actions(this)
    this.mutators = new Mutators()
    this.queries = new Queries(this)

    this.registerMutators(arrayMutators)
    this.registerMutators(objectMutators)
  }

  extendReact (object) {
    object.treehouse = this
    Object.assign(object, reactComponentMethods)
  }

  registerActions (actions) {
    this.actions.register(actions)
  }

  registerMutators (mutators) {
    this.mutators.register(mutators)
  }

  mutate (name, data, ...args) {
    return this.mutators.call(name, data, ...args)
  }

  registerQueries (queries) {
    this.queries.register(queries)
  }

  query (path) {
    return this.queries.find(path)
  }

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

  trunk () {
    return (this._trunk = this._trunk || this.at([]))
  }

  at (path) {
    return new Cursor(this, path)
  }

  pick (pathMap) {
    return new TreeView(this, pathMap)
  }

  commit () {
    this.dirtyTracker.cleanAllDirty()
  }
}

export default App
