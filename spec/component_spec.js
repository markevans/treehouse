import React from 'react'
let utils = require('react/addons').addons.TestUtils
import Component from '../src/component'
import Actions from '../src/actions'


describe("Component", () => {

  describe("actions", () => {

    let Widget = class Widget extends Component {
      render () { return <div/> }
    }
    let actions, jumpAction

    beforeEach(() => {
      actions = new Actions()
      Component.setActions(actions)
    })

    it("calls an action", () => {
      spyOn(actions, 'do')
      let widget = new Widget()
      widget.action('jump', {height: 7})
      expect(actions.do).toHaveBeenCalledWith('jump', {height: 7})
    })
  })

})
