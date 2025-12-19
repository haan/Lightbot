// Centralized audio/video helpers (menu/game music + help videos).
export function createMedia() {
  var media = {
    audioEl: null,
    videoEl: null,
    _currentAudio: null,
    audio: {
      menu: "media/audio/menu.mp3",
      game: "media/audio/game.mp3"
    },
    video: [
      {webm: "media/video/goal.webm", mp4: "media/video/goal.mp4"},
      {webm: "media/video/howto.webm", mp4: "media/video/howto.mp4"},
      {webm: "media/video/objects.webm", mp4: "media/video/objects.mp4"},
      {webm: "media/video/walk.webm", mp4: "media/video/walk.mp4"},
      {webm: "media/video/turnRight.webm", mp4: "media/video/turnRight.mp4"},
      {webm: "media/video/turnLeft.webm", mp4: "media/video/turnLeft.mp4"},
      {webm: "media/video/jump.webm", mp4: "media/video/jump.mp4"},
      {webm: "media/video/light.webm", mp4: "media/video/light.mp4"},
      {webm: "media/video/repeat.webm", mp4: "media/video/repeat.mp4"},
      {webm: "media/video/medal.webm", mp4: "media/video/medal.mp4"}
    ],
    audioEnabled: false,
    init: function () {
      this.audioEl = document.getElementById("audioPlayer");
      this.videoEl = document.getElementById("videoPlayer");

      var self = this;
      if (this.audioEl) {
        this.audioEl.loop = true;
        this.audioEl.muted = true;
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

      // reset sources so the browser reloads the selected clip.
      while (this.videoEl.firstChild) this.videoEl.removeChild(this.videoEl.firstChild);

      var sources = [
        { src: item.webm, type: "video/webm" },
        { src: item.mp4, type: "video/mp4" }
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
    syncAudioButtonState: function () {
      var isEnabled = !!this.audioEnabled;
      var buttons = document.querySelectorAll('.audioToggleButton');
      for (var i = 0; i < buttons.length; i++) {
        var btn = buttons[i];
        if (!btn) continue;
        btn.setAttribute('aria-pressed', isEnabled ? 'true' : 'false');

        var onIcon = btn.querySelector('.lb-audio-on');
        var offIcon = btn.querySelector('.lb-audio-off');

        if (onIcon && onIcon.classList) onIcon.classList.toggle('hidden', !isEnabled);
        if (offIcon && offIcon.classList) offIcon.classList.toggle('hidden', isEnabled);
      }
    },
    toggleAudioOn: function() {
      this.audioEnabled = true;
      if (this.audioEl) this.audioEl.muted = false;
      this._tryPlayAudio();
      this.syncAudioButtonState();
      var self = this;
      setTimeout(function () { self.syncAudioButtonState(); }, 0);
    },
    toggleAudioOff: function() {
      this.audioEnabled = false;
      if (this.audioEl) {
        this.audioEl.pause();
        this.audioEl.muted = true;
      }
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

  return media;
}
