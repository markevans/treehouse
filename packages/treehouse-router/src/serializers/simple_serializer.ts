type BunchOfData = import('treehouse').BunchOfData

export default {

  serialize: (state: BunchOfData): string => {
    let str = ""
    for (let key in state) {
      if (state[key] != null) {
        str = str + '/' + key + '/' + state[key]
      }
    }
    return str
  },

  deserialize: (str: string): BunchOfData => {
    let parts = str.split('/'),
      state: BunchOfData = {}
    for (let i=1; i<parts.length; i+=2) {
      state[parts[i]] = parts[i+1]
    }
    return state
  }

}
