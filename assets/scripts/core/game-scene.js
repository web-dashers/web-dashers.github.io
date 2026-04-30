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
    if (!this.practiceMode) return false;
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
      gravity: playerState.gravity,
      jumpPower: playerState.jumpPower,
      mirrored: playerState.mirrored,
      isDashing: playerState.isDashing,
      dashYVelocity: playerState.dashYVelocity,
      cameraX: cameraX,
      flyCeilingY: scene._level._flyCeilingY,
      flyGroundActive: scene._level._flyGroundActive,
      flyVisualOnly: scene._level._flyVisualOnly,
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

class xs extends Phaser.Scene {
  constructor() {
    super({
      key: "GameScene"
    });
  }
  create() {
    this._bgSpeedX = 0.1;
    this._bgSpeedY = 0.1;
    this._menuCameraX = -centerX;
    this._prevCameraX = -centerX;
    this._bg = this.add.tileSprite(0, 0, screenWidth, screenHeight, "game_bg_01").setOrigin(0, 0).setScrollFactor(0).setDepth(-10);
    const _0x15d27a = this.textures.get("game_bg_01").source[0].height;
    this._bgInitY = _0x15d27a - screenHeight - o;
    this._cameraX = -centerX;
    this._cameraY = 0;
    this._cameraXRef = {
      get value() {
        return this._v;
      },
      _v: -centerX
    };
    this._state = new PlayerState();
    this._level = new us(this, this._cameraXRef);
    this._orbGfx = null;
    this._orbGfxTimer = 0;
    this._player = new ps(this, this._state, this._level);
    this._state2 = new PlayerState();
    this._player2 = new ps(this, this._state2, this._level);
    this._isDual = false;
    this._player2.setCubeVisible(false);
    this._player2.setShipVisible(false);
    this._player2.setBallVisible(false);
    this._player2.setWaveVisible(false);
    this._colorManager = new ms();
    this._practicedMode = new PracticeMode();
    if (this._audio == null) {
      this._audio = new ys(this);
    }
    if (window._onlineLevelString && window._onlineLevelId &&
        window.currentlevel[2] === window._onlineLevelId) {
      try {
        this.cache.text.entries.set(window._onlineLevelId, window._onlineLevelString);
      } catch(e) {}
    }
    let _0x591888 = this.cache.text.get(window.currentlevel[2]);
    if (!_0x591888 && window._onlineLevelString && window.currentlevel[2] === window._onlineLevelId) {
      _0x591888 = window._onlineLevelString;
    }
    if (_0x591888) {
      this._level.loadLevel(_0x591888);
    }
    const _bgId = window._backgroundId || "01";
    const _bgKey = "game_bg_" + (parseInt(_bgId, 10) - 1);
    if (this.textures.exists(_bgKey)) {
      this._bg.setTexture(_bgKey);
      const _newBgH = this.textures.get(_bgKey).source[0].height;
      this._bgInitY = _newBgH - screenHeight - o;
    }
    this._level.applyGroundTexture();
    if (this._level._initialColors) {
      for (let chId in this._level._initialColors) {
        let col = this._level._initialColors[chId];
        this._colorManager.setInitialColor(parseInt(chId, 10), col);
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
    this._level.additiveContainer.setVisible(false);
    this._level.container.setVisible(false);
    this._level.topContainer.setVisible(false);
    this._attempts = 1;
    this._bestPercent = 0;
    this._lastPercent = 0;
    this._practiceBestPercent = parseFloat(localStorage.getItem("practiceBestPercent_" + (window.currentlevel[2] || "level_1")) || "0");
    this._endPortalGameY = 240;
    this._resetGameplayState();
    this._totalJumps = 0;
    this._playTime = 0;
    this._menuActive = true;
    this._slideIn = false;
    this._slideGroundX = null;
    this._firstPlay = true;
    this._player.setCubeVisible(false);
    this._player.setShipVisible(false);
    this._player.setBallVisible(false);
    this._logo = this.add.image(0, 100, "GJ_WebSheet", "GJ_logo_001.png").setScrollFactor(0).setDepth(30);
    this._robLogo = this.add.image(160, 555, "GJ_WebSheet", "RobTopLogoBig_001.png").setScrollFactor(0).setDepth(30).setScale(0.9);
    this._copyrightText = this.add.text(0, 625, "© 2026 RobTop Games · geometrydash.com", {
      fontSize: "14px",
      color: "#ffffff",
      fontFamily: "Arial"
    }).setOrigin(1, 1).setScrollFactor(0).setDepth(30).setAlpha(0.3);
    this._tryMeImg = this.add.image(0, 182.5, "GJ_WebSheet", "tryMe_001.png").setScrollFactor(0).setDepth(30);
    this._downloadBtns = [];
    const _0x4fc67f = [{
      key: "downloadSteam_001",
      url: "https://github.com/web-dashers/web-dashers.github.io"
    },
    {
      key: "downloadApple_001",
      url: "https://discord.gg/TfEzAVWPSJ"
    }];
    for (let _0xfeaf5c = 0; _0xfeaf5c < _0x4fc67f.length; _0xfeaf5c++) {
      const _0x1ce2a6 = _0x4fc67f[_0xfeaf5c];
      const _0x6bf69f = 1 / 1.5;
      const _0x1d293f = this.add.image(0, 0, "GJ_WebSheet", _0x1ce2a6.key + ".png").setScrollFactor(0).setDepth(30).setScale(_0x6bf69f).setInteractive();
      this._makeBouncyButton(_0x1d293f, _0x6bf69f, () => window.open(_0x1ce2a6.url, "_blank"), () => this._menuActive);
      this._downloadBtns.push(_0x1d293f);
    }
    const _0x28fa5b = this.scale.isFullscreen;
    this._menuFsBtn = this.add.image(33, 33, "GJ_WebSheet", _0x28fa5b ? "toggleFullscreenOff_001.png" : "toggleFullscreenOn_001.png").setScrollFactor(0).setDepth(30).setScale(0.64).setAlpha(0.8).setTint(Phaser.Display.Color.GetColor(255, 255, 255)).setInteractive();
    this._expandHitArea(this._menuFsBtn, 1.5);
    this._makeBouncyButton(this._menuFsBtn, 0.64, () => {
      const _0x26b7c = !this.scale.isFullscreen;
      this._menuFsBtn.setTexture("GJ_WebSheet", _0x26b7c ? "toggleFullscreenOff_001.png" : "toggleFullscreenOn_001.png");
      this._expandHitArea(this._menuFsBtn, 1.5);
      this._toggleFullscreen();
    }, () => this._menuActive);
    this._menuInfoBtn = this.add.image(screenWidth - 30 - 3, 33, "GJ_GameSheet03", "communityCreditsBtn_001.png").setScrollFactor(0).setDepth(30).setScale(0.64).setAlpha(0.8).setTint(Phaser.Display.Color.GetColor(255, 255, 255)).setInteractive();
    this._expandHitArea(this._menuInfoBtn, 1.5);
    this._makeBouncyButton(this._menuInfoBtn, 0.64, () => {
      this._buildInfoPopup();
    }, () => this._menuActive && !this._infoPopup);
    this._menuUpdateLogBtn = this.add.image(screenWidth - 30 - 50, 33, "GJ_WebSheet", "GJ_infoIcon_001.png").setScrollFactor(0).setDepth(30).setScale(0.64).setAlpha(0.8).setTint(Phaser.Display.Color.GetColor(255, 255, 255)).setInteractive();
    this._expandHitArea(this._menuUpdateLogBtn, 1.5);
    this._makeBouncyButton(this._menuUpdateLogBtn, 0.64, () => {
      this._buildUpdateLogPopup();
    }, () => this._menuActive && !this._updateLogPopup);
    this._menuGlitter = this.add.particles(0, 0, "GJ_WebSheet", {
      frame: "square.png",
      speed: 0,
      scale: {
        start: 0.5,
        end: 0
      },
      alpha: {
        start: 0.6,
        end: 0.2
      },
      lifespan: {
        min: 1000,
        max: 2000
      },
      frequency: 35,
      blendMode: S,
      tint: 20670,
      x: {
        min: -130,
        max: 130
      },
      y: {
        min: -100,
        max: 100
      }
    }).setScrollFactor(0).setDepth(29);
    this._playBtn = this.add.image(0, 0, "GJ_WebSheet", "GJ_playBtn_001.png").setScrollFactor(0).setDepth(30).setInteractive();
    this._playBtnPressed = false;
    this._makeBouncyButton(this._playBtn, 1, () => {
      this._openLevelSelect();
    }, () => this._menuActive && !this._playBtnPressed && !this._levelSelectOverlay);
    // creator stuff
    this._creatorBtn = this.add.image(0, 0, "GJ_GameSheet04", "GJ_creatorBtn_001.png").setScrollFactor(0).setDepth(30).setInteractive().setScale(1);
    this._creatorOverlay = null;
    this._creatorOverlayObjects = null;

    this._openCreatorMenu = () => {
      if (this._creatorOverlay) return;

      const sw = screenWidth;
      const sh = screenHeight;

      const fadeIn = this.add.graphics().setScrollFactor(0).setDepth(200);
      fadeIn.fillStyle(0x000000, 1);
      fadeIn.fillRect(0, 0, sw, sh);
      this.tweens.add({ targets: fadeIn, alpha: 0, duration: 300, ease: "Linear", onComplete: () => fadeIn.destroy() });

      const overlay = this.add.graphics().setScrollFactor(0).setDepth(100);
      const gradientSteps = 80;
      for (let gi = 0; gi < gradientSteps; gi++) {
        const t = gi / (gradientSteps - 1);
        const r1 = Math.round(0x00 + (0x01 - 0x00) * t);
        const g1 = Math.round(0x65 + (0x2c - 0x65) * t);
        const b1 = Math.round(0xff + (0x71 - 0xff) * t);
        const bandColor = (r1 << 16) | (g1 << 8) | b1;
        const bandY = Math.floor(gi * sh / gradientSteps);
        const bandH = Math.ceil(sh / gradientSteps) + 1;
        overlay.fillStyle(bandColor, 1);
        overlay.fillRect(0, bandY, sw, bandH);
      }
      this._creatorOverlay = overlay;

      const blocker = this.add.zone(sw / 2, sh / 2, sw, sh)
        .setScrollFactor(0).setDepth(101).setInteractive();

      const cornerTL = this.add.image(0,  0,  "GJ_GameSheet03", "GJ_sideArt_001.png")
        .setScrollFactor(0).setDepth(103).setOrigin(0, 0).setFlipX(true).setFlipY(false);
      const cornerBL = this.add.image(0,  sh, "GJ_GameSheet03", "GJ_sideArt_001.png")
        .setScrollFactor(0).setDepth(103).setOrigin(0, 1).setFlipX(true).setFlipY(true);

      const backBtn = this.add.image(50, 48, "GJ_GameSheet03", "GJ_arrow_03_001.png")
        .setScrollFactor(0).setDepth(104).setFlipX(true).setFlipY(true)
        .setRotation(Math.PI).setInteractive();
      this._makeBouncyButton(backBtn, 1, () => this._closeCreatorMenu());

      this._creatorOverlayObjects = [overlay, blocker, cornerTL, cornerBL, backBtn];

      const menuButtons = [
        "GJ_createBtn_001.png",
        "GJ_savedBtn_001.png",
        "GJ_highscoreBtn_001.png",
        "GJ_challengeBtn_001.png",
        "GJ_versusBtn_001.png",
        "GJ_mapBtn_001.png",
        "GJ_dailyBtn_001.png",
        "GJ_weeklyBtn_001.png",
        "GJ_eventBtn_001.png",
        "GJ_gauntletsBtn_001.png",
        "GJ_featuredBtn_001.png",
        "GJ_listsBtn_001.png",
        "GJ_pathsBtn_001.png",
        "GJ_mapPacksBtn_001.png",
        "GJ_searchBtn_001.png",
      ];

      const cols = 5;
      const btnScale = 0.77;
      const btnSize = 209 * btnScale;
      const gapX = 18;
      const gapY = 18;
      const gridW = cols * btnSize + (cols - 1) * gapX;
      const gridStartX = sw / 2 - gridW / 2 + btnSize / 2;
      const rows = Math.ceil(menuButtons.length / cols);
      const gridH = rows * btnSize + (rows - 1) * gapY;
      const gridStartY = sh / 2 - gridH / 2 + btnSize / 2;
      menuButtons.forEach((frame, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const bx = gridStartX + col * (btnSize + gapX);
        const by = gridStartY + row * (btnSize + gapY);
        const btn = this.add.image(bx, by, "GJ_GameSheet04", frame)
          .setScrollFactor(0).setDepth(104).setScale(btnScale);
        const isSearchButton = frame === "GJ_searchBtn_001.png";     
        if (isSearchButton) {
          btn.setInteractive();
          this._makeBouncyButton(btn, btnScale, () => {
            this._closeCreatorMenu(true);
            this._openSearchMenu();
          }, () => true);
        } else {
          btn.setTint(0x666666);
        }
        this._creatorOverlayObjects.push(btn);
      });
    };
    this._searchOverlay = null;
    this._searchOverlayObjects = [];
    this._openSearchMenu = () => {
      if (this._searchOverlay) return;
      const sw = screenWidth;
      const sh = screenHeight;

      const fadeIn = this.add.graphics().setScrollFactor(0).setDepth(200);
      fadeIn.fillStyle(0x000000, 1);
      fadeIn.fillRect(0, 0, sw, sh);
      this.tweens.add({ targets: fadeIn, alpha: 0, duration: 300, ease: "Linear", onComplete: () => fadeIn.destroy() });
      const overlay = this.add.graphics().setScrollFactor(0).setDepth(100);
      const gradientSteps = 80;
      for (let gi = 0; gi < gradientSteps; gi++) {
        const t = gi / (gradientSteps - 1);
        const r1 = Math.round(0x00 + (0x01 - 0x00) * t);
        const g1 = Math.round(0x65 + (0x2c - 0x65) * t);
        const b1 = Math.round(0xff + (0x71 - 0xff) * t);
        const bandColor = (r1 << 16) | (g1 << 8) | b1;
        const bandY = Math.floor(gi * sh / gradientSteps);
        const bandH = Math.ceil(sh / gradientSteps) + 1;
        overlay.fillStyle(bandColor, 1);
        overlay.fillRect(0, bandY, sw, bandH);
      }
      this._searchOverlay = overlay;
      const blocker = this.add.zone(sw / 2, sh / 2, sw, sh).setScrollFactor(0).setDepth(101).setInteractive();
      const backBtn = this.add.image(50, 48, "GJ_GameSheet03", "GJ_arrow_03_001.png")
        .setScrollFactor(0).setDepth(104).setFlipX(true).setFlipY(true)
        .setRotation(Math.PI).setInteractive();
      this._makeBouncyButton(backBtn, 1, () => this._closeSearchMenu());
      const inputW = 320;
      const inputH = 44;
      const inputX = sw / 2 - inputW / 2;
      const inputY = sh / 2 - inputH / 2;
      const inputBg = this.add.graphics().setScrollFactor(0).setDepth(104);
      inputBg.fillStyle(0x000000, 0.5);
      inputBg.fillRoundedRect(inputX, inputY, inputW, inputH, 8);
      inputBg.lineStyle(2, 0xffffff, 0.4);
      const canvas = this.sys.game.canvas;
      const canvasRect = canvas.getBoundingClientRect();
      const scaleX = canvasRect.width / sw;
      const scaleY = canvasRect.height / sh;
      const htmlInput = document.createElement("input");
      htmlInput.type = "text";
      htmlInput.placeholder = "";
      htmlInput.maxLength = 20;
      htmlInput.style.cssText = `
        position: fixed;
        left: ${canvasRect.left + inputX * scaleX}px;
        top: ${canvasRect.top + inputY * scaleY}px;
        width: ${inputW * scaleX}px;
        height: ${inputH * scaleY}px;
        background: transparent;
        border: none;
        outline: none;
        color: #ffffff;
        font-size: ${Math.round(20 * scaleY)}px;
        font-family: Arial, sans-serif;
        text-align: center;
        z-index: 9999;
        caret-color: #ffffff;
      `;
      document.body.appendChild(htmlInput);
      setTimeout(() => htmlInput.focus(), 50);
      const placeholderLabel = this.add.bitmapText(sw / 2, inputY + inputH / 2, "bigFont", "Enter a level, user or ID", 18)
        .setScrollFactor(0).setDepth(105).setOrigin(0.5, 0.5).setTint(0xaaddff);
      const typedLabel = this.add.bitmapText(sw / 2, inputY + inputH / 2, "bigFont", "", 18)
        .setScrollFactor(0).setDepth(105).setOrigin(0.5, 0.5).setTint(0xffffff);
      htmlInput.style.color = "transparent";
      htmlInput.style.caretColor = "#ffffff";
      htmlInput.addEventListener("input", () => {
        const val = htmlInput.value;
        placeholderLabel.setVisible(val.length === 0);
        typedLabel.setText(val);
      });
      const _repositionInput = () => {
        const r = canvas.getBoundingClientRect();
        const sx = r.width / sw;
        const sy = r.height / sh;
        htmlInput.style.left = `${r.left + inputX * sx}px`;
        htmlInput.style.top  = `${r.top  + inputY * sy}px`;
        htmlInput.style.width  = `${inputW * sx}px`;
        htmlInput.style.height = `${inputH * sy}px`;
        htmlInput.style.fontSize = `${Math.round(20 * sy)}px`;
      };
      window.addEventListener("resize", _repositionInput);
      const statusText = this.add.text(sw / 2, inputY + inputH + 22, "", {
        fontSize: "16px",
        fontFamily: "Arial, sans-serif",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 420 }
      }).setScrollFactor(0).setDepth(106).setOrigin(0.5, 0).setAlpha(0);
      this._searchOverlayObjects.push(statusText);
      const _showStatus = (msg, color = "#ffffff", duration = 0) => {
        statusText.setText(msg);
        statusText.setColor(color);
        this.tweens.killTweensOf(statusText);
        statusText.setAlpha(1);
      };
      let _loading = false;
      const _doSearch = async () => {
        if (_loading) return;
        const levelId = htmlInput.value.trim().replace(/\D/g, "");
        if (!levelId) {
          _showStatus("enter a level id", "#ff6666", 3000);

          return;
        }
        _loading = true;
        try {
          await _doSearchInner(levelId);
        } catch (err) {
          console.error("search error:", err);
          _showStatus("error: " + err.message, "#ff5555");
        } finally {
          _loading = false;
        }
      };
      const _doSearchInner = async (levelId) => {
        _showStatus("fetching level", "#ffb700");

        const PROXY_BASE = (window._gdProxyUrl || "").replace(/\/$/, "");
        if (!PROXY_BASE) {
          _showStatus("no proxy configured. set window._gdProxyUrl first.", "#ff0000");
          return;
        }
        const formBody = `levelID=${levelId}&secret=Wmfd2893gb7`;
        const res = await fetch(`${PROXY_BASE}/downloadGJLevel22.php`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formBody
        });
        if (!res.ok) throw new Error(`Proxy returned ${res.status}`);
        const rawResponse = await res.text();
        console.log("raw response:", rawResponse.slice(0, 200));
        if (!rawResponse || rawResponse === "-1" || !rawResponse.includes(":")) {
          _showStatus("level not found from servers. check the id and try again.", "#ff0000");
          return;
        }
        const gdMap = {};
        const _gdMatches = [...rawResponse.matchAll(/(?:^|:)(\d+):/g)];
        for (let i = 0; i < _gdMatches.length; i++) {
          const valueStart = _gdMatches[i].index + _gdMatches[i][0].length;
          const valueEnd   = i + 1 < _gdMatches.length ? _gdMatches[i + 1].index : rawResponse.length;
          gdMap[_gdMatches[i][1]] = rawResponse.slice(valueStart, valueEnd);
        }
        console.log("parsed keys:", Object.keys(gdMap).join(", "), "| key35:", gdMap["35"]);
        const levelString   = gdMap["4"] || null;
        const levelName     = gdMap["2"] || "Online Level";
        const levelIdParsed = gdMap["1"] || levelId;
        const songIdRaw     = (gdMap["35"] || "").trim();
        const isCustomSong  = !!songIdRaw && songIdRaw !== "0";
        const officialSongId = gdMap["12"] || "0";
        const songKey = isCustomSong ? `ng_song_${songIdRaw}` : window.allLevels[officialSongId][0];
        window.currentlevel[0] = songKey;
        window._onlineSongOffset = parseFloat(gdMap["45"] || "0") || 0;
        console.log("song offset (field 45):", window._onlineSongOffset);
        console.log("level:", levelName, "| songId:", songIdRaw, "| custom:", isCustomSong);
        _showStatus(`found "${levelName}"${isCustomSong ? ` — loading song #${songIdRaw}...` : ""}`, "#00ff00");
        if (isCustomSong) {
          window._onlineSongBuffer = null; 
          window._onlineSongKey    = null;
          try {
            const ngRes = await fetch(`${PROXY_BASE}/getGJSongInfo.php`, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: `songID=${songIdRaw}&secret=Wmfd2893gb7`
            });
            const ngText = ngRes.ok ? await ngRes.text() : "-1";
            console.log("song info response:", ngText.slice(0, 200));
            if (ngText && ngText !== "-1") { 
              const ngParts = ngText.split("~|~");
              const ngMap = {};
              for (let i = 0; i + 1 < ngParts.length; i += 2) ngMap[ngParts[i]] = ngParts[i + 1];
              const rawUrl  = (ngMap["10"] || "").trim();
              const songUrl = decodeURIComponent(rawUrl);
              const songArtist = (ngMap["4"]  || "Unknown").replace(/:$/, "").trim();
              const songTitle  = (ngMap["2"]  || `Song #${songIdRaw}`).replace(/:$/, "").trim();
              console.log("song url:", songUrl);
              if (songUrl) {
                _showStatus(`loading "${songTitle}" by ${songArtist}...`, "#00ff00");
                const audioCtx = this.game.sound.context;
                if (audioCtx.state === "suspended") await audioCtx.resume();
                const proxiedUrl = `${PROXY_BASE}/audio-proxy?url=${encodeURIComponent(songUrl)}`;
                const audioRes = await fetch(proxiedUrl);
                if (!audioRes.ok) throw new Error(`audio proxy returned ${audioRes.status}`);
                const arrayBuf = await audioRes.arrayBuffer();
                const decoded  = await audioCtx.decodeAudioData(arrayBuf);
                window._onlineSongBuffer = decoded;
                window._onlineSongKey    = songKey;
                window._onlineSongTitle  = songTitle;
                window._onlineSongArtist = songArtist;
                console.log("song decoded ok, duration:", decoded.duration.toFixed(1) + "s");
              }
            }
          } catch (songErr) {
            console.warn("song fetch failed using default music:", songErr);
          }
        } else {
          window._onlineSongBuffer = null;
          window._onlineSongKey    = null;
          window._onlineSongArtist = null;
        }
        window._onlineLevelString = levelString;
        window._onlineLevelName   = levelName;
        window._onlineLevelId     = "online_" + levelIdParsed;
        this.game.registry.set("autoStartGame", true);
        window.currentlevel = [
          songKey,
          levelName,
          window._onlineLevelId,
          [window._onlineSongArtist || "Unknown"]
        ];
        _showStatus(`loading string for "${levelName}"`, "#00ff00");
        this.time.delayedCall(600, () => {
          htmlInput.remove();
          window.removeEventListener("resize", _repositionInput);
          this._closeSearchMenu(true);
          this._closeLevelSelect && this._closeLevelSelect(true);
          const flash = this.add.graphics().setScrollFactor(0).setDepth(300).setAlpha(0);
          flash.fillStyle(0x000000, 1);
          flash.fillRect(0, 0, sw, sh);
          this.tweens.add({
            targets: flash, alpha: 1, duration: 250, ease: "Linear",
            onComplete: () => this.scene.restart()
          });
        });
      };
      this._searchOverlayObjects = [
        overlay, blocker, backBtn, inputBg, statusText, placeholderLabel, typedLabel
      ];
      if (window.levelID) { // if there's an ID parameter, load it directly
        htmlInput.remove();
        const loadingBg = this.add.graphics().setScrollFactor(0).setDepth(1000);
        loadingBg.fillStyle(0x000000, 1);
        loadingBg.fillRect(0, 0, sw, sh);
        const loadingText = this.add.bitmapText(sw / 2, sh / 2, "bigFont", "Loading level...", 30)
          .setScrollFactor(0).setDepth(1001).setOrigin(0.5);
        this._searchOverlayObjects.push(loadingBg, loadingText);
        statusText.setDepth(1002).setY(sh / 2 + 50).setAlpha(1);
        _doSearchInner(window.levelID);
      }
      htmlInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") _doSearch();
        e.stopPropagation();
      });
      htmlInput.addEventListener("keyup", (e) => e.stopPropagation());
      htmlInput.addEventListener("keypress", (e) => e.stopPropagation());
      this._searchHtmlInput = htmlInput;
      this._searchInputResizeFn = _repositionInput;
    };
    this._closeSearchMenu = (silent = false) => {
      if (!this._searchOverlay) return;
      if (this._searchHtmlInput) {
        this._searchHtmlInput.remove();
        this._searchHtmlInput = null;
      }
      if (this._searchInputResizeFn) {
        window.removeEventListener("resize", this._searchInputResizeFn);
        this._searchInputResizeFn = null;
      }
      const destroy = () => {
        for (const obj of this._searchOverlayObjects) {
          if (obj && obj.destroy) obj.destroy();
        }
        this._searchOverlayObjects = [];
        this._searchOverlay = null;
      };
      if (silent) { destroy(); return; }
      const sw = screenWidth, sh = screenHeight;
      const fadeOut = this.add.graphics().setScrollFactor(0).setDepth(200).setAlpha(0);
      fadeOut.fillStyle(0x000000, 1);
      fadeOut.fillRect(0, 0, sw, sh);
      this.tweens.add({
        targets: fadeOut, alpha: 1, duration: 150, ease: "Linear",
        onComplete: () => {
          destroy();
          this.tweens.add({ targets: fadeOut, alpha: 0, duration: 150, ease: "Linear", onComplete: () => fadeOut.destroy() });
        }
      });
    };
    this._makeBouncyButton(this._creatorBtn, 1, () => {
      this._openCreatorMenu();
      if (this._creatorBtn) {
        this.tweens.killTweensOf(this._creatorBtn);
        this._creatorBtn.y = 320;
        this._creatorBtn.setScale(1);
        this.tweens.add({
          targets: this._creatorBtn,
          y: 324,
          duration: 750,
          ease: "Quad.InOut",
          yoyo: true,
          repeat: -1
        });
      }
    }, () => this._menuActive && !this._levelSelectOverlay);
      //icon stufff
    this._iconBtn = this.add.image(0, 0, "GJ_GameSheet03", "GJ_garageBtn_001.png").setScrollFactor(0).setDepth(30).setInteractive().setScale(1);
    this._iconBtnSelected = false;
    this._makeBouncyButton(this._iconBtn, 1, () => {
      this._openIconSelector();
      if (this._iconBtn) {
        this.tweens.killTweensOf(this._iconBtn);
        this._iconBtn.y = 320;
        this._iconBtn.setScale(1);
        this.tweens.add({
          targets: this._iconBtn,
          y: 324,
          duration: 750,
          ease: "Quad.InOut",
          yoyo: true,
          repeat: -1
        });
      }
    }, () => this._menuActive && !this._levelSelectOverlay);

    this._iconOverlay = null;

    const _iconFrameSets = {
      icon: [
       "player_04_001.png", "player_03_001.png", "player_05_001.png", "player_06_001.png", "player_07_001.png", "player_22_001.png", "player_30_001.png", "player_35_001.png", "player_84_001.png", "player_132_001.png",
"player_08_001.png", "player_09_001.png", "player_10_001.png", "player_11_001.png", "player_12_001.png", "player_13_001.png", "player_14_001.png", "player_15_001.png", "player_16_001.png", "player_17_001.png",
"player_18_001.png", "player_19_001.png", "player_20_001.png", "player_21_001.png", "player_23_001.png", "player_24_001.png", "player_25_001.png", "player_26_001.png", "player_27_001.png", "player_28_001.png",
"player_29_001.png", "player_31_001.png", "player_32_001.png", "player_33_001.png", "player_34_001.png", "player_36_001.png", "player_37_001.png", "player_38_001.png", "player_39_001.png", "player_40_001.png",
"player_41_001.png", "player_42_001.png", "player_43_001.png", "player_44_001.png", "player_45_001.png", "player_46_001.png", "player_47_001.png", "player_48_001.png", "player_49_001.png", "player_50_001.png",
"player_51_001.png", "player_52_001.png", "player_53_001.png", "player_54_001.png", "player_55_001.png", "player_56_001.png", "player_57_001.png", "player_58_001.png", "player_59_001.png", "player_60_001.png",
"player_61_001.png", "player_62_001.png", "player_63_001.png", "player_64_001.png", "player_65_001.png", "player_66_001.png", "player_67_001.png", "player_68_001.png", "player_69_001.png", "player_70_001.png",
"player_71_001.png", "player_72_001.png", "player_73_001.png", "player_74_001.png", "player_75_001.png", "player_76_001.png", "player_77_001.png", "player_78_001.png", "player_79_001.png", "player_80_001.png",
"player_81_001.png", "player_82_001.png", "player_83_001.png", "player_85_001.png", "player_86_001.png", "player_87_001.png", "player_88_001.png", "player_89_001.png", "player_90_001.png", "player_91_001.png",
"player_92_001.png", "player_93_001.png", "player_94_001.png", "player_95_001.png", "player_96_001.png", "player_97_001.png", "player_98_001.png", "player_99_001.png", "player_100_001.png", "player_101_001.png",
"player_102_001.png", "player_103_001.png", "player_104_001.png", "player_105_001.png", "player_106_001.png", "player_107_001.png", "player_108_001.png", "player_109_001.png", "player_110_001.png", "player_111_001.png",
"player_112_001.png", "player_113_001.png", "player_114_001.png", "player_115_001.png", "player_116_001.png", "player_117_001.png", "player_118_001.png", "player_119_001.png", "player_120_001.png", "player_121_001.png",
"player_122_001.png", "player_123_001.png", "player_124_001.png", "player_125_001.png", "player_126_001.png", "player_127_001.png", "player_128_001.png", "player_129_001.png", "player_130_001.png", "player_131_001.png",
"player_133_001.png", "player_134_001.png", "player_135_001.png", "player_136_001.png", "player_137_001.png", "player_138_001.png", "player_139_001.png", "player_140_001.png", "player_141_001.png", "player_142_001.png",
"player_143_001.png", "player_144_001.png", "player_145_001.png", "player_146_001.png", "player_147_001.png", "player_148_001.png", "player_149_001.png", "player_150_001.png", "player_151_001.png", "player_152_001.png",
"player_153_001.png", "player_154_001.png", "player_155_001.png", "player_156_001.png", "player_157_001.png", "player_158_001.png", "player_159_001.png", "player_160_001.png", "player_161_001.png", "player_162_001.png",
"player_163_001.png", "player_164_001.png", "player_165_001.png", "player_166_001.png", "player_167_001.png", "player_168_001.png", "player_169_001.png", "player_170_001.png", "player_171_001.png", "player_172_001.png",
"player_173_001.png", "player_174_001.png", "player_175_001.png", "player_176_001.png", "player_177_001.png", "player_178_001.png", "player_179_001.png", "player_180_001.png", "player_181_001.png", "player_182_001.png",
"player_183_001.png", "player_184_001.png", "player_185_001.png", "player_186_001.png", "player_187_001.png", "player_188_001.png", "player_189_001.png", "player_190_001.png", "player_191_001.png", "player_192_001.png",
"player_193_001.png", "player_194_001.png", "player_195_001.png", "player_196_001.png", "player_197_001.png", "player_198_001.png", "player_199_001.png", "player_200_001.png", "player_201_001.png", "player_202_001.png",
"player_203_001.png", "player_204_001.png", "player_205_001.png", "player_206_001.png", "player_207_001.png", "player_208_001.png", "player_209_001.png", "player_210_001.png", "player_211_001.png", "player_212_001.png",
"player_213_001.png", "player_214_001.png", "player_215_001.png", "player_216_001.png", "player_217_001.png", "player_218_001.png", "player_219_001.png", "player_220_001.png", "player_221_001.png", "player_222_001.png",
"player_223_001.png", "player_224_001.png", "player_225_001.png", "player_226_001.png", "player_227_001.png", "player_228_001.png", "player_229_001.png", "player_230_001.png", "player_231_001.png", "player_232_001.png",
"player_233_001.png", "player_234_001.png", "player_235_001.png", "player_236_001.png", "player_237_001.png", "player_238_001.png", "player_239_001.png", "player_240_001.png", "player_241_001.png", "player_242_001.png",
"player_243_001.png", "player_244_001.png", "player_245_001.png", "player_246_001.png", "player_247_001.png", "player_248_001.png"
      ],
      ship: [
        "ship_01_001.png", "ship_02_001.png", "ship_03_001.png", "ship_04_001.png", "ship_17_001.png", "ship_22_001.png", "ship_33_001.png", "ship_11_001.png", "ship_12_001.png", "ship_10_001.png",
"ship_05_001.png", "ship_06_001.png", "ship_07_001.png", "ship_08_001.png", "ship_09_001.png", "ship_13_001.png", "ship_14_001.png", "ship_15_001.png", "ship_16_001.png", "ship_18_001.png",
"ship_19_001.png", "ship_20_001.png", "ship_21_001.png", "ship_23_001.png", "ship_24_001.png", "ship_25_001.png", "ship_26_001.png", "ship_27_001.png", "ship_28_001.png", "ship_29_001.png",
"ship_30_001.png", "ship_31_001.png", "ship_32_001.png", "ship_34_001.png", "ship_35_001.png", "ship_36_001.png", "ship_37_001.png", "ship_38_001.png", "ship_39_001.png", "ship_40_001.png",
"ship_41_001.png", "ship_42_001.png", "ship_43_001.png", "ship_44_001.png", "ship_45_001.png", "ship_46_001.png", "ship_47_001.png", "ship_48_001.png", "ship_49_001.png", "ship_50_001.png",
"ship_51_001.png", "ship_52_001.png", "ship_53_001.png", "ship_54_001.png", "ship_55_001.png", "ship_56_001.png", "ship_57_001.png", "ship_58_001.png", "ship_59_001.png", "ship_60_001.png",
"ship_61_001.png", "ship_62_001.png", "ship_63_001.png", "ship_64_001.png", "ship_65_001.png", "ship_66_001.png", "ship_67_001.png", "ship_68_001.png", "ship_69_001.png", "ship_70_001.png",
"ship_71_001.png", "ship_72_001.png", "ship_73_001.png", "ship_74_001.png", "ship_75_001.png", "ship_76_001.png", "ship_77_001.png", "ship_78_001.png", "ship_79_001.png"
      ],
      ball: [
        "player_ball_01_001.png", "player_ball_02_001.png", "player_ball_03_001.png", "player_ball_04_001.png", "player_ball_05_001.png", "player_ball_06_001.png", "player_ball_07_001.png", "player_ball_08_001.png", "player_ball_09_001.png", "player_ball_10_001.png",
        "player_ball_11_001.png", "player_ball_12_001.png", "player_ball_13_001.png", "player_ball_14_001.png", "player_ball_15_001.png", "player_ball_16_001.png", "player_ball_17_001.png", "player_ball_18_001.png", "player_ball_19_001.png", "player_ball_20_001.png",
        "player_ball_21_001.png", "player_ball_22_001.png", "player_ball_23_001.png", "player_ball_24_001.png", "player_ball_25_001.png", "player_ball_26_001.png", "player_ball_27_001.png", "player_ball_28_001.png", "player_ball_29_001.png", "player_ball_30_001.png",

        "player_ball_31_001.png", "player_ball_32_001.png", "player_ball_33_001.png", "player_ball_34_001.png", "player_ball_35_001.png", "player_ball_36_001.png", "player_ball_37_001.png", "player_ball_38_001.png", "player_ball_39_001.png", "player_ball_40_001.png",
        "player_ball_41_001.png", "player_ball_42_001.png", "player_ball_43_001.png", "player_ball_44_001.png", "player_ball_45_001.png", "player_ball_46_001.png", "player_ball_47_001.png", "player_ball_48_001.png", "player_ball_49_001.png", "player_ball_50_001.png",
        "player_ball_51_001.png", "player_ball_52_001.png",
      ],
      wave: [
        "dart_01_001.png", "dart_02_001.png", "dart_03_001.png", "dart_04_001.png", "dart_05_001.png",
        "dart_06_001.png", "dart_07_001.png", "dart_08_001.png", "dart_09_001.png", "dart_10_001.png",
        "dart_11_001.png", "dart_12_001.png", "dart_13_001.png", "dart_14_001.png", "dart_15_001.png",
        "dart_16_001.png", "dart_17_001.png", "dart_18_001.png", "dart_19_001.png", "dart_20_001.png",
        "dart_21_001.png", "dart_22_001.png", "dart_23_001.png", "dart_24_001.png", "dart_25_001.png",
        "dart_26_001.png", "dart_27_001.png", "dart_28_001.png", "dart_29_001.png", "dart_30_001.png",
        "dart_31_001.png", "dart_32_001.png", "dart_33_001.png", "dart_34_001.png", "dart_35_001.png",
      ],
      ufo: [
        "bird_01_001.png", "bird_02_001.png", "bird_03_001.png", "bird_04_001.png", "bird_05_001.png",
        "bird_06_001.png", "bird_07_001.png", "bird_08_001.png", "bird_09_001.png", "bird_10_001.png",
        "bird_11_001.png", "bird_12_001.png", "bird_13_001.png", "bird_14_001.png", "bird_15_001.png",
        "bird_16_001.png", "bird_17_001.png", "bird_18_001.png", "bird_19_001.png", "bird_20_001.png",
        "bird_21_001.png", "bird_22_001.png", "bird_23_001.png", "bird_24_001.png", "bird_25_001.png",
        "bird_26_001.png", "bird_27_001.png", "bird_28_001.png", "bird_29_001.png", "bird_30_001.png",
        "bird_31_001.png", "bird_32_001.png", "bird_33_001.png", "bird_34_001.png", "bird_35_001.png",
        "bird_36_001.png", "bird_37_001.png", "bird_38_001.png", "bird_39_001.png", "bird_40_001.png",
        "bird_41_001.png", "bird_42_001.png", "bird_43_001.png", "bird_44_001.png", "bird_45_001.png",
        "bird_46_001.png", "bird_47_001.png", "bird_48_001.png", "bird_49_001.png", "bird_50_001.png",
        "bird_51_001.png",
      ],
    };


    const _iconWindowProps = {
      icon: "currentPlayer",
      ship: "currentShip",
      ball: "currentBall",
      wave: "currentWave",
      ufo: "currentBird",
    };

    const _iconAtlas = {
      icon: "GJ_GameSheetIcons",
      ship: "GJ_GameSheetIcons",
      ball: "GJ_GameSheetIcons",
      wave: "GJ_GameSheetIcons",
      ufo: "GJ_GameSheetIcons",
    };

    const _tabBtnFrames = {
      icon: { on: "gj_iconBtn_on_001.png",  off: "gj_iconBtn_off_001.png"  },
      ship: { on: "gj_shipBtn_on_001.png",  off: "gj_shipBtn_off_001.png"  },
      ball: { on: "gj_ballBtn_on_001.png",  off: "gj_ballBtn_off_001.png"  },
      wave: { on: "gj_dartBtn_on_001.png",  off: "gj_dartBtn_off_001.png"  },
      ufo:  { on: "gj_birdBtn_on_001.png",  off: "gj_birdBtn_off_001.png"  },
    };

    this._openIconSelector = (startTab = "icon") => {
      if (this._iconOverlay) return;

      const sw = screenWidth;
      const sh = screenHeight;

      const fadeIn = this.add.graphics().setScrollFactor(0).setDepth(200);
      fadeIn.fillStyle(0x000000, 1);
      fadeIn.fillRect(0, 0, sw, sh);
      this.tweens.add({ targets: fadeIn, alpha: 0, duration: 300, ease: "Linear", onComplete: () => fadeIn.destroy() });

      const overlay = this.add.graphics().setScrollFactor(0).setDepth(100);
      const gradientSteps = 80;
      for (let gi = 0; gi < gradientSteps; gi++) {
        const t = gi / (gradientSteps - 1);
        const r1 = Math.round(0x92 + (0x3a - 0x92) * t);
        const g1 = Math.round(0x92 + (0x3a - 0x92) * t);
        const b1 = Math.round(0x92 + (0x3a - 0x92) * t);
        const bandColor = (r1 << 16) | (g1 << 8) | b1;
        const bandY = Math.floor(gi * sh / gradientSteps);
        const bandH = Math.ceil(sh / gradientSteps) + 1;
        overlay.fillStyle(bandColor, 1);
        overlay.fillRect(0, bandY, sw, bandH);
      }
      this._iconOverlay = overlay;

      const blocker = this.add.zone(sw / 2, sh / 2, sw, sh)
        .setScrollFactor(0).setDepth(101).setInteractive();

      const titleTxt = this.add.bitmapText(sw / 2, 60, "goldFont", "Icon Selector", 32)
        .setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(105);

      this._iconOverlayObjects = [overlay, blocker, titleTxt];

      const backBtn = this.add.image(50, 48, "GJ_GameSheet03", "GJ_arrow_03_001.png")
        .setScrollFactor(0).setDepth(104).setFlipY(true)
        .setFlipX(true)
        .setRotation(Math.PI).setInteractive();
      this._iconOverlayObjects.push(backBtn);
      this._makeBouncyButton(backBtn, 1, () => this._closeIconSelector());

      const topBarHeight = 100;
      const lineY = topBarHeight + 100;
      const linePadding = 230;
      const topBar = this.add.graphics().setScrollFactor(0).setDepth(102);
      const lineSegments = 40;
      const lineStart = linePadding;
      const lineEnd = sw - linePadding;
      const lineWidth = lineEnd - lineStart;
      const fadeZone = lineWidth * 0.25;
      for (let li = 0; li < lineSegments; li++) {
    const t0 = li / lineSegments;
    const t1 = (li + 1) / lineSegments;
    const x0 = lineStart + t0 * lineWidth;
    const x1 = lineStart + t1 * lineWidth;
    const mid = (t0 + t1) / 2 * lineWidth;
    let alpha;
    if (mid < fadeZone) {
      alpha = mid / fadeZone;
    } else if (mid > lineWidth - fadeZone) {
      alpha = (lineWidth - mid) / fadeZone;
    } else {
      alpha = 1;
    }
    topBar.lineStyle(3, 0xFFFFFF, alpha);
    topBar.beginPath();
    topBar.moveTo(x0, lineY);
    topBar.lineTo(x1, lineY);
    topBar.strokePath();
  }
      this._iconOverlayObjects.push(topBar);

      const cols = 10;
      const iconSize = 60;
      const padding = 18;
      const containerPadding = 10;
      const rows = 3;
      const containerWidth  = cols * iconSize + (cols - 1) * padding + 12;
      const containerHeight = rows * iconSize + (rows - 1) * padding + 12;
      const containerX = sw / 2 - containerWidth / 2;
      const containerY = sh - containerHeight - containerPadding - 130;
      const startX = containerX + 6 + iconSize / 2;
      const startY = containerY + 6 + iconSize / 2;

      const gridBg = this.add.graphics().setScrollFactor(0).setDepth(102);
      gridBg.fillStyle(0x454444, 1);
      gridBg.fillRoundedRect(containerX, containerY, containerWidth, containerHeight, 10);
      this._iconOverlayObjects.push(gridBg);

      const cornerTL = this.add.image(0,  0,  "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setDepth(103).setOrigin(0, 0).setFlipX(true).setFlipY(false).setRotation();
      const cornerTR = this.add.image(sw, 0,  "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setDepth(103).setOrigin(1, 0).setFlipY(false).setFlipX(false);
      const cornerBR = this.add.image(sw, sh, "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setDepth(103).setOrigin(1, 1).setFlipX(false).setFlipY(true);
      const cornerBL = this.add.image(0,  sh, "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setDepth(103).setOrigin(0, 1).setFlipX(true).setFlipY(true);
      this._iconOverlayObjects.push(cornerTL, cornerTR, cornerBR, cornerBL);

      const navDotSpacing = 35;
      const navDotY = containerY + containerHeight + 26;
      const navDot1 = this.add.image(sw / 2 - navDotSpacing / 2, navDotY, "GJ_GameSheet03", "gj_navDotBtn_on_001.png").setScrollFactor(0).setDepth(104).setScale(0.75);
      const navDot2 = this.add.image(sw / 2 + navDotSpacing / 2, navDotY, "GJ_GameSheet03", "gj_navDotBtn_off_001.png").setScrollFactor(0).setDepth(104).setScale(0.75);
      const navDot3 = this.add.image(sw / 2 + navDotSpacing / 2, navDotY, "GJ_GameSheet03", "gj_navDotBtn_off_001.png").setScrollFactor(0).setDepth(104).setScale(0.75).setVisible(false);
      const navDot4 = this.add.image(sw / 2 + navDotSpacing / 2, navDotY, "GJ_GameSheet03", "gj_navDotBtn_off_001.png").setScrollFactor(0).setDepth(104).setScale(0.75).setVisible(false);
      const navDot5 = this.add.image(sw / 2 + navDotSpacing / 2, navDotY, "GJ_GameSheet03", "gj_navDotBtn_off_001.png").setScrollFactor(0).setDepth(104).setScale(0.75).setVisible(false);
      const navDot6 = this.add.image(sw / 2 + navDotSpacing / 2, navDotY, "GJ_GameSheet03", "gj_navDotBtn_off_001.png").setScrollFactor(0).setDepth(104).setScale(0.75).setVisible(false);
      const navDot7 = this.add.image(sw / 2 + navDotSpacing / 2, navDotY, "GJ_GameSheet03", "gj_navDotBtn_off_001.png").setScrollFactor(0).setDepth(104).setScale(0.75).setVisible(false);
      const navDot8 = this.add.image(sw / 2 + navDotSpacing / 2, navDotY, "GJ_GameSheet03", "gj_navDotBtn_off_001.png").setScrollFactor(0).setDepth(104).setScale(0.75).setVisible(false);
      const navDot9 = this.add.image(sw / 2 + navDotSpacing / 2, navDotY, "GJ_GameSheet03", "gj_navDotBtn_off_001.png").setScrollFactor(0).setDepth(104).setScale(0.75).setVisible(false);
      this._iconOverlayObjects.push(navDot1, navDot2, navDot3, navDot4, navDot5, navDot6, navDot7, navDot8, navDot9);
      const _updateNavDots = (page, tab) => {
        const isShip = (tab || startTab) === "ship";
        const isIcon = (tab || startTab) === "icon";
        const maxPages = _getMaxPages(tab);
        [navDot1, navDot2, navDot3, navDot4, navDot5, navDot6, navDot7, navDot8, navDot9].forEach(dot => dot.setVisible(false));
        if (isShip || isIcon) {
          const dots = [navDot1, navDot2, navDot3, navDot4, navDot5, navDot6, navDot7, navDot8, navDot9];
          const totalDotsToShow = Math.min(maxPages, 9);
          const totalWidth = (totalDotsToShow - 1) * navDotSpacing;
          const startX = sw / 2 - totalWidth / 2;
          for (let i = 0; i < totalDotsToShow; i++) {
            dots[i].setPosition(startX + i * navDotSpacing, navDotY).setVisible(true);
            dots[i].setTexture("GJ_GameSheet03", page === i ? "gj_navDotBtn_on_001.png" : "gj_navDotBtn_off_001.png");
          }
        } else {
          navDot1.setPosition(sw / 2 - navDotSpacing / 2, navDotY).setVisible(true);
          navDot2.setPosition(sw / 2 + navDotSpacing / 2, navDotY).setVisible(true);
          navDot1.setTexture("GJ_GameSheet03", page === 0 ? "gj_navDotBtn_on_001.png" : "gj_navDotBtn_off_001.png");
          navDot2.setTexture("GJ_GameSheet03", page === 1 ? "gj_navDotBtn_on_001.png" : "gj_navDotBtn_off_001.png");
        }
      };

      const rainbowColors = [
        0xFF0000, 0xFF4500, 0xFF7F00, 0xFFAA00, 0xFFD700,
        0xFFFF00, 0xAAFF00, 0x00FF00, 0x00FF7F, 0x00FFFF,
        0x007FFF, 0x0000FF, 0x7F00FF, 0xFF00FF, 0xFF007F,
        0xFFFFFF, 0xC0C0C0, 0x808080, 0x404040, 0x000000,
      ];

      const colorBtnSize = 35;
      const colorPadding = 4;
      const colorRowWidth = rainbowColors.length * (colorBtnSize + colorPadding) - colorPadding;
      const colorRow1Y = containerY + containerHeight + 70;
      const colorRow2Y = colorRow1Y + colorBtnSize + 10;
      const colorRowStartX = sw / 2 - colorRowWidth / 2 + colorBtnSize / 2;

      const colorLabel1 = this.add.text(sw / 2 - colorRowWidth / 2, colorRow1Y - 14, "", {
        fontSize: "11px", color: "#ffffff", fontFamily: "Arial"}).setScrollFactor(0).setDepth(104).setOrigin(0, 0.5).setAlpha(1);
      this._iconOverlayObjects.push(colorLabel1);

      const colorLabel2 = this.add.text(sw / 2 - colorRowWidth / 2, colorRow2Y - 14, "", {
        fontSize: "11px", color: "#ffffff", fontFamily: "Arial"}).setScrollFactor(0).setDepth(104).setOrigin(0, 0.5).setAlpha(1);
      this._iconOverlayObjects.push(colorLabel2);

      for (let ci = 0; ci < rainbowColors.length; ci++) {
        const cx = colorRowStartX + ci * (colorBtnSize + colorPadding);

        const btn1AtlasInfo = R(this, "GJ_colorBtn_001.png");
        let btn1;
        if (btn1AtlasInfo) {
          btn1 = this.add.image(cx, colorRow1Y, btn1AtlasInfo.atlas, btn1AtlasInfo.frame).setScrollFactor(0).setDepth(104).setTint(rainbowColors[ci]).setScale(0.5).setInteractive();
        } else {
          btn1 = this.add.rectangle(cx, colorRow1Y, colorBtnSize, colorBtnSize, rainbowColors[ci]).setScrollFactor(0).setDepth(104).setInteractive();
        }
        this._iconOverlayObjects.push(btn1);

        const btn2AtlasInfo = R(this, "GJ_colorBtn_001.png");
        let btn2;
        if (btn2AtlasInfo) {
          btn2 = this.add.image(cx, colorRow2Y, btn2AtlasInfo.atlas, btn2AtlasInfo.frame).setScrollFactor(0).setDepth(104).setTint(rainbowColors[ci]).setScale(0.5).setInteractive();
        } else {
          btn2 = this.add.rectangle(cx, colorRow2Y, colorBtnSize, colorBtnSize, rainbowColors[ci]).setScrollFactor(0).setDepth(104).setInteractive();
        }
        this._iconOverlayObjects.push(btn2);

        ((color, b1, b2) => {
          b1.on("pointerover", () => b1.setAlpha(0.7));
          b1.on("pointerout",  () => b1.setAlpha(1));
          b1.on("pointerup",   () => {
            window.mainColor = color;
            localStorage.setItem("iconMainColor", hexadecimalToHex(color));
            if (this._player) {
              if (this._player._playerSpriteLayer) this._player._playerSpriteLayer.sprite.setTint(color);
              if (this._player._shipSpriteLayer)   this._player._shipSpriteLayer.sprite.setTint(color);
              if (this._player._ballSpriteLayer)   this._player._ballSpriteLayer.sprite.setTint(color);
              if (this._player._waveSpriteLayer)   this._player._waveSpriteLayer.sprite.setTint(color);
              if (this._player._particleEmitter)   this._player._particleEmitter.tint = color;
            }
            selectedIcon.setTint(color);
          });

          b2.on("pointerover", () => b2.setAlpha(0.7));
          b2.on("pointerout",  () => b2.setAlpha(1));
          b2.on("pointerup",   () => {
            window.secondaryColor = color;
            localStorage.setItem("iconSecondaryColor", hexadecimalToHex(color));
            if (this._player) {
              if (this._player._playerGlowLayer    && this._player._playerGlowLayer.sprite)    this._player._playerGlowLayer.sprite.setTint(color);
              if (this._player._playerOverlayLayer && this._player._playerOverlayLayer.sprite) this._player._playerOverlayLayer.sprite.setTint(color);
              if (this._player._shipGlowLayer      && this._player._shipGlowLayer.sprite)      this._player._shipGlowLayer.sprite.setTint(color);
              if (this._player._shipOverlayLayer   && this._player._shipOverlayLayer.sprite)   this._player._shipOverlayLayer.sprite.setTint(color);
              if (this._player._ballGlowLayer      && this._player._ballGlowLayer.sprite)      this._player._ballGlowLayer.sprite.setTint(color);
              if (this._player._ballOverlayLayer   && this._player._ballOverlayLayer.sprite)   this._player._ballOverlayLayer.sprite.setTint(color);
              if (this._player._waveGlowLayer      && this._player._waveGlowLayer.sprite)      this._player._waveGlowLayer.sprite.setTint(color);
              if (this._player._waveOverlayLayer   && this._player._waveOverlayLayer.sprite)   this._player._waveOverlayLayer.sprite.setTint(color);
              if (this._player._streak)             this._player._streak._color = color;
            }
                selectedIconExtra.setTint(window.secondaryColor);
                _refreshPreview(currentTab, _getPreviewFrame(currentTab));
          });
        })(rainbowColors[ci], btn1, btn2);
      }

      const previewY = lineY - 35;
      const selectedIconExtra = this.add.image(sw / 2, previewY, _iconAtlas[startTab], null).setScrollFactor(0).setDepth(102).setVisible(false);
      const selectedIcon = this.add.image(sw / 2, previewY, _iconAtlas[startTab], null).setScrollFactor(0).setDepth(103);

      const _getPreviewFrame = (tab) => {
        const prop   = _iconWindowProps[tab];
        const frames = _iconFrameSets[tab];
        const match  = frames.find(f => f.replace("_001.png", "") === window[prop]);
        return match || frames[0];
      };

      const _refreshPreview = (tab, frame) => {
        selectedIcon.setTexture(_iconAtlas[tab], frame);
        const s = Math.min(80 / (selectedIcon.width || 80), 80 / (selectedIcon.height || 80)) * 0.85;
        selectedIcon.setScale(s);
        selectedIcon.setTint(window.mainColor);
        const extraFrame = frame.replace("_001.png", "_2_001.png");
        const extraInfo = R(this, extraFrame);
        if (extraInfo) {
          selectedIconExtra.setTexture(extraInfo.atlas, extraInfo.frame).setVisible(true).setScale(s).setTint(window.secondaryColor);
        } else {
          selectedIconExtra.setVisible(false);
        }
      };

      _refreshPreview(startTab, _getPreviewFrame(startTab));
      this._iconOverlayObjects.push(selectedIconExtra, selectedIcon);

      const tabBtnY = containerY - 40;
      const tabKeys = ["icon", "ship", "ball", "wave", "ufo"];
      const tabOffsets     = [-218, -109,  0,    109,   218  ];
      const tabRotations   = { icon: -Math.PI/2, ship: 0, ball: -Math.PI/2, wave: Math.PI/2, ufo: Math.PI/2 };
      const tabFlipXStates = { icon: true, ship: false, ball: true, wave: false, ufo: false };
      const tabFlipYStates = { icon: false, ship: false, ball: false, wave: true, ufo: true };
      const tabBtnSprites  = {};

      const _switchTab = (tab) => {
        for (const k of tabKeys) {
          if (tabBtnSprites[k]) {
            tabBtnSprites[k].setTexture("GJ_GameSheet03",
              k === tab ? _tabBtnFrames[k].on : _tabBtnFrames[k].off);
          }
        }
        _refreshPreview(tab, _getPreviewFrame(tab));
        _buildGrid(tab);
      };

      tabKeys.forEach((tab, i) => {
        const isActive = tab === startTab;
        const btn = this.add.image(sw / 2 + tabOffsets[i], tabBtnY, "GJ_GameSheet03",
            isActive ? _tabBtnFrames[tab].on : _tabBtnFrames[tab].off)
          .setScrollFactor(0).setDepth(104).setScale(0.75)
          .setRotation(tabRotations[tab]).setFlipX(tabFlipXStates[tab]).setFlipY(tabFlipYStates[tab])
          .setInteractive();
        tabBtnSprites[tab] = btn;
        this._iconOverlayObjects.push(btn);
        this._makeBouncyButton(btn, 0.75, () => _switchTab(tab));
      });

      this._iconGridObjects = [];

      const selLabel = this.add.image(0, 0, "GJ_GameSheet03", "GJ_select_001.png").setScrollFactor(0).setDepth(106).setOrigin(0.5, 0.5).setVisible(false);
      this._iconOverlayObjects.push(selLabel);

      const iconsPerPage = cols * rows;
      let currentPage = 0;

      const arrowY = containerY + containerHeight / 2;
      const arrowMargin = 54;

      const prevArrow = this.add.image(containerX - arrowMargin, arrowY, "GJ_GameSheet03", "GJ_arrow_01_001.png")
        .setScrollFactor(0).setDepth(106).setScale(0.8).setFlipX(false).setInteractive();
      const nextArrow = this.add.image(containerX + containerWidth + arrowMargin, arrowY, "GJ_GameSheet03", "GJ_arrow_01_001.png")
        .setScrollFactor(0).setDepth(106).setScale(0.8).setInteractive().setFlipX(true);

      //bouncy buttons for arrows
      const _getMaxPages = (tab) => {
        return Math.ceil(_iconFrameSets[tab].length / iconsPerPage);
      };
      const _prevPage = () => {
        const maxPages = _getMaxPages(_currentTab);
        currentPage = (currentPage - 1 + maxPages) % maxPages;
        _updateNavDots(currentPage, _currentTab);
        _buildGrid(_currentTab, currentPage);
      };
      const _nextPage = () => {
        const maxPages = _getMaxPages(_currentTab);
        currentPage = (currentPage + 1) % maxPages;
        _updateNavDots(currentPage, _currentTab);
        _buildGrid(_currentTab, currentPage);
      };
      this._makeBouncyButton(prevArrow, 0.8, _prevPage);
      this._makeBouncyButton(nextArrow, 0.8, _nextPage);
      this._iconOverlayObjects.push(prevArrow, nextArrow);
      const _buildGrid = (tab, page = 0) => {
        for (const o of this._iconGridObjects) {
          if (o && o.destroy) o.destroy();
        }
        this._iconGridObjects = [];
        selLabel.setVisible(false);
        const allFrames = _iconFrameSets[tab];
        const frames = allFrames.slice(page * iconsPerPage, (page + 1) * iconsPerPage);
        const atlas  = _iconAtlas[tab];
        const prop   = _iconWindowProps[tab];
        frames.forEach((frame, idx) => {
          const col = idx % cols;
          const row = Math.floor(idx / cols);
          const ix  = startX + col * (iconSize + padding);
          const iy  = startY + row * (iconSize + padding);
          const hitRect = this.add.rectangle(ix, iy, iconSize, iconSize, 0x000000, 0).setScrollFactor(0).setDepth(104).setInteractive();
          const iconImg = this.add.image(ix, iy, atlas, frame).setScrollFactor(0).setDepth(103).setTint(0xAFAFAF);
          const origScale = Math.min(
            iconSize / (iconImg.width  || iconSize),
            iconSize / (iconImg.height || iconSize)
          ) * 0.7;
          iconImg.setScale(origScale);
          const extraFrame = frame.replace("_001.png", "_2_001.png");
          const extraInfo = R(this, extraFrame);
          const extraImg = extraInfo
            ? this.add.image(ix, iy, extraInfo.atlas, extraInfo.frame).setScrollFactor(0).setDepth(102).setScale(origScale)
            : null;
          if (extraImg) this._iconGridObjects.push(extraImg);
          this._iconGridObjects.push(iconImg, hitRect);
          if (frame.replace("_001.png", "") === window[prop]) {
            selLabel.setPosition(ix, iy).setScale(0.75).setVisible(true);
          }

          ((capturedFrame, capturedImg, capturedExtra, capturedOrigScale) => {
            hitRect.on("pointerover",  () => { capturedImg.setAlpha(0.65); if (capturedExtra) capturedExtra.setAlpha(0.65); });
            hitRect.on("pointerout",   () => {
              capturedImg.setAlpha(1); capturedImg.setScale(capturedOrigScale);
              if (capturedExtra) { capturedExtra.setAlpha(1); capturedExtra.setScale(capturedOrigScale); }
            });
            hitRect.on("pointerdown",  () => { capturedImg.setScale(capturedOrigScale * 1.15); if (capturedExtra) capturedExtra.setScale(capturedOrigScale * 1.15); });
            hitRect.on("pointerup",    () => {
              capturedImg.setScale(capturedOrigScale);
              capturedImg.setAlpha(1);
              if (capturedExtra) { capturedExtra.setScale(capturedOrigScale); capturedExtra.setAlpha(1); }
              if (!this._iconOverlay) return;

              selLabel.setPosition(capturedImg.x, capturedImg.y).setScale(0.75).setVisible(true);

              window[prop] = capturedFrame.replace("_001.png", "");
              localStorage.setItem("icon" + prop.charAt(0).toUpperCase() + prop.slice(1), window[prop]);

              if (tab === "icon" && this._player) {
                const layerMap = [
                  { lp: "_playerSpriteLayer",  suffix: "_001.png",       tint: window.mainColor      },
                  { lp: "_playerGlowLayer",    suffix: "_glow_001.png",  tint: window.secondaryColor },
                  { lp: "_playerOverlayLayer", suffix: "_2_001.png",     tint: window.secondaryColor },
                  { lp: "_playerExtraLayer",   suffix: "_extra_001.png", tint: window.mainColor      },
                ];
                for (const { lp, suffix, tint } of layerMap) {
                  const layer = this._player[lp];
                  if (!layer || !layer.sprite) continue;
                  const found = R(this, `${window.currentPlayer}${suffix}`);
                  if (found) {
                    layer.sprite.setTexture(found.atlas, found.frame);
                    if (tint !== null) layer.sprite.setTint(tint);
                  }
                }
              }
              if (tab === "ship" && this._player) {
                const layerMap = [
                  { lp: "_shipSpriteLayer",  suffix: "_001.png",       tint: window.mainColor      },
                  { lp: "_shipGlowLayer",    suffix: "_glow_001.png",  tint: window.secondaryColor },
                  { lp: "_shipOverlayLayer", suffix: "_2_001.png",     tint: window.secondaryColor },
                  { lp: "_shipExtraLayer",   suffix: "_2_001.png",     tint: window.secondaryColor },
                ];
                for (const { lp, suffix, tint } of layerMap) {
                  const layer = this._player[lp];
                  if (!layer || !layer.sprite) continue;
                  const found = R(this, `${window.currentShip}${suffix}`);
                  if (found) {
                    layer.sprite.setTexture(found.atlas, found.frame);
                    if (tint !== null) layer.sprite.setTint(tint);
                  }
                }
              }
              if (tab === "ball" && this._player) {
                const layerMap = [
                  { lp: "_ballSpriteLayer",  suffix: "_001.png",      tint: window.mainColor      },
                  { lp: "_ballGlowLayer",    suffix: "_glow_001.png", tint: window.secondaryColor },
                  { lp: "_ballOverlayLayer", suffix: "_2_001.png",    tint: window.secondaryColor },
                ];
                for (const { lp, suffix, tint } of layerMap) {
                  const layer = this._player[lp];
                  if (!layer || !layer.sprite) continue;
                  const found = R(this, `${window.currentBall}${suffix}`);
                  if (found) {
                    layer.sprite.setTexture(found.atlas, found.frame);
                    layer.sprite.setTint(tint);
                  }
                }
              }
              if (tab === "wave" && this._player) {
                const layerMap = [
                  { lp: "_waveSpriteLayer",  suffix: "_001.png",      tint: window.mainColor      },
                  { lp: "_waveGlowLayer",    suffix: "_glow_001.png", tint: window.secondaryColor },
                  { lp: "_waveOverlayLayer", suffix: "_2_001.png",    tint: window.secondaryColor },
                ];
                for (const { lp, suffix, tint } of layerMap) {
                  const layer = this._player[lp];
                  if (!layer || !layer.sprite) continue;
                  const found = R(this, `${window.currentWave}${suffix}`);
                  if (found) {
                    layer.sprite.setTexture(found.atlas, found.frame);
                    if (tint !== null) layer.sprite.setTint(tint);
                  }
                }
              }
              if (tab === "ufo" && this._player) {
                const layerMap = [
                  { lp: "_birdSpriteLayer",  suffix: "_001.png",      tint: window.mainColor      },
                  { lp: "_birdGlowLayer",    suffix: "_2_001.png",    tint: window.secondaryColor },
                  { lp: "_birdOverlayLayer", suffix: "_3_001.png",    tint: window.secondaryColor },
                  { lp: "_birdExtraLayer",   suffix: "_extra_001.png",tint: window.mainColor      },
                ];
                for (const { lp, suffix, tint } of layerMap) {
                  const layer = this._player[lp];
                  if (!layer || !layer.sprite) continue;
                  const found = R(this, `${window.currentBird}${suffix}`);
                  if (found) {
                    layer.sprite.setTexture(found.atlas, found.frame);
                    if (tint !== null) layer.sprite.setTint(tint);
                  }
                }
              }

              _refreshPreview(tab, capturedFrame);
            });
          })(frame, iconImg, extraImg, origScale);
        });
      };

      let _currentTab = startTab;

      const _switchTabOrig = _switchTab;
      const _switchTabPaged = (tab) => {
        _currentTab = tab;
        currentPage = 0;
        _updateNavDots(0, tab);
        for (const k of tabKeys) {
          if (tabBtnSprites[k]) {
            tabBtnSprites[k].setTexture("GJ_GameSheet03",
              k === tab ? _tabBtnFrames[k].on : _tabBtnFrames[k].off);
          }
        }
        _refreshPreview(tab, _getPreviewFrame(tab));
        _buildGrid(tab, 0);
      };
      tabKeys.forEach(tab => {
        const btn = tabBtnSprites[tab];
        if (btn) {
          btn.removeAllListeners("pointerup");
          btn.removeAllListeners("pointerdown");
          btn.removeAllListeners("pointerout");
          this._makeBouncyButton(btn, 0.75, () => _switchTabPaged(tab));
        }
      });

      _updateNavDots(0, startTab);
      _buildGrid(startTab, 0);
    };

    this._closeIconSelector = (silent = false) => {
      if (!this._iconOverlay) return;
      const destroy = () => {
        if (this._iconGridObjects) {
          for (const obj of this._iconGridObjects) {
            if (obj && obj.destroy) obj.destroy();
          }
          this._iconGridObjects = null;
        }
        if (this._iconOverlayObjects) {
          for (const obj of this._iconOverlayObjects) {
            if (obj && obj.destroy) obj.destroy();
          }
          this._iconOverlayObjects = null;
        }
        this._iconOverlay = null;
      };
      if (silent) { destroy(); return; }
      const sw = screenWidth;
      const sh = screenHeight;
      const fadeOut = this.add.graphics().setScrollFactor(0).setDepth(200).setAlpha(0);
      fadeOut.fillStyle(0x000000, 1);
      fadeOut.fillRect(0, 0, sw, sh);
      this.tweens.add({
        targets: fadeOut, alpha: 1, duration: 150, ease: "Linear",
        onComplete: () => {
          destroy();
          this.tweens.add({ targets: fadeOut, alpha: 0, duration: 150, ease: "Linear", onComplete: () => fadeOut.destroy() });
        }
      });
    };
    this._closeCreatorMenu = (silent = false) => {
      if (!this._creatorOverlay) return;
      const destroy = () => {
        if (this._creatorOverlayObjects) {
          for (const obj of this._creatorOverlayObjects) {
            if (obj && obj.destroy) obj.destroy();
          }
          this._creatorOverlayObjects = null;
        }
        this._creatorOverlay = null;
      };
      if (silent) { destroy(); return; }
      const sw = screenWidth;
      const sh = screenHeight;
      const fadeOut = this.add.graphics().setScrollFactor(0).setDepth(200).setAlpha(0);
      fadeOut.fillStyle(0x000000, 1);
      fadeOut.fillRect(0, 0, sw, sh);
      this.tweens.add({
        targets: fadeOut, alpha: 1, duration: 150, ease: "Linear",
        onComplete: () => {
          destroy();
          this.tweens.add({ targets: fadeOut, alpha: 0, duration: 150, ease: "Linear", onComplete: () => fadeOut.destroy() });
        }
      });
    };
    this._positionMenuItems();
    //icon stuff sequel
    if (this._iconBtn) {
  this._iconBtn.x = (screenWidth / 2) - this._playBtn.width / 2 - 50 - (this._iconBtn.width * this._iconBtn.scaleX) / 2;
  this.tweens.killTweensOf(this._iconBtn, "y");
  this._iconBtn.y = 320;
  this.tweens.add({
    targets: this._iconBtn,
    y: 324,
    duration: 750,
    ease: "Quad.InOut",
    yoyo: true,
    repeat: -1
  });
}
    // creator stuff the sequel
    if (this._creatorBtn) {
  this._creatorBtn.x = (screenWidth / 2) + this._playBtn.width / 2 + 50 + (this._creatorBtn.width * this._creatorBtn.scaleX) / 2;
  this.tweens.killTweensOf(this._creatorBtn, "y");
  this._creatorBtn.y = 320;
  this.tweens.add({
    targets: this._creatorBtn,
    y: 324,
    duration: 750,
    ease: "Quad.InOut",
    yoyo: true,
    repeat: -1
  });
}
    this._spaceWasDown = false;
    this._spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this._upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this._wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this._leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this._rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this._aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this._dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this._startPosIndex = -1;

    this.input.keyboard.on('keydown-Q', () => {
      if (!window.startPosSwitcher) return;
      this.changeStartPos(-1);
    });

    this.input.keyboard.on('keydown-E', () => {
      if (!window.startPosSwitcher) return;
      this.changeStartPos(1);
    });

    this._percentageLabel = this.add.bitmapText(screenWidth / 2, 20, "bigFont", "0%", 30).setOrigin(0.5, 0.5);
    this._percentageLabel.setVisible(false);
    this._percentageLabel.setDepth(100);

    this._noclipIndicator = this.add.bitmapText(10, 10, "bigFont", "Noclip", 20)
      .setOrigin(0, 0)
      .setAlpha(0.4)
      .setDepth(100)
      .setVisible(false);

    this._accuracyIndicator = this.add.bitmapText(10, 30, "bigFont", "100.00%", 20)
      .setOrigin(0, 0)
      .setAlpha(0.4)
      .setDepth(100)
      .setVisible(false);

    this._deathsIndicator = this.add.bitmapText(10, 50, "bigFont", "0 Deaths", 20)
      .setOrigin(0, 0)
      .setAlpha(0.4)
      .setDepth(100)
      .setVisible(false);

    this.noclipFlash = this.add.rectangle(
      this.cameras.main.centerX, 
      this.cameras.main.centerY, 
      this.cameras.main.width, 
      this.cameras.main.height, 
      0xff0000
    );
    this.noclipFlash.setScrollFactor(0);
    this.noclipFlash.setDepth(99);
    this.noclipFlash.setAlpha(0);

    this._updatePracticeHUDBar = () => {};

    this._pauseBtn = this.add.image(screenWidth - 30, 30, "GJ_WebSheet", "GJ_pauseBtn_clean_001.png").setScrollFactor(0).setDepth(30).setAlpha(75 / 255).setVisible(false);
    this._pauseBtn.setInteractive();
    this._expandHitArea(this._pauseBtn, 2);
    this._pauseBtn.on("pointerdown", () => this._pauseGame());
    this._escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this._escKey.on("down", () => {
      if (this._levelSelectOverlay) {
        this._closeLevelSelect();
        return;
      }
      if (this._iconOverlay) {
        this._closeIconSelector();
        return;
      }
      if (this._updateLogPopup) {
        this._closeUpdateLogPopup();
        return;
      } 
      if (this._searchOverlay) {
        this._closeSearchMenu(true);
        this._openCreatorMenu();
        return;
      }
      if (this._creatorOverlay) {
        this._closeCreatorMenu();
        return;
      }
      if (this._settingsPopup) {
        this._settingsPopup.destroy();
        this._settingsPopup = null;
        return;
      }
      if (this._infoPopup) {
        this._infoPopup.destroy();
        this._infoPopup = null;
        return;
      }
      if (this._paused) {
        this._audio.playEffect("quitSound_01");
        this._audio.stopMusic();
        this._resumeGame();
        this.scene.restart();
      } else if (!this._menuActive && !this._slideIn && !this._levelWon) {
        this._pauseGame();
      }
    });
    this._restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this._restartKey.on("down", () => {
      if (!this._menuActive && !this._slideIn && !this._levelWon && !this._menuActive) {
        this._restartLevel();
      }
    });
    this._practiceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this._practiceKey.on("down", () => {
      if (!this._menuActive && !this._slideIn) {
        const isPracticeMode = this._practicedMode.togglePracticeMode();
        if (this._checkpointBtnContainer) {
          this._checkpointBtnContainer.setVisible(isPracticeMode);
        }
        if (this._practiceModeBarContainer) {
          this._practiceModeBarContainer.setVisible(isPracticeMode);
        }
        this._audio.startMusic();
      }
    });
    this._saveCheckpointKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this._saveCheckpointKey.on("down", () => {
      if (!this._menuActive && !this._slideIn && this._practicedMode.practiceMode && !this._state.isDead) {
        const saved = this._practicedMode.saveCheckpoint(this._state, this._playerWorldX, this._cameraX, this);
        if (saved) {
        }
      }
    });
    this._deleteCheckpointKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this._deleteCheckpointKey.on("down", () => {
      if (!this._menuActive && !this._slideIn && this._practicedMode.practiceMode) {
        const deleted = this._practicedMode.deleteLastCheckpoint();
      }
    });
    this._paused = false;
    this._pauseContainer = null;
    this._sfxVolume = localStorage.getItem("userSfxVol") ?? 1;
    this.input.on("pointerdown", () => {
      if (!this._menuActive && !this._paused && !this._levelSelectOverlay && !this._levelWon) {
        this._pushButton();
      }
    });
    this.input.on("pointerup", () => {
      if (!this._menuActive && !this._paused && !this._levelSelectOverlay && !this._levelWon) {
        this._releaseButton();
      }
    });
    window.addEventListener("pointerup", () => this._releaseButton());
    window.addEventListener("touchend", () => this._releaseButton());
    this.scale.on("enterfullscreen", () => this._onFullscreenChange(true));
    this.scale.on("leavefullscreen", () => this._onFullscreenChange(false));

    this._buildHUD();
    this._createStartPosGui();
    this._loadSettings();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this._audio.pauseMusic();
      } else if (!this._menuActive && !this._paused && !this._state.isDead && !this._levelWon) {
        this._audio.resumeMusic();
      }
    });
    window.addEventListener("orientationchange", () => {
      this.time.delayedCall(100, () => this.scale.refresh());
    });
    window.addEventListener("resize", () => {
      this.scale.refresh();
    });
    if (this.game.registry.get("fadeInFromBlack")) {
      this.game.registry.remove("fadeInFromBlack");
      this.cameras.main.fadeIn(400, 0, 0, 0);
    }
    this._levelLabel = this.add.bitmapText(screenWidth - 565, 30, "bigFont", window.currentlevel[1], 30).setOrigin(0.5, 0.5).setVisible(false);
    this._levelLabel.setScale(Math.min(1, 220 / this._levelLabel.width));
    
    this._leftBtn = this.add.image(screenWidth - 700, 30, "GJ_GameSheet03", "edit_leftBtn_001.png").setScrollFactor(0).setDepth(30).setInteractive().setVisible(false);
    this._rightBtn = this.add.image(screenWidth - 429, 30, "GJ_GameSheet03", "edit_leftBtn_001.png").setScrollFactor(0).setDepth(30).setInteractive().setVisible(false);
    this._rightBtn.setRotation(Math.PI);
    window.scene = this.scene;
    window.rightbuttoncallback = () => {
      if (this._levelSelectOverlay && this._levelSelectSwitchLevel) {
        this._levelSelectSwitchLevel(1);
      }
    };
    window.leftbuttoncallback = () => {
      if (this._levelSelectOverlay && this._levelSelectSwitchLevel) {
        this._levelSelectSwitchLevel(-1);
      }
    };
    this._makeBouncyButton(this._leftBtn, 1, () => {window.leftbuttoncallback()}, () => this._menuActive);
    this._makeBouncyButton(this._rightBtn, 1, () => {window.rightbuttoncallback()}, () => this._menuActive);
    if (!this._audio.isplaying()) {
      this._audio.startMenuMusic();
    }
    if (!window.updateLogShown) {
      this._buildUpdateLogPopup();
      window.updateLogShown = true;
    }
    if (window.levelID) {
        console.log("URL ID detected:", window.levelID);
        this._openSearchMenu();
    }
    if (this.game.registry.get("autoStartGame")) {
      this.game.registry.remove("autoStartGame");
      this._levelLabel.setVisible(false);
      this._leftBtn.setVisible(false);
      this._rightBtn.setVisible(false);
      if (this._practiceModeBarContainer) {
        this._practiceModeBarContainer.setVisible(this._practicedMode && this._practicedMode.practiceMode);
      }
      this._startGame();
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
  _openLevelSelect() {
    if (this._levelSelectOverlay) return;
    const sw = screenWidth;
    const sh = screenHeight;
    const cx = sw / 2;
    const cy = sh / 2;
    let { bgHex, groundHex } = this._parseLevelColors(window.currentlevel[2]);
    const drawOverlay = (gfx, colorHex, isEveryEnd = false) => {
      gfx.clear();
      const rRaw = (colorHex >> 16) & 0xff;
      const gRaw = (colorHex >> 8)  & 0xff;
      const bRaw =  colorHex        & 0xff;
      const topMul = isEveryEnd ? 0.30 : 0.65;
      const botMul = isEveryEnd ? 0.18 : 0.42;
      const steps = 60;
      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        const mul = topMul + (botMul - topMul) * t;
        const r2 = Math.min(255, Math.round(rRaw * mul));
        const g2 = Math.min(255, Math.round(gRaw * mul));
        const b2 = Math.min(255, Math.round(bRaw * mul));
        gfx.fillStyle((r2 << 16) | (g2 << 8) | b2, 1);
        const y0 = Math.floor(i * sh / steps);
        gfx.fillRect(0, y0, sw, Math.ceil(sh / steps) + 1);
      }
    };
    const isEveryEnd = (levelId) => levelId === "level_99";
    const fadeIn = this.add.graphics().setScrollFactor(0).setDepth(200);
    fadeIn.fillStyle(0x000000, 1);
    fadeIn.fillRect(0, 0, sw, sh);
    this.tweens.add({ targets: fadeIn, alpha: 0, duration: 300, ease: "Linear", onComplete: () => fadeIn.destroy() });
    const overlay = this.add.graphics().setScrollFactor(0).setDepth(150);
    drawOverlay(overlay, bgHex, isEveryEnd(window.currentlevel[2]));
    this._levelSelectOverlay = overlay;
    const tableBottom = this.add.image(cx, -24, "GJ_GameSheet03", "GJ_table_bottom_001.png").setScrollFactor(0).setDepth(152).setOrigin(0.5, 0);
    const groundY = sh + 175;
    const groundId = (window._groundId || "01");
    const groundFrame = this.textures.getFrame("groundSquare_" + groundId + "_001.png");
    const tileW = groundFrame ? groundFrame.width : 1012;
    const numTiles = Math.ceil(sw / tileW) + 2;
    const groundTintHex = (colorHex) => {
      const r = Math.round(((colorHex >> 16) & 0xff) * 0.45);
      const g = Math.round(((colorHex >> 8)  & 0xff) * 0.45);
      const b = Math.round(( colorHex        & 0xff) * 0.45);
      return (r << 16) | (g << 8) | b;
    };
    const staticGroundTiles = [];
    for (let gi = 0; gi < numTiles; gi++) {
      const gt = this.add.image(gi * tileW, groundY, "groundSquare_" + groundId + "_001.png")
        .setScrollFactor(0).setDepth(152).setOrigin(0, 1).setTint(groundTintHex(groundHex));
      staticGroundTiles.push(gt);
    }
    const floorLineFrame = this.textures.getFrame("GJ_WebSheet", "floorLine_01_001.png");
    const floorLineW = floorLineFrame ? floorLineFrame.width : 888;
    const floorLineScale = sw / floorLineW;
    const groundTileH = groundFrame ? groundFrame.height : 80;
    const staticFloorLine = this.add.image(cx, groundY - groundTileH, "GJ_WebSheet", "floorLine_01_001.png")
      .setScrollFactor(0).setDepth(153).setOrigin(0.5, 0.5).setScale(floorLineScale, 1).setBlendMode(S);
    const cornerBL = this.add.image(0,  sh, "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setDepth(152).setOrigin(1, 1).setFlipY(true).setAngle(90);
    const cornerBR = this.add.image(sw, sh, "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setDepth(152).setOrigin(1, 0).setFlipY(false).setAngle(90);
    const backBtn = this.add.image(50, 48, "GJ_GameSheet03", "GJ_arrow_01_001.png").setScrollFactor(0).setDepth(154).setFlipX(true).setScale(1, -1).setRotation(Math.PI).setInteractive();
    backBtn.on("pointerdown", () => {
      backBtn._pressed = true;
      this.tweens.killTweensOf(backBtn);
      this.tweens.add({ targets: backBtn, scaleX: 1.26, scaleY: -1.26, duration: 300, ease: "Bounce.Out" });
    });
    backBtn.on("pointerout", () => {
      if (backBtn._pressed) {
        backBtn._pressed = false;
        this.tweens.killTweensOf(backBtn);
        this.tweens.add({ targets: backBtn, scaleX: 1, scaleY: -1, duration: 400, ease: "Bounce.Out" });
      }
    });
    backBtn.on("pointerup", () => {
      if (backBtn._pressed) {
        backBtn._pressed = false;
        this.tweens.killTweensOf(backBtn);
        backBtn.setScale(1, -1);
        this._closeLevelSelect();
      }
    });
    const infoBtn = this.add.image(sw - 40, 40, "GJ_GameSheet03", "GJ_infoIcon_001.png").setScrollFactor(0).setDepth(154).setRotation(Math.PI / 2).setInteractive();
    const arrowL = this.add.image(55, cy - 25, "GJ_GameSheet03", "navArrowBtn_001.png").setScrollFactor(0).setDepth(154).setScale(1.1).setFlipX(true).setInteractive();
    const arrowR = this.add.image(sw - 55, cy - 25, "GJ_GameSheet03", "navArrowBtn_001.png").setScrollFactor(0).setDepth(154).setScale(1.1).setFlipX(false).setInteractive();
    const allLevels = window.allLevels || [];
    const dotY = sh - 36;
    const maxDots = Math.min(allLevels.length, 28);
    const dotSpacing = 27;
    const dotStartX = cx - (maxDots - 1) * dotSpacing / 2;
    const dotObjs = [];
    const refreshDots = () => {
      for (const d of dotObjs) d.destroy();
      dotObjs.length = 0;
      const idx = allLevels.findIndex(l => l[2] === window.currentlevel[2]);
      for (let di = 0; di < maxDots; di++) {
        const active = di === idx;
        const d = this.add.graphics().setScrollFactor(0).setDepth(153);
        d.fillStyle(0xffffff, active ? 1 : 0.3);
        d.fillCircle(dotStartX + di * dotSpacing, dotY, 7);
        dotObjs.push(d);
      }
    };
    refreshDots();
    const cardW = Math.min(700, sw - 180);
    const cardH = 180;
    const cardX = cx;
    const cardY = cy - 100;
    const cardSlideContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(152);
    const cardBounceContainer = this.add.container(cardX, cardY).setScrollFactor(0).setDepth(0);
    cardSlideContainer.add(cardBounceContainer);
    const cardContainer = cardSlideContainer;
    const cardBg = this.add.graphics();
    const drawCardBg = (colorHex, dark = false) => {
      cardBg.clear();
      const mul = dark ? 0.10 : 0.22;
      const r = Math.round(((colorHex >> 16) & 0xff) * mul);
      const g = Math.round(((colorHex >> 8)  & 0xff) * mul);
      const b = Math.round(( colorHex        & 0xff) * mul);
      cardBg.fillStyle((r << 16) | (g << 8) | b, 0.92);
      cardBg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 14);
    };
    drawCardBg(bgHex, isEveryEnd(window.currentlevel[2]));
    cardBounceContainer.add(cardBg);

    const cardHit = this.add.zone(cardX, cardY, cardW, cardH)
      .setScrollFactor(0).setDepth(156).setInteractive();
    const dragState = {
      pressed: false,
      dragging: false,
      startX: 0,
      lastX: 0,
      velSamples: [],
      get vel() {
        if (!this.velSamples.length) return 0;
        return this.velSamples.reduce((a, b) => a + b, 0) / this.velSamples.length;
      },
      pushVel(v) {
        this.velSamples.push(v);
        if (this.velSamples.length > 5) this.velSamples.shift();
      },
      reset() {
        this.pressed = false;
        this.dragging = false;
        this.velSamples = [];
      }
    };

    const onDragStart = (ptr) => {
      dragState.pressed = true;
      dragState.startX = ptr.x;
      dragState.lastX = ptr.x;
      dragState.dragging = false;
      dragState.velSamples = [];
    };
    cardHit.on("pointerdown", (ptr) => {
      onDragStart(ptr);
      this.tweens.killTweensOf(cardBounceContainer, "scale");
      this.tweens.add({ targets: cardBounceContainer, scale: 1.26, duration: 300, ease: "Bounce.Out" });
    });

    const onDragMove = (ptr) => {
      if (!dragState.pressed) return;
      const dx = ptr.x - dragState.startX;
      const frameDelta = ptr.x - dragState.lastX;
      dragState.pushVel(frameDelta);
      dragState.lastX = ptr.x;
      if (!dragState.dragging && Math.abs(dx) > 12) {
        dragState.dragging = true;
        this.tweens.killTweensOf(cardBounceContainer, "scale");
        this.tweens.add({ targets: cardBounceContainer, scale: 1, duration: 200, ease: "Quad.Out" });
      }
      if (dragState.dragging) {
        cardContainer.x = dx;
      }
    };
    const onDragUp = (ptr) => {
      if (!dragState.pressed) return;
      const wasDragging = dragState.dragging;
      const totalDx = ptr.x - dragState.startX;
      const vel = dragState.vel;
      dragState.reset();
      if (wasDragging) {
        const dragThreshold = cardW * 0.18;
        if (Math.abs(totalDx) > dragThreshold || Math.abs(vel) > 3) {
          const dir = totalDx < 0 ? 1 : -1;
          switchLevel(dir, cardContainer.x, vel);
        } else {
          if (_currentAnimUpdate) {
            this.events.off("preupdate", _currentAnimUpdate);
            _currentAnimUpdate = null;
          }
          let snapX = cardContainer.x;
          let snapVel = vel * 40;
          const snapUpdate = (time, delta) => {
            const dt = Math.min(delta / 1000, 0.05);
            const tension = 400;
            const friction = 18;
            const force = -tension * snapX - friction * snapVel;
            snapVel += force * dt;
            snapX += snapVel * dt;
            if (Math.abs(snapX) < 0.5 && Math.abs(snapVel) < 5) {
              snapX = 0;
              this.events.off("preupdate", snapUpdate);
              if (_currentAnimUpdate === snapUpdate) _currentAnimUpdate = null;
            }
            cardContainer.x = snapX;
          };
          _currentAnimUpdate = snapUpdate;
          this.events.on("preupdate", snapUpdate);
        }
      } else {
        if (ptr.x >= cardX - cardW/2 && ptr.x <= cardX + cardW/2 &&
            ptr.y >= cardY - cardH/2 && ptr.y <= cardY + cardH/2) {
          this.tweens.killTweensOf(cardBounceContainer, "scale");
          cardBounceContainer.setScale(1);
          this._audio.playEffect("playSound_01", { volume: 1 });
          this._closeLevelSelect(true);
          this._audio.stopMusic();
          this.game.registry.set("autoStartGame", true);
          this.scene.restart();
        } else {
          this.tweens.killTweensOf(cardBounceContainer, "scale");
          this.tweens.add({ targets: cardBounceContainer, scale: 1, duration: 200, ease: "Quad.Out" });
        }
      }
    };
    this.input.on("pointermove", onDragMove);
    this.input.on("pointerup", onDragUp);
    const _origClose = this._closeLevelSelect.bind(this);
    const _patchedClose = (doTransition) => {
      this.input.off("pointermove", onDragMove);
      this.input.off("pointerup", onDragUp);
      this._closeLevelSelect = _origClose;
      _origClose(doTransition);
    };
    this._closeLevelSelect = _patchedClose;
    const cardContentObjs = [];
    const buildCardContent = () => {
      for (const o of cardContentObjs) { this.tweens.killTweensOf(o); o.destroy(); }
      cardContentObjs.length = 0;
      const lvl = window.currentlevel;
      const levelId = lvl[2] || "level_1";
      const levelDifficultyMap = {
        "level_1":         "diffIcon_01_btn_001",
        "level_2":         "diffIcon_01_btn_001",
        "level_3":         "diffIcon_02_btn_001",
        "level_4":         "diffIcon_02_btn_001",
        "level_5":         "diffIcon_03_btn_001",
        "level_6":         "diffIcon_03_btn_001",
        "level_7":         "diffIcon_04_btn_001",
        "level_8":         "diffIcon_04_btn_001",
        "level_9":         "diffIcon_04_btn_001",
        "level_10":        "diffIcon_05_btn_001",
        "level_11":        "diffIcon_05_btn_001",
        "level_12":        "diffIcon_05_btn_001",
        "level_13":        "diffIcon_05_btn_001",
        "level_14":        "diffIcon_06_btn_001",
        "level_15":        "diffIcon_05_btn_001",
        "level_16":        "diffIcon_05_btn_001",
        "level_17":        "diffIcon_04_btn_001",
        "level_18":        "diffIcon_06_btn_001",
        "level_19":        "diffIcon_04_btn_001",
        "level_20":        "diffIcon_06_btn_001",
        "level_21":        "diffIcon_05_btn_001",
        "level_22":        "diffIcon_05_btn_001",
        "level_99":        "diffIcon_10_btn_001",
        "level_100":       "diffIcon_10_btn_001",
        "level_137409445": "diffIcon_00_btn_001",
        "level_5703070":   "diffIcon_07_btn_001",
        "level_137677336": "diffIcon_00_btn_001",
        "level_116489424": "diffIcon_00_btn_001",
        "level_4284013": "diffIcon_06_btn_001",
        "level_23":       "diffIcon_10_btn_001"
      };
      const diffIconKey = levelDifficultyMap[levelId] || "diffIcon_05_btn_001";
      const diffFrame = diffIconKey + ".png";
      const iconX = cardX - cardW / 2 + 52;
      const isHardDemon = diffIconKey === "diffIcon_06_btn_001";
      const iconRotation = isHardDemon ? Math.PI / 2 : 0;
      const demonIcon = this.add.image(iconX - cardX, 0, "GJ_GameSheet03", diffFrame)
        .setScrollFactor(0).setDepth(155).setScale(1).setOrigin(0.5, 0.5).setRotation(iconRotation).setFlipY(isHardDemon);
      cardContentObjs.push(demonIcon);
      cardBounceContainer.add(demonIcon);
      const maxIconH = cardH - 16;
      const maxIconW = 80;
      const iconFrame = this.textures.getFrame("GJ_GameSheet03", diffFrame);
      let finalIconScale = 1;
      if (iconFrame) {
        const scaleForH = maxIconH / iconFrame.height;
        let scaleForW = maxIconW / iconFrame.width;
        finalIconScale = Math.min(1, scaleForH, scaleForW);
        demonIcon.setScale(finalIconScale);
      }
      let iconDisplayW = (iconFrame ? iconFrame.width : 80) * finalIconScale;
      const iconDisplayH = (iconFrame ? iconFrame.height : 80) * finalIconScale;
      const nameLabel = this.add.bitmapText(0, 0, "bigFont", lvl[1], 50)
        .setScrollFactor(0).setDepth(155).setOrigin(0, 0.5);
      const gap = 25;
      const naturalGroupW = iconDisplayW + gap + nameLabel.width;
      const naturalGroupH = Math.max(iconDisplayH, nameLabel.height);
      const cardPad = 16;
      const maxGroupW = cardW - cardPad * 2;
      const maxGroupH = cardH - cardPad * 2;
      const groupScale = Math.min(1, maxGroupW / naturalGroupW, maxGroupH / naturalGroupH);
      const scaledIconW  = iconDisplayW  * groupScale;
      const scaledLabelW = nameLabel.width * groupScale;
      const scaledGap = gap * groupScale;
      const totalW = scaledIconW + scaledGap + scaledLabelW;
      const groupStartX = cardX - totalW / 2;
      demonIcon.setScale(finalIconScale * groupScale);
      demonIcon.setPosition(groupStartX + scaledIconW / 2 - cardX, 0);
      nameLabel.setScale(groupScale);
      nameLabel.setPosition(groupStartX + scaledIconW + scaledGap - cardX, 0);
      cardContentObjs.push(nameLabel);
      cardBounceContainer.add(nameLabel);
    };
    const barAreaY = cardY + cardH / 2 + 100;
    const barW2 = Math.min(600, sw - 200);
    const barH2 = 36;
    const barX0 = cx - barW2 / 2;
    let barObjs = [];
    const buildBar = () => {
      for (const o of barObjs) { this.tweens.killTweensOf(o); o.destroy(); }
      barObjs.length = 0;
      const bestNormal = parseFloat(localStorage.getItem("bestPercent_" + (window.currentlevel[2] || "level_1")) || "0");
      const modeLabel = this.add.bitmapText(cx, barAreaY - 40, "bigFont", "Normal Mode", 30)
        .setScrollFactor(0).setDepth(155).setOrigin(0.5, 0.5);
      barObjs.push(modeLabel);
      cardContainer.add(modeLabel);
      const barBg = this.add.graphics().setScrollFactor(0).setDepth(154);
      barBg.fillStyle(0x000000, 0.6);
      barBg.fillRoundedRect(barX0, barAreaY - barH2 / 2, barW2, barH2, barH2 / 2);
      barObjs.push(barBg);
      cardContainer.add(barBg);
      const padding = 3;
      const innerH2 = barH2 - padding * 2;
      const innerW2 = barW2 - padding * 2;
      const innerRadius = innerH2 / 2;
      const fillW = Math.max(innerH2, innerW2 * bestNormal / 100);
      console.log({ bestNormal, fillW });
    if(bestNormal > 0) {
      const barFg = this.add.graphics().setScrollFactor(0).setDepth(155);
      barFg.fillStyle(0x00FF00, 1);   
      const rightR = (bestNormal >= 100) ? innerRadius : 0;  
      barFg.fillRoundedRect(barX0 + padding, barAreaY - barH2 / 2 + padding, fillW, innerH2, {
        tl: innerRadius,
        bl: innerRadius,
        tr: rightR,
        br: rightR
      });
      
      barObjs.push(barFg);
        cardContainer.add(barFg);
      }
      const pctLabel = this.add.bitmapText(cx, barAreaY, "bigFont", Math.round(bestNormal) + "%", 22)
        .setScrollFactor(0).setDepth(156).setOrigin(0.5, 0.5);
      barObjs.push(pctLabel);
      cardContainer.add(pctLabel);
      const bestPractice = parseFloat(localStorage.getItem("practiceBestPercent_" + (window.currentlevel[2] || "level_1")) || "0");
      const practBarAreaY = barAreaY + barH2 + 48;
      const practModeLabel = this.add.bitmapText(cx, practBarAreaY - 40, "bigFont", "Practice Mode", 30)
        .setScrollFactor(0).setDepth(155).setOrigin(0.5, 0.5);
      barObjs.push(practModeLabel);
      cardContainer.add(practModeLabel);
      const practBarBg = this.add.graphics().setScrollFactor(0).setDepth(154);
      practBarBg.fillStyle(0x000000, 0.6);
      practBarBg.fillRoundedRect(barX0, practBarAreaY - barH2 / 2, barW2, barH2, barH2 / 2);
      barObjs.push(practBarBg);
      cardContainer.add(practBarBg);
      if (bestPractice > 0) {
        const practFillW = Math.max(innerH2, innerW2 * bestPractice / 100);
        const practBarFg = this.add.graphics().setScrollFactor(0).setDepth(155);
        practBarFg.fillStyle(0x00FFFF, 1);
        const practRightR = (bestPractice >= 100) ? innerRadius : 0;
        practBarFg.fillRoundedRect(barX0 + padding, practBarAreaY - barH2 / 2 + padding, practFillW, innerH2, {
          tl: innerRadius, bl: innerRadius, tr: practRightR, br: practRightR
        });
        barObjs.push(practBarFg);
        cardContainer.add(practBarFg);
      }
      const practPctLabel = this.add.bitmapText(cx, practBarAreaY, "bigFont", Math.round(bestPractice) + "%", 22)
        .setScrollFactor(0).setDepth(156).setOrigin(0.5, 0.5);
      barObjs.push(practPctLabel);
      cardContainer.add(practPctLabel);
    };
    buildCardContent();
    buildBar();
    let _currentAnimUpdate = null;
    const switchLevel = (dir, startX = null, dragVel = 0) => {
      if (!window.allLevels || window.allLevels.length === 0) return;

      if (_currentAnimUpdate) {
        this.events.off("preupdate", _currentAnimUpdate);
        _currentAnimUpdate = null;
      }
      let idx = window.allLevels.findIndex(l => l[2] === window.currentlevel[2]);
      idx = (idx + dir + window.allLevels.length) % window.allLevels.length;
      window.currentlevel = [...window.allLevels[idx]];
      const newColors = this._parseLevelColors(window.currentlevel[2]);
      const dark = isEveryEnd(window.currentlevel[2]);
      const slideDist = cardW - 200;
      const slideOutTarget = -dir * slideDist;
      const slideInStart = dir * slideDist;
      this.tweens.killTweensOf(cardContainer);
      let state = "out";
      let currentX = startX !== null ? startX : cardContainer.x;
      const dragSpeedBoost = Math.abs(dragVel) * 60;
      const slideOutSpeed = slideDist * 14 + dragSpeedBoost;
      const slideInVel = slideDist * 6 + dragSpeedBoost;
      let vel = 0;
      const scrollAnimUpdate = (time, delta) => {
        const dt = Math.min(delta / 1000, 0.05);
        if (state === "out") {
          currentX += (-dir) * slideOutSpeed * dt;
          if ((dir > 0 && currentX <= slideOutTarget) || (dir < 0 && currentX >= slideOutTarget)) {
            for (const o of cardContentObjs) {
              cardBounceContainer.remove(o, false);
              o.destroy();
            }
            for (const o of barObjs) {
              cardSlideContainer.remove(o, false);
              o.destroy();
            }
            cardContentObjs.length = 0;
            barObjs.length = 0;
            drawCardBg(newColors.bgHex, dark);
            buildCardContent();
            buildBar();
            drawOverlay(overlay, newColors.bgHex, dark);
            for (const gt of staticGroundTiles) gt.setTint(groundTintHex(newColors.groundHex));
            refreshDots();
            state = "in";
            currentX = slideInStart;
            vel = (-dir) * slideInVel;
          }
        } else if (state === "in") {
          const tension = 300;
          const friction = 15;
          const force = -tension * currentX - friction * vel;
          vel += force * dt;
          currentX += vel * dt;

          if (Math.abs(currentX) < 1 && Math.abs(vel) < 15) {
            currentX = 0;
            this.events.off("preupdate", scrollAnimUpdate);
            if (_currentAnimUpdate === scrollAnimUpdate) _currentAnimUpdate = null;
          }
        }
        cardContainer.x = currentX;
      };
      _currentAnimUpdate = scrollAnimUpdate;
      this.events.on("preupdate", scrollAnimUpdate);
    };
    this._makeBouncyButton(arrowL, 1.1, () => { switchLevel(-1); });
    this._makeBouncyButton(arrowR, 1.1, () => { switchLevel(1); });
    const inputBlocker = this.add.zone(cx, cy, sw, sh)
      .setScrollFactor(0).setDepth(151).setInteractive();
    inputBlocker.on("pointerdown", onDragStart);
    this._levelSelectStaticObjs = [overlay, inputBlocker, tableBottom, ...staticGroundTiles, staticFloorLine, cornerBL, cornerBR, backBtn, infoBtn, arrowL, arrowR, cardSlideContainer, cardHit];
    this._levelSelectSwitchLevel = switchLevel;
    this._levelSelectDotObjs = dotObjs;
    this._levelSelectCardContent = cardContentObjs;
    this._levelSelectBarObjs = barObjs;
  }
  _closeLevelSelect(silent = false) {
    if (!this._levelSelectOverlay) return;
    const destroy = () => {
      const all = [
        ...(this._levelSelectStaticObjs || []),
        ...(this._levelSelectDotObjs || []),
        ...(this._levelSelectCardContent || []),
        ...(this._levelSelectBarObjs || []),
      ];
      for (const o of all) { if (o && o.destroy) { this.tweens.killTweensOf(o); o.destroy(); } }
      this._levelSelectOverlay = null;
      this._levelSelectStaticObjs = null;
      this._levelSelectDotObjs = null;
      this._levelSelectCardContent = null;
      this._levelSelectBarObjs = null;
      this._levelSelectSwitchLevel = null;
    };
    if (silent) { destroy(); return; }
    const sw = screenWidth;
    const sh = screenHeight;
    const fadeOut = this.add.graphics().setScrollFactor(0).setDepth(200).setAlpha(0);
    fadeOut.fillStyle(0x000000, 1);
    fadeOut.fillRect(0, 0, sw, sh);
    this.tweens.add({
      targets: fadeOut, alpha: 1, duration: 150, ease: "Linear",
      onComplete: () => {
        destroy();
        this.tweens.add({ targets: fadeOut, alpha: 0, duration: 150, ease: "Linear", onComplete: () => fadeOut.destroy() });
      }
    });
  }
  _buildHUD() {
    this._attemptsLabel = this.add.bitmapText(0, 0, "bigFont", "Attempt 1", 65).setOrigin(0.5, 0.5).setVisible(false);
    this._level.topContainer.add(this._attemptsLabel);
    this._positionAttemptsLabel();
    this._checkpointBtnContainer = this.add.container(screenWidth / 2, screenHeight - 60)
      .setScrollFactor(0)
      .setDepth(30)
      .setVisible(false);
    this._checkpointBtn = this.add.image(-50, 0, "GJ_GameSheet03", "GJ_checkpointBtn_001.png")
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .setScale(0.8);
    this._makeBouncyButton(this._checkpointBtn, 0.8, () => {
      if (this._practicedMode.practiceMode && !this._state.isDead && !this._menuActive && !this._slideIn) {
        this._practicedMode.saveCheckpoint(this._state, this._playerWorldX, this._cameraX, this);
      }
    });
    this._expandHitArea(this._checkpointBtn, 2);
    this._clearCheckpointBtn = this.add.image(50, 0, "GJ_GameSheet03", "GJ_removeCheckBtn_001.png")
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .setScale(0.8);
    this._makeBouncyButton(this._clearCheckpointBtn, 0.8, () => {
      if (this._practicedMode.practiceMode && !this._state.isDead && !this._menuActive && !this._slideIn) {
        this._practicedMode.deleteLastCheckpoint();
      }
    }); 
    this._expandHitArea(this._clearCheckpointBtn, 1.5);
    this._checkpointBtnContainer.add([this._checkpointBtn, this._clearCheckpointBtn]);
    this._fpsText = this.add.text(screenWidth - 20, 10, "", {
      fontSize: "28px",
      fill: "#ffffff",
      fontFamily: "Arial"
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(999).setVisible(false);
    this._fpsAccum = 0;
    this._fpsFrames = 0;
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H).on("down", () => {
      if (!this._settingsPopup){
        this._fpsText.setVisible(!this._fpsText.visible);
      }
    });
  }
  _createStartPosGui() {
        const centerX = screenWidth / 2;
        const bottomY = screenHeight - 60;

        this._startPosGui = this.add.container(centerX, bottomY).setScrollFactor(0).setDepth(100);
        this._startPosGui.setVisible(false);

        const leftArrow = this.add.image(-90, 0, "GJ_GameSheet03", "GJ_arrow_01_001.png")
            .setScale(0.6)
            .setInteractive();
        
        const rightArrow = this.add.image(90, 0, "GJ_GameSheet03", "GJ_arrow_01_001.png")
            .setScale(0.6)
            .setFlipX(true)
            .setInteractive();

        const positions = this._level.getStartPositions();
        const total = positions.length;

        this._startPosText = this.add.bitmapText(0, 0, "bigFont", `0/${total}`, 40).setOrigin(0.5);

        this._startPosGui.add([leftArrow, rightArrow, this._startPosText]);

        this._makeBouncyButton(leftArrow, 0.6, () => this.changeStartPos(-1));
        this._makeBouncyButton(rightArrow, 0.6, () => this.changeStartPos(1));
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
    if (!this._paused && !this._menuActive && !this._slideIn && !this._state.isDead && !this._levelWon) {
      this._paused = true;
      this._pauseBtn.setVisible(false);
      this._audio.pauseMusic();
      this._setParticleTimeScale(0);
      this._buildPauseOverlay();
    }
  }
  _resumeGame() {
    if (this._paused) {
      this._setParticleTimeScale(1);
      this._paused = false;
      this._pauseBtn.setVisible(true).setAlpha(75 / 255);
      this._audio.resumeMusic();
      this._audio._ensureCorrectMusicMode();
      if (this._pauseContainer) {
        this._pauseContainer.destroy();
        this._pauseContainer = null;
      }
    }
  }
  _createPauseToggleButton(_0x5376fd, _0x3b6200, _0x2b25c8, _0xe203c3, _0x268e2b, _0x2d04c4) {
    const _0x4864cc = this.add.container(_0x3b6200, _0x2b25c8);
    const pieceHeight = this.add.image(0, 0, "GJ_GameSheet03", _0x268e2b ? "GJ_checkOn_001.png" : "GJ_checkOff_001.png").setScale(0.7).setInteractive();
    const _0x15c0df = this.add.bitmapText(25 + 10, 0, "bigFont", _0xe203c3, 32).setOrigin(0, 0.5);
    _0x4864cc.add([pieceHeight, _0x15c0df]);
    _0x5376fd.add(_0x4864cc);
    const _0x232e51 = _0x1dce15 => {
      pieceHeight.setTexture("GJ_GameSheet03", _0x1dce15 ? "GJ_checkOn_001.png" : "GJ_checkOff_001.png");
      this._expandHitArea(pieceHeight, 2);
      _0x2d04c4(_0x1dce15);
    };
    this._expandHitArea(pieceHeight, 2);
    this._makeBouncyButton(pieceHeight, 0.7, () => {
      _0x232e51(pieceHeight.frame.name === "GJ_checkOff_001.png");
    }, () => this._paused && !!this._pauseContainer);
    _0x15c0df.setInteractive();
    _0x15c0df.on("pointerdown", () => {
      if (this._paused && this._pauseContainer) {
        _0x232e51(pieceHeight.frame.name === "GJ_checkOff_001.png");
      }
    });
    return _0x4864cc;
  }
_buildPauseOverlay() {
    const textureY = screenWidth / 2;
    const _0xf70e04 = 320;
    const _0x4eb71b = screenWidth - 40;
    this._pauseContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(100);
    
    const _0x505665 = this.add.rectangle(textureY, _0xf70e04, screenWidth, screenHeight, 0, 75 / 255);
    _0x505665.setInteractive();
    this._pauseContainer.add(_0x505665);
    
    const _0x103191 = this.textures.get("square04_001").source[0].width * 0.325;
    const _0x954813 = this._drawScale9(textureY, _0xf70e04, _0x4eb71b, 600, "square04_001", _0x103191, 0, 150 / 255);
    this._pauseContainer.add(_0x954813);

    const _0x3874ed = this.scale.isFullscreen;
    const _0x426993 = this.add.image(textureY - _0x4eb71b / 2 + 40, 60, "GJ_WebSheet", _0x3874ed ? "toggleFullscreenOff_001.png" : "toggleFullscreenOn_001.png").setScale(0.64).setInteractive();
    this._expandHitArea(_0x426993, 2.5);
    this._pauseContainer.add(_0x426993);
    this._makeBouncyButton(_0x426993, 0.64, () => {
      const _0x23c9e5 = !this.scale.isFullscreen;
      _0x426993.setTexture("GJ_WebSheet", _0x23c9e5 ? "toggleFullscreenOff_001.png" : "toggleFullscreenOn_001.png");
      this._expandHitArea(_0x426993, 2.5);
      this._toggleFullscreen();
    });

    const settingsBtn = this.add.image(textureY + _0x4eb71b / 2 - 60, 80, 'GJ_GameSheet03', "GJ_optionsBtn_001.png").setAngle(90).setFlipY(true).setScale(0.64).setInteractive();
    this._expandHitArea(settingsBtn, 2.5);
    this._pauseContainer.add(settingsBtn);
    this._makeBouncyButton(settingsBtn, 0.64, () => this._buildSettingsPopup());

    this._pauseContainer.add(this.add.bitmapText(textureY, 65, "bigFont", window.currentlevel[1], 40).setOrigin(0.5, 0.5));

    const _0x21dacf = 170;
    const _0x46bab2 = this._bestPercent || 0;
    const _0x38b8d1 = this.add.image(textureY, _0x21dacf, "GJ_WebSheet", "GJ_progressBar_001.png").setTint(0).setAlpha(125 / 255);
    this._pauseContainer.add(_0x38b8d1);
    const _0x1d49a9 = this.textures.getFrame("GJ_WebSheet", "GJ_progressBar_001.png");
    const _0xb5ab6f = _0x1d49a9 ? _0x1d49a9.width : 680;
    const _0x1e6502 = _0x1d49a9 ? _0x1d49a9.height : 40;
    const _0x3782ca = Math.max(1, Math.floor(_0xb5ab6f * (_0x46bab2 / 100)));
    const _0x3d0987 = this.add.image(0, 0, "GJ_WebSheet", "GJ_progressBar_001.png").setTint(65280).setScale(0.992, 0.86).setOrigin(0, 0.5).setCrop(0, 0, _0x3782ca, _0x1e6502);
    _0x3d0987.setPosition(textureY - _0xb5ab6f * 0.992 / 2, _0x21dacf);
    this._pauseContainer.add(_0x3d0987);
    this._pauseContainer.add(this.add.bitmapText(textureY, _0x21dacf, "bigFont", _0x46bab2 + "%", 30).setOrigin(0.5, 0.5).setScale(0.7));
    this._pauseContainer.add(this.add.bitmapText(textureY, 130, "bigFont", "Normal Mode", 30).setOrigin(0.5, 0.5).setScale(0.78));

    const _pausePractPct = this._practiceBestPercent || 0;
    const _pausePractBarY = 255;
    const _pausePractBarImg = this.add.image(textureY, _pausePractBarY, "GJ_WebSheet", "GJ_progressBar_001.png").setTint(0).setAlpha(125 / 255);
    this._pauseContainer.add(_pausePractBarImg);
    const _pausePractFrame = this.textures.getFrame("GJ_WebSheet", "GJ_progressBar_001.png");
    const _pausePractBarW = _pausePractFrame ? _pausePractFrame.width : 680;
    const _pausePractBarH = _pausePractFrame ? _pausePractFrame.height : 40;
    const _pausePractFillW = Math.max(1, Math.floor(_pausePractBarW * (_pausePractPct / 100)));
    const _pausePractFg = this.add.image(0, 0, "GJ_WebSheet", "GJ_progressBar_001.png").setTint(0x00FFFF).setScale(0.992, 0.86).setOrigin(0, 0.5).setCrop(0, 0, _pausePractFillW, _pausePractBarH);
    _pausePractFg.setPosition(textureY - _pausePractBarW * 0.992 / 2, _pausePractBarY);
    this._pauseContainer.add(_pausePractFg);
    this._pauseContainer.add(this.add.bitmapText(textureY, _pausePractBarY, "bigFont", _pausePractPct + "%", 30).setOrigin(0.5, 0.5).setScale(0.7));
    this._pauseContainer.add(this.add.bitmapText(textureY, _pausePractBarY - 40, "bigFont", "Practice Mode", 30).setOrigin(0.5, 0.5).setScale(0.78));

    const _0x4791ac = [
        { frame: this._practicedMode.practiceMode ? "GJ_normalBtn_001.png" : "GJ_practiceBtn_001.png", atlas: "GJ_GameSheet03", action: null },
        { frame: "GJ_playBtn2_001.png", atlas: "GJ_WebSheet", action: () => this._resumeGame() },
        { frame: "GJ_menuBtn_001.png", atlas: "GJ_WebSheet", action: () => {
            this._audio.playEffect("quitSound_01");
            this._audio.stopMusic();
            this._resumeGame();
            this.scene.restart();
        }},
        { frame: "GJ_replayBtn_001.png", atlas: "GJ_WebSheet", action: () => {
            this._resumeGame();
            this._restartLevel();
        }}
    ];

    const _0x25aa59 = _0x4791ac.map(btn => this.textures.getFrame(btn.atlas, btn.frame)?.width || 123);
    let _0x599a9b = textureY - (_0x25aa59.reduce((a, b) => a + b, 0) + (_0x4791ac.length - 1) * 40) / 2;

    for (let i = 0; i < _0x4791ac.length; i++) {
        const item = _0x4791ac[i];
        const width = _0x25aa59[i];
        const btn = this.add.image(_0x599a9b + width / 2, 390, item.atlas, item.frame).setInteractive();
        
        if (item.action === null) {
            this._pausePracticeBtn = btn;
            btn.setAngle(90).setFlipY(true);
            this._makeBouncyButton(btn, 1, () => {
                const isPracticeMode = this._practicedMode.togglePracticeMode();
                btn.setTexture("GJ_GameSheet03", isPracticeMode ? "GJ_normalBtn_001.png" : "GJ_practiceBtn_001.png");
                btn.setAngle(90).setFlipY(true);
                if (this._checkpointBtnContainer) this._checkpointBtnContainer.setVisible(isPracticeMode);
                this._resumeGame();
                if (!isPracticeMode) {
                    this._practicedMode.clearCheckpoints();
                    this._restartLevel();
                }
            });
        } else {
            this._makeBouncyButton(btn, 1, item.action);
        }
        this._pauseContainer.add(btn);
        _0x599a9b += width + 40;
    }

    const _0x1008ae = 530;
    const _0x22b43a = 0.7;
    const _0x41925a = this.textures.getFrame("GJ_WebSheet", "slidergroove.png");
    const _0x372782 = _0x41925a ? _0x41925a.width : 420;

    const createSlider = (posX, iconFrame, initialVal, setter) => {
        this._pauseContainer.add(this.add.image(posX - 180 - 5, _0x1008ae, "GJ_WebSheet", iconFrame).setScale(1.2));
        const barMaxW = (_0x372782 - 8) * _0x22b43a;
        const barStartX = posX - _0x372782 * _0x22b43a / 2 + 2.8;
        const fillW = initialVal * barMaxW;
        const fillBar = this.add.tileSprite(barStartX, _0x1008ae, fillW > 0 ? fillW : 1, 11.2, "sliderBar").setOrigin(0, 0.5);
        this._pauseContainer.add(fillBar);
        this._pauseContainer.add(this.add.image(posX, _0x1008ae, "GJ_WebSheet", "slidergroove.png").setScale(_0x22b43a));
        
        const thumb = this.add.image(barStartX + fillW, _0x1008ae, "GJ_WebSheet", "sliderthumb.png").setScale(_0x22b43a).setInteractive({ draggable: true });
        this._pauseContainer.add(thumb);
        thumb.on("drag", (p, dragX) => {
            thumb.x = Math.max(barStartX, Math.min(barStartX + barMaxW, dragX));
            const pct = (thumb.x - barStartX) / barMaxW;
            fillBar.width = Math.max(1, pct * barMaxW);
            setter(pct < 0.03 ? 0 : pct);
        });
    };

    createSlider(textureY - 200, "gj_songIcon_001.png", this._audio.getUserMusicVolume(), v => this._audio.setUserMusicVolume(v));
    createSlider(textureY + 200, "GJ_sfxIcon_001.png", this._sfxVolume, v => {
        this._sfxVolume = v;
        localStorage.setItem("userSfxVol", v);
    });
 }
_buildSettingsPopup() {
    if (this._settingsPopup) return;

    const centerX = screenWidth / 2,
        centerY = 320,
        panelWidth = 800,
        panelHeight = 550;

    this._settingsPopup = this.add.container(0, 0).setScrollFactor(0).setDepth(250);

    const dim = this.add.rectangle(centerX, centerY, screenWidth, screenHeight, 0, 150 / 255).setInteractive();
    this._settingsPopup.add(dim);

    const corner = 0.325 * this.textures.get("GJ_square02").source[0].width;
    const panel = this._drawScale9(centerX, centerY, panelWidth, panelHeight, 'GJ_square02', corner, 16777215, 1);
    this._settingsPopup.add(panel);

    this._settingsPopup.add(this.add.bitmapText(centerX, centerY - (panelHeight / 2) + 45, "bigFont", "Settings", 40).setOrigin(0.5));

    const closeBtn = this.add.image(centerX - (panelWidth / 2) + 20, centerY - (panelHeight / 2) + 20, 'GJ_WebSheet', "GJ_closeBtn_001.png").setScale(0.8).setInteractive();
    this._settingsPopup.add(closeBtn);
    this._makeBouncyButton(closeBtn, 0.8, () => {
        this._settingsPopup.destroy();
        this._settingsPopup = null;
    });

    const column1X = centerX - 200;
    const column2X = centerX + 200;
    const checkOffset = -120;
    const textOffset = -70;
    const spacingY = 70;
    const startY = centerY - 150;

    const createToggle = (x, y, label, getVal, setVal, callback = null) => {
        const getTex = () => getVal() ? "GJ_checkOn_001.png" : "GJ_checkOff_001.png";
        const check = this.add.image(x + checkOffset, y, "GJ_GameSheet03", getTex()).setScale(0.8).setInteractive();
        const txt = this.add.bitmapText(x + textOffset, y, "bigFont", label, 25).setOrigin(0, 0.5);
        this._settingsPopup.add([check, txt]);

        this._makeBouncyButton(check, 0.8, () => {
            setVal(!getVal());
            check.setTexture("GJ_GameSheet03", getTex());
            if (callback) callback(getVal());
            this._saveSettings();
        });
    };

    createToggle(column1X, startY, "Show Percentage", 
        () => window.showPercentage, 
        (v) => window.showPercentage = v,
        (v) => { if (this._percentageLabel) this._percentageLabel.setVisible(v); }
    );

    createToggle(column1X, startY + spacingY, "Percentage Decimals", 
        () => window.percentageDecimals, 
        (v) => window.percentageDecimals = v
    );

    createToggle(column1X, startY + (spacingY * 2), "StartPos Switcher", 
        () => window.startPosSwitcher, 
        (v) => window.startPosSwitcher = v,
        (v) => {
            if (!v) this._startPosIndex = -1;
            if (this._startPosGui) this._startPosGui.setVisible(v);
            const total = this._level.getStartPositions().length;
            if (this._startPosText) this._startPosText.setText(`0/${total}`);
        }
    );

    createToggle(column1X, startY + (spacingY * 3), "Noclip", 
        () => window.noClip, 
        (v) => window.noClip = v,
        (v) => { if (this._noclipIndicator) this._noclipIndicator.setVisible(v); }
    );

    createToggle(column1X, startY + (spacingY * 4), "Show Hitboxes", 
        () => window.showHitboxes, 
        (v) => window.showHitboxes = v,
        (v) => { if (!v && this._player._hitboxGraphics) this._player._hitboxGraphics.clear(); }
    );

    createToggle(column1X, startY + (spacingY * 5), "Hitbox Trail", 
        () => window.showHitboxTrail, 
        (v) => window.showHitboxTrail = v,
        (v) => { if (!v) this._hitboxTrail = []; }
    );

    createToggle(column2X, startY, "Show FPS", 
        () => this._fpsText.visible, 
        (v) => this._fpsText.visible = v,
        (v) => { if (this._fpsText) this._fpsText.setVisible(v); }
    );

    createToggle(column2X, startY + spacingY, "Solid Wave Trail", 
        () => window.solidWave, 
        (v) => window.solidWave = v
    );

    createToggle(column2X, startY + (spacingY * 2), "Noclip Accuracy", 
        () => window.noClipAccuracy, 
        (v) => window.noClipAccuracy = v
    );
  }
  _saveSettings() {
    const settings = {
        noclip: window.noClip,
        showPercentage: window.showPercentage,
        percentDecimals: window.percentageDecimals,
        showHitboxes: window.showHitboxes,
        startPosSwitcher: window.startPosSwitcher,
        hitboxTrail: window.showHitboxTrail,
        showFPS: this._fpsText.visible,
        solidWaveTrail: window.solidWave,
        noclipAccuracy: window.noClipAccuracy
    };
    localStorage.setItem("gd_settings", JSON.stringify(settings));
  }
  _loadSettings() {
    const saved = localStorage.getItem("gd_settings");
    const defaults = {
        noclip: false,
        showPercentage: true,
        percentDecimals: false,
        showHitboxes: false,
        startPosSwitcher: false,
        hitboxTrail: false,
        showFPS: false,
        solidWaveTrail: false,
        noclipAccuracy: false
    };

    const data = saved ? JSON.parse(saved) : defaults;

    window.noClip = data.noclip;
    window.showPercentage = data.showPercentage;
    window.percentageDecimals = data.percentDecimals;
    window.showHitboxes = data.showHitboxes;
    window.startPosSwitcher = data.startPosSwitcher;
    window.showHitboxTrail = data.hitboxTrail;
    this._fpsText.visible = data.showFPS;
    window.solidWave = data.solidWaveTrail;
    window.noClipAccuracy = data.noclipAccuracy;
  }
  _buildInfoPopup() {
    if (this._infoPopup) {
      return;
    }
    const xPos = screenWidth / 2;
    const _0x4c3182 = 320;
    const _0xe2830b = 336;
    this._infoPopup = this.add.container(0, 0).setScrollFactor(0).setDepth(200);
    const _0x249eb7 = this.add.rectangle(xPos, _0x4c3182, screenWidth, screenHeight, 0, 100 / 255);
    _0x249eb7.setInteractive();
    this._infoPopup.add(_0x249eb7);
    const _0x14e46f = this.textures.get("GJ_square02").source[0].width * 0.325;
    const _0x2c64c2 = this._drawScale9(xPos, _0x4c3182, 480, _0xe2830b, "GJ_square02", _0x14e46f, 16777215, 1);
    this._infoPopup.add(_0x2c64c2);
    const _0x5a0f88 = this.add.image(xPos - 240 + 20, 172, "GJ_WebSheet", "GJ_closeBtn_001.png").setScale(0.8).setInteractive();
    this._infoPopup.add(_0x5a0f88);
    this._expandHitArea(_0x5a0f88, 2);
    this._makeBouncyButton(_0x5a0f88, 0.8, () => this._closeInfoPopup());
    let yPos = 206;
    const _0x302fca = this.add.bitmapText(xPos, yPos, "bigFont", "Credits", 40).setOrigin(0.5, 0.5);
    this._infoPopup.add(_0x302fca);
    yPos += 55;
    const _0x22e4c7 = this.add.bitmapText(xPos, yPos, "goldFont", "Made by RobTop Games", 40).setOrigin(0.5, 0.5).setScale(0.6);
    this._infoPopup.add(_0x22e4c7);
    yPos += 35;
    const _0x3cdf70a = this.add.bitmapText(xPos, yPos, "goldFont", "Modded by:", 40).setOrigin(0.5, 0.5).setScale(0.6);
    this._infoPopup.add(_0x3cdf70a);
    yPos += 35;
    const _0x3cdf70b = this.add.bitmapText(xPos, yPos, "goldFont", "AntiMatter, breadbb, bog, aloaf,", 40).setOrigin(0.5, 0.5).setScale(0.6);
    this._infoPopup.add(_0x3cdf70b);
    yPos += 35;
    const _0x3cdf70c = this.add.bitmapText(xPos, yPos, "goldFont", "PinkDev, rohanis0000, arbstro,", 40).setOrigin(0.5, 0.5).setScale(0.6);
    this._infoPopup.add(_0x3cdf70c);
    yPos += 35;
    const _0x3cdf70d = this.add.bitmapText(xPos, yPos, "goldFont", "and Lasokar.", 40).setOrigin(0.5, 0.5).setScale(0.6);
    this._infoPopup.add(_0x3cdf70d);
    yPos += 35;
    const _0x97b2a9 = this.add.text(xPos, 463, "© 2026 RobTop Games. All rights reserved.", {
      fontSize: "12px",
      color: "#000000",
      fontFamily: "Arial"
    }).setOrigin(0.5, 0.5).setAlpha(0.7).setResolution(2);
    this._infoPopup.add(_0x97b2a9);
  }
  _closeInfoPopup() {
    if (this._infoPopup) {
      this._infoPopup.destroy();
      this._infoPopup = null;
    }
  }
  _buildUpdateLogPopup() {
    if (this._updateLogPopup || window.levelID) {
      return;
    }
    const xPos = screenWidth / 2;
    const popupHeight = 320;
    const popupWidth = 336;
    this._updateLogPopup = this.add.container(0, 0).setScrollFactor(0).setDepth(1000);
    const background = this.add.rectangle(xPos, popupHeight, screenWidth, screenHeight, 0, 100 / 255);
    background.setInteractive();
    this._updateLogPopup.add(background);
    
    const bounceContainer = this.add.container(xPos, popupHeight).setScale(0);
    this._updateLogPopup.add(bounceContainer);
    const cornerRadius = this.textures.get("GJ_square02").source[0].width * 0.325;
    const popupBg = this._drawScale9(0, 0, 480, popupWidth, "GJ_square02", cornerRadius, 16777215, 1);
    bounceContainer.add(popupBg);
    const closeBtn = this.add.image(-240 + 20, -148, "GJ_WebSheet", "GJ_closeBtn_001.png").setScale(0.8).setInteractive();
    bounceContainer.add(closeBtn);
    this._expandHitArea(closeBtn, 2);
    this._makeBouncyButton(closeBtn, 0.8, () => this._closeUpdateLogPopup());
    const title = this.add.bitmapText(0, -124, "bigFont", "BETA (EXPECT BUGS)", 30).setOrigin(0.5, 0.5).setTint(0xff6666);
    bounceContainer.add(title);
    const scrollAreaW = 420;
    const scrollAreaH = 230;
    const scrollAreaX = 0;
    const scrollAreaY = 20;
    const scrollFrameBg = this.add.graphics();
    scrollFrameBg.fillStyle(0x000000, 0.18);
    scrollFrameBg.fillRoundedRect(scrollAreaX - scrollAreaW / 2, scrollAreaY - scrollAreaH / 2, scrollAreaW, scrollAreaH, 8);
    bounceContainer.add(scrollFrameBg);
    const contentContainer = this.add.container(0, scrollAreaY - scrollAreaH / 2 + 8);
    bounceContainer.add(contentContainer);
    /* colors for reference
      0xff6666
      0xff9944
      0xaaddff - fun messages from me :)
      0xff00ff - pink dev entries
    */
    const updateEntries = [
      { text: "Update Log", scale: 0.85, font: "goldFont" },
      { text: "GD accurate loading screen.", scale: 0.65 },
      { text: "Fixed freeze when completing level in noclip.", scale: 0.5 },
      { text: "Online levels - BETA", scale: 0.65 },
      { text: "Practice Mode - BETA", scale: 0.65 },
      { text: "THESE 2 CAN BE VERY BUGGY.", scale: 0.65, color: 0xff6666 },
      { text: "UI tweaks.", scale: 0.65 },
      { text: "Correct Wave hitboxes.", scale: 0.65 },
      { text: "Move triggers now move orbs and etc.", scale: 0.6 },
      { text: "Bug fixes.", scale: 0.65 },
      { text: "i love pinkdev no diddy", scale: 0.65, color: 0xaaddff },
      { text: "- rohanis0000", scale: 0.65, color: 0xaaddff },
      { text: "(For Developers)", scale: 0.85, font: "goldFont" },
      { text: "Split Code into multiple files. - PinkDev", scale: 0.58, color: 0xff00ff },
      { text: "Put split code into folders. - rohanis0000", scale: 0.55, color: 0xaaddff },
      
      

    ]; 
    let yPos = 0;
    const lineItems = [];
    updateEntries.forEach(entry => {
      const txt = this.add.bitmapText(0, yPos, entry.font || "bigFont", entry.text, 32)
        .setOrigin(0.5, 0)
        .setScale(entry.scale || 0.65);
      if (entry.color != null) txt.setTint(entry.color);
      contentContainer.add(txt);
      lineItems.push(txt);
      yPos += Math.round(32 * (entry.scale || 0.65)) + 10;
    });
    const totalContentH = yPos;
    const maxScrollDown = Math.max(0, totalContentH - scrollAreaH + 16);
    const maskGraphics = this.add.graphics();
    const maskShape = this.add.graphics();
    maskShape.fillStyle(0xffffff, 1);
    const updateMask = () => {
      if (!bounceContainer || !bounceContainer.active) return;
      const wx = xPos + bounceContainer.x - xPos;
      const s = bounceContainer.scaleX;
      const bwx = xPos;
      const bwy = popupHeight;
      maskShape.clear();
      maskShape.fillStyle(0xffffff, 1);
      maskShape.fillRect(
        bwx + (scrollAreaX - scrollAreaW / 2) * s,
        bwy + (scrollAreaY - scrollAreaH / 2) * s,
        scrollAreaW * s,
        scrollAreaH * s
      );
    };
    const geomMask = maskShape.createGeometryMask();
    contentContainer.setMask(geomMask);
    const maskUpdateEvent = this.events.on('postupdate', updateMask);
    let scrollY = 0;
    const baseContentY = scrollAreaY - scrollAreaH / 2 + 8;
    const applyScroll = () => {
      contentContainer.y = baseContentY - scrollY;
    };
    applyScroll();
    const scrollZone = this.add.zone(scrollAreaX, scrollAreaY, scrollAreaW, scrollAreaH).setInteractive();
    bounceContainer.add(scrollZone);
    scrollZone.on('wheel', (_p, _dx, deltaY) => {
      scrollY = Phaser.Math.Clamp(scrollY + deltaY * 0.6, 0, maxScrollDown);
      applyScroll();
    });

    let dragStartY = 0;
    let dragStartScroll = 0;
    scrollZone.on('pointerdown', (pointer) => {
      dragStartY = pointer.y;
      dragStartScroll = scrollY;
    });
    scrollZone.on('pointermove', (pointer) => {
      if (pointer.isDown) {
        const dy = dragStartY - pointer.y;
        scrollY = Phaser.Math.Clamp(dragStartScroll + dy, 0, maxScrollDown);
        applyScroll();
      }
    });
    this._updateLogPopupCleanup = () => {
      this.events.off('postupdate', updateMask);
      maskShape.destroy();
      geomMask.destroy();
    };
    this.tweens.add({
      targets: bounceContainer,
      scale: { from: 0, to: 1 },
      duration: 500,
      ease: "Bounce.Out"
    });
  }
  _closeUpdateLogPopup() {
    if (this._updateLogPopup) {
      if (this._updateLogPopupCleanup) {
        this._updateLogPopupCleanup();
        this._updateLogPopupCleanup = null;
      }
      this._updateLogPopup.destroy();
      this._updateLogPopup = null;
    }
  }
  _expandHitArea(_0x122213, _0x37180a) {
    const _0x46ea45 = _0x122213.width;
    const _0x43b461 = _0x122213.height;
    const _0x960250 = _0x46ea45 * (_0x37180a - 1) / 2;
    const _0x3f88a1 = _0x43b461 * (_0x37180a - 1) / 2;
    _0x122213.input.hitArea.setTo(-_0x960250, -_0x3f88a1, _0x46ea45 + _0x960250 * 2, _0x43b461 + _0x3f88a1 * 2);
  }
  _makeBouncyButton(textureX, _0x57b645, _0x2f13d0, _0xda0c21) {
    const _0x396ca0 = _0x57b645 * 1.26;
    textureX.on("pointerdown", () => {
      if (!_0xda0c21 || !!_0xda0c21()) {
        textureX._pressed = true;
        this.tweens.killTweensOf(textureX, "scale");
        this.tweens.add({
          targets: textureX,
          scale: _0x396ca0,
          duration: 300,
          ease: "Bounce.Out"
        });
      }
    });
    textureX.on("pointerout", () => {
      if (textureX._pressed) {
        textureX._pressed = false;
        this.tweens.killTweensOf(textureX, "scale");
        this.tweens.add({
          targets: textureX,
          scale: _0x57b645,
          duration: 400,
          ease: "Bounce.Out"
        });
      }
    });
    textureX.on("pointerup", () => {
      if (textureX._pressed) {
        textureX._pressed = false;
        this.tweens.killTweensOf(textureX, "scale");
        textureX.setScale(_0x57b645);
        _0x2f13d0();
      }
    });
    return textureX;
  }
  _toggleFullscreen() {
    if (this.scale.isFullscreen) {
      this.scale.stopFullscreen();
    } else {
      this.scale.startFullscreen();
      try {
        screen.orientation.lock("landscape").catch(() => {});
      } catch (_0x22124f) {}
    }
  }
  _drawScale9(_0x147730, _0x4c8cbf, scaleWidth, scaleHeight, _0x24a44b, borderSize, _0x590eba, _0x206735) {
    const _0x4080b2 = this.add.container(_0x147730, _0x4c8cbf);
    const _0x2522df = this.textures.get(_0x24a44b);
    const _0x401ec1 = _0x2522df.source[0];
    const _0x3f82ec = _0x401ec1.width;
    const _0x294746 = _0x401ec1.height;
    const _0x2b09f1 = scaleWidth - borderSize * 2;
    const _0x990515 = scaleHeight - borderSize * 2;
    const _0x1d065e = [{
      sx: 0,
      sy: 0,
      sw: borderSize,
      sh: borderSize,
      dx: -scaleWidth / 2,
      dy: -scaleHeight / 2,
      dw: borderSize,
      dh: borderSize
    }, {
      sx: borderSize,
      sy: 0,
      sw: _0x3f82ec - borderSize * 2,
      sh: borderSize,
      dx: -scaleWidth / 2 + borderSize,
      dy: -scaleHeight / 2,
      dw: _0x2b09f1,
      dh: borderSize
    }, {
      sx: _0x3f82ec - borderSize,
      sy: 0,
      sw: borderSize,
      sh: borderSize,
      dx: scaleWidth / 2 - borderSize,
      dy: -scaleHeight / 2,
      dw: borderSize,
      dh: borderSize
    }, {
      sx: 0,
      sy: borderSize,
      sw: borderSize,
      sh: _0x294746 - borderSize * 2,
      dx: -scaleWidth / 2,
      dy: -scaleHeight / 2 + borderSize,
      dw: borderSize,
      dh: _0x990515
    }, {
      sx: borderSize,
      sy: borderSize,
      sw: _0x3f82ec - borderSize * 2,
      sh: _0x294746 - borderSize * 2,
      dx: -scaleWidth / 2 + borderSize,
      dy: -scaleHeight / 2 + borderSize,
      dw: _0x2b09f1,
      dh: _0x990515
    }, {
      sx: _0x3f82ec - borderSize,
      sy: borderSize,
      sw: borderSize,
      sh: _0x294746 - borderSize * 2,
      dx: scaleWidth / 2 - borderSize,
      dy: -scaleHeight / 2 + borderSize,
      dw: borderSize,
      dh: _0x990515
    }, {
      sx: 0,
      sy: _0x294746 - borderSize,
      sw: borderSize,
      sh: borderSize,
      dx: -scaleWidth / 2,
      dy: scaleHeight / 2 - borderSize,
      dw: borderSize,
      dh: borderSize
    }, {
      sx: borderSize,
      sy: _0x294746 - borderSize,
      sw: _0x3f82ec - borderSize * 2,
      sh: borderSize,
      dx: -scaleWidth / 2 + borderSize,
      dy: scaleHeight / 2 - borderSize,
      dw: _0x2b09f1,
      dh: borderSize
    }, {
      sx: _0x3f82ec - borderSize,
      sy: _0x294746 - borderSize,
      sw: borderSize,
      sh: borderSize,
      dx: scaleWidth / 2 - borderSize,
      dy: scaleHeight / 2 - borderSize,
      dw: borderSize,
      dh: borderSize
    }];
    for (let _0x24f653 = 0; _0x24f653 < _0x1d065e.length; _0x24f653++) {
      const scale9Piece = _0x1d065e[_0x24f653];
      const _0xade586 = "_s9_" + _0x24f653;
      if (!_0x2522df.has(_0xade586)) {
        _0x2522df.add(_0xade586, 0, scale9Piece.sx, scale9Piece.sy, scale9Piece.sw, scale9Piece.sh);
      }
      const _0x1145e5 = this.add.image(scale9Piece.dx, scale9Piece.dy, _0x24a44b, _0xade586).setOrigin(0, 0).setDisplaySize(scale9Piece.dw, scale9Piece.dh);
      if (_0x590eba !== undefined) {
        _0x1145e5.setTint(_0x590eba);
      }
      if (_0x206735 !== undefined) {
        _0x1145e5.setAlpha(_0x206735);
      }
      _0x4080b2.add(_0x1145e5);
    }
    return _0x4080b2;
  }
  _startGame() {
    if (!this._menuActive) {
      return;
    }
    
    // fixed loading saved new best from local storage
    this._bestPercent = parseFloat(localStorage.getItem("bestPercent_" + (window.currentlevel[2] || "level_1")) || "0");
    this._practiceBestPercent = parseFloat(localStorage.getItem("practiceBestPercent_" + (window.currentlevel[2] || "level_1")) || "0");
    
    this._menuActive = false;
    this._slideIn = true;
    if (this._menuGlitter) {
      this._menuGlitter.destroy();
      this._menuGlitter = null;
    }
    if (this._menuUpdateLogBtn) {
      this._menuUpdateLogBtn.setVisible(false);
    }
    if (this._playBtn) {
      this.tweens.killTweensOf(this._playBtn);
      this.tweens.add({
        targets: this._playBtn,
        scale: 0.01,
        duration: 200,
        ease: "Quad.In",
        onComplete: () => {
          this._playBtn.destroy();
          this._playBtn = null;
        }
      });
    }
    //icon stuff the threequel
    if (this._iconBtn) {
  this._closeIconSelector && this._closeIconSelector(true);
  this.tweens.killTweensOf(this._iconBtn);
  this.tweens.add({
    targets: this._iconBtn,
    scale: 0.01,
    duration: 200,
    ease: "Quad.In",
    onComplete: () => {
      this._iconBtn.destroy();
      this._iconBtn = null;
    }
  });
}
  //creator stuff the threequel
    if (this._creatorBtn) {
  this._closeCreatorMenu && this._closeCreatorMenu(true);
  this._closeSearchMenu && this._closeSearchMenu(true);
  this.tweens.killTweensOf(this._creatorBtn);
  this.tweens.add({
    targets: this._creatorBtn,
    scale: 0.01,
    duration: 200,
    ease: "Quad.In",
    onComplete: () => {
      this._creatorBtn.destroy();
      this._creatorBtn = null;
    }
  });
}
    if (this._robLogo) {
      this.tweens.add({
        targets: this._robLogo,
        y: screenHeight + this._robLogo.height,
        duration: 300,
        ease: "Quad.In",
        onComplete: () => {
          this._robLogo.destroy();
          this._robLogo = null;
        }
      });
    }
    if (this._copyrightText) {
      this.tweens.add({
        targets: this._copyrightText,
        y: 680,
        duration: 300,
        ease: "Quad.In",
        onComplete: () => {
          this._copyrightText.destroy();
          this._copyrightText = null;
        }
      });
    }
    if (this._menuFsBtn) {
      this.tweens.add({
        targets: this._menuFsBtn,
        y: -this._menuFsBtn.height,
        duration: 300,
        ease: "Quad.In",
        onComplete: () => {
          this._menuFsBtn.destroy();
          this._menuFsBtn = null;
        }
      });
    }
    if (this._menuInfoBtn) {
      this.tweens.add({
        targets: this._menuInfoBtn,
        y: -this._menuInfoBtn.height,
        duration: 300,
        ease: "Quad.In",
        onComplete: () => {
          this._menuInfoBtn.destroy();
          this._menuInfoBtn = null;
        }
      });
    }
    this._closeInfoPopup();
    this._closeUpdateLogPopup();
    if (this._tryMeImg) {
      this.tweens.add({
        targets: this._tryMeImg,
        y: -this._tryMeImg.height,
        duration: 300,
        ease: "Quad.In",
        onComplete: () => {
          this._tryMeImg.destroy();
          this._tryMeImg = null;
        }
      });
    }
    if (this._downloadBtns) {
      for (const _0xaa3a95 of this._downloadBtns) {
        this.tweens.killTweensOf(_0xaa3a95);
        this.tweens.add({
          targets: _0xaa3a95,
          y: screenHeight + _0xaa3a95.height,
          duration: 300,
          ease: "Quad.In",
          onComplete: () => _0xaa3a95.destroy()
        });
      }
      this._downloadBtns = null;
    }
    if (this._logo) {
      this.tweens.add({
        targets: this._logo,
        y: -this._logo.height,
        duration: 300,
        ease: "Quad.In",
        onComplete: () => {
          this._logo.destroy();
          this._logo = null;
        }
      });
    }
    this._cameraX = -centerX;
    this._cameraY = 0;
    this._cameraXRef._v = this._cameraX;
    this._prevCameraX = this._cameraX;
    const _0x22e36e = this._cameraX - (this._menuCameraX || 0);
    this._level.shiftGroundTiles(_0x22e36e);
    this._playerWorldX = this._cameraX;
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
    this._attemptsLabel.setVisible(this._attempts > 1);
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
    }
  }
  _pushButton() {
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
      if (!this._state.isFlying && !this._state.isWave && !this._state.isUfo && this._state.canJump) {
        this._player.updateJump(0);
        this._totalJumps++;
      } else if (this._state.isUfo) {
        this._player.updateJump(0);
        this._totalJumps++;
      }
    }
  }
  _releaseButton() {
    this._state.upKeyDown = false;
    this._state.upKeyPressed = false;
    this._state.queuedHold = false;
  }
  _positionMenuItems() {
    const _0x1e5db8 = screenWidth / 2;
    if (this._logo) {
      this._logo.x = _0x1e5db8;
    }
    if (this._menuInfoBtn) {
      this._menuInfoBtn.x = screenWidth - 30 - 3;
    }
    if (this._copyrightText) {
      this._copyrightText.x = screenWidth - 20;
    }
    if (this._tryMeImg) {
      this._tryMeImg.x = _0x1e5db8 + 175;
    }
    if (this._menuGlitter) {
      this._menuGlitter.x = _0x1e5db8;
      this._menuGlitter.y = 320;
    }
    if (this._playBtn) {
      this._playBtn.x = _0x1e5db8;
      this.tweens.killTweensOf(this._playBtn, "y");
      this._playBtn.y = 320;
      this.tweens.add({
        targets: this._playBtn,
        y: 324,
        duration: 750,
        ease: "Quad.InOut",
        yoyo: true,
        repeat: -1
      });
    }
    if (this._downloadBtns) {
      const _0x285ef7 = screenWidth - 130;
      const _0x4a8263 = 555;
      const _0x23d03e = 210;
      for (let _0x1bdfae = 0; _0x1bdfae < this._downloadBtns.length; _0x1bdfae++) {
        this._downloadBtns[_0x1bdfae].setPosition(_0x285ef7 - _0x1bdfae * _0x23d03e, _0x4a8263);
      }
    }
    if (this._iconBtn) {
      this._iconBtn.x = (screenWidth / 2) - this._playBtn.width / 2 - 100 - (this._iconBtn.width * this._iconBtn.scaleX) / 2;
      this.tweens.killTweensOf(this._iconBtn, "y");
      this._iconBtn.y = 320;
      this.tweens.add({
        targets: this._iconBtn,
        y: 324,
        duration: 750,
        ease: "Quad.InOut",
        yoyo: true,
        repeat: -1
      });
    }
    if (this._creatorBtn) {
      this._creatorBtn.x = (screenWidth / 2) + this._playBtn.width / 2 + 100 + (this._creatorBtn.width * this._creatorBtn.scaleX) / 2;
      this.tweens.killTweensOf(this._creatorBtn, "y");
      this._creatorBtn.y = 320;
      this.tweens.add({
        targets: this._creatorBtn,
        y: 324,
        duration: 750,
        ease: "Quad.InOut",
        yoyo: true,
        repeat: -1
      });
    }
  }
  _positionAttemptsLabel() {
    let _0xdbdd91 = this._cameraX + screenWidth / 2;
    if (this._attempts > 1) {
      _0xdbdd91 += 100;
    }
    this._attemptsLabel.setPosition(_0xdbdd91, 150);
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
  }
  _restartLevel() {
    this._attempts++;
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
    this._glitterEmitter.stop();
    playerSpeed = SpeedPortal.ONE_TIMES;
    this._level.resetObjects();
    this._level.shiftGroundTiles(this._cameraX - _0x2ba78a);
    this._level.resetGroundState();
    this._level.resetColorTriggers();
    this._level.resetAlphaTriggers();
    this._level.resetRotateTriggers();
    this._level.resetPulseTriggers();
    this._level.resetEnterEffectTriggers();
    this._level.resetMoveTriggers();
    this._level.resetVisibility();
    if (this._orbGfx) { this._orbGfx.clear(); }
    this._colorManager.reset();
    this._player.noclipStats.totalFrames = 0;
    this._player.noclipStats.deathFrames = 0;
    this._player.noclipStats.deaths = 0;

    const musicOffset = this._getStartPosMusicOffset();
    const startPositions = this._level.getStartPositions();

    if (this._startPosIndex !== -1 && startPositions[this._startPosIndex]) {
      const pos = startPositions[this._startPosIndex];

      this._playerWorldX = pos.x;
      this._state.y = pos.y;
      if (pos.gameMode == 1) {
        this._player.enterShipMode();
      } else if (pos.gameMode == 2) {
        this._state.y = 30;
        this._player.enterBallMode({ y: 30 });
      } else if (pos.gameMode == 3) {
        this._player.enterUfoMode();
      } else if (pos.gameMode == 4) {
        this._player.enterWaveMode();
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
      this._level.fastForwardTriggers(pos.x, this._colorManager);
    }

    this._audio.reset();
    this._audio.startMusic(musicOffset);
    this._paused = false;
    if (this._pauseContainer) {
      this._pauseContainer.destroy();
      this._pauseContainer = null;
    }
    this._pauseBtn.setVisible(true).setAlpha(75 / 255);
    if (this._practiceModeBarContainer) {
      this._practiceModeBarContainer.setVisible(this._practicedMode && this._practicedMode.practiceMode);
    }
    this._attemptsLabel.setText("Attempt " + this._attempts);
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
    } else if (gamemode == 6) {
      this._player.enterSpiderMode();
    }

    if (this._player && this._player._hitboxTrail) {
      this._player._hitboxTrail = [];
    }
  }
  _getStartPosMusicOffset(){
    const startPositions = this._level.getStartPositions();
    let musicOffset = 0;
    if (this._startPosIndex !== -1 && startPositions[this._startPosIndex]) {
      musicOffset = startPositions[this._startPosIndex].x / 623.16; 
    }
    return musicOffset;
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
    this._state.isDashing = checkpoint.isDashing;
    this._state.dashYVelocity = checkpoint.dashYVelocity;
    this._player.reset();
    this._state.isFlying = false;
    this._state.isBall = false;
    this._state.isWave = false;
    this._state.isUfo = false;
    this._state.isSpider = false;
    this._state.isBird = false;
    if (checkpoint.isFlying) {
      this._player.enterShipMode();
    } else if (checkpoint.isBall) {
      this._player.enterBallMode();
    } else if (checkpoint.isUfo) {
      this._player.enterUfoMode();
    } else if (checkpoint.isWave) {
      this._player.enterWaveMode();
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
    this._state.isBird = checkpoint.isBird;
    this._level.resetGroundTiles(this._cameraX);
    this._level.resetObjects();
    this._level._flyCeilingY = checkpoint.flyCeilingY;
    this._level._flyGroundActive = checkpoint.flyGroundActive;
    this._level._flyVisualOnly = checkpoint.flyVisualOnly;
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
      playerSpeed = SpeedPortal.ONE_TIMES;
    }
    this._level.resetColorTriggers();
    this._level.resetAlphaTriggers();
    this._level.resetRotateTriggers();
    this._level.resetPulseTriggers();
    this._level.resetEnterEffectTriggers();
    this._level.resetMoveTriggers();
    this._level.resetVisibility();
    this._level.additiveContainer.x = -this._cameraX;
    this._level.additiveContainer.y = this._cameraY;
    this._level.container.x = -this._cameraX;
    this._level.container.y = this._cameraY;
    this._level.topContainer.x = -this._cameraX;
    this._level.topContainer.y = this._cameraY;
    this._level.updateVisibility(this._cameraX);
    this._updateBackground();
    this._applyMirrorEffect();
    if (!this._audio.musicPlaying) {
      this._audio.startMusic();
    }

    if (this._player && this._player._hitboxTrail) {
      this._player._hitboxTrail = [];
    }
  }
  _onFullscreenChange(_0x310c5b) {
    if (!_0x310c5b) {
      l(1138);
    }
    this.time.delayedCall(200, () => this._applyScreenResize());
  }
  _applyScreenResize() {
    if (this.scale.isFullscreen) {
      const _0x5bc34b = window.innerWidth / window.innerHeight;
      l(Math.round(screenHeight * _0x5bc34b));
    }
    this.scale.setGameSize(screenWidth, screenHeight);
    this.scale.refresh();
    this._bg.setSize(screenWidth, screenHeight);
    this._pauseBtn.x = screenWidth - 30;
    if (this._menuActive) {
      this._positionMenuItems();
    }
    if (this._paused && this._pauseContainer) {
      this._pauseContainer.destroy();
      this._pauseContainer = null;
      this._buildPauseOverlay();
    }
    this._level.resizeScreen();
    if (!this._menuActive) {
      const _0x56287b = this._cameraX;
      this._cameraX = this._playerWorldX - centerX;
      this._cameraXRef._v = this._cameraX;
      this._level.additiveContainer.x = -this._cameraX;
      this._level.additiveContainer.y = this._cameraY;
      this._level.container.x = -this._cameraX;
      this._level.container.y = this._cameraY;
      this._level.topContainer.x = -this._cameraX;
      this._level.topContainer.y = this._cameraY;
      this._level.shiftGroundTiles(this._cameraX - _0x56287b);
      this._level.updateGroundTiles(this._cameraY);
      this._level.updateVisibility(this._cameraX);
      this._level.applyEnterEffects(this._cameraX);
      const _0xde8a1a = this._playerWorldX - this._cameraX;
      this._player.syncSprites(this._cameraX, this._cameraY, 0, this._getMirrorXOffset(_0xde8a1a));
      this._applyMirrorEffect();
    }
  }
  _updateBackground() {
    this._bg.tilePositionX += (this._cameraX - this._prevCameraX) * this._bgSpeedX;
    this._prevCameraX = this._cameraX;
    this._bg.tilePositionY = this._bgInitY - this._cameraY * this._bgSpeedY;
  }
  _updateCameraY(_0xc7c517) {
    let explosionPiece = this._cameraY;
    let _0x1a27be = explosionPiece;
    if (this._level.flyCameraTarget !== null) {
      _0x1a27be = this._level.flyCameraTarget;
    } else {
      let _0x2bc8fb = this._state.y;
      let _0x259956 = 140;
      let _0x5025ec = 80;
      let _0x1f7976 = explosionPiece - o + 320;
      if (this._state.gravityFlipped) {
        if (_0x2bc8fb > _0x1f7976 + _0x5025ec) {
          _0x1a27be = _0x2bc8fb - 320 - _0x5025ec + o;
        } else if (_0x2bc8fb < _0x1f7976 - _0x259956) {
          _0x1a27be = _0x2bc8fb - 320 + _0x259956 + o;
        }
      } else {
        if (_0x2bc8fb > _0x1f7976 + _0x259956) {
          _0x1a27be = _0x2bc8fb - 320 - _0x259956 + o;
        } else if (_0x2bc8fb < _0x1f7976 - _0x5025ec) {
          _0x1a27be = _0x2bc8fb - 320 + _0x5025ec + o;
        }
      }
    }
    if (_0x1a27be < 0) {
      _0x1a27be = 0;
    }
    if (_0xc7c517 !== 0) {
      explosionPiece += (_0x1a27be - explosionPiece) / (10 / _0xc7c517);
      if (explosionPiece < 0) {
        explosionPiece = 0;
      }
      this._cameraY = explosionPiece;
    }
  }
  _quantizeDelta(_0x654f39) {
    let _0x578d1b = _0x654f39 / 1000 + this._deltaBuffer;
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

    let rawPercent = (this._playerWorldX / this._level.endXPos) * 100;
    rawPercent = Math.min(100, Math.max(0, rawPercent));
    let displayValue;
    if (this._levelWon) {
      const p = this._interpolatedPercent || 0;
      if (window.percentageDecimals) {
        displayValue = p.toFixed(2) + "%";
      } else {
        displayValue = Math.floor(p) + "%";
      }
    } else if (window.percentageDecimals) {
        displayValue = rawPercent.toFixed(2) + "%";
    } else {
        displayValue = Math.floor(rawPercent) + "%";
    }
    this._percentageLabel.setText(displayValue);
    this._percentageLabel.setVisible(window.showPercentage && !this._menuActive);
    this._startPosGui.setVisible(window.startPosSwitcher && !this._menuActive);
    this._noclipIndicator.setVisible(window.noClip && !this._menuActive);
    this._accuracyIndicator.setVisible(window.noClip && window.noClipAccuracy && !this._menuActive);
    this._deathsIndicator.setVisible(window.noClip && window.noClipAccuracy && !this._menuActive);
    this._accuracyIndicator.setText(`${this._player.noclipStats.accuracy.toFixed(2)}%`);
    this._deathsIndicator.setText(`${this._player.noclipStats.deaths} Deaths`);

    this._fpsAccum += deltaTime;
    this._fpsFrames++;
    if (this._fpsAccum >= 250) {
      this._fpsText.setText(Math.round(this._fpsFrames * 1000 / this._fpsAccum));
      this._fpsAccum = 0;
      this._fpsFrames = 0;
    }
    if (this._paused) {
      if (!this._updateLogPopup && (this._spaceKey.isDown || this._upKey.isDown || this._wKey.isDown) && !this._spaceWasDown && !this._settingsPopup) {
        setTimeout(() => {
          this._resumeGame();
        }, 75);
      }
      this._deltaBuffer = 0;
      return;
    }
    if (this._menuActive) {
      if (!this._updateLogPopup && (this._spaceKey.isDown || this._upKey.isDown || this._wKey.isDown) && !this._spaceWasDown) {
        this._spaceWasDown = true;
        if (this._levelSelectOverlay) {
          this._audio.playEffect("playSound_01", { volume: 1 });
          this._closeLevelSelect(true);
          this._audio.stopMusic();
          this.game.registry.set("autoStartGame", true);
          this.scene.restart();
          return;
        }
        this._openLevelSelect();
        return;
      }
      const _arrowLeft = this._leftKey.isDown || this._aKey.isDown;
      const _arrowRight = this._rightKey.isDown || this._dKey.isDown;
      if (!this._updateLogPopup && (_arrowLeft || _arrowRight) && !this._arrowWasDown) {
        if (this._levelSelectOverlay) {
          if (_arrowLeft) window.leftbuttoncallback();
          else window.rightbuttoncallback();
        }
      }
      this._arrowWasDown = _arrowLeft || _arrowRight;
      this._spaceWasDown = this._spaceKey.isDown || this._upKey.isDown || this._wKey.isDown;
      const menuDelta = Math.min(deltaTime / 1000 * 60, 2);
      const menuSpeed = 0.25;
      this._menuCameraX = (this._menuCameraX || 0) + menuDelta * playerSpeed * d * menuSpeed;
      const _0x38afac = this._cameraX;
      this._cameraX = this._menuCameraX;
      this._updateBackground();
      this._cameraX = _0x38afac;
      this._prevCameraX = this._menuCameraX;
      this._cameraXRef._v = this._menuCameraX;
      this._level.stepGroundAnimation(deltaTime / 1000);
      this._level.updateGroundTiles(this._cameraY);
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
      this._level.additiveContainer.x = -this._cameraX;
      this._level.additiveContainer.y = this._cameraY;
      this._level.container.x = -this._cameraX;
      this._level.container.y = this._cameraY;
      this._level.topContainer.x = -this._cameraX;
      this._level.topContainer.y = this._cameraY;
      this._level.updateVisibility(this._cameraX);
      this._updateBackground();
      this._level.stepGroundAnimation(deltaTime / 1000);
      this._level.updateGroundTiles(this._cameraY);
      this._applyMirrorEffect();
      if (this._playerWorldX >= 0) {
        this._slideIn = false;
        this._deltaBuffer = 0;
        this._playerWorldX = 0;
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
    let _0x368ad9 = this._spaceKey.isDown || this._upKey.isDown || this._wKey.isDown;
    if (!this._updateLogPopup && _0x368ad9 && !this._spaceWasDown) {
      this._pushButton();
    } else if (!_0x368ad9 && this._spaceWasDown) {
      this._releaseButton();
    }
    this._spaceWasDown = _0x368ad9;

    const objectsUnderPointer = this.input.manager.hitTest(
      this.input.activePointer, 
      this._startPosGui.list,
      this.cameras.main
    );
    const isOverUI = objectsUnderPointer.length > 0;
    const fromClick = this.input.activePointer.isDown;
    const cancelInput = isOverUI && fromClick;

    if (!!this.input.activePointer.isDown && !this._state.upKeyDown && !this._state.isDead) {
      this._state.upKeyDown = true;
      this._state.queuedHold = true;
    }
    if (cancelInput){
      this._state.upKeyDown = false;
      this._state.upKeyPressed = false;
      this._state.queuedHold = false;
    }
    this._level.updateEndPortalY(this._cameraY, this._state.isFlying || this._state.isWave || this._state.isUfo);
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
      this._level.additiveContainer.x = -this._cameraX;
      this._level.additiveContainer.y = this._cameraY;
      this._level.container.x = -this._cameraX;
      this._level.container.y = this._cameraY;
      this._level.topContainer.x = -this._cameraX;
      this._level.topContainer.y = this._cameraY;
      this._updateBackground();
      this._level.stepGroundAnimation(deltaTime / 1000);
      this._level.updateGroundTiles(this._cameraY);
      this._applyMirrorEffect();
      return;
    }
    if (this._state.isDead) {
      if (!this._deathSoundPlayed) {
        if (!this._practicedMode.practiceMode) {
          this._audio.stopMusic();
        }
        this._audio.playEffect("explode_11", {
          volume: 0.65
        });
        this._deathSoundPlayed = true;
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
      this._player.updateExplosionPieces(deltaTime);
      this._deathTimer += deltaTime;
      let _0x237728 = this._hadNewBest ? 1400 : 1000;
      if (this._deathTimer > _0x237728) {
        if (this._practicedMode.practiceMode) {
          this._respawnFromCheckpoint();
        } else {
          this._restartLevel();
        }
      }
      return;
    }
    this._playTime += deltaTime / 1000;
    this._audio.update(deltaTime / 1000);
    
    window._animTimer += deltaTime;
    for (let _as of window._animatedSprites) {
      if (window._animTimer - (_as._lastAnimSwap || 0) >= _as._animInterval) {
        _as._lastAnimSwap = window._animTimer;
        _as._animIdx = (_as._animIdx + 1) % _as._animFrames.length;
        let _fr = R(_as._animScene, _as._animFrames[_as._animIdx]);
        if (_fr) {
          try {
            _as.setTexture(_fr.atlas, _fr.frame);
          } catch(e){}
        }
      }
    }
    if (this._level && this._level._sawSprites) {
      const sawRotation = deltaTime * 0.003;
      for (let _saw of this._level._sawSprites) {
        if (_saw && _saw.active) _saw.rotation += sawRotation;
      }
    }
    this._level.updateAudioScale(this._audio.getMeteringValue());
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
        for (let _oSpr of this._level._orbSprites) {
          if (_drawn >= 4) break;
          if (!_oSpr || !_oSpr.visible || !_oSpr.active || !_oSpr.scene) continue;
          const _sx = _oSpr.x + this._level.container.x;
          const _sy = _oSpr.y + this._level.container.y;
          if (_sx < -40 || _sx > screenWidth + 40 || _sy < -40 || _sy > screenHeight + 40) continue;
          _drawn++;
          const _orbTint = _oSpr.tintTopLeft !== undefined && _oSpr.tintTopLeft !== 16777215 ? _oSpr.tintTopLeft : window.mainColor;
          for (let _pi = 0; _pi < 5; _pi++) {
            const _orbitSpeed = 0.7 + (_pi % 3) * 0.35;
            const _orbitR = 34 + (_pi * 5 % 17);
            const _ang = this._orbParticleAngle * _orbitSpeed + (_pi * Math.PI * 2 / 5);
            const _px = _sx + Math.cos(_ang) * _orbitR;
            const _py = _sy + Math.sin(_ang) * (_orbitR * 0.85);
            const _size = (window.orbParticleSize || 3.5) + (_pi % 3) * 1.0;
            const _alpha = 0.5 + (_pi % 4) * 0.12;
            this._orbGfx.fillStyle(_orbTint, _alpha);
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
    for (let i = 0; i < subSteps; i++) {
      this._state.lastY = this._state.y;
      this._player.updateJump(verticalDelta);
      this._state.y += this._state.yVelocity * verticalDelta;
      this._player.checkCollisions(this._playerWorldX - centerX);
      this._playerWorldX += horizontalDelta;
      if (this._isDual && !this._state2.isDead) {
        this._state2.upKeyDown = this._state.upKeyDown;
        this._state2.upKeyPressed = this._state.upKeyPressed;
        this._state2.queuedHold = this._state.queuedHold;
        this._state2.lastY = this._state2.y;
        this._player2.updateJump(verticalDelta);
        this._state2.y += this._state2.yVelocity * verticalDelta;
        this._player2.checkCollisions(this._playerWorldX - centerX - horizontalDelta);
        if (this._state2.isDead && !this._state.isDead) {
          this._player.killPlayer();
        }
      }
if (!this._state.isFlying && !this._state.isWave && !this._state.isUfo) {
  if (this._state.isBall) {
    const ballOnSurface = this._state.onGround || this._state.onCeiling;
    this._player.updateBallRoll(horizontalDelta, ballOnSurface);
  } else if (this._state.onGround) {
    this._player.updateGroundRotation(verticalDelta);
  } else if (this._player.rotateActionActive) {
    this._player.updateRotateAction(u);
  } else if (this._state.isDashing) {
    this._player.updateDashRotation(u);
  }
}
    }
    this._state.lastY = initialY;
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
    this._level.additiveContainer.x = -this._cameraX;
    this._level.additiveContainer.y = this._cameraY;
    this._level.container.x = -this._cameraX;
    this._level.container.y = this._cameraY;
    this._level.topContainer.x = -this._cameraX;
    this._level.topContainer.y = this._cameraY;
    let playerX = this._playerWorldX;
    for (let colorTrigger of this._level.checkColorTriggers(playerX)) {
      this._colorManager.triggerColor(colorTrigger.index, colorTrigger.color, colorTrigger.duration);
      if (colorTrigger.tintGround) {
        this._colorManager.triggerColor(gs, colorTrigger.color, colorTrigger.duration);
      }
    }
    this._level.checkMoveTriggers(playerX);
    this._level.stepMoveTriggers(deltaTime / 1000);
    this._level.checkAlphaTriggers(playerX);
    this._level.stepAlphaTriggers(deltaTime / 1000);
    this._level.checkRotateTriggers(playerX);
    this._level.stepRotateTriggers(deltaTime / 1000);
    this._level.checkPulseTriggers(playerX);
    this._level.stepPulseTriggers(deltaTime / 1000, this._colorManager);
    this._colorManager.step(deltaTime / 1000);
    this._level.applyColorChannels(this._colorManager);
    this._bg.setTint(this._colorManager.getHex(fs));
    this._level.setGroundColor(this._colorManager.getHex(gs));
    this._level.updateVisibility(this._cameraX);
    this._level.checkEnterEffectTriggers(playerX);
    this._level.applyEnterEffects(this._cameraX);
    this._glitterCenterX = this._cameraX + screenWidth / 2;
    this._glitterCenterY = T - this._cameraY;
    this._updateBackground();
    this._level.stepGroundAnimation(deltaTime / 1000);
    this._level.updateGroundTiles(this._cameraY);
    if (this._state.isFlying) {
      this._player.updateShipRotation(quantizedDelta);
    }
    const playerScreenX = this._playerWorldX - this._cameraX;
    this._player.syncSprites(this._cameraX, this._cameraY, deltaTime / 1000, this._getMirrorXOffset(playerScreenX));
    if (this._isDual && !this._state2.isDead) {
      this._player2.syncSprites(this._cameraX, this._cameraY, deltaTime / 1000, this._getMirrorXOffset(playerScreenX));
    }
    this._applyMirrorEffect();
  }
_applyMirrorEffect() {
    const isMirrored = this._state.mirrored;
    const containers = [this._level.additiveContainer, this._level.container, this._level.topContainer];
    if (isMirrored) {
      for (const c of containers) {
        c.scaleX = -1;
        c.x = this._cameraX + screenWidth;
      }
      for (const tile of this._level._groundTiles) {
        tile.x = screenWidth - tile.x - this._level._tileW;
        tile.setFlipX(true);
      }
      for (const tile of this._level._ceilingTiles) {
        tile.x = screenWidth - tile.x - this._level._tileW;
        tile.setFlipX(true);
      }
    } else {
      for (const c of containers) {
        if (c.scaleX !== 1) c.scaleX = 1;
      }
      for (const tile of this._level._groundTiles) {
        tile.setFlipX(false);
      }
      for (const tile of this._level._ceilingTiles) {
        tile.setFlipX(false);
      }
    }
    this._bg.setFlipX(isMirrored);
  }
  _getMirrorXOffset(xOffset) {
    return this._state.mirrored ? screenWidth - xOffset : xOffset;
  }
  _enableDualMode() {
    if (this._isDual) return;
    this._isDual = true;
    this._state2.reset();
    this._state2.y = this._state.y;
    this._state2.yVelocity = 0;
    this._state2.onGround = false;
    this._state2.gravityFlipped = !this._state.gravityFlipped;
    this._state2.isMini = this._state.isMini;
    this._state2.mirrored = this._state.mirrored;
    this._state2.isDead = false;
    this._player2.reset();
    if (this._state.isFlying) {
      this._player2.enterShipMode();
    } else if (this._state.isBall) {
      this._player2.enterBallMode();
    } else if (this._state.isWave) {
      this._player2.enterWaveMode();
    } else if (this._state.isUfo) {
      this._player2.enterUfoMode();
    } else if (this._state.isSpider) {
      this._player2.enterSpiderMode();
    } else {
      this._player2.setCubeVisible(true);
    }
    this._state2.gravityFlipped = !this._state.gravityFlipped;
  }
  _disableDualMode() {
    if (!this._isDual) return;
    this._isDual = false;
    this._state2.isDead = true;
    this._player2.setCubeVisible(false);
    this._player2.setShipVisible(false);
    this._player2.setBallVisible(false);
    this._player2.setWaveVisible(false);
  }
  _showNewBest() {
    let _0x9f2437 = screenWidth / 2;
    let _0x12bde3 = this.add.image(0, 0, "GJ_WebSheet", "GJ_newBest_001.png").setOrigin(0.5, 1);
    let _0x544c9c = this.add.bitmapText(0, 2, "bigFont", this._lastPercent + "%", 65).setOrigin(0.5, 0).setScale(1.1);
    let _0x326cb9 = this.add.container(_0x9f2437, 300, [_0x12bde3, _0x544c9c]).setScrollFactor(0).setDepth(60).setScale(0.01);
    this.tweens.add({
      targets: _0x326cb9,
      scale: 1,
      duration: 400,
      ease: "Elastic.Out",
      easeParams: [1, 0.6],
      onComplete: () => {
        this.tweens.add({
          targets: _0x326cb9,
          scale: 0.01,
          duration: 200,
          delay: 700,
          ease: "Quad.In",
          onComplete: () => {
            _0x326cb9.setVisible(false);
            _0x326cb9.destroy();
          }
        });
      }
    });
  }

    _triggerEndPortal() {
    this._player.playEndAnimation(this._level.endXPos, () => this._levelComplete(), this._endPortalGameY);
  }
  _levelComplete() {
    if (!this._practicedMode.practiceMode) {
      this._bestPercent = 100;
      localStorage.setItem("bestPercent_" + (window.currentlevel[2] || "level_1"), 100);
    } else {
      this._practiceBestPercent = 100;
      localStorage.setItem("practiceBestPercent_" + (window.currentlevel[2] || "level_1"), 100);
      if (this._updatePracticeHUDBar) this._updatePracticeHUDBar();
    }

    const _0x356782 = this._level.endXPos - this._cameraX;
    const _0x2d967b = b(this._endPortalGameY) + this._cameraY;
    for (let _0x481f7c = 0; _0x481f7c < 5; _0x481f7c++) {
      this.time.delayedCall(_0x481f7c * 50, () => _s(this, _0x356782, _0x2d967b, 10, screenWidth, 500, false, true, window.mainColor));
    }
    _s(this, _0x356782, _0x2d967b, 10, 1000, 500, true, false, window.mainColor);
    this._showCompleteEffect();
  }
  _showCompleteEffect() {
    this._audio.fadeOutMusic(1500);
    this.sound.play("endStart_02", {
      volume: 0.8
    });
    (function (_0x3f5321, _0x8f5267, _0x2f1e2d, _0x4b5e5b) {
      const _0x29d856 = 2;
      const _0x1b2543 = 8;
      const _0x2cc21f = _0x29d856 * 1;
      const _0x26b2b1 = _0x29d856 * 30;
      const _0x6f49c1 = _0x29d856 * 20;
      const _0x232789 = Math.round(Math.sqrt(screenWidth ** 2 + 102400)) + _0x29d856 * 32.5;
      const _0x1c105b = 180;
      const _0x586720 = 40;
      const _0x57b9ff = 195;
      const _0x2b6612 = 40;
      const _0x5ce50e = 40;
      const _0x4da54f = 155 / 255;
      const _0x20decf = 100 / 255;
      const _0x576e6f = 400;
      const _0x487fb1 = -135;
      const _0x323ded = 90 / _0x1b2543;
      const _0x44369e = Array.from({
        length: _0x1b2543
      }, (_0x18e51d, _0x59ebd4) => _0x487fb1 + _0x59ebd4 * _0x323ded);
      for (let _0x59890f = _0x44369e.length - 1; _0x59890f > 0; _0x59890f--) {
        const _0x2bf73b = Math.floor(Math.random() * (_0x59890f + 1));
        [_0x44369e[_0x59890f], _0x44369e[_0x2bf73b]] = [_0x44369e[_0x2bf73b], _0x44369e[_0x59890f]];
      }
      let _0x594d69 = 0;
      const _0x116c8c = [];
      for (let _0x104cbb = 0; _0x104cbb < _0x1b2543; _0x104cbb++) {
        const _0x1a79fc = _0x104cbb * _0x57b9ff + _0x2b6612 + _0x5ce50e * (Math.random() * 2 - 1);
        const _0x6eb03a = _0x26b2b1 + _0x6f49c1 * (Math.random() * 2 - 1);
        const _0x2e9531 = _0x1c105b + _0x586720 * (Math.random() * 2 - 1);
        const _0x28e7b3 = Math.min(1, Math.max(0, _0x4da54f + _0x20decf * (Math.random() * 2 - 1)));
        const _0x34147c = _0x44369e[_0x104cbb] + _0x323ded * Math.random() + 180;
        const containerY = _0x3f5321.add.graphics().setScrollFactor(0).setDepth(-1).setBlendMode(S).setPosition(_0x8f5267, _0x2f1e2d).setAngle(_0x34147c).setAlpha(_0x28e7b3).setVisible(false);
        const _0x496d96 = {
          h: 1,
          w: _0x2cc21f
        };
        _0x3f5321.time.delayedCall(Math.max(0, _0x1a79fc), () => {
          containerY.setVisible(true);
          _0x3f5321.tweens.add({
            targets: _0x496d96,
            h: _0x232789,
            w: _0x6eb03a,
            duration: _0x2e9531,
            ease: "Quad.Out",
            onUpdate: () => {
              const _0x2db3d7 = _0x2cc21f + (_0x496d96.w - _0x2cc21f) / 4;
              containerY.clear();
              containerY.fillStyle(_0x4b5e5b, 1);
              containerY.beginPath();
              containerY.moveTo(-_0x2db3d7 / 2, 0);
              containerY.lineTo(_0x2db3d7 / 2, 0);
              containerY.lineTo(_0x496d96.w / 2, _0x496d96.h);
              containerY.lineTo(-_0x496d96.w / 2, _0x496d96.h);
              containerY.closePath();
              containerY.fillPath();
            }
          });
        });
        if (_0x1a79fc > _0x594d69) {
          _0x594d69 = _0x1a79fc;
        }
        _0x116c8c.push(containerY);
      }
      _0x3f5321.time.delayedCall(_0x594d69 + _0x576e6f, () => {
        for (const _0x15b95e of _0x116c8c) {
          const _0x51b5fc = Math.random() * 200;
          const _0x3ed1de = 400 + (Math.random() * 2 - 1) * 100;
          _0x3f5321.tweens.add({
            targets: _0x15b95e,
            alpha: 0,
            delay: _0x51b5fc,
            duration: _0x3ed1de,
            onComplete: () => _0x15b95e.destroy()
          });
        }
      });
    })(this, this._level.endXPos - this._cameraX + 60, b(this._endPortalGameY) + this._cameraY, window.mainColor);
    this.cameras.main.shake(1950, 0.004);
    this.time.delayedCall(1950, () => this._showCompleteText());
  }
  _showCompleteText() {
    const _0x56628c = screenWidth / 2;
    const _0x45ab26 = this.add.image(_0x56628c, 250, "GJ_WebSheet", "GJ_levelComplete_001.png").setScrollFactor(0).setDepth(60).setScale(0.01);
    this.tweens.add({
      targets: _0x45ab26,
      scale: 1.1,
      duration: 660,
      ease: "Elastic.Out",
      easeParams: [1, 0.6],
      onComplete: () => {
        this.tweens.add({
          targets: _0x45ab26,
          scale: 0.01,
          duration: 220,
          delay: 880,
          ease: "Quad.In",
          onComplete: () => {
            _0x45ab26.setVisible(false);
            _0x45ab26.destroy();
          }
        });
      }
    });
    const _0x2884ff = [window.mainColor, 16777215];
    for (let _0x5f16c8 = 0; _0x5f16c8 < 2; _0x5f16c8++) {
      this.add.particles(_0x56628c, 250, "GJ_WebSheet", {
        frame: "square.png",
        speed: {
          min: 300,
          max: 700
        },
        angle: {
          min: 0,
          max: 360
        },
        scale: {
          start: 0.4,
          end: 0.13
        },
        lifespan: {
          min: 0,
          max: 1000
        },
        quantity: 50,
        stopAfter: 200,
        blendMode: S,
        tint: _0x2884ff[_0x5f16c8],
        x: {
          min: -800,
          max: 800
        },
        y: {
          min: -80,
          max: 80
        }
      }).setScrollFactor(0).setDepth(59);
    }
    const _0x2eadf2 = this._level.endXPos - this._cameraX;
    const _0x380b24 = b(this._endPortalGameY) + this._cameraY;
    _s(this, _0x2eadf2, _0x380b24, 10, screenWidth, 800, true, false, window.mainColor);
    _s(this, _0x56628c, 250, 10, 1000, 800, true, false, window.mainColor);
    for (let _0x579e05 = 0; _0x579e05 < 5; _0x579e05++) {
      this.time.delayedCall(_0x579e05 * 50, () => _s(this, _0x2eadf2, _0x380b24, 10, screenWidth, 500, false, true, window.mainColor));
    }
    for (let _0x429722 = 0; _0x429722 < 10; _0x429722++) {
      const _0xbf7dd0 = _0x429722 * 150 + (Math.random() * 160 - 80);
      this.time.delayedCall(Math.max(0, _0xbf7dd0), () => ws(this, window.mainColor, window.secondaryColor));
    }
    this.time.delayedCall(1500, () => this._showEndLayer());
  }
  _showEndLayer() {
    if (this._pauseBtn) {
      this.tweens.add({
        targets: this._pauseBtn,
        alpha: 0,
        duration: 300
      });
    }
    const containerX = screenWidth / 2;
    const _0x1aa656 = 320;
    this._endLayerOverlay = this.add.rectangle(containerX, _0x1aa656, screenWidth, screenHeight, 0, 0).setScrollFactor(0).setDepth(200).setInteractive();
    this._endLayerInternal = this.add.container(0, -640).setScrollFactor(0).setDepth(201);
    this.tweens.add({
      targets: this._endLayerOverlay,
      alpha: 100 / 255,
      duration: 1000
    });
    const _0x59b9ab = {
      p: 0
    };
    this.tweens.add({
      targets: _0x59b9ab,
      p: 1,
      duration: 1000,
      ease: "Bounce.Out",
      onUpdate: () => {
        this._endLayerInternal.y = _0x59b9ab.p * 650 - 640;
      },
      onComplete: () => this._playStarAward()
    });
    const _0x595215 = 712;
    const _0x950c8d = 460;
    const _0x2a115c = (screenWidth - _0x595215) / 2;
    this._endLayerInternal.add(this.add.rectangle(_0x2a115c + 356, 310, _0x595215, _0x950c8d, 0, 180 / 255));
    const _0x43f2e3 = this.textures.getFrame("GJ_WebSheet", "GJ_table_side_001.png");
    const _0x3feccc = _0x43f2e3 ? _0x950c8d / _0x43f2e3.height : 1;
    this._endLayerInternal.add(this.add.image(_0x2a115c - 40, 80, "GJ_WebSheet", "GJ_table_side_001.png").setOrigin(0, 0).setScale(1, _0x3feccc));
    this._endLayerInternal.add(this.add.image(_0x2a115c + _0x595215 + 40, 80, "GJ_WebSheet", "GJ_table_side_001.png").setOrigin(1, 0).setFlipX(true).setScale(1, _0x3feccc));
    const _0x33b564 = this.add.image(_0x2a115c + 356, 70, "GJ_WebSheet", "GJ_table_top_001.png");
    this._endLayerInternal.add(_0x33b564);
    this._endLayerInternal.add(this.add.image(_0x2a115c + 356, 560, "GJ_WebSheet", "GJ_table_bottom_001.png"));
    const _0x3e9c79 = _0x33b564.y - 65;
    this._endLayerInternal.add(this.add.image(containerX - 312, _0x3e9c79, "GJ_WebSheet", "chain_01_001.png").setOrigin(0.5, 1));
    this._endLayerInternal.add(this.add.image(containerX + 312, _0x3e9c79, "GJ_WebSheet", "chain_01_001.png").setOrigin(0.5, 1));
    this._endLayerInternal.add(this.add.image(containerX, 170, "GJ_WebSheet", "GJ_levelComplete_001.png").setScale(0.8));
    const _0x45b6e4 = 0.8;
    let _0xe44f6d = 250;
    const _0x2de55e = this.add.bitmapText(containerX, _0xe44f6d, "goldFont", "Attempts: " + this._attempts, 40).setOrigin(0.5, 0.5).setScale(_0x45b6e4);
    this._endLayerInternal.add(_0x2de55e);
    _0xe44f6d += 48;
    this._endLayerInternal.add(this.add.bitmapText(containerX, _0xe44f6d, "goldFont", "Jumps: " + this._totalJumps, 40).setOrigin(0.5, 0.5).setScale(_0x45b6e4));
    _0xe44f6d += 48;
    const _0x596450 = Math.floor(this._playTime);
    const _0x30687e = Math.floor(_0x596450 / 3600);
    const _0x52f8ee = Math.floor(_0x596450 % 3600 / 60);
    const _0x2591d0 = _0x596450 % 60;
    let _0x2be782;
    _0x2be782 = _0x30687e > 0 ? String(_0x30687e).padStart(2, "0") + ":" + String(_0x52f8ee).padStart(2, "0") + ":" + String(_0x2591d0).padStart(2, "0") : String(_0x52f8ee).padStart(2, "0") + ":" + String(_0x2591d0).padStart(2, "0");
    const _0x241209 = _0xe44f6d;
    this._endLayerInternal.add(this.add.bitmapText(containerX, _0xe44f6d, "goldFont", "Time: " + _0x2be782, 40).setOrigin(0.5, 0.5).setScale(_0x45b6e4));
    const _0x452429 = ["Awesome!", "Good\nJob!", "Well\nDone!", "Impressive!", "Amazing!", "Incredible!", "Skillful!", "Brilliant!", "Not\nbad!", "Warp\nSpeed!", "Challenge\nBreaker!", "Reflex\nMaster!", "I am\nspeechless...", "You are...\nThe One!", "How is this\npossible!?", "You beat\nme..."];
    const _0x165c06 = _0x452429[Math.floor(Math.random() * _0x452429.length)];
    const _0x45540f = 225;
    this._endLayerInternal.add(this.add.bitmapText(containerX + _0x45540f, _0x241209, "bigFont", _0x165c06, 40).setOrigin(0.5, 0.5).setScale(0.8).setCenterAlign());
    this._endLayerInternal.add(this.add.image(containerX - _0x45540f, 352.5, "GJ_WebSheet", "getIt_001.png").setScale(1 / 1.5));
    const _0x34b1bd = [{
      key: "downloadApple_001",
      url: "https://discord.gg/TfEzAVWPSJ"
    }, {
      key: "downloadSteam_001",
      url: "https://store.steampowered.com/app/322170/Geometry_Dash"
    }];
    for (let _0x10f8cc = 0; _0x10f8cc < _0x34b1bd.length; _0x10f8cc++) {
      const _0xd7310b = _0x34b1bd[_0x10f8cc];
      const _0x1e3f82 = (_0x10f8cc - 1) * _0x45540f;
      const _0x55a82e = 1 / 1.5;
      const _0x4c7fb8 = this.add.image(containerX + _0x1e3f82, 437.5, "GJ_WebSheet", _0xd7310b.key + ".png").setScale(_0x55a82e).setInteractive();
      this._endLayerInternal.add(_0x4c7fb8);
      this._makeBouncyButton(_0x4c7fb8, _0x55a82e, () => window.open(_0xd7310b.url, "_blank"));
    }
    _0x2de55e.width;
    this._endStarX = containerX + _0x45540f;
    this._endStarY = _0x241209 - 77.5;
    const _0x45fc2b = [{
      frame: "GJ_replayBtn_001.png",
      dx: -200,
      action: () => this._hideEndLayer(() => this._restartLevel())
    }, {
      frame: "GJ_menuBtn_001.png",
      dx: 200,
      action: () => {
        this._audio.playEffect("quitSound_01");
        this._audio.stopMusic();
        this.game.registry.set("fadeInFromBlack", true);
        this.cameras.main.fadeOut(400, 0, 0, 0, (_0x53bf86, _0x15310d) => {
          if (_0x15310d >= 1) {
            this.scene.restart();
          }
        });
      }
    }];
    for (const _0x2d4335 of _0x45fc2b) {
      const _0xdde774 = this.add.image(containerX + _0x2d4335.dx, 555, "GJ_WebSheet", _0x2d4335.frame).setInteractive();
      this._endLayerInternal.add(_0xdde774);
      this._makeBouncyButton(_0xdde774, 1, _0x2d4335.action);
    }
  }
  _playStarAward() {
    if (!this._endLayerInternal) {
      return;
    }
    const _0x4edc03 = this._endStarX;
    const _0x5a0e9 = this._endStarY;
    const _0x453043 = this.add.image(_0x4edc03, _0x5a0e9, "GJ_WebSheet", "GJ_bigStar_001.png").setScale(3).setAlpha(0);
    this._endLayerInternal.add(_0x453043);
    this.tweens.add({
      targets: _0x453043,
      scale: 0.8,
      alpha: 1,
      duration: 300,
      delay: 0,
      ease: "Bounce.Out"
    });
    this.time.delayedCall(100, () => {
      this._audio.playEffect("highscoreGet02");
      const _0x1204d3 = _0x4edc03;
      const _0x96e3b2 = _0x5a0e9 + this._endLayerInternal.y;
      this.add.particles(_0x1204d3, _0x96e3b2, "GJ_WebSheet", {
        frame: "square.png",
        speed: {
          min: 200,
          max: 600
        },
        angle: {
          min: 0,
          max: 360
        },
        scale: {
          start: 0.5,
          end: 0
        },
        alpha: {
          start: 1,
          end: 0
        },
        lifespan: {
          min: 200,
          max: 600
        },
        quantity: 30,
        stopAfter: 30,
        blendMode: S,
        tint: 16776960
      }).setScrollFactor(0).setDepth(202);
      const _0x43203f = this.add.graphics().setScrollFactor(0).setDepth(202).setBlendMode(S);
      const _0x403316 = {
        t: 0
      };
      this.tweens.add({
        targets: _0x403316,
        t: 1,
        duration: 400,
        ease: "Quad.Out",
        onUpdate: () => {
          _0x43203f.clear();
          _0x43203f.fillStyle(16776960, 1 - _0x403316.t);
          _0x43203f.fillCircle(_0x1204d3, _0x96e3b2, 20 + _0x403316.t * 200);
        },
        onComplete: () => _0x43203f.destroy()
      });
    });
  }
  _hideEndLayer(_0x272eb1) {
    if (!this._endLayerInternal) {
      if (_0x272eb1) {
        _0x272eb1();
      }
      return;
    }
    const _0x1215e0 = {
      p: 0
    };
    this.tweens.add({
      targets: _0x1215e0,
      p: 1,
      duration: 500,
      ease: _0xc1c75 => _0xc1c75 < 0.5 ? Math.pow(_0xc1c75 * 2, 2) / 2 : 1 - Math.pow((1 - _0xc1c75) * 2, 2) / 2,
      onUpdate: () => {
        this._endLayerInternal.y = _0x1215e0.p * -640;
      },
      onComplete: () => {
        this._endLayerInternal.destroy();
        this._endLayerInternal = null;
        if (this._endLayerOverlay) {
          this._endLayerOverlay.destroy();
          this._endLayerOverlay = null;
        }
        if (_0x272eb1) {
          _0x272eb1();
        }
      }
    });
    this.tweens.add({
      targets: this._endLayerOverlay,
      alpha: 0,
      duration: 500
    });
  }
}
