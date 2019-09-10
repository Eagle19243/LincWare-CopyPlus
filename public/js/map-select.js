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
    const items             = await getValueFromStroage(['sources', 'destinations', 'map']);
    const source            = items.sources[getSourceIndex()];
    const destination       = items.destinations[getDestinationIndex()];
    
    if (items.map) {
        fields_map = items.map[`${getSourceIndex()}-${getDestinationIndex()}`] || [];
    }

    $('#legend_source').html(`${source.name}(Source)`);
    $('#legend_destination').html(`${destination.name}(Destination)`);
    
    for (const key in source) {
        if (key.indexOf('field') > -1 && source[key].enabled) {
            const content = `<div class="input-item">
                                <label class="lbl-source-name" data-field-name="${source[key].name}">
                                    ${source[key].label}
                                </label>
                             </div>`;
            $('#fields_source').append(content);
        }
    }

    for (const key in destination) {
        if (key.indexOf('field') > -1 && destination[key].enabled) {
            const content = `<div class="input-item">
                                <label class="lbl-destination-name" 
                                       data-field-name="${destination[key].name}"
                                       data-field-overwrite="${destination[key].overwrite}"
                                       data-field-label="${destination[key].label}">
                                    ${destination[key].label}
                                </label>
                                <a class="btn-remove" data-field-name="${destination[key].name}">
                                    <i class="icon wb-trash" aria-hidden="true"></i>
                                </a>
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
                destination: $(element.draggable).data('field-name'),
                overwrite: $(element.draggable).data('field-overwrite'),
                destinationLabel: $(element.draggable).data('field-label')
            }

            $(this).css('background-color', '#4CAF50');
            $(this).css('color', '#FFFFFF');
            $(this).droppable('disable');
            $(element.draggable).css('background-color', '#4CAF50');
            $(element.draggable).css('color', '#FFFFFF');
            $(element.draggable).draggable('disable');
            $(element.draggable).parent().find('.btn-remove').show();
            fields_map.push(obj);
            sort($(this), $(element.draggable), true);
        }
    });

    for (const obj of fields_map) {
        const sourceElement = $(`.lbl-source-name[data-field-name=${obj.source}]`);
        const destinationElement = $(`.lbl-destination-name[data-field-name=${obj.destination}]`);
        sourceElement.css('background-color', '#4CAF50');
        sourceElement.css('color', '#FFFFFF');
        destinationElement.css('background-color', '#4CAF50');
        destinationElement.css('color', '#FFFFFF');
        sourceElement.droppable('disable');
        destinationElement.draggable('disable');
        destinationElement.parent().find('.btn-remove').show();
        sort(sourceElement, destinationElement, true);
    }
    
    $('.btn-remove').click(removeButtonClicked);
}

function backButtonClicked() {
    location.href = chrome.extension.getURL(`html/map-target.html`);
}

async function saveButtonClicked() {
    const item_map  = await getValueFromStroage(['map']);
    const map       = item_map.map || {};

    map[`${getSourceIndex()}-${getDestinationIndex()}`] = fields_map;
    setValueToStorage({'map': map});
    chrome.runtime.sendMessage({action: 'Resetup_Popup'});
    window.close();
}

function removeButtonClicked(e) {
    const destination = $(e.currentTarget).data('field-name');
    const index = fields_map.findIndex((obj) => {
        return obj.destination === destination;
    });
    
    if (index > -1) {
        $(e.currentTarget).hide();
        const sourceElement = $(`.lbl-source-name[data-field-name=${fields_map[index].source}`);
        const destinationElement = $(`.lbl-destination-name[data-field-name=${fields_map[index].destination}`);
        sourceElement.css('background-color', '#f3f7f9');
        sourceElement.css('color', '#76838f');
        sourceElement.droppable('enable');
        destinationElement.css('background-color', '#f3f7f9');
        destinationElement.css('color', '#76838f');
        destinationElement.draggable('enable');
        fields_map.splice(index, 1);
        sort(sourceElement, destinationElement, false);
    }
}

function sort(source, destination, isMapped) {
    if (isMapped) {
        $('#legend_source').after(source.parent());
        $('#legend_destination').after(destination.parent());
    } else {
        $('#fields_source').append(source.parent());
        $('#fields_destination').append(destination.parent());
    }
}