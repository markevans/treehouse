const mutators = require('../../lib/mutators/object_mutators')

describe("objectMutators", () => {

  let object

  beforeEach(() => {
    object = {a: 1, b: 2}
  })

  it("merge", () => {
    let newObject = mutators.merge(object, {b: 22, c: 3}, {d: 4})
    expect(newObject).toEqual({a: 1, b: 22, c: 3, d: 4})
    expect(newObject == object).not.toBeTruthy()
  })

  it("setAttribute", () => {
    let newObject = mutators.setAttribute(object, 'c', 3)
    expect(newObject).toEqual({a: 1, b: 2, c: 3})
    expect(newObject == object).not.toBeTruthy()
  })

  it("delete", () => {
    let newObject = mutators.delete(object, 'b')
    expect(newObject).toEqual({a: 1})
    expect(newObject == object).not.toBeTruthy()
  })
})
