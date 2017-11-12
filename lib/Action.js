class Action {

  constructor (app, name, treeView, actionFunc) {
    this.app = app
    this.name = name
    this.treeView = treeView
    this.actionFunc = actionFunc
    this.getTree = () => this.app.tree.pull()
  }

  call (payload) {
    this.actionFunc(payload, this.app.event, this.getTree)
  }

}

module.exports = Action
