class FilteredStream {
  constructor (source, filter) {
    this.filter = filter
    this.source = source
  }

  get () {
    return this.filter(this.source.get())
  }

  set (value) {
    throw new Error("set not implemented yet for filters")
  }

  channels () {
    return this.source.channels()
  }
}

export default FilteredStream
