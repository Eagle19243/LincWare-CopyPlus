init();

function init() {
    chrome.browserAction.setPopup({popup: "html/settings.html"});
    chrome.browserAction.onClicked.addListener(onBrowserActionClicked);
}

/**
 * Event when click extension icon
 */
function onBrowserActionClicked(tab) {
    
}