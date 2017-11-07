const EventHandler = require('../lib/EventHandler')

describe("EventHandler", () => {

  let app, spec

  beforeEach(() => {
    app = {
      pick: spy('pick')
    }
    spec = {
      action: {someActionSpec: 'spec'},
      update: {someUpdateSpec: 'spec'}
    }
  })

  it("performs the action then the update", () => {
    eventHandler = new EventHandler(app, 'myEvent', spec)

    expect(eventHandler.action.constructor.name).toEqual('Action')
    expect(eventHandler.update.constructor.name).toEqual('Update')

    const calls = []
    spyOn(eventHandler.action, 'call').and.callFake(() => { calls.push('action') })
    spyOn(eventHandler.update, 'call').and.callFake(() => { calls.push('update') })

    eventHandler.call({somePayload: 'payload'})

    expect(eventHandler.action.call).toHaveBeenCalledWith({somePayload: 'payload'})
    expect(eventHandler.update.call).toHaveBeenCalledWith({somePayload: 'payload'})
    expect(calls).toEqual(['action', 'update'])
  })

})
