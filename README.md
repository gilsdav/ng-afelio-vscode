# NG Afelio

This is the VS Code extension of [`ng-afelio`](https://www.npmjs.com/package/ng-afelio) CLI.

## Features

### Installations
![install](doc/images/install.png)

* install ngx-translate
* install mock system
* install NGXS
* install OIDC
* install Error Handler

![install](doc/images/install-global.png)

* install UI Kit

### Generations
![generate](doc/images/generate.png)

* generate module
* generate component
* generate store
* generate mock
* generate service
* generate pipe
* generate guard
* generate directive

### Checking / Fix
![check-env](doc/images/check-env.png)

* check env files

![check-i18n](doc/images/check-i18n.png)

* check i18n files

### Snippets
![check-i18n](doc/images/snippets.png)

Utilisablent avec le préfix `af-`

* barrel
* model
* cctor (constructor)

## Requirements

This extension can only be used on projet that contains `ng-afelio` in version `2.0.0` or more.
If it's not the case, use `ng add ng-afelio`. 

The extension will help you to install the CLI.
![not-found](doc/images/not-found.png)

If you have an older version you have to upgrade manually.
![wrong-version](doc/images/wrong-version.png)

## Extension Settings

This extension contributes the following settings:

* `ng-afelio.when-cli-not-found`: set to `off` to disable CLI install message.
* `ng-afelio.node-path`: set the node bin path to be used by ng-afelio. This is usefull if you are using nvm and you got an error that indicate you don't use compatible node version.

## Known Issues

No known issues

## Release Notes

### 0.0.4

Add new features:

* setting node-path

### 0.0.3

Add new features:

* generate component
* generate service
* generate pipe
* generate guard
* generate directives

Update features:

* generate store
* generate module

### 0.0.2

Add new features:

* install ngxs
* install oidc
* install error handler
* install ui-kit
* snippet barrel
* snippet model
* snippet cctor

Update features:

* generate module

### 0.0.1

Initial release that contains:

* generate module
* generate component
* generate store
* generate mock
* check env files
* check i18n files
* install ngx-translate
* install mock system

<!-- ### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z. -->

-----------------------------------------------------------------------------------------------------------

<!-- ## Working with Markdown

**Note:** You can author your README using Visual Studio Code.  Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
* Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of Markdown snippets

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/) -->

**Enjoy!**
