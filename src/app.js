import Tree from './tree'
import DirtyTracker from './dirty_tracker'
import Actions from './actions'
import TreeView from './tree_view'

import reactComponentMethods from './react_component_methods'

class App {

  constructor () {
    this.tree = new Tree()
    this.dirtyTracker = new DirtyTracker()
    this.actions = new Actions(this.tree)

    this.tree.onChange(({path}) => {
      this.dirtyTracker.markBranchDirty(path[0])
    })
    this.tree.onCommit(() => {
      this.dirtyTracker.cleanAllDirty()
    })
  }

  pick (pathMap) {
    return new TreeView(this.tree, this.dirtyTracker, pathMap)
  }

  extendReact (object) {
    object.treehouse = this
    Object.assign(object, reactComponentMethods)
  }

}

export default App
