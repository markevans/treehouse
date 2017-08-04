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

      append: {
        forward: (string, {word}) => {
          return string + word
        },
        reverse: (string, {word}) => {
          return string.replace(word, '') // lazy - should use regex
        }
      }
    })
  })

  it("filters tree data", () => {
    treeView = app.treeView((t) => {
      return {
        word: t.at(['words', 0]).filter('upcase')
      }
    })
    expect(treeView.get()).toEqual({word: 'GLUG'})
  })

  it("works the other way", () => {
    let stream = app.at(['words', 0]).filter('upcase')
    expect(stream.get()).toEqual('GLUG')
    let changes = stream.putBack('BONES')
    expect(changes).toEqual([{path: ['words', 0], value: 'bones'}])
  })

  it("allows using args", () => {
    let cursor = app.at('person', 'name')
    cursor.set('Mark')
    let stream = cursor.filter('append', {word: 'Extra'})
    expect(stream.get()).toEqual('MarkExtra')
    let changes = stream.putBack('Joker')
    expect(changes).toEqual([{path: ['person', 'name'], value: 'Joker'}])
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
    treeView = app.treeView((t) => {
      return {
        word: t.query('firstWord', {append: ' water'}).filter('upcase')
      }
    })
    expect(treeView.get()).toEqual({word: 'GLUG WATER'})
  })

  it("enables chaining filters", () => {
    treeView = app.treeView((t) => {
      return {
        word: t.at(['words', 0]).filter('upcase').filter('dubble')
      }
    })
    expect(treeView.get()).toEqual({word: 'GLUGGLUG'})
  })

})
