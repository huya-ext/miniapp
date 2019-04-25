const path = require('path')

//使用path.posix统一路径
function assetsPath(_path) {
	return path.posix.join('static', _path)
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
			publicPath: `http://${config.host}:${config.port}/`//这里决定着资源引用的路径
		},
		resolve: {
			extensions: ['.js', '.jsx', '.json'],
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
				test: /\.(js|jsx)$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					cacheDirectory: true,
					presets: [
						"@babel/preset-react", ['@babel/preset-env', {
							modules: false
						}]
					]
				}
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
				test: /\.(png|jpg|gif)$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: assetsPath('img/[name].[hash:10].[ext]')
					}
				}]
			}, {
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: assetsPath('fonts/[name].[hash:10].[ext]')
				}
			}]
		}
	}
}