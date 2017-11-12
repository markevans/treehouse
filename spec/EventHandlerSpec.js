const EventHandler = require('../lib/EventHandler')

describe("EventHandler", () => {

  let app, spec

  beforeEach(() => {
    app = {
      pick: spy('app.pick'),
      event: spy('app.event')
    }
    spec = {
      pick: spy('spec.pick'),
      action: spy('action'),
      update: spy('update')
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

  it("does nothing if set to null", () => {
    eventHandler = new EventHandler(app, 'myEvent', null)
    eventHandler.call({thisWill: 'not throw an error'})
  })

  describe("decorating the handler", () => {

    it("allows decorating the handler", () => {
      spec.decorate = handler => {
        return (payload) => {
          handler(payload * 2)
          handler(payload * 3)
        }
      }
      eventHandler = new EventHandler(app, 'myEvent', spec)
      spyOn(eventHandler.action, 'call')
      spyOn(eventHandler.update, 'call')
      eventHandler.call(53)
      expect(eventHandler.action.call.calls.allArgs()).toEqual([[106], [159]])
      expect(eventHandler.update.call.calls.allArgs()).toEqual([[106], [159]])
    })

  })

})
