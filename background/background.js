/* global chrome */
let state = "off";

chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
        if (request.action === 'check_if_user_connected') sendResponse(check_if_user_connected())
        if (request.action === 'setUp') setUp()
        if (request.action === 'ready') setReady()
        if (request.action === 'whatState') informContentWhatState(sender)
        if (request.action === 'anotherBlob') handleAnotherBlob(request)
        if (request.action === 'stop') downloadVideo(request)
        if (request.action === 'cancel') cancelVideo(request)
    })
let blobs = [];

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
        const iframeForUserMediaUrl = chrome.runtime.getURL('../helpers/iframe-for-userMedia/index.html');
        chrome.tabs.query({active: true, lastFocusedWindow: true}, async (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {message: "init", iframeForUserMediaUrl}, () => {
            })
        });
    } catch (e) {
        console.log(e)
    }
}

function setReady() {
    try {
        state = "ready";
    } catch (e) {
        console.log(e)
    }
}

function cancelVideo() {
    blobs = [];
}

function check_if_user_connected() {
    try {
        const user = JSON.parse(localStorage.getItem('screen_recorder_user') || '{}')
        return user.id ? user : null;
    } catch (e) {
        return null
    }
}

async function handleAnotherBlob(request) {
    try {
        const blob = await fetch(request.url).then(r => r.blob());
        URL.revokeObjectURL(request.url);
        blobs.push(blob)
    } catch (e) {
        return null
    }
}

async function downloadVideo(request) {
    try {
        const blob = new Blob(blobs, {type: "video/webm"});
        const url = URL.createObjectURL(blob);
        chrome.downloads.download({url, filename: 'your new recording'}, () => {
            blobs = []
        });
    } catch (e) {
        return null
    }
}

