import DirtyTracker from '../src/dirty_tracker'

describe("DirtyTracker", () => {

  let dirtyTracker, callback

  beforeEach(() => {
    dirtyTracker = new DirtyTracker()
    callback = jasmine.createSpy()
  })

  it("dirtys a callback if its branch is dirty", () => {
    dirtyTracker.track(callback, ['dogs'])
    dirtyTracker.markBranchDirty('dogs')
    expect(dirtyTracker.isDirty(callback)).toEqual(true)
  })

  it("doesn't dirty a callback if another branch is dirty", () => {
    dirtyTracker.track(callback, ['dogs'])
    dirtyTracker.markBranchDirty('cats')
    expect(dirtyTracker.isDirty(callback)).toEqual(false)
  })

  it("doesn't dirty a callback if it unwatches before the branch is dirty", () => {
    dirtyTracker.track(callback, ['dogs'])
    dirtyTracker.untrack(callback, ['dogs'])
    dirtyTracker.markBranchDirty('dogs')
    expect(dirtyTracker.isDirty(callback)).toEqual(false)
  })

  it("allows marking clean", () => {
    dirtyTracker.track(callback, ['dogs'])
    dirtyTracker.markBranchDirty('dogs')
    expect(dirtyTracker.isDirty(callback)).toEqual(true)
    dirtyTracker.markClean(callback)
    expect(dirtyTracker.isDirty(callback)).toEqual(false)
  })

  it("cleans each callback", () => {
    dirtyTracker.track(callback, ['dogs'])
    dirtyTracker.markBranchDirty('dogs')
    dirtyTracker.cleanAllDirty()
    expect(dirtyTracker.isDirty(callback)).toEqual(false)
    expect(callback).toHaveBeenCalled()
  })
})
