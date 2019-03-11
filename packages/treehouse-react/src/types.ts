import * as React from 'react'

type StatePicker = import('treehouse').StatePicker
type Dispatch = import('treehouse').Dispatch

export interface AdapterLookup { [name: string]: React.ComponentType<any> }

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
