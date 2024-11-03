let clickCount = 0;
let keyPressCount = 0;

function updateUI(data) {
    if (!data) return; // Early return if data is undefined

    clickCount = data.clicks || 0; // Default to 0 if undefined
    keyPressCount = data.keypresses || 0; // Default to 0 if undefined
    document.getElementById('clickCount').innerText = clickCount;
    document.getElementById('keyPressCount').innerText = keyPressCount;
    

    const logList = document.getElementById('logList');
    logList.innerHTML = '';
    data.logs?.forEach(log => { 
        const li = document.createElement('li');
        li.innerText = `${log.type === 'key' ? 'Key pressed: ' + log.action : 'Mouse clicked'} at ${log.timestamp}`;
        logList.appendChild(li);
    });

    // Display application visits
    const appVisitList = document.getElementById('appVisitList');
    appVisitList.innerHTML = '';
    data.appVisits?.forEach(visit => { 
        const li = document.createElement('li');
        li.innerText = `Visited application: ${visit.title} at ${visit.timestamp}`;
        appVisitList.appendChild(li);
    });

    // Display website visits
    const websiteVisitList = document.getElementById('websiteVisitList');
    websiteVisitList.innerHTML = '';
    data.websiteVisits?.forEach(visit => { 
        const li = document.createElement('li');
        li.innerText = `Visited website: ${visit.url} at ${visit.timestamp}`;
        websiteVisitList.appendChild(li);
    });
}

// Request activity data on load
window.onload = () => {
    window.electron.getActivityData();
};

// Update UI with received data
window.electron.onReceiveActivityData(updateUI);

// Listen for mouse clicks
document.addEventListener('click', () => {
    window.electron.logMouseClick();
});

// Capture keyboard activity
document.addEventListener('keydown', (event) => {
    window.electron.logKeyboardActivity(event.key);
});

// Clear logs button event listener
document.getElementById('clearLogsButton').addEventListener('click', () => {
    window.electron.clearLogs();
});

// Example functions to log application and website visits
// These should be called where appropriate in your app logic
function logAppVisit(title) {
    window.electron.logApplicationVisit(title);
}

function logWebsiteVisit(url) {
    window.electron.logWebsiteVisit(url);
}

// Example of logging an application visit
logAppVisit('Sample Application');

// Example of logging a website visit
logWebsiteVisit('https://example.com');
