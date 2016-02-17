import Platform from './platform'
import TreeView from './tree_view'
import EventEmitter from './event_emitter'

class Tree {

  constructor (data={}) {
    this.data = data
    this.rootCursor = this.at()
    this.eventEmitter = new EventEmitter()
  }

  get () {
    return this.data
  }

  set (data, changePath) {
    this.data = data
    this.eventEmitter.emit('change', {path: changePath})
  }

  at (...path) {
    return new Platform(this, path)
  }

  commit () {
    this.eventEmitter.emit('commit')
  }

  onCommit (callback) {
    return this.eventEmitter.on('commit', callback)
  }

  onChange (callback) {
    return this.eventEmitter.on('change', callback)
  }

}

export default Tree
