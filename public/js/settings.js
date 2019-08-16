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
    let item = null;

    const item_sources      = await getValueFromStroage(['sources']);
    const item_destinations = await getValueFromStroage(['destinations']);
    console.log(item_sources, item_destinations);  

    const sourceContent =   `<div class="list-group-item bg-blue-grey-500">
                                <div class="container-img">
                                    <img src="../images/icon-128.png" />
                                </div>
                                <div class="container-buttons">
                                    <a class="btn-edit">
                                        Edit
                                        <i class="icon wb-chevron-right" aria-hidden="true"></i>
                                    </a>
                                    <a class="btn-map">
                                        Map
                                        <i class="icon wb-chevron-right" aria-hidden="true"></i>
                                    </a>
                                </div>
                            </div>`;
    $('.container-sources').append(sourceContent);
}

function closeButtonClicked() {
    window.close();
}

function addSourceButtonClicked() {
    location.href = chrome.extension.getURL('html/target.html?target=source');
}

function addDestinationButtonClicked() {
    location.href = chrome.extension.getURL('html/target.html?target=destination');
}