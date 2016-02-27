import App from './app'

// AMD
if (global.define && define.amd) {
  define(() => {
    return new App()
  })
// CommonJS
} else if (global.module && module.exports) {
  module.exports = new App()
// Global
} else {
  global.treehouse = new App()
}
