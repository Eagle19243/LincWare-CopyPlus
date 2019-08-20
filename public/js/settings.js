window.onload = () => {
    init();
}

function init() {
    $('.btn-add-source').click(addSourceButtonClicked);
    $('.btn-add-destination').click(addDestinationButtonClicked);
    $('.btn-close').click(closeButtonClicked);

    initUI();
}

async function initUI() {
    const item_sources      = await getValueFromStroage(['sources']);
    const item_destinations = await getValueFromStroage(['destinations']);
    const sources           = item_sources.sources || [];
    const destinations      = item_destinations.destinations || [];

    sources.forEach((source, index) => {
        const sourceContent =   `<div class="list-group-item bg-blue-grey-500">
                                    <label class="target-name">${source.name}</label>
                                    <div class="container-buttons">
                                        <a class="btn-edit" data-target-index=${index} data-target="source">
                                            <i class="icon wb-pencil" aria-hidden="true"></i>
                                        </a>
                                        <a class="btn-map" data-target-index=${index} data-target="source">
                                            <i class="icon wb-library" aria-hidden="true"></i>
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
                                        <a class="btn-map" data-target-index=${index} data-target="destination">
                                            <i class="icon wb-library" aria-hidden="true"></i>
                                        </a>
                                        <a class="btn-remove" data-target-index=${index} data-target="destination">
                                            <i class="icon wb-trash" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                </div>`;
        $('.container-destinations').append(destinationContent);
    });

    $('.btn-edit').click(editButtonClicked);
    $('.btn-map').click(mapButtonClicked);
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
}

async function removeButtonClicked(e) {
    const targetIndex  = $(e.currentTarget).data('target-index');
    const target = $(e.currentTarget).data('target');

    if (target === 'source') {
        const item = await getValueFromStroage(['sources']);
        item.sources.splice(targetIndex, 1);
        setValueToStorage({'sources': item.sources});
    } else {
        const item = await getValueFromStroage(['destinations']);
        item.destinations.splice(targetIndex, 1);
        setValueToStorage({'destinations': item.destinations});
    }

    location.reload();
}

function addSourceButtonClicked() {
    location.href = chrome.extension.getURL(`html/target.html?target=source`);
}

function addDestinationButtonClicked() {
    location.href = chrome.extension.getURL(`html/target.html?target=destination`);
}