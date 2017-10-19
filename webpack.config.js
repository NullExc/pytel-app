var CleanWebpackPlugin = require('clean-webpack-plugin');
var path = require('path');
var config = require('./client-config.js');

var entries = {};

var pathsToClean = [
    'public/dist'
]

config.scripts.forEach(function (script) {
    entries[script] = config.srcDir + script;
});

module.exports = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, config.destDir),
        publicPath: './',
        filename: '[name].js'
    },
    watch: true,
    plugins: [
        new CleanWebpackPlugin(pathsToClean)
    ]
}
