import simpleSerializer from './serializers/simple_serializer'
import LocationHashAdapter from './adapters/LocationHashAdapter'

type BunchOfData = import('treehouse').BunchOfData
type Pipe<T> = import('treehouse').Pipe<T>

import { Serializer } from './types'

// // Fill object's unpopulated keys with null values
// const fill = (obj: { [key: string]: any }, keys: string[]) => {
//   let newObject: { [key: string]: any } = {}
//   keys.forEach(key => {
//     newObject[key] = obj.hasOwnProperty(key) ? obj[key] : null
//   })
//   return newObject
// }

export default class Router {

  onUrlChanged: (state: BunchOfData) => void
  serializer: Serializer
  source: Pipe<BunchOfData>
  adapter: Pipe<string>
  //keys: string[]

  constructor (
    source: Pipe<BunchOfData>,
    onUrlChanged: (state: BunchOfData) => void,
    { serializer } = { serializer: simpleSerializer }
  ) {
    this.source = source
    //this.keys = source.keys
    this.onUrlChanged = onUrlChanged
    this.serializer = serializer
    this.adapter = new LocationHashAdapter()
  }

  start () {
    this.source.watch(() => this.push(this.source.pull()))
    this.adapter.watch(() => this.onChange(this.adapter.pull()))
    this.onChange(this.adapter.pull())
  }

  stop () {
    this.source.unwatch()
    this.adapter.unwatch()
  }

  push = (data: BunchOfData) => {
    this.adapter.push(this.serialize(data))
  }

  pull () {
    return this.deserialize(this.adapter.pull())
  }

  deserialize (str: string) {
    const data = str ? this.serializer.deserialize(str) : {}
    //return this.keys ? fill(data, this.keys) : data
    return data
  }

  serialize (data: BunchOfData) {
    return this.serializer.serialize(data)
  }

  onChange = (str: string) => {
    this.onUrlChanged(this.deserialize(str))
  }

}
