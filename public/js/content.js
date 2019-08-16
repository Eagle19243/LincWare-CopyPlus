window.onload = function() {
    chrome.runtime.onMessage.addListener(handleMessage);
}

/**
 * Handle messages from background.js
 */
function handleMessage(request, sender, sendResponse) {
    if (request.action === 'Get_Extension_Availability') {
        sendResponse({enable: $('form').length > 0});
    } else if (request.action === 'Get_Fields') {
        const fields = [];
        const elements = $('form input:not([name=""],[type="hidden"]), form select:not([name=""]), form textarea:not([name=""])');
        
        elements.each((i) => {
            // console.log($(elements[i]).closest('tr').find('td[nowrap="nowrap"]').html());
            const obj = {
                name: $(elements[i]).attr('name'),
                id: $(elements[i]).attr('id'),
                value: $(elements[i]).val(),
                type: $(elements[i]).attr('type') || $(elements[i]).prop('tagName').toLowerCase()
            }
            fields.push(obj);
        });

        sendResponse({fields: fields});
    } else if (request.action === 'Open_File_Browser') {
        console.log('Open_File_Browser');
        const fileChooser = document.createElement('input');
        fileChooser.type = 'file';
        document.body.appendChild(fileChooser);
        fileChooser.click();
    }
}