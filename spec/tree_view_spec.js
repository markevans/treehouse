import Tree from '../src/tree'
import TreeView from '../src/tree_view'

describe("TreeView", () => {

  let tree

  beforeEach(() => {
    tree = new Tree()
  })

  describe("getting data", () => {

    let treeView

    beforeEach(() => {
      tree.at().update({
        a: 'b',
        b: {c: ['d', 'e']},
        x: 1
      })
      treeView = new TreeView(tree, {
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
      treeView = new TreeView(tree, {
        first: ['a'],
        second: ['b', 'c']
      })
    })

    it("sets multiple attributes", () => {
      expect(treeView.set({first: '1st', second: '2nd'}))
      expect(tree.get().toJSON()).toEqual({a: '1st', b: {c: '2nd'}})
    })
  })

})
