const Action = require('./Action')
const Update = require('./Update')

class EventHandler {

  constructor (app, name, spec) {
    if (spec.decorate) {
      this.call = spec.decorate(this.call.bind(this))
    }
    if (spec.pick) {
      this.treeView = app.pick(spec.pick)
    }
    if (spec.action) {
      this.action = new Action(app, name, this.treeView, spec.action)
    }
    if (spec.update) {
      this.update = new Update(app, name, this.treeView, spec.update)
    }
  }

  call (payload) {
    if (this.action) {
      this.action.call(payload)
    }
    if (this.update) {
      this.update.call(payload)
    }
  }

}

module.exports = EventHandler
