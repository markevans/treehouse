import * as React from 'react'

export type EventName = string
export type EventPayload = any
export interface Dispatch {
 (name: EventName, payload: EventPayload): void
}

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
  watch: (callback: WatchCallback) => void,
  unwatch: () => void,
}

export interface Filterable {
  filter: (spec: FilterSpec, args: any) => Pipe<Data>
}

export interface StatePicker {
  (db: Queryable, ...args: Array<any>): BunchOfPipes
}

export type BunchOfData = { [name: string]: Data }
export type BunchOfPipes = { [name: string]: Pipe<Data> }

export interface AdapterScope { [key: string] : any }
export interface AdapterSpec<TProps> {
  addToScope: (props: TProps) => AdapterScope,
  propsFromDb: StatePicker,
  events: (
    dispatch: Dispatch,
    props: TProps,
    scope: AdapterScope
  ) => { [name: string]: (arg: any) => void }
}

export type ComponentEventHandler = (
  eventCallbacks: { [name: string]: (...args: any[]) => void }
) => void

export interface ComponentSpec<TProps> {
  name: string,
  events: string[],
  handlers: { [name: string]: string | ComponentEventHandler },
  render: (
    props: TProps,
    eventHandlers: { [name: string]: (...args: any[]) => void },
    adapters: { [name: string]: React.Component },
  ) => React.ReactNode,
}

export interface EventSpec {
  state: StatePicker,
  action: (payload: EventPayload, dispatch: Dispatch, state: BunchOfData) => any,
  update: (data: BunchOfData, payload: EventPayload) => BunchOfData
}

export interface EventSpecs {
  defaults: EventSpec,
  events: { [eventName: string]: EventSpec }
}

export interface QuerySpec {
  state: StatePicker,
  get: (state: BunchOfData, args: any) => Data,
  set?: (value: Data, state: BunchOfData, args: any) => BunchOfData,
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

export type RegisterEventCallback = (name: EventName, spec: EventSpec) => void

export type WatchCallback = () => void

export interface Middleware {
  (next: Dispatch, app: any, args: any):
    (eventName: EventName, payload: EventPayload, eventSpec: EventSpec) => any
}

export interface Plugin {
  (app: any, args: any): any
}
