"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const mysql = __importStar(require("mysql"));
let startTime = null;
function activate(context) {
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
    // Start timer when extension activates
    startTime = Date.now();
    // Command to collect data
    let collectDataCommand = vscode.commands.registerCommand('extension.collectData', () => {
        // Stop timer and calculate coding duration
        const endTime = Date.now();
        const codingDuration = endTime - (startTime ?? endTime);
        startTime = null; // Reset start time
        // Collect other data
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            workspaceFolders.forEach(folder => {
                const { name, uri } = folder;
                const workspaceData = {
                    name,
                    uri: uri ? uri.toString() : '',
                    timestamp: new Date().toISOString()
                };
                connection.query('INSERT INTO workspaces SET ?', workspaceData, (err, result) => {
                    if (err) {
                        console.error('Error inserting workspace data:', err);
                        return;
                    }
                    console.log('Workspace data inserted:', result);
                });
            });
        }
        vscode.window.visibleTextEditors.forEach(editor => {
            const languageId = editor.document.languageId;
            const fileName = editor.document.fileName;
            const languageData = {
                languageId,
                fileName,
                timestamp: new Date().toISOString()
            };
            connection.query('INSERT INTO languages SET ?', languageData, (err, result) => {
                if (err) {
                    console.error('Error inserting language data:', err);
                    return;
                }
                console.log('Language data inserted:', result);
            });
        });
        const debuggingData = {
            duration: Math.floor(Math.random() * 3600), // Random duration in seconds
            timestamp: new Date().toISOString()
        };
        connection.query('INSERT INTO debugging SET ?', debuggingData, (err, result) => {
            if (err) {
                console.error('Error inserting debugging data:', err);
                return;
            }
            console.log('Debugging data inserted:', result);
        });
        const codingSessionData = {
            duration: codingDuration / 1000, // Convert to seconds
            timestamp: new Date().toISOString()
        };
        connection.query('INSERT INTO coding_sessions SET ?', codingSessionData, (err, result) => {
            if (err) {
                console.error('Error inserting coding session data:', err);
                return;
            }
            console.log('Coding session data inserted:', result);
        });
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
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() {
    // Stop timer when extension deactivates
    startTime = null;
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map