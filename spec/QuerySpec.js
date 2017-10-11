const Query = require('../lib/Query')

describe("Query", () => {

  let app, name, spec, args, picker, treeView, query

  beforeEach(() => {
    app = { pick: null }
    name = 'someName'
    treeView = { pull: null, push: null }
    picker = t => ({
      'current': t.at(['currentPage']),
      'pages': t.at(['pages'])
    })
    spec = {
      pick: picker,
      get: ({pages, current}) => pages[current],
      set: null,
    }
    args = { some: 'args' }
  })

  describe('using a treeView', () => {
    it("creates a treeView with the picker", () => {
      spyOn(app, 'pick').and.returnValue(treeView)
      query = new Query(app, name, spec, args)
      expect(query.treeView()).toEqual(treeView)
    })
  })

  describe("pulling", () => {

    let spy

    beforeEach(() => {
      spyOn(app, 'pick').and.returnValue(treeView)
      query = new Query(app, name, spec, args)
      spy = spyOn(query.treeView(), 'pull')
      spy.and.returnValue({current: 1, pages: {1: 'one', 2: 'two'}})
    })

    it("delegates to the treeView", () => {
      spyOn(spec, 'get').and.callThrough()
      expect(query.pull()).toEqual('one')
      expect(spec.get).toHaveBeenCalled()
    })

    it("caches the result if not changed", () => {
      expect(query.pull()).toEqual('one')
      spyOn(spec, 'get').and.callThrough()
      expect(query.pull()).toEqual('one')
      expect(spec.get).not.toHaveBeenCalled()
    })

    it("evaluates again if anything is changed", () => {
      expect(query.pull()).toEqual('one')
      spy.and.returnValue({current: 2, pages: {1: 'one', 2: 'two'}})
      expect(query.pull()).toEqual('two')
    })

    it("also yields the args to the evaluator", () => {
      spyOn(spec, 'get').and.callThrough()
      query.pull()
      expect(spec.get.calls.argsFor(0)[1]).toEqual({ some: 'args' })
    })

  })

  describe("pushing changes through the query", () => {

    let treeViewPush

    beforeEach(() => {
      spyOn(app, 'pick').and.returnValue(treeView)
      query = new Query(app, name, spec, args)
      treeViewPush = spyOn(query.treeView(), 'push')
      spyOn(treeView, 'pull').and.returnValue({current: 'stuff'})
    })

    it("throws if not implemented", () => {
      spec.set = undefined
      expect(() => {
        query.push('blah')
      }).toThrowError("Query 'someName' doesn't implement set")
    })

    it("pushes changes to the treeview", () => {
      spec.set = (value) => ({ a: value })
      query.push('something')
      expect(treeViewPush).toHaveBeenCalledWith({a: 'something'})
    })

    it("yields current state and args", () => {
      spec.set = jasmine.createSpy('set')
      query.push('something')
      expect(spec.set).toHaveBeenCalledWith('something', {current: 'stuff'}, args)
    })

  })

})
