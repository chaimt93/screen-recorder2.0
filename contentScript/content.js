chrome.runtime.sendMessage({action: "whatState"});

const messagesFromReactAppListener = async (payload, sender, response) => {
    if (payload.message === "init") await initSetup(payload.srcObject)
    if (payload.message === "state is ready") await initSetup()
}
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);


async function initSetup(srcObject) {
    await createBottomSection(srcObject);
}

async function createBottomSection(srcObject) {
    const bottomBox = createBottomBox();

    const video = await createCamVideo();
    video.srcObject = srcObject;
    bottomBox.appendChild(video)

    const showVideoButton = createShowVideoButton()
    bottomBox.appendChild(showVideoButton)

    const controlersRow = createControllersRow()
    bottomBox.appendChild(controlersRow)

    document.body.appendChild(bottomBox)

    chrome.runtime.sendMessage({action: "ready"});

}

async function createCamVideo() {
    const video = document.createElement("video");
    video.style.position = "fixed";
    video.id = "camVideo";
    video.style.bottom = "15px";
    video.style.left = "0";
    video.style.width = "300px";
    video.style.height = "auto";
    video.style.clipPath = "circle(40%)";
    video.autoplay = true;
    // video.style.cssText = "transform: scale(-1, 1);";
    // video.srcObject = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
    return video;
}

function createBottomBox() {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.bottom = "15px";
    div.style.left = "15px";
    div.style.width = "400px";
    div.style.height = "300px";
    div.onmouseover = show_or_hide_btn_for_video_visabillity;
    div.onmouseout = show_or_hide_btn_for_video_visabillity;
    return div;
}

function createShowVideoButton() {
    const showVideoButton = document.createElement("button");
    showVideoButton.style.position = "absolute";
    showVideoButton.style.bottom = "185px";
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
function createControlerBtn(){
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
    btn.innerText ="P"
    btn.style.backgroundColor = "orange";
    btn.style.color ="wight"
    btn.id = "playBtn";
    btn.onclick=handlePlayBtnClick
    return btn;
}
function handlePauseBtnClick(){

}

function createPauseBtn() {
    const btn = createControlerBtn();;
    btn.innerText ="||"
    btn.style.color ="gray"
    btn.id = "pauseBtn";
    btn.onclick=handlePauseBtnClick
    return btn;
}
async function handlePlayBtnClick(){
    //todo  לממש את התחלת הוידאו ולשלוח את הנתונים לבקגראונד ולשרת
    await startRecording()

}

function createCancelBtn() {
    const btn = createControlerBtn();
    btn.innerText ="X"
    btn.style.color ="red"
    btn.id = "cancelBtn";
    btn.onclick=handleCancelBtnClick;
    return btn;
}
function handleCancelBtnClick(){

}

function createHideRowBtn() {
    const btn = createControlerBtn();
    btn.innerText ="..."
    btn.style.color ="black"
    btn.style.paddingBottom ="8px"
    btn.style.width ="30px";
    btn.style.height ="30px";
    btn.id = "HideRowBtn";
    btn.onclick=handleHideRowBtnClick;
    return btn;
}
function handleHideRowBtnClick(){
    const row = document.getElementById("ControllersRow")
    row.childNodes.forEach((btn,i)=>{
        if (i===row.childNodes.length-1) return
        btn.style.visibility = btn.style.visibility === "hidden" ? "visible" : "hidden"
    })
}




function hideVideo() {
    const video = document.getElementById('camVideo');
    video.style.visibility = video.style.visibility === "hidden" ? "visible" : "hidden"

    const showVideoButton = document.getElementById('showVideoButton');
    showVideoButton.innerText = showVideoButton.innerText === "x" ? "+" : "x"
}
async function startRecording() {
    const displayMediaOptions = {video: {cursor: "always"}, audio: false};
    let captureStream = null;
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
        const video = document.createElement('video')
        video.srcObject = stream
        video.autoplay = true
        video.style.width = "500px"
        video.style.position = "absolute"
        video.style.top = "10%";
        video.style.left = "20%";
        video.id = "screenShare";
        document.body.appendChild(video)
    } catch (err) {
        console.error("Error: " + err);
    }
}
function show_or_hide_btn_for_video_visabillity() {
    const showVideoButtontn = document.getElementById('showVideoButton');
    showVideoButtontn.style.visibility = showVideoButtontn.style.visibility === "visible" ? "hidden" : "visible";
}