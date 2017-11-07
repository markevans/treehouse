class EventHandler {

  constructor (app, name, spec) {
    this.app = app
    this.name = name
    this.spec = spec
    this.treeView = null

    this.action = spec.action
    this.update = spec.update
    if (this.update) {
      this.treeView = this.app.pick(this.update.pick)
    }
  }

  call (payload) {
    if (this.action) {
      this.action(payload, this.app.event)
    }
    if (this.update) {
      const changes = this.update.reducer(this.treeView.pull(), payload)
      this.treeView.push(changes)
      this.app.commitChanges()
    }
  }

}

module.exports = EventHandler
