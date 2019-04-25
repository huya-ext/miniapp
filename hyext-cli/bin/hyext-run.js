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

let mode;

const program = new commander.Command(packageJson.name)
	.version(packageJson.version)
	.arguments('<env>')
	.usage(`run ${chalk.green('<env>')} [options]`)
	.action(env => {
		mode = env;
	})
	.allowUnknownOption()
	.on('--help', () => {
		console.log(`  Only ${chalk.green('<env>')} is required.`);
		console.log();
		console.log('Examples:');
		console.log(`  hyext run ${chalk.green('dev')},  run project in ${chalk.green('development')} environment`);
		console.log(`  hyext run ${chalk.green('build')},  run project in ${chalk.green('production')} environment, only supports web client.`);
	})
	.parse(process.argv);

if (typeof mode === 'undefined') {
	console.error('Please specify the env:');
	console.log(
		`  ${chalk.cyan(program.name())} run ${chalk.green('<env>')}`
	);
	console.log();
	console.log('For example:');
	console.log(`  ${chalk.cyan(program.name())} run ${chalk.green('dev')}`);
	console.log('or');
	console.log(`  ${chalk.cyan(program.name())} run ${chalk.green('build')}`);
	console.log();
	console.log(
		`Run ${chalk.cyan(`${program.name()} run --help`)} to see all options.`
	);
	process.exit(1);
}

let config, isApp = false

try{
	config = require(path.resolve(process.cwd(), 'project.config.js'));
} catch (e) {
	isApp = true;
}

//对app特殊处理
if(isApp) {
	if(mode == 'build') {
		console.log(
			chalk.cyan(`${chalk.green('hyext run build')} only supports web client.`)
		);
		return;
	}
	const server = require('../rn/commands/server.js')
	server();
	return;
}

//config.lib is necessary
if (typeof config.lib === 'undefined') {
	console.log(`${chalk.red('config.lib is necessary in project.config.js, do not modify it after project being created.')}`)
	process.exit(1)
}

compileWebpack(mode, config);

function compileWebpack(modeEnv, projectConfig) {
	// const source = `
 //       var start = require('../scripts/${projectConfig.lib}/${modeEnv == 'dev' ? 'start' : 'build'}.js');
 //       start.apply(null, JSON.parse(process.argv[1]));
 //     `
	// const data = [projectConfig, '../']
	// const child = spawn(
	// 	process.execPath, [...[], '-e', source, '--', JSON.stringify(data)], {
	// 		stdio: 'inherit'
	// 	}
	// );

	// child.on('close', code => {
	// 	if (code !== 0) {
	// 		console.log(`${chalk.red('hyext run fail.')}`)
	// 		return;
	// 	}
	// 	console.log(`${chalk.green('hyext run successful.')}`)
	// });
	const script = require(`../scripts/${projectConfig.lib}/${modeEnv == 'dev' ? 'start' : 'build'}.js`)
	script(projectConfig, '../')
}

