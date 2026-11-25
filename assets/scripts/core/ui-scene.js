class UIScene extends Phaser.Scene {
  constructor(config) {
    super(config);
  }
  _createMenuUI() {
    this._logo = this.add.image(0, 100, "GJ_WebSheet", "GJ_logo_001.png").setScrollFactor(0).setDepth(30).setScale(1.2);
    this._robLogo = this.add.image(110, 595, "GJ_WebSheet", "RobTopLogoBig_001.png").setScrollFactor(0).setDepth(30).setScale(0.525).setInteractive();
    this._makeBouncyButton(this._robLogo, 0.525, () => {
      window.open("https://geometrydash.com", "_blank");
    }, () => this._menuActive);
    const _socialIconDefs = [
      {frame: "", url: "", angle: 0, row: 0, col: 0 },
      {frame: "", url: "", angle: 0, row: 0, col: 1 },
      {frame: "", url: "", angle: 0, row: 0, col: 2 },
      {frame: "", url: "", angle: 0, row: 0, col: 3 },

      { frame: "gj_twIcon_001.png", url: "https://x.com/rohanis0000gd", angle: 0, flipX: false, row: 1, col: 0 },
      { frame: "gj_ytIcon_001.png", url: "https://www.youtube.com/@rohanis0000gd", angle: 0, row: 1, col: 1 },
      { frame: "gj_tiktokIcon_001.png", url: "https://www.tiktok.com/@rohanis00000", angle: 0, flipX: false, row: 1, col: 2 },
      { frame: "gj_githubIcon_001.png", url: "https://github.com/web-dashers/web-dashers.github.io", angle: 0, row: 1, col: 3 },

      {frame: "", url: "", angle: 0, row: 2, col: 0 },
      {frame: "", url: "", angle: 0, row: 2, col: 1 },
      {frame: "", url: "", angle: 0, row: 2, col: 2 },
      { frame: "gj_discordIcon_001.png", url: "https://discord.gg/TfEzAVWPSJ", angle: 0, row: 2, col: 3 },

    ];
    const _socialScale = 0.75;
    this._socialIcons = _socialIconDefs.map((def, index) => {
    const icon = this.add.image(0, 0, "GJ_GameSheet03", def.frame)
      .setScrollFactor(0)
      .setDepth(30)
      .setScale(_socialScale)
      .setAngle(def.angle)
      .setFlipX(!!def.flipX);

    if (!def.frame || def.frame.trim() === "") {
      icon.setVisible(false);
      icon.setActive(false);
      return icon;
    }
    icon.setInteractive();
    this._makeBouncyButton(icon, _socialScale, () => {
      window.open(def.url, "_blank");
    }, () => this._menuActive);

    return icon;
  });

    this._copyrightText = this.add.text(0, 630, "© 2026 RobTop Games · geometrydash.com", {
      fontSize: "14px",
      color: "#ffffff",
      fontFamily: "Arial"
    }).setOrigin(1, 1).setScrollFactor(0).setDepth(30).setAlpha(0.3);
    this._tryMeImg = this.add.image(0, 150, "GJ_MenuBeta").setScrollFactor(0).setDepth(30).setScale(0.75);
    this._downloadBtns = [];
    const _0x4fc67f = [
    {
      key: "GJ_newsBtn_001",
      url: "https://pinkdev.d13qic2f6zga3.amplifyapp.com"
    }];
    for (let _0xfeaf5c = 0; _0xfeaf5c < _0x4fc67f.length; _0xfeaf5c++) {
      const _0x1ce2a6 = _0x4fc67f[_0xfeaf5c];
      const _0x6bf69f = 1 / 1.5;
      const _0x1d293f = this.add.image(0, 0, "GJ_GameSheet04", _0x1ce2a6.key + ".png").setScrollFactor(0).setDepth(30).setScale(1).setInteractive();
      this._makeBouncyButton(_0x1d293f, 1, () => this._buildNewsPopup(), () => this._menuActive && !this._newsPopup);
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
    this._menuInfoBtn = this.add.image(screenWidth + 20, 35, "GJ_GameSheet03", "communityCreditsBtn_001.png").setScrollFactor(0).setDepth(30).setScale(0.73).setTint(Phaser.Display.Color.GetColor(255, 255, 255)).setInteractive();
    this._expandHitArea(this._menuInfoBtn, 1.5);
    this._makeBouncyButton(this._menuInfoBtn, 0.73, () => {
      this._buildInfoPopup();
    }, () => this._menuActive && !this._infoPopup);
    this._menuSettingsBtn = this.add.image(centerX + 92, screenHeight - 90, "GJ_GameSheet03", "GJ_optionsBtn_001.png").setScrollFactor(0).setDepth(30).setInteractive();
    this._expandHitArea(this._menuSettingsBtn, 1);
    this._makeBouncyButton(this._menuSettingsBtn, 1, () => {
      this._showSettingsScreen();
    }, () => this._menuActive && !this._settingsPopup);
    this._menuStatsBtn = this.add.image(centerX + 202, screenHeight - 90, "GJ_GameSheet03", "GJ_statsBtn_001.png").setScrollFactor(0).setDepth(30).setInteractive();
    this._expandHitArea(this._menuStatsBtn, 1);
    this._makeBouncyButton(this._menuStatsBtn, 1, () => {
      this._showStatsScreen();
    }, () => this._menuActive);
    this._menuAchievementsBtn = this.add.image(centerX - 19, screenHeight - 90, "GJ_GameSheet03", "GJ_achBtn_001.png").setScrollFactor(0).setDepth(30).setInteractive();
    this._applyLockedGray(this._menuAchievementsBtn);
    this._expandHitArea(this._menuAchievementsBtn, 1);
    this._makeBouncyButton(this._menuAchievementsBtn, 1, () => {
    }, () => this._menuActive);
    this._menuNewgroundsBtn = this.add.image(centerX + 312, screenHeight - 90, "GJ_GameSheet03", "GJ_ngBtn_001.png").setScrollFactor(0).setDepth(30).setInteractive();
    this._expandHitArea(this._menuNewgroundsBtn, 1);
    this._makeBouncyButton(this._menuNewgroundsBtn, 1, () => {
      this._buildNewgroundsPopup();
    }, () => this._menuActive && !this._newgroundsPopup);
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
    this._playBtn = this.add.image(0, 0, "GJ_GameSheet04", "GJ_playBtn_001.png").setScrollFactor(0).setDepth(30).setInteractive();
    this._playBtnPressed = false;
    this._makeBouncyButton(this._playBtn, 1, () => {
      this._openLevelSelect();
    }, () => this._menuActive && !this._playBtnPressed && !this._levelSelectOverlay);

    this._creatorBtn = this.add.image(0, 0, "GJ_GameSheet04", "GJ_creatorBtn_001.png").setScrollFactor(0).setDepth(30).setInteractive().setScale(1);
    this._creatorOverlay = null;
    this._creatorOverlayObjects = null;

    this._openCreatorMenu = () => {
      if (this._creatorOverlay) return;
      this._creatorMenuOpen = true;

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

      const cornerTL = this.add.image(0, 0, "GJ_GameSheet03", "GJ_sideArt_001.png")
        .setScrollFactor(0).setDepth(100).setOrigin(0, 0).setFlipY(true)
      const cornerBL = this.add.image(0, sh, "GJ_GameSheet03", "GJ_sideArt_001.png")
        .setScrollFactor(0).setDepth(152).setOrigin(0, 1)
      const treasureroom = this.add.image(1095, 40, "GJ_GameSheet03", "GJ_lock_open_001.png")
        .setScrollFactor(0).setDepth(104).setInteractive();
      this._makeBouncyButton(treasureroom, 1, () => this._openSecretVault(), () => this._creatorMenuOpen && !this._secretVaultOverlayObjects && !this._secretVaultTransitioning);
      const vaultsecret = this.add.image(1095, 601, "GJ_GameSheet03", "secretDoorBtn_closed_001.png")
        .setScrollFactor(0).setDepth(104).setScale(1);
      this._applyLockedGray(vaultsecret);

      const backBtn = this.add.image(50, 48, "GJ_GameSheet03", "GJ_arrow_03_001.png")
        .setScrollFactor(0).setDepth(104).setFlipY(true).setFlipX(true)
        .setRotation(Math.PI).setInteractive();
      this._makeBouncyButton(backBtn, 1, () => this._closeCreatorMenu());

      this._creatorOverlayObjects = [overlay, blocker, cornerTL, cornerBL, backBtn, treasureroom, vaultsecret];

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
        const isFeaturedButton = frame === "GJ_featuredBtn_001.png";
        const isEditorButton = frame === "GJ_createBtn_001.png";
        const isSavedButton = frame === "GJ_savedBtn_001.png";
        const isDailyButton = frame === "GJ_dailyBtn_001.png";
        const isWeeklyButton = frame === "GJ_weeklyBtn_001.png";
        const isEventButton = frame === "GJ_eventBtn_001.png";
        if (isDailyButton) {
          btn.setInteractive();
          this._makeBouncyButton(btn, btnScale, () => this._buildDailyLevelPopup(), () => this._creatorMenuOpen && !this._dailyLevelPopup);
        } else if (isWeeklyButton) {
          btn.setInteractive();
          this._makeBouncyButton(btn, btnScale, () => this._buildWeeklyLevelPopup(), () => this._creatorMenuOpen && !this._weeklyLevelPopup);
        } else if (isEventButton) {
          btn.setInteractive();
          this._makeBouncyButton(btn, btnScale, () => this._buildEventLevelPopup(), () => this._creatorMenuOpen && !this._eventLevelPopup);
        } else if (isSearchButton) {
          btn.setInteractive();
          this._makeBouncyButton(btn, btnScale, () => {
            this._closeCreatorMenu(true);
            this._openSearchMenu();
          }, () => true);
        } else if (isFeaturedButton) {
          btn.setInteractive();
          this._makeBouncyButton(btn, btnScale, () => {
            this._closeCreatorMenu(true);
            this._openOnlineLevelsScene({ type: 6 });
          }, () => true);
        } else if (isEditorButton) {
          btn.setInteractive();
          this._makeBouncyButton(btn, btnScale, () => {
            this._closeCreatorMenu(true);
            this._openEditorMenu();
          }, () => true);
        } else if (isSavedButton) {
          btn.setInteractive();
          this._makeBouncyButton(btn, btnScale, () => {
            this._closeCreatorMenu(true);
            this._openSavedLevelsScene();
          }, () => true);
        } else {
          btn.postFX.addColorMatrix().grayscale(1);
          btn.setTint(0xafafaf);
        }
        this._creatorOverlayObjects.push(btn);
      });
    };
    this._searchOverlay = null;
    this._searchOverlayObjects = [];
    this._playOverlay = null;
    this._playOverlayObjects = [];
    this._saveOnlineLevelToSavedList = (lvl) => {
      if (!lvl || !lvl.id) return;
      try {
        const _savedKey = "gd_saved_online_levels";
        let _savedLevels = JSON.parse(localStorage.getItem(_savedKey) || "[]");
        const numericId = String(lvl.id);
        const _globalMatches = window._onlineLevelId === "online_" + numericId.replace(/^online_/, "");
        const _alreadySaved = _savedLevels.some(sl => String(sl.id) === numericId);
        if (!_alreadySaved) {
          _savedLevels.unshift({
            id: numericId,
            name: lvl.name || "Online Level",
            author: lvl.author || "Unknown",
            customSongID: lvl.customSongID || null,
            officialSong: lvl.officialSong || 0,
            songName: lvl.songName || "Unknown",
            difficulty: lvl.difficulty || 0,
            downloads: lvl.downloads || 0,
            likes: lvl.likes || 0,
            stars: lvl.stars || 0,
            coins: lvl.coins || 0,
            coinsVerified: lvl.coinsVerified || false,
            length: lvl.length || 0,
            featured: !!lvl.featured,
            epic: lvl.epic || 0,
            savedAt: Date.now(),
            levelString: (_globalMatches && window._onlineLevelString) || null,
            songOffset: (_globalMatches && window._onlineSongOffset) || 0
          });
          localStorage.setItem(_savedKey, JSON.stringify(_savedLevels));
        }
      } catch (_e) {}
    };
    this._openPlayMenu = (onBack = null) => {
      if (this._playOverlay) return;
      const sw = screenWidth;
      const sh = screenHeight;
      this._playMenuBackTarget = onBack || (() => this._openCreatorMenu());

      const fadeIn = this.add.graphics().setScrollFactor(0).setDepth(600);
      fadeIn.fillStyle(0x000000, 1);
      fadeIn.fillRect(0, 0, sw, sh);
      this.tweens.add({ targets: fadeIn, alpha: 0, duration: 300, ease: "Linear", onComplete: () => fadeIn.destroy() });

      const overlay = this.add.graphics().setScrollFactor(0).setDepth(500);
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
      this._playOverlay = overlay;

      const cornerBL = this.add.image(0, sh, "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setDepth(502).setOrigin(0, 1).setFlipY(false);
      const cornerBR = this.add.image(sw, sh, "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setDepth(502).setOrigin(1, 1).setFlipX(true);

      const blocker = this.add.zone(sw / 2, sh / 2, sw, sh).setScrollFactor(0).setDepth(501).setInteractive();
      const backBtn = this.add.image(50, 48, "GJ_GameSheet03", "GJ_arrow_01_001.png")
        .setScrollFactor(0).setDepth(504).setFlipX(true).setFlipY(true)
        .setRotation(Math.PI).setInteractive();
      this._makeBouncyButton(backBtn, 1, () => { this._closePlayMenu(false, () => this._playMenuBackTarget()); });

      this._playOverlayObjects.push(overlay, blocker, backBtn, cornerBL, cornerBR);
      const lvl = window._selectedLevelData || {};
      if (lvl.id) localStorage.setItem("viewedLevel_" + lvl.id, "1");
      this._saveOnlineLevelToSavedList(lvl);
      const centerX = sw / 2;

      const _diffFrames = [
        "difficulty_00_btn_001.png", "difficulty_01_btn_001.png", "difficulty_02_btn_001.png",
        "difficulty_03_btn_001.png", "difficulty_04_btn_001.png", "difficulty_05_btn_001.png",
        "difficulty_06_btn2_001.png", "difficulty_07_btn2_001.png", "difficulty_08_btn2_001.png",
        "difficulty_09_btn2_001.png", "difficulty_10_btn2_001.png", "difficulty_auto_btn_001.png"
      ];
      const _diffSizes = {
        "difficulty_00_btn_001.png": { w: 60, h: 85, rotated: false },
        "difficulty_01_btn_001.png": { w: 60, h: 85, rotated: false },
        "difficulty_02_btn_001.png": { w: 86, h: 85, rotated: false },
        "difficulty_03_btn_001.png": { w: 60, h: 84, rotated: false },
        "difficulty_04_btn_001.png": { w: 85, h: 84, rotated: false },
        "difficulty_05_btn_001.png": { w: 76, h: 85, rotated: false },
        "difficulty_06_btn2_001.png": { w: 72, h: 88, rotated: false },
        "difficulty_07_btn2_001.png": { w: 72, h: 85, rotated: false },
        "difficulty_08_btn2_001.png": { w: 72, h: 85, rotated: false },
        "difficulty_09_btn2_001.png": { w: 74, h: 88, rotated: false },
        "difficulty_10_btn2_001.png": { w: 80, h: 91, rotated: false },
        "difficulty_auto_btn_001.png": { w: 60, h: 85, rotated: false },
      };
      const diffIdx = Math.min(_diffFrames.length - 1, Math.max(0, lvl.difficulty || 0));
      const _diffMeta = _diffSizes[_diffFrames[diffIdx]];
      const _targetH = 100, _maxW = 105;
      const _scaleW = _diffMeta ? _diffMeta.w : 90;
      const _scaleH = _diffMeta ? _diffMeta.h : 85;
      const _iconScale = Math.min(_targetH / _scaleH, _maxW / _scaleW);

      const nameText = this.add.bitmapText(centerX, sh * 0.11 - 30, "bigFont", lvl.name || "Unknown", 50)
        .setScrollFactor(0).setDepth(503).setOrigin(0.5);
      this._fitBitmapText(nameText, sw * 0.7);
      this._playOverlayObjects.push(nameText);

      const authorText = this.add.bitmapText(centerX, nameText.y + 42, "goldFont", "By " + (lvl.author || "Unknown"), 36)
        .setScrollFactor(0).setDepth(503).setOrigin(0.5);
      this._fitBitmapText(authorText, sw * 0.6);
      this._playOverlayObjects.push(authorText);

      const playBtnY = sh * 0.36 - 15;
      const playBtn2 = this.add.image(centerX, playBtnY, "GJ_GameSheet03", "GJ_playBtn2_001.png")
        .setScrollFactor(0).setDepth(504).setInteractive();
      let playBtnLoading = false;
      this._makeBouncyButton(playBtn2, 1, async () => {
        if (playBtnLoading) return;
        playBtnLoading = true;
        this._audio.stopMusic();
        this._audio.playEffect("playSound_01", { volume: 1 });
        playBtn2.setTint(0x666666);
        playBtn2.disableInteractive();

        let started = false;
        try {
          started = await this._playSelectedOnlineLevel(lvl);
        } catch (err) {
          console.warn("Failed to start selected online level", err);
        }

        if (!started && playBtn2.scene) {
          playBtnLoading = false;
          playBtn2.clearTint();
          playBtn2.setInteractive();
        }
      }, () => !playBtnLoading);
      this._playOverlayObjects.push(playBtn2);

      const _playStatDefs = [
        { icon: "GJ_downloadsIcon_001.png", value: (Number(lvl.downloads) || 0).toLocaleString("en-US"), scale: 0.9 },
        { icon: "GJ_sLikeIcon_001.png", value: (Number(lvl.likes) || 0).toLocaleString("en-US"), scale: 1.3 },
        { icon: "GJ_timeIcon_001.png", value: this._getLevelLengthLabel(lvl.length), scale: 0.9 }
      ];
      const _playStatX = centerX + (playBtn2.displayWidth / 2) + 100;
      const _playStatGap = 57;
      const _playStatY0 = playBtnY - _playStatGap;
      const _playStatMaxTextW = (sw - 30) - (_playStatX + 60);
      _playStatDefs.forEach((stat, i) => {
        const _statY = _playStatY0 + i * _playStatGap;
        const statIcon = this.add.image(_playStatX, _statY, "GJ_GameSheet03", stat.icon)
          .setScrollFactor(0).setDepth(503).setOrigin(0.5).setScale(stat.scale);
        this._playOverlayObjects.push(statIcon);
        const statText = this.add.bitmapText(_playStatX + statIcon.displayWidth / 2 + 12, _statY, "bigFont", stat.value, 30)
          .setScrollFactor(0).setDepth(503).setOrigin(0, 0.5);
        this._fitBitmapText(statText, _playStatMaxTextW);
        this._playOverlayObjects.push(statText);
      });

      const diffIconX = centerX - (playBtn2.displayWidth / 2) - 100;
      const diffIconY = playBtnY;
      const diffIcon = this.add.image(diffIconX, diffIconY, "GJ_GameSheet03", _diffFrames[diffIdx])
        .setScrollFactor(0).setDepth(503).setOrigin(0.5)
      if (_diffMeta && _diffMeta.rotated) diffIcon.setAngle(90).setFlipY(true);
      this._playOverlayObjects.push(diffIcon);

      let coinIcon = null;
      if (lvl.epic >= 3) {
        coinIcon = this.add.image(diffIconX, diffIconY, "GJ_GameSheet03", "GJ_epicCoin3_001.png").setScrollFactor(0).setDepth(502).setOrigin(0.5);
      } else if (lvl.epic === 2) {
        coinIcon = this.add.image(diffIconX, diffIconY, "GJ_GameSheet03", "GJ_epicCoin2_001.png").setScrollFactor(0).setDepth(502).setOrigin(0.5);
      } else if (lvl.epic === 1) {
        coinIcon = this.add.image(diffIconX, diffIconY, "GJ_GameSheet03", "GJ_epicCoin_001.png").setScrollFactor(0).setDepth(502).setOrigin(0.5);
      } else if (lvl.featured) {
        coinIcon = this.add.image(diffIconX, diffIconY, "GJ_GameSheet03", "GJ_featuredCoin_001.png").setScrollFactor(0).setDepth(502).setOrigin(0.5);
      }
      if (coinIcon) this._playOverlayObjects.push(coinIcon);

      const _progressKeyId = "online_" + (lvl.id || "0");
      const _bestNormal = parseFloat(localStorage.getItem("bestPercent_" + _progressKeyId) || "0");
      const _bestPractice = parseFloat(localStorage.getItem("practiceBestPercent_" + _progressKeyId) || "0");

      const _barFrame = this.textures.getFrame("GJ_WebSheet", "GJ_progressBar_001.png");
      const _barW = _barFrame ? _barFrame.width : 680;
      const _barH = _barFrame ? _barFrame.height : 40;

      const normalBarY = sh * 0.58 - 15;
      const normalLabel = this.add.bitmapText(centerX, normalBarY - 30, "bigFont", "Normal Mode", 32)
        .setScrollFactor(0).setDepth(503).setOrigin(0.5).setScale(0.78);
      const normalBarBg = this.add.image(centerX, normalBarY, "GJ_WebSheet", "GJ_progressBar_001.png")
        .setScrollFactor(0).setDepth(503).setTint(0).setAlpha(125 / 255).setScale(0.7, 0.69);
      const normalFillW = Math.max(1, Math.floor(_barW * (_bestNormal / 100)));
      const normalBarFg = this.add.image(centerX - _barW * 0.695 / 2, normalBarY, "GJ_WebSheet", "GJ_progressBar_001.png")
        .setScrollFactor(0).setDepth(503).setTint(0x00ff00).setScale(0.695, 0.57).setOrigin(0, 0.5)
        .setCrop(0, 0, normalFillW, _barH);
      const normalPctText = this.add.bitmapText(centerX, normalBarY, "bigFont", _bestNormal + "%", 30)
        .setScrollFactor(0).setDepth(504).setOrigin(0.5).setScale(0.7);
      this._playOverlayObjects.push(normalLabel, normalBarBg, normalBarFg, normalPctText);

      const practiceBarY = sh * 0.70 - 25;
      const practiceLabel = this.add.bitmapText(centerX, practiceBarY - 30, "bigFont", "Practice Mode", 32)
        .setScrollFactor(0).setDepth(503).setOrigin(0.5).setScale(0.78);
      const practiceBarBg = this.add.image(centerX, practiceBarY, "GJ_WebSheet", "GJ_progressBar_001.png")
        .setScrollFactor(0).setDepth(503).setTint(0).setAlpha(125 / 255).setScale(0.7, 0.7);
      const practiceFillW = Math.max(1, Math.floor(_barW * (_bestPractice / 100)));
      const practiceBarFg = this.add.image(centerX - _barW * 0.695 / 2, practiceBarY, "GJ_WebSheet", "GJ_progressBar_001.png")
        .setScrollFactor(0).setDepth(503).setTint(0x00ffff).setScale(0.695, 0.57).setOrigin(0, 0.5)
        .setCrop(0, 0, practiceFillW, _barH);
      const practicePctText = this.add.bitmapText(centerX, practiceBarY, "bigFont", _bestPractice + "%", 30)
        .setScrollFactor(0).setDepth(504).setOrigin(0.5).setScale(0.7);
      this._playOverlayObjects.push(practiceLabel, practiceBarBg, practiceBarFg, practicePctText);
      const sideBtnX = sw - 55;
      const sideBtnGap = sh * 0.16;
      const sideBtnY0 = sh * 0.08 - 100;
      const sideBtnScale = 1;

      const rateLockBtn = this.add.image(55, sideBtnY0 + 350, "GJ_GameSheet03", "GJ_duplicateBtn_001.png")
        .setScrollFactor(0).setDepth(504).setScale(sideBtnScale).setInteractive();
      this._makeBouncyButton(rateLockBtn, sideBtnScale, () => {
        this._duplicateOnlineLevelToEditor(lvl);
      });

      const closeBtn = this.add.image(sideBtnX, sideBtnY0 + sideBtnGap, "GJ_GameSheet03", "GJ_deleteBtn_001.png")
        .setScrollFactor(0).setDepth(504).setScale(sideBtnScale).setInteractive();
      this._makeBouncyButton(closeBtn, sideBtnScale, () => {
        this._closePlayMenu(false, () => this._playMenuBackTarget());
      });

      const refreshBtn = this.add.image(sideBtnX, sideBtnY0 + sideBtnGap * 2, "GJ_GameSheet03", "GJ_updateBtn_001.png")
        .setScrollFactor(0).setDepth(504).setScale(sideBtnScale).setInteractive();
      this._makeBouncyButton(refreshBtn, sideBtnScale, () => {
        const backTarget = this._playMenuBackTarget;
        this._closePlayMenu(true, () => this._openPlayMenu(backTarget));
      });

      const infoBtn2 = this.add.image(sideBtnX, sideBtnY0 + sideBtnGap * 3, "GJ_GameSheet03", "GJ_infoBtn_001.png")
        .setScrollFactor(0).setDepth(504).setScale(sideBtnScale).setInteractive();
      this._applyLockedGray(infoBtn2);
      this._makeBouncyButton(infoBtn2, sideBtnScale, () => {
      });

      const leaderboardBtn = this.add.image(sideBtnX, sideBtnY0 + sideBtnGap * 4, "GJ_GameSheet03", "GJ_levelLeaderboardBtn_001.png")
        .setScrollFactor(0).setDepth(504).setScale(sideBtnScale).setInteractive();
      this._applyLockedGray(leaderboardBtn);
      this._makeBouncyButton(leaderboardBtn, sideBtnScale, () => {
      });

      const likeBtn = this.add.image(sideBtnX, sideBtnY0 + sideBtnGap * 5, "GJ_GameSheet03", "GJ_like2Btn_001.png")
        .setScrollFactor(0).setDepth(504).setScale(sideBtnScale).setInteractive();
      this._applyLockedGray(likeBtn);
      this._makeBouncyButton(likeBtn, sideBtnScale, () => {
      });

      const cornerInfoBtn = this.add.image(60, sh - 60, "GJ_GameSheet03", "GJ_infoIcon_001.png")
        .setScrollFactor(0).setDepth(504).setOrigin(0.5).setInteractive();
      this._makeBouncyButton(cornerInfoBtn, 1, () => {
        this._buildLevelStatsPopup({ name: lvl.name || "Unnamed", key: _progressKeyId });
      }, () => !this._levelStatsPopup);

      this._playOverlayObjects.push(rateLockBtn, closeBtn, refreshBtn, infoBtn2, leaderboardBtn, likeBtn, cornerInfoBtn);
      const songBoxW = sw * 0.55;
      const songBoxH = 190;
      const songBoxY = sh - 95;
      const _squareCorner = 0.325 * this.textures.get("GJ_square01").source[0].width;
      const songBox = this.add.nineslice(centerX, songBoxY, "GJ_square01", null, songBoxW, songBoxH, _squareCorner, _squareCorner, _squareCorner, _squareCorner)
        .setScrollFactor(0).setDepth(503).setOrigin(0.5);
      this._playOverlayObjects.push(songBox);

      const songNameText = this.add.bitmapText(centerX - songBoxW / 2 + 20, songBoxY - 60, "bigFont", lvl.songName || "Unknown", 50)
        .setScrollFactor(0).setDepth(504).setOrigin(0, 0.5)
      this._fitBitmapText(songNameText, songBoxW - 100);
      this._playOverlayObjects.push(songNameText);
      let songAuthor = "Unknown";

      const songAuthorText = this.add.bitmapText(centerX - songBoxW / 2 + 20, songBoxY - 15, "goldFont", "By: " + songAuthor, 36)
        .setScrollFactor(0).setDepth(504).setOrigin(0, 0.5)
      this._fitBitmapText(songAuthorText, songBoxW - 100);
      this._playOverlayObjects.push(songAuthorText);

      if (lvl.customSongID && lvl.customSongID !== "0") {
        const downloadBtnX = centerX + songBoxW / 2 - 50;
        const downloadBtnY = songBoxY + 40;
        const downloadBtn = this.add.image(downloadBtnX, downloadBtnY, "GJ_GameSheet03", "GJ_downloadBtn_001.png").setScrollFactor(0).setDepth(504).setInteractive();
        this._playOverlayObjects.push(downloadBtn);
        let isDownloading = false;
        let abortController = null;
        let isDownloaded = false;
        const updateBtnState = async () => {
          if (!downloadBtn || !downloadBtn.scene) return;
          if (isDownloading) {
            downloadBtn.setTexture("GJ_GameSheet03", "GJ_cancelDownloadBtn_001.png");
          } else {
            isDownloaded = await window.SongDB.isDownloaded(lvl.customSongID);
            if (downloadBtn && downloadBtn.scene) {
              downloadBtn.setTexture("GJ_GameSheet03", isDownloaded ? "GJ_trashBtn_001.png" : "GJ_downloadBtn_001.png");
            }
          }
        };
        updateBtnState();
        this._makeBouncyButton(downloadBtn, 1, async () => {
          if (isDownloading) {
            if (abortController) abortController.abort();
            isDownloading = false;
            updateBtnState();
            return;
          }
          if (isDownloaded) {
            await window.SongDB.delete(lvl.customSongID);
            updateBtnState();
            return;
          }
          isDownloading = true;
          updateBtnState();
          abortController = new AbortController();
          try {
            const workerUrl = `https://fetchsongid.lasokar.workers.dev/?id=${encodeURIComponent(lvl.customSongID)}`;
            const audioRes = await fetch(workerUrl, { signal: abortController.signal });
            if (!audioRes.ok) throw new Error("Failed to download audio from worker");
            const arrayBuf = await audioRes.arrayBuffer();
            await window.SongDB.save(lvl.customSongID, arrayBuf, this.sound.context);
          } catch (err) {
            if (err.name === 'AbortError') {
              console.log('Download cancelled.');
            } else {
              console.warn("Failed to download song:", err);
              this._showServerErrorPopup();
            }
          } finally {
            isDownloading = false;
            abortController = null;
            updateBtnState();
          }
        });
      }

      if (lvl.customSongID) {
        const PROXY_BASE = (window._gdProxyUrl || "").replace(/\/$/, "");
        if (!PROXY_BASE) {
          console.warn("Play menu song author: window._gdProxyUrl is not configured");
        } else {
          fetch(`${PROXY_BASE}/getGJSongInfo.php`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `songID=${lvl.customSongID}&secret=Wmfd2893gb7`
          })
            .then(res => (res.ok ? res.text() : "-1"))
            .then(ngText => {
              if (!ngText || ngText === "-1") return;
              const ngParts = ngText.split("~|~");
              const ngMap = {};
              for (let i = 0; i + 1 < ngParts.length; i += 2) ngMap[ngParts[i]] = ngParts[i + 1];

              const artistName = (ngMap["4"] || "Unknown").trim();
              const songName = (ngMap["2"] || "Unknown").trim();

              if (artistName) {
                songAuthor = artistName;
                songAuthorText.setText("By: " + songAuthor);
                this._fitBitmapText(songAuthorText, songBoxW - 100);
              }

              if (songName && typeof songNameText !== "undefined" && songNameText) {
                songNameText.setText(songName);
                this._fitBitmapText(songNameText, songBoxW - 100);
              }
            })
            .catch(err => {
              console.warn("Failed to fetch song author:", err);
            });
        }
      }
    };
    this._closePlayMenu = (silent = false, onComplete = null) => {
      if (!this._playOverlay) return;
      const destroy = () => {
        for (const obj of this._playOverlayObjects) {
          if (obj && obj.destroy) obj.destroy();
        }
        this._playOverlayObjects = [];
        this._playOverlay = null;
      };
      if (silent) { destroy(); if (onComplete) onComplete(); return; }
      const sw = screenWidth, sh = screenHeight;
      const fadeOut = this.add.graphics().setScrollFactor(0).setDepth(600).setAlpha(0);
      fadeOut.fillStyle(0x000000, 1);
      fadeOut.fillRect(0, 0, sw, sh);
      this.tweens.add({
        targets: fadeOut, alpha: 1, duration: 150, ease: "Linear",
        onComplete: () => {
          destroy();
          if (onComplete) onComplete();
          this.tweens.add({ targets: fadeOut, alpha: 0, duration: 150, ease: "Linear", onComplete: () => fadeOut.destroy() });
        }
      });
    };
    this._playSelectedOnlineLevel = async (lvl) => {
      if (!lvl || !lvl.id) return false;

      let _cachedLevelString = null;
      let _cachedOfficialSong = lvl.officialSong || 0;
      let _cachedCustomSongID = lvl.customSongID || "";
      let _cachedSongOffset = lvl.songOffset || 0;
      try {
        const _savedList = JSON.parse(localStorage.getItem("gd_saved_online_levels") || "[]");
        const _numId = String(lvl.id).replace(/^online_/, "");
        const _cached = _savedList.find(sl => String(sl.id).replace(/^online_/, "") === _numId);
        if (_cached && _cached.levelString) {
          _cachedLevelString = _cached.levelString;
          _cachedCustomSongID = _cached.customSongID || _cachedCustomSongID;
          _cachedOfficialSong = _cached.officialSong || _cachedOfficialSong;
          _cachedSongOffset = _cached.songOffset || _cachedSongOffset;
        }
      } catch(_e) {}

      if (_cachedLevelString) {
        const isCustomSong = !!_cachedCustomSongID && _cachedCustomSongID !== "0";
        const customSongID = _cachedCustomSongID;
        const officialSong = _cachedOfficialSong;
        const offset = _cachedSongOffset;

        window._onlineLevelId = "online_" + String(lvl.id).replace(/^online_/, "");
        window._onlineLevelString = _cachedLevelString;
        window._onlineLevelName = lvl.name || "Online Level";
        window._onlineSongOffset = offset;
        window._onlineSongBuffer = null;
        window._onlineSongKey = null;

        let songKey = (window.allLevels && window.allLevels[officialSong]) ? window.allLevels[officialSong][0] : `ng_song_${customSongID}`;
        let songArtist = "Unknown";

        if (isCustomSong) {
          songKey = `ng_song_${customSongID}`;
          try {
            const audioCtx = this.game.sound.context;
            if (audioCtx.state === "suspended") await audioCtx.resume();
            const arrayBuf = await window.SongDB.load(customSongID);
            if (arrayBuf) {
              const decoded = await audioCtx.decodeAudioData(arrayBuf);
              window._onlineSongBuffer = decoded;
              window._onlineSongKey = songKey;
            }
          } catch(_e) {}
        } else if (window.allLevels && window.allLevels[officialSong]) {
          songArtist = window.allLevels[officialSong][3] || "Unknown";
          songKey = window.allLevels[officialSong][0];
        }

        window.currentlevel = [songKey, window._onlineLevelName, window._onlineLevelId, ["Online", songArtist]];
        this.game.registry.set("autoStartGame", true);
        window._onlineReturnToPlayMenu = { lvl, backTarget: this._playMenuBackTarget };
        this._closePlayMenu(false, () => this.scene.restart());
        return true;
      }

      const PROXY_BASE = (window._gdProxyUrl || "").replace(/\/$/, "");
      if (!PROXY_BASE) { console.warn("Play online level: window._gdProxyUrl is not configured"); this._showServerErrorPopup(); return false; }
      try {
        const res = await fetch(`${PROXY_BASE}/downloadGJLevel22.php`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `levelID=${lvl.id}&secret=Wmfd2893gb7`
        });
        if (!res.ok) throw new Error(`Proxy returned ${res.status}`);
        const rawResponse = await res.text();
        if (!rawResponse || rawResponse === "-1" || !rawResponse.includes(":")) return false;

        const lvlParts = rawResponse.split("#")[0].split(":");
        const m = {};
        for (let i = 0; i + 1 < lvlParts.length; i += 2) m[lvlParts[i]] = lvlParts[i + 1];

        const levelString = m["4"] || null;
        const officialSong = parseInt(m["12"]) || 0;
        const customSongID = (m["35"] || "").trim();
        const isCustomSong = !!customSongID && customSongID !== "0";
        const offset = parseFloat(m["45"] || "0") || 0;

        window._onlineLevelId = "online_" + lvl.id;
        window._onlineLevelString = levelString;
        window._onlineLevelName = lvl.name || "Online Level";
        window._onlineSongOffset = offset;
        window._onlineSongBuffer = null;
        window._onlineSongKey = null;

        try {
          const _savedKey = "gd_saved_online_levels";
          const _all = JSON.parse(localStorage.getItem(_savedKey) || "[]");
          const _numId = String(lvl.id).replace(/^online_/, "");
          const _idx = _all.findIndex(sl => String(sl.id).replace(/^online_/, "") === _numId);
          if (_idx !== -1 && !_all[_idx].levelString) {
            _all[_idx].levelString = levelString;
            _all[_idx].officialSong = officialSong;
            _all[_idx].songOffset = offset;
            localStorage.setItem(_savedKey, JSON.stringify(_all));
          }
        } catch(_e) {}

        let songKey = (window.allLevels && window.allLevels[officialSong]) ? window.allLevels[officialSong][0] : `ng_song_${customSongID}`;
        let songArtist = "Unknown";
        let songTitle = null;

        if (isCustomSong) {
          songKey = `ng_song_${customSongID}`;
          try {
            const audioCtx = this.game.sound.context;
            if (audioCtx.state === "suspended") await audioCtx.resume();
            const ngRes = await fetch(`${PROXY_BASE}/getGJSongInfo.php`, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: `songID=${customSongID}&secret=Wmfd2893gb7`
            });
            const ngText = ngRes.ok ? await ngRes.text() : "-1";
            let ngMap = {};
            if (ngText && ngText !== "-1") {
              const ngParts = ngText.split("~|~");
              for (let i = 0; i + 1 < ngParts.length; i += 2) ngMap[ngParts[i]] = ngParts[i + 1];
              songArtist = (ngMap["4"] || "Unknown").replace(/:$/, "").trim();
              songTitle = (ngMap["2"] || "").trim() || null;
            }
            let arrayBuf = await window.SongDB.load(customSongID);
            if (!arrayBuf) {
              const workerUrl = `https://fetchsongid.lasokar.workers.dev/?id=${encodeURIComponent(customSongID)}`;
              let audioRes = await fetch(workerUrl);
              if (!audioRes.ok) {
                const songUrl = decodeURIComponent((ngMap["10"] || "").trim());
                if (songUrl) {
                  const proxiedUrl = songUrl.includes("geometrydashfiles.b-cdn.net")
                    ? songUrl
                    : `${PROXY_BASE}/audio-proxy?url=${encodeURIComponent(songUrl)}`;
                  audioRes = await fetch(proxiedUrl);
                }
              }
              if (audioRes && audioRes.ok) {
                arrayBuf = await audioRes.arrayBuffer();
                await window.SongDB.save(customSongID, arrayBuf);
              }
            }
            if (arrayBuf) {
              const decoded = await audioCtx.decodeAudioData(arrayBuf);
              window._onlineSongBuffer = decoded;
              window._onlineSongKey = songKey;
            }
          } catch (err) {
            console.warn("Failed to load custom song for online level", err);
          }
        } else if (window.allLevels && window.allLevels[officialSong]) {
          songArtist = window.allLevels[officialSong][3] || "Unknown";
        }
        window.currentlevel = [songKey, window._onlineLevelName, window._onlineLevelId, ["Online", songArtist]];
        this.game.registry.set("autoStartGame", true);
        window._onlineReturnToPlayMenu = { lvl, backTarget: this._playMenuBackTarget };
        this._closePlayMenu(false, () => this.scene.restart());
        return true;
      } catch (err) {
        console.warn("Failed to start online level", err);
        this._showServerErrorPopup();
        return false;
      }
    };
    this._duplicateOnlineLevelToEditor = async (lvl) => {
      if (!lvl || !lvl.id) return;
      const PROXY_BASE = (window._gdProxyUrl || "").replace(/\/$/, "");
      if (!PROXY_BASE) { console.warn("Duplicate level: window._gdProxyUrl is not configured"); this._showServerErrorPopup(); return; }
      try {
        const res = await fetch(`${PROXY_BASE}/downloadGJLevel22.php`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `levelID=${lvl.id}&secret=Wmfd2893gb7`
        });
        if (!res.ok) throw new Error(`Proxy returned ${res.status}`);
        const rawResponse = await res.text();
        if (!rawResponse || rawResponse === "-1" || !rawResponse.includes(":")) return;

        const lvlParts = rawResponse.split("#")[0].split(":");
        const m = {};
        for (let i = 0; i + 1 < lvlParts.length; i += 2) m[lvlParts[i]] = lvlParts[i + 1];

        const levelString = m["4"] || "";
        if (!levelString) { console.warn("Duplicate level: no level data in response"); return; }

        const officialSong = parseInt(m["12"]) || 0;
        const customSongID = (m["35"] || "").trim();
        const isCustomSong = !!customSongID && customSongID !== "0";
        const levelVersion = parseInt(m["16"]) || 1;

        let songName, songId;
        if (isCustomSong) {
          songId = parseInt(customSongID) || 0;
          songName = lvl.songName || `NG#${customSongID}`;
        } else {
          songId = -officialSong - 1;
          try { songName = window.allLevels[officialSong][1]; } catch (e) { songName = lvl.songName || "Unknown"; }
        }

        const rawLevels = localStorage.getItem("created_levels");
        const createdLevels = rawLevels ? JSON.parse(rawLevels) : [];

        const newLevel = {
          levelName: lvl.name || "Unknown",
          song: songName,
          songId: songId,
          levelId: lvl.id,
          levelString: levelString,
          levelLength: lvl.length || 0,
          normalBest: 0,
          practiceBest: 0,
          description: lvl.description || "",
          version: levelVersion,
          status: "Unverified",
          createdId: this._getNextLocalId()
        };

        createdLevels.push(newLevel);
        localStorage.setItem("created_levels", JSON.stringify(createdLevels));

        this._audio.playEffect("build_01");
        this._closePlayMenu(false, () => this._openLevelView(newLevel));
      } catch (err) {
        console.warn("Failed to duplicate level to editor:", err);
        this._showServerErrorPopup();
      }
    };
    this._openEditorMenu = () => {
        if (this._editorOverlay) return;
        const sw = screenWidth;
        const sh = screenHeight;
        const centerX = sw / 2;

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
            overlay.fillStyle(bandColor, 1);
            overlay.fillRect(0, Math.floor(gi * sh / gradientSteps), sw, Math.ceil(sh / gradientSteps) + 1);
        }
        this._editorOverlay = overlay;

        const blocker = this.add.zone(centerX, sh / 2, sw, sh).setScrollFactor(0).setDepth(101).setInteractive();
        const container = this.add.container(0, 0).setScrollFactor(0).setDepth(102);

        const tableW = 712;
        const tableH = 460;
        const tableX = (sw - tableW) / 2;
        const tableY = 85;

        const rawData = localStorage.getItem("created_levels");
        const createdLevels = rawData ? JSON.parse(rawData) : [];

        createdLevels.sort((a, b) => {
            const idA = parseInt(a.createdId.replace("local_", "")) || 0;
            const idB = parseInt(b.createdId.replace("local_", "")) || 0;
            return idB - idA;
        });

        const nameCounts = {};
        const levelRevisions = {};

        createdLevels.forEach(lvl => {
            const name = lvl.levelName;
            if (!nameCounts[name]) {
                nameCounts[name] = 1;
                levelRevisions[lvl.createdId] = "";
            } else {
                levelRevisions[lvl.createdId] = `Rev. ${nameCounts[name]}`;
                nameCounts[name]++;
            }
        });

        const lengthValues = ["Tiny", "Short", "Medium", "Long", "XL", "Plat."]

        const listContainer = this.add.container(0, 0);
        const maskShape = this.add.graphics().fillStyle(0xffffff).fillRect(tableX, tableY, tableW, tableH).setVisible(false);
        const mask = maskShape.createGeometryMask();
        listContainer.setMask(mask);
        listContainer.y = tableY + 22;
        container.add(this.add.graphics().setScrollFactor(0).setDepth(90).fillStyle(0xc2723e, 1).fillRect(tableX, tableY, tableW, tableH));
        container.add(listContainer);

        const spacing = 140;
        const levelsPerPage = 10;
        let currentPage = 0;
        let scrollOffsetY = 0;
        let activeLevelRows = [];
        const getCurrentPageLevelCount = () => Math.min(
            levelsPerPage,
            Math.max(0, createdLevels.length - currentPage * levelsPerPage)
        );
        const getMaxScroll = () => Math.max(0, getCurrentPageLevelCount() * spacing - tableH + 32);
        const setScroll = (offset) => {
            scrollOffsetY = Phaser.Math.Clamp(offset, 0, getMaxScroll());
            listContainer.y = tableY + 22 - scrollOffsetY;
        };
        const clearLevelRows = () => {
            activeLevelRows.forEach(rowObject => rowObject.destroy());
            activeLevelRows = [];
        };
        const renderCreatedPage = () => {
            clearLevelRows();
            const startIndex = currentPage * levelsPerPage;
            createdLevels.slice(startIndex, startIndex + levelsPerPage).forEach((level, pageIndex) => {
                const index = startIndex + pageIndex;
                const slotY = (pageIndex * spacing) + (spacing / 2);
                const stripeColor = index % 2 !== 0 ? 0xc2723e : 0xa1582c;

                const bgStripe = this.add.rectangle(centerX, slotY, tableW - 10, spacing, stripeColor, 1);
                const separator = this.add.rectangle(centerX, slotY + (spacing / 2), tableW - 10, 1, 0x502c16, 1);
                const nameTxt = this.add.bitmapText(tableX + 31, slotY - 29, "bigFont", level.levelName, 48).setOrigin(0, 0.5);
                const revLabel = levelRevisions[level.createdId];
                const revText = this.add.bitmapText(0, nameTxt.y + 5, "goldFont", revLabel, 20).setOrigin(0, 0.5);
                const nameMaxW = (tableX + tableW - 145) - nameTxt.x - (revLabel ? revText.width + 10 : 0);
                this._fitBitmapText(nameTxt, nameMaxW);
                revText.x = nameTxt.x + nameTxt.displayWidth + 10;
                const infoY = slotY + 30;
                const lenIcon = this.add.image(tableX + 50, infoY, "GJ_GameSheet03", "GJ_timeIcon_001.png").setScale(0.8);
                const lenTxt = this.add.bitmapText(lenIcon.x + 22, infoY, "bigFont", lengthValues[parseInt(level.levelLength, 10)] || "Tiny", 23).setOrigin(0, 0.5);
                const songIcon = this.add.image(tableX + 165, infoY, "GJ_GameSheet03", "GJ_musicIcon_001.png").setScale(0.8);
                const songTxt = this.add.bitmapText(songIcon.x + 22, infoY, "bigFont", level.song, 23).setOrigin(0, 0.5);
                const statusIcon = this.add.image(tableX + 415, infoY, "GJ_GameSheet03", "GJ_infoIcon_001.png").setScale(0.8);
                this._fitBitmapText(songTxt, Math.max(20, (statusIcon.x - 25) - songTxt.x));
                const statusTxt = this.add.bitmapText(statusIcon.x + 22, infoY, "bigFont", level.status, 23).setOrigin(0, 0.5);

                const viewBtn = this.add.nineslice(tableX + tableW - 80, slotY, "GJ_button01", null, 115, 55, 24, 24, 24, 24).setScale(0.75).setInteractive().setScale(1.05);
                const viewTxt = this.add.bitmapText(viewBtn.x - 2, viewBtn.y - 1, "bigFont", "View", 32).setOrigin(0.5).setScale(1.1);
                this._makeCompositeBouncyButton(viewBtn, [viewBtn, viewTxt], 0.75, () => {
                    this._closeEditorMenu(false);
                    this._openLevelView(level);
                });

                const rowObjects = [bgStripe, separator, nameTxt, revText, lenIcon, lenTxt, songIcon, songTxt, statusIcon, statusTxt, viewBtn, viewTxt];
                listContainer.add(rowObjects);
                activeLevelRows.push(...rowObjects);
            });

            setScroll(scrollOffsetY);
            const hasLevels = createdLevels.length > 0;
            const totalPages = Math.max(1, Math.ceil(createdLevels.length / levelsPerPage));
            const start = hasLevels ? currentPage * levelsPerPage + 1 : 0;
            const end = hasLevels ? Math.min(createdLevels.length, (currentPage + 1) * levelsPerPage) : 0;
            pageBtnGroup.setVisible(hasLevels);
            pageNum.setText(String(currentPage + 1));
            pageLabel.setText(`${start} to ${end} of ${createdLevels.length}`).setVisible(hasLevels);
            prevBtn.setVisible(hasLevels && currentPage > 0);
            nextBtn.setVisible(hasLevels && currentPage < totalPages - 1);
        };

        if (createdLevels.length === 0) {
          container.add(this.add.bitmapText(centerX, tableY + (tableH/2), "bigFont", "Tap New to create a level", 38).setOrigin(0.5));
        }
        const sideFrame = this.textures.getFrame("GJ_WebSheet", "GJ_table_side_001.png");
        const sideScaleY = tableH / sideFrame.height;
        container.add(this.add.image(tableX - 40, tableY, "GJ_WebSheet", "GJ_table_side_001.png").setOrigin(0, 0).setScale(1, sideScaleY));
        container.add(this.add.image(tableX + tableW + 40, tableY, "GJ_WebSheet", "GJ_table_side_001.png").setOrigin(1, 0).setFlipX(true).setScale(1, sideScaleY));
        container.add(this.add.image(centerX, tableY - 10, "GJ_WebSheet", "GJ_table_top_001.png"));
        container.add(this.add.image(centerX, tableY + tableH + 20, "GJ_WebSheet", "GJ_table_bottom_001.png"));
        container.add(this.add.bitmapText(centerX, tableY - 15, "bigFont", "My Levels", 42).setOrigin(0.5).setScale(1.1));

        const pageLabel = this.add.bitmapText(sw - 8, 3, "goldFont", "", 22).setOrigin(1, 0);
        container.add(pageLabel);
        const pageBtnGroup = this.add.container(sw - 35, sh / 2 - 240);
        const pageBtn = this.add.image(0, 0, "GJ_button02").setScale(0.7);
        const pageNum = this.add.bitmapText(-2, 0, "bigFont", "1", 35).setOrigin(0.5);
        pageBtnGroup.add([pageBtn, pageNum]);
        const pageBtnFrame = this.textures.getFrame("GJ_button02");
        const pageBtnW = (pageBtnFrame ? pageBtnFrame.realWidth : 100) * 0.7;
        const pageBtnH = (pageBtnFrame ? pageBtnFrame.realHeight : 100) * 0.7;
        pageBtnGroup.setInteractive(
            new Phaser.Geom.Rectangle(-pageBtnW / 2, -pageBtnH / 2, pageBtnW, pageBtnH),
            Phaser.Geom.Rectangle.Contains
        );
        container.add(pageBtnGroup);

        const prevBtn = this.add.image(40, sh / 2, "GJ_GameSheet03", "GJ_arrow_03_001.png")
            .setOrigin(0.5).setInteractive().setVisible(false);
        const nextBtn = this.add.image(sw - 40, sh / 2, "GJ_GameSheet03", "GJ_arrow_03_001.png")
            .setOrigin(0.5).setFlipX(true).setInteractive().setVisible(false);
        container.add([prevBtn, nextBtn]);

        const goToPage = (page) => {
            const totalPages = Math.max(1, Math.ceil(createdLevels.length / levelsPerPage));
            currentPage = Math.max(0, Math.min(page, totalPages - 1));
            scrollOffsetY = 0;
            renderCreatedPage();
        };
        this._makeBouncyButton(pageBtnGroup, 1, () => {
            const totalPages = Math.max(1, Math.ceil(createdLevels.length / levelsPerPage));
            goToPage((currentPage + 1) % totalPages);
        }, () => true);
        this._makeBouncyButton(prevBtn, 1, () => goToPage(currentPage - 1));
        this._makeBouncyButton(nextBtn, 1, () => goToPage(currentPage + 1));
        renderCreatedPage();

        const inTable = (pointer) => (
            pointer.x >= tableX && pointer.x <= tableX + tableW &&
            pointer.y >= tableY && pointer.y <= tableY + tableH
        );
        const onWheel = (pointer, gameObjects, deltaX, deltaY) => {
            if (!this._editorOverlay || !inTable(pointer)) return;
            setScroll(scrollOffsetY + deltaY * 0.5);
        };
        let isDragging = false;
        let dragStartY = 0;
        let dragStartOffset = 0;
        const onDragStart = (pointer) => {
            if (!inTable(pointer)) return;
            isDragging = true;
            dragStartY = pointer.y;
            dragStartOffset = scrollOffsetY;
        };
        const onDragMove = (pointer) => {
            if (!isDragging || !pointer.isDown) return;
            setScroll(dragStartOffset + (dragStartY - pointer.y) * 0.5);
        };
        const onDragEnd = () => { isDragging = false; };
        this.input.on("wheel", onWheel);
        this.input.on("pointerdown", onDragStart);
        this.input.on("pointermove", onDragMove);
        this.input.on("pointerup", onDragEnd);

        const cornerBR = this.add.image(sw, sh, "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setOrigin(1, 1).setFlipX(true);
        const cornerBL = this.add.image(0, sh, "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setOrigin(0, 1);
        container.add(cornerBR);
        container.add(cornerBL);

        const newBtnX = sw - 55;
        const newBtnY = sh - 55;
        const newBtn = this.add.image(newBtnX, newBtnY, "GJ_GameSheet03", "GJ_newBtn_001.png")
           .setScale(0.95)
            .setInteractive();

          this._makeBouncyButton(newBtn, 0.95, () => {
            const rawData = localStorage.getItem("created_levels");
            let createdLevels = rawData ? JSON.parse(rawData) : [];

            let counter = 0;
            while (createdLevels.some(lvl => lvl.levelName === "Unnamed " + counter)) {
                counter++;
            }
            const newName = "Unnamed " + counter;

            const newLevel = {
                levelName: newName,
                song: "Stereo Madness",
                songId: -1,
                levelId: null,
                levelString: "H4sIAAAAAAAACq1QwRHDMAhbyO0hwIlzfWWGDsAAXaHD10Z-9Ff3Ln4gG4GMeD2tFYRLaEBrWGitARCUwKTHDbEFRCT2wF3yBOrXvYVEC7wRKSi6JoirBY8FwdHB9iVJjZ5ckP1rlf19taIv7pLGh-wP43XROPq9z9mOtX1uS7LldcKKzPx41ZKwEbz0yPueUSfPF9qApx3kMlrGJE7PSBbCIlYpy5QVuheMciE0AgiaoFRUihk5I2ec0Knp1PTK9slxYDM2OIFmjL8bv-1mBmB6YrvO4UErHR4fJXMaP9sDAAA=",
                levelLength: 0,
                normalBest: 0,
                practiceBest: 0,
                description: "",
                version: 1,
                status: "Unverified",
                createdId: this._getNextLocalId()
            };

            createdLevels.push(newLevel);
            localStorage.setItem("created_levels", JSON.stringify(createdLevels));

            this._closeEditorMenu();
            this._openLevelView(newLevel);

            this._audio.playEffect("build_01");
        });
        container.add(newBtn);

         const importBtn = this.add.image(60, newBtnY - 90, "GJ_GameSheet04", "GJ_importBtn_001.png").setScale(0.95).setInteractive();
          this._makeBouncyButton(importBtn, 0.95, () => {
            this._importGMD();
        });
        container.add(importBtn);

        const uploadedlvls = this.add.image(60, newBtnY - 5, "GJ_GameSheet03", "GJ_myServerBtn_001.png").setScale(0.95);
        this._applyLockedGray(uploadedlvls
        );
        container.add(uploadedlvls);

        const backBtn = this.add.image(50, 48, "GJ_GameSheet03", "GJ_arrow_03_001.png")
            .setScrollFactor(0).setDepth(104).setFlipX(true).setFlipY(true).setRotation(Math.PI).setInteractive();

        this._makeBouncyButton(backBtn, 1, () => {
          this._closeEditorMenu();
          this._openCreatorMenu();
        });

        this._editorObjects = [overlay, blocker, container, backBtn, maskShape, {
            destroy: () => {
                this.input.off("wheel", onWheel);
                this.input.off("pointerdown", onDragStart);
                this.input.off("pointermove", onDragMove);
                this.input.off("pointerup", onDragEnd);
            }
        }];
    };
    this._importGMD = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.gmd,.gdlvl';

        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const isGdlvl = file.name.toLowerCase().endsWith('.gdlvl');

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const content = isGdlvl ? this._decodeWebLevelStringForGMD(event.target.result) : event.target.result;
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(content, "text/xml");
                    const keys = xmlDoc.querySelectorAll("key, k");

                    let extracted = {
                        name: "Imported Level",
                        data: "",
                        version: 1,
                        length: 0,
                        id: "NA",
                        desc: "",
                        officialSongId: 0,
                        customSongId: 0
                    };

                    keys.forEach(keyNode => {
                        const k = keyNode.textContent;
                        const v = keyNode.nextElementSibling;
                        if (!v) return;
                        const val = v.textContent;

                        if (k === "k2") extracted.name = val;
                        if (k === "k4") extracted.data = val;
                        if (k === "k1") extracted.id = val;
                        if (k === "k23") extracted.length = parseInt(val) || 0;
                        if (k === "k16") extracted.version = parseInt(val) || 1;
                        if (k === "k8") extracted.officialSongId = parseInt(val) || 0;
                        if (k === "k45") extracted.customSongId = parseInt(val) || 0;
                        if (k === "k3") {
                            try { extracted.desc = atob(val); } catch(e) { extracted.desc = val; }
                        }
                    });

                    if (!extracted.data) throw new Error("No level string found.");

                    let finalSongName = "Stereo Madness";
                    let finalSongId = -1;

                    if (extracted.customSongId > 0) {
                        finalSongId = extracted.customSongId;
                        finalSongName = `NG#${extracted.customSongId}`;
                    } else {
                        finalSongId = -extracted.officialSongId -1;
                        try {
                            finalSongName = window.allLevels[extracted.officialSongId][1];
                        } catch(e) {
                            finalSongName = "Unknown";
                        }
                    }

                    const rawLevels = localStorage.getItem("created_levels");
                    let createdLevels = rawLevels ? JSON.parse(rawLevels) : [];

                    const newLevel = {
                        levelName: extracted.name,
                        song: finalSongName,
                        songId: finalSongId,
                        levelId: (extracted.id === "0" || !extracted.id) ? "NA" : extracted.id,
                        levelString: extracted.data,
                        levelLength: extracted.length,
                        normalBest: 0,
                        practiceBest: 0,
                        description: extracted.desc || "",
                        version: extracted.version,
                        status: "Unverified",
                        createdId: this._getNextLocalId()
                    };

                    createdLevels.push(newLevel);
                    localStorage.setItem("created_levels", JSON.stringify(createdLevels));

                    this._closeEditorMenu(false);
                    this._openLevelView(newLevel);

                } catch (err) {
                    console.error("GMD Import Error:", err);
                    alert("Failed to parse .gmd: " + err.message);
                }
            };
            reader.readAsText(file);
        };

        fileInput.click();
    };
    this._escapeXml = (value) => {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    };
    this._decodeWebLevelStringForGMD = (levelString) => {
        if (!levelString) return "";
        try {
            let base64 = String(levelString)
                .trim()
                .replace(/-/g, "+")
                .replace(/_/g, "/");

            while (base64.length % 4 !== 0) {
                base64 += "=";
            }
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return pako.inflate(bytes, { to: "string" });
        } catch (err) {
            console.warn("Why the fuck didnt it work", err);
            return String(levelString);
        }
    };
    this._exportGMD = (level) => {
        const encodedDesc = btoa(unescape(encodeURIComponent(level.description || "")));
        const authorName = "Web Dashers";
        const officialSong = level.songId < 0 ? Math.abs(level.songId) : 0;
        const customSong = level.songId > 0 ? level.songId : 0;
        const rawLevelData = this._decodeWebLevelStringForGMD(level.levelString);
        const safeName = this._escapeXml(level.levelName || "Unnamed");
        const safeDesc = this._escapeXml(encodedDesc);
        const safeAuthor = this._escapeXml(authorName);
        const safeLevelData = this._escapeXml(rawLevelData);

        let xml = "";
        xml += '<?xml version="1.0"?>';
        xml += '<plist version="1.0" gjver="2.0">';
        xml += '<dict>';
        xml += '<k>kCEK</k><i>4</i>';
        xml += `<k>k1</k><i>${
            level.levelId && level.levelId !== "NA"
                ? String(level.levelId).replace(/\D/g, "")
                : 0
        }</i>`;
        xml += `<k>k2</k><s>${safeName}</s>`;
        xml += `<k>k3</k><s>${safeDesc}</s>`;
        xml += `<k>k4</k><s>${safeLevelData}</s>`;
        xml += `<k>k5</k><s>${safeAuthor}</s>`;
        xml += `<k>k8</k><i>${officialSong - 1}</i>`;
        xml += `<k>k45</k><i>${customSong}</i>`;
        xml += `<k>k16</k><i>${level.version || 1}</i>`;
        xml += `<k>k18</k><i>${level.levelLength || 0}</i>`;
        xml += `<k>k23</k><i>${level.levelLength || 0}</i>`;
        xml += '<k>k13</k><t/>';
        xml += '<k>k21</k><i>2</i>';
        xml += '<k>k50</k><i>47</i>';
        xml += '<k>k101</k><s>0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0</s>';
        xml += '<k>kI1</k><r>0</r>';
        xml += '<k>kI2</k><r>0</r>';
        xml += '<k>kI3</k><r>0.1</r>';
        xml += '<k>kI6</k><d>';
        xml += '<k>0</k><s>0</s><k>1</k><s>0</s><k>2</k><s>0</s><k>3</k><s>0</s>';
        xml += '<k>4</k><s>0</s><k>5</k><s>0</s><k>6</k><s>0</s><k>7</k><s>0</s>';
        xml += '<k>8</k><s>0</s><k>9</k><s>0</s><k>10</k><s>0</s><k>11</k><s>0</s>';
        xml += '<k>12</k><s>0</s><k>13</k><s>0</s>';
        xml += '</d>';
        xml += '</dict>';
        xml += '</plist>';

        const blob = new Blob([xml], { type: "text/xml" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        const fileName = `${String(level.levelName || "Unnamed").replace(/[^a-z0-9]/gi, "_")}.gmd`;

        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };
    this._getNextLocalId = () => {
        const rawData = localStorage.getItem("created_levels");
        const levels = rawData ? JSON.parse(rawData) : [];
        let maxId = 0;
        levels.forEach(l => {
            if (l.createdId && typeof l.createdId === "string") {
                const idNum = parseInt(l.createdId.split('_')[1]);
                if (!isNaN(idNum) && idNum > maxId) {
                    maxId = idNum;
                }
            }
        });
        return "local_" + (maxId + 1);
    };
    this._openLevelView = (level) => {
        const sw = screenWidth;
        const sh = screenHeight;
        const centerX = sw / 2;
        let storageWarningShown = false;
        const saveToLS = (key, val) => {
            const rawData = localStorage.getItem("created_levels");
            let levels = rawData ? JSON.parse(rawData) : [];
            const idx = levels.findIndex(l => l.createdId === level.createdId);
            if (idx !== -1) {
                levels[idx][key] = val;
                try {
                    window.gameCache.setItemWithQuotaRecovery("created_levels", JSON.stringify(levels));
                    storageWarningShown = false;
                } catch (err) {
                    if (!storageWarningShown) {
                        console.error("failed to save created level", err);
                        alert("browser storage full. empty pls");
                        storageWarningShown = true;
                    }
                }
            }
        };
        const deleteLevel = () => {
            if (!confirm(`Are you sure you want to delete ${level.levelName}?`)) return;
            const rawData = localStorage.getItem("created_levels");
            let levels = rawData ? JSON.parse(rawData) : [];
            levels = levels.filter(l => l.createdId !== level.createdId);
            localStorage.setItem("created_levels", JSON.stringify(levels));
            cleanup();
            this._openEditorMenu();
        };
        this._activeInput = null;
        let cursorVisible = true;

        const blocker = this.add.zone(centerX, sh / 2, sw, sh)
            .setOrigin(0.5).setDepth(101).setInteractive();
        blocker.on('pointerdown', () => { this._activeInput = null; });
        const overlay = this.add.graphics().setScrollFactor(0).setDepth(102);
        const gradientSteps = 80;
        for (let gi = 0; gi < gradientSteps; gi++) {
            const t = gi / (gradientSteps - 1);
            const r1 = Math.round(0x00 + (0x01 - 0x00) * t);
            const g1 = Math.round(0x65 + (0x2c - 0x65) * t);
            const b1 = Math.round(0xff + (0x71 - 0xff) * t);
            const bandColor = (r1 << 16) | (g1 << 8) | b1;
            overlay.fillStyle(bandColor, 1);
            overlay.fillRect(0, Math.floor(gi * sh / gradientSteps), sw, Math.ceil(sh / gradientSteps) + 1);
        }

        const container = this.add.container(0, 0).setDepth(150);
        const boxWidth = sw * 0.6;
        const cornerRad = 18;

        const nameY = 50;
        const nameBox = this.add.graphics().setDepth(151).setInteractive(new Phaser.Geom.Rectangle(centerX - (boxWidth / 2), nameY - 28, boxWidth, 70), Phaser.Geom.Rectangle.Contains);
        nameBox.fillStyle(0x000000, 0.3).fillRoundedRect(centerX - (boxWidth / 2), nameY - 28, boxWidth, 70, cornerRad);
        const titleText = this.add.bitmapText(centerX, nameY + 5, "bigFont", level.levelName, 45).setOrigin(0.5).setDepth(152);
        const titleCursor = this.add.bitmapText(0, nameY + 5, "bigFont", "|", 45).setOrigin(0, 0.5).setDepth(153).setVisible(false);

        const descY = 180;
        const descH = 120;
        const descBox = this.add.graphics().setDepth(151).setInteractive(new Phaser.Geom.Rectangle(centerX - (boxWidth / 2), descY - (descH / 2), boxWidth, descH), Phaser.Geom.Rectangle.Contains);
        descBox.fillStyle(0x000000, 0.3).fillRoundedRect(centerX - (boxWidth / 2), descY - (descH / 2), boxWidth, descH, cornerRad);
        const descText = this.add.text(centerX, descY, level.description || "Description [Optional]", {
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "22px",
            color: "#ffffff",
            align: "center",
            lineSpacing: 4,
            wordWrap: { width: boxWidth - 40, useAdvancedWrap: true }
        }).setOrigin(0.5).setDepth(152);
        const descCursor = this.add.text(0, 0, "|", { fontFamily: "Helvetica", fontSize: "18px", color: "#ffffff" })
            .setOrigin(0.5).setDepth(153).setVisible(false);

        const updateDisplay = () => {
            titleText.setText(level.levelName);
            if (this._activeInput === 'title') {
                titleCursor.setPosition(titleText.x + (titleText.width / 2) + 2, nameY + 5).setVisible(cursorVisible);
                descCursor.setVisible(false);
            }
            else if (this._activeInput === 'desc') {
                descText.setText(level.description || "");
                titleCursor.setVisible(false);

                const lines = descText.getWrappedText(level.description || "");
                const lineCount = lines.length;
                const lastLine = lines[lineCount - 1] || "";
                const metrics = descText.canvas.getContext('2d').measureText(lastLine);
                const lastLineWidth = metrics.width;

                const size = 22;
                const spacing = 4;
                const fullLineHeight = size + spacing;
                const totalHeight = (lineCount * fullLineHeight) - spacing;

                const topOfText = descY - (totalHeight / 2);
                const cursorY = topOfText + ((lineCount - 1) * fullLineHeight) + (size / 2);

                descCursor.setPosition(centerX + (lastLineWidth / 2) + 2, cursorY).setVisible(cursorVisible);
            } else {
                descText.setText(level.description || "Description [Optional]");
                titleCursor.setVisible(false);
                descCursor.setVisible(false);
            }
        };

        const cursorInterval = setInterval(() => {
            cursorVisible = !cursorVisible;
            updateDisplay();
        }, 500);

        const keyHandler = (event) => {
            if (!this._activeInput) return;
            if (event.key === "Backspace") {
                if (this._activeInput === 'title') level.levelName = level.levelName.slice(0, -1);
                else level.description = (level.description || "").slice(0, -1);
            } else if (event.key === "Enter") {
                this._activeInput = null;
            } else if (event.key.length === 1) {
                if (this._activeInput === 'title' && level.levelName.length < 20) {
                    level.levelName += event.key;
                } else if (this._activeInput === 'desc' && (level.description || "").length < 150) {
                    level.description = (level.description || "") + event.key;
                }
            }
            saveToLS(this._activeInput === 'title' ? "levelName" : "description",
                    this._activeInput === 'title' ? level.levelName : level.description);
            cursorVisible = true;
            updateDisplay();
        };

        window.addEventListener('keydown', keyHandler);
        nameBox.on('pointerdown', () => { this._activeInput = 'title'; updateDisplay(); });
        descBox.on('pointerdown', () => { this._activeInput = 'desc'; updateDisplay(); });

        const cleanup = () => {
            clearInterval(cursorInterval);
            window.removeEventListener('keydown', keyHandler);
            container.destroy();
            overlay.destroy();
            blocker.destroy();
            this._levelViewOverlay = null;
            this._closeLevelView = null;
        };
        this._levelViewOverlay = overlay;
        this._closeLevelView = () => { cleanup(); this._openEditorMenu(); };

        const fadeIn = this.add.graphics().setScrollFactor(0).setDepth(200);
        fadeIn.fillStyle(0x000000, 1);
        fadeIn.fillRect(0, 0, sw, sh);
        this.tweens.add({ targets: fadeIn, alpha: 0, duration: 350, ease: "Linear", onComplete: () => fadeIn.destroy() });

        const cornerBR = this.add.image(sw, sh, "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setDepth(152).setOrigin(1, 1).setFlipX(true);
        const cornerBL = this.add.image(0, sh, "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setDepth(152).setOrigin(0, 1);

        const btnY = sh * 0.58;
        const editBtn = this.add.image(centerX - 220, btnY, "GJ_GameSheet03", "GJ_editBtn_001.png").setInteractive().setScale(1.1);
        this._makeBouncyButton(editBtn, 1.1, () => { cleanup(); this._startCreatedLevel(level, true); });
        const playBtn = this.add.image(centerX, btnY, "GJ_GameSheet03", "GJ_playBtn2_001.png").setInteractive().setScale(1.1);
        let playBtnLoading = false;
        this._makeBouncyButton(playBtn, 1.1, async () => {
            if (playBtnLoading) return;
            playBtnLoading = true;
            this._audio.playEffect("playSound_01", { volume: 1 });
            playBtn.setTint(0x666666);
            playBtn.disableInteractive();

            let started = false;
            try {
                started = await this._startCreatedLevel(level, false, cleanup);
            } catch (err) {
                console.warn("Failed to start saved level", err);
            }

            if (!started && playBtn.scene) {
                playBtnLoading = false;
                playBtn.clearTint();
                playBtn.setInteractive();
            }
        }, () => !playBtnLoading);
        const shareBtn = this.add.image(centerX + 220, btnY, "GJ_GameSheet03", "GJ_shareBtn_001.png").setInteractive().setScale(1.1);
        this._makeBouncyButton(shareBtn, 1.1, () => { this._exportGMD(level); });
        const backBtn = this.add.image(50, 48, "GJ_GameSheet03", "GJ_arrow_03_001.png").setFlipX(true).setFlipY(true).setRotation(Math.PI).setInteractive();
        this._makeBouncyButton(backBtn, 1, () => { this._closeLevelView(); });
        const deleteBtn = this.add.image(sw - 50, 48, "GJ_GameSheet03", "GJ_deleteBtn_001.png").setInteractive().setScale(0.8);
        this._makeBouncyButton(deleteBtn, 0.8, () => { deleteLevel(); });

        const footerY = sh - 100;
        const subFooterY = sh - 30;
        const lengthValues = ["Tiny", "Short", "Medium", "Long", "XL", "Plat."]

        const lengthIcon = this.add.image(centerX - 350, footerY, "GJ_GameSheet03", "GJ_timeIcon_001.png").setScale(1).setDepth(152);
        const lengthLabel = this.add.bitmapText(centerX - 310, footerY, "bigFont", lengthValues[parseInt(level.levelLength, 10)] || "Tiny", 33).setOrigin(0, 0.5).setDepth(152);
        const songIcon = this.add.image(centerX - 160, footerY, "GJ_GameSheet03", "GJ_musicIcon_001.png").setScale(1).setDepth(152);
        const songLabel = this.add.bitmapText(centerX - 115, footerY, "bigFont", level.song, 29).setOrigin(0, 0.5).setDepth(152);
        const statusIcon = this.add.image(centerX + 200, footerY, "GJ_GameSheet03", "GJ_infoIcon_001.png").setScale(1).setDepth(152);
        const songLabelMaxW = Math.max(40, (statusIcon.x - 30) - songLabel.x);
        songLabel.setScale(1);
        if (songLabel.width > songLabelMaxW) {
            songLabel.setScale(songLabelMaxW / songLabel.width);
        }
        const statusLabel = this.add.bitmapText(centerX + 245, footerY, "bigFont", level.status, 33).setOrigin(0, 0.5).setDepth(152);
        const versionText = this.add.bitmapText(centerX - 180, subFooterY, "goldFont", `Version: ${level.version || 1}`, 30).setOrigin(0.5).setDepth(152);
        const idText = this.add.bitmapText(centerX + 180, subFooterY, "goldFont", `ID: ${level.levelId || "na"}`, 30).setOrigin(0.5).setDepth(152);

      container.add([nameBox, titleText, titleCursor, descBox, descText, descCursor, playBtn, editBtn, shareBtn, backBtn, deleteBtn, lengthIcon, lengthLabel, songIcon, songLabel, statusIcon, statusLabel, versionText, idText, cornerBR, cornerBL]);
    };
    this._startCreatedLevel = async (level, isEditor, onBeforeRestart = null) => {
        const PROXY_BASE = (window._gdProxyUrl || "").replace(/\/$/, "");
        window._onlineLevelString = level.levelString;
        window._onlineLevelName = level.levelName;
        window._onlineLevelId = level.createdId;
        if (!isEditor) {
          window._createdLevelReturnToView = {
            createdId: level.createdId,
            snapshot: { ...level }
          };
        }
        window._onlineSongBuffer = null;
        window._onlineSongKey = null;
        window._onlineSongOffset = 0;
        window.isEditor = !!isEditor;
        this.game.registry.set("autoStartGame", true);
        window.currentlevel = [
            "Placeholder",
            level.levelName,
            level.createdId,
            ["Local", "SongAuthor"]
        ];
        if (level.songId < 0){
          window.currentlevel[0] = window.allLevels[Math.abs(level.songId) - 1][0];
          window.currentlevel[3] = ["Local", window.allLevels[Math.abs(level.songId) - 1][3]]
        } else {
          const songId = level.songId;
          const songKey = `ng_song_${songId}`;
          window.currentlevel[0] = songKey;

          if (PROXY_BASE && songId > 0) {
              try {
                  const ngRes = await fetch(`${PROXY_BASE}/getGJSongInfo.php`, {
                      method: "POST",
                      headers: { "Content-Type": "application/x-www-form-urlencoded" },
                      body: `songID=${songId}&secret=Wmfd2893gb7`
                  });

                  const ngText = ngRes.ok ? await ngRes.text() : "-1";
                  if (ngText && ngText !== "-1") {
                      const ngParts = ngText.split("~|~");
                      const ngMap = {};
                      for (let i = 0; i + 1 < ngParts.length; i += 2) ngMap[ngParts[i]] = ngParts[i + 1];

                      const songUrl = decodeURIComponent((ngMap["10"] || "").trim());
                      const songArtist = (ngMap["4"] || "Unknown").replace(/:$/, "").trim();
                      const songTitle = (ngMap["2"] || `Song #${songId}`).replace(/:$/, "").trim();

                      if (songUrl) {
                          const audioCtx = this.game.sound.context;
                          if (audioCtx.state === "suspended") await audioCtx.resume();
                          const proxiedUrl = songUrl.includes("geometrydashfiles.b-cdn.net")
                            ? songUrl
                            : `${PROXY_BASE}/audio-proxy?url=${encodeURIComponent(songUrl)}`;
                          const audioRes = await fetch(proxiedUrl);
                          const arrayBuf = await audioRes.arrayBuffer();
                          const decoded = await audioCtx.decodeAudioData(arrayBuf);
                          window._onlineSongBuffer = decoded;
                          window._onlineSongKey = songKey;
                          window._onlineSongTitle = songTitle;
                          window._onlineSongArtist = songArtist;

                          window.currentlevel[3] = ["Local", window._onlineSongArtist]
                      }
                  }
              } catch (err) {
                  console.warn("Failed to load custom song", err);
              }
          }
        }
        if (onBeforeRestart) onBeforeRestart();
        this.scene.restart();
        return true;
    };
    this._closeEditorMenu = () => {
        if (this._editorObjects) {
            this._editorObjects.forEach(obj => obj.destroy());
        }
        this._editorOverlay = null;
        this._editorObjects = null;
    };
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
      const backBtn = this.add.image(50, 48, "GJ_GameSheet03", "GJ_arrow_01_001.png")
        .setScrollFactor(0).setDepth(104).setFlipX(true).setFlipY(true)
        .setRotation(Math.PI).setInteractive();
      this._makeBouncyButton(backBtn, 1, () => { this._closeSearchMenu(false, () => this._openCreatorMenu()); });

      const cornerBR = this.add.image(sw, sh, "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setDepth(152).setOrigin(1, 1).setFlipX(true);
      const cornerBL = this.add.image(0, sh, "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setDepth(152).setOrigin(0, 1);
      const panelMarginX = sw * 0.18;
      const panelLeft = panelMarginX;
      const panelRight = sw - panelMarginX;
      const panelW = panelRight - panelLeft;
      const panelRadius = 10;
      const panelColor = 0x002e75;
      const topPanelColor = 0x00388d;
      const innerPanelColor = 0x002762;
      const filtersPanelColor = 0x00245b;
      const extraPanelColor = 0x001f4f;
      const panelAlpha = 0.7;
      const labelSize = 32;
      const labelColor = 0xffffff;
      const gfx = this.add.graphics().setScrollFactor(0).setDepth(104);
      const topPanelY = sh * 0.10 - 40;
      const topPanelH = sh * 0.12;
      gfx.fillStyle(topPanelColor, panelAlpha);
      gfx.fillRoundedRect(panelLeft, topPanelY, panelW, topPanelH, panelRadius);
      const innerPanelY = topPanelY + 10;
      const innerPanelX = panelLeft + 10;
      const innerPanelW = panelW * 0.57;
      const innerPanelH = topPanelH - 20;
      gfx.fillStyle(innerPanelColor, panelAlpha);
      gfx.fillRoundedRect(innerPanelX, innerPanelY, innerPanelW, innerPanelH, panelRadius);

      const innerBtnX = innerPanelX + innerPanelW + 20;
      const innerBtnY = innerPanelY + (innerPanelH / 2);

      const innerBtn2 = this.add.image(innerBtnX + 137, innerBtnY, "GJ_GameSheet03", "GJ_longBtn05_001.png")
        .setScrollFactor(0).setDepth(105).setOrigin(0.5, 0.5).setInteractive();
      this._makeBouncyButton(innerBtn2, 1, () => {});
      const innerBtn1 = this.add.image(innerBtnX + 47, innerBtnY, "GJ_GameSheet03", "GJ_longBtn06_001.png")
        .setScrollFactor(0).setDepth(105).setOrigin(0.5, 0.5).setInteractive();
      this._makeBouncyButton(innerBtn1, 1, () => { _doSearch(); });

      const innerBtn3 = this.add.image(innerBtnX + 231, innerBtnY, "GJ_GameSheet03", "GJ_longBtn07_001.png")
        .setScrollFactor(0).setDepth(105).setOrigin(0.5, 0.5).setInteractive();
      this._makeBouncyButton(innerBtn3, 1, () => { inputText = ""; _updateInputDisplay(); });

      const allowedChars = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const inputMaxLen = 20;
      const inputCX = innerPanelX + innerPanelW / 2;
      const inputCY = innerPanelY + innerPanelH / 2;

      let inputText = "";
      let inputFocused = false;
      let cursorVisible = false;
      let cursorTimer = null;
      const placeholderLabel = this.add.bitmapText(inputCX - 5, inputCY, "bigFont", "Enter a level, user or id", 28)
        .setScrollFactor(0).setDepth(106).setOrigin(0.5, 0.5)
        .setTint(0x6c99d8).setAlpha(0.85);
      const typedLabel = this.add.bitmapText(innerPanelX + 10, inputCY, "bigFont", "", 46)
        .setScrollFactor(0).setDepth(106).setOrigin(0, 0.5)
        .setTint(0xffffff).setVisible(false);
      const inputCursor = this.add.text(0, inputCY, "|", {
        fontSize: "33px", fontFamily: "Arial", color: "#92a7c0"
      }).setScrollFactor(0).setDepth(106).setOrigin(0.5, 0.5).setVisible(false);

      const _updateInputDisplay = () => {
        if (inputText === "") {
          typedLabel.setVisible(false);
          placeholderLabel.setVisible(true);
          placeholderLabel.setScale(1);
        } else {
          placeholderLabel.setVisible(false);
          typedLabel.setText(inputText).setVisible(true);
          typedLabel.setScale(1);
          const natW = typedLabel.width;
          const maxW = innerPanelW - 24;
          if (natW > maxW) {
            typedLabel.setScale(maxW / natW);
          }
        }
        if (inputFocused) {
          const textW = inputText === "" ? 0 : typedLabel.displayWidth;
          const textLeft = innerPanelX + 10;
          inputCursor.x = textLeft + textW + 4;
          inputCursor.setVisible(cursorVisible);
        } else {
          inputCursor.setVisible(false);
        }
      };

      const _startCursorBlink = () => {
        cursorVisible = true;
        _updateInputDisplay();
        if (cursorTimer) cursorTimer.remove();
        cursorTimer = null;
      };

      const _stopCursorBlink = () => {
        if (cursorTimer) { cursorTimer.remove(); cursorTimer = null; }
        cursorVisible = false;
        inputCursor.setVisible(false);
      };

      const _focusInput = () => {
        inputFocused = true;
        _startCursorBlink();
      };

      const _blurInput = () => {
        inputFocused = false;
        _stopCursorBlink();
        _updateInputDisplay();
      };
      const inputHitZone = this.add.zone(
        innerPanelX + innerPanelW / 2, innerPanelY + innerPanelH / 2,
        innerPanelW, innerPanelH
      ).setScrollFactor(0).setDepth(107).setInteractive();
      inputHitZone.on("pointerdown", () => _focusInput());

      blocker.on("pointerdown", () => { if (inputFocused) _blurInput(); });
      const _onKeyDown = (event) => {
        if (!inputFocused) return;
        event.stopPropagation();
        if (event.key === "Backspace") {
          if (inputText.length > 0) {
            inputText = inputText.slice(0, -1);
            _updateInputDisplay();
          }
        } else if (event.key === "Enter") {
          _doSearch();
          } else if (event.ctrlKey || event.metaKey) {
          if (event.key === "c" || event.key === "C") {
            event.preventDefault();
            navigator.clipboard.writeText(inputText);
          } else if (event.key === "v" || event.key === "V") {
            event.preventDefault();
            navigator.clipboard.readText().then(pastedText => {
              const filtered = pastedText.split('').filter(c => allowedChars.includes(c)).join('');
              if (filtered.length > 0) {
                const availableSpace = inputMaxLen - inputText.length;
                inputText += filtered.slice(0, availableSpace);
                _updateInputDisplay();
              }
            }).catch(() => {});
          } else if (event.key === "a" || event.key === "A") {
            event.preventDefault();
          }
        } else if (event.key.length === 1 && allowedChars.includes(event.key) && !event.ctrlKey) {
          if (inputText.length < inputMaxLen) {
            inputText += event.key;
            _updateInputDisplay();
          }
        }
      };
      window.addEventListener("keydown", _onKeyDown);

      const htmlInput = {
        remove: () => {
          window.removeEventListener("keydown", _onKeyDown);
          window.removeEventListener("keydown", _onEnterKeydown);
          window.removeEventListener("keyup", _onKeyUpStop);
          window.removeEventListener("keypress", _onKeyPressStop);
          _blurInput();
        },
        get value() { return inputText; },
      };
      const _onEnterKeydown = (e) => {
        if (e.key === "Enter") _doSearch();
        e.stopPropagation();
      };
      const _onKeyUpStop = (e) => e.stopPropagation();
      const _onKeyPressStop = (e) => e.stopPropagation();
      window.addEventListener("keydown", _onEnterKeydown);
      window.addEventListener("keyup", _onKeyUpStop);
      window.addEventListener("keypress", _onKeyPressStop);
      const _repositionInput = () => {};
      const qsLabelY = sh * 0.195;
      const qsPanelY = qsLabelY + 25;
      const qsPanelH = sh * 0.36;
      const qsLabel = this.add.bitmapText(sw / 2, qsLabelY, "bigFont", "Quick Search", labelSize)
        .setScrollFactor(0).setDepth(105).setOrigin(0.5, 0.5).setTint(labelColor);

      gfx.fillStyle(panelColor, panelAlpha);
      gfx.fillRoundedRect(panelLeft, qsPanelY, panelW, qsPanelH, panelRadius);
      const gridRows = 3;
      const gridCols = 3;
      const qsPadX = 14;
      const qsPadY = 14.5;
      const qsGapX = 10;
      const qsGapY = 12;
      const totalBtnW = panelW - qsPadX * 2;
      const totalBtnH = qsPanelH - qsPadY * 2;
      const btnW = (totalBtnW - qsGapX * (gridCols - 1)) / gridCols;
      const btnH = (totalBtnH - qsGapY * (gridRows - 1)) / gridRows;

      const lbFrame = this.textures.getFrame("GJ_GameSheet03", "GJ_longBtn01_001.png");
      const lbBorder = Math.round(lbFrame.height * 0.28);

      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const btnCX = panelLeft + qsPadX + col * (btnW + qsGapX) + btnW / 2;
          const btnCY = qsPanelY + qsPadY + row * (btnH + qsGapY) + btnH / 2;

          const btnContainer = this.add.container(btnCX, btnCY).setScrollFactor(0).setDepth(105);
          const borderSize = Math.min(lbBorder, btnW / 2, btnH / 2);
          const buttonBg = this.add.nineslice(
            0, 0, "GJ_GameSheet03", "GJ_longBtn01_001.png", btnW, btnH,
            borderSize, borderSize, borderSize, borderSize
          ).setOrigin(0.5);
          btnContainer.add(buttonBg);

          const hitZone = this.add.zone(0, 0, btnW, btnH).setInteractive();
          btnContainer.add(hitZone);

          const qsLabels = [
            ["Downloads", "Likes", "Sent" ],
            ["Trending", "Recent", "Magic" ],
            ["Awarded", "Followed", "Friends"],
          ];
          const qsIcons = [
            ["GJ_sDownloadIcon_001.png", "GJ_sLikeIcon_001.png", "GJ_sModIcon_001.png" ],
            ["GJ_sTrendingIcon_001.png", "GJ_sRecentIcon_001.png", "GJ_sMagicIcon_001.png" ],
            ["GJ_sStarsIcon_001.png", "GJ_sFollowedIcon_001.png", "GJ_sFriendsIcon_001.png"],
          ];
          const labelStr = qsLabels[row][col];
          const iconFrame = qsIcons[row][col];
          const fontSize = labelStr === "Downloads" ? 26 : 32;

          const gap = 10;
          const tmpLbl = this.add.bitmapText(0, -9999, "bigFont", labelStr, fontSize).setOrigin(0, 0.5);
          const measuredW = tmpLbl.width;
          tmpLbl.destroy();

          const qsIconSizes = {
            "GJ_sDownloadIcon_001.png": { w: 30, h: 30, scale: 1 },
            "GJ_sLikeIcon_001.png": { w: 31, h: 37, scale: 1 },
            "GJ_sModIcon_001.png": { w: 31, h: 31, scale: 1 },
            "GJ_sTrendingIcon_001.png": { w: 33, h: 25, scale: 1 },
            "GJ_sRecentIcon_001.png": { w: 31, h: 29, scale: 1 },
            "GJ_sMagicIcon_001.png": { w: 33, h: 30, scale: 1 },
            "GJ_sStarsIcon_001.png": { w: 30, h: 29, scale: 1 },
            "GJ_sFollowedIcon_001.png": { w: 31, h: 29, scale: 1 },
            "GJ_sFriendsIcon_001.png": { w: 35, h: 29, scale: 1 },
          };
          const iconConfig = qsIconSizes[iconFrame];
          const iconScale = Math.min(iconConfig.scale, Math.max(0, btnH - 12) / Math.max(iconConfig.w, iconConfig.h));
          const iconW = iconConfig.w * iconScale;
          const labelScale = Math.max(0, Math.min(1, (btnW - 24 - iconW - gap) / measuredW));
          const labelW = measuredW * labelScale;
          const groupW = labelW + gap + iconW;
          const groupLeft = -groupW / 2;
          const lbl = this.add.bitmapText(groupLeft, -1, "bigFont", labelStr, fontSize)
            .setOrigin(0, 0.5).setScale(labelScale).setScrollFactor(0).setDepth(106);
          btnContainer.add(lbl);
          const iconCX = groupLeft + labelW + gap + iconW / 2;
          const iconY = iconFrame === "GJ_sLikeIcon_001.png" ? 2 : (labelStr === "Downloads" ? -2 : -1);
          const icon = this.add.image(iconCX, iconY, "GJ_GameSheet03", iconFrame)
            .setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(106)
            .setScale(iconScale);
          btnContainer.add(icon);
          const buttonTypes = {
            "Downloads": 1,
            "Likes": 2,
            "Trending": 3,
            "Recent": 4,
            "Magic": 7,
            "Awarded": 11,
          };
          const type = buttonTypes[labelStr];
          if (!type) {
            this._applyLockedGray(lbl);
            this._applyLockedGray(icon);
            this._applyLockedGray(buttonBg);
          }
          if (type) {
            const baseScale = 1;
            const pressedScale = baseScale * 1.26;
            hitZone.on("pointerdown", () => {
              hitZone._pressed = true;
              this.tweens.killTweensOf(btnContainer, "scale");
              this.tweens.add({ targets: btnContainer, scale: pressedScale, duration: 300, ease: "Bounce.Out" });
            });
            hitZone.on("pointerout", () => {
              if (hitZone._pressed) {
                hitZone._pressed = false;
                this.tweens.killTweensOf(btnContainer, "scale");
                this.tweens.add({ targets: btnContainer, scale: baseScale, duration: 400, ease: "Bounce.Out" });
              }
            });
            hitZone.on("pointerup", () => {
              if (hitZone._pressed) {
                hitZone._pressed = false;
                this.tweens.killTweensOf(btnContainer, "scale");
                btnContainer.setScale(baseScale);
                this._closeSearchMenu(true);
                const searchParams = { type };
                const diffParam = _getActiveDiffParam();
                if (diffParam) {
                  searchParams.diff = diffParam;
                  const demonIcon = this._diffFilterIcons && this._diffFilterIcons[6];
                  if (demonIcon && demonIcon._diffFilterActive && this._selectedDemonTier) {
                    searchParams.demonFilter = this._selectedDemonTier;
                  }
                }
                this._openOnlineLevelsScene(searchParams);
              }
            });
          } else {
            this._makeBouncyButton(hitZone, 1, () => {});
          }
          this._searchOverlayObjects.push(btnContainer);
        }
      }
      const filtersLabelY = qsPanelY + qsPanelH + 24;
      const filtersPanelY = filtersLabelY + 20;
      const filtersPanelH = sh * 0.16;
      const filtersLabel = this.add.bitmapText(sw / 2, filtersLabelY, "bigFont", "Filters", labelSize)
        .setScrollFactor(0).setDepth(105).setOrigin(0.5, 0.5).setTint(labelColor);

      gfx.fillStyle(filtersPanelColor, panelAlpha);
      gfx.fillRoundedRect(panelLeft, filtersPanelY, panelW, filtersPanelH, panelRadius);
      const _diffFilterFrames = [
        "difficulty_00_btn_001.png", "difficulty_01_btn_001.png", "difficulty_02_btn_001.png",
        "difficulty_03_btn_001.png", "difficulty_04_btn_001.png", "difficulty_05_btn_001.png",
        "difficulty_06_btn_001.png", "difficulty_auto_btn_001.png"
      ];
      const _diffFilterCount = _diffFilterFrames.length;
      const _diffFilterSlotW = panelW / _diffFilterCount;
      const _diffFilterIconY = filtersPanelY + filtersPanelH / 2;
      this._diffFilterIcons = [];
      const _diffFilterInactiveTint = 0x666666;
      const _diffFilterBaseScale = 0.85;
      const _diffFilterPressScale = 1;
      const _diffFilterExclusiveIdx = [0, 6, 7];
      _diffFilterFrames.forEach((frame, i) => {
        const cx = panelLeft + _diffFilterSlotW * i + _diffFilterSlotW / 2;
        const icon = this.add.image(cx, _diffFilterIconY, "GJ_GameSheet03", frame)
          .setScrollFactor(0).setDepth(105).setOrigin(0.5)
          .setScale(_diffFilterBaseScale)
          .setInteractive()
          .setTint(_diffFilterInactiveTint);
        icon._diffFilterActive = false;
        icon._diffFilterExclusive = _diffFilterExclusiveIdx.includes(i);
        this._diffFilterIcons.push(icon);

        icon.on("pointerdown", () => {
          icon._pressed = true;
          this.tweens.killTweensOf(icon, "scale");
          this.tweens.add({ targets: icon, scale: _diffFilterPressScale, duration: 300, ease: "Bounce.Out" });
        });
        icon.on("pointerout", () => {
          if (icon._pressed) {
            icon._pressed = false;
            this.tweens.killTweensOf(icon, "scale");
            this.tweens.add({ targets: icon, scale: _diffFilterBaseScale, duration: 400, ease: "Bounce.Out" });
          }
        });
        icon.on("pointerup", () => {
          if (!icon._pressed) return;
          icon._pressed = false;
          this.tweens.killTweensOf(icon, "scale");
          icon.setScale(_diffFilterBaseScale);
          const wasActive = icon._diffFilterActive;
          if (icon._diffFilterExclusive) {
            this._diffFilterIcons.forEach(other => {
              other.setTint(_diffFilterInactiveTint);
              other._diffFilterActive = false;
            });
            if (!wasActive) {
              icon.clearTint();
              icon._diffFilterActive = true;
            }
          } else {
            this._diffFilterIcons.forEach(other => {
              if (other._diffFilterExclusive && other._diffFilterActive) {
                other.setTint(_diffFilterInactiveTint);
                other._diffFilterActive = false;
              }
            });
            if (wasActive) {
              icon.setTint(_diffFilterInactiveTint);
              icon._diffFilterActive = false;
            } else {
              icon.clearTint();
              icon._diffFilterActive = true;
            }
          }
          this._refreshDemonFilterPlus();
        });
        this._searchOverlayObjects.push(icon);
      });
      const _demonPlusX = panelRight + 42;
      const _demonPlusY = filtersPanelY + filtersPanelH / 2;
      const demonPlusBtn = this.add.image(_demonPlusX, _demonPlusY, "GJ_GameSheet03", "GJ_plus2Btn_001.png")
        .setScrollFactor(0).setDepth(105).setOrigin(0.5)
        .setInteractive().setVisible(false);
      this._demonFilterPlusBtn = demonPlusBtn;
      this._makeBouncyButton(demonPlusBtn, 1, () => { this._buildDemonFilterPopup(); }, () => demonPlusBtn.visible);
      this._searchOverlayObjects.push(demonPlusBtn);

      this._refreshDemonFilterPlus = () => {
        const demonIcon = this._diffFilterIcons[6];
        if (demonPlusBtn && demonPlusBtn.scene) {
          demonPlusBtn.setVisible(!!(demonIcon && demonIcon._diffFilterActive));
        }
      };
      this._refreshDemonFilterPlus();

      const extraPanelY = filtersPanelY + filtersPanelH + 18;
      const extraPanelH = sh * 0.11;
      gfx.fillStyle(extraPanelColor, panelAlpha);
      gfx.fillRoundedRect(panelLeft, extraPanelY, panelW, extraPanelH, panelRadius);

      const extraComingSoon = this.add.bitmapText(sw / 2, extraPanelY + extraPanelH / 2, "bigFont", "Coming Soon!", 42)
        .setScrollFactor(0).setDepth(105).setOrigin(0.5, 0.5).setTint(0xadd8e6).setAlpha(0.75);

      this._searchOverlayObjects.push(gfx, qsLabel, filtersLabel, cornerBR, cornerBL,
        placeholderLabel, typedLabel, inputCursor, inputHitZone, innerBtn1, innerBtn2, innerBtn3,
        extraComingSoon);

      let _loading = false;
      const _diffFilterCodeMap = [-1, 1, 2, 3, 4, 5, -2, -3];
      const _getActiveDiffParam = () => {
        const icons = this._diffFilterIcons || [];
        const activeCodes = [];
        icons.forEach((icon, idx) => {
          if (icon._diffFilterActive) activeCodes.push(_diffFilterCodeMap[idx]);
        });
        return activeCodes.length ? activeCodes.join(",") : null;
      };
      const _doSearch = async () => {
        if (_loading) return;
        const rawInput = htmlInput.value.trim();
        if (rawInput && /^\d+$/.test(rawInput)) {
          const levelId = rawInput;
          _loading = true;
          try {
            await _doSearchInner(levelId);
          } catch (err) {
            this._showServerErrorPopup();
          } finally {
            _loading = false;
          }
          return;
        }
        htmlInput.remove();
        window.removeEventListener("resize", _repositionInput);
        this._closeSearchMenu(true);
        const diffParam = _getActiveDiffParam();
        const searchParams = rawInput ? { type: 0, str: rawInput } : { type: 2 };
        if (diffParam) {
          searchParams.diff = diffParam;
          const demonIcon = this._diffFilterIcons && this._diffFilterIcons[6];
          if (demonIcon && demonIcon._diffFilterActive && this._selectedDemonTier) {
            searchParams.demonFilter = this._selectedDemonTier;
          }
        }
        this._openOnlineLevelsScene(searchParams);
      };
      const _doSearchInner = async (levelId) => {
        const PROXY_BASE = (window._gdProxyUrl || "").replace(/\/$/, "");
        if (!PROXY_BASE) { console.warn("Level search: window._gdProxyUrl is not configured"); this._showServerErrorPopup(); return; }
        const formBody = `levelID=${levelId}&secret=Wmfd2893gb7`;
        const res = await fetch(`${PROXY_BASE}/downloadGJLevel22.php`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formBody
        });
        if (!res.ok) throw new Error(`Proxy returned ${res.status}`);
        const rawResponse = await res.text();
        if (!rawResponse || rawResponse === "-1" || !rawResponse.includes(":")) {
          return;
        }

        const responseSegments = rawResponse.split("#");
        const lvlParts = responseSegments[0].split(":");
        const lvlMap = {};
        for (let i = 0; i + 1 < lvlParts.length; i += 2) {
          lvlMap[lvlParts[i]] = lvlParts[i + 1];
        }

        const levelData = {

          id: lvlMap["1"] || levelId,
          title: (lvlMap["2"] || "Online Level").trim(),
          description: lvlMap["3"] ? atob(lvlMap["3"].replace(/-/g, '+').replace(/_/g, '/')) : "",
          string: lvlMap["4"] || null,
          version: parseInt(lvlMap["5"]) || 1,

          playerID: lvlMap["6"] || null,
          accountID: lvlMap["57"] || null,

          officialSong: lvlMap["12"] || "0",
          customSongID: (lvlMap["35"] || "").trim(),
          isCustomSong: !!(lvlMap["35"] || "").trim() && (lvlMap["35"] || "").trim() !== "0",
          isLibrarySong: !!(lvlMap["35"] || "").trim() && (lvlMap["35"] || "").trim() !== "0" && parseInt((lvlMap["35"] || "").trim()) >= 1000000,
          offset: parseFloat(lvlMap["45"] || "0") || 0,

          difficulty: (() => {
            const isDemon = parseInt(lvlMap["17"]) === 1;
            const isAuto = parseInt(lvlMap["25"]) === 1;
            if (isAuto) return 11;
            if (isDemon) {
              const d9 = parseInt(lvlMap["9"]);
              const d43 = parseInt(lvlMap["43"]);
              if (!isNaN(d9) && d9 >= 1 && d9 <= 5) {
                return [7, 8, 6, 9, 10][d9 - 1] ?? 8;
              } else if (!isNaN(d43)) {
                const demonMap43 = { 3: 7, 4: 8, 0: 6, 5: 9, 6: 10 };
                return demonMap43.hasOwnProperty(d43) ? demonMap43[d43] : 8;
              }
              return 8;
            }
            return Math.min(5, Math.max(0, Math.round((parseInt(lvlMap["9"]) || 0) / 10)));
          })(),
          stars: parseInt(lvlMap["18"]) || 0,
          diamonds: parseInt(lvlMap["46"]) || 0,
          orbs: parseInt(lvlMap["48"]) || 0,
          length: parseInt(lvlMap["15"]) || 0,
          featured: (parseInt(lvlMap["19"]) || 0) > 0,
          epic: parseInt(lvlMap["42"]) || 0,
          gameVersion: parseInt(lvlMap["13"]) || 22,
          binaryVersion: parseInt(lvlMap["52"]) || 0,

          downloads: parseInt(lvlMap["10"]) || 0,
          likes: parseInt(lvlMap["14"]) || 0,
          objects: parseInt(lvlMap["45"]) || 0,
          ts: lvlMap["28"] || null,

          chk: lvlMap["chk"] || null,
          rs: lvlMap["rs"] || null
        };
        console.groupCollapsed("level data");
        const { string, ...tableFriendlyData } = levelData;
        console.table(tableFriendlyData);
        console.groupEnd();

        let authorName = "Unknown";
        let songNameForCell = levelData.isCustomSong
          ? ("Song #" + levelData.customSongID)
          : (window.allLevels && window.allLevels[levelData.officialSong] ? window.allLevels[levelData.officialSong][1] : "Unknown");
        try {
          const infoRes = await fetch(`https://gdbrowser.com/api/level/${levelData.id}`);
          if (infoRes.ok) {
            const infoData = await infoRes.json();
            if (infoData) {
              if (infoData.author) authorName = infoData.author;
              if (infoData.songName) songNameForCell = infoData.songName;
            }
          }
        } catch (_e) {}

        const cellData = {
          ...levelData,
          name: levelData.title,
          author: authorName,
          songName: songNameForCell
        };

        htmlInput.remove();
        window.removeEventListener("resize", _repositionInput);
        this._closeSearchMenu(true);
        this._openSearchResultScene(cellData);
      };
      this._searchOverlayObjects.push(overlay, blocker, backBtn);
      if (window.levelID && !window.alreadydownloaded) { // if there's an ID parameter, load it directly
        window.alreadydownloaded = true;
        htmlInput.remove();
        const loadingBg = this.add.graphics().setScrollFactor(0).setDepth(1000);
        loadingBg.fillStyle(0x000000, 1);
        loadingBg.fillRect(0, 0, sw, sh);
        const loadingText = this.add.bitmapText(sw / 2, sh / 2, "bigFont", "Loading level...", 30)
          .setScrollFactor(0).setDepth(1001).setOrigin(0.5);
        this._searchOverlayObjects.push(loadingBg, loadingText);
        _doSearchInner(window.levelID);
      }
      this._searchHtmlInput = htmlInput;
      this._searchInputResizeFn = _repositionInput;
    };
    this._closeSearchMenu = (silent = false, onComplete = null) => {
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
      if (silent) { destroy(); if (onComplete) onComplete(); return; }
      const sw = screenWidth, sh = screenHeight;
      const fadeOut = this.add.graphics().setScrollFactor(0).setDepth(200).setAlpha(0);
      fadeOut.fillStyle(0x000000, 1);
      fadeOut.fillRect(0, 0, sw, sh);
      this.tweens.add({
        targets: fadeOut, alpha: 1, duration: 150, ease: "Linear",
        onComplete: () => {
          destroy();
          if (onComplete) onComplete();
          this.tweens.add({ targets: fadeOut, alpha: 0, duration: 150, ease: "Linear", onComplete: () => fadeOut.destroy() });
        }
      });
    };
    this._makeBouncyButton(this._creatorBtn, 1, () => {
      this._openCreatorMenu();
    }, () => this._menuActive && !this._levelSelectOverlay);

    this._iconBtn = this.add.image(0, 0, "GJ_GameSheet03", "GJ_garageBtn_001.png").setScrollFactor(0).setDepth(30).setInteractive().setScale(1);
    this._iconBtnSelected = false;
    this._makeBouncyButton(this._iconBtn, 1, () => {
      this._openIconSelector();
    }, () => this._menuActive && !this._levelSelectOverlay);

    this._iconOverlay = null;
    const _iconCounts = Object.assign(
      { icon: 485, ship: 169, ball: 119, wave: 96, ufo: 149, robot: 68, spider: 69 },
      window.ICON_COUNTS || {}
    );
    const _makeIconFrames = (prefix, count) =>
      Array.from({ length: count }, (_, i) => `${prefix}_${String(i + 1).padStart(2, "0")}_001.png`);
    const _iconFrameSets = {
      icon: _makeIconFrames("player", _iconCounts.icon),
      ship: _makeIconFrames("ship", _iconCounts.ship),
      ball: _makeIconFrames("player_ball", _iconCounts.ball),
      wave: _makeIconFrames("dart", _iconCounts.wave),
      ufo: _makeIconFrames("bird", _iconCounts.ufo),
    };

    const _selectorParseAnimPair = (value, fallbackX = 0, fallbackY = 0) => {
      const match = String(value ?? "").match(/\{\s*([-+]?\d*\.?\d+)\s*,\s*([-+]?\d*\.?\d+)\s*\}/);
      if (!match) return { x: fallbackX, y: fallbackY };
      const x = parseFloat(match[1]);
      const y = parseFloat(match[2]);
      return {
        x: Number.isFinite(x) ? x : fallbackX,
        y: Number.isFinite(y) ? y : fallbackY
      };
    };

    const _selectorVariantFrameName = (frameName, variant) => {
      if (!frameName) return frameName;
      if (variant === "glow") return frameName.replace(/_001\.png$/, "_glow_001.png");
      if (variant === "overlay") return frameName.replace(/_001\.png$/, "_2_001.png");
      if (variant === "extra") return frameName.replace(/_001\.png$/, "_extra_001.png");
      return frameName;
    };

    const _segmentedIconConfig = {
      spider: {
        prop: "currentSpider",
        prefix: "spider",
        descKey: "Spider_AnimDesc",
        fallbackBase: "spider_01",
        idlePatterns: [/^Spider_idle01_001\.png$/, /^Spider_idle01_\d+\.png$/, /^Spider_idle02_\d+\.png$/, /^Spider_idle_\d+\.png$/, /^Spider_walk_\d+\.png$/],
        defaultEntries: [
          { tag: "0", texture: "spider_01_02_001.png" },
          { tag: "1", texture: "spider_01_02_001.png" },
          { tag: "2", texture: "spider_01_04_001.png" },
          { tag: "3", texture: "spider_01_01_001.png" },
          { tag: "4", texture: "spider_01_03_001.png" },
          { tag: "5", texture: "spider_01_02_001.png" }
        ]
      },
      robot: {
        prop: "currentRobot",
        prefix: "robot",
        descKey: "Robot_AnimDesc",
        fallbackBase: "robot_01",
        idlePatterns: [/^Robot_idle_001\.png$/, /^Robot_idle_\d+\.png$/, /^Robot_idle01_\d+\.png$/, /^Robot_idle02_\d+\.png$/, /^Robot_run_001\.png$/, /^Robot_run_\d+\.png$/],
        defaultEntries: [
          { tag: "0", texture: "robot_01_03_001.png" },
          { tag: "1", texture: "robot_01_02_001.png" },
          { tag: "2", texture: "robot_01_04_001.png" },
          { tag: "3", texture: "robot_01_01_001.png" },
          { tag: "4", texture: "robot_01_03_001.png" },
          { tag: "5", texture: "robot_01_02_001.png" },
          { tag: "6", texture: "robot_01_04_001.png" }
        ]
      }
    };

    const _isSegmentedIconTab = (tab) => !!_segmentedIconConfig[tab];

    const _getSegmentedAnimDesc = (tab) => {
      const cfg = _segmentedIconConfig[tab];
      if (!cfg) return null;
      let data = null;
      try { data = this.cache?.json?.get?.(cfg.descKey) || null; } catch (e) { data = null; }
      if (!data && typeof window !== "undefined") data = window[cfg.descKey] || null;
      return data && data.animationContainer ? data : null;
    };

    const _getSegmentedIdleFrame = (tab) => {
      const cfg = _segmentedIconConfig[tab];
      const desc = _getSegmentedAnimDesc(tab);
      if (!cfg || !desc?.animationContainer) return null;
      const keys = Object.keys(desc.animationContainer).sort((a, b) => {
        const aa = parseInt((String(a).match(/_(\d+)\.png$/) || [0, 0])[1], 10) || 0;
        const bb = parseInt((String(b).match(/_(\d+)\.png$/) || [0, 0])[1], 10) || 0;
        return aa - bb;
      });
      for (const pattern of cfg.idlePatterns) {
        const match = keys.find(key => pattern.test(key));
        if (match) return desc.animationContainer[match];
      }
      return desc.animationContainer[keys[0]] || null;
    };

    const _replaceSegmentedBase = (tab, textureName, baseName) => {
      const cfg = _segmentedIconConfig[tab];
      if (!cfg) return textureName;
      return String(textureName || "").replace(new RegExp("^" + cfg.prefix + "_\\d+"), baseName);
    };

    const _makeSegmentedIconFrames = (tab, max = (window.ICON_COUNTS && window.ICON_COUNTS[tab]) || 120) => {
      const cfg = _segmentedIconConfig[tab];
      if (!cfg) return [];
      const frames = [];
      for (let i = 1; i <= max; i++) {
        frames.push(`${cfg.prefix}_${String(i).padStart(2, "0")}_001.png`);
      }
      return frames;
    };

    window.currentSpider = window.currentSpider || localStorage.getItem("iconCurrentSpider") || "spider_01";
    window.currentRobot = window.currentRobot || localStorage.getItem("iconCurrentRobot") || "robot_01";
    _iconFrameSets.spider = _makeSegmentedIconFrames("spider");
    _iconFrameSets.robot = _makeSegmentedIconFrames("robot");

    const _iconWindowProps = {
      icon: "currentPlayer",
      ship: "currentShip",
      ball: "currentBall",
      wave: "currentWave",
      ufo: "currentBird",
      robot: "currentRobot",
      spider: "currentSpider",
    };

    const _iconAtlas = {
      icon: "GJ_GameSheetIcons",
      ship: "GJ_GameSheetIcons",
      ball: "GJ_GameSheetIcons",
      wave: "GJ_GameSheetIcons",
      ufo: "GJ_GameSheetIcons",
      robot: "GJ_GameSheetIcons",
      spider: "GJ_GameSheetIcons",
    };

    const _tabBtnFrames = {
      icon: { on: "gj_iconBtn_on_001.png", off: "gj_iconBtn_off_001.png" },
      ship: { on: "gj_shipBtn_on_001.png", off: "gj_shipBtn_off_001.png" },
      ball: { on: "gj_ballBtn_on_001.png", off: "gj_ballBtn_off_001.png" },
      wave: { on: "gj_dartBtn_on_001.png", off: "gj_dartBtn_off_001.png" },
      ufo: { on: "gj_birdBtn_on_001.png", off: "gj_birdBtn_off_001.png" },
      robot:{ on: "gj_robotBtn_on_001.png", off: "gj_robotBtn_off_001.png" },
      spider:{ on: "gj_spiderBtn_on_001.png", off: "gj_spiderBtn_off_001.png" },
    };

    const _safeTabBtnFrame = (tab, state) => {
      const frame = _tabBtnFrames[tab]?.[state] || _tabBtnFrames.icon[state];
      return (typeof getAtlasFrame === "function" && getAtlasFrame(this, frame)) ? frame : _tabBtnFrames.icon[state];
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
        .setScrollFactor(0).setDepth(100).setInteractive();

      const titleMaxLength = 20;
      const titleAllowedChars = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
      let titleText = String(localStorage.getItem("playerName") || "Player").replace(/\r|\n/g, "").slice(0, titleMaxLength);
      if (!titleText || titleText.trim() === "") titleText = "Player";

      const titleTxt = this.add.bitmapText(sw / 2, 70, "bigFont", titleText, 64)
        .setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(105).setInteractive();
      let titleFocused = false;

      const _updateTitleText = () => {
        const safeTitle = titleText.slice(0, titleMaxLength);
        titleText = safeTitle;
        titleTxt.setText(safeTitle || "");
        localStorage.setItem("playerName", safeTitle || "Player");
      };

      const _focusTitle = () => {
        titleFocused = true;
      };

      const _blurTitle = () => {
        titleFocused = false;
        if (!titleText.trim()) {
          titleText = "Player";
          titleTxt.setText("Player");
          localStorage.setItem("playerName", "Player");
        }
      };

      titleTxt.on("pointerdown", () => _focusTitle());
      blocker.on("pointerdown", () => _blurTitle());

      const _onTitleKeyDown = (event) => {
        if (!titleFocused || !this._iconOverlay) return;
        event.stopPropagation();
        if (event.key === "Backspace") {
          if (titleText.length > 0) {
            titleText = titleText.slice(0, -1);
            _updateTitleText();
          }
        } else if (event.key === "Enter") {
          _blurTitle();
        } else if (event.key.length === 1 && titleAllowedChars.includes(event.key) && !event.ctrlKey && !event.metaKey) {
          if (titleText.length < titleMaxLength) {
            titleText += event.key;
            _updateTitleText();
          }
        }
      };

      window.addEventListener("keydown", _onTitleKeyDown);
      this._iconTitleKeyHandler = _onTitleKeyDown;
      this._iconOverlayObjects = [overlay, blocker, titleTxt];

      const backBtn = this.add.image(50, 48, "GJ_GameSheet03", "GJ_arrow_03_001.png")
        .setScrollFactor(0).setDepth(104).setFlipY(true)
        .setFlipX(true)
        .setRotation(Math.PI).setInteractive();
      this._iconOverlayObjects.push(backBtn);
      this._makeBouncyButton(backBtn, 1, () => this._closeIconSelector());

      const Pathicon = this.add.image(60, 165, "GJ_GameSheet03", "GJ_shardsBtn_001.png")
        .setScrollFactor(0).setDepth(104)
        .setInteractive();
      this._applyLockedGray(Pathicon);
      this._iconOverlayObjects.push(Pathicon);
      /*this._makeBouncyButton(Pathicon, 1, () => this.openshardmenu());
     */
      const topBarHeight = 110;
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

      const cols = 12;
      const rows = 3;
      const iconSize = 45;
      const padding = 12;
      const containerPadding = 10;
      const marginX = 30;
      const marginY = 15;
      const containerWidth = cols * iconSize + (cols - 1) * padding + marginX * 2;
      const containerHeight = rows * iconSize + (rows - 1) * padding + marginY * 2;
      const containerX = sw / 2 - containerWidth / 2;
      const containerY = sh - containerHeight - containerPadding - 150;
      const startX = containerX + marginX + iconSize / 2;
      const startY = containerY + marginY + iconSize / 2;

      const gridBg = this.add.graphics().setScrollFactor(0).setDepth(102);
      gridBg.fillStyle(0x454444, 1);
      gridBg.fillRoundedRect(containerX, containerY, containerWidth, containerHeight, 10);
      this._iconOverlayObjects.push(gridBg);

      const cornerTL = this.add.image(0, 0, "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setDepth(100).setOrigin(0, 0).setFlipY(true)
      const cornerTR = this.add.image(sw, 0, "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setDepth(103).setOrigin(1, 0).setFlipY(true).setFlipX(true);
      this._iconOverlayObjects.push(cornerTL, cornerTR);
      const gdColors = [
        0x7DFF00, 0x00FF00, 0x00FF7D, 0x00FFFF, 0x007DFF, 0x0000FF, 0x7D00FF, 0xFF00FF, 0xFF007D, 0xFF0000, 0xFF7D00, 0xFFFF00,
        0xFFFFFF, 0xB900FF, 0xFFB900, 0x000000, 0x00C8FF, 0xAFAFAF, 0x5A5A5A, 0xFF7D7D, 0x00AF4B, 0x007D7D, 0x004BAF, 0x4B00AF,
        0x7D007D, 0xAF004C, 0xAF4B00, 0x7D7D00, 0x4AAF00, 0xFF4B00, 0x963200, 0x966400, 0x649600, 0x009664, 0x006496, 0x640096,
        0x960064, 0x960000, 0x009600, 0x000096, 0x7DFFAF, 0x7D7DFF, 0xFFFA7F, 0xFA7FFF, 0x00FFC0, 0x50320E, 0xCDA576, 0xB680FF,
        0xFF3A3B, 0x4D4D8F, 0x000A4C, 0xFCD5CE, 0xBEB5FF, 0x700000, 0x530000, 0x390006, 0x804F4F, 0x7A3535, 0x512424, 0xA36246,
        0x754936, 0x563528, 0xFFB972, 0xFEA040, 0x66311E, 0x5B2700, 0x472000, 0xA77B4D, 0x6D5339, 0x513E2A, 0xFFFFC0, 0xFCE8A8,
        0xC0FFA0, 0xB1FF6D, 0xC0FFE0, 0x95FFE4, 0x43A18A, 0x316D5F, 0x265449, 0x006000, 0x004000, 0x006060, 0x004040, 0xA0FFFF,
        0x000770, 0x00496D, 0x00324C, 0x002638, 0x5080AD, 0x335375, 0x243C56, 0xE0E0E0, 0x3D068C, 0x370860, 0x404040, 0x6E49A4,
        0x54367F, 0x432A63, 0xFCB5FF, 0xAF57AE, 0x824382, 0x5E315E, 0x808080, 0x66003E, 0x470034, 0xD2FF31, 0x76BDFF,
      ];

      const colorCols = 12;
      const colorPageCount = Math.ceil(gdColors.length / colorCols);
      let colorPage = 0;

      const colorBtnSize = 44;
      const colorPadding = 6;
      const colorRowWidth = colorCols * (colorBtnSize + colorPadding) - colorPadding;
      const colorRow2Y = sh - 39 - colorBtnSize / 2;
      const colorRow1Y = colorRow2Y - colorBtnSize - 10;
      const colorRowStartX = sw / 2 - colorRowWidth / 2 + colorBtnSize / 2;

      const colorBoxWidth = sw;

      const colorBoxX = 0;
      const colorBoxY = colorRow1Y - colorBtnSize / 2 - 10;
      const colorBoxHeight = sh - colorBoxY;
      const colorBox = this.add.graphics().setScrollFactor(0).setDepth(101);
      colorBox.fillStyle(0x000000, 0.5);
      colorBox.fillRect(colorBoxX, colorBoxY, colorBoxWidth, colorBoxHeight);
      this._iconOverlayObjects.push(colorBox);

      const color1SelLabel = this.add.image(0, 0, "GJ_GameSheet03", "GJ_select_001.png").setScrollFactor(0).setDepth(106).setOrigin(0.5, 0.5).setVisible(false).setScale(0.6 * colorBtnSize / 35);
      const color2SelLabel = this.add.image(0, 0, "GJ_GameSheet03", "GJ_select_001.png").setScrollFactor(0).setDepth(106).setOrigin(0.5, 0.5).setVisible(false).setScale(0.6 * colorBtnSize / 35);
      this._iconOverlayObjects.push(color1SelLabel, color2SelLabel);
      const _moveColorSelect = (label, color, rowY) => {
        const idx = gdColors.indexOf(color);
        const col = idx - colorPage * colorCols;
        if (idx === -1 || col < 0 || col >= colorCols) {
          label.setVisible(false);
          return;
        }
        label.setPosition(colorRowStartX + col * (colorBtnSize + colorPadding), rowY).setVisible(true);
      };

          const _applyMainColor = (color) => {
            window.mainColor = color;
            localStorage.setItem("iconMainColor", hexadecimalToHex(color));
            _moveColorSelect(color1SelLabel, color, colorRow1Y);
            if (this._player) {
              const safeSetTint = (sprite, c) => {
                if (sprite && sprite.setTint) {
                  try { sprite.setTint(c); } catch (e) {}
                }
              };
              if (!this._player._playerSpriteLayer?.sprite?._customCubeIcon) safeSetTint(this._player._playerSpriteLayer?.sprite, color);
              safeSetTint(this._player._shipSpriteLayer?.sprite, color);
              safeSetTint(this._player._ballSpriteLayer?.sprite, color);
              safeSetTint(this._player._waveSpriteLayer?.sprite, color);
              for (const layer of this._player._robotLayers || []) safeSetTint(layer?.sprite, color);
              for (const layer of this._player._spiderLayers || []) safeSetTint(layer?.sprite, color);
              this._player._applyPlayerTints();
              if (this._player._particleEmitter) {
                try { this._player._particleEmitter.tint = color; } catch (e) {}
              }
            }
            selectedIcon.setTint(color);
            _refreshPreview(_currentTab, _getPreviewFrame(_currentTab));
            if (window.iconGridColored && this._rebuildIconGrid) this._rebuildIconGrid();
          };

          const _applySecondaryColor = (color) => {
            window.secondaryColor = color;
            localStorage.setItem("iconSecondaryColor", hexadecimalToHex(color));
            _moveColorSelect(color2SelLabel, color, colorRow2Y);
            if (this._player) {
              const safeSetTint = (sprite, c) => {
                if (sprite && sprite.setTint) {
                  try { sprite.setTint(c); } catch (e) {}
                }
              };
              safeSetTint(this._player._playerGlowLayer?.sprite, color);
              safeSetTint(this._player._playerOverlayLayer?.sprite, color);
              safeSetTint(this._player._shipGlowLayer?.sprite, color);
              safeSetTint(this._player._shipOverlayLayer?.sprite, color);
              safeSetTint(this._player._ballGlowLayer?.sprite, color);
              safeSetTint(this._player._ballOverlayLayer?.sprite, color);
              safeSetTint(this._player._waveGlowLayer?.sprite, color);
              safeSetTint(this._player._waveOverlayLayer?.sprite, color);
              for (const layer of this._player._robotLayers || []) safeSetTint(layer?.sprite, color);
              for (const layer of this._player._spiderLayers || []) safeSetTint(layer?.sprite, color);
              this._player._applyPlayerTints();
              if (this._player._streak) {
                try { this._player._streak._color = color; } catch (e) {}
              }
            }
            selectedIconExtra.setTint(window.secondaryColor);
            _refreshPreview(_currentTab, _getPreviewFrame(_currentTab));
            if (window.iconGridColored && this._rebuildIconGrid) this._rebuildIconGrid();
          };
          const colorDotSpacing = 29;
          const colorDotY = sh - 20;
          const colorDotStartX = sw / 2 - (colorPageCount - 1) * colorDotSpacing / 2;
          let colorDotObjs = [];
          const _updateColorDots = () => {
            for (const d of colorDotObjs) { if (d && d.destroy) d.destroy(); }
            this._iconOverlayObjects = this._iconOverlayObjects.filter(o => !colorDotObjs.includes(o));
            colorDotObjs = [];
            for (let i = 0; i < colorPageCount; i++) {
              const d = this.add.graphics().setScrollFactor(0).setDepth(153);
              d.fillStyle(0xffffff, i === colorPage ? 1 : 0.3);
              d.fillCircle(colorDotStartX + i * colorDotSpacing, colorDotY, 7);
              colorDotObjs.push(d);
              this._iconOverlayObjects.push(d);
            }
          };
          let colorPageObjs = [];
          const _buildColorPage = (page) => {
            colorPage = Math.max(0, Math.min(colorPageCount - 1, page));
            for (const o of colorPageObjs) { if (o && o.destroy) o.destroy(); }
            this._iconOverlayObjects = this._iconOverlayObjects.filter(o => !colorPageObjs.includes(o));
            colorPageObjs = [];

            const first = colorPage * colorCols;
            for (let ci = 0; ci < colorCols; ci++) {
          const color = gdColors[first + ci];
          if (color === undefined) break;
          const cx = colorRowStartX + ci * (colorBtnSize + colorPadding);

          const b1 = this.add.rectangle(cx, colorRow1Y, colorBtnSize, colorBtnSize, color).setScrollFactor(0).setDepth(104).setInteractive();
          const b2 = this.add.rectangle(cx, colorRow2Y, colorBtnSize, colorBtnSize, color).setScrollFactor(0).setDepth(104).setInteractive();
          colorPageObjs.push(b1, b2);
          this._iconOverlayObjects.push(b1, b2);
          this._makeBouncyButton(b1, 1.0, () => _applyMainColor(color));
          this._makeBouncyButton(b2, 1.0, () => _applySecondaryColor(color));
        }
        _moveColorSelect(color1SelLabel, window.mainColor, colorRow1Y);
        _moveColorSelect(color2SelLabel, window.secondaryColor, colorRow2Y);
        _updateColorDots();
      };
      const colorArrowY = (colorRow1Y + colorRow2Y) / 2;
      const colorArrowMargin = colorRowWidth / 2 + 45;
      const colorPrevArrow = this.add.image(sw / 2 - colorArrowMargin, colorArrowY, "GJ_GameSheet03", "GJ_arrow_02_001.png")
        .setScrollFactor(0).setDepth(106).setScale(0.8).setFlipX(false).setInteractive();
      const colorNextArrow = this.add.image(sw / 2 + colorArrowMargin, colorArrowY, "GJ_GameSheet03", "GJ_arrow_02_001.png")
        .setScrollFactor(0).setDepth(106).setScale(0.8).setFlipX(true).setInteractive();
      this._makeBouncyButton(colorPrevArrow, 0.8, () => _buildColorPage((colorPage - 1 + colorPageCount) % colorPageCount));
      this._makeBouncyButton(colorNextArrow, 0.8, () => _buildColorPage((colorPage + 1) % colorPageCount));
      this._iconOverlayObjects.push(colorPrevArrow, colorNextArrow);
      {
        const mi = gdColors.indexOf(window.mainColor);
        _buildColorPage(mi >= 0 ? Math.floor(mi / colorCols) : 0);
      }

      const previewY = lineY - 45;
      const previewConfig = {
        icon: { size: 88, y: 0 },
        ship: { size: 106, y: 0 },
        ball: { size: 88, y: 0 },
        ufo: { size: 106, y: 21 },
        wave: { size: 70, y: 0 },
        robot: { size: 88, y: 0 },
        spider: { size: 100, y: 0 },
      };
      const _pv = (tab) => previewConfig[tab] || { size: 88, y: 0 };
      const selectedIconExtra = this.add.image(sw / 2, previewY, _iconAtlas[startTab], null).setScrollFactor(0).setDepth(102).setVisible(false);
      const selectedIcon = this.add.image(sw / 2, previewY, _iconAtlas[startTab], null).setScrollFactor(0).setDepth(103);
      const selectedIconWhite = this.add.image(sw / 2, previewY, _iconAtlas[startTab], null).setScrollFactor(0).setDepth(103.5).setVisible(false);
      let selectedSegmentedPreview = null;

      const _destroySegmentedPreview = () => {
        if (selectedSegmentedPreview?.destroy) selectedSegmentedPreview.destroy(true);
        selectedSegmentedPreview = null;
      };

      const _createSegmentedIconComposite = (tab, pseudoFrame, x, y, maxSize, depth, muted = false) => {
        const cfg = _segmentedIconConfig[tab];
        const idleFrame = _getSegmentedIdleFrame(tab);
        if (!cfg || !idleFrame) return null;
        const baseName = String(pseudoFrame || `${cfg.fallbackBase}_001.png`).replace(/_001\.png$/, "");
        const container = this.add.container(x, y).setScrollFactor(0).setDepth(depth);
        const parts = [];
        for (const spriteKey of Object.keys(idleFrame)) {
          if (!spriteKey.startsWith("sprite_")) continue;
          const spriteData = idleFrame[spriteKey];
          const tag = parseInt(spriteData.tag || "0", 10) || 0;
          const pos = _selectorParseAnimPair(spriteData.position, 0, 0);
          const sc = _selectorParseAnimPair(spriteData.scale, 1, 1);
          const fl = _selectorParseAnimPair(spriteData.flipped, 0, 0);
          const zValue = parseFloat(spriteData.zValue || tag || "0") || 0;
          const rotDeg = parseFloat(spriteData.rotation || "0") || 0;
          const sourceTexture = _replaceSegmentedBase(tab, spriteData.texture || `${cfg.fallbackBase}_01_001.png`, baseName);
          const isSpiderLegTag = tab === "spider" && [0, 1, 4, 5].includes(tag);
          const isRobotLegTag = tab === "robot" && [0, 2, 4, 6].includes(tag);
          const isRobotArmTag = tab === "robot" && [1, 5].includes(tag);
          const localYOffset = tab === "spider"
            ? (tag === 3 ? 5 : (isSpiderLegTag ? -9 : 0))
            : (tag === 3 ? 5 : (isRobotArmTag ? -1 : (isRobotLegTag ? -9 : 0)));
          const localXScale = tab === "spider"
            ? (isSpiderLegTag ? 1.8 : 1)
            : ((isRobotLegTag || isRobotArmTag) ? 1.8 : 1);
          const variants = [
            { kind: "base", frame: sourceTexture, tint: (muted && !window.iconGridColored) ? 0xAFAFAF : window.mainColor, z: zValue * 0.1 },
            { kind: "overlay", frame: _selectorVariantFrameName(sourceTexture, "overlay"), tint: (muted && !window.iconGridColored) ? 0xffffff : window.secondaryColor, z: zValue * 0.1 - 0.04 },
            { kind: "extra", frame: _selectorVariantFrameName(sourceTexture, "extra"), tint: null, z: zValue * 0.1 + 0.08 }
          ];
          for (const variant of variants) {
            const _vf = typeof getAtlasFrame === "function" ? getAtlasFrame(this, variant.frame) : null;
            if (!_vf) continue;
            const img = this.add.image(pos.x * localXScale, -(pos.y + localYOffset), _vf.atlas, _vf.frame);
            img.rotation = rotDeg * Math.PI / 180;
            img.scaleX = sc.x * (fl.x ? -1 : 1);
            img.scaleY = sc.y * (fl.y ? -1 : 1);
            if (variant.tint !== null && variant.tint !== undefined) img.setTint(variant.tint);
            img._selectorZ = variant.z;
            img._selectorKind = variant.kind;
            parts.push(img);
          }
        }
        parts.sort((a, b) => (a._selectorZ || 0) - (b._selectorZ || 0));
        parts.forEach(part => container.add(part));
        if (!parts.length) {
          container.destroy(true);
          return null;
        }
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        const _boundParts = parts.some(pt => pt._selectorKind === "base") ? parts.filter(pt => pt._selectorKind === "base") : parts;
        for (const img of _boundParts) {
          const w = Math.abs((img.width || 1) * (img.scaleX || 1));
          const h = Math.abs((img.height || 1) * (img.scaleY || 1));
          minX = Math.min(minX, img.x - w / 2);
          maxX = Math.max(maxX, img.x + w / 2);
          minY = Math.min(minY, img.y - h / 2);
          maxY = Math.max(maxY, img.y + h / 2);
        }
        const width = Math.max(1, maxX - minX);
        const height = Math.max(1, maxY - minY);
        const fitScale = muted ? (maxSize / height) : Math.min(maxSize / width, maxSize / height);
        container.setScale(fitScale);
        container._selectorBaseScale = fitScale;
        return container;
      };

      const _getPreviewFrame = (tab) => {
        const prop = _iconWindowProps[tab];
        const frames = _iconFrameSets[tab] || [];
        const currentValue = String(window[prop] || "");
        const match = frames.find(f => f.replace("_001.png", "") === currentValue);
        return match || frames[0];
      };

      const _refreshPreview = (tab, frame) => {
        if (tab === "icon" && window.customCubeIconSrc && this.textures.exists("custom_cube_icon")) {
          _destroySegmentedPreview();
          selectedIcon.setVisible(true).setTexture(this.textures.exists("custom_cube_icon_hd") ? "custom_cube_icon_hd" : "custom_cube_icon").setTint(0xffffff);
          const cs = Math.min(80 / (selectedIcon.width || 80), 80 / (selectedIcon.height || 80)) * 0.85;
          selectedIcon.setScale(cs);
          selectedIconExtra.setVisible(false);
          selectedIconWhite.setVisible(false);
          return;
        }
        if (_isSegmentedIconTab(tab)) {
          _destroySegmentedPreview();
          selectedIcon.setVisible(false);
          selectedIconExtra.setVisible(false);
          selectedIconWhite.setVisible(false);
          const _pb = iconBaseOf(frame);
          if (_pb && !iconAtlasReady(this, _pb) && !window._iconAtlasFailed.has(_pb)) {
            loadIconAtlases(this, [_pb], () => {
              if (this._iconOverlay && _currentTab === tab) _refreshPreview(tab, frame);
            });
            return;
          }
          selectedSegmentedPreview = _createSegmentedIconComposite(tab, frame, sw / 2, previewY + _pv(tab).y, _pv(tab).size, 103, false);
          if (selectedSegmentedPreview) this._iconOverlayObjects.push(selectedSegmentedPreview);
          return;
        }
        _destroySegmentedPreview();
        selectedIcon.setVisible(true);
        const _selInfo = getAtlasFrame(this, frame);
        selectedIcon.setTexture(_selInfo ? _selInfo.atlas : _iconAtlas[tab], _selInfo ? _selInfo.frame : frame);
        const pvSize = _pv(tab).size;
        const s = Math.min(pvSize / (selectedIcon.width || pvSize), pvSize / (selectedIcon.height || pvSize));
        selectedIcon.setScale(s);
        selectedIcon.setY(previewY + _pv(tab).y);
        selectedIconExtra.setY(previewY + _pv(tab).y);
        selectedIconWhite.setY(previewY + _pv(tab).y);
        selectedIcon.setTint(window.mainColor);
        const extraFrame = frame.replace("_001.png", "_2_001.png");
        const extraInfo = getAtlasFrame(this, extraFrame);
        if (extraInfo) {
          selectedIconExtra.setTexture(extraInfo.atlas, extraInfo.frame).setVisible(true).setScale(s).setTint(window.secondaryColor);
        } else {
          selectedIconExtra.setVisible(false);
        }
        const whiteInfo = getAtlasFrame(this, frame.replace("_001.png", "_extra_001.png"));
        if (whiteInfo) {
          selectedIconWhite.setTexture(whiteInfo.atlas, whiteInfo.frame).setVisible(true).setScale(s).clearTint();
        } else {
          selectedIconWhite.setVisible(false);
        }
      };

      _refreshPreview(startTab, _getPreviewFrame(startTab));
      this._iconOverlayObjects.push(selectedIconExtra, selectedIcon, selectedIconWhite);

      const tabBtnY = containerY - 40;
      const tabKeys = ["icon", "ship", "ball", "ufo", "wave", "robot", "spider"];
      const tabSpacing = 66;
      const tabOffsets = {
        icon: -tabSpacing * 3,
        ship: -tabSpacing * 2,
        ball: -tabSpacing,
        ufo: 0,
        wave: tabSpacing,
        robot: tabSpacing * 2,
        spider: tabSpacing * 3,
      };
      const tabRotations = { icon: -Math.PI/2, ship: 0, ball: -Math.PI/2, ufo: Math.PI/2, wave: Math.PI/2, robot: 0, spider: 0 };
      const tabFlipXStates = { icon: true, ship: false, ball: true, ufo: false, wave: false, robot: false, spider: false };
      const tabFlipYStates = { icon: false, ship: false, ball: false, ufo: true, wave: true, robot: false, spider: false };
      const tabBtnSprites = {};

      const _switchTab = (tab) => {
        for (const k of tabKeys) {
          if (tabBtnSprites[k]) {
            tabBtnSprites[k].setTexture("GJ_GameSheet03",
              _safeTabBtnFrame(k, k === tab ? "on" : "off"));
          }
        }
        _refreshPreview(tab, _getPreviewFrame(tab));
        _buildGrid(tab);
      };

      tabKeys.forEach((tab, i) => {
        const isActive = tab === startTab;
        const btn = this.add.image(sw / 2 + tabOffsets[tab], tabBtnY, "GJ_GameSheet03",
            _safeTabBtnFrame(tab, isActive ? "on" : "off"))
            .setScrollFactor(0).setDepth(104).setScale(0.85)

          .setInteractive();
        tabBtnSprites[tab] = btn;
        this._iconOverlayObjects.push(btn);
        this._makeBouncyButton(btn, 0.85, () => _switchTab(tab));
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

      const _getMaxPages = (tab) => {
        return Math.ceil(_iconFrameSets[tab].length / iconsPerPage);
      };
      const _prevPage = () => {
        const maxPages = _getMaxPages(_currentTab);
        currentPage = (currentPage - 1 + maxPages) % maxPages;
        _buildGrid(_currentTab, currentPage);
      };
      const _nextPage = () => {
        const maxPages = _getMaxPages(_currentTab);
        currentPage = (currentPage + 1) % maxPages;
        _buildGrid(_currentTab, currentPage);
      };
      this._makeBouncyButton(prevArrow, 0.8, _prevPage);
      this._makeBouncyButton(nextArrow, 0.8, _nextPage);
      this._iconOverlayObjects.push(prevArrow, nextArrow);
      const _buildGrid = (tab, page = 0) => {
        const _pageBases = [...new Set(
          (_iconFrameSets[tab] || []).slice(page * iconsPerPage, (page + 1) * iconsPerPage)
            .map(f => iconBaseOf(f)).filter(Boolean)
        )];
        if (_pageBases.some(b => !iconAtlasReady(this, b) && !window._iconAtlasFailed.has(b))) {
          loadIconAtlases(this, _pageBases, () => {
            if (this._iconOverlay && _currentTab === tab && currentPage === page) _buildGrid(tab, page);
          });
          return;
        }
        for (const o of this._iconGridObjects) {
          if (o && o.destroy) o.destroy();
        }
        this._iconGridObjects = [];
        selLabel.setVisible(false);
        const allFrames = _iconFrameSets[tab];
        const frames = allFrames
          .slice(page * iconsPerPage, (page + 1) * iconsPerPage)
          .filter(f => _isSegmentedIconTab(tab) ? iconAtlasReady(this, iconBaseOf(f)) : !!getAtlasFrame(this, f));
        {
          const _slice = allFrames.slice(page * iconsPerPage, (page + 1) * iconsPerPage);
          const _noAtlas = _slice.filter(f => window._iconAtlasFailed.has(iconBaseOf(f))).map(f => iconBaseOf(f));
          const _noFrame = _slice.filter(f => !frames.includes(f) && !window._iconAtlasFailed.has(iconBaseOf(f)));
          if (_noAtlas.length) console.warn("[icons] " + tab + " page " + (page + 1) + ": atlas file missing/failed for", _noAtlas.join(", "));
          if (_noFrame.length) console.warn("[icons] " + tab + " page " + (page + 1) + ": atlas loaded but frame not found for", _noFrame.join(", "));
        }
        const atlas = _iconAtlas[tab];
        const prop = _iconWindowProps[tab];
        frames.forEach((frame, idx) => {
          const col = idx % cols;
          const row = Math.floor(idx / cols);
          const ix = startX + col * (iconSize + padding);
          const iy = startY + row * (iconSize + padding);
          const hitRect = this.add.rectangle(ix, iy, iconSize, iconSize, 0x000000, 0).setScrollFactor(0).setDepth(104).setInteractive();
          let iconImg;
          let extraImg = null;
          let whiteImg = null;
          let origScale;
          if (_isSegmentedIconTab(tab)) {
            iconImg = _createSegmentedIconComposite(tab, frame, ix, iy, iconSize, 103, true);
            if (!iconImg) {
              const _fi = getAtlasFrame(this, frame) || getAtlasFrame(this, frame.replace("_001.png", "_01_001.png"));
              iconImg = this.add.image(ix, iy, _fi ? _fi.atlas : "GJ_GameSheetIcons", _fi ? _fi.frame : frame).setScrollFactor(0).setDepth(103).setTint(window.iconGridColored ? window.mainColor : 0xAFAFAF);
              origScale = Math.min(iconSize / (iconImg.width || iconSize), iconSize / (iconImg.height || iconSize));
              iconImg.setScale(origScale);
            } else {
              origScale = iconImg._selectorBaseScale || iconImg.scaleX || 1;
            }
          } else {
            const _gi = getAtlasFrame(this, frame);
            iconImg = this.add.image(ix, iy, _gi ? _gi.atlas : atlas, _gi ? _gi.frame : frame).setScrollFactor(0).setDepth(103).setTint(window.iconGridColored ? window.mainColor : 0xAFAFAF);
            origScale = Math.min(
              iconSize / (iconImg.width || iconSize),
              iconSize / (iconImg.height || iconSize)
            );
            iconImg.setScale(origScale);
            const extraFrame = frame.replace("_001.png", "_2_001.png");
            const extraInfo = getAtlasFrame(this, extraFrame);
            extraImg = extraInfo
              ? this.add.image(ix, iy, extraInfo.atlas, extraInfo.frame).setScrollFactor(0).setDepth(102).setScale(origScale).setTint(window.iconGridColored ? window.secondaryColor : 0xffffff)
              : null;
            const whiteInfo = getAtlasFrame(this, frame.replace("_001.png", "_extra_001.png"));
            whiteImg = whiteInfo
              ? this.add.image(ix, iy, whiteInfo.atlas, whiteInfo.frame).setScrollFactor(0).setDepth(103.5).setScale(origScale)
              : null;
          }
          if (extraImg) this._iconGridObjects.push(extraImg);
          if (whiteImg) this._iconGridObjects.push(whiteImg);
          this._iconGridObjects.push(iconImg, hitRect);
          if (frame.replace("_001.png", "") === window[prop]) {
            selLabel.setPosition(ix, iy).setScale(0.8).setVisible(true);
          }

          ((capturedFrame, capturedImg, capturedExtra, capturedWhite, capturedOrigScale) => {
            const bouncedScale = capturedOrigScale * 1.26;
            const iconTargets = [capturedImg, capturedExtra, capturedWhite].filter(Boolean);
            hitRect.on("pointerdown", () => {
              hitRect._pressed = true;
              iconTargets.forEach(t => this.tweens.killTweensOf(t, "scale"));
              iconTargets.forEach(t => this.tweens.add({ targets: t, scale: bouncedScale, duration: 300, ease: "Bounce.Out" }));
            });
            hitRect.on("pointerout", () => {
              if (hitRect._pressed) {
                hitRect._pressed = false;
                iconTargets.forEach(t => this.tweens.killTweensOf(t, "scale"));
                iconTargets.forEach(t => this.tweens.add({ targets: t, scale: capturedOrigScale, duration: 400, ease: "Bounce.Out" }));
              }
            });
            hitRect.on("pointerup", () => {
              hitRect._pressed = false;
              iconTargets.forEach(t => { this.tweens.killTweensOf(t); t.setScale(capturedOrigScale); });
              if (!this._iconOverlay) return;

              selLabel.setPosition(capturedImg.x, capturedImg.y).setScale(0.75).setVisible(true);

              window[prop] = capturedFrame.replace("_001.png", "");
              localStorage.setItem("icon" + prop.charAt(0).toUpperCase() + prop.slice(1), window[prop]);

              if (tab === "icon" && this._player) {
                window.clearCustomCubeIcon();
                const layerMap = [
                  { lp: "_playerSpriteLayer", suffix: "_001.png", tint: window.mainColor },
                  { lp: "_playerGlowLayer", suffix: "_glow_001.png", tint: window.secondaryColor },
                  { lp: "_playerOverlayLayer", suffix: "_2_001.png", tint: window.secondaryColor },
                  { lp: "_playerExtraLayer", suffix: "_extra_001.png", tint: null },
                ];
                for (const { lp, suffix, tint } of layerMap) {
                  const layer = this._player[lp];
                  if (!layer || !layer.sprite) continue;
                  const found = getAtlasFrame(this, `${window.currentPlayer}${suffix}`);
                  if (suffix === "_extra_001.png") {
                    layer._hasIconFrame = !!found;
                    layer.sprite.setVisible(!!found && !!this._player["_playerSpriteLayer"]?.sprite?.visible);
                  }
                  if (found) {
                    layer.sprite.setTexture(found.atlas, found.frame);
                    if (tint !== null) layer.sprite.setTint(tint);
                    else layer.sprite.clearTint();
                  } else if (suffix === "_extra_001.png") {
                    layer.sprite.setVisible(false);
                  }
                  layer.sprite._customCubeIcon = false;
                }
              }
              if (tab === "ship" && this._player) {
                const layerMap = [
                  { lp: "_shipSpriteLayer", suffix: "_001.png", tint: window.mainColor },
                  { lp: "_shipGlowLayer", suffix: "_glow_001.png", tint: window.secondaryColor },
                  { lp: "_shipOverlayLayer", suffix: "_2_001.png", tint: window.secondaryColor },
                  { lp: "_shipExtraLayer", suffix: "_extra_001.png", tint: null },
                ];
                for (const { lp, suffix, tint } of layerMap) {
                  const layer = this._player[lp];
                  if (!layer || !layer.sprite) continue;
                  const found = getAtlasFrame(this, `${window.currentShip}${suffix}`);
                  if (suffix === "_extra_001.png") {
                    layer._hasIconFrame = !!found;
                    layer.sprite.setVisible(!!found && !!this._player["_shipSpriteLayer"]?.sprite?.visible);
                  }
                  if (found) {
                    layer.sprite.setTexture(found.atlas, found.frame);
                    if (tint !== null) layer.sprite.setTint(tint);
                    else layer.sprite.clearTint();
                  }
                }
              }
              if (tab === "ball" && this._player) {
                const layerMap = [
                  { lp: "_ballSpriteLayer", suffix: "_001.png", tint: window.mainColor },
                  { lp: "_ballGlowLayer", suffix: "_glow_001.png", tint: window.secondaryColor },
                  { lp: "_ballOverlayLayer", suffix: "_2_001.png", tint: window.secondaryColor },
                  { lp: "_ballExtraLayer", suffix: "_extra_001.png", tint: null },
                ];
                for (const { lp, suffix, tint } of layerMap) {
                  const layer = this._player[lp];
                  if (!layer || !layer.sprite) continue;
                  const found = getAtlasFrame(this, `${window.currentBall}${suffix}`);
                  if (suffix === "_extra_001.png") {
                    layer._hasIconFrame = !!found;
                    layer.sprite.setVisible(!!found && !!this._player["_ballSpriteLayer"]?.sprite?.visible);
                  }
                  if (found) {
                    layer.sprite.setTexture(found.atlas, found.frame);
                    if (tint !== null) layer.sprite.setTint(tint);
                    else layer.sprite.clearTint();
                  }
                }
              }
              if (tab === "wave" && this._player) {
                const layerMap = [
                  { lp: "_waveSpriteLayer", suffix: "_001.png", tint: window.mainColor },
                  { lp: "_waveGlowLayer", suffix: "_glow_001.png", tint: window.secondaryColor },
                  { lp: "_waveOverlayLayer", suffix: "_2_001.png", tint: window.secondaryColor },
                  { lp: "_waveExtraLayer", suffix: "_extra_001.png", tint: null },
                ];
                for (const { lp, suffix, tint } of layerMap) {
                  const layer = this._player[lp];
                  if (!layer || !layer.sprite) continue;
                  const found = getAtlasFrame(this, `${window.currentWave}${suffix}`);
                  if (suffix === "_extra_001.png") {
                    layer._hasIconFrame = !!found;
                    layer.sprite.setVisible(!!found && !!this._player["_waveSpriteLayer"]?.sprite?.visible);
                  }
                  if (found) {
                    layer.sprite.setTexture(found.atlas, found.frame);
                    if (tint !== null) layer.sprite.setTint(tint);
                    else layer.sprite.clearTint();
                  }
                }
              }
              if (tab === "ufo" && this._player) {
                const layerMap = [
                  { lp: "_birdSpriteLayer", suffix: "_001.png", tint: window.mainColor },
                  { lp: "_birdGlowLayer", suffix: "_2_001.png", tint: window.secondaryColor },
                  { lp: "_birdOverlayLayer", suffix: "_3_001.png", tint: window.secondaryColor },
                  { lp: "_birdExtraLayer", suffix: "_extra_001.png",tint: null },
                ];
                for (const { lp, suffix, tint } of layerMap) {
                  const layer = this._player[lp];
                  if (!layer || !layer.sprite) continue;
                  const found = getAtlasFrame(this, `${window.currentBird}${suffix}`);
                  if (suffix === "_extra_001.png") {
                    layer._hasIconFrame = !!found;
                    layer.sprite.setVisible(!!found && !!this._player["_birdSpriteLayer"]?.sprite?.visible);
                  }
                  if (found) {
                    layer.sprite.setTexture(found.atlas, found.frame);
                    if (tint !== null) layer.sprite.setTint(tint);
                    else layer.sprite.clearTint();
                  }
                }
              }

              _refreshPreview(tab, capturedFrame);
              if (tab === "icon") _refreshCustomIconUI();
            });
          })(frame, iconImg, extraImg, whiteImg, origScale);
        });
        if (tab === "icon" && window.customCubeIconSrc && this.textures.exists("custom_cube_icon")) {
          selLabel.setVisible(false);
        }
      };

      const customIconSize = 97;
      const customIconX = 60;
      const customIconY = 245;

      const customIconBtn = this.add.image(customIconX, customIconY, "GJ_GameSheet03", "GJ_plusBtn_001.png")
        .setScrollFactor(0).setDepth(104).setInteractive();
      this._iconOverlayObjects.push(customIconBtn);

      const _fitImageToBox = (img, box) => {
        const w = img.width || box;
        const h = img.height || box;
        const s = Math.min(box / w, box / h);
        img.setScale(s);
        return s;
      };

      let customIconBaseScale = _fitImageToBox(customIconBtn, customIconSize * 0.7);
      let _iconImportPreviewSize = 0;

      const _closeCustomIconImportMenu = () => {
        if (!this._iconImportMenuObjects) return;
        this._iconImportMenuObjects.forEach(obj => obj.destroy());
        this._iconImportMenuObjects = null;
        this._iconImportPreview = null;
        this._iconImportClearBtn = null;
      };
      this._closeIconImportMenu = _closeCustomIconImportMenu;

      const _refreshCustomIconImportPreview = () => {
        const preview = this._iconImportPreview;
        if (!preview?.scene) return;
        const hasCustomIcon = !!(window.customCubeIconSrc && this.textures.exists("custom_cube_icon"));
        if (hasCustomIcon) {
          preview.setTexture(this.textures.exists("custom_cube_icon_hd") ? "custom_cube_icon_hd" : "custom_cube_icon");
          _fitImageToBox(preview, _iconImportPreviewSize * 0.68);
        } else {
          preview.setTexture("GJ_GameSheet03", "GJ_deleteIcon_001.png");
          _fitImageToBox(preview, _iconImportPreviewSize * 0.5);
        }
        this._iconImportClearBtn?.setVisible(hasCustomIcon);
      };

      const _openCustomIconImportMenu = () => {
        if (this._iconImportMenuObjects) return;
        const cx = screenWidth / 2;
        const cy = screenHeight / 2;
        const popupW = Math.min(560, screenWidth * 0.88);
        const popupH = Math.min(300, screenHeight * 0.72);
        const backdrop = this.add.rectangle(cx, cy, screenWidth, screenHeight, 0x000000, 0.65)
          .setScrollFactor(0).setDepth(150).setInteractive();
        const popup = this.add.container(cx - screenWidth, cy).setScrollFactor(0).setDepth(151);
        const corner = this.textures.get("GJ_square01").source[0].width * 0.325;
        const panel = this.add.nineslice(0, 0, "GJ_square01", null, popupW, popupH,
          corner, corner, corner, corner).setOrigin(0.5).setInteractive();
        panel.on("pointerdown", () => {});
        const panelCorners = [
          this.add.image(-popupW / 2, -popupH / 2, "GJ_GameSheet03", "dailyLevelCorner_001.png").setOrigin(0, 0).setFlipY(true),
          this.add.image(popupW / 2, -popupH / 2, "GJ_GameSheet03", "dailyLevelCorner_001.png").setOrigin(1, 0).setFlipY(true).setFlipX(true),
          this.add.image(-popupW / 2, popupH / 2, "GJ_GameSheet03", "dailyLevelCorner_001.png").setOrigin(0, 1),
          this.add.image(popupW / 2, popupH / 2, "GJ_GameSheet03", "dailyLevelCorner_001.png").setOrigin(1, 1).setFlipX(true)
        ];

        const title = this.add.bitmapText(0, -popupH / 2 + 38, "bigFont", "Import Icon", 42).setOrigin(0.5);
        const importX = -popupW * 0.22;
        const contentY = 8;
        const importW = Math.min(180, popupW * 0.38);
        const importH = Math.min(64, popupH * 0.26);
        const importBorder = Math.min(this.textures.get("GJ_button01").source[0].width * 0.3, importH / 2 - 2);
        const importBg = this.add.nineslice(importX, contentY, "GJ_button01", null, importW, importH,
          importBorder, importBorder, importBorder, importBorder).setOrigin(0.5).setInteractive();
        const importLabel = this.add.bitmapText(importX, contentY - 2, "goldFont", "Import", 38).setOrigin(0.5);

        const previewX = popupW * 0.22;
        const previewY = contentY;
        const previewSize = Math.min(112, popupW * 0.24, popupH * 0.4);
        _iconImportPreviewSize = previewSize;
        const previewBorder = Math.min(this.textures.get("GJ_square02").source[0].width * 0.325, previewSize / 2);
        const previewBg = this.add.nineslice(previewX, previewY, "GJ_square02", null, previewSize, previewSize,
          previewBorder, previewBorder, previewBorder, previewBorder).setOrigin(0.5);
        const preview = this.add.image(previewX, previewY, "GJ_GameSheet03", "GJ_plusBtn_001.png").setOrigin(0.5);
        const chooseIconLabel = this.add.image(previewX + 12, previewY -10 + previewSize / 2 + 18, "ImportanIcon")
          .setOrigin(0.5).setScale(0.75);
        const closeBtn = this.add.image(popupW / 2 - 19, -popupH / 2 + 19, "GJ_WebSheet", "GJ_closeBtn_001.png")
          .setOrigin(0.5).setScale(0.8).setInteractive();
        const clearBtnScale = 1.05;
        const clearBtn = this.add.image(previewX + previewSize * 0.4 + 4, previewY - previewSize * 0.4 - 4,
          "GJ_GameSheet03", "edit_delBtnSmall_001.png").setOrigin(0.5).setScale(clearBtnScale).setInteractive();

        popup.add([panel, ...panelCorners, title, importBg, importLabel, previewBg, preview, chooseIconLabel, closeBtn, clearBtn]);
        this._iconImportPreview = preview;
        this._iconImportClearBtn = clearBtn;
        this._iconImportMenuObjects = [backdrop, popup];
        backdrop.on("pointerdown", _closeCustomIconImportMenu);
        this._makeCompositeBouncyButton(importBg, [importBg, importLabel], 1, () => _ensureCustomFileInput().click());
        this._makeBouncyButton(closeBtn, 0.8, _closeCustomIconImportMenu);
        this._makeBouncyButton(clearBtn, clearBtnScale, () => {
          window.clearCustomCubeIcon();
          _refreshCustomIconUI();
          _refreshPreview("icon", _getPreviewFrame("icon"));
          _refreshCustomIconImportPreview();
        }, () => !!window.customCubeIconSrc);
        this._expandHitArea(closeBtn, 2);
        this._expandHitArea(clearBtn, 2);
        _refreshCustomIconImportPreview();
        this.tweens.add({
          targets: popup,
          x: cx,
          duration: 600,
          ease: "Elastic.Out",
          easeParams: [1, 0.9]
        });
      };

      const _ensureCustomFileInput = () => {
        if (this._iconCustomFileInput) return this._iconCustomFileInput;
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.style.display = "none";
        document.body.appendChild(input);
        input.addEventListener("change", () => {
          const file = input.files && input.files[0];
          input.value = "";
          if (!file) return;
          if (file.size > 8 * 1024 * 1024) {
            alert("That image is too large. Please pick one under 8MB.");
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            const img = new Image();
            img.onload = () => {
              const size = 256;
              const canvas = document.createElement("canvas");
              canvas.width = size;
              canvas.height = size;
              const ctx = canvas.getContext("2d");
              const scale = Math.max(size / img.width, size / img.height);
              const dw = img.width * scale;
              const dh = img.height * scale;
              ctx.drawImage(img, (size - dw) / 2, (size - dh) / 2, dw, dh);
              const finalSrc = canvas.toDataURL("image/png");
              window.setCustomCubeIcon(finalSrc).then(() => {
                _refreshCustomIconUI();
                _refreshPreview("icon", _getPreviewFrame("icon"));
                _refreshCustomIconImportPreview();
              }).catch(error => {
                console.warn("Could not apply the custom icon", error);
                alert("Could not import that image. Please try another file.");
              });
            };
            img.onerror = () => alert("Could not read that image. Please try another file.");
            img.src = reader.result;
          };
          reader.onerror = () => alert("Could not read that file. Please try another one.");
          reader.readAsDataURL(file);
        });
        this._iconCustomFileInput = input;
        return input;
      };

      const _refreshCustomIconUI = () => {
        const onIconTab = _currentTab === "icon";
        customIconBtn.setVisible(onIconTab);
        if (!onIconTab) return;
        customIconBtn.setTexture("GJ_GameSheet03", "GJ_plusBtn_001.png");
        customIconBaseScale = _fitImageToBox(customIconBtn, customIconSize * 0.7);
      };

      customIconBtn.on("pointerdown", () => {
        this.tweens.killTweensOf(customIconBtn, "scale");
        this.tweens.add({ targets: customIconBtn, scale: customIconBaseScale * 1.15, duration: 150, ease: "Bounce.Out" });
      });
      customIconBtn.on("pointerout", () => {
        this.tweens.killTweensOf(customIconBtn, "scale");
        this.tweens.add({ targets: customIconBtn, scale: customIconBaseScale, duration: 200, ease: "Bounce.Out" });
      });
      customIconBtn.on("pointerup", () => {
        this.tweens.killTweensOf(customIconBtn, "scale");
        customIconBtn.setScale(customIconBaseScale);
        _openCustomIconImportMenu();
      });

      let _currentTab = startTab;
      this._rebuildIconGrid = () => { if (this._iconOverlay) _buildGrid(_currentTab, currentPage); };

      const _switchTabOrig = _switchTab;
      const _switchTabPaged = (tab) => {
        _currentTab = tab;
        currentPage = 0;
        for (const k of tabKeys) {
          if (tabBtnSprites[k]) {
            tabBtnSprites[k].setTexture("GJ_GameSheet03",
              _safeTabBtnFrame(k, k === tab ? "on" : "off"));
          }
        }
        _refreshPreview(tab, _getPreviewFrame(tab));
        _buildGrid(tab, 0);
        _refreshCustomIconUI();
      };
      tabKeys.forEach(tab => {
        const btn = tabBtnSprites[tab];
        if (btn) {
          btn.removeAllListeners("pointerup");
          btn.removeAllListeners("pointerdown");
          btn.removeAllListeners("pointerout");
          this._makeBouncyButton(btn, 0.85, () => _switchTabPaged(tab));
        }
      });

      _buildGrid(startTab, 0);
      _refreshCustomIconUI();
    };

    this._closeIconSelector = (silent = false) => {
      if (!this._iconOverlay) return;
      const destroy = () => {
        if (this._closeIconImportMenu) {
          this._closeIconImportMenu();
          this._closeIconImportMenu = null;
        }
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
        if (this._iconTitleKeyHandler) {
          window.removeEventListener("keydown", this._iconTitleKeyHandler);
          this._iconTitleKeyHandler = null;
        }
        if (this._iconCustomFileInput) {
          this._iconCustomFileInput.remove();
          this._iconCustomFileInput = null;
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
      if (silent == false) this._creatorMenuOpen = false;
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

    if (this._iconBtn) {
  this._iconBtn.x = (screenWidth / 2) - this._playBtn.width / 2 - 50 - (this._iconBtn.width * this._iconBtn.scaleX) / 2;
  this.tweens.killTweensOf(this._iconBtn, "y");
  this._iconBtn.y = 320;
  if (this._chrSelDecor) this._chrSelDecor.destroy();
  this._chrSelDecor = this.add.image(this._iconBtn.x - 110, this._iconBtn.y - (this._iconBtn.height * this._iconBtn.scaleY) / 2 + 160, "GJ_GameSheet03", "GJ_chrSel_001.png").setScrollFactor(0).setDepth(31);
}
    if (this._creatorBtn) {
  this._creatorBtn.x = (screenWidth / 2) + this._playBtn.width / 2 + 50 + (this._creatorBtn.width * this._creatorBtn.scaleX) / 2;
  this.tweens.killTweensOf(this._creatorBtn, "y");
  this._creatorBtn.y = 320;
  if (this._lvlEditDecor) this._lvlEditDecor.destroy();
  this._lvlEditDecor = this.add.image(this._creatorBtn.x + 110, this._creatorBtn.y - (this._creatorBtn.height * this._creatorBtn.scaleY) / 2 + 160, "GJ_GameSheet03", "GJ_lvlEdit_001.png").setScrollFactor(0).setDepth(31);
}
  }
  _createHUDElements() {
    this._percentageLabel = this.add.bitmapText(screenWidth / 2, 20, "bigFont", "0%", 32).setOrigin(0.5, 0.5);
    this._percentageLabel.setVisible(false);
    this._percentageLabel.setDepth(100);

    this._noclipIndicator = this.add.bitmapText(10, 10, "bigFont", "Ignore Damage", 20)
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

    this._cpsIndicator = this.add.bitmapText(10, 70, "bigFont", "0 CPS", 20)
      .setOrigin(0, 0)
      .setAlpha(0.4)
      .setDepth(100)
      .setVisible(false);

    this._bottedIndicator = this.add.bitmapText(10, 70, "bigFont", "Botted", 20)
      .setOrigin(0, 0)
      .setAlpha(0.4)
      .setDepth(100)
      .setTint(0xff0000)
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
  }
  _createLevelSwitcher() {
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
  }
  _closeTopOverlay() {
    if (this._keybindsPopup) {
      if (this._kbEscape) this._kbEscape();
      return true;
    }
    if (this._startPosPopup) {
      this._closeStartPosPopup();
      return true;
    }
    if (this._levelSelectOverlay) {
      this._closeLevelSelect();
      return true;
    }
    if (this._iconOverlay) {
      this._closeIconSelector();
      return true;
    }
    if (this._levelViewOverlay) {
      this._closeLevelView();
      return true;
    }
    if (this._editorOverlay) {
      this._closeEditorMenu();
      this._openCreatorMenu();
      return true;
    }
    if (this._playOverlay) {
      this._closePlayMenu(false, () => this._playMenuBackTarget());
      return true;
    }
    if (this._searchResultOverlay) {
      this._closeSearchResultScene();
      return true;
    }
    if (this._searchOverlay) {
      this._closeSearchMenu(true);
      this._openCreatorMenu();
      return true;
    }
    if (this._onlineLevelsOverlay) {
      this._closeOnlineLevelsScene();
      return true;
    }
    if (this._vaultOverlayObjects) {
      this._closeVaultMenu();
      return true;
    }
    if (this._secretVaultOverlayObjects) {
      this._closeSecretVault();
      return true;
    }
    if (this._dailyLevelPopup) {
      this._closeDailyLevelPopup();
      return true;
    }
    if (this._weeklyLevelPopup) {
      this._closeWeeklyLevelPopup();
      return true;
    }
    if (this._eventLevelPopup) {
      this._closeEventLevelPopup();
      return true;
    }
    if (this._creatorOverlay) {
      this._closeCreatorMenu();
      return true;
    }
    if (this._settingsPopup) {
      this._settingsPopup.destroy();
      this._settingsPopup = null;
      return true;
    }
    if (this._macroPopup) {
      this.events.off("update", this._refreshMacroButtons);
      this._macroPopup.destroy();
      this._macroPopup = null;
      return true;
    }
    if (this._settingsLayerOverlay) {
      if (!this._settingsScreenClosing) {
        this._hideSettingsScreen();
      }
      return true;
    }
    if (this._infoPopup) {
      this._infoPopup.destroy();
      this._infoPopup = null;
      return true;
    }
    if (this._newsPopup) {
      this._closeNewsPopup();
      return true;
    }
    if (this._newgroundsPopup) {
      this._closeNewgroundsPopup();
      return true;
    }
    if (this._editorTriggerChannelPopup) {
        if (typeof this._closeEditorTriggerChannelPopup === "function") {
            this._closeEditorTriggerChannelPopup();
        } else {
            this._editorTriggerChannelPopup.destroy();
            this._editorTriggerChannelPopup = null;
        }
        return true;
    }
    if (this._editorColorPickerPopup) {
        this._closeEditorColorPickerPopup();
        return true;
    }
    if (this._editorHorizontalOptionPopup) {
        this._closeEditorHorizontalOptionPopup();
        return true;
    }
    if (this._editorStartOptionsPopup) {
        this._closeEditorStartOptionsPopup();
        return true;
    }
    if (this._editorLevelSettingsPopup) {
        this._closeEditorLevelSettingsPopup();
        return true;
    }
    if (this._statsLayerOverlay) {
      this._hideStatsScreen();
      return true;
    }
    return false;
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
      const gRaw = (colorHex >> 8) & 0xff;
      const bRaw = colorHex & 0xff;
      const topMul = isEveryEnd ? 0.48 : 0.92;
      const botMul = isEveryEnd ? 0.18 : 0.52;
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
    const levelCoinRequirements = {
      "level_14": 10,
      "level_18": 20,
      "level_20": 30
    };
    const getLevelCoinRequirement = (levelId) => levelCoinRequirements[levelId] || 0;
    const fadeIn = this.add.graphics().setScrollFactor(0).setDepth(200);
    fadeIn.fillStyle(0x000000, 1);
    fadeIn.fillRect(0, 0, sw, sh);
    this.tweens.add({ targets: fadeIn, alpha: 0, duration: 300, ease: "Linear", onComplete: () => fadeIn.destroy() });
    const overlay = this.add.graphics().setScrollFactor(0).setDepth(150);
    drawOverlay(overlay, bgHex, isEveryEnd(window.currentlevel[2]));
    this._levelSelectOverlay = overlay;
    const tableBottom = this.add.image(cx, 0, "GJ_GameSheet03", "GJ_topBar_001.png").setScrollFactor(0).setDepth(152).setOrigin(0.5, 0);
    const groundY = sh + 175;
    const groundId = (window._groundId || "00");
    const groundFrame = this.textures.getFrame("groundSquare_" + groundId + "_001.png");
    const referenceGroundFrame = this.textures.getFrame("groundSquare_00_001.png") || groundFrame;
    const referenceGroundH = referenceGroundFrame ? referenceGroundFrame.height : 270;
    const groundTopY = groundY - referenceGroundH;
    const tileW = groundFrame ? groundFrame.width : 1012;
    const numTiles = Math.ceil(sw / tileW) + 2;
    const groundTintHex = (colorHex) => {
      const r = Math.round(((colorHex >> 16) & 0xff) * 0.72);
      const g = Math.round(((colorHex >> 8) & 0xff) * 0.72);
      const b = Math.round(( colorHex & 0xff) * 0.72);
      return (r << 16) | (g << 8) | b;
    };
    const staticGroundTiles = [];
    const staticGround2Tiles = [];
    const ground2Key = "groundSquare_" + groundId + "_2_001.png";
    const hasGround2 = this.textures.exists(ground2Key);
    for (let gi = 0; gi < numTiles; gi++) {
      const tileX = gi * tileW;
      const gt = this.add.image(tileX, groundTopY, "groundSquare_" + groundId + "_001.png")
        .setScrollFactor(0).setDepth(151).setOrigin(0, 0).setTint(groundTintHex(groundHex));
      staticGroundTiles.push(gt);
      if (hasGround2) {
        const gt2 = this.add.image(tileX, groundTopY, ground2Key)
          .setScrollFactor(0).setDepth(151.5).setOrigin(0, 0).setTint(groundTintHex(groundHex));
        staticGround2Tiles.push(gt2);
      }
    }
    const infoBtn = this.add.image(sw - 40, 40, "GJ_GameSheet03", "GJ_infoIcon_001.png")
       .setScrollFactor(0).setDepth(152)
        .setInteractive();
     this._makeBouncyButton(infoBtn, 1, () => this._buildLevelStatsPopup());
    const floorLineFrame = this.textures.getFrame("GJ_WebSheet", "floorLine_01_001.png");
    const floorLineW = floorLineFrame ? floorLineFrame.width : 888;
    const floorLineScale = sw / floorLineW;
    const staticFloorLine = this.add.image(cx, groundTopY, "GJ_WebSheet", "floorLine_01_001.png")
      .setScrollFactor(0).setDepth(152).setOrigin(0.5, 0.5).setScale(floorLineScale, 1).setBlendMode(S);
    const cornerBL = this.add.image(0, sh, "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setDepth(152).setOrigin(0, 1).setFlipY(false);
    const cornerBR = this.add.image(sw, sh, "GJ_GameSheet03", "GJ_sideArt_001.png").setScrollFactor(0).setDepth(152).setOrigin(1, 1).setFlipX(true);
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

    const downloadsoundtrack = this.add.bitmapText(cx, 585, "bigFont", "Download the soundtracks", 56).setScrollFactor(0).setDepth(155).setOrigin(0.5, 0.5).setScale(0.52).setInteractive();
        this._makeBouncyButton(downloadsoundtrack, 0.52, () => { this._buildsongspopup(1); });

    const arrowL = this.add.image(55, cy - 25, "GJ_GameSheet03", "navArrowBtn_001.png").setScrollFactor(0).setDepth(154).setScale(1.1).setFlipX(true).setInteractive();
    const arrowR = this.add.image(sw - 55, cy - 25, "GJ_GameSheet03", "navArrowBtn_001.png").setScrollFactor(0).setDepth(154).setScale(1.1).setFlipX(false).setInteractive();
    const allLevels = window.allLevels || [];
    const _hiddenLevels = ["level_22", "level_67"];
    const visibleLevels = allLevels.filter(level => !(level && _hiddenLevels.includes(level[2])));
    const pageCount = visibleLevels.length + 1;
    let currentPageIndex = visibleLevels.findIndex(l => l[2] === window.currentlevel[2]);
    if (currentPageIndex < 0) currentPageIndex = 0;
    const isComingSoonPage = () => currentPageIndex >= visibleLevels.length;
    const getPageLevel = () => {
      if (isComingSoonPage()) return visibleLevels[visibleLevels.length - 1] || window.currentlevel || [];
      return visibleLevels[currentPageIndex] || window.currentlevel || [];
    };
    const applyCurrentPage = () => {
      this._levelSelectIsComingSoonPage = isComingSoonPage();
      if (!isComingSoonPage() && visibleLevels[currentPageIndex]) {
        window.currentlevel = [...visibleLevels[currentPageIndex]];
      }
    };
    applyCurrentPage();
    const dotY = sh - 20;

    const maxDots = Math.min(pageCount, 28);
    const dotSpacing = 29;
    const dotStartX = cx - (maxDots - 1) * dotSpacing / 2;
    const dotObjs = [];
    const refreshDots = () => {
      for (const d of dotObjs) d.destroy();
      dotObjs.length = 0;
      for (let di = 0; di < maxDots; di++) {
        const active = di === currentPageIndex;
        const d = this.add.graphics().setScrollFactor(0).setDepth(153);
        d.fillStyle(0xffffff, active ? 1 : 0.3);
        d.fillCircle(dotStartX + di * dotSpacing, dotY, 7);
        dotObjs.push(d);
      }
    };
    refreshDots();
    const cardW = Math.min(700, sw - 180);
    const cardH = 185;
    const cardX = cx;
    const cardY = cy - 100;
    const cardSlideContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(152);
    const cardBounceContainer = this.add.container(cardX, cardY).setScrollFactor(0).setDepth(0);
    cardSlideContainer.add(cardBounceContainer);
    const cardContainer = cardSlideContainer;
    const cardBg = this.add.graphics();
    const drawCardBg = (colorHex, dark = false, textOnly = false) => {
      cardBg.clear();
      if (textOnly) return;
      const mul = dark ? 0.10 : 0.22;
      const r = Math.round(((colorHex >> 16) & 0xff) * mul);
      const g = Math.round(((colorHex >> 8) & 0xff) * mul);
      const b = Math.round(( colorHex & 0xff) * mul);
      cardBg.fillStyle((r << 16) | (g << 8) | b, 0.75);
      cardBg.fillRoundedRect(-cardW / 2, -cardH / 2, cardW, cardH, 18);
    };
    drawCardBg(bgHex, isEveryEnd(window.currentlevel[2]), isComingSoonPage());
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
      if (isComingSoonPage()) return;
      const levelId = window.currentlevel?.[2];
      if (getLevelCoinRequirement(levelId) > (Number(window._totalsecretcoins) || 0)) return;
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
            if (isComingSoonPage()) {
              return;
            }

            const requiredCoins = getLevelCoinRequirement(window.currentlevel?.[2]);
            const collectedCoins = Number(window._totalsecretcoins) || 0;
            if (requiredCoins > collectedCoins) {
              return;
            }

            this.input.enabled = false;
            this.tweens.killTweensOf(cardBounceContainer, "scale");
            cardBounceContainer.setScale(1);

            const lvl = window.currentlevel;
            const songID = lvl[0];
            const levelFileName = lvl[2];
            const songFileName = lvl[4] ? lvl[4] : lvl[1].replaceAll(" ", "");

            const loadingText = this.add.bitmapText(cx, cy, "goldFont", "Downloading Level Assets...", 20).setOrigin(0.5).setDepth(200);

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
      if (isComingSoonPage()) {
        this.tweens.killTweensOf(cardBounceContainer, "scale");
        cardBounceContainer.setScale(1);
        const comingSoonLabel = this.add.bitmapText(0, 0, "bigFont", "Coming Soon!", 56)
          .setScrollFactor(0).setDepth(155).setOrigin(0.5, 0.5);
        comingSoonLabel.setScale(Math.min(1, (cardW - 40) / comingSoonLabel.width));
        cardContentObjs.push(comingSoonLabel);
        cardBounceContainer.add(comingSoonLabel);
        return;
      }
      const lvl = window.currentlevel;
      const levelId = lvl[2] || "level_1";
      const requiredCoins = getLevelCoinRequirement(levelId);
      const collectedCoins = Number(window._totalsecretcoins) || 0;
      const levellocked = requiredCoins > collectedCoins;
      const levelDifficultyMap = {
        "level_1": "diffIcon_01_btn_001",
        "level_2": "diffIcon_01_btn_001",
        "level_3": "diffIcon_02_btn_001",
        "level_4": "diffIcon_02_btn_001",
        "level_5": "diffIcon_03_btn_001",
        "level_6": "diffIcon_03_btn_001",
        "level_7": "diffIcon_04_btn_001",
        "level_8": "diffIcon_04_btn_001",
        "level_9": "diffIcon_04_btn_001",
        "level_10": "diffIcon_05_btn_001",
        "level_11": "diffIcon_05_btn_001",
        "level_12": "diffIcon_05_btn_001",
        "level_13": "diffIcon_05_btn_001",
        "level_14": "diffIcon_06_btn_001",
        "level_15": "diffIcon_05_btn_001",
        "level_16": "diffIcon_05_btn_001",
        "level_17": "diffIcon_04_btn_001",
        "level_18": "diffIcon_06_btn_001",
        "level_19": "diffIcon_04_btn_001",
        "level_20": "diffIcon_06_btn_001",
        "level_21": "diffIcon_05_btn_001",
        "level_22": "diffIcon_05_btn_001",
        "level_99": "diffIcon_10_btn_001",
        "level_100": "diffIcon_10_btn_001",
        "level_137409445": "diffIcon_00_btn_001",
        "level_5703070": "diffIcon_07_btn_001",
        "level_137677336": "diffIcon_00_btn_001",
        "level_116489424": "diffIcon_00_btn_001",
        "level_4284013": "diffIcon_06_btn_001",
        "level_56199846": "diffIcon_04_btn_001",
        "level_23": "diffIcon_10_btn_001"
      };
      const diffIconKey = levelDifficultyMap[levelId] || "diffIcon_05_btn_001";
      const diffFrame = diffIconKey + ".png";
      const iconX = cardX - cardW / 2 + 52;
      if (levellocked) {
        const lock = this.add.image(0, -8, "GJ_GameSheet03", "GJLargeLock_001.png")
          .setScrollFactor(0).setDepth(155).setOrigin(0.5, 0.5);
        const lockFrame = this.textures.getFrame("GJ_GameSheet03", "GJLargeLock_001.png");
        if (lockFrame) lock.setScale(Math.min(1, (cardH - 20) / lockFrame.height));
        cardContentObjs.push(lock);
        cardBounceContainer.add(lock);
      } else {
        const isHardDemon = diffIconKey === "diffIcon_06_btn_001";
        const demonIcon = this.add.image(iconX - cardX, 0, "GJ_GameSheet03", diffFrame)
          .setScrollFactor(0).setDepth(155).setScale(1).setOrigin(0.5, 0.5);
        cardContentObjs.push(demonIcon);
        cardBounceContainer.add(demonIcon);
        const maxIconH = cardH - 16;
        const maxIconW = 80;
        const iconFrame = this.textures.getFrame("GJ_GameSheet03", diffFrame);
        let finalIconScale = 1.115;
        if (iconFrame) {
          const scaleForH = maxIconH / iconFrame.height;
          const scaleForW = maxIconW / iconFrame.width;
          finalIconScale = Math.min(1.115, scaleForH, scaleForW);
          demonIcon.setScale(finalIconScale);
        }
        const iconDisplayW = (iconFrame ? iconFrame.width : 80) * finalIconScale;
        const iconDisplayH = (iconFrame ? iconFrame.height : 80) * finalIconScale;
        const nameLabel = this.add.bitmapText(0, 0, "bigFont", lvl[1], 60)
          .setScrollFactor(0).setDepth(155).setOrigin(0, 0.5);
        const gap = 25;
        const cardPad = 16;
        const maxGroupW = cardW - cardPad * 2 - 100;
        const maxGroupH = cardH - cardPad * 2;
        const maxLabelW = Math.max(1, maxGroupW - iconDisplayW - gap);
        const labelScale = Math.min(1, maxLabelW / nameLabel.width, maxGroupH / nameLabel.height);
        const totalW = iconDisplayW + gap + nameLabel.width * labelScale;
        const groupStartX = cardX - totalW / 2;
        demonIcon.setScale(finalIconScale);
        demonIcon.setPosition(groupStartX + iconDisplayW / 2 - cardX, 0);
        nameLabel.setScale(labelScale);
        nameLabel.setPosition(groupStartX + iconDisplayW + gap - cardX, 0);
        cardContentObjs.push(nameLabel);
        cardBounceContainer.add(nameLabel);
      }

      let collectedSecretCoins = [];
      try {
        const savedCoins = JSON.parse(localStorage.getItem("gd_secretCoins_" + levelId) || "[]");
        const savedSlotsKey = "gd_secretCoins_" + levelId + "_slots";
        const savedSlots = JSON.parse(localStorage.getItem(savedSlotsKey) || "null");
        if (Array.isArray(savedSlots)) {
          collectedSecretCoins = savedSlots.filter(slot => Number.isInteger(slot) && slot >= 0 && slot < 3);
        } else if (levelId === window.currentlevel?.[2] && Array.isArray(this._level?._coinSprites)) {
          const savedIds = new Set(Array.isArray(savedCoins) ? savedCoins.map(String) : []);
          collectedSecretCoins = this._level._coinSprites
            .filter(sprite => sprite?._secretCoinId !== undefined && savedIds.has(String(sprite._secretCoinId)))
            .map(sprite => sprite._secretCoinSlot)
            .filter(slot => Number.isInteger(slot));
        }
      } catch (_error) {}
      if (levellocked) {
        const coinCount = this.add.bitmapText(cardW / 2 - 117, 63, "bigFont", `${collectedCoins}/${requiredCoins}`, 42)
          .setScrollFactor(0).setDepth(155).setOrigin(0.5, 0.5);
        const coinIcon = this.add.image(cardW / 2 - 31, 63, "GJ_GameSheet03", "GJ_coinsIcon_001.png")
          .setScrollFactor(0).setDepth(155).setOrigin(0.5);
        cardContentObjs.push(coinCount, coinIcon);
        cardBounceContainer.add([coinCount, coinIcon]);
      }
      for (let coinIndex = 0; !levellocked && coinIndex < 3; coinIndex++) {
        const coinIcon = this.add.image(
          cardW / 2 - 131 + coinIndex * 50,
          63,
          "GJ_GameSheet03",
          collectedSecretCoins.includes(coinIndex) ? "GJ_coinsIcon_001.png" : "GJ_coinsIcon_gray_001.png"
        ).setScrollFactor(0).setDepth(155).setOrigin(0.5);
        cardContentObjs.push(coinIcon);
        cardBounceContainer.add(coinIcon);
      }
    };
    const barAreaY = cardY + cardH / 2 + 100 - 10;
    const barW2 = cardW;
    const barH2 = 36;
    const barX0 = cx - barW2 / 2;
    let barObjs = [];
    const buildBar = () => {
      for (const o of barObjs) { this.tweens.killTweensOf(o); o.destroy(); }
      barObjs.length = 0;
      if (isComingSoonPage()) return;
      const bestNormal = parseFloat(localStorage.getItem("bestPercent_" + (window.currentlevel[2] || "level_1")) || "0");
      const modeLabel = this.add.bitmapText(cx, barAreaY - 40, "bigFont", "Normal Mode", 30)
        .setScrollFactor(0).setDepth(155).setOrigin(0.5, 0.5);
      barObjs.push(modeLabel);
      cardContainer.add(modeLabel);
      const barBg = this.add.graphics().setScrollFactor(0).setDepth(154);
      barBg.fillStyle(0x000000, 0.5);
      barBg.fillRoundedRect(barX0, barAreaY - barH2 / 2, barW2, barH2, barH2 / 2);
      barObjs.push(barBg);
      cardContainer.add(barBg);
      const padding = 3;
      const innerH2 = barH2 - padding * 2;
      const innerW2 = barW2 - padding * 2;
      const innerRadius = innerH2 / 2;
      const fillW = Math.max(innerH2, innerW2 * bestNormal / 100);
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
      practBarBg.fillStyle(0x000000, 0.5);
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
      if (pageCount <= 0) return;

      if (_currentAnimUpdate) {
        this.events.off("preupdate", _currentAnimUpdate);
        _currentAnimUpdate = null;
      }
      currentPageIndex = (currentPageIndex + dir + pageCount) % pageCount;
      applyCurrentPage();
      const pageLevel = getPageLevel();
      const newColors = this._parseLevelColors(pageLevel[2]);
      const dark = isEveryEnd(pageLevel[2]);
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
            drawCardBg(newColors.bgHex, dark, isComingSoonPage());
            buildCardContent();
            buildBar();
            drawOverlay(overlay, newColors.bgHex, dark);
            for (const gt of staticGroundTiles) gt.setTint(groundTintHex(newColors.groundHex));
            for (const gt of staticGround2Tiles) gt.setTint(groundTintHex(newColors.groundHex));
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
    this._levelSelectStaticObjs = [overlay, inputBlocker, tableBottom, ...staticGroundTiles, ...staticGround2Tiles, staticFloorLine, cornerBL, cornerBR, backBtn, infoBtn, arrowL, arrowR, cardSlideContainer, cardHit, downloadsoundtrack];
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
      this._levelSelectIsComingSoonPage = false;
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
      if (this._practicedMode.practiceMode && !this._menuActive && !this._slideIn) {
        this._practicedMode.saveCheckpoint(this._state, this._playerWorldX, this._cameraX, this);
      }
    });
    this._expandHitArea(this._checkpointBtn, 2);
    this._clearCheckpointBtn = this.add.image(50, 0, "GJ_GameSheet03", "GJ_removeCheckBtn_001.png")
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .setScale(0.8);
    this._makeBouncyButton(this._clearCheckpointBtn, 0.8, () => {
      if (this._practicedMode.practiceMode && !this._menuActive && !this._slideIn) {
        this._practicedMode.deleteLastCheckpoint();
      }
    });
    this._expandHitArea(this._clearCheckpointBtn, 1.5);
    this._checkpointBtnContainer.add([this._checkpointBtn, this._clearCheckpointBtn]);
    this._fpsText = this.add.text(4, 2, "", {
      fontSize: "17px",
      fill: "#ffffff",
      fontFamily: "Arial"
    }).setOrigin(0, 0).setScrollFactor(0).setDepth(999).setVisible(!!window.showFPS);
    this._fpsAccum = 0;
    this._fpsFrames = 0;
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
        this._startPosCount = total;

        this._startPosText = this.add.bitmapText(0, 0, "bigFont", `0/${total}`, 40).setOrigin(0.5);

        this._startPosGui.add([leftArrow, rightArrow, this._startPosText]);

        this._makeBouncyButton(leftArrow, 0.6, () => this.changeStartPos(-1));
        this._makeBouncyButton(rightArrow, 0.6, () => this.changeStartPos(1));
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
  
      const settingsBtn = this.add.image(textureY + _0x4eb71b / 2 - 60, 80, 'GJ_GameSheet03', "GJ_optionsBtn_001.png").setScale(0.64).setInteractive();
      this._expandHitArea(settingsBtn, 2.5);
      this._pauseContainer.add(settingsBtn);
      this._makeBouncyButton(settingsBtn, 0.64, () => this._buildSettingsPopup());
  
      this._macroBtn = this.add.image(textureY + _0x4eb71b / 2 - 60, 150, "macroBot").setScale(0.4).setInteractive();
      this._pauseContainer.add(this._macroBtn);
      this._makeBouncyButton(this._macroBtn, 0.4, () => this._buildMacroPopup());
  
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
              this._queueGameplayLevelViewReturn();
              if (this._isMainLevelForCoinDisplay() || window.currentlevel?.[2] === "level_67") {
                window._mainLevelReturnToSelect = true;
              }
              this.game.registry.remove("autoStartGame");
              window.isEditor = false;
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
              this._makeBouncyButton(btn, 1, () => {
                  const isPracticeMode = this._practicedMode.togglePracticeMode();
                  btn.setTexture("GJ_GameSheet03", isPracticeMode ? "GJ_normalBtn_001.png" : "GJ_practiceBtn_001.png");
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
      const SETTINGS_LAYOUT = {
        panelWidth: 800,
        panelHeight: 550,
        centerY: 320,
        tabWidths: [150, 120, 185],
        tabHeight: 56,
        tabFontSize: 25,
        popupBtns: [
          { label: "StartPos", w: 130, x: 215, fontSize: 21, delay: 0, open: null },
          { label: "Keys", w: 90, x: 335, fontSize: 25, delay: 0, open: null }
        ],
        popupBtnHeight: 56,
        toggleCheckScale: 0.8,
        toggleFontSize: 25,
        toggleCheckOffsetX: -120,
        toggleTextOffsetX: -70,
        numberBoxW:64,
        numberBoxH: 48,
        numberBoxRadius: 8,
        numberValueFontSize: 28,
        numberLabelFontSize: 25,
        column1X: -200,
        column2X: 200,
        spacingY: 70,
        startY: -150,
      };
      const centerX = screenWidth / 2,
        centerY = SETTINGS_LAYOUT.centerY,
        panelWidth = SETTINGS_LAYOUT.panelWidth,
        panelHeight = SETTINGS_LAYOUT.panelHeight;
  
      this._settingsPopup = this.add.container(0, 0).setScrollFactor(0).setDepth(250);
  
      const dim = this.add.rectangle(centerX, centerY, screenWidth, screenHeight, 0, 150 / 255).setInteractive();
      this._settingsPopup.add(dim);
  
      const innerContainer = this.add.container(centerX, centerY).setScale(0);
      this._settingsPopup.add(innerContainer);
  
      const corner = 0.325 * this.textures.get("GJ_square67").source[0].width;
      const panel = this._drawScale9(0, 0, panelWidth, panelHeight, 'GJ_square67', corner, 16777215, 1);
      innerContainer.add(panel);
  
      const closeBtn = this.add.image(-(panelWidth / 2) + 10, -(panelHeight / 2) + 10, 'GJ_WebSheet', "GJ_closeBtn_001.png").setScale(0.8).setInteractive();
      innerContainer.add(closeBtn);
      this._makeBouncyButton(closeBtn, 0.8, () => {
          this._settingsPopup.destroy();
          this._settingsPopup = null;
      });
  
      const pages = ["Gameplay", "Visual", "Performance"];
      let currentPage = 0;
      const tabY = -(panelHeight / 2) + 45;
      const tabW = SETTINGS_LAYOUT.tabWidths;
      const tabBorder = this.textures.get("GJ_button05").source[0].width * 0.3;
      const tabs = [];
      let tabLeft = -(panelWidth / 2) + 50;
      pages.forEach((name, i) => {
        const w = tabW[i];
        const tabBg = this.add.nineslice(tabLeft + w / 2, tabY, "GJ_button05", null, w, SETTINGS_LAYOUT.tabHeight, tabBorder, tabBorder, tabBorder, tabBorder).setOrigin(0.5).setInteractive();
        const tabLbl = this.add.bitmapText(tabLeft + w / 2, tabY - 2, "bigFont", name, SETTINGS_LAYOUT.tabFontSize).setOrigin(0.5);
        if (tabLbl.width > w - 24) tabLbl.setScale((w - 24) / tabLbl.width);
        innerContainer.add([tabBg, tabLbl]);
        tabBg._bouncyVisualTargets = [tabBg, tabLbl];
        tabs.push(tabBg);
        tabLeft += w + 5;
        this._makeBouncyButton(tabBg, 1, () => {
          if (currentPage === i) return;
          currentPage = i;
          buildPage(i);
        });
      });
      const refreshTabs = () => tabs.forEach((tabBg, i) => tabBg.setTexture(i === currentPage ? "GJ_button02" : "GJ_button05"));
      const column1X = SETTINGS_LAYOUT.column1X;
      const column2X = SETTINGS_LAYOUT.column2X;
      const checkOffset = SETTINGS_LAYOUT.toggleCheckOffsetX;
      const textOffset = SETTINGS_LAYOUT.toggleTextOffsetX;
      const spacingY = SETTINGS_LAYOUT.spacingY;
      const startY = SETTINGS_LAYOUT.startY;
      let pageContainer = this.add.container(0, 0);
      innerContainer.add(pageContainer);
  
      const createToggle = (container, x, y, label, getVal, setVal, callback, fontSize, hasInfoBox, infoText) => {
         if (fontSize === undefined) fontSize = SETTINGS_LAYOUT.toggleFontSize;
          if (hasInfoBox === undefined) hasInfoBox = false;
          if (infoText === undefined) infoText = null;
  
          var isOn = getVal();
          var checkTexture = isOn ? "GJ_checkOn_001.png" : "GJ_checkOff_001.png";
          var check = this.add.image(x + checkOffset, y, "GJ_GameSheet03", checkTexture).setScale(SETTINGS_LAYOUT.toggleCheckScale).setInteractive();
          var txt = this.add.bitmapText(x + textOffset, y, "bigFont", label, fontSize).setOrigin(0, 0.5);
          container.add([check, txt]);
  
          if (hasInfoBox) {
              if (infoText) {
                  createInfoButton(container, x + checkOffset - 34, y - 30, infoText, 0.45);
              }
          }
  
            this._makeBouncyButton(check, SETTINGS_LAYOUT.toggleCheckScale, () => {
              var current = getVal();
              setVal(!current);
              var newTexture = getVal() ? "GJ_checkOn_001.png" : "GJ_checkOff_001.png";
              check.setTexture("GJ_GameSheet03", newTexture);
              if (callback) {
                  callback(getVal());
              }
              if (this._saveSettings) {
                  this._saveSettings();
              }
          });
      };
  
      function TextToSay(key) {
          var normalized = String(key).replace(/[^a-z0-9]/gi, "").toLowerCase();
          return String(key);
      }
  
      var infotextstrings = {
          "Enable Portal Guide": "Enables extra indicators on portals.",
          "Enable Orb Guide": "Enables extra indicators on orbs.",
          "Practice Music Bypass": "Plays normal mode music in practice mode.",
          "Show Percentage": "Shows the percentage you are at in a level.",
          "Percentage Decimals": "Shows decimals in level progress.",
          "Startpos Switcher": "Switches between start positions in a level.",
          "Progress Bar": "Shows a progress bar at the top of the screen.",
          "Smart StartPos": "Sets the mode, size, speed and gravity of start positions to match the level.",
          "Ignore Damage": "Allows you to phase throught mostly anything that would kill you normally.",
          "Ignore Damage Accuracy": "Flashes your screen red when you would've died with noclip.",
          "Macro Bot": "Lets you record and replay your inputs for a level.",
          "Show Hitboxes": "Shows you the hitboxes for objects and your player.",
          "Hitbox Trail": "Shows the hitbox of exactly where your hitbox has been.",
          "Hitboxes on Death": "Shows hitboxes upon death in both normal and practice mode.",
          "Show FPS": "Shows the frames per second your game is running at.",
          "Solid Wave Trail": "Removes the extra details of the wave trail.",
          "Show CPS": "Shows when you click in a level in the top left of your screen.",
          "Show Glow": "Shows glow for basic object sets.",
          "Cull Distance": "Changes how many objects are shown. [DOES NOT SAVE!!]",
          "Default Mini Icon": "Sets player icon in min mode to default.",
          "Safe Mode": "Enables when Noclip or Speedhack are on. Disables level Completion when enabled.",
         "Hide Pause Button": "Hides the pause button during gameplay. Prevents accidental clicks.",
        "Hide Practice UI": "Hides the checkpoint buttons in practice mode."
      };
  
      const createInfoButton = (container, x, y, infoTextOrKey, scale) => {
          var key = String(infoTextOrKey || "");
          var words = TextToSay(key);
          var Infotext = null;
          if (window.settingInfoText && window.settingInfoText[words]) {
              Infotext = window.settingInfoText[words];
          } else if (infotextstrings[words]) {
              Infotext = infotextstrings[words];
          }
          var infoText = Infotext ? Infotext : key;
          if (!infoText) {
              return;
          }
  
          var infoButton = this.add.image(x, y, "GJ_GameSheet03", "GJ_infoIcon_001.png");
          infoButton.setScale(scale || 0.45);
          infoButton.setInteractive();
          container.add(infoButton);
  
          this._makeBouncyButton(infoButton, scale, () => {
              this.InfoBoxDoAThing(infoText);
          });
      };
      const createNumberInput = (container, x, y, label, getVal, setVal, minVal = 0, maxVal = 20, integer = true, hasInfoBox = false, infoText = null) => {
         const txt = this.add.bitmapText(x + textOffset, y, "bigFont", label, SETTINGS_LAYOUT.numberLabelFontSize).setOrigin(0, 0.5);
          container.add(txt);
  
          if (hasInfoBox) {
              if (infoText) {
                  createInfoButton(container, x + checkOffset - 38, y - 32, infoText, 0.45);
              }
          }
  
          const boxX = x + checkOffset;
          const boxY = y;
          const boxW = SETTINGS_LAYOUT.numberBoxW;
          const boxH = SETTINGS_LAYOUT.numberBoxH;
  
          const bgBoxGraphics = this.add.graphics();
          bgBoxGraphics.fillStyle(0x222222, 0.5);
          bgBoxGraphics.fillRoundedRect(boxX - boxW / 2, boxY - boxH / 2, boxW, boxH, SETTINGS_LAYOUT.numberBoxRadius);
          container.add(bgBoxGraphics);
  
          const hitArea = this.add.rectangle(boxX, boxY, boxW, boxH, 0x000000, 0)
              .setOrigin(0.5)
              .setInteractive({ useHandCursor: true });
          container.add(hitArea);
  
          let initialVal = getVal();
          if (initialVal === undefined || initialVal === null) initialVal = minVal;
           const valueTxt = this.add.bitmapText(boxX, boxY, "bigFont", initialVal.toString(), SETTINGS_LAYOUT.numberValueFontSize)
              .setOrigin(0.5);
          container.add(valueTxt);
  
          let isFocused = false;
          let internalString = initialVal.toString();
  
          const updateDisplay = () => {
              if (isFocused) {
                  valueTxt.setText(internalString + "|");
              } else {
                  valueTxt.setText(internalString || " ");
              }
          };
  
          const commitValue = () => {
              isFocused = false;
  
              let val;
              if (integer) {
                  val = parseInt(internalString, 10);
              } else {
                  val = parseFloat(internalString);
              }
              if (isNaN(val)) val = minVal;
  
              if (val < minVal) val = minVal;
              if (val > maxVal) val = maxVal;
  
              internalString = integer ? String(Math.round(val)) : String(val);
              valueTxt.setText(internalString);
  
              setVal(val);
              if (this._saveSettings) this._saveSettings();
          };
  
          hitArea.on('pointerdown', (pointer, localX, localY, event) => {
              if (event) event.stopPropagation();
  
              if (window._activeCustomInput && window._activeCustomInput !== commitValue) {
                  window._activeCustomInput();
              }
  
              isFocused = true;
              window._activeCustomInput = commitValue;
  
              internalString = "";
              updateDisplay();
  
              let mobileInput = document.getElementById('phaser-mobile-input');
              if (!mobileInput) {
                mobileInput = document.createElement('input');
                mobileInput.id = 'phaser-mobile-input';
                mobileInput.type = 'number';
                mobileInput.step = '0.1';
                mobileInput.style.position = 'absolute';
                mobileInput.style.opacity = '0';
                mobileInput.style.left = '0px';
                mobileInput.style.top = '0px';
                mobileInput.style.width = '1px';
                mobileInput.style.height = '1px';
                document.body.appendChild(mobileInput);
              }
  
              mobileInput.value = "";
              mobileInput.focus();
  
              mobileInput.oninput = () => {
                internalString = mobileInput.value;
                updateDisplay();
             };
  
            mobileInput.onkeydown = (e) => {
              if (e.key === 'Enter') {
                mobileInput.blur();
              }
            };
  
            mobileInput.onblur = () => {
              commitValue();
              isFocused = false;
              if (mobileInput.parentNode) {
                mobileInput.parentNode.removeChild(mobileInput);
              }
            };
  
            const removeMobileFocus = () => {
              if (document.activeElement === mobileInput) {
                mobileInput.blur();
              }
              window.removeEventListener('pointerdown', removeMobileFocus);
            };
            window.addEventListener('pointerdown', removeMobileFocus);
          });
  
          const outsideClickListener = () => {
              if (isFocused) commitValue();
          };
          dim.on('pointerdown', outsideClickListener);
  
          const keydownListener = (event) => {
              if (!isFocused) return;
  
              const key = event.key;
  
              if (key === "Enter") {
                  event.preventDefault();
                  commitValue();
                  return;
              }
  
              if (key === "Backspace") {
                  event.preventDefault();
                  internalString = internalString.slice(0, -1);
                  updateDisplay();
                  return;
              }
  
              if (/^[0-9.]$/.test(key)) {
                  event.preventDefault();
  
                  if (integer) {
                      if (key === ".") return;
                      internalString += key;
                  } else {
                      if (key === ".") {
                          if (internalString.includes(".")) return;
                          if (internalString.length === 0) return;
                          internalString += key;
                      } else {
                          internalString += key;
                      }
                  }
  
                  updateDisplay();
              }
          };
  
          window.addEventListener('keydown', keydownListener);
  
          const originalDestroy = container.destroy;
          container.destroy = (...args) => {
              window.removeEventListener('keydown', keydownListener);
              if (dim) dim.off('pointerdown', outsideClickListener);
              if (window._activeCustomInput === commitValue) {
                  window._activeCustomInput = null;
              }
              originalDestroy.apply(container, args);
          };
      };
  
      const buildGameplayPage = (container) => {
          createToggle(container, column1X, startY, "Show Percentage",
              () => window.showPercentage,
              (v) => window.showPercentage = v,
              (v) => { if (this._percentageLabel) this._percentageLabel.setVisible(v); },
              undefined,
              true,
              "Show Percentage"
          );
  
          createToggle(container, column1X, startY + spacingY, "Percentage Decimals",
              () => window.percentageDecimals,
              (v) => window.percentageDecimals = v,
              undefined,
              undefined,
              true,
              "Percentage Decimals"
          );
  
          createToggle(container, column1X, startY + (spacingY * 2), "Progress Bar",
              () => window.progressBar,
              (v) => window.progressBar = v,
              undefined,
              undefined,
             true,
            "Progress Bar"
          );
  
            createToggle(container, column1X, startY + (spacingY * 3), "Ignore Damage",
              () => window.noClip,
              (v) => window.noClip = v,
              (v) => { if (this._noclipIndicator) this._noclipIndicator.setVisible(v); },
              undefined,
              25,
             "Ignore Damage"
          );
  
            createToggle(container, column1X, startY + (spacingY * 4), "Ignore Damage Accuracy",
              () => window.noClipAccuracy,
              (v) => window.noClipAccuracy = v,
              null,
              22,
              true,
             "Ignore Damage Accuracy"
          );
  
          createToggle(container, column1X, startY + (spacingY * 5), "Macro Bot",
              () => window.macroBot,
              (v) => window.macroBot = v,
              null,
              25,
              true,
              "Macro Bot"
          );
  
          createToggle(container, column2X, startY + spacingY, "Practice Music Sync",
              () => window.practiceMusicSync,
              (v) => {
                  const changed = !!window.practiceMusicSync !== !!v;
                  window.practiceMusicSync = v;
                  if (changed && !this._menuActive && this._practicedMode?.practiceMode) {
                      this._practiceBypassPending = true;
                  }
              },
              null,
              20,
              true,
              "Practice Music Bypass"
          );
  
          createToggle(container, column2X, startY + (spacingY * 3), "Hide Pause Button",
            () => window.hidePauseBtn,
            (v) => {
              window.hidePauseBtn = v;
              if (this._pauseBtn) {
                this._pauseBtn.setAlpha(v ? 0 : 75 / 255);
                if (v) this._pauseBtn.disableInteractive();
                else this._pauseBtn.setInteractive();
              }
            },
            null,
            25,
            true,
            "Hide Pause Button"
          );
  
          createToggle(container, column2X, startY + (spacingY * 4), "Hide Practice UI",
            () => window.hidePracticeUI,
            (v) => {
              window.hidePracticeUI = v;
              if (this._checkpointBtnContainer) this._checkpointBtnContainer.setAlpha(v ? 0 : 1);
           },
          null,
          25,
          true,
          "Hide Practice UI"
        );
  
        createNumberInput(container, column2X, startY + (spacingY * 2), "Respawn Delay (s)",
          () => window.respawnDelay,
          (v) => { window.respawnDelay = v; },
          0,
          10,
          false
        );
  
        createNumberInput(container, column2X, startY, "Speedhack",
          () => window.speedHack,
          (v) => window.speedHack = v,
          0.1,
          10,
          false
        );
  
      };
  
      const buildVisualPage = (container) => {
          createToggle(container, column1X, startY, "Show Hitboxes",
              () => window.showHitboxes,
              (v) => window.showHitboxes = v,
              (v) => {
                  if (!v) {
                      this._player._hitboxGraphics.clear();
                  } else {
                      this._player.drawHitboxes(this._player._hitboxGraphics, this._cameraX, this._cameraY);
                  }
              },
              undefined,
              25,
              "Show Hitboxes"
          );
  
          createToggle(container, column1X, startY + (spacingY), "Hitbox Trail",
              () => window.showHitboxTrail,
              (v) => window.showHitboxTrail = v,
              (v) => { if (window.showHitboxes) this._player.drawHitboxes(this._player._hitboxGraphics, this._cameraX, this._cameraY); },
              undefined,
              25,
              "Hitbox Trail"
          );
  
          createToggle(container, column1X, startY + (spacingY * 2), "Hitboxes on Death",
              () => window.hitboxesOnDeath,
              (v) => window.hitboxesOnDeath = v,
              undefined,
              undefined,
              true,
              "Hitboxes on Death"
          );
  
          createToggle(container, column1X, startY + (spacingY * 3), "Show FPS",
              () => this._fpsText.visible,
              (v) => this._fpsText.visible = v,
              (v) => { if (this._fpsText) this._fpsText.setVisible(v); },
              undefined,
              25,
              "Show FPS"
          );
  
          createToggle(container, column1X, startY + (spacingY * 4), "Solid Wave Trail",
              () => window.solidWave,
              (v) => window.solidWave = v,
              null,
              25,
              true,
              "Solid Wave Trail"
          );
  
          createToggle(container, column1X, startY + (spacingY * 5), "Show CPS",
              () => window.showCPS,
              (v) => window.showCPS = v,
              null,
              25,
              true,
              "Show CPS"
          );
  
          createToggle(container, column2X, startY, "Show Glow",
              () => window.showGlow,
              (v) => window.showGlow = v,
              () => { if (this._level && this._level._updateGlowVisibility) this._level._updateGlowVisibility(); },
              undefined,
              25,
              "Show Glow"
          );
  
          createToggle(container, column2X, startY + spacingY, "Object ID Labels",
            () => !!window.createObjectIds && !!window.showObjectIds,
            (v) => {
              window.createObjectIds = v;
              window.showObjectIds = v;
            },
            null, 20
          );
           createToggle(container, column2X, startY + (spacingY * 2), "Enable Portal Guide",
              () => window.enablePortalGuide,
              (v) => window.enablePortalGuide = v,
              null, 22,
              true,
              "Enable Portal Guide"
          );
           createToggle(container, column2X, startY + (spacingY * 3), "Enable Orb Guide",
              () => window.enableOrbGuide,
              (v) => window.enableOrbGuide = v,
              null,
              25,
              true,
              "Enable Orb Guide"
          );
           createToggle(container, column2X, startY + (spacingY * 4), "Default Mini Icon",
              () => window.enableMiniIcon,
              (v) => window.enableMiniIcon = v,
              null,
  
              25,
              true,
              "Default Mini Icon"
          );
      };
  
          const buildPerformancePage = (container) => {
          createNumberInput(container, column1X, startY, "Cull Distance",
            () => (typeof window.cullDistance !== 'undefined' ? window.cullDistance : 3),
            (v) => window.cullDistance = v,
            0,
            3,
            true,
            true,
            "Cull Distance"
          );
      };
  
      const buildPage = (idx) => {
          pageContainer.destroy();
          pageContainer = this.add.container(0, 0);
          innerContainer.add(pageContainer);
          refreshTabs();
          if (idx === 0) buildGameplayPage(pageContainer);
          else if (idx === 1) buildVisualPage(pageContainer);
          else if (idx === 2) buildPerformancePage(pageContainer);
          const popupBtns = SETTINGS_LAYOUT.popupBtns.map((def, i) => ({
            ...def,
            open: i === 0 ? () => this._buildStartPosPopup() : () => this._buildKeybindsPopup()
          }));
  
          const popupBtnBorder = this.textures.get("GJ_button05").source[0].width * 0.3;
  
        popupBtns.forEach((def) => {
          const btn = this.add.nineslice(def.x, tabY, "GJ_button05", null, def.w, SETTINGS_LAYOUT.popupBtnHeight, popupBtnBorder, popupBtnBorder, popupBtnBorder, popupBtnBorder).setOrigin(0.5).setInteractive();
          const lbl = this.add.bitmapText(def.x, tabY - 2, "goldFont", def.label, def.fontSize).setOrigin(0.5);
  
          pageContainer.add([btn, lbl]);
          btn._bouncyVisualTargets = [btn, lbl];
          this._makeBouncyButton(btn, 1, () => (def.delay ? this.time.delayedCall(def.delay, def.open) : def.open()));
        });
      };
      buildPage(0);
  
      this.tweens.add({
          targets: innerContainer,
          scale: 1,
          duration: 660,
          ease: "Elastic.Out",
          easeParams: [1, 0.6]
        });
      }
    _buildLevelStatsPopup(override) {
      if (this._levelStatsPopup) return;
      const centerX = screenWidth / 2, centerY = screenHeight / 2;
      const panelW = 600, panelH = 420;

      const levelName = (override && override.name) || (window.currentlevel && window.currentlevel[1]) || "Unnamed";
      const levelKey = (override && override.key) || (window.currentlevel && window.currentlevel[2]) || "level_1";
      const bestNormal = Math.floor(parseFloat(localStorage.getItem("bestPercent_" + levelKey) || "0"));
      const bestPractice = Math.floor(parseFloat(localStorage.getItem("practiceBestPercent_" + levelKey) || "0"));
      const attempts = this._getLevelStat("Attempts", levelKey);
      const jumps = this._getLevelStat("Jumps", levelKey);

      this._levelStatsPopup = this.add.container(0, 0).setScrollFactor(0).setDepth(700);
      const dim = this.add.rectangle(centerX, centerY, screenWidth, screenHeight, 0, 150 / 255).setInteractive();
      this._levelStatsPopup.add(dim);

      const inner = this.add.container(centerX, centerY).setScale(0);
      this._levelStatsPopup.add(inner);

      const bgKey = this.textures.exists("square01_001") ? "square01_001" : "GJ_square01";
      inner.add(this.add.nineslice(0, 0, bgKey, null, panelW, panelH, 53, 53, 53, 53));

      inner.add(this.add.bitmapText(0, -panelH / 2 + 60, "goldFont", "Level Stats", 48).setOrigin(0.5));

      const rows = [
        { text: levelName, color: "#ffff00", value: null },
        { text: "Total Attempts", color: "#3cdc50", value: String(attempts) },
       { text: "Total Jumps", color: "#5aa0ff", value: String(jumps) },
      { text: "Normal", color: "#ff00ff", value: bestNormal + "%" },
      { text: "Practice", color: "#ffa050", value: bestPractice + "%" }
    ];
    const rowStart = -panelH / 2 + 125;
    const rowGap = 42;
    rows.forEach((row, i) => {
      const y = rowStart + i * rowGap;
      const label = this.add.text(0, y, row.value === null ? row.text : row.text + ":", {
        fontFamily: "Arial", fontSize: "30px", color: row.color
      }).setOrigin(0.5);
      if (row.value === null) {
        if (label.width > panelW - 100) label.setScale((panelW - 100) / label.width);
        inner.add(label);
        return;
      }
      const value = this.add.text(0, y, " " + row.value, {
        fontFamily: "Arial", fontSize: "30px", color: "#ffffff"
      }).setOrigin(0, 0.5);
      const total = label.width + value.width;
      label.setOrigin(0, 0.5).setX(-total / 2);
      value.setX(-total / 2 + label.width);
      inner.add([label, value]);
    });
    const okW = 100, okH = 60;
    const okBg = this.add.nineslice(0, 0, "GJ_button01", null, okW, okH, 24, 24, 24, 24);
    const okText = this.add.bitmapText(-3, -4, "goldFont", "OK", 46).setOrigin(0.5);
    const okBtn = this.add.container(0, panelH / 2 - 55, [okBg, okText]);
    okBtn.setSize(okW, okH).setInteractive();
    inner.add(okBtn);

    this._makeBouncyButton(okBtn, 1, () => {
      this.tweens.killTweensOf(inner);
      if (this._levelStatsPopup) this._levelStatsPopup.destroy();
      this._levelStatsPopup = null;
    });

    this.tweens.add({
      targets: inner, scale: 1, duration: 660, ease: "Elastic.Out", easeParams: [1, 0.6]
    });
  }
  _buildMacroPopup() {
      if (this._macroPopup) return;
      const centerX = screenWidth / 2;
      const centerY = 320;
      const panelWidth = 800;
      const panelHeight = 400;
      this._macroPopup = this.add.container(0, 0).setScrollFactor(0).setDepth(250);
      const dim = this.add.rectangle(centerX, centerY, screenWidth, screenHeight, 0x000000, 150 / 255).setInteractive();
      this._macroPopup.add(dim);

      const corner = 0.325 * this.textures.get("GJ_square02").source[0].width;
      const panel = this._drawScale9(centerX, centerY, panelWidth, panelHeight, "GJ_square02", corner, 0xffffff, 1);
      this._macroPopup.add(panel);

      this._macroPopup.add(this.add.bitmapText(centerX, centerY - (panelHeight / 2) + 45, "bigFont", "Web Bot v2.1", 40).setOrigin(0.5));

      if (this._macroName === undefined) {
          this._macroName = this._macroBot?.meta?.name || null;
      }
      if (this._macroLoaded === undefined) {
          this._macroLoaded = !!this._macroName || (this._macroBot && this._macroBot.frames && this._macroBot.frames.length > 0);
      }

      const loadedNameText = this.add.bitmapText(centerX, centerY - (panelHeight / 2) + 95, "goldFont", this._macroLoaded ? `Currently loaded "${this._macroName || 'macro'}"` : "No macro loaded", 24).setOrigin(0.5);
      this._macroPopup.add(loadedNameText);

      const optionsBtn = this.add.image(centerX, centerY - (panelHeight / 2) + 95, "GJ_GameSheet03", "GJ_optionsBtn02_001.png").setInteractive().setScale(0.45);
      this._macroPopup.add(optionsBtn);

      const closeBtn = this.add.image(centerX - (panelWidth / 2) + 20, centerY - (panelHeight / 2) + 20, "GJ_WebSheet", "GJ_closeBtn_001.png").setInteractive().setScale(0.8);
      this._macroPopup.add(closeBtn);

      this._makeBouncyButton(closeBtn, 0.8, () => {
          this.events.off("update", this._refreshMacroButtons);
          this._macroPopup.destroy();
          this._macroPopup = null;
      });

      const importBtn = this.add.image(centerX - 300, centerY + 20,"importMacro").setInteractive();
      const exportBtn = this.add.image(centerX - 150, centerY + 20, "GJ_GameSheet03", "GJ_shareBtn_001.png").setInteractive().setScale(0.53);
      const createBtn = this.add.image(centerX, centerY + 20, "GJ_GameSheet03", "GJ_plusBtn_001.png").setInteractive().setScale(1.2);
      const playbackBtn = this.add.image(centerX + 150, centerY + 20, this._macroBot?.playing ? "stopPlayback" : "playbackMacro").setInteractive().setScale(0.25);
      const recordBtn = this.add.image(centerX + 300, centerY + 20, this._macroBot?.recording ? "stopRecord" : "recordMacro").setInteractive().setScale(0.25);

      this._macroPopup.add([createBtn, importBtn, exportBtn, playbackBtn, recordBtn]);

      this._refreshMacroButtons = () => {
          const playing = !!this._macroBot?.playing;
          const recording = !!this._macroBot?.recording;

          let currentMetaName = this._macroBot?.meta?.name;
          if (currentMetaName && currentMetaName !== this._macroName) {
              this._macroName = currentMetaName;
              this._macroLoaded = true;
          }

          if (this._macroLoaded) {
              loadedNameText.setText(`Currently loaded "${this._macroName || 'macro'}"`);
              optionsBtn.setAlpha(1).setActive(true);
              optionsBtn.x = centerX + (loadedNameText.width / 2) + 25;
          } else {
              loadedNameText.setText("No macro loaded");
              optionsBtn.setAlpha(0).setActive(false);
          }

          playbackBtn.setTexture(
              playing
                  ? "stopPlayback"
                  : "playbackMacro"
          );

          recordBtn.setTexture(
              recording
                  ? "stopRecord"
                  : "recordMacro"
          );

          createBtn.setAlpha((playing || recording || this._macroLoaded) ? 0.5 : 1);
          importBtn.setAlpha((playing || recording) ? 0.5 : 1);
          exportBtn.setAlpha((playing || recording || !this._macroLoaded) ? 0.5 : 1);
          playbackBtn.setAlpha((recording || !this._macroLoaded) ? 0.5 : 1);
          recordBtn.setAlpha((playing || !this._macroLoaded) ? 0.5 : 1);
      };

      this._refreshMacroButtons();

      this._makeBouncyButton(optionsBtn, 0.45, () => {
          if (!this._macroLoaded) return;
          const renamePrompt = prompt("New name", this._macroName);
          if (renamePrompt && renamePrompt.trim() !== "") {
              const cleanName = renamePrompt.trim();
              if (!this._macroBot) this._initMacroBot();

              if (!this._macroBot.meta) {
                  this._macroBot.meta = {};
              }
              this._macroBot.meta.name = cleanName;
              this._macroName = cleanName;
              this._refreshMacroButtons();
          }
      });

      this._makeBouncyButton(importBtn, 1, () => {
          if (this._macroBot?.playing) return;
          if (this._macroBot?.recording) return;
          this._importMacroFile();
      });

      this._makeBouncyButton(exportBtn, 0.53, () => {
          if (this._macroBot?.playing) return;
          if (this._macroBot?.recording) return;
          if (!this._macroLoaded) return;
          this._exportMacroFile(this._macroName ? `${this._macroName}.wbgdr2` : null);
      });

      this._makeBouncyButton(createBtn, 1.2, () => {
          if (this._macroBot?.playing || this._macroBot?.recording || this._macroLoaded) return;
          const name = prompt("Enter macro name");
          if (name) {
              if (!this._macroBot) this._initMacroBot();
              this._macroBot.resetAll();
              this._macroBot.meta.name = name;
              this._macroName = name;
              this._macroLoaded = true;
              this._refreshMacroButtons();
          }
      });

      this._makeBouncyButton(playbackBtn, 0.25, () => {
          if (this._macroBot?.recording) return;
          if (!this._macroLoaded) return;

          if (this._macroBot?.playing) {
              this._stopMacroPlayback();
          } else {
              if (!this._macroBot) {
                  return;
              }
              const macro = this._macroBot.exportObject();
              this._startMacroPlayback(macro);
          }
          this._refreshMacroButtons();
      });

      this._makeBouncyButton(recordBtn, 0.25, () => {
          if (this._macroBot?.playing) return;
          if (!this._macroLoaded) return;

          if (this._macroBot?.recording) {
              this._stopMacroRecording();
          } else {
              this._startMacroRecording({
                  level: window.currentlevel?.[2] || "",
                  name: this._macroName
              });
          }

          this._refreshMacroButtons();
      });

      this.events.on("update", this._refreshMacroButtons);
  }
  _buildInfoPopup() {
    if (this._infoPopup) {
      return;
    }
    const xPos = screenWidth / 2;
    const popupHeight = 320;
    const popupWidth = 336;
    this._infoPopup = this.add.container(0, 0).setScrollFactor(0).setDepth(1000);
    const background = this.add.rectangle(xPos, popupHeight, screenWidth, screenHeight, 0, 100 / 255);
    background.setInteractive();
    this._infoPopup.add(background);

    const bounceContainer = this.add.container(xPos, popupHeight).setScale(0);
    this._infoPopup.add(bounceContainer);
    const cornerRadius = this.textures.get("GJ_square02").source[0].width * 0.325;
    const popupBg = this._drawScale9(0, 0, 480, popupWidth, "GJ_square02", cornerRadius, 16777215, 1);
    bounceContainer.add(popupBg);
    const closeBtn = this.add.image(-240 + 20, -148, "GJ_WebSheet", "GJ_closeBtn_001.png").setScale(0.8).setInteractive();
    bounceContainer.add(closeBtn);
    this._expandHitArea(closeBtn, 2);
    this._makeBouncyButton(closeBtn, 0.8, () => this._closeInfoPopup());
    const title = this.add.bitmapText(0, -124, "bigFont", "Credits", 42).setOrigin(0.5, 0.6);
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

    const creditsEntries = [
      { text: "Made by RobTop Games", scale: 0.8, font: "goldFont" },
      { text: "Lead Developers:", scale: 0.9, font: "bigFont" },
      { text: "breadbb, PinkDev, rohanis0000,", scale: 0.7, font: "goldFont" },
      { text: "Lasokar, and aloaf", scale: 0.7, font: "goldFont" },
      { text: "Former Developers:", scale: 0.9, font: "bigFont" },
      { text: "bog, AntiMatter, and arbstro", scale: 0.7, font: "goldFont" },
      { text: "Contributors:", scale: 0.9, font: "bigFont" },
      { text: "t0nchi7, Itzar, zainojdaf,", scale: 0.7, font: "goldFont" },
      { text: "Ameth7st, and CoraBitz", scale: 0.7, font: "goldFont" },
      { text: "we love you cora <3", scale: 0.4, font: "bigFont" },
      { text: "Playtesters:", scale: 0.9, font: "bigFont" },
      { text: "Ameth7st, Altruist,", scale: 0.7, font: "goldFont" },
      { text: "and Piefaceluke", scale: 0.7, font: "goldFont" },
      { text: "© 2026 RobTop Games. All rights reserved.", scale: 0.4, font: "Arial", color: 0x000000 },
    ];
    let yPos = 0;
    const lineItems = [];
    creditsEntries.forEach(entry => {
      let txt;
      if (entry.font === "Arial") {
        txt = this.add.text(0, yPos, entry.text, {
          fontSize: `${Math.round(32 * (entry.scale || 0.65))}px`,
          fontFamily: "Arial",
          color: entry.color ? `#${entry.color.toString(16).padStart(6, '0')}` : "#ffffff"
        }).setOrigin(0.5, 0);
      } else {
        txt = this.add.bitmapText(0, yPos, entry.font || "bigFont", entry.text, 32)
          .setOrigin(0.5, 0)
          .setScale(entry.scale || 0.65);
        if (entry.color != null) txt.setTint(entry.color);
      }
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
    this._infoPopupCleanup = () => {
      this.events.off('postupdate', updateMask);
      maskShape.destroy();
      geomMask.destroy();
    };
    this.tweens.add({
      targets: bounceContainer,
      scale: { from: 0, to: 1 },
      duration: 660,
      ease: "Elastic.Out",
      easeParams: [1, 0.6]
    });
        this._infoPopupCleanup = () => {
      this.events.off('postupdate', updateMask);
      maskShape.destroy();
      geomMask.destroy();
    };
    this.tweens.add({
      targets: bounceContainer,
      scale: { from: 0, to: 1 },
      duration: 660,
      ease: "Elastic.Out",
      easeParams: [1, 0.6]
    });
  }
  _closeInfoPopup() {
    if (this._infoPopup) {
      if (this._infoPopupCleanup) {
        this._infoPopupCleanup();
        this._infoPopupCleanup = null;
      }
      this._infoPopup.destroy();
      this._infoPopup = null;
        }
    this._infogoaway = () => {
      this.events.off('postupdate', updateMask);
      maskShape.destroy();
      geomMask.destroy();
    };
    this.tweens.add({
      targets: bounceContainer,
      scale: { from: 0, to: 1 },
      duration: 660,
      ease: "Elastic.Out",
      easeParams: [1, 0.6]
    });
  }
  _closeInfoPopup() {
    if (this._infoPopup) {
      if (this._infogoaway) {
        this._infogoaway();
        this._infogoaway = null;
      }
      this._infoPopup.destroy();
      this._infoPopup = null;
    }
  }
  _showReqpopup() {
    if (this._reqpopup) {
      return;
    }

    const xPos = screenWidth / 2;
    const centerY = screenHeight / 2;
    const popupWidth = 475;
    const popupContentHeight = 230;
    this._reqpopup = this.add.container(0, 0).setScrollFactor(0).setDepth(1000);

    const background = this.add.rectangle(xPos, centerY, screenWidth, screenHeight, 0, 100 / 255).setInteractive();
    this._reqpopup.add(background);

    const bounceContainer = this.add.container(xPos, centerY).setScale(0);
    this._reqpopup.add(bounceContainer);

    const cornerRadius = this.textures.get("GJ_square02").source[0].width * 0.325;
    const popupBg = this._drawScale9(0, 0, popupWidth, popupContentHeight, "GJ_square02", cornerRadius, 16777215, 1);
    bounceContainer.add(popupBg);

    const closeBtn = this.add.image(-(popupWidth / 2) + 20, -(popupContentHeight / 2) + 20, "GJ_WebSheet", "GJ_closeBtn_001.png").setScale(0.95).setInteractive();
    bounceContainer.add(closeBtn);
    this._makeBouncyButton(closeBtn, 0.95, () => this._closeReqPopup());

    const fakeloading = this.add.image(0, -10, "loadingCircle").setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.5);
    bounceContainer.add(fakeloading);

    const statusText = this.add.text(0, popupContentHeight / 2 - 40, " Loading...", {
      fontFamily: "Arial",
      fontSize: "26px",
      color: "#ffffff",
      align: "center"
    }).setOrigin(0.5, 0.5);
    bounceContainer.add(statusText);

    const spinTimer = this.time.addEvent({
      delay: 16,
      loop: true,
      callback: () => {
        if (!fakeloading.scene) {
          spinTimer.remove();
          return;
        }
        fakeloading.rotation += 0.1;
      }
    });

    const failTimer = this.time.delayedCall(5000, () => {
      if (!fakeloading.scene || !statusText.scene) return;
      spinTimer.remove();
      fakeloading.clearTint();
      fakeloading.setBlendMode(Phaser.BlendModes.NORMAL);
      fakeloading.setAlpha(1);
      fakeloading.setTexture("GJ_GameSheet03", "exMark_001.png");
      fakeloading.setRotation(0);
      fakeloading.setScale(1.25);
      fakeloading.y = -25;
      statusText.setText("Failed. Please try again never. ");
    });

    this._reqpopupexit = () => {
      spinTimer.remove();
      failTimer.remove();
    };

    this.tweens.add({
      targets: bounceContainer,
      scale: { from: 0, to: 1 },
      duration: 660,
      ease: "Elastic.Out",
      easeParams: [1, 0.6]
    });
  }
  _closeReqPopup() {
    if (this._reqpopup) {
      if (this._reqpopupexit) {
        this._reqpopupexit();
        this._reqpopupexit = null;
      }
      this._reqpopup.destroy();
      this._reqpopup = null;
    }
    }
  _showcontactpopup() {
    if (this._reqpopup) {
      return;
    }

    const xPos = screenWidth / 2;
    const centerY = screenHeight / 2;
    const popupWidth = 500;
    let popupContentHeight = 250;
    this._reqpopup = this.add.container(0, 0).setScrollFactor(0).setDepth(1000);

    const background = this.add.rectangle(xPos, centerY, screenWidth, screenHeight, 0, 100 / 255).setInteractive();
    this._reqpopup.add(background);

    const bounceContainer = this.add.container(xPos, centerY).setScale(0);
    this._reqpopup.add(bounceContainer);

    const cornerRadius = this.textures.get("GJ_square02").source[0].width * 0.325;
    let popupBg = this._drawScale9(0, 0, popupWidth, popupContentHeight, "GJ_square02", cornerRadius, 16777215, 1);
    bounceContainer.add(popupBg);

    const closeBtn = this.add.image(-(popupWidth / 2) + 20, -(popupContentHeight / 2) + 20, "GJ_WebSheet", "GJ_closeBtn_001.png").setScale(1).setInteractive();
    bounceContainer.add(closeBtn);
    this._makeBouncyButton(closeBtn, 1, () => this._closeReqPopup());

    const statusText = this.add.text(0, popupContentHeight / 2 - 90, "Or, call 480-957-8838 for more info.", {
      fontFamily: "Arial",
      fontSize: "26px",
      color: "#ffffff",
      align: "center"
    }).setOrigin(0.5, 0.5);
    bounceContainer.add(statusText);

    const statusText2 = this.add.text(0, popupContentHeight / 2 - 130, "Message pinkdevyt on Discord,", {
      fontFamily: "Arial",
      fontSize: "26px",
      color: "#ffffff",
      align: "center"
    }).setOrigin(0.5, 0.5);
    bounceContainer.add(statusText2);

    const statusText3 = this.add.text(0, popupContentHeight / 2 - 170, "Message rohanis0000 on Discord,", {
      fontFamily: "Arial",
      fontSize: "26px",
      color: "#ffffff",
      align: "center"
    }).setOrigin(0.5, 0.5);
    bounceContainer.add(statusText3);

    const statusText4 = this.add.text(0, popupContentHeight / 2 - 210, "Message lasokar on Discord,", {
      fontFamily: "Arial",
      fontSize: "26px",
      color: "#ffffff",
      align: "center"
    }).setOrigin(0.5, 0.5);
    bounceContainer.add(statusText4);

    const statusText5 = this.add.text(0, popupContentHeight / 2 - 50, "(Pinkdev's real phone number btw)", {
      fontFamily: "Arial",
      fontSize: "17px",
      color: "#92a7c0",
      align: "center"
    }).setOrigin(0.5, 0.5);
    bounceContainer.add(statusText5);

    const statusText6 = this.add.text(0, 25, "...because I created this menu.", {
      fontFamily: "Arial",
      fontSize: "17px",
      color: "#92a7c0",
      align: "center"
    }).setOrigin(0.5, 0.5).setVisible(false);
    bounceContainer.add(statusText6);

    const lock = this.add.image(0, 110, "GJ_GameSheet03", "GJ_lockGray_001.png").setOrigin(0.5).setInteractive();
    this._expandHitArea(lock, 1.5);
    bounceContainer.add(lock);
    let isMessageShown = false;
    this._makeBouncyButton(lock, 1, () => {
      isMessageShown = !isMessageShown;
      if (isMessageShown) {
        statusText.setText("Orrrr... Message ameth7st_nya!").setPosition(0, -10);
        statusText2.setVisible(false);
        statusText3.setVisible(false);
        statusText4.setVisible(false);
        statusText5.setVisible(false);
        statusText6.setVisible(true);
        popupContentHeight = 190;
        lock.setY(80);
      } else {
        statusText.setText("Or, call 480-957-8838 for more info.").setPosition(0, 35);
        statusText2.setVisible(true);
        statusText3.setVisible(true);
        statusText4.setVisible(true);
        statusText5.setVisible(true);
        statusText6.setVisible(false);
        popupContentHeight = 250;
        lock.setY(110);
      }
      popupBg.destroy();
      popupBg = this._drawScale9(0, 0, popupWidth, popupContentHeight, "GJ_square02", cornerRadius, 16777215, 1);
      bounceContainer.addAt(popupBg, 0);
      closeBtn.setPosition(-(popupWidth / 2) + 20, -(popupContentHeight / 2) + 20);
    });

    this.tweens.add({
      targets: bounceContainer,
      scale: { from: 0, to: 1 },
      duration: 660,
      ease: "Elastic.Out",
      easeParams: [1, 0.6]
    });
  }
  _showwippopup() {
      if (this._reqpopup) {
        return;
      }
  
      const xPos = screenWidth / 2;
      const centerY = screenHeight / 2;
      const popupWidth = 500;
      const popupContentHeight = 200;
      this._reqpopup = this.add.container(0, 0).setScrollFactor(0).setDepth(1000);
  
      const background = this.add.rectangle(xPos, centerY, screenWidth, screenHeight, 0, 100 / 255).setInteractive();
      this._reqpopup.add(background);
  
      const bounceContainer = this.add.container(xPos, centerY).setScale(0);
      this._reqpopup.add(bounceContainer);
  
      const cornerRadius = this.textures.get("GJ_square02").source[0].width * 0.325;
      const popupBg = this._drawScale9(0, 0, popupWidth, popupContentHeight, "GJ_square02", cornerRadius, 16777215, 1);
      bounceContainer.add(popupBg);
  
      const closeBtn = this.add.image(-(popupWidth / 2) + 20, -(popupContentHeight / 2) + 20, "GJ_WebSheet", "GJ_closeBtn_001.png").setScale(1).setInteractive();
      bounceContainer.add(closeBtn);
      this._makeBouncyButton(closeBtn, 1, () => this._closeReqPopup());
  
      const allroadsleadtoparticles = this.add.image(0, 100, "GJ_GameSheet03", "GJ_timeIcon_001.png").setOrigin(0.5).setSize(1.5);
      bounceContainer.add(allroadsleadtoparticles);
  
      const text = this.add.text(0, popupContentHeight / 2 - 150, "Coming in another pr later!-", {
        fontFamily: "Arial",
        fontSize: "22px",
        color: "#92a7c0",
        align: "center"
      }).setOrigin(0.5, 0.5);
      bounceContainer.add(text);
  
      const text1 = this.add.text(0, popupContentHeight / 2 - 100, "This is still being worked on.", {
        fontFamily: "Arial",
        fontSize: "26px",
        color: "#ffffff",
        align: "center"
      }).setOrigin(0.5, 0.5);
      bounceContainer.add(text1);
  
      const text2 = this.add.text(0, popupContentHeight / 2 - 50, "Expect this to be finished with particles.", {
        fontFamily: "Arial",
        fontSize: "17px",
        color: "#92a7c0",
        align: "center"
      }).setOrigin(0.5, 0.5);
      bounceContainer.add(text2);
  
      this.tweens.add({
        targets: bounceContainer,
        scale: { from: 0, to: 1 },
        duration: 660,
        ease: "Elastic.Out",
        easeParams: [1, 0.6]
      });
    }
  _closeReqPopup() {
    if (this._reqpopup) {
      if (this._reqpopupexit) {
        this._reqpopupexit();
        this._reqpopupexit = null;
      }
      this._reqpopup.destroy();
      this._reqpopup = null;
    }
  }
  _showServerErrorPopup(message) {
    if (!this.sys.isActive()) return;
    const W = 450, H = 130;
    if (this._serverErrorPopup && this._serverErrorPopup.scene) {
      this._serverErrorTimer.remove(false);
      this._serverErrorTimer = this.time.delayedCall(4000, () => this._hideServerErrorPopup());
      return;
    }
    const box = this.add.container(screenWidth + W / 2 + 15, 15 + H / 2).setScrollFactor(0).setDepth(2000);
    this._serverErrorPopup = box;
    const corner = 0.325 * this.textures.get("GJ_square02").source[0].width;
    const bg = this.add.nineslice(0, 0, "GJ_square02", null, W, H, corner, corner, corner, corner).setOrigin(0.5);
    const icon = this.add.image(-W / 2 + 60, -2, "GJ_GameSheet03", "exMark_001.png");
    icon.setScale(80 / Math.max(icon.width, icon.height));
    const title = this.add.bitmapText(-105, -26, "goldFont", "Server Error", 30).setOrigin(0, 0.5);
    const body = this.add.text(-105, 14, message || "The servers quota has been reached\nfor today. Please try again later.", { // DO YOU UNDERSTAND NOW? DO YOU? DO YOU? STOP MAKING ISSUES ABOUT THE SERVERS NOT WORKING IN THE DISCORD AND GITHUB - SINCERELY, ROOOOOHNANIS
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#ffffff"
    }).setOrigin(0, 0.5);
    box.add([bg, icon, title, body]);
    this.tweens.add({ targets: box, x: screenWidth - W / 2 - 15, duration: 450, ease: "Cubic.Out" });
    this._serverErrorTimer = this.time.delayedCall(4000, () => this._hideServerErrorPopup());
  }
  _hideServerErrorPopup() {
    const box = this._serverErrorPopup;
    if (!box || !box.scene) return;
    this._serverErrorTimer.remove(false);
    this.tweens.killTweensOf(box);
    this.tweens.add({
      targets: box,
      x: screenWidth + 300,
      duration: 400,
      ease: "Cubic.In",
      onComplete: () => {
        box.destroy();
        this._serverErrorPopup = null;
      }
    });
  }
  InfoBoxDoAThing(displayText) {
    if (this.EditInfoText) {
      this.InfoBoxStopAThing();
    }

    const xPos = screenWidth / 2;
    const centerY = screenHeight / 2;
    this.EditInfoText = this.add.container(0, 0).setScrollFactor(0).setDepth(1000);

    const background = this.add.rectangle(xPos, centerY, screenWidth, screenHeight, 0, 0.5).setInteractive();
    this.EditInfoText.add(background);

    const box = this.add.container(xPos, centerY).setScale(0);
    this.EditInfoText.add(box);

    const cornerRadius = this.textures.get("GJ_square01").source[0].width * 0.325;
    const boxWidth = 720;
    const boxHeight = 280;
    box.add(this._drawScale9(0, 0, boxWidth, boxHeight, "square01_001", cornerRadius, 0xffffff, 1));
    box.add(this.add.bitmapText(-4, -90, "goldFont", "Info", 45).setOrigin(0.5));

    const textAreaW = boxWidth - 60;
    const textAreaH = boxHeight - 140;

    const wrapText = (text, maxChars) => {
      const words = String(text).split(" ");
      const lines = [];
      let line = "";
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if ((line + (line ? " " : "") + word).length <= maxChars) {
          line = line ? `${line} ${word}` : word;
        } else {
          if (line) lines.push(line);
          line = word;
        }
      }
      if (line) lines.push(line);
      return lines;
    };

    const infoText = String(displayText || "");
    const wrappedText = wrapText(infoText, 40);
    let y = -30;

    wrappedText.forEach(line => {
      box.add(this.add.text(0, y, line, {
        fontFamily: "Arial",
        fontSize: "30px",
        color: "#ffffff",
        align: "center"
      }).setOrigin(0.5, 0));
      y += 32;
    });

    const okBtnBg = this._drawScale9(0, 0, 100, 60, "GJ_button01", this.textures.get("GJ_button01").source[0].width * 0.3, 0xffffff, 1);
    const okBtn = this.add.rectangle(0, 0, 100, 60).setInteractive();
    const okLabel = this.add.bitmapText(0, 0, "goldFont", "OK", 48).setOrigin(0.55);
    const okGroup = this.add.container(0, boxHeight / 2 - 50, [okBtnBg, okBtn, okLabel]);
    okBtn._bouncyVisualTarget = okGroup;
    box.add(okGroup);

    this._makeBouncyButton(okBtn, 1.0, () => {
      this.InfoBoxStopAThing();
    });

    this.tweens.add({
      targets: box,
      scale: { from: 0, to: 1 },
      duration: 660,
      ease: "Elastic.Out",
      easeParams: [1, 0.6]
    });
  }
  InfoBoxStopAThing() {
    if (!this.EditInfoText) return;

    if (this._infoEscKey) {
      this._infoEscKey.off('down', this._infoEscHandler);
      this._infoEscKey.destroy();
      this._infoEscKey = null;
      this._infoEscHandler = null;
    }

    this.EditInfoText.destroy();
    this.EditInfoText = null;
  }
 _buildHowToPlayPopup() {
  if (this._howToPlayPopup) {
    return;
  }
  const TUTORIAL_PAGES = ["tutorial_01", "tutorial_02", "tutorial_03", "tutorial_04", "tutorial_05"];
  const GREEN = 0x00e719;
  const YELLOW = 0xf8ff00;
  const BLUE = 0x3cadf5;
  const TUTORIAL_DESCRIPTIONS = [
    { fontSize: 40, lines: [
      [{ text: "TAP", color: GREEN }, { text: " the screen to jump." }],
      [{ text: "HOLD", color: GREEN }, { text: " down to keep jumping." }]
    ]},
    { fontSize: 40, lines: [
      [{ text: "Hold", color: GREEN }, { text: " to fly up." }],
      [{ text: "Release", color: GREEN }, { text: " to fly down." }]
    ]},
    { fontSize: 35, lines: [
      [{ text: "You can enter " }, { text: "practice mode", color: BLUE }, { text: " from" }],
      [{ text: "the pause menu." }],
      [{ text: "Practice mode lets you place" }],
      [{ text: "checkpoints", color: GREEN }, { text: "." }]
    ]},
    { fontSize: 35, lines: [
      [{ text: "You can place checkpoints manually, or" }],
      [{ text: "use the auto-checkpoints feature." }],
      [{ text: "Tap the delete button to remove your" }],
      [{ text: "last checkpoint." }]
    ]},
    { fontSize: 35, lines: [
      [{ text: "Jump Orbs", color: YELLOW }, { text: " activate when you are on" }],
      [{ text: "top of them." }],
      [{ text: "TAP", color: GREEN }, { text: " while touching an orb to" }],
      [{ text: "interact with it and use its effect." }]
    ]}
  ];
  const TOTAL_PAGES = TUTORIAL_PAGES.length;
  let currentPage = 0;

  const xPos = screenWidth / 2;
  const _0x4c3182 = 320;
  this._howToPlayPopup = this.add.container(0, 0).setScrollFactor(0).setDepth(300);
  const _0x249eb7 = this.add.rectangle(xPos, _0x4c3182, screenWidth, screenHeight, 0, 100 / 255);
  _0x249eb7.setInteractive();
  this._howToPlayPopup.add(_0x249eb7);
  const _0x14e46f = this.textures.get("GJ_square01").source[0].width * 0.325;
  const panelContainer = this.add.container(xPos, _0x4c3182).setScrollFactor(0).setScale(0);
  this._howToPlayPopup.add(panelContainer);
  const _0x2c64c2 = this._drawScale9(0, 0, 830, 530, "GJ_square01", _0x14e46f, 16777215, 1);
  panelContainer.add(_0x2c64c2);
  const _0x5a0f88 = this.add.image(-240 - 160, 172 - _0x4c3182 - 110, "GJ_WebSheet", "GJ_closeBtn_001.png").setScale(0.8).setInteractive();
  this._expandHitArea(_0x5a0f88, 2);
  this._makeBouncyButton(_0x5a0f88, 0.8, () => this._closeHowToPlayPopup());
  panelContainer.add(_0x5a0f88);
  const howToPlayTitle = this.add.bitmapText(0, -210, "bigFont", "How To Play", 62).setOrigin(0.5, 0.5);
  panelContainer.add(howToPlayTitle);
  const DESC_TOP_Y = -195;
  const DESC_BOT_Y = 15;
  const DESC_MAX_H = DESC_BOT_Y - DESC_TOP_Y;

  let descLineObjects = [];

  const _buildDescLines = (pageIndex) => {
    for (const obj of descLineObjects) obj.destroy();
    descLineObjects = [];

    const page = TUTORIAL_DESCRIPTIONS[pageIndex];
    if (!page || !page.lines.length) return;

    const fontSize = page.fontSize;
    const lineSpacing = 0.35;
    const lineH = fontSize * (1 + lineSpacing);
    const startY = DESC_TOP_Y + fontSize / 0.5;

    for (let i = 0; i < page.lines.length; i++) {
      const segments = page.lines[i];
      const lineY = startY + i * lineH;
      if (segments.length === 1 && !segments[0].color) {
        const obj = this.add.bitmapText(0, lineY, "bigFont", segments[0].text, fontSize)
          .setOrigin(0.5, 0.5);
        panelContainer.add(obj);
        descLineObjects.push(obj);
        continue;
      }
      const measured = segments.map(seg => {
        const tmp = this.add.bitmapText(0, -9999, "bigFont", seg.text, fontSize);
        const w = tmp.width;
        tmp.destroy();
        return w;
      });
      const totalW = measured.reduce((a, b) => a + b, 0);
      let curX = -totalW / 2;

      for (let s = 0; s < segments.length; s++) {
        const seg = segments[s];
        const obj = this.add.bitmapText(curX, lineY, "bigFont", seg.text, fontSize)
          .setOrigin(0, 0.5);
        if (seg.color) obj.setTint(seg.color);
        panelContainer.add(obj);
        descLineObjects.push(obj);
        curX += measured[s];
      }
    }
  };

  _buildDescLines(0);
  const tutorialImage = this.add.image(-240 + 150, 155, TUTORIAL_PAGES[0]);
  panelContainer.add(tutorialImage);
  const nextGroup = this.add.container(-240 + 550, 165);
  const nextBtnW = 125, nextBtnH = 80;
  const nextBtnBorder = this.textures.get("GJ_button01").source[0].width * 0.3;
  const nextBtn9 = this._drawScale9(0, 0, nextBtnW, nextBtnH, "GJ_button01", nextBtnBorder, 0xffffff, 1);
  const nextBtn = this.add.rectangle(0, 0, nextBtnW, nextBtnH).setInteractive();
  const nextLabel = this.add.bitmapText(-5, -2.5, "bigFont", "Next", 35).setOrigin(0.5, 0.5);
  nextGroup.add(nextBtn9);
  nextGroup.add(nextBtn);
  nextGroup.add(nextLabel);
  panelContainer.add(nextGroup);

  nextBtn.on("pointerdown", () => {
    nextGroup._pressed = true;
    this.tweens.killTweensOf(nextGroup);
    this.tweens.add({ targets: nextGroup, scaleX: 1.26, scaleY: 1.26, duration: 300, ease: "Bounce.Out" });
  });
  nextBtn.on("pointerout", () => {
    if (nextGroup._pressed) {
      nextGroup._pressed = false;
      this.tweens.killTweensOf(nextGroup);
      this.tweens.add({ targets: nextGroup, scaleX: 1, scaleY: 1, duration: 400, ease: "Bounce.Out" });
    }
  });
  nextBtn.on("pointerup", () => {
    if (!nextGroup._pressed) return;
    nextGroup._pressed = false;
    this.tweens.killTweensOf(nextGroup);
    nextGroup.setScale(1);

    if (currentPage >= TOTAL_PAGES - 1) {
      this._closeHowToPlayPopup();
    } else {
      currentPage++;
      tutorialImage.setTexture(TUTORIAL_PAGES[currentPage]);
      _buildDescLines(currentPage);
      nextLabel.setText(currentPage >= TOTAL_PAGES - 1 ? "Exit" : "Next");
    }
  });
  this.tweens.add({
    targets: panelContainer,
    scale: 1,
    duration: 660,
    ease: "Elastic.Out",
    easeParams: [1, 0.6]
  });
}
  _closeHowToPlayPopup() {
    if (this._howToPlayPopup) {
      this._howToPlayPopup.destroy();
      this._howToPlayPopup = null;
    }
  }
  _buildNewgroundsPopup() {
    if (this._newgroundsPopup || window.levelID) return;
    const xPos = screenWidth / 2;
    const centerY = screenHeight / 2;
    this._newgroundsPopup = this.add.container(0, 0).setScrollFactor(0).setDepth(1000);
    const background = this.add.rectangle(xPos, centerY, screenWidth, screenHeight, 0, 100 / 255);
    background.setInteractive();
    this._newgroundsPopup.add(background);
    const bounceContainer = this.add.container(xPos, centerY).setScale(0);
    this._newgroundsPopup.add(bounceContainer);
    const cornerRadius = this.textures.get("square01_001").source[0].width * 0.325;
    const panelBg = this._drawScale9(0, 0, 460, 240, "square01_001", cornerRadius, 16777215, 1);
    bounceContainer.add(panelBg);
    const title = this.add.bitmapText(0, -76, "goldFont", "Newgrounds", 40).setOrigin(0.5, 0.5);
    bounceContainer.add(title);
    const body = this.add.text(0, -10, "Visit Newgrounds to find awesome\nmusic?", {
      fontSize: "25px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      align: "center"
    }).setOrigin(0.5, 0.5);
    bounceContainer.add(body);
    const cancelGroup = this.add.container(-70, 65);
    const cancelBtnW = 165, cancelBtnH = 55;
    const cancelBtnBorder = this.textures.get("GJ_button01").source[0].width * 0.3;
    const cancelBtn9 = this._drawScale9(0, 0, cancelBtnW, cancelBtnH, "GJ_button01", cancelBtnBorder, 0xffffff, 1);
    const cancelBtn = this.add.rectangle(0, 0, cancelBtnW, cancelBtnH).setInteractive();
    cancelGroup.add(cancelBtn9);
    cancelGroup.add(cancelBtn);
    const cancelLabel = this.add.bitmapText(-2, -3, "goldFont", "Cancel", 38).setOrigin(0.5, 0.5);
    cancelGroup.add(cancelLabel);
    bounceContainer.add(cancelGroup);
    cancelBtn.on("pointerdown", () => { cancelGroup._pressed = true; this.tweens.killTweensOf(cancelGroup); this.tweens.add({ targets: cancelGroup, scaleX: 1.26, scaleY: 1.26, duration: 300, ease: "Bounce.Out" }); });
    cancelBtn.on("pointerout", () => { if (cancelGroup._pressed) { cancelGroup._pressed = false; this.tweens.killTweensOf(cancelGroup); this.tweens.add({ targets: cancelGroup, scaleX: 1, scaleY: 1, duration: 400, ease: "Bounce.Out" }); } });
    cancelBtn.on("pointerup", () => { if (cancelGroup._pressed) { cancelGroup._pressed = false; this.tweens.killTweensOf(cancelGroup); cancelGroup.setScale(1); this._closeNewgroundsPopup(); } });
    const openGroup = this.add.container(90, 65);
    const openBtnW = 125, openBtnH = 55;
    const openBtnBorder = this.textures.get("GJ_button01").source[0].width * 0.3;
    const openBtn9 = this._drawScale9(0, 0, openBtnW, openBtnH, "GJ_button01", openBtnBorder, 0xffffff, 1);
    const openBtn = this.add.rectangle(0, 0, openBtnW, openBtnH).setInteractive();
    openGroup.add(openBtn9);
    openGroup.add(openBtn);
    const openLabel = this.add.bitmapText(-2, -3, "goldFont", "Open", 39).setOrigin(0.5, 0.5);
    openGroup.add(openLabel);
    bounceContainer.add(openGroup);
    openBtn.on("pointerdown", () => { openGroup._pressed = true; this.tweens.killTweensOf(openGroup); this.tweens.add({ targets: openGroup, scaleX: 1.26, scaleY: 1.26, duration: 300, ease: "Bounce.Out" }); });
    openBtn.on("pointerout", () => { if (openGroup._pressed) { openGroup._pressed = false; this.tweens.killTweensOf(openGroup); this.tweens.add({ targets: openGroup, scaleX: 1, scaleY: 1, duration: 400, ease: "Bounce.Out" }); } });
    openBtn.on("pointerup", () => { if (openGroup._pressed) { openGroup._pressed = false; this.tweens.killTweensOf(openGroup); openGroup.setScale(1); this._closeNewgroundsPopup(); window.open("https://www.newgrounds.com/audio", "_blank"); } });
    this.tweens.add({
      targets: bounceContainer,
      scale: { from: 0, to: 1 },
      duration: 660,
      ease: "Elastic.Out",
      easeParams: [1, 0.6]
    });
  }
  _buildNewsPopup() {
    if (this._newsPopup) return;
    const xPos = screenWidth / 2;
    const centerY = screenHeight / 2;
    const panelW = 900;
    const panelH = 550;
    this._newsPopup = this.add.container(0, 0).setScrollFactor(0).setDepth(1000);
    const background = this.add.rectangle(xPos, centerY, screenWidth, screenHeight, 0, 100 / 255);
    background.setInteractive();
    this._newsPopup.add(background);
    const cornerRadius = this.textures.get("GJ_square01").source[0].width * 0.325;
    const panelBg = this.add.nineslice(xPos, centerY, "GJ_square01", null, panelW, panelH, cornerRadius, cornerRadius, cornerRadius, cornerRadius).setOrigin(0.5);
    this._newsPopup.add(panelBg);
    const _nl = xPos - panelW / 2, _nr = xPos + panelW / 2, _nt = centerY - panelH / 2, _nb = centerY + panelH / 2;
    const _newsCorners = [
      this.add.image(_nl, _nt, "GJ_GameSheet03", "dailyLevelCorner_001.png").setOrigin(0, 0).setFlipY(true),
      this.add.image(_nr, _nt, "GJ_GameSheet03", "dailyLevelCorner_001.png").setOrigin(1, 0).setFlipY(true).setFlipX(true),
      this.add.image(_nl, _nb, "GJ_GameSheet03", "dailyLevelCorner_001.png").setOrigin(0, 1),
      this.add.image(_nr, _nb, "GJ_GameSheet03", "dailyLevelCorner_001.png").setOrigin(1, 1).setFlipX(true)
    ];
    _newsCorners.forEach(c => this._newsPopup.add(c));
    const titleText = this.add.bitmapText(xPos, _nt + 42, "goldFont", "News", 52).setOrigin(0.5, 0.5);
    this._newsPopup.add(titleText);
    const _newsTemplate = { date: "November 23rd, 2026", title: "Minor Bug Fix Update - V2.01", notes: ["A bunch of bugs have been fixed plus minor changes and additions.", "This update includes:", "- Revamped Create Menu UI", "- Fixed some physics and gameplay bugs", "- Revamped Stats Menu", "- Seperated UI from game-scene (now ui-scene) (MAINLY FOR DEVELOPERS)", "- Fixed dash orb cancelling", "- Fixed levels seeming broken for a split moment before fully loading", "- and more i dont remember"] };
    const newsPages = (this._newsPages && this._newsPages.length) ? this._newsPages : [_newsTemplate];
    const pageCount = newsPages.length;
    let newsPage = 0;
    const pageText = this.add.bitmapText(_nr - 90, _nt + 62, "goldFont", `1 of ${pageCount}`, 26).setOrigin(1, 0.5);
    this._newsPopup.add(pageText);
    const _refreshNewsPage = () => {
      pageText.setText(`${newsPage + 1} of ${pageCount}`);
      if (this._newsRenderPage) this._newsRenderPage(newsPage);
    };
    if (pageCount > 1) {
      const arrowY = centerY;
      const arrowMargin = 40;
      const prevArrow = this.add.image(_nl - arrowMargin, arrowY, "GJ_GameSheet03", "GJ_arrow_01_001.png").setInteractive();
      const nextArrow = this.add.image(_nr + arrowMargin, arrowY, "GJ_GameSheet03", "GJ_arrow_01_001.png").setFlipX(true).setInteractive();
      this._newsPopup.add([prevArrow, nextArrow]);
      this._makeBouncyButton(prevArrow, 1, () => {
        newsPage = (newsPage - 1 + pageCount) % pageCount;
        _refreshNewsPage();
      });
      this._makeBouncyButton(nextArrow, 1, () => {
        newsPage = (newsPage + 1) % pageCount;
        _refreshNewsPage();
      });
    }
    const boxL = _nl + 80, boxR = _nr - 80, boxT = _nt + 90, boxB = _nb - 22;
    const boxW = boxR - boxL, boxH = boxB - boxT;
    const boxBorder = 4, boxRadius = 20;
    const boxGfx = this.add.graphics();
    boxGfx.fillStyle(0x8c3b15, 1).fillRoundedRect(boxL, boxT, boxW, boxH, boxRadius);
    boxGfx.fillStyle(0x844022, 1).fillRoundedRect(boxL + boxBorder, boxT + boxBorder, boxW - boxBorder * 2, boxH - boxBorder * 2, boxRadius - boxBorder);
    this._newsPopup.add(boxGfx);

    const viewT = boxT + boxBorder, viewH = boxH - boxBorder * 2;
    const scrollContent = this.add.container(0, 0);
    this._newsPopup.add(scrollContent);
    const maskShape = this.add.graphics().fillStyle(0xffffff).fillRect(boxL + boxBorder, viewT, boxW - boxBorder * 2, viewH).setVisible(false);
    scrollContent.setMask(maskShape.createGeometryMask());

    const scrollPad = 4;
    const trackX = boxR - boxBorder - 14, trackW = 9;
    const scrollThumb = this.add.rectangle(trackX, viewT + scrollPad, trackW, 40, 0xffffff, 0.22).setOrigin(0.5, 0);
    this._newsPopup.add(scrollThumb);

    let contentHeight = 0, scrollY = 0;
    const _updateNewsScroll = () => {
      const maxScroll = Math.max(0, contentHeight - viewH);
      scrollY = Phaser.Math.Clamp(scrollY, 0, maxScroll);
      scrollContent.y = -scrollY;
      const trackH = viewH - scrollPad * 2;
      const thumbH = trackH * 0.8;
      scrollThumb.setSize(trackW, thumbH);
      scrollThumb.y = viewT + scrollPad + (maxScroll > 0 ? (trackH - thumbH) * (scrollY / maxScroll) : 0);
    };
    this._newsScroll = {
      content: scrollContent,
      top: viewT,
      left: boxL + boxBorder,
      width: boxW - boxBorder * 2,
      setContentHeight: (h) => { contentHeight = h; scrollY = 0; _updateNewsScroll(); }
    };
    _updateNewsScroll();
    this._newsRenderPage = (index) => {
      const entry = newsPages[index] || _newsTemplate;
      scrollContent.removeAll(true);
      const padX = 30;
      const textX = boxL + boxBorder + padX;
      const textW = boxW - boxBorder * 2 - padX - 44;
      let y = viewT + 22;

      const dateText = this.add.bitmapText(textX, y, "goldFont", entry.date || "", 25).setOrigin(0, 0);
      scrollContent.add(dateText);
      y += dateText.height + 22;

      const titleTxt = this.add.bitmapText(textX, y, "bigFont", entry.title || "", 44).setOrigin(0, 0).setMaxWidth(textW);
      scrollContent.add(titleTxt);
      y += titleTxt.height + 22;

      (entry.notes || []).forEach((note) => {
        const noteText = this.add.text(textX, y, note, {
          fontFamily: "Arial, sans-serif",
          fontSize: "20px",
          color: "#ffffff",
          wordWrap: { width: textW },
          lineSpacing: 6
        }).setOrigin(0, 0);
        scrollContent.add(noteText);
        y += noteText.height + 18;
      });

      this._newsScroll.setContentHeight(y + 20 - viewT);
    };
    this._newsRenderPage(0);

    const _inBox = (pointer) => pointer.x >= boxL && pointer.x <= boxR && pointer.y >= boxT && pointer.y <= boxB;
    const _onNewsWheel = (pointer, objs, dx, dy) => {
      if (!_inBox(pointer)) return;
      scrollY += dy * 0.5;
      _updateNewsScroll();
    };
    let dragging = false, dragStartY = 0, dragStartScroll = 0;
    const _onNewsDown = (pointer) => {
      if (!_inBox(pointer)) return;
      dragging = true; dragStartY = pointer.y; dragStartScroll = scrollY;
    };
    const _onNewsMove = (pointer) => {
      if (!dragging) return;
      scrollY = dragStartScroll - (pointer.y - dragStartY);
      _updateNewsScroll();
    };
    const _onNewsUp = () => { dragging = false; };
    this.input.on("wheel", _onNewsWheel);
    this.input.on("pointerdown", _onNewsDown);
    this.input.on("pointermove", _onNewsMove);
    this.input.on("pointerup", _onNewsUp);
    this._newsCleanup = () => {
      this.input.off("wheel", _onNewsWheel);
      this.input.off("pointerdown", _onNewsDown);
      this.input.off("pointermove", _onNewsMove);
      this.input.off("pointerup", _onNewsUp);
      maskShape.destroy();
    };

    const closeBtn = this.add.image(_nl + 20, _nt + 20, "GJ_WebSheet", "GJ_closeBtn_001.png").setScale(0.8).setInteractive();
    this._newsPopup.add(closeBtn);
    this._expandHitArea(closeBtn, 2);
    this._makeBouncyButton(closeBtn, 0.8, () => this._closeNewsPopup());
  }
  _closeNewsPopup() {
    if (this._newsCleanup) {
      this._newsCleanup();
      this._newsCleanup = null;
    }
    this._newsScroll = null;
    this._newsRenderPage = null;
    if (this._newsPopup) {
      this._newsPopup.destroy();
      this._newsPopup = null;
    }
  }
  async _fetchSpecialLevel(CFG) {
    const PROXY_BASE = (window._gdProxyUrl || "").replace(/\/$/, "");
    if (!PROXY_BASE) throw new Error("no proxy configured");
    const post = async (path, body) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 12000);
      try {
        const res = await fetch(`${PROXY_BASE}/${path}`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
          signal: ctrl.signal
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.text();
      } finally {
        clearTimeout(timer);
      }
    };
    const parseKV = (str, sep) => {
      const p = str.split(sep), o = {};
      for (let i = 0; i + 1 < p.length; i += 2) o[p[i]] = p[i + 1];
      return o;
    };
    const buildLevel = (m, author, songName) => {
      const isDemon = parseInt(m["17"]) === 1;
      const isAuto = parseInt(m["25"]) === 1;
      let diffIdx;
      if (isAuto) diffIdx = 11;
      else if (isDemon) {
        const d9 = parseInt(m["9"]), d43 = parseInt(m["43"]);
        if (!isNaN(d9) && d9 >= 1 && d9 <= 5) diffIdx = [7, 8, 6, 9, 10][d9 - 1] ?? 8;
        else if (!isNaN(d43)) { const mp = { 3: 7, 4: 8, 0: 6, 5: 9, 6: 10 }; diffIdx = mp.hasOwnProperty(d43) ? mp[d43] : 8; }
        else diffIdx = 8;
      } else {
        diffIdx = Math.min(5, Math.max(0, Math.round((parseInt(m["9"]) || 0) / 10)));
      }
      const customSongID = (m["35"] || "").trim();
      const isCustomSong = !!customSongID && customSongID !== "0";
      return {
        id: m["1"] || null,
        name: (m["2"] || "Unknown").trim(),
        author: author || "Unknown",
        difficulty: diffIdx,
        downloads: parseInt(m["10"]) || 0,
        likes: parseInt(m["14"]) || 0,
        length: parseInt(m["15"]) || 0,
        stars: parseInt(m["18"]) || 0,
        diamonds: parseInt(m["46"]) || 0,
        orbs: parseInt(m["48"]) || 0,
        coins: parseInt(m["37"]) || 0,
        coinsVerified: m["38"] === "1",
        customSongID: isCustomSong ? customSongID : null,
        songName,
        featured: (parseInt(m["19"]) || 0) > 0,
        epic: parseInt(m["42"]) || 0,
        isDaily: CFG.kind === "daily",
        levelKind: CFG.kind,
        dailyNumber: null
      };
    };
    const officialSongName = (m) => {
      const o = parseInt(m["12"]) || 0;
      return (window.allLevels && window.allLevels[o]) ? window.allLevels[o][1] : "Unknown";
    };

    let lvl = null;
    try {
      const raw = await post("getGJLevels21.php", `secret=Wmfd2893gb7&page=0&type=${CFG.listType}`);
      if (raw && raw !== "-1") {
        const sections = raw.split("#");
        const first = (sections[0] || "").split("|").filter(Boolean)[0];
        if (first) {
          const m = parseKV(first, ":");
          const playerMap = {};
          for (const ps of (sections[1] || "").split("|").filter(Boolean)) {
            const p = ps.split(":");
            if (p.length >= 2) playerMap[p[0]] = p[1];
          }
          const songMap = {};
          for (const ss of (sections[2] || "").split("~:~").filter(Boolean)) {
            const sm = parseKV(ss, "~|~");
            if (sm["1"]) songMap[sm["1"]] = sm["2"] || "";
          }
          const customId = (m["35"] || "").trim();
          const songName = (customId && customId !== "0")
            ? (songMap[customId] || ("Song #" + customId))
            : officialSongName(m);
          lvl = buildLevel(m, playerMap[m["6"]], songName);
        }
      }
    } catch (e) {
      console.warn("Daily list request failed", e);
    }
    if (!lvl) {
      const raw = await post("downloadGJLevel22.php", `levelID=${CFG.dlId}&secret=Wmfd2893gb7`);
      if (!raw || raw === "-1" || !raw.includes(":")) throw new Error("no daily level");
      const segs = raw.split("#");
      const m = parseKV(segs[0], ":");
      let author = "Unknown";
      for (const seg of segs.slice(1)) {
        const pm = /^\d+:([^:#|]+):\d+$/.exec(seg);
        if (pm) { author = pm[1]; break; }
      }
      const customId = (m["35"] || "").trim();
      const songName = (customId && customId !== "0") ? ("Song #" + customId) : officialSongName(m);
      lvl = buildLevel(m, author, songName);
    }
    try {
      const t = await post("getGJDailyLevel.php", `type=${CFG.numType}&secret=Wmfd2893gb7`);
      const n = parseInt((t || "").split("|")[0]);
      if (n > 0) lvl.dailyNumber = n;
    } catch (_e) {}
    return lvl;
  }
  _buildSpecialLevelPopup(kind) {
    const S = this._specialLevelStyles()[kind];
    const popupKey = `_${kind}LevelPopup`, spinKey = `_${kind}SpinTween`, slideKey = `_${kind}SlideTween`;
    if (this[popupKey]) return;
    const xPos = screenWidth / 2;
    const centerY = screenHeight / 2;
    const panelW = 800;
    const panelH = 550;
    this[popupKey] = this.add.container(0, 0).setScrollFactor(0).setDepth(1000);
    const popupRef = this[popupKey];
    const background = this.add.rectangle(xPos, centerY, screenWidth, screenHeight, 0, 100 / 255);
    background.setInteractive();
    this[popupKey].add(background);
    const panelGroup = this.add.container(-screenWidth, 0).setScrollFactor(0);
    this[popupKey].add(panelGroup);
    const cornerRadius = this.textures.get("GJ_square01").source[0].width * 0.325;
    const panelBg = this.add.nineslice(xPos, centerY, S.panelTex, null, panelW, panelH, cornerRadius, cornerRadius, cornerRadius, cornerRadius).setOrigin(0.5);
    if (S.panelTint != null) panelBg.setTint(S.panelTint);
    panelGroup.add(panelBg);
    const _nl = xPos - panelW / 2, _nr = xPos + panelW / 2, _nt = centerY - panelH / 2, _nb = centerY + panelH / 2;
    const _cut = S.cornerCut || 0, _ins = S.cornerInset || 0;
    const _off = S.cornerOffsets || {};
    const _o = (k) => _off[k] || {};
    const _corners = [
      this.add.image(_nl + _ins + (_o("tl").x || 0), _nt + _ins + (_o("tl").y || 0), "GJ_GameSheet03", S.cornerFrame).setOrigin(0, 0).setFlipY(true),
      this.add.image(_nl + _ins + (_o("bl").x || 0), _nb - _ins + (_o("bl").y || 0), "GJ_GameSheet03", S.cornerFrame).setOrigin(0, 1),
      this.add.image(_nr - _ins + (_o("br").x || 0), _nb - _ins + (_o("br").y || 0), "GJ_GameSheet03", S.cornerFrame).setOrigin(1, 1).setFlipX(true)
    ];
    if (S.cornerScale) _corners.forEach(c => c.setScale(S.cornerScale));
    _corners.forEach(c => panelGroup.add(c));
    if (_cut > 0) {
      const lineG = this.add.graphics();
      lineG.lineStyle(4, 0x000000, 1);
      const _lo = S.lineOffsets || {};
      [["br", _nr, _nb - _cut, _nr - _cut, _nb],
      ["bl", _nl, _nb - _cut, _nl + _cut, _nb]]
        .forEach(([k, x1, y1, x2, y2]) => {
          const dx = (_lo[k] && _lo[k].x) || 0, dy = (_lo[k] && _lo[k].y) || 0;
          const fullLen = Math.hypot(x2 - x1, y2 - y1);
          const len = (S.lineLength != null) ? S.lineLength : fullLen;
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
          const ux = (x2 - x1) / fullLen, uy = (y2 - y1) / fullLen;
          lineG.lineBetween(mx - ux * len / 2 + dx, my - uy * len / 2 + dy,
            mx + ux * len / 2 + dx, my + uy * len / 2 + dy);
        });
      panelGroup.add(lineG);
    }

    const _labelTex = this.textures.get("GJ_GameSheet03");
    const _labelFrame = S.labelFrames.find(n => _labelTex && _labelTex.has(n));
    if (_labelFrame) {
      panelGroup.add(this.add.image(xPos, _nt + 60, "GJ_GameSheet03", _labelFrame).setOrigin(0.5, 0.5));
    } else if (S.labelText) {
      panelGroup.add(this.add.bitmapText(xPos, _nt + 60, "goldFont", S.labelText, 52).setOrigin(0.5, 0.5));
    }

    const safeBtn = this.add.image(_nr - 20, _nt + 15, "GJ_GameSheet04", "GJ_safeBtn_001.png").setOrigin(1, 0);
    safeBtn.postFX.addColorMatrix().grayscale(1);
    safeBtn.setTint(0xafafaf);
    panelGroup.add(safeBtn);

    const closeBtn = this.add.image(_nl + 20, _nt + 20, "GJ_WebSheet", "GJ_closeBtn_001.png").setInteractive();
    panelGroup.add(closeBtn);
    this._expandHitArea(closeBtn, 2);
    this._makeBouncyButton(closeBtn, 1, () => this._closeSpecialLevelPopup(kind));
    this[slideKey] = this.tweens.add({
      targets: panelGroup,
      x: 0,
      duration: 600,
      ease: "Elastic.Out",
      easeParams: [1, 0.9]
    });
    const cellW = 720, cellH = 220;
    const cellCX = xPos, cellCY = centerY + 25;
    const cl = cellCX - cellW / 2, ct = cellCY - cellH / 2;
    const alive = () => this[popupKey] === popupRef && popupRef.scene;
    const pickFrame = (sheet, names) => {
      const tex = this.textures.get(sheet);
      for (const n of names) if (tex && tex.has(n)) return n;
      return null;
    };

    const spin = this.add.image(cellCX, cellCY, "loadingCircle").setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.5);
    panelGroup.add(spin);
    this[spinKey] = this.tweens.add({ targets: spin, angle: 360, duration: 900, repeat: -1 });
    const stopSpin = () => {
      if (this[spinKey]) { this[spinKey].stop(); this[spinKey] = null; }
      if (spin.scene) spin.destroy();
    };

    const showError = () => {
      if (!alive()) return;
      stopSpin();
      this._showServerErrorPopup();
    };

    const _diffFrames = [
      "difficulty_00_btn_001.png", "difficulty_01_btn_001.png", "difficulty_02_btn_001.png",
      "difficulty_03_btn_001.png", "difficulty_04_btn_001.png", "difficulty_05_btn_001.png",
      "difficulty_06_btn_001.png", "difficulty_07_btn_001.png", "difficulty_08_btn_001.png",
      "difficulty_09_btn_001.png", "difficulty_10_btn_001.png", "difficulty_auto_btn_001.png"
    ];
    const _diffSizes = [[60,85],[60,85],[86,85],[60,84],[85,84],[76,85],[72,88],[72,85],[72,85],[74,88],[80,91],[60,85]];
    const _officialGDSongs = [
      "Stereo Madness","Back On Track","Polargeist","Dry Out","Base After Base",
      "Can't Let Go","Jumper","Time Machine","Cycles","xStep","Clutterfunk",
      "Theory of Everything","Electroman Adventures","Clubstep","Electrodynamix",
      "Hexagon Force","Blast Processing","Theory of Everything 2",
      "Geometrical Dominator","Deadlocked","Fingerdash","Dash"
    ];

    const renderCell = (lvl) => {
      stopSpin();
      const cr = this.textures.get("GJ_square02").source[0].width * 0.325;
      const cellBg = this.add.nineslice(cellCX, cellCY, S.cellTex, null, cellW, cellH, cr, cr, cr, cr).setOrigin(0.5);
      if (S.cellTint != null) cellBg.setTint(S.cellTint);
      panelGroup.add(cellBg);
      const dIdx = Math.min(_diffFrames.length - 1, Math.max(0, lvl.difficulty || 0));
      const [dw, dh] = _diffSizes[dIdx];
      const dScale = Math.min(85 / dh, 90 / dw);
      let ratingFrame = null;
      if (lvl.epic >= 3) ratingFrame = "GJ_epicCoin3_001.png";
      else if (lvl.epic === 2) ratingFrame = "GJ_epicCoin2_001.png";
      else if (lvl.epic === 1) ratingFrame = "GJ_epicCoin_001.png";
      else if (lvl.featured) ratingFrame = "GJ_featuredCoin_001.png";
      if (ratingFrame && pickFrame("GJ_GameSheet03", [ratingFrame])) {
        panelGroup.add(this.add.image(cl + 75, cellCY, "GJ_GameSheet03", ratingFrame).setOrigin(0.5));
      }
      const diffIcon = this.add.image(cl + 75, cellCY, "GJ_GameSheet03", _diffFrames[dIdx])
        .setOrigin(0.5).setDisplaySize(dw * dScale, dh * dScale);
      panelGroup.add(diffIcon);

      const nameX = cl + 160;
      const maxTextW = cellW - 160 - 170;
      const rowGap = 5;
      const nameText = this.add.bitmapText(nameX, 0, "bigFont", lvl.name, 45).setOrigin(0, 0);
      this._fitBitmapText(nameText, maxTextW);
      const authorText = this.add.bitmapText(nameX, 0, "goldFont", "By " + lvl.author, 32).setOrigin(0, 0);
      this._fitBitmapText(authorText, maxTextW);
      const songText = this.add.bitmapText(nameX, 0, "bigFont", lvl.songName || "", 28)
        .setOrigin(0, 0).setTint(_officialGDSongs.includes(lvl.songName) ? 0x00d6ff : 0xff79ff);
      this._fitBitmapText(songText, maxTextW);
      panelGroup.add([nameText, authorText, songText]);

      const statRowH = 30;
      const totalH = nameText.displayHeight + authorText.displayHeight + songText.displayHeight + statRowH + rowGap * 3;
      let ty = cellCY - totalH / 2;
      nameText.y = ty; ty += nameText.displayHeight + rowGap;
      authorText.y = ty; ty += authorText.displayHeight + rowGap;
      songText.y = ty; ty += songText.displayHeight + rowGap;
      const statY = ty + statRowH / 2;

      const stats = [
        { frames: ["GJ_timeIcon_001.png"], value: this._getLevelLengthLabel(lvl.length), scale: 0.6 },
        { frames: ["GJ_downloadsIcon_001.png"], value: this._formatStatCount(lvl.downloads), scale: 0.6 },
        { frames: ["GJ_sLikeIcon_001.png"], value: this._formatStatCount(lvl.likes), scale: 0.9 }
      ];
      if (lvl.orbs > 0) stats.push({ frames: ["GJ_orbIcon_001.png", "GJ_sOrbIcon_001.png", "GJ_orbsIcon_001.png"], value: "0/" + lvl.orbs, scale: 0.8 });
      let sx = nameX;
      stats.forEach((st) => {
        const f = pickFrame("GJ_GameSheet03", st.frames);
        if (!f) return;
        const ic = this.add.image(sx, statY, "GJ_GameSheet03", f).setOrigin(0, 0.5).setScale(st.scale);
        panelGroup.add(ic);
        const tx = this.add.bitmapText(sx + ic.displayWidth + 8, statY, "bigFont", st.value, 26).setOrigin(0, 0.5);
        this._fitBitmapText(tx, maxTextW / 2);
        panelGroup.add(tx);
        sx += ic.displayWidth + 8 + tx.displayWidth + 25;
      });
      if (lvl.dailyNumber) {
        const num = this.add.bitmapText(cl + cellW - 18, ct + cellH - 14, "bigFont", "#" + lvl.dailyNumber, 24)
          .setOrigin(1, 1).setTint(0x8a8fb8).setAlpha(0.6);
        panelGroup.add(num);
      }
      const playFrame = pickFrame("GJ_GameSheet03", ["GJ_playBtn2_001.png"]);
      if (playFrame) {
        const playBtn = this.add.image(cl + cellW - 95, cellCY, "GJ_GameSheet03", playFrame).setScale(0.75).setInteractive();
        panelGroup.add(playBtn);
        this._makeBouncyButton(playBtn, 0.75, () => {
          window._selectedLevelData = lvl;
          this._closeSpecialLevelPopup(kind);
          this._closeCreatorMenu(true);
          this._openPlayMenu(() => { this._openCreatorMenu(); this._buildSpecialLevelPopup(kind); });
        });
      }
      const crownFrame = pickFrame("GJ_GameSheet04", S.crownFrames);
      if (crownFrame) {
        panelGroup.add(this.add.image(cellCX, ct + 12, "GJ_GameSheet04", crownFrame).setOrigin(0.5, 0.8));
      }
    };

    const cacheKey = `_${kind}LevelCache`, promiseKey = `_${kind}LevelPromise`;
    if (window[cacheKey]) {
      renderCell(window[cacheKey]);
      return;
    }
    if (!window[promiseKey]) {
      window[promiseKey] = this._fetchSpecialLevel(S.fetch)
        .then((lvl) => { window[cacheKey] = lvl; return lvl; })
        .finally(() => { window[promiseKey] = null; });
    }
    window[promiseKey].then((lvl) => {
      if (!alive()) return;
      renderCell(lvl);
    }).catch((err) => {
      console.warn(`${kind} level failed`, err);
      showError();
    });
  }
  _specialLevelStyles() {
    const dailyCrown = ["gj_dailyCrown_001.png", "GJ_dailyCrown_001.png"];
    return {
      daily: {
        fetch: { kind: "daily", dlId: -1, listType: 21, numType: 0 },
        panelTex: "GJ_square01", panelTint: null,
        cellTex: "GJ_square02", cellTint: null,
        cornerFrame: "dailyLevelCorner_001.png", cornerScale: 0,
        labelFrames: ["dailyLevelLabel_001.png"], labelText: "Daily Level",
        crownFrames: dailyCrown
      },
      weekly: {
        fetch: { kind: "weekly", dlId: -2, listType: 22, numType: 1 },
        panelTex: "GJ_square05", panelTint: null,
        cellTex: "GJ_square05", cellTint: 0xafafaf,
        cornerFrame: "gauntletCorner_001.png", cornerScale: 0.6,
        cornerCut: 15, cornerInset: 8,
        lineLength: 16,
        cornerOffsets: {
          tl: { x: -1, y: -1 },
          bl: { x: -1, y: -1 },
          br: { x: 1, y: 1 }
        },
        lineOffsets: {
          bl: { x: 3.5, y: -3.5 },
          br: { x: -3.5, y: -2 }
        },
        labelFrames: ["weeklyLevelLabel_001.png"], labelText: null,
        crownFrames: ["gj_weeklyCrown_001.png"]
      },
      event: {
        fetch: { kind: "event", dlId: -3, listType: 23, numType: 2 },
        panelTex: "GJ_square05", panelTint: 0xcf16fb,
        cellTex: "GJ_square04", cellTint: null,
        cornerFrame: "dailyLevelCorner_001.png", cornerScale: 0,
        labelFrames: ["eventLevelLabel_001.png"], labelText: "Event Level",
        crownFrames: ["gj_eventCrown_001.png"]
      }
    };
  }
  _closeSpecialLevelPopup(kind) {
    const popupKey = `_${kind}LevelPopup`, spinKey = `_${kind}SpinTween`, slideKey = `_${kind}SlideTween`;
    if (this[spinKey]) { this[spinKey].stop(); this[spinKey] = null; }
    if (this[slideKey]) { this[slideKey].stop(); this[slideKey] = null; }
    if (this[popupKey]) {
      this[popupKey].destroy();
      this[popupKey] = null;
    }
  }
  _buildDailyLevelPopup() { this._buildSpecialLevelPopup("daily"); }
  _closeDailyLevelPopup() { this._closeSpecialLevelPopup("daily"); }
  _buildWeeklyLevelPopup() { this._buildSpecialLevelPopup("weekly"); }
  _closeWeeklyLevelPopup() { this._closeSpecialLevelPopup("weekly"); }
  _buildEventLevelPopup() { this._buildSpecialLevelPopup("event"); }
  _closeEventLevelPopup() { this._closeSpecialLevelPopup("event"); }
  _closeNewgroundsPopup() {
    if (this._newgroundsPopup) {
      this._newgroundsPopup.destroy();
      this._newgroundsPopup = null;
    }
  }
  _buildFeaturedInfoPopup() {
    if (this._featuredInfoPopup) return;
    const xPos = screenWidth / 2;
    const centerY = screenHeight / 2;
    this._featuredInfoPopup = this.add.container(0, 0).setScrollFactor(0).setDepth(1000);
    const background = this.add.rectangle(xPos, centerY, screenWidth, screenHeight, 0, 100 / 255);
    background.setInteractive();
    this._featuredInfoPopup.add(background);
    const bounceContainer = this.add.container(xPos, centerY).setScale(0);
    this._featuredInfoPopup.add(bounceContainer);
    const cornerRadius = this.textures.get("square01_001").source[0].width * 0.325;
    const panelBg = this._drawScale9(0, 0, 560, 300, "square01_001", cornerRadius, 16777215, 1);
    bounceContainer.add(panelBg);
    const title = this.add.bitmapText(0, -98, "goldFont", "Featured", 42).setOrigin(0.5, 0.5);
    bounceContainer.add(title);
    const body = this.add.text(0, -5, "its finally finished after so long\nso this is awesome am i right\n it has aura. featured tab. roptop fgames.", {
      fontSize: "21px",
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
      align: "center",
      lineSpacing: 4
    }).setOrigin(0.5, 0.5);
    bounceContainer.add(body);
    const okGroup = this.add.container(-5, 95);
    const okBtnW = 90, okBtnH = 55;
    const okBtnBorder = this.textures.get("GJ_button01").source[0].width * 0.3;
    const okBtn9 = this._drawScale9(0, 0, okBtnW, okBtnH, "GJ_button01", okBtnBorder, 0xffffff, 1);
    const okBtn = this.add.rectangle(0, 0, okBtnW, okBtnH).setInteractive();
    okGroup.add(okBtn9);
    okGroup.add(okBtn);
    const okLabel = this.add.bitmapText(-3, -4, "goldFont", "OK", 44).setOrigin(0.5, 0.5);
    okGroup.add(okLabel);
    bounceContainer.add(okGroup);
    okBtn.on("pointerdown", () => { okGroup._pressed = true; this.tweens.killTweensOf(okGroup); this.tweens.add({ targets: okGroup, scaleX: 1.26, scaleY: 1.26, duration: 300, ease: "Bounce.Out" }); });
    okBtn.on("pointerout", () => { if (okGroup._pressed) { okGroup._pressed = false; this.tweens.killTweensOf(okGroup); this.tweens.add({ targets: okGroup, scaleX: 1, scaleY: 1, duration: 400, ease: "Bounce.Out" }); } });
    okBtn.on("pointerup", () => { if (okGroup._pressed) { okGroup._pressed = false; this.tweens.killTweensOf(okGroup); okGroup.setScale(1); this._closeFeaturedInfoPopup(); } });
        this.tweens.add({
      targets: bounceContainer,
      scale: { from: 0, to: 1 },
      duration: 660,
      ease: "Elastic.Out",
      easeParams: [1, 0.6]
    });
  }
  _closeFeaturedInfoPopup() {
    if (this._featuredInfoPopup) {
      this._featuredInfoPopup.destroy();
      this._featuredInfoPopup = null;
    }
  }
  _buildDemonFilterPopup() {
    if (this._demonFilterPopup) return;
    const xPos = screenWidth / 2;
    const centerY = screenHeight / 2;
    this._demonFilterPopup = this.add.container(0, 0).setScrollFactor(0).setDepth(1000);
    const background = this.add.rectangle(xPos, centerY, screenWidth, screenHeight, 0, 100 / 255);
    background.setInteractive();
    this._demonFilterPopup.add(background);
    const bounceContainer = this.add.container(xPos, centerY).setScale(0);
    this._demonFilterPopup.add(bounceContainer);

    const panelW = 760, panelH = 360;
    const cornerRadius = this.textures.get("GJ_square01").source[0].width * 0.325;
    const panelBg = this.add.nineslice(0, 0, "GJ_square01", null, panelW, panelH, cornerRadius, cornerRadius, cornerRadius, cornerRadius)
      .setOrigin(0.5);
    bounceContainer.add(panelBg);

    const title = this.add.bitmapText(0, -panelH / 2 + 40, "bigFont", "Demon Filter", 64).setOrigin(0.5, 0.5);
    bounceContainer.add(title);

    const _tierDefs = [
      { frame: "difficulty_06_btn_001.png", w: 72, h: 88, tier: null },
      { frame: "difficulty_07_btn2_001.png", w: 72, h: 85, tier: 1 },
      { frame: "difficulty_08_btn2_001.png", w: 72, h: 85, tier: 2 },
      { frame: "difficulty_06_btn2_001.png", w: 72, h: 88, tier: 3 },
      { frame: "difficulty_09_btn2_001.png", w: 74, h: 88, tier: 4 },
      { frame: "difficulty_10_btn2_001.png", w: 80, h: 91, tier: 5 },
    ];
    const slotW = (panelW - 60) / _tierDefs.length;
    const iconY = 0;
    const iconTargetH = 78;
    const tierIcons = [];
    let selectedTierIdx = _tierDefs.findIndex(t => t.tier === (this._selectedDemonTier || null));
    if (selectedTierIdx < 0) selectedTierIdx = 0;
    const baseScale = 1.1;

    _tierDefs.forEach((def, i) => {
      const cx = -panelW / 2 + 30 + slotW * i + slotW / 2;
      const icon = this.add.image(cx, iconY, "GJ_GameSheet03", def.frame)
        .setOrigin(0.5).setScale(baseScale).setInteractive();
      icon.setTint(i === selectedTierIdx ? 0xffffff : 0x8F8F8F);
      bounceContainer.add(icon);
      tierIcons.push(icon);

      icon.on("pointerdown", () => {
        icon._pressed = true;
        this.tweens.killTweensOf(icon, "scale");
        this.tweens.add({ targets: icon, scale: baseScale * 1.15, duration: 300, ease: "Bounce.Out" });
      });
      icon.on("pointerout", () => {
        if (icon._pressed) {
          icon._pressed = false;
          this.tweens.killTweensOf(icon, "scale");
          this.tweens.add({ targets: icon, scale: baseScale, duration: 400, ease: "Bounce.Out" });
        }
      });
      icon.on("pointerup", () => {
        if (!icon._pressed) return;
        icon._pressed = false;
        this.tweens.killTweensOf(icon, "scale");
        icon.setScale(baseScale);
        selectedTierIdx = i;
        tierIcons.forEach((other, oi) => other.setTint(oi === i ? 0xffffff : 0x8f8f8f));
      });
    });

    const okGroup = this.add.container(0, panelH / 2 - 45);
    const okBtnW = 110, okBtnH = 55;
    const okBtn9 = this.add.nineslice(0, 0, "GJ_button01", null, okBtnW, okBtnH, 18, 18, 18, 18)
      .setOrigin(0.5).setInteractive();
    okGroup.add(okBtn9);
    const okLabel = this.add.bitmapText(-3, -4, "goldFont", "OK", 44).setOrigin(0.5, 0.5);
    okGroup.add(okLabel);
    bounceContainer.add(okGroup);
    okBtn9.on("pointerdown", () => { okGroup._pressed = true; this.tweens.killTweensOf(okGroup); this.tweens.add({ targets: okGroup, scaleX: 1.26, scaleY: 1.26, duration: 300, ease: "Bounce.Out" }); });
    okBtn9.on("pointerout", () => { if (okGroup._pressed) { okGroup._pressed = false; this.tweens.killTweensOf(okGroup); this.tweens.add({ targets: okGroup, scaleX: 1, scaleY: 1, duration: 400, ease: "Bounce.Out" }); } });
    okBtn9.on("pointerup", () => {
      if (!okGroup._pressed) return;
      okGroup._pressed = false;
      this.tweens.killTweensOf(okGroup);
      okGroup.setScale(1);
      const chosen = _tierDefs[selectedTierIdx];
      this._selectedDemonTier = chosen.tier;
      const demonIcon = this._diffFilterIcons && this._diffFilterIcons[6];
      if (demonIcon) {
        demonIcon.setTexture("GJ_GameSheet03", chosen.frame);
        demonIcon.setScale(0.85);
      }
      this._closeDemonFilterPopup();
    });

    this.tweens.add({
      targets: bounceContainer,
      scale: { from: 0, to: 1 },
      duration: 660,
      ease: "Elastic.Out",
      easeParams: [1, 0.6]
    });
  }
  _closeDemonFilterPopup() {
    if (this._demonFilterPopup) {
      this._demonFilterPopup.destroy();
      this._demonFilterPopup = null;
    }
  }
  _applyLockedGray(obj) {
    if (!obj) return obj;
    try { if (obj.postFX) obj.postFX.addColorMatrix().grayscale(1); } catch (_) {}
    if (obj.setTint) obj.setTint(0xafafaf);
    return obj;
  }
  _expandHitArea(_0x122213, _0x37180a) {
    const _0x46ea45 = _0x122213.width;
    const _0x43b461 = _0x122213.height;
    const _0x960250 = _0x46ea45 * (_0x37180a - 1) / 2;
    const _0x3f88a1 = _0x43b461 * (_0x37180a - 1) / 2;
    _0x122213.input.hitArea.setTo(-_0x960250, -_0x3f88a1, _0x46ea45 + _0x960250 * 2, _0x43b461 + _0x3f88a1 * 2);
  }
  _makeBouncyButton(textureX, _0x57b645, _0x2f13d0, _0xda0c21) {
    textureX._bouncyBaseScale = _0x57b645;
    const getBouncyVisualTargets = () => {
      const configured = Array.isArray(textureX._bouncyVisualTargets) && textureX._bouncyVisualTargets.length
        ? textureX._bouncyVisualTargets
        : [textureX._bouncyVisualTarget || textureX];
      return configured
        .map(entry => {
          const target = entry && entry.target ? entry.target : entry;
          if (!target || typeof target.setScale !== "function") return null;
          const baseScale =
            (entry && typeof entry.getBaseScale === "function" ? entry.getBaseScale() : undefined) ??
            (entry && entry.baseScale !== undefined ? entry.baseScale : undefined) ??
            target._bouncyBaseScale ??
            textureX._bouncyBaseScale ??
            _0x57b645;
          const baseScaleX =
            (entry && typeof entry.getBaseScaleX === "function" ? entry.getBaseScaleX() : undefined) ??
            (entry && entry.baseScaleX !== undefined ? entry.baseScaleX : undefined) ??
            baseScale;
          const baseScaleY =
            (entry && typeof entry.getBaseScaleY === "function" ? entry.getBaseScaleY() : undefined) ??
            (entry && entry.baseScaleY !== undefined ? entry.baseScaleY : undefined) ??
            baseScale;
          return { target, baseScaleX, baseScaleY };
        })
        .filter(Boolean);
    };
    const tweenBouncyTargets = (scaleMultiplier, duration) => {
      for (const entry of getBouncyVisualTargets()) {
        this.tweens.killTweensOf(entry.target);
        this.tweens.add({
          targets: entry.target,
          scaleX: entry.baseScaleX * scaleMultiplier,
          scaleY: entry.baseScaleY * scaleMultiplier,
          duration,
          ease: "Bounce.Out"
        });
      }
    };
    const resetBouncyTargets = (instant = false) => {
      for (const entry of getBouncyVisualTargets()) {
        this.tweens.killTweensOf(entry.target);

        if (instant) {
          entry.target.setScale(entry.baseScaleX, entry.baseScaleY);
        } else {
          this.tweens.add({
            targets: entry.target,
            scaleX: entry.baseScaleX,
            scaleY: entry.baseScaleY,
            duration: 400,
            ease: "Bounce.Out"
          });
        }
      }
    };
    textureX.on("pointerdown", () => {
      if (!_0xda0c21 || !!_0xda0c21()) {
        textureX._pressed = true;
        tweenBouncyTargets(1.26, 300);
      }
    });
    textureX.on("pointerout", () => {
      if (textureX._pressed) {
        textureX._pressed = false;
        resetBouncyTargets(false);
      }
    });
    textureX.on("pointerup", () => {
      if (textureX._pressed) {
        textureX._pressed = false;
        resetBouncyTargets(true);
        _0x2f13d0?.();
      }
    });
    textureX.on("pointerupoutside", () => {
      if (textureX._pressed) {
        textureX._pressed = false;
        resetBouncyTargets(false);
      }
    });
    return textureX;
  }
  _makeCompositeBouncyButton(trigger, visualTargets, baseScale, callback, condition) {
    trigger._bouncyVisualTargets = (Array.isArray(visualTargets) ? visualTargets : [visualTargets])
      .filter(Boolean)
      .map(entry => {
        const target = entry && entry.target ? entry.target : entry;
        const currentScaleX = target?.scaleX ?? baseScale;
        const currentScaleY = target?.scaleY ?? baseScale;
        const entryBase = entry && entry.baseScale !== undefined ? entry.baseScale : undefined;

        return {
          target,
          baseScaleX: entry && entry.baseScaleX !== undefined ? entry.baseScaleX : (entryBase ?? currentScaleX),
          baseScaleY: entry && entry.baseScaleY !== undefined ? entry.baseScaleY : (entryBase ?? currentScaleY),
          getBaseScale: entry && entry.getBaseScale,
          getBaseScaleX: entry && entry.getBaseScaleX,
          getBaseScaleY: entry && entry.getBaseScaleY
        };
      });

    return this._makeBouncyButton(trigger, baseScale, callback, condition);
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
  _drawScale9(x, y, scaleWidth, scaleHeight, textureKey, borderSize, tint, alpha) {
    const container = this.add.container(x, y);
    const texture = this.textures.get(textureKey);
    const baseFrame = texture?.get?.();
    const source = texture?.source?.[0];
    const textureWidth = baseFrame?.width || source?.width || scaleWidth;
    const textureHeight = baseFrame?.height || source?.height || scaleHeight;
    const requestedBorder = Math.max(0, Number(borderSize) || 0);
    const horizontalBorder = Math.min(requestedBorder, textureWidth / 2, scaleWidth / 2);
    const verticalBorder = Math.min(requestedBorder, textureHeight / 2, scaleHeight / 2);

    const nineSlice = this.add.nineslice(
      0,
      0,
      textureKey,
      null,
      scaleWidth,
      scaleHeight,
      horizontalBorder,
      horizontalBorder,
      verticalBorder,
      verticalBorder
    ).setOrigin(0.5);

    if (tint !== undefined) {
      nineSlice.setTint(tint);
    }
    if (alpha !== undefined) {
      nineSlice.setAlpha(alpha);
    }

    container.add(nineSlice);
    return container;
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
      this._copyrightText.x = 288;
    }
    if (this._tryMeImg) {
      this._tryMeImg.x = _0x1e5db8 + 260;
    }
    if (this._menuGlitter) {
      this._menuGlitter.x = _0x1e5db8;
      this._menuGlitter.y = 320;
    }
    if (this._playBtn) {
      this._playBtn.x = _0x1e5db8;
      this.tweens.killTweensOf(this._playBtn, "y");
      this._playBtn.y = 320;
    }
    if (this._downloadBtns) {
      const _0x285ef7 = screenWidth - 105;
      const _0x4a8263 = 550;
      const _0x23d03e = 100;
      for (let _0x1bdfae = 0; _0x1bdfae < this._downloadBtns.length; _0x1bdfae++) {
        const yOffset = _0x1bdfae === 1 ? -_0x23d03e : 0;
        this._downloadBtns[_0x1bdfae].setPosition(_0x285ef7, _0x4a8263 + yOffset);
      }
    }
    if (this._iconBtn) {
      this._iconBtn.x = (screenWidth / 2) - this._playBtn.width / 2 - 100 - (this._iconBtn.width * this._iconBtn.scaleX) / 2;
      this.tweens.killTweensOf(this._iconBtn, "y");
      this._iconBtn.y = 320;
    }
    if (this._creatorBtn) {
      this._creatorBtn.x = (screenWidth / 2) + this._playBtn.width / 2 + 100 + (this._creatorBtn.width * this._creatorBtn.scaleX) / 2;
      this.tweens.killTweensOf(this._creatorBtn, "y");
      this._creatorBtn.y = 320;
    }
    if (this._robLogo) {
      this._robLogo.x = 110;
      this._robLogo.y = 585;
    }
    if (this._socialIcons && this._socialIcons.length > 0) {
      const _iconSpacing = 52;
      const _originX = 65;
      const _originY = 478;
      const _layout = [{row:0,col:0},{row:0,col:1},{row:0,col:2},{row:0,col:3},
                       {row:1,col:0},{row:1,col:1},{row:1,col:2},{row:1,col:3},
                       {row:2,col:0},{row:2,col:1},{row:2,col:2},{row:2,col:3},{row:2,col:4}];
      this._socialIcons.forEach((icon, i) => {
        icon.x = _originX + _layout[i].col * _iconSpacing;
        icon.y = _originY + _layout[i].row * _iconSpacing;
      });
    }
  }
  _positionAttemptsLabel() {
    let _0xdbdd91 = this._cameraX + screenWidth / 2;
    if (this._levelAttempts > 1) {
      _0xdbdd91 += 100;
    }
    this._attemptsLabel.setPosition(_0xdbdd91, 150);
  }
  _hasBlockingOverlay() {
    if (this._levelSelectOverlay) return true;
    const list = this.children.list;
    for (let i = 0; i < list.length; i++) {
      const c = list[i];
      if (c.visible && c.depth >= 150) return true;
    }
    return false;
  }
  _labelTextCurrent(label, key) {
    return !label || (label._eeTextKey === key && label.text === label._eeTextValue);
  }
  _setLabelText(label, key, text) {
    label.setText(text);
    label._eeTextKey = key;
      label._eeTextValue = label.text;
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
  _showCompleteEffect() {
    this.sound.play("endStart_02", {
      volume: 0.8 * this._sfxVolume
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
    const _0x45ab26 = this._practicedMode.practiceMode
      ? this.add.image(_0x56628c, 250, "GJ_GameSheet03", "GJ_practiceComplete_001.png").setScrollFactor(0).setDepth(60).setScale(0.01)
      : this.add.image(_0x56628c, 250, "GJ_WebSheet", "GJ_levelComplete_001.png").setScrollFactor(0).setDepth(60).setScale(0.01);
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
    circleEffect(this, _0x2eadf2, _0x380b24, 10, screenWidth, 800, true, false, window.mainColor);
    circleEffect(this, _0x56628c, 250, 10, 1000, 800, true, false, window.mainColor);
    for (let _0x579e05 = 0; _0x579e05 < 5; _0x579e05++) {
      this.time.delayedCall(_0x579e05 * 50, () => circleEffect(this, _0x2eadf2, _0x380b24, 10, screenWidth, 500, false, true, window.mainColor));
    }
    for (let _0x429722 = 0; _0x429722 < 10; _0x429722++) {
      const _0xbf7dd0 = _0x429722 * 150 + (Math.random() * 160 - 80);
      this.time.delayedCall(Math.max(0, _0xbf7dd0), () => particleEffect(this, window.mainColor, window.secondaryColor));
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
      onComplete: () => {
        if (this._isMainLevelForCoinDisplay()) {
          this._playsecretcoinanimation();
        } else {
          this._playusercoinanimation();
        }
        this.time.delayedCall(250, () => this._playStarAward());
      }
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
    const _0x3e9c79 = _0x33b564.y - 35;
    this._endLayerInternal.add(this.add.image(containerX - 312, _0x3e9c79, "GJ_WebSheet", "chain_01_001.png").setOrigin(0.5, 1));
    this._endLayerInternal.add(this.add.image(containerX + 312, _0x3e9c79, "GJ_WebSheet", "chain_01_001.png").setOrigin(0.5, 1));
    const _completeBanner = this._practicedMode.practiceMode
      ? this.add.image(containerX, 170, "GJ_GameSheet03", "GJ_practiceComplete_001.png").setScale(0.85)
      : this.add.image(containerX, 170, "GJ_WebSheet", "GJ_levelComplete_001.png").setScale(0.85);
    this._endLayerInternal.add(_completeBanner);
    const _0x45b6e4 = 0.8;
    let _0xe44f6d = 250;
    const _0x2de55e = this.add.bitmapText(containerX, _0xe44f6d, "goldFont", "Attempts: " + this._levelAttempts, 46).setOrigin(0.5, 0.5).setScale(_0x45b6e4);
    this._endLayerInternal.add(_0x2de55e);
    _0xe44f6d += 48;
    this._endLayerInternal.add(this.add.bitmapText(containerX, _0xe44f6d, "goldFont", "Jumps: " + this._levelJumps, 46).setOrigin(0.5, 0.5).setScale(_0x45b6e4));
    _0xe44f6d += 48;
    const _0x596450 = Math.floor(this._playTime);
    const _0x30687e = Math.floor(_0x596450 / 3600);
    const _0x52f8ee = Math.floor(_0x596450 % 3600 / 60);
    const _0x2591d0 = _0x596450 % 60;
    let _0x2be782;
    _0x2be782 = _0x30687e > 0 ? String(_0x30687e).padStart(2, "0") + ":" + String(_0x52f8ee).padStart(2, "0") + ":" + String(_0x2591d0).padStart(2, "0") : String(_0x52f8ee).padStart(2, "0") + ":" + String(_0x2591d0).padStart(2, "0");
    const _0x241209 = _0xe44f6d;
    this._endLayerInternal.add(this.add.bitmapText(containerX, _0xe44f6d, "goldFont", "Time: " + _0x2be782, 46).setOrigin(0.5, 0.5).setScale(_0x45b6e4));
    const isMainLevel = this._isMainLevelForCoinDisplay();
    const coinSprites = (this._level?._coinSprites || []).filter(sprite => isMainLevel
      ? sprite?._secretCoinSlot !== undefined
      : sprite?._userCoinSlot !== undefined);
    const coinCount = Math.min(3, coinSprites.length);
    const coinOffsets = coinCount === 1
      ? [0]
      : coinCount === 2
        ? [-60, 60]
        : [-120, 0, 120];
    const completionMessageY = coinCount > 0 ? _0x241209 : _0x241209 + 96;
    this._endsecretcoinPositions = isMainLevel
      ? coinOffsets.map(offset => ({ x: containerX + offset, y: 445 }))
      : null;
    let savedSecretCoinSlots = new Set();
    try {
      const savedSlots = JSON.parse(localStorage.getItem(`gd_secretCoins_${window.currentlevel?.[2] || "level_1"}_slots`) || "[]");
      if (Array.isArray(savedSlots)) {
        savedSecretCoinSlots = new Set(savedSlots.filter(slot => Number.isInteger(slot) && slot >= 0 && slot < 3));
      }
    } catch (_error) {}
    const runSecretCoinSlots = this._level?._editorEndSecretCoinSlots
      ? new Set(this._level._editorEndSecretCoinSlots)
      : new Set(
        (this._level?._coinSprites || [])
          .filter(sprite => this._level?._secretCoinRunCollected?.has(String(sprite?._secretCoinId)))
          .map(sprite => sprite?._secretCoinSlot)
          .filter(slot => Number.isInteger(slot))
      );
    this._endsecretcoinPositions?.forEach(({ x, y }, slot) => {
      if (savedSecretCoinSlots.has(slot) && !runSecretCoinSlots.has(slot)) return;
      this._endLayerInternal.add(
        this.add.image(x, y, "GJ_GameSheet02", "secretCoin_b_01_001.png")
          .setOrigin(0.5)
          .setScale(1.1)
      );
    });
    for (const slot of savedSecretCoinSlots) {
      if (!this._endsecretcoinPositions) break;
      if (runSecretCoinSlots.has(slot)) continue;
      const position = this._endsecretcoinPositions[slot];
      this._endLayerInternal.add(
        this.add.image(position.x, position.y, "GJ_GameSheet03", "secretCoinUI_001.png")
          .setOrigin(0.5)
          .setScale(1.1)
      );
    }
    this._endusercoinPosition = null;
    if (!isMainLevel && coinCount > 0) {
      this._endusercoinPosition = coinOffsets.map(offset => ({ x: containerX + offset, y: 445 }));
      let savedUserCoinSlots = new Set();
      try {
        const savedSlots = JSON.parse(localStorage.getItem(`gd_userCoins_${window.currentlevel?.[2] || "level_1"}_slots`) || "[]");
        if (Array.isArray(savedSlots)) {
          savedUserCoinSlots = new Set(savedSlots.filter(slot => Number.isInteger(slot) && slot >= 0 && slot < 3));
        }
      } catch (_error) {}
      const runUserCoinSlots = this._level?._editorEndUserCoinSlots
        ? new Set(this._level._editorEndUserCoinSlots)
        : new Set(
          (this._level?._coinSprites || [])
            .filter(sprite => this._level?._userCoinRunCollected?.has(String(sprite?._userCoinId)))
            .map(sprite => sprite?._userCoinSlot)
            .filter(slot => Number.isInteger(slot))
        );
      this._endusercoinPosition.forEach(({ x, y }, slot) => {
        if (savedUserCoinSlots.has(slot) && !runUserCoinSlots.has(slot)) return;
        this._endLayerInternal.add(this.add.image(x, y, "GJ_GameSheet02", "secretCoin_2_b_01_001.png").setOrigin(0.5));
      });
      for (const slot of savedUserCoinSlots) {
        if (runUserCoinSlots.has(slot)) continue;
        const position = this._endusercoinPosition[slot];
        this._endLayerInternal.add(this.add.image(position.x, position.y, "GJ_GameSheet0", "secretCoinUI2_001.png").setOrigin(0.5));
      }
    }
    const _0x452429 = ["Awesome!", "Good\nJob!", "Well\nDone!", "Impressive!", "Amazing!", "Incredible!", "Skillful!", "Brilliant!", "Not\nbad!", "Warp\nSpeed!", "Challenge\nBreaker!", "Reflex\nMaster!", "I am\nspeechless...", "You are...\nThe One!", "How is this\npossible!?", "You beat\nme...", ];
    const _0x165c06 = _0x452429[Math.floor(Math.random() * _0x452429.length)];
    const _0x45540f = 235;
    const _0x8e2b = ["\x5f\x6d\x61\x63\x72\x6f\x42\x6f\x74", "\x70\x6c\x61\x79\x69\x6e\x67"];let _0x3bc14 = 0xffffff; try {if (this[_0x8e2b[0]] && this[_0x8e2b[0]][_0x8e2b[1]]) {_0x3bc14 = (_0x3bc14 & 0xffff00) | 0xfa;}} catch (_0xe31) {}const _0x17fa2b = this.add.bitmapText(coinCount > 0 ? containerX + _0x45540f : containerX, completionMessageY, "bigFont", coinCount > 0 ? _0x165c06 : _0x165c06.replace(/\n/g, " "), coinCount > 0 ? 40 : 46).setOrigin(0.5, 0.5).setScale(coinCount > 0 ? 0.8 : 0.9).setCenterAlign();if (_0x3bc14 !== 0xffffff) _0x17fa2b.setTint(_0x3bc14);
    this._endLayerInternal.add(_0x17fa2b);
    _0x2de55e.width;
    this._endStarX = containerX + _0x45540f;
    this._endStarY = _0x241209 - 77.5;
    if (window.macroBot){
      const botMenuBtn = this.add.image(containerX - 225, 255, "macroBot").setScale(0.4).setInteractive();
      this._endLayerInternal.add(botMenuBtn);
      this._makeBouncyButton(botMenuBtn, 0.4, () => {
          this._buildMacroPopup();
          if (this._macroPopup) {
              this._macroPopup.setDepth(300);
          }
      });
    }
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
        if (this._isMainLevelForCoinDisplay() || window.currentlevel?.[2] === "level_67") {
          window._mainLevelReturnToSelect = true;
        }
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
      _buildhelppopup() {
    this._Helpclosed = false;
    if (this._pauseBtn) {
      this.tweens.add({
        targets: this._pauseBtn,
        alpha: 0,
        duration: 300
      });
    }

    const containerX = screenWidth / 2;
    const _0x1aa656 = 320;
    this._helpoverlay = this.add.rectangle(containerX, _0x1aa656, screenWidth, screenHeight, 0, 0).setScrollFactor(0).setDepth(200).setInteractive();
    this._helplayer = this.add.container(0, -640).setScrollFactor(0).setDepth(201);
    this._helplayer.add(this.add.bitmapText(containerX, 65, "bigFont", "Support", 55).setOrigin(0.5, 0.5));
    this._helpclose = false;
    this.tweens.add({
      targets: this._helpoverlay,
      alpha: 180 / 255,
      duration: 250,
      ease: "Linear"
    });

    const _0x59b9ab = {
      p: 0
    };
    this.tweens.add({
      targets: _0x59b9ab,
      p: 1,
      duration: 450,
      ease: "Quad.Out",
      onUpdate: () => {
        this._helplayer.y = _0x59b9ab.p * 650 - 640;
      },
      onComplete: () => {}
    });
        this._playusercoinanimation();

    const _0x595215 = 712;
    const _0x950c8d = 460;
    const _0x2a115c = (screenWidth - _0x595215) / 2;
    this._helplayer.add(this.add.rectangle(_0x2a115c + 356, 310, _0x595215, _0x950c8d, 0, 180 / 255));
    const _0x43f2e3 = this.textures.getFrame("GJ_WebSheet", "GJ_table_side_001.png");
    const _0x3feccc = _0x43f2e3 ? _0x950c8d / _0x43f2e3.height : 1;
    this._helplayer.add(this.add.image(_0x2a115c - 40, 80, "GJ_WebSheet", "GJ_table_side_001.png").setOrigin(0, 0).setScale(1, _0x3feccc));
    this._helplayer.add(this.add.image(_0x2a115c + _0x595215 + 40, 80, "GJ_WebSheet", "GJ_table_side_001.png").setOrigin(1, 0).setFlipX(true).setScale(1, _0x3feccc));
    const _0x33b564 = this.add.image(_0x2a115c + 356, 70, "GJ_WebSheet", "GJ_table_top_001.png");
    this._helplayer.add(_0x33b564);
    this._helplayer.add(this.add.image(_0x2a115c + 356, 560, "GJ_WebSheet", "GJ_table_bottom_001.png"));
    const _0x3e9c79 = _0x33b564.y - 35;
    this._helplayer.add(this.add.bitmapText(containerX, 65, "bigFont", "Support", 55).setOrigin(0.5, 0.5));
    this._helplayer.add(this.add.image(containerX - 312, _0x3e9c79, "GJ_WebSheet", "chain_01_001.png").setOrigin(0.5, 1));
    this._helplayer.add(this.add.image(containerX + 312, _0x3e9c79, "GJ_WebSheet", "chain_01_001.png").setOrigin(0.5, 1));
    this._helplayer.add(this.add.image(_0x2a115c + 258, 285, "GJ_GameSheet03", "developedBy_001.png"));
    const robtopSupportLogo = this.add.image(_0x2a115c + 440, 285, "GJ_GameSheet03", "robtoplogo_small.png").setScale(0.95).setInteractive();
    this._makeBouncyButton(robtopSupportLogo, 0.95, () => {
      window.open("https://geometrydash.com", "_blank");
    }, () => !this._helpclose);
    this._helplayer.add(robtopSupportLogo);
    this._helplayer.add(this.add.image(_0x2a115c + 250, 375, "GJ_GameSheet03", "poweredBy_001.png"));
    const phaserlogo = this.add.image(_0x2a115c + 432, 380, "Phaserlogo").setScale(0.1).setInteractive();
    this._makeBouncyButton(phaserlogo, 0.1, () => {
      window.open("https://docs.phaser.io/", "_blank");
    }, () => !this._helpclose);
    this._helplayer.add(phaserlogo);
    this._helplayer.add(this.add.bitmapText(containerX, 440, "goldFont", "Web Dashers not associated with RobTop Games", 22).setOrigin(0.5, 0.5));

    const _helpbuttonborder = this.textures.get("GJ_button01").source[0].width * 0.3;
    const _helpbtnh = 70;
    const _helpbtnw = 195;
    const _helpBtnGap = 52.5;
    const _helpBtnY = 180;
    const _makesupportButton = (cx, label, action) => {
      const grp = this.add.container(cx, _helpBtnY);
      const btn9 = this.add.nineslice(0, 0, "GJ_button01", null, _helpbtnw, _helpbtnh, _helpbuttonborder, _helpbuttonborder, _helpbuttonborder, _helpbuttonborder).setOrigin(0.5).setTint(0xffffff);
      grp.add(btn9);
      const lbl = this.add.bitmapText(0, -5, "bigFont", label, 40).setOrigin(0.5, 0.5);
      grp.add(lbl);
      const hitZone = this.add.zone(0, 0, _helpbtnw, _helpbtnh).setInteractive();
      grp.add(hitZone);
      const baseScale = 1;
      const pressedScale = baseScale * 1.26;
      hitZone.on("pointerdown", () => {
        hitZone._pressed = true;
        this.tweens.killTweensOf(grp, "scale");
        this.tweens.add({ targets: grp, scale: pressedScale, duration: 300, ease: "Bounce.Out" });
      });
      hitZone.on("pointerout", () => {
        if (hitZone._pressed) {
          hitZone._pressed = false;
          this.tweens.killTweensOf(grp, "scale");
          this.tweens.add({ targets: grp, scale: baseScale, duration: 400, ease: "Bounce.Out" });
        }
      });
      hitZone.on("pointerup", () => {
        if (hitZone._pressed) {
          hitZone._pressed = false;
          this.tweens.killTweensOf(grp, "scale");
          grp.setScale(baseScale);
          action?.();
        }
      });
      this._helplayer.add(grp);
      return grp;
    };

    _makesupportButton(containerX - _helpbtnw - _helpBtnGap / 2, "Links", () => {
      this._showwippopup();
    });
    _makesupportButton(containerX, "Contact", () => {
      this._showcontactpopup();
    });
    _makesupportButton(containerX + _helpbtnw + _helpBtnGap / 2, "Notes", () => {
      this._showwippopup();
    });

    const ldmX = _0x2a115c + 160;
    const ldmY = 495;
    const ldmCheckOffset = -120;
    const ldmTextOffset = -80;

    var ldmIsOn = window.enableLDM;
    var ldmCheckTexture = ldmIsOn ? "GJ_checkOn_001.png" : "GJ_checkOff_001.png";
    var ldmCheck = this.add.image(ldmX + ldmCheckOffset, ldmY, "GJ_GameSheet03", ldmCheckTexture).setScale(0.8).setInteractive();
    var ldmTxt = this.add.bitmapText(ldmX + ldmTextOffset, ldmY, "bigFont", "Low Detail Mode", 25).setOrigin(0, 0.5);
    this._helplayer.add([ldmCheck, ldmTxt]);

    this._makeBouncyButton(ldmCheck, 0.8, () => {
        var current = window.enableLDM;
        window.enableLDM = !current;
        var newTexture = window.enableLDM ? "GJ_checkOn_001.png" : "GJ_checkOff_001.png";
        ldmCheck.setTexture("GJ_GameSheet03", newTexture);
        if (this._saveSettings) {
            this._saveSettings();
        }
    });

    const reqbtnX = _0x2a115c + 655;
    const reqbtnY = 495;
    const reqbtnW = 80;
    const reqbtnH = 55;
    const reqbtnborder = (this.textures.get("GJ_button04")?.source[0].width || 40) * 0.3;
    const reqbtn = this.add.nineslice(reqbtnX, reqbtnY, "GJ_button04", null, reqbtnW, reqbtnH, reqbtnborder, reqbtnborder, reqbtnborder, reqbtnborder).setInteractive().setOrigin(0.5).setTint(0xffffff);
    const reqLbl = this.add.bitmapText(reqbtnX, reqbtnY - 2, "bigFont", "Req", 28).setOrigin(0.5, 0.5);
    this._helplayer.add([reqbtn, reqLbl]);
    this._makeCompositeBouncyButton(reqbtn, [reqbtn, reqLbl], 0.8, () => this._showReqpopup());

    const closeBtn = this.add.image(containerX - 535, 30, "GJ_GameSheet03", "GJ_arrow_03_001.png").setInteractive();
    this._helplayer.add(closeBtn);
    this._makeBouncyButton(closeBtn, 1, () => this._hideHelpPopup());
  }
    _buildsongspopup() {
    this._songpopupclose = false;
    if (this._pauseBtn) {
      this.tweens.add({
        targets: this._pauseBtn,
        alpha: 0,
        duration: 300
      });
    }

    const containerX = screenWidth / 2;
    const _0x1aa656 = 320;
    this._songsoverlay = this.add.rectangle(containerX, _0x1aa656, screenWidth, screenHeight, 0, 0).setScrollFactor(0).setDepth(200).setInteractive();
    this._songslayer = this.add.container(0, -640).setScrollFactor(0).setDepth(201);
    this._songpopupclose = false;
    this.tweens.add({
      targets: this._songsoverlay,
      alpha: 100 / 255,
      duration: 1000
    });

    const _0x59b9ab = {
      p: 0
    };
    this.tweens.add({
      targets: _0x59b9ab,
      p: 1,
      duration: 500,
      ease: "Quad.Out",
      onUpdate: () => {
        this._songslayer.y = _0x59b9ab.p * 650 - 640;
      }
    });
    const _0x595215 = 712;
    const _0x950c8d = 460;
    const _0x2a115c = (screenWidth - _0x595215) / 2;

    const panelBase = this.add.rectangle(_0x2a115c + 356, 310, _0x595215, _0x950c8d, 0xac531e).setDepth(150);
    this._songslayer.add(panelBase);
    const _0x43f2e3 = this.textures.getFrame("GJ_WebSheet", "GJ_table_side_001.png");
    const _0x3feccc = _0x43f2e3 ? _0x950c8d / _0x43f2e3.height : 1;
    this._songslayer.add(this.add.image(_0x2a115c - 40, 80, "GJ_WebSheet", "GJ_table_side_001.png").setOrigin(0, 0).setScale(1, _0x3feccc).setDepth(200));
    this._songslayer.add(this.add.image(_0x2a115c + _0x595215 + 40, 80, "GJ_WebSheet", "GJ_table_side_001.png").setOrigin(1, 0).setFlipX(true).setScale(1, _0x3feccc).setDepth(200));
    const _0x33b564 = this.add.image(_0x2a115c + 356, 70, "GJ_WebSheet", "GJ_table_top_001.png").setDepth(200);
    this._songslayer.add(_0x33b564);
    this._songslayer.add(this.add.image(_0x2a115c + 356, 560, "GJ_WebSheet", "GJ_table_bottom_001.png").setDepth(200));
    const _0x3e9c79 = _0x33b564.y - 35;

    this._songslayer.add(this.add.bitmapText(containerX, 65, "bigFont", "Soundtrack", 55).setOrigin(0.5, 0.5).setDepth(210));
    this._songslayer.add(this.add.bitmapText(containerX, 300, "bigFont", "Nothing here yet... Sorry :(", 42).setOrigin(0.5, 0.5).setDepth(210));

    this._songslayer.add(this.add.image(containerX - 312, _0x3e9c79, "GJ_WebSheet", "chain_01_001.png").setOrigin(0.5, 1).setDepth(210));
    this._songslayer.add(this.add.image(containerX + 312, _0x3e9c79, "GJ_WebSheet", "chain_01_001.png").setOrigin(0.5, 1).setDepth(210));

    const closeBtn = this.add.image(containerX - 535, 30, "GJ_GameSheet03", "GJ_arrow_03_001.png").setInteractive().setDepth(210);
    this._songslayer.add(closeBtn);
    this._makeBouncyButton(closeBtn, 1, () => this._hideSongsPopup());
  }
  _hideSongsPopup() {
    if (this._songsoverlay) {
      this._songsoverlay.destroy();
      this._songsoverlay = null;
    }
    if (this._songslayer) {
      this._songslayer.destroy();
      this._songslayer = null;
    }
    this._songpopupclose = false;
    if (this._pauseBtn) {
      this.tweens.add({ targets: this._pauseBtn, alpha: 1, duration: 300 });
    }
  }
        _redirectRate() {
window.open("https://github.com/web-dashers/web-dashers.github.io", "_blank"); }
  _closeStartPosPopup() {
  if (!this._startPosPopup) return;
  this._startPosPopup.destroy();
  this._startPosPopup = null;
  }
  _buildStartPosPopup() {
  if (this._startPosPopup) return;
  const centerX = screenWidth / 2, centerY = 320, panelW = 720, panelH = 540;
  this._startPosPopup = this.add.container(0, 0).setScrollFactor(0).setDepth(500);
  const dim = this.add.rectangle(centerX, centerY, screenWidth * 2, screenHeight * 2, 0, 150 / 255).setInteractive();
  this._startPosPopup.add(dim);
  const inner = this.add.container(centerX, centerY);
  this._startPosPopup.add(inner);
  
  const panelTex = this.textures.exists("GJ_square67") ? "GJ_square67" : "GJ_square67";
  const corner = 0.325 * this.textures.get(panelTex).source[0].width;
  inner.add(this._drawScale9(0, 0, panelW, panelH, panelTex, corner, 16777215, 1));
  
  const closeBtn = this.add.image(-(panelW / 2) + 10, -(panelH / 2) + 10, "GJ_WebSheet", "GJ_closeBtn_001.png").setScale(0.8).setInteractive();
  inner.add(closeBtn);
  this._makeBouncyButton(closeBtn, 0.8, () => this._closeStartPosPopup());
  
  const titleY = -(panelH / 2) + 45;
  const titleLbl = this.add.bitmapText(0, titleY - 2, "goldFont", "StartPos", 34).setOrigin(0.5);
  inner.add(titleLbl);
  
  const checkX = -270, labelX = -220;
  const addToggle = (y, label, infoKey, getVal, setVal, callback) => {
    const check = this.add.image(checkX, y, "GJ_GameSheet03", getVal() ? "GJ_checkOn_001.png" : "GJ_checkOff_001.png").setScale(0.8).setInteractive();
    const txt = this.add.bitmapText(labelX, y, "bigFont", label, 25).setOrigin(0, 0.5);
    const info = this.add.image(checkX - 34, y - 30, "GJ_GameSheet03", "GJ_infoIcon_001.png").setScale(0.45).setInteractive();
    inner.add([check, txt, info]);
    this._makeBouncyButton(info, 0.45, () => this.InfoBoxDoAThing(infoKey));
    this._makeBouncyButton(check, 0.8, () => {
      setVal(!getVal());
      check.setTexture("GJ_GameSheet03", getVal() ? "GJ_checkOn_001.png" : "GJ_checkOff_001.png");
      if (callback) callback(getVal());
      if (this._saveSettings) this._saveSettings();
    });
  };
  
  addToggle(-135, "StartPos Switcher", "Switches between start positions in a level.",
    () => !!window.startPosSwitcher,
    (v) => { window.startPosSwitcher = v; },
    (v) => {
      if (!v) this._startPosIndex = -1;
      if (this._startPosGui) this._startPosGui.setVisible(v && this._startPosCount > 0);
      if (this._startPosText) this._startPosText.setText(`0/${this._startPosCount || 0}`);
    });
  addToggle(-65, "Smart StartPos", "This is the info message",
    () => !!window.smartStartPos,
    (v) => { window.smartStartPos = v; });
  
  const sliderY = 15;
  const sliderScale = 0.7;
  inner.add(this.add.bitmapText(labelX - 50, sliderY, "bigFont", "Opacity", 25).setOrigin(0, 0.5));
  const grooveFrame = this.textures.getFrame("GJ_WebSheet", "slidergroove.png");
  const grooveW = grooveFrame ? grooveFrame.width : 420;
  const sliderCX = 0;
  const barMaxW = (grooveW - 8) * sliderScale;
  const barStartX = sliderCX - grooveW * sliderScale / 2 + 2.8;
  const minOpacity = 0.05;
  const startFrac = Phaser.Math.Clamp((window.startPosOpacity - minOpacity) / (1 - minOpacity), 0, 1);
  const fillBar = this.add.tileSprite(barStartX, sliderY, Math.max(1, startFrac * barMaxW), 11.2, "sliderBar").setOrigin(0, 0.5);
  const groove = this.add.image(sliderCX, sliderY, "GJ_WebSheet", "slidergroove.png").setScale(sliderScale);
  const thumb = this.add.image(barStartX + startFrac * barMaxW, sliderY, "GJ_WebSheet", "sliderthumb.png").setScale(sliderScale).setInteractive({ draggable: true });
  const pctLbl = this.add.bitmapText(sliderCX + grooveW * sliderScale / 2 + 60, sliderY, "bigFont", Math.round(window.startPosOpacity * 100) + "%", 25).setOrigin(0.5);
  inner.add([fillBar, groove, thumb, pctLbl]);
  
  const previewY = 170;
  const previewW = 560, previewH = 150;
  const previewBg = this.add.graphics();
  const previewBgTexture = this.textures.exists("GJ_square02") ? "GJ_square02" : "GJ_square02";
  const bgObject = previewBgTexture
    ? this.add.nineslice(0, previewY, previewBgTexture, null, previewW, previewH, 16, 16, 16, 16)
    : previewBg;
  
  inner.add(bgObject);
  inner.add(this.add.bitmapText(-previewW / 2 + 16, previewY - previewH / 2 + 20, "goldFont", "Preview", 22).setOrigin(0, 0.5));
  const previewGui = this.add.container(0, previewY + 14);
  const pLeft = this.add.image(-90, 0, "GJ_GameSheet03", "GJ_arrow_01_001.png").setScale(0.6);
  const pRight = this.add.image(90, 0, "GJ_GameSheet03", "GJ_arrow_01_001.png").setScale(0.6).setFlipX(true);
  const pText = this.add.bitmapText(0, 0, "bigFont", "1/3", 40).setOrigin(0.5);
  previewGui.add([pLeft, pRight, pText]);
  previewGui.setAlpha(window.startPosOpacity);
  inner.add(previewGui);
  
  thumb.on("drag", (_p, dragX) => {
    thumb.x = Phaser.Math.Clamp(dragX, barStartX, barStartX + barMaxW);
    const frac = (thumb.x - barStartX) / barMaxW;
    fillBar.width = Math.max(1, frac * barMaxW);
    window.startPosOpacity = Math.round((minOpacity + frac * (1 - minOpacity)) * 100) / 100;
    pctLbl.setText(Math.round(window.startPosOpacity * 100) + "%");
    previewGui.setAlpha(window.startPosOpacity);
    if (this._startPosGui) this._startPosGui.setAlpha(window.startPosOpacity);
  });
  thumb.on("dragend", () => { if (this._saveSettings) this._saveSettings(); });
  
  }
  _getSmartStartPosSettings(pos) {
  const header = window.settingsMap || {};
  const num = (k) => parseInt(header[k] || "0", 10) || 0;
  const state = {
    gameMode: num("kA2"),
    miniMode: num("kA3") === 1,
    speed: num("kA4"),
    dualMode: num("kA8") === 1,
    gravityFlipped: num("kA11") === 1,
    mirrored: num("kA28") === 1
  };
  const gameModes = { 12: 0, 13: 1, 47: 2, 111: 3, 660: 4, 745: 5, 1331: 6 };
  const speeds = { 200: 1, 201: 0, 202: 2, 203: 3, 1334: 4 };
  const events = [];
  for (const obj of (window.levelObjects || [])) {
    if (!obj || !Number.isFinite(obj.x) || obj.x * 2 >= pos.x) continue;
    const id = obj.id;
    if (gameModes[id] !== undefined || speeds[id] !== undefined || id === 99 || id === 101 || id === 286 || id === 287 ||
      id === 10 || id === 11 || id === 2926 || id === 45 || id === 46) {
      events.push(obj);
    }
  }
  events.sort((a, b) => a.x - b.x);
  for (const obj of events) {
    const id = obj.id;
    if (gameModes[id] !== undefined) state.gameMode = gameModes[id];
    else if (speeds[id] !== undefined) state.speed = speeds[id];
    else if (id === 99) state.miniMode = false;
    else if (id === 101) state.miniMode = true;
    else if (id === 286) state.dualMode = true;
    else if (id === 287) state.dualMode = false;
    else if (id === 10) state.gravityFlipped = false;
    else if (id === 11) state.gravityFlipped = true;
    else if (id === 2926) state.gravityFlipped = !state.gravityFlipped;
    else if (id === 45) state.mirrored = true;
    else if (id === 46) state.mirrored = false;
  }
  return state;
  }
  _updateProgressBar(percent) {
  const label = this._percentageLabel;
  if (!label) return;
  if (!this._gwProgressBar?.active) {
    const bar = this.add.container(screenWidth / 2, 16).setDepth(100).setScrollFactor(0);
    const frame = this.add.image(0, 0, "slidergroove2").setScale(0.5);
    const fill = this.add.tileSprite(-206, 0, 412, 16, "sliderBar2").setOrigin(0, 0.5);
    bar.add([fill, frame]);
    this._gwProgressBar = bar;
    this._gwProgressFill = fill;
    this._gwProgressFrame = frame;
  }
  const barOn = !!window.progressBar && !this._menuActive;
  this._gwProgressBar.setVisible(barOn);
  const pct = Phaser.Math.Clamp(percent, 0, 100);
  if (barOn) this._gwProgressFill.setSize(Math.max(1, 412 * pct / 100), 16).setVisible(pct > 0).setTint(window.mainColor);
  label.setOrigin(barOn ? 0 : 0.5, 0.5);
  label.setPosition(screenWidth / 2 + (barOn ? 220 : 0), 16);
  }
  _buildKeybindsPopup() {
  if (this._keybindsPopup) return;
  window._kbSuspended = true;
  const centerX = screenWidth / 2, centerY = 320, panelW = 800, panelH = 560;
  this._keybindsPopup = this.add.container(0, 0).setScrollFactor(0).setDepth(500);
  const dim = this.add.rectangle(centerX, centerY, screenWidth * 2, screenHeight * 2, 0, 150/255).setInteractive();
  dim.on("pointerdown", () => { if (typeof _srchBlur === "function") _srchBlur(); });
  this._keybindsPopup.add(dim);
  const inner = this.add.container(centerX, centerY).setScale(0);
  this._keybindsPopup.add(inner);
  const corner = 0.325 * this.textures.get("GJ_square67").source[0].width;
  inner.add(this._drawScale9(0, 0, panelW, panelH, 'GJ_square67', corner, 16777215, 1));
  const closeBtn = this.add.image(-(panelW/2)+10, -(panelH/2)+10, 'GJ_WebSheet', "GJ_closeBtn_001.png").setScale(0.8).setInteractive();
  inner.add(closeBtn);
  const _cleanup = () => {
    if (this._keybindsCaptureHandler) { this.input.keyboard.off("keydown", this._keybindsCaptureHandler); this._keybindsCaptureHandler = null; }
    if (this._kbWheelHandler) { this.input.off("wheel", this._kbWheelHandler); this._kbWheelHandler = null; }
    if (this._kbSearchHandler) { this.input.keyboard.off("keydown", this._kbSearchHandler); this._kbSearchHandler = null; }
    this._kbEscape = null;
    if (this._kbSub && this._kbSub.dispose) this._kbSub.dispose();
    this._kbSub = null;
    if (typeof _srchStopBlink === "function") _srchStopBlink();
    window._kbSuspended = false;
  };
  const _closePopup = () => {
    _cleanup();
    this._keybindsPopup.destroy();
    this._keybindsPopup = null;
  };
  this._makeBouncyButton(closeBtn, 0.8, _closePopup);
  const _kbDefs = [
    { id: "jump", label: "Jump P1", cat: "gameplay" },
    { id: "jump2", label: "Jump P2", cat: "gameplay" },
    { id: "pause", label: "Pause", cat: "gameplay" },
    { id: "restart", label: "Restart", cat: "gameplay" },
    { id: "Ignore Damage", label: "Ignore Damage", cat: "gameplay" },
    { id: "showHitboxes", label: "Show Hitboxes", cat: "gameplay" },
    { id: "practice", label: "Practice Mode", cat: "practice" },
    { id: "startPosPrev", label: "StartPos Prev", cat: "practice" },
    { id: "startPosNext", label: "StartPos Next", cat: "practice" },
    { id: "saveCheckpoint", label: "Place Checkpoint", cat: "practice" },
    { id: "deleteCheckpoint", label: "Delete Checkpoint", cat: "practice" },
    { id: "editorTab1", label: "Build Tab", cat: "editor" },
    { id: "editorTab2", label: "Edit Tab", cat: "editor" },
    { id: "editorTab3", label: "Delete Tab", cat: "editor" },
    { id: "editorMoveUp", label: "Move Up", cat: "editor" },
    { id: "editorMoveLeft", label: "Move Left", cat: "editor" },
    { id: "editorMoveDown", label: "Move Down", cat: "editor" },
    { id: "editorMoveRight", label: "Move Right", cat: "editor" },
    { id: "toggleMusic", label: "Toggle Music", cat: "tools" },
    { id: "screenshot", label: "Screenshot", cat: "tools" },
    { id: "debugMode", label: "Debug Mode", cat: "tools" },
    { id: "zoomIn", label: "Zoom In", cat: "view" },
    { id: "zoomOut", label: "Zoom Out", cat: "view" },
    { id: "toggleUI", label: "Toggle UI", cat: "view" },
  ];
  
  const _formatKey = (code) => window.kbLabel(code);
  const _openKeybindEdit = (def, ki, rowIdx) => {
    if (this._kbSub) return;
    if (capture) { const ci = capture.i; capture = null; _buildRow(ci); }
    const subW = 600, subH = 475;
    const SUB_X = 0, SUB_Y = 0;
    const SUB_CLOSE_X = -(subW / 2) + 10;
    const SUB_CLOSE_Y = -(subH / 2) + 10;
    const SUB_CLOSE_SCALE = 0.8;
    const isAdd = ki < 0;
    const SUB_TITLE_TEXT = "Edit Keybind";
    const SUB_ADD_SET_X = 0;
    const SUB_TITLE_X = 0;
    const SUB_TITLE_Y = -(subH / 2) + 30;
    const SUB_TITLE_SIZE = 36;
    const SUB_NAME_X = 0;
    const SUB_NAME_Y = -136;
    const SUB_NAME_SIZE = 44;
    const SUB_NAME_COLOR = 0x26cbff;
    const SUB_NAME_MAX_W = subW - 140;
    const SUB_KEY_X = 0;
    const SUB_KEY_Y = -54;
    const SUB_KEY_SIZE = 48;
    const SUB_HINT_TEXT = "Press Keys...";
    const SUB_HINT_X = 0;
    const SUB_HINT_Y = 25;
    const SUB_HINT_SIZE = 32;
    const SUB_HINT_ALPHA = 0.6;
    const SUB_BTN_H = 60;
    const SUB_BTN_Y = subH / 2 - 50;
    const SUB_SET_W = 150;
    const SUB_SET_X = -110;
    const SUB_REMOVE_W = 210;
    const SUB_REMOVE_X = 110;
    const SUB_SET_TEXT_X = -5;
    const SUB_SET_TEXT_Y = -2;
    const SUB_SET_SIZE = 49;
    const SUB_REMOVE_TEXT_X = -5;
    const SUB_REMOVE_TEXT_Y = -2;
    const SUB_REMOVE_SIZE = 46;
    const sub = this.add.container(0, 0).setScrollFactor(0).setDepth(510);
    this._keybindsPopup.add(sub);
    const subDim = this.add.rectangle(centerX, centerY, screenWidth * 2, screenHeight * 2, 0, 150/255).setInteractive();
    sub.add(subDim);
    const subInner = this.add.container(centerX + SUB_X, centerY + SUB_Y);
    sub.add(subInner);
    const subCorner = 0.325 * this.textures.get("GJ_square67").source[0].width;
    subInner.add(this._drawScale9(0, 0, subW, subH, 'GJ_square67', subCorner, 16777215, 1));
    const subClose = this.add.image(SUB_CLOSE_X, SUB_CLOSE_Y, 'GJ_WebSheet', "GJ_closeBtn_001.png").setScale(SUB_CLOSE_SCALE).setInteractive();
    subInner.add(subClose);
    let pendingKey = isAdd ? null : _getKeys(def)[ki];
    const subCaptureHandler = (e) => {
      if (!this._keybindsPopup) return;
      if (e.code === "Escape") return;
      e.preventDefault();
      if (!e.code || e.code === "Unidentified") return;
      pendingKey = e.code;
      keyLbl.setText(_formatKey(pendingKey));
    };
    const _closeSub = () => {
      this.input.keyboard.off("keydown", subCaptureHandler);
      sub.destroy();
      this._kbSub = null;
    };
    this.input.keyboard.on("keydown", subCaptureHandler);
    this._makeBouncyButton(subClose, SUB_CLOSE_SCALE, _closeSub);
    subInner.add(this.add.bitmapText(SUB_TITLE_X, SUB_TITLE_Y, "bigFont", SUB_TITLE_TEXT, SUB_TITLE_SIZE).setOrigin(0.5));
    const nameLbl = this.add.bitmapText(SUB_NAME_X, SUB_NAME_Y, "bigFont", def.label, SUB_NAME_SIZE).setOrigin(0.5).setTint(SUB_NAME_COLOR);
    if (nameLbl.width > SUB_NAME_MAX_W) nameLbl.setScale(SUB_NAME_MAX_W / nameLbl.width);
    subInner.add(nameLbl);
    const keyLbl = this.add.bitmapText(SUB_KEY_X, SUB_KEY_Y, "goldFont", pendingKey ? _formatKey(pendingKey) : "", SUB_KEY_SIZE).setOrigin(0.5);
    subInner.add(keyLbl);
    subInner.add(this.add.bitmapText(SUB_HINT_X, SUB_HINT_Y, "bigFont", SUB_HINT_TEXT, SUB_HINT_SIZE).setOrigin(0.5).setAlpha(SUB_HINT_ALPHA));
    const _bottomBtn = (x, w, tex, text, textX, textY, textSize, cb) => {
      const border = Math.min((this.textures.get(tex)?.source[0].width || 40) * 0.3, SUB_BTN_H / 2 - 2);
      const bg = this.add.nineslice(x, SUB_BTN_Y, tex, null, w, SUB_BTN_H, border, border, border, border).setOrigin(0.5).setInteractive();
      const lbl = this.add.bitmapText(x + textX, SUB_BTN_Y + textY, "bigFont", text, textSize).setOrigin(0.5);
      subInner.add([bg, lbl]);
      this._makeCompositeBouncyButton(bg, [bg, lbl], 1, cb);
    };
    _bottomBtn(isAdd ? SUB_ADD_SET_X : SUB_SET_X, SUB_SET_W, "GJ_button01", "Set", SUB_SET_TEXT_X, SUB_SET_TEXT_Y, SUB_SET_SIZE, () => {
      if (!pendingKey) return;
      const cur = _getKeys(def);
      if (isAdd) {
        if (!cur.includes(pendingKey) && cur.length < MAX_KEYS) cur.push(pendingKey);
        _setKeys(def, cur);
      } else {
        cur[ki] = pendingKey;
        _setKeys(def, cur.filter((k, idx) => idx === ki || k !== pendingKey));
      }
      _closeSub();
      _buildRow(rowIdx);
    });
    if (!isAdd) {
      _bottomBtn(SUB_REMOVE_X, SUB_REMOVE_W, "GJ_button06", "Remove", SUB_REMOVE_TEXT_X, SUB_REMOVE_TEXT_Y, SUB_REMOVE_SIZE, () => {
        const cur = _getKeys(def);
        cur.splice(ki, 1);
        _setKeys(def, cur);
        _closeSub();
        _buildRow(rowIdx);
      });
    }
  
    this._kbSub = {
      isCapturing: () => false,
      cancelCapture: () => {},
      close: _closeSub,
      dispose: () => this.input.keyboard.off("keydown", subCaptureHandler)
    };
  };
  const listTop = -(panelH / 2) + 100;
  const listBot = (panelH / 2) - 20;
  const listH = listBot - listTop;
  const listW = panelW - 60;
  const ROW_H = 72;
  
  const maskGfx = this.add.graphics();
  maskGfx.fillStyle(0xffffff);
  maskGfx.fillRect(centerX - listW / 2, centerY + listTop, listW, listH);
  const maskGeom = maskGfx.createGeometryMask();
  maskGfx.setVisible(false);
  
  const listContainer = this.add.container(0, 0);
  inner.add(listContainer);
  listContainer.setMask(maskGeom);
  
  let scrollY = 0;
  const ROW_GAP = 6;
  const ROW_RADIUS = 10;
  
  const KB_TABS = [
    { label: "Gameplay", cat: "gameplay", w: 150 },
    { label: "Practice", cat: "practice", w: 140 },
    { label: "Editor", cat: "editor", w: 120 }
  ];
  let currentTab = 0;
  let searchMode = false;
  let searchQuery = "";
  let listOffset = 0;
  let defs = [];
  let totalContentH = 0;
  let maxScroll = 0;
  
  const MAX_KEYS = 4;
  const BTN_H = 48;
  const PLUS_W = 58;
  
  const NAME_X = 22;
  const NAME_Y = 0;
  const NAME_SIZE = 28;
  const KEY_TEXT_X = 0;
  const KEY_TEXT_Y = -2;
  const KEY_SIZE = 24;
  const PLUS_TEXT_X = -4;
  const PLUS_TEXT_Y = -2.5;
  const PLUS_SIZE = 38;
  const DOTS_SIZE = 30;
  const BTN_GAP = 10;
  const ROW_PAD = 16;
  const LABEL_MAX_W = 230;
  const btn04Border = Math.min((this.textures.get("GJ_button04")?.source[0].width || 40) * 0.3, BTN_H / 2 - 2);
  const btn01Border = Math.min((this.textures.get("GJ_button01")?.source[0].width || 40) * 0.3, BTN_H / 2 - 2);
  
  const _getKeys = (def) => window.keybinds[def.id] ? [...window.keybinds[def.id]] : [...(window._defaultKeybinds[def.id] || [])];
  const _setKeys = (def, keys) => { window.keybinds[def.id] = [...keys]; this._saveKeybinds(); };
  
  const _inList = () => {
    const p = this.input.activePointer;
    return p.x >= centerX - listW / 2 && p.x <= centerX + listW / 2 &&
      p.y >= centerY + listTop + listOffset && p.y <= centerY + listBot;
  };
  
  let capture = null;
  const rowCtrs = [];
  
  const _buildRow = (i) => {
    const def = defs[i];
    if (rowCtrs[i]) rowCtrs[i].destroy();
    const ry = listTop + listOffset + ROW_H / 2 + i * (ROW_H + ROW_GAP);
    const rowCtr = this.add.container(0, ry);
    listContainer.add(rowCtr);
    rowCtrs[i] = rowCtr;
  
    const nameLbl = this.add.bitmapText(-listW / 2 + NAME_X, NAME_Y, "bigFont", def.label, NAME_SIZE).setOrigin(0, 0.5);
    if (nameLbl.width * nameLbl.scaleX > LABEL_MAX_W) nameLbl.setScale(LABEL_MAX_W / nameLbl.width);
    rowCtr.add(nameLbl);
  
    const keys = _getKeys(def);
    const isCapturing = capture && capture.i === i;
  
    let cursorX = listW / 2 - ROW_PAD;
    const plusW = PLUS_W;
    const plusBg = this.add.nineslice(cursorX - plusW / 2, 0, "GJ_button01", null, plusW, BTN_H, btn01Border, btn01Border, btn01Border, btn01Border).setOrigin(0.5).setInteractive();
    const plusLbl = this.add.bitmapText(cursorX - plusW / 2 + PLUS_TEXT_X, PLUS_TEXT_Y, "bigFont", isCapturing ? "..." : "+", isCapturing ? DOTS_SIZE : PLUS_SIZE).setOrigin(0.5);
    rowCtr.add([plusBg, plusLbl]);
    this._makeCompositeBouncyButton(plusBg, [plusBg, plusLbl], 1, () => {
      if (keys.length >= MAX_KEYS) return;
      _openKeybindEdit(def, -1, i);
    }, _inList);
    cursorX -= plusW + BTN_GAP;
  
    for (let ki = keys.length - 1; ki >= 0; ki--) {
      const lbl = this.add.bitmapText(0, KEY_TEXT_Y, "bigFont", _formatKey(keys[ki]), KEY_SIZE).setOrigin(0.5);
      if (lbl.width > 110) lbl.setScale(110 / lbl.width);
      const bw = Math.max(BTN_H, Math.ceil(lbl.width * lbl.scaleX) + 28);
      const bx = cursorX - bw / 2;
      const bg = this.add.nineslice(bx, 0, "GJ_button04", null, bw, BTN_H, btn04Border, btn04Border, btn04Border, btn04Border).setOrigin(0.5).setInteractive();
      lbl.setPosition(bx + KEY_TEXT_X, KEY_TEXT_Y);
      rowCtr.add([bg, lbl]);
      this._makeCompositeBouncyButton(bg, [bg, lbl], 1, () => _openKeybindEdit(def, ki, i), _inList);
      cursorX -= bw + BTN_GAP;
    }
  };
  
  this._keybindsCaptureHandler = (e) => {
    if (!capture || !this._keybindsPopup) return;
    if (e.code === "Escape") return;
    e.preventDefault();
    if (!e.code || e.code === "Unidentified") return;
    const i = capture.i;
    const def = defs[i];
    const cur = _getKeys(def);
    if (!cur.includes(e.code) && cur.length < MAX_KEYS) {
      cur.push(e.code);
      _setKeys(def, cur);
    }
    capture = null;
    _buildRow(i);
  };
  this.input.keyboard.on("keydown", this._keybindsCaptureHandler);
  
  const trackX = listW / 2 - 4;
  let trackH = listH;
  let thumbH = 30;
  const thumb = this.add.rectangle(trackX, listTop, 7, thumbH, 0xffffff, 0.45).setOrigin(0.5, 0);
  inner.add(thumb);
  
  const _updateScroll = () => {
    listContainer.y = -scrollY;
    const pct = maxScroll > 0 ? scrollY / maxScroll : 0;
    thumb.y = listTop + listOffset + pct * (trackH - thumbH);
  };
  
  const _buildList = () => {
    capture = null;
    listContainer.removeAll(true);
    rowCtrs.length = 0;
    if (searchMode) {
      const q = searchQuery.trim().toLowerCase();
      defs = q ? _kbDefs.filter(d => d.label.toLowerCase().includes(q)) : [];
    } else {
      defs = _kbDefs.filter(d => d.cat === KB_TABS[currentTab].cat);
    }
    listOffset = searchMode ? SEARCH_BAR_H + SEARCH_BAR_GAP : 0;
    const visH = listH - listOffset;
    trackH = visH;
  
    maskGfx.clear();
    maskGfx.fillStyle(0xffffff);
    maskGfx.fillRect(centerX - listW / 2, centerY + listTop + listOffset, listW, visH);
    searchUI.setVisible(searchMode);
    _refreshSearchText();
    scrollY = 0;
    totalContentH = defs.length * ROW_H + Math.max(0, defs.length - 1) * ROW_GAP;
    maxScroll = Math.max(0, totalContentH - visH);
    defs.forEach((_d, i) => {
      const ry = listTop + listOffset + ROW_H / 2 + i * (ROW_H + ROW_GAP);
      const gfx = this.add.graphics();
      gfx.fillStyle(i % 2 === 0 ? 0x2d313c : 0x343946, 1);
      gfx.fillRoundedRect(-listW / 2, ry - ROW_H / 2, listW, ROW_H, ROW_RADIUS);
      listContainer.add(gfx);
    });
    defs.forEach((_d, i) => _buildRow(i));
    thumbH = Math.max(30, trackH * Math.min(1, visH / Math.max(totalContentH, 1)));
    thumb.setSize(7, thumbH);
    thumb.setVisible(maxScroll > 0);
    _updateScroll();
  };
  
  const TAB_Y = -(panelH / 2) + 45;
  const TAB_H = 55;
  const TAB_GAP = 5;
  const TAB_TEXT_X = 0;
  const TAB_TEXT_Y = -2;
  const TAB_SIZE = 30;
  const SEARCH_W = 50;
  const SETTINGS_SCALE = 0.8;
  const SETTINGS_X = (panelW / 2) - 45;
  const tabBorder = this.textures.get("GJ_button05").source[0].width * 0.3;
  const tabGroupW = KB_TABS.reduce((a, t) => a + t.w + TAB_GAP, 0) + SEARCH_W;
  let tabX = -tabGroupW / 2;
  const tabBgs = [];
  KB_TABS.forEach((tab, i) => {
    const tabBg = this.add.nineslice(tabX + tab.w / 2, TAB_Y, "GJ_button05", null, tab.w, TAB_H, tabBorder, tabBorder, tabBorder, tabBorder).setOrigin(0.5).setInteractive();
    const tabLbl = this.add.bitmapText(tabX + tab.w / 2 + TAB_TEXT_X, TAB_Y + TAB_TEXT_Y, "bigFont", tab.label, TAB_SIZE).setOrigin(0.5);
    if (tabLbl.width > tab.w - 24) tabLbl.setScale((tab.w - 24) / tabLbl.width);
    inner.add([tabBg, tabLbl]);
    tabBgs.push(tabBg);
    this._makeCompositeBouncyButton(tabBg, [tabBg, tabLbl], 1, () => {
      if (!searchMode && currentTab === i) return;
      searchMode = false;
      currentTab = i;
      _srchText = "";
      searchQuery = "";
      if (typeof _srchBlur === "function") _srchBlur();
      _refreshTabs();
      _buildList();
    });
    tabX += tab.w + TAB_GAP;
  });
  const _refreshTabs = () => {
    tabBgs.forEach((bg, i) => bg.setTexture(!searchMode && i === currentTab ? "GJ_button02" : "GJ_button05"));
    searchBg.setTexture(searchMode ? "GJ_button02" : "GJ_button05");
  };
  
  const searchBg = this.add.nineslice(tabX + SEARCH_W / 2, TAB_Y, "GJ_button05", null, SEARCH_W, TAB_H, tabBorder, tabBorder, tabBorder, tabBorder).setOrigin(0.5).setInteractive();
  
  const SEARCH_ICON_SCALE = 0.8;
  const SEARCH_ICON_X = 0;
  const SEARCH_ICON_Y = -1;
  const searchIcon = this.add.image(tabX + SEARCH_W / 2 + SEARCH_ICON_X, TAB_Y + SEARCH_ICON_Y, "GJ_GameSheet04", "searchIcon_001.png").setOrigin(0.5);
  searchIcon.setScale((TAB_H * 0.6 / searchIcon.height) * SEARCH_ICON_SCALE);
  inner.add([searchBg, searchIcon]);
  this._makeCompositeBouncyButton(searchBg, [searchBg, searchIcon], 1, () => {
    if (searchMode) return;
    searchMode = true;
    _refreshTabs();
    _buildList();
  });
  
  const SEARCH_BAR_H = 70;
  const SEARCH_BAR_GAP = 8;
  const SEARCH_BAR_COLOR = 0x252933;
  const SEARCH_PLACEHOLDER = "Search...";
  const SEARCH_PLACEHOLDER_COLOR = 0x9a9a9a;
  const SEARCH_TEXT_SIZE = 28;
  const SEARCH_MAX_LEN = 24;
  const SEARCH_CANCEL_X = listW / 2 - 55;
  const SEARCH_CANCEL_Y = 0;
  const SEARCH_CANCEL_H = 40;
  
  let _srchText = "";
  let _srchFocused = false;
  let _srchCursorVis = false;
  let _srchCursorTmr = null;
  
  const searchUI = this.add.container(0, listTop + SEARCH_BAR_H / 2);
  inner.add(searchUI);
  
  const searchBar = this.add.graphics();
  searchBar.fillStyle(SEARCH_BAR_COLOR, 1);
  searchBar.fillRoundedRect(-listW / 2, -SEARCH_BAR_H / 2, listW, SEARCH_BAR_H, ROW_RADIUS);
  searchUI.add(searchBar);
  
  const _srchTextMaxW = listW - 220;
  const srchPlaceholder = this.add.bitmapText(0, 0, "bigFont", SEARCH_PLACEHOLDER, SEARCH_TEXT_SIZE)
    .setOrigin(0.5).setTint(SEARCH_PLACEHOLDER_COLOR);
  searchUI.add(srchPlaceholder);
  
  const srchTyped = this.add.bitmapText(0, 0, "bigFont", "", SEARCH_TEXT_SIZE)
    .setOrigin(0.5, 0.5).setTint(0xffffff).setVisible(false);
  searchUI.add(srchTyped);
  
  const srchCursor = this.add.text(0, 1, "|", {
    fontSize: "30px", fontFamily: "Arial", color: "#92a7c0"
  }).setOrigin(0.5).setVisible(false);
  searchUI.add(srchCursor);
  
  const _srchUpdateDisplay = () => {
    const has = _srchText.length > 0;
    srchPlaceholder.setVisible(!has && !_srchFocused);
    srchTyped.setVisible(has);
    if (has) {
      srchTyped.setText(_srchText);
      srchTyped.setScale(1);
      if (srchTyped.width > _srchTextMaxW) srchTyped.setScale(_srchTextMaxW / srchTyped.width);
    }
    if (_srchFocused) {
      const textW = has ? srchTyped.displayWidth : 0;
  
      srchCursor.x = textW / 2 + 4;
      srchCursor.setVisible(_srchCursorVis);
    } else {
      srchCursor.setVisible(false);
    }
  };
  
  const _srchStartBlink = () => {
    _srchCursorVis = true;
    _srchUpdateDisplay();
    if (_srchCursorTmr) _srchCursorTmr.remove();
    _srchCursorTmr = this.time.addEvent({
      delay: 530, loop: true, callback: () => {
        _srchCursorVis = !_srchCursorVis;
        if (_srchFocused) srchCursor.setVisible(_srchCursorVis);
      }
    });
  };
  
  const _srchStopBlink = () => {
    if (_srchCursorTmr) { _srchCursorTmr.remove(); _srchCursorTmr = null; }
    _srchCursorVis = false;
    srchCursor.setVisible(false);
  };
  
  const _srchFocus = () => {
    if (_srchFocused) return;
    _srchFocused = true;
    _srchStartBlink();
  };
  
  const _srchBlur = () => {
    _srchFocused = false;
    _srchStopBlink();
    _srchUpdateDisplay();
  };
  
  const srchHitZone = this.add.zone(0, 0, listW - 90, SEARCH_BAR_H)
    .setInteractive();
  searchUI.add(srchHitZone);
  srchHitZone.on("pointerdown", () => { if (searchMode) _srchFocus(); });
  
  inner.setInteractive(new Phaser.Geom.Rectangle(-panelW / 2, -panelH / 2, panelW, panelH), Phaser.Geom.Rectangle.Contains);
  inner.on("pointerdown", () => { if (typeof _srchBlur === "function") _srchBlur(); });
  
  const cancelBtn = this.add.image(SEARCH_CANCEL_X, SEARCH_CANCEL_Y, "GJ_GameSheet03", "GJ_longBtn07_001.png").setInteractive();
  const cancelScale = SEARCH_CANCEL_H / cancelBtn.height;
  cancelBtn.setScale(cancelScale);
  searchUI.add(cancelBtn);
  this._makeBouncyButton(cancelBtn, cancelScale, () => {
    _srchText = "";
    searchQuery = "";
    _srchUpdateDisplay();
    _buildList();
  });
  
  searchUI.setVisible(false);
  
  const _refreshSearchText = () => {
  
    _srchUpdateDisplay();
  };
  
  const _srchAllowedChars = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
  
  this._kbSearchHandler = (e) => {
    if (!searchMode || this._kbSub || !this._keybindsPopup) return;
    if (!_srchFocused) return;
    e.stopPropagation();
  
    if (e.key === "Backspace") {
      e.preventDefault();
      if (_srchText.length > 0) {
        _srchText = _srchText.slice(0, -1);
        searchQuery = _srchText;
        _srchUpdateDisplay();
        _buildList();
      }
    } else if (e.key === "Escape") {
      _srchBlur();
    } else if ((e.ctrlKey || e.metaKey) && (e.key === "v" || e.key === "V")) {
      e.preventDefault();
      navigator.clipboard.readText().then(pasted => {
        const filtered = pasted.split("").filter(c => _srchAllowedChars.includes(c)).join("");
        if (filtered.length > 0) {
          const space = SEARCH_MAX_LEN - _srchText.length;
          _srchText += filtered.slice(0, space);
          searchQuery = _srchText;
          _srchUpdateDisplay();
          _buildList();
        }
      }).catch(() => {});
    } else if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "C")) {
      e.preventDefault();
      navigator.clipboard.writeText(_srchText).catch(() => {});
    } else if ((e.ctrlKey || e.metaKey) && (e.key === "a" || e.key === "A")) {
      e.preventDefault();
    } else if (e.key && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (!_srchAllowedChars.includes(e.key)) return;
      if (_srchText.length >= SEARCH_MAX_LEN) return;
      e.preventDefault();
          _srchText += e.key;
          searchQuery = _srchText;
          _srchUpdateDisplay();
          _buildList();
        }
      };
      this.input.keyboard.on("keydown", this._kbSearchHandler);
  
      const settings = this.add.image(SETTINGS_X, TAB_Y, "GJ_GameSheet03", "GJ_optionsBtn02_001.png").setScale(SETTINGS_SCALE);
      this._applyLockedGray(settings);
      inner.add(settings);
  
      _refreshTabs();
      _buildList();
  
      this._kbWheelHandler = (_p, _o, _dx, dy) => {
        if (!this._keybindsPopup) return;
        scrollY = Phaser.Math.Clamp(scrollY + dy * 0.8, 0, maxScroll);
        _updateScroll();
      };
      this.input.on("wheel", this._kbWheelHandler);
  
      this._kbEscape = () => {
        if (capture) {
          const i = capture.i;
          capture = null;
          _buildRow(i);
          return;
        }
        if (this._kbSub) {
          if (this._kbSub.isCapturing()) this._kbSub.cancelCapture();
          else this._kbSub.close();
          return;
        }
        _closePopup();
      };
  
      inner.setScale(1);
    }
  _stopVaultMusic() {
    if (!this._vaultMusic) return;
    this._vaultMusic.stop();
    this._vaultMusic.destroy();
    this._vaultMusic = null;
  }
  _openVaultMenu() {
    if (this._vaultOverlayObjects || this._vaultTransitioning) return;
    this._vaultTransitioning = true;
    const sw = screenWidth;
    const sh = screenHeight;
    const fade = this.add.graphics().setScrollFactor(0).setDepth(600).setAlpha(0);
    fade.fillStyle(0x000000, 1);
    fade.fillRect(0, 0, sw, sh);

    const build = () => {
      this._audio.stopMusic();
      this._vaultMusic = this.sound.add("secretLoop", {
        loop: true,
        volume: this._audio.getUserMusicVolume() * 0.8
      });
      this._vaultMusic.play();

      const overlay = this.add.graphics().setScrollFactor(0).setDepth(300);
      const baseR = 0x00, baseG = 0x4c, baseB = 0x66;
      const darken = 0.445;
      const gradientSteps = 80;
      for (let gi = 0; gi < gradientSteps; gi++) {
        const t = gi / (gradientSteps - 1);
        const k = 1 + (darken - 1) * t;
        const r1 = Math.round(baseR * k);
        const g1 = Math.round(baseG * k);
        const b1 = Math.round(baseB * k);
        const bandColor = (r1 << 16) | (g1 << 8) | b1;
        const bandY = Math.floor(gi * sh / gradientSteps);
        const bandH = Math.ceil(sh / gradientSteps) + 1;
        overlay.fillStyle(bandColor, 1);
        overlay.fillRect(0, bandY, sw, bandH);
      }

      const blocker = this.add.zone(sw / 2, sh / 2, sw, sh)
        .setScrollFactor(0).setDepth(301).setInteractive();

      const backBtn = this.add.image(50, 48, "GJ_GameSheet03", "GJ_arrow_01_001.png")
        .setScrollFactor(0).setDepth(304).setFlipX(true).setFlipY(true)
        .setRotation(Math.PI).setInteractive();
      this._makeBouncyButton(backBtn, 1, () => this._closeVaultMenu());

      const title = this.add.bitmapText(sw / 2, 48, "goldFont", "The Vault", 46)
        .setScrollFactor(0).setDepth(304).setOrigin(0.5, 0.5);
      const lockFrame = "GJ_secretLock_001.png";
      let lockSheet = "GJ_GameSheet03";
      const lock = this.add.image(sw / 2, sh / 2, lockSheet, lockFrame)
        .setScrollFactor(0).setDepth(304).setInteractive();
      const titleBottom = title.y + title.height / 2;
      const lockTop = lock.y - lock.displayHeight / 2;
      const gap = lockTop - titleBottom;
      const msgSize = 36;
      const msgGap = 26;
      const vaultMsgOffsetY = 40;
      const vaultBarOffsetY = 70;
      const vaultLockOffsetY = 50;
      lock.y += vaultLockOffsetY;
      const barW = sw * 0.362;
      const barH = Math.max(40, Math.min(sh * 0.125, gap - 30));
      const stackH = msgSize + msgGap + barH;
      let barBottom = titleBottom + Math.max(0, gap - stackH) / 2 + stackH;
      barBottom = Math.min(barBottom, lockTop - 12);
      const barCX = sw / 2;
      const barBaseCY = barBottom - barH / 2;
      const msgBaseCY = (titleBottom + (barBaseCY - barH / 2)) / 2;
      const barCY = barBaseCY + vaultBarOffsetY;
      const msgCY = msgBaseCY + vaultMsgOffsetY;
      const barLeft = barCX - barW / 2;
      const barTop = barCY - barH / 2;

      const barGfx = this.add.graphics().setScrollFactor(0).setDepth(303);
      barGfx.fillStyle(0x002632, 1);
      barGfx.fillRoundedRect(barLeft, barTop, barW, barH, 10);
      const vaultMessages = [
        "How did you get in here?!",
        "What are you poking around for?",
        "Don't you have better things to do?",
        "There is no spoon",
        "Go away!",
        "I should have hid this room better...",
        "You're not supposed to be in here...",
        "RubRub won't like this...",
        "zzzZZZZ...",
        "Don't touch that!",
        "Why U touch my stuff?",
        "RubRub better not find you in here...",
        "Can't you just leave?",
        "This is not the room you are looking for...",
        "Sneaky sneaky...",
        "It's my precious...",
        "You shall not pass!",
        "Don't push the button!",
        "You're gonna get me in trouble...",
        "This is getting ridiculus...",
        "Go collect some stars",
        "Maybe there are new levels?",
        "Just, stop bothering me",
        "I'm gonna stop talking",
        "...",
        "......",
        "GAH!",
        "You're hopeless...",
        "Really, still here?",
        "Fine, press the button"
      ];
      const openingMessages = [
        "I should have hid this room better...",
        "RubRub won't like this...",
        "Don't you have better things to do?",
        vaultMessages[0]
      ];
      const openingMessage = openingMessages[Math.floor(Math.random() * openingMessages.length)];
      const vaultAltColor = 0x00ffc5;
      const vaultAltChance = 0.15;
      const vaultAltSequences = [
        ["Don't you get tired of clicking?", "I mean, isn't it boring?", "Click click click", "Is that all you do?"],
        ["I heard a joke the other day", "Two cubes walk into a bar", "Wait... did they walk or slide?", "I don't think cubes can walk", "Nevermind..."],
        ["Are you always like this?", "I mean, what's the point?", "Let me guess, you're gonna push the button?", "What a surprise..."],
        ["Roses are red", "Violets are blue", "Click the back button", "So I get rid of you"],
        ["So... what's up?", "The back button is in the corner.", "Ready to leave yet?", "Whenever you're ready...", "Fine, I can wait."],
        ["I have an idea for a gamemode", "You play as a cube", "that can jump", "...and there are spikes", "nevermind..."],
        ["Look behind you!", "I thought I saw something", "Maybe it's just my imagination", "Or was it?", "DUN DUN DUN!"],
        ["Hey...", "Who created this menu?", "Maybe it was him.", "Or was it?", "DUN DUN DUN!"],
        ["Don't you get fed up?", "With the lack of updates I mean.", "I mean, arent they lazy?", "Who are they...", "..."],
      ];
      let altSeq = null;
      let altPos = 0;
      let lastAltIdx = -1;
      let msgIndex = vaultMessages.indexOf(openingMessage);
      const msgLabel = this.add.bitmapText(barCX, msgCY, "bigFont", openingMessage, msgSize)
        .setScrollFactor(0).setDepth(305).setOrigin(0.5, 0.5);
      const _fitMessage = () => {
        msgLabel.setScale(1);
        const maxW = sw * 0.9;
        if (msgLabel.width > maxW) msgLabel.setScale(maxW / msgLabel.width);
      };
      _fitMessage();
      const _showMessage = (text, isAlt) => {
        msgLabel.setText(text);
        msgLabel.setTint(isAlt ? vaultAltColor : 0xffffff);
        _fitMessage();
      };
      const _nextMessage = () => {
        if (altSeq) {
          altPos++;
          if (altPos < altSeq.length) { _showMessage(altSeq[altPos], true); return; }
          altSeq = null;
        } else if (Math.random() < vaultAltChance) {
          let idx = lastAltIdx;
          while (idx === lastAltIdx && vaultAltSequences.length > 1) idx = Math.floor(Math.random() * vaultAltSequences.length);
          lastAltIdx = idx;
          altSeq = vaultAltSequences[idx];
          altPos = 0;
          _showMessage(altSeq[0], true);
          return;
        }
        let next = msgIndex;
        while (next === msgIndex) next = Math.floor(Math.random() * vaultMessages.length);
        msgIndex = next;
        _showMessage(vaultMessages[msgIndex], false);
      };

      const allowedChars = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const inputMaxLen = 19;
      let inputText = "";
      let inputFocused = false;

      const placeholderLabel = this.add.bitmapText(barCX, barCY, "bigFont", "...", 50)
        .setScrollFactor(0).setDepth(305).setOrigin(0.5, 0.5).setTint(0x5a9bdd);
      const typedLabel = this.add.bitmapText(barCX, barCY, "bigFont", "", 44)
        .setScrollFactor(0).setDepth(305).setOrigin(0.5, 0.5)
        .setTint(0xffffff).setVisible(false);
      const inputCursor = this.add.text(0, barCY, "|", {
        fontSize: "33px", fontFamily: "Arial", color: "#92a7c0"
      }).setScrollFactor(0).setDepth(305).setOrigin(0.5, 0.5).setVisible(false);

      const _updateInputDisplay = () => {
        if (inputText === "") {
          typedLabel.setVisible(false);
          placeholderLabel.setVisible(true);
        } else {
          placeholderLabel.setVisible(false);
          typedLabel.setScale(1).setText(inputText).setVisible(true);
          const maxTextW = barW - 40;
          if (typedLabel.width > maxTextW) typedLabel.setScale(maxTextW / typedLabel.width);
        }
        if (inputFocused) {
          const textW = inputText === "" ? 0 : typedLabel.displayWidth;
          inputCursor.x = barCX + textW / 2 + 3;
          inputCursor.setVisible(true);
        } else {
          inputCursor.setVisible(false);
        }
      };

      const _focusInput = () => { inputFocused = true; _updateInputDisplay(); };
      const _blurInput = () => { inputFocused = false; _updateInputDisplay(); };

      const inputHitZone = this.add.zone(barCX, barCY, barW, barH)
        .setScrollFactor(0).setDepth(306).setInteractive();
      inputHitZone.on("pointerdown", () => _focusInput());
      blocker.on("pointerdown", () => { if (inputFocused) _blurInput(); });

      const _submitVaultCode = () => {
        inputText = "";
        _updateInputDisplay();
        _nextMessage();
      };
      this._makeBouncyButton(lock, 1, () => { _submitVaultCode(); });

      const _onKeyDown = (event) => {
        if (!inputFocused) return;
        event.stopPropagation();
        if (event.key === "Backspace") {
          if (inputText.length > 0) {
            inputText = inputText.slice(0, -1);
            _updateInputDisplay();
          }
        } else if (event.key === "Enter") {
          _submitVaultCode();
        } else if (event.ctrlKey || event.metaKey) {
          if (event.key === "c" || event.key === "C") {
            event.preventDefault();
            navigator.clipboard.writeText(inputText);
          } else if (event.key === "v" || event.key === "V") {
            event.preventDefault();
            navigator.clipboard.readText().then(pastedText => {
              const filtered = pastedText.split("").filter(c => allowedChars.includes(c)).join("");
              if (filtered.length > 0) {
                inputText += filtered.slice(0, inputMaxLen - inputText.length);
                _updateInputDisplay();
              }
            }).catch(() => {});
          } else if (event.key === "a" || event.key === "A") {
            event.preventDefault();
          }
        } else if (event.key.length === 1 && allowedChars.includes(event.key)) {
          if (inputText.length < inputMaxLen) {
            inputText += event.key;
            _updateInputDisplay();
          }
        }
      };
      const _onKeyUpStop = (e) => { if (inputFocused) e.stopPropagation(); };
      const _onKeyPressStop = (e) => { if (inputFocused) e.stopPropagation(); };
      window.addEventListener("keydown", _onKeyDown);
      window.addEventListener("keyup", _onKeyUpStop);
      window.addEventListener("keypress", _onKeyPressStop);
      this._vaultInput = {
        remove: () => {
          window.removeEventListener("keydown", _onKeyDown);
          window.removeEventListener("keyup", _onKeyUpStop);
          window.removeEventListener("keypress", _onKeyPressStop);
        }
      };

      this._vaultOverlayObjects = [overlay, blocker, backBtn, title, lock,
        msgLabel, barGfx, placeholderLabel, typedLabel, inputCursor, inputHitZone];
    };

    this.tweens.add({
      targets: fade, alpha: 1, duration: 150, ease: "Linear",
      onComplete: () => {
        build();
        this._vaultTransitioning = false;
        this.tweens.add({ targets: fade, alpha: 0, duration: 150, ease: "Linear", onComplete: () => fade.destroy() });
      }
    });
  }
  _closeVaultMenu() {
    if (!this._vaultOverlayObjects || this._vaultTransitioning) return;
    this._vaultTransitioning = true;
    if (this._vaultInput) { this._vaultInput.remove(); this._vaultInput = null; }
    const sw = screenWidth;
    const sh = screenHeight;
    const fade = this.add.graphics().setScrollFactor(0).setDepth(600).setAlpha(0);
    fade.fillStyle(0x000000, 1);
    fade.fillRect(0, 0, sw, sh);
    this.tweens.add({
      targets: fade, alpha: 1, duration: 150, ease: "Linear",
      onComplete: () => {
        for (const obj of this._vaultOverlayObjects) {
          if (obj && obj.destroy) obj.destroy();
        }
        this._stopVaultMusic();
        this._audio.startMenuMusic();
        this._vaultOverlayObjects = null;
        this._vaultTransitioning = false;
        this.tweens.add({ targets: fade, alpha: 0, duration: 150, ease: "Linear", onComplete: () => fade.destroy() });
      }
    });
  }
  _stopSecretVaultMusic() {
    if (!this._secretVaultMusic) return;
    this._secretVaultMusic.stop();
    this._secretVaultMusic.destroy();
    this._secretVaultMusic = null;
  }
  _openSecretVault() {
    if (this._secretVaultOverlayObjects || this._secretVaultTransitioning) return;
    this._secretVaultTransitioning = true;
    const sw = screenWidth;
    const sh = screenHeight;
    const fade = this.add.graphics().setScrollFactor(0).setDepth(600).setAlpha(0);
    fade.fillStyle(0x000000, 1);
    fade.fillRect(0, 0, sw, sh);

    const build = () => {
      this._audio.stopMusic();
      this._secretVaultMusic = this.sound.add("secretLoop2", {
        loop: true,
        volume: this._audio.getUserMusicVolume() * 0.8
      });
      this._secretVaultMusic.play();

      const overlay = this.add.graphics().setScrollFactor(0).setDepth(300);
      const baseR = 0x52, baseG = 0x00, baseB = 0x67;
      const darken = 0.445;
      const gradientSteps = 80;
      for (let gi = 0; gi < gradientSteps; gi++) {
        const t = gi / (gradientSteps - 1);
        const k = 1 + (darken - 1) * t;
        const r1 = Math.round(baseR * k);
        const g1 = Math.round(baseG * k);
        const b1 = Math.round(baseB * k);
        const bandColor = (r1 << 16) | (g1 << 8) | b1;
        const bandY = Math.floor(gi * sh / gradientSteps);
        const bandH = Math.ceil(sh / gradientSteps) + 1;
        overlay.fillStyle(bandColor, 1);
        overlay.fillRect(0, bandY, sw, bandH);
      }

      const blocker = this.add.zone(sw / 2, sh / 2, sw, sh)
        .setScrollFactor(0).setDepth(301).setInteractive();

      const backBtn = this.add.image(50, 48, "GJ_GameSheet03", "GJ_arrow_01_001.png")
        .setScrollFactor(0).setDepth(304).setFlipX(true).setFlipY(true)
        .setRotation(Math.PI).setInteractive();
      this._makeBouncyButton(backBtn, 1, () => this._closeSecretVault());

      const title = this.add.bitmapText(sw / 2, 48, "goldFont", "Vault of Secrets", 46)
        .setScrollFactor(0).setDepth(304).setOrigin(0.5, 0.5);
      const lockBack = this.add.image(0, 0, "SecretSheet", "GJ_secretLock2_2_001.png");
      const lockFront = this.add.image(0, 0, "SecretSheet", "GJ_secretLock2_001.png");
      const lock = this.add.container(sw / 2, sh / 2, [lockBack, lockFront])
        .setScrollFactor(0).setDepth(304);
      lock.setSize(lockFront.width, lockFront.height);
      lock.setInteractive();
      const titleBottom = title.y + title.height / 2;
      const _measureLock = this.add.image(0, 0, "GJ_GameSheet03", "GJ_secretLock_001.png").setVisible(false);
      const _layoutLockH = _measureLock.displayHeight;
      _measureLock.destroy();
      const lockTop = lock.y - _layoutLockH / 2;
      const gap = lockTop - titleBottom;
      const msgSize = 36;
      const msgGap = 26;
      const vaultMsgOffsetY = 40;
      const vaultBarOffsetY = 70;
      const vaultLockOffsetY = 50;
      lock.y += vaultLockOffsetY;
      const barW = sw * 0.362;
      const barH = Math.max(40, Math.min(sh * 0.125, gap - 30));
      const stackH = msgSize + msgGap + barH;
      let barBottom = titleBottom + Math.max(0, gap - stackH) / 2 + stackH;
      barBottom = Math.min(barBottom, lockTop - 12);
      const barCX = sw / 2;
      const barBaseCY = barBottom - barH / 2;
      const msgBaseCY = (titleBottom + (barBaseCY - barH / 2)) / 2;
      const barCY = barBaseCY + vaultBarOffsetY;
      const msgCY = msgBaseCY + vaultMsgOffsetY;
      const barLeft = barCX - barW / 2;
      const barTop = barCY - barH / 2;

      const barGfx = this.add.graphics().setScrollFactor(0).setDepth(303);
      barGfx.fillStyle(0x2b0034, 1);
      barGfx.fillRoundedRect(barLeft, barTop, barW, barH, 10);
      const _vaultUser = String(localStorage.getItem("playerName") || "Player").replace(/\r|\n/g, "").slice(0, 20) || "Player";
      const vaultMessages = [
        _vaultUser + " the sneaky one...",
        "You think you can fool me",
        "You are deeply mistaken",
        "Go away!",
        "You are deeply mistaken",
        "I should have hid this room better...",
        "You're not supposed to be in here...",
        "RubRub won't like this...",
        "zzzZZZZ...",
        "Don't touch that!",
        "I have heard about you.",
        "Why you touch my stuff?",
        "RubRub better not find you in here...",
        "Can't you just leave?",
        "This is not the room you are looking for...",
        "Sneaky sneaky...",
        "It's my precious...",
        "You shall not pass!",
        "Don't push the button!",
        "You're gonna get me in trouble...",
        "This is getting ridiculus...",
        "Go collect some stars",
        "Maybe there are new levels?",
        "Just, stop bothering me",
        "I'm gonna stop talking",
        "...",
        "......",
        "GAH!",
        "You're hopeless...",
        "Really, still here?",
        "Fine, press the button"
      ];
      const openingMessages = [vaultMessages[0], "Don't touch that!", "I have heard about you."];
      const openingMessage = openingMessages[Math.floor(Math.random() * openingMessages.length)];
      const vaultAltColor = 0x00ffc5;
      const vaultAltChance = 0.15;
      const vaultAltSequences = [
        ["Oh my head...", "I feel so drained", "Would be nice to get some energy", "You know, for my head...", "Nothing? OK..."],
        ["I heard what you did", "You little thief", "You took 'Spooky's' coin", "That is pure evil", "I like it", "I know what you're thinking", "But you will never get my coin...", "I keep it safe", "Too clever for you..."],
        ["So... there is a tree", "A very short tree", "In this tree there lives a Witch", "A very short Witch", "The Witch stinks of fish", "My question to you is this...", "On a scale from tree to fish", "How many shinies do you have?"],
        ["Which came first?", "The chicken or the egg?", "...", "The egg, of course", "Then the egg laid the chicken", "... and the chicken said", "The password is on fire", "I need to get some rest..."],
        ["Want to hear a secret?", "Just don't tell RubRub", "I am building my own level", "I call it \"The Challenge\"", "Hope it gets featured", "But probably not...", "RubRub will never notice me"],
        ["...", "Might as well give you a riddle", "Since you insist on staying", "'I have always been odd'", "'Remove my start and I am even'", "'When you complete this riddle'", "'I hope you are leaving'", "Can you go now?"],
        ["Remember the 2.1 Awards?", "Me neither"],
        ["It's been so long", "I feel like I've forgotten something", "...", "Where's that smoke coming from?"]
      ];
      let altSeq = null;
      let altPos = 0;
      let lastAltIdx = -1;
      let msgIndex = vaultMessages.indexOf(openingMessage);
      const msgLabel = this.add.bitmapText(barCX, msgCY, "bigFont", openingMessage, msgSize)
        .setScrollFactor(0).setDepth(305).setOrigin(0.5, 0.5);
      const _fitMessage = () => {
        msgLabel.setScale(1);
        const maxW = sw * 0.9;
        if (msgLabel.width > maxW) msgLabel.setScale(maxW / msgLabel.width);
      };
      _fitMessage();
      const _showMessage = (text, isAlt) => {
        msgLabel.setText(text);
        msgLabel.setTint(isAlt ? vaultAltColor : 0xffffff);
        _fitMessage();
      };
      const _nextMessage = () => {
        if (altSeq) {
          altPos++;
          if (altPos < altSeq.length) { _showMessage(altSeq[altPos], true); return; }
          altSeq = null;
        } else if (Math.random() < vaultAltChance) {
          let idx = lastAltIdx;
          while (idx === lastAltIdx && vaultAltSequences.length > 1) idx = Math.floor(Math.random() * vaultAltSequences.length);
          lastAltIdx = idx;
          altSeq = vaultAltSequences[idx];
          altPos = 0;
          _showMessage(altSeq[0], true);
          return;
        }
        let next = msgIndex;
        while (next === msgIndex) next = Math.floor(Math.random() * vaultMessages.length);
        msgIndex = next;
        _showMessage(vaultMessages[msgIndex], false);
      };

      const allowedChars = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const inputMaxLen = 19;
      let inputText = "";
      let inputFocused = false;

      const placeholderLabel = this.add.bitmapText(barCX, barCY, "bigFont", "...", 50)
        .setScrollFactor(0).setDepth(305).setOrigin(0.5, 0.5).setTint(0x5a9bdd);
      const typedLabel = this.add.bitmapText(barCX, barCY, "bigFont", "", 44)
        .setScrollFactor(0).setDepth(305).setOrigin(0.5, 0.5)
        .setTint(0xffffff).setVisible(false);
      const inputCursor = this.add.text(0, barCY, "|", {
        fontSize: "33px", fontFamily: "Arial", color: "#92a7c0"
      }).setScrollFactor(0).setDepth(305).setOrigin(0.5, 0.5).setVisible(false);

      const _updateInputDisplay = () => {
        if (inputText === "") {
          typedLabel.setVisible(false);
          placeholderLabel.setVisible(true);
        } else {
          placeholderLabel.setVisible(false);
          typedLabel.setScale(1).setText(inputText).setVisible(true);
          const maxTextW = barW - 40;
          if (typedLabel.width > maxTextW) typedLabel.setScale(maxTextW / typedLabel.width);
        }
        if (inputFocused) {
          const textW = inputText === "" ? 0 : typedLabel.displayWidth;
          inputCursor.x = barCX + textW / 2 + 3;
          inputCursor.setVisible(true);
        } else {
          inputCursor.setVisible(false);
        }
      };

      const _focusInput = () => { inputFocused = true; _updateInputDisplay(); };
      const _blurInput = () => { inputFocused = false; _updateInputDisplay(); };

      const inputHitZone = this.add.zone(barCX, barCY, barW, barH)
        .setScrollFactor(0).setDepth(306).setInteractive();
      inputHitZone.on("pointerdown", () => _focusInput());
      blocker.on("pointerdown", () => { if (inputFocused) _blurInput(); });

      const _submitSecretVaultCode = () => {
        inputText = "";
        _updateInputDisplay();
        _nextMessage();
      };
      this._makeBouncyButton(lock, 1, () => { _submitSecretVaultCode(); });

      const _onKeyDown = (event) => {
        if (!inputFocused) return;
        event.stopPropagation();
        if (event.key === "Backspace") {
          if (inputText.length > 0) {
            inputText = inputText.slice(0, -1);
            _updateInputDisplay();
          }
        } else if (event.key === "Enter") {
          _submitSecretVaultCode();
        } else if (event.ctrlKey || event.metaKey) {
          if (event.key === "c" || event.key === "C") {
            event.preventDefault();
            navigator.clipboard.writeText(inputText);
          } else if (event.key === "v" || event.key === "V") {
            event.preventDefault();
            navigator.clipboard.readText().then(pastedText => {
              const filtered = pastedText.split("").filter(c => allowedChars.includes(c)).join("");
              if (filtered.length > 0) {
                inputText += filtered.slice(0, inputMaxLen - inputText.length);
                _updateInputDisplay();
              }
            }).catch(() => {});
          } else if (event.key === "a" || event.key === "A") {
            event.preventDefault();
          }
        } else if (event.key.length === 1 && allowedChars.includes(event.key)) {
          if (inputText.length < inputMaxLen) {
            inputText += event.key;
            _updateInputDisplay();
          }
        }
      };
      const _onKeyUpStop = (e) => { if (inputFocused) e.stopPropagation(); };
      const _onKeyPressStop = (e) => { if (inputFocused) e.stopPropagation(); };
      window.addEventListener("keydown", _onKeyDown);
      window.addEventListener("keyup", _onKeyUpStop);
      window.addEventListener("keypress", _onKeyPressStop);
      this._secretVaultInput = {
        remove: () => {
          window.removeEventListener("keydown", _onKeyDown);
          window.removeEventListener("keyup", _onKeyUpStop);
          window.removeEventListener("keypress", _onKeyPressStop);
        }
      };

      const _doorFrame = "secretDoor_closed_001.png";
      const secretDoor = this.add.image(sw - 40, sh - 20, "SecretSheet", _doorFrame)
        .setScrollFactor(0).setDepth(304).setOrigin(1, 1);
      secretDoor.postFX.addColorMatrix().grayscale(1);
      secretDoor.setTint(0xafafaf);
      const challengeCX = secretDoor.x - secretDoor.displayWidth / 2;
      const challengeBtnCY = secretDoor.y - secretDoor.displayHeight - 90;
      const challengeBtn = this.add.image(challengeCX, challengeBtnCY, "GJ_GameSheet03", "GJ_playBtn2_001.png")
        .setScrollFactor(0).setDepth(304).setScale(0.5).setInteractive();
      let challengeLoading = false;
      this._makeBouncyButton(challengeBtn, 0.55, () => {
        if (challengeLoading) return;
        challengeLoading = true;
        this._secretVaultTransitioning = true;
        if (this._secretVaultInput) { this._secretVaultInput.remove(); this._secretVaultInput = null; }
        this.input.enabled = false;
        this._stopSecretVaultMusic();
        challengeBtn.setTint(0x666666);
        challengeBtn.disableInteractive();
        const challengeLevelFile = "level_67";
        const known = (window.allLevels || []).find(l => l && l[2] === challengeLevelFile);
        const challengeLvl = known ? [...known] : [challengeLevelFile, "The Challenge", challengeLevelFile, "Unknown"];
        window.currentlevel = challengeLvl;

        const songID = challengeLvl[0];
        const songFileName = challengeLvl[4] ? challengeLvl[4] : String(challengeLvl[1]).replaceAll(" ", "");

        const loadingText = this.add.bitmapText(sw / 2, sh - 30, "goldFont", "Downloading Level Assets...", 20)
          .setScrollFactor(0).setOrigin(0.5).setDepth(700);

        this.load.text(challengeLevelFile, "assets/levels/67.txt");
        if (known && !this.cache.audio.exists(songID)) this.load.audio(songID, "assets/sound/music/" + songFileName + ".mp3");

        this.load.once("complete", () => {
          loadingText.destroy();
          if (this._secretVaultInput) { this._secretVaultInput.remove(); this._secretVaultInput = null; }
          this._audio.playEffect("playSound_01", { volume: 1 });
          this._audio.stopMusic();
          for (const obj of this._secretVaultOverlayObjects || []) {
            if (obj && obj.destroy) obj.destroy();
          }
          this._secretVaultOverlayObjects = null;
          this._secretVaultTransitioning = false;
          this.input.enabled = true;
          this.game.registry.set("autoStartGame", true);
          this.scene.restart();
        });
        this.load.start();
      }, () => !!this._secretVaultOverlayObjects && !this._secretVaultTransitioning && !challengeLoading);
      const challengeTitle = this.add.bitmapText(challengeCX, challengeBtnCY - challengeBtn.displayHeight / 2 - 10, "bigFont", "The\nChallenge", 30)
        .setScrollFactor(0).setDepth(304).setOrigin(0.5, 1).setCenterAlign();
      const _challengeMaxW = secretDoor.displayWidth * 1.1;
      if (challengeTitle.width > _challengeMaxW) challengeTitle.setScale(_challengeMaxW / challengeTitle.width);

      this._secretVaultOverlayObjects = [overlay, blocker, backBtn, title, lock, secretDoor,
        challengeBtn, challengeTitle,
        msgLabel, barGfx, placeholderLabel, typedLabel, inputCursor, inputHitZone];
    };

    this.tweens.add({
      targets: fade, alpha: 1, duration: 150, ease: "Linear",
      onComplete: () => {
        build();
        if (this._secretVaultReturnCover) {
          this._secretVaultReturnCover.destroy();
          this._secretVaultReturnCover = null;
        }
        this._secretVaultTransitioning = false;
        this.tweens.add({ targets: fade, alpha: 0, duration: 150, ease: "Linear", onComplete: () => fade.destroy() });
      }
    });
  }
  _closeSecretVault() {
    if (!this._secretVaultOverlayObjects || this._secretVaultTransitioning) return;
    this._secretVaultTransitioning = true;
    if (this._secretVaultInput) { this._secretVaultInput.remove(); this._secretVaultInput = null; }
    const sw = screenWidth;
    const sh = screenHeight;
    const fade = this.add.graphics().setScrollFactor(0).setDepth(600).setAlpha(0);
    fade.fillStyle(0x000000, 1);
    fade.fillRect(0, 0, sw, sh);
    this.tweens.add({
      targets: fade, alpha: 1, duration: 150, ease: "Linear",
      onComplete: () => {
        for (const obj of this._secretVaultOverlayObjects) {
          if (obj && obj.destroy) obj.destroy();
        }
        this._stopSecretVaultMusic();
        this._audio.startMenuMusic();
        this._secretVaultOverlayObjects = null;
        this._secretVaultTransitioning = false;
        this.tweens.add({ targets: fade, alpha: 0, duration: 150, ease: "Linear", onComplete: () => fade.destroy() });
      }
    });
  }
  _showSettingsScreen() {
    this._settingsScreenClosing = false;
    if (this._pauseBtn) {
      this.tweens.add({
        targets: this._pauseBtn,
        alpha: 0,
        duration: 300
      });
    }
    const containerX = screenWidth / 2;
    const _0x1aa656 = 320;
    this._settingsLayerOverlay = this.add.rectangle(containerX, _0x1aa656, screenWidth, screenHeight, 0, 0).setScrollFactor(0).setDepth(200).setInteractive();
    this._settingsLayerInternal = this.add.container(0, -640).setScrollFactor(0).setDepth(201);
    this._settingsScreenClosing = false;
    this.tweens.add({
      targets: this._settingsLayerOverlay,
      alpha: 180 / 255,
      duration: 400,
      ease: "Linear"
    });

    const _0x59b9ab = {
      p: 0
    };
    this.tweens.add({
      targets: _0x59b9ab,
      p: 1,
      duration: 500,
      ease: "Quad.Out",
      onUpdate: () => {
        this._settingsLayerInternal.y = _0x59b9ab.p * 650 - 640;
      },
      onComplete: () => {}
    });
    const _0x595215 = 712;
    const _0x950c8d = 460;
    const _0x2a115c = (screenWidth - _0x595215) / 2;
    this._settingsLayerInternal.add(this.add.rectangle(_0x2a115c + 356, 310, _0x595215, _0x950c8d, 0, 180 / 255));
    const _0x43f2e3 = this.textures.getFrame("GJ_WebSheet", "GJ_table_side_001.png");
    const _0x3feccc = _0x43f2e3 ? _0x950c8d / _0x43f2e3.height : 1;
    this._settingsLayerInternal.add(this.add.image(_0x2a115c - 40, 80, "GJ_WebSheet", "GJ_table_side_001.png").setOrigin(0, 0).setScale(1, _0x3feccc));
    this._settingsLayerInternal.add(this.add.image(_0x2a115c + _0x595215 + 40, 80, "GJ_WebSheet", "GJ_table_side_001.png").setOrigin(1, 0).setFlipX(true).setScale(1, _0x3feccc));
    const _0x33b564 = this.add.image(_0x2a115c + 356, 70, "GJ_WebSheet", "GJ_table_top_001.png");
    this._settingsLayerInternal.add(_0x33b564);
    this._settingsLayerInternal.add(this.add.image(_0x2a115c + 356, 560, "GJ_WebSheet", "GJ_table_bottom_001.png"));
    const _0x3e9c79 = _0x33b564.y - 35;
    this._settingsLayerInternal.add(this.add.image(containerX - 312, _0x3e9c79, "GJ_WebSheet", "chain_01_001.png").setOrigin(0.5, 1));
    this._settingsLayerInternal.add(this.add.image(containerX + 312, _0x3e9c79, "GJ_WebSheet", "chain_01_001.png").setOrigin(0.5, 1));
    this._settingsLayerInternal.add(this.add.bitmapText(containerX, 65, "bigFont", "Settings", 55).setOrigin(0.5, 0.5));
    const _sBtnBorder = this.textures.get("GJ_button01").source[0].width * 0.3;
    const _sBtnH = 62;
    const _sBtnW2 = 310;
    const _sBtnW3 = 200;
    const _sGap = 18;
    const _sColL = containerX - _sBtnW2 / 2 - _sGap / 2;
    const _sColR = containerX + _sBtnW2 / 2 + _sGap / 2;
    const _sCol3L = containerX - _sBtnW3 - _sGap;
    const _sCol3M = containerX;
    const _sCol3R = containerX + _sBtnW3 + _sGap;
    const _sRow1Y = 155;
    const _sRow2Y = 235;
    const _sRow3Y = 312;
    const _makeSettingsBtn = (cx, cy, label, btnW, isActive, action) => {
        const grp = this.add.container(cx, cy);
        const tint = isActive ? 0xffffff : 0x666666;
        const btn9 = this.add.nineslice(0, 0, "GJ_button01", null, btnW, _sBtnH, _sBtnBorder, _sBtnBorder, _sBtnBorder, _sBtnBorder).setOrigin(0.5).setTint(tint);
        grp.add(btn9);
        const fontSize = label === "How To Play" ? 41 : 50;
        const lbl = this.add.bitmapText(0, -5, "goldFont", label, fontSize).setOrigin(0.5, 0.5);
        if (!isActive) lbl.setTint(0x666666);
        grp.add(lbl);
        if (isActive && action) {
            const hitZone = this.add.zone(0, 0, btnW, _sBtnH).setInteractive();
            grp.add(hitZone);
            const baseScale = 1;
            const pressedScale = baseScale * 1.26;
            hitZone.on("pointerdown", () => {
                hitZone._pressed = true;
                this.tweens.killTweensOf(grp, "scale");
                this.tweens.add({ targets: grp, scale: pressedScale, duration: 300, ease: "Bounce.Out" });
            });
            hitZone.on("pointerout", () => {
                if (hitZone._pressed) {
                    hitZone._pressed = false;
                    this.tweens.killTweensOf(grp, "scale");
                    this.tweens.add({ targets: grp, scale: baseScale, duration: 400, ease: "Bounce.Out" });
                }
            });
            hitZone.on("pointerup", () => {
                if (hitZone._pressed) {
                    hitZone._pressed = false;
                    this.tweens.killTweensOf(grp, "scale");
                    grp.setScale(baseScale);
                    action();
                }
            });
        }
        this._settingsLayerInternal.add(grp);
        return grp;
    };

    _makeSettingsBtn(_sColL, _sRow1Y, "Account", _sBtnW2, false, null);
    _makeSettingsBtn(_sColR, _sRow1Y, "How To Play", _sBtnW2, true, () => { this._buildHowToPlayPopup(); });
    _makeSettingsBtn(_sColL, _sRow2Y, "Options", _sBtnW2, true, () => { this._buildSettingsPopup(); });
    _makeSettingsBtn(_sColR, _sRow2Y, "Graphics", _sBtnW2, false, null);
    _makeSettingsBtn(_sCol3L, _sRow3Y, "Rate", _sBtnW3, true, () => { this._redirectRate(); });
    _makeSettingsBtn(_sCol3M, _sRow3Y, "Songs", _sBtnW3, true, () => { this._hideSettingsScreen(() => this.time.delayedCall(150, () => this._buildsongspopup())); });
    _makeSettingsBtn(_sCol3R, _sRow3Y, "Help", _sBtnW3, true, () => { this._hideSettingsScreen(() => this.time.delayedCall(150, () => this._buildhelppopup())); });

    const lockIcon = this.add.image(containerX + 535, 30, "GJ_GameSheet03", "GJ_lock_open_001.png").setFlipX(false).setFlipY(false);
    lockIcon.setScale(0.9);
    lockIcon.setInteractive();
    this._expandHitArea(lockIcon, 1.5);
    this._makeBouncyButton(lockIcon, 0.9, () => { this._openVaultMenu(); });
    this._settingsLayerInternal.add(lockIcon);

    const _0x45b6e4 = 0.8;
    let _0xe44f6d = 250;
    const sliderStartY = 430;
    const _0x22b43a = 0.7;
    const _0x41925a = this.textures.getFrame("GJ_WebSheet", "slidergroove.png");
    const _0x372782 = _0x41925a ? _0x41925a.width : 420;

    const createSlider = (posY, labelText, initialVal, setter) => {
        this._settingsLayerInternal.add(this.add.bitmapText(containerX, posY - 37, "bigFont", labelText, 33).setOrigin(0.5, 0.5));
        const barMaxW = (_0x372782 - 8) * _0x22b43a * 1.3;
        const barStartX = containerX - barMaxW / 2 + 2.8;
        const fillW = initialVal * barMaxW;
        const fillBar = this.add.tileSprite(barStartX, posY, fillW > 0 ? fillW : 1, 18, "sliderBar").setOrigin(0, 0.5);
        this._settingsLayerInternal.add(fillBar);
        this._settingsLayerInternal.add(this.add.image(containerX, posY, "GJ_WebSheet", "slidergroove.png").setScale(_0x22b43a * 1.3));

        const thumb = this.add.image(barStartX + fillW, posY, "GJ_WebSheet", "sliderthumb.png").setScale(_0x22b43a * 1.3).setInteractive({ draggable: true });
        this._settingsLayerInternal.add(thumb);
        thumb.on("drag", (p, dragX) => {
            thumb.x = Math.max(barStartX, Math.min(barStartX + barMaxW, dragX));
            const pct = (thumb.x - barStartX) / barMaxW;
            fillBar.width = Math.max(1, pct * barMaxW);
            setter(pct < 0.03 ? 0 : pct);
        });
    };

    createSlider(sliderStartY - 15, "Music", this._audio.getUserMusicVolume(), v => this._audio.setUserMusicVolume(v));
    createSlider(sliderStartY + 60, "SFX", this._sfxVolume, v => {
        this._sfxVolume = v;
        localStorage.setItem("userSfxVol", v);
    });
    const checkboxY = sliderStartY - 10;
    const checkboxX = containerX + 280;
    this._settingsLayerInternal.add(this.add.bitmapText(checkboxX, checkboxY - 42, "bigFont", "Menu", 20).setOrigin(0.5, 0.5));
    this._settingsLayerInternal.add(this.add.bitmapText(checkboxX, checkboxY - 22, "bigFont", "Music", 20).setOrigin(0.5, 0.5));

    const getMenuMusicEnabled = () => {
        const saved = localStorage.getItem("menuMusicEnabled");
        return saved === null ? true : saved === "true";
    };
    const setMenuMusicEnabled = (value) => localStorage.setItem("menuMusicEnabled", value);

    const getTex = () => getMenuMusicEnabled() ? "GJ_checkOn_001.png" : "GJ_checkOff_001.png";
    const check = this.add.image(checkboxX, checkboxY + 15, "GJ_GameSheet03", getTex()).setScale(0.7).setInteractive();
    this._settingsLayerInternal.add(check);
    this._makeBouncyButton(check, 0.8, () => {
        const newState = !getMenuMusicEnabled();
        setMenuMusicEnabled(newState);
        check.setTexture("GJ_GameSheet03", getTex());
        if (newState) {
            if (!this._audio.isplaying()) {
                this._audio.startMenuMusic();
            }
        } else {
            if (this._audio.isplaying()) {
                this._audio.stopMusic();
            }
        }
    });
    const _0x45fc2b = [{
      frame: "GJ_arrow_03_001.png",
      dx: -535,
      action: () => this._hideSettingsScreen()
    }];
    for (const _0x2d4335 of _0x45fc2b) {
      const _0xdde774 = this.add.image(containerX + _0x2d4335.dx, 30, "GJ_GameSheet03", _0x2d4335.frame).setInteractive();
      this._settingsLayerInternal.add(_0xdde774);
      this._makeBouncyButton(_0xdde774, 1, _0x2d4335.action);
    }
  }
  _playSettingsStarAward() {
    if (!this._settingsLayerInternal) {
      return;
    }
    const _0x4edc03 = containerX;
    const _0x5a0e9 = 200;
    const _0x453043 = this.add.image(_0x4edc03, _0x5a0e9, "GJ_WebSheet", "GJ_bigStar_001.png").setScale(3).setAlpha(0);
    this._settingsLayerInternal.add(_0x453043);
    this.tweens.add({
      targets: _0x453043,
      scale: 0.8,
      alpha: 1,
      duration: 300,
      delay: 0,
      ease: "Bounce.Out"
    });
  }
  _hideSettingsScreen(closeCallback) {
    if (!this._settingsLayerInternal || this._settingsScreenClosing) {
      return;
    }
    this._settingsScreenClosing = true;
    const _0x272eb1 = () => {
      this._settingsScreenClosing = false;
      if (this._settingsLayerOverlay) {
        this._settingsLayerOverlay.destroy();
        this._settingsLayerOverlay = null;
      }
      if (this._settingsLayerInternal) {
        this._settingsLayerInternal.destroy();
        this._settingsLayerInternal = null;
      }

      if (this._pauseBtn) {
        this.tweens.add({
          targets: this._pauseBtn,
          alpha: 1,
          duration: 300
        });
      }

      if (typeof closeCallback === "function") {
        closeCallback();
      }
    };
    this.tweens.add({
      targets: this._settingsLayerOverlay,
      alpha: 0,
      duration: 250,
      ease: "Linear"
    });

    const _0x59b9ab = {
      p: 1
    };
    this.tweens.add({
      targets: _0x59b9ab,
      p: 0,
      duration: 450,
      ease: "Quad.In",
      onUpdate: () => {
        this._settingsLayerInternal.y = _0x59b9ab.p * 650 - 640;
      },
      onComplete: _0x272eb1
    });
  }
  _hideHelpPopup() {
    if (!this._helplayer || this._helpclose) {
      return;
    }
    this._helpclose = true;
    const _0x272eb1 = () => {
      this._helpclose = false;
      if (this._helpoverlay) {
        this._helpoverlay.destroy();
        this._helpoverlay = null;
      }
      if (this._helplayer) {
        this._helplayer.destroy();
        this._helplayer = null;
      }

      if (this._pauseBtn) {
        this.tweens.add({
          targets: this._pauseBtn,
          alpha: 1,
          duration: 300
        });
      }
    };
    this.tweens.add({
      targets: this._helpoverlay,
      alpha: 0,
      duration: 250,
      ease: "Linear"
    });

    const _0x59b9ab = {
      p: 1
    };
    this.tweens.add({
      targets: _0x59b9ab,
      p: 0,
      duration: 450,
      ease: "Quad.In",
      onUpdate: () => {
        this._helplayer.y = _0x59b9ab.p * 650 - 640;
      },
      onComplete: _0x272eb1
    });
  }
  _hideSongsPopup() {
    if (!this._songslayer || this._songpopupclose) {
      return;
    }
    this._songpopupclose = true;
    const _0x272eb1 = () => {
      this._songpopupclose = false;
      if (this._songScrollCleanup) {
        this._songScrollCleanup();
        this._songScrollCleanup = null;
      }
      if (this._songsoverlay) {
        this._songsoverlay.destroy();
        this._songsoverlay = null;
      }
      if (this._songslayer) {
        this._songslayer.destroy();
        this._songslayer = null;
      }

      if (this._pauseBtn) {
        this.tweens.add({
          targets: this._pauseBtn,
          alpha: 1,
          duration: 300
        });
      }
    };
    this.tweens.add({
      targets: this._songsoverlay,
      alpha: 0,
      duration: 250,
      ease: "Linear"
    });

    const _0x59b9ab = {
      p: 1
    };
    this.tweens.add({
      targets: _0x59b9ab,
      p: 0,
      duration: 450,
      ease: "Quad.In",
      onUpdate: () => {
        this._songslayer.y = _0x59b9ab.p * 650 - 640;
      },
      onComplete: _0x272eb1
    });
  }
  _showStatsScreen() {
    if (this._pauseBtn) {
      this.tweens.add({
        targets: this._pauseBtn,
        alpha: 0,
        duration: 300
      });
    }
    const containerX = screenWidth / 2;
    const _0x1aa656 = 320;
    this._statsLayerOverlay = this.add.rectangle(containerX, _0x1aa656, screenWidth, screenHeight, 0, 0).setScrollFactor(0).setDepth(200).setInteractive();
    this._statsLayerInternal = this.add.container(0, -640).setScrollFactor(0).setDepth(201);
    this.tweens.add({
      targets: this._statsLayerOverlay,
      alpha: 100 / 255,
      duration: 1000
    });
    const _0x59b9ab = {
      p: 0
    };
    this.tweens.add({
      targets: _0x59b9ab,
      p: 1,
      duration: 500,
      ease: "Quad.Out",
      onUpdate: () => {
        this._statsLayerInternal.y = _0x59b9ab.p * 650 - 640;
        if (this._statsMaskShape) this._statsMaskShape.y = this._statsLayerInternal.y;
      }
    });
    const _0x595215 = 712;
    const _0x950c8d = 460;
    const _0x2a115c = (screenWidth - _0x595215) / 2;
    this._statsLayerInternal.add(this.add.rectangle(_0x2a115c + 356, 310, _0x595215, _0x950c8d, 0xac531e));
    const _0x43f2e3 = this.textures.getFrame("GJ_WebSheet", "GJ_table_side_001.png");
    const _0x3feccc = _0x43f2e3 ? _0x950c8d / _0x43f2e3.height : 1;
    this._statsLayerInternal.add(this.add.image(_0x2a115c - 40, 80, "GJ_WebSheet", "GJ_table_side_001.png").setOrigin(0, 0).setScale(1, _0x3feccc));
    this._statsLayerInternal.add(this.add.image(_0x2a115c + _0x595215 + 40, 80, "GJ_WebSheet", "GJ_table_side_001.png").setOrigin(1, 0).setFlipX(true).setScale(1, _0x3feccc));
    const _0x33b564 = this.add.image(_0x2a115c + 356, 70, "GJ_WebSheet", "GJ_table_top_001.png");
    this._statsLayerInternal.add(_0x33b564);
    this._statsLayerInternal.add(this.add.image(_0x2a115c + 356, 560, "GJ_WebSheet", "GJ_table_bottom_001.png"));
    const _0x3e9c79 = _0x33b564.y - 35;
    this._statsLayerInternal.add(this.add.image(containerX - 312, _0x3e9c79, "GJ_WebSheet", "chain_01_001.png").setOrigin(0.5, 1));
    this._statsLayerInternal.add(this.add.image(containerX + 312, _0x3e9c79, "GJ_WebSheet", "chain_01_001.png").setOrigin(0.5, 1));
    this._statsLayerInternal.add(this.add.bitmapText(containerX, 65, "bigFont", "Stats", 55).setOrigin(0.5, 0.5));
    const _rowPanelTop = 102;
    const _rowPanelBottom = 528;
    const _rowLeft = _0x2a115c + 7.8;
    const _rowRight = _0x2a115c + _0x595215 - 7.8;
    const _rowWidth = _rowRight - _rowLeft;
    const rowH = 80;
    const rows = [
      { label: "Total Jumps:", value: String(this._totalJumps || 0) },
      { label: "Total Attempts:", value: String(this._attempts || 1) },
      { label: "Completed Levels:", value: String(window._completedLevels || 0) },
      { label: "Total Deaths:", value: String(this._totalDeaths || 0) },
      { label: "Total Secret Coins:", value: String(window._totalsecretcoins || 0) },
      { label: "Total User Coins:", value: String(window._totalusercoins || 0) },
      { label: "???:", value: String(window._totalOrbs || "?") }
    ];

    const maskShape = this.add.graphics().setScrollFactor(0).setVisible(false);
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(_rowLeft, _rowPanelTop, _rowWidth, _rowPanelBottom - _rowPanelTop);
    maskShape.y = this._statsLayerInternal.y;
    const rowMask = maskShape.createGeometryMask();
    this._statsMaskShape = maskShape;

    let scrollOffsetY = 0;
    let activeRowObjs = [];
    const maxScroll = Math.max(0, rows.length * rowH - (_rowPanelBottom - _rowPanelTop));

    const buildRow = (row, index) => {
      const rowObjs = [];
      const rowCenterY = _rowPanelTop + index * rowH + rowH / 2 - scrollOffsetY;
      if (rowCenterY + rowH / 2 < _rowPanelTop || rowCenterY - rowH / 2 > _rowPanelBottom) {
        return rowObjs;
      }
      const bgColor = index % 2 === 0 ? 0xac531e : 0xcf6d30;
      rowObjs.push(this.add.rectangle(containerX, rowCenterY, _rowWidth, rowH, bgColor).setOrigin(0.5, 0.5));
      if (index > 0) {
        rowObjs.push(this.add.rectangle(containerX, rowCenterY - rowH / 2, _rowWidth, 0.5, 0x000000).setOrigin(0.5, 0.5));
      }
      rowObjs.push(this.add.bitmapText(_rowLeft + 20, rowCenterY, "goldFont", row.label, 34).setOrigin(0, 0.5));
      rowObjs.push(this.add.bitmapText(_rowRight - 20, rowCenterY, "goldFont", row.value, 34).setOrigin(1, 0.5));
      rowObjs.forEach(obj => {
        obj.setMask(rowMask);
        this._statsLayerInternal.add(obj);
      });
      return rowObjs;
    };

    const rebuildRows = () => {
      for (const obj of activeRowObjs) if (obj && obj.destroy) obj.destroy();
      activeRowObjs = [];
      rows.forEach((row, index) => {
        activeRowObjs.push(...buildRow(row, index));
      });
    };
    rebuildRows();

    const inPanel = (pointer) => {
      if (!this._statsLayerInternal) return false;
      const offsetY = this._statsLayerInternal.y;
      return pointer.x >= _rowLeft && pointer.x <= _rowRight && pointer.y >= _rowPanelTop + offsetY && pointer.y <= _rowPanelBottom + offsetY;
    };
    const setScroll = (offset) => {
      const next = Phaser.Math.Clamp(offset, 0, maxScroll);
      if (next === scrollOffsetY) return;
      scrollOffsetY = next;
      rebuildRows();
    };

    const onWheel = (pointer, gameObjects, deltaX, deltaY) => {
      if (!inPanel(pointer)) return;
      setScroll(scrollOffsetY + deltaY * 0.5);
    };

    let isDragging = false, dragStartY = 0, dragStartOffset = 0;
    const onDragStart = (pointer) => {
      if (!inPanel(pointer)) return;
      isDragging = true;
      dragStartY = pointer.y;
      dragStartOffset = scrollOffsetY;
    };
    const onDragMove = (pointer) => {
      if (!isDragging || !pointer.isDown) return;
      setScroll(dragStartOffset + (dragStartY - pointer.y) * 0.5);
    };
    const onDragEnd = () => { isDragging = false; };

    this.input.on("wheel", onWheel);
    this.input.on("pointerdown", onDragStart);
    this.input.on("pointermove", onDragMove);
    this.input.on("pointerup", onDragEnd);

    this._statsCleanup = () => {
      this.input.off("wheel", onWheel);
      this.input.off("pointerdown", onDragStart);
      this.input.off("pointermove", onDragMove);
      this.input.off("pointerup", onDragEnd);
      maskShape.destroy();
      this._statsMaskShape = null;
    };
    const _0x45fc2b = [{
      frame: "GJ_arrow_03_001.png",
      dx: -535,
      action: () => this._hideStatsScreen()
    }];
    for (const _0x2d4335 of _0x45fc2b) {
      const _0xdde774 = this.add.image(containerX + _0x2d4335.dx, 30, "GJ_GameSheet03", _0x2d4335.frame).setInteractive();
      this._statsLayerInternal.add(_0xdde774);
      this._makeBouncyButton(_0xdde774, 1, _0x2d4335.action);
    }
  }
  _hideStatsScreen() {
    if (!this._statsLayerInternal) {
      return;
    }
    const _0x272eb1 = () => {
      if (this._statsLayerOverlay) {
        this._statsLayerOverlay.destroy();
        this._statsLayerOverlay = null;
      }
      if (this._statsLayerInternal) {
        this._statsLayerInternal.destroy();
        this._statsLayerInternal = null;
      }
      if (this._statsCleanup) {
        this._statsCleanup();
        this._statsCleanup = null;
      }
      if (this._pauseBtn) {
        this.tweens.add({
          targets: this._pauseBtn,
          alpha: 1,
          duration: 300
        });
      }
    };
    this.tweens.add({
      targets: this._statsLayerOverlay,
      alpha: 0,
      duration: 500,
      ease: "Linear"
    });
    const _0x59b9ab = {
      p: 1
    };
    this.tweens.add({
      targets: _0x59b9ab,
      p: 0,
      duration: 500,
      ease: "Quad.In",
      onUpdate: () => {
        this._statsLayerInternal.y = _0x59b9ab.p * 650 - 640;
        if (this._statsMaskShape) this._statsMaskShape.y = this._statsLayerInternal.y;
      },
      onComplete: _0x272eb1
    });
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
    this.time.delayedCall(125, () => {
      this._audio.playEffect("gold02");
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
  _playsecretcoinanimation() {
    if (!this._endLayerInternal || !this._endsecretcoinPositions || this._practicedMode.practiceMode) return;
    this._endcoinAwardTimer = [];
    const collectedSlot = new Set();
    if (this._level?._editorEndSecretCoinSlots) {
      for (const slot of this._level._editorEndSecretCoinSlots) collectedSlot.add(slot);
    }
    for (const sprite of this._level?._coinSprites || []) {
      if (!sprite || sprite._secretCoinSlot === undefined) continue;
      if (this._level._secretCoinRunCollected?.has(String(sprite._secretCoinId))) {
        collectedSlot.add(sprite._secretCoinSlot);
      }
    }

    [...collectedSlot].sort((a, b) => a - b).forEach((slot, index) => {
      const position = this._endsecretcoinPositions[slot];
      if (!position) return;
      const cointimer = this.time.delayedCall(index * 375, () => {
        if (!this._endLayerInternal || !this._endLayerInternal.active) return;
        const coin = this.add.image(position.x, position.y, "GJ_GameSheet03", "secretCoinUI_001.png")
          .setOrigin(0.5)
          .setScale(3)
          .setAlpha(0);
        this._endLayerInternal.add(coin);
        this._audio.playEffect("highscoreGet02");
        this.tweens.add({
          targets: coin,
          scale: 1.1,
          alpha: 1,
          duration: 300,
          ease: "Bounce.Out"
        });
        const effecttimer = this.time.delayedCall(100, () => {
          if (!this._endLayerInternal || !this._endLayerInternal.active) return;
          const effectY = position.y + this._endLayerInternal.y;
          this.add.particles(position.x, effectY, "GJ_WebSheet", {
            frame: "square.png",
            speed: { min: 200, max: 600 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.35, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: { min: 200, max: 600 },
            quantity: 30,
            stopAfter: 30,
            blendMode: S,
            tint: 0xd0d0d0
          }).setScrollFactor(0).setDepth(202);

          const glow = this.add.graphics().setScrollFactor(0).setDepth(202).setBlendMode(S);
          const glowState = { progress: 0 };
          this.tweens.add({
            targets: glowState,
            progress: 1,
            duration: 400,
            ease: "Quad.Out",
            onUpdate: () => {
              glow.clear();
              glow.fillStyle(0xd0d0d0, 1 - glowState.progress);
              glow.fillCircle(position.x, effectY, 12 + glowState.progress * 130);
            },
            onComplete: () => glow.destroy()
          });
        });
        this._endcoinAwardTimer.push(effecttimer);
      });
      this._endcoinAwardTimer.push(cointimer);
    });
  }
  _playusercoinanimation() {
    if (!this._endLayerInternal || !this._endusercoinPosition) return;
    this._endcoinAwardTimer = [];
    const collectedSlot = new Set();
    if (this._level?._editorEndUserCoinSlots) {
      for (const slot of this._level._editorEndUserCoinSlots) collectedSlot.add(slot);
    }
    for (const sprite of this._level?._coinSprites || []) {
      if (sprite?._userCoinSlot === undefined) continue;
      if (this._level._userCoinRunCollected?.has(String(sprite._userCoinId))) {
        collectedSlot.add(sprite._userCoinSlot);
      }
    }

    [...collectedSlot].sort((a, b) => a - b).forEach((slot, index) => {
      const position = this._endusercoinPosition[slot];
      if (!position) return;
      const cointimer = this.time.delayedCall(index * 375, () => {
        if (!this._endLayerInternal || !this._endLayerInternal.active) return;
        const coin = this.add.image(position.x, position.y, "GJ_GameSheet03", "secretCoinUI2_001.png")
          .setOrigin(0.5).setScale(3).setAlpha(0);
        this._endLayerInternal.add(coin);
        this._audio.playEffect("highscoreGet02");
        this.tweens.add({ targets: coin, scale: 1.1, alpha: 1, duration: 300, ease: "Bounce.Out" });
        const effecttimer = this.time.delayedCall(100, () => {
          if (!this._endLayerInternal || !this._endLayerInternal.active) return;
          const effectY = position.y + this._endLayerInternal.y;
          this.add.particles(position.x, effectY, "GJ_WebSheet", {
            frame: "square.png",
            speed: { min: 200, max: 600 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.35, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: { min: 200, max: 600 },
            quantity: 30,
            stopAfter: 30,
            blendMode: S,
            tint: 0xd0d0d0
          }).setScrollFactor(0).setDepth(202);
          const glow = this.add.graphics().setScrollFactor(0).setDepth(202).setBlendMode(S);
          const glowState = { progress: 0 };
          this.tweens.add({
            targets: glowState,
            progress: 1,
            duration: 400,
            ease: "Quad.Out",
            onUpdate: () => {
              glow.clear();
              glow.fillStyle(0xd0d0d0, 1 - glowState.progress);
              glow.fillCircle(position.x, effectY, 12 + glowState.progress * 130);
            },
            onComplete: () => glow.destroy()
          });
          this._endcoinAwardTimer.push(effecttimer);
        });
        this._endcoinAwardTimer.push(cointimer);
      });
    });
  }
  _openListScene(title, rowHeight, onBack) {
    const sw = screenWidth;
    const sh = screenHeight;
    const objects = [];
    const fadeIn = this.add.graphics().setScrollFactor(0).setDepth(300);
    fadeIn.fillStyle(0x000000, 1);
    fadeIn.fillRect(0, 0, sw, sh);
    this.tweens.add({ targets: fadeIn, alpha: 0, duration: 280, ease: "Linear",
      onComplete: () => fadeIn.destroy() });

    const bgGfx = this.add.graphics().setScrollFactor(0).setDepth(200);
    const steps = 80;
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const r = 0;
      const g = Math.round(0x66 * (1 - t) + 0x33 * t);
      const b = Math.round(0xff * (1 - t) + 0x99 * t);
      bgGfx.fillStyle((r << 16) | (g << 8) | b, 1);
      bgGfx.fillRect(0, Math.floor(i * sh / steps), sw, Math.ceil(sh / steps) + 1);
    }
    objects.push(bgGfx);
    const blocker = this.add.zone(sw / 2, sh / 2, sw, sh)
      .setScrollFactor(0).setDepth(200).setInteractive();
    objects.push(blocker);
    const cBL = this.add.image(0, sh, "GJ_GameSheet03", "GJ_sideArt_001.png")
      .setScrollFactor(0).setDepth(201).setOrigin(0, 1).setFlipY(false);
    const cBR = this.add.image(sw, sh, "GJ_GameSheet03", "GJ_sideArt_001.png")
      .setScrollFactor(0).setDepth(201).setOrigin(1, 1).setFlipX(true);
    objects.push(cBL, cBR);
    const panelW = 712;
    const panelH = 460;
    const panelCX = sw / 2;
    const panelCY = sh / 2;
    const panelBg = this.add.rectangle(panelCX, panelCY + 10, panelW, panelH, 0xC2723E)
      .setScrollFactor(0).setDepth(201).setOrigin(0.5);
    objects.push(panelBg);
    const listLeft = panelCX - panelW / 2;
    const listTop = panelCY - panelH / 2 + 10;
    const stripesGfx = this.add.graphics().setScrollFactor(0).setDepth(202);
    objects.push(stripesGfx);
    let _rowCount = 0;
    const _redrawStripes = (offsetY = 0) => {
      stripesGfx.clear();
      for (let ri = 0; ri < _rowCount; ri++) {
        const ry = (listTop + 12) + ri * rowHeight - offsetY;
        const ryBottom = ry + rowHeight;
        if (ryBottom <= (listTop + 12) || ry >= listTop + panelH) continue;
        const clampedY = Math.max(ry, listTop + 12);
        const clampedH = Math.min(ryBottom, listTop + panelH) - clampedY;
        stripesGfx.fillStyle(ri % 2 === 0 ? 0xB5652E : 0xC2723E, 1);
        stripesGfx.fillRect(listLeft, clampedY, panelW, clampedH);
      }
      if (_rowCount > 0) {
        const topDividerY = (listTop + 12) - offsetY;
        if (topDividerY >= listTop + 12 && topDividerY < listTop + panelH) {
          stripesGfx.fillStyle(0x000000, 0.6);
          stripesGfx.fillRect(listLeft + 5, topDividerY, panelW - 10, 1.5);
        }
        const lastRowY = (listTop + 12) + (_rowCount - 1) * rowHeight - offsetY;
        const bottomDividerY = lastRowY + rowHeight;
        if (bottomDividerY > listTop + 12 && bottomDividerY <= listTop + panelH) {
          stripesGfx.fillStyle(0x000000, 0.6);
          stripesGfx.fillRect(listLeft + 5, bottomDividerY, panelW - 10, 1.5);
        }
      }
    };

    const addRow = () => { _rowCount++; _redrawStripes(); };
    const clearRows = () => { _rowCount = 0; _redrawStripes(); };
    const sideFrame = this.textures.getFrame("GJ_WebSheet", "GJ_table_side_001.png");
    const sideScaleY = sideFrame ? panelH / sideFrame.height : 1;
    const leftBorder = this.add.image(listLeft - 40, 90,
      "GJ_WebSheet", "GJ_table_side_001.png")
      .setScrollFactor(0).setDepth(203).setOrigin(0, 0).setScale(1, sideScaleY);
    objects.push(leftBorder);
    const rightBorder = this.add.image(listLeft + panelW + 40, 90,
      "GJ_WebSheet", "GJ_table_side_001.png")
      .setScrollFactor(0).setDepth(203).setOrigin(1, 0).setFlipX(true).setScale(1, sideScaleY);
    objects.push(rightBorder);
    const topBorder = this.add.image(panelCX, 80,
      "GJ_WebSheet", "GJ_table_top_001.png")
      .setScrollFactor(0).setDepth(203).setOrigin(0.5);
    objects.push(topBorder);
    const bottomBorder = this.add.image(panelCX, 570,
      "GJ_WebSheet", "GJ_table_bottom_001.png")
      .setScrollFactor(0).setDepth(203).setOrigin(0.5);
    objects.push(bottomBorder);

    if (title) {
      const titleTxt = this.add.bitmapText(panelCX, panelCY - 245, "bigFont", title, 52)
        .setScrollFactor(0).setDepth(204).setOrigin(0.5, 0.5);
      objects.push(titleTxt);
    }
    const pageLbl = this.add.bitmapText(sw - 8, 3, "goldFont", "", 22)
      .setScrollFactor(0).setDepth(204).setOrigin(1, 0).setVisible(false);
    objects.push(pageLbl);
    const backBtn = this.add.image(45, 45, "GJ_GameSheet03", "GJ_arrow_01_001.png")
      .setScrollFactor(0).setDepth(204).setOrigin(0.5).setInteractive();
    objects.push(backBtn);
    const closeOverlay = (returnToParent = true, onComplete = null) => {
      const fadeOut = this.add.graphics().setScrollFactor(0).setDepth(400).setAlpha(0);
      fadeOut.fillStyle(0x000000, 1);
      fadeOut.fillRect(0, 0, sw, sh);
      this.tweens.add({ targets: fadeOut, alpha: 1, duration: 160, ease: "Linear",
        onComplete: () => {
          for (const o of objects) if (o && o.destroy) o.destroy();
          if (returnToParent && onBack) onBack();
          if (onComplete) onComplete();
          this.tweens.add({ targets: fadeOut, alpha: 0, duration: 160, ease: "Linear",
            onComplete: () => fadeOut.destroy() });
        }
      });
    };
    this._makeBouncyButton(backBtn, 1, () => closeOverlay());
    const prevBtn = this.add.image(40, sh / 2, "GJ_GameSheet03", "GJ_arrow_03_001.png")
      .setScrollFactor(0).setDepth(204).setOrigin(0.5).setInteractive().setVisible(false);
    objects.push(prevBtn);
    this._makeBouncyButton(prevBtn, 1, () => {});
    const nextBtn = this.add.image(sw - 40, sh / 2, "GJ_GameSheet03", "GJ_arrow_03_001.png")
      .setScrollFactor(0).setDepth(204).setOrigin(0.5).setInteractive().setFlipX(true).setVisible(false);
    objects.push(nextBtn);
    this._makeBouncyButton(nextBtn, 1, () => {});

    return { overlay: bgGfx, objects, listLeft, listTop, panelW, panelH,
             panelCX, panelCY, addRow, clearRows, prevBtn, nextBtn,
             pageLbl, closeOverlay, redrawStripes: _redrawStripes };
  }
  _fitBitmapText(textObj, maxWidth, minScale = 0.3) {
    textObj.setScale(1);
    if (textObj.width > maxWidth) {
      textObj.setScale(Math.max(minScale, maxWidth / textObj.width));
    }
    return textObj;
  }
  _formatStatCount(n) {
    n = Number(n) || 0;
    if (n < 1000) return String(n);
    if (n < 1000000) {
      const v = n / 1000;
      return (v >= 100 ? Math.round(v) : parseFloat(v.toFixed(1))) + "K";
    }
    const v = n / 1000000;
    return (v >= 100 ? Math.round(v) : parseFloat(v.toFixed(1))) + "M";
  }
  _getLevelLengthLabel(lengthIdx) {
    const _lengthValues = ["Tiny", "Short", "Medium", "Long", "XL"];
    if (lengthIdx === 5) {
      return "Plat.";
    }
    return _lengthValues[lengthIdx] || "Tiny";
  }
  _openOnlineLevelsScene(params = {}) {
    if (this._onlineLevelsOverlay) return;

    const sw = screenWidth;
    const sh = screenHeight;
    const isFeatured = (params.type === 6);
    const shell = this._openListScene(
      isFeatured ? "" : "Online Levels",
      180,
      () => {
        this._onlineLevelsOverlay = null;
        if (isFeatured) {
          this._openCreatorMenu();
        } else {
          this._openSearchMenu();
        }
      }
    );
    const { objects, listLeft, listTop, panelW, panelH,
            panelCX, panelCY, addRow, clearRows,
            prevBtn, nextBtn, pageLbl, closeOverlay, redrawStripes } = shell;

    this._onlineLevelsOverlay = shell.overlay;
    this._closeOnlineLevelsOverlay = closeOverlay;
    if (isFeatured) {
      const header = this.add.image(sw / 2, sh / 2 - 265,
        "GJ_GameSheet03", "featuredLabel_001.png")
        .setScrollFactor(0).setDepth(204).setOrigin(0.5);
      objects.push(header);
    }
    {
      const pageBtnGroup = this.add.container(sw - 35, sh / 2 - 240);
      const pageBtn = this.add.image(0, 0, "GJ_button02").setScale(0.7);
      const pageNum = this.add.bitmapText(-2, 0, "bigFont", "1", 35).setOrigin(0.5);
      pageBtnGroup.add(pageBtn);
      pageBtnGroup.add(pageNum);
      const _pageBtnFrame = this.textures.getFrame("GJ_button02");
      const _pageBtnW = (_pageBtnFrame ? _pageBtnFrame.realWidth : 100) * 0.7;
      const _pageBtnH = (_pageBtnFrame ? _pageBtnFrame.realHeight : 100) * 0.7;
      pageBtnGroup.setScrollFactor(0).setDepth(205).setInteractive(
        new Phaser.Geom.Rectangle(-_pageBtnW / 2, -_pageBtnH / 2, _pageBtnW, _pageBtnH),
        Phaser.Geom.Rectangle.Contains
      );
      objects.push(pageBtnGroup);
      this._makeBouncyButton(pageBtnGroup, 1, () => {
        if (!_loading) {
          const pageCount = isFeatured ? 10 : _knownMaxPages;
          const nextPage = (currentPage + 1) % Math.max(1, pageCount);
          _setPage(nextPage);
        }
      }, () => true);
      const updatePageNum = (page) => {
        pageNum.setText(String(page + 1));
      };
      this._featuredPageUpdate = updatePageNum;
    }
    const spinSprite = this.add.image(sw / 2, sh / 2, "loadingCircle")
      .setScrollFactor(0).setDepth(205).setOrigin(0.5).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.5);
    objects.push(spinSprite);
    const spinTimer = this.time.addEvent({
      delay: 16,
      loop: true,
      callback: () => {
        if (!spinSprite.scene) { spinTimer.remove(); return; }
        spinSprite.rotation += 0.1;
      }
    });
    objects.push({ destroy: () => spinTimer.remove() });
    const infoBtn = this.add.image(60, sh - 60,
      "GJ_GameSheet03", "GJ_infoIcon_001.png")
      .setScrollFactor(0).setDepth(204).setOrigin(0.5).setInteractive();
    objects.push(infoBtn);
    this._makeBouncyButton(infoBtn, 1, () => { this._buildFeaturedInfoPopup(); });

    const refreshBtn = this.add.image(sw - 55, sh - 55,
      "GJ_GameSheet03", "GJ_updateBtn_001.png")
      .setScrollFactor(0).setDepth(204).setOrigin(0.5).setInteractive();
    objects.push(refreshBtn);
    let currentPage = 0;
    let _knownMaxPages = 1;
    const cache = {};
    const _processedCache = {};
    let activeCellObjs = [];
    let _loading = false;
    let scrollOffsetY = 0;
    // wip
    let _lastLevelStrs = null;
    let _lastLevelData = [];
    const _panelBoundaryTop = listTop + 12;
    const _panelBoundaryBottom = listTop + panelH - 22;
    const _panelMaskShape = this.add.graphics().setScrollFactor(0);
    _panelMaskShape.fillStyle(0xffffff);
    _panelMaskShape.fillRect(listLeft, _panelBoundaryTop, panelW, _panelBoundaryBottom - _panelBoundaryTop);
    const _panelMask = _panelMaskShape.createGeometryMask();
    objects.push(_panelMaskShape);

    const _diffFrames = [
      "difficulty_00_btn_001.png",
      "difficulty_01_btn_001.png",
      "difficulty_02_btn_001.png",
      "difficulty_03_btn_001.png",
      "difficulty_04_btn_001.png",
      "difficulty_05_btn_001.png",
      "difficulty_06_btn_001.png",
      "difficulty_07_btn_001.png",
      "difficulty_08_btn_001.png",
      "difficulty_09_btn_001.png",
      "difficulty_10_btn_001.png",
      "difficulty_auto_btn_001.png"
    ];
    const _diffSizes = {
      "difficulty_00_btn_001.png": { w: 60, h: 85, rotated: false },
      "difficulty_01_btn_001.png": { w: 60, h: 85, rotated: false },
      "difficulty_02_btn_001.png": { w: 86, h: 85, rotated: false },
      "difficulty_03_btn_001.png": { w: 60, h: 84, rotated: false },
      "difficulty_04_btn_001.png": { w: 85, h: 84, rotated: false },
      "difficulty_05_btn_001.png": { w: 76, h: 85, rotated: false },
      "difficulty_06_btn_001.png": { w: 72, h: 88, rotated: false },
      "difficulty_07_btn_001.png": { w: 72, h: 85, rotated: false },
      "difficulty_08_btn_001.png": { w: 72, h: 85, rotated: false },
      "difficulty_09_btn_001.png": { w: 74, h: 88, rotated: false },
      "difficulty_10_btn_001.png": { w: 80, h: 91, rotated: false },
      "difficulty_auto_btn_001.png": { w: 60, h: 85, rotated: false },
    };
    const _officialGDSongs = [
      "Stereo Madness","Back On Track","Polargeist","Dry Out","Base After Base",
      "Can't Let Go","Jumper","Time Machine","Cycles","xStep","Clutterfunk",
      "Theory of Everything","Electroman Adventures","Clubstep","Electrodynamix",
      "Hexagon Force","Blast Processing","Theory of Everything 2",
      "Geometrical Dominator","Deadlocked","Fingerdash","Dash"
    ];

    const _buildLevelCell = (levelData, rowIdx) => {
      const rowH = 180;
      const rowY = _panelBoundaryTop + rowIdx * rowH - scrollOffsetY;
      const rowCenterY = rowY + rowH / 2;
      const cellObjs = [];
      const rx = listLeft;
      const boundaryTop = _panelBoundaryTop;
      const boundaryBottom = _panelBoundaryBottom;
      if (rowIdx > 0 && rowY >= boundaryTop && rowY <= boundaryBottom) {
        const div = this.add.rectangle(rx + panelW / 2, rowY, panelW - 10, 1.5, 0x000000, 0.6)
          .setScrollFactor(0).setDepth(203).setOrigin(0.5, 0.5);
        div.setMask(_panelMask);
        cellObjs.push(div);
      }
      const diffIdx = Math.min(_diffFrames.length - 1, Math.max(0, levelData.difficulty || 0));
      const _diffMeta = _diffSizes[_diffFrames[diffIdx]];
      const _targetH = 85;
      const _maxW = 90;
      const _scaleW = _diffMeta ? _diffMeta.w : 90;
      const _scaleH = _diffMeta ? _diffMeta.h : 85;
      const _scale = Math.min(_targetH / _scaleH, _maxW / _scaleW);
      const _diffIconExtraScale = { 6: 1.04, 9: 1.04, 10: 1.1 }[diffIdx] || 1;
      const diffIcon = this.add.image(rx + 52, rowCenterY, "GJ_GameSheet03", _diffFrames[diffIdx])
        .setScrollFactor(0).setDepth(204).setOrigin(0.5).setAlpha(1)
        .setDisplaySize(_scaleW * _scale * _diffIconExtraScale, _scaleH * _scale * _diffIconExtraScale);
      if (_diffMeta && _diffMeta.rotated) diffIcon.setAngle(90).setFlipY(true);
      diffIcon.setMask(_panelMask);
      cellObjs.push(diffIcon);
      let coinIcon = null;
      if (levelData.epic >= 3) {
        coinIcon = this.add.image(rx + 52, rowCenterY, "GJ_GameSheet03", "GJ_epicCoin3_001.png")
          .setScrollFactor(0).setDepth(203).setOrigin(0.5);
      } else if (levelData.epic === 2) {
        coinIcon = this.add.image(rx + 52, rowCenterY, "GJ_GameSheet03", "GJ_epicCoin2_001.png")
          .setScrollFactor(0).setDepth(203).setOrigin(0.5);
      } else if (levelData.epic === 1) {
        coinIcon = this.add.image(rx + 52, rowCenterY, "GJ_GameSheet03", "GJ_epicCoin_001.png")
          .setScrollFactor(0).setDepth(203).setOrigin(0.5);
      } else if (levelData.featured) {
        coinIcon = this.add.image(rx + 52, rowCenterY, "GJ_GameSheet03", "GJ_featuredCoin_001.png")
          .setScrollFactor(0).setDepth(203).setOrigin(0.5);
      }
      if (coinIcon) {
        coinIcon.setMask(_panelMask);
        cellObjs.push(coinIcon);
      }
      const nameX = rx + 105;
      const btnX = rx + panelW - 88;
      const _progressKeyId = "online_" + (levelData.id || "0");
      const _bestPercent = parseFloat(localStorage.getItem("bestPercent_" + _progressKeyId) || "0");
      const _hasBest = _bestPercent > 0;
      const _isComplete = _bestPercent >= 100;
      const _bestReserve = _isComplete ? 44 : (_hasBest ? 70 : 0);
      const _maxTextWidth = (btnX - 70 - 15) - nameX - _bestReserve;
      const nameText = this.add.bitmapText(nameX, rowCenterY - 60, "bigFont", levelData.name || "Unknown", 45)
        .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5);
      this._fitBitmapText(nameText, _maxTextWidth);
      nameText.setMask(_panelMask);
      cellObjs.push(nameText);
      if (_isComplete) {
        const completeIcon = this.add.image(nameX + 5 + nameText.displayWidth + 14, rowCenterY - 60, "GJ_GameSheet03", "GJ_completesIcon_001.png")
          .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5).setScale(0.75);
        completeIcon.setMask(_panelMask);
        cellObjs.push(completeIcon);
      } else if (_hasBest) {
        const bestPctText = this.add.bitmapText(nameX + 5 + nameText.displayWidth + 14, rowCenterY - 60, "goldFont", Math.floor(_bestPercent) + "%", 28)
          .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5)
        bestPctText.setMask(_panelMask);
        cellObjs.push(bestPctText);
      }
      const authorText = this.add.bitmapText(nameX, rowCenterY - 15, "goldFont", "By " + (levelData.author || "Unknown"), 32)
        .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5);
      this._fitBitmapText(authorText, _maxTextWidth);
      authorText.setMask(_panelMask);
      cellObjs.push(authorText);
      const _isOfficialSong = _officialGDSongs.includes(levelData.songName);
      const songText = this.add.bitmapText(nameX, rowCenterY + 28, "bigFont", levelData.songName || "", 28)
        .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5).setTint(_isOfficialSong ? 0x00d6ff : 0xff79ff);
      this._fitBitmapText(songText, _maxTextWidth);
      songText.setMask(_panelMask);
      cellObjs.push(songText);
      const _statY = rowCenterY + 63;
      const _statGap = 25;
      const _statDefs = [
        { icon: "GJ_timeIcon_001.png", value: this._getLevelLengthLabel(levelData.length), scale: 0.6 },
        { icon: "GJ_downloadsIcon_001.png", value: this._formatStatCount(levelData.downloads), scale: 0.6 },
        { icon: "GJ_sLikeIcon_001.png", value: this._formatStatCount(levelData.likes), scale: 0.9 }
      ];
      let _statX = nameX;
      _statDefs.forEach((stat) => {
        const statIcon = this.add.image(_statX, _statY, "GJ_GameSheet03", stat.icon)
          .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5).setScale(stat.scale);
        statIcon.setMask(_panelMask);
        cellObjs.push(statIcon);
        const statText = this.add.bitmapText(_statX + statIcon.displayWidth + 8, _statY, "bigFont", stat.value, 26)
          .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5);
        this._fitBitmapText(statText, _maxTextWidth / 2);
        statText.setMask(_panelMask);
        cellObjs.push(statText);
        _statX += statIcon.displayWidth + 8 + statText.displayWidth + _statGap;
      });
      const _hasViewedLevel = !!localStorage.getItem("viewedLevel_" + (levelData.id || "0"));
      const _rowBtnFrame = _hasViewedLevel ? "GJ_button01" : "GJ_button02";
      const _rowBtnLabel = _hasViewedLevel ? "View" : "Get It";
      const _rowBtnLabelSize = _hasViewedLevel ? 40 : 30;
      const btn9 = this.add.nineslice(btnX, rowCenterY, _rowBtnFrame, null, 140, 60, 20, 20, 20, 20)
        .setScrollFactor(0).setDepth(206).setOrigin(0.5).setInteractive();
      btn9.setMask(_panelMask);
      const btnLbl = this.add.bitmapText(btnX - 2, rowCenterY - 4, "bigFont", _rowBtnLabel, _rowBtnLabelSize)
        .setScrollFactor(0).setDepth(207).setOrigin(0.5);
      btnLbl.setMask(_panelMask);
      cellObjs.push(btn9, btnLbl);

      const _btnTargets = [btn9, btnLbl];
      const _baseScale = 1, _pressScale = 1.26;
      btn9.on("pointerdown", () => {
        btn9._pressed = true;
        this.tweens.killTweensOf(_btnTargets, "scale");
        this.tweens.add({ targets: _btnTargets, scale: _pressScale, duration: 300, ease: "Bounce.Out" });
      });
      btn9.on("pointerout", () => {
        if (btn9._pressed) {
          btn9._pressed = false;
          this.tweens.killTweensOf(_btnTargets, "scale");
          this.tweens.add({ targets: _btnTargets, scale: _baseScale, duration: 400, ease: "Bounce.Out" });
        }
      });
      btn9.on("pointerup", () => {
        if (!btn9._pressed) return;
        btn9._pressed = false;
        this.tweens.killTweensOf(_btnTargets);
        btn9.setScale(_baseScale);
        btnLbl.setScale(_baseScale);
        window._selectedLevelData = levelData;
        closeOverlay(false, () => {
          this._onlineLevelsOverlay = null;
          this._closeOnlineLevelsOverlay = null;
          this._openPlayMenu(() => this._openOnlineLevelsScene(params));
        });
      });

      return cellObjs;
    };
    const _parseKV = (str) => {
      const m = {}, p = str.split(":");
      for (let i = 0; i + 1 < p.length; i += 2) m[p[i]] = p[i + 1];
      return m;
    };
    const _setPage = async (page) => {
      if (_loading) return;
      _loading = true;
      currentPage = page;
      for (const o of activeCellObjs) if (o && o.destroy) o.destroy();
      activeCellObjs = [];
      clearRows();
      if (this._featuredPageUpdate) {
        this._featuredPageUpdate(page);
      }

      spinSprite.setVisible(true);
      refreshBtn.setVisible(false);
      pageLbl.setVisible(false);
      this.tweens.killTweensOf(prevBtn, "scale");
      prevBtn.setScale(1);
      prevBtn._pressed = false;
      prevBtn.setVisible(false);
      this.tweens.killTweensOf(nextBtn, "scale");
      nextBtn.setScale(1);
      nextBtn._pressed = false;
      nextBtn.setVisible(false);

      try {
        let response = cache[page];
        if (!response) {
          const PROXY_BASE = (window._gdProxyUrl || "").replace(/\/$/, "");
          if (!PROXY_BASE) throw new Error("no proxy configured");
          const body = Object.entries({ secret: "Wmfd2893gb7", page, ...params })
            .map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
          let retryCount = 0;
          const maxRetries = 3;
          let res;
          while (retryCount < maxRetries) {
            res = await fetch(`${PROXY_BASE}/getGJLevels21.php`, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body
            });

            if (res.status === 429) {
              retryCount++;
              if (retryCount >= maxRetries) {
                throw new Error(`rate limited after ${maxRetries} retries`);
              }
              await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
              continue;
            }
            break;
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          response = await res.text();
          if (!response || response === "-1") throw new Error("no results");
          cache[page] = response;
        }
        spinSprite.setVisible(false);
        refreshBtn.setVisible(true);
        pageLbl.setVisible(true);
        prevBtn.setVisible(page > 0);
        nextBtn.setVisible(true);
        const sections = response.split("#");
        const levelStrs = (sections[0] || "").split("|").filter(Boolean);
        const playerStrs = (sections[1] || "").split("|").filter(Boolean);
        const songStrs = (sections[2] || "").split("~:~").filter(Boolean);
        const pageInfo = (sections[3] || "0:0:10").split(":");

        const playerMap = {};
        for (const ps of playerStrs) {
          const p = ps.split(":");
          if (p.length >= 2) playerMap[p[0]] = p[1];
        }
        const songMap = {};
        for (const ss of songStrs) {
          const sp = ss.split("~|~"), sm = {};
          for (let i = 0; i + 1 < sp.length; i += 2) sm[sp[i]] = sp[i + 1];
          if (sm["1"]) songMap[sm["1"]] = sm["2"] || "";
        }
        const total = parseInt(pageInfo[0]) || 0;
        const offset = parseInt(pageInfo[1]) || 0;
        const count = parseInt(pageInfo[2]) || 10;
        const start = offset + 1;
        const end = count * (page + 1);
        pageLbl.setText(`${start} to ${end} of ${total}`);
        const maxPages = Math.ceil(total / count);
        _knownMaxPages = Math.max(1, maxPages);
        const hasNextPage = (page + 1) < maxPages;
        nextBtn.setVisible(hasNextPage);
        scrollOffsetY = 0;

        _lastLevelStrs = levelStrs;
        if (_processedCache[page]) {
          _lastLevelData = _processedCache[page];
          _lastLevelData.forEach((levelData, idx) => {
            const cellObjs = _buildLevelCell(levelData, idx);
            activeCellObjs.push(...cellObjs);
            addRow();
          });
          spinSprite.setVisible(false);
          refreshBtn.setVisible(true);
          pageLbl.setVisible(true);
          prevBtn.setVisible(page > 0);
          nextBtn.setVisible(hasNextPage);
          _loading = false;
          return;
        }
        _lastLevelData = levelStrs.map((ls) => {
          const m = _parseKV(ls);
          const rawLikes = parseInt(m["14"]) || 0;
          const isDemon = parseInt(m["17"]) === 1;
          const isAuto = parseInt(m["25"]) === 1;
          let diffIdx = 0;
          if (isAuto) {
            diffIdx = 11;
          } else if (isDemon) {
            const d9 = parseInt(m["9"]);
            const d43 = parseInt(m["43"]);
            if (!isNaN(d9) && d9 >= 1 && d9 <= 5) {
              diffIdx = [7, 8, 6, 9, 10][d9 - 1] ?? 8;
            } else if (!isNaN(d43)) {
              const demonMap43 = { 3: 7, 4: 8, 0: 6, 5: 9, 6: 10 };
              diffIdx = demonMap43.hasOwnProperty(d43) ? demonMap43[d43] : 8;
            } else {
              diffIdx = 8;
            }
          } else {
            diffIdx = Math.min(5, Math.max(0, Math.round((parseInt(m["9"]) || 0) / 10)));
          }
          return {
            id: m["1"] || null,
            name: m["2"] || "Unknown",
            author: playerMap[m["6"]] || ("Player " + (m["6"] || "?")),
            difficulty: diffIdx,
            downloads: parseInt(m["10"]) || 0,
            length: parseInt(m["15"]) || 0,
            likes: rawLikes,
            stars: parseInt(m["18"]) || 0,
            coins: parseInt(m["37"]) || 0,
            coinsVerified: m["38"] === "1",
            customSongID: (m["35"] && m["35"] !== "0") ? m["35"] : null,
            songName: m["35"]
              ? (songMap[m["35"]] || ("Song #" + m["35"]))
              : ("Song #" + (m["12"] || "0")),
            featureScore: parseInt(m["19"]) || 0,
            featured: (parseInt(m["19"]) || 0) > 0,
            epic: parseInt(m["42"]) || 0
          };
        });
        const _officialEntries = _lastLevelData.filter(ld => !ld.customSongID && ld.id);
        if (_officialEntries.length > 0) {
          await Promise.all(_officialEntries.map(ld => {
            return fetch(`https://gdbrowser.com/api/level/${ld.id}`)
              .then(r => r.ok ? r.json() : null)
              .then(data => { if (data && data.songName) ld.songName = data.songName; })
              .catch(() => {});
          }));
        }
        _processedCache[page] = _lastLevelData;
        _lastLevelData.forEach((levelData, idx) => {
          const cellObjs = _buildLevelCell(levelData, idx);
          activeCellObjs.push(...cellObjs);
          addRow();
        });

      } catch (err) {
        spinSprite.setVisible(false);
        refreshBtn.setVisible(true);
        if (!(err && err.message === "no results")) this._showServerErrorPopup();
      }
      _loading = false;
    };
    prevBtn.removeAllListeners("pointerup");
    nextBtn.removeAllListeners("pointerup");
    prevBtn.on("pointerup", () => { if (!_loading && currentPage > 0) _setPage(currentPage - 1); });
    nextBtn.on("pointerup", () => { if (!_loading) _setPage(currentPage + 1); });
    this._makeBouncyButton(refreshBtn, 1, () => { delete cache[currentPage]; delete _processedCache[currentPage]; _setPage(currentPage); });
    const _onWheel = (pointer, gameObjects, deltaX, deltaY) => {
      if (pointer.x < listLeft || pointer.x > listLeft + panelW) return;
      if (pointer.y < listTop || pointer.y > listTop + panelH) return;
      const maxScroll = Math.max(0, (_lastLevelStrs ? _lastLevelStrs.length : 0) * 180 - (panelH - 33));
      const newScrollOffset = Math.max(0, Math.min(scrollOffsetY + deltaY * 0.5, maxScroll));
      if (newScrollOffset !== scrollOffsetY) {
        scrollOffsetY = newScrollOffset;
        for (const o of activeCellObjs) if (o && o.destroy) o.destroy();
        activeCellObjs = [];
        if (_lastLevelData) _lastLevelData.forEach((levelData, idx) => {
          const cellObjs = _buildLevelCell(levelData, idx);
          activeCellObjs.push(...cellObjs);
        });

        redrawStripes(scrollOffsetY);
      }
    }; this.input.on("wheel", _onWheel);
    objects.push({ destroy: () => this.input.off("wheel", _onWheel) });
    let isDragging = false;
    let dragStartY = 0;
    let dragStartScrollOffset = 0;
    let dragThreshold = 5;
    let bounceBackTween = null;
    const onDragStart = (pointer) => {
      if (pointer.x < listLeft || pointer.x > listLeft + panelW) return;
      if (pointer.y < listTop || pointer.y > listTop + panelH) return;
      if (bounceBackTween) {
        bounceBackTween.destroy();
        bounceBackTween = null;
      }
      isDragging = true;
      dragStartY = pointer.y;
      dragStartScrollOffset = scrollOffsetY;
    };
    const onDragMove = (pointer) => {
      if (!isDragging || !pointer.isDown) return;
      if (pointer.x < listLeft || pointer.x > listLeft + panelW) return;
      if (pointer.y < listTop || pointer.y > listTop + panelH) return;
      const deltaY = dragStartY - pointer.y;
      if (Math.abs(deltaY) < dragThreshold) return;
      const maxScroll = Math.max(0, (_lastLevelStrs ? _lastLevelStrs.length : 0) * 180 - (panelH - 33));
      let newScrollOffset = dragStartScrollOffset + deltaY * 0.5;
      const elasticLimit = 100;
      if (newScrollOffset < -elasticLimit) {
        newScrollOffset = -elasticLimit;
      } else if (newScrollOffset > maxScroll + elasticLimit) {
        newScrollOffset = maxScroll + elasticLimit;
      }
      if (newScrollOffset !== scrollOffsetY) {
        scrollOffsetY = newScrollOffset;
        for (const o of activeCellObjs) if (o && o.destroy) o.destroy();
        activeCellObjs = [];
        if (_lastLevelData) _lastLevelData.forEach((levelData, idx) => {
          const cellObjs = _buildLevelCell(levelData, idx);
          activeCellObjs.push(...cellObjs);
        });
        redrawStripes(scrollOffsetY);
      }
    };

    const onDragEnd = () => {
      isDragging = false;
      const maxScroll = Math.max(0, (_lastLevelStrs ? _lastLevelStrs.length : 0) * 180 - (panelH - 33));
      let targetScrollOffset = scrollOffsetY;
      if (scrollOffsetY < 0) {
        targetScrollOffset = 0;
      } else if (scrollOffsetY > maxScroll) {
        targetScrollOffset = maxScroll;
      }
      if (targetScrollOffset !== scrollOffsetY) {
        const startOffset = scrollOffsetY;
        bounceBackTween = this.tweens.add({
          targets: { scrollOffset: startOffset },
          scrollOffset: targetScrollOffset,
          duration: 300,
          ease: "Quad.Out",
          onStart: () => {
            isDragging = false;
          },
          onUpdate: () => {
            scrollOffsetY = bounceBackTween.targets[0].scrollOffset;
            for (const o of activeCellObjs) if (o && o.destroy) o.destroy();
            activeCellObjs = [];
            if (_lastLevelData) _lastLevelData.forEach((levelData, idx) => {
              const cellObjs = _buildLevelCell(levelData, idx);
              activeCellObjs.push(...cellObjs);
            });

            redrawStripes(scrollOffsetY);
          },
          onComplete: () => {
            bounceBackTween = null;
          }
        });
      }
    };

    this.input.on('pointerdown', onDragStart);
    this.input.on('pointermove', onDragMove);
    this.input.on('pointerup', onDragEnd);

    objects.push({ destroy: () => this.input.off('pointerdown', onDragStart) });
    objects.push({ destroy: () => this.input.off('pointermove', onDragMove) });
    objects.push({ destroy: () => this.input.off('pointerup', onDragEnd) });
    objects.push({ destroy: () => {
      for (const o of activeCellObjs) if (o && o.destroy) o.destroy();
      activeCellObjs = [];
    }});

    _setPage(0);
  }
  _openSavedLevelsScene() {
    const sw = screenWidth;
    const sh = screenHeight;

    const objects = [];
    const rowHeight = 180;

    const fadeIn = this.add.graphics().setScrollFactor(0).setDepth(300);
    fadeIn.fillStyle(0x000000, 1);
    fadeIn.fillRect(0, 0, sw, sh);
    this.tweens.add({ targets: fadeIn, alpha: 0, duration: 280, ease: "Linear",
      onComplete: () => fadeIn.destroy() });

    const bgGfx = this.add.graphics().setScrollFactor(0).setDepth(200);
    const steps = 80;
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const r = 0;
      const g = Math.round(0x66 * (1 - t) + 0x33 * t);
      const b = Math.round(0xff * (1 - t) + 0x99 * t);
      bgGfx.fillStyle((r << 16) | (g << 8) | b, 1);
      bgGfx.fillRect(0, Math.floor(i * sh / steps), sw, Math.ceil(sh / steps) + 1);
    }
    objects.push(bgGfx);

    const blocker = this.add.zone(sw / 2, sh / 2, sw, sh)
      .setScrollFactor(0).setDepth(200).setInteractive();
    objects.push(blocker);

    const cBL = this.add.image(0, sh, "GJ_GameSheet03", "GJ_sideArt_001.png")
      .setScrollFactor(0).setDepth(201).setOrigin(0, 1).setFlipY(false);
    const cBR = this.add.image(sw, sh, "GJ_GameSheet03", "GJ_sideArt_001.png")
      .setScrollFactor(0).setDepth(201).setOrigin(1, 1).setFlipX(true);
    objects.push(cBL, cBR);

    const panelW = 712;
    const panelH = 460;
    const panelCX = sw / 2;
    const panelCY = sh / 2;
    const panelBg = this.add.rectangle(panelCX, panelCY + 10, panelW, panelH, 0xC2723E)
      .setScrollFactor(0).setDepth(201).setOrigin(0.5);
    objects.push(panelBg);

    const listLeft = panelCX - panelW / 2;
    const listTop = panelCY - panelH / 2 + 10;

    const stripesGfx = this.add.graphics().setScrollFactor(0).setDepth(202);
    objects.push(stripesGfx);
    let _rowCount = 0;
    const redrawStripes = (offsetY = 0) => {
      stripesGfx.clear();
      for (let ri = 0; ri < _rowCount; ri++) {
        const ry = (listTop + 12) + ri * rowHeight - offsetY;
        const ryBottom = ry + rowHeight;
        if (ryBottom <= (listTop + 12) || ry >= listTop + panelH) continue;
        const clampedY = Math.max(ry, listTop + 12);
        const clampedH = Math.min(ryBottom, listTop + panelH) - clampedY;
        stripesGfx.fillStyle(ri % 2 === 0 ? 0xB5652E : 0xC2723E, 1);
        stripesGfx.fillRect(listLeft, clampedY, panelW, clampedH);
      }
      if (_rowCount > 0) {
        const topDividerY = (listTop + 12) - offsetY;
        if (topDividerY >= listTop + 12 && topDividerY < listTop + panelH) {
          stripesGfx.fillStyle(0x000000, 0.6);
          stripesGfx.fillRect(listLeft + 5, topDividerY, panelW - 10, 1.5);
        }
        const lastRowY = (listTop + 12) + (_rowCount - 1) * rowHeight - offsetY;
        const bottomDividerY = lastRowY + rowHeight;
        if (bottomDividerY > listTop + 12 && bottomDividerY <= listTop + panelH) {
          stripesGfx.fillStyle(0x000000, 0.6);
          stripesGfx.fillRect(listLeft + 5, bottomDividerY, panelW - 10, 1.5);
        }
      }
    };
    const addRow = () => { _rowCount++; redrawStripes(); };
    const clearRows = () => { _rowCount = 0; redrawStripes(); };

    const sideFrame = this.textures.getFrame("GJ_WebSheet", "GJ_table_side_001.png");
    const sideScaleY = sideFrame ? panelH / sideFrame.height : 1;
    const leftBorder = this.add.image(listLeft - 40, 90,
      "GJ_WebSheet", "GJ_table_side_001.png")
      .setScrollFactor(0).setDepth(203).setOrigin(0, 0).setScale(1, sideScaleY);
    objects.push(leftBorder);
    const rightBorder = this.add.image(listLeft + panelW + 40, 90,
      "GJ_WebSheet", "GJ_table_side_001.png")
      .setScrollFactor(0).setDepth(203).setOrigin(1, 0).setFlipX(true).setScale(1, sideScaleY);
    objects.push(rightBorder);
    const topBorder = this.add.image(panelCX, 80,
      "GJ_WebSheet", "GJ_table_top_001.png")
      .setScrollFactor(0).setDepth(203).setOrigin(0.5);
    objects.push(topBorder);
    const bottomBorder = this.add.image(panelCX, 570,
      "GJ_WebSheet", "GJ_table_bottom_001.png")
      .setScrollFactor(0).setDepth(203).setOrigin(0.5);
    objects.push(bottomBorder);

    const pageLbl = this.add.bitmapText(sw - 8, 3, "goldFont", "", 22)
      .setScrollFactor(0).setDepth(204).setOrigin(1, 0).setVisible(false);
    objects.push(pageLbl);

    const backBtn = this.add.image(45, 45, "GJ_GameSheet03", "GJ_arrow_01_001.png")
      .setScrollFactor(0).setDepth(204).setOrigin(0.5).setInteractive();
    objects.push(backBtn);
    const closeOverlay = (returnToCreator = true, onComplete = null) => {
      const fadeOut = this.add.graphics().setScrollFactor(0).setDepth(400).setAlpha(0);
      fadeOut.fillStyle(0x000000, 1);
      fadeOut.fillRect(0, 0, sw, sh);
      this.tweens.add({ targets: fadeOut, alpha: 1, duration: 160, ease: "Linear",
        onComplete: () => {
          for (const o of objects) if (o && o.destroy) o.destroy();
          if (returnToCreator) this._openCreatorMenu();
          if (onComplete) onComplete();
          this.tweens.add({ targets: fadeOut, alpha: 0, duration: 160, ease: "Linear",
            onComplete: () => fadeOut.destroy() });
        }
      });
    };
    this._makeBouncyButton(backBtn, 1, () => closeOverlay());
    const prevBtn = this.add.image(40, sh / 2, "GJ_GameSheet03", "GJ_arrow_03_001.png")
      .setScrollFactor(0).setDepth(204).setOrigin(0.5).setInteractive().setVisible(false);
    objects.push(prevBtn);
    this._makeBouncyButton(prevBtn, 1, () => {});
    const nextBtn = this.add.image(sw - 40, sh / 2, "GJ_GameSheet03", "GJ_arrow_03_001.png")
      .setScrollFactor(0).setDepth(204).setOrigin(0.5).setInteractive().setFlipX(true).setVisible(false);
    objects.push(nextBtn);
    this._makeBouncyButton(nextBtn, 1, () => {});
    const header = this.add.bitmapText(sw / 2, sh / 2 - 245, "bigFont", "Saved Levels", 52)
      .setScrollFactor(0).setDepth(204).setOrigin(0.5);
    objects.push(header);
    const savedPerPage = 10;
    let currentPage = 0;
    const pageBtnGroup = this.add.container(sw - 35, sh / 2 - 240);
    const pageBtn = this.add.image(0, 0, "GJ_button02").setScale(0.7);
    const pageNum = this.add.bitmapText(-2, 0, "bigFont", "1", 35).setOrigin(0.5);
    pageBtnGroup.add(pageBtn);
    pageBtnGroup.add(pageNum);
    const _pageBtnFrame = this.textures.getFrame("GJ_button02");
    const _pageBtnW = (_pageBtnFrame ? _pageBtnFrame.realWidth : 100) * 0.7;
    const _pageBtnH = (_pageBtnFrame ? _pageBtnFrame.realHeight : 100) * 0.7;
    pageBtnGroup.setScrollFactor(0).setDepth(205).setInteractive(
      new Phaser.Geom.Rectangle(-_pageBtnW / 2, -_pageBtnH / 2, _pageBtnW, _pageBtnH),
      Phaser.Geom.Rectangle.Contains
    );
    objects.push(pageBtnGroup);
    const _updateSavedPageNum = (page) => { pageNum.setText(String(page + 1)); };
    const _getSavedTotalPages = () => Math.max(1, Math.ceil(savedLevelData.length / savedPerPage));
    const infoBtn = this.add.image(60, sh - 60,
      "GJ_GameSheet03", "GJ_infoIcon_001.png")
      .setScrollFactor(0).setDepth(204).setOrigin(0.5).setInteractive();
    objects.push(infoBtn);
    this._makeBouncyButton(infoBtn, 1, () => {}, () => true);

    const refreshBtn = this.add.image(sw - 55, sh - 55,
      "GJ_GameSheet03", "GJ_deleteBtn_001.png")
      .setScrollFactor(0).setDepth(204).setOrigin(0.5).setInteractive();
    objects.push(refreshBtn);
    this._makeBouncyButton(refreshBtn, 1, () => {
      try { localStorage.removeItem("gd_saved_online_levels"); } catch(_e) {}
      savedLevelData = [];
      currentPage = 0;
      scrollOffsetY = 0;
      for (const o of activeCellObjs) if (o && o.destroy) o.destroy();
      activeCellObjs = [];
      clearRows();
      redrawStripes(scrollOffsetY);
      _updateSavedNav();
      if (_emptyTxt) {
        _emptyTxt.setVisible(true);
        _emptyTxt2.setVisible(true);
      } else {
        _emptyTxt = this.add.bitmapText(panelCX, panelCY + 0, "bigFont", "You have not downloaded any ", 38)
          .setScrollFactor(0).setDepth(204).setOrigin(0.5);
        objects.push(_emptyTxt);
        _emptyTxt2 = this.add.bitmapText(panelCX + 20, panelCY + 40, "bigFont", "levels yet! ", 38)
          .setScrollFactor(0).setDepth(204).setOrigin(0.5);
        objects.push(_emptyTxt2);
      }
    }, () => true);

    const _panelBoundaryTop = listTop + 12;
    const _panelBoundaryBottom = listTop + panelH - 22;
    const _panelMaskShape = this.add.graphics().setScrollFactor(0);
    _panelMaskShape.fillStyle(0xffffff);
    _panelMaskShape.fillRect(listLeft, _panelBoundaryTop, panelW, _panelBoundaryBottom - _panelBoundaryTop);
    const _panelMask = _panelMaskShape.createGeometryMask();
    objects.push(_panelMaskShape);
    let scrollOffsetY = 0;
    let activeCellObjs = [];
    let savedLevelData = [];
    let _emptyTxt = null, _emptyTxt2 = null;
    const diffFrames = [
      "difficulty_00_btn_001.png",
      "difficulty_01_btn_001.png",
      "difficulty_02_btn_001.png",
      "difficulty_03_btn_001.png",
      "difficulty_04_btn_001.png",
      "difficulty_05_btn_001.png",
      "difficulty_06_btn_001.png",
      "difficulty_07_btn_001.png",
      "difficulty_08_btn_001.png",
      "difficulty_09_btn_001.png",
      "difficulty_10_btn_001.png",
      "difficulty_auto_btn_001.png"
    ];
    const _buildSavedCell = (levelData, rowIdx) => {
      const rowH = 180;
      const rowCenterY = _panelBoundaryTop + rowIdx * rowH + rowH / 2 - scrollOffsetY;
      const cellObjs = [];
      const rx = listLeft;
      if (rowCenterY + rowH / 2 < _panelBoundaryTop || rowCenterY - rowH / 2 > _panelBoundaryBottom) {
        return cellObjs;
      }
      if (rowIdx > 0) {
        const divY = _panelBoundaryTop + rowIdx * rowH - scrollOffsetY;
        if (divY >= _panelBoundaryTop && divY <= _panelBoundaryBottom) {
          const div = this.add.rectangle(rx + panelW / 2, divY, panelW - 10, 1.5, 0x000000, 0.6)
            .setScrollFactor(0).setDepth(203).setOrigin(0.5, 0.5);
          div.setMask(_panelMask);
          cellObjs.push(div);
        }
      }
      const diffIdx = Math.min(diffFrames.length - 1, Math.max(0, levelData.difficulty || 0));
      const _diffSizes = {
        "difficulty_00_btn_001.png": { w: 60, h: 85, rotated: false },
        "difficulty_01_btn_001.png": { w: 60, h: 85, rotated: false },
        "difficulty_02_btn_001.png": { w: 86, h: 85, rotated: false },
        "difficulty_03_btn_001.png": { w: 60, h: 84, rotated: false },
        "difficulty_04_btn_001.png": { w: 85, h: 84, rotated: false },
        "difficulty_05_btn_001.png": { w: 76, h: 85, rotated: false },
        "difficulty_06_btn_001.png": { w: 72, h: 90, rotated: false },
        "difficulty_07_btn_001.png": { w: 72, h: 85, rotated: false },
        "difficulty_08_btn_001.png": { w: 72, h: 85, rotated: false },
        "difficulty_09_btn_001.png": { w: 74, h: 90, rotated: false },
        "difficulty_10_btn_001.png": { w: 80, h: 95, rotated: false },
        "difficulty_auto_btn_001.png": { w: 60, h: 85, rotated: false },
      };
      const _diffMeta = _diffSizes[diffFrames[diffIdx]];
      const _targetH = 85;
      const _maxW = 90;
      const _scaleW = _diffMeta ? _diffMeta.w : 90;
      const _scaleH = _diffMeta ? _diffMeta.h : 85;
      const _scale = Math.min(_targetH / _scaleH, _maxW / _scaleW);
      const _diffIconExtraScale = { 6: 1.04, 9: 1.04, 10: 1.1 }[diffIdx] || 1;
      const diffIcon = this.add.image(rx + 52, rowCenterY, "GJ_GameSheet03", diffFrames[diffIdx])
        .setScrollFactor(0).setDepth(204).setOrigin(0.5).setAlpha(1)
        .setDisplaySize(_scaleW * _scale * _diffIconExtraScale, _scaleH * _scale * _diffIconExtraScale);
      if (_diffMeta && _diffMeta.rotated) diffIcon.setAngle(90).setFlipY(true);
      diffIcon.setMask(_panelMask);
      cellObjs.push(diffIcon);
      let coinIcon = null;
      if (levelData.epic >= 3) {
        coinIcon = this.add.image(rx + 52, rowCenterY, "GJ_GameSheet03", "GJ_epicCoin3_001.png")
          .setScrollFactor(0).setDepth(203).setOrigin(0.5);
      } else if (levelData.epic === 2) {
        coinIcon = this.add.image(rx + 52, rowCenterY, "GJ_GameSheet03", "GJ_epicCoin2_001.png")
          .setScrollFactor(0).setDepth(203).setOrigin(0.5);
      } else if (levelData.epic === 1) {
        coinIcon = this.add.image(rx + 52, rowCenterY, "GJ_GameSheet03", "GJ_epicCoin_001.png")
          .setScrollFactor(0).setDepth(203).setOrigin(0.5);
      } else if (levelData.featured) {
        coinIcon = this.add.image(rx + 52, rowCenterY, "GJ_GameSheet03", "GJ_featuredCoin_001.png")
          .setScrollFactor(0).setDepth(203).setOrigin(0.5);
      }
      if (coinIcon) {
        coinIcon.setMask(_panelMask);
        cellObjs.push(coinIcon);
      }
      const nameX = rx + 105;
      const btnX = rx + panelW - 88;
      const _progressKeyId = "online_" + (levelData.id || "0");
      const _bestPercent = parseFloat(localStorage.getItem("bestPercent_" + _progressKeyId) || "0");
      const _hasBest = _bestPercent > 0;
      const _isComplete = _bestPercent >= 100;
      const _bestReserve = _isComplete ? 44 : (_hasBest ? 70 : 0);
      const _maxTextWidth = (btnX - 70 - 15) - nameX - _bestReserve;
      const nameText = this.add.bitmapText(nameX, rowCenterY - 60, "bigFont", levelData.name || "Unknown", 45)
        .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5);
      this._fitBitmapText(nameText, _maxTextWidth);
      nameText.setMask(_panelMask);
      cellObjs.push(nameText);
      if (_isComplete) {
        const completeIcon = this.add.image(nameX + 5 + nameText.displayWidth + 14, rowCenterY - 60, "GJ_GameSheet03", "GJ_completesIcon_001.png")
          .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5).setScale(0.75);
        completeIcon.setMask(_panelMask);
        cellObjs.push(completeIcon);
      } else if (_hasBest) {
        const bestPctText = this.add.bitmapText(nameX + 5+ nameText.displayWidth + 14, rowCenterY - 60, "goldFont", Math.floor(_bestPercent) + "%", 28)
          .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5);
        bestPctText.setMask(_panelMask);
        cellObjs.push(bestPctText);
      }
      const authorText = this.add.bitmapText(nameX, rowCenterY - 15, "goldFont", "By " + (levelData.author || "Unknown"), 32)
        .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5);
      this._fitBitmapText(authorText, _maxTextWidth);
      authorText.setMask(_panelMask);
      cellObjs.push(authorText);
      const _officialGDSongs = [
        "Stereo Madness","Back On Track","Polargeist","Dry Out","Base After Base",
        "Can't Let Go","Jumper","Time Machine","Cycles","xStep","Clutterfunk",
        "Theory of Everything","Electroman Adventures","Clubstep","Electrodynamix",
        "Hexagon Force","Blast Processing","Theory of Everything 2",
        "Geometrical Dominator","Deadlocked","Fingerdash","Dash"
      ];
      const _isOfficialSong = _officialGDSongs.includes(levelData.songName);
      const songText = this.add.bitmapText(nameX, rowCenterY + 28, "bigFont", levelData.songName || "", 28)
        .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5).setTint(_isOfficialSong ? 0x00d6ff : 0xff79ff);
      this._fitBitmapText(songText, _maxTextWidth);
      songText.setMask(_panelMask);
      cellObjs.push(songText);
      const _statY = rowCenterY + 63;
      const _statGap = 25;
      const _statDefs = [
        { icon: "GJ_timeIcon_001.png", value: this._getLevelLengthLabel(levelData.length), scale: 0.6 },
        { icon: "GJ_downloadsIcon_001.png", value: this._formatStatCount(levelData.downloads), scale: 0.6 },
        { icon: "GJ_sLikeIcon_001.png", value: this._formatStatCount(levelData.likes), scale: 0.9 }
      ];
      let _statX = nameX;
      _statDefs.forEach((stat) => {
        const statIcon = this.add.image(_statX, _statY, "GJ_GameSheet03", stat.icon)
          .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5).setScale(stat.scale);
        statIcon.setMask(_panelMask);
        cellObjs.push(statIcon);
        const statText = this.add.bitmapText(_statX + statIcon.displayWidth + 8, _statY, "bigFont", stat.value, 26)
          .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5);
        this._fitBitmapText(statText, _maxTextWidth / 2);
        statText.setMask(_panelMask);
        cellObjs.push(statText);
        _statX += statIcon.displayWidth + 8 + statText.displayWidth + _statGap;
      });
      const btn9 = this.add.nineslice(btnX, rowCenterY, "GJ_button01", null, 140, 60, 20, 20, 20, 20)
        .setScrollFactor(0).setDepth(206).setOrigin(0.5).setInteractive();
      btn9.setMask(_panelMask);
      const btnLbl = this.add.bitmapText(btnX - 2, rowCenterY - 4, "bigFont", "View", 40)
        .setScrollFactor(0).setDepth(207).setOrigin(0.5);
      btnLbl.setMask(_panelMask);
      cellObjs.push(btn9, btnLbl);

      const _btnTargets = [btn9, btnLbl];
      const _baseScale = 1, _pressScale = 1.26;
      btn9.on("pointerdown", () => {
        btn9._pressed = true;
        this.tweens.killTweensOf(_btnTargets, "scale");
        this.tweens.add({ targets: _btnTargets, scale: _pressScale, duration: 300, ease: "Bounce.Out" });
      });
      btn9.on("pointerout", () => {
        if (btn9._pressed) {
          btn9._pressed = false;
          this.tweens.killTweensOf(_btnTargets, "scale");
          this.tweens.add({ targets: _btnTargets, scale: _baseScale, duration: 400, ease: "Bounce.Out" });
        }
      });
      btn9.on("pointerup", () => {
        if (!btn9._pressed) return;
        btn9._pressed = false;
        this.tweens.killTweensOf(_btnTargets);
        btn9.setScale(_baseScale);
        btnLbl.setScale(_baseScale);
        window._selectedLevelData = levelData;
        closeOverlay(false, () => {
          this._openPlayMenu(() => this._openSavedLevelsScene());
        });
      });

      return cellObjs;
    };

    const _rebuildCells = () => {
      for (const o of activeCellObjs) if (o && o.destroy) o.destroy();
      activeCellObjs = [];
      clearRows();
      const totalPages = _getSavedTotalPages();
      if (currentPage >= totalPages) currentPage = 0;
      _updateSavedNav();
      const pageData = savedLevelData.slice(currentPage * savedPerPage, currentPage * savedPerPage + savedPerPage);
      pageData.forEach((levelData, idx) => {
        const cellObjs = _buildSavedCell(levelData, idx);
        activeCellObjs.push(...cellObjs);
        addRow();
      });
    };
    const _updateSavedNav = () => {
      const totalPages = _getSavedTotalPages();
      const hasData = savedLevelData.length > 0;
      pageBtnGroup.setVisible(hasData);
      _updateSavedPageNum(currentPage);
      const start = hasData ? currentPage * savedPerPage + 1 : 0;
      const end = hasData ? Math.min(savedLevelData.length, (currentPage + 1) * savedPerPage) : 0;
      pageLbl.setText(`${start} to ${end} of ${savedLevelData.length}`);
      pageLbl.setVisible(hasData);
      prevBtn.setVisible(hasData && currentPage > 0);
      nextBtn.setVisible(hasData && currentPage < totalPages - 1);
    };

    const _goToSavedPage = (page) => {
      const totalPages = _getSavedTotalPages();
      currentPage = Math.max(0, Math.min(page, totalPages - 1));
      scrollOffsetY = 0;
      _rebuildCells();
      redrawStripes(scrollOffsetY);
    };

    this._makeBouncyButton(pageBtnGroup, 1, () => {
      const totalPages = _getSavedTotalPages();
      _goToSavedPage((currentPage + 1) % totalPages);
    }, () => true);

    prevBtn.removeAllListeners("pointerup");
    nextBtn.removeAllListeners("pointerup");
    prevBtn.on("pointerup", () => { if (currentPage > 0) _goToSavedPage(currentPage - 1); });
    nextBtn.on("pointerup", () => {
      const totalPages = _getSavedTotalPages();
      if (currentPage < totalPages - 1) _goToSavedPage(currentPage + 1);
    });
    try {
      savedLevelData = JSON.parse(localStorage.getItem("gd_saved_online_levels") || "[]");
      let _neededNormalize = false;
      savedLevelData.forEach(ld => {
        if (typeof ld.id === "string" && ld.id.startsWith("online_")) {
          ld.id = ld.id.replace(/^online_/, "");
          _neededNormalize = true;
        }
      });
      if (_neededNormalize) {
        try { localStorage.setItem("gd_saved_online_levels", JSON.stringify(savedLevelData)); } catch(_e) {}
      }
    } catch(_e) { savedLevelData = []; }

    if (savedLevelData.length === 0) {
      _emptyTxt = this.add.bitmapText(panelCX, panelCY + 0, "bigFont", "You have not downloaded any ", 38)
        .setScrollFactor(0).setDepth(204).setOrigin(0.5);
      objects.push(_emptyTxt);
      _emptyTxt2 = this.add.bitmapText(panelCX + 20, panelCY + 40, "bigFont", "levels yet! ", 38)
        .setScrollFactor(0).setDepth(204).setOrigin(0.5);
      objects.push(_emptyTxt2);
      _updateSavedNav();
    } else {
      const _needsFetch = savedLevelData.filter(ld => {
        const numericId = String(ld.id || "").replace(/^online_/, "");
        return /^\d+$/.test(numericId) && (!ld.author || ld.author === "Unknown" || !ld.songName || ld.songName === "Unknown" || ld.difficulty === 0 || ld.difficulty == null);
      });

      const _doRender = () => {
        _rebuildCells();
      };

      if (_needsFetch.length === 0) {
        _doRender();
      } else {
        Promise.all(_needsFetch.map(levelData => {
          const numericId = String(levelData.id || "").replace(/^online_/, "");
          return fetch(`https://gdbrowser.com/api/level/${numericId}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => {
              if (data) {
                if (data.author) levelData.author = data.author;
                if (data.songName) levelData.songName = data.songName;
                if (!levelData.customSongID && data.songID) levelData.customSongID = String(data.songID);
                const _diffMap = {
                  "N/A": 0, "Auto": 11, "Easy": 1, "Normal": 2,
                  "Hard": 3, "Harder": 4, "Insane": 5,
                  "Easy Demon": 7, "Medium Demon": 8, "Hard Demon": 6,
                  "Insane Demon": 9, "Extreme Demon": 10
                };
                if (data.difficulty && _diffMap.hasOwnProperty(data.difficulty)) {
                  levelData.difficulty = _diffMap[data.difficulty];
                }
              }
            })
            .catch(() => {});
        })).then(() => {
          try {
            const _savedKey = "gd_saved_online_levels";
            const all = JSON.parse(localStorage.getItem(_savedKey) || "[]");
            for (const ld of savedLevelData) {
              const idx = all.findIndex(sl => sl.id === ld.id);
              if (idx !== -1) {
                all[idx].author = ld.author;
                all[idx].songName = ld.songName;
                all[idx].difficulty = ld.difficulty;
                all[idx].customSongID = ld.customSongID;
              }
            }
            localStorage.setItem(_savedKey, JSON.stringify(all));
          } catch(_e) {}
          _doRender();
        });
      }

      objects.push({ destroy: () => {
        for (const o of activeCellObjs) if (o && o.destroy) o.destroy();
        activeCellObjs = [];
      }});
      const _getSavedPageCount = () => Math.min(savedPerPage, savedLevelData.length - currentPage * savedPerPage);
      const _onWheel = (pointer, gameObjects, deltaX, deltaY) => {
        if (pointer.x < listLeft || pointer.x > listLeft + panelW) return;
        if (pointer.y < listTop || pointer.y > listTop + panelH) return;
        const maxScroll = Math.max(0, _getSavedPageCount() * 180 - (panelH - 33));
        const newOffset = Math.max(0, Math.min(scrollOffsetY + deltaY * 0.5, maxScroll));
        if (newOffset !== scrollOffsetY) {
          scrollOffsetY = newOffset;
          _rebuildCells();
          redrawStripes(scrollOffsetY);
        }
      };
      this.input.on("wheel", _onWheel);
      objects.push({ destroy: () => this.input.off("wheel", _onWheel) });
      let isDragging = false, dragStartY = 0, dragStartOffset = 0;
      const onDragStart = (pointer) => {
        if (pointer.x < listLeft || pointer.x > listLeft + panelW) return;
        if (pointer.y < listTop || pointer.y > listTop + panelH) return;
        isDragging = true; dragStartY = pointer.y; dragStartOffset = scrollOffsetY;
      };
      const onDragMove = (pointer) => {
        if (!isDragging || !pointer.isDown) return;
        const maxScroll = Math.max(0, _getSavedPageCount() * 180 - (panelH - 33));
        const newOffset = Math.max(0, Math.min(dragStartOffset + (dragStartY - pointer.y) * 0.5, maxScroll));
        if (newOffset !== scrollOffsetY) {
          scrollOffsetY = newOffset;
          _rebuildCells();
          redrawStripes(scrollOffsetY);
        }
      };
      const onDragEnd = () => { isDragging = false; };
      this.input.on("pointerdown", onDragStart);
      this.input.on("pointermove", onDragMove);
      this.input.on("pointerup", onDragEnd);
      objects.push({ destroy: () => this.input.off("pointerdown", onDragStart) });
      objects.push({ destroy: () => this.input.off("pointermove", onDragMove) });
      objects.push({ destroy: () => this.input.off("pointerup", onDragEnd) });
    }
  }
  _closeOnlineLevelsScene() {
    if (this._onlineLevelsOverlay) {
      if (this._closeOnlineLevelsOverlay) {
        this._closeOnlineLevelsOverlay();
      }
      this._onlineLevelsOverlay = null;
    }
  }
  _openSearchResultScene(levelData) {
    if (this._searchResultOverlay) return;

    const sw = screenWidth;
    const sh = screenHeight;
    const shell = this._openListScene(
      "Online Levels",
      180,
      () => { this._searchResultOverlay = null; this._openSearchMenu(); }
    );
    const { objects, listLeft, listTop, panelW, panelH, addRow, closeOverlay } = shell;

    this._searchResultOverlay = shell.overlay;
    this._closeSearchResultOverlay = closeOverlay;

    const _panelBoundaryTop = listTop + 12;
    const _panelBoundaryBottom = listTop + panelH - 22;
    const _panelMaskShape = this.add.graphics().setScrollFactor(0);
    _panelMaskShape.fillStyle(0xffffff);
    _panelMaskShape.fillRect(listLeft, _panelBoundaryTop, panelW, _panelBoundaryBottom - _panelBoundaryTop);
    const _panelMask = _panelMaskShape.createGeometryMask();
    objects.push(_panelMaskShape);

    const _diffFrames = [
      "difficulty_00_btn_001.png",
      "difficulty_01_btn_001.png",
      "difficulty_02_btn_001.png",
      "difficulty_03_btn_001.png",
      "difficulty_04_btn_001.png",
      "difficulty_05_btn_001.png",
      "difficulty_06_btn_001.png",
      "difficulty_07_btn_001.png",
      "difficulty_08_btn_001.png",
      "difficulty_09_btn_001.png",
      "difficulty_10_btn_001.png",
      "difficulty_auto_btn_001.png"
    ];
    const _diffSizes = {
      "difficulty_00_btn_001.png": { w: 60, h: 85, rotated: false },
      "difficulty_01_btn_001.png": { w: 60, h: 85, rotated: false },
      "difficulty_02_btn_001.png": { w: 86, h: 85, rotated: false },
      "difficulty_03_btn_001.png": { w: 60, h: 84, rotated: false },
      "difficulty_04_btn_001.png": { w: 85, h: 84, rotated: false },
      "difficulty_05_btn_001.png": { w: 76, h: 85, rotated: false },
      "difficulty_06_btn_001.png": { w: 72, h: 88, rotated: false },
      "difficulty_07_btn_001.png": { w: 72, h: 85, rotated: false },
      "difficulty_08_btn_001.png": { w: 72, h: 85, rotated: false },
      "difficulty_09_btn_001.png": { w: 74, h: 88, rotated: false },
      "difficulty_10_btn_001.png": { w: 80, h: 91, rotated: false },
      "difficulty_auto_btn_001.png": { w: 60, h: 85, rotated: false },
    };
    const _officialGDSongs = [
      "Stereo Madness","Back On Track","Polargeist","Dry Out","Base After Base",
      "Can't Let Go","Jumper","Time Machine","Cycles","xStep","Clutterfunk",
      "Theory of Everything","Electroman Adventures","Clubstep","Electrodynamix",
      "Hexagon Force","Blast Processing","Theory of Everything 2",
      "Geometrical Dominator","Deadlocked","Fingerdash","Dash"
    ];

    const rowH = 180;
    const rowY = _panelBoundaryTop;
    const rowCenterY = rowY + rowH / 2;
    const rx = listLeft;

    const diffIdx = Math.min(_diffFrames.length - 1, Math.max(0, levelData.difficulty || 0));
    const _diffMeta = _diffSizes[_diffFrames[diffIdx]];
    const _targetH = 85;
    const _maxW = 90;
    const _scaleW = _diffMeta ? _diffMeta.w : 90;
    const _scaleH = _diffMeta ? _diffMeta.h : 85;
    const _scale = Math.min(_targetH / _scaleH, _maxW / _scaleW);
    const _diffIconExtraScale = { 6: 1.04, 9: 1.04, 10: 1.1 }[diffIdx] || 1;
    const diffIcon = this.add.image(rx + 52, rowCenterY, "GJ_GameSheet03", _diffFrames[diffIdx])
      .setScrollFactor(0).setDepth(204).setOrigin(0.5).setAlpha(1)
      .setDisplaySize(_scaleW * _scale * _diffIconExtraScale, _scaleH * _scale * _diffIconExtraScale);
    if (_diffMeta && _diffMeta.rotated) diffIcon.setAngle(90).setFlipY(true);
    diffIcon.setMask(_panelMask);
    objects.push(diffIcon);

    let coinIcon = null;
    if (levelData.epic >= 3) {
      coinIcon = this.add.image(rx + 52, rowCenterY, "GJ_GameSheet03", "GJ_epicCoin3_001.png")
        .setScrollFactor(0).setDepth(203).setOrigin(0.5);
    } else if (levelData.epic === 2) {
      coinIcon = this.add.image(rx + 52, rowCenterY, "GJ_GameSheet03", "GJ_epicCoin2_001.png")
        .setScrollFactor(0).setDepth(203).setOrigin(0.5);
    } else if (levelData.epic === 1) {
      coinIcon = this.add.image(rx + 52, rowCenterY, "GJ_GameSheet03", "GJ_epicCoin_001.png")
        .setScrollFactor(0).setDepth(203).setOrigin(0.5);
    } else if (levelData.featured) {
      coinIcon = this.add.image(rx + 52, rowCenterY, "GJ_GameSheet03", "GJ_featuredCoin_001.png")
        .setScrollFactor(0).setDepth(203).setOrigin(0.5);
    }
    if (coinIcon) {
      coinIcon.setMask(_panelMask);
      objects.push(coinIcon);
    }

    const nameX = rx + 105;
    const btnX = rx + panelW - 88;
    const _progressKeyId = "online_" + (levelData.id || "0");
    const _bestPercent = parseFloat(localStorage.getItem("bestPercent_" + _progressKeyId) || "0");
    const _hasBest = _bestPercent > 0;
    const _isComplete = _bestPercent >= 100;
    const _bestReserve = _isComplete ? 44 : (_hasBest ? 70 : 0);
    const _maxTextWidth = (btnX - 70 - 15) - nameX - _bestReserve;
    const nameText = this.add.bitmapText(nameX, rowCenterY - 60, "bigFont", levelData.name || "Unknown", 45)
      .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5);
    this._fitBitmapText(nameText, _maxTextWidth);
    nameText.setMask(_panelMask);
    objects.push(nameText);
    if (_isComplete) {
      const completeIcon = this.add.image(nameX + 5 + nameText.displayWidth + 14, rowCenterY - 60, "GJ_GameSheet03", "GJ_completesIcon_001.png")
        .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5).setScale(0.75);
      completeIcon.setMask(_panelMask);
      objects.push(completeIcon);
    } else if (_hasBest) {
      const bestPctText = this.add.bitmapText(nameX + 5 + nameText.displayWidth + 14, rowCenterY - 60, "goldFont", Math.floor(_bestPercent) + "%", 28)
        .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5)
      bestPctText.setMask(_panelMask);
      objects.push(bestPctText);
    }
    const authorText = this.add.bitmapText(nameX, rowCenterY - 15, "goldFont", "By " + (levelData.author || "Unknown"), 32)
      .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5);
    this._fitBitmapText(authorText, _maxTextWidth);
    authorText.setMask(_panelMask);
    objects.push(authorText);
    const _isOfficialSong = _officialGDSongs.includes(levelData.songName);
    const songText = this.add.bitmapText(nameX, rowCenterY + 28, "bigFont", levelData.songName || "", 28)
      .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5).setTint(_isOfficialSong ? 0x00d6ff : 0xff79ff);
    this._fitBitmapText(songText, _maxTextWidth);
    songText.setMask(_panelMask);
    objects.push(songText);
    const _statY = rowCenterY + 63;
    const _statGap = 25;
    const _statDefs = [
      { icon: "GJ_timeIcon_001.png", value: this._getLevelLengthLabel(levelData.length), scale: 0.6 },
      { icon: "GJ_downloadsIcon_001.png", value: this._formatStatCount(levelData.downloads), scale: 0.6 },
      { icon: "GJ_sLikeIcon_001.png", value: this._formatStatCount(levelData.likes), scale: 0.9 }
    ];
    let _statX = nameX;
    _statDefs.forEach((stat) => {
      const statIcon = this.add.image(_statX, _statY, "GJ_GameSheet03", stat.icon)
        .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5).setScale(stat.scale);
      statIcon.setMask(_panelMask);
      objects.push(statIcon);
      const statText = this.add.bitmapText(_statX + statIcon.displayWidth + 8, _statY, "bigFont", stat.value, 26)
        .setScrollFactor(0).setDepth(204).setOrigin(0, 0.5);
      this._fitBitmapText(statText, _maxTextWidth / 2);
      statText.setMask(_panelMask);
      objects.push(statText);
      _statX += statIcon.displayWidth + 8 + statText.displayWidth + _statGap;
    });

    const _hasViewedLevel = !!localStorage.getItem("viewedLevel_" + (levelData.id || "0"));
    const _rowBtnFrame = _hasViewedLevel ? "GJ_button01" : "GJ_button02";
    const _rowBtnLabel = _hasViewedLevel ? "View" : "Get It";
    const _rowBtnLabelSize = _hasViewedLevel ? 40 : 30;
    const btn9 = this.add.nineslice(btnX, rowCenterY, _rowBtnFrame, null, 140, 60, 20, 20, 20, 20)
      .setScrollFactor(0).setDepth(206).setOrigin(0.5).setInteractive();
    btn9.setMask(_panelMask);
    const btnLbl = this.add.bitmapText(btnX - 2, rowCenterY - 4, "bigFont", _rowBtnLabel, _rowBtnLabelSize)
      .setScrollFactor(0).setDepth(207).setOrigin(0.5);
    btnLbl.setMask(_panelMask);
    objects.push(btn9, btnLbl);

    const _btnTargets = [btn9, btnLbl];
    const _baseScale = 1, _pressScale = 1.26;
    btn9.on("pointerdown", () => {
      btn9._pressed = true;
      this.tweens.killTweensOf(_btnTargets, "scale");
      this.tweens.add({ targets: _btnTargets, scale: _pressScale, duration: 300, ease: "Bounce.Out" });
    });
    btn9.on("pointerout", () => {
      if (btn9._pressed) {
        btn9._pressed = false;
        this.tweens.killTweensOf(_btnTargets, "scale");
        this.tweens.add({ targets: _btnTargets, scale: _baseScale, duration: 400, ease: "Bounce.Out" });
      }
    });
    btn9.on("pointerup", () => {
      if (!btn9._pressed) return;
      btn9._pressed = false;
      this.tweens.killTweensOf(_btnTargets);
      btn9.setScale(_baseScale);
      btnLbl.setScale(_baseScale);
      window._selectedLevelData = levelData;
      closeOverlay(false, () => {
        this._searchResultOverlay = null;
        this._closeSearchResultOverlay = null;
        this._openPlayMenu(() => this._openSearchResultScene(levelData));
      });
    });

    addRow();
  }
  _closeSearchResultScene() {
    if (this._searchResultOverlay) {
      if (this._closeSearchResultOverlay) {
        this._closeSearchResultOverlay();
      }
      this._searchResultOverlay = null;
    }
  }
  _hideEndLayer(_0x272eb1) {
    if (this._endcoinAwardTimer) {
      for (const timer of this._endcoinAwardTimer) {
        timer?.remove?.(false);
      }
      this._endcoinAwardTimer = null;
    }
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