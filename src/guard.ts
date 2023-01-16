import * as vscode from 'vscode';
import { executeCommand } from './utils';

export function ngGuard() {
    return vscode.commands.registerCommand('ng-afelio.guard', async (currentElement) => {
        // The code you place here will be executed every time your command is executed
        const name = await vscode.window.showInputBox({ prompt: 'Name' });
        if (!name) {
            return;
        }

        // Ng-afelio options
        const options: vscode.QuickPickItem[] = [
            { label: 'barrel', description: "Add into Barrel" },
        ];
        const defaultOptions: vscode.QuickPickItem[] = options.slice();
        const quickPick = vscode.window.createQuickPick();
        quickPick.canSelectMany = true;
        quickPick.items = options;
        quickPick.selectedItems = defaultOptions;

        // Ng options

        const ngOptions: vscode.QuickPickItem[] = [
            { label: 'CanActivate' },
            { label: 'CanDeactivate' },
            { label: 'CanLoad' },
            { label: 'CanActivateChild' },
        ];
        const ngQuickPick = vscode.window.createQuickPick();
        ngQuickPick.canSelectMany = false;
        ngQuickPick.items = ngOptions;

        let implementsType: string;

        ngQuickPick.onDidAccept(() => {
            const selectedNgOption = ngQuickPick.selectedItems[0];
            ngQuickPick.hide();
    
            if (!selectedNgOption) {
                return;
            }

            implementsType = selectedNgOption.label;

            quickPick.show();
        });
        
        quickPick.onDidAccept(() => {
            const selectedOptions: string = options.reduce((result: string, item: vscode.QuickPickItem) => {
                const isSelected = quickPick.selectedItems.includes(item);
                return `${result} --${item.label}=${isSelected}`;
            }, '');
            const command = `npx ng g ng-afelio:guard ${name} --implements=${implementsType}${selectedOptions}`;
            quickPick.hide();
            const execution = executeCommand(
                currentElement.fsPath,
                command,
                'Guard created',
                'Can not create guard here'
            );
            vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
        });
        
        ngQuickPick.show();
    });
}
