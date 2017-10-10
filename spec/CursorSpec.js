const Cursor = require('../lib/Cursor')

describe("Cursor", () => {
  let app, tree

  beforeEach(() => {
    app = {}
    tree = {pull: null, push: null}
  })

  describe("pulling data", () => {
    it("gets nested data", () => {
      spyOn(tree, 'pull').and.returnValue({animal: {type: 'Dog'}})
      const cursor = new Cursor(app, tree, ['animal', 'type'])
      expect(cursor.pull()).toEqual('Dog')
    })

    it("works fine with arrays", () => {
      spyOn(tree, 'pull').and.returnValue({users: ['Sam', 'Henry', 'Daisy']})
      const cursor = new Cursor(app, tree, ['users', 1])
      expect(cursor.pull()).toEqual('Henry')
    })

    it("returns undefined if the path doesn't match anything", () => {
      spyOn(tree, 'pull').and.returnValue({bligh: 'blagh'})
      const cursor = new Cursor(app, tree, ['doobie', 'mcgovern'])
      expect(cursor.pull()).toBeUndefined()
    })
  })

  describe("pushing data", () => {

    it("sets attributes", () => {
      const cursor = new Cursor(app, tree, ['animal', 'type'])
      spyOn(tree, 'push')
      cursor.push('Lion')
      expect(tree.push).toHaveBeenCalledWith({path: ['animal', 'type'], value: 'Lion'})
    })

  })

  describe("at", () => {
    let cursor

    beforeEach(() => {
      cursor = new Cursor(app, tree, ['users'])
    })

    it("returns a new cursor with the new path", () => {
      let newCursor = cursor.at(['new', 1])
      expect(newCursor).toEqual(jasmine.any(Cursor))
      expect(newCursor.path).toEqual(['users', 'new', 1])
    })

    it("allows splatting", () => {
      let newCursor = cursor.at('new', 1)
      expect(newCursor.path).toEqual(['users', 'new', 1])
    })
  })

})
