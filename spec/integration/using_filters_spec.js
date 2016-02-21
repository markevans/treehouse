import App from '../../src/app'

describe("Using filters", () => {

  let app, treeView

  beforeEach(() => {
    app = new App()
    app.init({
      words: ['glug']
    })
    app.registerFilters({
      upcase: (text) => {
        return text.toUpperCase()
      },
      dubble: (text) => {
        return text+text
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
