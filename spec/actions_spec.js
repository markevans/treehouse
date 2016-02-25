import App from '../src/app'
import Actions from '../src/actions'

describe("Actions", () => {

  let app, actions

  beforeEach(() => {
    app = new App()
    actions = new Actions(app)
  })

  describe("doing actions", () => {
    let activities

    beforeEach(() => {
      activities = {
        spendMoney: (tree, payload) => {
          tree.set({moneySpent: payload.amount})
        }
      }
      actions.register(activities)
    })

    it("does a registered action", () => {
      actions.do('spendMoney', {amount: 1000000})
      expect(app.tree()).toEqual({moneySpent: 1000000})
    })

    it("doesn't blow up if not registered", () => {
      spyOn(app, 'log')
      actions.do('somethingElse')
      expect(app.log).toHaveBeenCalled()
    })

    it("automatically commits", () => {
      spyOn(app, 'commit')
      actions.do('spendMoney', {amount: 50})
      expect(app.commit.calls.count()).toEqual(1)
    })

    it("allows committing manually for async actions", () => {
      spyOn(app, 'commit')
      actions.register({
        asyncThing: (tree, payload, commit) => {
          commit()
        }
      })
      actions.do('asyncThing')
      expect(app.commit.calls.count()).toEqual(2)
    })
  })

})
