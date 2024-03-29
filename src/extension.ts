// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { checkIfCliIsPresent } from './utils';

import { checkEnv, checkI18N } from './check';
import { ngComponent } from './component';
import { ngModule } from './module';
import { store, stores } from './stores';
import { i18n } from './i18n';
import { mock, mocks } from './mocks';
import { oidc } from './oidc';
import { uikit } from './uikit';
import { errorHander } from './error-handler';
import { ngService } from './service';
import { ngPipe } from './pipe';
import { ngDirective } from './directive';
import { ngGuard } from './guard';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ng-afelio" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	const disposables: vscode.Disposable[] = [];

	// #region all commands
	disposables.push(ngComponent());
	disposables.push(ngModule());
	disposables.push(stores());
	disposables.push(store());
	disposables.push(checkEnv());
	disposables.push(checkI18N());
	disposables.push(i18n());
	disposables.push(mocks());
	disposables.push(mock());
	disposables.push(oidc());
	disposables.push(uikit());
	disposables.push(errorHander());
	disposables.push(ngService());
	disposables.push(ngPipe());
	disposables.push(ngDirective());
	disposables.push(ngGuard());
	// #endregion all commands

	context.subscriptions.push(...disposables);

	const config = vscode.workspace.getConfiguration();

	checkIfCliIsPresent(config);

}

// this method is called when your extension is deactivated
export function deactivate() {}
