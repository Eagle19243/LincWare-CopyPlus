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
    const activeTab = await getActiveTab();
    const items     = await getValueFromStroage(['cache']);
    const data      = items.cache.data  || [];
    
    for (const obj of data) {
        await sendMessageToTab(activeTab.id, {
            action: 'Set_Field_Value',
            field_name: obj.destination,
            field_value: obj.value
        });
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