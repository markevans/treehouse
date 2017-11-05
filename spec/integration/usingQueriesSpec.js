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
          pick: t => ({
            users: t.at(['users']),
            selected: t.at(['selectedIDs'])
          }),
          get ({users, selected}) {
            let key, selectedUsers = []
            for(key in users) {
              if (selected.indexOf(key) > -1) { selectedUsers.push(users[key].name) }
            }
            return selectedUsers
          },
          set (names, {users}) {
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
      treeView = app.pick(t => ({
        IDs: t.at(['selectedIDs']),
        users: t.query('selectedUsers')
      }))
      expect(treeView.get()).toEqual({
        IDs: ['a', 'c'],
        users: ['Agbo', 'Celia']
      })
    })

    it("correctly updates", () => {
      let users
      treeView = app.pick(t => t.query('selectedUsers'))
      treeView.watch(u => {
        users = u
      })
      app.tree.at('selectedIDs').push('b')
      app.commitChanges()
      expect(users).toEqual(['Blumy'])
    })

    it("back-propagates correctly with nested queries", () => {
      app.registerQueries({
        passThrough: {
          pick: t => ({
            selectedUsers: t.query('selectedUsers')
          }),
          get ({selectedUsers}) {
            return selectedUsers
          },
          set (users) {
            return {
              selectedUsers: users
            }
          }
        }
      })
      let users = app.pick(t => t.query('passThrough'))
      users.push(['Agbo', 'Blumy'])
      expect(app.tree.changes()).toEqual([{
        path: ['selectedIDs'],
        value: ['a', 'b'],
        channels: new Set(['selectedIDs'])
      }])
    })

    it("uses the args", () => {
      app.registerQueries({
        returnArgs: {
          pick: t => ({}),
          get: ({}, args) => {
            return args
          }
        }
      })
      treeView = app.pick(t => ({
        theArgs: t.query('returnArgs', {a: 1})
      }))
      expect(treeView.get()).toEqual({
        theArgs: {a: 1}
      })
    })

  })

})
