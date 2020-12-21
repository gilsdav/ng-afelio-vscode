// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from 'child_process';

function executeCommand(path: string, command: string, successMessage: string, errorMessage: string) {
	return new Promise((resolve, reject) => {
		cp.exec(command, { cwd: path }, (err, stdout, stderr) => {
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (err) {
				console.log('error: ' + err);
				reject(err);
				vscode.window.showErrorMessage(errorMessage);
			} else {
				resolve(stdout.trim());
				vscode.window.showInformationMessage(successMessage);
			}
		});
	})
}

function executeCommandAndShowResult(path: string, command: string) {
	return new Promise((resolve, reject) => {
		console.log('Bob', path, command);
		cp.exec(command, { cwd: path }, (err, stdout, stderr) => {
			console.log('stdout: ' + stdout);
			console.log('stderr: ' + stderr);
			if (err) {
				console.log('error: ' + err);
				vscode.window.showErrorMessage(stderr);
				reject(err);
			} else {
				const results = stdout.trim();
				openInUntitled(results, 'markdown');
				resolve('bob' + stdout.trim());
			}
		});
	})
}

async function openInUntitled(content: string, language?: string) {
    const document = await vscode.workspace.openTextDocument({
        language,
        content,
    });
    vscode.window.showTextDocument(document);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ng-afelio" is now active!');

	const disposables = [];

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	disposables.push(vscode.commands.registerCommand('ng-afelio.component', async (currentElement) => {
		// The code you place here will be executed every time your command is executed
		console.log(currentElement.path);
		const name = await vscode.window.showInputBox({ prompt: 'Name' });
		if (name === undefined) {
			return;
		}
		console.log(name);
		const execution = executeCommand(
			currentElement.path,
			`npx ng g ng-afelio:component ${name}`,
			'Component created',
			'Can not create component here'
		);
		vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
	}));

	disposables.push(vscode.commands.registerCommand('ng-afelio.module', async (currentElement) => {
		const name = await vscode.window.showInputBox({ prompt: 'Name' });
		if (name === undefined) {
			return;
		}
		const execution = executeCommand(
			currentElement.path,
			`npx ng g ng-afelio:module ${name}`,
			'Module created',
			'Can not create module here'
		);
		vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
	}));

	disposables.push(vscode.commands.registerCommand('ng-afelio.store', async (currentElement) => {
		const name = await vscode.window.showInputBox({ prompt: 'Name' });
		if (name === undefined) {
			return;
		}
		const options: vscode.QuickPickItem[] = [ // 'barrel', 'spec', 'example'
			{ label: 'barrel', description: "Add into Barrel" },
			{ label: 'spec', description: "Create spec file" },
			{ label: 'example', description: "Add example comments" },
		];
		const defaultOptions: vscode.QuickPickItem[] = options.slice(0, -1);
		const quickPick = vscode.window.createQuickPick();
		quickPick.canSelectMany = true;
		quickPick.items = options;
		quickPick.selectedItems = defaultOptions;
		
		quickPick.onDidAccept(() => {
			const selectedOptions: string = options.reduce((result: string, item: vscode.QuickPickItem) => {
				const isSelected = quickPick.selectedItems.includes(item);
				return `${result} --${item.label}=${isSelected}`;
			}, '');
			const command = `npx ng g ng-afelio:store ${name}${selectedOptions}`;
			quickPick.hide();
			const execution = executeCommand(
				currentElement.path,
				command,
				'Store created',
				'Can not create store here'
			);
			vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
		});
		
		quickPick.show();
	}));

	disposables.push(vscode.commands.registerCommand('ng-afelio.check-env', async (currentElement) => {
		let path: string = currentElement.path;
		const isFile = path.match(/^.*\/environments\/(.*.ts)$/);
		let mainFile;
		if (isFile) {
			mainFile = isFile[1];
			path = path.replace(mainFile, '');
		}
		const execution = executeCommandAndShowResult(
			path,
			`npx ng-afelio check environment ${mainFile ? `-m ${mainFile}` : ''}`
		);
		vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
	}));

	disposables.push(vscode.commands.registerCommand('ng-afelio.check-i18n', async (currentElement) => {
		let path: string = currentElement.path;
		const isFile = path.match(/\/([a-z0-9-]+.json)$/);
		let mainFile;
		if (isFile) {
			mainFile = isFile[1];
			path = path.replace(mainFile, '');
		}
		const execution = executeCommandAndShowResult(
			path,
			`npx ng-afelio check i18n ${mainFile ? `-m ${mainFile}` : ''}`
		);
		vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
	}));

	disposables.push(vscode.commands.registerCommand('ng-afelio.i18n', async (currentElement) => {
		let path: string = currentElement.path;
		const isFile = path.match(/\/(app.module.ts)$/);
		let appModule;
		if (isFile) {
			appModule = isFile[1];
			path = path.replace(appModule, '');
		}
		const execution = executeCommand(
			path,
			`npx ng g translate ${appModule ? `--app-module ${appModule}` : ''}`,
			'Translation system added',
			'Can not add translation system'
		);
		vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
	}));

	context.subscriptions.push(...disposables);
}

// this method is called when your extension is deactivated
export function deactivate() {}
