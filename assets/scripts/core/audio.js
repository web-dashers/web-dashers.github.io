class ys {
  constructor(scene) {
    this._scene = scene;
    this._music = null;
    this._userMusicVol = localStorage.getItem("userMusicVol") ?? 1;
    this._meteringEnabled = false;
    this._analyser = null;
    this._meterBuffer = null;
    this._meterValue = 0.1;
    this._lastAudio = 0.1;
    this._lastPeak = 0;
    this._silenceCounter = 0;
  }
  _effectiveVolume() {
    return this._userMusicVol * 0.8;
  }
  startMusic(StartPosOffset = 0) {
    let savedPosition = 0;
    let savedKey = null;
    if (this._music && this._music.isPlaying) {
      savedPosition = this._music.seek || 0;
      savedKey = this._music.key;
    }  
    if (this._music) {
      this._music.stop();
      this._music.destroy();
    }
    if (this._scene._practicedMode && this._scene._practicedMode.practiceMode) {
      const practiceSongKey = "StayInsideMe";
      if (this._scene.cache.audio.exists(practiceSongKey)) {
        this._music = this._scene.sound.add(practiceSongKey, {
          loop: true,
          volume: this._effectiveVolume()
        });
        this._music.play();
        if (savedKey === practiceSongKey && savedPosition > 0) {
          this._music.seek = savedPosition;
        }
        this._setupAnalyser();
        this._musicPlaying = true;
        return;
      }
    }
    if (window._onlineSongBuffer && window._onlineSongKey === window.currentlevel[0]) {
      const startOffset = window.settingsMap['kA13'] ? new Number(window.settingsMap['kA13']) : 0;
      this._playOnlineBuffer(window._onlineSongBuffer, startOffset + StartPosOffset);
      this._setupAnalyser();
      return;
    }
    const _songKey = window.currentlevel[0];
    if (!this._scene.cache.audio.exists(_songKey)) {
      this._setupAnalyser();
      return;
    }
    this._music = this._scene.sound.add(_songKey, {
      loop: true,
      volume: this._effectiveVolume()
    });
    this._music.play();
    const startOffset = window.settingsMap['kA13'] ? new Number(window.settingsMap['kA13']) : 0;
    this._music.seek = startOffset + StartPosOffset;
    this._setupAnalyser();
  }
  _playOnlineBuffer(audioBuffer, startOffset = 0) {
    const soundMgr = this._scene.game.sound;
    const ctx = soundMgr.context;
    if (!ctx) return;
    if (this._onlineSource) {
      try { this._onlineSource.stop(); } catch(e) {}
      try { this._onlineSource.disconnect(); } catch(e) {}
      this._onlineSource = null;
    }
    if (ctx.state === 'suspended') { ctx.resume(); }
    const gainNode = ctx.createGain();
    gainNode.gain.value = this._effectiveVolume();
    const dest = soundMgr.masterVolumeNode || soundMgr.destination || ctx.destination;
    gainNode.connect(dest);
    const safeOffset = Math.max(0, Math.min(startOffset, audioBuffer.duration - 0.01));
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true;
    source.connect(gainNode);
    source.start(0, safeOffset);
    this._onlineSource = source;
    this._onlineGain   = gainNode;
    let _isPlaying = true;
    let _isPaused  = false;
    let _pauseOffset = safeOffset;
    let _startedAt   = ctx.currentTime;
    const self = this;
    const _stopSource = (src) => {
      try { src.stop();       } catch(e) {}
      try { src.disconnect(); } catch(e) {}
    };
    const musicObj = {
      get isPlaying() { return _isPlaying; },
      get isPaused()  { return _isPaused;  },
      stop: () => {
        _isPlaying = false;
        _isPaused  = false;
        _stopSource(source);
        try { gainNode.disconnect(); } catch(e) {}
        self._onlineSource = null;
      },
      destroy: () => { musicObj.stop(); },
      pause: () => {
        if (!_isPlaying || _isPaused) return;
        _pauseOffset = (ctx.currentTime - _startedAt + _pauseOffset) % audioBuffer.duration;
        _stopSource(self._onlineSource);
        self._onlineSource = null;
        _isPlaying = false;
        _isPaused  = true;
      },
      resume: () => {
        if (!_isPaused) return;
        const newSrc = ctx.createBufferSource();
        newSrc.buffer = audioBuffer;
        newSrc.loop = true;
        newSrc.connect(gainNode);
        newSrc.start(0, _pauseOffset);
        self._onlineSource = newSrc;
        _startedAt  = ctx.currentTime;
        _isPlaying  = true;
        _isPaused   = false;
      },
      setLoop: () => {},
      get volume() { return gainNode.gain.value; },
      set volume(v) { gainNode.gain.value = v; }
    };

    this._music = musicObj;
  }
  startMenuMusic() {
    if (this._music) {
      this._music.stop();
      this._music.destroy();
    }
    this._music = this._scene.sound.add("menu_music", {
      loop: true,
      volume: this._effectiveVolume()
    });
    this._music.play();
    this._setupAnalyser();
  }
  stopMusic() {
    if (this._music) {
      this._music.stop();
    }
  }
  isplaying() {
    return this._music != null && this._music.isPlaying != false;
  }
  pauseMusic() {
    if (this._music && this._music.isPlaying) {
      this._music.pause();
    }
  }
  resumeMusic() {
    if (this._music && this._music.isPaused) {
      this._music.resume();
    }
  }
  getUserMusicVolume() {
    return this._userMusicVol;
  }
  setUserMusicVolume(_0x1fad3d) {
    this._userMusicVol = _0x1fad3d;
    localStorage.setItem("userMusicVol", _0x1fad3d);
    if (this._music) {
      this._music.volume = this._effectiveVolume();
    }
  }
  getMusicVolume() {
    return this._effectiveVolume();
  }
  setMusicVolume(_0x2ddbf6) {
    this.setUserMusicVolume(_0x2ddbf6 / 0.8);
  }
  fadeInMusic(_0x3eff28 = 1000) {
    if (this._music) {
      this._music.stop();
      this._music.destroy();
    }
    if (this._scene._practicedMode && this._scene._practicedMode.practiceMode) {
      const practiceSongKey = "StayInsideMe";
      if (this._scene.cache.audio.exists(practiceSongKey)) {
        this._music = this._scene.sound.add(practiceSongKey, {
          loop: true,
          volume: 0
        });
        this._music.play();
        this._setupAnalyser();
        this._musicPlaying = true;
        return;
      }
    }
    
    if (window._onlineSongBuffer && window._onlineSongKey === window.currentlevel[0]) {
      const startOffset = window._onlineSongOffset || 0;
      this._playOnlineBuffer(window._onlineSongBuffer, startOffset);
      if (this._onlineGain) {
        this._onlineGain.gain.value = this._effectiveVolume();
      }
      this._setupAnalyser();
      return;
    }
    this._music = this._scene.sound.add(window.currentlevel[0], {
      loop: true,
      volume: 0
    });
    this._music.play();
    this._setupAnalyser();
    this._scene.tweens.add({
      targets: this._music,
      volume: this._effectiveVolume(),
      duration: _0x3eff28
    });
  }
  fadeOutMusic(_0x43835d = 1500) {
    if (this._music && this._music.isPlaying) {
      this._music.setLoop(false);
      this._scene.tweens.add({
        targets: this._music,
        volume: 0,
        duration: _0x43835d,
        onComplete: () => {
          if (this._music) {
            this._music.stop();
          }
        }
      });
    }
  }
  playEffect(_0x344122, _0x20f8e7 = {}) {
    if (this._scene.sound.context && this._scene.cache.audio.exists(_0x344122)) {
      const _0x4b9f6e = this._scene.sound.add(_0x344122);
      _0x4b9f6e.play();
      if (_0x20f8e7.volume) {
        _0x4b9f6e.setVolume(_0x20f8e7.volume);
      }
    }
  }
  _setupAnalyser() {
    const _0xc0d316 = this._scene.sound.context;
    if (_0xc0d316) {
      this._analyser = _0xc0d316.createAnalyser();
      this._analyser.fftSize = 2048;
      this._meterBuffer = new Float32Array(this._analyser.fftSize);
      this._scene.sound.masterVolumeNode.connect(this._analyser);
      this._meteringEnabled = true;
    }
  }
  _ensureCorrectMusicMode() {
    if (!this._music) return;
    const isPracticeMode = this._scene._practicedMode && this._scene._practicedMode.practiceMode;
    const expectedSongKey = isPracticeMode ? "StayInsideMe" : window.currentlevel[0];
    if (this._music.key !== expectedSongKey && window._onlineSongKey !== expectedSongKey) {
      const offset = this._scene._getStartPosMusicOffset();
      this.startMusic(offset);
    }
  }
  update(_0x34aeef) {
    if (!this._meteringEnabled || !this._analyser) {
      return;
    }
    this._analyser.getFloatTimeDomainData(this._meterBuffer);
    let _0x3059f5 = 0;
    for (let _0x462ecd = 0; _0x462ecd < this._meterBuffer.length; _0x462ecd++) {
      let _0x129c51 = Math.abs(this._meterBuffer[_0x462ecd]);
      if (_0x129c51 > _0x3059f5) {
        _0x3059f5 = _0x129c51;
      }
    }
    const _0x35ec51 = this._effectiveVolume();
    if (_0x35ec51 > 0) {
      _0x3059f5 /= _0x35ec51;
    }
    this._meterValue = 0.1 + _0x3059f5;
    const _0x1fbcd4 = _0x34aeef * 60;
    if (this._silenceCounter < 3 || this._meterValue < this._lastAudio * 1.1 || this._meterValue < this._lastPeak * 0.95 && this._lastAudio > this._lastPeak * 0.2) {
      this._meterValue = this._lastAudio * Math.pow(0.92, _0x1fbcd4);
    } else {
      this._silenceCounter = 0;
      this._lastPeak = this._meterValue;
      this._meterValue *= Math.pow(1.46, _0x1fbcd4);
    }
    if (this._meterValue <= 0.1) {
      this._lastPeak = 0;
    }
    this._lastAudio = this._meterValue;
    this._silenceCounter++;
  }
  getMeteringValue() {
    return this._meterValue;
  }
  reset() {
    this._meterValue = 0.1;
    this._lastAudio = 0.1;
    this._lastPeak = 0;
    this._silenceCounter = 0;
    this.stopMusic();
  }
}
