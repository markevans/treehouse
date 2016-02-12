import Tree from '../src/tree'
import MultiCursor from '../src/multi_cursor'

describe("MultiCursor", () => {

  let tree

  beforeEach(() => {
    tree = new Tree()
  })

  describe("getting data", () => {

    let multiCursor

    beforeEach(() => {
      tree.at().update({
        a: 'b',
        b: {c: ['d', 'e']},
        x: 1
      })
      multiCursor = new MultiCursor(tree, {
        first: ['a'],
        second: ['b', 'c', 1]
      })
    })

    it("gets multiple attributes", () => {
      expect(multiCursor.get()).toEqual({first: 'b', second: 'e'})
    })
  })

  describe("setting data", () => {

    let multiCursor

    beforeEach(() => {
      multiCursor = new MultiCursor(tree, {
        first: ['a'],
        second: ['b', 'c']
      })
    })

    it("sets multiple attributes", () => {
      expect(multiCursor.set({first: '1st', second: '2nd'}))
      expect(tree.get().toJSON()).toEqual({a: '1st', b: {c: '2nd'}})
    })
  })

})
