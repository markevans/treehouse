import Cursor from './Cursor'
import DbView from './DbView'
import DirtyTracker from './DirtyTracker'
import Query from './Query'
import mapObject from './utils/mapObject'
import getIn from './utils/getIn'
import setIn from './utils/setIn'

export default class Db {

  constructor () {
    this.dirtyTracker = new DirtyTracker()
    this.data = null
    this.updates = []
  }

  snapshotID = 0

  init (data) {
    this.data = data
  }

  push (update) {
    this.updates.push(update)
  }

  pull () {
    return this.data;
  }

  applyUpdate = ({ path, value }) => {
    const [bough, ...subbranches] = path
    this.data[bough] = setIn(this.data[bough], subbranches, value)
    this.dirtyTracker.markChannelDirty(this.channelForPath(path))
  }

  applyUpdates () {
    const changes = this.updates.map(({path, value}) => ({
      path,
      from: getIn(this.data, path),
      to: value,
    }))
    this.updates.forEach(this.applyUpdate)
    this.updates = []
    return changes
  }

  commitUpdates () {
    const changes = this.applyUpdates()
    this.snapshotID++
    this.dirtyTracker.flush()
    return changes
  }

  watch (path, callback) {
    this.dirtyTracker.track(callback, this.channelForPath(path))
  }

  unwatch (path, callback) {
    this.dirtyTracker.untrack(callback, this.channelForPath(path))
  }

  channelForPath(path) {
    return path[0]
  }

  at (...path) {
    if (Array.isArray(path[0])) {
      path = path[0]
    }
    return new Cursor(this, path)
  }

  query (spec, args) {
    return new Query(this, spec, args)
  }

  view (picker, ...args) {
    const src = typeof(picker) === 'function'
      ? picker(this, ...args)
      : picker
    if (src.constructor === Object) {
      return new DbView(
        mapObject(src, (k, s) =>
          Array.isArray(s) ? new Cursor(this, s) : s
        )
      )
    } else if (Array.isArray(src)) {
      return new Cursor(this, src)
    } else {
      return src
    }
  }

}
