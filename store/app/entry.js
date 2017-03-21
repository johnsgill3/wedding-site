var actions = require('./ui').actions
var Component = require('./theme/registry.jsx')
var connect = require('./ui').connect
var Provider = require('react-redux').Provider
var React = require('react')
var ReactDom = require('react-dom')
var store = require('./ui').store
var client = require('./client')
var config = require('./config')
var ResizeSensor = require('css-element-queries/src/ResizeSensor')

module.exports = function(htmlElement) {
    client.getProductList()
        .then(function(data) {
            store.dispatch(actions.reset(data.data))
            var provider = React.createElement(Provider, {
                store: store
            }, React.createElement(connect(Component)))
            var ele = ReactDom.render(provider, htmlElement)
            var element = document.getElementById('store');
            new ResizeSensor(element, function() {
                document.getElementById('store-root').style.height = element.clientHeight + "px"
            })
            return ele
        })
}
