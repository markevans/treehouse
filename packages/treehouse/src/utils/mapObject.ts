import { Obj } from '../types'

export default (
  object: Obj,
  callback: (key: string, value: any) => any
): Obj => {
  const newObj: Obj = {}
  return Object.keys(object).reduce((newObject, key) => {
      newObject[key] = callback(key, object[key])
      return newObject
    }, newObj)
}
