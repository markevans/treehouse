import App from '../lib/app'
import Filter from '../lib/filter'
import FilteredStream from '../lib/filtered_stream'

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
      forward: (word, {someArg}) => { return word.toUpperCase()+someArg },
      reverse: (word, {someArg}) => { return word.replace(someArg,'').toLowerCase() }
    })
    spyOn(source, 'set')
    filteredStream = new FilteredStream(app, source, filter, {someArg: ',SOMEARG'})
  })

  it("returns the filtered data", () => {
    expect(filteredStream.get()).toEqual('EGG,SOMEARG')
  })

  it("filters set data", () => {
    filteredStream.set('BUGS,SOMEARG')
    expect(source.set).toHaveBeenCalledWith('bugs')
  })

  it("delegates channels to its source", () => {
    expect(filteredStream.channels()).toEqual(['grog'])
  })

})
