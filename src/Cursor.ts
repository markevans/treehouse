import Db from './Db'
import FilteredPipe from './FilteredPipe'
import { Data, Filterable, FilterSpec, Path, Pipe, WatchablePipe, WatchCallback } from './types'
import getIn from './utils/getIn'

export default class Cursor implements WatchablePipe<Data>, Filterable {

  db: Db
  path: Path
  watchCallback?: WatchCallback

  constructor (db: Db, path: Path) {
    this.db = db
    this.path = path
  }

  pull (): Data {
    return getIn(this.db.pullData(), this.path)
  }

  push (value: Data): void {
    this.db.pushUpdate({ path: this.path, value })
  }

  watch (callback: WatchCallback): void {
    this.unwatch()
    this.watchCallback = callback
    this.db.watchPath(this.path, this.watchCallback)
  }

  unwatch (): void {
    if (this.watchCallback) {
      this.db.unwatchPath(this.path, this.watchCallback)
      this.watchCallback = undefined
    }
  }

  filter (spec: FilterSpec, args: any): Pipe<Data> {
    return new FilteredPipe(this, spec, args)
  }
}
