const App = require('../../lib/App')

describe("Using events", () => {

  let app

  beforeEach(() => {
    app = new App()
  })

  describe("registering and triggering events", () => {

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

})
