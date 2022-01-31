let mediaRecorder = null;

const messagesFromReactAppListener = async (payload, sender, response) => {
    // if (payload.message === "init") await initSetup(payload)
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

async function initSetup() {
    add_google_icons_to_page();
    const bottomBox = createBottomBox();
    const controllersRow = createControllersRow();
    bottomBox.appendChild(controllersRow);

    const showVideoButton = createShowVideoButton();
    bottomBox.appendChild(showVideoButton)
    const video = await createVideo()
    bottomBox.appendChild(video)
    document.body.appendChild(bottomBox);
    document.body.style.overflow = "hidden";

    chrome.runtime.sendMessage({action: "ready"});
}

initSetup()

function createBottomBox() {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.bottom = "15px";
    div.style.left = "15px";
    div.style.width = "400px";
    div.style.height = "300px";
    div.style.zIndex = "5000000";
    div.id = "bottomBox"
    div.onmouseover = show_or_hide_btn_for_video_visabillity;
    div.onmouseout = show_or_hide_btn_for_video_visabillity;
    return div;
}

function createControllersRow() {
    const row = document.createElement("div");
    row.style.position = "absolute";
    row.style.direction = "rtl";
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
    const btn = document.getElementById("pauseBtn");
    if (btn.innerHTML.includes('not_started')) {
        mediaRecorder.resume();
        btn.innerHTML = '<i class="material-icons">pause</i>'
    } else {
        mediaRecorder.pause()
        btn.innerHTML = '<i class="material-icons">not_started</i>'
    }
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
    const playBtn = document.getElementById("playBtn")
    if (playBtn.innerHTML.includes('play_arrow')) {
        await startRecording()
        playBtn.innerHTML = '<i class="material-icons">done</i>';
    } else {
        mediaRecorder.stop();
        console.log("recorder stopped");
        chrome.runtime.sendMessage({action: "stop"});
        stopCapture()
        playBtn.innerHTML = '<i class="material-icons">play_arrow</i>';
        end_process()
    }
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
    mediaRecorder.stop();
    stopCapture()
    const playBtn = document.getElementById("playBtn")
    playBtn.innerHTML = '<i class="material-icons">play_arrow</i>';
    chrome.runtime.sendMessage({action: "cancel"});
    end_process()
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
    const displayMediaOptions = {video: {cursor: "always"}, audio: true};
    try {
        stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        await initMediaRecorder(stream)
        mediaRecorder.start(100);
        console.log("recorder started");
    } catch (err) {
        console.error("Error: " + err);
    }
}

async function initMediaRecorder(stream) {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.onstop = function (e) {
        console.log("mediaRecorder stopped");
    }
    mediaRecorder.ondataavailable = sendDataToBackground;
}

async function sendDataToBackground(e) {
    const url = URL.createObjectURL(e.data);
    chrome.runtime.sendMessage({action: "anotherBlob", url});
}

function stopCapture() {
    let tracks = stream.getTracks();
    tracks.forEach(track => {
        track.stop();
        track.enabled = false
    });
    stream = null;
}

function end_process() {
    const box = document.getElementById('bottomBox')
    document.body.removeChild(box)
    mediaRecorder = null
    // todo  אחרי לחיצה על האיקס, שום סרטון לא יורד בפורמט נכון
}


function createShowVideoButton() {
    const showVideoButton = document.createElement("button");
    showVideoButton.style.position = "absolute";
    showVideoButton.style.bottom = "210px";
    showVideoButton.style.left = "30px";
    showVideoButton.style.zIndex = "2";
    showVideoButton.style.width = "30px";
    showVideoButton.style.width = "30px";
    showVideoButton.style.backgroundColor = "gray";
    showVideoButton.style.color = "white";
    showVideoButton.style.clipPath = "circle(40%)";
    showVideoButton.style.border = "unset";
    showVideoButton.style.fontSize = "22px";
    showVideoButton.style.visibility = "hidden";
    showVideoButton.innerText = "x";
    showVideoButton.id = "showVideoButton";
    showVideoButton.onclick = hideVideo
    return showVideoButton;
}

async function createVideo() {
    try {
        const srcObject = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        const video = createSelfieVideo();
        video.srcObject = srcObject;
        return video;
    } catch (e) {
        console.error(e)
        debugger
    }
}

function createSelfieVideo() {
    const video = document.createElement("video");
    video.id = "selfieVideo";
    video.style.width = "300px";
    video.style.height = "300px";
    video.style.clipPath = "circle(37%)";
    video.style.webkitTransform = "scaleX(-1);";
    video.style.transform = "scaleX(-1)";
    video.autoplay = true;
    // video.muted = true
    //todo אודיו לא עובד
    return video;
}

function show_or_hide_btn_for_video_visabillity() {
    const showVideoButtontn = document.getElementById('showVideoButton');
    showVideoButtontn.style.visibility = showVideoButtontn.style.visibility === "visible" ? "hidden" : "visible";
}

function hideVideo() {
    const video = document.getElementById('selfieVideo');
    video.style.visibility = video.style.visibility === "hidden" ? "visible" : "hidden"

    const showVideoButton = document.getElementById('showVideoButton');
    showVideoButton.innerText = showVideoButton.innerText === "x" ? "+" : "x"
}