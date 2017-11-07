class Update {

  constructor (app, name, spec) {
    this.app = app
    this.name = name
    this.spec = spec
    this.treeView = this.app.pick(this.spec.pick)
  }

  call (payload) {
    const changes = this.spec.reducer(this.treeView.pull(), payload)
    this.treeView.push(changes)
    this.app.commitChanges()
  }

}

module.exports = Update
