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

function getSourceIndex() {
    const url = new URL(location.href);
    const targetIndex = url.searchParams.get('source');
    return targetIndex ? Number(targetIndex) : null;
}

function getDestinationIndex() {
    const url = new URL(location.href);
    const targetIndex = url.searchParams.get('destination');
    return targetIndex ? Number(targetIndex) : null;
}

async function isURLRegisteredAsSource(url) {
    const items     = await getValueFromStroage(['sources']);
    const sources   = items.sources || [];
    
    const sourceIndex    = sources.findIndex((source) => {
        return source.url === url;
    });
    
    return (sourceIndex === null || sourceIndex === -1) ? false: true;
}

async function isURLRegisteredAsDestination(url) {
    const items          = await getValueFromStroage(['destinations']);
    const destinations   = items.destinations || [];

    const destinationIndex    = destinations.findIndex((destination) => {
        return destination.url === url;
    });

    return (destinationIndex === null || destinationIndex === -1) ? false: true;
}

async function isURLRegisteredAsSourceInMap(url) {
    const items     = await getValueFromStroage(['map', 'sources']);
    const map       = items.map || {};
    const sources   = items.sources || [];
    
    const sourceIndex    = sources.findIndex((source) => {
        return source.url === url;
    });

    for (key in map) {
        const tmpArray = key.split('-');
        if (sourceIndex === Number(tmpArray[0])) {
            return true;
        }
    }

    return false;
}

async function isURLRegisteredAsDestinationInMap(url) {
    const items        = await getValueFromStroage(['map', 'destinations']);
    const map          = items.map || {};
    const destinations = items.destinations || [];

    const destinationIndex    = destinations.findIndex((destination) => {
        return destination.url === url;
    });

    for (key in map) {
        const tmpArray = key.split('-');
        if (destinationIndex === Number(tmpArray[1])) {
            return true;
        }
    }

    return false;
}

async function getSourceURLByDestinationURLInMap(url) {
    const items        = await getValueFromStroage(['map', 'destinations', 'sources']);
    const map          = items.map || {};
    const destinations = items.destinations || [];
    const sources      = items.sources || [];

    const destinationIndex    = destinations.findIndex((destination) => {
        return destination.url === url;
    });

    let sourceIndex = null;

    for (key in map) {
        const tmpArray = key.split('-');
        if (destinationIndex === Number(tmpArray[1])) {
            sourceIndex = Number(tmpArray[0]);
        }
    }

    if (sourceIndex === null) {
        return null;
    }
    
    return sources[sourceIndex].url;
}

async function clearCache() {
    setValueToStorage({'cache': {
        is_copied: false,
        url: "",
        data: []
    }});
}
