import Mutators from '../../src/mutators'
import objectMutators from '../../src/mutators/object_mutators'

describe("objectMutators", () => {

  let mutators, object

  beforeEach(() => {
    mutators = new Mutators()
    mutators.register(objectMutators)
    object = {a: 1, b: 2}
  })

  it("merge", () => {
    let newObject = mutators.call('merge', object, {b: 22, c: 3}, {d: 4})
    expect(newObject).toEqual({a: 1, b: 22, c: 3, d: 4})
    expect(newObject == object).not.toBeTruthy()
  })

  it("setAttribute", () => {
    let newObject = mutators.call('setAttribute', object, 'c', 3)
    expect(newObject).toEqual({a: 1, b: 2, c: 3})
    expect(newObject == object).not.toBeTruthy()
  })

  it("delete", () => {
    let newObject = mutators.call('delete', object, 'b')
    expect(newObject).toEqual({a: 1})
    expect(newObject == object).not.toBeTruthy()
  })
})
