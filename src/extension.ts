import * as vscode from 'vscode';
import * as mysql from 'mysql';

export function activate(context: vscode.ExtensionContext) {
    // Create MySQL connection
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin123',
        database: 'oop_project'
    });

    // Connect to MySQL
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return;
        }
        console.log('Connected to MySQL');
    });

    // Command to collect data
    let collectDataCommand = vscode.commands.registerCommand('extension.collectData', () => {
        // Get workspace information
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            workspaceFolders.forEach(folder => {
                const { name, uri } = folder;
                const workspaceData = {
                    name,
                    uri: uri ? uri.toString() : '',
                    timestamp: new Date().toISOString()
                };
                // Insert workspace data into MySQL database
                connection.query('INSERT INTO workspaces SET ?', workspaceData, (err, result) => {
                    if (err) {
                        console.error('Error inserting workspace data:', err);
                        return;
                    }
                    console.log('Workspace data inserted:', result);
                });
            });
        }

        // Get language information
        vscode.window.visibleTextEditors.forEach(editor => {
            const languageId = editor.document.languageId;
            const fileName = editor.document.fileName;
            const languageData = {
                languageId,
                fileName,
                timestamp: new Date().toISOString()
            };
            // Insert language data into MySQL database
            connection.query('INSERT INTO languages SET ?', languageData, (err, result) => {
                if (err) {
                    console.error('Error inserting language data:', err);
                    return;
                }
                console.log('Language data inserted:', result);
            });
        });

        // Simulated debugging data
        const debuggingData = {
            duration: Math.floor(Math.random() * 3600), // Random duration in seconds
            timestamp: new Date().toISOString()
        };
        // Insert debugging data into MySQL database
        connection.query('INSERT INTO debugging SET ?', debuggingData, (err, result) => {
            if (err) {
                console.error('Error inserting debugging data:', err);
                return;
            }
            console.log('Debugging data inserted:', result);
        });

        // Notify user
        vscode.window.showInformationMessage('VSCode data collected and stored in MySQL database!');
    });

    context.subscriptions.push(collectDataCommand);

    // Dispose the MySQL connection when the extension is deactivated
    context.subscriptions.push({
        dispose() {
            connection.end();
        }
    });
}

// This method is called when your extension is deactivated
export function deactivate() {}
