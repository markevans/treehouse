import DirtyTracker from '../src/dirty_tracker'

describe("DirtyTracker", () => {

  let dirtyTracker, object

  beforeEach(() => {
    dirtyTracker = new DirtyTracker()
    object = {}
  })

  it("dirtys an object if its branch is dirty", () => {
    dirtyTracker.register(object, ['dogs'])
    dirtyTracker.markBranchDirty('dogs')
    expect(dirtyTracker.dirty.has(object)).toEqual(true)
  })

  it("doesn't dirty an object if another branch is dirty", () => {
    dirtyTracker.register(object, ['dogs'])
    dirtyTracker.markBranchDirty('cats')
    expect(dirtyTracker.dirty.has(object)).toEqual(false)
  })

  it("doesn't dirty an object if it unregisters before the branch is dirty", () => {
    dirtyTracker.register(object, ['dogs'])
    dirtyTracker.unregister(object)
    dirtyTracker.markBranchDirty('dogs')
    expect(dirtyTracker.dirty.has(object)).toEqual(false)
  })
})
