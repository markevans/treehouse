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
          set (names, {users, selected}) {
            let ids = [], usrs = users.get(), key
            for (key in usrs) {
              if (names.indexOf(usrs[key].name) > -1) { ids.push(key) }
            }
            selected.set(ids)
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

    it("correctly sets", () => {
      let selectedUsers = app.query('selectedUsers')
      selectedUsers.set(['Agbo', 'Blumy'])
      expect(app.tree()).toEqual({
        users: {
          a: {name: 'Agbo'},
          b: {name: 'Blumy'},
          c: {name: 'Celia'}
        },
        selectedIDs: ['a', 'b']
      })
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
