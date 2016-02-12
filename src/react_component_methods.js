import shallowCompare from './shallow_compare'

export default {

  action (name, payload) {
    this.treehouse.actions.do(name, payload)
  },

  componentWillMount () {
    if (this.stateFromTree) {
      let pathMap = this.stateFromTree()
      this.treehouseWatcher = this.treehouse.watch(pathMap, (multiCursor) => {
        this.setState(multiCursor.get())
      }).call()
    }
  },

  componentWillReceiveProps () {
    this.treehouseWatcher.call()
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
