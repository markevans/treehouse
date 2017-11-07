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

  it("doesn't matter if the action is missing", () => {
    delete spec.action
    eventHandler = new EventHandler(app, 'myEvent', spec)
    spyOn(eventHandler.update, 'call')
    eventHandler.call({somePayload: 'payload'})
    expect(eventHandler.update.call).toHaveBeenCalled()
  })

  it("doesn't matter if the update is missing", () => {
    delete spec.update
    eventHandler = new EventHandler(app, 'myEvent', spec)
    spyOn(eventHandler.action, 'call')
    eventHandler.call({somePayload: 'payload'})
    expect(eventHandler.action.call).toHaveBeenCalled()
  })

})
