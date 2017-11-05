const Tree = require('../lib/Tree')
const Cursor = require('../lib/Cursor')
const Query = require('../lib/Query')

describe("Tree", () => {
  let tree, app

  beforeEach(() => {
    app = {
      dirtyTracker: {
        markChannelDirty: jasmine.createSpy('markChannelDirty')
      },
      queries: {
        find: null
      }
    }
    tree = new Tree(app)
  })

  describe("pull", () => {
    it("returns the whole tree", () => {
      tree.init({some: 'data'})
      expect(tree.pull()).toEqual({some: 'data'})
    })
  })

  describe("push", () => {
    let change1, change2

    beforeEach(() => {
      change1 = { path: ['blah'], value: 'schma', channels: new Set(['blah']) }
      change2 = { path: ['goo'], value: 'blub', channels: new Set(['goo']) }
    })

    it("adds to the changes", () => {
      expect(tree.changes()).toEqual([])
      tree.push(change1)
      expect(tree.changes()).toEqual([change1])
      tree.push(change2)
      expect(tree.changes()).toEqual([change1, change2])
    })
  })

  describe("applying changes", () => {
    let change1, change2

    beforeEach(() => {
      tree.init({
        users: [
          {name: 'Rogdolph', age: 137},
          {name: 'Gungsteed', age: 5},
        ],
        modalIsOpen: false
      })
      change1 = { path: ['users', 1, 'age'], value: 438, channels: new Set(['users', 'anotherOne']) }
      change2 = { path: ['modalIsOpen'], value: true, channels: new Set(['modalIsOpen']) }
    })

    it("applies each change", () => {
      tree.push(change1)
      tree.push(change2)
      tree.applyChanges()
      expect(tree.pull()).toEqual({
        users: [
          {name: 'Rogdolph', age: 137},
          {name: 'Gungsteed', age: 438},
        ],
        modalIsOpen: true
      })
    })

    it("creates new objects", () => {
      const usersBefore = tree.pull().users,
        user1Before = usersBefore[1]
      tree.push(change1)
      tree.applyChanges()
      const users = tree.pull().users,
        user1 = users[1]
      expect(usersBefore === users).toBeFalsy()
      expect(user1Before === user1).toBeFalsy()
    })

    it("empties changes afterwards", () => {
      tree.push(change1)
      tree.applyChanges()
      expect(tree.changes()).toEqual([])
    })

    it("tells the dirtyTracker", () => {
      tree.push(change1)
      expect(app.dirtyTracker.markChannelDirty).not.toHaveBeenCalled()
      tree.applyChanges()
      expect(app.dirtyTracker.markChannelDirty).toHaveBeenCalledWith('users')
      expect(app.dirtyTracker.markChannelDirty).toHaveBeenCalledWith('anotherOne')
    })
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
