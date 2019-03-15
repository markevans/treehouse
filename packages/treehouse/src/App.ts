import defaultHandleEvent from './handleEvent'
import Db from './Db'
import mapObject from './utils/mapObject'
import { BunchOfData, DbChange, EventName, EventPayload, EventSpec, EventSpecs, Middleware, Pipe, Plugin, RegisterEventCallback, StatePicker } from './types'

export default class App {

  db: Db
  eventSpecs: { [name: string]: EventSpec }
  private currentlyDispatchingEvent: EventName | null
  private registerEventCallbacks: RegisterEventCallback[]

  constructor () {
    this.db = new Db()
    this.eventSpecs = {}
    this.registerEventCallbacks = []
    this.currentlyDispatchingEvent = null
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
      if (this.currentlyDispatchingEvent) {
        throw new Error(`You can't call dispatch(${eventName}) synchronously while already performing an action(${this.currentlyDispatchingEvent})`)
      }
      try {
        this.currentlyDispatchingEvent = eventName
        this._handleEvent(eventName, payload, this.eventSpecs[eventName])
      } finally {
        this.currentlyDispatchingEvent = null
      }
    } else {
      //console.warn(`Event '${eventName}' not registered`)
    }
  }

  dispatcher = (eventName: EventName) => {
    return (payload: EventPayload) => this.dispatch(eventName, payload)
  }

  getState(eventName: EventName, payload: EventPayload): BunchOfData | null {
    const spec = this.eventSpecs[eventName]
    return spec.state ? this.dbView(spec.state, payload).pull() : null
  }

  private _handleEvent = (eventName: EventName, payload: EventPayload, spec: EventSpec) => {
    return defaultHandleEvent(eventName, payload, spec, this)
  }

  registerEvents ({defaults, events}: EventSpecs) {
    mapObject(events, (name, spec) => this.registerEvent(name, {...defaults, ...spec}))
  }

  registerEvent (name: EventName, spec: EventSpec) {
    this.eventSpecs[name] = spec
    this.registerEventCallbacks.forEach(callback => callback(name, spec))
  }

  onRegisterEvent (callback: RegisterEventCallback) {
    this.registerEventCallbacks.push(callback)
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
