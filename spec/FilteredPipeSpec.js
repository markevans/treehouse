const FilteredPipe = require('../lib/FilteredPipe')

describe("FilteredPipe", () => {
  let app, name, source, spec, args, filteredPipe

  beforeEach(() => {
    app = {}
    name = 'someName'
    source = { push: null, pull: null, channels: null }
    spec = { filter: null, unfilter: null }
    args = { some: 'arg' }
  })

  describe("with filter and unfilter", () => {

    beforeEach(() => {
      filteredPipe = new FilteredPipe(app, source, name, spec, args)
    })

    it("returns the filtered data", () => {
      spyOn(source, 'pull').and.returnValue('value')
      spec.filter = (val, args) => val.toUpperCase() + args.some
      expect(filteredPipe.pull()).toEqual('VALUEarg')
    })

    it("back-propagates changes", () => {
      const spy = spyOn(source, 'push')
      spec.unfilter = (val, args) => val.replace(args.some, '').toLowerCase()
      filteredPipe.push('VALUEarg')
      expect(source.push).toHaveBeenCalledWith('value')
    })

    it("delegates channels to its source", () => {
      spyOn(source, 'channels').and.returnValue(new Set(['egg', 'heads']))
      expect(filteredPipe.channels()).toEqual(new Set(['egg', 'heads']))
    })

  })

  describe("when only a function is given", () => {

    beforeEach(() => {
      spec = jasmine.createSpy('filter')
      filteredPipe = new FilteredPipe(app, source, name, spec, args)
    })

    it("allows just giving a filter function", () => {
      spyOn(source, 'pull').and.returnValue('value')
      spec.and.returnValue('return value')
      expect(filteredPipe.pull()).toEqual('return value')
      expect(spec).toHaveBeenCalledWith('value', { some: 'arg' })
    })

    it("throws if tried to push", () => {
      expect(() => {
        filteredPipe.push('thing')
      }).toThrowError("You need to implement 'unfilter' on the 'someName' filter to be able to set through it")
    })
  })

})
