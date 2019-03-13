import { Observable, Subject } from 'rxjs'
import { Event, StreamValue, BunchOfStreams } from './types'

export default class Streams {
  streams: { [name: string]: Subject<StreamValue> } = {}
  subscriptions: { [name: string]: any } = {}

  getStream = (name: string) => this.streams[name]

  getOrCreateStream (name: string) {
    if (!this.streams[name]) {
      this.streams[name] = new Subject()
    }
    return this.streams[name]
  }

  getOrCreateStreams (names: string[]) {
    const streams: BunchOfStreams = {}
    return names.reduce((memo, name) => {
      memo[name] = this.getOrCreateStream(name)
      return memo
    }, streams)
  }

  subscribeToStream = (
    name: string,
    filter: (
      stream: Observable<StreamValue>,
      otherStreams?: BunchOfStreams
    ) => Observable<Event>,
    otherStreamNames: string[] | undefined,
    nextCallback: (event: Event) => void
  ) => {
    const otherStreams = otherStreamNames ? this.getOrCreateStreams(otherStreamNames) : undefined
    const filteredStream = filter(this.getOrCreateStream(name), otherStreams)
    this.subscriptions[name] = filteredStream.subscribe({ next: nextCallback })
  }

  getSubscription = (name: string) => this.subscriptions[name]
}
