const Cursor = require('../lib/Cursor')

describe("Cursor", () => {
  let app

  beforeEach(() => {
    app = {
      tree: {
        pull: null,
        push: null
      }
    }
  })

  describe("pulling data", () => {
    it("gets nested data", () => {
      spyOn(app.tree, 'pull').and.returnValue({animal: {type: 'Dog'}})
      const cursor = new Cursor(app, ['animal', 'type'])
      expect(cursor.pull()).toEqual('Dog')
    })

    it("works fine with arrays", () => {
      spyOn(app.tree, 'pull').and.returnValue({users: ['Sam', 'Henry', 'Daisy']})
      const cursor = new Cursor(app, ['users', 1])
      expect(cursor.pull()).toEqual('Henry')
    })

    it("returns undefined if the path doesn't match anything", () => {
      spyOn(app.tree, 'pull').and.returnValue({bligh: 'blagh'})
      const cursor = new Cursor(app, ['doobie', 'mcgovern'])
      expect(cursor.pull()).toBeUndefined()
    })
  })

  describe("pushing data", () => {

    it("sets attributes", () => {
      const cursor = new Cursor(app, ['animal', 'type'])
      spyOn(app.tree, 'push')
      cursor.push('Lion')
      expect(app.tree.push).toHaveBeenCalledWith({
        path: ['animal', 'type'],
        value: 'Lion',
        channels: new Set(['animal'])
      })
    })

  })

  describe("at", () => {
    let cursor

    beforeEach(() => {
      cursor = new Cursor(app, ['users'])
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

  describe("channels", () => {
    it("returns a set with the main bough as the single element", () => {
      const cursor = new Cursor(app, ['users', 'best', 5])
      expect(cursor.channels()).toEqual(new Set(['users']))
    })
  })

})
