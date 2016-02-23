import FilteredStream from './filtered_stream'

class Filters {

  constructor (app) {
    this.app = app
    this.filters = {}
  }

  register (filters) {
    Object.assign(this.filters, filters)
  }

  buildStream (name, source) {
    return new FilteredStream(this.app, source, this.find(name))
  }

  filter (name, data) {
    return this.find(name)(data)
  }

  find (name) {
    let filter = this.filters[name]
    if (!filter) {
      throw new Error(`Can't find filter '${name}' as it's not defined`)
    }
    return filter
  }
}

export default Filters
