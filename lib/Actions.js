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
      actions = this.actions,
      build = this.build.bind(this)

    return function(pload) {
      if (payload === undefined) {
        payload = pload
      }
      let actionFunc = actions[name]
      if (!actionFunc) {
        throw new Error(`Can't call action '${name}' as it's not registered`)
      } else {
        actionFunc(trunk, payload, build)
        commit()
      }
    }
  }

}

module.exports = Actions
