var BPromise = require('bluebird')
var market = require('./server')
var Hapi = require('hapi')
var Joi = require('joi')

var optionsSchema = market.optionsSchema.keys({
    port: Joi.number().integer().default(8000),
    tls: Joi.object(),
})

exports.createServer = createServer
exports.startServer = startServer

function createServer(options) {
    return new BPromise(function(resolve, reject) {
        var validation = Joi.validate(options, optionsSchema)
        if (validation.error) return reject(validation.error)
        options = validation.value
        var server = new Hapi.Server()
        server.connection({
            port: options.port,
            tls: options.tls,
        })
        server.register({
            register: market,
            options: {
                corsOrigins: options.corsOrigins,
                stripeSecretKey: options.stripeSecretKey,
                gmailAccount: options.gmailAccount,
                gmailPassword: options.gmailPassword
            },
        }, function(err) {
            if (err) return reject(err)
            return resolve(server)
        })
    })
}

function startServer(options) {
    return createServer(options)
        .then(function(server) {
            return new BPromise(function(resolve, reject) {
                server.start(function(err) {
                    if (err) return reject(err)
                    return resolve(server)
                })
            })
        })
}
