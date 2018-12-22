export default (object, callback) =>
  Object.keys(object).reduce((newObject, key) => {
      newObject[key] = callback(key, object[key])
      return newObject
    }, {})
