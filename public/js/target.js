window.onload = () => {
    init();
}

async function init() {
    if (isSource()) {
        if (getTargetIndex()) {
            const item = await getValueFromStroage(['sources']);
            $('#target_name').val(item.sources[getTargetIndex()].name);
            document.title = 'Edit Source';
            $('.title').html('Edit Source');
        } else {
            document.title = 'New Source';
            $('.title').html('New Source');
        }
    } else {
        if (getTargetIndex()) {
            const item = await getValueFromStroage(['destinations']);
            $('#target_name').val(item.destinations[getTargetIndex()].name);
            document.title = 'Edit Destination';
            $('.title').html('Edit Destination');
        } else {
            document.title = 'New Destination';
            $('.title').html('New Destination');
        }
    }

    $('.btn-continue').click(continueButtonClicked);
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
            targetIndex = getTargetIndex() || item.sources.length;
            item.sources[targetIndex] = { 'name': $('#target_name').val() };
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
            targetIndex = getTargetIndex() || item.destinations.length;
            item.destinations[targetIndex] = { 'name': $('#target_name').val() };
            setValueToStorage({'sources': item.destinations});
        }
    }
    
    location.href = chrome.extension.getURL(`html/fields.html?
        target=${getTarget()}&
        target_index=${targetIndex}&
        edit=${getEditStatus()}`);
}