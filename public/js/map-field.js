let fields_map = [];

window.onload = () => {
    init();
}

function init() {
    $('.btn-back').click(backButtonClicked);
    $('.btn-save').click(saveButtonClicked);

    initUI();
}

async function initUI() {
    const items             = await getValueFromStroage(['sources', 'destinations']);
    const source            = items.sources[getSourceIndex()];
    const destination       = items.destinations[getDestinationIndex()];

    $('#legend_source').html(`${source.name}(Source)`);
    $('#legend_destination').html(`${destination.name}(Destination)`);

    for (const key in source) {
        if (key.indexOf('field') > -1) {
            const content = `<div class="input-item">
                                <label class="lbl-source-name" data-field-name="${source[key].name}">
                                    ${source[key].name}
                                </label>
                             </div>`;
            $('#fields_source').append(content);
        }
    }

    for (const key in destination) {
        if (key.indexOf('field') > -1) {
            const content = `<div class="input-item">
                                <label class="lbl-destination-name" data-field-name="${destination[key].name}">
                                    ${destination[key].name}
                                </label>
                             </div>`;
            $('#fields_destination').append(content);
        }
    }

    $('#fields_destination label').draggable({
        revert: 'valid'
    });

    $('#fields_source label').droppable({
        accept: ".lbl-destination-name",
        drop: function (event, element) {
            const obj = {
                source: $(this).data('field-name'),
                destination: $(element.draggable).data('field-name')
            }

            $(this).css('background-color', '#4CAF50');
            $(this).css('color', '#FFFFFF');
            $(this).droppable('disable');
            $(element.draggable).css('background-color', '#4CAF50');
            $(element.draggable).css('color', '#FFFFFF');
            $(element.draggable).draggable('disable');
            fields_map.push(obj);
        }
    });
}

function backButtonClicked() {
    location.href = chrome.extension.getURL(`html/map-target.html`);
}

async function saveButtonClicked() {
    const item_map = await getValueFromStroage(['map']);
    const map      = item_map.map || {};

    map[`${getSourceIndex()}-${getDestinationIndex()}`] = fields_map;
    setValueToStorage({'map': map});
}