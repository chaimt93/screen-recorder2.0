async function setUpVideoDiv(){

    const div = createDiv()
    const showVideoButton = createShowVideoButton();
    div.appendChild(showVideoButton)
    const video = await createVideo()
    div.appendChild(video)
    document.body.appendChild(div)
    document.body.style.overflow="hidden";
}

setUpVideoDiv()

function createDiv(){
    const div = document.createElement("div");
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.overflow = "hidden";
    div.onmouseover = show_or_hide_btn_for_video_visabillity;
    div.onmouseout = show_or_hide_btn_for_video_visabillity;
    return div;
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

async function createVideo(){
    try {
        const srcObject = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        const video = createSelfieVideo();
        video.srcObject = srcObject ;
        return video;
    }catch (e) {
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
    video.autoplay = true;
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