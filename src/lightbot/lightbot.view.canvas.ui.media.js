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

  if ($.jPlayer && $.jPlayer.event) {
    $('#audioPlayer')
      .on($.jPlayer.event.play + '.lightbot', function () { lightBot.ui.media.syncAudioButtonState(); })
      .on($.jPlayer.event.playing + '.lightbot', function () { lightBot.ui.media.syncAudioButtonState(); })
      .on($.jPlayer.event.pause + '.lightbot', function () { lightBot.ui.media.syncAudioButtonState(); })
      .on($.jPlayer.event.ended + '.lightbot', function () { lightBot.ui.media.syncAudioButtonState(); });
  }

  lightBot.ui.media.syncAudioButtonState();
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
      {webmv: "media/video/goal.webm", m4v: "media/video/goal.mp4", ogv: "media/video/goal.ogv"},
      {webmv: "media/video/howto.webm", m4v: "media/video/howto.mp4", ogv: "media/video/howto.ogv"},
      {webmv: "media/video/objects.webm", m4v: "media/video/objects.mp4", ogv: "media/video/objects.ogv"},
      {webmv: "media/video/walk.webm", m4v: "media/video/walk.mp4", ogv: "media/video/walk.ogv"},
      {webmv: "media/video/turnRight.webm", m4v: "media/video/turnRight.mp4", ogv: "media/video/turnRight.ogv"},
      {webmv: "media/video/turnLeft.webm", m4v: "media/video/turnLeft.mp4", ogv: "media/video/turnLeft.ogv"},
      {webmv: "media/video/jump.webm", m4v: "media/video/jump.mp4", ogv: "media/video/jump.ogv"},
      {webmv: "media/video/light.webm", m4v: "media/video/light.mp4", ogv: "media/video/light.ogv"},
      {webmv: "media/video/repeat.webm", m4v: "media/video/repeat.mp4", ogv: "media/video/repeat.ogv"},
      {webmv: "media/video/medal.webm", m4v: "media/video/medal.mp4", ogv: "media/video/medal.ogv"}
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
    _isActuallyPlaying: function () {
      if (!this.audioEnabled) return false;
      if (!this.audioPlayer) return false;
      var instance = this.audioPlayer.data('jPlayer');
      if (!instance || !instance.status) return false;
      return !instance.status.paused;
    },
    syncAudioButtonState: function () {
      var isPlaying = this._isActuallyPlaying();
      var buttons = document.querySelectorAll('.audioToggleButton');
      for (var i = 0; i < buttons.length; i++) {
        var btn = buttons[i];
        if (!btn) continue;
        btn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');

        var onIcon = btn.querySelector('.lb-audio-on');
        var offIcon = btn.querySelector('.lb-audio-off');

        if (onIcon && onIcon.classList) onIcon.classList.toggle('hidden', !isPlaying);
        if (offIcon && offIcon.classList) offIcon.classList.toggle('hidden', isPlaying);
      }
    },
    toggleAudioOn: function() {
      this.audioEnabled = true;
      this.audioPlayer.jPlayer('play');
      this.syncAudioButtonState();
      var self = this;
      setTimeout(function () { self.syncAudioButtonState(); }, 0);
    },
    toggleAudioOff: function() {
      this.audioEnabled = false;
      this.audioPlayer.jPlayer('pause');
      this.syncAudioButtonState();
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
