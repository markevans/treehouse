import App from '../src/app'
import Facade from '../src/facade'

describe("Facade", () => {

  let app, facade

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
      facade = new Facade(app, {
        'selectedEggID': ['selectedStuff', 'eggID'],
        'eggs': ['eggs']
      }, ({selectedEggID, eggs}) => {
        return eggs[selectedEggID]
      })
    })

    it("evaluates using parts of the tree", () => {
      spyOn(facade, 'getter').and.callThrough()
      expect(facade.get()).toEqual('poached')
      expect(facade.getter).toHaveBeenCalled()
    })

    it("caches the result if not changed", () => {
      expect(facade.get()).toEqual('poached')
      spyOn(facade, 'getter').and.callThrough()
      expect(facade.get()).toEqual('poached')
      expect(facade.getter).not.toHaveBeenCalled()
    })

    it("evaluates again if anything is changed", () => {
      expect(facade.get()).toEqual('poached')
      app.at(['selectedStuff', 'eggID']).set('id3')
      expect(facade.get()).toEqual('scrambled')
    })

    it("gets called even if not watching any paths", () => {
      facade = new Facade(app, {}, () => {return 'still called'})
      expect(facade.get()).toEqual('still called')
    })

  })

})

