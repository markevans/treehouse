class Action {

  constructor (app, name, treeView, actionFunc) {
    this.name = name
    this.actionFunc = actionFunc
    this.action = app.action.bind(app)
    this.getState = () => treeView.pull()
  }

  call (payload) {
    this.actionFunc(payload, this.action, this.getState)
  }

}

module.exports = Action
