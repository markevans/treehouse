const TreeView = require('../lib/TreeView')

describe("TreeView", () => {

  let app, tree, picker, source1, source2, treeView

  beforeEach(() => {
    app = {}
    tree = {}
    source1 = { pull: null, push: null, channels: null }
    source2 = { pull: null, push: null, channels: null }
    picker = jasmine.createSpy().and.returnValue({ s1: source1, s2: source2 })
    treeView = new TreeView(app, tree, picker)
  })

  describe("initializing", () => {

    it("yields the tree in the picker", () => {
      expect(treeView.sources()).toEqual({ s1: source1, s2: source2 })
      expect(picker).toHaveBeenCalledWith(tree)
    })

  })

  describe("pulling data", () => {

    it("gets multiple attributes", () => {
      spyOn(source1, 'pull').and.returnValue('one')
      spyOn(source2, 'pull').and.returnValue('two')
      expect(treeView.pull()).toEqual({s1: 'one', s2: 'two'})
    })

  })

  describe("pushing data", () => {

    it("forwards changes to its sources", () => {
      spyOn(source1, 'push')
      spyOn(source2, 'push')
      treeView.push({s1: 'A', s2: 'B'})
      expect(source1.push).toHaveBeenCalledWith('A')
      expect(source2.push).toHaveBeenCalledWith('B')
    })

    it("doesn't touch unchanged sources", () => {
      spyOn(source1, 'push')
      spyOn(source2, 'push')
      treeView.push({s1: 'A'})
      expect(source1.push).toHaveBeenCalledWith('A')
      expect(source2.push).not.toHaveBeenCalled()
    })

    it("throws if the source doesn't exist", () => {
      expect(() => {
        treeView.push({noExist: 'A'})
      }).toThrowError("Can't push change to non-existent source 'noExist'")
    })

  })

  describe("channels", () => {
    it("collates its sources channels", () => {
      spyOn(source1, 'channels').and.returnValue(new Set(['a', 'b']))
      spyOn(source2, 'channels').and.returnValue(new Set(['c']))
      expect(treeView.channels()).toEqual(new Set(['a', 'b', 'c']))
    })

    it("doesn't repeat a channel", () => {
      spyOn(source1, 'channels').and.returnValue(new Set(['a']))
      spyOn(source2, 'channels').and.returnValue(new Set(['a']))
      expect(treeView.channels()).toEqual(new Set(['a']))
    })
  })

})
