'use strict';

process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk')
const fs = require('fs-extra')

module.exports = function(config, rootDir) {
  const webpackConfigFunc = require(path.resolve(rootDir, './scripts/vue/webpack.prod.js'))
  const webpackConfig = webpackConfigFunc(process.cwd(), config)
  const compiler = webpack(webpackConfig);

  return new Promise((resolve, reject) => {
    console.log(
      chalk.cyan('start building...')
    );

    fs.removeSync(path.resolve(process.cwd(), 'dist'))
    
    compiler.run((err, stats) => {
      if (err) {
        console.log(
          chalk.red(`start failed..., err:${err}`)
        );
        return reject(err);
      }
      console.log(
        chalk.cyan('build content in bellow place:')
      );
      console.log(
        chalk.green(`${webpackConfig.output && webpackConfig.output.path}`)
      );
      console.log(
        chalk.cyan('build finished.')
      );
      return resolve({
        stats
      });
    });
  })
}
