import FilteredStream from './filtered_stream'

class Filters {

  constructor () {
    this.filters = {}
  }

  register(filters) {
    Object.assign(this.filters, filters)
  }

  buildStream (source, name) {
    let filter = this.filters[name]
    if (filter) {
      return new FilteredStream(source, filter)
    } else {
      throw new Error(`Can't find filter '${name}' as it's not defined`)
    }
  }

}

export default Filters
