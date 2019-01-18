export type EventName = string
export type EventPayload = any
export type Dispatch = (name: EventName, payload: EventPayload) => void

export type Channel = string

export interface Queryable {
  at: (path: Path) => Pipe<Data>,
  query: (querySpec: QuerySpec, args: any) => Pipe<Data>
}

export type Path = Array<string>
export interface Obj { [key: string] : any }

export type DataLeaf = boolean | string | number | undefined | null
export interface DataCollection { [key: string]: Data }
export type Data = DataLeaf | DataCollection

export interface Pipe<T> {
  pull: () => T,
  push: (data: T) => void,
}

export interface Watchable {
  watch: (callback: WatchCallback) => void,
  unwatch: () => void,
}

export interface WatchablePipe<T> extends Pipe<T>, Watchable {}

export interface Filterable {
  filter: (spec: FilterSpec, args: any) => Pipe<Data>
}

export interface StatePicker {
  (db: Queryable, ...args: Array<any>): BunchOfPipes | Pipe<Data>
}

export type BunchOfData = { [name: string]: Data }
export type BunchOfPipes = { [name: string]: Pipe<Data> }

export interface EventSpec {
  state: StatePicker,
  action: (payload: EventPayload, dispatch: Dispatch, state: Data) => any,
  update: (data: Data, payload: EventPayload) => Data,
}

export interface QuerySpec {
  state: StatePicker,
  get: (data: any, args: any) => Data,
  set?: (value: Data, data: any, args: any) => Data,
}

export interface FilterSpec {
  filter: (data: Data, args: any) => Data,
  unfilter?: (data: Data, args: any) => Data,
}

export type DbChange = {
  path: Path,
  from: Data,
  to: Data,
}
export type DbUpdate = {
  path: Path,
  value: Data,
}

export type WatchCallback = () => void
