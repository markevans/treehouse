const reducers = require('../../lib/reducers/Object')

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

  it("insert", () => {
    let newObject = reducers.insert(object, 'c', 3)
    expect(newObject).toEqual({a: 1, b: 2, c: 3})
    expect(newObject == object).not.toBeTruthy()
  })

  it("remove", () => {
    let newObject = reducers.remove(object, 'b')
    expect(newObject).toEqual({a: 1})
    expect(newObject == object).not.toBeTruthy()
  })
})
