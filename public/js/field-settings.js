window.onload = () => {
    init();
}

async function init() {
    if (isSource()) {
        $('.container-overwrite').hide();
    } else {
        $('.container-overwrite').show();
    }

    $('.btn-save').click(saveButtonClicked);

    const item = await getValueFromStroage([`field_${getFieldIndex()}`]);
    $('#field_value').val(item[`field_${getFieldIndex()}`].value);
    $('#field_label').val(item[`field_${getFieldIndex()}`].name);
    $('#field_id').val(item[`field_${getFieldIndex()}`].id);
    $('#field_type').val(item[`field_${getFieldIndex()}`].type);
}

function saveButtonClicked() {
    const obj = {
        name: $('#field_label').val(),
        id: $('#field_id').val(),
        value: $('#field_value').val(),
        type: $('#field_type').val()
    };

    location.href = chrome.extension.getURL(`html/fields.html?target=${getTarget()}`);
}

function getFieldIndex() {
    const url = new URL(location.href);
    return url.searchParams.get('field_index');
}