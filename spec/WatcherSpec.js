const Watcher = require('../lib/Watcher')
const DirtyTracker = require('../lib/DirtyTracker')

describe("Watcher", () => {

  let watcher, dirtyTracker, source, callback, pullSpy

  beforeEach(() => {
    dirtyTracker = new DirtyTracker()
    source = { pull: null, channels: null }
    callback = jasmine.createSpy('callback')
    watcher = new Watcher(dirtyTracker, source, callback)
    spyOn(source, 'channels').and.returnValue(new Set(['things']))
    pullSpy = spyOn(source, 'pull')
    pullSpy.and.returnValue({some: 'data'})
  })

  it("calls the callback with the source's data", () => {
    watcher.start()
    dirtyTracker.markChannelDirty('things')
    dirtyTracker.cleanAllDirty()
    expect(callback).toHaveBeenCalledWith({some: 'data'})
  })

  it("doesn't call the callback if not started", () => {
    dirtyTracker.markChannelDirty('things')
    dirtyTracker.cleanAllDirty()
    expect(callback).not.toHaveBeenCalled()
  })

  it("doesn't call the callback if the channel isn't dirty", () => {
    dirtyTracker.markChannelDirty('otherChannel')
    dirtyTracker.cleanAllDirty()
    expect(callback).not.toHaveBeenCalled()
  })

  it("doesn't call the callback after stopping", () => {
    watcher.start()
    watcher.stop()
    dirtyTracker.markChannelDirty('things')
    dirtyTracker.cleanAllDirty()
    expect(callback).not.toHaveBeenCalled()
  })

  it("calls the callback with fresh data", () => {
    watcher.start()
    dirtyTracker.markChannelDirty('things')
    dirtyTracker.cleanAllDirty()
    expect(callback).toHaveBeenCalledWith({some: 'data'})
    pullSpy.and.returnValue({someNew: 'DATA'})
    dirtyTracker.markChannelDirty('things')
    dirtyTracker.cleanAllDirty()
    expect(callback).toHaveBeenCalledWith({someNew: 'DATA'})
  })

})
