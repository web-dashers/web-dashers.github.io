class AudioManager {
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
    this._pendingMusicLoadKey = null;
    this._pendingMusicLoadOffset = 0;
    this._pendingMusicFadeDuration = null;
    this._missingMusicWarned = new Set();
    this._pendingOnlineSongLoadKey = null;
    this._pendingOnlineSongLoadOffset = 0;
    this._pendingOnlineSongFadeDuration = null;
  }
  _effectiveVolume() {
    return this._userMusicVol * 0.8;
  }
  get musicPlaying() {
    return !!this._pendingMusicLoadKey || !!this._pendingOnlineSongLoadKey || this.isplaying();
  }
  _getLevelSongStartOffset() {
    const rawOffset = window.settingsMap?.["kA13"] ?? 0;
    const parsedOffset = Number(rawOffset);
    return Number.isFinite(parsedOffset) ? parsedOffset : 0;
  }
  _shouldUsePracticeSong() {
    return !!(this._scene?._practicedMode?.practiceMode && !window.practiceMusicBypass);
  }
  _getOfficialSongAudioPath(songKey = window.currentlevel?.[0]) {
    if (!songKey || !Array.isArray(window.allLevels)) return null;

    const currentLevel = Array.isArray(window.currentlevel) ? window.currentlevel : null;
    if (currentLevel && currentLevel[0] === songKey && currentLevel[4]) {
      return "assets/music/" + currentLevel[4] + ".mp3";
    }

    const levelEntry = window.allLevels.find(level => level && level[0] === songKey);
    if (!levelEntry) return null;

    const fileName = levelEntry[4] || String(levelEntry[1] || songKey).replaceAll(" ", "");
    return "assets/music/" + fileName + ".mp3";
  }
  _loadMissingOfficialSong(songKey, startPosOffset = 0, fadeDuration = null) {
    const audioPath = this._getOfficialSongAudioPath(songKey);
    const loader = this._scene?.load;

    if (!audioPath || !loader || !this._scene?.cache?.audio) {
      if (songKey && !this._missingMusicWarned.has(songKey)) {
        console.warn("Missing audio cache and no official song path found for", songKey);
        this._missingMusicWarned.add(songKey);
      }
      return false;
    }

    if (this._pendingMusicLoadKey === songKey) {
      this._pendingMusicLoadOffset = startPosOffset;
      this._pendingMusicFadeDuration = fadeDuration;
      return true;
    }

    this._pendingMusicLoadKey = songKey;
    this._pendingMusicLoadOffset = startPosOffset;
    this._pendingMusicFadeDuration = fadeDuration;

    const playAfterLoad = () => {
      const shouldPlay = this._pendingMusicLoadKey === songKey && window.currentlevel?.[0] === songKey;
      const nextOffset = this._pendingMusicLoadOffset;
      const nextFadeDuration = this._pendingMusicFadeDuration;

      this._pendingMusicLoadKey = null;
      this._pendingMusicLoadOffset = 0;
      this._pendingMusicFadeDuration = null;

      if (!shouldPlay || !this._scene.cache.audio.exists(songKey)) return;

      if (nextFadeDuration !== null && nextFadeDuration !== undefined) {
        this.fadeInMusic(nextFadeDuration);
      } else {
        this.startMusic(nextOffset);
      }
    };

    const clearFailedLoad = (file) => {
      if (file && file.key !== songKey) return;
      if (this._pendingMusicLoadKey === songKey) {
        this._pendingMusicLoadKey = null;
        this._pendingMusicLoadOffset = 0;
        this._pendingMusicFadeDuration = null;
      }
      console.warn("Failed to load official song audio", songKey, audioPath);
    };

    try {
      loader.audio(songKey, audioPath);
      loader.once("complete", playAfterLoad);
      loader.once("loaderror", clearFailedLoad);
      if (!loader.isLoading()) {
        loader.start();
      }
      return true;
    } catch (err) {
      clearFailedLoad({ key: songKey });
      console.warn("Failed to queue official song audio", songKey, audioPath, err);
      return false;
    }
  }
  _loadMissingOnlineSong(songKey, startPosOffset = 0, fadeDuration = null) {
    const match = String(songKey || "").match(/^ng_song_(\d+)$/);
    const songId = match ? match[1] : null;
    const soundMgr = this._scene?.game?.sound;
    const ctx = soundMgr?.context;
    const songInfoUrl = (typeof window.getGdApiUrl === "function" ? window.getGdApiUrl("/getGJSongInfo.php") : null);

    if (!songId || !ctx || !songInfoUrl) {
      return false;
    }

    if (this._pendingOnlineSongLoadKey === songKey) {
      this._pendingOnlineSongLoadOffset = startPosOffset;
      this._pendingOnlineSongFadeDuration = fadeDuration;
      return true;
    }

    this._pendingOnlineSongLoadKey = songKey;
    this._pendingOnlineSongLoadOffset = startPosOffset;
    this._pendingOnlineSongFadeDuration = fadeDuration;

    (async () => {
      try {
        if (ctx.state === "suspended") await ctx.resume();

        const ngRes = await window.fetchGdApi("/getGJSongInfo.php", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `songID=${encodeURIComponent(songId)}&secret=Wmfd2893gb7`
        });

        const ngText = ngRes.ok ? await ngRes.text() : "-1";
        if (!ngText || ngText === "-1") throw new Error("Song info unavailable");

        const ngParts = ngText.split("~|~");
        const ngMap = {};
        for (let i = 0; i + 1 < ngParts.length; i += 2) ngMap[ngParts[i]] = ngParts[i + 1];

        const songUrl = decodeURIComponent((ngMap["10"] || "").trim());
        if (!songUrl) throw new Error("Song URL unavailable");

        const songTitle = (ngMap["2"] || `Song #${songId}`).replace(/:$/, "").trim();
        const songArtist = (ngMap["4"] || "Unknown").replace(/:$/, "").trim();
        const proxiedUrl = (typeof window.getGdAudioUrl === "function" ? window.getGdAudioUrl(songUrl) : songUrl);
        const audioRes = await window.fetchGdAudio(songUrl);
        if (!audioRes.ok) throw new Error(`Audio proxy failed: ${audioRes.status}`);

        const arrayBuf = await audioRes.arrayBuffer();
        const decoded = await ctx.decodeAudioData(arrayBuf);

        if (this._pendingOnlineSongLoadKey !== songKey) return;

        const nextOffset = this._pendingOnlineSongLoadOffset;
        const nextFadeDuration = this._pendingOnlineSongFadeDuration;

        this._pendingOnlineSongLoadKey = null;
        this._pendingOnlineSongLoadOffset = 0;
        this._pendingOnlineSongFadeDuration = null;

        window._onlineSongBuffer = decoded;
        window._onlineSongKey = songKey;
        window._onlineSongTitle = songTitle;
        window._onlineSongArtist = songArtist;

        if (Array.isArray(window.currentlevel) && window.currentlevel[0] === songKey) {
          window.currentlevel[3] = ["Local", songArtist];
          if (nextFadeDuration !== null && nextFadeDuration !== undefined) {
            this.fadeInMusic(nextFadeDuration);
          } else {
            this.startMusic(nextOffset);
          }
        }
      } catch (err) {
        if (this._pendingOnlineSongLoadKey === songKey) {
          this._pendingOnlineSongLoadKey = null;
          this._pendingOnlineSongLoadOffset = 0;
          this._pendingOnlineSongFadeDuration = null;
        }
        console.warn("Failed to load online song audio", songKey, err);
      }
    })();

    return true;
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
    if (this._shouldUsePracticeSong()) {
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
    if (window._onlineSongBuffer && window._onlineSongKey === window.currentlevel?.[0]) {
      const startOffset = this._getLevelSongStartOffset();
      this._playOnlineBuffer(window._onlineSongBuffer, startOffset + StartPosOffset);
      this._setupAnalyser();
      this._musicPlaying = true;
      return;
    }
    const _songKey = window.currentlevel?.[0];
    if (!_songKey) {
      this._setupAnalyser();
      return;
    }
    if (!this._scene.cache.audio.exists(_songKey)) {
      if (this._loadMissingOnlineSong(_songKey, StartPosOffset) || this._loadMissingOfficialSong(_songKey, StartPosOffset)) {
        this._setupAnalyser();
        return;
      }
      this._setupAnalyser();
      return;
    }
    this._music = this._scene.sound.add(_songKey, {
      loop: true,
      volume: this._effectiveVolume()
    });
    this._music.play();
    const startOffset = this._getLevelSongStartOffset();
    this._music.seek = startOffset + StartPosOffset;
    this._setupAnalyser();
    this._musicPlaying = true;
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
      key: window.currentlevel?.[0] || window._onlineSongKey || "online",
      stop: () => {
        _isPlaying = false;
        _isPaused  = false;
        _stopSource(self._onlineSource || source);
        try { gainNode.disconnect(); } catch(e) {}
        self._onlineSource = null;
        self._onlineGain = null;
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
    this._musicPlaying = true;
  }
  stopMusic() {
    if (this._music) {
      this._music.stop();
    }
    this._musicPlaying = false;
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
  setUserMusicVolume(newVolume) {
    this._userMusicVol = newVolume;
    localStorage.setItem("userMusicVol", newVolume);
    if (this._music) {
      this._music.volume = this._effectiveVolume();
    }
  }
  getMusicVolume() {
    return this._effectiveVolume();
  }
  setMusicVolume(newVolume) {
    this.setUserMusicVolume(newVolume / 0.8);
  }
  fadeInMusic(durationMillis = 1000) {
    if (this._music) {
      this._music.stop();
      this._music.destroy();
    }
    if (this._shouldUsePracticeSong()) {
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
    
    if (window._onlineSongBuffer && window._onlineSongKey === window.currentlevel?.[0]) {
      const startOffset = window._onlineSongOffset || 0;
      this._playOnlineBuffer(window._onlineSongBuffer, startOffset);
      if (this._onlineGain) {
        this._onlineGain.gain.value = this._effectiveVolume();
      }
      this._setupAnalyser();
      this._musicPlaying = true;
      return;
    }

    const songKey = window.currentlevel?.[0];
    if (!songKey) {
      this._setupAnalyser();
      return;
    }

    if (!this._scene.cache.audio.exists(songKey)) {
      if (this._loadMissingOnlineSong(songKey, 0, durationMillis) || this._loadMissingOfficialSong(songKey, 0, durationMillis)) {
        this._setupAnalyser();
        return;
      }
      this._setupAnalyser();
      return;
    }

    this._music = this._scene.sound.add(songKey, {
      loop: true,
      volume: 0
    });
    this._music.play();
    this._setupAnalyser();
    this._scene.tweens.add({
      targets: this._music,
      volume: this._effectiveVolume(),
      duration: durationMillis
    });
    this._musicPlaying = true;
  }
  fadeOutMusic(durationMillis = 1500) {
    if (this._music && this._music.isPlaying) {
      this._music.setLoop(false);
      this._scene.tweens.add({
        targets: this._music,
        volume: 0,
        duration: durationMillis,
        onComplete: () => {
          if (this._music) {
            this._music.stop();
          }
        }
      });
    }
  }
  playEffect(soundEffect, volumeObj = {}) {
    if (this._scene.sound.context && this._scene.cache.audio.exists(soundEffect)) {
      const soundObject = this._scene.sound.add(soundEffect);
      const rawBaseVolume = volumeObj && Object.prototype.hasOwnProperty.call(volumeObj, "volume")
        ? Number(volumeObj.volume)
        : 1;
      const rawSfxVolume = Number(this._scene?._sfxVolume ?? localStorage.getItem("userSfxVol") ?? 1);
      const baseVolume = Number.isFinite(rawBaseVolume) ? rawBaseVolume : 1;
      const sfxVolume = Number.isFinite(rawSfxVolume) ? rawSfxVolume : 1;
      soundObject.play({
        volume: Math.max(0, baseVolume * sfxVolume)
      });
    }
  }
  _setupAnalyser() {
    const audioContext = this._scene.sound.context;
    if (audioContext) {
      this._analyser = audioContext.createAnalyser();
      this._analyser.fftSize = 2048;
      this._meterBuffer = new Float32Array(this._analyser.fftSize);
      this._scene.sound.masterVolumeNode.connect(this._analyser);
      this._meteringEnabled = true;
    }
  }
  _ensureCorrectMusicMode() {
    if (this._scene?._practiceMusicBypassChangePendingUntilRestart) return;
    if (this._pendingMusicLoadKey || this._pendingOnlineSongLoadKey) return;
    if (!this._music) return;
    const expectedSongKey = this._shouldUsePracticeSong() ? "StayInsideMe" : window.currentlevel?.[0];
    const currentSongKey = this._music?.key || (this._onlineSource ? window._onlineSongKey : null);
    if (currentSongKey !== expectedSongKey) {
      const offset = typeof this._scene._getCurrentMusicSyncOffset === "function"
        ? this._scene._getCurrentMusicSyncOffset()
        : this._scene._getStartPosMusicOffset();
      this.startMusic(offset);
    }
  }
  update(timeSeconds) {
    if (!this._meteringEnabled || !this._analyser) {
      return;
    }
    this._analyser.getFloatTimeDomainData(this._meterBuffer);
    let biggestBuf = 0;
    for (let index = 0; index < this._meterBuffer.length; index++) {
      let buf = Math.abs(this._meterBuffer[index]);
      if (buf > biggestBuf) {
        biggestBuf = buf;
      }
    }
    const volume = this._effectiveVolume();
    if (volume > 0) {
      biggestBuf /= volume;
    }
    this._meterValue = 0.1 + biggestBuf;
    const timeMinutes = timeSeconds * 60;
    if (this._silenceCounter < 3 || this._meterValue < this._lastAudio * 1.1 || this._meterValue < this._lastPeak * 0.95 && this._lastAudio > this._lastPeak * 0.2) {
      this._meterValue = this._lastAudio * Math.pow(0.92, timeMinutes);
    } else {
      this._silenceCounter = 0;
      this._lastPeak = this._meterValue;
      this._meterValue *= Math.pow(1.46, timeMinutes);
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
    this._pendingMusicLoadKey = null;
    this._pendingMusicLoadOffset = 0;
    this._pendingMusicFadeDuration = null;
    this._pendingOnlineSongLoadKey = null;
    this._pendingOnlineSongLoadOffset = 0;
    this._pendingOnlineSongFadeDuration = null;
    this.stopMusic();
  }
}
