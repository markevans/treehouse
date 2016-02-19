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
      this._handler = this.app.facade(this.path) || new Cursor(this.app, this.path)
    }
    return this._handler
  }

  get () {
    return this.handler().get()
  }

  set (value) {
    if (typeof value === 'function') {
      value = value(this)
    }
    if (value === undefined) {
      throw new Error("You tried to set a value on the tree with undefined")
    }
    this.handler().set(value)
    return this
  }

  mutate (name, ...args) {
    this.set(this.app.mutate(name, this.get(), ...args))
    return this
  }

  channels () {
    return this.handler().channels()
  }
}

export default Platform
