import * as vscode from 'vscode';
import { executeCommand } from './utils';

export function stores() {
    return vscode.commands.registerCommand('ng-afelio.stores', async (currentElement) => {
        let path: string = currentElement.path;
        const isFile = path.match(/\/(app.module.ts)$/);
        let appModule;
        if (isFile) {
            appModule = isFile[1];
            path = path.replace(appModule, '');
        }
        const execution = executeCommand(
            path,
            `npx ng g ng-afelio:install-store ${appModule ? `--app-module ${appModule}` : ''}`,
            'NGXS installed',
            'Can not install NGXS'
        );
        vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
    });
}

export function store() {
    return vscode.commands.registerCommand('ng-afelio.store', async (currentElement) => {
        const name = await vscode.window.showInputBox({ prompt: 'Name' });
        if (name === undefined) {
            return;
        }
        const options: vscode.QuickPickItem[] = [
            { label: 'barrel', description: "Add into Barrel" },
            { label: 'spec', description: "Create spec file" },
            { label: 'example', description: "Add example comments" },
        ];
        const defaultOptions: vscode.QuickPickItem[] = options.slice(0, -1);
        const quickPick = vscode.window.createQuickPick();
        quickPick.canSelectMany = true;
        quickPick.items = options;
        quickPick.selectedItems = defaultOptions;
        
        quickPick.onDidAccept(() => {
            const selectedOptions: string = options.reduce((result: string, item: vscode.QuickPickItem) => {
                const isSelected = quickPick.selectedItems.includes(item);
                return `${result} --${item.label}=${isSelected}`;
            }, '');
            const command = `npx ng g ng-afelio:store ${name}${selectedOptions}`;
            quickPick.hide();
            const execution = executeCommand(
                currentElement.path,
                command,
                'Store created',
                'Can not create store here'
            );
            vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
        });
        
        quickPick.show();
    });
}