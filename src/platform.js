import Cursor from './cursor'

class Platform {
  constructor (app, path=[]) {
    this.app = app
    this.path = path
  }

  at (path) {
    return new this.constructor(
      this.app,
      this.path.concat(path)
    )
  }

  handler () {
    if (!this._handler) {
      this._handler = new Cursor(this.app, this.path)
    }
    return this._handler
  }

  get () {
    return this.handler().get()
  }

  set (value) {
    if (typeof value === 'function') {
      let currentValue = this.get()
      value = value(currentValue)
    }
    if (value === undefined) {
      throw new Error("You tried to set a value on the tree with undefined")
    }
    this.handler().set(value)
    return this
  }
}

export default Platform
