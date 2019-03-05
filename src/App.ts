import buildAdapter from './buildAdapter'
import handleEvent from './handleEvent'
import Db from './Db'
import mapObject from './utils/mapObject'
import { AdapterSpec, BunchOfData, DbChange, EventName, EventPayload, EventSpec, EventSpecs, Middleware, Pipe, Plugin, RegisterEventCallback, StatePicker } from './types'

export default class App {

  adapters: { [name: string]: any }
  db: Db
  eventSpecs: { [name: string]: EventSpec }
  _currentlyDispatchingEvent: EventName | null
  _registerEventCallbacks: RegisterEventCallback[]

  constructor () {
    this.adapters = {}
    this.db = new Db()
    this.eventSpecs = {}
    this._registerEventCallbacks = []
    this._currentlyDispatchingEvent = null
  }

  init(state: BunchOfData) {
    this.db.init(state)
  }

  dbView (picker: StatePicker, ...args: any[]): Pipe<BunchOfData> {
    return this.db.view(picker, ...args)
  }

  dbSnapshotID (): number {
    return this.db.snapshotID
  }

  commitUpdates (): DbChange[] {
    return this.db.commitUpdates()
  }

  dispatch = (eventName: EventName, payload: EventPayload): void => {
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
      //console.warn(`Event '${eventName}' not registered`)
    }
  }

  _handleEvent = (eventName: EventName, payload: EventPayload, spec: EventSpec) => {
    return handleEvent(eventName, payload, spec, this)
  }

  registerEvents ({defaults, events}: EventSpecs) {
    mapObject(events, (name, spec) => this._registerEvent(name, {...defaults, ...spec}))
  }

  _registerEvent (name: EventName, spec: EventSpec) {
    this.eventSpecs[name] = spec
    this._registerEventCallbacks.forEach(callback => callback(name, spec))
  }

  onRegisterEvent (callback: RegisterEventCallback) {
    this._registerEventCallbacks.push(callback)
  }

  registerAdapter <TProps>(name: string, spec: AdapterSpec<TProps>, component: any) {
    this.adapters[name] = buildAdapter(
      name,
      spec,
      component,
      this
    )
  }

  usePlugin (plugin: Plugin, args: any) {
    return plugin(this, args)
  }

  useMiddleware (middleware: Middleware, args: any) {
    const nextHandleEvent = this._handleEvent,
      nextLayerDispatch = (eventName: EventName, payload: EventPayload) =>
        nextHandleEvent(eventName, payload, this.eventSpecs[eventName])
    this._handleEvent = middleware(nextLayerDispatch, this, args)
    return nextLayerDispatch
  }

}
