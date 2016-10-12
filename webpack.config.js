var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules').filter(function(x) {
	return ['.bin'].indexOf(x) === -1;
}).forEach(function(mod) {
	nodeModules[mod] = 'commonjs ' + mod;
});

module.exports = {
	entry: {
		main: './src/main.js',
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[name].bundle.js'
	},
	externals: nodeModules,
	target: 'node',
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		]
	},
	stats: {
		colors: true
	},
	devtool: 'source-map',
	watch: true
};
