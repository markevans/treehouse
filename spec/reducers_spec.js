const reducers = require('../lib/reducers')

describe("object reducers", () => {

  let object

  beforeEach(() => {
    object = {a: 1, b: 2}
  })

  it("merge", () => {
    let newObject = reducers.merge(object, {b: 22, c: 3}, {d: 4})
    expect(newObject).toEqual({a: 1, b: 22, c: 3, d: 4})
    expect(newObject == object).not.toBeTruthy()
  })

  it("setAttribute", () => {
    let newObject = reducers.setAttribute(object, 'c', 3)
    expect(newObject).toEqual({a: 1, b: 2, c: 3})
    expect(newObject == object).not.toBeTruthy()
  })

  it("remove", () => {
    let newObject = reducers.remove(object, 'b')
    expect(newObject).toEqual({a: 1})
    expect(newObject == object).not.toBeTruthy()
  })
})

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
