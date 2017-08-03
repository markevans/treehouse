module.exports = {

  push (array, ...args) {
    let newArray = array.slice()
    newArray.push(...args)
    return newArray
  }

}
