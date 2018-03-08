const App = require('../../lib/App')

describe("Using updates", () => {

  let app

  beforeEach(() => {
    app = new App()
  })

  describe("updates", () => {

    beforeEach(() => {
      app.init({
        num: 7
      })
      app.registerUpdate('add', {
        pick: t => t.at('num'),
        update: (num, toAdd) => num + toAdd
      })
    })

    it("updates the tree", () => {
      app.update('add', 4)
      expect(app.tree.pull().num).toEqual(11)
    })

    it("notifies listeners", () => {
      const treeView = app.pick(t => t.at('num'))
      result = null
      treeView.watch(num => result = num)
      expect(result).toEqual(null)
      app.update('add', 1)
      expect(result).toEqual(8)
    })

  })

})
