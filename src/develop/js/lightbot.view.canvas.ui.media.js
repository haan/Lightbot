/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

$(document).ready(function() {
  // audio player
  $("#audioPlayer").jPlayer({
    ready: function () {
     $(this).jPlayer("setMedia", lightBot.ui.media.audio.menu).jPlayer("play"); // attempt to auto-play
    },
    swfPath: "js",
    supplied: "mp3",
    loop: true,
    solution: "flash, html",
    cssSelectorAncestor: '#audioContainer'
  });

  // load video container
  $("#videoPlayer").jPlayer({
    ready: function () {
      $(this).jPlayer("setMedia", lightBot.ui.media.video[0]); // attempt to auto-play
    },
    swfPath: "js",
    supplied: "webmv, ogv, m4v",
    preload: 'metadata',
    cssSelectorAncestor: '#videoContainer',
    backgroundColor: '#000000',
    size: {
      width: "400px",
      height: "300px",
      cssClass: "jp-video-300p"
    }
  });

  lightBot.ui.media.audioPlayer = $('#audioPlayer');
  lightBot.ui.media.videoPlayer = $('#videoPlayer');
});

(function() {

  var media = {
    audioPlayer: null,
    videoPlayer: null,
    audio: {
      menu: {
        mp3: "media/audio/menu.mp3"
      },
      game: {
        mp3: "media/audio/game.mp3"
      }
    },
    video: [
      {webmv: "media/video/demo.webm", m4v: "media/video/demo.mp4", ogv: "media/video/demo.ogv"},
      {webmv: "media/video/howto.webm", m4v: "media/video/howto.mp4", ogv: "media/video/howto.ogv"},
      {webmv: "media/video/demo.webm", m4v: "media/video/demo.mp4", ogv: "media/video/demo.ogv"},
      {webmv: "media/video/demo.webm", m4v: "media/video/demo.mp4", ogv: "media/video/demo.ogv"},
      {webmv: "media/video/demo.webm", m4v: "media/video/demo.mp4", ogv: "media/video/demo.ogv"},
      {webmv: "media/video/demo.webm", m4v: "media/video/demo.mp4", ogv: "media/video/demo.ogv"},
      {webmv: "media/video/demo.webm", m4v: "media/video/demo.mp4", ogv: "media/video/demo.ogv"},
      {webmv: "media/video/demo.webm", m4v: "media/video/demo.mp4", ogv: "media/video/demo.ogv"},
      {webmv: "media/video/demo.webm", m4v: "media/video/demo.mp4", ogv: "media/video/demo.ogv"}
    ],
    audioEnabled: true,
    playMenuAudio: function() {
      if (this.audioPlayer.data('jPlayer').status.media.mp3 != this.audio.menu.mp3) {
        this.audioPlayer.jPlayer('setMedia', this.audio.menu);
        if (this.audioEnabled) {
          this.audioPlayer.jPlayer('play');
        }
      }
    },
    playGameAudio: function () {
      if (this.audioPlayer.data('jPlayer').status.media.mp3 != this.audio.game.mp3) {
        this.audioPlayer.jPlayer('setMedia', this.audio.game);
        if (this.audioEnabled) {
          this.audioPlayer.jPlayer('play');
        }
      }
    },
    playVideo: function(x) {
      this.videoPlayer.jPlayer("setMedia", this.video[x]);
    },
    toggleAudioOn: function() {
      this.audioEnabled = true;
      this.audioPlayer.jPlayer('play');

      $('.audioToggleButton').children('span.ui-button-icon-primary').addClass('ui-icon-volume-on').removeClass('ui-icon-volume-off');
    },
    toggleAudioOff: function() {
      this.audioEnabled = false;
      this.audioPlayer.jPlayer('pause');

      $('.audioToggleButton').children('span.ui-button-icon-primary').addClass('ui-icon-volume-off').removeClass('ui-icon-volume-on');
    },
    toggleAudio: function() {
      if (this.audioEnabled) {
        this.toggleAudioOff();
      } else {
        this.toggleAudioOn();
      }
    }
  };

  lightBot.ui.media = media;
})();