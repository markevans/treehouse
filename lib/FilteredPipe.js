class FilteredPipe {
  constructor (app, source, name, spec, args) {
    this.app = app
    this.source = source
    this.name = name
    this.spec = spec
    this.args = args
  }

  filterFn () {
    if (!this._filterFn) {
      this._filterFn = typeof(this.spec) === 'function' ? this.spec : this.spec.filter
    }
    return this._filterFn
  }

  unfilterFn () {
    if (!this.spec.unfilter) {
      throw new Error(`You need to implement 'unfilter' on the '${this.name}' filter to be able to set through it`)
    } else {
      return this.spec.unfilter
    }
  }

  pull () {
    return this.filterFn()(this.source.pull(), this.args)
  }

  push (value) {
    return this.source.push(this.unfilterFn()(value, this.args))
  }

  channels () {
    return this.source.channels()
  }

  filter (name, args) {
    return new this.constructor(this.app, this, name, this.app.filters.find(name), args)
  }
}

module.exports = FilteredPipe
