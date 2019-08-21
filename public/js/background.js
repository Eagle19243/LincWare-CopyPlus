init();

function init() {
    chrome.browserAction.onClicked.addListener(onBrowserActionClicked);
    chrome.tabs.onActivated.addListener(onTabActivated);
    chrome.tabs.onUpdated.addListener(onTabUpdated);
    chrome.runtime.onMessage.addListener(handleMessage);
    setPopup();
}

async function setPopup() {
    const items = await getValueFromStroage(['copied', 'map']);
    const copied = items.copied;
    const map = items.map || {};

    if (copied) {
        chrome.browserAction.setPopup({popup: "html/paste.html"});
    } else {
        chrome.browserAction.setPopup({popup: "html/settings.html"});
    }
}

/**
 * Event when click extension icon
 */
function onBrowserActionClicked(tab) {
}

/**
 * Event when tab activated/focused
 */
function onTabActivated(activeInfo) {
    enableExtension(false);
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        determineExtensionAvailability(tab);
    });
}

/**
 * Event when tab updated
 */
function onTabUpdated(tabId, changeInfo, tab) {
    enableExtension(false);
    determineExtensionAvailability(tab);
}

/**
 * Handle messages from content.js
 */
function handleMessage(request, sender, sendResponse) {
}

/**
 * Determine Extension availability
 * @param {object} tab 
 */
function determineExtensionAvailability(tab) {
    chrome.tabs.sendMessage(tab.id, {action: 'Get_Extension_Availability'}, (response) => {
        if (!response) {
            enableExtension(false);
        } else {
            enableExtension(response.enable);
        }
    });
}

/**
 * Enable extension and change extension icon according to param value
 * @param {boolean} shouldEnable 
 */
function enableExtension(shouldEnable) {
    if (shouldEnable) {
        chrome.browserAction.setIcon({path: 'images/icon-48.png'});
        chrome.browserAction.enable();
    } else {
        chrome.browserAction.setIcon({path: 'images/icon-gray-48.png'});
        chrome.browserAction.disable();
    }
}