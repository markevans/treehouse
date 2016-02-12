import Facet from './facet'

class Facets {

  constructor (tree) {
    this.tree = tree
    this.facets = {}
  }

  register(specs) {
    let name
    for (name in specs) {
      let spec = specs[name]
      this.facets[name] = new Facet(this.tree, spec.cursors, spec.evaluate)
    }
  }

  get (name) {
    if ( this.facets[name] ) {
      return this.facets[name]
    } else {
      console.log(`Facet '${name}' not found`)
    }
  }

}

export default Facets