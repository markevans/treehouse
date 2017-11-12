const Action = require('../lib/Action')

describe("Action", () => {

  let app, actionFunc, treeView

  beforeEach(() => {
    app = {
      event: spy('app.event'),
    }
    actionFunc = spy('action')
    treeView = {
      pull: spy('pull')
    }
  })

  it("performs the given action", () => {
    action = new Action(app, 'myEvent', treeView, actionFunc)
    action.call({somePayload: 'payload'})

    expect(actionFunc).toHaveBeenCalledWith({somePayload: 'payload'}, jasmine.any(Function), jasmine.any(Function))
  })

  it("yields a getter for the tree state", () => {
    treeView.pull.and.returnValues(4, 8)
    let values = []
    action = new Action(app, 'myEvent', treeView, (payload, event, getState) => {
      values.push(getState() + 1)
      values.push(getState() + 0.5)
    })
    action.call()
    expect(values).toEqual([5, 8.5])
  })

})
