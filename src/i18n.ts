import * as vscode from 'vscode';
import { executeCommand } from './utils';

export function i18n() {
    return vscode.commands.registerCommand('ng-afelio.i18n', async (currentElement) => {
		let path: string = currentElement.path;
		const isFile = path.match(/\/(app.module.ts)$/);
		let appModule;
		if (isFile) {
			appModule = isFile[1];
			path = path.replace(appModule, '');
		}
		const execution = executeCommand(
			path,
			`npx ng g ng-afelio:install-translate ${appModule ? `--app-module ${appModule}` : ''}`,
			'Translation system added',
			'Can not add translation system'
		);
		vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
	});
}
