
var creative = {};

// custom JS page fix

function tryToFixAlignment() {
  // Manzoni survey url
    var alnFix = 'function tryToFixAlignment() {studioV2.api.creatives[0].getFirstAssetByType(studioV2.api.creatives[0].AssetTypes.EXPANDING).getContainerElement().style.margin = "auto";};tryToFixAlignment()';
  Enabler.invokeExternalJsFunction(alnFix);
}


/**
 * Window onload handler.
 */
function preInit() {
  setupDom();

  if (Enabler.isInitialized()) {
    init();
  } else {
    Enabler.addEventListener(
      studio.events.StudioEvent.INIT,
      init
    );
  }
}

/**
 * Initializes the ad components
 */
function setupDom() {
  creative.dom = {};
  creative.dom.mainContainer = document.getElementById('main-container');
  creative.dom.expandedExit = document.getElementById('expanded-exit');
  creative.dom.expandedContent = document.getElementById('expanded-state');
  creative.dom.collapsedContent = document.getElementById('collapsed-state');
  creative.dom.expandButton = document.getElementById('expand-button');
  creative.dom.image0 = document.getElementById('main-img-0');
  creative.dom.video1 = {};
  creative.dom.video1.vidContainer = document.getElementById('video-container-1');
  creative.dom.video1.vid          = document.getElementById('video-1');
  creative.dom.video1.vidPlayBtn   = document.getElementById('play-btn-1');
  creative.dom.video1.vidPauseBtn  = document.getElementById('pause-btn-1');
  creative.dom.video1.vidStopBtn   = document.getElementById('stop-btn-1');
  creative.dom.video1.vidReplayBtn = document.getElementById('replay-btn-1');
  // creative.dom.video1.vidUnmuteBtn = document.getElementById('unmute-btn-1');
  // creative.dom.video1.vidMuteBtn   = document.getElementById('mute-btn-1');
  creative.dom.video1.vidProgressBar   = document.getElementById('progress-bar-1');
  creative.dom.collapseButton = document.getElementById('collapse-button');
}

/**
 * Ad initialisation.
 */
function init() {
  tryToFixAlignment();
  Enabler.setExpandingPixelOffsets(0, 0, 728, 600);
  Enabler.setStartExpanded(false);
  // You can update the autoplay flag to 'true' to enable muted
  // autoplay although it won't work on iOS.
  creative.autoplay1 = true;
  creative.isClick1 = false;

  // Hide mute / unmute on iOS.
  if ((navigator.userAgent.match(/iPhone/i)) ||
    (navigator.userAgent.match(/iPad/i)) ||
    (navigator.userAgent.match(/iPod/i))) {
    // creative.dom.video1.vidUnmuteBtn.style.opacity = 0;
    // creative.dom.video1.vidMuteBtn.style.opacity = 0;
  }

  addVideoTracking1();

  addListeners();

  // Polite loading
  if (Enabler.isVisible()) {
    Enabler.requestExpand();
  }
  else {
    Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, Enabler.requestExpand);
  }
}

/**
 * Adds appropriate listeners at initialization time
 */
function addListeners() {
  Enabler.addEventListener(studio.events.StudioEvent.EXPAND_START, expandStartHandler);
  Enabler.addEventListener(studio.events.StudioEvent.EXPAND_FINISH, expandFinishHandler);
  Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_START, collapseStartHandler);
  Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_FINISH, collapseFinishHandler);
  creative.dom.expandedContent.addEventListener('mouseover', audioOn, false);
  creative.dom.expandedContent.addEventListener('mouseleave', audioOff, false);
  creative.dom.expandedExit.addEventListener('click', exitClickHandler);
  creative.dom.video1.vid.addEventListener('click', exitClickHandler);
  creative.dom.video1.vidPlayBtn.addEventListener('click', pausePlayHandler1, false);
  creative.dom.video1.vidPauseBtn.addEventListener('click', pausePlayHandler1, false);
  // creative.dom.video1.vidMuteBtn.addEventListener('click', muteUnmuteHandler1, false);
  // creative.dom.video1.vidUnmuteBtn.addEventListener('click', muteUnmuteHandler1, false);
  creative.dom.video1.vidReplayBtn.addEventListener('click', replayHandler1, false);
  creative.dom.video1.vidStopBtn.addEventListener('click', stopHandler1, false);
  creative.dom.video1.vid.addEventListener('ended', videoEndHandler1, false);
  creative.dom.video1.vid.addEventListener('timeupdate', videoTimeUpdateHandler1, false);
  creative.dom.collapseButton.addEventListener('click', onCollapseClickHandler, false);
  creative.dom.expandButton.addEventListener('click', onExpandHandler, false);
}


function audioOn(){
  creative.dom.video1.vid.muted = false;


}

function audioOff(){
  creative.dom.video1.vid.muted = true;


}
/**
 *  Shows the ad.
 */
// function show() {
//   creative.dom.expandedContent.style.display = 'none';
//   creative.dom.expandedExit.style.display = 'none';

//   creative.dom.collapsedContent.style.display = 'block';
//   creative.dom.expandButton.style.display = 'block';
//   creative.dom.image0.style.visibility  = 'visible';
// }

// ---------------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------------


function expandStartHandler() {
  // Show expanded content.
  creative.dom.expandedContent.style.display = 'block';
  creative.dom.expandedExit.style.display = 'block';
  creative.dom.collapsedContent.style.display = 'none';
  creative.dom.expandButton.style.display = 'none';
  creative.dom.video1.vid.volume = 1.0;

  Enabler.finishExpand();
}

function expandFinishHandler() {
  // creative.dom.video1.vidMuteBtn.style.visibility    = 'hidden';
  // creative.dom.video1.vidUnmuteBtn.style.visibility  = 'visible';
  creative.dom.video1.vidPauseBtn.style.visibility   = 'hidden';
  creative.dom.video1.vidPlayBtn.style.visibility    = 'visible';
  if (creative.autoplay1) {
    if (creative.dom.video1.vid.readyState >= 2) {
      startMuted1(null);
    }
    else {
      creative.dom.video1.hasCanPlay = true;
      creative.dom.video1.vid.addEventListener('canplay', startMuted1, false);
    }
    // HACK: Safari experiences video rendering issues, fixed by forcing a viewport refresh
    // creative.dom.video1.vidMuteBtn.style.visibility = 'visible';
    //   setTimeout(function() {
    //     creative.dom.video1.vidMuteBtn.style.visibility = 'hidden';
    //   }, 200);
  }
  else {
    // creative.dom.video1.vidMuteBtn.style.visibility    = 'visible';
    // creative.dom.video1.vidUnmuteBtn.style.visibility  = 'hidden';
    creative.dom.video1.vidPauseBtn.style.visibility   = 'hidden';
    creative.dom.video1.vidPlayBtn.style.visibility    = 'visible';
  }
  creative.dom.video1.vidContainer.style.visibility  = 'visible';
  creative.isExpanded = true;
}

function collapseStartHandler() {
  // Perform collapse animation.
  creative.dom.expandedContent.style.display = 'none';
  creative.dom.expandedExit.style.display = 'none';
  creative.dom.collapsedContent.style.display = 'block';
  creative.dom.expandButton.style.display = 'block';
  // creative.dom.video1.vidMuteBtn.style.visibility    = 'hidden';
  // creative.dom.video1.vidUnmuteBtn.style.visibility  = 'visible';
  creative.dom.video1.vidPauseBtn.style.visibility   = 'hidden';
  creative.dom.video1.vidPlayBtn.style.visibility    = 'visible';
  creative.dom.video1.vid.pause();

  // When animation finished must call
  Enabler.finishCollapse();
}

function collapseFinishHandler() {
  creative.isExpanded = false;
}

function onCollapseClickHandler(){
  Enabler.requestCollapse();
  Enabler.stopTimer('Panel Expansion');
}

function onExpandHandler(){
  Enabler.requestExpand();
  Enabler.startTimer('Panel Expansion');
}

function exitClickHandler() {
  // Reset video
  creative.dom.video1.vid.pause();
  if (creative.dom.video1.vid.readyState > 0) {
    creative.dom.video1.vid.currentTime = 0;
  }
  Enabler.requestCollapse();
  Enabler.stopTimer('Panel Expansion');
  Enabler.exit('BackgroundExit');
}

/**
 * Triggered once the video player is ready to play the video on expansion.
 */
function startMuted1(e) {
  // Leaving the listener can cause issues on Chrome / Firefox
  if (creative.dom.video1.hasCanPlay) {
    creative.dom.video1.vid.removeEventListener('canplay', startMuted1);
    creative.dom.video1.hasCanPlay = false;
  }
  // If paused then play
  //creative.dom.video1.vid.volume       = 0; // Muted by default
  audioOff();
  creative.dom.video1.vid.currentTime  = 0;
  creative.dom.video1.vid.play();
  creative.dom.video1.vidPauseBtn.style.visibility = 'visible';
  creative.dom.video1.vidPlayBtn.style.visibility  = 'hidden';
}

/**
 * Play pause toggle.
 */
function pausePlayHandler1(e) {
  // Under IE10, a video is not 'paused' after it ends.
  if (creative.dom.video1.vid.paused || creative.dom.video1.vid.ended) {
    if (creative.isClick1) {
      //creative.dom.video1.vid.volume = 1.0;
      // creative.dom.video1.vidMuteBtn.style.visibility    = 'visible';
      // creative.dom.video1.vidUnmuteBtn.style.visibility  = 'hidden';
      creative.isClick1 = false;
    }
    // If paused then play
    creative.dom.video1.vid.play();
    creative.dom.video1.vidPauseBtn.style.visibility = 'visible';
    creative.dom.video1.vidPlayBtn.style.visibility  = 'hidden';
  }
  else {
    creative.dom.video1.vid.pause();
    creative.dom.video1.vidPauseBtn.style.visibility = 'hidden';
    creative.dom.video1.vidPlayBtn.style.visibility  = 'visible';
  }
}

/**
 * Mutes or unmute the video player.
 */
function muteUnmuteHandler1(e) {
  if (creative.dom.video1.vid.volume == 0.0) {
    Enabler.counter("Unmute video 1", true);
    //creative.dom.video1.vid.volume = 1.0;
    // creative.dom.video1.vidMuteBtn.style.visibility   = 'visible';
    // creative.dom.video1.vidUnmuteBtn.style.visibility = 'hidden';
  } else {
    Enabler.counter("Mute video 1", true);
    //creative.dom.video1.vid.volume = 0.0;
    // creative.dom.video1.vidMuteBtn.style.visibility   = 'hidden';
    // creative.dom.video1.vidUnmuteBtn.style.visibility = 'visible';
  }
}

/**
 * Stops the video.
 */
function stopHandler1(e) {
  Enabler.counter("Video 1 stopped", true);
  creative.dom.video1.vid.currentTime = 0;
  creative.dom.video1.vid.pause();
  creative.dom.video1.vidPauseBtn.style.visibility = 'hidden';
  creative.dom.video1.vidPlayBtn.style.visibility  = 'visible';
  creative.isClick1 = true;
}

/**
 * Relaunches the video from the beginning.
 */
function replayHandler1(e) {
  Enabler.counter("Replay video 1", true);
  creative.dom.video1.vid.currentTime = 0;
  creative.dom.video1.vid.play();
  //creative.dom.video1.vid.volume = 1.0;
  creative.dom.video1.vidPauseBtn.style.visibility = 'visible';
  // creative.dom.video1.vidMuteBtn.style.visibility  = 'visible';
}

/**
 * Handler triggered when the video has finished playing.
 */
function videoEndHandler1(e) {
  creative.dom.video1.vid.currentTime = 0;
  creative.dom.video1.vid.pause();
  creative.dom.video1.vidPauseBtn.style.visibility = 'hidden';
  creative.dom.video1.vidPlayBtn.style.visibility  = 'visible';
  creative.isClick1 = true;
  Enabler.requestCollapse();
}

/**
 * Handler triggered when the video has timeUpdates.
 */
function videoTimeUpdateHandler1(e) {
 var perc = creative.dom.video1.vid.currentTime / creative.dom.video1.vid.duration;
 creative.dom.video1.vidProgressBar.style.width = Math.round(100*perc) + '%';
}

/**
 * Add video metrics to the HTML5 video elements by loading in video module, and assigning to videos.
 */
function addVideoTracking1() {
  // Add in the video files.
  // These are 3 different codecs due to different browser specifications ; we recommend you have all 3 filetypes.
  var srcNode = document.createElement('source');
  srcNode.setAttribute('type', 'video/webm');
  srcNode.setAttribute('src', Enabler.getUrl('video.webm'));
  creative.dom.video1.vid.appendChild(srcNode);

  srcNode = document.createElement('source');
  srcNode.setAttribute('type', 'video/mp4');
  srcNode.setAttribute('src', Enabler.getUrl('video.mp4'));
  creative.dom.video1.vid.appendChild(srcNode);

  creative.dom.video1.vid.appendChild(srcNode);

  Enabler.loadModule(studio.module.ModuleId.VIDEO, function() {
    studio.video.Reporter.attach('Video Report 1', creative.dom.video1.vid);
  }.bind(this));
}

/**
 *  Main onload handler
 */
window.addEventListener('load', preInit);