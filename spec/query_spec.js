import App from '../lib/app'
import Query from '../lib/query'

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

  describe("setting through the query", () => {

    it("throws if not implemented", () => {
      expect(() => {
        query.set()
      }).toThrowError("Query 'currentPageName' doesn't implement set")
    })

    it("sets via the passed in setter", () => {
      query = new Query(app, 'currentPageName',
        (t) => {
          return {
            'current': t.at(['currentPage']),
            'pages': t.at(['pages'])
          }
        },
        {some: 'arg'},
        ({pages, current}) => { return pages[current] }, // getter
        (value, {pages, current}) => {   // setter
          current.set(pages.get().indexOf(value))
        }
      )
      expect(query.get()).toEqual('one')
      query.set('zero')
      expect(query.get()).toEqual('zero')
      expect(app.tree()).toEqual({pages: ['zero', 'one'], currentPage: 0})
    })

    it("yields args", () => {
      let setter = jasmine.createSpy('setter')
      query = new Query(app, 'pass args', {},
        {some: 'arg'},
        () => {}, // getter
        setter    // setter
      )
      query.set('something')
      expect(setter).toHaveBeenCalledWith('something', {}, {some: 'arg'})
    })

  })
})

