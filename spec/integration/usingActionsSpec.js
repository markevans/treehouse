const App = require('../../lib/App')

describe("Using actions", () => {

  let app

  beforeEach(() => {
    app = new App()
  })

  describe("actions", () => {

    let result

    beforeEach(() => {
      app.init({
        num: 7
      })
      spyOn(app, 'action').and.callThrough()
      result = null
      app.registerUpdate('add', {
        pick: t => t.at('num'),
        update: (num, toAdd) => num + toAdd
      })
    })

    it("triggers an action with the correct payload", () => {
      app.registerAction('doThings', payload => {
        result = payload
      })
      app.action('doThings', {message: 'hello'})
      expect(result).toEqual({message: 'hello'})
    })

    it("can call updates", () => {
      app.registerAction('addFour', (_, update) => {
        update('add', 4)
      })
      app.action('addFour')
      expect(app.tree.pull().num).toEqual(11)
    })

    it("yields a getter for the state", () => {
      let result
      app.registerAction('getState', (_, __, getState) => {
        result = getState()
      })
      app.action('getState')
      expect(result).toEqual({num: 7})
    })

    it("does nothing when set to null", () => {
      app.registerAction('nullyMcNullFace', null)
      app.action('nullyMcNullFace')
    })

    it("allows for a string shortcut to forward to the update", () => {
      app.registerAction('addy', 'add')
      app.action('addy', 5)
      expect(app.tree.pull().num).toEqual(12)
    })

  })

  describe("decorating actions", () => {

    let result, spec

    beforeEach(() => {
      spec = payload => result = payload
      app.registerAction('doThing', spec)
      result = null
    })

    it("modifies the handler", () => {
      app.decorateAction((handler, name, payload) => {
        handler(name, payload.toUpperCase())
      })
      app.action('doThing', 'me payload')
      expect(result).toEqual('ME PAYLOAD')
    })

  })

})
