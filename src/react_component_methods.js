import shallowCompare from './shallow_compare'

export default {

  action (name, payload) {
    this.treehouse.actions.do(name, payload)
  },

  componentWillMount () {
    if (this.stateFromTree) {
      this.treehouseWatcher = this.treehouse.watch(this.stateFromTree(), (watcher) => {
        this.setState(watcher.get())
      }).call()
    }
  },

  componentWillReceiveProps () {
    if (this.treehouseWatcher) {
      this.treehouseWatcher.call()
    }
  },

  shouldComponentUpdate (nextProps, nextState) {
    return !shallowCompare(this.state, nextState) || !shallowCompare(this.props, nextProps)
  },

  componentDidUpdate () {
    if (this.treehouseWatcher) {
      this.treehouseWatcher.markClean()
    }
  },

  componentWillUnmount () {
    if (this.treehouseWatcher) {
      this.treehouseWatcher.cancel()
    }
  }

}
