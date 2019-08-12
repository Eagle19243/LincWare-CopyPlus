window.onload = () => {
    init();
}

function init() {
    if (isSource()) {
        document.title = 'New Source';
        $('.title').html('New Source');
    } else {
        document.title = 'New Destination';
        $('.title').html('New Destination');
    }

    $('.btn-continue').click(continueButtonClicked);
    $('#target_logo').dropify({
        messages: {
            'default': 'Drag and drop a logo file here or click',
            'replace': 'Drag and drop a logo file or click to replace',
            'remove':  'Remove',
            'error':   'Ooops, something wrong happended.'
        }
    });
}

function continueButtonClicked() {
    location.href = chrome.extension.getURL(`html/fields.html?target=${getTarget()}`);
}