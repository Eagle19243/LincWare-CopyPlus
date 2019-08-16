function getActiveTab() {
    return new Promise((resolve) => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs.length > 0) {
                resolve(tabs[0]);
            } else {
                resolve(null);
            }
        });
    });
}

function sendMessageToTab(tabId, data) {
    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tabId, data, (response) => {
            resolve(response);
        });
    });
}

function setValueToStorage(data) {
    chrome.storage.sync.set(data);
}

function getValueFromStroage(keys) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(keys, (items) => {
            resolve(items);
        });
    })
}

function isSource() {
    let url = new URL(location.href);
    let target = url.searchParams.get('target');
    
    return target === 'source';
}

function getTarget() {
    return isSource() ? 'source' : 'destination';
}