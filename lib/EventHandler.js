const Action = require('./Action')
const Update = require('./Update')

class EventHandler {

  constructor (app, name, spec) {
    if (spec.action) {
      this.action = new Action(app, name, spec.action)
    }
    if (spec.update) {
      this.update = new Update(app, name, spec.update)
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
