const update = require('../lib/update')

describe("update", () => {

  let app, treeView, spec

  beforeEach(() => {
    app = {
      pick: spy('app.pick'),
      action: spy('app.action'),
      commitChanges: spy('app.commitChanges')
    }
    treeView = {
      pull: spy('treeView.pull'),
      push: spy('treeView.push')
    }
    spec = {
      pick: spy('spec.pick'),
      update: spy('spec.update')
    }
    app.pick.and.returnValue(treeView)
  })

  it("pushes changes onto the treeview", () => {
    treeView.pull.and.returnValue({someData: 'data'})
    spec.update.and.returnValue({someUpdate: 'update'})


    update(app, spec, {somePayload: 'payload'})

    expect(spec.update).toHaveBeenCalledWith({someData: 'data'}, {somePayload: 'payload'})
    expect(treeView.push).toHaveBeenCalledWith({someUpdate: 'update'})
    expect(app.commitChanges).toHaveBeenCalled()
  })

})
