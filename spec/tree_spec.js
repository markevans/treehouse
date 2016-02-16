import Tree from '../src/tree'

describe("Tree", () => {

  let tree

  beforeEach(() => {
    tree = new Tree()
  })

  describe("pick", () => {
    it("picks various things off the tree", () => {
      let treeView = tree.pick({
        name: ['users', 'abc123'],
        plant: ['berryType']
      })
      tree.at().update({
        users: {abc123: 'donnie'},
        berryType: 'bubbleberry'
      })
      expect(treeView.get()).toEqual({
        name: 'donnie',
        plant: 'bubbleberry'
      })
    })
  })

})
