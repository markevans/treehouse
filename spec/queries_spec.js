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
      queries.register({
        oldestUsers: {
          deps: (t) => {
            return {
              users: t.at(['users'])
            }
          },
          get: () => { return 'some result' }
        }
      })
      let query = queries.find('oldestUsers')
      expect(query).toEqual(jasmine.any(Query))
      expect(query.get()).toEqual('some result')
    })

    it("returns nothing if not found", () => {
      expect(queries.find("iDoNotExist")).toBeUndefined()
    })
  })

})
