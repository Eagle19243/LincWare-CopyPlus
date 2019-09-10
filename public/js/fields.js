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
    const items = await getValueFromStroage(['sources', 'destinations']);

    if (isSource()) {
        const data = items.sources[getTargetIndex()];
        
        for (const key in data) {
            if (key.indexOf('field') > -1) {
                data[key].enabled = $(`#${key} input[type=checkbox]`).is(':checked');
            }
        }

        data.url = $('#target_url').html();
        data.form_name = $('#form_name').html();
        items.sources[getTargetIndex()] = data;
        setValueToStorage({'sources': items.sources});
    } else {
        const data = items.destinations[getTargetIndex()];
        
        for (const key in data) {
            if (key.indexOf('field') > -1) {
                data[key].enabled = $(`#${key} input[type=checkbox]`).is(':checked');
            }
        }

        data.url = $('#target_url').html();
        data.form_name = $('#form_name').html();
        items.destinations[getTargetIndex()] = data;
        setValueToStorage({'destinations': items.destinations});
        await refreshMap(getTargetIndex(), false);
    }

    location.href = chrome.extension.getURL(`html/settings.html?target=${getTarget()}&target_index=${getTargetIndex()}`);
}

function editButtonClicked(e) {
    const fieldIndex = $(this).data('index');
    location.href    = chrome.extension.getURL(`html/field-settings.html?target=${getTarget()}&field_index=${fieldIndex}&target_index=${getTargetIndex()}&edit=${getEditStatus()}`);
}

async function onCheckboxChange(e) {
    const fieldIndex = $(this).data('index');
    const items = await getValueFromStroage(['sources', 'destinations']);

    if (isSource()) {
        const data                          = items.sources[getTargetIndex()];
        data[`field_${fieldIndex}`].enabled = this.checked;
        items.sources[getTargetIndex()]     = data;
        setValueToStorage({'sources': items.sources});
    } else {
        const data                           = items.destinations[getTargetIndex()];
        data[`field_${fieldIndex}`].enabled  = this.checked;
        items.destinations[getTargetIndex()] = data;
        setValueToStorage({'destinations': items.destinations});
    }
}

async function initUI() {
    const activeTab = await getActiveTab();
    const items      = await getValueFromStroage(['sources', 'destinations']);
    
    if (isSource()) {
        const name     = items.sources[getTargetIndex()].name;

        $('.title').html(`${name} Fields`);
        $('#lbl_target_url').html('Source URL');

        if (getEditStatus()) {
            $('#form_name').html(items.sources[getTargetIndex()].form_name);
            $('#target_url').html(items.sources[getTargetIndex()].url);
        } else {
            items.sources[getTargetIndex()].url = activeTab.url;
            $('#target_url').html(activeTab.url);
            const response = await sendMessageToTab(activeTab.id, {action: 'Get_Form_Name'});
            const formName = response ? response.form_name: "";
            items.sources[getTargetIndex()].form_name = formName;
            $('#form_name').html(formName);
        }
    } else {
        const name     = items.destinations[getTargetIndex()].name;

        $('.title').html(`${name} Fields`);
        $('#lbl_target_url').html('Destination URL');

        if (getEditStatus()) {
            $('#form_name').html(items.destinations[getTargetIndex()].form_name);
            $('#target_url').html(items.destinations[getTargetIndex()].url);
        } else {
            items.destinations[getTargetIndex()].url = activeTab.url;
            $('#target_url').html(activeTab.url);
            const response = await sendMessageToTab(activeTab.id, {action: 'Get_Form_Name'});
            const formName = response ? response.form_name: "";
            items.destinations[getTargetIndex()].form_name = formName;
            $('#form_name').html(formName);
        }
    }

    // Editable labels
    $('#target_url').editable({
        type: 'text',
        name: 'target_url',
        mode: 'inline'
    });
    $('#form_name').editable({
        type: 'text',
        name: 'form_name',
        mode: 'inline'
    });

    let fields = [];

    if (getEditStatus()) {
        const data = isSource() ? 
            items.sources[getTargetIndex()] : 
            items.destinations[getTargetIndex()];
        for (const key in data) {
            if (key.indexOf('field') > -1) {
                fields.push(data[key]);
            }
        }
    } else {
        const response = await sendMessageToTab(activeTab.id, {action: 'Get_Fields'});
        fields = response.fields;
    }

    fields.forEach((field, i) => {
        field.overwrite = field.overwrite === false ? false: true;
        field.enabled = field.enabled === false ? false: true;
        const checked = field.enabled === true ? 'checked' : '';
        const index   = i + 1000;
        const content = `<div class="input-item" id="field_${index}"> \
                            <div class="checkbox-custom checkbox-primary"> \
                                <input type="checkbox" data-index=${index} ${checked}> \
                            </div> \
                            <input type="text" class="form-control" value="${field.label}" readonly> \
                            <button type="button" class="btn btn-icon btn-default btn-edit" data-index=${index}> \
                                <i class="icon wb-pencil" aria-hidden="true"></i> \
                            </button> \
                        </div>`;
        $('#fields_found').append(content);
        $('.btn-edit').click(editButtonClicked);
        $('.checkbox-custom input[type="checkbox"]').change(onCheckboxChange);
        
        if (isSource()) {
            items.sources[getTargetIndex()][`field_${index}`] = field;
        } else {
            items.destinations[getTargetIndex()][`field_${index}`] = field;
        }
    });
    
    if (isSource()) {
        setValueToStorage({'sources': items.sources});
    } else {
        setValueToStorage({'destinations': items.destinations});
    }
}