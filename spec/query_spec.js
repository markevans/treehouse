import App from '../src/app'
import Query from '../src/query'

describe("Query", () => {

  let app, query

  beforeEach(() => {
    app = new App()
  })

  describe("getting", () => {

    beforeEach(() => {
      app.trunk().set({
        eggs: {
          id1: 'fried',
          id2: 'poached',
          id3: 'scrambled'
        },
        selectedStuff: {
          eggID: 'id2'
        }
      })
      query = new Query(app, (t) => {
        return {
          'selectedEggID': t.at(['selectedStuff', 'eggID']),
          'eggs': t.at(['eggs'])
        }
      }, ({selectedEggID, eggs}) => {
        return eggs[selectedEggID]
      })
    })

    it("evaluates using parts of the tree", () => {
      spyOn(query, 'getter').and.callThrough()
      expect(query.get()).toEqual('poached')
      expect(query.getter).toHaveBeenCalled()
    })

    it("caches the result if not changed", () => {
      expect(query.get()).toEqual('poached')
      spyOn(query, 'getter').and.callThrough()
      expect(query.get()).toEqual('poached')
      expect(query.getter).not.toHaveBeenCalled()
    })

    it("evaluates again if anything is changed", () => {
      expect(query.get()).toEqual('poached')
      app.at(['selectedStuff', 'eggID']).set('id3')
      expect(query.get()).toEqual('scrambled')
    })

    it("gets called even if not watching any paths", () => {
      query = new Query(app, () => { return {} }, () => {return 'still called'})
      expect(query.get()).toEqual('still called')
    })

  })

})

