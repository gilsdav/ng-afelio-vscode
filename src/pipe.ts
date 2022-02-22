import * as vscode from 'vscode';
import { executeCommand } from './utils';

export function ngPipe() {
    return vscode.commands.registerCommand('ng-afelio.pipe', async (currentElement) => {
        // The code you place here will be executed every time your command is executed
        const name = await vscode.window.showInputBox({ prompt: 'Name' });
        if (name === undefined) {
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
            const command = `npx ng g ng-afelio:pipe ${name}${selectedOptions}`;
            quickPick.hide();
            const execution = executeCommand(
                currentElement.path,
                command,
                'Pipe created',
                'Can not create pipe here'
            );
            vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
        });
        
        quickPick.show();
    });
}
