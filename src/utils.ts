import * as vscode from 'vscode';
import * as cp from 'child_process';
import { readFileSync } from 'fs';
import { join, delimiter } from 'path';

export function executeCommandBase(path: string, command: string) {
	const config = vscode.workspace.getConfiguration();
	const nodePath: string | undefined = config.get('ng-afelio.node-path');

	let env: NodeJS.ProcessEnv | undefined;

	if (nodePath) {
		const pathKey = Object.keys(process.env).find(x => x.toUpperCase() === 'PATH') as string;
		env = {
			[pathKey]: nodePath + delimiter + process.env[pathKey]
		};
	}

	return new Promise((resolve, reject) => {
		cp.exec(command, { cwd: path, env }, (err, stdout, stderr) => {
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (err) {
				console.log('error: ' + err);
				reject({err, stderr});
			} else {
				resolve(stdout.trim());
			}
		});
	});
}

export function executeCommand(path: string, command: string, successMessage: string, errorMessage: string) {
	// return new Promise((resolve, reject) => {
	// 	cp.exec(command, { cwd: path }, (err, stdout, stderr) => {
	// 		console.log('stdout: ' + stdout);
	// 		console.log('stderr: ' + stderr);
	// 		if (err) {
	// 			console.log('error: ' + err);
	// 			reject(err);
	// 			vscode.window.showErrorMessage(errorMessage);
	// 		} else {
	// 			resolve(stdout.trim());
	// 			vscode.window.showInformationMessage(successMessage);
	// 		}
	// 	});
	// })
	return executeCommandBase(path, command).then(
		() => {
			vscode.window.showInformationMessage(successMessage);
		},
		(error) => {
			vscode.window.showErrorMessage(errorMessage, 'Show error').then((value) => {
				if (value === 'Show error') {
					vscode.window.showErrorMessage(error?.stderr);
				}
			});
		}
	);
}

export function executeCommandAndShowResult(path: string, command: string) {
	// return new Promise((resolve, reject) => {
	// 	console.log('Bob', path, command);
	// 	cp.exec(command, { cwd: path }, (err, stdout, stderr) => {
	// 		console.log('stdout: ' + stdout);
	// 		console.log('stderr: ' + stderr);
	// 		if (err) {
	// 			console.log('error: ' + err);
	// 			vscode.window.showErrorMessage(stderr);
	// 			reject(err);
	// 		} else {
	// 			const results = stdout.trim();
	// 			openInUntitled(results, 'markdown');
	// 			resolve('bob' + stdout.trim());
	// 		}
	// 	});
	// });
	return executeCommandBase(path, command).then(
		stdout => {
			openInUntitled(stdout as string, 'markdown');
		},
		error => {
			vscode.window.showErrorMessage(error.stderr);
		}
	);
}

export async function openInUntitled(content: string, language?: string) {
    const document = await vscode.workspace.openTextDocument({
        language,
        content,
    });
    vscode.window.showTextDocument(document);
}

export async function checkIfCliIsPresent(config: vscode.WorkspaceConfiguration) {
	if(vscode.workspace.workspaceFolders !== undefined) {
		let wf = vscode.workspace.workspaceFolders[0].uri.fsPath;

		let installedNgAfelioVersion: string;
		try {
			const fileContent = readFileSync(join(wf, 'package.json'), 'utf8');
			const packageContent = JSON.parse(fileContent);
			installedNgAfelioVersion = packageContent.devDependencies['ng-afelio'] || packageContent.dependencies['ng-afelio'];
		} catch (e) {
			console.error(e);
			vscode.window.showErrorMessage('Can not fount package.json into your project.');
			return;
		}

		if (installedNgAfelioVersion) {
			const versionExtract = /[\^\~]{0,1}([0-9a-zA-Z\.\-]*)/;
			const versionNumberExtract = /([0-9]\.[0-9])\.[0-9]/;
			const versionMatch = (installedNgAfelioVersion).match(versionExtract);
			const versionNumberMatch = (installedNgAfelioVersion).match(versionNumberExtract);
			if (versionMatch && versionNumberMatch && versionNumberMatch.length === 2 ) {
				if (Number(versionNumberMatch[1]) < 2.0) {
					vscode.window.showErrorMessage(`The ng-afelio extension is compatible with CLI version >=2.0.0 and you are using the version ${versionMatch[1]} in this project. Please upgrade the ng-afelio CLI.`);
				}
			}
		} else {
			let notFoundConfig = config.get('ng-afelio.when-cli-not-found');
			if (!notFoundConfig) {
				const notFoundConfigs: {[key: string]: string} = {
					'Add to project': 'add',
					'Install only': 'install',
					'Do nothing': 'off'
				};
				const notFoundAnswer = await vscode.window.showErrorMessage('ng-afelio CLI not found', ...Object.keys(notFoundConfigs));
				if (notFoundAnswer) {
					notFoundConfig = notFoundConfigs[notFoundAnswer] as string;
					if (notFoundConfig === 'off') {
						config.update('ng-afelio.when-cli-not-found', notFoundConfig, vscode.ConfigurationTarget.Workspace);
					}
				}
				if (notFoundConfig) {
					switch(notFoundConfig) {
						case 'add': 
							const addExecution = executeCommand(
								wf,
								`npx ng add ng-afelio@vscode --uiKit=none --skip-confirmation`,
								'ng-afelio installed',
								'Can not install ng-afelio'
							);
							vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'We are adding ng-afelio to this project' }, () => addExecution );
							break;
						case 'install':
							const installExecution = executeCommand(
								wf,
								`npm install --save-dev ng-afelio@vscode`,
								'ng-afelio installed',
								'Can not install ng-afelio'
							);
							vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio installation processing' }, () => installExecution );
							break;
						default:
							break;
					}
				}
			}
		}
	} 
	else {
		const message = "ng-afelio: Working folder not found, this extension can not be used into this context." ;
		vscode.window.showErrorMessage(message);
	}
}
