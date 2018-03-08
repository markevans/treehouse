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

  it("registers a single action", () => {
    spyOn(app.actions, 'register')
    app.registerAction('e1', spec)
    expect(app.actions.register).toHaveBeenCalledWith('e1', spec)
  })

  it("registers many actions", () => {
    spyOn(app.actions, 'registerMany')
    app.registerActions({e1: spec})
    expect(app.actions.registerMany).toHaveBeenCalledWith({e1: spec})
  })

  it("registers a single update", () => {
    spyOn(app.updates, 'register')
    app.registerUpdate('u1', spec)
    expect(app.updates.register).toHaveBeenCalledWith('u1', spec)
  })

  it("registers many updates", () => {
    spyOn(app.updates, 'registerMany')
    app.registerUpdates({u1: spec})
    expect(app.updates.registerMany).toHaveBeenCalledWith({u1: spec})
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
