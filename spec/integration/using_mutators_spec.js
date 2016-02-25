import App from '../../src/app'

describe("Using mutators", () => {

  let app

  beforeEach(() => {
    app = new App()
  })

  describe("using with set", () => {

    beforeEach(() => {
      app.init({
        teams: ['Spurs', 'Barca', 'America']
      })
      app.registerMutators({
        reverse (array) {
          return this.clone(array, (a) => {a.reverse()})
        }
      })
    })

    it("correctly mutates", () => {
      app.at('teams').setWith('reverse')
      expect(app.tree()).toEqual({teams: ['America', 'Barca', 'Spurs']})
    })

  })

})
