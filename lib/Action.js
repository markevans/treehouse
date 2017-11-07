class Action {

  constructor (app, name, spec) {
    this.app = app
    this.name = name
    this.spec = spec
    this.getTree = () => this.app.tree.pull()
  }

  call (payload) {
    this.spec(payload, this.app.event, this.getTree)
  }

}

module.exports = Action
