const Filter = require('./filter')
const FilteredStream = require('./filtered_stream')

class Filters {

  constructor (app) {
    this.app = app
    this.filters = {}
  }

  register (filterSpecs) {
    let name
    for (name in filterSpecs) {
      this.filters[name] = new Filter(name, filterSpecs[name])
    }
  }

  buildStream (name, source, args) {
    return new FilteredStream(this.app, source, this.find(name), args)
  }

  filter (name, data) {
    return this.find(name).forward(data)
  }

  unfilter (name, data) {
    return this.find(name).reverse(data)
  }

  find (name) {
    let filter = this.filters[name]
    if (!filter) {
      throw new Error(`Can't find filter '${name}' as it's not defined`)
    }
    return filter
  }
}

module.exports = Filters
