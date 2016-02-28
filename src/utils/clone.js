export default (object) => {
  if (Array.isArray(object)) {
    return object.slice()
  } else {
    return Object.assign({}, object)
  }
}