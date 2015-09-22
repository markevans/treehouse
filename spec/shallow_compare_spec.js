import shallowCompare from '../src/shallow_compare'
import i from 'immutable'

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

  it("works with immutable objects", () => {
    let obj1 = {a: i.Map({A: 'Z'})}
    let obj2 = {a: i.Map({A: 'Z'})}
    expect(shallowCompare(obj1, obj2)).toEqual(true)
    expect(shallowCompare(obj2, obj1)).toEqual(true)
  })

  it("doesn't blow up with nulls vs immutable", () => {
    let obj1 = {a: i.Map({A: 'Z'})}
    let obj2 = {a: null}
    expect(shallowCompare(obj1, obj2)).toEqual(false)
    expect(shallowCompare(obj2, obj1)).toEqual(false)
  })

  it("blows up if one of the objects is null", () => {
    expect(() => { shallowCompare(null, {}) }).toThrow()
    expect(() => { shallowCompare({}, null) }).toThrow()
  })
})
