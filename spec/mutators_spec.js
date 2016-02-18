import Mutators from '../src/mutators'

describe("Mutators", () => {

  let mutators

  beforeEach(() => {
    mutators = new Mutators()
  })

  describe("registering and using a mutator", () => {
    it("uses a registered mutator", () => {
      mutators.register({
        push (array, ...args) {
          return this.clone(array, (a) => {
            a.push(...args)
          })
        }
      })
      let array = []
      let newArray = mutators.call('push', array, 4, 5)
      expect(newArray).toEqual([4, 5])
      expect(newArray == array).not.toBeTruthy()
    })

    it("throws an error if the mutator isn't registered", () => {
      expect(() => {
        mutators.call('idontexist', {})
      }).toThrowError("Mutator 'idontexist' not found")
    })

    it("throws an error if the mutator doesn't return anything", () => {
      mutators.register({
        idontreturn: (obj, ...items) => {}
      })
      expect(() => {
        mutators.call('idontreturn', {})
      }).toThrowError("Mutator 'idontreturn' didn't return anything")
    })

    it("throws an error if the mutator returns the same object", () => {
      mutators.register({
        push: (array, ...items) => {
          array.push(...items)
          return array
        }
      })
      let array = []
      expect(() => {
        mutators.call('push', array, 4, 5)
      }).toThrowError("Mutator 'push' returned the same object. It should not modify existing objects.")
    })
  })

})
