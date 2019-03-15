type BunchOfData = import('treehouse').BunchOfData

export interface Serializer {
  serialize: (state: BunchOfData) => string,
  deserialize: (str: string) => BunchOfData,
}
