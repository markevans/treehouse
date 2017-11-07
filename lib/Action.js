class Action {

  constructor (app, name, spec) {
    this.app = app
    this.name = name
    this.spec = spec
  }

  call (payload) {
    this.spec(payload, this.app.event)
  }

}

module.exports = Action
