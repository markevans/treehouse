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
        update: {
          pick: t => t.at('num'),
          reducer: num => num + 1
        }
      })
    })

    it("updates the tree", () => {
      app.event('increment')()
      expect(app.tree.pull()).toEqual({
        num: 4
      })
    })

  })

})
