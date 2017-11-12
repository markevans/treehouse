const Update = require('../lib/Update')

describe("Update", () => {

  let app, update, treeView

  beforeEach(() => {
    app = {
      commitChanges: spy('commitChanges'),
    }
    treeView = {
      pull: spy('pull'),
      push: spy('push')
    }
    updateFunc = spy('update')
  })

  it("pushes updates onto the treeView", () => {
    treeView.pull.and.returnValue({someData: 'data'})
    updateFunc.and.returnValue({someUpdate: 'update'})

    update = new Update(app, 'myEvent', treeView, updateFunc)
    update.call({somePayload: 'payload'})

    expect(updateFunc).toHaveBeenCalledWith({someData: 'data'}, {somePayload: 'payload'})
    expect(treeView.push).toHaveBeenCalledWith({someUpdate: 'update'})
    expect(app.commitChanges).toHaveBeenCalled()
  })

})
