class Update {

  constructor (app, name, treeView, updateFunc) {
    this.app = app
    this.name = name
    this.treeView = treeView
    this.updateFunc = updateFunc
  }

  call (payload) {
    const changes = this.updateFunc(this.treeView.pull(), payload)
    this.treeView.push(changes)
    this.app.commitChanges()
  }

}

module.exports = Update
