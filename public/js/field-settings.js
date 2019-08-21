window.onload = () => {
    init();
}

async function init() {
    const items   = await getValueFromStroage(['sources', 'destinations']);
    const storage = isSource() ? 
                        items.sources[getTargetIndex()]:
                        items.destinations[getTargetIndex()];

    if (isSource()) {
        $('.container-overwrite').hide();
    } else {
        $('.container-overwrite').show();
    }

    $('#field_value').val(storage[`field_${getFieldIndex()}`].value);
    $('#field_label').val(storage[`field_${getFieldIndex()}`].name);
    $('#field_id').val(storage[`field_${getFieldIndex()}`].id);
    $('#field_type').val(storage[`field_${getFieldIndex()}`].type);

    $('.btn-save').click(saveButtonClicked);
}

async function saveButtonClicked() {
    const items = await getValueFromStroage(['sources', 'destinations']);
    const obj   = {
        name: $('#field_label').val(),
        id: $('#field_id').val(),
        value: $('#field_value').val(),
        type: $('#field_type').val()
    };

    if (isSource()) {
        items.sources[getTargetIndex()][`field_${getFieldIndex()}`] = obj;
        setValueToStorage({'sources': items.sources});
    } else {
        items.destinations[getTargetIndex()][`field_${getFieldIndex()}`] = obj;
        setValueToStorage({'destinations': items.destinations});
    }

    location.href = chrome.extension.getURL(`html/fields.html?target=${getTarget()}&target_index=${getTargetIndex()}`);
}