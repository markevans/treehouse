import shallowEquals from './utils/shallowEquals'
import Db from './Db'
import FilteredPipe from './FilteredPipe'
import { BunchOfData, Data, Filterable, FilterSpec, Pipe, QuerySpec, WatchCallback } from './types'

// const normalizeSpec = spec =>
//   Array.isArray(spec)
//     ?
//       {
//         state: db => db.at(spec),
//         get: v => v,
//         set: v => v,
//       }
//     :
//       spec

export default class Query implements Pipe<Data>, Filterable {

  args: any
  db: Db
  spec: QuerySpec
  result: Data
  state?: BunchOfData
  dbView: Pipe<BunchOfData>

  constructor (db: Db, spec: QuerySpec, args: any) {
    this.db = db
    //this.spec = normalizeSpec(spec)
    this.spec = spec
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

  push (value: Data): void {
    if (!this.spec.set) {
      throw new Error(`Query doesn't implement set`)
    }

    const changes = this.spec.set(value, this.dbView.pull(), this.args)

    this.dbView.push(changes)
  }

  watch (callback: WatchCallback): void {
    this.dbView.watch(callback)
  }

  unwatch (): void {
    this.dbView.unwatch()
  }

  filter (spec: FilterSpec, args: any): Pipe<Data> {
    return new FilteredPipe(this, spec, args)
  }
}
