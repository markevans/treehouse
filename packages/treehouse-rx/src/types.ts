import { Observable, Subject } from 'rxjs'

type EventName = import('treehouse').EventName
type EventPayload = import('treehouse').EventPayload
type EventSpec = import('treehouse').EventSpec
type BunchOfData = import('treehouse').BunchOfData

export type Event = [EventName, EventPayload]
export type StreamValue = [EventName, EventPayload, BunchOfData | null]
export type Stream = Subject<StreamValue>
export type BunchOfStreams = { [name: string]: Stream }
export interface EventSpecStreams {
  stream?: (stream: Observable<StreamValue>, otherStreams?: BunchOfStreams) => Observable<Event>,
  injectStreams?: string[]
}
export interface EventSpecWithStreams extends EventSpec, EventSpecStreams {}
