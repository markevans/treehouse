import App from '../src/app'
import Query from '../src/query'
import Queries from '../src/queries'

describe("Queries", () => {

  let app, queries

  beforeEach(() => {
    app = new App()
    queries = new Queries(app)
  })

  describe("registering and finding", () => {
    it("finds a registered query", () => {
      queries.register([
        {
          path: ['users', 'oldest'],
          deps: {
            users: ['users']
          },
          get: () => { return 'some result' }
        }
      ])
      let query = queries.find(['users', 'oldest'])
      expect(query).toEqual(jasmine.any(Query))
      expect(query.treeView.pathMap).toEqual({users: ['users']})
      expect(query.get()).toEqual('some result')
    })

    it("returns nothing if not found", () => {
      expect(queries.find(["i", "don't", "exist"])).toBeUndefined()
    })
  })

})
