const path = require('path')
const webpack = require('webpack')

//使用path.posix统一路径
function assetsPath(_path) {
	return path.posix.join('assets', _path)
}

module.exports = function(cwd, config) {
	function resolve(dir) {
		return path.join(cwd, '.', dir)
	}
	return {
		mode: 'development',
		context: cwd,
		output: {
			path: path.resolve(cwd, './dist'),
			filename: '[name].js',
			publicPath: `http://${config.host}:${config.port}/` //这里决定着资源引用的路径
		},
		resolve: {
			extensions: ['.js', 'hdb', '.json'],
			modules: ["src", "node_modules"],
			alias: {
				'@': resolve('src'),
				'src': resolve('src'),
				'assets': resolve('src/assets'),
				'components': resolve('src/components')
			}
		},
		module: {
			rules: [{
				test: /\.(js)$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					cacheDirectory: true,
					presets: [
						['@babel/preset-env', {
							modules: false
						}]
					]
				}
			}, {
				test: /\.hdb$/,
				loader: "handlebars-loader"
			}, {
				test: /\.(css|scss)$/,
				use: [
					'style-loader',
					"css-loader", {
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: (loader) => [
								require('autoprefixer'),
								require('postcss-import')({
									root: loader.resourcePath
								})
							]
						}
					},
					"sass-loader"
				]
			}, {
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 8192,
						name: '[name].[ext]',
						fallback: 'file-loader',
						outputPath: assetsPath('img')
					},
				}, {
					loader: 'image-webpack-loader',
					options: {
						mozjpeg: {
							mozjpeg: {
								progressive: true,
								quality: 65,
							},
							pngquant: {
								quality: '65-90',
								speed: 4,
							},
							gifsicle: {
								interlaced: false,
							},
							webp: {
								quality: 75,
							},
						},
					},
				}, ],
			}, {
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: assetsPath('fonts/[name].[ext]')
				}
			}]
		},
		plugins: [
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery'
			})
		]
	}
}