type Obj = { [key: string]: any }

export default (
  array: Array<string>,
  mapValue: (value: string) => any
): Obj => {
  const newObj: Obj = {}
  return array.reduce((newObject, value) => {
      newObject[value] = mapValue(value)
      return newObject
    }, newObj)
}
