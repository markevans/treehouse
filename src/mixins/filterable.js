// Mixin requires 'this.app' and 'this.get()' to be present on prototype
export default (Constructor) => {
  Constructor.prototype.filter = function (name) {
    return this.app.buildFilteredStream(name, this)
  }
}
