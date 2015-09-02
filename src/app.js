import Tree from './tree'
import Actions from './actions'
import DirtyTracker from './dirty_tracker'
import ComponentBaseClass from './component'

// tree.onChange(({path}) => {
//   dirtyTracker.markBranchDirty(path[0])
// })
// tree.onCommit(() => {
//   let nada = {}
//   dirtyTracker.eachDirtyComponent( c => c.setTree(nada) )
//   dirtyTracker.clear()
// })

class App {

  constructor () {
    let app = this
    this.Component = class Component extends ComponentBaseClass {
      app () {
        return app
      }
    }
  }

  tree = new Tree()

  actions = new Actions()

  dirtyTracker = new DirtyTracker()

}

export default App
