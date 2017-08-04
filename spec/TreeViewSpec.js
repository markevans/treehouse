const App = require('../lib/App')
const Cursor = require('../lib/Cursor')
const TreeView = require('../lib/TreeView')

describe("TreeView", () => {

  let app

  beforeEach(() => {
    app = new App()
  })

  describe("getting data", () => {

    let treeView

    beforeEach(() => {
      app.setTree({
        a: 'b',
        b: {c: ['d', 'e']},
        x: 1
      })
      treeView = new TreeView(app, (t) => {
        return {
          first: t.at(['a']),
          second: t.at(['b', 'c', 1])
        }
      })
    })

    it("gets multiple attributes", () => {
      expect(treeView.get()).toEqual({first: 'b', second: 'e'})
    })

    it("allows initializing with an object", () => {
      treeView = new TreeView(app, {
        first: app.at(['a']),
      })
      expect(treeView.get()).toEqual({first: 'b'})
    })
  })

  describe("putting back data", () => {

    let treeView

    beforeEach(() => {
      treeView = new TreeView(app, (t) => {
        return {
          first: t.at(['a']),
          second: t.at(['b', 'c'])
        }
      })
    })

    it("changes multiple attributes", () => {
      let changes = treeView.putBack({first: '1st', second: '2nd'})
      expect(changes).toEqual([
        {path: ['a'], value: '1st'},
        {path: ['b', 'c'], value: '2nd'}
      ])
    })
  })

  describe("watching", () => {
    let treeView, callback

    beforeEach(() => {
      callback = jasmine.createSpy('watchCallback')
      treeView = new TreeView(app, (t) => {
        return {
          first: t.at(['a']),
          second: t.at(['b', 'c'])
        }
      })
    })

    it("allows for watching the tree", () => {
      treeView.watch(callback)
      app.dirtyTracker.markChannelDirty('a')
      app.dirtyTracker.cleanAllDirty()
      expect(callback).toHaveBeenCalledWith(treeView)
    })

    it("doesn't call back if the relevant branches aren't touched", () => {
      treeView.watch(callback)
      app.dirtyTracker.markChannelDirty('z')
      app.dirtyTracker.cleanAllDirty()
      expect(callback).not.toHaveBeenCalled()
    })

    it("allows unwatching", () => {
      treeView.watch(callback)
      treeView.unwatch()
      app.dirtyTracker.markChannelDirty('a')
      app.dirtyTracker.cleanAllDirty()
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe("channels", () => {
    let treeView

    it("returns all channels it cares about", () => {
      treeView = new TreeView(app, (t) => {
        return {
          first: t.at(['a']),
          second: t.at(['b', 'c'])
        }
      })
      expect(treeView.channels()).toEqual(['a', 'b'])
    })

    it("doesn't repeat a channel", () => {
      treeView = new TreeView(app, (t) => {
        return {
          first: t.at(['a']),
          second: t.at(['a', 'b'])
        }
      })
      expect(treeView.channels()).toEqual(['a'])
    })
  })

  describe("streams", () => {
    let treeView

    it("returns registered streams", () => {
      treeView = new TreeView(app, (t) => {
        return {
          first: t.at(['a']),
          second: t.at(['b', 'c'])
        }
      })
      let streams = treeView.streams()
      expect(streams.first).toEqual(jasmine.any(Cursor))
      expect(streams.second).toEqual(jasmine.any(Cursor))
    })
  })

})
