// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// Import stuff that we need to make new files
const mkdir = require('mkdirp');
const fs = require('fs');


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors
    // (console.error) This line of code will only be executed once when your
    // extension is activated
    console.log('The WSU SC 1180 extension has been activated');

    context.subscriptions.push(vscode.commands.registerCommand('wsucs1180.createProject', () => {
        // Open up a window to prompt the user to enter a name for the main class
        vscode.window.showInputBox({
            'placeHolder': 'Enter the name of the assignment',
            "validateInput": (rawInput) => {
                if (!rawInput.match(/^[^/]+$/)) {
                    return "Project names can not contain a forward slash";
                }

                if (fs.existsSync(vscode.workspace.workspaceFolders[0].uri.fsPath + '/' + createpProjectDir(rawInput))) {
                    return "A project with that name already exists";
                }

                return "";
            }
        }).then((rawInput) => {

            // only allow letters and numbers, and remove any numbers from the begining of the string
            let className = createClassName(rawInput);

            // The package name will be the same as the class name, except all lower case
            let packageName = createPackageName(rawInput);

            let projectDir = createpProjectDir(rawInput);


            let fileContents = `
/*
 * CS 1180 ${rawInput}
 * TODO: Your name goes here
 * 
 * TODO: Basic project description goes here
 */

package cs1180.${packageName};
public class ${className} {
    public static void main(String[] args) {
        // TODO: Your code goes here
    }
}
`;

            // TODO Replace this with a class repository type folder that the user can set in their settings
            let workspaceDir = vscode.workspace.workspaceFolders[0].uri.fsPath + '/';
            let dirPath = workspaceDir + projectDir + '/src/cs1180/' + packageName + "/";
            let filePath = dirPath + className + ".java";

            console.log(dirPath);
            console.log(filePath);

            mkdir(workspaceDir + projectDir,
                (err) => {
                    if (err) {
                        vscode.window.showErrorMessage("Could not create project directory :(");
                    }

                    else {
                        // Create the parent directory as necessary
                        mkdir(dirPath, (err) => {
                            if (err) vscode.window.showErrorMessage("Could not create project :(");

                            else fs.appendFile(filePath, fileContents, options = { "flag": "w" }, (err) => {
                                if (err) vscode.window.showErrorMessage("Could not create project :(");
                            });
                        });

                        createEclipsePackageStructure(workspaceDir + projectDir, rawInput);

                        vscode.window.showInformationMessage("Project created");

                        vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(workspaceDir + projectDir), true);
                    }
                });
        });
    }));
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

function createClassName(rawInput) {
    let className = rawInput.replace(/[\W_]/g, "").replace(/^\d+/, "");
    className = className[0].toUpperCase() + className.substr(1);
    return className;
}

function createPackageName(rawInput) {
    let packageName = rawInput.replace(/[\W_]/g, "").replace(/^\d+/, "");
    packageName = packageName.toLowerCase();
    return packageName;
}

function createpProjectDir(rawInput) {
    let projectDir = rawInput.replace(/\s*/g, "");
    return projectDir;
}

function createEclipsePackageStructure(dir, projectName) {
    let preferences = `
eclipse.preferences.version=1
org.eclipse.jdt.core.compiler.codegen.inlineJsrBytecode=enabled
org.eclipse.jdt.core.compiler.codegen.targetPlatform=11
org.eclipse.jdt.core.compiler.codegen.unusedLocal=preserve
org.eclipse.jdt.core.compiler.compliance=10
org.eclipse.jdt.core.compiler.debug.lineNumber=generate
org.eclipse.jdt.core.compiler.debug.localVariable=generate
org.eclipse.jdt.core.compiler.debug.sourceFile=generate
org.eclipse.jdt.core.compiler.problem.assertIdentifier=error
org.eclipse.jdt.core.compiler.problem.enumIdentifier=error
org.eclipse.jdt.core.compiler.source=11
    `;

    // TODO This has to be done per java version
    let classpath = `
<?xml version="1.0" encoding="UTF-8"?>
<classpath>
	<classpathentry kind="con" path="org.eclipse.jdt.launching.JRE_CONTAINER/org.eclipse.jdt.internal.debug.ui.launcher.StandardVMType/JavaSE-11"/>
	<classpathentry kind="src" path="src"/>
	<classpathentry kind="output" path="bin"/>
</classpath>
`;

    let project = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<projectDescription>
  <name>${projectName}</name>
  <comment/>
  <projects></projects>
  <buildSpec>
    <buildCommand>
      <name>org.eclipse.jdt.core.javabuilder</name>
      <arguments></arguments>
    </buildCommand>
  </buildSpec>
  <natures>
    <nature>org.eclipse.jdt.core.javanature</nature>
  </natures>
</projectDescription>`;

    mkdir(dir + "/.settings", () => {
        fs.appendFile(dir + "/.settings/org.eclipse.jdt.core.prefs", preferences, options = { "flag": "w" }, () => { });
    });

    fs.appendFile(dir + "/.classpath", classpath, options = { "flag": "w" }, () => { });
    fs.appendFile(dir + "/.project", project, options = { "flag": "w" }, () => { });
    mkdir(dir + "/bin");
}

module.exports = {
    activate,
    deactivate
};
