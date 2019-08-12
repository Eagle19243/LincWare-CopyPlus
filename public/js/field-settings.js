window.onload = () => {
    init();
}

function init() {
    $('.btn-save').click(saveButtonClicked);
}

function saveButtonClicked() {
    location.href = chrome.extension.getURL(`html/fields.html?target=${getTarget()}`);
}