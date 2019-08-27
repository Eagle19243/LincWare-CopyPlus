window.onload = () => {
    init();
}

function init() {
    $('.btn-copy').click(copyButtonClicked);
    $('.btn-close').click(closeButtonClicked);
}

async function copyButtonClicked() {
    $('.container-copy').hide();
    $('.container-status').show();
    
    const activeTab = await getActiveTab();
    const response  = await sendMessageToTab(activeTab.id, {action: 'Get_Form_Name'});
    const formName  = response ? response.form_name : "";
    
    $('.status').html(`Status: ${formName} copied`);

    const dataToCopy = await getDataToCopy(activeTab.url);
    setValueToStorage({'cache': {
        is_copied: true,
        url: activeTab.url,
        data: dataToCopy
    }});
    setTimeout(() => {
        clearCache();
    }, 5 * 60 * 1000);
}

function closeButtonClicked() {
    window.close();
}

async function getDataToCopy(url) {
    const activeTab = await getActiveTab();
    const items     = await getValueFromStroage(['map', 'sources']);
    const map       = items.map;
    const sources   = items.sources;

    const sourceIndex    = sources.findIndex((source) => {
        return source.url === url;
    });

    let data = [];

    for (key in map) {
        const tmpArray = key.split('-');
        if (sourceIndex === Number(tmpArray[0])) {
            for (const obj of map[key]) {
                console.log(obj.source);
                const response = await sendMessageToTab(activeTab.id, {
                    action: 'Get_Field_Value', 
                    field_name: obj.source
                });
                console.log(response);
                obj.value = response.field_value;
                data.push(obj);
            }
        }
    }

    return data;
}