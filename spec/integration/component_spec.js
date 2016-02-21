import fs from 'fs'

describe("Component", () => {

  // Set up DOM

  let jsdom = require('jsdom')
  let jquery = fs.readFileSync('./node_modules/jquery/dist/jquery.min.js').toString()
  let $
  let React, utils

  let render = (element) => {
    return React.render(element, document.body)
  }

  beforeEach((done) => {
    jsdom.env({
      html: '<!doctype html><html><body></body></html>',
      src: [jquery],
      done: (error, window) => {
        if (error) { console.log("Error:", error) }
        global.window = window
        global.document = window.document
        global.navigator = window.navigator
        $ = window.jQuery
        React = require('react')
        utils = require('react/addons').addons.TestUtils
        done()
      }
    })
  })

  afterEach((done) => {
    React.unmountComponentAtNode(document.body)
    document.body.innerHTML = ""
    setTimeout(done)
  })

  //---------------

  let app

  beforeEach(() => {
    let App = require('../../src/app')
    app = new App()
    app.extendReact(React.Component.prototype)
  })

  describe("actions", () => {

    let Widget

    beforeEach(() => {
      Widget = class Widget extends React.Component {
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

    let Widget, widgetRenderCount, widgetShouldUpdateCount

    beforeEach(() => {
      widgetRenderCount = 0
      Widget = class Widget extends React.Component {
        treehouseState (t) {
          return {
            theFruit: t.at(['fruit'])
          }
        }

        shouldComponentUpdate (...args) {
          widgetShouldUpdateCount++
          return super.shouldComponentUpdate(...args)
        }

        render () {
          widgetRenderCount++
          return <div className="widget">{this.state.theFruit}</div>
        }
      }
    })

    it("renders from the tree", () => {
      app.trunk().set({fruit: 'orange', animal: 'sheep'})
      app.commit()
      render(<Widget/>)
      expect($('.widget').html()).toEqual('orange')
    })

    describe("updating", () => {

      beforeEach(() => {
        app.trunk().set({fruit: 'orange', animal: 'sheep'})
        app.commit()
        render(<Widget/>)
        widgetShouldUpdateCount = 0
        widgetRenderCount = 0
      })

      it("updates when the relevant branch has been touched", () => {
        app.at(['fruit']).set('apple')
        app.commit()
        expect($('.widget').html()).toEqual('apple')
        expect(widgetShouldUpdateCount).toEqual(1)
        expect(widgetRenderCount).toEqual(1)
      })

      it("doesn't update when the relevant branch hasn't been touched", () => {
        app.at(['animal']).set('sloth')
        app.commit()
        expect($('.widget').html()).toEqual('orange')
        expect(widgetShouldUpdateCount).toEqual(0)
        expect(widgetRenderCount).toEqual(0)
      })

      it("doesn't call render if the state from tree is the same", () => {
        app.at(['fruit']).set('orange')
        app.commit()
        expect($('.widget').html()).toEqual('orange')
        expect(widgetShouldUpdateCount).toEqual(1)
        expect(widgetRenderCount).toEqual(0)
      })

    })

    describe("parent-child relationships", () => {

      let Container, containerShouldUpdateCount, containerRenderCount

      beforeEach(() => {
        Container = class Container extends React.Component {
          treehouseState (t) {
            return {
              fruit: t.at(['fruit'])
            }
          }

          shouldComponentUpdate (...args) {
            containerShouldUpdateCount++
            return super.shouldComponentUpdate(...args)
          }

          render () {
            containerRenderCount++
            return <div className="container"><Widget/></div>
          }
        }
        app.trunk().set({fruit: 'orange'})
        app.commit()

        render(<Container/>)

        containerShouldUpdateCount = 0
        containerRenderCount = 0
        widgetShouldUpdateCount = 0
        widgetRenderCount = 0
      })

      it("only updates once even though its parent wants to update it as well as itself", () => {
        app.at(['fruit']).set('apple')
        app.commit()
        expect($('.container').text()).toEqual('apple')
        expect(containerShouldUpdateCount).toEqual(1)
        expect(containerRenderCount).toEqual(1)
        expect(widgetShouldUpdateCount).toEqual(1)
        expect(widgetRenderCount).toEqual(1)
      })
    })

  })

})
