import buildAdapter from './buildAdapter'
import handleEvent from './handleEvent'
import Db from './Db'
import mapObject from './utils/mapObject'

export default class App {

  constructor () {
    this.adapters = {}
    this.db = new Db()
    this.eventSpecs = {}
    this._registerEventCallbacks = []
    this._currentlyDispatchingEvent = null
  }

  init(state) {
    this.db.init(state)
  }

  dbView (picker, ...args) {
    return this.db.view(picker, ...args)
  }

  dbSnapshotID () {
    return this.db.snapshotID
  }

  commitUpdates () {
    return this.db.commitUpdates()
  }

  dispatch = (eventName, payload) => {
    if (this.eventSpecs[eventName]) {
      if (this._currentlyDispatchingEvent) {
        throw new Error(`You can't call dispatch(${eventName}) synchronously while already performing an action(${this._currentlyDispatchingEvent})`)
      }
      try {
        this._currentlyDispatchingEvent = eventName
        this._handleEvent(eventName, payload, this.eventSpecs[eventName])
      } finally {
        this._currentlyDispatchingEvent = null
      }
    } else {
      console.warn(`Event '${eventName}' not registered`)
    }
  }

  getState(eventName, payload) {
    const spec = this.eventSpecs[eventName]
    return spec.state ? this.dbView(spec.state, payload).pull() : null
  }

  _handleEvent = (eventName, payload, spec) => {
    return handleEvent(eventName, payload, spec, this)
  }

  registerEvents ({defaults, events}) {
    mapObject(events, (name, spec) => this._registerEvent(name, {...defaults, ...spec}))
  }

  _registerEvent (name, spec) {
    this.eventSpecs[name] = spec
    this._registerEventCallbacks.forEach(callback => callback(name, spec))
  }

  onRegisterEvent (callback) {
    this._registerEventCallbacks.push(callback)
  }

  registerAdapter (name, spec, component) {
    this.adapters[name] = buildAdapter(
      name,
      spec,
      component,
      this
    )
  }

  usePlugin (plugin, args) {
    return plugin(this, args)
  }

  useMiddleware (middleware, args) {
    const nextHandleEvent = this._handleEvent,
      nextLayerDispatch = (eventName, payload) =>
        nextHandleEvent(eventName, payload, this.eventSpecs[eventName])
    this._handleEvent = middleware(nextLayerDispatch, this, args)
    return nextLayerDispatch
  }

}
