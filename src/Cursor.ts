import FilteredPipe from './FilteredPipe'
import getIn from './utils/getIn'

export default class Cursor {
  constructor (db, path) {
    this.db = db
    this.path = path
    this.watchCallback = null
  }

  pull () {
    return getIn(this.db.pull(), this.path)
  }

  push (value) {
    this.db.push({ path: this.path, value })
  }

  watch (callback) {
    this.unwatch()
    this.watchCallback = callback
    this.db.watch(this.path, this.watchCallback)
  }

  unwatch () {
    this.db.unwatch(this.path, this.watchCallback)
    this.watchCallback = null
  }

  filter (spec, args) {
    return new FilteredPipe(this, spec, args)
  }
}
