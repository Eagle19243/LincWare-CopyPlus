import { BASE_API_URL } from './config';
import './style.css';

let urlSaved     = false;

init();

async function init() {
    chrome.runtime.onMessage.addListener(handleMessage);

    const scrapability = await isURLScrapeable();
    const jobExist     = await isJobExists();
    await createExtensionUI();

    if (scrapability) {    
        toggleExtensionUI();
    }
}

/**
 * Handle message from background script
 */
async function handleMessage(request: any) {
    if (request.message === "Toggle_Extension_UI") {
        toggleExtensionUI();
    }
}

/**
 * Event when HireClub button clicked
 */
function hireclubButtonClicked() {
    const uiElement = $('#popup-hireclub');

    if (uiElement.is(':visible')) {
        uiElement.hide();
    } else {
        uiElement.show();
    }
}

/**
 * Event when Save button clicked
 */
async function saveButtonClicked() {
    if (urlSaved) {
        return;
    }

    $('#btn-save').html('Saving...');

    const titleEl    = $('#popup-hireclub #title');
    const companyEl  = $('#popup-hireclub #company');
    const locationEl = $('#popup-hireclub #location');
    const urlEl      = $('#popup-hireclub #url');

    const data: any = await scrapeJob(titleEl.val(), companyEl.val(), locationEl.val(), urlEl.val());
    
    titleEl.val(data.title);
    companyEl.val(data.company_name);
    locationEl.val(data.location);
    urlSaved = true;
    $('#btn-save').html('Saved!');
}

/**
 * Check if current active URL is scrapeable
 */
function isURLScrapeable(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${BASE_API_URL}/urls/check`,
            type: 'GET',
            data: { url: location.href },
            success: (response: any) => {
                resolve((response.data) ? response.data.recognized : false);
            },
            error: (xhr: any) => {
                console.log('Error: ', xhr.responseText);
                reject();
            }
        });
    });
}

/**
 * Check if current active URL is already scraped
 */
function isJobExists() {
    return true;
}

/**
 * Create Extension UI
 */
function createExtensionUI() {
    return new Promise((resolve) => {
        if ($('#hireclub-ui-container').length) {
            resolve();
        } else {
            const uiContainer     = $('<div id="hireclub-ui-container"></div>');
            const uiHTMLPath      = chrome.extension.getURL('ui.html');
            const imgPlus         = chrome.extension.getURL('images/plus.svg');
            const imgHireClub     = chrome.extension.getURL('images/icon-48.png');
            const imgMenu         = chrome.extension.getURL('images/menu.svg');
            
            $('body').prepend(uiContainer);
            uiContainer.load(uiHTMLPath, () => {
                $('#btn-hireclub #img-plus').attr('src', imgPlus);
                $('#btn-hireclub #img-hireclub').attr('src', imgHireClub);
                $('#popup-hireclub #img-menu').attr('src', imgMenu);
                $('#hireclub-ui-container').hide();

                $('#popup-hireclub #url').val(location.href);
                $('#popup-hireclub #company').autocomplete({
                    source: getCompanies
                });

                // Events
                $('#btn-hireclub').click(hireclubButtonClicked);
                $('#btn-save').click(saveButtonClicked);
                
                resolve();
            });
        }
    });
}

/**
 * Show/Hide Extension UI
 */
function toggleExtensionUI() {
    const uiElement = $('#hireclub-ui-container');

    if (uiElement.is(':visible')) {
        uiElement.hide();
    } else {
        uiElement.show();
    }
}

/**
 * Scrape current active URL
 */
function scrapeJob(title, company, location, url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `${BASE_API_URL}/jobs?scrape=true`,
            type: 'POST',
            data: {
                job: {
                    title           : title,
                    company_name    : company,
                    location        : location,
                    url             : url
                }
            },
            success: (response: any) => {
                if (!response.data) {
                    reject(response);
                }

                resolve(response.data);
            },
            error: (xhr: any) => {
                reject(xhr.responseJSON);
            }
        });
    });    
}

function getCompanies(request, response) {
    $.ajax({
        url: `${BASE_API_URL}/companies?query=${request.term}&page_size=5`,
        type: 'GET',
        success: (res) => {
            if (res.data && Array.isArray(res.data)) {
                let companies = [];
                
                for (let company of res.data) {
                    companies.push(company.name);    
                }
                console.log(companies);
                response(companies);
            } else {
                response([]);
            }
        },
        error: (xhr) => {
            console.log('Error:', xhr.responseJSON);
            response([]);
        }
    });
}