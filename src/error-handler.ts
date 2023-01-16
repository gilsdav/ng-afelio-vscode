import * as vscode from 'vscode';
import { executeCommand } from './utils';

export function errorHander() {
    return vscode.commands.registerCommand('ng-afelio.errorHandler', async (currentElement) => {
		let path: string = currentElement.fsPath;
		const isFile = path.match(/\/(app.module.ts)$/);
		let appModule: string;
		if (isFile) {
			appModule = isFile[1];
			path = path.replace(appModule, '');
		}

		const options: vscode.QuickPickItem[] = [
			{ label: 'useNgxToastr', description: "Use NgxToastr" }
		];
		const quickPick = vscode.window.createQuickPick();
		quickPick.canSelectMany = true;
		quickPick.items = options;
		quickPick.selectedItems = options.slice();

		quickPick.onDidAccept(() => {
			const selectedOptions: string = options.reduce((result: string, item: vscode.QuickPickItem) => {
				const isSelected = quickPick.selectedItems.includes(item);
				return `${result} --${item.label}=${isSelected}`;
			}, '');

			const command = `npx ng g ng-afelio:install-error-handler ${appModule ? `--app-module ${appModule}` : ''} ${selectedOptions}`;
			quickPick.hide();

			const execution = executeCommand(
				path,
				command,
				'Error Handler system added',
				'Can not add Error Handler'
			);
			vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
		});
		
		quickPick.show();
	});
}
