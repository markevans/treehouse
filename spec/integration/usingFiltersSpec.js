const App = require('../../lib/App')

describe("Using filters", () => {

  let app

  beforeEach(() => {
    app = new App()
    app.init({
      words: ['glug']
    })
    app.registerFilters({
      upcase: {
        filter: text => text.toUpperCase(),
        unfilter: text => text.toLowerCase()
      },

      dubble: text => text+text,

      append: {
        filter: (string, {word}) => string + word,
        unfilter: (string, {word}) => string.replace(word, '') // lazy - should use regex
      }
    })
  })

  it("filters tree data", () => {
    const treeView = app.pick(t => ({
      word: t.at(['words', 0]).filter('upcase')
    }))
    expect(treeView.get()).toEqual({word: 'GLUG'})
  })

  it("works the other way", () => {
    const source = app.tree.at(['words', 0]).filter('upcase')
    expect(source.pull()).toEqual('GLUG')
    source.push('BONES')
    expect(app.tree.changes()).toEqual([{path: ['words', 0], value: 'bones', channels: new Set(['words'])}])
  })

  it("allows using args", () => {
    const cursor = app.tree.at('person', 'name')
    cursor.push('Mark')
    app.tree.applyChanges()
    const source = cursor.filter('append', {word: 'Extra'})
    expect(source.pull()).toEqual('MarkExtra')
    source.push('Joker')
    expect(app.tree.changes()).toEqual([{path: ['person', 'name'], value: 'Joker', channels: new Set(['person'])}])
  })

  it("filters query data", () => {
    app.registerQueries({
      firstWord: {
        pick: t => ({
          words: t.at(['words']),
        }),
        get: ({words}, {append}) => words[0]+append
      }
    })
    const treeView = app.pick(t => ({
      word: t.query('firstWord', {append: ' water'}).filter('upcase')
    }))
    expect(treeView.get()).toEqual({word: 'GLUG WATER'})
  })

  it("enables chaining filters", () => {
    const treeView = app.pick(t => ({
      word: t.at(['words', 0]).filter('upcase').filter('dubble')
    }))
    expect(treeView.get()).toEqual({word: 'GLUGGLUG'})
  })

})
