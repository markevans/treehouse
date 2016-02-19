import Facade from './facade'

let pathToKey = (path) => {
  return path.join('/')
}

class Facades {

  constructor (app) {
    this.facades = {}
    this.app = app
  }

  register(facades) {
    facades.forEach((spec) => {
      this.facades[pathToKey(spec.path)] = new Facade(this.app, spec.deps, spec.get)
    })
  }

  find (path) {
    return this.facades[pathToKey(path)]
  }

}

export default Facades
