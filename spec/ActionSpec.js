const Action = require('../lib/Action')

describe("Action", () => {

  let app, spec

  beforeEach(() => {
    app = {
      event: spy('app.event')
    }
    spec = spy('action')
  })

  it("performs the given action", () => {
    action = new Action(app, 'myEvent', spec)
    action.call({somePayload: 'payload'})

    expect(spec).toHaveBeenCalledWith({somePayload: 'payload'}, app.event)
  })

})
