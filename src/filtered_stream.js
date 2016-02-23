class FilteredStream {
  constructor (app, source, filterFunction) {
    this.app = app
    this.filterFunction = filterFunction
    this.source = source
  }

  get () {
    return this.filterFunction(this.source.get())
  }

  set (value) {
    throw new Error("set not implemented yet for filters")
  }

  channels () {
    return this.source.channels()
  }

  filter (name) {
    return this.app.buildFilteredStream(name, this)
  }
}

export default FilteredStream
