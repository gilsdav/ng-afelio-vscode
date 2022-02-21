import * as vscode from 'vscode';
import { executeCommand } from './utils';

export function oidc() {
    return vscode.commands.registerCommand('ng-afelio.oidc', async (currentElement) => {
		let path: string = currentElement.path;
		const isFile = path.match(/\/(app.module.ts)$/);
		let appModule;
		if (isFile) {
			appModule = isFile[1];
			path = path.replace(appModule, '');
		}
		const execution = executeCommand(
			path,
			`npx ng g ng-afelio:install-oidc ${appModule ? `--app-module ${appModule}` : ''}`,
			'OIDC installed',
			'Can not install OIDC'
		);
		vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
	});
}