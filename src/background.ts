init();

function init() {
    initEventHandler();
}

function initEventHandler() {
    chrome.browserAction.onClicked.addListener(onBrowserActionClicked);
}

/**
 * Event when click extension icon
 */
function onBrowserActionClicked(tab: any) {
    chrome.tabs.sendMessage(tab.id, {message: 'Toggle_Extension_UI'});
}