window.onload = () => {
    init();
}

function init() {
    if (isSource()) {
        $('.container-overwrite').hide();
    } else {
        $('.container-overwrite').show();
    }

    $('.btn-save').click(saveButtonClicked);
}

function saveButtonClicked() {
    location.href = chrome.extension.getURL(`html/fields.html?target=${getTarget()}`);
}