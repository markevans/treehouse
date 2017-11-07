const EventHandler = require('../lib/EventHandler')

describe("EventHandler", () => {

  function spy (name) {
    return jasmine.createSpy(name)
  }

  let app

  beforeEach(() => {
    app = {
      pick: spy('app.pick'),
      commitChanges: spy('commitChanges')
    }
  })

  describe("updating the tree", () => {

    let source, spec

    beforeEach(() => {
      source = {
        push: spy('push'),
        pull: spy('pull')
      }
      spec = {
        update: {
          pick: spy('spec.pick'),
          reducer: spy('reducer')
        }
      }
    })

    it("pushes updates onto the picked source", () => {
      source.pull.and.returnValue({someData: 'data'})
      app.pick.and.returnValue(source)
      spec.update.reducer.and.returnValue({someUpdate: 'update'})

      eventHandler = new EventHandler(app, 'myEvent', spec)
      eventHandler.call({somePayload: 'payload'})

      expect(app.pick).toHaveBeenCalledWith(spec.update.pick)
      expect(spec.update.reducer).toHaveBeenCalledWith({someData: 'data'}, {somePayload: 'payload'})
      expect(source.push).toHaveBeenCalledWith({someUpdate: 'update'})
      expect(app.commitChanges).toHaveBeenCalled()
    })

  })

})
