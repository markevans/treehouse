import Tree from '../src/tree'
import Facet from '../src/facet'

describe("Facet", () => {

  let tree, facet

  beforeEach(() => {
    tree = new Tree()
  })

  describe("evaluating", () => {

    beforeEach(() => {
      tree.at().update({
        eggs: {
          id1: 'fried',
          id2: 'poached',
          id3: 'scrambled'
        },
        selectedStuff: {
          eggID: 'id2'
        }
      })
      facet = new Facet(tree, {
        'selectedEggID': ['selectedStuff', 'eggID'],
        'eggs': ['eggs']
      }, ({selectedEggID, eggs}) => {
        return eggs.get(selectedEggID)
      })
    })

    it("evaluates using parts of the tree", () => {
      expect(facet.call()).toEqual('poached')
    })

    it("caches the result if not changed", () => {
      expect(facet.call()).toEqual('poached')
      spyOn(facet, 'evaluator').and.callThrough()
      expect(facet.call()).toEqual('poached')
      expect(facet.evaluator).not.toHaveBeenCalled()
    })

    it("evaluates again if anything is changed", () => {
      tree.at('selectedStuff').set('eggID', 'id3')
      expect(facet.call()).toEqual('scrambled')
    })

  })

})
