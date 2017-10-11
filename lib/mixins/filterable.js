const FilteredPipe = require('../FilteredPipe')

// Mixin requires `app`, `push(data)`, `pull()` and `channels()`  to be present on prototype
module.exports = (Constructor) => {
  Constructor.prototype.filter = function (name, args) {
    return new FilteredPipe(this.app, this, this.app.filters.find(name), args)
  }
}
