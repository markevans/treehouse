import DirtyTracker from '../src/dirty_tracker'

describe("DirtyTracker", () => {

  let dirtyTracker, callback

  beforeEach(() => {
    dirtyTracker = new DirtyTracker()
    callback = jasmine.createSpy('callback')
  })

  it("dirtys a callback if its branch is dirty", () => {
    let sub = dirtyTracker.watch({myDog: ['dogs','rover']}, callback)
    dirtyTracker.markBranchDirty('dogs')
    expect(sub.isDirty()).toEqual(true)
  })

  it("doesn't dirty a callback if another branch is dirty", () => {
    let sub = dirtyTracker.watch({myDog: ['dogs','rover']}, callback)
    dirtyTracker.markBranchDirty('cats')
    expect(sub.isDirty()).toEqual(false)
  })

  it("doesn't dirty a callback if it unwatches before the branch is dirty", () => {
    let sub = dirtyTracker.watch({myDog: ['dogs','rover']}, callback)
    sub.cancel()
    dirtyTracker.markBranchDirty('dogs')
    expect(sub.isDirty()).toEqual(false)
  })

  it("allows marking clean", () => {
    let sub = dirtyTracker.watch({myDog: ['dogs','rover']}, callback)
    dirtyTracker.markBranchDirty('dogs')
    expect(sub.isDirty()).toEqual(true)
    sub.markClean()
    expect(sub.isDirty()).toEqual(false)
  })

  it("cleans each callback", () => {
    let sub = dirtyTracker.watch({myDog: ['dogs','rover']}, callback)
    dirtyTracker.markBranchDirty('dogs')
    dirtyTracker.cleanAllDirty()
    expect(sub.isDirty()).toEqual(false)
    expect(callback).toHaveBeenCalled()
  })

  it("allows calling the callback immediately on the subscription", () => {
    dirtyTracker.watch({myDog: ['dogs','rover']}, callback)
    expect(callback).not.toHaveBeenCalled()
    dirtyTracker.watch({myDog: ['dogs','rover']}, callback).call()
    expect(callback).toHaveBeenCalled()
  })
})
