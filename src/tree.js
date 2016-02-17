import i from './immutable_adapter'
import Platform from './platform'
import TreeView from './tree_view'
import EventEmitter from './event_emitter'

class Tree {

  constructor () {
    this.data = i.fromJS({})
    this.rootCursor = this.at()
    this.eventEmitter = new EventEmitter()
  }

  getData () {
    return this.data
  }

  setData (data, changePath) {
    this.data = data
    this.eventEmitter.emit('change', {path: changePath})
  }

  at (...path) {
    return new Platform(this, path)
  }

  get (...path) {
    return this.at(...path).get()
  }

  p () {
    console.log(JSON.stringify(this.data))
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

  toJSON () {
    return this.data.toJSON()
  }

}

export default Tree
