window.onload = () => {
    init();
}

async function init() {
    const items = await getValueFromStroage(['sources', 'destinations']);
    
    if (isSource()) {
        if (getEditStatus()) {
            $('#target_name').val(items.sources[getTargetIndex()].name);
            document.title = 'Edit Source';
            $('.title').html('Edit Source');
        } else {
            document.title = 'New Source';
            $('.title').html('New Source');
        }
    } else {
        if (getEditStatus()) {
            $('#target_name').val(items.destinations[getTargetIndex()].name);
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
    const items = await getValueFromStroage(['sources', 'destinations']);

    if (getEditStatus()) {
        location.href = chrome.extension.getURL(`html/fields.html?target=${getTarget()}&target_index=${getTargetIndex()}&edit=${getEditStatus()}`);
        return;
    }

    if (isSource()) {
        if (!items.sources) {
            setValueToStorage({
                'sources': [{
                    'name': $('#target_name').val()
                }]
            });
        } else {
            targetIndex = getTargetIndex() === null ? 
                items.sources.length : 
                getTargetIndex();
            items.sources[targetIndex] = { 'name': $('#target_name').val() };
            setValueToStorage({'sources': items.sources});
        }
    } else {        
        if (!items.destinations) {
            setValueToStorage({
                'destinations': [{
                    'name': $('#target_name').val()
                }]
            });
        } else {
            targetIndex = getTargetIndex() === null ? 
                items.destinations.length :
                getTargetIndex();
            items.destinations[targetIndex] = { 'name': $('#target_name').val() };
            setValueToStorage({'destinations': items.destinations});
        }
    }
    
    location.href = chrome.extension.getURL(`html/fields.html?target=${getTarget()}&target_index=${targetIndex}&edit=${getEditStatus()}`);
}