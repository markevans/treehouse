import shallowCompare from '../src/shallow_compare'

describe("shallowCompare", () => {

  it("returns true if objects have the same values", () => {
    expect(shallowCompare({
      a: 1,
      b: 2
    }, {
      a: 1,
      b: 2
    })).toEqual(true)
  })

  it("returns false if any value is different", () => {
    let obj1 = {a: 1}
    let obj2 = {a: 2}
    expect(shallowCompare(obj1, obj2)).toEqual(false)
    expect(shallowCompare(obj2, obj1)).toEqual(false)
  })

  it("sanity check with object references", () => {
    let object = {hi: 'guys'}
    let obj1 = {a: object}
    let obj2 = {a: object}
    let obj3 = {a: {hi: 'guys'}}
    expect(shallowCompare(obj1, obj2)).toEqual(true)
    expect(shallowCompare(obj1, obj3)).toEqual(false)
  })

  it("returns false if any key is different", () => {
    let obj1 = {a: 1}
    let obj2 = {b: 1}
    expect(shallowCompare(obj1, obj2)).toEqual(false)
    expect(shallowCompare(obj2, obj1)).toEqual(false)
  })

  it("returns false if one is a subset of the other", () => {
    let obj1 = {a: 1, b: 2}
    let obj2 = {b: 2}
    expect(shallowCompare(obj1, obj2)).toEqual(false)
    expect(shallowCompare(obj2, obj1)).toEqual(false)
  })

  it("blows up if one of the objects is null", () => {
    expect(() => { shallowCompare(null, {}) }).toThrow()
    expect(() => { shallowCompare({}, null) }).toThrow()
  })
})
