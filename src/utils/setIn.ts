import { Path, Data, DataCollection } from '../types'

// Immutable operation; returns a new object
const setIn = (data: Data, path: Path, twigValue: Data, level: number=0) => {
  if (path.length === 0) {
    return twigValue
  }

  if (typeof(data) !== 'object' || data === null) {
    throw new Error(`Bad path ${path} for data ${JSON.stringify(data)}`)
  }

  let newData = (Array.isArray(data) ? [...data] : {...data}) as DataCollection,
      branch = path[level],
      value
  if (level+1 < path.length) {
    value = setIn((newData[branch] as Data), path, twigValue, level+1)
  } else {
    value = twigValue
  }
  newData[branch] = value
  return newData
}

export default setIn
