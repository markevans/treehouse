const App = require('../lib/App')

describe("App", () => {
  let app

  beforeEach(() => {
    app = new App()
  })

  describe("actions", () => {
    it("registers, builds and calls actions", () => {
      app.registerActions({
        createCheese: (tree, {type}) => {
          tree.at('cheese').set(type)
        }
      })
      app.action("createCheese")({type: 'cheddar'})
      expect(app.tree()).toEqual({cheese: 'cheddar'})
    })
  })

})
