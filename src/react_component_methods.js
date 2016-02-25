import shallowCompare from './utils/shallow_compare'

export default {

  action (name, payload) {
    this.treehouse.actions.do(name, payload)
  },

  componentWillMount () {
    if (this.treehouseState) {
      this.treeView = this.treehouse.pick(this.treehouseState.bind(this))
      this.treeView.watch(this.syncWithTree.bind(this))
      this.syncWithTree()
    }
  },

  componentWillReceiveProps () {
    this.syncWithTree()
  },

  syncWithTree () {
    if (this.treeView) {
      this.setState(this.treeView.get())
    }
  },

  shouldComponentUpdate (nextProps, nextState) {
    return !shallowCompare(this.state, nextState) || !shallowCompare(this.props, nextProps)
  },

  componentDidUpdate () {
    if (this.treeView) {
      this.treeView.markClean()
    }
  },

  componentWillUnmount () {
    if (this.treeView) {
      this.treeView.unwatch()
    }
  }

}
