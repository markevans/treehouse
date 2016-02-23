import App from '../src/app'
import Filter from '../src/filter'
import FilteredStream from '../src/filtered_stream'

describe("FilteredStream", () => {
  let filteredStream, filter, source, app

  beforeEach(() => {
    app = new App()
    source = {
      get: () => {
        return 'egg'
      },
      set: () => {},
      channels: () => {
        return ['grog']
      }
    }
    filter = new Filter('upcase', {
      forward: (word) => { return word.toUpperCase() },
      reverse: (word) => { return word.toLowerCase() }
    })
    spyOn(source, 'set')
    filteredStream = new FilteredStream(app, source, filter)
  })

  it("returns the filtered data", () => {
    expect(filteredStream.get()).toEqual('EGG')
  })

  it("filters set data", () => {
    filteredStream.set('BUGS')
    expect(source.set).toHaveBeenCalledWith('bugs')
  })

  it("delegates channels to its source", () => {
    expect(filteredStream.channels()).toEqual(['grog'])
  })

})
