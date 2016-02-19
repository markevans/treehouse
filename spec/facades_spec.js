import App from '../src/app'
import Facade from '../src/facade'
import Facades from '../src/facades'

describe("Facades", () => {

  let app, facades

  beforeEach(() => {
    app = new App()
    facades = new Facades(app)
  })

  describe("registering and finding", () => {
    it("finds a registered facade", () => {
      facades.register([
        {
          path: ['users', 'oldest'],
          deps: {
            users: ['users']
          },
          get: () => { return 'some result' }
        }
      ])
      let facade = facades.find(['users', 'oldest'])
      expect(facade).toEqual(jasmine.any(Facade))
      expect(facade.treeView.pathMap).toEqual({users: ['users']})
      expect(facade.get()).toEqual('some result')
    })

    it("returns nothing if not found", () => {
      expect(facades.find(["i", "don't", "exist"])).toBeUndefined()
    })
  })

})
