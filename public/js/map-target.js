window.onload = () => {
    init();
}

function init() {
    $('.btn-back').click(backButtonClicked);
    $('.btn-continue').click(continueButtonClicked);

    initUI();
}

async function initUI() {
    const items             = await getValueFromStroage(['sources', 'destinations']);
    const sources           = items.sources || [];
    const destinations      = items.destinations || [];

    sources.forEach((source, index) => {
        const content = `<div class="input-item">
                            <input type="radio" name="source" data-target-index=${index}>
                            <label>${source.name}</label>
                         </div>`;
        $('#sources').append(content);
    });

    destinations.forEach((destination, index) => {
        const content = `<div class="input-item">
                            <input type="radio" name="destination" data-target-index=${index}>
                            <label>${destination.name}</label>
                         </div>`;
        $('#destinations').append(content);
    });
}

function backButtonClicked() {
    location.href = chrome.extension.getURL(`html/settings.html`);
}

function continueButtonClicked() {
    const source = $('input[name=source]:checked');
    const destination = $('input[name=destination]:checked');

    if (source.length === 0 || destination.length === 0) {
        return;
    }

    location.href = chrome.extension.getURL(`html/map-field.html?source=${source.data('target-index')}&destination=${destination.data('target-index')}`);
}