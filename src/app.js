import DirtyTracker from './dirty_tracker'
import Actions from './actions'
import Mutators from './mutators'
import arrayMutators from './mutators/array_mutators'
import objectMutators from './mutators/object_mutators'
import Platform from './platform'
import TreeView from './tree_view'
import reactComponentMethods from './react_component_methods'

class App {

  constructor (data={}) {
    this._tree = data
    this.dirtyTracker = new DirtyTracker()
    this.actions = new Actions(this)
    this.mutators = new Mutators()

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

  tree () {
    return this._tree
  }

  setTree (data, boughChanged) {
    this._tree = data
    this.dirtyTracker.markChannelDirty(boughChanged)
  }

  init (data) {
    this.setTree(data)
  }

  trunk () {
    return (this._trunk = this._trunk || this.at([]))
  }

  at (path) {
    return new Platform(this, path)
  }

  pick (pathMap) {
    return new TreeView(this, pathMap)
  }

  commit () {
    this.dirtyTracker.cleanAllDirty()
  }
}

export default App
