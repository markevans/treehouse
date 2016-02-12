import DirtyTracker from '../src/dirty_tracker'

describe("DirtyTracker", () => {

  let dirtyTracker, item

  beforeEach(() => {
    dirtyTracker = new DirtyTracker()
    item = {call: ()=>{}}
    spyOn(item, 'call').and.callThrough()
  })

  it("dirtys a item if its branch is dirty", () => {
    dirtyTracker.track(item, ['dogs'])
    dirtyTracker.markBranchDirty('dogs')
    expect(dirtyTracker.isDirty(item)).toEqual(true)
  })

  it("doesn't dirty a item if another branch is dirty", () => {
    dirtyTracker.track(item, ['dogs'])
    dirtyTracker.markBranchDirty('cats')
    expect(dirtyTracker.isDirty(item)).toEqual(false)
  })

  it("doesn't dirty a item if it unwatches before the branch is dirty", () => {
    dirtyTracker.track(item, ['dogs'])
    dirtyTracker.untrack(item, ['dogs'])
    dirtyTracker.markBranchDirty('dogs')
    expect(dirtyTracker.isDirty(item)).toEqual(false)
  })

  it("allows marking clean", () => {
    dirtyTracker.track(item, ['dogs'])
    dirtyTracker.markBranchDirty('dogs')
    expect(dirtyTracker.isDirty(item)).toEqual(true)
    dirtyTracker.markClean(item)
    expect(dirtyTracker.isDirty(item)).toEqual(false)
  })

  it("cleans each item", () => {
    dirtyTracker.track(item, ['dogs'])
    dirtyTracker.markBranchDirty('dogs')
    dirtyTracker.cleanAllDirty()
    expect(dirtyTracker.isDirty(item)).toEqual(false)
    expect(item.call).toHaveBeenCalled()
  })
})
