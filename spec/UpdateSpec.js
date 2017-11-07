const Update = require('../lib/Update')

describe("Update", () => {

  let app, source, spec

  beforeEach(() => {
    app = {
      pick: spy('app.pick'),
      commitChanges: spy('commitChanges'),
    }
    source = {
      push: spy('push'),
      pull: spy('pull')
    }
    spec = {
      pick: spy('spec.pick'),
      reducer: spy('reducer')
    }
  })

  it("pushes updates onto the picked source", () => {
    source.pull.and.returnValue({someData: 'data'})
    app.pick.and.returnValue(source)
    spec.reducer.and.returnValue({someUpdate: 'update'})

    update = new Update(app, 'myEvent', spec)
    update.call({somePayload: 'payload'})

    expect(app.pick).toHaveBeenCalledWith(spec.pick)
    expect(spec.reducer).toHaveBeenCalledWith({someData: 'data'}, {somePayload: 'payload'})
    expect(source.push).toHaveBeenCalledWith({someUpdate: 'update'})
    expect(app.commitChanges).toHaveBeenCalled()
  })

})
