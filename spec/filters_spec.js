import Filters from '../src/filters'
import FilteredStream from '../src/filtered_stream'

describe("Filters", () => {

  let filters, source

  beforeEach(() => {
    filters = new Filters()
    source = {
      get: () => {
        return [4,5,2]
      }
    }
  })

  it("builds a registered filter", () => {
    filters.register({
      order: (array) => {
        return array.sort()
      }
    })
    let filteredStream = filters.buildStream(source, 'order')
    expect(filteredStream).toEqual(jasmine.any(FilteredStream))
    expect(filteredStream.get()).toEqual([2,4,5])
  })

  it("returns nothing if not found", () => {
    expect(() => {
      filters.buildStream(source, "iDoNotExist")
    }).toThrowError("Can't find filter 'iDoNotExist' as it's not defined")
  })

})
