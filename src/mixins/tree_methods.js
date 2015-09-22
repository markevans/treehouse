let each = (object, callback) => {
  let key
  for (key in object) {
    callback(object[key], key)
  }
}

export default (app) => {
  return {

    tree () {
      return app.tree
    },

    allFacets () {
      return app.facets
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

    facets () {
      if (!this._facets) {
        let facets = {}
        if (this.stateFromFacets) {
          let key, facetNames = this.stateFromFacets()
          for ( key in facetNames ) {
            facets[key] = this.allFacets().get(facetNames[key])
          }
        }
        this._facets = facets
      }
      return this._facets
    },

    currentTreeState () {
      let key, data = {},
        cursors = this.cursors(),
        facets = this.facets()
      for (key in cursors) {
        data[key] = cursors[key].get()
      }
      for (key in facets) {
        data[key] = facets[key].call()
      }
      return data
    },

    relevantBranches () {
      if (!this._relevantBranches) {
        let branches = new Set()
        each(this.cursors(), (cursor) => { branches.add(cursor.path[0]) })
        each(this.facets(), (facet) => {
          each(facet.cursors, (cursor) => { branches.add(cursor.path[0]) })
        })
        this._relevantBranches = branches
      }
      return this._relevantBranches
    }

  }
}
