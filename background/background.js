/* global chrome */
let state = "off";

chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
        if (request.action === 'check_if_user_connected') sendResponse(check_if_user_connected())
        if (request.action === 'setUp') setUp()
        if (request.action === 'ready') setReady()
        if (request.action === 'whatState') informContentWhatState(sender)
    })

function informContentWhatState(sender) {
    try {
        chrome.tabs.sendMessage(sender.tab.id, {message: `state is ${state}`}, () => {
        })
    } catch (e) {
        console.log(e)
    }
}

async function setUp() {
    try {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, async (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {message: "init"}, () => {
            })
        });
    } catch (e) {
        console.log(e)
        debugger
    }
}

function setReady() {
    try {
        state = "ready";
    } catch (e) {
        console.log(e)
    }
}

function check_if_user_connected() {
    try {
        const user = JSON.parse(localStorage.getItem('screen_recorder_user') || '{}')
        return user.id ? user : null;
    } catch (e) {
        return null
    }
}



