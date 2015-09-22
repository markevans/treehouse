import shallowCompare from './shallow_compare'

let cursorsFromPaths = (tree, paths) => {
  let key, cursors = {}
  for (key in paths) {
    cursors[key] = tree.at(paths[key])
  }
  return cursors
}

class Facet {

  constructor (tree, paths, evaluator) {
    this.cursors = cursorsFromPaths(tree, paths)
    this.evaluator = evaluator
    this.state = {}
  }

  currentState () {
    let key, state = {}
    for (key in this.cursors) {
      state[key] = this.cursors[key].get()
    }
    return state
  }

  call () {
    let currentState = this.currentState()
    if (!shallowCompare(this.state, currentState)) {
      this.result = this.evaluator(currentState)
      this.state = currentState
    }
    return this.result
  }

}

export default Facet
