import { Data, Filterable, FilterSpec, WatchablePipe, WatchCallback } from './types'

export default class FilteredPipe implements WatchablePipe<Data>, Filterable {

  source: WatchablePipe<Data>
  args: any
  filterFn: (data: Data, args: any) => Data
  unfilterFn?: (data: Data, args: any) => Data

  constructor (source: WatchablePipe<Data>, spec: FilterSpec, args: any) {
    this.source = source
    this.args = args

    this.filterFn = typeof(spec) === 'function' ? spec : spec.filter
    this.unfilterFn = spec.unfilter
  }

  pull (): Data {
    return this.filterFn(this.source.pull(), this.args)
  }

  push (value: Data): void {
    if (!this.unfilterFn) {
      throw new Error(`You need to implement 'unfilter' on a filter to be able to set through it`)
    }
    return this.source.push(this.unfilterFn(value, this.args))
  }

  watch (callback: WatchCallback): void {
    this.source.watch(callback)
  }

  unwatch (): void {
    this.source.unwatch()
  }

  filter (spec: FilterSpec, args: any): WatchablePipe<Data> {
    return new FilteredPipe(this, spec, args)
  }
}
