window.onload = () => {
    init();
}

function init() {
    $('.btn-add-source').click(addSourceButtonClicked);
    $('.btn-add-destination').click(addDestinationButtonClicked);
    $('.btn-close').click(closeButtonClicked);
}

function closeButtonClicked() {
    window.close();
}

function addSourceButtonClicked() {
    location.href = chrome.extension.getURL('html/target.html?target=source');
}

function addDestinationButtonClicked() {
    location.href = chrome.extension.getURL('html/target.html?target=destination');
}