export default (app) => {
  return {

    actions () {
      return app.actions
    },

    action (name, payload) {
      this.actions().do(name, payload)
    }

  }
}
