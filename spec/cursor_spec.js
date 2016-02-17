import App from '../src/app'
import Cursor from '../src/cursor'

describe("Cursor", () => {

  describe("setting data", () => {
    let app, cursor

    beforeEach(() => {
      app = new App({animal: {type: 'Dog'}})
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

  })

  describe("getting data", () => {
    let app, cursor

    beforeEach(() => {
      app = new App({animal: {type: 'Dog'}})
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

})
