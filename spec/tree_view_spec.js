import Tree from '../src/tree'
import DirtyTracker from '../src/dirty_tracker'
import TreeView from '../src/tree_view'

describe("TreeView", () => {

  let tree, dirtyTracker

  beforeEach(() => {
    tree = new Tree()
    dirtyTracker = new DirtyTracker()
  })

  describe("getting data", () => {

    let treeView

    beforeEach(() => {
      tree.at().update({
        a: 'b',
        b: {c: ['d', 'e']},
        x: 1
      })
      treeView = new TreeView(tree, dirtyTracker, {
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
      treeView = new TreeView(tree, dirtyTracker, {
        first: ['a'],
        second: ['b', 'c']
      })
    })

    it("sets multiple attributes", () => {
      expect(treeView.set({first: '1st', second: '2nd'}))
      expect(tree.get().toJSON()).toEqual({a: '1st', b: {c: '2nd'}})
    })

    it("returns a setter function", () => {
      let setter = treeView.setter({first: '1st'})
      setter()
      expect(tree.get().toJSON()).toEqual({a: '1st'})
    })
  })

  describe("watching", () => {
    let treeView, callback

    beforeEach(() => {
      callback = jasmine.createSpy('watchCallback')
      treeView = new TreeView(tree, dirtyTracker, {
        first: ['a'],
        second: ['b', 'c']
      })
    })

    it("allows for watching the tree", () => {
      treeView.watch(callback)
      dirtyTracker.markBranchDirty('a')
      dirtyTracker.cleanAllDirty()
      expect(callback).toHaveBeenCalledWith(treeView)
    })

    it("doesn't call back if the relevant branches aren't touched", () => {
      treeView.watch(callback)
      dirtyTracker.markBranchDirty('z')
      dirtyTracker.cleanAllDirty()
      expect(callback).not.toHaveBeenCalled()
      //expect(thing.callback.calls.count()).toEqual(0)
    })

    it("allows unwatching", () => {
      treeView.watch(callback)
      treeView.unwatch()
      dirtyTracker.markBranchDirty('a')
      dirtyTracker.cleanAllDirty()
      expect(callback).not.toHaveBeenCalled()
    })
  })

})
