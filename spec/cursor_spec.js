import Tree from '../src/tree'
import Cursor from '../src/cursor'

describe("Cursor", () => {

  describe("setting data", () => {
    let tree, cursor

    beforeEach(() => {
      tree = new Tree({animal: {type: 'Dog'}})
      cursor = new Cursor(tree, ['animal', 'type'])
    })

    it("sets attributes", () => {
      cursor.set('Lion')
      expect(tree.get()).toEqual({animal: {type: 'Lion'}})
    })

    it("changes each object that has been changed", () => {
      let oldData = tree.get()
      cursor.set('Lion')
      let newData = tree.get()
      expect(oldData === newData).not.toBeTruthy()
      expect(oldData.animal === newData.animal).not.toBeTruthy()
    })

    it("creates intermediate objects if they don't already exist", () => {
      cursor = new Cursor(tree, ['friends', 'reunited'])
      cursor.set('gone forever')
      expect(tree.get().friends.reunited).toEqual('gone forever')
    })

  })

  describe("getting data", () => {
    let tree, cursor

    beforeEach(() => {
      tree = new Tree({animal: {type: 'Dog'}})
    })

    it("gets nested data", () => {
      let cursor = new Cursor(tree, ['animal', 'type'])
      expect(cursor.get()).toEqual('Dog')
    })

    it("returns undefined if the path doesn't match anything", () => {
      let cursor = new Cursor(tree, ['doobie', 'mcgovern'])
      expect(cursor.get()).toBeUndefined()
    })
  })

})
