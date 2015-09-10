import fs from 'fs'
import React from 'react'
let utils = require('react/addons').addons.TestUtils
import App from '../src/app'

let jsdom = require('jsdom')
let jquery = fs.readFileSync('./node_modules/jquery/dist/jquery.min.js').toString()
let $

let render = (element) => {
  return React.render(element, $('body')[0])
}

describe("Component", () => {

  let app, tree

  beforeEach(() => {
    app = new App()
    tree = app.tree.at()
  })

  beforeEach((done) => {
    jsdom.env({
      html: '<!doctype html><html><body></body></html>',
      src: [jquery],
      done: (error, window) => {
        if (error) { console.log("Error:", error) }
        global.window = window
        global.document = window.document
        $ = window.jQuery
        done()
      }
    })
  })

  afterEach((done) => {
    React.unmountComponentAtNode(document.body)
    document.body.innerHTML = ""
    setTimeout(done)
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

  describe("rendering", () => {

    let Widget, widgetRenderCount

    beforeEach(() => {
      widgetRenderCount = 0
      Widget = class Widget extends app.Component {
        stateFromTree () {
          return {
            theFruit: 'fruit'
          }
        }
        render () {
          widgetRenderCount++
          return <div className="widget">{this.state.theFruit}</div>
        }
      }
    })

    it("renders from the tree", () => {
      tree.set({fruit: 'orange', animal: 'sheep'}).commit()
      let widget = new Widget()
      render(<Widget/>)
      expect($('.widget').html()).toEqual('orange')
    })

    describe("updating", () => {

      beforeEach(() => {
        tree.set({fruit: 'orange', animal: 'sheep'}).commit()
        let widget = new Widget()
        render(<Widget/>)
        widgetRenderCount = 0
      })

      it("updates when the relevant branch has been touched", () => {
        // tree.set({fruit: 'apple'}).commit()
        // expect(widgetRenderCount).toEqual(1)
      })

      it("doesn't update when the relevant branch hasn't been touched", () => {
      })

      it("doesn't call render if the state from tree is the same", () => {
      })

    })

    describe("parent-child relationships", () => {

      let Container

      beforeEach(() => {
        Container = class Container extends app.Component {
          stateFromTree () {
            return {

            }
          }
          render () { return <div><Widget/></div> }
        }
      })

      it("only updates once even though its parent wants to update it as well as itself", () => {
      })
    })

  })

})
