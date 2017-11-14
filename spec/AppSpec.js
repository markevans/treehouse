const App = require('../lib/App')

describe("App", () => {

  let app, spec

  beforeEach(() => {
    app = new App()
    spec = {}
  })

  it("allows initializing", () => {
    app.init({some: 'stuff'})
    expect(app.tree.pull()).toEqual({some: 'stuff'})
  })

  it("registers a single query", () => {
    spyOn(app.queries, 'register')
    app.registerQuery('qu1', spec)
    expect(app.queries.register).toHaveBeenCalledWith('qu1', spec)
  })

  it("registers multiple queries", () => {
    spyOn(app.queries, 'registerMany')
    app.registerQueries({qu1: spec})
    expect(app.queries.registerMany).toHaveBeenCalledWith({qu1: spec})
  })

  it("registers a single filter", () => {
    spyOn(app.filters, 'register')
    app.registerFilter('f1', spec)
    expect(app.filters.register).toHaveBeenCalledWith('f1', spec)
  })

  it("registers many filters", () => {
    spyOn(app.filters, 'registerMany')
    app.registerFilters({f1: spec})
    expect(app.filters.registerMany).toHaveBeenCalledWith({f1: spec})
  })

  it("registers a single event", () => {
    spyOn(app.events, 'register')
    app.registerEvent('e1', spec)
    expect(app.events.register).toHaveBeenCalledWith('e1', spec)
  })

  it("registers many filters", () => {
    spyOn(app.events, 'registerMany')
    app.registerEvents({e1: spec})
    expect(app.events.registerMany).toHaveBeenCalledWith({e1: spec})
  })

  it("picks off the tree", () => {
    const treeView = app.pick(t => t.at('a'))
    expect(treeView.constructor.name).toEqual('TreeView')
    expect(treeView.source.path).toEqual(['a'])
  })

  it("commits changes and calls relevant callbacks", () => {
    spyOn(app.tree, 'applyChanges')
    spyOn(app.dirtyTracker, 'flush')
    app.commitChanges()
    expect(app.tree.applyChanges).toHaveBeenCalled()
    expect(app.dirtyTracker.flush).toHaveBeenCalled()
  })

})
