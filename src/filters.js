import FilteredStream from './filtered_stream'

class Filters {

  constructor (app) {
    this.app = app
    this.filters = {}
  }

  register(filters) {
    Object.assign(this.filters, filters)
  }

  buildStream (source, name) {
    let filter = this.filters[name]
    if (filter) {
      return new FilteredStream(this.app, source, filter)
    } else {
      throw new Error(`Can't find filter '${name}' as it's not defined`)
    }
  }

}

export default Filters
