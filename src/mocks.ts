import * as vscode from 'vscode';
import { executeCommand } from './utils';

export function mocks() {
    return vscode.commands.registerCommand('ng-afelio.mocks', async (currentElement) => {
        let path: string = currentElement.path;
        const isFile = path.match(/\/(app.module.ts)$/);
        let appModule;
        if (isFile) {
            appModule = isFile[1];
            path = path.replace(appModule, '');
        }
        const execution = executeCommand(
            path,
            `npx ng g ng-afelio:install-mocks ${appModule ? `--app-module ${appModule}` : ''}`,
            'Mocks system added',
            'Can not add mocks system'
        );
        vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
    });
}

export function mock() {
    return vscode.commands.registerCommand('ng-afelio.mock', async (currentElement) => {
        const name = await vscode.window.showInputBox({ prompt: 'Name' });
        if (!name) {
            return;
        }
        let path: string = currentElement.path;
        const isFile = path.match(/\/(\w*.mock.ts)$/);
        let mockFile;
        if (isFile) {
            mockFile = isFile[1];
            path = path.replace(mockFile, '');
        } else {
            mockFile = await vscode.window.showInputBox({ prompt: 'File name (must end with ".mock.ts")' });
            if (mockFile === undefined) {
                return;
            }
        }
        const execution = executeCommand(
            path,
            `npx ng g ng-afelio:mock ${name} ${mockFile}`,
            'Mock created',
            'Can not create mock here'
        );
        vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
    });
}
