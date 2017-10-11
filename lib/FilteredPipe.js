class FilteredPipe {
  constructor (app, source, name, spec, args) {
    this.app = app
    this.source = source
    this.spec = spec
    this.args = args
  }

  pull () {
    return this.spec.filter(this.source.pull(), this.args)
  }

  push (value) {
    return this.source.push(this.spec.unfilter(value, this.args))
  }

  channels () {
    return this.source.channels()
  }

  filter (name, args) {
    return new this.constructor(this.app, this, this.app.filters.find(name), args)
  }
}

module.exports = FilteredPipe
