import React from 'react'
let utils = require('react/addons').addons.TestUtils
import App from '../src/app'

describe("Component", () => {

  let app

  beforeEach(() => {
    app = new App()
  })

  describe("actions", () => {

    let Widget

    beforeEach(() => {
      Widget = class Widget extends app.Component {
        render () { return <div/> }
      }
    })

    it("calls an action", () => {
      spyOn(app.actions, 'do')
      let widget = new Widget()
      widget.action('jump', {height: 7})
      expect(app.actions.do).toHaveBeenCalledWith('jump', {height: 7})
    })
  })

})
