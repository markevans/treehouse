type BunchOfData = import('treehouse').BunchOfData

export default {
  serialize: (state: BunchOfData): string => JSON.stringify(state),
  deserialize: (str: string): BunchOfData => JSON.parse(str)
}
