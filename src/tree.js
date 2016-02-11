import i from './immutable_adapter'
import Cursor from './cursor'
import MultiCursor from './multi_cursor'
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
    return new Cursor(this, path)
  }

  get (...path) {
    return this.at(...path).get()
  }

  pick (pathMap) {
    return new MultiCursor(this, pathMap)
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
