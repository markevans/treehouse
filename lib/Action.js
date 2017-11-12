class Action {

  constructor (app, name, treeView, actionFunc) {
    this.name = name
    this.actionFunc = actionFunc
    this.event = app.event.bind(app)
    this.getState = () => treeView.pull()
  }

  call (payload) {
    this.actionFunc(payload, this.event, this.getState)
  }

}

module.exports = Action
