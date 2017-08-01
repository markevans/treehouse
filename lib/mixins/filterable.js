// Mixin requires 'this.app' and 'this.get()' to be present on prototype
module.exports = (Constructor) => {
  Constructor.prototype.filter = function (name, args) {
    return this.app.buildFilteredStream(name, this, args)
  }
}
