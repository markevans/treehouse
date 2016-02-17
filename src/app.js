import DirtyTracker from './dirty_tracker'
import Actions from './actions'
import Platform from './platform'
import TreeView from './tree_view'
import reactComponentMethods from './react_component_methods'

class App {

  constructor (data={}) {
    this._tree = data
    this.dirtyTracker = new DirtyTracker()
    this.actions = new Actions(this)
  }

  extendReact (object) {
    object.treehouse = this
    Object.assign(object, reactComponentMethods)
  }

  tree () {
    return this._tree
  }

  setTree (data, boughChanged) {
    this._tree = data
    this.dirtyTracker.markBranchDirty(boughChanged)
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
