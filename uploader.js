const URL = window.URL || window.webkitURL;

const createTopbar = () => {
  const topbar = document.getElementById("topbar");
  const subsInput = document.createElement("input");
  subsInput.type = "file";
  subsInput.onchange = handleSubsInputChange;
  topbar.appendChild(subsInput);
};

const createVideoPlayerWithFile = (file) => {
  const videoBlob = URL.createObjectURL(file);

  const newVideoSource = document.createElement("source");
  newVideoSource.src = videoBlob;
  newVideoSource.type = file.type;

  const videoPlayer = document.createElement("video");
  videoPlayer.id = "videoPlayer";
  videoPlayer.className = "video-js";
  videoPlayer.preload = "auto";
  videoPlayer.controls = true;
  videoPlayer.style.width = "100%";

  videoPlayer.appendChild(newVideoSource);
  document.getElementById("root").appendChild(videoPlayer);
  document.getElementById("dropzone").style.display = "none";
  document.getElementById("castplayer-description-h2").style.display = "none";
  createTopbar();

  videojs("videoPlayer");
};

const addNewSubtitles = (file) => {
  const subsBlob = URL.createObjectURL(file);
  const subTrack = document.createElement("track");
  subTrack.src = subsBlob;
  subTrack.kind = "captions";
  subTrack.srclang = "en";
  subTrack.label = "Test";

  // const videoPlayer = document.getElementById("videoPlayer");
  // videoPlayer.appendChild(subTrack);
  const player = videojs("videoPlayer");
  player.addRemoteTextTrack({ src: subsBlob }, false);
};

const handleInputChange = (event) => {
  const uploadedFile = event.target.files[0];
  createVideoPlayerWithFile(uploadedFile);
};

const handleSubsInputChange = (event) => {
  const uploadedFile = event.target.files[0];
  console.log("Subs uploaded", uploadedFile);
  addNewSubtitles(uploadedFile);
};
