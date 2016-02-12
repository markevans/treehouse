import Tree from './tree'
import Facets from './facets'
import DirtyTracker from './dirty_tracker'
import Actions from './actions'
import Watcher from './watcher'

import reactComponentMethods from './react_component_methods'

class App {

  constructor () {
    this.tree = new Tree()
    this.facets = new Facets(this.tree)

    this.dirtyTracker = new DirtyTracker()

    this.tree.onChange(({path}) => {
      this.dirtyTracker.markBranchDirty(path[0])
    })
    this.tree.onCommit(() => {
      this.dirtyTracker.cleanAllDirty()
    })

    this.actions = new Actions(this.tree)
  }

  watch (pathMap, callback) {
    return new Watcher(this.tree, this.dirtyTracker, pathMap, callback)
  }

  extendReact (object) {
    object.treehouse = this
    Object.assign(object, reactComponentMethods)
  }

}

export default App
