import App from '../src/app'
import Filters from '../src/filters'
import FilteredStream from '../src/filtered_stream'

describe("Filters", () => {

  let filters, source, app

  describe("filtering", () => {
    beforeEach(() => {
      app = new App()
      filters = new Filters(app)
      source = {
        get: () => {
          return [4,5,2]
        }
      }
    })

    describe("with nothing registered", () => {
      it("buildStream throws", () => {
        expect(() => {
          filters.buildStream("iDoNotExist", source)
        }).toThrowError("Can't find filter 'iDoNotExist' as it's not defined")
      })

      it("filter throws", () => {
        expect(() => {
          filters.filter('iDoNotExist', source)
        }).toThrowError("Can't find filter 'iDoNotExist' as it's not defined")
      })
    })


    describe("with a normally registered filter", () => {
      beforeEach(() => {
        filters.register({
          order: (array) => {
            return array.sort()
          }
        })
      })

      it("builds a registered filter", () => {
        let filteredStream = filters.buildStream('order', source)
        expect(filteredStream).toEqual(jasmine.any(FilteredStream))
        expect(filteredStream.get()).toEqual([2,4,5])
      })

      it("filters data", () => {
        expect(filters.filter('order', [7,2])).toEqual([2,7])
      })
    })

  })

})
