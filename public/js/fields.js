window.onload = () => {
    init();
}

function init() {
    initUI();
    $('.btn-back').click(backButtonClicked);
    $('.btn-save').click(saveButtonClicked);
}

function backButtonClicked() {
    location.href = chrome.extension.getURL(`html/target.html?target=${getTarget()}&target_index=${getTargetIndex()}&edit=${getEditStatus()}`);
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

    location.href = chrome.extension.getURL(`html/settings.html?target=${getTarget()}&target_index=${getTargetIndex()}`);
}

function editButtonClicked(e) {
    const fieldIndex = $(this).data('index');
    location.href = chrome.extension.getURL(`html/field-settings.html?target=${getTarget()}&field_index=${fieldIndex}&target_index=${getTargetIndex()}`);
}

async function initUI() {
    const activeTab = await getActiveTab();
    let item = null;

    if (isSource()) {
        item           = await getValueFromStroage(['sources']);
        const name     = item.sources[getTargetIndex()].name;

        $('.title').html(`${name} Fields`);
        $('#lbl_target_url').html('Source URL');

        if (getEditStatus()) {
            $('#form_name').html(item.sources[getTargetIndex()].form_name);
            $('#target_url').html(item.sources[getTargetIndex()].url);
        } else {
            const response = await sendMessageToTab(activeTab.id, {action: 'Get_Form_Name'});
            item.sources[getTargetIndex()].form_name = response.form_name;
            $('#form_name').html(response.form_name);
            $('#target_url').html(activeTab.url);
        }
    } else {
        item           = await getValueFromStroage(['destinations']);
        const name     = item.destinations[getTargetIndex()].name;

        $('.title').html(`${name} Fields`);
        $('#lbl_target_url').html('Destination URL');

        if (getEditStatus()) {
            $('#form_name').html(item.destinations[getTargetIndex()].form_name);
            $('#target_url').html(item.destinations[getTargetIndex()].url);
        } else {
            const response = await sendMessageToTab(activeTab.id, {action: 'Get_Form_Name'});
            item.sources[getTargetIndex()].form_name = response.form_name;
            $('#form_name').html(response.form_name);
            $('#target_url').html(activeTab.url);
        }
    }

    let fields = [];

    if (getEditStatus()) {
        const data = isSource() ? 
            item.sources[getTargetIndex()] : 
            item.destinations[getTargetIndex()];
        
        for (const key in data) {
            if (key.indexOf('field') > -1) {
                fields.push(data[key]);
            }
        }
    } else {
        const response = await sendMessageToTab(activeTab.id, {action: 'Get_Fields'});
        fields = response.fields;
    }

    console.log(fields);

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