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

async function continueButtonClicked() {
    let targetIndex = 0;

    if (isSource()) {
        const item = await getValueFromStroage(['sources']);

        if (!item.sources) {
            setValueToStorage({
                'sources': [{
                    'name': $('#target_name').val()
                }]
            });
        } else {
            targetIndex = item.sources.length;
            item.sources.push({
                'name': $('#target_name').val()
            });
            setValueToStorage({'sources': item.sources});
        }
    } else {
        const item = await getValueFromStroage(['destinations']);

        if (!item.destinations) {
            setValueToStorage({
                'destinations': [{
                    'name': $('#target_name').val()
                }]
            });
        } else {
            targetIndex = item.destinations.length;
            item.destinations.push({
                'name': $('#target_name').val()
            });
            setValueToStorage({'sources': item.destinations});
        }
    }
    
    location.href = chrome.extension.getURL(`html/fields.html?target=${getTarget()}&target_index=${targetIndex}`);
}