import { Data, Path } from '../types'

export default (data: Data, path: Path) => {
  let i, value: Data = data
  for(i=0; i<path.length; i++) {
    if (value && typeof(value) === 'object' && value.hasOwnProperty(path[i])) {
      value = value[path[i]]
    } else {
      throw new Error(`Bad path ${path} for data ${JSON.stringify(data)}`)
    }
  }
  return value
}
