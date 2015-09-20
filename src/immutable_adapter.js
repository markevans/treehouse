import immutable from 'immutable'

export default {
  fromJS (data) {
    return immutable.fromJS(data)
  },

  getIn (object, path) {
    return object.getIn(path)
  },

  updateIn (object, path, value) {
    return object.updateIn(path, value)
  },

  merge (obj1, obj2) {
    return obj1.merge(obj2)
  },

  reverseMerge (obj1, obj2) {
    return this.fromJS(obj2).merge(obj1)
  }
}

