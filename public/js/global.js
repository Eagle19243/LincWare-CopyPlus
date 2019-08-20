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
    chrome.storage.local.set(data);
}

function getValueFromStroage(keys) {
    return new Promise((resolve) => {
        chrome.storage.local.get(keys, (items) => {
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

function getTargetIndex() {
    const url = new URL(location.href);
    const targetIndex = url.searchParams.get('target_index');
    return targetIndex ? Number(targetIndex) : null;
}

function getEditStatus() {
    const url = new URL(location.href);
    return url.searchParams.get('edit') === 'true';
}

function getFieldIndex() {
    const url = new URL(location.href);
    return url.searchParams.get('field_index');
}