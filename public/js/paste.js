window.onload = () => {
    init();
}

function init() {
    $('.btn-paste').click(pasteButtonClicked);
    $('.btn-reset').click(resetButtonClicked);
    $('.btn-close').click(closeButtonClicked);
    
    initUI();
}

async function pasteButtonClicked() {
    $('.container-paste').hide();
    $('.container-status').show();
    await pasteDate();
    clearCache();
}

function resetButtonClicked() {
    clearCache();
}

function closeButtonClicked() {
    chrome.runtime.sendMessage({action: 'Resetup_Popup'});
    window.close();
}

async function pasteDate() {
    const activeTab              = await getActiveTab();
    const items                  = await getValueFromStroage(['cache']);
    const data                   = items.cache.data  || [];
    const fields_not_overwritten = [];

    for (const obj of data) {
        const response = await sendMessageToTab(activeTab.id, {
            action: 'Get_Field_Value', 
            field_name: obj.destination
        });
        const currentValue = response? response.field_value : "";

        if (!currentValue || currentValue.length === 0 || obj.overwrite) {
            await sendMessageToTab(activeTab.id, {
                action: 'Set_Field_Value',
                field_name: obj.destination,
                field_value: obj.value,
            });
        } else {
            fields_not_overwritten.push(obj.destinationLabel);
        }
    }

    for (const fieldLabel of fields_not_overwritten) {
        const content = `<label class="field-item">${fieldLabel}</label>`;
        $('.warning').append(content);
    }
}

async function initUI() {
    const items     = await getValueFromStroage(['cache']);
    const data      = items.cache.data  || [];
    
    for (const obj of data) {
        const content = `<label>${obj.source}: ${obj.value}</label>`;
        $('.body-data-to-paste').append(content);
    }
}