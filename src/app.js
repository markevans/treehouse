import Tree from './tree'
import Actions from './actions'
import DirtyTracker from './dirty_tracker'
import ComponentBaseClass from './component'


class App {

  constructor () {
    let app = this
    this.Component = class Component extends ComponentBaseClass {
      app () {
        return app
      }
    }

    this.tree = new Tree()

    this.actions = new Actions()

    this.dirtyTracker = new DirtyTracker()

    this.tree.onChange(({path}) => {
      app.dirtyTracker.markBranchDirty(path[0])
    })
    this.tree.onCommit(() => {
      app.dirtyTracker.eachDirtyComponent(c => c.syncWithTree())
    })

  }

}

export default App
