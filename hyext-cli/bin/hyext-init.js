#!/usr/bin/env node

const commander = require('commander')
const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')
const inquirer = require('inquirer')
const chalk = require('chalk')
const shell = require('shelljs')
const os = require('os')
const spawn = require('cross-spawn');
const semver = require('semver');
const envinfo = require('envinfo');
const execSync = require('child_process').execSync;
const clearConsole = require('console-clear');

const packageJson = require('../package.json');

let projectName;

const program = new commander.Command(packageJson.name)
	.version(packageJson.version)
	.arguments('<project-directory>')
	.usage(`init ${chalk.green('<project-directory>')} [options]`)
	.action(name => {
		projectName = name;
	})
	.option('--info', 'print environment debug info')
	.option('--verbose', 'print detail info')
	.option('--use-npm')
	.allowUnknownOption()
	.on('--help', () => {
		console.log(`  Only ${chalk.green('<project-directory>')} is required.`);
		console.log();
	})
	.parse(process.argv);

//hyext init --info will get env info below.
if (program.info) {
	console.log(chalk.bold('\nEnvironment Info:'));
	return envinfo
		.run({
			System: ['OS', 'CPU'],
			Binaries: ['Node', 'npm', 'Yarn'],
			Browsers: ['Chrome', 'Edge', 'Internet Explorer', 'Firefox', 'Safari'],
			npmGlobalPackages: ['hyext'],
		}, {
			clipboard: false,
			duplicates: true,
			showNotFound: true,
		})
		.then(console.log);
}

if (typeof projectName === 'undefined') {
	console.error('Please specify the project directory:');
	console.log(
		`  ${chalk.cyan(program.name())} init ${chalk.green('<project-directory>')}`
	);
	console.log();
	console.log('For example:');
	console.log(`  ${chalk.cyan(program.name())} init ${chalk.green('my-hyext-app')}`);
	console.log();
	console.log(
		`Run ${chalk.cyan(`${program.name()} init --help`)} to see all options.`
	);
	process.exit(1);
}

checkProjectName(projectName, program.useNpm)
	.then(() => {
		inquirer.prompt([{
			type: 'list',
			message: 'Select a library for your project',
			name: 'library',
			choices: [{
				name: 'vue'
			}, {
				name: 'react'
			}, {
				name: 'jquery'
			}, {
				name: 'react-native'
			}]
		}]).then(answers => {
			createApp(
				projectName,
				answers.library,
				program.useNpm
			)
		})
	})


//check projectName exist in current directory, or the same with root dirname.
function checkProjectName(pname) {
	const filesList = glob.sync('*')
	const rootName = path.basename(process.cwd())
	let next = undefined
	if (filesList.length) {
		if (filesList.filter(name => {
				const fileName = path.resolve(process.cwd(), path.join('.', name))
				const isDir = fs.statSync(fileName).isDirectory()
				return name.indexOf(pname) !== -1 && isDir
			}).length !== 0) {
			console.log(`${pname} directory is exist`)
			next = Promise.reject(pname)
		} else {
			next = Promise.resolve(pname)
		}

	} else if (rootName === pname) {
		next = inquirer.prompt([{
			name: 'createInCurrent',
			message: 'The directory name is the same as the project name. Do you want to create a new project directly in the current directory?',
			type: 'confirm',
			default: true
		}]).then(answer => {
			return Promise.resolve(answer.createInCurrent ? pname : '.')
		})
	} else {
		next = Promise.resolve(pname)
	}

	return next;
}

function shouldUseYarn() {
	try {
		execSync('yarnpkg --version', {
			stdio: 'ignore'
		});
		return true;
	} catch (e) {
		return false;
	}
}

function createApp(name, library, useNpm) {
	if (library == 'react-native') {
		runRN(name);
		return;
	}

	const root = path.resolve(name);
	const appName = path.basename(root);

	fs.ensureDirSync(name);

	console.log(`Creating a new ${library} app in ${chalk.green(name)}.`);
	console.log();

	const useYarn = useNpm ? false : shouldUseYarn();
	const originalDirectory = process.cwd();
	process.chdir(root);

	//node version lower than 6, notice to update.
	if (!semver.satisfies(process.version, '>=6.0.0')) {
		console.log(
			chalk.yellow(
				`You are using Node ${
	          process.version
	        } ,but the project needs Node 6 or higher\n\n` +
				`Please update it for a better, fully supported experience.\n`
			)
		);
		process.exit(1);
	}

	run(
		root,
		appName,
		library,
		originalDirectory,
		useYarn
	);
}

function run(
	root,
	appName,
	library,
	originalDirectory,
	useYarn
) {
	//copy library template and init library dependencies
	const dependencies = [library];
	const templatePath = path.resolve(path.join(originalDirectory, `template/${library}`));

	// Copy the files for the user
	if (fs.existsSync(templatePath)) {
		fs.copySync(templatePath, root);
	} else {
		console.error(
			`Could not locate supplied template: ${chalk.green(templatePath)}`
		);
		return;
	}

	console.log('Installing packages. This might take a couple of minutes.');
	install(
		root,
		useYarn,
		dependencies
	).then(() => {
		handleDevDenpencies(root, appName, originalDirectory, library, useYarn)
	}).catch((err) => {
		console.log();
		console.log('Aborting installation.');
		console.log(err)
		console.log(chalk.red('Unexpected error. Please report it as a bug.'));
		console.log('Done.');
		process.exit(1);
	});
}

function runRN(appname) {
	inquirer.prompt([{
		type: 'input',
		name: 'appid',
		message: "Please input the appid for your huya ext:"
	}]).then(answers => {
		console.log(answers.appid)
		const rnCreate = require('../rn/commands/createproject.js');
		rnCreate(appname, answers.appid)
	})
}

function executeNodeScript({
	cwd,
	args
}, data, source) {
	return new Promise((resolve, reject) => {
		const child = spawn(
			process.execPath, [...args, '-e', source, '--', JSON.stringify(data)], {
				cwd,
				stdio: 'inherit'
			}
		);

		child.on('close', code => {
			if (code !== 0) {
				reject({
					command: `node ${args.join(' ')}`,
				});
				return;
			}
			resolve();
		});
	});
}

//choose yarn or npm to install all dependencies
function install(root, useYarn, dependencies) {
	return new Promise((resolve, reject) => {
		let command;
		let args;
		if (useYarn) {
			command = 'yarnpkg';
			args = ['add', '--exact'];

			[].push.apply(args, dependencies);

			args.push('--cwd');
			args.push(root);
		} else {
			command = 'npm';
			args = [
				'install',
				'--save',
				'--save-exact',
				'--loglevel',
				'error',
			].concat(dependencies);
		}

		const child = spawn(command, args, {
			stdio: 'inherit'
		});
		child.on('close', code => {
			if (code !== 0) {
				reject({
					command: `${command} ${args.join(' ')}`,
				});
				return;
			}
			resolve();
		});
	});
}

//handle template dependencies
function handleDevDenpencies(
	appPath,
	appName,
	originalDirectory,
	library,
	useYarn
) {
	let command;
	let args = [];

	if (useYarn) {
		command = 'yarnpkg';
		args = ['install'];
	} else {
		command = 'npm';
		args = ['install']
	}

	const proc = spawn.sync(command, args, {
		cwd: appPath,
		stdio: 'inherit'
	});
	if (proc.status !== 0) {
		console.error(`\`${command} ${args.join(' ')}\` failed`);
		return;
	}

	fs.unlinkSync(path.join(
		appPath,
		'package.json'
	));

	clearConsole();

	console.log(`Project init ${chalk.yellow('finished')}.`)
	console.log(
		`  ${chalk.cyan('cd', appName)} `
	)

	console.log('then run with:')
	console.log(
		`  ${chalk.cyan('hyext run dev')} `
	)
};