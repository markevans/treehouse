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
      app.registerQueries([
        {
          path: ['users', 'selected'],
          deps: {
            users: ['users'],
            selected: ['selectedIDs']
          },
          get: ({users, selected}) => {
            let key, selectedUsers = []
            for(key in users) {
              if (selected.indexOf(key) > -1) { selectedUsers.push(users[key].name) }
            }
            return selectedUsers
          }
        }
      ])
    })

    it("correctly gets data", () => {
      treeView = app.pick({
        IDs: ['selectedIDs'],
        users: ['users', 'selected']
      })
      expect(treeView.get()).toEqual({
        IDs: ['a', 'c'],
        users: ['Agbo', 'Celia']
      })
    })

    it("correctly updates", () => {
      treeView = app.pick({
        users: ['users', 'selected']
      })
      let spy = jasmine.createSpy('watcher')
      treeView.watch(spy)
      app.at(['selectedIDs']).set(['b'])
      app.commit()
      expect(spy).toHaveBeenCalled()
    })
  })

})
