var _ = require('lodash')
var Boom = require('boom')
var BPromise = require('bluebird')
var createStripeClient = require('stripe')
var fs = require('fs')
var Joi = require('joi')
var nodemailer = require('nodemailer')
var moment = require('moment')
var pkg = require('../../package.json')
var schema = require('../shared/schema')
var util = require('util')

var DEFAULT_CORS_ORIGINS = ['*']

var optionsSchema = Joi.object().keys({
    corsOrigins: Joi.array().min(1).items(Joi.string()).default(DEFAULT_CORS_ORIGINS),
    stripeSecretKey: Joi.string().token().required(),
    gmailAccount: Joi.string().email().required(),
    gmailPassword: Joi.string().token().required(),
})

exports.register = register
exports.optionsSchema = optionsSchema

register.attributes = {
    pkg: pkg,
}

function register(webServer, options, next) {
    var validation = Joi.validate(options, optionsSchema)
    if (validation.error) return next(validation.error)
    options = validation.value
    var stripe = createStripeClient(options.stripeSecretKey)
    var cors = {
        origin: options.corsOrigins,
    }

    var emailServer = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: options.gmailAccount,
            pass: options.gmailPassword
        }
    });

    webServer.on('response', function(request) {
        console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.path + ' --> ' + request.response.statusCode);
    });

    // Validate Stripe Secret Key
    webServer.route({
        config: {
            id: 'stripe-status',
        },
        method: 'GET',
        path: '/',
        handler: function(req, reply) {
            return new BPromise(function(resolve, reject) {
                    stripe.accounts.retrieve(function(err) {
                        if (err) {
                            return resolve({
                                code: 'invalid_stripe_configuration',
                                message: err.message,
                            })
                        }
                        return resolve({
                            message: "Stripe Account Valid"
                        })
                    })
                })
                .then(function(res) {
                    return reply({
                        code: 'ok',
                        data: res
                    })
                }, function(err) {
                    if (err.isBoom) return reply(err)
                    return reply(Boom.badImplementation())
                })
        },
    })

    // Get List of Products from Stripe
    webServer.route({
        config: {
            cors: cors,
            id: 'stripe-get-products'
        },
        method: 'GET',
        path: '/get-product-list',
        handler: function(req, reply) {
            return new BPromise(function(resolve, reject) {
                    stripe.products.list({active: true, limit: 100}, function(err, products) {
                        if (err) return reject(Boom.badGateway(err.message))
                        retProducts = _.reduce(products['data'], function(result, product) {
                            result[product['skus']['data'][0]['id']] = {
                                price: product['skus']['data'][0]['price'],
                                name: product['name'],
                                description: product['description'],
                                images: product['images'],
                                quantity: product['skus']['data'][0]['inventory']['quantity']
                            }
                            return result
                        }, {})
                        retProducts = _.pick(retProducts, function(val, key) {
                            return val['quantity'] > 0
                        })
                        return resolve(retProducts)
                    })
                })
                .then(function(res) {
                    return reply({
                        code: 'ok',
                        data: res
                    })
                }, function(err) {
                    if (err.isBoom) return reply(err)
                    return reply(Boom.badImplementation())
                })
        },
    })
    webServer.route({
        config: {
            cors: cors,
            id: 'get-producs-preflight',
        },
        method: 'OPTIONS',
        path: '/get-product-list',
        handler: function(req, reply) {
            return reply()
        },
    })

    // Create an Order
    //  - Checks inventory
    //  - Gets total
    webServer.route({
        config: {
            cors: cors,
            id: 'stripe-create-order',
            validate: {
                payload: schema.createOrder,
            },
        },
        method: 'POST',
        path: '/create-order',
        handler: function(req, reply) {
            stripePayload = req.payload
            return new BPromise(function(resolve, reject) {
                    stripe.orders.create(stripePayload, function(err, orderDetails) {
                        if (err) return reject(Boom.badGateway(err.message))
                        // TODO: Trim down order details?
                        return resolve(orderDetails)
                    })
                })
                .then(function(res) {
                    return reply({
                        code: 'ok',
                        data: res
                    })
                }, function(err) {
                    if (err.isBoom) return reply(err)
                    return reply(Boom.badImplementation())
                })
        },
    })
    webServer.route({
        config: {
            cors: cors,
            id: 'create-order-preflight',
        },
        method: 'OPTIONS',
        path: '/create-order',
        handler: function(req, reply) {
            return reply()
        },
    })

    // Pay for an Order
    //  - Takes the Order and Token
    //  - Submits to Stripe
    webServer.route({
        config: {
            cors: cors,
            id: 'stripe-pay-order',
            validate: {
                payload: schema.payOrder,
            },
        },
        method: 'POST',
        path: '/pay-order',
        handler: function(req, reply) {
            return new BPromise(function(resolve, reject) {
                    stripe.orders.pay(req.payload.orderID, {
                        source: req.payload.token,
                        email: req.payload.email
                    }, function(err, orderDetails) {
                        if (err) return reject(Boom.badGateway(err.message))
                        return resolve()
                    })
                })
                .then(function() {
                    return reply({
                        code: 'ok',
                    })
                }, function(err) {
                    if (err.isBoom) return reply(err)
                    return reply(Boom.badImplementation())
                })
        },
    })
    webServer.route({
        config: {
            cors: cors,
            id: 'pay-order-preflight',
        },
        method: 'OPTIONS',
        path: '/pay-order',
        handler: function(req, reply) {
            return reply()
        },
    })

    // Pay for an Order
    //  - Takes the Order and Token
    //  - Submits to Stripe
    webServer.route({
        config: {
            cors: cors,
            id: 'stripe-cancel-order',
            validate: {
                payload: schema.cancelOrder,
            },
        },
        method: 'POST',
        path: '/cancel-order',
        handler: function(req, reply) {
            return new BPromise(function(resolve, reject) {
                    stripe.orders.update(req.payload.orderID, {
                        status: 'canceled'
                    }, function(err, orderDetails) {
                        if (err) return reject(Boom.badGateway(err.message))
                        return resolve()
                    })
                })
                .then(function() {
                    return reply({
                        code: 'ok',
                    })
                }, function(err) {
                    if (err.isBoom) return reply(err)
                    return reply(Boom.badImplementation())
                })
        },
    })
    webServer.route({
        config: {
            cors: cors,
            id: 'cancel-order-preflight',
        },
        method: 'OPTIONS',
        path: '/cancel-order',
        handler: function(req, reply) {
            return reply()
        },
    })

    // Handle Stripe Webook Events
    webServer.route({
        config: {
            id: 'stripe-webhook'
        },
        method: 'POST',
        path: '/webhook',
        handler: function(req, reply) {
            return new BPromise(function(resolve, reject) {
                    stripe.orders.retrieve(req.payload.data.object.order,
                        function(err, orderDetails) {
                            if (err) return reject(Boom.badGateway(err.message))

                            var template = _.template(fs.readFileSync('store/server/receipt_template.html', 'utf8'), {
                                'imports': {
                                    'moment': moment
                                }
                            })

                            var cardImgW;
                            switch(req.payload.data.object.source.brand) {
                                case 'Unknown':
                                    cardImgW = 22
                                    req.payload.data.object.source.brand = 'Default'
                                    break
                                case 'Visa':
                                    cardImgW = 36
                                    break
                                case 'MasterCard':
                                    cardImgW = 75
                                    break
                                case 'American Express':
                                    cardImgW = 45
                                    req.payload.data.object.source.brand = 'Amex'
                                    break
                                case 'Discover':
                                    cardImgW = 57
                                    break
                                case 'JCB':
                                    cardImgW = 19
                                    break
                                case 'Diners Club':
                                    cardImgW = 20
                                    req.payload.data.object.source.brand = 'Diners'
                                    break
                            }

                            // setup email data
                            var mailOptions = {
                                from: '"John & Rachel" <king2bgill+stinegillwedding@gmail.com>',
                                to: orderDetails.email,
                                subject: 'Receipt for Order at StineGillWedding',
                                html: template({
                                    order: orderDetails,
                                    charge: req.payload.data.object,
                                    cardImgW: cardImgW
                                })
                            }

                            // send mail with defined emailServer
                            emailServer.sendMail(mailOptions, function(error, info) {
                                if (error) {
                                    return reject(Boom.badGateway(error));
                                }
                                return resolve()
                            })
                            return resolve(orderDetails)
                        })
                })
                .then(function() {
                    return reply({
                        code: 'ok'
                    })
                })
                .error(function(err) {
                    if (err.isBoom) return reply(err)
                    return reply(Boom.badImplementation())
                })
        },
    })

    return next()
}
