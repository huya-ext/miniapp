module.exports = {
  lintOnSave: true,
  publicPath: './',
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap((options) => Object.assign(options, { limit: 0 }));
  },
};
