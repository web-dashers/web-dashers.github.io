window._kbDown = new Set();
window._kbHandlers = {};
window._kbSuspended = false;

window.kbIsDown = (action) => {
  if (window._kbSuspended) return false;
  const keys = window.keybinds && window.keybinds[action];
  if (!keys) return false;
  for (const code of keys) {
    if (window._kbDown.has(code)) return true;
  }
  return false;
};

window.kbOnPress = (action, fn, allowRepeat) => {
  window._kbHandlers[action] = { fn, allowRepeat: !!allowRepeat };
};

window.kbResetHandlers = () => {
  window._kbHandlers = {};
};

window.kbLabel = (code) => {
  const names = {
    Space: "Space", Enter: "Enter", NumpadEnter: "Num Enter", Tab: "Tab", Backspace: "Bksp", Delete: "Del",
    Escape: "Esc", ArrowUp: "Up", ArrowDown: "Down", ArrowLeft: "Left", ArrowRight: "Right",
    ShiftLeft: "L Shift", ShiftRight: "R Shift", ControlLeft: "L Ctrl", ControlRight: "R Ctrl",
    AltLeft: "L Alt", AltRight: "R Alt", MetaLeft: "L Win", MetaRight: "R Win",
    Comma: ",", Period: ".", Slash: "/", Backslash: "\\", IntlBackslash: "\\", Semicolon: ";", Quote: "'",
    BracketLeft: "[", BracketRight: "]", Minus: "-", Equal: "=", Backquote: "`",
    NumpadAdd: "Num +", NumpadSubtract: "Num -", NumpadMultiply: "Num *", NumpadDivide: "Num /", NumpadDecimal: "Num .",
    PageUp: "Pg Up", PageDown: "Pg Dn", CapsLock: "Caps", ScrollLock: "Scr Lk", NumLock: "Num Lk",
    PrintScreen: "PrtSc", ContextMenu: "Menu"
  };
  if (names[code]) return names[code];
  let m;
  if ((m = /^Key([A-Z])$/.exec(code))) return m[1];
  if ((m = /^Digit(\d)$/.exec(code))) return m[1];
  if ((m = /^Numpad(\d)$/.exec(code))) return "Num " + m[1];
  return code.replace(/([a-z])([A-Z])/g, "$1 $2");
};

window.kbFromLegacy = (name) => {
  const direct = {
    SPACE: "Space", UP: "ArrowUp", DOWN: "ArrowDown", LEFT: "ArrowLeft", RIGHT: "ArrowRight", ESC: "Escape",
    SHIFT: "ShiftLeft", CTRL: "ControlLeft", ALT: "AltLeft", ENTER: "Enter", TAB: "Tab", BACKSPACE: "Backspace",
    DELETE: "Delete", INSERT: "Insert", HOME: "Home", END: "End", PAGE_UP: "PageUp", PAGE_DOWN: "PageDown",
    CAPS_LOCK: "CapsLock", PAUSE: "Pause", COMMA: "Comma", PERIOD: "Period", FORWARD_SLASH: "Slash",
    BACK_SLASH: "Backslash", COLON: "Semicolon", SEMICOLON: "Semicolon", QUOTES: "Quote",
    OPEN_BRACKET: "BracketLeft", CLOSED_BRACKET: "BracketRight", MINUS: "Minus", PLUS: "Equal", BACKTICK: "Backquote"
  };
  if (direct[name]) return direct[name];
  const digits = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"];
  const d = digits.indexOf(name);
  if (d !== -1) return "Digit" + d;
  if (/^[A-Z]$/.test(name)) return "Key" + name;
  return name;
};

(function installKeyTracker() {
  if (window._kbTrackerInstalled) return;
  window._kbTrackerInstalled = true;
  window.addEventListener("keydown", (e) => {
    window._kbDown.add(e.code);
    if (window._kbSuspended || !window.keybinds) return;
    const t = document.activeElement;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    if ((e.ctrlKey || e.metaKey) && !/^(Control|Meta)/.test(e.code)) return;
    for (const action in window.keybinds) {
      if (!window.keybinds[action].includes(e.code)) continue;
      e.preventDefault();
      const h = window._kbHandlers[action];
      if (h && (!e.repeat || h.allowRepeat)) h.fn(e);
    }
  });
  window.addEventListener("keyup", (e) => {
    window._kbDown.delete(e.code);
  });
  window.addEventListener("blur", () => window._kbDown.clear());
})();

class PracticeMode {
  constructor() {
    this.checkpoints = [];
    this.practiceMode = false;
    this.checkpointSprites = [];
  }
  togglePracticeMode() {
    this.practiceMode = !this.practiceMode;
    if (!this.practiceMode) {
      this.clearCheckpoints();
    }
    return this.practiceMode;
  }
  saveCheckpoint(playerState, playerWorldX, cameraX, scene) {
    if (!this.practiceMode || playerState.isDead) return false;
    const checkpoint = {
      x: playerWorldX,
      y: playerState.y,
      yVelocity: playerState.yVelocity,
      gravityFlipped: playerState.gravityFlipped,
      isMini: playerState.isMini,
      isCube: playerState.isCube,
      isShip: playerState.isShip,
      isBall: playerState.isBall,
      isUfo: playerState.isUfo,
      isWave: playerState.isWave,
      isSpider: playerState.isSpider,
      isBird: playerState.isBird,
      isDart: playerState.isDart,
      isRobot: playerState.isRobot,
      isSwing: playerState.isSwing,
      isJetpack: playerState.isJetpack,
      isFlying: playerState.isFlying,
      isJumping: playerState.isJumping,
      onGround: playerState.onGround,
      canJump: playerState.canJump,
      wasBoosted: playerState.wasBoosted,
      rotation: playerState.rotation,
      rotateActionActive: !!scene?._player?.rotateActionActive,
      gravity: playerState.gravity,
      jumpPower: playerState.jumpPower,
      mirrored: scene?._mirrorAnimating && playerState === scene._state ? !!scene._mirrorTarget : playerState.mirrored,
      isDashing: playerState.isDashing,
      dashYVelocity: playerState.dashYVelocity,
      ballShouldRotate: playerState.ballShouldRotate,
      ballRotateOpposite: playerState.ballRotateOpposite,
      ballNormalRotate: playerState.ballNormalRotate,
      ballHitPad: playerState.ballHitPad,
      robotHold: !!playerState._robotHold,
      robotHoldTimer: playerState._robotHoldTimer || 0,
      cameraX: cameraX,
      flyFloorY: scene._level._flyFloorY,
      flyCeilingY: scene._level._flyCeilingY,
      flyGroundActive: scene._level._flyGroundActive,
      flyVisualOnly: scene._level._flyVisualOnly,
      flyVisualFloorInset: scene._level._flyVisualFloorInset,
      flyVisualCeilingInset: scene._level._flyVisualCeilingInset,
      groundTargetValue: scene._level._groundTargetValue,
      flyCameraTarget: scene._level.flyCameraTarget,
      groundAnimating: scene._level._groundAnimating,
      groundAnimFrom: scene._level._groundAnimFrom,
      groundAnimTo: scene._level._groundAnimTo,
      groundAnimTime: scene._level._groundAnimTime,
      groundAnimDuration: scene._level._groundAnimDuration,
      cameraY: scene._cameraY,
      groundStartScreenY: scene._level._groundStartScreenY,
      ceilingStartScreenY: scene._level._ceilingStartScreenY,
      groundY: scene._level._groundY,
      ceilingY: scene._level._ceilingY,
      speed: playerSpeed,
      physicsFrame: scene._physicsFrame,
      dualMode: !!scene._isDual,
      dualGameMode: scene?._getDualModeId ? scene._getDualModeId(scene._state2) : null,
      dualIsMini: !!scene._state2?.isMini,
      dualY: scene._state2?.y,
      dualYVelocity: scene._state2?.yVelocity,
      dualGravityFlipped: scene._state2?.gravityFlipped,
      dualOnGround: scene._state2?.onGround,
      dualOnCeiling: scene._state2?.onCeiling,
      dualCanJump: scene._state2?.canJump,
      dualIsJumping: scene._state2?.isJumping,
      timestamp: Date.now()
    };
    this.checkpoints.push(checkpoint);
    const checkpointSprite = scene.add.image(playerWorldX, b(playerState.y), "GJ_GameSheet02", "checkpoint_01_001.png")
      .setOrigin(0.5, 0.5)
      .setScrollFactor(1)
      .setDepth(15)
      .setScale(1.0);
    scene._level.topContainer.add(checkpointSprite);
    this.checkpointSprites.push(checkpointSprite);
    return true;
  }
  deleteLastCheckpoint() {
    if (this.checkpoints.length > 0) {
      this.checkpoints.pop();
      if (this.checkpointSprites.length > 0) {
        const lastSprite = this.checkpointSprites.pop();
        if (lastSprite && lastSprite.destroy) {
          lastSprite.destroy();
        }
      }
      return true;
    }
    return false;
  }
  clearCheckpoints() {
    this.checkpoints = [];
    for (const sprite of this.checkpointSprites) {
      if (sprite && sprite.destroy) {
        sprite.destroy();
      }
    }
    this.checkpointSprites = [];
  }
  loadLastCheckpoint() {
    if (this.checkpoints.length > 0) {
      return this.checkpoints[this.checkpoints.length - 1];
    }
    return null;
  }
}

class MacroBot {
  constructor(scene) {
    this.scene = scene;
    this.resetAll();
  }

  resetAll() {
    this.recording = false;
    this.playing = false;
    this.cursor = 0;
    this.frames = [];
    this.currentFrameState = null;
    this.meta = {
      author: "Web Dashers",
      level: "",
      version: 2,
    };
  }

  _cloneState(state) {
    if (!state) return null;
    const out = {};
    for (const key of Object.keys(state)) {
      const value = state[key];
      if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        out[key] = value;
      } else if (Array.isArray(value) && value.every(v => v === null || typeof v === "string" || typeof v === "number" || typeof v === "boolean")) {
        out[key] = value.slice();
      }
    }
    return out;
  }

  _snapshotPlayer(player, state) {
    return {
      state: this._cloneState(state),
      rotation: Number.isFinite(player?._rotation) ? player._rotation : (Number.isFinite(state?.rotation) ? state.rotation : 0),
      mode: this.scene._getDualModeId ? this.scene._getDualModeId(state) : "cube"
    };
  }

  _captureFrame(currentFrame) {
    const scene = this.scene;
    return {
      frame: currentFrame,
      playerWorldX: scene._playerWorldX,
      cameraX: scene._cameraX,
      cameraY: scene._cameraY,
      speed: playerSpeed,
      dual: !!scene._isDual,
      player: this._snapshotPlayer(scene._player, scene._state),
      dualPlayer: scene._isDual ? this._snapshotPlayer(scene._player2, scene._state2) : null
    };
  }

  _applyPlayerSnapshot(snapshot, player, state) {
    if (!snapshot || !player || !state) return;

    const mode = snapshot.mode || "cube";
    const currentMode = this.scene._getDualModeId ? this.scene._getDualModeId(state) : "cube";
    if (currentMode !== mode && this.scene._setPlayerGamemode) {
      this.scene._setPlayerGamemode(player, state, mode, true);
    }

    const savedState = snapshot.state || {};
    for (const key of Object.keys(savedState)) {
      const value = savedState[key];
      if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        state[key] = value;
      } else if (Array.isArray(value)) {
        state[key] = value.slice();
      }
    }

    if (Number.isFinite(snapshot.rotation)) {
      state.rotation = snapshot.rotation;
      player._rotation = snapshot.rotation;
    }

    if (player.setRotation && Number.isFinite(snapshot.rotation)) {
      try { player.setRotation(snapshot.rotation); } catch (_) {}
    }
    if (currentMode !== mode) {
      player.setCubeVisible(mode === "cube" || mode === "ship" || mode === "ufo");
      player.setShipVisible(mode === "ship");
      player.setBallVisible(mode === "ball");
      player.setWaveVisible(mode === "wave");
      player.setBirdVisible?.(mode === "ufo");
      player.setRobotVisible(mode === "robot");
      player.setSpiderVisible(mode === "spider");
    }
  }

  _applyFrame(frameState) {
    if (!frameState) return;
    const scene = this.scene;

    if (Number.isFinite(frameState.playerWorldX)) scene._playerWorldX = frameState.playerWorldX;
    if (Number.isFinite(frameState.cameraX)) scene._cameraX = frameState.cameraX;
    if (Number.isFinite(frameState.cameraY)) scene._cameraY = frameState.cameraY;
    if (Number.isFinite(frameState.speed)) playerSpeed = frameState.speed;

    if (frameState.player) {
      this._applyPlayerSnapshot(frameState.player, scene._player, scene._state);
    }

    scene._isDual = !!frameState.dual;
    if (scene._isDual && frameState.dualPlayer) {
      this._applyPlayerSnapshot(frameState.dualPlayer, scene._player2, scene._state2);
    }

    if (!scene._isDual) {
      scene._player2.setCubeVisible(false);
      scene._player2.setShipVisible(false);
      scene._player2.setBallVisible(false);
      scene._player2.setWaveVisible(false);
      scene._player2.setBirdVisible?.(false);
      scene._player2.setSpiderVisible(false);
      scene._player2.setRobotVisible(false);
    }
  }

  startRecording(meta = {}) {
    this.resetAll();
    this.recording = true;
    this.meta = {
      ...this.meta,
      ...meta,
      version: 2
    };
  }

  stopRecording() {
    this.recording = false;
    return this.exportObject();
  }

  clearRecording() {
    this.frames = [];
    this.cursor = 0;
    this.currentFrameState = null;
  }

  recordFrame(currentFrame) {
    if (!this.recording) return;
    const frameState = this._captureFrame(currentFrame);
    const last = this.frames[this.frames.length - 1];
    if (last && last.frame === currentFrame) {
      this.frames[this.frames.length - 1] = frameState;
    } else {
      this.frames.push(frameState);
    }
  }

  rollbackRecording(currentFrame) {
    this.frames = this.frames.filter(frame => (frame.frame ?? 0) <= currentFrame);
    this.cursor = 0;
    this.currentFrameState = null;
  }

  clearPlayback() {
    this.cursor = 0;
    this.currentFrameState = null;
  }

  rollbackPlayback(currentFrame) {
    if (!this.frames.length) return;
    this.cursor = 0;
    this.currentFrameState = null;

    while (this.cursor < this.frames.length && (this.frames[this.cursor].frame ?? 0) <= currentFrame) {
      this.cursor++;
    }

    const index = Math.max(0, this.cursor - 1);
    const frameState = this.frames[index];
    if (frameState) this._applyFrame(frameState);
  }

  startPlayback(macroData) {
    const macro = typeof macroData === "string" ? JSON.parse(macroData) : macroData;

    this.resetAll();
    this.playing = true;

    this.meta = {
      ...this.meta,
      ...(macro || {})
    };

    this.frames = Array.isArray(macro?.frames) ? macro.frames.slice() : [];
    this.frames.sort((a, b) => (a.frame ?? 0) - (b.frame ?? 0));

    this.cursor = 0;
    this.currentFrameState = null;

    if (Array.isArray(macro?.inputs) && !this.frames.length) {
      console.warn("Outdated macro file");
    }
  }

  stopPlayback() {
    this.playing = false;
    this.cursor = 0;
    this.currentFrameState = null;
  }

  step(currentFrame) {
    if (!this.playing || !this.frames.length) return;

    while (
      this.cursor < this.frames.length &&
      (this.frames[this.cursor].frame ?? 0) <= currentFrame
    ) {
      this.currentFrameState = this.frames[this.cursor++];
    }

    if (this.cursor >= this.frames.length) {
      this.stopPlayback();
      return;
    }

    if (this.currentFrameState) {
      this._applyFrame(this.currentFrameState);
    }
  }

  applyCurrentFrame() {
    if (!this.playing || !this.currentFrameState) return;
    this._applyFrame(this.currentFrameState);
  }

  exportObject() {
    return {
      meta: this.meta,
      frames: this.frames.slice()
    };
  }

  exportString(pretty = false) {
    return JSON.stringify(this.exportObject(), null, pretty ? 2 : 0);
  }

  download(filename = "macro.wbgdr2") {
    const blob = new Blob([this.exportString(true)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  importFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = String(event.target.result || "");
          const macro = JSON.parse(text);
          resolve(macro);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(reader.error || new Error("Failed to read macro file"));
      reader.readAsText(file);
    });
  }
}

const ORB_PARTICLE_COLORS = {
  36: 0xfffb57,
  84: 0x58ffff,
  141: 0xff52f0,
  444: 0xff00d2,
  1022: 0x63ff5f,
  1330: 0xffffff,
  1333: 0xff6326,
  1594: 0x6cff6b,
  1704: 0x04ff04,
  1751: 0xff00d2
};
class GameScene extends UIScene {
  constructor() {
    super({
      key: "GameScene"
    });
  }
  create() {
    window.kbResetHandlers();
    this.events.once("shutdown", () => window.kbResetHandlers());
    const returningFromSecretChallenge = window._mainLevelReturnToSelect && window.currentlevel?.[2] === "level_67";
    if (returningFromSecretChallenge) {
      this.game.registry.remove("autoStartGame");
      this._secretVaultReturnCover = this.add.rectangle(screenWidth / 2, screenHeight / 2, screenWidth, screenHeight, 0x000000)
        .setScrollFactor(0).setDepth(10000);
    }
    this._bgSpeedX = 0.1;
    this._bgSpeedY = 0.1;
    this._menuCameraX = -centerX;
    this._prevCameraX = -centerX;
    this._bg = this.add.tileSprite(0, 0, screenWidth, screenHeight, "game_bg_01").setOrigin(0, 0).setScrollFactor(0).setDepth(-10);
    this._applyMirroredBackgroundTexture("game_bg_01");
    this._cameraX = -centerX;
    this._cameraY = 0;
    this._cameraXRef = {
      get value() {
        return this._v;
      },
      _v: -centerX
    };
    this._state = new PlayerState();
    this._level = new window.LevelObject(this, this._cameraXRef);
    this._levelEditor = new window.LevelEditor(this);
    this._orbGfx = null;
    this._orbGfxTimer = 0;
    this._player = new PlayerObject(this, this._state, this._level);
    this._player._activationKey = "main";
    window._gameScene = this;
    if (window.customCubeIconSrc) {
      window.setCustomCubeIcon(window.customCubeIconSrc)
        .catch(error => console.warn("Could not restore the custom icon", error));
    }
    this._state2 = new PlayerState();
    this._player2 = new PlayerObject(this, this._state2, this._level);
    this._player2._activationKey = "dual";
    this._player2.setInvertedColors?.(true);
    this._isDual = false;
    this._player2.setCubeVisible(false);
    this._player2.setShipVisible(false);
    this._player2.setBallVisible(false);
    this._player2.setWaveVisible(false);
    this._player2.setBirdVisible?.(false);
    this._player2.setSpiderVisible(false);
    this._player2.setRobotVisible(false);
    this._colorManager = new ColorManager();
    this._practicedMode = new PracticeMode();
    if (this._audio == null) {
      this._audio = new AudioManager(this);
    }
    this._loadSettings();
    if (window._onlineLevelString && window._onlineLevelId &&
        window.currentlevel[2] === window._onlineLevelId) {
      try {
        this.cache.text.entries.set(window._onlineLevelId, window._onlineLevelString);
      } catch(e) {}
    }
    window.BeastAnim.loadDescs(this);
    let _0x591888 = this.cache.text.get(window.currentlevel[2]);
    if (!_0x591888 && window._onlineLevelString && window.currentlevel[2] === window._onlineLevelId) {
      _0x591888 = window._onlineLevelString;
    }
    if (_0x591888 && !returningFromSecretChallenge) {
      this._level.loadLevel(_0x591888);
    }
    const _resolveGdArtId = (key, fallback = 1) => {
      const raw = window.settingsMap?.[key];
      const parsed = parseInt(raw ?? fallback, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    };

    const _bgGdId = _resolveGdArtId("kA6", parseInt(window._backgroundId || "01", 10) || 1);
    window._backgroundId = String(_bgGdId).padStart(2, "0");

    const _groundRaw = window.settingsMap?.["kA7"] ?? ((parseInt(window._groundId || "00", 10) || 0) + 1);
    window._groundId = getGroundTextureId(_groundRaw);

    const _bgKey = "game_bg_" + getBackgroundTextureIndex(_bgGdId);
    if (this.textures.exists(_bgKey)) {
      this._applyMirroredBackgroundTexture(_bgKey);
    }
    this._level.applyGroundTexture();
    if (this._level._initialColors) {
      for (let chId in this._level._initialColors) {
        let col = this._level._initialColors[chId];
        this._colorManager.setInitialColor(parseInt(chId, 10), col);
      }
    }
    if (this._level._initialCopies) {
      for (let chId in this._level._initialCopies) {
        this._colorManager.setInitialCopy(parseInt(chId, 10), this._level._initialCopies[chId]);
      }
    }
    if (this._level._initialOpacity) {
      for (let chId in this._level._initialOpacity) {
        this._colorManager.setInitialOpacity(parseInt(chId, 10), this._level._initialOpacity[chId]);
      }
    }
    this._level.createEndPortal(this);
    this._glitterCenterX = 0;
    this._glitterCenterY = T;
    this._glitterEmitter = this.add.particles(0, 0, "GJ_WebSheet", {
      frame: "square.png",
      speed: 0,
      scale: {
        start: 0.375,
        end: 0
      },
      alpha: {
        start: 1,
        end: 0
      },
      lifespan: {
        min: 200,
        max: 1800
      },
      frequency: 60,
      blendMode: S,
      tint: window.mainColor,
      emitting: false,
      emitCallback: _0x3c2a3e => {
        _0x3c2a3e.x = this._glitterCenterX + (Math.random() * 2 - 1) * (screenWidth / 1.8);
        _0x3c2a3e.y = this._glitterCenterY + (Math.random() * 2 - 1) * 320;
      }
    });
    this._level.additiveContainer.add(this._glitterEmitter);
    this._bg.setTint(this._colorManager.getHex(fs));
    this._level.setGroundColor(this._colorManager.getHex(gs));
    this._level.setGround2Color?.(this._colorManager.getHex(1009));
    this._level.additiveContainer.setVisible(false);
    this._level.container.setVisible(false);
    this._level.topContainer.setVisible(false);
    this._attempts = parseInt(localStorage.getItem("gd_totalAttempts") || "1", 10);
    this._bestPercent = 0;
    this._lastPercent = 0;
    this._practiceBestPercent = parseFloat(localStorage.getItem("practiceBestPercent_" + (window.currentlevel[2] || "level_1")) || "0");
    this._endPortalGameY = 240;
    this._resetGameplayState();
    this._totalJumps = parseInt(localStorage.getItem("gd_totalJumps") || "0", 10);
    this._totalDeaths = parseInt(localStorage.getItem("gd_totalDeaths") || "0", 10);
    this._totalsecretcoins = parseInt(localStorage.getItem("gd_totalsecretcoins") || "0", 10);
    window._totalsecretcoins = this._totalsecretcoins;
    this._totalusercoins = parseInt(localStorage.getItem("gd_totalusercoins") || "0", 10);
    window._totalusercoins = this._totalusercoins;
    window._completedLevels = parseInt(localStorage.getItem("gd_completedLevels") || "0", 10);
    this._playTime = 0;
    this._menuActive = true;
    this._slideIn = false;
    this._slideGroundX = null;
    this._firstPlay = true;
    this._player.setCubeVisible(false);
    this._player.setShipVisible(false);
    this._player.setBallVisible(false);
    this._createMenuUI();
    this._spaceWasDown = false;
    this._leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this._rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this._aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this._dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this._startPosIndex = -1;

    this._createHUDElements();
    this._escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this._escKey.on("down", () => {
      if (this._closeTopOverlay()) return;
      if (this._paused) {
        this._audio.playEffect("quitSound_01");
        this._queueGameplayLevelViewReturn();
        if (this._isMainLevelForCoinDisplay() || window.currentlevel?.[2] === "level_67") {
          window._mainLevelReturnToSelect = true;
        }
        this.game.registry.remove("autoStartGame");
        window.isEditor = false;
        this._audio.stopMusic();
        this._resumeGame();
        this.scene.restart();
      } else if (!this._menuActive && !this._slideIn && !this._levelWon) {
        this._pauseGame();
      }
    });
    window.kbOnPress("restart", () => {
      if (!this._menuActive && !this._slideIn && !this._levelWon && !this._menuActive) {
        this._restartLevel();
      }
    });
    window.kbOnPress("practice", () => {
      if (!this._menuActive && !this._slideIn) {
        const isPracticeMode = this._practicedMode.togglePracticeMode();
        if (this._checkpointBtnContainer) {
          this._checkpointBtnContainer.setVisible(isPracticeMode);
          this._checkpointBtnContainer.setAlpha(window.hidePracticeUI ? 0 : 1);
        }
        if (this._practiceModeBarContainer) {
          this._practiceModeBarContainer.setVisible(isPracticeMode);
        }
        this._audio.startMusic(this._getCurrentMusicSyncOffset());
      }
    });
    window.kbOnPress("saveCheckpoint", () => {
      if (!this._menuActive && !this._slideIn && this._practicedMode.practiceMode) {
        const saved = this._practicedMode.saveCheckpoint(this._state, this._playerWorldX, this._cameraX, this);
        if (saved) {
        }
      }
    });
    window.kbOnPress("deleteCheckpoint", () => {
      if (!this._menuActive && !this._slideIn && this._practicedMode.practiceMode) {
        const deleted = this._practicedMode.deleteLastCheckpoint();
      }
    });
    window.kbOnPress("startPosPrev", () => {
      if (!window.startPosSwitcher) return;
      this.changeStartPos(-1);
    });
    window.kbOnPress("startPosNext", () => {
      if (!window.startPosSwitcher) return;
      this.changeStartPos(1);
    });
    window.kbOnPress("showHitboxes", () => {
      if (this._menuActive || !this._player) return;
      window.showHitboxes = !window.showHitboxes;
      if (!window.showHitboxes) {
        this._player._hitboxGraphics.clear();
      } else {
        this._player.drawHitboxes(this._player._hitboxGraphics, this._cameraX, this._cameraY);
      }
      if (this._saveSettings) this._saveSettings();
    });
    window.kbOnPress("noclip", () => {
      if (this._menuActive || !this._player) return;
      window.noClip = !window.noClip;
      if (this._noclipIndicator) this._noclipIndicator.setVisible(window.noClip);
      if (this._saveSettings) this._saveSettings();
    });
    this._paused = false;
    this._pauseContainer = null;
    this._sfxVolume = localStorage.getItem("userSfxVol") ?? 1;
    this._initMacroBot();
    this.input.on("pointerdown", () => {
      if (!this._menuActive && !this._paused && !this._levelSelectOverlay && !this._levelWon && !window.isEditor) {
        this._pushButton();
      }
    });
    this.input.on("pointerup", (pointer) => {
      if (!this._menuActive && !this._paused && !this._levelSelectOverlay && !this._levelWon && !window.isEditor) {
        if (this._otherJumpInputHeld(pointer)) return;
        this._releaseButton();
      }
    });
    if (!window.gdpointerup) {
      window.gdpointerup = true;
      window.addEventListener("pointerup", (e) => {
        if (e.pointerType === "touch") return;
        if (e.buttons !== 0 || window.kbIsDown?.("jump")) return;
        this._releaseButton(true);
      });
    }
    if (!window.gdtouchend) {
      window.gdtouchend = true;
      window.addEventListener("touchend", (e) => {
        if (e.touches && e.touches.length > 0) return;
        if (window.kbIsDown?.("jump")) return;
        this._releaseButton(true);
      });
    }

    this._buildHUD();
    this._createStartPosGui();
    this._loadKeybinds();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this._audio.pauseMusic();
      } else if (!this._menuActive && !this._paused && !this._state.isDead && !this._levelWon) {
        this._audio.resumeMusic();
      }
    });
    if (!window.gdorientationchange) {
      window.gdorientationchange = true;
      window.addEventListener("orientationchange", () => {
        this.time.delayedCall(100, () => this.scale.refresh());
      });
    }
    if (!window.gdresize) {
      window.gdresize = true;
      window.addEventListener("resize", () => {
        this.scale.refresh();
      });
    }
    if (this.game.registry.get("fadeInFromBlack")) {
      this.game.registry.remove("fadeInFromBlack");
      this.cameras.main.fadeIn(400, 0, 0, 0);
    }
    this._createLevelSwitcher();
    const menuMusicEnabled = localStorage.getItem("menuMusicEnabled");
    const shouldPlayMenuMusic = menuMusicEnabled === null ? true : menuMusicEnabled === "true";

    if (window.isEditor) {
      this._audio.stopMusic();
    } else if (!this._audio.isplaying() && shouldPlayMenuMusic) {
      this._audio.startMenuMusic();
    } else if (this._audio.isplaying() && !shouldPlayMenuMusic) {
      this._audio.stopMusic();
    }
    if (window.levelID) {
        this._openSearchMenu();
    }
    if (this.game.registry.get("autoStartGame")) {
      if (!window.settingsMap) {
        const cachedLevelText = this.cache.text.get(window.currentlevel[2]) ||
          ((window._onlineLevelString && window.currentlevel[2] === window._onlineLevelId) ? window._onlineLevelString : null);
        if (cachedLevelText) {
          window.BeastAnim.loadDescs(this);
          this._level.loadLevel(cachedLevelText);
        }
      }
      if (window.settingsMap) {
        this.game.registry.remove("autoStartGame");
        this._levelLabel.setVisible(false);
        this._leftBtn.setVisible(false);
        this._rightBtn.setVisible(false);
        if (this._practiceModeBarContainer) {
          this._practiceModeBarContainer.setVisible(this._practicedMode && this._practicedMode.practiceMode);
        }
        this._instantLevelStart = true;
        this._startGame();
      } else {
        console.warn("autoStartGame: missing settingsMap for", window.currentlevel && window.currentlevel[2]);
      }
    } else if (window._createdLevelReturnToView) {
      const returnTarget = window._createdLevelReturnToView;
      window._createdLevelReturnToView = null;
      const levelId = returnTarget?.createdId;
      let level = null;
      try {
        const createdLevels = JSON.parse(localStorage.getItem("created_levels") || "[]");
        level = createdLevels.find(entry =>
          entry && levelId !== undefined && levelId !== null &&
          String(entry.createdId) === String(levelId)
        ) || null;
      } catch (err) {
        console.warn("Failed to restore the created-level view", err);
      }
      if (!level && returnTarget?.snapshot) {
        level = returnTarget.snapshot;
      }
      if (level) {
        this._openLevelView(level);
      } else {
        this._openEditorMenu();
      }
    } else if (window._editorReturnToLevelViewId) {
      const levelId = window._editorReturnToLevelViewId;
      window._editorReturnToLevelViewId = null;
      let level = null;
      try {
        const createdLevels = JSON.parse(localStorage.getItem("created_levels") || "[]");
        level = createdLevels.find(entry => entry && entry.createdId === levelId) || null;
      } catch (err) {
        console.warn("Failed to restore the editor level view", err);
      }
      if (level) {
        this._openLevelView(level);
      } else {
        this._openEditorMenu();
      }
    } else if (window._onlineReturnToPlayMenu) {
      const { lvl, backTarget } = window._onlineReturnToPlayMenu;
      window._onlineReturnToPlayMenu = null;
      window._selectedLevelData = lvl;
      this._openPlayMenu(backTarget);
    } else if (window._mainLevelReturnToSelect) {
      window._mainLevelReturnToSelect = false;
      if (window.currentlevel && window.currentlevel[2] === "level_67") {
        const _firstLevel = (window.allLevels || []).find(l => l && l[2] !== "level_67" && l[2] !== "level_22");
       if (_firstLevel) window.currentlevel = [..._firstLevel];
      this._openSecretVault();
    } else {
      this._openLevelSelect();
    }
  }
  if (this._menuActive && !window._newsAutoOpened) {
    window._newsAutoOpened = true;
    this._buildNewsPopup();
    const updateNoticeVersion = (this._newsPages?.[0]?.title || "MEGA UPDATE - V2.0").trim();
    const seenUpdateVersion = localStorage.getItem("gd_yayy_update_notice_version");
    if (seenUpdateVersion !== updateNoticeVersion) {
      localStorage.setItem("gd_yayy_update_notice_version", updateNoticeVersion);
      const updateNotice = this.add.bitmapText(screenWidth / 2, -40, "goldFont", "yayy update", 42)
         .setOrigin(0.5)
          .setScrollFactor(0)
          .setDepth(1100);
        this.tweens.add({
          targets: updateNotice,
          y: screenHeight + 50,
          duration: 3000,
          ease: "Linear",
          onComplete: () => updateNotice.destroy()
        });
      }
    }
  }
  _parseLevelColors(levelId) {
    const LEVEL_COLORS = [
      0x0100f5,0xf902f8,0xf90285,0xfa0102,
      0xfa8702,0xfcfc06,0x03fb03,0x02fbfb,
      0x007dff
    ];
    let index = 0;
    if (window.allLevels) {
      index = window.allLevels.findIndex(l => l[2] === levelId);
      if (index === -1) index = 0;
    }
    const bgHex = LEVEL_COLORS[index % LEVEL_COLORS.length];
    return { bgHex, groundHex: bgHex };
  }
  changeStartPos(direction) {
        if (this._paused || this._levelWon || this._menuActive || this._slideIn) return;

        const positions = this._level.getStartPositions();
        const totalPositions = positions.length;

        if (totalPositions === 0) return;

        this._startPosIndex += direction;

        if (this._startPosIndex < -1) {
            this._startPosIndex = totalPositions - 1;
        } else if (this._startPosIndex >= totalPositions) {
            this._startPosIndex = -1;
        }

        if (this._startPosText) {
            const currentId = this._startPosIndex === -1 ? 0 : (this._startPosIndex + 1);
            this._startPosText.setText(`${currentId}/${totalPositions}`);
        }

        this._practicedMode.clearCheckpoints();
        this._restartLevel();
  }
  toggleGlitter(_0x34c21a) {
    if (this._editorPlaytestActive) {
      this._glitterEmitter.stop();
      return;
    }

    if (_0x34c21a) {
      this._glitterEmitter.start();
    } else {
      this._glitterEmitter.stop();
    }
  }
  _setParticleTimeScale(timeScale) {
    const updateTimeScale = object => {
      if (object && object.type === "ParticleEmitter") {
        object.timeScale = timeScale;
      }
      if (object && object.list) {
        object.list.forEach(updateTimeScale);
      }
    };
    updateTimeScale(this._level.container);
    updateTimeScale(this._level.topContainer);
    if (this._glitterEmitter) {
      this._glitterEmitter.timeScale = timeScale;
    }
  }
  _pauseGame() {
    if (!this._paused && !this._menuActive && !this._slideIn && !this._levelWon) {
      this._paused = true;
      this._pauseBtn.setVisible(false);
      this._audio.pauseMusic();
      this._setParticleTimeScale(0);
      this._player?.setDeathAnimationPaused?.(true);
      this._player2?.setDeathAnimationPaused?.(true);
      this._buildPauseOverlay();
    }
  }
  _resumeGame() {
    if (this._paused) {
      this._setParticleTimeScale(1);
      this._player?.setDeathAnimationPaused?.(false);
      this._player2?.setDeathAnimationPaused?.(false);
      this._paused = false;
      this._pauseBtn.setVisible(true).setAlpha(window.hidePauseBtn ? 0 : 75 / 255);

      if (!this._state.isDead || this._practicedMode?.practiceMode) {
        this._audio.resumeMusic();
        this._audio._ensureCorrectMusicMode();
        if (this._checkpointBtnContainer) {
        this._checkpointBtnContainer.setAlpha(window.hidePracticeUI ? 0 : 1);
      }
    }

      if (this._pauseContainer) {
        this._pauseContainer.destroy();
        this._pauseContainer = null;
      }
    }
  }

  _queueGameplayLevelViewReturn() {
    const currentLevelId = window.currentlevel?.[2] ?? window._onlineLevelId ?? null;
    const pendingCreatedReturn = window._createdLevelReturnToView || null;
    const candidateCreatedIds = [
      pendingCreatedReturn?.createdId,
      currentLevelId,
      window._onlineLevelId
    ].filter(value => value !== undefined && value !== null);

    let createdLevel = null;
    try {
      const createdLevels = JSON.parse(localStorage.getItem("created_levels") || "[]");
      createdLevel = createdLevels.find(level => {
        if (!level) return false;
        return candidateCreatedIds.some(id =>
          String(level.createdId) === String(id) ||
          (level.levelId !== undefined && level.levelId !== null && String(level.levelId) === String(id))
        );
      }) || null;
    } catch (err) {
      console.warn("Failed to determine the created-level return target", err);
    }

    if (createdLevel || pendingCreatedReturn?.snapshot) {
      const targetLevel = createdLevel || pendingCreatedReturn.snapshot;
      window._createdLevelReturnToView = {
        createdId: targetLevel.createdId ?? pendingCreatedReturn?.createdId ?? currentLevelId,
        snapshot: { ...targetLevel }
      };
      window._editorReturnToLevelViewId = null;
      window._onlineReturnToPlayMenu = null;
      return true;
    }

    const levelSource = window.currentlevel?.[3]?.[0];
    const isOnlineLevel = levelSource === "Online" || String(currentLevelId || "").startsWith("online_");
    if (isOnlineLevel) {
      const existingReturn = window._onlineReturnToPlayMenu;
      const selectedLevel = existingReturn?.lvl || window._selectedLevelData || null;
      if (selectedLevel) {
        window._onlineReturnToPlayMenu = {
          lvl: selectedLevel,
          backTarget: existingReturn?.backTarget || null
        };
        window._createdLevelReturnToView = null;
        window._editorReturnToLevelViewId = null;
        return true;
      }
    }

    window._createdLevelReturnToView = null;
    return false;
  }

    _levelStatKey(kind, levelKeyOverride) {
      return "level" + kind + "_" + (levelKeyOverride || (window.currentlevel && window.currentlevel[2]) || "level_1");
    }
    _getLevelStat(kind, levelKeyOverride) {
      return parseInt(localStorage.getItem(this._levelStatKey(kind, levelKeyOverride)) || "0", 10) || 0;
    }
    _bumpLevelStat(kind) {
      localStorage.setItem(this._levelStatKey(kind), this._getLevelStat(kind) + 1);
    }
  _saveSettings() {
    const settings = {
        noclip: window.noClip,
        showPercentage: window.showPercentage,
        percentDecimals: window.percentageDecimals,
        showHitboxes: window.showHitboxes,
        startPosSwitcher: window.startPosSwitcher,
        smartStartPos: window.smartStartPos,
        startPosOpacity: window.startPosOpacity,
        progressBar: window.progressBar,
        hitboxTrail: window.showHitboxTrail,
        showFPS: this._fpsText.visible,
        hidePauseBtn: window.hidePauseBtn,
        hidePracticeUI: window.hidePracticeUI,
        solidWaveTrail: window.solidWave,
        noclipAccuracy: window.noClipAccuracy,
        hitboxesOnDeath: window.hitboxesOnDeath,
        createObjectIds: window.createObjectIds,
        showObjectIds: window.showObjectIds,
        showCPS: window.showCPS,
        speedHack: window.speedHack,
        macroBot: !!window.macroBot,
        practiceMusicSync: window.practiceMusicSync,
        respawnDelay: window.respawnDelay,
        showGlow: window.showGlow,
        showEditorGlow: window.showEditorGlow,
        useDirectInternet: !!window.useDirectInternet,
        enablePortalGuide: window.enablePortalGuide,
        enableOrbGuide: window.enableOrbGuide,
        enableMiniIcon: window.enableMiniIcon,
        cullDistance: window.cullDistance,
        settingInfoText: window.settingInfoText || {},
        enableLDM: window.enableLDM,
    };
    localStorage.setItem("gd_settings", JSON.stringify(settings));
    localStorage.setItem("gd_useDirectInternet", String(!!window.useDirectInternet));
  }
  _loadSettings() {
    const saved = localStorage.getItem("gd_settings");
    const defaults = {
        noclip: false,
        showPercentage: true,
        percentDecimals: false,
        showHitboxes: false,
        startPosSwitcher: false,
        smartStartPos: false,
        startPosOpacity: 1,
        progressBar: false,
        hitboxTrail: false,
        showFPS: false,
        hidePauseBtn: false,
        hidePracticeUI: false,
        solidWaveTrail: false,
        noclipAccuracy: false,
        hitboxesOnDeath: false,
        createObjectIds: false,
        showObjectIds: false,
        showCPS: false,
        speedHack: 1.0,
        respawnDelay: 1.0,
        macroBot: false,
        practiceMusicSync: false,
        showGlow: true,
        showEditorGlow: false,
        useDirectInternet: true,
        enablePortalGuide: true,
        enableOrbGuide: false,
        enableMiniIcon: false,
        enableLDM: false,
        cullDistance: 3
    };

    const data = { ...defaults, ...(saved ? JSON.parse(saved) : {}) };

    window.noClip = data.noclip;
    window.showPercentage = data.showPercentage;
    window.percentageDecimals = data.percentDecimals;
    window.showHitboxes = data.showHitboxes;
    window.startPosSwitcher = data.startPosSwitcher;
    window.smartStartPos = !!data.smartStartPos;
    window.startPosOpacity = Phaser.Math.Clamp(Number(data.startPosOpacity) || 1, 0.05, 1);
    window.progressBar = !!data.progressBar;
    window.showHitboxTrail = data.hitboxTrail;
    if (this._fpsText) this._fpsText.visible = data.showFPS;
    window.showFPS = !!data.showFPS;
    window.hidePauseBtn = !!data.hidePauseBtn;
    window.hidePracticeUI = !!data.hidePracticeUI;
    window.solidWave = data.solidWaveTrail;
    window.noClipAccuracy = data.noclipAccuracy;
    window.hitboxesOnDeath = data.hitboxesOnDeath;
    window.showCPS = data.showCPS;
    window.speedHack = data.speedHack;
    window.respawnDelay = data.respawnDelay;
    window.macroBot = data.macroBot;
    window.practiceMusicSync = !!data.practiceMusicSync;
    window.showGlow = data.showGlow;
    window.showEditorGlow = data.showEditorGlow;
    window.createObjectIds = data.createObjectIds;
    window.showObjectIds = data.showObjectIds;
    window.enablePortalGuide = data.enablePortalGuide;
    window.enableOrbGuide = data.enableOrbGuide;
    window.enableMiniIcon = data.enableMiniIcon;
    window.cullDistance = typeof data.cullDistance !== 'undefined' ? data.cullDistance : 3;
    window.settingInfoText = data.settingInfoText || {};
    window.useDirectInternet = !!data.useDirectInternet;
    localStorage.setItem("gd_useDirectInternet", String(!!window.useDirectInternet));
    window.enableLDM = !!data.enableLDM;
  }
  _loadKeybinds() {
    const defaults = {
      jump: ["Space", "KeyG", "KeyL", "KeyW"],
      jump2: ["ArrowUp", "KeyH"],
      pause: [],
      restart: ["KeyR"],
      noclip: ["KeyN"],
      showHitboxes: ["KeyH"],
      practice: ["KeyP"],
      startPosPrev: ["KeyQ"],
      startPosNext: ["KeyE"],
      saveCheckpoint: ["KeyZ"],
      deleteCheckpoint: ["KeyX"],
      editorTab1: ["Digit1"],
      editorTab2: ["Digit2"],
      editorTab3: ["Digit3"],
      editorMoveUp: ["KeyW"],
      editorMoveLeft: ["KeyA"],
      editorMoveDown: ["KeyS"],
      editorMoveRight: ["KeyD"],
      toggleMusic: ["KeyM"],
      screenshot: ["F2"],
      debugMode: ["F1"],
      zoomIn: ["Equal"],
      zoomOut: ["Minus"],
      toggleUI: ["KeyU"],
    };
    window._defaultKeybinds = JSON.parse(JSON.stringify(defaults));
    window.keybinds = JSON.parse(JSON.stringify(defaults));
    try {
      const saved = localStorage.getItem("gd_keybinds");
      if (saved) {
        const parsed = JSON.parse(saved);
        for (const id in defaults) {
          if (Array.isArray(parsed[id])) {
            window.keybinds[id] = [...new Set(parsed[id].map(window.kbFromLegacy))].slice(0, 4);
          }
        }
        this._saveKeybinds();
      }
    } catch (e) {}
  }
  _saveKeybinds() {
    localStorage.setItem("gd_keybinds", JSON.stringify(window.keybinds));
  }

  _startGame() {
    if (!this._menuActive) {
      return;
    }
    const _instant = !!this._instantLevelStart;
    this._instantLevelStart = false;
    const _dismiss = (target, tweenProps, cleanup) => {
      if (!target) return;
      if (_instant) {
        cleanup();
        return;
      }
      this.tweens.killTweensOf(target);
      this.tweens.add({
        targets: target,
        ...tweenProps,
        onComplete: cleanup
      });
    };

    this._bestPercent = parseFloat(localStorage.getItem("bestPercent_" + (window.currentlevel[2] || "level_1")) || "0");
    this._practiceBestPercent = parseFloat(localStorage.getItem("practiceBestPercent_" + (window.currentlevel[2] || "level_1")) || "0");

    this._menuActive = false;
    this._practiceBypassPending = false;
    this._slideIn = true;
    if (this._menuGlitter) {
      this._menuGlitter.destroy();
      this._menuGlitter = null;
    }
    if (this._menuNewgroundsBtn) {
      this._menuNewgroundsBtn.setVisible(false);
    }
    if (this._menuSettingsBtn) {
      this._menuSettingsBtn.setVisible(false);
    }
    if (this._menuAchievementsBtn) {
      this._menuAchievementsBtn.setVisible(false);
    }
    if (this._menuStatsBtn) {
      this._menuStatsBtn.setVisible(false);
    }
    _dismiss(this._playBtn, { scale: 0.01, duration: 200, ease: "Quad.In" }, () => {
      this._playBtn.destroy();
      this._playBtn = null;
    });

    if (this._iconBtn) {
      this._closeIconSelector && this._closeIconSelector(true);
      _dismiss(this._iconBtn, { scale: 0.01, duration: 200, ease: "Quad.In" }, () => {
        this._iconBtn.destroy();
        this._iconBtn = null;
      });
    }
    _dismiss(this._chrSelDecor, { y: screenHeight + 100, alpha: 0, duration: 200, ease: "Quad.In" }, () => {
      if (this._chrSelDecor) { this._chrSelDecor.destroy(); this._chrSelDecor = null; }
    });
    _dismiss(this._lvlEditDecor, { y: screenHeight + 100, alpha: 0, duration: 200, ease: "Quad.In" }, () => {
      if (this._lvlEditDecor) { this._lvlEditDecor.destroy(); this._lvlEditDecor = null; }
    });

    if (this._creatorBtn) {
      this._closeCreatorMenu && this._closeCreatorMenu(true);
      this._closeSearchMenu && this._closeSearchMenu(true);
      _dismiss(this._creatorBtn, { scale: 0.01, duration: 200, ease: "Quad.In" }, () => {
        this._creatorBtn.destroy();
        this._creatorBtn = null;
      });
    }
    _dismiss(this._robLogo, { y: screenHeight + (this._robLogo ? this._robLogo.height : 0), duration: 300, ease: "Quad.In" }, () => {
      this._robLogo.destroy();
      this._robLogo = null;
    });
    _dismiss(this._copyrightText, { y: 680, duration: 300, ease: "Quad.In" }, () => {
      this._copyrightText.destroy();
      this._copyrightText = null;
    });
    _dismiss(this._menuFsBtn, { y: this._menuFsBtn ? -this._menuFsBtn.height : 0, duration: 300, ease: "Quad.In" }, () => {
      this._menuFsBtn.destroy();
      this._menuFsBtn = null;
    });
    _dismiss(this._menuInfoBtn, { y: this._menuInfoBtn ? -this._menuInfoBtn.height : 0, duration: 300, ease: "Quad.In" }, () => {
      this._menuInfoBtn.destroy();
      this._menuInfoBtn = null;
    });
    this._closeInfoPopup();
    _dismiss(this._tryMeImg, { y: this._tryMeImg ? -this._tryMeImg.height : 0, duration: 300, ease: "Quad.In" }, () => {
      this._tryMeImg.destroy();
      this._tryMeImg = null;
    });
    if (this._downloadBtns) {
      for (const _0xaa3a95 of this._downloadBtns) {
        _dismiss(_0xaa3a95, { y: screenHeight + _0xaa3a95.height, duration: 300, ease: "Quad.In" }, () => _0xaa3a95.destroy());
      }
      this._downloadBtns = null;
    }
    if (this._socialIcons && this._socialIcons.length > 0) {
      for (const _icon of this._socialIcons) {
        _dismiss(_icon, { y: screenHeight + 64, duration: 300, ease: "Quad.In" }, () => _icon.destroy());
      }
      this._socialIcons = [];
    }
    _dismiss(this._logo, { y: this._logo ? -this._logo.height : 0, duration: 300, ease: "Quad.In" }, () => {
      this._logo.destroy();
      this._logo = null;
    });

    if (window.isEditor) {
        this._audio.stopMusic();
        this._cameraX = 0;
        this._cameraY = 0;
        this._playerWorldX = 0;
        this._level.additiveContainer.setVisible(true);
        this._level.container.setVisible(true);
        this._level.topContainer.setVisible(true);
        this._player.setCubeVisible(false);
        this._player2.setCubeVisible(false);
        this._attemptsLabel.setVisible(false);
        window.selectedObjId = 1;
        this._levelEditor._initEditorLogic();
        return;
    }
    this._cameraX = -centerX;
    this._cameraY = 0;
    this._cameraXRef._v = this._cameraX;
    this._prevCameraX = this._cameraX;
    const _0x22e36e = this._cameraX - (this._menuCameraX || 0);
    this._level.shiftGroundTiles(_0x22e36e);
    this._playerWorldX = this._cameraX;
    let speedKey = parseInt(window.settingsMap["kA4"] || "0");
    if (speedKey == 0) {
      playerSpeed = SpeedPortal.ONE_TIMES;
    } else if (speedKey == 1) {
      playerSpeed = SpeedPortal.HALF;
    } else if (speedKey == 2) {
      playerSpeed = SpeedPortal.TWO_TIMES;
    } else if (speedKey == 3) {
      playerSpeed = SpeedPortal.THREE_TIMES;
    } else if (speedKey == 4) {
      playerSpeed = SpeedPortal.FOUR_TIMES;
    }
    this._state.y = 30;
    this._state.onGround = true;
    this._level.additiveContainer.setVisible(true);
    this._level.container.setVisible(true);
    this._level.topContainer.setVisible(true);
    this._player.setCubeVisible(true);
    this._player.reset();
    this._isDual = false;
    this._state2.reset();
    this._player2.reset();
    this._player2.setCubeVisible(false);
    this._player2.setShipVisible(false);
    this._player2.setBallVisible(false);
    this._player2.setWaveVisible(false);
    this._player2.setBirdVisible?.(false);
    this._player2.setSpiderVisible(false);
    this._player2.setRobotVisible(false);
    this._levelAttempts = 1;
    this._levelJumps = 0;
    this._level._setRodframe?.(1);
    this._attempts++;
    localStorage.setItem("gd_totalAttempts", this._attempts);
    this._bumpLevelStat("Attempts");
    this._attemptsLabel.setText("Attempt " + this._levelAttempts);
    this._attemptsLabel.setVisible(true);
    this._positionAttemptsLabel();
    let gamemode = parseInt(window.settingsMap["kA2"] || "0");
    if (gamemode == 1) {
      this._player.enterShipMode(); 
    } else if (gamemode == 2) {
      this._state.y = 30;
      this._player.enterBallMode({ y: 30 });
    } else if (gamemode == 3) {
      this._player.enterUfoMode();
    } else if (gamemode == 4) {
      this._player.enterWaveMode();
    } else if (gamemode == 5) {
      this._player.enterRobotMode();
    } else if (gamemode == 6) {
      this._player.enterSpiderMode();
    }

    this._level.resetObjects();
    this._level.resetGroundState();
    this._level.resetColorTriggers();
    this._level.resetAlphaTriggers();
    this._level.resetRotateTriggers();
    this._level.resetPulseTriggers();
    this._level.resetEnterEffectTriggers();
    this._level.resetSpawnTriggers();
    this._level.resetMoveTriggers();
    this._level.resetStopTriggers?.();
    this._level.resetFollowPlayerYTriggers?.();
    this._level.resetFollowTriggers?.();
    this._level.resetToggleTriggers?.();
    this._level.resetAnimationTriggers?.();
    this._level.resetShakeTriggers?.();
    this._level.resetChannelBlending?.();
    this._level.resetPlayerVisibilityTriggers?.();
    this._level.resetOnDeathTriggers?.();
    this._level.resetTouchTriggers?.();
    this._level.resetPickupTriggers?.();
    this._level.resetCountTriggers?.();
    this._level.resetCollisionTriggers?.();
    this._level.resetInstantCountTriggers?.();
    this._level.checkPickupTriggers?.(0, this._colorManager);
    this._level.checkCountTriggers?.(0, this._colorManager);
    this._level.checkCollisionTriggers?.(0);
    this._level.checkInstantCountTriggers?.(0, this._colorManager);
    this._level.checkOnDeathTriggers?.(0);
    this._level.checkTouchTriggers?.(0);
    this._level.resetVisibility();
    if (this._orbGfx) { this._orbGfx.clear(); }
    this._colorManager.reset();

    this._applyLevelStartOptions();
    this._level.checkToggleTriggers?.(0);
  }
  _pushButton(ignoreMacro = false) {
    const objectsUnderPointer = this.input.manager.hitTest(
      this.input.activePointer,
      this._startPosGui.list,
      this.cameras.main
    );
    const isOverUI = objectsUnderPointer.length > 0;
    const fromClick = this.input.activePointer.isDown;
    const cancelInput = isOverUI && fromClick;

    if (this._menuActive) {
      this._audio.playEffect("playSound_01", {
        volume: 1
      });
      this._startGame();
      return;
    }

    if (!this._slideIn && !this._state.isDead && !cancelInput) {
      this._state.upKeyDown = true;
      this._state.upKeyPressed = true;
      this._state.queuedHold = true;
      this._state._orbActivationConsumedForPress = false;
      if (this._isDual && !this._state2.isDead) {
        this._state2.upKeyDown = true;
        this._state2.upKeyPressed = true;
        this._state2.queuedHold = true;
        this._state2._orbActivationConsumedForPress = false;
      }
      const _dualImmediateBeforeGravity = !!this._state.gravityFlipped;
      let _primaryImmediateJumped = false;
      if (!this._state.isFlying && !this._state.isWave && !this._state.isUfo && this._state.canJump) {
        this._player.updateJump(0);
        _primaryImmediateJumped = true;
      } else if (this._state.isUfo) {
        if (!this._player._shouldPrioritizeUfoOrbInput?.()) {
          this._player.updateJump(0);
          _primaryImmediateJumped = true;
        }
      }
      const _primaryImmediateGravityChanged = this._isDual && !!this._state.gravityFlipped !== _dualImmediateBeforeGravity;
      let _primaryImmediateGravitySynced = false;
      if (_primaryImmediateGravityChanged) {
        _primaryImmediateGravitySynced = this._syncDualGlobalsFromPrimary({
          skipBallInputGravity: this._state.isBall && _primaryImmediateJumped,
          skipSpiderInputGravity: this._state.isSpider && _primaryImmediateJumped
        });
      }
      if (this._isDual && !this._state2.isDead) {
        if (this._shouldSuppressDualGravityAction(this._state2, _primaryImmediateGravitySynced)) {
          this._state2.upKeyPressed = false;
          this._state2.queuedHold = false;
        }
        const _secondaryImmediateBeforeGravity = !!this._state2.gravityFlipped;
        const _secondaryImmediateBallInput = this._state2.isBall && this._state2.upKeyPressed;
        const _secondaryImmediateSpiderInput = this._state2.isSpider && this._state2.upKeyPressed;
        if (!this._state2.isFlying && !this._state2.isWave && !this._state2.isUfo && this._state2.canJump) {
          this._player2.updateJump(0);
        } else if (this._state2.isUfo) {
          if (!this._player2._shouldPrioritizeUfoOrbInput?.()) {
            this._player2.updateJump(0);
          }
        }
        if (!!this._state2.gravityFlipped !== _secondaryImmediateBeforeGravity) {
          this._syncDualGlobalsFromSecondary({
            skipBallInputGravity: _secondaryImmediateBallInput,
            skipSpiderInputGravity: _secondaryImmediateSpiderInput
          });
        }
      }
      if (_primaryImmediateJumped) {
        this._totalJumps++;
        this._levelJumps++;
        localStorage.setItem("gd_totalJumps", this._totalJumps);
        this._bumpLevelStat("Jumps");
      }
    }

  }
  _otherJumpInputHeld(pointer) {
    if (window.kbIsDown?.("jump")) return true;
    const ev = pointer?.event;
    if (!ev) return false;
    if (typeof ev.buttons === "number") return ev.buttons !== 0;
    if (ev.touches) return ev.touches.length > 0;
    return false;
  }
  _releaseButton(ignoreMacro = false) {
    this._state.robotTouchedPad = true;
    this._state2.robotTouchedPad = true;
    this._state.upKeyDown = false;
    this._state.upKeyPressed = false;
    this._state.queuedHold = false;
    this._state._orbActivationConsumedForPress = false;
    this._state2.upKeyDown = false;
    this._state2.upKeyPressed = false;
    this._state2.queuedHold = false;
    this._state2._orbActivationConsumedForPress = false;
  }
  _initMacroBot() {
    this._macroBot = new MacroBot(this);
    window.macroBot = this._macroBot;
  }
  _startMacroRecording(meta = {}) {
    if (!this._macroBot) this._initMacroBot();
    this._macroBot.startRecording({
      level: window.currentlevel?.[2] || "",
      ...meta
    });
  }
  _stopMacroRecording() {
    if (!this._macroBot) return null;
    return this._macroBot.stopRecording();
  }
  _startMacroPlayback(macroData) {
    console.log(macroData);
    if (!this._macroBot) this._initMacroBot();
    this._macroBot.startPlayback(macroData);
  }
  _stopMacroPlayback() {
    if (this._macroBot) this._macroBot.stopPlayback();
  }
  _exportMacroFile(filename = null) {
    if (!this._macroBot) return;
    const safeName = (filename || `${window.currentlevel?.[2] || "macro"}.gdr`)
      .replace(/[^\w.\-]+/g, "_");
    this._macroBot.download(safeName);
  }
  _importMacroFile() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".wbgdr2";

    fileInput.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        if (!this._macroBot) this._initMacroBot();

        const macroData = await this._macroBot.importFile(file);
        this._macroBot.frames = Array.isArray(macroData.frames) ? macroData.frames.slice() : [];
        const fallback = file.name.replace(/\.[^/.]+$/, "");
        const macroName = macroData.meta?.name || fallback;

        this._macroBot.meta = macroData.meta || this._macroBot.meta;
        this._macroBot.meta.name = macroName;

        this._macroName = macroName;
        this._macroLoaded = true;
      } catch (err) {
        alert("Failed to import: " + err.message);
      }
    };

    fileInput.click();
  }
  _resetGameplayState() {
    this._cameraX = -centerX;
    this._cameraY = 0;
    this._cameraXRef._v = -centerX;
    this._prevCameraX = -centerX;
    this._playerWorldX = 0;
    this._deltaBuffer = 0;
    this._deathTimer = 0;
    this._deathSoundPlayed = false;
    this._newBestShown = false;
    this._hadNewBest = false;
    this._levelWon = false;
    this._endCameraOverride = false;
    this._endCamTween = null;
    this._spaceWasDown = false;
    this._physicsFrame = 0;
    this._pendingMusicOffset = null;
    this._mirrorAnimating = false;
  }
  _restartLevel() {
    this._attempts++;
    localStorage.setItem("gd_totalAttempts", this._attempts);
    this._bumpLevelStat("Attempts");
    this._levelAttempts++;
    this._levelJumps = 0;
    const _0x2ba78a = this._cameraX;
    if (this._levelWon && this._practicedMode.practiceMode) {
      this._practicedMode.togglePracticeMode();
      this._practicedMode.clearCheckpoints();
      if (this._checkpointBtnContainer) {
        this._checkpointBtnContainer.setVisible(false);
      }
    }
    if (this._practicedMode.practiceMode) {
      const checkpoint = this._practicedMode.loadLastCheckpoint();
      if (checkpoint) {
        this._respawnFromCheckpoint();
        return;
      }
    }
    this._practicedMode.clearCheckpoints();
    this._resetGameplayState();
    this._state.reset();
    this._player.reset();
    this._isDual = false;
    this._state2.reset();
    this._player2.reset();
    this._player2.setCubeVisible(false);
    this._player2.setShipVisible(false);
    this._player2.setBallVisible(false);
    this._player2.setWaveVisible(false);
    this._player2.setBirdVisible?.(false);
    this._player2.setSpiderVisible(false);
    this._player2.setRobotVisible(false);
    this._glitterEmitter.stop();
    let speedKey = parseInt(window.settingsMap["kA4"] || "0");
    if (speedKey == 0) {
      playerSpeed = SpeedPortal.ONE_TIMES;
    } else if (speedKey == 1) {
      playerSpeed = SpeedPortal.HALF;
    } else if (speedKey == 2) {
      playerSpeed = SpeedPortal.TWO_TIMES;
    } else if (speedKey == 3) {
      playerSpeed = SpeedPortal.THREE_TIMES;
    } else if (speedKey == 4) {
      playerSpeed = SpeedPortal.FOUR_TIMES;
    }
    this._level.resetObjects();
    this._level.shiftGroundTiles(this._cameraX - _0x2ba78a);
    this._level.resetGroundState();
    this._level.resetColorTriggers();
    this._level.resetAlphaTriggers();
    this._level.resetRotateTriggers();
    this._level.resetPulseTriggers();
    this._level.resetEnterEffectTriggers();
    this._level.resetSpawnTriggers();
    this._level.resetMoveTriggers();
    this._level.resetStopTriggers?.();
    this._level.resetFollowPlayerYTriggers?.();
    this._level.resetFollowTriggers?.();
    this._level.resetToggleTriggers?.();
    this._level.resetAnimationTriggers?.();
    this._level.resetShakeTriggers?.();
    this._level.resetChannelBlending?.();
    this._level.resetPlayerVisibilityTriggers?.();
    this._level.resetOnDeathTriggers?.();
    this._level.resetTouchTriggers?.();
    this._level.resetPickupTriggers?.();
    this._level.resetCountTriggers?.();
    this._level.resetCollisionTriggers?.();
    this._level.resetInstantCountTriggers?.();
    this._level.checkToggleTriggers?.(0);
    this._level.checkPickupTriggers?.(0, this._colorManager);
    this._level.checkCountTriggers?.(0, this._colorManager);
    this._level.checkCollisionTriggers?.(0);
    this._level.checkInstantCountTriggers?.(0, this._colorManager);
    this._level.checkOnDeathTriggers?.(0);
    this._level.checkTouchTriggers?.(0);
    this._level.resetVisibility();
    if (this._orbGfx) { this._orbGfx.clear(); }
    this._colorManager.reset();
    this._player.noclipStats.totalFrames = 0;
    this._player.noclipStats.deathFrames = 0;
    this._player.noclipStats.deaths = 0;

    const musicOffset = this._getStartPosMusicOffset();
    const startPositions = this._level.getStartPositions();
    const activeStartPos = this._startPosIndex !== -1 && !!startPositions[this._startPosIndex];

    if (activeStartPos) {
      const rawPos = startPositions[this._startPosIndex];
      const pos = window.smartStartPos ? { ...rawPos, ...this._getSmartStartPosSettings(rawPos) } : rawPos;
      const startPosY = Number.isFinite(Number(pos.y)) ? Number(pos.y) : 30;

      this._playerWorldX = pos.x;
      this._state.y = startPosY;
      this._state.lastY = startPosY;
      this._state.lastGroundPosY = startPosY;
      if (pos.gameMode == 1) {
        this._player.enterShipMode();
      } else if (pos.gameMode == 2) {
        this._state.y = startPosY;
        this._player.enterBallMode({ y: startPosY });
      } else if (pos.gameMode == 3) {
        this._player.enterUfoMode();
      } else if (pos.gameMode == 4) {
        this._player.enterWaveMode();
      } else if (pos.gameMode == 5) {
        this._player.enterRobotMode();
      } else if (pos.gameMode == 6) {
        this._player.enterSpiderMode();
      }
      this._state.gravityFlipped = pos.gravityFlipped;
      this._state.isMini = pos.miniMode;
      playerSpeed = [
        SpeedPortal.ONE_TIMES,
        SpeedPortal.HALF,
        SpeedPortal.TWO_TIMES,
        SpeedPortal.THREE_TIMES,
        SpeedPortal.FOUR_TIMES
      ][pos.speed];
      this._state.mirrored = pos.mirrored;
      this._mirrorAnimating = false;
      if (pos.dualMode) {
        this._enableDualMode();
      }
      this._level.fastForwardTriggers(pos.x, this._colorManager);
      if (typeof this._level.updateMoveTriggers === 'function') {
        const speed = window.speedHack || 1;
        this._level.updateMoveTriggers(0, speed);
      }
      if (this._player) {
        this._player._lastCollisionWorldX = Number.isFinite(Number(this._playerWorldX)) ? Number(this._playerWorldX) : null;
        this._player._lastCollisionWorldY = startPosY;
      }
    }

    this._practiceBypassPending = false;
    this._audio.reset();
    this._pendingMusicOffset = musicOffset;
    this._paused = false;
    if (this._pauseContainer) {
      this._pauseContainer.destroy();
      this._pauseContainer = null;
    }
    this._pauseBtn.setVisible(true).setAlpha(window.hidePauseBtn ? 0 : 75 / 255);
    if (this._practiceModeBarContainer) {
      this._practiceModeBarContainer.setVisible(this._practicedMode && this._practicedMode.practiceMode);
    }
    this._attemptsLabel.setText("Attempt " + this._levelAttempts);
    this._attemptsLabel.setVisible(true);
    this._positionAttemptsLabel();
    if (!activeStartPos) {
      let gamemode = parseInt(window.settingsMap["kA2"] || "0");
      if (gamemode == 1) {
        this._player.enterShipMode();
      } else if (gamemode == 2) {
        this._state.y = 30;
        this._player.enterBallMode({ y: 30 });
      } else if (gamemode == 3) {
        this._player.enterUfoMode();
      } else if (gamemode == 4) {
        this._player.enterWaveMode();
      } else if (gamemode == 5) {
        this._player.enterRobotMode();
      } else if (gamemode == 6) {
        this._player.enterSpiderMode();
      }

      this._applyLevelStartOptions();
    }

    if (this._player && this._player._hitboxTrail) {
      this._player._hitboxTrail = [];
    }
    if (this._player?._hitboxGraphics) this._player._hitboxGraphics.clear();
    if (this._player2 && this._player2._hitboxTrail) {
      this._player2._hitboxTrail = [];
    }
    if (this._player2?._hitboxGraphics) this._player2._hitboxGraphics.clear();

    if (this._macroBot?.recording == true){
      this._macroBot?.clearRecording();
    }
    if (this._macroBot?.playing == true){
      this._macroBot?.clearPlayback();
    }
    this._level._updateGlowVisibility?.();
    this._updateCameraY(0, true);
  }
  _getSongOffsetForWorldX(worldX) {
    const startX = Number.isFinite(Number(worldX)) ? Number(worldX) : 0;
    return this._level?.getSongOffsetForX
      ? this._level.getSongOffsetForX(startX, { sourceObjects: window.levelObjects })
      : Math.max(0, startX) / 623.16;
  }
  _getStartPosMusicOffset(){
    const startPositions = this._level.getStartPositions();
    if (this._startPosIndex !== -1 && startPositions[this._startPosIndex]) {
      return this._getSongOffsetForWorldX(startPositions[this._startPosIndex].x);
    }
    return 0;
  }
  _getCurrentMusicSyncOffset() {
    if (this._startPosIndex !== -1 && this._playerWorldX <= 0) {
      return this._getStartPosMusicOffset();
    }
    return this._getSongOffsetForWorldX(this._playerWorldX);
  }
  _respawnFromCheckpoint() {
    const checkpoint = this._practicedMode.loadLastCheckpoint();
    if (!checkpoint) {
      this._restartLevel();
      return;
    }
    this._deathTimer = 0;
    this._deathSoundPlayed = false;
    this._newBestShown = false;
    this._state.isDead = false;
    this._slideIn = false;
    this._playerWorldX = checkpoint.x;
    this._cameraX = checkpoint.cameraX;
    this._cameraY = checkpoint.cameraY;
    this._cameraXRef._v = this._cameraX;
    this._state.y = checkpoint.y;
    this._state.yVelocity = checkpoint.yVelocity;
    this._state.gravityFlipped = checkpoint.gravityFlipped;
    this._state.isMini = checkpoint.isMini;
    this._state.isCube = checkpoint.isCube;
    this._state.isShip = checkpoint.isShip;
    this._state.isBall = checkpoint.isBall;
    this._state.isUfo = checkpoint.isUfo;
    this._state.isWave = checkpoint.isWave;
    this._state.isSpider = checkpoint.isSpider;
    this._state.isBird = checkpoint.isBird;
    this._state.isDart = checkpoint.isDart;
    this._state.isRobot = checkpoint.isRobot;
    this._state.isSwing = checkpoint.isSwing;
    this._state.isJetpack = checkpoint.isJetpack;
    this._state.isFlying = checkpoint.isFlying;
    this._state.isJumping = checkpoint.isJumping;
    this._state.onGround = checkpoint.onGround;
    this._state.canJump = checkpoint.canJump;
    this._state.wasBoosted = checkpoint.wasBoosted;
    this._state.rotation = checkpoint.rotation;
    this._state.gravity = checkpoint.gravity;
    this._state.jumpPower = checkpoint.jumpPower;
    this._state.mirrored = checkpoint.mirrored;
    this._mirrorAnimating = false;
    this._state.isDashing = checkpoint.isDashing;
    this._state.dashYVelocity = checkpoint.dashYVelocity;
    this._state.ballShouldRotate = checkpoint.ballShouldRotate || false;
    this._state.ballRotateOpposite = checkpoint.ballRotateOpposite || false;
    this._state.ballNormalRotate = checkpoint.ballNormalRotate || 1;
    this._state.ballHitPad = checkpoint.ballHitPad || false;
    this._state._robotHold = !!checkpoint.robotHold;
    this._state._robotHoldTimer = checkpoint.robotHoldTimer || 0;

    const checkpointRotation = Number.isFinite(Number(checkpoint.rotation)) ? Number(checkpoint.rotation) : 0;
    const checkpointRotateActionActive = checkpoint.rotateActionActive !== undefined ? !!checkpoint.rotateActionActive: undefined;

    this._player.reset();
    this._player._ignoreTeleportUntilClear = true;
    this._state.isFlying = false;
    this._state.isBall = false;
    this._state.isWave = false;
    this._state.isUfo = false;
    this._state.isSpider = false;
    this._state.isRobot = false;
    this._state.isBird = false;
    if (checkpoint.isFlying) {
      this._player.enterShipMode(null, true); // dont mess with y velocity if ur loading a checkpoint
    } else if (checkpoint.isBall) {
      this._player.enterBallMode();
    } else if (checkpoint.isUfo) {
      this._player.enterUfoMode(null, true); // dont mess with y velocity if ur loading a checkpoint
    } else if (checkpoint.isWave) {
      this._player.enterWaveMode();
    } else if (checkpoint.isRobot) {
      this._player.enterRobotMode();
    } else if (checkpoint.isSpider) {
      this._player.enterSpiderMode();
    } else if (checkpoint.isBird) {
      this._player.setBirdVisible(true);
      this._player.setCubeVisible(true);
      for (const layer of this._player._playerLayers) {
        if (layer) {
          layer.sprite.setScale(0.55);
        }
      }
    } else {
      this._player.setCubeVisible(true);
    }
    this._state.isFlying = checkpoint.isFlying;
    this._state.isBall = checkpoint.isBall;
    this._state.isWave = checkpoint.isWave;
    this._state.isUfo = checkpoint.isUfo;
    this._state.isSpider = checkpoint.isSpider;
    this._state.isRobot = checkpoint.isRobot;
    this._state.isBird = checkpoint.isBird;
    this._state._robotHold = !!checkpoint.robotHold;
    this._state._robotHoldTimer = checkpoint.robotHoldTimer || 0;

    this._state.rotation = checkpointRotation;
    this._player._rotation = checkpointRotation;
    if (typeof this._player.setRotation === "function") {
      try { this._player.setRotation(checkpointRotation); } catch (_) {}
    }
    if (checkpointRotateActionActive !== undefined) {
      this._player.rotateActionActive = checkpointRotateActionActive;
    }

    this._state.ignorePortals = true;
    this._state2.ignorePortals = true;
    this._level.resetGroundTiles(this._cameraX);
    this._level.resetObjects();
    this._level._flyFloorY = checkpoint.flyFloorY !== undefined
      ? checkpoint.flyFloorY
      : (this._level._flyFloorY ?? 0);
    this._level._flyCeilingY = checkpoint.flyCeilingY;
    this._level._flyGroundActive = checkpoint.flyGroundActive;
    this._level._flyVisualOnly = checkpoint.flyVisualOnly;
    this._level._flyVisualFloorInset = checkpoint.flyVisualFloorInset !== undefined
      ? checkpoint.flyVisualFloorInset
      : (this._level._flyVisualFloorInset ?? 0);
    this._level._flyVisualCeilingInset = checkpoint.flyVisualCeilingInset !== undefined
      ? checkpoint.flyVisualCeilingInset
      : (this._level._flyVisualCeilingInset ?? 0);
    this._level._groundTargetValue = checkpoint.groundTargetValue;
    this._level.flyCameraTarget = checkpoint.flyCameraTarget;
    this._level._groundAnimating = checkpoint.groundAnimating;
    this._level._groundAnimFrom = checkpoint.groundAnimFrom;
    this._level._groundAnimTo = checkpoint.groundAnimTo;
    this._level._groundAnimTime = checkpoint.groundAnimTime;
    this._level._groundAnimDuration = checkpoint.groundAnimDuration;
    this._level._groundStartScreenY = checkpoint.groundStartScreenY !== undefined
      ? checkpoint.groundStartScreenY - (checkpoint.cameraY || 0) + this._cameraY
      : b(0) + this._cameraY;
    this._level._ceilingStartScreenY = checkpoint.ceilingStartScreenY
      - (checkpoint.cameraY || 0) + this._cameraY;
    this._level._groundY = checkpoint.groundY;
    this._level._ceilingY = checkpoint.ceilingY;
    if (typeof checkpoint.speed === "number") {
      playerSpeed = checkpoint.speed;
    } else {
      let speedKey = parseInt(window.settingsMap["kA4"] || "0");
    if (speedKey == 0) {
      playerSpeed = SpeedPortal.ONE_TIMES;
      } else if (speedKey == 1) {
      playerSpeed = SpeedPortal.HALF;
    } else if (speedKey == 2) {
      playerSpeed = SpeedPortal.TWO_TIMES;
    } else if (speedKey == 3) {
      playerSpeed = SpeedPortal.THREE_TIMES;
    } else if (speedKey == 4) {
      playerSpeed = SpeedPortal.FOUR_TIMES;
    }
    }
    if (checkpoint.dualMode) {
      this._isDual = false;
      this._dualBallOverlapResolved = false;
      this._dualBallSpawnGravityLock = false;
      this._state2.reset();
      this._player2.reset();
      this._player2._ignoreTeleportUntilClear = true;
      this._player2.setInvertedColors?.(true);
      this._enableDualMode();
      this._state2.isDead = false;
      if (Number.isFinite(Number(checkpoint.dualY))) this._state2.y = Number(checkpoint.dualY);
      if (Number.isFinite(Number(checkpoint.dualYVelocity))) this._state2.yVelocity = Number(checkpoint.dualYVelocity);
      if (checkpoint.dualIsMini !== undefined) this._state2.isMini = !!checkpoint.dualIsMini;
      if (checkpoint.dualGameMode) this._setPlayerGamemode(this._player2, this._state2, checkpoint.dualGameMode, true);
      if (checkpoint.dualGravityFlipped !== undefined) this._state2.gravityFlipped = !!checkpoint.dualGravityFlipped;
      if (checkpoint.dualOnGround !== undefined) this._state2.onGround = !!checkpoint.dualOnGround;
      if (checkpoint.dualOnCeiling !== undefined) this._state2.onCeiling = !!checkpoint.dualOnCeiling;
      if (checkpoint.dualCanJump !== undefined) this._state2.canJump = !!checkpoint.dualCanJump;
      if (checkpoint.dualIsJumping !== undefined) this._state2.isJumping = !!checkpoint.dualIsJumping;
      this._copyDualInputFlags(this._state, this._state2);
      this._ensureDualFlyBounds(this._state.y);
    } else {
      this._isDual = false;
      this._state2.reset();
      this._player2.reset();
      this._player2.setCubeVisible(false);
      this._player2.setShipVisible(false);
      this._player2.setBallVisible(false);
      this._player2.setWaveVisible(false);
      this._player2.setBirdVisible?.(false);
      this._player2.setSpiderVisible(false);
      this._player2.setRobotVisible(false);
      if (this._player2?._hitboxGraphics) this._player2._hitboxGraphics.clear();
      if (this._player2) this._player2._hitboxTrail = [];
    }
    this._level.resetColorTriggers();
    this._level.resetAlphaTriggers();
    this._level.resetRotateTriggers();
    this._level.resetPulseTriggers();
    this._level.resetEnterEffectTriggers();
    this._level.resetSpawnTriggers();
    this._level.resetMoveTriggers();
    this._level.resetStopTriggers?.();
    this._level.resetFollowPlayerYTriggers?.();
    this._level.resetFollowTriggers?.();
    this._level.resetToggleTriggers?.();
    this._level.resetAnimationTriggers?.();
    this._level.resetShakeTriggers?.();
    this._level.resetChannelBlending?.();
    this._level.resetPlayerVisibilityTriggers?.();
    this._level.resetOnDeathTriggers?.();
    this._level.resetTouchTriggers?.();
    this._level.resetPickupTriggers?.();
    this._level.resetCountTriggers?.();
    this._level.resetCollisionTriggers?.();
    this._level.resetInstantCountTriggers?.();
    this._level.checkToggleTriggers?.(checkpoint.x);
    this._level.checkPickupTriggers?.(checkpoint.x, this._colorManager);
    this._level.checkCountTriggers?.(checkpoint.x, this._colorManager);
    this._level.checkCollisionTriggers?.(checkpoint.x);
    this._level.checkInstantCountTriggers?.(checkpoint.x, this._colorManager);
    this._level.checkOnDeathTriggers?.(checkpoint.x);
    this._level.checkTouchTriggers?.(checkpoint.x);
    this._level.resetVisibility();
    this._level.applyShakeToOffsets?.(this.time.now);
    this._level.additiveContainer.x = -this._cameraX + (this._level.shakeOffsetX || 0);
    this._level.additiveContainer.y = this._cameraY + (this._level.shakeOffsetY || 0);
    this._level.container.x = -this._cameraX + (this._level.shakeOffsetX || 0);
    this._level.container.y = this._cameraY + (this._level.shakeOffsetY || 0);
    this._level.topContainer.x = -this._cameraX + (this._level.shakeOffsetX || 0);
    this._level.topContainer.y = this._cameraY + (this._level.shakeOffsetY || 0);
    this._level.updateVisibility(this._cameraX);
    this._level.updateObjectDebugIds();
    this._updateBackground();
    this._applyMirrorEffect();
    this._practiceBypassPending = false;
    if (window.practiceMusicSync) {
      this._audio.startMusic(this._getSongOffsetForWorldX(checkpoint.x));
    } else if (!this._audio.musicPlaying) {
      this._audio.startMusic();
    }

    if (this._player && this._player._hitboxTrail) {
      this._player._hitboxTrail = [];
    }
    if (this._player?._hitboxGraphics) this._player._hitboxGraphics.clear();
    if (this._player2 && this._player2._hitboxTrail) {
      this._player2._hitboxTrail = [];
    }
    if (this._player2?._hitboxGraphics) this._player2._hitboxGraphics.clear();

    this._deltaBuffer = 0;
    this._physicsFrame = checkpoint.physicsFrame;
    if (this._macroBot?.recording == true){
      this._macroBot.rollbackRecording(this._physicsFrame);
    }
    if (this._macroBot?.playing == true){
      this._macroBot?.rollbackPlayback(this._physicsFrame);
    }
    this._level._updateGlowVisibility?.();
  }
  _createMirroredBackgroundTexture(textureKey) {
    const mirroredKey = textureKey + "__mirror_y_loop";
    if (this.textures.exists(mirroredKey)) return mirroredKey;

    const texture = this.textures.get(textureKey);
    const source = texture?.source?.[0];
    const image = source?.image || source?.canvas;
    const width = source?.width || image?.width || image?.naturalWidth || 0;
    const height = source?.height || image?.height || image?.naturalHeight || 0;

    if (!image || width <= 0 || height <= 0 || !this.textures.createCanvas) {
      return textureKey;
    }

    try {
      const mirroredTexture = this.textures.createCanvas(mirroredKey, width, height * 2);
      const ctx = mirroredTexture.getContext();
      ctx.clearRect(0, 0, width, height * 2);
      ctx.drawImage(image, 0, 0, width, height, 0, 0, width, height);
      ctx.save();
      ctx.translate(0, height * 2);
      ctx.scale(1, -1);
      ctx.drawImage(image, 0, 0, width, height, 0, 0, width, height);
      ctx.restore();
      mirroredTexture.refresh();
      return mirroredKey;
    } catch (err) {
      console.warn("Failed to create mirrored background texture", textureKey, err);
      if (this.textures.exists(mirroredKey)) this.textures.remove(mirroredKey);
      return textureKey;
    }
  }

  _applyMirroredBackgroundTexture(textureKey) {
    const texture = this.textures.get(textureKey);
    const source = texture?.source?.[0];
    const sourceHeight = source?.height || source?.image?.height || source?.image?.naturalHeight || 0;
    const mirroredKey = this._createMirroredBackgroundTexture(textureKey);
    this._bg.setTexture(mirroredKey);
    this._bgInitY = sourceHeight > 0 ? sourceHeight - screenHeight - o : 0;
    this._bgMirrorTileHeight = sourceHeight > 0 ? sourceHeight * 2 : 0;
  }

  _updateBackground() {
    const mirrorDeltaX = this._cameraX - this._prevCameraX;
    const mirrorP = this._mirrorProgress();
    this._bg.tilePositionX += mirrorDeltaX * this._bgSpeedX * (1 - 2 * mirrorP);
    if (mirrorP > 0 && mirrorDeltaX) this._level.shiftGroundTiles(2 * mirrorP * mirrorDeltaX);
    this._prevCameraX = this._cameraX;
    let tileY = this._bgInitY - this._cameraY * this._bgSpeedY;
    if (this._bgMirrorTileHeight > 0) {
      tileY = ((tileY % this._bgMirrorTileHeight) + this._bgMirrorTileHeight) % this._bgMirrorTileHeight;
    }
    this._bg.tilePositionY = tileY;
  }
  _updateCameraY(_0xc7c517, snap = false) {
    let explosionPiece = this._cameraY;
    let _0x1a27be = explosionPiece;
    if (this._level.flyCameraTarget !== null) {
      _0x1a27be = this._level.flyCameraTarget;
    } else {
      let _0x2bc8fb = this._state.y;
      let _0x259956 = 140;
      let _0x5025ec = 80;
      let _0x1f7976 = explosionPiece - (typeof o !== 'undefined' ? o : 0) + 320;
      if (this._state.gravityFlipped) {
        if (_0x2bc8fb > _0x1f7976 + _0x5025ec) {
          _0x1a27be = _0x2bc8fb - 320 - _0x5025ec + (typeof o !== 'undefined' ? o : 0);
        } else if (_0x2bc8fb < _0x1f7976 - _0x259956) {
          _0x1a27be = _0x2bc8fb - 320 + _0x259956 + (typeof o !== 'undefined' ? o : 0);
        }
      } else {
        if (_0x2bc8fb > _0x1f7976 + _0x259956) {
          _0x1a27be = _0x2bc8fb - 320 - _0x259956 + (typeof o !== 'undefined' ? o : 0);
        } else if (_0x2bc8fb < _0x1f7976 - _0x5025ec) {
          _0x1a27be = _0x2bc8fb - 320 + _0x5025ec + (typeof o !== 'undefined' ? o : 0);
        }
      }
    }
    if (_0x1a27be < 0) {
      _0x1a27be = 0;
    }
    if (snap) {
      this._cameraY = _0x1a27be;
    } else if (_0xc7c517 !== 0) {
      explosionPiece += (_0x1a27be - explosionPiece) / (10 / _0xc7c517);
      if (explosionPiece < 0) {
        explosionPiece = 0;
      }
      this._cameraY = explosionPiece;
    }
  }
  _quantizeDelta(_0x654f39) {
    const speed = window.speedHack || 1;
    let _0x578d1b = (_0x654f39 * speed) / 1000 + this._deltaBuffer;
    let _0x53e02e = Math.round(_0x578d1b / u);
    if (_0x53e02e < 0) {
      _0x53e02e = 0;
    }
    if (_0x53e02e > 60) {
      _0x53e02e = 60;
    }
    let _0xd8019e = _0x53e02e * u;
    this._deltaBuffer = _0x578d1b - _0xd8019e;
    return _0xd8019e * 60;
  }
  update(_0x54fa47, deltaTime) {
    this._restoreMirrorTransforms();
    if (this._pauseBtn && window.hidePauseBtn) {
      this._pauseBtn.setAlpha(0);
      if (this._pauseBtn.input && this._pauseBtn.input.enabled) this._pauseBtn.disableInteractive();
    }
    if (this._level && !window.isEditor && this._audio) {
      const currentSpeed = window.speedHack ? Math.sqrt(window.speedHack) : 1;
      const music = this._audio._music;
      try {
        if (music && music.source && typeof music.setRate === "function" && music.rate !== currentSpeed) music.setRate(currentSpeed);
        if (this.sound && this.sound.rate !== currentSpeed) this.sound.rate = currentSpeed;
      } catch (e) {}
    }
    if (window.isEditor) {
        if (this._editorPlaytestActive && !this._editorPlaytestPaused) {
            this._levelEditor._updateEditorPlaytest(deltaTime);
            this._levelEditor._updateEditorGrid();
            this._levelEditor._updateEditorTimeline();
            return;
        }

        if (window.isEditorPause) return;
        const pointer = this.input.activePointer;
        this._hitObjects = this.input.hitTestPointer(pointer);
        this._levelEditor._handleEditorCamera(deltaTime);
        this._levelEditor._updateEditorGrid();
        if (pointer.isDown && !this._isDraggingSlider) {
            if (this._isSwipeEnabled) {
              if (this._editorTab !== "edit") {
                if (this._hitObjects.length !== 0) return;
                const currentGridX = Math.floor((pointer.x + this._cameraX) / 60) * 60;
                const currentGridY = Math.floor((pointer.y + this._cameraY + 20) / 60) * 60;

                if (currentGridX !== this._lastSwipeGridX || currentGridY !== this._lastSwipeGridY) {
                    this._levelEditor._editorAction();
                    this._lastSwipeGridX = currentGridX;
                    this._lastSwipeGridY = currentGridY;
                }
              }
            } else {
                if (!this._isDragging && this._hitObjects.length !== 0) return;
                const dragX = pointer.x - this._clickStartPos.x;
                const dragY = pointer.y - this._clickStartPos.y;
                const dragDistance = Math.sqrt(dragX * dragX + dragY * dragY);
                if (dragDistance > 10) {
                    this._isDragging = true;
                    this._cameraX = this._cameraStartX - dragX;
                    this._cameraY = this._cameraStartY - dragY;
                }
            }
        }
        this._levelEditor._updateEditorTimeline();
        if (this._editorPlaytestActive && this._editorPlaytestPaused) {
            this._levelEditor._refreshEditorPlaytestGlowVisibility();
            this._levelEditor._syncEditorPlaytestPlayerVisual(deltaTime / 1000);
        }
        return;
    }

    let rawPercent = (this._playerWorldX / this._level.endXPos) * 100;
    rawPercent = Math.min(100, Math.max(0, rawPercent));
     const shownPercent = this._levelWon ? (this._interpolatedPercent || 0) : rawPercent;
      if (window.percentageDecimals) {
        const key = 1e9 + Math.round(shownPercent * 100);
        if (!this._labelTextCurrent(this._percentageLabel, key)) this._setLabelText(this._percentageLabel, key, shownPercent.toFixed(2) + "%");
      } else {
        const key = Math.floor(shownPercent);
        if (!this._labelTextCurrent(this._percentageLabel, key)) this._setLabelText(this._percentageLabel, key, key + "%");
      }
      this._percentageLabel.setVisible(window.showPercentage && !this._menuActive);
      this._updateProgressBar(shownPercent);
      const startPosTotal = this._level._startPositions ? this._level._startPositions.length : 0;
    if (startPosTotal !== this._startPosCount) {
      this._startPosCount = startPosTotal;
      if (this._startPosText) this._startPosText.setText(`${this._startPosIndex === -1 ? 0 : this._startPosIndex + 1}/${startPosTotal}`);
    }
    this._startPosGui.setVisible(window.startPosSwitcher && !this._menuActive && this._startPosCount > 0);
    this._startPosGui.setAlpha(window.startPosOpacity);
    this._noclipIndicator.setVisible(window.noClip && !this._menuActive);
    this._accuracyIndicator.setVisible(window.noClip && window.noClipAccuracy && !this._menuActive);
    this._deathsIndicator.setVisible(window.noClip && window.noClipAccuracy && !this._menuActive);
    const noclipStats = this._player.noclipStats;
    const accuracyKey = Math.round(noclipStats.accuracy * 100);
    if (!this._labelTextCurrent(this._accuracyIndicator, accuracyKey)) this._setLabelText(this._accuracyIndicator, accuracyKey, `${noclipStats.accuracy.toFixed(2)}%`);
    if (!this._labelTextCurrent(this._deathsIndicator, noclipStats.deaths)) this._setLabelText(this._deathsIndicator, noclipStats.deaths, `${noclipStats.deaths} Deaths`);

    this._cpsIndicator.setVisible(window.showCPS && !this._menuActive);
    if (this._clickHistory && this._clickHistory.length > 0) {
      const now = this.time.now;
      let expired = 0;
      while (expired < this._clickHistory.length && now - this._clickHistory[expired] > 1000) expired++;
      if (expired) this._clickHistory.splice(0, expired);
      const clicks = this._clickHistory.length;
      if (!this._labelTextCurrent(this._cpsIndicator, clicks)) this._setLabelText(this._cpsIndicator, clicks, `${clicks} CPS`);
    } else if (!this._labelTextCurrent(this._cpsIndicator, 0)) {
      this._setLabelText(this._cpsIndicator, 0, "0 CPS");
    }
    if (this._state.upKeyDown && !this._levelWon && !this._state.isDead){
      if (this._cpsIndicator.tint !== 0x00ff00) {
        this._cpsIndicator.setTint(0x00ff00);
        if (!this._clickHistory) this._clickHistory = [];
        this._clickHistory.push(this.time.now);
      }
    } else{
      this._cpsIndicator.setTint(0xffffff);
    }
    this._cpsIndicator.setPosition(10, 10 + (window.noClip * 20) + (window.noClip && window.noClipAccuracy * 40));

    this._bottedIndicator.setVisible(this._macroBot?.playing && !this._menuActive && !this._paused && !this._levelWon);
    this._bottedIndicator.setPosition(10, 10 + (window.noClip * 20) + (window.noClip && window.noClipAccuracy * 40) + (window.showCPS * 20));
    if (this._macroBtn){
      this._macroBtn.setVisible(window.macroBot);
    }

    this._fpsAccum += deltaTime;
    this._fpsFrames++;
    if (this._fpsAccum >= 250) {
      this._fpsText.setText("FPS: " + Math.round(this._fpsFrames * 1000 / this._fpsAccum));
      this._fpsAccum = 0;
      this._fpsFrames = 0;
    }
    if (this._paused) {
      if (!this._updateLogPopup && window.kbIsDown("jump") && !this._spaceWasDown && !this._settingsPopup && !this._vaultOverlayObjects && !this._secretVaultOverlayObjects) {
        setTimeout(() => {
          this._resumeGame();
        }, 75);
      }
      this._deltaBuffer = 0;
      return;
    }
    if (this._menuActive) {
      const _anyOverlayOpen = this._iconOverlay || this._creatorOverlay || this._searchOverlay ||
        this._onlineLevelsOverlay || this._settingsLayerOverlay || this._settingsPopup ||
        this._infoPopup || this._newgroundsPopup || this._newsPopup || this._dailyLevelPopup || this._weeklyLevelPopup || this._eventLevelPopup || this._statsLayerOverlay || this._updateLogPopup;
      if (!_anyOverlayOpen && window.kbIsDown("jump") && !this._spaceWasDown) {
        if (this._creatorMenuOpen) return;
        this._spaceWasDown = true;
        if (this._levelSelectOverlay) {
        if (this._levelSelectIsComingSoonPage) {
          return;
        }
        this._creatorMenuOpen;
        this.input.enabled = false;

        const lvl = window.currentlevel;
        const songID = lvl[0];
        const levelFileName = lvl[2];
        const songFileName = lvl[4] ? lvl[4] : lvl[1].replaceAll(" ", "");

        const loadingText = this.add.bitmapText(
          screenWidth / 2, screenHeight / 2, "goldFont", "Downloading Level Assets...", 20
        ).setOrigin(0.5).setDepth(200);

        this.load.text(levelFileName, "assets/levels/" + levelFileName.split("_")[1] + ".txt");
        this.load.audio(songID, "assets/sound/music/" + songFileName + ".mp3");

        this.load.once("complete", () => {
          loadingText.destroy();
          this._audio.playEffect("playSound_01", { volume: 1 });
          this._closeLevelSelect(true);
          this._audio.stopMusic();
          this.input.enabled = true;
          this.game.registry.set("autoStartGame", true);
          this.scene.restart();
          });

          this.load.start();
          return;
        }
        this._openLevelSelect();
        return;
      }
      const _arrowLeft = this._leftKey.isDown || this._aKey.isDown;
      const _arrowRight = this._rightKey.isDown || this._dKey.isDown;
      if (!_anyOverlayOpen && (_arrowLeft || _arrowRight) && !this._arrowWasDown) {
        if (this._levelSelectOverlay) {
          if (_arrowLeft) window.leftbuttoncallback();
          else window.rightbuttoncallback();
        }
      }
      this._arrowWasDown = _arrowLeft || _arrowRight;
      this._spaceWasDown = window.kbIsDown("jump");
      const menuDelta = Math.min(deltaTime / 1000 * 60, 2);
      const menuSpeed = 0.85;
      this._menuCameraX = (this._menuCameraX || 0) + menuDelta * playerSpeed * d * menuSpeed;
      const _0x38afac = this._cameraX;
      this._cameraX = this._menuCameraX;
      this._updateBackground();
      this._cameraX = _0x38afac;
      this._prevCameraX = this._menuCameraX;
      this._cameraXRef._v = this._menuCameraX;
      this._level.stepGroundAnimation(deltaTime / 1000);
      this._level.updateGroundTiles(this._cameraY);
      if (this._menuRainbowTime === undefined) this._menuRainbowTime = 0;
      this._menuRainbowTime += deltaTime / 1000;
      const _rainbowHue = (this._menuRainbowTime * 15) % 360;
      const _rainbowHex = Phaser.Display.Color.HSVToRGB(_rainbowHue / 360, 0.85, 1.0).color;
      const _groundHex = Phaser.Display.Color.HSVToRGB(_rainbowHue / 360, 0.85, 1.0).color;
      this._bg.setTint(_rainbowHex);
      this._level.setGroundColor(_groundHex);
      this._level.setGround2Color?.(_groundHex);
      return;
    }
    if (this._slideIn) {
      const slideDelta = this._quantizeDelta(deltaTime);
      this._playerWorldX += slideDelta * playerSpeed * d;
      const slideGroundSpeed = 0.25;
      this._slideGroundX = (this._slideGroundX || this._cameraX) + slideDelta * playerSpeed * d * slideGroundSpeed;
      this._cameraXRef._v = this._slideGroundX;
      const slidePlayerScreenX = this._playerWorldX - this._cameraX;
      this._player.updateGroundRotation(slideDelta * d);
      this._player.syncSprites(this._cameraX, this._cameraY, deltaTime / 1000, this._getMirrorXOffset(slidePlayerScreenX));
      if (this._level.shakeOffsetX || this._level.shakeOffsetY) {
        this._player.applyShakeOffset(this._level.shakeOffsetX || 0, this._level.shakeOffsetY || 0);
      }
      this._level.additiveContainer.x = -this._cameraX + (this._level.shakeOffsetX || 0);
      this._level.additiveContainer.y = this._cameraY + (this._level.shakeOffsetY || 0);
      this._level.container.x = -this._cameraX + (this._level.shakeOffsetX || 0);
      this._level.container.y = this._cameraY + (this._level.shakeOffsetY || 0);
      this._level.topContainer.x = -this._cameraX + (this._level.shakeOffsetX || 0);
      this._level.topContainer.y = this._cameraY + (this._level.shakeOffsetY || 0);
      this._level.updateVisibility(this._cameraX);
      this._level.applyColorChannels(this._colorManager, true);
      this._bg.setTint(this._colorManager.getHex(fs));
      this._level.setGroundColor(this._colorManager.getHex(gs));
      this._level.setGround2Color?.(this._colorManager.getHex(1009));
      this._level.applyEnterEffects(this._cameraX);
      this._level.updateObjectDebugIds();
      this._updateBackground();
      this._level.stepGroundAnimation(deltaTime / 1000);
      this._level.updateGroundTiles(this._cameraY);
      this._applyMirrorEffect();
      if (this._playerWorldX >= 0) {
        this._slideIn = false;
        this._deltaBuffer = 0;
        this._playerWorldX = 0;
        this._player._lastCollisionWorldX = null;
        this._player._lastCollisionWorldY = null;
        if (this._player2) {
          this._player2._lastCollisionWorldX = null;
          this._player2._lastCollisionWorldY = null;
        }
        this._cameraX = this._playerWorldX - centerX;
        this._cameraXRef._v = this._cameraX;
        const _0x490749 = this._cameraX - this._slideGroundX;
        this._level.shiftGroundTiles(_0x490749);
        if (this._firstPlay) {
          this._firstPlay = false;
          this._audio.startMusic();
        }
        this._pauseBtn.setVisible(true).setAlpha(0);
        this.tweens.add({
          targets: this._pauseBtn,
          alpha: 75 / 255,
          duration: 500
        });
        if (this._practiceModeBarContainer) {
          this._practiceModeBarContainer.setVisible(this._practicedMode && this._practicedMode.practiceMode);
        }
      }
      return;
    }
   if (!this._applyJumpInput) {
    this._applyJumpInput = () => {
      const jumpHeld = window.kbIsDown("jump");
      if (!this._updateLogPopup && jumpHeld && !this._spaceWasDown) {
        this._pushButton();
      } else if (!jumpHeld && this._spaceWasDown && !this.input.activePointer.isDown) {
        this._releaseButton();
      }
      this._spaceWasDown = jumpHeld;
    };
  }

    const fromClick = this.input.activePointer.isDown;
    const cancelInput = fromClick && this.input.manager.hitTest(
      this.input.activePointer,
      this._startPosGui.list,
      this.cameras.main
    ).length > 0;

    if (!!this.input.activePointer.isDown && !this._state.upKeyDown && !this._state.isDead) {
      this._state.upKeyDown = true;
      this._state.queuedHold = true;
      this._state._orbActivationConsumedForPress = false;
    }
    if (cancelInput) {
      this._state.upKeyDown = false;
      this._state.upKeyPressed = false;
      this._state.queuedHold = false;
      this._state._orbActivationConsumedForPress = false;
    }
    this._level.updateEndPortalY(this._cameraY, this._state.isFlying || this._state.isWave || this._state.isUfo || this._state.isSpider);
    if (!this._levelWon && !this._state.isDead && this._level.endXPos > 0) {
      const _0x448396 = 600;
      if (this._playerWorldX >= this._level.endXPos - _0x448396) {
        this._levelWon = true;
        this._endPortalGameY = this._level._endPortalGameY || 240;
        this._triggerEndPortal();
      }
    }
    if (this._levelWon) {
      this._deltaBuffer = 0;
      if (this._endCamTween) {
        const visMaxSection = this._endCamTween;
        this._cameraX = visMaxSection.fromX + (visMaxSection.toX - visMaxSection.fromX) * visMaxSection.p;
        this._cameraY = visMaxSection.fromY + (visMaxSection.toY - visMaxSection.fromY) * visMaxSection.p;
      }
      this._cameraXRef._v = this._cameraX;
      this._level.additiveContainer.x = -this._cameraX + (this._level.shakeOffsetX || 0);
      this._level.additiveContainer.y = this._cameraY + (this._level.shakeOffsetY || 0);
      this._level.container.x = -this._cameraX + (this._level.shakeOffsetX || 0);
      this._level.container.y = this._cameraY + (this._level.shakeOffsetY || 0);
      this._level.topContainer.x = -this._cameraX + (this._level.shakeOffsetX || 0);
      this._level.topContainer.y = this._cameraY + (this._level.shakeOffsetY || 0);
      this._updateBackground();
      this._level.stepGroundAnimation(deltaTime / 1000);
      this._level.updateGroundTiles(this._cameraY);
      this._applyMirrorEffect();
      return;
    }
    if (this._state.isDead) {
      if (!this._deathSoundPlayed) {
        this._level.triggerOnDeath?.(this._colorManager);
        if (!this._audio._shouldUsePracticeSong()) {
          this._audio.stopMusic();
        }
        this._audio.playEffect("explode_11", {
          volume: 0.65 * this._sfxVolume
        });
        this._deathSoundPlayed = true;
        if (this._level && window.disableShake !== true) {
          this._level._shakeState = {
            strength: 2.4,
            endTime: (this.time?.now ?? 0) + 100,
            interval: 0,
            lastStepTime: -Infinity
          };
        }
        this._totalDeaths++;
        localStorage.setItem("gd_totalDeaths", this._totalDeaths);
      }
      if (!this._newBestShown) {
        this._newBestShown = true;
        let _0x435587 = this._level.endXPos || 6000;
        let _0x169d53 = this._playerWorldX;
        this._lastPercent = Math.min(99, Math.max(0, Math.floor(_0x169d53 / _0x435587 * 100)));
        if (this._lastPercent > this._bestPercent && !this._practicedMode.practiceMode) {
          this._bestPercent = this._lastPercent;
          localStorage.setItem("bestPercent_" + (window.currentlevel[2] || "level_1"), this._bestPercent);
          this._hadNewBest = true;
          this._showNewBest();
        }
        if (this._practicedMode.practiceMode) {
          const pracKey = "practiceBestPercent_" + (window.currentlevel[2] || "level_1");
          const prevPracticeBest = parseFloat(localStorage.getItem(pracKey) || "0");
          if (this._lastPercent > prevPracticeBest) {
            localStorage.setItem(pracKey, this._lastPercent);
            this._practiceBestPercent = this._lastPercent;
            if (this._updatePracticeHUDBar) this._updatePracticeHUDBar();
          }
        }
      }
      this._player?.updateExplosionPieces?.(deltaTime);
      if (this._isDual) {
        this._player2?.updateExplosionPieces?.(deltaTime);
      }
      if (this._player?._hitboxGraphics) {
        if (window.showHitboxes || window.hitboxesOnDeath) {
          this._player.drawHitboxes(this._player._hitboxGraphics, this._cameraX, this._cameraY);
        } else {
          this._player._hitboxGraphics.clear();
        }
      }
      if (this._isDual && this._player2?._hitboxGraphics) {
        if (window.showHitboxes || window.hitboxesOnDeath) {
          this._player2.drawHitboxes(this._player2._hitboxGraphics, this._cameraX, this._cameraY);
        } else {
          this._player2._hitboxGraphics.clear();
        }
      }
      this._level.applyShakeToOffsets?.(this.time.now);
      this._level.updateGroundTiles?.(this._cameraY);
      this._updateBackground();
      const deathShakeX = this._level.shakeOffsetX || 0;
      const deathShakeY = this._level.shakeOffsetY || 0;
      this._level.additiveContainer.x = -this._cameraX + deathShakeX;
      this._level.additiveContainer.y = this._cameraY + deathShakeY;
      this._level.container.x = -this._cameraX + deathShakeX;
      this._level.container.y = this._cameraY + deathShakeY;
      this._level.topContainer.x = -this._cameraX + deathShakeX;
      this._level.topContainer.y = this._cameraY + deathShakeY;
      this._applyMirrorEffect();
      this._deathTimer += deltaTime;
      let _0x237728 = (this._hadNewBest ? 1400 : 1000) * (window.respawnDelay !== undefined ? window.respawnDelay : 1.0);
      if (this._deathTimer > _0x237728) {
        if (this._practicedMode.practiceMode) {
          this._respawnFromCheckpoint();
        } else {
          this._restartLevel();
        }
      }
      return;
    }
    if (this._pendingMusicOffset != null) {
      const pendingOffset = this._pendingMusicOffset;
      this._pendingMusicOffset = null;
      this._audio.startMusic(pendingOffset);
    }
    this._playTime += deltaTime / 1000;
    this._audio.update(deltaTime / 1000);

    if (!window.enableLDM) {
      window._animTimer += deltaTime;
      for (let _as of window._animatedSprites) {
        if (!_as || !_as.active || !_as.visible) continue;
        if (_as._eeCulled || (_as.parentContainer && !_as.parentContainer.visible)) continue;
        const _asLast = _as._lastAnimSwap || 0;
        const _asElapsed = window._animTimer - _asLast;
        if (_asElapsed >= _as._animInterval) {
          _as._lastAnimSwap = window._animTimer - (_asElapsed % _as._animInterval);
          _as._animIdx = (_as._animIdx + 1) % _as._animFrames.length;
          let _fr = getAtlasFrame(_as._animScene, _as._animFrames[_as._animIdx]);
          if (_fr) {
            try {
              _as.setTexture(_fr.atlas, _fr.frame);
            } catch(e){}
          }
        }
      }
    } else {
      window._animTimer += deltaTime;
    }
    if (this._level && this._level._sawSprites && !window.enableLDM) {
      const sawTimer = (window._animTimer || 0) / 1000;
      for (let _saw of this._level._sawSprites) {
        if (!_saw || !_saw.active || !_saw.visible) continue;
        if (_saw._eeCulled || (_saw.parentContainer && !_saw.parentContainer.visible)) continue;
        const baseSpeed = _saw._Sawrotationspeed ?? 0.0034;
        let sawRotationSpeed = baseSpeed;
        if (_saw._SawRandom1 !== undefined) {
          sawRotationSpeed += Math.sin(sawTimer + _saw._SawRandom1) * (_saw._SawRandom2 || 0);
        }
        _saw.rotation += deltaTime * sawRotationSpeed;
      }
    }
    if (this._level && this._level._orbSprites) {
      const gravityGuideRotation = (this._state?.gravityFlipped ? Math.PI : 0);
      for (let _oSpr of this._level._orbSprites) {
        if (!_oSpr || !_oSpr.active || !_oSpr._eeOrbGuide || !_oSpr._OrbGuideGrav) continue;
        const baseRotation = Number.isFinite(_oSpr._OrbGuideRotation) ? _oSpr._OrbGuideRotation : 0;
        _oSpr.rotation = baseRotation + gravityGuideRotation;
      }
    }
    this._level.updateAudioScale(this._audio.getMeteringValue(), this._cameraX, screenWidth);
    if (!this._orbGfx) {
      this._orbGfx = this.add.graphics().setDepth(54).setBlendMode(S);
    }
    this._orbParticleAngle = ((this._orbParticleAngle || 0) + deltaTime * 0.004) % (Math.PI * 2);
    this._orbGfxTimer = (this._orbGfxTimer || 0) + deltaTime;
    if (this._orbGfxTimer > 33) {
      this._orbGfxTimer = 0;
      this._orbGfx.clear();
      if (this._level && this._level._orbSprites && this._level.container) {
        try {
        let _drawn = 0;
        const _orbTypeColorMap = ORB_PARTICLE_COLORS;
        for (let _oSpr of this._level._orbSprites) {
          if (_drawn >= 4) break;
          if (!_oSpr || !_oSpr.visible || !_oSpr.active || !_oSpr.scene) continue;
          const _sx = _oSpr.x + this._level.container.x;
          const _sy = _oSpr.y + this._level.container.y;
          if (_sx < -40 || _sx > screenWidth + 40 || _sy < -40 || _sy > screenHeight + 40) continue;
          _drawn++;
          const _orbTypeTint = _orbTypeColorMap[_oSpr._orbId];
          for (let _pi = 0; _pi < 5; _pi++) {
            const _orbitSpeed = 0.7 + (_pi % 3) * 0.35;
            const _orbitR = 34 + (_pi * 5 % 17);
            const _ang = this._orbParticleAngle * _orbitSpeed + (_pi * Math.PI * 2 / 5);
            const _px = _sx + Math.cos(_ang) * _orbitR;
            const _py = _sy + Math.sin(_ang) * (_orbitR * 0.85);
            const _size = (window.orbParticleSize || 3.5) + (_pi % 3) * 1.0;
            const _alpha = 0.5 + (_pi % 4) * 0.12;
            this._orbGfx.fillStyle(_orbTypeTint, _alpha);
            this._orbGfx.fillRect(_px - _size, _py - _size, _size * 2, _size * 2);
          }
        }
        } catch(e) {}
      }
    }
    let quantizedDelta = this._quantizeDelta(deltaTime);
    let subSteps = quantizedDelta > 0 ? Math.max(1, Math.round(quantizedDelta * 4)) : 0;
    if (subSteps > 60) {
      subSteps = 60;
    }
    let subStepDelta = subSteps > 0 ? quantizedDelta / subSteps : 0;
    let verticalDelta = subStepDelta * d;
    let horizontalDelta = subStepDelta * playerSpeed * d;
    const initialY = this._state.y;
    const initialY2 = this._state2.y;
    for (let i = 0; i < subSteps; i++) {
      this._state.lastY = this._state.y;
      this._physicsFrame++;
      this._physicsTick = (this._physicsTick || 0) + 1;
      this._applyJumpInput();
      if (this._macroBot?.playing) {
        this._macroBot.step(this._physicsFrame);
      }
      const _dualInputState = this._dualInputScratch || (this._dualInputScratch = {});
      _dualInputState.upKeyDown = this._state.upKeyDown;
      _dualInputState.upKeyPressed = this._state.upKeyPressed;
      _dualInputState.queuedHold = this._state.queuedHold;
      _dualInputState.orbActivationConsumedForPress = !!this._state._orbActivationConsumedForPress;
      const _bothBallsBefore = this._isDual && this._state.isBall && this._state2.isBall;
      const _primaryGravityBefore = !!this._state.gravityFlipped;
      const _primarySharedBefore = this._getDualSharedSignature(this._state);
      this._player.updateJump(verticalDelta);
      this._state.y += this._state.yVelocity * verticalDelta;
      this._player.checkCollisions(this._playerWorldX - centerX);
      const _primaryGravityChanged = this._isDual && !!this._state.gravityFlipped !== _primaryGravityBefore;
      const _waveGravitySync = _primaryGravityChanged && this._state.isWave && this._state2.isWave;
      let _primaryGravitySynced = false;
      if (this._isDual && !_waveGravitySync && this._getDualSharedSignature(this._state) !== _primarySharedBefore) {
        _primaryGravitySynced = this._syncDualGlobalsFromPrimary({
          skipBallInputGravity: _primaryGravityChanged && this._state.isBall && _dualInputState.upKeyPressed,
          skipSpiderInputGravity: _primaryGravityChanged && this._state.isSpider && _dualInputState.upKeyPressed
        });
      }
      if (this._isDual && this._state.isDead && !this._state2.isDead) {
        this._player2.killPlayer();
      }
      this._playerWorldX += horizontalDelta;
      if (this._isDual && !this._state2.isDead) {
        this._copyDualInputFlags(_dualInputState, this._state2);
        if (this._shouldSuppressDualGravityAction(this._state2, _primaryGravitySynced)) {
          this._state2.upKeyPressed = false;
          this._state2.queuedHold = false;
        }
        this._state2.lastY = this._state2.y;
        const _secondarySharedBefore = this._getDualSharedSignature(this._state2);
        const _secondaryBallInputGravity = this._state2.isBall && this._state2.upKeyPressed;
        const _secondarySpiderInputGravity = this._state2.isSpider && this._state2.upKeyPressed;
        this._player2.updateJump(verticalDelta);
        if (!this._state2.upKeyPressed) this._state.upKeyPressed = false;
        if (!this._state2.queuedHold) this._state.queuedHold = false;
        if (this._state2._orbActivationConsumedForPress) this._state._orbActivationConsumedForPress = true;
        this._state2.y += this._state2.yVelocity * verticalDelta;
        if (_waveGravitySync) {
          this._syncDualGlobalsFromPrimary();
        }
        this._player2.checkCollisions(this._playerWorldX - centerX - horizontalDelta);
        if (this._isDual && !this._state2.isDead && this._getDualSharedSignature(this._state2) !== _secondarySharedBefore) {
          this._syncDualGlobalsFromSecondary({
            skipBallInputGravity: _secondaryBallInputGravity,
            skipSpiderInputGravity: _secondarySpiderInputGravity
          });
        }
        if (!_bothBallsBefore && this._areDualBallsOverlapping()) {
          this._dualBallSpawnGravityLock = true;
        }
        this._resolveDualBallOverlap();
        if (this._isDual && this._state2.isDead && !this._state.isDead) {
          this._player.killPlayer();
        }
        if (this._isDual && this._state.isDead && !this._state2.isDead) {
          this._player2.killPlayer();
        }
        if (this._isDual) this._ensureDualFlyBounds();
      }
      if (!this._state.isFlying && !this._state.isWave && !this._state.isUfo) {
        if (this._state.isBall) {
          const ballOnSurface = this._state.onGround || this._state.onCeiling;
          this._player.updateBallRoll(horizontalDelta, ballOnSurface);
        } else if (this._state.onGround) {
          this._player.updateGroundRotation(verticalDelta);
        } else if (this._state.isDashing) {
          this._player.updateDashRotation(u);
        } else if (this._player.rotateActionActive) {
          this._player.updateRotateAction(u);
        }
      }
      if (this._isDual && !this._state2.isDead && !this._state2.isFlying && !this._state2.isWave && !this._state2.isUfo) {
        if (this._state2.isBall) {
          const ball2OnSurface = this._state2.onGround || this._state2.onCeiling;
          this._player2.updateBallRoll(horizontalDelta, ball2OnSurface);
        } else if (this._state2.onGround) {
          this._player2.updateGroundRotation(verticalDelta);
        } else if (this._state2.isDashing) {
          this._player2.updateDashRotation(u);
        } else if (this._player2.rotateActionActive) {
          this._player2.updateRotateAction(u);
        }
      }

      if (window.showHitboxTrail && !this._player._scene._slideIn){
        if (!this._player._hitboxTrail) this._player._hitboxTrail = [];
        if (!this._player.p.isDead) {
          const _trailSize = this._player.p.isMini ? 18 : 30;
          this._pushHitboxTrail(this._player._hitboxTrail, this._playerWorldX, this._player.p.y, this._player._rotation, _trailSize, this._player.p.isWave);
        }
        if (this._isDual && !this._player2.p.isDead) {
          if (!this._player2._hitboxTrail) this._player2._hitboxTrail = [];
          const _trailSize2 = this._player2.p.isMini ? 18 : 30;
          this._pushHitboxTrail(this._player2._hitboxTrail, this._playerWorldX, this._player2.p.y, this._player2._rotation, _trailSize2, this._player2.p.isWave);
        }
      }

      if (this._macroBot?.playing) {
        this._macroBot.applyCurrentFrame();
      } else if (this._macroBot?.recording) {
        this._macroBot.recordFrame(this._physicsFrame);
      }
    }
    this._state.lastY = initialY;
    if (this._isDual) this._state2.lastY = initialY2;
    this._state.ignorePortals = false;
    this._state2.ignorePortals = false;
    if (!this._endCameraOverride) {
      const cameraOffsetX = this._playerWorldX - centerX;
      if (this._level.endXPos > 0) {
        const maxCameraX = this._level.endXPos - screenWidth;
        if (cameraOffsetX >= maxCameraX - 200) {
          this._endCameraOverride = true;
          this._cameraX = cameraOffsetX;
          const endCameraY = -140 + (this._level._endPortalGameY || 240);
          const easingPower = 1.8;
          const easeInOutCubic = t => t < 0.5 ? Math.pow(t * 2, easingPower) / 2 : 1 - Math.pow((1 - t) * 2, easingPower) / 2;
          this._endCamTween = {
            p: 0,
            fromX: this._cameraX,
            toX: maxCameraX,
            fromY: this._cameraY,
            toY: endCameraY
          };
          this.tweens.add({
            targets: this._endCamTween,
            p: 1,
            duration: 1200,
            ease: easeInOutCubic
          });
        } else {
          this._cameraX = cameraOffsetX;
        }
      } else {
        this._cameraX = cameraOffsetX;
      }
    }
    if (this._endCameraOverride && this._endCamTween) {
      const tween = this._endCamTween;
      this._cameraX = tween.fromX + (tween.toX - tween.fromX) * tween.p;
      this._cameraY = tween.fromY + (tween.toY - tween.fromY) * tween.p;
    }
    this._cameraXRef._v = this._cameraX;
    if (!this._endCameraOverride) {
      this._updateCameraY(quantizedDelta);
    }
    this._level.applyShakeToOffsets?.(this.time.now);
    this._level.additiveContainer.x = -this._cameraX + (this._level.shakeOffsetX || 0);
    this._level.additiveContainer.y = this._cameraY + (this._level.shakeOffsetY || 0);
    this._level.container.x = -this._cameraX + (this._level.shakeOffsetX || 0);
    this._level.container.y = this._cameraY + (this._level.shakeOffsetY || 0);
    this._level.topContainer.x = -this._cameraX + (this._level.shakeOffsetX || 0);
    this._level.topContainer.y = this._cameraY + (this._level.shakeOffsetY || 0);
    let playerX = this._playerWorldX;
    if (!this._applyColorTriggerFn) {
      this._applyColorTriggerFn = (colorTrigger) => {
      this._colorManager.triggerColor(colorTrigger.index, colorTrigger.color, colorTrigger.duration, colorTrigger.copy, colorTrigger.opacity);
      this._level.setChannelBlending?.(colorTrigger.index, !!colorTrigger.blending);
      if (colorTrigger.tintGround) {
        this._colorManager.triggerColor(gs, colorTrigger.color, colorTrigger.duration, colorTrigger.copy);
      }
    };
  }
    const applyColorTrigger = this._applyColorTriggerFn;
    for (let colorTrigger of this._level.checkColorTriggers(playerX)) {
      applyColorTrigger(colorTrigger);
    }
    if (this._level.checkTouchColorTriggers) {
      for (let colorTrigger of this._level.checkTouchColorTriggers(playerX, this._state.y)) {
        applyColorTrigger(colorTrigger);
      }
      if (this._isDual && !this._state2.isDead) {
        for (let colorTrigger of this._level.checkTouchColorTriggers(playerX, this._state2.y)) {
          applyColorTrigger(colorTrigger);
        }
      }
    }
    this._level.checkMoveTriggers(playerX);
    this._level.checkSpawnTriggers(playerX);
    if (this._level.checkTouchSpawnTriggers) {
        this._level.checkTouchSpawnTriggers(playerX, this._state.y);
        if (this._isDual && !this._state2.isDead) {
            this._level.checkTouchSpawnTriggers(playerX, this._state2.y);
        }
    }
    if (this._level.checkTouchMoveTriggers) {
        this._level.checkTouchMoveTriggers(playerX, this._state.y);
        if (this._isDual && !this._state2.isDead) {
            this._level.checkTouchMoveTriggers(playerX, this._state2.y);
        }
    }
    this._level.beginGroupTransformBatch();
    this._level.stepMoveTriggers(deltaTime / 1000);
    this._level.stepSpawnTriggers(deltaTime / 1000, this._colorManager);
    this._level.checkAlphaTriggers(playerX);
    if (this._level.checkTouchAlphaTriggers) {
      this._level.checkTouchAlphaTriggers(playerX, this._state.y);
      if (this._isDual && !this._state2.isDead) {
        this._level.checkTouchAlphaTriggers(playerX, this._state2.y);
      }
    }
    this._level.stepAlphaTriggers(deltaTime / 1000);
    this._level.checkRotateTriggers(playerX);
    this._level.stepRotateTriggers(deltaTime / 1000);
    this._level.checkStopTriggers?.(playerX);
    if (this._level.checkTouchStopTriggers) {
      this._level.checkTouchStopTriggers(playerX, this._state.y);
      if (this._isDual && !this._state2.isDead) {
        this._level.checkTouchStopTriggers(playerX, this._state2.y);
      }
    }
    this._level.checkFollowPlayerYTriggers?.(playerX);
    if (this._level.checkTouchFollowPlayerYTriggers) {
      this._level.checkTouchFollowPlayerYTriggers(playerX, this._state.y);
      if (this._isDual && !this._state2.isDead) {
        this._level.checkTouchFollowPlayerYTriggers(playerX, this._state2.y);
      }
    }
    this._level.stepFollowPlayerYTriggers?.(deltaTime / 1000);
    this._level.checkFollowTriggers?.(playerX);
    if (this._level.checkTouchFollowTriggers) {
      this._level.checkTouchFollowTriggers(playerX, this._state.y);
      if (this._isDual && !this._state2.isDead) {
        this._level.checkTouchFollowTriggers(playerX, this._state2.y);
      }
    }
    this._level.stepFollowTriggers?.(deltaTime / 1000);
    this._level.flushGroupTransformBatch();
    this._level.checkToggleTriggers?.(playerX);
    this._level.checkAnimationTriggers?.(playerX);
    if (this._level.checkTouchAnimationTriggers) {
      this._level.checkTouchAnimationTriggers(playerX, this._state.y);
      if (this._isDual && !this._state2.isDead) {
        this._level.checkTouchAnimationTriggers(playerX, this._state2.y);
      }
    }
    if (this._level.checkTouchToggleTriggers) {
      this._level.checkTouchToggleTriggers(playerX, this._state.y);
      if (this._isDual && !this._state2.isDead) {
        this._level.checkTouchToggleTriggers(playerX, this._state2.y);
      }
    }
    this._level.checkShakeTriggers?.(playerX);
    this._level.checkPlayerVisibilityTriggers?.(playerX);
    this._level.checkTouchPlayerVisibilityTriggers?.(playerX, this._state.y);
    if (this._isDual && !this._state2.isDead) this._level.checkTouchPlayerVisibilityTriggers?.(playerX, this._state2.y);
    this._player?.setHidden?.(!!this._level.playerHidden);
    if (this._isDual) this._player2?.setHidden?.(!!this._level.playerHidden);
    if (this._level.checkTouchShakeTriggers) {
      this._level.checkTouchShakeTriggers(playerX, this._state.y);
      if (this._isDual && !this._state2.isDead) {
        this._level.checkTouchShakeTriggers(playerX, this._state2.y);
      }
    }
    this._level.checkOnDeathTriggers?.(playerX);
    if (this._level.checkTouchOnDeathTriggers) {
      this._level.checkTouchOnDeathTriggers(playerX, this._state.y);
      if (this._isDual && !this._state2.isDead) {
        this._level.checkTouchOnDeathTriggers(playerX, this._state2.y);
      }
    }
    this._level.checkTouchTriggers?.(playerX);
    if (this._level.checkTouchTouchTriggers) {
      this._level.checkTouchTouchTriggers(playerX, this._state.y);
      if (this._isDual && !this._state2.isDead) {
        this._level.checkTouchTouchTriggers(playerX, this._state2.y);
      }
    }
    const isHoldingInput = Boolean(this._state?.upKeyDown);
    const isPressedInput = Boolean(this._state?.upKeyPressed);
    let p2HoldingInput = false;
    let p2PressedInput = false;
    if (this._isDual && !this._state2?.isDead) {
      p2HoldingInput = Boolean(this._state2?.upKeyDown);
      p2PressedInput = Boolean(this._state2?.upKeyPressed);
    }
    if (!this._level.isTouchTriggerDualMode?.()) {
      p2HoldingInput = false;
      p2PressedInput = false;
    }
    this._level.stepTouchTriggers?.(isHoldingInput, isPressedInput, p2HoldingInput, p2PressedInput, this._colorManager);
    this._level.checkPickupTriggers?.(playerX, this._colorManager);
    if (this._level.checkTouchPickupTriggers) {
      this._level.checkTouchPickupTriggers(playerX, this._state.y, this._colorManager);
      if (this._isDual && !this._state2.isDead) {
        this._level.checkTouchPickupTriggers(playerX, this._state2.y, this._colorManager);
      }
    }
    this._level.checkCountTriggers?.(playerX, this._colorManager);
    this._level.checkCollisionTriggers?.(playerX);
    this._level.updateCollisionTriggers?.();
    if (this._level.checkTouchCountTriggers) {
      this._level.checkTouchCountTriggers(playerX, this._state.y, this._colorManager);
      if (this._isDual && !this._state2.isDead) {
        this._level.checkTouchCountTriggers(playerX, this._state2.y, this._colorManager);
      }
    }
    this._level.checkInstantCountTriggers?.(playerX, this._colorManager);
    if (this._level.checkTouchInstantCountTriggers) {
      this._level.checkTouchInstantCountTriggers(playerX, this._state.y, this._colorManager);
      if (this._isDual && !this._state2.isDead) {
        this._level.checkTouchInstantCountTriggers(playerX, this._state2.y, this._colorManager);
      }
    }
    this._level.updateVisibility(this._cameraX);
    this._level.checkPulseTriggers(playerX);
    this._level.stepPulseTriggers(deltaTime / 1000, this._colorManager);
    this._colorManager.step(deltaTime / 1000);
    this._level.applyColorChannels(this._colorManager, true);
    this._bg.setTint(this._colorManager.getHex(fs));
    this._level.setGroundColor(this._colorManager.getHex(gs));
    this._level.setGround2Color?.(this._colorManager.getHex(1009));
    this._level.updateObjectDebugIds();
    this._level.checkEnterEffectTriggers(playerX);
    this._level.applyEnterEffects(this._cameraX);
    window.BeastAnim.update(this, deltaTime);
    this._glitterCenterX = this._cameraX + screenWidth / 2;
    this._glitterCenterY = T - this._cameraY;
    this._stepMirror(deltaTime / 1000);
    this._updateBackground();
    this._level.stepGroundAnimation(deltaTime / 1000);
    this._level.updateGroundTiles(this._cameraY);
    if (this._state.isFlying) {
      this._player.updateShipRotation(quantizedDelta);
    }
    if (this._isDual && this._state2.isFlying && !this._state2.isDead) {
    this._player2.updateShipRotation(quantizedDelta);
  }
    const playerScreenX = this._playerWorldX - this._cameraX;
    this._player.syncSprites(this._cameraX, this._cameraY, deltaTime / 1000, this._getMirrorXOffset(playerScreenX));
    if (this._isDual && !this._state2.isDead) {
      this._player2.syncSprites(this._cameraX, this._cameraY, deltaTime / 1000, this._getMirrorXOffset(playerScreenX));
    }
    if (this._level.shakeOffsetX || this._level.shakeOffsetY) {
      this._player.applyShakeOffset(this._level.shakeOffsetX || 0, this._level.shakeOffsetY || 0);
      if (this._isDual && !this._state2.isDead) {
        this._player2.applyShakeOffset(this._level.shakeOffsetX || 0, this._level.shakeOffsetY || 0);
      }
    }
    this._applyMirrorEffect();
  }

  _mirrorProgress() {
    return this._mirrorAnimating ? this._mirrorP : (this._state.mirrored ? 1 : 0);
  }
  toggleMirror(on) {
    const current = this._mirrorAnimating ? !!this._mirrorTarget : !!this._state.mirrored;
    if (current === on) return false;
    this._mirrorFrom = this._mirrorProgress();
    this._mirrorP = this._mirrorFrom;
    this._mirrorTarget = on;
    this._mirrorTime = 0;
    this._mirrorAnimating = true;
    return true;
  }
  _stepMirror(dt) {
    if (!this._mirrorAnimating) return;
    this._mirrorTime += dt;
    const k = Math.min(1, this._mirrorTime / 0.4);
    const t = k * 2;
    const eased = t < 1 ? 0.5 * Math.pow(t, 1.2) : 1 - 0.5 * Math.pow(2 - t, 1.2);
    const to = this._mirrorTarget ? 1 : 0;
    this._mirrorP = this._mirrorFrom + (to - this._mirrorFrom) * eased;
    if (k >= 1) {
      this._mirrorP = to;
      this._mirrorAnimating = false;
    }
    const visual = this._mirrorAnimating ? this._mirrorP >= 0.5 : !!this._mirrorTarget;
    this._state.mirrored = visual;
    if (this._state2) this._state2.mirrored = visual;
  }
  _restoreMirrorTransforms() {
    const saved = this._mirrorSaved;
    if (!saved || !saved.length) return;
    for (let i = 0; i < saved.length; i += 6) {
      const o = saved[i];
      o.x = saved[i + 1];
      o.scaleX = saved[i + 2];
      o.rotation = saved[i + 3];
      if (saved[i + 4] !== undefined) o.alpha = saved[i + 4];
    o.visible = saved[i + 5];
  }
  saved.length = 0;
}
_mirrorTransformObjects(p) {
  this._restoreMirrorTransforms();
  const saved = this._mirrorSaved || (this._mirrorSaved = []);
  const flip = p >= 0.5;
  const apply = (o, ox) => {
    if (!o.visible) return;
    const isEmitter = o.type === "ParticleEmitter";
    saved.push(o, o.x, o.scaleX, o.rotation, isEmitter ? undefined : o.alpha, true);
    const sx = o.x + ox;
    const fade = o._eeDontFade ? 1 : Math.min(1, Math.min(sx, screenWidth - sx) / 140);
    if (fade <= 0) {
      o.visible = false;
      return;
    }
    if (fade < 1 && !isEmitter) o.alpha *= fade;
    o.x += p * (screenWidth - 2 * sx);
    if (flip) {
      o.scaleX = -o.scaleX;
      o.rotation = -o.rotation;
    }
  };
  for (const c of [this._level.additiveContainer, this._level.container, this._level.topContainer]) {
    if (!c.visible) continue;
    for (const child of c.list) {
      if (child._eeMirrorGroup) {
        if (!child.visible) continue;
        const ox = c.x + child.x;
        for (const o of child.list) apply(o, ox);
      } else if (child._eeMirrorFollow || child._eeWorldX !== undefined) {
        apply(child, c.x);
      }
    }
  }
  if (saved.length) this.events.once("render", this._restoreMirrorTransforms, this);
}
_applyMirrorEffect() {
   const p = this._mirrorProgress();
    const containers = [this._level.additiveContainer, this._level.container, this._level.topContainer];
    if (p >= 1) {
      for (const c of containers) {
        c.scaleX = -1;
        c.x = this._cameraX + screenWidth - (this._level.shakeOffsetX || 0);
      }
    } else {
      for (const c of containers) {
        if (c.scaleX !== 1) {
         c.scaleX = 1;
        c.x = -this._cameraX + (this._level.shakeOffsetX || 0);
      }
    }
    if (p > 0) this._mirrorTransformObjects(p);
  }
  if (this._bg.flipX) this._bg.setFlipX(false);
}
  _pushHitboxTrail(trail, x, y, rotation, size, isWave) {
    const entry = trail.length >= 180 ? trail.shift() : {};
    entry.x = x;
    entry.y = y;
    entry.rotation = rotation;
    entry.size = size;
    entry.isWave = isWave;
    trail.push(entry);
  }
  _getDualSharedSignature(state) {
    if (!state) return 0;
    return (state.gravityFlipped ? 1 : 0) | (state.mirrored ? 2 : 0);
  }
  _getDualModeId(state) {
    if (!state) return "cube";
    if (state.isFlying) return "ship";
    if (state.isBall) return "ball";
    if (state.isUfo) return "ufo";
    if (state.isWave) return "wave";
    if (state.isRobot) return "robot";
    if (state.isSpider) return "spider";
    return "cube";
  }
  _getGamemodePortalMode(portalType) {
    switch (portalType) {
      case "portal_cube":
        return "cube";
      case "portal_fly":
        return "ship";
      case "portal_ball":
        return "ball";
      case "portal_wave":
        return "wave";
      case "portal_ufo":
        return "ufo";
      case "portal_robot":
        return "robot";
      case "portal_spider":
        return "spider";
      default:
        return null;
    }
  }
  _setPlayerGamemode(player, state, mode, keepVelocity = true) {
    if (!player || !state) return;
    const currentMode = this._getDualModeId(state);
    if (currentMode === mode) {
      player.setCubeVisible(mode === "cube" || mode === "ufo");
      player.setShipVisible(mode === "ship");
      player.setBallVisible(mode === "ball");
      player.setWaveVisible(mode === "wave");
      player.setBirdVisible?.(mode === "ufo");
      player.setRobotVisible(mode === "robot");
      player.setSpiderVisible(mode === "spider");
      return;
    }
    const saved = {
      y: state.y,
      yVelocity: state.yVelocity,
      gravityFlipped: state.gravityFlipped,
      upKeyDown: state.upKeyDown,
      upKeyPressed: state.upKeyPressed,
      queuedHold: state.queuedHold,
      orbActivationConsumedForPress: !!state._orbActivationConsumedForPress,
      mirrored: state.mirrored,
      isMini: state.isMini
    };
    switch (mode) {
      case "ship":
        player.enterShipMode({ y: saved.y, portalY: saved.y }, true);
        break;
      case "ball":
        player.enterBallMode({ y: saved.y, portalY: saved.y });
        break;
      case "ufo":
        player.enterUfoMode({ y: saved.y, portalY: saved.y }, true);
        break;
      case "wave":
        player.enterWaveMode({ y: saved.y, portalY: saved.y });
        break;
      case "robot":
        player.enterRobotMode({ y: saved.y, portalY: saved.y });
        break;
      case "spider":
        player.enterSpiderMode({ y: saved.y, portalY: saved.y });
        break;
      default:
        player.exitShipMode();
        player.exitBallMode();
        player.exitUfoMode();
        player.exitWaveMode();
        player.exitRobotMode();
        player.exitSpiderMode();
        state.isFlying = false;
        state.isBall = false;
        state.isUfo = false;
        state.isWave = false;
        state.isRobot = false;
        state.isSpider = false;
        player.setShipVisible(false);
        player.setBallVisible(false);
        player.setWaveVisible(false);
        player.setBirdVisible?.(false);
        player.setRobotVisible(false);
        player.setSpiderVisible(false);
        player.setCubeVisible(true);
        break;
    }
    state.y = saved.y;
    if (keepVelocity && Number.isFinite(saved.yVelocity)) state.yVelocity = saved.yVelocity;
    state.gravityFlipped = saved.gravityFlipped;
    state.upKeyDown = saved.upKeyDown;
    state.upKeyPressed = saved.upKeyPressed;
    state.queuedHold = saved.queuedHold;
    state._orbActivationConsumedForPress = !!saved.orbActivationConsumedForPress;
    state.mirrored = saved.mirrored;
    state.isMini = saved.isMini;
  }
  _getInitialDualPortalMode() {
    if (!this._level || !this._player2 || !this._state2) return null;

    const worldX = Number(this._playerWorldX);
    const worldY = Number(this._state2.y);
    if (!Number.isFinite(worldX) || !Number.isFinite(worldY)) return null;

    const halfSize = this._state2.isWave
      ? (this._state2.isMini ? 6 : 9)
      : (this._state2.isMini ? 18 : 30);

    const previousWorldXRaw = Number(this._player?._lastCollisionWorldX);
    const previousWorldYRaw = Number(this._player?._lastCollisionWorldY);
    const previousWorldX = Number.isFinite(previousWorldXRaw) ? previousWorldXRaw : worldX;
    const previousWorldY = Number.isFinite(previousWorldYRaw)
      ? previousWorldYRaw
      : (Number.isFinite(Number(this._state?.lastY)) ? Number(this._state.lastY) : worldY);

    const nearbyObjects = this._level.getNearbySectionObjects?.(worldX) || [];
    const previousNearbyObjects = previousWorldX !== worldX
      ? (this._level.getNearbySectionObjects?.(previousWorldX) || [])
      : [];
    const portalObjects = [...new Set([...nearbyObjects, ...previousNearbyObjects])];

    let portalMode = null;

    for (const gameObj of portalObjects) {
      const mode = this._getGamemodePortalMode(gameObj?.type);
      if (!mode) continue;

      let touching = false;

      if (gameObj.hitbox_radius !== undefined && gameObj.hitbox_radius !== null) {
        const radius = gameObj.hitbox_radius + halfSize;
        const dx = worldX - gameObj.x;
        const dy = worldY - gameObj.y;
        touching = (dx * dx + dy * dy) <= radius * radius;

        if (!touching && (previousWorldX !== worldX || previousWorldY !== worldY)) {
          const prevDx = previousWorldX - gameObj.x;
          const prevDy = previousWorldY - gameObj.y;
          touching = (prevDx * prevDx + prevDy * prevDy) <= radius * radius;

          if (!touching) {
            const steps = Math.min(
              12,
              Math.max(2, Math.ceil(
                Math.max(Math.abs(worldX - previousWorldX), Math.abs(worldY - previousWorldY)) / Math.max(1, halfSize)
              ))
            );

            for (let i = 1; i < steps; i++) {
              const t = i / steps;
              const sampleX = previousWorldX + (worldX - previousWorldX) * t;
              const sampleY = previousWorldY + (worldY - previousWorldY) * t;
              const sampleDx = sampleX - gameObj.x;
              const sampleDy = sampleY - gameObj.y;

              if ((sampleDx * sampleDx + sampleDy * sampleDy) <= radius * radius) {
                touching = true;
                break;
              }
            }
          }
        }
      } else if (typeof this._player2._isPlayerTouchingPortalHitbox === "function") {
        touching = this._player2._isPlayerTouchingPortalHitbox(
          gameObj,
          worldX,
          worldY,
          halfSize,
          previousWorldX,
          previousWorldY
        );
      }

      if (touching) portalMode = mode;
    }

    return portalMode;
  }
  _copyDualInputFlags(fromState, toState) {
    if (!fromState || !toState) return;
    toState.upKeyDown = fromState.upKeyDown;
    toState.upKeyPressed = fromState.upKeyPressed;
    toState.queuedHold = fromState.queuedHold;
    const fromConsumed = !!(fromState._orbActivationConsumedForPress ?? fromState.orbActivationConsumedForPress);
    toState._orbActivationConsumedForPress = !!fromState.upKeyDown && (!!toState._orbActivationConsumedForPress || fromConsumed);
  }
  _shouldSuppressDualGravityAction(state, gravityAlreadySynced) {
    return !!(gravityAlreadySynced && state && state.isBall && state.upKeyPressed);
  }
  _shouldSkipDualBallGravitySync(fromState, toState, options = {}) {
    if (!fromState?.isBall || !toState) return false;
    if (options.forceGravitySync) return false;
    if (options.skipBallInputGravity) return true;
    return !(toState.onGround || toState.onCeiling || toState.canJump);
  }
  _shouldSkipDualSpiderInputGravitySync(fromState, options = {}) {
    if (!fromState?.isSpider) return false;
    if (options.forceGravitySync) return false;
    return !!options.skipSpiderInputGravity;
  }
  _isDualBallOnSurface(state) {
    return !!(state && (state.onGround || state.onCeiling || state.canJump));
  }
  _areDualBallsOverlapping() {
    if (!this._isDual || !this._state || !this._state2) return false;
    if (this._state.isDead || this._state2.isDead) return false;
    if (!this._state.isBall || !this._state2.isBall) return false;
    const size1 = this._state.isMini ? 18 : 30;
    const size2 = this._state2.isMini ? 18 : 30;
    return Math.abs(this._state.y - this._state2.y) < (size1 + size2);
  }
  _flipDualBallForOverlap(player, state) {
    if (!player || !state || !state.isBall) return false;
    const flipMod = state.gravityFlipped ? -1 : 1;
    state.yVelocity = flipMod * 22.360064 * (state.isMini ? 0.8 : 1);
    player.flipGravity(!state.gravityFlipped);
    state.onGround = false;
    state.onCeiling = false;
    state.canJump = false;
    state.isJumping = false;
    state.yVelocity *= 0.6;
    return true;
  }
  _resolveDualBallOverlap() {
    if (!this._areDualBallsOverlapping()) {
      this._dualBallOverlapResolved = false;
      this._dualBallSpawnGravityLock = false;
      return false;
    }
    if (this._dualBallSpawnGravityLock) {
      if (this._state2.gravityFlipped === this._state.gravityFlipped) {
        this._player2.flipGravity(!this._state.gravityFlipped, 1);
        this._state2.onCeiling = false;
      }
      this._dualBallOverlapResolved = true;
      return false;
    }
    if (this._dualBallOverlapResolved) return false;
    const primaryOnSurface = this._isDualBallOnSurface(this._state);
    const secondaryOnSurface = this._isDualBallOnSurface(this._state2);
    if (!primaryOnSurface && !secondaryOnSurface) return false;

    let flipped = false;
    if (primaryOnSurface && !secondaryOnSurface) {
      flipped = this._flipDualBallForOverlap(this._player2, this._state2);
    } else if (secondaryOnSurface && !primaryOnSurface) {
      flipped = this._flipDualBallForOverlap(this._player, this._state);
    } else if (primaryOnSurface && secondaryOnSurface) {
      flipped = this._flipDualBallForOverlap(this._player2, this._state2);
    }
    if (flipped) this._dualBallOverlapResolved = true;
    return flipped;
  }
  _copyInitialDualModeFlags(fromState, toState) {
    if (!fromState || !toState) return;
    toState.isMini = fromState.isMini;
    toState.mirrored = fromState.mirrored;
    toState.gravityFlipped = !fromState.gravityFlipped;
    this._copyDualInputFlags(fromState, toState);
  }
  _syncDualGlobalsFromPrimary(options = {}) {
    if (!this._isDual || !this._state || !this._state2 || this._state2.isDead) return false;
    let gravitySynced = false;
    if (!this._shouldSkipDualBallGravitySync(this._state, this._state2, options) && !this._shouldSkipDualSpiderInputGravitySync(this._state, options)) {
      const nextGravity = !this._state.gravityFlipped;
      this._state2.gravityFlipped = nextGravity;
      gravitySynced = true;
    }
    this._state2.mirrored = this._state.mirrored;
    this._ensureDualFlyBounds();
    return gravitySynced;
  }
  _syncDualGlobalsFromSecondary(options = {}) {
    if (!this._isDual || !this._state || !this._state2 || this._state.isDead || this._state2.isDead) return false;
    let gravitySynced = false;
    if (!this._shouldSkipDualBallGravitySync(this._state2, this._state, options) && !this._shouldSkipDualSpiderInputGravitySync(this._state2, options)) {
      const nextGravity = !this._state2.gravityFlipped;
      this._state.gravityFlipped = nextGravity;
      gravitySynced = true;
    }
    this._state.mirrored = this._state2.mirrored;
    this._ensureDualFlyBounds();
    return gravitySynced;
  }
  _ensureDualFlyBounds(centerY = null) {
    if (!this._isDual || !this._level) return;
    const fullSpan = f;
    const hasShipWave = this._state.isFlying || this._state.isWave || this._state2.isFlying || this._state2.isWave;
    const span = hasShipWave ? fullSpan : fullSpan - a;
    const floorY = this._level._flyFloorY;
    const ceilingY = this._level._flyCeilingY;
    const currentSpan = Number.isFinite(Number(floorY)) && Number.isFinite(Number(ceilingY)) ? Number(ceilingY) - Number(floorY) : null;
    if (currentSpan === null || Math.abs(currentSpan - span) > 0.01 || !this._level._flyGroundActive) {
      const y = centerY === null && Number.isFinite(floorY) && this._level._flyGroundActive ? floorY + span / 2 : (centerY ?? this._state.y) + (span - fullSpan) / 2;
      this._level.setFlyMode(true, y, span, false);
    }
  }
  _refreshFlyBoundsAfterDual() {
    if (!this._level) return;
    if (this._state.isFlying || this._state.isWave || this._state.isUfo) {
      this._level.setFlyMode(true, this._state.y, f, false);
    } else if (this._state.isBall) {
      this._level.setFlyMode(true, this._state.y, f - a * 2, false);
    } else if (this._state.isSpider) {
      const spiderBlockSize = typeof a !== "undefined" ? a : 30;
      const spiderBaseHeight = typeof f !== "undefined" ? f : 480;
      const spiderFlyHeight = Math.max(spiderBlockSize, spiderBaseHeight - spiderBlockSize);
      this._level.setFlyMode(true, this._state.y, spiderFlyHeight, false, spiderFlyHeight);
    } else {
      this._level.setFlyMode(false, 0);
    }
  }
  _killDualPlayers() {
    if (this._state && !this._state.isDead) this._player.killPlayer();
    if (this._isDual && this._state2 && !this._state2.isDead) this._player2.killPlayer();
  }

  _getMirrorXOffset(xOffset) {
    return xOffset + (screenWidth - 2 * xOffset) * this._mirrorProgress();
  }
  _enableDualMode() {
    if (this._isDual) return;
    this._isDual = true;
    this._dualBallSpawnGravityLock = false;
    this._dualBallOverlapResolved = false;
    this._state2.reset();
    this._state2.isDead = false;
    this._state2.yVelocity = this._state.yVelocity;
    this._copyInitialDualModeFlags(this._state, this._state2);
    this._ensureDualFlyBounds(this._state.y);
    const primaryY = Number.isFinite(Number(this._state.y)) ? Number(this._state.y) : 30;
    this._state2.y = primaryY;
    this._state2.lastY = primaryY;
    this._state2.lastGroundPosY = primaryY;
    this._state2.onGround = false;
    this._state2.onCeiling = false;
    this._state2.canJump = false;
    this._state2.isJumping = false;
    this._player2.reset();
    this._player2.setInvertedColors?.(true);
    this._setPlayerGamemode(this._player2, this._state2, this._getDualModeId(this._state), true);
    this._copyInitialDualModeFlags(this._state, this._state2);
    const initialPortalMode = this._getInitialDualPortalMode();
    if (initialPortalMode) this._setPlayerGamemode(this._player2, this._state2, initialPortalMode, true);
    if (this._state.isBall && this._state2.isBall) {
      this._state2.gravityFlipped = !this._state.gravityFlipped;
      this._dualBallOverlapResolved = true;
      this._dualBallSpawnGravityLock = true;
    }
    this._ensureDualFlyBounds(this._state.y);
    if (this._player2 && this._player2._hitboxTrail) this._player2._hitboxTrail = [];
    if (this._player2?._hitboxGraphics) this._player2._hitboxGraphics.clear();
  }
  _disableDualMode() {
    if (!this._isDual) return;
    this._isDual = false;
    this._dualBallOverlapResolved = false;
    this._dualBallSpawnGravityLock = false;
    this._state2.isDead = true;
    this._state2.upKeyDown = false;
    this._state2.upKeyPressed = false;
    this._state2.queuedHold = false;
    this._state2.isDashing = false;
    this._state2.dashYVelocity = 0;
    this._player2._dashAnimationSprite?.setVisible(false);
    this._player2.setCubeVisible(false);
    this._player2.setShipVisible(false);
    this._player2.setBallVisible(false);
    this._player2.setWaveVisible(false);
    this._player2.setBirdVisible?.(false);
    this._player2.setRobotVisible(false);
    this._player2.setSpiderVisible(false);
    if (this._player2?._hitboxGraphics) this._player2._hitboxGraphics.clear();
    if (this._player2 && this._player2._hitboxTrail) this._player2._hitboxTrail = [];
    this._refreshFlyBoundsAfterDual();
  }
  _triggerEndPortal() {
    if (this._isDual && this._player2 && this._state2 && !this._state2.isDead) {
      this._player2.playEndAnimation(this._level.endXPos, () => {}, this._endPortalGameY);
    }
    this._player.playEndAnimation(this._level.endXPos, () => this._levelComplete(), this._endPortalGameY);
  }
  _levelComplete() {
    if (!this._practicedMode.practiceMode) {
      const isNonPersistentCoinLevel = window.isEditor || this._level?._isStoredUserLevel?.();
      if (isNonPersistentCoinLevel) {
        this._level.resetCoinsForEditorCompletion?.();
      } else {
        this._level.commitSecretCoins?.();
        this._level.commitUserCoins?.();
      }
      this._bestPercent = 100;
      localStorage.setItem("bestPercent_" + (window.currentlevel[2] || "level_1"), 100);
      const completedKey = "gd_completedSet";
      let completedSet;
      try { completedSet = JSON.parse(localStorage.getItem(completedKey) || "[]"); } catch(e) { completedSet = []; }
      const levelId = window.currentlevel[2] || "level_1";
      if (!completedSet.includes(levelId)) {
        completedSet.push(levelId);
        localStorage.setItem(completedKey, JSON.stringify(completedSet));
        window._completedLevels = completedSet.length;
        localStorage.setItem("gd_completedLevels", window._completedLevels);
      }
    } else {
      this._practiceBestPercent = 100;
      localStorage.setItem("practiceBestPercent_" + (window.currentlevel[2] || "level_1"), 100);
      if (this._updatePracticeHUDBar) this._updatePracticeHUDBar();
    }

    const _0x356782 = this._level.endXPos - this._cameraX;
    const _0x2d967b = b(this._endPortalGameY) + this._cameraY;
    for (let _0x481f7c = 0; _0x481f7c < 5; _0x481f7c++) {
      this.time.delayedCall(_0x481f7c * 50, () => circleEffect(this, _0x356782, _0x2d967b, 10, screenWidth, 500, false, true, window.mainColor));
    }
    circleEffect(this, _0x356782, _0x2d967b, 10, 1000, 500, true, false, window.mainColor);
    this._showCompleteEffect();
  }
  _isMainLevelForCoinDisplay() {
    const levelId = window.currentlevel?.[2];
    return !!levelId && Array.isArray(window.allLevels) && window.allLevels.some(level => level?.[2] === levelId);
  }

}