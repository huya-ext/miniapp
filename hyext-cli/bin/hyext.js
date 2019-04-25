#!/usr/bin/env node

'use strict';

var chalk = require('chalk');

var currentNodeVersion = process.versions.node;
var semver = currentNodeVersion.split('.');
var major = semver[0];

if (major < 8) {
	console.error(
		chalk.red(
			'You are running Node ' +
			currentNodeVersion +
			'.\n' +
			'Create Huya Ext App requires Node 8 or higher. \n' +
			'Please update your version of Node.'
		)
	)
	process.exit(1);
}

const program = require('commander')
program.version('1.0.0')
	.usage('<command> <project-directory>')
	.command('init', 'initialize a project with <project-directory>')
	.command('run', 'run <project-directory> in dev or prod mode with parameter')
	.command('release', 'release source code to a web or app folder for uploading')
	.command('update', 'update huya react-native sdk, only support app client.')
	.parse(process.argv)
