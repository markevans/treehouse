const FilteredPipe = require('../lib/FilteredPipe')

describe("FilteredPipe", () => {
  let app, name, source, spec, args, filteredPipe

  beforeEach(() => {
    app = {}
    name = 'someName'
    source = { push: null, pull: null, channels: null }
    spec = { filter: null, unfilter: null }
    args = { some: 'arg' }
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
