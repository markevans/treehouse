const filterable = require('./mixins/filterable')

class FilteredStream {
  constructor (app, source, filterObject, args) {
    this.app = app
    this.source = source
    this.filterObject = filterObject
    this.args = args
  }

  get () {
    return this.filterObject.forward(this.source.get(), this.args)
  }

  putBack (value) {
    return this.source.putBack(this.filterObject.reverse(value, this.args))
  }

  channels () {
    return this.source.channels()
  }
}

filterable(FilteredStream)

module.exports = FilteredStream
