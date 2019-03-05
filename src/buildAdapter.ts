import * as React from 'react'
import mapObject from './utils/mapObject'
import App from './App'
import { AdapterScope, AdapterSpec, BunchOfData, Dispatch, EventPayload, Pipe } from './types'

const buildEventHandlers = <TProps>(
  events: AdapterSpec<TProps>['events'],
  dispatch: Dispatch,
  props: TProps,
  scope: AdapterScope
) => {
  if (!events) return null
  const eventHandlers = typeof(events) === 'function'
    ? events(dispatch, props, scope)
    : events
  return mapObject(eventHandlers, (name, handler) =>
    typeof(handler) === 'string'
      ? (payload: EventPayload) => dispatch(handler, payload)
      : handler
  )
}

type State = {
  snapshotID: null | number
}

export default <TProps>(
  name: string,
  {
    addToScope,
    propsFromDb,
    events,
  }: AdapterSpec<TProps>,
  Component: React.ElementType,
  app: App
): React.ComponentType<TProps> => {
  class Adapter extends React.PureComponent<TProps, State> {

    static contextTypes: {
      treehouseScope: any
    }
    static childContextTypes: {
      treehouseScope: any
    }
    static displayName = `Adapter(${name})`

    dbView: Pipe<BunchOfData> | null = null
    eventHandlers: { [name: string]: (...args: any[]) => void } | null
    getChildContext?: () => { treehouseScope: any }
    scope: { [name: string]: any }
    state: State = { snapshotID: null }

    constructor (props: TProps) {
      super(props)
      this.scope = Object.assign(
        {},
        this.context && this.context.treehouseScope,
        addToScope && addToScope(this.props)
      )
      if (propsFromDb) {
        this.dbView = app.dbView(propsFromDb, this.props, this.scope)
        this.dbView.watch(() => {
          const snapshotID = app.dbSnapshotID()
          if (this.state.snapshotID !== snapshotID) {
            this.setState({ snapshotID })
          }
        })
      }
      this.eventHandlers = buildEventHandlers(events, app.dispatch, this.props, this.scope)
    }

    static getDerivedStateFromProps () {
      return { snapshotID: app.dbSnapshotID() }
    }

    componentWillUnmount () {
      if (this.dbView) {
        this.dbView.unwatch()
      }
    }

    render () {
      const propsFromDb = this.dbView ? this.dbView.pull() : {}
      return React.createElement(Component, {
        ...propsFromDb,
        ...this.eventHandlers,
        __adapters__: app.adapters,
        ...this.props,
      })
    }
  }

  if (addToScope) {
    Adapter.prototype.getChildContext = function () {
      return {
        treehouseScope: this.scope
      }
    }
    Adapter.childContextTypes = {
      treehouseScope: () => null
    }
  }

  Adapter.contextTypes = {
    treehouseScope: () => {}
  }

  return Adapter
}
