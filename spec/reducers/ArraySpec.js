const reducers = require('../../lib/reducers/Array')

describe("array reducers", () => {

  let array

  beforeEach(() => {
    array = [1, 2]
  })

  it("push", () => {
    let newArray = reducers.push(array, 3, 4)
    expect(newArray).toEqual([1, 2, 3, 4])
    expect(newArray == array).not.toBeTruthy()
  })

})
