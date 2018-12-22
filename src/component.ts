import React from 'react'
import mapArrayToObject from './utils/mapArrayToObject'
import mapObject from './utils/mapObject'

export default ({
  name,
  events = [],
  handlers = {},
  render: _render_,
}) =>
  class Component extends React.PureComponent {

    static displayName = name

    constructor (props) {
      super(props)
      this.adapters = props.__adapters__
      const eventCallbacks = mapArrayToObject(events, (eventName) =>
        props[eventName] || (() => console.warn(`Prop '${eventName}' not defined`))
      )
      this.eventHandlers = mapObject(handlers, (_name, handler) =>
        typeof(handler) === 'string'
        ? () => eventCallbacks[handler]()
        : (...args) => handler(eventCallbacks, ...args)
      )
    }

    render () {
      return _render_(this.props, this.eventHandlers, this.adapters)
    }
  }
