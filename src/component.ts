import * as vscode from 'vscode';
import { executeCommand } from './utils';

export function ngComponent() {
    return vscode.commands.registerCommand('ng-afelio.component', async (currentElement) => {
        // The code you place here will be executed every time your command is executed
        const name = await vscode.window.showInputBox({ prompt: 'Name' });
        if (!name) {
            return;
        }

        const options: vscode.QuickPickItem[] = [
            { label: 'barrel', description: "Add into Barrel" },
            { label: 'isContainer', description: "Is container" },
        ];
        const defaultOptions: vscode.QuickPickItem[] = options.slice(0, -1);
        const quickPick = vscode.window.createQuickPick();
        quickPick.canSelectMany = true;
        quickPick.items = options;
        quickPick.selectedItems = defaultOptions;
        
        quickPick.onDidAccept(() => {
            const selectedOptions: string = options.reduce((result: string, item: vscode.QuickPickItem) => {
                const isSelected = quickPick.selectedItems.includes(item);
                if (item.label === 'isContainer') {
                    if (isSelected) {
                        return `${result} --barrelName=containers`;
                    } else {
                        return result;
                    }
                }
                return `${result} --${item.label}=${isSelected}`;
            }, '');
            const command = `npx ng g ng-afelio:component ${name}${selectedOptions}`;
            quickPick.hide();
            const execution = executeCommand(
                currentElement.path,
                command,
                'Component created',
                'Can not create component here'
            );
            vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
        });
        
        quickPick.show();
    });
}
