export default (array, mapValue) =>
  array.reduce((newObject, value) => {
      newObject[value] = mapValue(value)
      return newObject
    }, {})
