class Actions {

  constructor (app) {
    this.actions = {}
    this.app = app
  }

  register(actions) {
    Object.assign(this.actions, actions)
  }

  do (name, payload={}) {
    if ( this.actions[name] ) {
      this.actions[name](this.app.trunk(), payload, this.app.commitChanges.bind(this.app))
    } else {
      console.log(`Action '${name}' not found`)
    }
  }

}

export default Actions
