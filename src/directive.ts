import * as vscode from 'vscode';
import { executeCommand } from './utils';

export function ngDirective() {
    return vscode.commands.registerCommand('ng-afelio.directive', async (currentElement) => {
        // The code you place here will be executed every time your command is executed
        const name = await vscode.window.showInputBox({ prompt: 'Name' });
        if (!name) {
            return;
        }

        const options: vscode.QuickPickItem[] = [
            { label: 'barrel', description: "Add into Barrel" },
        ];
        const defaultOptions: vscode.QuickPickItem[] = options.slice();
        const quickPick = vscode.window.createQuickPick();
        quickPick.canSelectMany = true;
        quickPick.items = options;
        quickPick.selectedItems = defaultOptions;
        
        quickPick.onDidAccept(() => {
            const selectedOptions: string = options.reduce((result: string, item: vscode.QuickPickItem) => {
                const isSelected = quickPick.selectedItems.includes(item);
                return `${result} --${item.label}=${isSelected}`;
            }, '');
            const command = `npx ng g ng-afelio:directive ${name}${selectedOptions}`;
            quickPick.hide();
            const execution = executeCommand(
                currentElement.fsPath,
                command,
                'Directive created',
                'Can not create directive here'
            );
            vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
        });
        
        quickPick.show();
    });
}
