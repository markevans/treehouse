import App from '../src/app'
import Cursor from '../src/cursor'

describe("Cursor", () => {
  let app

  beforeEach(() => {
    app = new App()
  })

  describe("getting data", () => {
    let cursor

    beforeEach(() => {
      app.init({animal: {type: 'Dog'}})
    })

    it("gets nested data", () => {
      let cursor = new Cursor(app, ['animal', 'type'])
      expect(cursor.get()).toEqual('Dog')
    })

    it("works fine with arrays", () => {
      app.setTree({users: ['Sam', 'Henry', 'Daisy']})
      let cursor = new Cursor(app, ['users', 1])
      expect(cursor.get()).toEqual('Henry')
    })

    it("returns undefined if the path doesn't match anything", () => {
      let cursor = new Cursor(app, ['doobie', 'mcgovern'])
      expect(cursor.get()).toBeUndefined()
    })
  })

  describe("setting data", () => {
    let cursor

    beforeEach(() => {
      app.init({animal: {type: 'Dog'}})
      cursor = new Cursor(app, ['animal', 'type'])
    })

    it("sets attributes", () => {
      cursor.set('Lion')
      expect(app.tree()).toEqual({animal: {type: 'Lion'}})
    })

    it("changes each object that has been changed", () => {
      let oldData = app.tree()
      cursor.set('Lion')
      let newData = app.tree()
      expect(oldData === newData).not.toBeTruthy()
      expect(oldData.animal === newData.animal).not.toBeTruthy()
    })

    it("creates intermediate objects if they don't already exist", () => {
      cursor = new Cursor(app, ['friends', 'reunited'])
      cursor.set('gone forever')
      expect(app.tree().friends.reunited).toEqual('gone forever')
    })

    it("works fine on the trunk", () => {
      cursor = new Cursor(app, [])
      cursor.set({ok: 'guys'})
      expect(app.tree()).toEqual({ok: 'guys'})
    })

    it("allows setting with a function", () => {
      cursor.set((string) => {return string.toUpperCase()} )
      expect(app.tree()).toEqual({animal: {type: 'DOG'}})
    })

    it("throws an error if the function doesn't return", () => {
      expect(() => {
        cursor.set((oldUsers) => {} )
      }).toThrowError("You tried to set a value on the tree with undefined")
    })

  })

  describe("setting with a mutator", () => {
    let cursor

    beforeEach(() => {
      app.init({things: [1,2]})
      cursor = new Cursor(app, ['things'])
    })

    it("calls the appropriate mutator", () => {
      spyOn(app, 'mutate').and.returnValue([1, 2, 3, 4])
      cursor.setWith('push', 3, 4)
      expect(app.mutate).toHaveBeenCalledWith('push', [1, 2], 3, 4)
      expect(app.tree()).toEqual({things: [1, 2, 3, 4]})
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

})
