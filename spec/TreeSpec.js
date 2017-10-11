const Tree = require('../lib/Tree')
const Cursor = require('../lib/Cursor')
const Query = require('../lib/Query')

describe("Tree", () => {
  let tree, app

  beforeEach(() => {
    app = { queries: { find: null } }
    tree = new Tree(app)
  })

  describe("pull", () => {
  })

  describe("push", () => {
  })

  describe("at", () => {
    it("returns a new cursor with the new path", () => {
      let cursor = tree.at(['new', 1])
      expect(cursor).toEqual(jasmine.any(Cursor))
      expect(cursor.app).toEqual(tree.app)
      expect(cursor.path).toEqual(['new', 1])
    })

    it("allows splatting", () => {
      let cursor = tree.at('new', 1)
      expect(cursor.path).toEqual(['new', 1])
    })
  })

  describe("query", () => {
    it("returns a new query with the correct attributes", () => {
      const spec = {}
      spyOn(app.queries, 'find').and.returnValue(spec)
      let query = tree.query('currentPage', { some: 'args' })
      expect(query).toEqual(jasmine.any(Query))
      expect(query.app).toEqual(query.app)
      expect(query.name).toEqual('currentPage')
      expect(query.spec).toEqual(spec)
      expect(query.args).toEqual({ some: 'args' })
    })
  })

})
