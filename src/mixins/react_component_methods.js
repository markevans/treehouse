import shallowCompare from '../shallow_compare'

export default {

  syncWithTree () {
    this.setState(this.currentTreeState())
  },

  componentWillMount () {
    this.watchTree()
  },

  shouldComponentUpdate (nextProps, nextState) {
    return !shallowCompare(this.state, nextState) || !shallowCompare(this.props, nextProps)
  },

  componentDidUpdate () {
    this.markCleanWithDirtyTracker()
  },

  componentWillUnmount () {
    this.unregisterWithDirtyTracker()
  }

}
