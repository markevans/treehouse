const Bundle = require('../lib/Bundle')

describe("Bundle", () => {

  let source1, source2, bundle

  beforeEach(() => {
    source1 = { pull: null, push: null, channels: null }
    source2 = { pull: null, push: null, channels: null }
    bundle = new Bundle({ s1: source1, s2: source2 })
  })

  describe("pulling data", () => {

    it("gets multiple attributes", () => {
      spyOn(source1, 'pull').and.returnValue('one')
      spyOn(source2, 'pull').and.returnValue('two')
      expect(bundle.pull()).toEqual({s1: 'one', s2: 'two'})
    })

  })

  describe("pushing data", () => {

    it("forwards changes to its sources", () => {
      spyOn(source1, 'push')
      spyOn(source2, 'push')
      bundle.push({s1: 'A', s2: 'B'})
      expect(source1.push).toHaveBeenCalledWith('A')
      expect(source2.push).toHaveBeenCalledWith('B')
    })

    it("doesn't touch unchanged sources", () => {
      spyOn(source1, 'push')
      spyOn(source2, 'push')
      bundle.push({s1: 'A'})
      expect(source1.push).toHaveBeenCalledWith('A')
      expect(source2.push).not.toHaveBeenCalled()
    })

    it("throws if the source doesn't exist", () => {
      expect(() => {
        bundle.push({noExist: 'A'})
      }).toThrowError("Can't push change to non-existent source 'noExist'")
    })

  })

  describe("channels", () => {
    it("collates its sources channels", () => {
      spyOn(source1, 'channels').and.returnValue(new Set(['a', 'b']))
      spyOn(source2, 'channels').and.returnValue(new Set(['c']))
      expect(bundle.channels()).toEqual(new Set(['a', 'b', 'c']))
    })

    it("doesn't repeat a channel", () => {
      spyOn(source1, 'channels').and.returnValue(new Set(['a']))
      spyOn(source2, 'channels').and.returnValue(new Set(['a']))
      expect(bundle.channels()).toEqual(new Set(['a']))
    })
  })

})
