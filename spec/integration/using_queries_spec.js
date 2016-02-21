import App from '../../src/app'

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
          deps: (t) => {
            return {
              users: t.at(['users']),
              selected: t.at(['selectedIDs'])
            }
          },
          get: ({users, selected}) => {
            let key, selectedUsers = []
            for(key in users) {
              if (selected.indexOf(key) > -1) { selectedUsers.push(users[key].name) }
            }
            return selectedUsers
          }
        }
      })
    })

    it("correctly gets data", () => {
      treeView = app.pick((t) => {
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
      treeView = app.pick((t) => {
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

    it("uses the args", () => {
      app.registerQueries({
        returnArgs: {
          get: ({}, args) => {
            return args
          }
        }
      })
      treeView = app.pick((t) => {
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
