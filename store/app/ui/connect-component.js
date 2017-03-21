var _ = require('lodash')
var actions = require('./actions')
var connect = require('react-redux').connect

var KEYS = [
    'charge',
    'error',
    'products',
    'status',
    'basket'
]

module.exports = connect(mapStateToProps, actions)

function mapStateToProps(state) {
    return _.chain(KEYS)
        .map(function (key) {
            return [
                key,
                state.get(key),
            ]
        })
        .object()
        .value()
}
