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

function saveButtonClicked() {
    location.href = chrome.extension.getURL(`html/settings.html?target=${getTarget()}`);
}

function editButtonClicked(e) {
    const field_index = $(this).data('index');
    location.href = chrome.extension.getURL(`html/field-settings.html?target=${getTarget()}&field_index=${field_index}`);
}

async function initUI() {
    const activeTab = await getActiveTab();

    if (isSource()) {
        const item = await getValueFromStroage(['s_name']);
        $('.title').html(`${item.s_name} Fields`);
        $('#lbl_target_url').html('Source URL');
        $('#target_url').html(activeTab.url);
        $('#form_name').html($('form').attr('name'));
    } else {
        const item = await getValueFromStroage(['d_name']);
        $('.title').html(`${item.d_name} Fields`);
        $('#lbl_target_url').html('Destination URL');
        $('#target_url').html(activeTab.url);
        $('#form_name').html($('form').attr('name'));
    }

    const response = await sendMessageToTab(activeTab.id, {action: 'Get_Fields'});
    const fields = response.fields;
    console.log(fields);
    fields.forEach((field, i) => {
        const content = `<div class="input-item"> \
                            <div class="checkbox-custom checkbox-primary"> \
                                <input type="checkbox" checked /> \
                            </div> \
                            <input type="text" class="form-control" value="${field.name}"> \
                            <button type="button" class="btn btn-icon btn-default btn-edit" data-index=${i}> \
                                <i class="icon wb-pencil" aria-hidden="true"></i> \
                            </button> \
                        </div>`;
        $('#fields_found').append(content);
        $('.btn-edit').click(editButtonClicked);
        
        const obj = {};
        obj[`field_${i}`] = field;
        setValueToStorage(obj);
    });
}