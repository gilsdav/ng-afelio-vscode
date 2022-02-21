import * as vscode from 'vscode';
import { dirname } from 'path';
import { executeCommand } from './utils';

export function uikit() {
    return vscode.commands.registerCommand('ng-afelio.uikit', async (currentElement) => {
        let path: string = dirname(currentElement.path);
    
        const options: vscode.QuickPickItem[] = [
            { label: 'afelio' },
            { label: 'boostrap' }
        ];
        const defaultOptions: vscode.QuickPickItem[] = options.slice(0, -1);
        const quickPick = vscode.window.createQuickPick();
        quickPick.canSelectMany = false;
        quickPick.items = options;
        quickPick.selectedItems = defaultOptions;
        
        quickPick.onDidAccept(() => {
            const selectedOption = quickPick.selectedItems[0];
            quickPick.hide();
    
            if (!selectedOption) {
                return;
            }
    
            const execution = executeCommand(
                path,
                `npx ng g ng-afelio:install-uikit --type ${selectedOption.label}`,
                'UI Kit added',
                'Can not add UI Kit'
            );
            vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
        });
    
        quickPick.show();
    });
}
