const App = require('../../lib/App')

describe("Using actions", () => {

  let app

  beforeEach(() => {
    app = new App()
  })

  describe("simple updates", () => {

    beforeEach(() => {
      app.init({
        num: 3
      })
      app.registerAction('increment', {
        pick: t => t.at('num'),
        update: num => num + 1
      })
    })

    it("updates the tree", () => {
      app.action('increment')()
      expect(app.tree.pull()).toEqual({
        num: 4
      })
    })

    it("only calls the handler once when many handlers are initialized", () => {
      const handler1 = app.action('increment'),
        handler2 = app.action('increment')
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
      spyOn(app, 'action').and.callThrough()
      result = null
    })

    it("triggers an action with the correct payload", () => {
      app.registerAction('doThings', {
        action: (payload) => {
          result = payload
        }
      })
      app.action('doThings')('hello')
      expect(result).toEqual('hello')
    })

    it("allows triggering other actions", (done) => {
      app.registerActions({
        doThings: {
          action: (_, action) => {
            setTimeout(() => action('otherAction')('some payload'))
          }
        },
        otherAction: {
          action: (payload) => {
            expect(payload).toEqual('some payload')
            done()
          }
        }
      })
      app.action('doThings')()
    })

  })

  describe("decorating actions", () => {

    let result, spec, scope

    beforeEach(() => {
      spec = {
        action: (payload) => result = payload
      }
      app.registerAction('doThing', spec)
      scope = {}
      result = null
    })

    it("modifies the handler", () => {
      app.decorateAction((handler, payload) => {
        handler(payload.toUpperCase())
      })
      app.action('doThing')('payload')
      expect(result).toEqual('PAYLOAD')
    })

    it("yields useful stuff", () => {
      app.decorateAction((action, payload, extra) => {
        result = extra
      })
      app.action('doThing', scope)('payload')
      expect(result).toEqual({ spec, app, scope, name: 'doThing' })
    })

  })

})
