class Actions {

  constructor (app) {
    this.actions = {}
    this.app = app
  }

  register(actions) {
    Object.assign(this.actions, actions)
  }

  build (name, payload) {
    let commit = this.app.commit.bind(this.app),
      trunk = this.app.trunk(),
      actionFunc = this.actions[name],
      build = this.build.bind(this)

    if ( actionFunc ) {
      return function(pload) {
        if (payload === undefined) {
          payload = pload
        }
        actionFunc(trunk, payload, build)
        commit()
      }
    } else {
      this.app.log(`Action '${name}' not found`)
      return function() {
        throw new Error(`Can't call action '${name}' as it's not registered`)
      }
    }
  }

}

module.exports = Actions
