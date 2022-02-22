import * as vscode from 'vscode';
import { executeCommand } from './utils';

export function ngModule() {
    return vscode.commands.registerCommand('ng-afelio.module', async (currentElement) => {
		const name = await vscode.window.showInputBox({ prompt: 'Name' });
		if (!name) {
			return;
		}
		const options: vscode.QuickPickItem[] = [
			{ label: 'guards', description: "Add guards folder" },
			{ label: 'pipes', description: "Add pipes folder" },
			{ label: 'stores', description: "Add stores folder" },
			{ label: 'directives', description: "Add directives folder" },
		];
		const quickPick = vscode.window.createQuickPick();
		quickPick.canSelectMany = true;
		quickPick.items = options;

		quickPick.onDidAccept(() => {
			const selectedOptions: string = options.reduce((result: string, item: vscode.QuickPickItem) => {
				const isSelected = quickPick.selectedItems.includes(item);
				return `${result} --${item.label}=${isSelected}`;
			}, '');

			const command = `npx ng g ng-afelio:module ${name}${selectedOptions}`;
			quickPick.hide();

			const execution = executeCommand(
				currentElement.path,
				command,
				'Module created',
				'Can not create module here'
			);
			vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
		});
		
		quickPick.show();
	});
}
