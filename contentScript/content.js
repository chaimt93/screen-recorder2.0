chrome.runtime.sendMessage({action: "whatState"});

let mediaRecorder = null;

const messagesFromReactAppListener = async (payload, sender, response) => {
    if (payload.message === "init") await initSetup(payload)
    if (payload.message === "state is ready") await initSetup()
}
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

function add_google_icons_to_page(){
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    head.appendChild(link);
}
async function initSetup({iframeForUserMediaUrl}) {
    add_google_icons_to_page()
    const bottomBox = createBottomBox();
    const iframe = createSelfieVideoIframe(iframeForUserMediaUrl);
    const controllersRow = createControllersRow();
    [controllersRow, iframe].forEach(element => {
        bottomBox.appendChild(element)
    })
    document.body.appendChild(bottomBox)

    chrome.runtime.sendMessage({action: "ready"});
}

function createSelfieVideoIframe(iframeForUserMediaUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = iframeForUserMediaUrl
    Object.keys(iframe.style).forEach(prop => {
        iframe.style[prop] = "unset"
    })
    iframe.allow = "microphone; camera;"
    iframe.style.position = "fixed";
    iframe.id = "selfieVideoIframe";
    iframe.style.bottom = "15px";
    iframe.style.left = "0";
    iframe.style.width = "300px";
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

function createControllersRow() {
    const row = document.createElement("div");
    row.style.position = "absolute";
    row.style.bottom = "15px";
    row.style.left = "230px";
    row.style.zIndex = "2";
    row.style.width = "auto";
    row.style.height = "50px";
    row.style.backgroundColor = "transparent";
    row.style.display = "flex";
    row.style.justifyContent = "space-around";
    row.style.alignItems = "center";
    row.id = "ControllersRow";
    row.appendChild(createPlayBtn());
    row.appendChild(createPauseBtn());
    row.appendChild(createCancelBtn());
    row.appendChild(createHideRowBtn());
    return row
}

function createControlerBtn() {
    const btn = document.createElement("button");
    btn.style.zIndex = "3";
    btn.style.width = "50px";
    btn.style.height = "50px";
    btn.style.backgroundColor = "white";
    btn.style.clipPath = "circle(40%)";
    btn.style.border = "unset";
    btn.style.fontSize = "16px";
    btn.style.margin = "1px";
    btn.style.cursor = "pointer";
    btn.style.overscrollBehavior = "pointer";
    return btn;
}

function createPlayBtn() {
    const btn = createControlerBtn();
    btn.innerHTML = '<i class="material-icons">play_arrow</i>';
    btn.style.backgroundColor = "orange";
    btn.style.color = "wight"
    btn.id = "playBtn";
    btn.onclick = handlePlayBtnClick
    return btn;
}

function handlePauseBtnClick() {

}

function createPauseBtn() {
    const btn = createControlerBtn();

    btn.innerHTML = '<i class="material-icons">pause</i>'
    btn.style.color = "gray"
    btn.id = "pauseBtn";
    btn.onclick = handlePauseBtnClick
    return btn;
}

async function handlePlayBtnClick() {
    await startRecording()
}

function createCancelBtn() {
    const btn = createControlerBtn();
    btn.innerHTML = '<i class="material-icons">close</i>'
    btn.style.color = "red"
    btn.id = "cancelBtn";
    btn.onclick = handleCancelBtnClick;
    return btn;
}

function handleCancelBtnClick() {

}

function createHideRowBtn() {
    const btn = createControlerBtn();
    btn.innerText = "..."
    btn.style.color = "black"
    btn.style.paddingBottom = "8px"
    btn.style.width = "30px";
    btn.style.height = "30px";
    btn.id = "HideRowBtn";
    btn.onclick = handleHideRowBtnClick;
    return btn;
}

function handleHideRowBtnClick() {
    const row = document.getElementById("ControllersRow")
    row.childNodes.forEach((btn, i) => {
        if (i === row.childNodes.length - 1) return
        btn.style.visibility = btn.style.visibility === "hidden" ? "visible" : "hidden"
    })
}

let stream = null;

async function startRecording() {
    const displayMediaOptions = {video: {cursor: "always"}, audio: false};
    try {
        stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        await initMediaRecorder(stream)
        mediaRecorder.start(100);
        console.log("recorder started");
        turnPlayBtnToStopBtn()
    } catch (err) {
        console.error("Error: " + err);
    }
}

async function initMediaRecorder(stream) {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.onstop = function (e) {
        console.log("mediaRecorder stoped");
    }
    mediaRecorder.ondataavailable = sendDataToBackground;
}

async function sendDataToBackground(e) {
    console.log("sending blob to background ", e.data)
    const url = URL.createObjectURL(e.data);
    chrome.runtime.sendMessage({action: "anotherBlob", url});
}

function turnPlayBtnToStopBtn() {
    const playBtn = document.getElementById("playBtn")
    playBtn.innerText = 'S';
    playBtn.onclick = handleStopBtnClick
}

function handleStopBtnClick() {
    mediaRecorder.stop();
    console.log("recorder stopped");
    const playBtn = document.getElementById("playBtn")
    playBtn.innerText = 'P';
    playBtn.onclick = handlePlayBtnClick;
    chrome.runtime.sendMessage({action: "stop"});
    stopCapture()
}

function stopCapture() {
    let tracks = stream.getTracks();
    tracks.forEach(track => {
        track.stop();
        track.enabled = false
    });
    stream = null;
}