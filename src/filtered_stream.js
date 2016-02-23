class FilteredStream {
  constructor (app, source, filterObject) {
    this.app = app
    this.filterObject = filterObject
    this.source = source
  }

  get () {
    return this.filterObject.forward(this.source.get())
  }

  set (value) {
    this.source.set(this.filterObject.reverse(value))
  }

  channels () {
    return this.source.channels()
  }

  filter (name) {
    return this.app.buildFilteredStream(name, this)
  }
}

export default FilteredStream
