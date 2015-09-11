import Tree from './tree'
import Actions from './actions'
import DirtyTracker from './dirty_tracker'
import componentMethods from './component_methods'


class App {

  constructor () {
    this.tree = new Tree()

    this.actions = new Actions(this.tree)

    this.dirtyTracker = new DirtyTracker()

    this.tree.onChange(({path}) => {
      this.dirtyTracker.markBranchDirty(path[0])
    })
    this.tree.onCommit(() => {
      this.dirtyTracker.eachDirtyComponent((c) => {
        c.syncWithTree()
      })
    })

  }

  addComponentMethods (object) {
    Object.assign(object, componentMethods(this))
  }

}

export default App
