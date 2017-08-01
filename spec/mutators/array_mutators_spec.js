import mutators from '../../lib/mutators/array_mutators'

describe("arrayMutators", () => {

  let array

  beforeEach(() => {
    array = [1, 2]
  })

  it("push", () => {
    let newArray = mutators.push(array, 3, 4)
    expect(newArray).toEqual([1, 2, 3, 4])
    expect(newArray == array).not.toBeTruthy()
  })

  it("concat", () => {
    let newArray = mutators.concat(array, [6, 7])
    expect(newArray).toEqual([1, 2, 6, 7])
    expect(newArray == array).not.toBeTruthy()
  })

})
