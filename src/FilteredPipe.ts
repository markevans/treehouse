export default class FilteredPipe {

  constructor (source, spec, args) {
    this.source = source
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
      throw new Error(`You need to implement 'unfilter' on a filter to be able to set through it`)
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

  watch (callback) {
    this.source.watch(callback)
  }

  unwatch () {
    this.source.unwatch()
  }

  filter (spec, args) {
    return new this.constructor(this, spec, args)
  }
}
