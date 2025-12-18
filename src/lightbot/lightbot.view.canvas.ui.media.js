/*jsl:option explicit*/
/*jsl:import lightbot.model.game.js*/

(function() {

  var media = {
    audioEl: null,
    videoEl: null,
    _currentAudio: null,
    audio: {
      menu: "media/audio/menu.mp3",
      game: "media/audio/game.mp3"
    },
    video: [
      {webm: "media/video/goal.webm", mp4: "media/video/goal.mp4", ogv: "media/video/goal.ogv"},
      {webm: "media/video/howto.webm", mp4: "media/video/howto.mp4", ogv: "media/video/howto.ogv"},
      {webm: "media/video/objects.webm", mp4: "media/video/objects.mp4", ogv: "media/video/objects.ogv"},
      {webm: "media/video/walk.webm", mp4: "media/video/walk.mp4", ogv: "media/video/walk.ogv"},
      {webm: "media/video/turnRight.webm", mp4: "media/video/turnRight.mp4", ogv: "media/video/turnRight.ogv"},
      {webm: "media/video/turnLeft.webm", mp4: "media/video/turnLeft.mp4", ogv: "media/video/turnLeft.ogv"},
      {webm: "media/video/jump.webm", mp4: "media/video/jump.mp4", ogv: "media/video/jump.ogv"},
      {webm: "media/video/light.webm", mp4: "media/video/light.mp4", ogv: "media/video/light.ogv"},
      {webm: "media/video/repeat.webm", mp4: "media/video/repeat.mp4", ogv: "media/video/repeat.ogv"},
      {webm: "media/video/medal.webm", mp4: "media/video/medal.mp4", ogv: "media/video/medal.ogv"}
    ],
    audioEnabled: true,
    init: function () {
      this.audioEl = document.getElementById("audioPlayer");
      this.videoEl = document.getElementById("videoPlayer");

      var self = this;
      if (this.audioEl) {
        this.audioEl.loop = true;
        ["play", "playing", "pause", "ended"].forEach(function (evt) {
          self.audioEl.addEventListener(evt, function () { self.syncAudioButtonState(); });
        });
      }

      this.syncAudioButtonState();
    },
    _tryPlayAudio: function () {
      if (!this.audioEl) return;
      if (!this.audioEnabled) return;

      var p = this.audioEl.play();
      if (p && typeof p.catch === "function") p.catch(function () { });
    },
    _setAudio: function (key) {
      if (!this.audioEl) return;
      if (this._currentAudio === key) return;

      this._currentAudio = key;
      this.audioEl.src = this.audio[key];
      this.audioEl.load();
    },
    playMenuAudio: function() {
      this._setAudio("menu");
      this._tryPlayAudio();
    },
    playGameAudio: function () {
      this._setAudio("game");
      this._tryPlayAudio();
    },
    playVideo: function(x) {
      if (!this.videoEl) return;
      var item = this.video[x];
      if (!item) return;

      while (this.videoEl.firstChild) this.videoEl.removeChild(this.videoEl.firstChild);

      var sources = [
        { src: item.webm, type: "video/webm" },
        { src: item.mp4, type: "video/mp4" },
        { src: item.ogv, type: "video/ogg" }
      ];

      for (var i = 0; i < sources.length; i++) {
        if (!sources[i].src) continue;
        var s = document.createElement("source");
        s.src = sources[i].src;
        s.type = sources[i].type;
        this.videoEl.appendChild(s);
      }

      this.videoEl.load();
    },
    _isActuallyPlaying: function () {
      if (!this.audioEnabled) return false;
      if (!this.audioEl) return false;
      return !this.audioEl.paused;
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
      this._tryPlayAudio();
      this.syncAudioButtonState();
      var self = this;
      setTimeout(function () { self.syncAudioButtonState(); }, 0);
    },
    toggleAudioOff: function() {
      this.audioEnabled = false;
      if (this.audioEl) this.audioEl.pause();
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

  document.addEventListener("DOMContentLoaded", function () {
    lightBot.ui.media.init();
  });
})();
