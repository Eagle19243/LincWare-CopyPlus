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
                label: $(elements[i]).attr('name'),
                id: $(elements[i]).attr('id'),
                value: $(elements[i]).val(),
                type: $(elements[i]).attr('type') || $(elements[i]).prop('tagName').toLowerCase()
            }
            fields.push(obj);
        });

        sendResponse({fields: fields});
    } else if (request.action === 'Get_Form_Name') {
        sendResponse({form_name: $('form').attr('name')});
    } else if (request.action === 'Get_Field_Value') {
        const value = $(`form input[name=${request.field_name}], form select[name=${request.field_name}], form textarea[name=${request.field_name}]`).val();
        sendResponse({field_value: value});
    } else if (request.action === 'Set_Field_Value') {
        $(`form input[name=${request.field_name}], form select[name=${request.field_name}], form textarea[name=${request.field_name}]`).val(request.field_value);
        sendResponse({success: true});
    }   
}