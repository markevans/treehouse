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

  describe("creating with a factory", () => {

    beforeEach(() => {
      app = { filters: { find: spy('filters.find') }}
      name = 'someName'
      source = {}
      spec = {}
      args = {}
    })

    it("creates a named filter if given a string", () => {
      app.filters.find.and.returnValue(spec)
      filteredPipe = FilteredPipe.create(app, source, name, args)
      expect(filteredPipe.app).toEqual(app)
      expect(filteredPipe.source).toEqual(source)
      expect(filteredPipe.name).toEqual(name)
      expect(filteredPipe.spec).toEqual(spec)
      expect(filteredPipe.args).toEqual(args)
    })

    it("creates an anonymous filter if given a function", () => {
      let filter = a => a*2
      filteredPipe = FilteredPipe.create(app, source, filter, args)
      expect(filteredPipe.app).toEqual(app)
      expect(filteredPipe.source).toEqual(source)
      expect(filteredPipe.name).toEqual('anonymous')
      expect(filteredPipe.spec).toEqual(filter)
      expect(filteredPipe.args).toEqual(args)
    })

    it("creates an anonymous filter if given a spec object", () => {
      filteredPipe = FilteredPipe.create(app, source, spec, args)
      expect(filteredPipe.app).toEqual(app)
      expect(filteredPipe.source).toEqual(source)
      expect(filteredPipe.name).toEqual('anonymous')
      expect(filteredPipe.spec).toEqual(spec)
      expect(filteredPipe.args).toEqual(args)
    })

  })

})
