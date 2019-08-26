init();

function init() {
    chrome.browserAction.onClicked.addListener(onBrowserActionClicked);
    chrome.tabs.onActivated.addListener(onTabActivated);
    chrome.tabs.onUpdated.addListener(onTabUpdated);
    chrome.runtime.onMessage.addListener(handleMessage);

    clearCache();
}

async function setPopup() {
    const activeTab                         = await getActiveTab();
    const items                             = await getValueFromStroage(['cache']);
    const isRegisteredAsSource              = await isURLRegisteredAsSource(activeTab.url);
    const isRegisteredAsDestination         = await isURLRegisteredAsDestination(activeTab.url);
    const isRegisteredAsSourceInMap         = await isURLRegisteredAsSourceInMap(activeTab.url);
    const isRegisteredAsDestinationInMap    = await isURLRegisteredAsDestinationInMap(activeTab.url);
    const isCopied                          = items.cache ? items.cache.is_copied: false;
    const copiedURL                         = items.cache ? items.cache.url: "";
    
    let sourceURL = "";
    if (isRegisteredAsDestination && isRegisteredAsDestinationInMap) {
        sourceURL = await getSourceURLByDestinationURLInMap(activeTab.url);
    }

    if (isRegisteredAsDestination && 
        isRegisteredAsDestinationInMap && 
        isCopied && 
        copiedURL === sourceURL) {

        chrome.browserAction.setPopup({popup: "html/paste.html"});
    } else if (isRegisteredAsSource && isRegisteredAsSourceInMap) {
        chrome.browserAction.setPopup({popup: "html/copy.html"});
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
    setPopup();
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        determineExtensionAvailability(tab);
    });

    
}

/**
 * Event when tab updated
 */
function onTabUpdated(tabId, changeInfo, tab) {
    enableExtension(false);
    setPopup();
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