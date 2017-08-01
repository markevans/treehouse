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
      let commit = this.app.commit.bind(this.app)
      this.actions[name](this.app.trunk(), payload, commit)
      commit()
    } else {
      this.app.log(`Action '${name}' not found`)
    }
  }

}

module.exports = Actions