import Mutators from '../../src/mutators'
import arrayMutators from '../../src/mutators/array_mutators'

describe("arrayMutators", () => {

  let mutators, array

  beforeEach(() => {
    mutators = new Mutators()
    mutators.register(arrayMutators)
    array = [1, 2]
  })

  it("push", () => {
    let newArray = mutators.call('push', array, 3, 4)
    expect(newArray).toEqual([1, 2, 3, 4])
    expect(newArray == array).not.toBeTruthy()
  })

  it("concat", () => {
    let newArray = mutators.call('concat', array, [6, 7])
    expect(newArray).toEqual([1, 2, 6, 7])
    expect(newArray == array).not.toBeTruthy()
  })

})
