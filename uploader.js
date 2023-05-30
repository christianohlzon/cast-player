const URL = window.URL || window.webkitURL;

const createTopbar = () => {
  const topbar = document.getElementById("topbar");
  const subsInput = document.createElement("input");
  const subsInputLabel = document.createElement("label");
  subsInputLabel.for = "subsInput";
  subsInputLabel.id = "subsInputLabel";
  subsInputLabel.innerHTML = "Add Subtitles";
  subsInput.id = "subsInput";
  subsInput.type = "file";
  subsInput.onchange = handleSubsInputChange;
  subsInputLabel.appendChild(subsInput);
  const castInfo = document.createElement("span");
  castInfo.id = "castInfo";
  castInfo.innerHTML = "Use the Cast button in the top right corner of Chrome";

  topbar.appendChild(subsInputLabel);
  topbar.appendChild(castInfo);
};

const createVideoPlayerWithFile = (file) => {
  const videoBlob = URL.createObjectURL(file);

  const newVideoSource = document.createElement("source");
  newVideoSource.src = videoBlob;
  newVideoSource.type = file.type || "video/mp4";

  const videoPlayer = document.createElement("video");
  videoPlayer.id = "videoPlayer";
  videoPlayer.className = "video-js";
  videoPlayer.preload = "auto";
  videoPlayer.controls = true;
  videoPlayer.style.width = "100%";
  videoPlayer.style.height = "100%";
  videoPlayer.ondragover = (event) => event.preventDefault();

  videoPlayer.appendChild(newVideoSource);
  document.getElementById("root").appendChild(videoPlayer);
  document.getElementById("dropzone").style.display = "none";
  document.getElementById("castplayer-description").style.display = "none";
  createTopbar();

  videojs("videoPlayer", { autoplay: true });
};

const addNewSubtitles = async (file) => {
  let subsBlob;
  if (file.name.endsWith(".srt")) {
    subsBlob = await toWebVTT(file);
  } else {
    subsBlob = URL.createObjectURL(file);
  }
  const subTrack = document.createElement("track");
  subTrack.src = subsBlob;
  subTrack.kind = "captions";
  subTrack.srclang = "en";
  subTrack.label = "Test";

  try {
    const player = videojs("videoPlayer");
    player.addRemoteTextTrack(
      {
        src: subsBlob,
        kind: "subtitles",
        label: file.name,
        default: true,
        mode: "showing",
      },
      false
    );

    document.getElementById("subsInputLabel").remove();
    const subsInfo = document.createElement("span");
    subsInfo.id = "subsInfo";
    subsInfo.innerHTML = `To display subtitles when casting DON'T press "Optimize" when you start casting.`;
    const topbar = document.getElementById("topbar");
    topbar.style.flexDirection = "row-reverse";
    topbar.appendChild(subsInfo);
  } catch (e) {
    alert("Please upload a video file first");
  }
};

const handleVideoInputChange = (event) => {
  const uploadedFile = event.target.files[0];
  createVideoPlayerWithFile(uploadedFile);
};

const handleSubsInputChange = (event) => {
  const uploadedFile = event.target.files[0];
  addNewSubtitles(uploadedFile);
};

const handleDrop = (event) => {
  event.preventDefault();
  const uploadedFile = event.dataTransfer.files[0];
  if (
    uploadedFile.type.startsWith("video") ||
    uploadedFile.name.endsWith(".mkv")
  ) {
    createVideoPlayerWithFile(uploadedFile);
    return;
  }

  if (uploadedFile.name.endsWith(".srt") || uploadedFile.type === "text/vtt") {
    addNewSubtitles(uploadedFile);
  }
};
