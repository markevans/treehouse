import { BunchOfPipes, BunchOfData, Pipe, WatchCallback } from './types'
import mapObject from  './utils/mapObject'

export default class DbView implements Pipe<BunchOfData> {

  private sources: BunchOfPipes

  constructor (sources: BunchOfPipes) {
    this.sources = sources
  }

  watch (callback: WatchCallback): void {
    mapObject(this.sources, (_, source) => source.watch(callback))
  }

  unwatch (): void {
    mapObject(this.sources, (_, source) => source.unwatch())
  }

  pull (): BunchOfData {
    return mapObject(this.sources, (_, source) => source.pull())
  }

  push (data: BunchOfData): void {
    mapObject(data, (key: string, value: BunchOfData) => this.sources[key].push(value))
  }

}
