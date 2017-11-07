const Action = require('../lib/Action')

describe("Action", () => {

  let app, actionFunc

  beforeEach(() => {
    app = {
      event: spy('app.event'),
      tree: {
        pull: spy('tree.pull')
      }
    }
    actionFunc = spy('action')
  })

  it("performs the given action", () => {
    action = new Action(app, 'myEvent', actionFunc)
    action.call({somePayload: 'payload'})

    expect(actionFunc).toHaveBeenCalledWith({somePayload: 'payload'}, app.event, jasmine.any(Function))
  })

  it("yields a getter for the tree state", () => {
    app.tree.pull.and.returnValues(4, 8)
    let values = []
    action = new Action(app, 'myEvent', (payload, event, getTree) => {
      values.push(getTree() + 1)
      values.push(getTree() + 0.5)
    })
    action.call()
    expect(values).toEqual([5, 8.5])
  })

})
