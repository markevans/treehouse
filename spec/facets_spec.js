import Tree from '../src/tree'
import Facets from '../src/facets'

describe("Facets", () => {

  let tree, facets

  beforeEach(() => {
    tree = new Tree()
    facets = new Facets(tree)
  })

  describe("adding facets", () => {

    beforeEach(() => {
      tree.at().update({
        name: 'googie'
      })
    })

    it("allows adding facets", () => {
      facets.register({
        'o nome': {
          cursors: {
            'nombre': ['name']
          },
          evaluate: ({nombre}) => {
            return nombre
          }
        }
      })
      expect(facets.get('o nome').call('o nome')).toEqual('googie')
    })
  })

})
