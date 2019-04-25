#!/usr/bin/env node

const commander = require('commander')
const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')
const chalk = require('chalk')
const shell = require('shelljs')
const spawn = require('cross-spawn');
const execSync = require('child_process').execSync;
const clearConsole = require('console-clear');

const webpack = require('webpack')
const packageJson = require('../package.json');

const program = new commander.Command(packageJson.name)
	.version(packageJson.version)
	.usage('release')
	.allowUnknownOption()
	.on('--help', () => {
		console.log();
		console.log('Examples:');
		console.log('  hyext release');
	})
	.parse(process.argv);

let config, dir;

try{
	dir = 'web';
	config = require(path.resolve(process.cwd(), 'project.config.js'));
} catch(e) {
	try{
		dir = 'app';
		config = require(path.resolve(process.cwd(), 'project.config.json'));
	} catch(e) {
		console.log(
			`project.config.js or project.config.json is necessary.`
		);
		process.exit(1);
	}
}

const releaseDir = `${process.cwd()}/${dir}`;
fs.removeSync(releaseDir);
fs.ensureDirSync(releaseDir);

glob(`${process.cwd()}/*`,function (er, files) {
    for(let i=0;i<files.length;i++) {
    	const basename = path.basename(files[i])
    	if(files[i].indexOf('node_modules') < 0 && files[i].indexOf('dist') < 0 && basename != dir) {
    		fs.copySync(path.resolve('.', files[i]), `${releaseDir}/${basename}`)
    	}
    }

    console.log(
		chalk.cyan(`Release your project source code at ${chalk.green(releaseDir)}`)
	);
	console.log(
		`${chalk.cyan('Now you can pack your web and app directory to a zip, and uploading it to hyext open platform.')}`
	);
})


