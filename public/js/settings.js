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
                                    <label class="source-name">${source.name}</label>
                                    <div class="container-buttons">
                                        <a class="btn-edit" data-target-index=${index} data-target="source">
                                            Edit
                                            <i class="icon wb-chevron-right" aria-hidden="true"></i>
                                        </a>
                                        <a class="btn-map" data-target-index=${index} data-target="source">
                                            Map
                                            <i class="icon wb-chevron-right" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                </div>`;
        $('.container-sources').append(sourceContent);
    });
    
    destinations.forEach((destination, index) => {
        const destinationContent =   `<div class="list-group-item bg-blue-grey-500">
                                    <label class="source-name">${destination.name}</label>
                                    <div class="container-buttons">
                                        <a class="btn-edit" data-target-index=${index} data-target="destination">
                                            Edit
                                            <i class="icon wb-chevron-right" aria-hidden="true"></i>
                                        </a>
                                        <a class="btn-map" data-target-index=${index} data-target="destination">>
                                            Map
                                            <i class="icon wb-chevron-right" aria-hidden="true"></i>
                                        </a>
                                    </div>
                                </div>`;
        $('.container-destinations').append(destinationContent);
    });

    $('.btn-edit').click(editButtonClicked);
    $('.btn-map').click(mapButtonClicked);
}

function closeButtonClicked() {
    window.close();
}

function editButtonClicked(e) {
    const targetIndex  = $(e.currentTarget).data('target-index');
    const target       = $(e.currentTarget).data('target');
    location.href = chrome.extension.getURL(`html/target.html?
        target=${target}&
        target_index=${targetIndex}&
        edit=${true}`);
}

function mapButtonClicked(e) {
    
}

function addSourceButtonClicked() {
    location.href = chrome.extension.getURL(`html/target.html?
        target=source`);
}

function addDestinationButtonClicked() {
    location.href = chrome.extension.getURL(`html/target.html?
        target=destination`);
}