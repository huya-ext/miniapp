const path = require('path')
const chalk = require('chalk')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack')
//使用path.posix统一路径
function assetsPath(_path) {
    return path.posix.join('static', _path)
}

//使用NamedChunksPlugin
const seen = new Set();
const nameLength = 4;

function basename(file) {
    return path.basename(file);
}

function htmlPluginsTpl(filename, template, chunks) {
    return {
        filename,
        template,
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency',
        chunks: chunks.concat['vendors', 'runtime']
    }
}

module.exports = function(cwd, config) {
    function resolve(dir) {
        return path.join(cwd, '.', dir)
    }

    let htmlPlugins = [], entrys = {}

    for (let i = 0; i < config.pages.length; i++) {
        const page = config.pages[i];
        const entryKey = Object.keys(page.entry)[0];

        if (typeof entryKey === 'undefined') {
            console.log(`${chalk.red('lack of app entry in project.config.js, please config it.')}`)
            process.exit(1)
        }

        entrys[entryKey] = resolve(page.entry[entryKey])
        htmlPlugins.push(
            new HtmlWebpackPlugin(
                htmlPluginsTpl(basename(page.template), page.template, entryKey)
            )
        )
    }

    //InlineManifestWebpackPlugin shound be placed after htmlwebpackplugin
    htmlPlugins.push(new InlineManifestWebpackPlugin('runtime'))

    return {
        context: cwd,
        mode: 'production',
        entry: entrys,
        output: {
            path: path.resolve(cwd, './dist'),
            filename: assetsPath('js/[name].[chunkhash:10].js'),
            publicPath: '/'
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
                    MiniCssExtractPlugin.loader,
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
        },
        plugins: [
            new CleanWebpackPlugin(['dist']),
            new OptimizeCSSAssetsPlugin({}),
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: assetsPath('css/[name].[contenthash:10].css')
                // chunkFilename: devMode ? assetsPath('[id].css') : assetsPath('css/[id].[chunkhash:10].css')
            }),
            //使用 HashedModuleIdsPlugin 固定 moduleId
            new webpack.HashedModuleIdsPlugin(),
            //使用 NamedChunkPlugin结合自定义 nameResolver 来固定 chunkId
            new webpack.NamedChunksPlugin(chunk => {
                if (chunk.name) {
                    return chunk.name;
                }
                const modules = Array.from(chunk.modulesIterable);
                if (modules.length > 1) {
                    const hash = require("hash-sum");
                    const joinedHash = hash(modules.map(m => m.id).join("_"));
                    let len = nameLength;
                    while (seen.has(joinedHash.substr(0, len))) len++;
                    seen.add(joinedHash.substr(0, len));
                    return `chunk-${joinedHash.substr(0, len)}`;
                } else {
                    return modules[0].id;
                }
            }),
        ].concat(htmlPlugins),
        optimization: {
            removeAvailableModules: false,
            removeEmptyChunks: false,
            runtimeChunk: {
                name: 'runtime'
            },
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            }
        }
    }
}