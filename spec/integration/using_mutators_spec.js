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
        reverse (array, ...thenAppendThese) {
          return this.clone(array, (a) => {
            a.reverse()
            a.push(...thenAppendThese)
          })
        }
      })
    })

    it("correctly mutates", () => {
      app.at('teams').setWith('reverse', 'Man Utd', 'Derby')
      expect(app.tree()).toEqual({teams: ['America', 'Barca', 'Spurs', 'Man Utd', 'Derby']})
    })

    it("adds a method to the cursor object", () => {
      app.at('teams').reverse('Man Utd', 'Derby')
      expect(app.tree()).toEqual({teams: ['America', 'Barca', 'Spurs', 'Man Utd', 'Derby']})
    })

  })

})
