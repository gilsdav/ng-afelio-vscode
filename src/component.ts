import * as vscode from 'vscode';
import { executeCommand } from './utils';

export function ngComponent() {
    return vscode.commands.registerCommand('ng-afelio.component', async (currentElement) => {
        // The code you place here will be executed every time your command is executed
        console.log(currentElement.path);
        const name = await vscode.window.showInputBox({ prompt: 'Name' });
        if (name === undefined) {
            return;
        }
        console.log(name);
        const execution = executeCommand(
            currentElement.path,
            `npx ng g ng-afelio:component ${name}`,
            'Component created',
            'Can not create component here'
        );
        vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: 'ng-afelio processing' }, () => execution );
    });
}
