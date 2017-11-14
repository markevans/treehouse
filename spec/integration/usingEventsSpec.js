const App = require('../../lib/App')

describe("Using events", () => {

  let app

  beforeEach(() => {
    app = new App()
  })

  describe("simple updates", () => {

    beforeEach(() => {
      app.init({
        num: 3
      })
      app.registerEvent('increment', {
        pick: t => t.at('num'),
        update: num => num + 1
      })
    })

    it("updates the tree", () => {
      app.event('increment')()
      expect(app.tree.pull()).toEqual({
        num: 4
      })
    })

    it("only calls the handler once when many handlers are initialized", () => {
      const handler1 = app.event('increment'),
        handler2 = app.event('increment')
      handler1()
      expect(app.tree.pull()).toEqual({
        num: 4
      })
    })

  })

  describe("actions", () => {

    let result

    beforeEach(() => {
      app.init({
        colours: {
          green: '#0d0'
        }
      })
      spyOn(app, 'event').and.callThrough()
      result = null
    })

    it("triggers an action with the correct payload", () => {
      app.registerEvent('doThings', {
        action: (payload) => {
          result = payload
        }
      })
      app.event('doThings')('hello')
      expect(result).toEqual('hello')
    })

    it("allows triggering other events", (done) => {
      app.registerEvents({
        doThings: {
          action: (_, event) => {
            setTimeout(() => event('otherEvent')('some payload'))
          }
        },
        otherEvent: {
          action: (payload) => {
            expect(payload).toEqual('some payload')
            done()
          }
        }
      })
      app.event('doThings')()
    })

  })

  describe("decorating events", () => {

    let result

    beforeEach(() => {
      app.registerEvent('doThing', {
        action: (payload) => result = payload
      })
      result = null
    })

    it("modifies the handler", () => {
      app.decorateEvent((event, payload) => {
        event(payload.toUpperCase())
      })
      app.event('doThing')('payload')
      expect(result).toEqual('PAYLOAD')
    })

  })

})
