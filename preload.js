const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    logMouseClick: () => ipcRenderer.send('log-mouse-click'),
    logKeyboardActivity: (action) => ipcRenderer.send('log-keyboard-activity', action),
    logApplicationVisit: (title) => ipcRenderer.send('log-application-visit', title),
    logWebsiteVisit: (url) => ipcRenderer.send('log-website-visit', url),
    getActivityData: () => ipcRenderer.send('get-activity-data'),
    onReceiveActivityData: (callback) => ipcRenderer.on('activity-data', (event, data) => callback(data)),
    clearLogs: () => ipcRenderer.send('clear-logs'),  // Add this line
});
