const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const activeWindow = require('node-active-window');

let mainWindow;

// Data storage for clicks, key presses, application visits, and website visits
const activityData = {
    clicks: 0,
    keypresses: 0,
    logs: [],
    appVisits: [],
    websiteVisits: []
};

// Create a JSON file for storing activity data
const dataFilePath = path.join(__dirname, 'activityData.json');

if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify(activityData, null, 2));
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    mainWindow.loadFile('index.html');
    mainWindow.on('closed', () => (mainWindow = null));
}

// Function to save activity data
function saveActivityData() {
    fs.writeFileSync(dataFilePath, JSON.stringify(activityData, null, 2));
}

// Function to send updated activity data to renderer
function sendActivityData(event) {
    event.sender.send('activity-data', activityData);
}
// Clear logs handler
ipcMain.on('clear-logs', (event) => {
  activityData.logs = [];  // Clear logs
  activityData.clicks = 0; // Reset clicks count
  activityData.keypresses = 0; // Reset keypresses count
  saveActivityData(); // Save the updated activity data
  sendActivityData(event); // Send the updated activity data to the renderer
});

// Listen for keyboard and mouse activity events from the renderer process
ipcMain.on('log-keyboard-activity', (event, action) => {
    activityData.keypresses++;
    activityData.logs.push({ type: 'key', action, timestamp: new Date().toISOString() });
    console.log(`User performed activity: ${action}`);
    saveActivityData();
    sendActivityData(event);  
});

ipcMain.on('log-mouse-click', (event) => {
    activityData.clicks++;
    activityData.logs.push({ type: 'click', timestamp: new Date().toISOString() });
    console.log('User performed activity: Mouse clicked');
    saveActivityData();
    sendActivityData(event);  
});

// Log visited applications
ipcMain.on('log-application-visit', (event, title) => {
  const timestamp = new Date().toISOString();
  activityData.appVisits.push({ title, timestamp });
  console.log(`Visited application: ${title} at ${timestamp}`);
  saveActivityData();
  sendActivityData(event);  // Send updated activity data
});

// Log visited websites
ipcMain.on('log-website-visit', (event, url) => {
  const timestamp = new Date().toISOString();
  activityData.websiteVisits.push({ url, timestamp });
  console.log(`Visited website: ${url} at ${timestamp}`);
  saveActivityData();
  sendActivityData(event);  // Send updated activity data
});

// Load activity data when the app starts
ipcMain.on('get-activity-data', (event) => {
    const data = JSON.parse(fs.readFileSync(dataFilePath));
    event.sender.send('activity-data', data);
});




app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

