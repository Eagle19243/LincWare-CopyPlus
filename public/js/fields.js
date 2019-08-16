window.onload = () => {
    init();
}

function init() {
    initUI();
    $('.btn-back').click(backButtonClicked);
    $('.btn-save').click(saveButtonClicked);
}

function backButtonClicked() {
    location.href = chrome.extension.getURL(`html/target.html?target=${getTarget()}`);
}

async function saveButtonClicked() {
    if (isSource()) {
        const item = await getValueFromStroage(['sources']);
        item.sources[getTargetIndex()].url = $('#target_url').html();
        setValueToStorage({'sources': item.sources});
    } else {
        const item = await getValueFromStroage(['destinations']);
        item.destinations[getTargetIndex()].url = $('#target_url').html();
        setValueToStorage({'destinations': item.destinations});
    }

    location.href = chrome.extension.getURL(`html/settings.html?target=${getTarget()}`);
}

function editButtonClicked(e) {
    const fieldIndex = $(this).data('index');
    location.href = chrome.extension.getURL(`html/field-settings.html?target=${getTarget()}&field_index=${fieldIndex}&target_index=${getTargetIndex()}`);
}

function getTargetIndex() {
    const url = new URL(location.href);
    return url.searchParams.get('target_index');
}

async function initUI() {
    const activeTab = await getActiveTab();
    let item = null;

    if (isSource()) {
        item = await getValueFromStroage(['sources']);
    } else {
        item = await getValueFromStroage(['destinations']);
    }

    if (isSource()) {
        const name = item.sources[getTargetIndex()].name;
        $('.title').html(`${name} Fields`);
        $('#lbl_target_url').html('Source URL');
        $('#target_url').html(activeTab.url);
        $('#form_name').html($('form').attr('name'));
    } else {
        const name = item.destinations[getTargetIndex()].name;
        $('.title').html(`${name} Fields`);
        $('#lbl_target_url').html('Destination URL');
        $('#target_url').html(activeTab.url);
        $('#form_name').html($('form').attr('name'));
    }

    const response = await sendMessageToTab(activeTab.id, {action: 'Get_Fields'});
    const fields = response.fields;

    fields.forEach((field, i) => {
        const content = `<div class="input-item"> \
                            <div class="checkbox-custom checkbox-primary"> \
                                <input type="checkbox" checked /> \
                            </div> \
                            <input type="text" class="form-control" value="${field.name}" readonly> \
                            <button type="button" class="btn btn-icon btn-default btn-edit" data-index=${i}> \
                                <i class="icon wb-pencil" aria-hidden="true"></i> \
                            </button> \
                        </div>`;
        $('#fields_found').append(content);
        $('.btn-edit').click(editButtonClicked);
        
        if (isSource()) {
            item.sources[getTargetIndex()][`field_${i}`] = field;
        } else {
            item.destinations[getTargetIndex()][`field_${i}`] = field;
        }
    });

    if (isSource()) {
        setValueToStorage({'sources': item.sources});
    } else {
        setValueToStorage({'destinations': item.destinations});
    }
}