const App = require('../../lib/App')

describe("Using filters", () => {

  let app, treeView

  beforeEach(() => {
    app = new App()
    app.init({
      words: ['glug']
    })
    app.registerFilters({
      upcase: {
        forward: (text) => {
          return text.toUpperCase()
        },
        reverse: (text) => {
          return text.toLowerCase()
        }
      },

      dubble: (text) => {
        return text+text
      },

      extractAttr: {
        forward: (obj, {attr}) => {
          return obj[attr]
        },
        reverse: (value, {attr}) => {
          let obj = {}
          obj[attr] = value
          return obj
        }
      }
    })
  })

  it("filters tree data", () => {
    treeView = app.pick((t) => {
      return {
        word: t.at(['words', 0]).filter('upcase')
      }
    })
    expect(treeView.get()).toEqual({word: 'GLUG'})
  })

  it("works the other way", () => {
    let stream = app.at(['words', 0]).filter('upcase')
    expect(stream.get()).toEqual('GLUG')
    stream.set('BONES')
    expect(stream.get()).toEqual('BONES')
    expect(app.at('words').get()).toEqual(['bones'])
  })

  it("allows using args", () => {
    let cursor = app.at('person')
    cursor.set({name: 'Mark'})
    let stream = cursor.filter('extractAttr', {attr: 'name'})
    expect(stream.get()).toEqual('Mark')
    stream.set('Joker')
    expect(stream.get()).toEqual('Joker')
    expect(cursor.get()).toEqual({name: 'Joker'})
  })

  it("filters query data", () => {
    app.registerQueries({
      firstWord: {
        deps: (t) => {
          return {
            words: t.at(['words']),
          }
        },
        get: ({words}, {append}) => {
          return words[0]+append
        }
      }
    })
    treeView = app.pick((t) => {
      return {
        word: t.query('firstWord', {append: ' water'}).filter('upcase')
      }
    })
    expect(treeView.get()).toEqual({word: 'GLUG WATER'})
  })

  it("enables chaining filters", () => {
    treeView = app.pick((t) => {
      return {
        word: t.at(['words', 0]).filter('upcase').filter('dubble')
      }
    })
    expect(treeView.get()).toEqual({word: 'GLUGGLUG'})
  })

})
