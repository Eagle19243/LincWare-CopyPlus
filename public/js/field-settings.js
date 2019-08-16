window.onload = () => {
    init();
}

async function init() {
    let storage = null;

    if (isSource()) {
        const item = await getValueFromStroage(['sources']);
        storage    = item.sources[getTargetIndex()];
    } else {
        const item = await getValueFromStroage(['destinations']);
        storage    = item.destinations[getTargetIndex()];
    }

    if (isSource()) {
        $('.container-overwrite').hide();
    } else {
        $('.container-overwrite').show();
    }

    $('.btn-save').click(saveButtonClicked);

    $('#field_value').val(storage[`field_${getFieldIndex()}`].value);
    $('#field_label').val(storage[`field_${getFieldIndex()}`].name);
    $('#field_id').val(storage[`field_${getFieldIndex()}`].id);
    $('#field_type').val(storage[`field_${getFieldIndex()}`].type);
}

async function saveButtonClicked() {
    let item = null;

    if (isSource()) {
        item = await getValueFromStroage(['sources']);
    } else {
        item = await getValueFromStroage(['destinations']);
    }
    
    const obj = {
        name: $('#field_label').val(),
        id: $('#field_id').val(),
        value: $('#field_value').val(),
        type: $('#field_type').val()
    };

    if (isSource()) {
        item.sources[getTargetIndex()][`field_${getFieldIndex()}`] = obj;
        setValueToStorage({'sources': item.sources});
    } else {
        item.destinations[getTargetIndex()][`field_${getFieldIndex()}`] = obj;
        setValueToStorage({'destinations': item.destinations});
    }

    location.href = chrome.extension.getURL(`html/fields.html?target=${getTarget()}`);
}

function getFieldIndex() {
    const url = new URL(location.href);
    return url.searchParams.get('field_index');
}

function getTargetIndex() {
    const url = new URL(location.href);
    return url.searchParams.get('target_index');
}