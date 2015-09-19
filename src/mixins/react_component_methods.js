import shallowCompare from '../shallow_compare'

export default {

  syncWithTree () {
    this.setState(this.currentTreeState())
  },

  componentWillMount () {
    this.watchTree()
  },

  componentWillReceiveProps () {
    this.syncWithTree()
  },

  shouldComponentUpdate (nextProps, nextState) {
    return !shallowCompare(this.state, nextState) || !shallowCompare(this.props, nextProps)
  },

  componentDidUpdate () {
    this.markClean()
  },

  componentWillUnmount () {
    this.unwatchTree()
  }

}
