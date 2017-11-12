const EventHandler = require('../lib/EventHandler')

describe("EventHandler", () => {

  let app, spec, treeView

  beforeEach(() => {
    app = {
      pick: spy('app.pick'),
      event: spy('app.event'),
      commitChanges: spy('commitChanges')
    }
    spec = {
      pick: spy('spec.pick'),
      action: spy('action'),
      update: spy('update')
    }
    treeView = {
      pull: spy('treeView.pull'),
      push: spy('treeView.push')
    }
    app.pick.and.returnValue(treeView)
  })

  describe("updating", () => {

    it("pushes changes onto the treeview", () => {
      treeView.pull.and.returnValue({someData: 'data'})
      spec.update.and.returnValue({someUpdate: 'update'})

      const eventHandler = new EventHandler(app, 'myEvent', spec)
      eventHandler.call({somePayload: 'payload'})

      expect(spec.update).toHaveBeenCalledWith({someData: 'data'}, {somePayload: 'payload'})
      expect(treeView.push).toHaveBeenCalledWith({someUpdate: 'update'})
      expect(app.commitChanges).toHaveBeenCalled()
    })

    it("doesn't matter if the update is missing", () => {
      delete spec.update
      eventHandler = new EventHandler(app, 'myEvent', spec)
      spyOn(eventHandler.action, 'call')
      eventHandler.call({somePayload: 'payload'})
      expect(eventHandler.action.call).toHaveBeenCalled()
    })

  })

  describe("action", () => {

    let result

    beforeEach(() => {
      result = null
    })

    it("performs the action with the given payload", () => {
      spec.action = (payload) => {
        result = payload
      }
      event = new EventHandler(app, 'myEvent', spec)
      event.call('payload')
      expect(result).toEqual('payload')
    })

    it("yields a getter for the tree state", () => {
      result = []
      treeView.pull.and.returnValues(4, 8)
      spec.action = (payload, event, getState) => {
        result.push(getState() + 1)
        result.push(getState() + 0.5)
      }
      event = new EventHandler(app, 'myEvent', spec)
      event.call()
      expect(result).toEqual([5, 8.5])
    })

    it("doesn't matter if the action is missing", () => {
      delete spec.action
      eventHandler = new EventHandler(app, 'myEvent', spec)
      spyOn(eventHandler.update, 'call')
      eventHandler.call({somePayload: 'payload'})
      expect(eventHandler.update.call).toHaveBeenCalled()
    })

    it("yields the event factory", () => {
      spec.action = (payload, event) => {
        event('otherEvent')
      }
      event = new EventHandler(app, 'myEvent', spec)
      event.call()
      expect(app.event).toHaveBeenCalledWith('otherEvent')
    })

  })

  it("performs the action then the update", () => {
    result = []
    spec.update = () => { result.push('update') }
    spec.action = () => { result.push('action') }

    eventHandler = new EventHandler(app, 'myEvent', spec)
    eventHandler.call({somePayload: 'payload'})

    expect(result).toEqual(['action', 'update'])
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
