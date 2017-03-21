var Bluebird = require('bluebird')
var Boom = require('boom')
var schema = require('../../shared/schema')
var reqwest = require('reqwest')
var url = require('url')
var config = require('../config')

module.exports = {
    getProductList: function() {
        return request('/get-product-list', 'get')
    },
    createOrder: function(data) {
        var validation = schema.createOrder.validate(data)
        if (validation.error) return Bluebird.reject(new Bluebird.OperationalError(validation.error))
        return request('/create-order', 'post', validation.value)
    },
    payOrder: function(data) {
        var validation = schema.payOrder.validate(data)
        if (validation.error) return Bluebird.reject(new Bluebird.OperationalError(validation.error))
        return request('/pay-order', 'post', validation.value)
    },
    cancelOrder: function(data) {
        var validation = schema.cancelOrder.validate(data)
        if (validation.error) return Bluebird.reject(new Bluebird.OperationalError(validation.error))
        return request('/cancel-order', 'post', validation.value)
    },
}

function request(uri, method, data) {
    return new Bluebird(function(resolve, reject) {
        reqwest({
            contentType: 'application/json',
            crossOrigin: true,
            data: JSON.stringify(data),
            error: function(xhr) {
                try {
                    return reject(new Bluebird.OperationalError(Boom.create(xhr.status, JSON.parse(xhr.response).error)))
                } catch (ex) {
                    return reject(new Bluebird.OperationalError(Boom.create(400, 'An error occurred')))
                }
            },
            method: method,
            success: resolve,
            type: 'json',
            url: url.format({
                host: config.host,
                protocol: 'https',
                pathname: uri,
            }),
        })
    })
}
