import App from '../lib/app'
import Query from '../lib/query'
import Queries from '../lib/queries'

describe("Queries", () => {

  let app, queries

  beforeEach(() => {
    app = new App()
    queries = new Queries(app)
  })

  describe("registering and building", () => {
    it("builds a registered query", () => {
      queries.register({
        oldestUsers: {
          deps: (t) => {
            return {
              users: t.at(['users'])
            }
          },
          get: ({}, {append}) => { return 'some result '+append }
        }
      })
      let query = queries.build('oldestUsers', {append: 'word'})
      expect(query).toEqual(jasmine.any(Query))
      expect(query.get()).toEqual('some result word')
    })

    it("returns nothing if not found", () => {
      expect(() => {
        queries.build("iDoNotExist")
      }).toThrowError("Can't build query 'iDoNotExist' as it's not defined")
    })
  })

})
