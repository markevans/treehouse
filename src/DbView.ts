import mapObject from  './utils/mapObject'

export default class DbView {

  constructor (sources) {
    this.sources = sources
    this.watchCallback = null
  }

  watch (callback) {
    mapObject(this.sources, (_, source) => source.watch(callback))
  }

  unwatch () {
    mapObject(this.sources, (_, source) => source.unwatch())
  }

  pull () {
    return mapObject(this.sources, (_, source) => source.pull())
  }

  push (data) {
    mapObject(data, (key, value) => this.sources[key].push(value))
  }

}
