var ExtractTextPlugin = require('extract-text-webpack-plugin')
var path = require('path')
var webpack = require('webpack')

module.exports = {
    context: path.resolve(__dirname, './app/'),
    devtool: 'source-map',
    entry: {
        app: './entry',
    },
    module: {
        loaders: [
            {
                test: require.resolve('react'),
                loader: 'expose?React',
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
            },
            {
                test: /\.jsx$/,
                loader: 'jsx-loader',
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader'),
            },
            {
                test: /\.woff$/,
                loader: 'url-loader?limit=100000',
            },
        ],
    },
    node: {
        dns: 'empty',
        net: 'empty',
    },
    output: {
        filename: '[name].js',
        library: 'honeyfund',
        libraryTarget: 'var',
        path: path.resolve(__dirname, '../js')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                PLATFORM: JSON.stringify('browser'),
            },
        }),
        new ExtractTextPlugin('../css/[name].css', {
            allChunks: true,
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            comments: /^remove all comments$/,
            mangle: true,
        }),
        new webpack.optimize.OccurenceOrderPlugin(true),
    ],
    resolveLoader: {
        root: path.resolve(__dirname, '../node_modules/'),
    },
}
