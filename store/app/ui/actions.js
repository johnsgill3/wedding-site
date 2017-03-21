var _ = require('lodash')
var Bluebird = require('bluebird')
var constants = require('./constants')
var client = require('../client')
var stripeCheckout = require('./stripe-checkout')
var config = require('../config')
var schema = require('../../shared/schema')

var TYPES = constants.types
var ERRORS = constants.errors
var STRIPE_CHECKOUT_FIELDS = [
    'allowRememberMe',
    'amount',
    'billingAddress',
    'currency',
    'image',
    'panelLabel',
    'zipCode',
]

exports.checkout = checkout
exports.addToBasket = addToBasket
exports.removeFromBasket = removeFromBasket
exports.reset = reset

function checkout() {
    return function(dispatch, getState) {
        return Bluebird.resolve()
            .then(function() {
                var orderPayload = {
                    items: _.map(getState().get('basket').toJS(), function(val, key) {
                        return {
                            parent: key,
                            quantity: val
                        }
                    })
                }
                return client.createOrder(orderPayload)
                    .then(function(order) {
                        dispatch({
                            type: TYPES.checkoutBegin.id,
                            payload: order.data
                        })
                    })
            })
            .then(function() {
                return new Bluebird(function(resolve, reject) {
                    var validation = schema.stripe.validate(getState().get('charge')
                        .filter(function(val, key) {
                            return _.contains(STRIPE_CHECKOUT_FIELDS, key)
                        }).toJS())
                    if (validation.error) return reject(new Bluebird.OperationalError(validation.error))
                    stripeCheckout.configure({
                            key: config.stripePK
                        })
                        .open(_.extend(validation.value, {
                            closed: function() {
                                if (getState().getIn(['charge', 'status']) === 'begin') {
                                    var cancelPayload = getState()
                                        .get('charge')
                                        .filter(function(val, key) {
                                            return _.contains(['orderID'], key)
                                        })
                                    return client.cancelOrder(cancelPayload.toJS())
                                        .then(function() {
                                            return reject(new Bluebird.OperationalError(ERRORS.cancelled.id))
                                        })
                                }
                            },
                            token: function() {
                                dispatch({
                                    type: TYPES.checkoutSuccess.id,
                                })
                                return resolve(_.toArray(arguments))
                            },
                        }))
                })
            })
            .spread(function(token, addresses) {
                dispatch({
                    type: TYPES.checkoutPay.id,
                    payload: {
                        addresses: addresses,
                        token: token,
                    }
                })
                var orderPayload = getState()
                    .get('charge')
                    .filter(function(val, key) {
                        return _.contains(['orderID', 'token', 'email'], key)
                    })
                return client.payOrder(orderPayload.toJS())
            })
            .then(function() {
                return client.getProductList()
                    .then(function(data) {
                        dispatch({
                            type: TYPES.reset.id,
                            payload: data.data
                        })
                    })
            })
            .error(function(err) {
                switch (err.message) {
                    case ERRORS.cancelled.id:
                        return dispatch({
                            type: TYPES.checkoutCancel.id,
                            payload: undefined
                        })
                    default:
                        return dispatch({
                            type: TYPES.checkoutFailure.id,
                            payload: err
                        })
                }
            })
    }
}

function addToBasket(sku, quantity) {
    return function(dispatch, getState) {
        dispatch({
            type: TYPES.basketAdd.id,
            payload: {
                sku: sku,
                quantity: quantity
            }
        })
    }
}

function removeFromBasket(sku) {
    return function(dispatch, getState) {
        dispatch({
            type: TYPES.basketRemove.id,
            payload: sku
        })
    }
}

function reset(schema) {
    return {
        type: TYPES.reset.id,
        payload: schema
    }
}
