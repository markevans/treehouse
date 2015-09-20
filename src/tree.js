import immutable from 'immutable'
import Cursor from './cursor'
import EventEmitter from './event_emitter'

class Tree {

  constructor (data = {}) {
    this.data = immutable.fromJS(data)
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
