window.onload = () => {
    init();
}

function init() {
    $('.btn-add-source').click(addSourceButtonClicked);
    $('.btn-add-destination').click(addDestinationButtonClicked);
    $('.btn-map').click(mapButtonClicked);
    $('.btn-close').click(closeButtonClicked);

    initUI();
}

async function initUI() {
    const items             = await getValueFromStroage(['sources', 'destinations']);
    const sources           = items.sources || [];
    const destinations      = items.destinations || [];

    sources.forEach((source, index) => {
        const sourceContent =   `<div class="list-group-item bg-blue-grey-500">
                                    <label class="target-name">${source.name}</label>
                                    <div class="container-buttons">
                                        <a class="btn-edit" data-target-index=${index} data-target="source">
                                            <i class="icon wb-pencil" aria-hidden="true"></i>
                                        </a>
                                        <a class="btn-remove" data-target-index=${index} data-target="source">
                                            <i class="icon wb-trash" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                </div>`;
        $('.container-sources').append(sourceContent);
    });
    
    destinations.forEach((destination, index) => {
        const destinationContent =   `<div class="list-group-item bg-blue-grey-500">
                                    <label class="target-name">${destination.name}</label>
                                    <div class="container-buttons">
                                        <a class="btn-edit" data-target-index=${index} data-target="destination">
                                            <i class="icon wb-pencil" aria-hidden="true"></i>
                                        </a>
                                        <a class="btn-remove" data-target-index=${index} data-target="destination">
                                            <i class="icon wb-trash" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                </div>`;
        $('.container-destinations').append(destinationContent);
    });

    $('.btn-edit').click(editButtonClicked);
    $('.btn-remove').click(removeButtonClicked);
}

function closeButtonClicked() {
    window.close();
}

function editButtonClicked(e) {
    const targetIndex  = $(e.currentTarget).data('target-index');
    const target       = $(e.currentTarget).data('target');
    location.href = chrome.extension.getURL(`html/target.html?target=${target}&target_index=${targetIndex}&edit=true`);
}

function mapButtonClicked(e) {
    location.href = chrome.extension.getURL(`html/map-target.html`);
}

async function removeButtonClicked(e) {
    const targetIndex  = $(e.currentTarget).data('target-index');
    const target = $(e.currentTarget).data('target');
    const items =  await getValueFromStroage(['sources', 'destinations']);
    
    if (target === 'source') {
        items.sources.splice(targetIndex, 1);
        setValueToStorage({'sources': items.sources});
    } else {
        items.destinations.splice(targetIndex, 1);
        setValueToStorage({'destinations': items.destinations});
    }

    location.reload();
}

function addSourceButtonClicked() {
    location.href = chrome.extension.getURL(`html/target.html?target=source`);
}

function addDestinationButtonClicked() {
    location.href = chrome.extension.getURL(`html/target.html?target=destination`);
}