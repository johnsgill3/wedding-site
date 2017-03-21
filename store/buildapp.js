var Bluebird = require('bluebird')
var webpack = require('webpack')
var webpackConfig = require('./webpack.config')

function buildApp() {
    return new Bluebird(function (resolve, reject) {
        var compiler = webpack(webpackConfig)
        compiler.run(function (err, stats) {
            if (err) return reject(err)
            if (stats.hasErrors()) return reject(new Bluebird.OperationalError(stats.toJson().errors))
            return resolve()
        })
    })
}

Bluebird.resolve()
    .then(buildApp.bind(undefined))
