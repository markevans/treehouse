const App = require('../../lib/App')

describe("Using treeViews", () => {

  let app

  beforeEach(() => {
    app = new App()
  })

  describe("using a treeview to connect to a part of the tree", () => {

    let treeView

    beforeEach(() => {
      app.init({
        settings: {
          page: 7
        },
        isLoading: false
      })
      treeView = app.pick(t => ({
        page: t.at('settings', 'page'),
        loading: t.at('isLoading')
      }))
    })

    it("gets data", () => {
      expect(treeView.get()).toEqual({
        page: 7,
        loading: false
      })
    })

    it("updates when data is changed", () => {
      let results
      treeView.watch(({page, loading}) => {
        results = [page, loading]
      })
      app.tree.at('settings', 'page').push(6)
      app.commitChanges()
      expect(results).toEqual([6, false])
    })

    it("doesn't update when specific data hasn't changed", () => {
      let results
      treeView.watch(({page, loading}) => {
        results = [page, loading]
      })
      app.tree.at('other', 'path').push(6)
      app.commitChanges()
      expect(results).toBeUndefined()
    })

  })

})
