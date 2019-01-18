import shallowEquals from './utils/shallowEquals'
import Db from './Db'
import FilteredPipe from './FilteredPipe'
import { BunchOfData, Data, Filterable, FilterSpec, Path, WatchablePipe, QuerySpec, WatchCallback } from './types'

const normalizeSpec = (spec: QuerySpec | Path): QuerySpec =>
  Array.isArray(spec)
    ?
      {
        state: db => db.at(spec),
        get: v => v,
        set: v => v,
      }
    :
      spec

export default class Query implements WatchablePipe<Data>, Filterable {

  args: any
  db: Db
  spec: QuerySpec
  result: Data
  state: Data
  dbView: WatchablePipe<Data> | WatchablePipe<BunchOfData>

  constructor (db: Db, spec: QuerySpec | Path, args: any) {
    this.db = db
    this.spec = normalizeSpec(spec)
    this.args = args
    this.dbView = this.db.view(this.spec.state, this.args)
  }

  pull (): Data {
    let currentState = this.dbView.pull()
    if (this.state === null || !shallowEquals(this.state, currentState)) {
      this.result = this.spec.get(currentState, this.args)
      this.state = currentState
    }
    return this.result
  }

  push (value: any): void {
    if (!this.spec.set) {
      throw new Error(`Query doesn't implement set`)
    }

    const changes = this.spec.set(value, this.dbView.pull(), this.args) as any

    this.dbView.push(changes)
  }

  watch (callback: WatchCallback): void {
    this.dbView.watch(callback)
  }

  unwatch (): void {
    this.dbView.unwatch()
  }

  filter (spec: FilterSpec, args: any): WatchablePipe<Data> {
    return new FilteredPipe(this, spec, args)
  }
}
