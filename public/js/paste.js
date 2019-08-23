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
    window.close();
}

async function pasteDate() {
    const activeTab = await getActiveTab();
    const items     = await getValueFromStroage(['cache']);
    const data      = items.cache.data  || [];
    
    data.forEach((obj) => {
        await sendMessageToTab(activeTab.id, {
            action: 'Set_Field_Value',
            field_name: obj.destination,
            field_value: obj.value
        });
    });
}

function initUI() {

}