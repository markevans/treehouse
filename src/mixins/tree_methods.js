export default (app) => {
  return {

    tree () {
      return app.tree
    },

    cursors () {
      if (!this._cursors) {
        let cursors = {}
        if (this.stateFromTree) {
          let key, path, paths = this.stateFromTree()
          for ( key in paths ) {
            path = paths[key]
            cursors[key] = this.tree().at(path)
          }
        }
        this._cursors = cursors
      }
      return this._cursors
    },

    currentTreeState () {
      let key, data = {}, cursors = this.cursors()
      for (key in cursors) {
        data[key] = cursors[key].get()
      }
      return data
    }

  }
}
