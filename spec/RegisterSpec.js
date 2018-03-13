const Register = require('../lib/Register')

describe("Register", () => {

  describe("registering and finding", () => {

    let register

    beforeEach(() => {
      register = new Register('testThing')
      register.registerMany({
        someName: 'some thing'
      })
    })

    it("returns the registered spec", () => {
      expect(register.find('someName')).toEqual('some thing')
    })

    it("throws if not found", () => {
      expect(() => {
        register.find('someOtherName')
      }).toThrowError("Can't find testThing 'someOtherName' as it hasn't been registered")
    })

    it("allows registering just one", () => {
      register.register('githeads', 'thing')
      expect(register.find('githeads')).toEqual('thing')
    })

    it("doesn't throw if set to null", () => {
      register.register('githeads', null)
      expect(register.find('githeads')).toEqual(null)
    })

  })

  describe("adding a build function", () => {

    let ChildRegister, register

    beforeEach(() => {
      class ChildRegister extends Register {
        build (name, spec) {
          return {builtThing: spec.some.toUpperCase()}
        }
      }
      register = new ChildRegister('testChild')
      register.register('someName', {
        some: 'spec'
      })
    })

    it("returns the built item", () => {
      expect(register.find('someName')).toEqual({builtThing: 'SPEC'})
    })

    it("still returns the spec if needed", () => {
      expect(register.findSpec('someName')).toEqual({some: 'spec'})
    })

  })

})
