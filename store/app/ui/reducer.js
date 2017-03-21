var _ = require('lodash')
var constants = require('./constants')
var createReducer = require('crispy-redux/createReducer')
var schema = require('../../shared/schema')
var Immutable = require('immutable')

var TYPES = constants.types
var ERRORS = constants.errors

module.exports = createReducer(_.object([
    [TYPES.checkoutBegin.id, checkoutBegin],
    [TYPES.checkoutCancel.id, checkoutCancel],
    [TYPES.checkoutPay.id, checkoutPay],
    [TYPES.checkoutFailure.id, checkoutFailure],
    [TYPES.checkoutSuccess.id, checkoutSuccess],
    [TYPES.basketAdd.id, basketAdd],
    [TYPES.basketRemove.id, basketRemove],
    [TYPES.reset.id, reset],
]), function() {
    return Immutable.fromJS({
        charge: undefined,
        error: undefined,
        products: undefined,
        status: undefined,
        basket: undefined
    })
})

function checkoutBegin(state, payload) {
    return state.set('charge', Immutable.fromJS({
        amount: payload.amount,
        orderID: payload.id,
        status: 'begin'
    }))
}

function checkoutCancel(state) {
    return state.set('charge', undefined)
}

function checkoutPay(state, payload) {
    return state
        .setIn(['charge', 'status'], 'paid')
        .setIn(['charge', 'email'], payload.token.email)
        .setIn(['charge', 'token'], payload.token.id)
}

function checkoutFailure(state, err) {
    var error = _.includes(_.pluck(ERRORS, 'id'), err) ? err : ERRORS.chargeFailed.id
    return module.exports().merge({
        error: error,
        products: state.get('products'),
        basket: state.get('basket')
    })
}

function checkoutSuccess(state, payload) {
    return state.setIn(['charge', 'status'], 'success')
}

function basketAdd(state, payload) {
    return state
        .setIn(['products', payload.sku, 'inBasket'], true)
        .setIn(['basket', payload.sku], payload.quantity)
}

function basketRemove(state, payload) {
    return state
        .setIn(['products', payload, 'inBasket'], false)
        .deleteIn(['basket', payload])
}

function reset(state, payload) {
    if (!schema.products.isValid(payload)) return state.set('error', ERRORS.invalidSchema.id)
    return module.exports().merge({
        products: Immutable.fromJS(payload),
        basket: Immutable.fromJS({})
    })
}
