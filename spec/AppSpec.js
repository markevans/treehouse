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

  describe("reducers", () => {
    it("registers and calls reducers", () => {
      app.registerReducers({
        upcase: string => string.toUpperCase()
      })
      let result = app.reducer("upcase")('stuff')
      expect(result).toEqual("STUFF")
    })
  })
})
