const App = require('../lib/App')
const Filters = require('../lib/Filters')
const FilteredStream = require('../lib/FilteredStream')

describe("Filters", () => {

  let filters, source, app

  describe("filtering", () => {
    beforeEach(() => {
      app = new App()
      filters = new Filters(app)
      source = {get: () => {}}
    })

    describe("with nothing registered", () => {
      it("buildStream throws", () => {
        expect(() => {
          filters.buildStream("iDoNotExist", source)
        }).toThrowError("Can't find filter 'iDoNotExist' as it's not defined")
      })

      it("filter throws", () => {
        expect(() => {
          filters.filter('iDoNotExist', {})
        }).toThrowError("Can't find filter 'iDoNotExist' as it's not defined")
      })

      it("unfilter throws", () => {
        expect(() => {
          filters.unfilter('iDoNotExist', {})
        }).toThrowError("Can't find filter 'iDoNotExist' as it's not defined")
      })
    })


    describe("with a normally registered filter", () => {
      beforeEach(() => {
        source = {
          get: () => {
            return [4,5,2]
          }
        }
        filters.register({
          order: (array) => {
            return array.sort()
          }
        })
      })

      it("builds a stream", () => {
        let filteredStream = filters.buildStream('order', source)
        expect(filteredStream).toEqual(jasmine.any(FilteredStream))
        expect(filteredStream.get()).toEqual([2,4,5])
      })

      it("filters data", () => {
        expect(filters.filter('order', [7,2])).toEqual([2,7])
      })

      it("throws on unfilter", () => {
        expect(() => {
          filters.unfilter('order', [7,2])
        }).toThrowError("Filter 'order' doesn't implement reverse")
      })
    })

    describe("when registered with reverse", () => {
      beforeEach(() => {
        source = {
          get: () => { return 'the source' },
          putBack: () => {}
        }
        spyOn(source, 'putBack').and.returnValue("change from source")
        filters.register({
          upcase: {
            forward: (string) => {
              return string.toUpperCase()
            },
            reverse: (string) => {
              return string.toLowerCase()
            }
          }
        })
      })

      it("builds a stream", () => {
        let filteredStream = filters.buildStream('upcase', source)
        expect(filteredStream).toEqual(jasmine.any(FilteredStream))
        expect(filteredStream.get()).toEqual('THE SOURCE')
        let change = filteredStream.putBack('SOMETHING')
        expect(source.putBack).toHaveBeenCalledWith('something')
        expect(change).toEqual('change from source')
      })

      it("filters data", () => {
        expect(filters.filter('upcase', 'doe')).toEqual('DOE')
      })

      it("unfilters data", () => {
        expect(filters.unfilter('upcase', 'DOE')).toEqual('doe')
      })
    })

  })

})
