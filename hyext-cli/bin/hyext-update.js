#!/usr/bin/env node

const commander = require('commander')
const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const packageJson = require('../package.json');

const program = new commander.Command(packageJson.name)
	.version(packageJson.version)
	.usage('update')
	.allowUnknownOption()
	.on('--help', () => {
		console.log();
		console.log('It must be used under your app ext project, for supporting react-native sdk.');
		console.log('Examples:');
		console.log('  hyext update');
	})
	.parse(process.argv);

let config, isApp = true;

try{
	config = require(path.resolve(process.cwd(), 'project.config.json'));
} catch(e) {
	isApp = false;
}

if(!isApp) {
	console.log(`Only support ${chalk.green('app client')}`);
	return;
}

const update = require('../rn/commands/update.js')
update();


