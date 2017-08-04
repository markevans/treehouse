const App = require('../../lib/App')

describe("Using queries", () => {

  let app

  beforeEach(() => {
    app = new App()
  })

  describe("using a treeview with mixed cursors/queries", () => {

    let treeView

    beforeEach(() => {
      app.init({
        users: {
          a: {name: 'Agbo'},
          b: {name: 'Blumy'},
          c: {name: 'Celia'}
        },
        selectedIDs: ['a', 'c']
      })
      app.registerQueries({
        selectedUsers: {
          deps (t) {
            return {
              users: t.at(['users']),
              selected: t.at(['selectedIDs'])
            }
          },
          get ({users, selected}) {
            let key, selectedUsers = []
            for(key in users) {
              if (selected.indexOf(key) > -1) { selectedUsers.push(users[key].name) }
            }
            return selectedUsers
          },
          change (names, {users}) {
            let ids = [], key
            for (key in users) {
              if (names.indexOf(users[key].name) > -1) { ids.push(key) }
            }
            return {selected: ids}
          }
        }
      })
    })

    it("correctly gets data", () => {
      treeView = app.treeView((t) => {
        return {
          IDs: t.at(['selectedIDs']),
          users: t.query('selectedUsers')
        }
      })
      expect(treeView.get()).toEqual({
        IDs: ['a', 'c'],
        users: ['Agbo', 'Celia']
      })
    })

    it("correctly updates", () => {
      treeView = app.treeView((t) => {
        return {
          users: t.query('selectedUsers')
        }
      })
      let spy = jasmine.createSpy('watcher')
      treeView.watch(spy)
      app.at(['selectedIDs']).set(['b'])
      app.commit()
      expect(spy).toHaveBeenCalled()
    })

    it("correctly back-propagates changes", () => {
      let selectedUsers = app.query('selectedUsers')
      let changes = selectedUsers.putBack(['Agbo', 'Blumy'])
      expect(changes).toEqual([{path: ['selectedIDs'], value: ['a', 'b']}])
    })

    it("back-propagates correctly with nested queries", () => {
      app.registerQueries({
        passThrough: {
          deps (t) {
            return {
              selectedUsers: t.query('selectedUsers')
            }
          },
          get ({selectedUsers}) {
            return selectedUsers
          },
          change (users) {
            return {
              selectedUsers: users
            }
          }
        }
      })
      let users = app.query('passThrough')
      let changes = users.putBack(['Agbo', 'Blumy'])
      expect(changes).toEqual([{path: ['selectedIDs'], value: ['a', 'b']}])
    })

    it("uses the args", () => {
      app.registerQueries({
        returnArgs: {
          get: ({}, args) => {
            return args
          }
        }
      })
      treeView = app.treeView((t) => {
        return {
          theArgs: t.query('returnArgs', {a: 1})
        }
      })
      expect(treeView.get()).toEqual({
        theArgs: {a: 1}
      })
    })

  })

})
