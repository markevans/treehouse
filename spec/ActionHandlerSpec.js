const ActionHandler = require('../lib/ActionHandler')

describe("ActionHandler", () => {

  let app, spec, treeView

  beforeEach(() => {
    app = {
      pick: spy('app.pick'),
      action: spy('app.action'),
      commitChanges: spy('commitChanges')
    }
    spec = {
      pick: spy('spec.pick'),
      action: spy('action'),
      update: spy('update')
    }
    treeView = {
      pull: spy('treeView.pull'),
      push: spy('treeView.push')
    }
    app.pick.and.returnValue(treeView)
  })

  describe("action", () => {

    let result

    beforeEach(() => {
      result = null
    })

    it("performs the action with the given payload", () => {
      spec.action = (payload) => {
        result = payload
      }
      action = new ActionHandler(app, 'myAction', spec)
      action.call('payload')
      expect(result).toEqual('payload')
    })

    it("yields a getter for the tree state", () => {
      result = []
      treeView.pull.and.returnValues(4, 8)
      spec.action = (payload, action, getState) => {
        result.push(getState() + 1)
        result.push(getState() + 0.5)
      }
      action = new ActionHandler(app, 'myAction', spec)
      action.call()
      expect(result).toEqual([5, 8.5])
    })

    it("doesn't matter if the action is missing", () => {
      delete spec.action
      actionHandler = new ActionHandler(app, 'myAction', spec)
      spyOn(actionHandler.update, 'call')
      actionHandler.call({somePayload: 'payload'})
      expect(actionHandler.update.call).toHaveBeenCalled()
    })

    it("yields the action factory", () => {
      spec.action = (payload, action) => {
        action('otherAction')
      }
      action = new ActionHandler(app, 'myAction', spec)
      action.call()
      expect(app.action).toHaveBeenCalledWith('otherAction')
    })

  })

  it("performs the action then the update", () => {
    result = []
    spec.update = () => { result.push('update') }
    spec.action = () => { result.push('action') }

    actionHandler = new ActionHandler(app, 'myAction', spec)
    actionHandler.call({somePayload: 'payload'})

    expect(result).toEqual(['action', 'update'])
  })

  it("does nothing if set to null", () => {
    actionHandler = new ActionHandler(app, 'myAction', null)
    actionHandler.call({thisWill: 'not throw an error'})
  })

})
