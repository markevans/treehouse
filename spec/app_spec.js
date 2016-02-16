import App from '../src/app'

describe("App", () => {

  let app

  beforeEach(() => {
    app = new App()
  })

  describe("watching the tree", () => {
    let thing, name

    beforeEach(() => {
      name = null
      thing = {
        callback: (treeView) => {
          name = treeView.get()['n']
        }
      }
      spyOn(thing, 'callback').and.callThrough()
    })

    it("allows for watching the tree", () => {
      app.watch({n: ['name'], s: ['shizzle']}, thing.callback)
      app.tree.at().set('name', 'balrog').commit()
      expect(name).toEqual('balrog')
      expect(thing.callback.calls.count()).toEqual(1)
    })

    it("doesn't call back if the relevant branches aren't touched", () => {
      app.watch({n: ['name'], s: ['shizzle']}, thing.callback)
      app.tree.at().set('googs', 'balrog').commit()
      expect(name).toEqual(null)
      expect(thing.callback.calls.count()).toEqual(0)
    })
  })

})
