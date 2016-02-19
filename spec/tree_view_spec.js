import App from '../src/app'
import TreeView from '../src/tree_view'

describe("TreeView", () => {

  let app

  beforeEach(() => {
    app = new App()
  })

  describe("getting data", () => {

    let treeView

    beforeEach(() => {
      app.setTree({
        a: 'b',
        b: {c: ['d', 'e']},
        x: 1
      })
      treeView = new TreeView(app, {
        first: ['a'],
        second: ['b', 'c', 1]
      })
    })

    it("gets multiple attributes", () => {
      expect(treeView.get()).toEqual({first: 'b', second: 'e'})
    })
  })

  describe("setting data", () => {

    let treeView

    beforeEach(() => {
      treeView = new TreeView(app, {
        first: ['a'],
        second: ['b', 'c']
      })
    })

    it("sets multiple attributes", () => {
      expect(treeView.set({first: '1st', second: '2nd'}))
      expect(app.tree()).toEqual({a: '1st', b: {c: '2nd'}})
    })

    it("returns a setter function", () => {
      let setter = treeView.setter({first: '1st'})
      setter()
      expect(app.tree()).toEqual({a: '1st'})
    })
  })

  describe("watching", () => {
    let treeView, callback

    beforeEach(() => {
      callback = jasmine.createSpy('watchCallback')
      treeView = new TreeView(app, {
        first: ['a'],
        second: ['b', 'c']
      })
    })

    it("allows for watching the tree", () => {
      treeView.watch(callback)
      app.dirtyTracker.markChannelDirty('a')
      app.dirtyTracker.cleanAllDirty()
      expect(callback).toHaveBeenCalledWith(treeView)
    })

    it("doesn't call back if the relevant branches aren't touched", () => {
      treeView.watch(callback)
      app.dirtyTracker.markChannelDirty('z')
      app.dirtyTracker.cleanAllDirty()
      expect(callback).not.toHaveBeenCalled()
      //expect(thing.callback.calls.count()).toEqual(0)
    })

    it("allows unwatching", () => {
      treeView.watch(callback)
      treeView.unwatch()
      app.dirtyTracker.markChannelDirty('a')
      app.dirtyTracker.cleanAllDirty()
      expect(callback).not.toHaveBeenCalled()
    })
  })

})
