const Register = require('../lib/Register')

describe("Register", () => {

  let register

  describe("registering and finding", () => {

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

})
