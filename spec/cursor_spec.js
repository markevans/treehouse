import Tree from '../src/tree'
import Cursor from '../src/cursor'

describe("Cursor", () => {

  let tree

  beforeEach(() => {
    tree = new Tree()
  })

  describe("setting data", () => {

    let cursor

    beforeEach(() => {
      cursor = new Cursor(tree, ['animal'])
      cursor.set('type', 'Lion')
    })

    it("sets attributes", () => {
      expect(tree.toJSON()).toEqual({animal: {type: 'Lion'}})
    })

    it("update", () => {
      cursor.update(4)
      expect(tree.toJSON()).toEqual({animal: 4})
    })

    it("merges", () => {
      cursor.merge({size: 'very big'})
      expect(tree.toJSON()).toEqual({animal: {type: 'Lion', size: 'very big'}})
      cursor.merge({type: 'Tiger'})
      expect(tree.toJSON()).toEqual({animal: {type: 'Tiger', size: 'very big'}})
    })

    it("merges with another object", () => {
      cursor.reverseMerge({size: 'very big'})
      expect(tree.toJSON()).toEqual({animal: {type: 'Lion', size: 'very big'}})
      cursor.reverseMerge({type: 'Tiger'})
      expect(tree.toJSON()).toEqual({animal: {type: 'Lion', size: 'very big'}})
    })
  })

})
