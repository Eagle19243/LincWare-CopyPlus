window.onload = () => {
    init();
}

function init() {
    $('.btn-back').click(backButtonClicked);
    $('.btn-save').click(saveButtonClicked);
    $('.btn-edit').click(editButtonClicked);
}

function backButtonClicked() {
    location.href = chrome.extension.getURL(`html/target.html?target=${getTarget()}`);
}

function saveButtonClicked() {
    location.href = chrome.extension.getURL(`html/settings.html?target=${getTarget()}`);
}

function editButtonClicked() {
    location.href = chrome.extension.getURL(`html/field-settings.html?target=${getTarget()}`);
}