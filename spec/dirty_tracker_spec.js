import DirtyTracker from '../src/dirty_tracker'

describe("DirtyTracker", () => {

  let dirtyTracker, callback

  beforeEach(() => {
    dirtyTracker = new DirtyTracker()
    callback = jasmine.createSpy('callback')
  })

  it("dirtys a callback if its branch is dirty", () => {
    dirtyTracker.watch(['dogs'], callback)
    dirtyTracker.markBranchDirty('dogs')
    expect(dirtyTracker.dirty.has(callback)).toEqual(true)
  })

  it("doesn't dirty a callback if another branch is dirty", () => {
    dirtyTracker.watch(['dogs'], callback)
    dirtyTracker.markBranchDirty('cats')
    expect(dirtyTracker.dirty.has(callback)).toEqual(false)
  })

  it("doesn't dirty a callback if it unwatches before the branch is dirty", () => {
    let subscription = dirtyTracker.watch(['dogs'], callback)
    subscription.cancel()
    dirtyTracker.markBranchDirty('dogs')
    expect(dirtyTracker.dirty.has(callback)).toEqual(false)
  })

  it("allows marking clean", () => {
    let subscription = dirtyTracker.watch(['dogs'], callback)
    dirtyTracker.markBranchDirty('dogs')
    expect(dirtyTracker.dirty.has(callback)).toEqual(true)
    subscription.markClean()
    expect(dirtyTracker.dirty.has(callback)).toEqual(false)
  })

  it("cleans each callback", () => {
    dirtyTracker.watch(['dogs'], callback)
    dirtyTracker.markBranchDirty('dogs')
    dirtyTracker.cleanAllDirty()
    expect(dirtyTracker.dirty.has(callback)).toEqual(false)
    expect(callback).toHaveBeenCalled()
  })

  it("allows calling the callback immediately", () => {
    dirtyTracker.watch(['dogs'], callback)
    expect(callback).not.toHaveBeenCalled()
    dirtyTracker.watch(['dogs'], callback, {callNow: true})
    expect(callback).toHaveBeenCalled()
  })
})
