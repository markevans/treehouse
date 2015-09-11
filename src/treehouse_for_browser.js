import App from './app'

let makeTreehouse = () => {
  let treehouse = {
    // The default treehouse app
    app: new App()
  }

  // Make things easy to reach for the default app
  treehouse.actions = treehouse.app.actions,
  treehouse.Component = treehouse.app.Component

  return treehouse
}

// AMD
if (global.define && define.amd) {
  define(() => {
    return makeTreehouse()
  })
// CommonJS
} else if (global.module && module.exports) {
  module.exports = makeTreehouse()
// Global
} else {
  global.treehouse = makeTreehouse()
}
