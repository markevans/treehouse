import React from 'react'
import mapObject from './utils/mapObject'

const buildEventHandlers = (events, dispatch, props, scope) => {
  if (!events) return null
  const eventHandlers = typeof(events) === 'function'
    ? events(dispatch, props, scope)
    : events
  return mapObject(eventHandlers, (name, handler) =>
    typeof(handler) === 'string'
      ? payload => dispatch(handler, payload)
      : handler
  )
}

export default (name, {
  addToScope,
  propsFromDb,
  events,
}, Component, app) => {
  class Adapter extends React.PureComponent {

    static displayName = `Adapter(${name})`

    dbView = null
    state = { snapshotID: null }

    constructor (...args) {
      super(...args)
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
