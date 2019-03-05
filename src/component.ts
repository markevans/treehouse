import * as React from 'react'
import { ComponentSpec } from './types'
import mapArrayToObject from './utils/mapArrayToObject'
import mapObject from './utils/mapObject'

interface PropsWithAdapters {
  __adapters__: any,
  [key: string]: any
}

export default <TProps>({
  name,
  events = [],
  handlers = {},
  render: _render_,
}: ComponentSpec<TProps>) =>
  class Component extends React.PureComponent<TProps & PropsWithAdapters> {

    static displayName = name

    eventHandlers: { [name: string]: (...args: any[]) => void }

    constructor (props: TProps & PropsWithAdapters) {
      super(props)
      const eventCallbacks = mapArrayToObject(events, (eventName) =>
        props[eventName] || (() => {/*console.warn(`Prop '${eventName}' not defined`)*/})
      )
      this.eventHandlers = mapObject(handlers, (_name, handler) =>
        typeof(handler) === 'string'
        ? () => eventCallbacks[handler]()
        : (...args: any[]) => handler(eventCallbacks, ...args)
      )
    }

    render () {
      return _render_(this.props, this.eventHandlers, this.props.__adapters__)
    }
  }
