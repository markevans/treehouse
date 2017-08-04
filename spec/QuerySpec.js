const App = require('../lib/App')
const Query = require('../lib/Query')

describe("Query", () => {

  let app, query

  beforeEach(() => {
    app = new App()
    app.init({
      pages: ['zero', 'one'],
      currentPage: 1
    })
    query = new Query(app, 'currentPageName',
      (t) => {
        return {
          'current': t.at(['currentPage']),
          'pages': t.at(['pages'])
        }
      },
      {},
      ({pages, current}) => {
        return pages[current]
      }
    )
  })

  describe("getting", () => {

    describe("using the tree", () => {

      it("evaluates using parts of the tree", () => {
        spyOn(query, 'getter').and.callThrough()
        expect(query.get()).toEqual('one')
        expect(query.getter).toHaveBeenCalled()
      })

      it("caches the result if not changed", () => {
        expect(query.get()).toEqual('one')
        spyOn(query, 'getter').and.callThrough()
        expect(query.get()).toEqual('one')
        expect(query.getter).not.toHaveBeenCalled()
      })

      it("evaluates again if anything is changed", () => {
        expect(query.get()).toEqual('one')
        app.at(['currentPage']).set(0)
        expect(query.get()).toEqual('zero')
      })

      it("gets called even if not watching any paths", () => {
        query = new Query(app, 'name', () => { return {} }, {}, () => {return 'still called'})
        expect(query.get()).toEqual('still called')
      })

    })

    describe("using args", () => {
      beforeEach(() => {
        query = new Query(app, 'name', ()=>{}, {number: 4},
          ({}, {number}) => {
            return number
          }
        )
      })

      it("yields the args to the evaluator", () => {
        expect(query.get()).toEqual(4)
      })
    })

  })

  describe("getting changes through the query", () => {

    it("throws if not implemented", () => {
      expect(() => {
        query.putBack('blah')
      }).toThrowError("Query 'currentPageName' doesn't implement change")
    })

    it("returns changes via the passed in change function", () => {
      query = new Query(app, 'currentPageName',
        (t) => {
          return {
            'current': t.at(['currentPage']),
            'pages': t.at(['pages'])
          }
        },
        {some: 'arg'},
        ({pages, current}) => { return pages[current] }, // getter
        (value, {pages, current}) => {   // change function
          return {
            current: pages.indexOf(value)
          }
        }
      )
      expect(query.get()).toEqual('one')
      let changes = query.putBack('zero')
      expect(changes).toEqual([
        {path: ['currentPage'], value: 0}
      ])
    })

    it("yields args", () => {
      let changer = jasmine.createSpy('changer')
      query = new Query(app, 'pass args', {},
        {some: 'arg'},
        () => {}, // getter
        changer   // changer
      )
      query.putBack('something')
      expect(changer).toHaveBeenCalledWith('something', {}, {some: 'arg'})
    })

  })
})
