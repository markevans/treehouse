import App from '../src/app'
import FilteredStream from '../src/filtered_stream'

describe("FilteredStream", () => {
  let filteredStream, source, app

  beforeEach(() => {
    app = new App()
    source = {
      get: () => {
        return 'egg'
      },
      channels: () => {
        return ['grog']
      }
    }
    filteredStream = new FilteredStream(app, source, (word) => { return word.toUpperCase() })
  })

  it("returns the filtered data", () => {
    expect(filteredStream.get()).toEqual('EGG')
  })

  it("delegates channels to its source", () => {
    expect(filteredStream.channels()).toEqual(['grog'])
  })

})
