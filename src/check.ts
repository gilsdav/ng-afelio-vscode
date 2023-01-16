import * as vscode from 'vscode';
import { executeCommand, executeCommandAndShowResult } from './utils';

export function checkEnv() {
    return vscode.commands.registerCommand('ng-afelio.check-env', async (currentElement) => {
        let path: string = currentElement.fsPath;
        const isFile = path.match(/^.*\/environments\/(.*.ts)$/);
        let mainFile;
        if (isFile) {
            mainFile = isFile[1];
            path = path.replace(mainFile, '');
        }
        const execution = executeCommandAndShowResult(
            path,
            `npx ng-afelio check environment ${mainFile ? `-m ${mainFile}` : ''}`
        );
        vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
    });
}

export function checkI18N() {
    return vscode.commands.registerCommand('ng-afelio.check-i18n', async (currentElement) => {
        let path: string = currentElement.fsPath;
        const isFile = path.match(/\/([a-z0-9-]+.json)$/);
        let mainFile: string;
        if (isFile) {
            mainFile = isFile[1];
            path = path.replace(mainFile, '');
        }

        const options: vscode.QuickPickItem[] = [
            { label: 'fix', description: "Align other files" }
        ];
        const quickPick = vscode.window.createQuickPick();
        quickPick.canSelectMany = true;
        quickPick.items = options;

        quickPick.onDidAccept(() => {
            let isFix = false;
            const selectedOptions: string = options.reduce((result: string, item: vscode.QuickPickItem) => {
                const isSelected = quickPick.selectedItems.includes(item);
                if (isSelected) {
                    if (item.label === 'fix') {
                        isFix = true;
                    }
                    return `${result} --${item.label}`;
                } else {
                    return result;
                }
            }, '');

            const command = `npx ng-afelio check i18n ${mainFile ? `-m ${mainFile}` : ''} ${selectedOptions}`;
            quickPick.hide();

            let execution: Promise<void>;
            if (isFix) {
                execution = executeCommand(
                    path,
                    command,
                    'I18n files aligned',
                    'Can not align i18n files'
                );
            } else {
                execution = executeCommandAndShowResult(
                    path,
                    command
                );
            }
            vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
        });
        
        quickPick.show();
    });
}
