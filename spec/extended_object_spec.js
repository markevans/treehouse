import App from '../src/app'

describe("Extending objects", () => {

  beforeEach(() => {
  })

  let app, server

  beforeEach(() => {
    let App = require('../src/app')
    app = new App()
    server = {
      stateFromTree () {
        return {token: 'authToken'}
      },
      syncWithTree () {
        this.token = this.currentTreeState().token
      }
    }
    app.extend(server)
    server.watchTree()
  })

  describe("rendering", () => {

    it("renders from the tree", () => {
      expect(server.token).toEqual(undefined)
      app.tree.at().set('authToken', 'blah123').commit()
      expect(server.token).toEqual('blah123')
    })

  })

})
