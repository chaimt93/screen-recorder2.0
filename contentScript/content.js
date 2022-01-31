chrome.runtime.sendMessage({action: "whatState"});
let mediaRecorder = null;

const messagesFromReactAppListener = async (payload, sender, response) => {
    if (payload.message === "init") await initSetup(payload)
    if (payload.message === "state is ready") await initSetup()
}
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

function add_google_icons_to_page() {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    head.appendChild(link);
}

async function initSetup({iframeForUserMediaUrl}) {
    const iframe = createSelfieVideoIframe(iframeForUserMediaUrl);
    const bottomBox = createBottomBox();
    bottomBox.appendChild(iframe)
    document.body.appendChild(bottomBox)
    chrome.runtime.sendMessage({action: "ready"});
}

function createSelfieVideoIframe(iframeForUserMediaUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = iframeForUserMediaUrl
    Object.keys(iframe.style).forEach(prop => {
        iframe.style[prop] = "unset"
    })
    iframe.allow = "microphone; camera;display-capture;"
    iframe.style.position = "fixed";
    iframe.id = "selfieVideoIframe";
    iframe.style.bottom = "15px";
    iframe.style.left = "0";
    iframe.style.width = "500px";
    iframe.style.height = "300px";
    return iframe
}

function createBottomBox() {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.bottom = "15px";
    div.style.left = "15px";
    div.style.width = "400px";
    div.style.height = "300px";
    div.style.zIndex = "5000000";
    div.id = "bottomBox"
    return div;
}
