
function _editorDecodeTextObjectString(value) {
  if (typeof _decodeTextObjectString === "function") return _decodeTextObjectString(value);
  if (value === undefined || value === null) return "";
  const raw = String(value);
  if (raw === "") return "";
  try {
    if (!/^[A-Za-z0-9_-]+={0,2}$/.test(raw)) return raw;
    let base64 = raw.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) base64 += "=";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch (err) {
    return raw;
  }
}

function _editorEncodeTextObjectString(value) {
  if (typeof _encodeTextObjectString === "function") return _encodeTextObjectString(value);
  const bytes = new TextEncoder().encode(String(value ?? ""));
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

class LevelEditor {
  constructor(gameScene) {
    this.gameScene = gameScene;
    const methodNames = LevelEditor.methodNames || [];
    for (const methodName of methodNames) {
      if (typeof this[methodName] !== "function") continue;
      const boundMethod = this[methodName].bind(gameScene);
      this[methodName] = boundMethod;
      gameScene[methodName] = boundMethod;
    }
  }

  get scene() {
    return this.gameScene;
  }

  _handleEditorCamera(delta) {
    if (this._editorTextInputFocused) {
        this._level.container.x = -this._cameraX;
        this._level.container.y = -this._cameraY;
        this._level.additiveContainer.x = -this._cameraX;
        this._level.additiveContainer.y = -this._cameraY;
        this._level.topContainer.x = -this._cameraX;
        this._level.topContainer.y = -this._cameraY;
        return;
    }

    const camSpeed = 15;
    const cursors = this.input.keyboard.createCursorKeys();
    const wasd = this.input.keyboard.addKeys('W,A,S,D');

    if (cursors.left.isDown || wasd.A.isDown) {
        this._cameraX -= camSpeed;
    } else if (cursors.right.isDown || wasd.D.isDown) {
        this._cameraX += camSpeed;
    }

    if (cursors.up.isDown || wasd.W.isDown) {
        this._cameraY -= camSpeed;
    } else if (cursors.down.isDown || wasd.S.isDown) {
        this._cameraY += camSpeed;
    }

    this._level.container.x = -this._cameraX;
    this._level.container.y = -this._cameraY;
    this._level.additiveContainer.x = -this._cameraX;
    this._level.additiveContainer.y = -this._cameraY;
    this._level.topContainer.x = -this._cameraX;
    this._level.topContainer.y = -this._cameraY;

    this._bg.tilePositionX = this._cameraX * 0.1;
    this._bg.tilePositionY = this._bgInitY + this._cameraY * 0.1;
  }


  _initEditorLogic() {
    if (this._editorGridGraphics) this._editorGridGraphics.destroy();
    this._editorGridGraphics = this.add.graphics().setDepth(5);
    const allObj = window.allobjects();
    this._totalIds = Object.keys(allObj).length;
    this._editorPage = 0;
    this._maxPerPage = 12;
    this._isSwipeEnabled = false;
    this._lastSwipeGridX;
    this._lastSwipeGridY;
    this._clickStartPos = { x: 0, y: 0 };
    this._isDragging = false;
    this._isDraggingSlider = false;
    this._editorBoxSelectActive = false;
    this._editorBoxSelectMoved = false;
    this._editorBoxSelectStart = null;
    this._editorBoxSelectGraphics = null;
    this._currentSelectedObjectIds = [];
    this._editorTab = "build";
    window.editorSelectedObject = -1;
    this._editorZoom = 1.0;
    this._editorPlaytestActive = false;
    this._editorPlaytestPaused = false;
    this._editorPlaytestSavedView = null;
    this._editorPlaytestPauseView = null;
    this._editorPlaytestLastTrailPoint = null;
    this.input.on('pointerdown', (pointer) => {
        if (this._editorPlaytestActive && !this._editorPlaytestPaused) return;
        this._clickStartPos.x = pointer.x;
        this._clickStartPos.y = pointer.y;
        this._cameraStartX = this._cameraX;
        this._cameraStartY = this._cameraY;
        this._isDragging = false;
        if (this._editorTab === "edit" && this._isSwipeEnabled) {
            this._startEditorBoxSelect(pointer);
        }
    });
    this.input.on('pointermove', (pointer) => {
        if (this._editorPlaytestActive && !this._editorPlaytestPaused) return;
        if (this._editorBoxSelectActive) {
            this._updateEditorBoxSelect(pointer);
        }
    });
    this.input.on('pointerup', (pointer) => {
        if (this._editorPlaytestActive && !this._editorPlaytestPaused) {
            this._lastSwipeGridX = -1;
            this._lastSwipeGridY = -1;
            this._isDragging = false;
            this._isDraggingSlider = false;
            return;
        }
        if (this._editorBoxSelectActive) {
            const didBoxSelect = this._finishEditorBoxSelect(pointer);
            if (didBoxSelect) {
                this._lastSwipeGridX = -1;
                this._lastSwipeGridY = -1;
                this._isDragging = false;
                this._isDraggingSlider = false;
                return;
            }
            if (this._editorTab === "edit" && this._isSwipeEnabled && !this._isDraggingSlider) {
                this._selectObjectAtPointer(true);
                this._lastSwipeGridX = -1;
                this._lastSwipeGridY = -1;
                this._isDragging = false;
                this._isDraggingSlider = false;
                return;
            }
        }
        if (!this._isSwipeEnabled && !this._isDragging && !this._isDraggingSlider && (this._hitObjects?.length || 0) === 0) {
            this._editorAction();
        }
        this._lastSwipeGridX = -1;
        this._lastSwipeGridY = -1;
        this._isDragging = false;
        this._isDraggingSlider = false;
    });
    this._createEditorGui();
  }


  _createEditorGui() {
    const centerX = screenWidth / 2;
    const bottomY = screenHeight - 100;

    this._editorGui = this.add.container(screenWidth - 40, 40).setScrollFactor(0).setDepth(1000);
    const editorSettings = this.add.image(-87, 0, "GJ_GameSheet03", "GJ_optionsBtn02_001.png").setInteractive();
    const editorPause = this.add.image(0, 0, "GJ_GameSheet03", "GJ_pauseBtn_001.png").setInteractive();
    this._deleteButton = this.add.image(-(screenWidth - 40) + 50, 0, "GJ_GameSheet03", "GJ_trashBtn_001.png").setInteractive();
    this._editorGui.add([editorSettings, editorPause, this._deleteButton]);
    this._makeBouncyButton(editorSettings, 1.0, () => {this._openEditorLevelSettingsPopup();}, () => !this._editorLevelSettingsPopup);
    this._makeBouncyButton(editorPause, 1.0, () => this._showEditorPauseMenu(true), () => true);
    this._makeBouncyButton(this._deleteButton, 0.9, () => this._deleteSelectedObject(), () => true);
    this._initEditorPauseMenu();

    this._toolbox = this.add.container(0, 0).setScrollFactor(0).setDepth(1000);

    const bg = this.add.rectangle(0, screenHeight, screenWidth, 200, 0x000000).setOrigin(0, 1).setAlpha(0.75).setInteractive();
    this._toolbox.add(bg);

    this._leftArrow = this.add.image(screenWidth / 2 - 330, screenHeight - 100, "GJ_GameSheet03", "GJ_arrow_02_001.png")
        .setInteractive().setScale(0.7);

    this._rightArrow = this.add.image(screenWidth / 2 + 330, screenHeight - 100, "GJ_GameSheet03", "GJ_arrow_02_001.png")
        .setInteractive().setScale(0.7).setFlipX(true);

    this._toolbox.add([this._leftArrow, this._rightArrow]);

    const swipeX = centerX + 450;
    const swipeY = screenHeight - 100;

    this._swipeContainer = this.add.container(swipeX, swipeY).setDepth(1001);
    this._toolbox.add(this._swipeContainer);

    this._swipeBg = this.add.image(0, 0, "GJ_button01").setInteractive().setScale(0.8);
    this._swipeText = this.add.bitmapText(-1, -2, "bigFont", "swipe", 16).setOrigin(0.5);

    this._swipeContainer.add([this._swipeBg, this._swipeText]);

    this._makeCompositeBouncyButton(this._swipeBg, [this._swipeBg, this._swipeText], 0.8, () => {
        this._isSwipeEnabled = !this._isSwipeEnabled;

        if (this._isSwipeEnabled) {
            this._swipeBg.setTexture("GJ_button02");
        } else {
            this._swipeBg.setTexture("GJ_button01");
        }
    });

    const tabX = (screenWidth / 2) - 475;
    const tabYStart = screenHeight - 150;
    const tabSpacing = 55;

    this._separatorLeft = this.add.image(tabX + 100, screenHeight - 100, "GJ_GameSheet03", "edit_vLine_001.png");
    this._toolbox.add(this._separatorLeft);

    this._separatorRight = this.add.image(centerX + 375, screenHeight - 100, "GJ_GameSheet03", "edit_vLine_001.png");
    this._toolbox.add(this._separatorRight);

    const tabs = [
        { id: "build", frame: "edit_buildBtn_001.png" },
        { id: "edit", frame: "edit_editBtn_001.png" },
        { id: "delete", frame: "edit_deleteBtn_001.png" }
    ];

    this._tabButtons = {};
    tabs.forEach((tab, i) => {
        const btn = this.add.image(tabX, tabYStart + (i * tabSpacing), "GJ_GameSheet03", tab.frame).setInteractive();
        this._toolbox.add(btn);
        this._tabButtons[tab.id] = btn;
        this._makeBouncyButton(btn, 1, () => {
            this._editorTab = tab.id;
            this._editorPage = 0;
            this._updateTabVisuals();
            this._buildObjectGrid();
        });
    });

    this._sideButtons = this.add.container(screenWidth - 48, 120).setScrollFactor(0).setDepth(1000);
    this._copyPasteBtn = this.add.image(0, 0, "GJ_GameSheet03", "GJ_duplicateObjectBtn2_001.png").setInteractive().setScale(1);
    this._editObjectBtn = this._addSafeFrameImage(0, 75, "GJ_editObjBtn3_001.png", 1);
    if (this._editObjectBtn?.setInteractive) this._editObjectBtn.setInteractive();
    if (this._editObjectBtn?.setAngle) this._editObjectBtn;
    if (this._editObjectBtn?.setFlipY) this._editObjectBtn;

    this._editGroupBtn = this._addSafeFrameImage(-75, 75, "GJ_groupIDBtn2_001.png", 1);
    if (this._editGroupBtn?.setInteractive) this._editGroupBtn.setInteractive();
    this._editGroupBtnVisual = this._editGroupBtn;
    this._editGroupBtnHit = this._editGroupBtn;
    this._deselectBtn = this.add.image(0, 150, "GJ_GameSheet03", "GJ_deSelBtn2_001.png").setInteractive().setScale(1);

    this._editorLayerSelector = this.add.container(-75, 275);
    this._editorLayerFirstBtn = this.add.image(-90, 0, "GJ_GameSheet03", "GJ_arrow_02_001.png").setInteractive().setScale(0.45).setAlpha(0.5);
    this._editorLayerPrevBtn = this.add.image(-55, 0, "GJ_GameSheet03", "GJ_arrow_03_001.png").setInteractive().setScale(0.55);
    this._editorLayerNextBtn = this.add.image(55, 0, "GJ_GameSheet03", "GJ_arrow_03_001.png").setInteractive().setFlipX(true).setScale(0.55);
    this._editorLayerLastBtn = this.add.image(90, 0, "GJ_GameSheet03", "GJ_arrow_02_001.png").setInteractive().setFlipX(true).setScale(0.45).setAlpha(0.5);
    this._editorLayerInputBg = this.add.graphics();
    this._editorLayerInputText = this.add.bitmapText(0, 0, "bigFont", "All", 25).setOrigin(0.5).setTint(0xffffff);
    this._editorLayerSelector.add([
        this._editorLayerInputBg,
        this._editorLayerInputText,
        this._editorLayerFirstBtn,
        this._editorLayerPrevBtn,
        this._editorLayerNextBtn,
        this._editorLayerLastBtn
    ]);

    this._sideButtons.add([this._copyPasteBtn, this._editGroupBtn, this._editObjectBtn, this._deselectBtn, this._editorLayerSelector]);

    this._makeBouncyButton(this._copyPasteBtn, 1, () => {
        this._duplicateSelectedObject();
    });

    this._makeBouncyButton(this._editObjectBtn, 1, () => {
        this._openSelectedEditorObjectOptions();
    }, () => this._isSelectedEditorObjectTrigger());

    if (this._editGroupBtnHit && this._editGroupBtnHit !== this._editGroupBtnVisual) {
        this._makeCompositeBouncyButton(this._editGroupBtnHit, [this._editGroupBtnVisual], 1, () => {
            this._openSelectedEditorGroupPopup();
        }, () => window.editorSelectedObject !== -1);
    } else if (this._editGroupBtnHit) {
        this._makeBouncyButton(this._editGroupBtnHit, 1, () => {
            this._openSelectedEditorGroupPopup();
        }, () => window.editorSelectedObject !== -1);
    }

    this._makeBouncyButton(this._deselectBtn, 1, () => {
        this._clearEditorSelection();
    });

    this._editorLayerOptions = this._getEditorLayerOptions ? this._getEditorLayerOptions() : [null, 0];
    this._editorActiveLayerIndex = 0;
    this._editorActiveLayer = null;
    this._makeBouncyButton(this._editorLayerFirstBtn, 0.42, () => this._setEditorActiveLayerIndex(0));
    this._makeBouncyButton(this._editorLayerPrevBtn, 0.55, () => this._setEditorActiveLayerIndex((this._editorActiveLayerIndex || 0) - 1));
    this._makeBouncyButton(this._editorLayerNextBtn, 0.55, () => this._setEditorActiveLayerIndex((this._editorActiveLayerIndex || 0) + 1));
    this._makeBouncyButton(this._editorLayerLastBtn, 0.42, () => this._setEditorActiveLayerIndex((this._getEditorLayerOptions ? this._getEditorLayerOptions() : (this._editorLayerOptions || [null, 0])).length - 1));
    this._refreshEditorLayerSelectorVisual();

    this._zoomButtons = this.add.container(48, screenHeight / 2 - 20).setScrollFactor(0).setDepth(1000);
    
    const zoomInBtn = this.add.image(0, 0, "GJ_GameSheet03", "GJ_zoomInBtn_001.png").setInteractive().setScale(0.9);
    const zoomOutBtn = this.add.image(0, 75, "GJ_GameSheet03", "GJ_zoomOutBtn_001.png").setInteractive().setScale(0.9);
    
    this._zoomButtons.add([zoomInBtn, zoomOutBtn]);

    this._makeBouncyButton(zoomInBtn, 0.9, () => this._adjustZoom(0.1));
    this._makeBouncyButton(zoomOutBtn, 0.9, () => this._adjustZoom(-0.1));

    this._editorPlaytestControls = this.add.container(48, screenHeight / 2 - 110).setScrollFactor(0).setDepth(1500);
    const playtestButtonScale = 1.1;

    this._editorPlaytestPlayBtn = this.add.image(0, 0, "GJ_GameSheet03", "GJ_playEditorBtn_001.png").setInteractive().setScale(playtestButtonScale);
    this._editorPlaytestPauseBtn = this.add.image(0, 0, "GJ_GameSheet03", "GJ_pauseEditorBtn_001.png").setInteractive().setScale(playtestButtonScale).setVisible(false);
    this._editorPlaytestStopBtn = this.add.image(90, 0, "GJ_GameSheet03", "GJ_stopEditorBtn_001.png").setInteractive().setScale(playtestButtonScale).setVisible(false);

    this._editorPlaytestControls.add([
        this._editorPlaytestPlayBtn,
        this._editorPlaytestPauseBtn,
        this._editorPlaytestStopBtn
    ]);

    this._makeBouncyButton(this._editorPlaytestPlayBtn, playtestButtonScale, () => this._startEditorPlaytest(), () => !this._editorPlaytestActive);
    this._makeBouncyButton(this._editorPlaytestPauseBtn, playtestButtonScale, () => this._toggleEditorPlaytestPause(), () => this._editorPlaytestActive);
    this._makeBouncyButton(this._editorPlaytestStopBtn, playtestButtonScale, () => this._stopEditorPlaytest(), () => this._editorPlaytestActive);
    this._refreshEditorPlaytestControls();

    this._zoomText = this.add.bitmapText(screenWidth / 2, 80, "bigFont", "Zoom: 1.00x", 40).setOrigin(0.5).setScrollFactor(0).setDepth(2000).setAlpha(0);

    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        const zoomAmount = deltaY > 0 ? -0.1 : 0.1;
        this._adjustZoom(zoomAmount, pointer.x, pointer.y);
    });

    this._updateEditorActionButtons();
    this._updateTabVisuals();
    this._buildObjectGrid();
    this._initEditorTimeline();
  }


  _refreshEditorPlaytestControls() {
    if (!this._editorPlaytestPlayBtn || !this._editorPlaytestPauseBtn || !this._editorPlaytestStopBtn) return;

    const active = !!this._editorPlaytestActive;
    this._editorPlaytestPlayBtn.setVisible(!active);
    this._editorPlaytestPauseBtn.setVisible(active);
    this._editorPlaytestStopBtn.setVisible(active);

    if (active) {
        this._editorPlaytestPauseBtn
            .setTexture(
                "GJ_GameSheet03",
                this._editorPlaytestPaused ? "GJ_playEditorBtn_001.png" : "GJ_pauseEditorBtn_001.png"
            )
            .setAlpha(1);
        this._editorPlaytestStopBtn.setAlpha(1);
    } else {
        this._editorPlaytestPauseBtn
            .setTexture("GJ_GameSheet03", "GJ_pauseEditorBtn_001.png")
            .setAlpha(1);
        this._editorPlaytestStopBtn.setAlpha(1);
    }
  }


  _setEditorPlaytestGuiVisible(visible) {
    const guiObjects = [
        this._editorGui,
        this._toolbox,
        this._zoomButtons,
        this._sideButtons,
        this._timelineContainer,
        this._zoomText
    ];

    for (const obj of guiObjects) {
        if (obj && typeof obj.setVisible === "function") {
            obj.setVisible(visible);
        }
    }
  }


  _setEditorLevelSectionsFullyVisible() {
    if (!this._level?._sectionContainers) return;

    for (let i = 0; i < this._level._sectionContainers.length; i++) {
        if (typeof this._level._setSectionVisible === "function") {
            this._level._setSectionVisible(i, true);
            continue;
        }

        const section = this._level._sectionContainers[i];
        if (section?.additive) section.additive.visible = true;
        if (section?.normal) section.normal.visible = true;
    }

    this._level.resetVisibility?.();
    if (!this._editorPlaytestActive) this._applyEditorLayerFilter?.();
  }


  _resetEditorPlaytestSectionCulling() {
    if (!this._level) return;

    this._level.resetVisibility?.();
    this._level.updateVisibility?.(this._cameraX);
  }


  _refreshEditorPlaytestGlowVisibility() {
    if (!this._level) return;

    const glowVisible = !!window.showEditorGlow;
    this._level.additiveContainer?.setVisible(true);

    if (this._editorPlaytestActive && this._level._glowSprites) {
        for (const glow of this._level._glowSprites) {
            glow?.setVisible?.(glowVisible);
        }
        return;
    }

    this._level._updateGlowVisibility?.();
  }


  _getEditorPlaytestCameraYTarget() {
    let currentNormalCameraY = -(this._cameraY || 0);
    let targetNormalCameraY = currentNormalCameraY;

    if (this._level?.flyCameraTarget !== null && this._level?.flyCameraTarget !== undefined) {
        targetNormalCameraY = this._level.flyCameraTarget;
    } else {
        const playerY = this._state?.y || 0;
        const highMargin = 140;
        const lowMargin = 80;
        const cameraCenterY = currentNormalCameraY - o + 320;

        if (this._state?.gravityFlipped) {
            if (playerY > cameraCenterY + lowMargin) {
                targetNormalCameraY = playerY - 320 - lowMargin + o;
            } else if (playerY < cameraCenterY - highMargin) {
                targetNormalCameraY = playerY - 320 + highMargin + o;
            }
        } else {
            if (playerY > cameraCenterY + highMargin) {
                targetNormalCameraY = playerY - 320 - highMargin + o;
            } else if (playerY < cameraCenterY - lowMargin) {
                targetNormalCameraY = playerY - 320 + lowMargin + o;
            }
        }
    }

    return -Math.max(0, targetNormalCameraY || 0);
  }


  _updateEditorPlaytestCameraY(delta = 0, instant = false) {
    const targetCameraY = this._getEditorPlaytestCameraYTarget();

    if (instant || delta === 0) {
        this._cameraY = targetCameraY;
        return;
    }

    const currentNormalCameraY = -(this._cameraY || 0);
    const targetNormalCameraY = -targetCameraY;
    let nextNormalCameraY = currentNormalCameraY + ((targetNormalCameraY - currentNormalCameraY) / (10 / delta));

    if (nextNormalCameraY < 0) nextNormalCameraY = 0;
    this._cameraY = -nextNormalCameraY;
  }


  _updateEditorPlaytestBackground() {
    this._bg.tilePositionX += (this._cameraX - this._prevCameraX) * this._bgSpeedX;
    this._prevCameraX = this._cameraX;
    this._bg.tilePositionY = this._bgInitY + this._cameraY * this._bgSpeedY;
  }


  _setEditorZoomInstant(zoom, cameraX = this._cameraX, cameraY = this._cameraY) {
    this._editorZoom = Phaser.Math.Clamp(zoom, 0.1, 4.0);
    this._cameraX = cameraX;
    this._cameraY = cameraY;

    this._level.topContainer.setScale(this._editorZoom);
    this._level.additiveContainer.setScale(this._editorZoom);
    this._level.container.setScale(this._editorZoom);

    this._level.topContainer.x = -this._cameraX;
    this._level.topContainer.y = -this._cameraY;
    this._level.additiveContainer.x = -this._cameraX;
    this._level.additiveContainer.y = -this._cameraY;
    this._level.container.x = -this._cameraX;
    this._level.container.y = -this._cameraY;

    this._cameraXRef._v = this._cameraX;
    this._bg.tilePositionX = this._cameraX * 0.1;
    this._bg.tilePositionY = this._bgInitY + this._cameraY * 0.1;
    this._updateEditorGrid();
    this._updateEditorTimeline();
  }


  _clearEditorPlaytestMarks() {
    if (this._editorPlaytestTrailGfx) {
        this._editorPlaytestTrailGfx.destroy();
        this._editorPlaytestTrailGfx = null;
    }

    if (this._editorPlaytestDeathMarks) {
        for (const mark of this._editorPlaytestDeathMarks) {
            if (mark && mark.destroy) mark.destroy();
        }
    }

    this._editorPlaytestDeathMarks = [];
    this._editorPlaytestLastTrailPoint = null;
    this._editorPlaytestLastTrailPoint2 = null;
  }


  _ensureEditorPlaytestTrail() {
    if (this._editorPlaytestTrailGfx) return this._editorPlaytestTrailGfx;

    const gfx = this.add.graphics();
    gfx.setDepth(100);
    this._level.topContainer.add(gfx);
    this._editorPlaytestTrailGfx = gfx;
    return gfx;
  }


  _drawEditorPlaytestTrailPoint() {
    if (!this._editorPlaytestActive || !this._player) return;

    const drawPointForState = (state, lastKey, color) => {
        if (!state || state.isDead) return;
        const point = {
            x: this._playerWorldX,
            y: b(state.y)
        };

        const last = this[lastKey];
        if (last) {
            const dx = point.x - last.x;
            const dy = point.y - last.y;
            if ((dx * dx) + (dy * dy) >= 2) {
                const gfx = this._ensureEditorPlaytestTrail();
                gfx.lineStyle(2, color, 0.95);
                gfx.lineBetween(last.x, last.y, point.x, point.y);
            }
        }

        this[lastKey] = point;
    };

    drawPointForState(this._state, "_editorPlaytestLastTrailPoint", 0x00ff00);
    if (this._isDual && this._state2 && !this._state2.isDead) {
        drawPointForState(this._state2, "_editorPlaytestLastTrailPoint2", 0x00ffff);
    } else {
        this._editorPlaytestLastTrailPoint2 = null;
    }
  }

  _addEditorPlaytestDeathMark() {
    const x = this._playerWorldX;
    const y = b(this._state.y);
    const size = 28;
    const mark = this.add.graphics();

    mark.setDepth(110);
    mark.lineStyle(13, 0xff0000, 1);
    mark.lineBetween(x - size, y - size, x + size, y + size);
    mark.lineBetween(x - size, y + size, x + size, y - size);

    this._level.topContainer.add(mark);
    if (!this._editorPlaytestDeathMarks) this._editorPlaytestDeathMarks = [];
    this._editorPlaytestDeathMarks.push(mark);
  }


  _resetEditorPlaytestLevelState() {
    this._level.resetObjects();
    this._level.resetGroundState();
    this._level.resetColorTriggers();
    this._level.resetAlphaTriggers();
    this._level.resetRotateTriggers();
    this._level.resetPulseTriggers();
    this._level.resetEnterEffectTriggers();
    this._level.resetSpawnTriggers();
    this._level.resetMoveTriggers();
    this._level.resetVisibility();

    this._colorManager.reset();
    this._level.applyColorChannels(this._colorManager);
    this._bg.setTint(this._colorManager.getHex(fs));
    this._level.setGroundColor(this._colorManager.getHex(gs));
  }


  _refreshEditorCollisionCaches() {
    if (!this._level) return;

    const liveObjectIds = new Set();
    if (Array.isArray(window.levelObjects)) {
        window.levelObjects.forEach((obj, index) => {
            if (!obj || !obj.id) return;
            const linkedId = Number.isInteger(obj._eeObjectId) ? obj._eeObjectId : index;
            liveObjectIds.add(linkedId);
        });
    }

    const sourceColliders = Array.isArray(this._level.objects) ? this._level.objects : [];
    this._level.objects = sourceColliders.filter(collider => {
        if (!collider) return false;
        const objectId = Number.isInteger(collider._eeObjectId) ? collider._eeObjectId : -1;
        return liveObjectIds.has(objectId);
    });

    this._level._collisionSections = [];
    this._level._groupColliders = {};

    for (const collider of this._level.objects) {
        if (!collider) continue;
        if (Number.isInteger(collider._eeObjectId)) {
            const saveObj = this._getEditorSaveObjectForObjectId?.(collider._eeObjectId);
            if (saveObj) this._syncEditorColliderWithSaveObject(collider, saveObj);
        }

        if (collider.type === "portal_teleport" && Number.isInteger(collider._eeObjectId)) {
            const saveObj = this._getEditorSaveObjectForObjectId?.(collider._eeObjectId);
            if (saveObj && parseInt(saveObj.id ?? 0, 10) === 747) {
                const worldX = (parseFloat(saveObj.x ?? saveObj._raw?.[2] ?? saveObj._raw?.["2"] ?? 0) || 0) * 2;
                const worldY = (parseFloat(saveObj.y ?? saveObj._raw?.[3] ?? saveObj._raw?.["3"] ?? 0) || 0) * 2;
                const portalRot = parseFloat(saveObj.rot ?? saveObj._raw?.[6] ?? saveObj._raw?.["6"] ?? 0) || 0;
                const portalRotRad = portalRot * Math.PI / 180;
                const hitboxShift = -30;
                const offsetY = parseFloat(saveObj._raw?.[54] ?? saveObj._raw?.["54"] ?? 90);
                const validOffsetY = Number.isFinite(offsetY) ? offsetY : 90;
                collider.x = worldX - Math.cos(portalRotRad) * hitboxShift;
                collider.y = worldY + Math.sin(portalRotRad) * hitboxShift;
                collider._baseX = collider.x;
                collider._baseY = collider.y;
                collider._origBaseX = collider.x;
                collider._origBaseY = collider.y;
                collider.rotationDegrees = portalRot;
                collider.portalX = worldX;
                collider.portalY = worldY;
                collider.teleportTargetX = worldX;
                collider.teleportTargetY = worldY + validOffsetY * 2;
                collider.teleportYOffset = validOffsetY * 2;
            }
        }

        if (typeof this._level._addCollisionToSection === "function") {
            this._level._addCollisionToSection(collider);
        }

        if (Array.isArray(collider._eeGroups)) {
            for (const groupId of collider._eeGroups) {
                if (!this._level._groupColliders[groupId]) this._level._groupColliders[groupId] = [];
                this._level._groupColliders[groupId].push(collider);
            }
        }
    }
  }


  _getEditorSaveIndexForObjectId(objectId) {
    if (!Array.isArray(window.levelObjects) || !Number.isInteger(objectId)) return -1;

    for (let i = 0; i < window.levelObjects.length; i++) {
        const obj = window.levelObjects[i];
        if (obj && Number.isInteger(obj._eeObjectId) && obj._eeObjectId === objectId) {
            return i;
        }
    }

    const fallback = window.levelObjects[objectId];
    return fallback && fallback.id ? objectId : -1;
  }


  _getEditorSaveObjectForObjectId(objectId) {
    const saveIndex = this._getEditorSaveIndexForObjectId(objectId);
    return saveIndex === -1 ? null : window.levelObjects[saveIndex];
  }


  _getEditorCollidersForObjectId(objectId) {
    if (!Array.isArray(this._level?.objects) || !Number.isInteger(objectId)) return [];
    return this._level.objects.filter(collider => {
        if (!collider) return false;
        return Number.isInteger(collider._eeObjectId) && collider._eeObjectId === objectId;
    });
  }


  _syncEditorColliderWithSaveObject(collider, saveObj) {
    if (!collider || !saveObj) return;

    const worldX = (parseFloat(saveObj.x ?? saveObj._raw?.[2] ?? saveObj._raw?.["2"] ?? 0) || 0) * 2;
    const worldY = (parseFloat(saveObj.y ?? saveObj._raw?.[3] ?? saveObj._raw?.["3"] ?? 0) || 0) * 2;
    const rot = parseFloat(saveObj.rot ?? saveObj._raw?.[6] ?? saveObj._raw?.["6"] ?? 0) || 0;
    const rotRad = rot * Math.PI / 180;

    if (collider.type === "portal_teleport" && parseInt(saveObj.id ?? 0, 10) === 747) {
        const hitboxShift = -30;
        const offsetY = parseFloat(saveObj._raw?.[54] ?? saveObj._raw?.["54"] ?? 90);
        const validOffsetY = Number.isFinite(offsetY) ? offsetY : 90;
        collider.x = worldX - Math.cos(rotRad) * hitboxShift;
        collider.y = worldY + Math.sin(rotRad) * hitboxShift;
        collider.portalX = worldX;
        collider.portalY = worldY;
        collider.teleportTargetX = worldX;
        collider.teleportTargetY = worldY + validOffsetY * 2;
        collider.teleportYOffset = validOffsetY * 2;
    } else {
        collider.x = worldX;
        collider.y = worldY;
        if (collider.portalX !== undefined) collider.portalX = worldX;
        if (collider.portalY !== undefined) collider.portalY = worldY;
    }

    collider.rotation = rot;
    collider.rotationDegrees = rot;
    if (collider.orbId !== undefined) collider.orbRotation = rot;
    collider._baseX = collider.x;
    collider._baseY = collider.y;
    collider._origBaseX = collider.x;
    collider._origBaseY = collider.y;
    collider._baseRotationDegrees = rot;
    collider._origRotationDegrees = rot;
    collider._eeMoveBaseX = collider.x;
    collider._eeMoveBaseY = collider.y;
    collider._eeInitialBaseX = collider.x;
    collider._eeInitialBaseY = collider.y;
    collider._eeInitialRotationDegrees = rot;
  }


  _syncEditorCollidersForObjectId(objectId, saveObj = null) {
    const resolvedSaveObj = saveObj || this._getEditorSaveObjectForObjectId(objectId);
    if (!resolvedSaveObj) return;
    const colliders = this._getEditorCollidersForObjectId(objectId);
    for (const collider of colliders) {
        this._syncEditorColliderWithSaveObject(collider, resolvedSaveObj);
    }
  }


  _hideEditorPlaytestGlowLayers() {
    const hideForPlayer = (player) => {
        if (!player) return;

        const glowLayers = [
            player._playerGlowLayer,
            player._shipGlowLayer,
            player._ballGlowLayer,
            player._waveGlowLayer,
            player._spiderGlowLayer,
            player._robotGlowLayer,
            player._birdGlowLayer
        ];

        if (!window.showEditorGlow) {
            for (const layer of glowLayers) {
                if (layer?.sprite) layer.sprite.setVisible(false);
            }
        }

        if (player._dashAnimationSprite) {
            player._dashAnimationSprite.setVisible(false);
        }
    };

    hideForPlayer(this._player);
    hideForPlayer(this._player2);
  }


  _hideEditorPlaytestPlayer() {
    const hidePlayer = (player) => {
        if (!player) return;
        player.setCubeVisible(false);
        player.setShipVisible(false);
        player.setBallVisible(false);
        player.setWaveVisible(false);
        player.setBirdVisible(false);
        player.setSpiderVisible(false);
        player.setRobotVisible(false);
        player._hitboxTrail = [];
        if (player._hitboxGraphics?.clear) player._hitboxGraphics.clear();
    };

    hidePlayer(this._player);
    hidePlayer(this._player2);
    this._hideEditorPlaytestGlowLayers();
  }


  _syncEditorPlaytestPlayerVisual(deltaSeconds = 0) {
    if (!this._editorPlaytestActive || !this._player || this._state.isDead) return;

    const zoom = this._editorZoom || 1;
    const playerScreenX = (this._playerWorldX * zoom) - this._cameraX;
    const playerScreenY = (b(this._state.y) * zoom) - this._cameraY;
    const playerScreenYCameraOffset = (b(this._state.y) * (zoom - 1)) - this._cameraY;

    this._player.syncSprites(
        this._cameraX,
        playerScreenYCameraOffset,
        deltaSeconds,
        this._getMirrorXOffset(playerScreenX)
    );

    if (this._isDual && this._player2 && !this._state2.isDead) {
        this._player2.syncSprites(
            this._cameraX,
            (b(this._state2.y) * (zoom - 1)) - this._cameraY,
            deltaSeconds,
            this._getMirrorXOffset(playerScreenX)
        );
    }

    if (zoom !== 1) {
        const scalePlayer = (player, anchorY) => {
            for (const layer of (player?._allLayers || [])) {
                if (!layer?.sprite) continue;
                layer.sprite.x = playerScreenX + ((layer.sprite.x - playerScreenX) * zoom);
                layer.sprite.y = anchorY + ((layer.sprite.y - anchorY) * zoom);
                layer.sprite.scaleX *= zoom;
                layer.sprite.scaleY *= zoom;
            }
            if (player?._dashAnimationSprite) {
                player._dashAnimationSprite.x = playerScreenX + ((player._dashAnimationSprite.x - playerScreenX) * zoom);
                player._dashAnimationSprite.y = anchorY + ((player._dashAnimationSprite.y - anchorY) * zoom);
                player._dashAnimationSprite.scaleX *= zoom;
                player._dashAnimationSprite.scaleY *= zoom;
            }
        };

        scalePlayer(this._player, playerScreenY);
        if (this._isDual && this._player2 && !this._state2.isDead) {
            scalePlayer(this._player2, (b(this._state2.y) * zoom) - this._cameraY);
        }
    }

    this._hideEditorPlaytestGlowLayers();
  }


  _getLatestEditorStartPosition() {
    const positions = [];

    if (Array.isArray(window.levelObjects)) {
        window.levelObjects.forEach((obj, index) => {
            if (!obj || !this._isEditorStartPositionId(obj.id)) return;

            const raw = obj._raw || {};
            const x = Number(raw["2"] ?? obj.x ?? 0);
            const y = Number(raw["3"] ?? obj.y ?? 30);
            const objectId = Number.isInteger(obj._eeObjectId) ? obj._eeObjectId : index;

            positions.push({
                x: Number.isFinite(x) ? x * 2 : 0,
                y: Number.isFinite(y) ? y * 2 : 30,
                gameMode: this._getEditorStartPositionValue(obj, "kA2", 0),
                miniMode: this._getEditorStartPositionValue(obj, "kA3", 0),
                speed: this._getEditorStartPositionValue(obj, "kA4", 0),
                dualMode: this._getEditorStartPositionValue(obj, "kA8", 0),
                mirrored: 0,
                gravityFlipped: this._getEditorStartPositionValue(obj, "kA11", obj.flipGravity ? 1 : 0) === 1,
                _editorObjectId: objectId,
                _editorSaveIndex: index
            });
        });
    }

    if (!Array.isArray(window.levelObjects) && !positions.length && this._level?.getStartPositions) {
        const levelPositions = this._level.getStartPositions();
        if (Array.isArray(levelPositions)) {
            positions.push(...levelPositions.map((pos, index) => ({
                ...pos,
                mirrored: 0,
                _editorObjectId: Number.isInteger(pos?._editorObjectId) ? pos._editorObjectId : index,
                _editorSaveIndex: index
            })));
        }
    }

    positions.sort((a, b) => ((a.x || 0) - (b.x || 0)) || ((a._editorObjectId || 0) - (b._editorObjectId || 0)) || ((a._editorSaveIndex || 0) - (b._editorSaveIndex || 0)));
    return positions.length ? positions[positions.length - 1] : null;
  }


  _applyEditorPlaytestStartPosition(pos) {
    if (!pos) {
        this._applyEditorPlaytestStartMode();
        return;
    }

    const startPosY = Number.isFinite(Number(pos.y)) ? Number(pos.y) : 30;
    this._playerWorldX = pos.x || 0;
    this._state.y = startPosY;
    this._state.lastY = startPosY;
    this._state.lastGroundPosY = startPosY;
    this._state.onGround = true;
    this._state.canJump = true;
    this._player.setCubeVisible(true);

    const speedValues = [
        SpeedPortal.ONE_TIMES,
        SpeedPortal.HALF,
        SpeedPortal.TWO_TIMES,
        SpeedPortal.THREE_TIMES,
        SpeedPortal.FOUR_TIMES
    ];
    playerSpeed = speedValues[parseInt(pos.speed ?? 0, 10)] || SpeedPortal.ONE_TIMES;

    const gamemode = parseInt(pos.gameMode ?? 0, 10);
    if (gamemode == 1) {
        this._player.enterShipMode();
    } else if (gamemode == 2) {
        this._state.y = startPosY;
        this._player.enterBallMode({ y: startPosY });
    } else if (gamemode == 3) {
        this._player.enterUfoMode();
    } else if (gamemode == 4) {
        this._player.enterWaveMode();
    } else if (gamemode == 5) {
        this._player.enterRobotMode();
    } else if (gamemode == 6) {
        this._player.enterSpiderMode();
    }

    this._state.isMini = parseInt(pos.miniMode ?? 0, 10) === 1;
    this._state.gravityFlipped = !!pos.gravityFlipped;
    this._state.mirrored = false;
    this._state2.mirrored = false;

    if (parseInt(pos.dualMode ?? 0, 10) === 1) {
        this._enableDualMode();
        this._state2.mirrored = false;
    }

    this._level.fastForwardTriggers(pos.x || 0, this._colorManager);
    if (this._player) {
        this._player._lastCollisionWorldX = Number.isFinite(Number(this._playerWorldX)) ? Number(this._playerWorldX) : null;
        this._player._lastCollisionWorldY = startPosY;
    }
    this._level.applyColorChannels(this._colorManager);
    this._bg.setTint(this._colorManager.getHex(fs));
    this._level.setGroundColor(this._colorManager.getHex(gs));
    this._hideEditorPlaytestGlowLayers();
    this._refreshEditorPlaytestGlowVisibility();
  }


  _applyEditorPlaytestStartMode() {
    let speedKey = parseInt(window.settingsMap?.["kA4"] || "0", 10);
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

    const gamemode = parseInt(window.settingsMap?.["kA2"] || "0", 10);
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

    const getBool = (key) => parseInt(window.settingsMap?.[key] || "0", 10) === 1;
    this._state.isMini = getBool("kA3");
    this._state.gravityFlipped = getBool("kA11");
    this._state.mirrored = false;

    if (getBool("kA8")) {
        this._enableDualMode();
        this._state2.mirrored = false;
    }

    this._hideEditorPlaytestGlowLayers();
    this._refreshEditorPlaytestGlowVisibility();
  }


  _startEditorPlaytest() {
    if (this._editorPlaytestActive) return;

    this._closeEditorLevelSettingsPopup();
    this._closeEditorHorizontalOptionPopup();
    this._closeEditorColorPickerPopup();
    this._closeEditorStartOptionsPopup();
    this._closeEditorObjectOptionsPopup();
    this._clearEditorSelection();
    this._clearEditorPlaytestMarks();
    this._refreshEditorCollisionCaches();

    this._editorPlaytestSavedView = {
        zoom: this._editorZoom || 1,
        cameraX: this._cameraX || 0,
        cameraY: this._cameraY || 0
    };
    this._editorPlaytestPauseView = null;

    this._editorPlaytestActive = true;
    this._editorPlaytestPaused = false;
    this._spaceWasDown = !!this.input.activePointer?.isDown;
    this._deltaBuffer = 0;
    this._physicsFrame = 0;
    this._playerWorldX = 0;
    this._cameraX = -centerX;
    this._cameraY = 0;
    this._cameraXRef._v = this._cameraX;
    this._prevCameraX = this._cameraX;

    this._resetEditorPlaytestLevelState();
    this._state.reset();
    this._player.reset();
    this._isDual = false;
    this._state2.reset();
    this._player2.reset();
    this._player2.setInvertedColors?.(true);
    this._player2.setCubeVisible(false);
    this._player2.setShipVisible(false);
    this._player2.setBallVisible(false);
    this._player2.setWaveVisible(false);
    this._player2.setBirdVisible(false);
    this._player2.setSpiderVisible(false);
    this._player2.setRobotVisible(false);

    this._state.y = 30;
    this._state.onGround = true;
    this._state.canJump = true;
    this._player.setCubeVisible(true);

    const editorStartPos = this._getLatestEditorStartPosition();
    const editorStartMusicOffset = editorStartPos && this._level?.getSongOffsetForX
        ? this._level.getSongOffsetForX(editorStartPos.x || 0, { sourceObjects: window.levelObjects })
        : 0;
    if (editorStartPos) {
        this._applyEditorPlaytestStartPosition(editorStartPos);
    } else {
        this._applyEditorPlaytestStartMode();
        this._state.mirrored = false;
        this._state2.mirrored = false;
    }

    this._bg.setFlipX(false);
    this._updateEditorPlaytestCameraY(0, true);
    const editorStartCameraX = editorStartPos ? ((this._playerWorldX || 0) - centerX) : -centerX;
    this._setEditorZoomInstant(1, editorStartCameraX, this._cameraY);
    this._cameraXRef._v = this._cameraX;
    this._prevCameraX = this._cameraX;
    this._refreshEditorPlaytestGlowVisibility();
    this._audio.reset();
    this._audio.startMusic(editorStartMusicOffset);
    this._setEditorPlaytestGuiVisible(false);
    this._refreshEditorPlaytestControls();
    this._drawEditorPlaytestTrailPoint();
  }


  _toggleEditorPlaytestPause() {
    if (!this._editorPlaytestActive) return;

    if (!this._editorPlaytestPaused) {
        this._editorPlaytestPauseView = {
            zoom: this._editorZoom || 1,
            cameraX: this._cameraX || 0,
            cameraY: this._cameraY || 0
        };
        this._editorPlaytestPaused = true;
        this._audio.pauseMusic();
        this._setEditorPlaytestGuiVisible(true);
        this._setEditorLevelSectionsFullyVisible();
        this._refreshEditorPlaytestControls();
        return;
    }

    const resumeView = this._editorPlaytestPauseView || {
        zoom: 1,
        cameraX: this._playerWorldX - centerX,
        cameraY: this._cameraY || 0
    };

    this._editorPlaytestPaused = false;
    this._setEditorPlaytestGuiVisible(false);
    this._setEditorZoomInstant(resumeView.zoom || 1, resumeView.cameraX || 0, resumeView.cameraY || 0);
    this._cameraXRef._v = this._cameraX;
    this._prevCameraX = this._cameraX;
    this._resetEditorPlaytestSectionCulling();
    this._editorPlaytestPauseView = null;
    this._audio.resumeMusic();
    this._syncEditorPlaytestPlayerVisual(0);
    this._refreshEditorPlaytestControls();
  }


  _stopEditorPlaytest(leaveDeathMark = false) {
    if (!this._editorPlaytestActive) return;

    if (leaveDeathMark) {
        this._addEditorPlaytestDeathMark();
    }

    this._editorPlaytestActive = false;
    this._editorPlaytestPaused = false;
    this._spaceWasDown = false;
    this._deltaBuffer = 0;

    this._audio.reset();
    this._hideEditorPlaytestPlayer();
    this._resetEditorPlaytestLevelState();
    this._refreshEditorPlaytestGlowVisibility();

    const savedView = this._editorPlaytestSavedView;
    const currentZoom = this._editorZoom || 1;
    const restoreZoom = savedView?.zoom || currentZoom;
    const worldCenterX = (this._cameraX + centerX) / currentZoom;
    const worldCenterY = (this._cameraY + (screenHeight / 2)) / currentZoom;
    const restoredCameraX = (worldCenterX * restoreZoom) - centerX;
    const restoredCameraY = (worldCenterY * restoreZoom) - (screenHeight / 2);

    this._editorPlaytestSavedView = null;
    this._editorPlaytestPauseView = null;
    this._setEditorZoomInstant(restoreZoom, restoredCameraX, restoredCameraY);
    this._setEditorLevelSectionsFullyVisible();

    this._setEditorPlaytestGuiVisible(true);
    this._refreshEditorPlaytestControls();
  }


  _editorPlaytestPress() {
    if (this._state.isDead) return;

    this._state.upKeyDown = true;
    this._state.upKeyPressed = true;
    this._state.queuedHold = true;
    if (this._isDual && this._state2 && !this._state2.isDead) {
        this._state2.upKeyDown = true;
        this._state2.upKeyPressed = true;
        this._state2.queuedHold = true;
    }

    const primaryGravityBefore = !!this._state.gravityFlipped;
    if (!this._state.isFlying && !this._state.isWave && !this._state.isUfo && this._state.canJump) {
        this._player.updateJump(0);
    } else if (this._state.isUfo) {
        this._player.updateJump(0);
    }
    const primaryGravityChanged = this._isDual && !!this._state.gravityFlipped !== primaryGravityBefore;
    let primaryGravitySynced = false;
    if (primaryGravityChanged) {
        primaryGravitySynced = this._syncDualGlobalsFromPrimary?.({
            skipBallInputGravity: this._state.isBall,
            skipSpiderInputGravity: this._state.isSpider
        }) || false;
    }

    if (this._isDual && this._player2 && this._state2 && !this._state2.isDead) {
        if (this._shouldSuppressDualGravityAction?.(this._state2, primaryGravitySynced)) {
            this._state2.upKeyPressed = false;
            this._state2.queuedHold = false;
        }
        const secondaryGravityBefore = !!this._state2.gravityFlipped;
        const secondaryBallInputGravity = this._state2.isBall && this._state2.upKeyPressed;
        const secondarySpiderInputGravity = this._state2.isSpider && this._state2.upKeyPressed;
        if (!this._state2.isFlying && !this._state2.isWave && !this._state2.isUfo && this._state2.canJump) {
            this._player2.updateJump(0);
        } else if (this._state2.isUfo) {
            this._player2.updateJump(0);
        }
        if (!!this._state2.gravityFlipped !== secondaryGravityBefore) {
            this._syncDualGlobalsFromSecondary?.({
                skipBallInputGravity: secondaryBallInputGravity,
                skipSpiderInputGravity: secondarySpiderInputGravity
            });
        }
    }
  }


  _editorPlaytestRelease() {
    this._state.upKeyDown = false;
    this._state.upKeyPressed = false;
    this._state.queuedHold = false;
    this._state2.upKeyDown = false;
    this._state2.upKeyPressed = false;
    this._state2.queuedHold = false;
  }


  _updateEditorPlaytestInput() {
    const pointer = this.input.activePointer;
    const hitObjects = this.input.hitTestPointer(pointer);
    const overPlaytestControls = hitObjects.some(obj =>
        obj === this._editorPlaytestPauseBtn ||
        obj === this._editorPlaytestStopBtn ||
        obj === this._editorPlaytestPlayBtn
    );
    const pointerHeld = pointer.isDown && !overPlaytestControls;
    const jumpHeld = this._spaceKey.isDown || this._upKey.isDown || this._wKey.isDown || this._lKey.isDown || pointerHeld;

    if (jumpHeld && !this._spaceWasDown) {
        this._editorPlaytestPress();
    } else if (!jumpHeld && this._spaceWasDown) {
        this._editorPlaytestRelease();
    }

    this._spaceWasDown = jumpHeld;
  }


  _updateEditorPlaytest(deltaTime) {
    if (!this._editorPlaytestActive || this._editorPlaytestPaused) return;

    this._updateEditorPlaytestInput();
    this._audio.update(deltaTime / 1000);
    this._state.mirrored = false;
    this._state2.mirrored = false;
    this._bg.setFlipX(false);
    this._refreshEditorPlaytestGlowVisibility();
    this._level.updateEndPortalY(-this._cameraY, this._state.isFlying || this._state.isWave || this._state.isUfo);

    let quantizedDelta = this._quantizeDelta(deltaTime);
    let subSteps = quantizedDelta > 0 ? Math.max(1, Math.round(quantizedDelta * 4)) : 0;
    if (subSteps > 60) subSteps = 60;

    const subStepDelta = subSteps > 0 ? quantizedDelta / subSteps : 0;
    const verticalDelta = subStepDelta * d;
    const horizontalDelta = subStepDelta * playerSpeed * d;
    const previousNoClip = window.noClip;

    window.noClip = false;

    try {
        for (let i = 0; i < subSteps; i++) {
            this._state.lastY = this._state.y;
            this._physicsFrame++;
            const dualInputState = {
                upKeyDown: this._state.upKeyDown,
                upKeyPressed: this._state.upKeyPressed,
                queuedHold: this._state.queuedHold
            };
            const primaryGravityBefore = !!this._state.gravityFlipped;
            const primarySharedBefore = this._getDualSharedSignature?.(this._state);
            this._player.updateJump(verticalDelta);
            this._state.y += this._state.yVelocity * verticalDelta;
            this._player.checkCollisions(this._playerWorldX - centerX);
            const primaryGravityChanged = this._isDual && !!this._state.gravityFlipped !== primaryGravityBefore;
            let primaryGravitySynced = false;
            if (this._isDual && primarySharedBefore !== undefined && this._getDualSharedSignature?.(this._state) !== primarySharedBefore) {
                primaryGravitySynced = this._syncDualGlobalsFromPrimary?.({
                    skipBallInputGravity: primaryGravityChanged && this._state.isBall && dualInputState.upKeyPressed,
                    skipSpiderInputGravity: primaryGravityChanged && this._state.isSpider && dualInputState.upKeyPressed
                }) || false;
            }

            if (this._isDual && this._state.isDead && !this._state2.isDead) {
                this._player2.killPlayer();
            }

            this._playerWorldX += horizontalDelta;

            if (this._isDual && !this._state2.isDead) {
                this._copyDualInputFlags?.(dualInputState, this._state2);
                if (this._shouldSuppressDualGravityAction?.(this._state2, primaryGravitySynced)) {
                    this._state2.upKeyPressed = false;
                    this._state2.queuedHold = false;
                }
                this._state2.lastY = this._state2.y;
                const secondarySharedBefore = this._getDualSharedSignature?.(this._state2);
                const secondaryBallInputGravity = this._state2.isBall && this._state2.upKeyPressed;
                const secondarySpiderInputGravity = this._state2.isSpider && this._state2.upKeyPressed;
                this._player2.updateJump(verticalDelta);
                this._state2.y += this._state2.yVelocity * verticalDelta;
                this._player2.checkCollisions(this._playerWorldX - centerX - horizontalDelta);
                if (this._isDual && !this._state2.isDead && secondarySharedBefore !== undefined && this._getDualSharedSignature?.(this._state2) !== secondarySharedBefore) {
                    this._syncDualGlobalsFromSecondary?.({
                        skipBallInputGravity: secondaryBallInputGravity,
                        skipSpiderInputGravity: secondarySpiderInputGravity
                    });
                }
                this._resolveDualBallOverlap?.();
                if (this._state2.isDead && !this._state.isDead) {
                    this._player.killPlayer();
                }
                if (this._state.isDead && !this._state2.isDead) {
                    this._player2.killPlayer();
                }
                this._ensureDualFlyBounds?.();
            }

            if (this._state.isDead) break;

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

            if (this._isDual && !this._state2.isDead && !this._state2.isFlying && !this._state2.isWave && !this._state2.isUfo) {
                if (this._state2.isBall) {
                    const ball2OnSurface = this._state2.onGround || this._state2.onCeiling;
                    this._player2.updateBallRoll(horizontalDelta, ball2OnSurface);
                } else if (this._state2.onGround) {
                    this._player2.updateGroundRotation(verticalDelta);
                } else if (this._player2.rotateActionActive) {
                    this._player2.updateRotateAction(u);
                } else if (this._state2.isDashing) {
                    this._player2.updateDashRotation(u);
                }
            }

            if (!this._player._hitboxTrail) this._player._hitboxTrail = [];
            if (!this._state.isDead) {
                const trailSize = this._state.isMini ? 18 : 30;
                this._player._hitboxTrail.push({ x: this._playerWorldX, y: this._state.y, rotation: this._player._rotation, size: trailSize, isWave: this._state.isWave });
                if (this._player._hitboxTrail.length > 180) this._player._hitboxTrail.shift();
            }
            if (this._isDual && !this._state2.isDead) {
                if (!this._player2._hitboxTrail) this._player2._hitboxTrail = [];
                const trailSize2 = this._state2.isMini ? 18 : 30;
                this._player2._hitboxTrail.push({ x: this._playerWorldX, y: this._state2.y, rotation: this._player2._rotation, size: trailSize2, isWave: this._state2.isWave });
                if (this._player2._hitboxTrail.length > 180) this._player2._hitboxTrail.shift();
            }
        }
    } finally {
        window.noClip = previousNoClip;
    }

    if (this._state.isDead) {
        this._drawEditorPlaytestTrailPoint();
        this._stopEditorPlaytest(true);
        return;
    }

    this._state.ignorePortals = false;
    this._state2.ignorePortals = false;

    this._cameraX = this._playerWorldX - centerX;
    this._updateEditorPlaytestCameraY(quantizedDelta);
    this._cameraXRef._v = this._cameraX;

    this._level.additiveContainer.x = -this._cameraX;
    this._level.additiveContainer.y = -this._cameraY;
    this._level.container.x = -this._cameraX;
    this._level.container.y = -this._cameraY;
    this._level.topContainer.x = -this._cameraX;
    this._level.topContainer.y = -this._cameraY;

    const playerX = this._playerWorldX;
    const applyColorTrigger = (colorTrigger) => {
        this._colorManager.triggerColor(colorTrigger.index, colorTrigger.color, colorTrigger.duration);
        if (colorTrigger.tintGround) {
            this._colorManager.triggerColor(gs, colorTrigger.color, colorTrigger.duration);
        }
    };
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
    this._level.stepMoveTriggers(deltaTime / 1000);
    this._level.stepSpawnTriggers(deltaTime / 1000, this._colorManager);
    this._level.checkAlphaTriggers(playerX);
    this._level.stepAlphaTriggers(deltaTime / 1000);
    this._level.checkRotateTriggers(playerX);
    this._level.stepRotateTriggers(deltaTime / 1000);
    this._level.checkPulseTriggers(playerX);
    this._level.stepPulseTriggers(deltaTime / 1000, this._colorManager);
    this._colorManager.step(deltaTime / 1000);
    this._level.stepGroundAnimation(deltaTime / 1000);
    this._level.applyColorChannels(this._colorManager);
    this._bg.setTint(this._colorManager.getHex(fs));
    this._level.setGroundColor(this._colorManager.getHex(gs));
    this._level.updateVisibility(this._cameraX);
    this._level.updateObjectDebugIds();
    this._refreshEditorPlaytestGlowVisibility();

    if (this._state.isFlying) {
        this._player.updateShipRotation(quantizedDelta);
    }
    if (this._isDual && this._state2.isFlying && !this._state2.isDead) {
        this._player2.updateShipRotation(quantizedDelta);
    }

    this._syncEditorPlaytestPlayerVisual(deltaTime / 1000);
    this._drawEditorPlaytestTrailPoint();
    this._updateEditorPlaytestBackground();
  }


  _adjustZoom(delta, anchorX = screenWidth / 2, anchorY = screenHeight / 2) {
    if (this._editorPlaytestActive && !this._editorPlaytestPaused) return;

    const oldZoom = this._editorZoom;
    let newZoom = oldZoom + delta;
    newZoom = Phaser.Math.Clamp(newZoom, 0.1, 4.0);
    if (oldZoom === newZoom) return;
    const worldAnchorX = (this._cameraX + anchorX) / oldZoom;
    const worldAnchorY = (this._cameraY + anchorY) / oldZoom;
    this._editorZoom = newZoom;
    this._level.topContainer.setScale(newZoom);
    this._level.additiveContainer.setScale(newZoom);
    this._level.container.setScale(newZoom);
    this._cameraX = (worldAnchorX * newZoom) - anchorX;
    this._cameraY = (worldAnchorY * newZoom) - anchorY;
    this._updateEditorGrid();
    this._zoomText.setText(`Zoom: ${newZoom.toFixed(2)}x`);
    this._zoomText.setAlpha(1);
    this.tweens.killTweensOf(this._zoomText);
    this.tweens.add({
        targets: this._zoomText,
        alpha: 0,
        duration: 500,
        delay: 500,
        ease: 'Power1'
    });
  }


  _updateTabVisuals() {
    Object.keys(this._tabButtons).forEach(id => {
        const isSelected = this._editorTab === id;
        const btn = this._tabButtons[id];
        let frameName = btn.frame.name.replace("SBtn", "Btn");
        if (isSelected) {
            frameName = frameName.replace("Btn", "SBtn");
        }
        btn.setFrame(frameName);
    });
  }


  _getSheetForFrameThingy(frameName) {
    const sheets = ["GJ_WebSheet", "GJ_GameSheet", "GJ_GameSheet02", "GJ_GameSheet03", "GJ_GameSheet04", "GJ_GameSheetEditor"];
    for (const key of sheets) {
        if (this.textures.exists(key) && this.textures.get(key).has(frameName)) {
            return key;
        }
    }
  }


  _getTextureRefForFrameThingy(frameName) { // getSheetForFrameThingy: the sequel
    const sheets = ["GJ_WebSheet", "GJ_GameSheet", "GJ_GameSheet02", "GJ_GameSheet03", "GJ_GameSheet04", "GJ_GameSheetEditor"];
    for (const key of sheets) {
        if (this.textures.exists(key) && this.textures.get(key).has(frameName)) {
            return {
                key,
                frame: frameName
            };
        }
    }
    if (this.textures.exists(frameName)) {
        return {
            key: frameName,
            frame: null
        };
    }
    return null;
  }


  _createEditorObjectButtonPreview(x, y, objId) {
    const objectDef = getObjectFromId(objId);
    if (!objectDef) return null;

    let frameName = objectDef.frame;

    if (objectDef.randomFrames && objectDef.randomFrames.length) {
        frameName = objectDef.randomFrames[0];
    }

    if (!frameName && objectDef.textObject) {
        const preview = this.add.container(x, y);
        let label = this.add.bitmapText(-3, -3, "bigFont", "A", 60).setOrigin(0.5);
        preview.add(label);
        preview.setScale(0.85);
        return preview;
    }

    if (!frameName) return null;

    const previewObj = {
        id: objId,
        x: 0,
        y: 0,
        flipX: false,
        flipY: false,
        rot: 0,
        scale: 1,
        zLayer: objectDef.default_z_layer || 0,
        zOrder: objectDef.default_z_order || 0,
        groups: "",
        color1: 0,
        color2: 0,
        _raw: {}
    };

    const preview = this.add.container(x, y);
    const sprites = [];

    const addPreviewSprite = (frame, localX = 0, localY = 0, colorData = null, previewDepth = 0, extra = {}) => {
        const tex = this._getTextureRefForFrameThingy(frame);
        if (!tex) return null;

        const spr = tex.frame
            ? this.add.image(localX, localY, tex.key, tex.frame)
            : this.add.image(localX, localY, tex.key);

        if (!spr) return null;

        if (this._level && this._level._applyVisualProps) {
            this._level._applyVisualProps(this, spr, frame, previewObj, colorData);
        }

        if (extra.blendMode !== undefined) {
            spr.setBlendMode(extra.blendMode);
        }

        if (extra.tint !== undefined) {
            spr.setTint(extra.tint);
        }

        if (extra.rotationOffset !== undefined) {
            spr.rotation += extra.rotationOffset;
        }

        spr._editorPreviewDepth = previewDepth;
        sprites.push(spr);

        return spr;
    };

    const isPortalFront =
        (objectDef.type === portalType || objectDef.type === speedType) &&
        frameName.includes("_front_");

    let portalBackSprite = null;

    if (isPortalFront) {
        const backFrame = frameName.replace("_front_", "_back_");
        if (this._getTextureRefForFrameThingy(backFrame)) {
            portalBackSprite = addPreviewSprite(backFrame, 0, 0, null, -0.005);
        }
    }

    let glowSprite = null;

    if (
        false &&
        objectDef.glow &&
        this._level &&
        this._level._getGlowFrameName
    ) {
        const glowFrame = this._level._getGlowFrameName(frameName);

        if (glowFrame && this._getTextureRefForFrameThingy(glowFrame)) {
            glowSprite = addPreviewSprite(glowFrame, 0, 0, null, -0.003, {
                blendMode: S
            });
        }
    }

    const visualDef = isPortalFront
        ? {
            ...objectDef,
            _portalFront: true
        }
        : objectDef;

    const mainSprite = addPreviewSprite(frameName, 0, 0, visualDef, 0);

    if (mainSprite && portalBackSprite) {
        portalBackSprite.x = mainSprite.x;
        portalBackSprite.y = mainSprite.y;
    }

    if (objectDef.type === ringType) {
        if (mainSprite) mainSprite.setScale(0.75);
        if (glowSprite) glowSprite.setScale(0.75);
    }

    if (frameName.indexOf("sawblade") >= 0 && mainSprite) {
        mainSprite.setTint(0x000000);

        const sawMirror = addPreviewSprite(frameName, 0, 0, objectDef, 0.001, {
            tint: 0x000000,
            rotationOffset: Math.PI
        });

        if (sawMirror) {
            sawMirror.x = mainSprite.x;
            sawMirror.y = mainSprite.y;
        }
    }

    if (objectDef.type === solidType || objectDef.type === hazardType) {
        const overlayFrame = frameName.replace("_001.png", "_2_001.png");

        if (this._getTextureRefForFrameThingy(overlayFrame)) {
            addPreviewSprite(overlayFrame, 0, 0, null, 0.002);
        }
    }

    if (objectDef.children) {
        for (const childDef of objectDef.children) {
            let childDx = childDef.dx || 0;
            let childDy = childDef.dy || 0;

            if (childDef.localDx !== undefined || childDef.localDy !== undefined) {
                let localDx = childDef.localDx || 0;
                let localDy = childDef.localDy || 0;

                if (previewObj.flipX) localDx = -localDx;
                if (previewObj.flipY) localDy = -localDy;

                const rot = (previewObj.rot || 0) * Math.PI / 180;

                childDx = localDx * Math.cos(rot) - localDy * Math.sin(rot);
                childDy = localDx * Math.sin(rot) + localDy * Math.cos(rot);
            }

            const childDepth =
                (childDef.z !== undefined ? childDef.z : -1) < 0
                    ? -0.003
                    : 0.001;

            const childSprite = addPreviewSprite(
                childDef.frame,
                childDx,
                childDy,
                childDef,
                childDepth
            );

            if (childSprite && childDef.audioScale) {
                childSprite.setScale(0.1);
                childSprite.setAlpha(0.9);
            }

            if (frameName.indexOf("sawblade") >= 0 && childSprite) {
                childSprite.setTint(0x000000);

                const childMirror = addPreviewSprite(
                    childDef.frame,
                    childDx,
                    childDy,
                    childDef,
                    childDepth + 0.001,
                    {
                        tint: 0x000000,
                        rotationOffset: Math.PI
                    }
                );

                if (childMirror) {
                    childMirror.x = childSprite.x;
                    childMirror.y = childSprite.y;
                }
            }
        }
    }

    if (!sprites.length) {
        preview.destroy();
        return null;
    }

    sprites.sort((a, b) => {
        return (a._editorPreviewDepth || 0) - (b._editorPreviewDepth || 0);
    });

    preview.add(sprites);

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const spr of sprites) {
        const displayW = spr.displayWidth || spr.width || 1;
        const displayH = spr.displayHeight || spr.height || 1;

        const left = spr.x - displayW * spr.originX;
        const right = spr.x + displayW * (1 - spr.originX);
        const top = spr.y - displayH * spr.originY;
        const bottom = spr.y + displayH * (1 - spr.originY);

        minX = Math.min(minX, left);
        maxX = Math.max(maxX, right);
        minY = Math.min(minY, top);
        maxY = Math.max(maxY, bottom);
    }

    const visualW = Math.max(1, maxX - minX);
    const visualH = Math.max(1, maxY - minY);

    const targetSize = 64;
    const maxDim = Math.max(visualW, visualH);
    const scaleMultiplier = targetSize / maxDim;

    preview.setScale(Math.min(scaleMultiplier, 0.6));

    return preview;
  }


  _buildObjectGrid() {
    if (this._gridContainer) this._gridContainer.destroy();
    if (this._pageDotsContainer) this._pageDotsContainer.destroy();
    if (this._categoryContainer) this._categoryContainer.destroy();

    const OBJECT_CATEGORIES = [
        { id: "blocks",  icon: "tab1", types: ["solid", "slope"] },
        { id: "hazards", icon: "tab2", types: ["hazard", "spike"] },
        { id: "orbs",    icon: "tab3", types: ["ring", "pad", "portal", "speed"] },
        { id: "deco",    icon: "tab4", types: ["deco"] },
        { id: "triggers",icon: "tab5", types: ["trigger"] },
    ];

    this._gridContainer = this.add.container(0, 0);
    this._toolbox.add(this._gridContainer);
    
    const allObjectsData = window.allobjects();
    const itemsForGrid = [];
    this._currentBuildCategory = this._currentBuildCategory || "blocks";

    if (this._editorTab === "build") {
        this._categoryContainer = this.add.container(screenWidth / 2, screenHeight - 218);
        this._toolbox.add(this._categoryContainer);
        const catSpacing = 85;
        const catStartX = -((OBJECT_CATEGORIES.length - 1) * catSpacing) / 2;
        OBJECT_CATEGORIES.forEach((cat, i) => {
            const isSelected = this._currentBuildCategory === cat.id;
            const btn = this.add.image(catStartX + (i * catSpacing), 0, cat.icon).setInteractive().setScale(0.12).setTint(isSelected ? 0x888888 : 0xffffff).setAlpha(isSelected ? 1 : 0.33);
            this._categoryContainer.add(btn);
            this._makeBouncyButton(btn, 0.12, () => {
                this._currentBuildCategory = cat.id;
                this._editorPage = 0;
                this._buildObjectGrid();
            });
        });
        const activeCatDef = OBJECT_CATEGORIES.find(c => c.id === this._currentBuildCategory);
        for (let i = 1; i <= this._totalIds; i++) {
            if (i === 749) continue;
            const def = getObjectFromId(i);
            const rawDef = allObjectsData[String(i)]; 
            
            if (def && rawDef) {
                if (activeCatDef.types.includes(rawDef.type)) {
                    itemsForGrid.push({ type: "object", id: i, frame: def.frame });
                }
            }
        }
    } else if (this._editorTab === "edit") {
        const moveActions = [
            { dx: 0, dy: -3, icon: "edit_upBtn_001.png", angle: 0, scale: 1, flipX: false },
            { dx: 0, dy: 3,  icon: "edit_upBtn_001.png", angle: 180, scale: 1, flipX: false },
            { dx: -3, dy: 0, icon: "edit_upBtn_001.png", angle: 270, scale: 1, flipX: false },
            { dx: 3, dy: 0,  icon: "edit_upBtn_001.png", angle: 90, scale: 1, flipX: false },

            { dx: 0, dy: -60, icon: "edit_upBtn2_001.png", angle: 0, scale: 1, flipX: false },
            { dx: 0, dy: 60,  icon: "edit_upBtn2_001.png", angle: 180, scale: 1, flipX: false },
            { dx: -60, dy: 0, icon: "edit_upBtn2_001.png", angle: 270, scale: 1, flipX: false },
            { dx: 60, dy: 0,  icon: "edit_upBtn2_001.png", angle: 90, scale: 1, flipX: false },

            { dx: 0, dy: -300, icon: "edit_upBtn3_001.png", angle: 0, scale: 1, flipX: false },
            { dx: 0, dy: 300,  icon: "edit_upBtn3_001.png", angle: 180, scale: 1, flipX: false },
            { dx: -300, dy: 0, icon: "edit_upBtn3_001.png", angle: 270, scale: 1, flipX: false },
            { dx: 300, dy: 0,  icon: "edit_upBtn3_001.png", angle: 90, scale: 1, flipX: false },

            { dx: 0, dy: -1, icon: "edit_upBtn_001.png", angle: 0, scale: 0.7, flipX: false },
            { dx: 0, dy: 1,  icon: "edit_upBtn_001.png", angle: 180, scale: 0.7, flipX: false },
            { dx: -1, dy: 0, icon: "edit_upBtn_001.png", angle: 270, scale: 0.7, flipX: false },
            { dx: 1, dy: 0,  icon: "edit_upBtn_001.png", angle: 90, scale: 0.7, flipX: false },

            { dx: 0, dy: -30, icon: "edit_upBtn5_001.png", angle: 0, scale: 1, flipX: false },
            { dx: 0, dy: 30,  icon: "edit_upBtn5_001.png", angle: 180, scale: 1, flipX: false },
            { dx: -30, dy: 0, icon: "edit_upBtn5_001.png", angle: 270, scale: 1, flipX: false },
            { dx: 30, dy: 0,  icon: "edit_upBtn5_001.png", angle: 90, scale: 1, flipX: false }
        ];
        moveActions.forEach(a => itemsForGrid.push({ type: "action", subType: "move", ...a }));

        const flipActions = [
            { axis: "x", icon: "edit_flipYBtn_001.png", angle: 90, scale: 0.8, flipX: false },
            { axis: "y", icon: "edit_flipXBtn_001.png", angle: 90, scale: 0.8, flipX: false }
        ];
        flipActions.forEach(a => itemsForGrid.push({ type: "action", subType: "flip", ...a }));

        const rotateActions = [
            { degrees: 90,  icon: "edit_ccwBtn_001.png", angle: 0, scale: 0.8, flipX: true },
            { degrees: -90, icon: "edit_ccwBtn_001.png", angle: 0, scale: 0.8, flipX: false },
            { degrees: 45,  icon: "edit_rotate45rBtn_001.png", angle: 0, scale: 0.85, flipX: false },
            { degrees: -45, icon: "edit_rotate45lBtn_001.png", angle: 0, scale: 0.85, flipX: false }
        ];
        rotateActions.forEach(a => itemsForGrid.push({ type: "action", subType: "rotate", ...a }));
    } else if (this._editorTab === "delete") {
        itemsForGrid.push({
            type: "delete",
            icon: "edit_delBtn_001.png"
        });
    }

    if (this._editorTab === "build") {
        window.totalPages = Math.ceil(itemsForGrid.length / this._maxPerPage);
    } else if (this._editorTab === "edit") {
        window.totalPages = 3;
    } else if (this._editorTab === "delete"){
        window.totalPages = 1;
    }

    if (this._editorPage >= window.totalPages) this._editorPage = 0;

    const showArrows = this._editorTab !== "delete";
    if (this._leftArrow) {
        this._leftArrow.setVisible(showArrows);
        this._leftArrow.disableInteractive();
        if (showArrows) this._leftArrow.setInteractive();
    }
    if (this._rightArrow) {
        this._rightArrow.setVisible(showArrows);
        this._rightArrow.disableInteractive();
        if (showArrows) this._rightArrow.setInteractive();
    }

    if (showArrows) {
        this._makeBouncyButton(this._leftArrow, 0.8, () => {
            if (this._editorTab === "edit") {
                this._editorPage = (this._editorPage > 0) ? this._editorPage - 1 : 2;
            } else {
                this._editorPage = (this._editorPage > 0) ? this._editorPage - 1 : window.totalPages - 1;
            }

            this._buildObjectGrid();
        });

        this._makeBouncyButton(this._rightArrow, 0.8, () => {
            this._editorPage = (this._editorPage < window.totalPages - 1) ? this._editorPage + 1 : 0;
            this._buildObjectGrid();
        });
    }

    if (this._editorTab !== "delete") {
        this._pageDotsContainer = this.add.container(0, 0);
        this._toolbox.add(this._pageDotsContainer);

        const dotSpacing = 18;
        const dotsStartX = (screenWidth / 2) - ((window.totalPages - 1) * dotSpacing) / 2;
        const dotsY = screenHeight - 10;

        for (let i = 0; i < window.totalPages; i++) {
            const dot = this.add.circle(
                dotsStartX + (i * dotSpacing),
                dotsY,
                4,
                i === this._editorPage ? 0xffffff : 0x888888
            );
            if (i === this._editorPage) {
                dot.setStrokeStyle(1, 0xffffff, 0.5);
            }
            this._pageDotsContainer.add(dot);
        }
    }

    const startIdx = this._editorPage * this._maxPerPage;
    const pageItems = this._editorTab === "delete"
        ? itemsForGrid
        : itemsForGrid.slice(startIdx, startIdx + this._maxPerPage);

    const paddingX = 90;
    const paddingY = 80;
    const cols = 6;
    const startX = (screenWidth / 2) - ((cols - 1) * paddingX) / 2;
    const startY = screenHeight - 140;

    pageItems.forEach((item, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);

        const x = startX + (col * paddingX);
        const y = startY + (row * paddingY);

        if (item.type === "object") {
            const btnBg = this.add.image(x, y, "GJ_GameSheet03", "GJ_checkOff_001.png").setScale(1.2).setInteractive();
            const icon = this._createEditorObjectButtonPreview(x, y, item.id);
            if (window.selectedObjId === item.id) {
                btnBg.setTint(0x888888);
            }
            this._gridContainer.add(btnBg);
            if (icon) {
                this._gridContainer.add(icon);
            }
            this._makeCompositeBouncyButton(btnBg, [btnBg, icon], 1.2, () => {
                window.selectedObjId = item.id;
                this._buildObjectGrid();
            });
        } else if (item.type === "action") {
            const btn = this.add.image(x, y, "GJ_button01")
                .setInteractive()
                .setScale(0.92);

            const icon = this.add.image(x, y, "GJ_GameSheet03", item.icon)
                .setAngle(item.angle)
                .setScale(item.scale)
                .setFlipX(item.flipX);

            this._gridContainer.add([btn, icon]);

            this._makeCompositeBouncyButton(btn, [btn, icon], 0.92, () => {
                if (item.subType === "move") {
                    this._moveObject(item.dx, item.dy);
                } else if (item.subType === "rotate") {
                    this._rotateObject(item.degrees);
                } else if (item.subType === "flip") {
                    this._flipObject(item.axis);
                }
            });
        } else if (item.type === "delete") {
            const btnBg = this.add.image(x, y, "GJ_GameSheet03", "GJ_checkOff_001.png").setScale(1.2).setInteractive();

            const icon = this.add.image(x, y, "GJ_GameSheet03", item.icon);

            this._deleteGridButton = btnBg;

            this._gridContainer.add([btnBg, icon]);

            this._makeCompositeBouncyButton(btnBg, [btnBg, icon], 1.2, () => {
                this._deleteSelectedObject();
            });

            this._updateEditorActionButtons();
        }
    });
  }


  _moveObject(dx, dy) {
    const selectedObjectIds = this._getCurrentSelectedEditorObjectIds();
    if (!selectedObjectIds.length) return;

    if (selectedObjectIds.length === 1 && this._editorSelectedTeleportExitObjectId === selectedObjectIds[0]) {
        const selectedObjectId = selectedObjectIds[0];
        const saveObj = this._getEditorSaveObjectForObjectId(selectedObjectId);
        if (!saveObj || parseInt(saveObj.id ?? 0, 10) !== 747) return;

        const currentOffset = parseFloat(saveObj._raw?.[54] ?? saveObj._raw?.["54"] ?? 90);
        const nextOffset = (Number.isFinite(currentOffset) ? currentOffset : 90) - (dy / 2);
        this._setTeleportExitYOffset(saveObj, nextOffset);
        this._refreshTeleportExitVisualsForSaveObject(saveObj);
        this._editorTeleportExitSelectionRequest = selectedObjectId;
        this._selectEditorObjectsByIds([selectedObjectId], this._currentSelectedTintByObjectId?.[selectedObjectId] ?? 0x00ff00);
        this._refreshEditorCollisionCaches();
        this._applyEditorLayerFilter?.();
        return;
    }

    for (const selectedObjectId of selectedObjectIds) {
        const sprites = this._level.objectSprites[selectedObjectId];
        const saveObj = this._getEditorSaveObjectForObjectId(selectedObjectId);

        if (!saveObj) continue;

        saveObj.x += dx / 2;
        saveObj.y -= dy / 2;
        if (saveObj._raw) {
            saveObj._raw["2"] = String(saveObj.x);
            saveObj._raw["3"] = String(saveObj.y);
        }
        this._syncEditorCollidersForObjectId(selectedObjectId, saveObj);

        if (sprites) {
            for (const s of sprites) {
                if (!s) continue;
                s.x += dx;
                s.y += dy;
                if (s._eeWorldX !== undefined) s._eeWorldX += dx;
                if (s._eeBaseY !== undefined) s._eeBaseY += dy;
                if (s._origWorldX !== undefined) s._origWorldX += dx;
                if (s._origBaseY !== undefined) s._origBaseY += dy;
                if (this._level?._refreshSpriteSection) this._level._refreshSpriteSection(s);
            }
        }

        const worldX = saveObj.x * 2;
        const worldY = saveObj.y * 2;
        const syncTriggerPosition = (list) => {
            if (!Array.isArray(list)) return;
            for (const trigger of list) {
                if (!trigger || trigger.uid !== selectedObjectId) continue;
                trigger.x = worldX;
                if (trigger.y !== undefined) trigger.y = worldY;
            }
        };
        syncTriggerPosition(this._level?._colorTriggers);
        syncTriggerPosition(this._level?._enterEffectTriggers);
        syncTriggerPosition(this._level?._moveTriggers);
        syncTriggerPosition(this._level?._alphaTriggers);
        syncTriggerPosition(this._level?._rotateTriggers);
        syncTriggerPosition(this._level?._pulseTriggers);
        syncTriggerPosition(this._level?._spawnTriggers);
    }

    const sortTriggers = (list) => {
        if (Array.isArray(list)) list.sort((a, b) => (a?.x ?? 0) - (b?.x ?? 0));
    };
    sortTriggers(this._level?._colorTriggers);
    sortTriggers(this._level?._enterEffectTriggers);
    sortTriggers(this._level?._moveTriggers);
    sortTriggers(this._level?._alphaTriggers);
    sortTriggers(this._level?._rotateTriggers);
    sortTriggers(this._level?._pulseTriggers);
    sortTriggers(this._level?._spawnTriggers);

    this._refreshEditorCollisionCaches();
  }


  _rotateObject(degrees) {
    const selectedObjectIds = this._getCurrentSelectedEditorObjectIds();
    if (!selectedObjectIds.length) return;

    for (const selectedObjectId of selectedObjectIds) {
        const sprites = this._level.objectSprites[selectedObjectId];
        const saveObj = this._getEditorSaveObjectForObjectId(selectedObjectId);
        const colliders = this._getEditorCollidersForObjectId(selectedObjectId);

        if (!saveObj) continue;

        saveObj.rot = (saveObj.rot || 0) + degrees;

        if (saveObj._raw) {
            saveObj._raw["6"] = String(saveObj.rot);
        }

        for (const collider of colliders) {
            collider.rotation = saveObj.rot;
            collider.rotationDegrees = saveObj.rot;
            if (collider.orbId !== undefined) collider.orbRotation = saveObj.rot;
            collider._baseRotationDegrees = saveObj.rot;
            collider._origRotationDegrees = saveObj.rot;
            collider._eeInitialRotationDegrees = saveObj.rot;
        }

        if (sprites) {
            for (const s of sprites) {
                if (!s) continue;
                if (s._eeEditorTrigger) {
                    const triggerTargets = [];
                    if (s._eeTriggerSprite) triggerTargets.push(s._eeTriggerSprite);
                    if (!triggerTargets.length && Array.isArray(s.list)) {
                        for (const child of s.list) {
                            if (child && child._eeEditorTriggerSprite) triggerTargets.push(child);
                        }
                    }
                    for (const target of triggerTargets) {
                        if (target) target.angle += degrees;
                    }
                    continue;
                }
                s.angle += degrees;
            }
        }
    }

    this._refreshEditorCollisionCaches();
  }


  _flipObject(axis) {
    const selectedObjectIds = this._getCurrentSelectedEditorObjectIds();
    if (!selectedObjectIds.length) return;

    for (const selectedObjectId of selectedObjectIds) {
        const sprites = this._level.objectSprites[selectedObjectId];
        const saveObj = this._getEditorSaveObjectForObjectId(selectedObjectId);
        const colliders = this._getEditorCollidersForObjectId(selectedObjectId);

        if (!saveObj) continue;

        if (axis === "x") {
            saveObj.flipX = !saveObj.flipX;
            if (saveObj._raw) saveObj._raw["4"] = saveObj.flipX ? "1" : "0";

            if (sprites) {
                for (const s of sprites) {
                    if (!s) continue;
                    s.setFlipX(!s.flipX);
                    s.angle = -s.angle;
                }
            }
        } else {
            saveObj.flipY = !saveObj.flipY;
            if (saveObj._raw) saveObj._raw["5"] = saveObj.flipY ? "1" : "0";

            if (sprites) {
                for (const s of sprites) {
                    if (!s) continue;
                    s.setFlipY(!s.flipY);
                    s.angle = -s.angle;
                }
            }
        }

        saveObj.rot = -(saveObj.rot || 0);
        if (saveObj._raw) saveObj._raw["6"] = String(saveObj.rot || 0);

        for (const collider of colliders) {
            collider.rotation = saveObj.rot;
            collider.rotationDegrees = saveObj.rot;
            if (collider.orbId !== undefined) collider.orbRotation = saveObj.rot;
            collider._baseRotationDegrees = saveObj.rot;
            collider._origRotationDegrees = saveObj.rot;
            collider._eeInitialRotationDegrees = saveObj.rot;
        }
    }

    this._refreshEditorCollisionCaches();
  }


  _restoreEditorSelectionTint() {
    if (!this._currentSelectedSprites) return;

    for (const spr of this._currentSelectedSprites) {
        if (!spr) continue;

        if (spr._editorPrevTint !== undefined && spr._editorPrevTint !== null) {
            spr.setTint(spr._editorPrevTint);
        } else {
            spr.clearTint();
        }

        delete spr._editorPrevTint;
    }
  }


  _getCurrentSelectedEditorObjectIds() {
    const ids = [];
    const pushId = (id) => {
        const parsed = parseInt(id, 10);
        if (Number.isInteger(parsed) && parsed >= 0 && !ids.includes(parsed)) ids.push(parsed);
    };

    if (Array.isArray(this._currentSelectedObjectIds)) {
        this._currentSelectedObjectIds.forEach(pushId);
    }

    if (!ids.length && window.editorSelectedObject !== -1) {
        pushId(window.editorSelectedObject);
    }

    return ids;
  }


  _selectEditorObjectsByIds(objectIds, tint = 0x00ff00) {
    const requestedTeleportExitObjectId = Number.isInteger(this._editorTeleportExitSelectionRequest) ? this._editorTeleportExitSelectionRequest : -1;
    this._editorTeleportExitSelectionRequest = -1;
    const previousTintByObjectId = this._currentSelectedTintByObjectId || {};
    this._restoreEditorSelectionTint();

    this._currentSelectedSprites = [];
    this._currentSelectedSprite = null;
    this._currentSelectedObjectIds = [];
    this._currentSelectedTintByObjectId = {};
    this._editorSelectedTeleportExitObjectId = -1;
    this._editorTeleportExitSelectionRequest = -1;
    window.editorSelectedObject = -1;

    const uniqueIds = [];
    for (const objectId of objectIds || []) {
        const parsed = parseInt(objectId, 10);
        if (!Number.isInteger(parsed) || parsed < 0 || uniqueIds.includes(parsed)) continue;
        const linkedSprites = this._level?.objectSprites?.[parsed];
        if (!linkedSprites || !linkedSprites.length) continue;
        uniqueIds.push(parsed);
    }

    const teleportExitOnlyObjectId = uniqueIds.length === 1 && requestedTeleportExitObjectId === uniqueIds[0] ? requestedTeleportExitObjectId : -1;
    this._editorSelectedTeleportExitObjectId = teleportExitOnlyObjectId;

    for (const objectId of uniqueIds) {
        const linkedSprites = this._level.objectSprites[objectId];
        const objectTint = previousTintByObjectId[objectId] ?? tint;
        this._currentSelectedTintByObjectId[objectId] = objectTint;
        const spritesToTint = objectId === teleportExitOnlyObjectId
            ? linkedSprites.filter(spr => spr && spr._eeGeneratedTeleportExit)
            : linkedSprites;

        for (const spr of spritesToTint) {
            if (!spr) continue;

            if (spr._editorPrevTint === undefined) {
                spr._editorPrevTint =
                    spr.tintTopLeft !== undefined
                        ? spr.tintTopLeft
                        : null;
            }

            spr.setTint(objectTint);
            this._currentSelectedSprites.push(spr);
        }
    }

    this._currentSelectedObjectIds = uniqueIds;

    if (uniqueIds.length) {
        const firstSprites = this._level.objectSprites[uniqueIds[0]];
        this._currentSelectedSprite = uniqueIds[0] === teleportExitOnlyObjectId
            ? (firstSprites?.find(spr => spr && spr._eeGeneratedTeleportExit) || firstSprites?.[0] || null)
            : (firstSprites?.[0] || null);
        window.editorSelectedObject = uniqueIds[0];
    }

    this._updateEditorActionButtons();
  }


  _clearEditorSelection() {
    this._restoreEditorSelectionTint();

    this._currentSelectedSprites = [];
    this._currentSelectedSprite = null;
    this._currentSelectedObjectIds = [];
    this._currentSelectedTintByObjectId = {};
    this._editorSelectedTeleportExitObjectId = -1;
    this._editorTeleportExitSelectionRequest = -1;
    window.editorSelectedObject = -1;
    this._updateEditorActionButtons();
  }


  _selectEditorObjectByIndex(index) {
    this._selectEditorObjectsByIds([index], 0x00ff00);
  }


  _startEditorBoxSelect(pointer) {
    this._editorBoxSelectActive = true;
    this._editorBoxSelectMoved = false;
    this._editorBoxSelectStart = { x: pointer.x, y: pointer.y };

    if (!this._editorBoxSelectGraphics || !this._editorBoxSelectGraphics.active) {
        this._editorBoxSelectGraphics = this.add.graphics().setScrollFactor(0).setDepth(1501);
    }

    this._editorBoxSelectGraphics.clear();
  }


  _updateEditorBoxSelect(pointer) {
    if (!this._editorBoxSelectActive || !this._editorBoxSelectStart) return;

    const start = this._editorBoxSelectStart;
    const dx = pointer.x - start.x;
    const dy = pointer.y - start.y;

    if (!this._editorBoxSelectMoved && ((dx * dx) + (dy * dy)) < 16) return;
    this._editorBoxSelectMoved = true;

    const x = Math.min(start.x, pointer.x);
    const y = Math.min(start.y, pointer.y);
    const w = Math.abs(dx);
    const h = Math.abs(dy);

    const g = this._editorBoxSelectGraphics;
    if (!g) return;
    g.clear();
    g.lineStyle(2, 0x00ff00, 1);
    g.strokeRect(x, y, w, h);
  }


  _finishEditorBoxSelect(pointer) {
    const wasActive = !!this._editorBoxSelectActive;
    const didMove = !!this._editorBoxSelectMoved;
    const start = this._editorBoxSelectStart;

    this._editorBoxSelectActive = false;
    this._editorBoxSelectMoved = false;
    this._editorBoxSelectStart = null;

    if (this._editorBoxSelectGraphics) this._editorBoxSelectGraphics.clear();
    if (!wasActive || !didMove || !start) return false;

    const rect = {
        x: Math.min(start.x, pointer.x),
        y: Math.min(start.y, pointer.y),
        right: Math.max(start.x, pointer.x),
        bottom: Math.max(start.y, pointer.y)
    };
    rect.width = rect.right - rect.x;
    rect.height = rect.bottom - rect.y;

    const selectedIds = [];
    const objectSprites = this._level?.objectSprites || [];

    for (let objectId = objectSprites.length - 1; objectId >= 0; objectId--) {
        const spriteList = objectSprites[objectId];
        if (!spriteList || !spriteList.length) continue;
        if (!this._editorObjectMatchesActiveLayerByObjectId(objectId)) continue;

        let overlaps = false;
        for (const spr of spriteList) {
            if (!spr || !spr.active || !spr.visible) continue;
            const bounds = spr.getBounds ? spr.getBounds() : null;
            if (!bounds) continue;
            if (
                bounds.right >= rect.x &&
                bounds.x <= rect.right &&
                bounds.bottom >= rect.y &&
                bounds.y <= rect.bottom
            ) {
                overlaps = true;
                break;
            }
        }

        if (overlaps) selectedIds.unshift(objectId);
    }

    const mergedIds = this._getCurrentSelectedEditorObjectIds();
    for (const objectId of selectedIds) {
        if (!mergedIds.includes(objectId)) mergedIds.push(objectId);
    }

    this._selectEditorObjectsByIds(mergedIds, 0x00ff00);
    return true;
  }


  _duplicateSelectedObject() {
    const selectedObjectIds = this._getCurrentSelectedEditorObjectIds();
    if (!selectedObjectIds.length) return;

    const newObjectIds = [];

    for (const selectedObjectId of selectedObjectIds) {
        const src = this._getEditorSaveObjectForObjectId(selectedObjectId);
        if (!src) continue;

        const clone = JSON.parse(JSON.stringify(src));
        delete clone._eeObjectId;

        window.levelObjects.push(clone);
        this._level._spawnObject(clone);

        const newObjectId = Number.isInteger(clone._eeObjectId)
            ? clone._eeObjectId
            : Math.max(0, (this._level._nextObjectId || 1) - 1);
        const newestSprites = this._level.objectSprites[newObjectId];

        if (newestSprites && newestSprites.length) {
            const depthBase = {
                "-5": -12,
                "-3": -9,
                "-1": -6,
                0: 0,
                1: 3,
                3: 6,
                5: 9,
                7: 10.5,
                9: 12,
                11: 13.5
            };

            const finalDepth =
                (depthBase[clone.zLayer] || 0) +
                (clone.zOrder * 0.01);

            for (const spr of newestSprites) {
                if (!spr) continue;

                spr.setDepth((spr._eeZDepth || finalDepth) + 10);

                if (spr._eeLayer === 2) {
                    if (this._level.topContainer && !this._level.topContainer.exists(spr)) {
                        this._level.topContainer.add(spr);
                    }
                } else if (this._level.container && !this._level.container.exists(spr)) {
                    this._level.container.add(spr);
                }
            }
        }

        newObjectIds.push(newObjectId);
    }

    if (newObjectIds.length) {
        this._selectEditorObjectsByIds(newObjectIds, 0x00ffff);
    } else {
        this._clearEditorSelection();
    }

    this._applyEditorLayerFilter?.();
    this._refreshEditorCollisionCaches();
    this._buildObjectGrid();
  }


  _deleteSelectedObject() {
    const selectedObjectIds = this._getCurrentSelectedEditorObjectIds();
    if (!selectedObjectIds.length) return;

    const selectedIdSet = new Set(selectedObjectIds);
    const saveIndexes = selectedObjectIds
        .map(objectId => this._getEditorSaveIndexForObjectId(objectId))
        .filter(saveIndex => saveIndex !== -1);

    this._clearEditorSelection();

    for (const selectedObjectId of selectedObjectIds) {
        const sprites = this._level.objectSprites[selectedObjectId] || [];
        for (const spr of sprites) {
            if (spr && spr.destroy) spr.destroy();
        }

        if (Array.isArray(this._level.objectSprites)) {
            this._level.objectSprites[selectedObjectId] = null;
        }
    }

    if (Array.isArray(this._level.objects)) {
        this._level.objects = this._level.objects.filter(collider => {
            if (!collider) return false;
            const objectId = Number.isInteger(collider._eeObjectId) ? collider._eeObjectId : -1;
            return !selectedIdSet.has(objectId);
        });
    }

    if (Array.isArray(window.levelObjects)) {
        for (const saveIndex of saveIndexes) {
            window.levelObjects[saveIndex] = null;
        }
    }

    this._refreshEditorCollisionCaches();
    this._refreshEditorLayerSelectorVisual?.();
    this._applyEditorLayerFilter?.();
    this._buildObjectGrid();
    this._updateEditorActionButtons();
  }


  _updateEditorActionButtons() {
    const selectedCount = this._getCurrentSelectedEditorObjectIds ? this._getCurrentSelectedEditorObjectIds().length : (window.editorSelectedObject !== -1 ? 1 : 0);
    const hasSelection = selectedCount > 0;
    const triggerSelection = selectedCount === 1 && this._isSelectedEditorObjectTrigger();
    const alpha = hasSelection ? 1 : 0.5;
    const editAlpha = triggerSelection ? 1 : 0.5;

    if (this._copyPasteBtn) {
        this._copyPasteBtn.setAlpha(alpha);

        if (hasSelection) {
            this._copyPasteBtn.setInteractive();
        } else {
            this._copyPasteBtn.disableInteractive();
        }
    }

    if (this._editObjectBtn) {
        this._editObjectBtn.setAlpha(editAlpha);

        if (triggerSelection) {
            this._editObjectBtn.setInteractive();
        } else {
            this._editObjectBtn.disableInteractive();
        }
    }

    if (this._editGroupBtnVisual) {
        this._editGroupBtnVisual.setAlpha(alpha);
    }
    if (this._editGroupBtnHit) {
        if (hasSelection) {
            this._editGroupBtnHit.setInteractive();
        } else {
            this._editGroupBtnHit.disableInteractive();
        }
    }

    if (this._deselectBtn) {
        this._deselectBtn.setAlpha(alpha);

        if (hasSelection) {
            this._deselectBtn.setInteractive();
        } else {
            this._deselectBtn.disableInteractive();
        }
    }

    if (this._deleteButton) {
        this._deleteButton.setAlpha(alpha);

        if (hasSelection) {
            this._deleteButton.setInteractive();
        } else {
            this._deleteButton.disableInteractive();
        }
    }

    if (this._editorTab == "delete") {
        this._deleteGridButton.setAlpha(alpha);

        if (hasSelection) {
            this._deleteGridButton.setInteractive();
        } else {
            this._deleteGridButton.disableInteractive();
        }
    }
  }


  _updateEditorGrid() {
    if (!this._editorGridGraphics) return;
    const g = this._editorGridGraphics;
    g.clear();
    const zoom = this._editorZoom || 1.0;
    const gridSize = 60;
    g.lineStyle(1, 0x000000, 0.4);

    const camX = this._cameraX / zoom;
    const camY = this._cameraY / zoom;
    const offsetX = -camX % gridSize;
    const offsetY = (-camY - 20) % gridSize;
    for (let x = offsetX; x < screenWidth / zoom + gridSize; x += gridSize) {
        g.lineBetween(x * zoom, 0, x * zoom, screenHeight);
    }
    for (let y = offsetY; y < screenHeight / zoom + gridSize; y += gridSize) {
        g.lineBetween(0, y * zoom, screenWidth, y * zoom);
    }
    g.lineStyle(1, 0xffffff, 1);

    const startLineX = (0 * zoom) - this._cameraX;
    if (startLineX >= -50 && startLineX <= screenWidth + 50) {
        g.lineBetween(startLineX, 0, startLineX, screenHeight);
    }
    let worldGroundY = -20 + (60 * 8);
    if (this._editorPlaytestActive && this._level?.getFloorY) {
        const floorY = this._level.getFloorY();
        if (floorY !== null && floorY !== undefined && Number.isFinite(floorY)) {
            worldGroundY = b(floorY);
        }
    }
    const groundLineY = (worldGroundY * zoom) - this._cameraY;
    if (groundLineY >= -50 && groundLineY <= screenHeight + 50) {
        g.lineBetween(0, groundLineY, screenWidth, groundLineY);
    }

    if (this._editorPlaytestActive && this._level?.getCeilingY) {
        const ceilingY = this._level.getCeilingY();
        if (ceilingY !== null && ceilingY !== undefined) {
            const ceilingLineY = (b(ceilingY) * zoom) - this._cameraY;
            if (ceilingLineY >= -50 && ceilingLineY <= screenHeight + 50) {
                g.lineBetween(0, ceilingLineY, screenWidth, ceilingLineY);
            }
        }
    }
  }


  _editorAction() {
  if (this._editorPlaytestActive && !this._editorPlaytestPaused) return;

  if (this._editorTab === "build") {
    this._placeObject();
  } else if (this._editorTab === "edit") {
    this._selectObjectAtPointer();
  } else if (this._editorTab === "delete") {
    this._deleteObjectAtPointer();
  }
  }


  _setTeleportExitYOffset(enterSaveObj, yOffset) {
    if (!enterSaveObj) return false;
    const parsed = parseFloat(yOffset);
    const offset = Number.isFinite(parsed) ? parsed : 90;
    enterSaveObj._raw = enterSaveObj._raw || {};
    enterSaveObj._raw[54] = String(offset);
    enterSaveObj._raw["54"] = String(offset);
    return true;
  }


  _refreshTeleportExitVisualsForSaveObject(enterSaveObj) {
    if (!enterSaveObj || parseInt(enterSaveObj.id ?? 0, 10) !== 747) return false;

    const linkedId = Number.isInteger(enterSaveObj._eeObjectId) ? enterSaveObj._eeObjectId : -1;
    if (linkedId < 0 || !this._level?.objectSprites?.[linkedId]) return false;

    const sprites = this._level.objectSprites[linkedId];
    for (const spr of sprites.slice()) {
      if (spr && spr._eeGeneratedTeleportExit && spr.destroy) spr.destroy();
    }
    this._level.objectSprites[linkedId] = sprites.filter(spr => spr && !spr._eeGeneratedTeleportExit);

    const objectDef = getObjectFromId(enterSaveObj.id);
    const depthBase = { "-5": -12, "-3": -9, "-1": -6, 0: 0, 1: 3, 3: 6, 5: 9, 7: 10.5, 9: 12, 11: 13.5 };
    const zLayer = enterSaveObj.zLayer || objectDef?.default_z_layer || 0;
    const zOrder = enterSaveObj.zOrder || objectDef?.default_z_order || 0;
    const objZDepth = (depthBase[zLayer] !== undefined ? depthBase[zLayer] : 0) + zOrder * 0.01;
    const groupIds = this._getEditorObjectGroupIds ? this._getEditorObjectGroupIds(enterSaveObj) : [];
    const col1 = enterSaveObj.color1 || objectDef?.default_base_color_channel || 0;

    const registerObjectSprite = (spr) => {
      if (!spr) return;
      spr._eeObjectId = linkedId;
      spr._eeEditorLayer = parseInt(enterSaveObj.editorLayer ?? enterSaveObj._raw?.[20] ?? enterSaveObj._raw?.["20"] ?? 0, 10) || 0;
      spr._eeEditorLayer2 = parseInt(enterSaveObj.editorLayer2 ?? enterSaveObj._raw?.[61] ?? enterSaveObj._raw?.["61"] ?? 0, 10) || 0;
      if (!this._level.objectSprites[linkedId]) this._level.objectSprites[linkedId] = [];
      this._level.objectSprites[linkedId].push(spr);
    };

    const registerToGroups = (spr, baseWorldX, baseBaseY) => {
      if (!spr || !groupIds.length) return;
      spr._origWorldX = baseWorldX;
      spr._origBaseY = baseBaseY;
      for (const gid of groupIds) {
        if (!this._level._groupSprites[gid]) this._level._groupSprites[gid] = [];
        this._level._groupSprites[gid].push(spr);
      }
    };

    const registerColor = (spr, ch) => {
      if (ch > 0 && objectDef?.can_color !== false && spr && !spr._isSaw) {
        spr._eeColorChannel = ch;
        if (!this._level._colorChannelSprites[ch]) this._level._colorChannelSprites[ch] = [];
        this._level._colorChannelSprites[ch].push(spr);
      }
    };

    this._level._spawnTeleportExitPortalVisual?.(this, enterSaveObj, objectDef, linkedId, registerObjectSprite, registerToGroups, registerColor, objZDepth, col1);
    return true;
  }


  _applyTeleportExitPlacement(exitX, exitY) {
    if (!Array.isArray(window.levelObjects)) return false;

    const selectedIds = this._getCurrentSelectedEditorObjectIds ? this._getCurrentSelectedEditorObjectIds() : [];
    let enterSaveObj = null;

    for (const objectId of selectedIds) {
      const candidate = this._getEditorSaveObjectForObjectId(objectId);
      if (candidate && parseInt(candidate.id ?? 0, 10) === 747) {
        enterSaveObj = candidate;
        break;
      }
    }

    if (!enterSaveObj) {
      let bestDistance = Infinity;
      for (const obj of window.levelObjects) {
        if (!obj || parseInt(obj.id ?? 0, 10) !== 747) continue;
        const dx = Number(obj.x ?? 0) - Number(exitX ?? 0);
        const dist = Math.abs(dx);
        if (dist < bestDistance) {
          bestDistance = dist;
          enterSaveObj = obj;
        }
      }
    }

    if (!enterSaveObj) return false;

    const yOffset = (Number(exitY) || 0) - (Number(enterSaveObj.y) || 0);
    this._setTeleportExitYOffset(enterSaveObj, yOffset);
    this._refreshTeleportExitVisualsForSaveObject(enterSaveObj);

    this._refreshEditorCollisionCaches?.();
    this._applyEditorLayerFilter?.();
    return true;
  }

  _placeObject() {
    const pointer = this.input.activePointer;

    const worldX = (this.input.activePointer.x + this._cameraX) / this._editorZoom;
    const worldY = (this.input.activePointer.y + this._cameraY) / this._editorZoom;

    const snapX = Math.floor(worldX / 60) * 60;
    const snapY = Math.floor((worldY + 20) / 60) * 60;

    const transformedX = (snapX / 2) + 15;
    const transformedY = -(snapY / 2) + 225;

    const objId = window.selectedObjId;
    const objectDef = getObjectFromId(objId);

    if (!objectDef) return;

    if (parseInt(objId ?? 0, 10) === 749) {
        this._applyTeleportExitPlacement(transformedX, transformedY);
        return;
    }

    const saveData = {
        id: objId,
        x: transformedX,
        y: transformedY,
        flipX: false,
        flipY: false,
        rot: 0,
        scale: 1,
        zLayer: objectDef.default_z_layer || 0,
        zOrder: objectDef.default_z_order || 0,
        editorLayer: this._getCurrentEditorPlacementLayer ? this._getCurrentEditorPlacementLayer() : 0,
        editorLayer2: 0,
        groups: "",
        color1: 0,
        color2: 0,
        gameMode: 0,
        miniMode: 0,
        speed: 0,
        mirrored: 0,
        flipGravity: false,
        _raw: {
            "1": String(objId),
            "2": String(transformedX),
            "3": String(transformedY),
            "4": "0",
            "5": "0",
            "6": "0",
            "21": "0",
            "20": String(this._getCurrentEditorPlacementLayer ? this._getCurrentEditorPlacementLayer() : 0),
            "22": "0",
            "24": String(objectDef.default_z_layer || 0),
            "25": String(objectDef.default_z_order || 0),
            "32": "1",
            "61": "0",
            "57": "",
            "kA2": "0",
            "kA3": "0",
            "kA4": "0",
            "kA8": "0",
            "kA28": "0",
            "kA11": "0"
        }
    };

    if (this._isEditorColorTriggerId(objId) && ![29, 30].includes(parseInt(objId ?? 0, 10))) {
        saveData._raw["23"] = "1";
    }

    if (parseInt(objId ?? 0, 10) === 747) {
        saveData._raw[54] = "90";
        saveData._raw["54"] = "90";
    }

    if (objectDef.textObject) {
        const defaultText = String(objectDef.defaultText || "A");
        saveData.text = defaultText;
        saveData._raw[31] = defaultText;
        saveData._raw["31"] = defaultText;
    }

    window.levelObjects.push(saveData);
    this._level._spawnObject(saveData);

    const placedIndex = Math.max(0, (this._level._nextObjectId || 1) - 1);
    const newestSprites = this._level.objectSprites[placedIndex];

    if (newestSprites && newestSprites.length) {
        const depthBase = {
            "-5": -12,
            "-3": -9,
            "-1": -6,
            0: 0,
            1: 3,
            3: 6,
            5: 9,
            7: 10.5,
            9: 12,
            11: 13.5
        };

        const finalDepth =
            (depthBase[saveData.zLayer] || 0) +
            (saveData.zOrder * 0.01);

        for (const spr of newestSprites) {
            if (!spr) continue;

            spr.setDepth((spr._eeZDepth || finalDepth) + 10);

            if (spr._eeLayer === 2) {
                if (this._level.topContainer && !this._level.topContainer.exists(spr)) {
                    this._level.topContainer.add(spr);
                }
            } else {
                if (this._level.container && !this._level.container.exists(spr)) {
                    this._level.container.add(spr);
                }
            }
        }
    }

    if (newestSprites && newestSprites.length) {
        this._selectEditorObjectsByIds([placedIndex], 0x00ff00);
    } else {
        this._clearEditorSelection();
    }
    this._refreshEditorLayerSelectorVisual?.();
    this._applyEditorLayerFilter?.();
    this._refreshEditorPlaytestGlowVisibility?.();
  }


  _selectObjectAtPointer(addToSelection = false) {
    const pointer = this.input.activePointer;
    let foundObjectIndex = -1;
    let foundSprite = null;

    for (let i = this._level.objectSprites.length - 1; i >= 0; i--) {
        const spriteList = this._level.objectSprites[i];
        if (!spriteList || !spriteList.length) continue;
        if (!this._editorObjectMatchesActiveLayerByObjectId(i)) continue;

        for (let j = spriteList.length - 1; j >= 0; j--) {
            const spr = spriteList[j];
            if (!spr || !spr.active || !spr.visible) continue;

            const bounds = spr.getBounds();
            if (bounds.contains(pointer.x, pointer.y)) {
                foundObjectIndex = i;
                foundSprite = spr;
                break;
            }
        }

        if (foundObjectIndex !== -1) break;
    }

    if (foundObjectIndex === -1) {
        if (!(addToSelection || (this._editorTab === "edit" && this._isSwipeEnabled))) {
            this._clearEditorSelection();
        }
        return;
    }

    const clickedTeleportExit = !!foundSprite?._eeGeneratedTeleportExit;

    if (addToSelection || (this._editorTab === "edit" && this._isSwipeEnabled)) {
        const selectedIds = this._getCurrentSelectedEditorObjectIds();
        if (!selectedIds.includes(foundObjectIndex)) selectedIds.push(foundObjectIndex);
        this._editorTeleportExitSelectionRequest = -1;
        this._selectEditorObjectsByIds(selectedIds, 0x00ff00);
    } else {
        this._editorTeleportExitSelectionRequest = clickedTeleportExit ? foundObjectIndex : -1;
        this._selectEditorObjectsByIds([foundObjectIndex], 0x00ff00);
    }
  }


  _deleteObjectAtPointer() {
    const pointer = this.input.activePointer;

    let foundObjectIndex = -1;

    for (let i = this._level.objectSprites.length - 1; i >= 0; i--) {
        const spriteList = this._level.objectSprites[i];
        if (!spriteList || !spriteList.length) continue;
        if (!this._editorObjectMatchesActiveLayerByObjectId(i)) continue;

        for (let j = spriteList.length - 1; j >= 0; j--) {
            const spr = spriteList[j];
            if (!spr || !spr.active || !spr.visible) continue;

            const bounds = spr.getBounds();
            if (bounds.contains(pointer.x, pointer.y)) {
                foundObjectIndex = i;
                break;
            }
        }

        if (foundObjectIndex !== -1) break;
    }

    if (foundObjectIndex === -1) return;

    const saveIndex = this._getEditorSaveIndexForObjectId(foundObjectIndex);

    if (window.editorSelectedObject === foundObjectIndex) {
        this._clearEditorSelection();
    }

    const linkedSprites = this._level.objectSprites[foundObjectIndex] || [];

    for (const spr of linkedSprites) {
        if (spr && spr.destroy) spr.destroy();
    }

    if (Array.isArray(this._level.objectSprites)) {
        this._level.objectSprites[foundObjectIndex] = null;
    }

    if (Array.isArray(this._level.objects)) {
        this._level.objects = this._level.objects.filter(collider => {
            if (!collider) return false;
            const objectId = Number.isInteger(collider._eeObjectId) ? collider._eeObjectId : -1;
            return objectId !== foundObjectIndex;
        });
    }

    if (Array.isArray(window.levelObjects) && saveIndex !== -1) {
        window.levelObjects[saveIndex] = null;
    }

    this._refreshEditorCollisionCaches();
    window.editorSelectedObject = -1;
    this._updateEditorActionButtons();
  }


  _closeEditorLevelSettingsPopup() {
    this._editorTextInputFocused = false;

    if (!this._editorLevelSettingsPopup) return;

    this._closeEditorHorizontalOptionPopup();
    this._closeEditorColorPickerPopup();

    if (this._editorLevelSettingsKeyHandler) {
        window.removeEventListener("keydown", this._editorLevelSettingsKeyHandler);
        this._editorLevelSettingsKeyHandler = null;
    }

    this._editorLevelSettingsPopup.destroy();
    this._editorLevelSettingsPopup = null;
  }


  _closeEditorHorizontalOptionPopup() {
    if (!this._editorHorizontalOptionPopup) return;

    this._editorHorizontalOptionPopup.destroy();
    this._editorHorizontalOptionPopup = null;
  }


  _closeEditorColorPickerPopup() {
    this._editorTextInputFocused = false;

    if (this._editorColorPickerKeyHandler) {
        window.removeEventListener("keydown", this._editorColorPickerKeyHandler);
        this._editorColorPickerKeyHandler = null;
    }

    if (this._editorTriggerTargetInputKeyHandler) {
        window.removeEventListener("keydown", this._editorTriggerTargetInputKeyHandler);
        this._editorTriggerTargetInputKeyHandler = null;
    }

    this._closeEditorTriggerChannelPopup();

    if (this._editorObjectOptionsKeyHandler) {
        window.removeEventListener("keydown", this._editorObjectOptionsKeyHandler);
        this._editorObjectOptionsKeyHandler = null;
    }

    if (!this._editorColorPickerPopup) return;

    this._editorColorPickerPopup.destroy();
    this._editorColorPickerPopup = null;
  }


  _closeEditorObjectOptionsPopup() {
    this._editorTextInputFocused = false;

    if (this._editorObjectOptionsKeyHandler) {
        window.removeEventListener("keydown", this._editorObjectOptionsKeyHandler);
        this._editorObjectOptionsKeyHandler = null;
    }

    if (this._editorGroupInputPointerDownHandler) {
        this.input.off("pointerdown", this._editorGroupInputPointerDownHandler);
        this._editorGroupInputPointerDownHandler = null;
    }

    this._closeEditorTriggerChannelPopup();

    if (this._editorStartPositionSettingsPopup) {
        this._editorStartPositionSettingsPopup.destroy();
        this._editorStartPositionSettingsPopup = null;
    }

    if (this._editorTriggerTargetInputKeyHandler) {
        window.removeEventListener("keydown", this._editorTriggerTargetInputKeyHandler);
        this._editorTriggerTargetInputKeyHandler = null;
    }

    if (this._editorObjectOptionsPopup) {
        this._editorObjectOptionsPopup.destroy();
        this._editorObjectOptionsPopup = null;
    }
  }


  _editorSettingsToMap() {
    const map = {};

    const raw = window.settingslist || "";
    const parts = String(raw).split(",");

    for (let i = 0; i + 1 < parts.length; i += 2) {
        map[parts[i]] = parts[i + 1];
    }

    window.settingsMap = window.settingsMap || {};

    for (const key in window.settingsMap) {
        if (map[key] === undefined) {
            map[key] = window.settingsMap[key];
        }
    }

    return map;
  }


  _editorMapToSettings(map) {
    const parts = [];

    for (const key in map) {
        if (map[key] === undefined || map[key] === null) continue;
        parts.push(key, String(map[key]));
    }

    window.settingsMap = map;
    window.settingslist = parts.join(",");

    return window.settingslist;
  }


  _makeColorStringEntry(channelId, color) {
    return [
        "1", String(color.r),
        "2", String(color.g),
        "3", String(color.b),
        "6", String(channelId),
        "5", "0",
        "7", "0"
    ].join("_");
  }


  _parseColorStringEntry(entry) {
    const props = {};
    const parts = String(entry || "").split("_");

    for (let i = 0; i + 1 < parts.length; i += 2) {
        props[parts[i]] = parts[i + 1];
    }

    return {
        channel: parseInt(props["6"] || "0", 10),
        r: parseInt(props["1"] || "255", 10),
        g: parseInt(props["2"] || "255", 10),
        b: parseInt(props["3"] || "255", 10)
    };
  }


  _getEditorColorChannel(channelId, fallback = { r: 255, g: 255, b: 255 }) {
    const map = this._editorSettingsToMap();

    if (map["kS38"]) {
        const entries = map["kS38"].split("|").filter(Boolean);

        for (const entry of entries) {
            const parsed = this._parseColorStringEntry(entry);

            if (parsed.channel === channelId) {
                return {
                    r: parsed.r,
                    g: parsed.g,
                    b: parsed.b
                };
            }
        }
    }

    const legacyKey =
        channelId === 1000
            ? "kS29"
            : channelId === 1001
                ? "kS30"
                : null;

    if (legacyKey && map[legacyKey]) {
        const parsed = this._parseColorStringEntry(map[legacyKey]);

        return {
            r: parsed.r,
            g: parsed.g,
            b: parsed.b
        };
    }

    return fallback;
  }


  _setEditorColorChannelDraft(channelId, color) {
    const map = this._editorSettingsToMap();

    const entries = map["kS38"]
        ? map["kS38"].split("|").filter(Boolean)
        : [];

    let replaced = false;

    for (let i = 0; i < entries.length; i++) {
        const parsed = this._parseColorStringEntry(entries[i]);

        if (parsed.channel === channelId) {
            entries[i] = this._makeColorStringEntry(channelId, color);
            replaced = true;
            break;
        }
    }

    if (!replaced) {
        entries.push(this._makeColorStringEntry(channelId, color));
    }

    map["kS38"] = entries.join("|");

    if (channelId === 1000) {
        map["kS29"] = this._makeColorStringEntry(1000, color);
    } else if (channelId === 1001) {
        map["kS30"] = this._makeColorStringEntry(1001, color);
    }

    this._editorMapToSettings(map);

    if (this._level) {
        this._level._initialColors = this._level._initialColors || {};
        this._level._initialColors[channelId] = color;
    }

    if (this._colorManager && this._colorManager.setInitialColor) {
        this._colorManager.setInitialColor(channelId, color);
    }

    const hex = Phaser.Display.Color.GetColor(color.r, color.g, color.b);

    if (channelId === 1000 && this._bg) {
        this._bg.setTint(hex);
    }

    if (channelId === 1001 && this._level && this._level.setGroundColor) {
        this._level.setGroundColor(hex);
    }
  }


  _setEditorStartValueDraft(key, value) {
    const map = this._editorSettingsToMap();
    map[key] = String(value);
    this._editorMapToSettings(map);
  }


  _getEditorStartValue(key, fallback = 0) {
    const map = this._editorSettingsToMap();
    const val = parseInt(map[key] ?? fallback, 10);

    return isNaN(val) ? fallback : val;
  }


  _getEditorArtValue(key, fallback = 1) {
    const rawValue = this._getEditorStartValue(key, fallback);
    return rawValue > 0 ? rawValue : fallback;
  }


  _setEditorArtValueDraft(key, value) {
    const numericValue = Math.max(1, parseInt(value ?? 1, 10) || 1);

    this._setEditorStartValueDraft(key, numericValue);

    if (key === "kA6") {
        window._backgroundId = String(numericValue).padStart(2, "0");

        const bgKey = "game_bg_" + getBackgroundTextureIndex(numericValue);

        if (this._bg && this.textures.exists(bgKey)) {
            this._bg.setTexture(bgKey);
            const newBgH = this.textures.get(bgKey).source?.[0]?.height;

            if (newBgH) {
                this._bgInitY = newBgH - screenHeight - o;
            }
        }
    } else if (key === "kA7") {
        window._groundId = getGroundTextureId(numericValue);

        if (this._level && typeof this._level.applyGroundTexture === "function") {
            this._level.applyGroundTexture();
        }
    }
  }


  _getCurrentEditorLevelRecord() {
    const levels = JSON.parse(localStorage.getItem("created_levels") || "[]");
    const idx = levels.findIndex(l => l.createdId === window.currentlevel?.[2]);

    return {
        levels,
        idx,
        level: idx !== -1 ? levels[idx] : null
    };
  }


  _setEditorSongDraft(songId, songName) {
    this._editorPendingSongId = songId;
    this._editorPendingSongName = songName;

    window.currentlevel = window.currentlevel || [
        "Placeholder",
        "Unnamed",
        window._onlineLevelId || "local_0",
        ["Local", "SongAuthor"]
    ];

    if (songId < 0) {
        const normalIndex = Math.abs(songId) - 1;
        const levelSong = window.allLevels?.[normalIndex];

        if (levelSong) {
            window.currentlevel[0] = levelSong[0];
            window.currentlevel[3] = ["Local", levelSong[3]];
        }
    } else {
        window.currentlevel[0] = `ng_song_${songId}`;
        window.currentlevel[3] = ["Local", "Newgrounds"];
        window._onlineSongBuffer = null;
        window._onlineSongKey = null;
        window._onlineSongTitle = `NG#${songId}`;
        window._onlineSongArtist = "Newgrounds";
    }
  }


  _addSafeFrameImage(x, y, frameName, scale = 1) {
    const tex =
        this._getTextureRefForFrameThingy
            ? this._getTextureRefForFrameThingy(frameName)
            : null;

    if (tex) {
        return tex.frame
            ? this.add.image(x, y, tex.key, tex.frame).setScale(scale)
            : this.add.image(x, y, tex.key).setScale(scale);
    }

    return this.add.bitmapText(x, y, "bigFont", "?", 36)
        .setOrigin(0.5)
        .setScale(scale);
  }


  _getColourPickerFrameData() {
    return {
        "colourPicker.png": {
            frame: { x: 1, y: 1591, w: 52, h: 52 },
            rotated: false,
            sourceSize: { w: 52, h: 52 }
        },
        "colourPickerBackground.png": {
            frame: { x: 698, y: 325, w: 440, h: 440 },
            rotated: false,
            sourceSize: { w: 440, h: 440 }
        },
        "colourPickerOverlay.png": {
            frame: { x: 698, y: 766, w: 440, h: 440 },
            rotated: false,
            sourceSize: { w: 440, h: 440 }
        },
        "colourPickerShadow.png": {
            frame: { x: 602, y: 1207, w: 440, h: 440 },
            rotated: false,
            sourceSize: { w: 440, h: 440 }
        },
        "huePickerBackground.png": {
            frame: { x: 1, y: 990, w: 600, h: 600 },
            rotated: false,
            sourceSize: { w: 600, h: 600 }
        },
        "menuColourPanelBackground.png": {
            frame: { x: 1, y: 325, w: 696, h: 664 },
            rotated: false,
            sourceSize: { w: 720, h: 664 },
            spriteSourceSize: { x: 24, y: 0, w: 696, h: 664 }
        }
    };
  }


  _getColourPickerTextureRef(frameName) {
    const sheet = "CCControlColourPickerSpriteSheet-uhd";

    if (
        this.textures.exists(sheet) &&
        this.textures.get(sheet).has(frameName)
    ) {
        return {
            key: sheet,
            frame: frameName
        };
    }

    const generatedKey = `__cc_picker_${frameName}`;

    if (this.textures.exists(generatedKey)) {
        return {
            key: generatedKey,
            frame: null
        };
    }

    if (!this.textures.exists(sheet)) {
        return null;
    }

    const tex = this.textures.get(sheet);

    const sourceImage =
        typeof tex.getSourceImage === "function"
            ? tex.getSourceImage()
            : tex.source?.[0]?.image;

    if (!sourceImage) {
        return null;
    }

    const data = this._getColourPickerFrameData()[frameName];
    if (!data) return null;

    const frame = data.frame;
    const outW = data.sourceSize.w;
    const outH = data.sourceSize.h;

    const canvasTexture = this.textures.createCanvas(generatedKey, outW, outH);
    const canvas = canvasTexture.getCanvas();
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, outW, outH);

    if (data.rotated) {
        ctx.save();
        ctx.translate(outW / 2, outH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(
            sourceImage,
            frame.x,
            frame.y,
            frame.w,
            frame.h,
            -frame.w / 2,
            -frame.h / 2,
            frame.w,
            frame.h
        );
        ctx.restore();
    } else {
        ctx.drawImage(
            sourceImage,
            frame.x,
            frame.y,
            frame.w,
            frame.h,
            0,
            0,
            outW,
            outH
        );
    }

    canvasTexture.refresh();

    return {
        key: generatedKey,
        frame: null
    };
  }


  _addColourPickerImage(x, y, frameName, scale = 1) {
    const tex = this._getColourPickerTextureRef(frameName);

    if (tex) {
        return tex.frame
            ? this.add.image(x, y, tex.key, tex.frame).setScale(scale)
            : this.add.image(x, y, tex.key).setScale(scale);
    }

    return this.add.rectangle(x, y, 80 * scale, 80 * scale, 0xffffff, 0.4)
        .setStrokeStyle(2, 0xff0000, 1);
  }


  _setPickerObjectColor(obj, hex, alpha = 1) {
    if (!obj) return;

    if (typeof obj.setTint === "function") {
        obj.setTint(hex);
        return;
    }

    if (typeof obj.setFillStyle === "function") {
        obj.setFillStyle(hex, alpha);
    }
  }


  _rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    let h = 0;

    if (d !== 0) {
        if (max === r) {
            h = ((g - b) / d) % 6;
        } else if (max === g) {
            h = ((b - r) / d) + 2;
        } else {
            h = ((r - g) / d) + 4;
        }

        h *= 60;

        if (h < 0) h += 360;
    }

    const s = max === 0 ? 0 : d / max;
    const v = max;

    return { h, s, v };
  }


  _hsvToRgb(h, s, v) {
    h = ((h % 360) + 360) % 360;

    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;

    let r = 0;
    let g = 0;
    let b = 0;

    if (h < 60) {
        r = c;
        g = x;
    } else if (h < 120) {
        r = x;
        g = c;
    } else if (h < 180) {
        g = c;
        b = x;
    } else if (h < 240) {
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        b = c;
    } else {
        r = c;
        b = x;
    }

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
    };
  }


  _makeEditorOkButton(parent, x, y, text, callback) {
    const btnW = 124;
    const btnH = 62;
    const btnBorder = this.textures.exists("GJ_button01") ? this.textures.get("GJ_button01").source[0].width * 0.3 : 28;

    const grp = this.add.container(x, y);

    const btn = this.add.nineslice(
        0,
        0,
        "GJ_button01",
        null,
        btnW,
        btnH,
        btnBorder,
        btnBorder,
        btnBorder,
        btnBorder
    ).setOrigin(0.5);

    const label = this.add.bitmapText(-5, -3, "goldFont", text, 42).setOrigin(0.5, 0.5);
    const hitZone = this.add.zone(0, 0, btnW, btnH) .setInteractive();

    grp.add([btn, label, hitZone]);
    parent.add(grp);

    const baseScale = 1;
    const pressedScale = baseScale * 1.16;

    hitZone.on("pointerdown", () => {
        hitZone._pressed = true;
        this.tweens.killTweensOf(grp, "scale");
        this.tweens.add({
            targets: grp,
            scale: pressedScale,
            duration: 300,
            ease: "Bounce.Out"
        });
    });

    const release = (runCallback = false) => {
        if (!hitZone._pressed) return;

        hitZone._pressed = false;
        this.tweens.killTweensOf(grp, "scale");
        this.tweens.add({
            targets: grp,
            scale: baseScale,
            duration: 400,
            ease: "Bounce.Out"
        });

        if (runCallback) {
            callback?.();
        }
    };

    hitZone.on("pointerup", () => release(true));
    hitZone.on("pointerout", () => release(false));
    hitZone.on("pointerupoutside", () => release(false));

    return grp;
  }


  _makeEditorVisualHitButton(parent, x, y, hitW, hitH, buildVisual, callback) {
    const root = this.add.container(x, y);
    const visualRoot = this.add.container(0, 0);

    const visual = buildVisual(visualRoot);

    const hit = this.add.rectangle(0, 0, hitW, hitH, 0xffffff, 0.001)
        .setOrigin(0.5)
        .setInteractive();

    root.add([visualRoot, hit]);
    parent.add(root);

    root._editorVisualBaseScale = visualRoot.scaleX || 1;

    const getBaseScale = () => root._editorVisualBaseScale || visualRoot.scaleX || 1;

    this._makeCompositeBouncyButton(
        hit,
        [{ target: visualRoot, getBaseScale }],
        1,
        () => {
            callback?.();
        }
    );

    return {
        root,
        hit,
        visualRoot,
        visual,
        baseScale: getBaseScale(),
        setBaseScale: (scale) => {
            root._editorVisualBaseScale = scale;
            visualRoot.setScale(scale);
        }
    };
  }


  _makeCurrentSpeedPreview(parent, x, y, objectId, callback, targetHeight = 76, heightMultiplier = 1) {
    const objectDef = typeof getObjectFromId === "function" ? getObjectFromId(objectId) : null;
    let frameName = objectDef?.frame || null;

    if (objectDef?.randomFrames && objectDef.randomFrames.length) {
        frameName = objectDef.randomFrames[0];
    }

    let icon = null;

    if (frameName) {
        icon = this._addSafeFrameImage(x, y, frameName, 1);
    }

    if (icon && typeof icon.setScale === "function") {
        const rawHeight = icon.height || ((icon.displayHeight || 1) / (icon.scaleY || 1)) || 1;
        let iconScale = (targetHeight * heightMultiplier) / rawHeight;

        if (!Number.isFinite(iconScale) || iconScale <= 0) {
            iconScale = 1;
        }

        icon.setScale(iconScale);
        icon._bouncyBaseScale = iconScale;

        if (typeof icon.setInteractive === "function") {
            icon.setInteractive();
        }

        parent.add(icon);

        this._makeBouncyButton(icon, iconScale, () => {
            callback?.();
        });

        return {
            root: icon,
            hit: icon,
            visualRoot: icon,
            visual: icon,
            baseScale: iconScale,
            setBaseScale: (scale) => {
                icon._bouncyBaseScale = scale;
                icon.setScale(scale);
            }
        };
    }

    const fallback = this.add.bitmapText(x, y, "bigFont", "?", 42)
        .setOrigin(0.5)
        .setInteractive();

    parent.add(fallback);

    fallback._bouncyBaseScale = 1;

    this._makeBouncyButton(fallback, 1, () => {
        callback?.();
    });

    return {
        root: fallback,
        hit: fallback,
        visualRoot: fallback,
        visual: fallback,
        baseScale: 1,
        setBaseScale: (scale) => {
            fallback._bouncyBaseScale = scale;
            fallback.setScale(scale);
        }
    };
  }


  _makeGamemodeIconButton(parent, x, y, modeDef, callback) {
    const iconScale = 0.88;
    const icon = this._addSafeFrameImage(x, y, modeDef.frame, iconScale);

    if (modeDef.rotateFlip) {
        icon.setAngle(90);
        icon.setFlipY(true);
    }

    if (typeof icon.setInteractive === "function") {
        icon.setInteractive();
    }

    parent.add(icon);

    this._makeBouncyButton(icon, iconScale, () => {
        callback?.();
    });

    return {
        root: icon,
        hit: icon,
        visualRoot: icon,
        visual: icon,
        baseScale: iconScale
    };
  }


  _makeEditorAtlasIconButton(parent, x, y, optionDef, callback, targetHeight = 58) {
    const icon = this._addSafeFrameImage(x, y, optionDef.frame, 1);

    let iconScale = 1;
    const rawHeight = icon.height || ((icon.displayHeight || 1) / (icon.scaleY || 1)) || 1;

    if (rawHeight > 0) {
        iconScale = targetHeight / rawHeight;
    }

    if (!Number.isFinite(iconScale) || iconScale <= 0) {
        iconScale = 1;
    }

    if (typeof icon.setScale === "function") {
        icon.setScale(iconScale);
        icon._bouncyBaseScale = iconScale;
    }

    if (typeof icon.setInteractive === "function") {
        icon.setInteractive();
    }

    parent.add(icon);

    this._makeBouncyButton(icon, iconScale, () => {
        callback?.();
    });

    return {
        root: icon,
        hit: icon,
        visualRoot: icon,
        visual: icon,
        baseScale: iconScale,
        setBaseScale: (scale) => {
            icon._bouncyBaseScale = scale;
            icon.setScale(scale);
        }
    };
  }


  _openEditorStartOptionsPopup() {
    if (this._editorStartOptionsPopup) return;

    const sw = screenWidth;
    const sh = screenHeight;
    const panelW = 520;
    const panelH = 420;

    const root = this.add.container(0, 0).setScrollFactor(0).setDepth(2650);
    this._editorStartOptionsPopup = root;

    const blocker = this.add.rectangle(0, 0, sw, sh, 0x000000, 0.25)
        .setOrigin(0)
        .setInteractive();

    root.add(blocker);

    const inner = this.add.container(sw / 2, sh / 2 + 15)
        .setScale(1);

    root.add(inner);

    const corner = this.textures.exists("GJ_square01") ? this.textures.get("GJ_square01").source[0].width * 0.325 : 24;

    const panel = this._drawScale9(
        0,
        0,
        panelW,
        panelH,
        "GJ_square01",
        corner,
        0xffffff,
        1
    );

    inner.add(panel);

    const closeBtn = this.add.image(
        -(panelW / 2) + 10,
        -(panelH / 2) + 10,
        "GJ_WebSheet",
        "GJ_closeBtn_001.png"
    )
        .setScale(0.8)
        .setInteractive();

    inner.add(closeBtn);

    this._makeBouncyButton(closeBtn, 0.8, () => {
        this._closeEditorStartOptionsPopup();
    });

    const optionDefs = [
        { label: "Mini Mode", key: "kA3" },
        { label: "Flip Gravity", key: "kA11" },
        { label: "Dual Mode", key: "kA8" },
        { label: "Mirror Mode", key: "kA28" }
    ];

    const makeToggle = (label, key, y) => {
        const row = this.add.container(-150, y);
        const check = this.add.image(0, 0, "GJ_GameSheet03", "GJ_checkOff_001.png").setScale(0.9).setInteractive();
        const text = this.add.bitmapText(48, -2, "bigFont", label, 28).setOrigin(0, 0.5).setInteractive();

        row.add([check, text]);
        inner.add(row);

        const refresh = () => {
            const checked = this._getEditorStartValue(key, 0) === 1;
            check.setTexture(
                "GJ_GameSheet03",
                checked ? "GJ_checkOn_001.png" : "GJ_checkOff_001.png"
            );
        };

        const toggle = () => {
            const checked = this._getEditorStartValue(key, 0) === 1;
            this._setEditorStartValueDraft(key, checked ? 0 : 1);
            refresh();
        };

        this._makeBouncyButton(check, 0.9, toggle);
        text.on("pointerdown", toggle);

        refresh();

        return row;
    };

    optionDefs.forEach((opt, i) => {
        makeToggle(opt.label, opt.key, -130 + i * 80);
    });
  }


  _applyLevelStartOptions() {
    const getBool = (key) => parseInt(window.settingsMap?.[key] || "0", 10) === 1;

    this._state.isMini = getBool("kA3");
    this._state.gravityFlipped = getBool("kA11");
    this._state.mirrored = getBool("kA28");

    if (getBool("kA8")) {
        this._enableDualMode();
    }
  }


  _closeEditorStartOptionsPopup() {
    if (this._editorStartOptionsPopup) {
        this._editorStartOptionsPopup.destroy();
        this._editorStartOptionsPopup = null;
    }
  }


  _openEditorHorizontalOptionPopup(titleText, options, selectedKey, onSelect, renderOption) {
    this._closeEditorHorizontalOptionPopup();

    const sw = screenWidth;
    const sh = screenHeight;
    const isGamemodePopup = titleText === "Select Mode";
    const isSpeedPopup = titleText === "Select Speed";
    const isBgPopup = titleText === "Select Background";
    const isGroundPopup = titleText === "Select Ground";
    const isArtPopup = isBgPopup || isGroundPopup;

    const root = this.add.container(0, 0).setScrollFactor(0).setDepth(2600);
    this._editorHorizontalOptionPopup = root;

    const blocker = this.add.rectangle(0, 0, sw, sh, 0x000000, 0.25).setOrigin(0).setInteractive();
    root.add(blocker);

    const optionCols = isArtPopup ? 10 : options.length;
    const optionRows = isArtPopup ? Math.ceil(options.length / optionCols) : 1;

    const optionGapX = isArtPopup ? 76 : (isGamemodePopup ? 84 : (isSpeedPopup ? 150 : 142));
    const optionGapY = isArtPopup ? 68 : 0;

    const panelW = isArtPopup ? 860 : 760;
    const panelH = isArtPopup ? Math.min(650, 225 + optionRows * optionGapY) - 45 : 340;

    const speedTargetHeight = 112;
    const artGridYOffset = isArtPopup ? -20 : 0;

    const inner = this.add.container(sw / 2, sh / 2 + 15).setScale(1);
    root.add(inner);

    const corner = this.textures.exists("GJ_square01")
        ? this.textures.get("GJ_square01").source[0].width * 0.325
        : 24;

    const panel = this._drawScale9(0, 0, panelW, panelH, "GJ_square01", corner, 0xffffff, 1);
    inner.add(panel);

    const title = this.add.bitmapText(0, -(panelH / 2) + 50, "bigFont", titleText, isArtPopup ? 52 : 60).setOrigin(0.5);
    inner.add(title);

    let selected = selectedKey;
    const optionObjects = [];

    const setTintDeep = (obj, tint) => {
        if (!obj) return;

        if (tint === null) {
            if (typeof obj.clearTint === "function") obj.clearTint();
        } else if (typeof obj.setTint === "function") {
            obj.setTint(tint);
        }

        if (Array.isArray(obj.list)) {
            for (const child of obj.list) {
                setTintDeep(child, tint);
            }
        }
    };

    const getVisualHeight = (obj) => {
        if (!obj) return 0;

        if (typeof obj.getBounds === "function") {
            const bounds = obj.getBounds();
            if (bounds && bounds.height > 0) {
                return bounds.height;
            }
        }

        if (obj.displayHeight > 0) return obj.displayHeight;
        if (obj.height > 0) return obj.height * (obj.scaleY || 1);

        return 0;
    };

    const refreshSelected = () => {
        for (const entry of optionObjects) {
            const isSelected = entry.key === selected;
            const baseScale = entry.baseScale || 1;

            entry.visualRoot.setScale(baseScale);
            entry.visualRoot.setAlpha(1);
            setTintDeep(entry.visualRoot, isSelected ? null : 0x666666);
        }
    };

    options.forEach((opt, i) => {
        const row = isArtPopup ? Math.floor(i / optionCols) : 0;
        const col = isArtPopup ? (i % optionCols) : i;
        const itemsInRow = isArtPopup ? Math.min(optionCols, options.length - row * optionCols) : options.length;

        const ox = ((col - ((itemsInRow - 1) / 2)) * optionGapX) + (isSpeedPopup ? -15 : 0);
        const oy = isArtPopup
            ? (-(optionRows - 1) * optionGapY / 2) + row * optionGapY + 16 + artGridYOffset
            : -2;

        const buttonObj = renderOption(inner, opt, ox, oy, () => {
            selected = opt.key;
            onSelect(opt);
            refreshSelected();
        }, i);

        const visualRoot = buttonObj.visualRoot || buttonObj.root;

        let baseScale = buttonObj.baseScale || visualRoot.scaleX || 1;

        if (isSpeedPopup) {
            const currentHeight = getVisualHeight(visualRoot);

            if (currentHeight > 0) {
                const targetHeight = speedTargetHeight * (i === 0 ? 0.8 : 1);
                baseScale = baseScale * (targetHeight / currentHeight);
            }
        }

        if (buttonObj.setBaseScale) {
            buttonObj.setBaseScale(baseScale);
        } else {
            visualRoot._bouncyBaseScale = baseScale;
            visualRoot.setScale(baseScale);
        }

        optionObjects.push({
            key: opt.key,
            root: buttonObj.root,
            visualRoot,
            baseScale
        });
    });

    this._makeEditorOkButton(inner, 0, (panelH / 2) - 52, "OK", () => {
        this._closeEditorHorizontalOptionPopup();
    });

    refreshSelected();
  }


  _openEditorColorPickerPopup(channelId, labelText, onColorChanged, pickerOptions = {}) {
    this._closeEditorColorPickerPopup();

    const sw = screenWidth;
    const sh = screenHeight;

    const root = this.add.container(0, 0).setScrollFactor(0).setDepth(2700);
    this._editorColorPickerPopup = root;

    const blocker = this.add.rectangle(0, 0, sw, sh, 0x000000, 0.32).setOrigin(0).setInteractive();
    root.add(blocker);

    const panelW = pickerOptions.panelW || 820;
    const panelH = pickerOptions.panelH || 520;
    const contentYOffset = Number(pickerOptions.contentYOffset ?? 0) || 0;

    const inner = this.add.container(sw / 2, sh / 2).setScale(1);
    root.add(inner);

    const corner = this.textures.exists("GJ_square01") ? this.textures.get("GJ_square01").source[0].width * 0.325 : 24;
    const panel = this._drawScale9(0, 0, panelW, panelH, "GJ_square01", corner, 0xffffff, 1);
    inner.add(panel);

    const normalizeRgbColorObject = (color) => ({
        r: Phaser.Math.Clamp(parseInt(color?.r ?? 255, 10) || 0, 0, 255),
        g: Phaser.Math.Clamp(parseInt(color?.g ?? 255, 10) || 0, 0, 255),
        b: Phaser.Math.Clamp(parseInt(color?.b ?? 255, 10) || 0, 0, 255)
    });

    const pickerTitleText = labelText ? String(labelText) : "Select Color";
    const title = this.add.bitmapText(0, -(panelH / 2) + 40, "goldFont", pickerTitleText, 34).setOrigin(0.5);
    inner.add(title);

    const currentColor = pickerOptions.initialColor
        ? normalizeRgbColorObject(pickerOptions.initialColor)
        : this._getEditorColorChannel(channelId);
    const originalColor = {
        r: currentColor.r,
        g: currentColor.g,
        b: currentColor.b
    };
    const currentHsv = this._rgbToHsv(currentColor.r, currentColor.g, currentColor.b);

    const pickerX = 0;
    const pickerYOffset = Number(pickerOptions.pickerYOffset ?? contentYOffset) || 0;
    const pickerY = pickerYOffset;
    const pickerScale = 0.42;
    const hueRingInnerRadius = 94;
    const hueRingOuterRadius = 126;
    const shadowRadius = (220 * pickerScale) - 1;
    const innerRadius = shadowRadius;

    const startHueAngle = Phaser.Math.DegToRad(currentHsv.h - 90);

    const state = {
        h: currentHsv.h,

        innerX: 0,
        innerY: 0,

        hueX: Math.cos(startHueAngle) * 110,
        hueY: Math.sin(startHueAngle) * 110,

        sampledColor: {
            r: currentColor.r,
            g: currentColor.g,
            b: currentColor.b
        }
    };

    let activePickerTarget = null;

    const toHexNumber = (color) => {
        return Phaser.Display.Color.GetColor(color.r, color.g, color.b);
    };

    const toHexString = (color) => {
        const toPart = (v) => {
            return Phaser.Math.Clamp(Math.round(v), 0, 255)
                .toString(16)
                .padStart(2, "0")
                .toUpperCase();
        };

        return `${toPart(color.r)}${toPart(color.g)}${toPart(color.b)}`;
    };

    const normalizeColor = (color) => {
        return {
            r: Phaser.Math.Clamp(parseInt(color.r, 10) || 0, 0, 255),
            g: Phaser.Math.Clamp(parseInt(color.g, 10) || 0, 0, 255),
            b: Phaser.Math.Clamp(parseInt(color.b, 10) || 0, 0, 255)
        };
    };

    const parseHexColor = (raw) => {
        let value = String(raw || "")
            .replace(/^#/, "")
            .replace(/[^0-9a-fA-F]/g, "")
            .toUpperCase();

        if (value.length !== 6) return null;

        return {
            r: parseInt(value.slice(0, 2), 16),
            g: parseInt(value.slice(2, 4), 16),
            b: parseInt(value.slice(4, 6), 16)
        };
    };

    const menuPanelBg = this._addColourPickerImage(
        pickerX,
        pickerY,
        "menuColourPanelBackground.png",
        pickerScale
    );

    if (menuPanelBg && typeof menuPanelBg.setFlipX === "function") {
        menuPanelBg.setFlipX(true);
    }

    const hueBg = this._addColourPickerImage(
        pickerX,
        pickerY,
        "huePickerBackground.png",
        pickerScale
    );

    const innerCircleBg = this._addColourPickerImage(
        pickerX,
        pickerY,
        "colourPickerBackground.png",
        pickerScale
    );

    const selectedColorCircle = this.add.circle(
        pickerX,
        pickerY,
        innerRadius,
        0xffffff,
        1
    );

    const innerShadow = this._addColourPickerImage(
        pickerX,
        pickerY,
        "colourPickerShadow.png",
        pickerScale
    );

    const innerOverlay = this._addColourPickerImage(
        pickerX,
        pickerY,
        "colourPickerOverlay.png",
        pickerScale
    );

    const hueHandle = this._addColourPickerImage(
        pickerX,
        pickerY,
        "colourPicker.png",
        pickerScale
    );

    const svHandle = this._addColourPickerImage(
        pickerX,
        pickerY,
        "colourPicker.png",
        pickerScale
    );

    const previewSize = 42;
    const previewX = -(panelW / 2) + 46;
    const previewY = -(panelH / 2) + 43;

    const currentPreview = this.add.rectangle(
        previewX,
        previewY,
        previewSize,
        previewSize,
        toHexNumber(currentColor),
        1
    );

    const originalPreview = this.add.rectangle(
        previewX,
        previewY + previewSize,
        previewSize,
        previewSize,
        toHexNumber(originalColor),
        1
    );

    const inputState = {
        focused: null,
        values: {
            r: String(currentColor.r),
            g: String(currentColor.g),
            b: String(currentColor.b),
            hex: toHexString(currentColor)
        },
        fields: {}
    };

    const createInputField = (key, label, x, y, w, maxChars) => {
        const labelObj = this.add.bitmapText(x, y - 37, "goldFont", label, 22).setOrigin(0.5).setAlpha(0.95);
        const bg = this.add.rectangle(x, y, w, 34, 0x000000, 0.38).setOrigin(0.5).setInteractive();
        const valueText = this.add.bitmapText(x, y, "bigFont", "", 20).setOrigin(0.5);
        const hit = this.add.rectangle(x, y, w, 40, 0xffffff, 0.001).setOrigin(0.5).setInteractive();

        inputState.fields[key] = {
            key,
            label,
            bg,
            valueText,
            maxChars
        };

        hit.on("pointerdown", (pointer) => {
            inputState.focused = key;
            this._editorTextInputFocused = true;
            renderInputFields();

            if (pointer && pointer.event) {
                pointer.event.preventDefault?.();
                pointer.event.stopPropagation?.();
                pointer.event.stopImmediatePropagation?.();
            }
        });

        inner.add([labelObj, bg, valueText, hit]);
    };

    const inputLeftX = -(panelW / 2) + 60;
    const rgbInputY = -34 + contentYOffset;
    const rgbGap = 76;

    createInputField("r", "R:", inputLeftX, rgbInputY, 68, 3);
    createInputField("g", "G:", inputLeftX + rgbGap, rgbInputY, 68, 3);
    createInputField("b", "B:", inputLeftX + (rgbGap * 2), rgbInputY, 68, 3);
    createInputField("hex", "HEX:", inputLeftX + rgbGap, 50 + contentYOffset, 152, 6);

    inner.add([
        menuPanelBg,
        hueBg,
        innerCircleBg,
        selectedColorCircle,
        innerShadow,
        innerOverlay,
        hueHandle,
        svHandle,
        currentPreview,
        originalPreview
    ]);

    const getTextureFrame = (frameName) => {
        const ref = this._getColourPickerTextureRef(frameName);
        if (!ref) return null;

        const tex = this.textures.get(ref.key);
        if (!tex) return null;

        const frame =
            typeof tex.get === "function"
                ? tex.get(ref.frame || "__BASE")
                : null;

        if (!frame || !frame.source || !frame.source.image) {
            return null;
        }

        return frame;
    };

    const drawFrameToCanvas = (ctx, frameName, destW, destH) => {
        const frame = getTextureFrame(frameName);
        if (!frame) return false;

        const sourceImage = frame.source.image;

        ctx.drawImage(
            sourceImage,
            frame.cutX,
            frame.cutY,
            frame.cutWidth,
            frame.cutHeight,
            0,
            0,
            destW,
            destH
        );

        return true;
    };

    const colorDistanceSq = (a, b) => {
        const dr = a.r - b.r;
        const dg = a.g - b.g;
        const db = a.b - b.b;

        return dr * dr + dg * dg + db * db;
    };

    const hueDistance = (a, b) => {
        let d = Math.abs(a - b) % 360;
        if (d > 180) d = 360 - d;
        return d;
    };

    const sampleSize = Math.ceil(440 * pickerScale);
    const sampleRadius = sampleSize / 2;

    const sampleCanvas = document.createElement("canvas");
    sampleCanvas.width = sampleSize;
    sampleCanvas.height = sampleSize;

    const sampleCtx = sampleCanvas.getContext("2d", {
        willReadFrequently: true
    });

    const hueSampleSize = Math.ceil(600 * pickerScale);
    const hueSampleRadius = hueSampleSize / 2;

    const hueSampleCanvas = document.createElement("canvas");
    hueSampleCanvas.width = hueSampleSize;
    hueSampleCanvas.height = hueSampleSize;

    const hueSampleCtx = hueSampleCanvas.getContext("2d", {
        willReadFrequently: true
    });

    let hueSampleReady = false;

    const rebuildHueSampleCanvas = () => {
        hueSampleCtx.clearRect(0, 0, hueSampleSize, hueSampleSize);

        hueSampleReady = drawFrameToCanvas(
            hueSampleCtx,
            "huePickerBackground.png",
            hueSampleSize,
            hueSampleSize
        );
    };

    const rebuildInnerSampleCanvas = () => {
        const huePure = this._hsvToRgb(state.h, 1, 1);
        const hueHex = Phaser.Display.Color.GetColor(huePure.r, huePure.g, huePure.b);

        selectedColorCircle.setFillStyle(hueHex, 1);

        sampleCtx.clearRect(0, 0, sampleSize, sampleSize);

        drawFrameToCanvas(sampleCtx, "colourPickerBackground.png", sampleSize, sampleSize);

        sampleCtx.save();
        sampleCtx.globalCompositeOperation = "source-over";
        sampleCtx.fillStyle = `rgb(${huePure.r}, ${huePure.g}, ${huePure.b})`;
        sampleCtx.beginPath();
        sampleCtx.arc(sampleRadius, sampleRadius, sampleRadius, 0, Math.PI * 2);
        sampleCtx.fill();
        sampleCtx.restore();

        drawFrameToCanvas(sampleCtx, "colourPickerShadow.png", sampleSize, sampleSize);
        drawFrameToCanvas(sampleCtx, "colourPickerOverlay.png", sampleSize, sampleSize);
    };

    const findHuePositionForLoadedColor = (targetColor) => {
        if (!hueSampleReady) {
            rebuildHueSampleCanvas();
        }

        const targetHsv = this._rgbToHsv(targetColor.r, targetColor.g, targetColor.b);
        let best = null;

        const fallbackAngle = Phaser.Math.DegToRad(targetHsv.h - 90);
        const fallback = {
            x: Math.cos(fallbackAngle) * ((hueRingInnerRadius + hueRingOuterRadius) / 2),
            y: Math.sin(fallbackAngle) * ((hueRingInnerRadius + hueRingOuterRadius) / 2)
        };

        if (!hueSampleReady) {
            return fallback;
        }

        for (let y = 0; y < hueSampleSize; y += 2) {
            for (let x = 0; x < hueSampleSize; x += 2) {
                const dx = x - hueSampleRadius;
                const dy = y - hueSampleRadius;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < hueRingInnerRadius || dist > hueRingOuterRadius) continue;

                const pixel = hueSampleCtx.getImageData(x, y, 1, 1).data;
                if (pixel[3] < 12) continue;

                const rgb = {
                    r: pixel[0],
                    g: pixel[1],
                    b: pixel[2]
                };

                const hsv = this._rgbToHsv(rgb.r, rgb.g, rgb.b);
                if (hsv.s < 0.08) continue;

                const midRadius = (hueRingInnerRadius + hueRingOuterRadius) / 2;
                const radiusPenalty = Math.abs(dist - midRadius) * 0.08;
                const huePenalty = hueDistance(hsv.h, targetHsv.h);

                const score = huePenalty + radiusPenalty;

                if (!best || score < best.score) {
                    best = {
                        x: dx,
                        y: dy,
                        score
                    };
                }
            }
        }

        return best || fallback;
    };

    const sampleHuePixel = () => {
        if (!hueSampleReady) {
            rebuildHueSampleCanvas();
        }

        const canvasX = Math.round(hueSampleRadius + state.hueX);
        const canvasY = Math.round(hueSampleRadius + state.hueY);

        const clampedX = Phaser.Math.Clamp(canvasX, 0, hueSampleSize - 1);
        const clampedY = Phaser.Math.Clamp(canvasY, 0, hueSampleSize - 1);

        const pixel = hueSampleCtx.getImageData(clampedX, clampedY, 1, 1).data;

        const sampledRgb = {
            r: pixel[0],
            g: pixel[1],
            b: pixel[2]
        };

        const sampledHsv = this._rgbToHsv(sampledRgb.r, sampledRgb.g, sampledRgb.b);

        if (sampledHsv.s > 0.08) {
            state.h = sampledHsv.h;
        }

        return sampledRgb;
    };

    const findInnerPositionForLoadedColor = (targetColor) => {
        rebuildInnerSampleCanvas();

        let best = null;
        for (let y = 1; y < sampleSize - 1; y++) {
            for (let x = 1; x < sampleSize - 1; x++) {
                const dx = x - sampleRadius;
                const dy = y - sampleRadius;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > innerRadius) continue;

                const pixel = sampleCtx.getImageData(x, y, 1, 1).data;
                if (pixel[3] < 12) continue;

                const rgb = {
                    r: pixel[0],
                    g: pixel[1],
                    b: pixel[2]
                };

                const score = colorDistanceSq(rgb, targetColor);

                if (!best || score < best.score) {
                    best = {
                        x: dx,
                        y: dy,
                        color: rgb,
                        score
                    };
                }
            }
        }

        if (best) return best;

        return {
            x: 0,
            y: 0,
            color: targetColor,
            score: 0
        };
    };

    const sampleInnerPixel = () => {
        rebuildInnerSampleCanvas();

        const canvasX = Math.round(sampleRadius + state.innerX);
        const canvasY = Math.round(sampleRadius + state.innerY);

        const clampedX = Phaser.Math.Clamp(canvasX, 1, sampleSize - 2);
        const clampedY = Phaser.Math.Clamp(canvasY, 1, sampleSize - 2);

        const pixel = sampleCtx.getImageData(clampedX, clampedY, 1, 1).data;

        if (pixel[3] < 12) {
            return state.sampledColor;
        }

        state.sampledColor = {
            r: pixel[0],
            g: pixel[1],
            b: pixel[2]
        };

        return state.sampledColor;
    };

    const getLocalPointer = (pointer) => {
        return {
            x: pointer.x - (sw / 2),
            y: pointer.y - (sh / 2)
        };
    };

    const getPointerDeltaFromPicker = (pointer) => {
        const p = getLocalPointer(pointer);

        return {
            dx: p.x - pickerX,
            dy: p.y - pickerY
        };
    };

    const getPointerDistanceFromPicker = (pointer) => {
        const { dx, dy } = getPointerDeltaFromPicker(pointer);
        return Math.sqrt(dx * dx + dy * dy);
    };

    const clampPointToHuePickerBackground = (dx, dy) => {
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 0.0001) {
            dx = 0;
            dy = -hueRingInnerRadius;
            dist = hueRingInnerRadius;
        }

        const clampedDist = Phaser.Math.Clamp(
            dist,
            hueRingInnerRadius,
            hueRingOuterRadius
        );

        return {
            x: dx / dist * clampedDist,
            y: dy / dist * clampedDist
        };
    };

    const clampPointToColourPickerShadow = (dx, dy) => {
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > innerRadius && dist > 0.0001) {
            return {
                x: dx / dist * innerRadius,
                y: dy / dist * innerRadius
            };
        }

        return {
            x: dx,
            y: dy
        };
    };

    const isColourPickerShadowPointer = (pointer) => {
        const dist = getPointerDistanceFromPicker(pointer);

        return dist <= innerRadius;
    };

    const isHueRingPointer = (pointer) => {
        const dist = getPointerDistanceFromPicker(pointer);

        return dist >= hueRingInnerRadius && dist <= hueRingOuterRadius;
    };

    function renderInputFields() {
        for (const key in inputState.fields) {
            const field = inputState.fields[key];
            const isFocused = inputState.focused === key;
            const raw = inputState.values[key] ?? "";
            const displayValue = raw;

            field.bg.setFillStyle(isFocused ? 0x000000 : 0x000000, isFocused ? 0.56 : 0.38);
            field.valueText.setText(`${displayValue}${isFocused ? "|" : ""}`);
        }
    }

    const setInputValuesFromColor = (color) => {
        const normalized = normalizeColor(color);

        inputState.values.r = String(normalized.r);
        inputState.values.g = String(normalized.g);
        inputState.values.b = String(normalized.b);
        inputState.values.hex = toHexString(normalized);

        renderInputFields();
    };

    const updateColorUi = (color, commitDraft = true, syncInputs = true) => {
        const normalized = normalizeColor(color);
        const hex = toHexNumber(normalized);

        state.sampledColor = normalized;
        currentPreview.setFillStyle(hex, 1);

        hueHandle.setPosition(
            pickerX + state.hueX,
            pickerY + state.hueY
        );

        svHandle.setPosition(
            pickerX + state.innerX,
            pickerY + state.innerY
        );

        if (syncInputs) {
            setInputValuesFromColor(normalized);
        }

        if (commitDraft && pickerOptions.commitColorChannel !== false) {
            this._setEditorColorChannelDraft(channelId, normalized);
        }

        if (onColorChanged) {
            onColorChanged(normalized);
        }
    };

    const setPickerPositionForColor = (color) => {
        const normalized = normalizeColor(color);
        const loadedHuePos = findHuePositionForLoadedColor(normalized);

        state.hueX = loadedHuePos.x;
        state.hueY = loadedHuePos.y;

        sampleHuePixel();

        const loadedInnerPos = findInnerPositionForLoadedColor(normalized);

        state.innerX = loadedInnerPos.x;
        state.innerY = loadedInnerPos.y;
    };

    const applyTypedColor = (color, commitDraft = true) => {
        const normalized = normalizeColor(color);

        inputState.focused = inputState.focused;
        setPickerPositionForColor(normalized);
        updateColorUi(normalized, commitDraft, true);
    };

    const tryApplyRgbInputs = () => {
        if (
            inputState.values.r === "" ||
            inputState.values.g === "" ||
            inputState.values.b === ""
        ) {
            renderInputFields();
            return;
        }

        applyTypedColor({
            r: inputState.values.r,
            g: inputState.values.g,
            b: inputState.values.b
        });
    };

    const tryApplyHexInput = () => {
        const parsed = parseHexColor(inputState.values.hex);

        if (!parsed) {
            renderInputFields();
            return;
        }

        applyTypedColor(parsed);
    };

    const applyColor = (commitDraft = true) => {
        const color = sampleInnerPixel();
        updateColorUi(color, commitDraft, true);
    };

    const moveHuePickerToPointer = (pointer) => {
        inputState.focused = null;
        this._editorTextInputFocused = false;
        renderInputFields();

        let { dx, dy } = getPointerDeltaFromPicker(pointer);
        const clamped = clampPointToHuePickerBackground(dx, dy);

        state.hueX = clamped.x;
        state.hueY = clamped.y;

        sampleHuePixel();

        applyColor(true);
    };

    const moveInnerPickerToPointer = (pointer) => {
        inputState.focused = null;
        this._editorTextInputFocused = false;
        renderInputFields();

        let { dx, dy } = getPointerDeltaFromPicker(pointer);
        const clamped = clampPointToColourPickerShadow(dx, dy);

        state.innerX = clamped.x;
        state.innerY = clamped.y;

        applyColor(true);
    };

    const beginPickerDrag = (pointer) => {
        if (isColourPickerShadowPointer(pointer)) {
            activePickerTarget = "inner";
            moveInnerPickerToPointer(pointer);
            return;
        }

        if (isHueRingPointer(pointer)) {
            activePickerTarget = "hue";
            moveHuePickerToPointer(pointer);
            return;
        }

        activePickerTarget = null;
    };

    const continuePickerDrag = (pointer) => {
        if (activePickerTarget === "inner") {
            moveInnerPickerToPointer(pointer);
            return;
        }

        if (activePickerTarget === "hue") {
            moveHuePickerToPointer(pointer);
        }
    };

    const endPickerDrag = () => {
        activePickerTarget = null;
    };

    const pickerHit = this.add.circle(
        pickerX,
        pickerY,
        hueRingOuterRadius + 20,
        0xffffff,
        0.001
    )
        .setInteractive({ draggable: true });

    inner.add(pickerHit);

    pickerHit.on("pointerdown", beginPickerDrag);
    pickerHit.on("drag", continuePickerDrag);
    pickerHit.on("pointerup", endPickerDrag);
    pickerHit.on("pointerout", endPickerDrag);
    pickerHit.on("pointerupoutside", endPickerDrag);

    this._editorColorPickerKeyHandler = (event) => {
        if (!this._editorColorPickerPopup || !inputState.focused) return;

        this._editorTextInputFocused = true;

        const key = inputState.focused;

        if (event.key === "Escape" || event.key === "Enter") {
            inputState.focused = null;
            this._editorTextInputFocused = false;
            renderInputFields();
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation?.();
            return;
        }

        if (event.key === "Backspace") {
            inputState.values[key] = String(inputState.values[key] || "").slice(0, -1);
        } else if (key === "hex") {
            if (/^[0-9a-fA-F]$/.test(event.key) && inputState.values.hex.length < 6) {
                inputState.values.hex += event.key.toUpperCase();
            } else {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation?.();
                return;
            }
        } else if (/^[0-9]$/.test(event.key) && inputState.values[key].length < 3) {
            inputState.values[key] += event.key;
        } else {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation?.();
            return;
        }

        if (key === "hex") {
            tryApplyHexInput();
        } else {
            tryApplyRgbInputs();
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
    };

    window.addEventListener("keydown", this._editorColorPickerKeyHandler);

    blocker.on("pointerdown", () => {
        inputState.focused = null;
        this._editorTextInputFocused = false;
        renderInputFields();
    });

    rebuildHueSampleCanvas();
    setPickerPositionForColor(currentColor);
    state.sampledColor = normalizeColor(currentColor);

    const pickerApi = {
        getColor: () => ({ ...state.sampledColor }),
        setColor: (color, commitDraft = true) => applyTypedColor(color, commitDraft),
        title,
        panelW,
        panelH
    };

    if (pickerOptions && typeof pickerOptions.onBuildExtra === "function") {
        pickerOptions.onBuildExtra(inner, panelW, panelH, pickerApi);
    }

    this._makeEditorOkButton(inner, 0, (panelH / 2) - 55, "OK", () => {
        this._closeEditorColorPickerPopup();
    });

    updateColorUi(currentColor, false, true);
  }


  _getEditorColorChannelLabel(channelId) {
    const parsed = parseInt(channelId ?? 0, 10);
    const names = {
        1000: "BG",
        1001: "G1",
        1002: "L",
        1003: "3DL",
        1004: "Obj",
        1009: "G2",
        1013: "MG"
    };

    return names[parsed] || (parsed > 0 ? String(parsed) : "None");
  }


  _isEditorColorTriggerId(id) {
    return [29, 30, 105, 744, 899, 900, 915].includes(parseInt(id ?? 0, 10));
  }


  _isEditorStartPositionId(id) {
    return [31, 34].includes(parseInt(id ?? 0, 10));
  }


  _isEditorTextObjectId(id) {
    const objectDef = getObjectFromId(parseInt(id ?? 0, 10));
    return !!(objectDef && objectDef.textObject);
  }


  _getEditorTextObjectText(saveObj) {
    const raw = saveObj?._raw || {};
    const objectDef = getObjectFromId(saveObj?.id);
    const textValue = saveObj?.text ?? _editorDecodeTextObjectString(raw[31] ?? raw["31"] ?? objectDef?.defaultText ?? "A");
    return String(textValue ?? "");
  }


  _setEditorTextObjectText(saveObj, value) {
    if (!saveObj) return;
    const textValue = String(value ?? "");
    saveObj.text = textValue;
    const encodedTextValue = _editorEncodeTextObjectString(textValue);
    saveObj._raw = saveObj._raw || {};
    saveObj._raw[31] = encodedTextValue;
    saveObj._raw["31"] = encodedTextValue;
    this._refreshSelectedTextObjectVisual(saveObj);
  }


  _refreshSelectedTextObjectVisual(saveObj) {
    const linkedId = Number.isInteger(saveObj?._eeObjectId) ? saveObj._eeObjectId : window.editorSelectedObject;
    const linkedSprites = this._level?.objectSprites?.[linkedId] || [];
    const newText = this._getEditorTextObjectText(saveObj);
    for (const spr of linkedSprites) {
        if (spr?._eeTextObject && spr.setText) spr.setText(newText);
    }
  }


  _getSelectedEditorSaveObject() {
    const selectedObjectIds = this._getCurrentSelectedEditorObjectIds ? this._getCurrentSelectedEditorObjectIds() : [];
    const selectedObjectId = selectedObjectIds.length ? selectedObjectIds[0] : window.editorSelectedObject;
    if (selectedObjectId === -1 || selectedObjectId === undefined || selectedObjectId === null) return null;
    return this._getEditorSaveObjectForObjectId(selectedObjectId);
  }


  _getSelectedEditorSaveObjects() {
    const selectedObjectIds = this._getCurrentSelectedEditorObjectIds ? this._getCurrentSelectedEditorObjectIds() : [];
    return selectedObjectIds
      .map(objectId => this._getEditorSaveObjectForObjectId(objectId))
      .filter(Boolean);
  }


  _isSelectedEditorObjectTrigger() {
    const selectedObjectIds = this._getCurrentSelectedEditorObjectIds ? this._getCurrentSelectedEditorObjectIds() : [];
    if (selectedObjectIds.length !== 1) return false;
    const saveObj = this._getEditorSaveObjectForObjectId(selectedObjectIds[0]);
    if (!saveObj) return false;
    const objectDef = getObjectFromId(saveObj.id);
    return !!(objectDef && objectDef.type === triggerType);
  }


  _getEditorObjectColor(saveObj, fallbackChannel = 1004) {
    const raw = saveObj?._raw || {};
    return {
        r: parseInt(raw[7] ?? this._getEditorColorChannel(fallbackChannel).r ?? 255, 10),
        g: parseInt(raw[8] ?? this._getEditorColorChannel(fallbackChannel).g ?? 255, 10),
        b: parseInt(raw[9] ?? this._getEditorColorChannel(fallbackChannel).b ?? 255, 10)
    };
  }


  _setEditorObjectColor(saveObj, color) {
    if (!saveObj) return;
    saveObj._raw = saveObj._raw || {};
    const normalized = {
        r: Phaser.Math.Clamp(parseInt(color?.r ?? 255, 10) || 0, 0, 255),
        g: Phaser.Math.Clamp(parseInt(color?.g ?? 255, 10) || 0, 0, 255),
        b: Phaser.Math.Clamp(parseInt(color?.b ?? 255, 10) || 0, 0, 255)
    };

    saveObj._raw[7] = String(normalized.r);
    saveObj._raw[8] = String(normalized.g);
    saveObj._raw[9] = String(normalized.b);
  }


  _getEditorColorTriggerTargetChannel(saveObj) {
    const id = parseInt(saveObj?.id ?? 0, 10);
    const raw = saveObj?._raw || {};

    if (id === 29) return 1000;
    if (id === 30) return 1001;

    const rawChannel = parseInt(raw[23] ?? 0, 10);
    return rawChannel > 0 ? rawChannel : 1;
  }


  _setEditorColorTriggerTargetChannel(saveObj, channelId) {
    if (!saveObj) return;
    const normalized = Math.max(1, parseInt(channelId ?? 1, 10) || 1);
    saveObj._raw = saveObj._raw || {};
    saveObj._raw[23] = String(normalized);
  }


  _setEditorStartPositionValue(saveObj, key, value) {
    if (!saveObj) return;
    saveObj._raw = saveObj._raw || {};
    saveObj._raw[key] = String(value);

    if (key === "kA2") saveObj.gameMode = parseInt(value, 10) || 0;
    if (key === "kA3") saveObj.miniMode = parseInt(value, 10) || 0;
    if (key === "kA4") saveObj.speed = parseInt(value, 10) || 0;
    if (key === "kA8") saveObj.dualMode = parseInt(value, 10) || 0;
    if (key === "kA28") saveObj.mirrored = parseInt(value, 10) || 0;
    if (key === "kA11") saveObj.flipGravity = String(value) === "1";
  }


  _getEditorStartPositionValue(saveObj, key, fallback = 0) {
    const raw = saveObj?._raw || {};
    const fieldMap = {
        kA2: "gameMode",
        kA3: "miniMode",
        kA4: "speed",
        kA8: "dualMode",
        kA28: "mirrored",
        kA11: "flipGravity"
    };
    const rawValue = raw[key] ?? (fieldMap[key] ? saveObj?.[fieldMap[key]] : undefined) ?? fallback;
    const parsed = parseInt(rawValue, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  }


  _refreshSelectedTriggerTargetLabel() {
    const selectedObjectId = window.editorSelectedObject;
    const saveObj = this._getSelectedEditorSaveObject();
    if (selectedObjectId === -1 || !saveObj || !this._level?.objectSprites) return;

    const linkedSprites = this._level.objectSprites[selectedObjectId] || [];
    const newLabel = this._level?._getTriggerTargetLabel
        ? this._level._getTriggerTargetLabel(saveObj)
        : "";

    for (const spr of linkedSprites) {
        if (!spr || !Array.isArray(spr.list)) continue;
        const existingLabel = spr.list.find(child => child && child._eeEditorTriggerLabel);
        if (existingLabel && existingLabel.setText) {
            existingLabel.setText(newLabel || "");
            existingLabel.setVisible(!!newLabel);
        }
    }
  }


  _getEditorObjectGroupIds(saveObj) {
    const values = [];
    const addRawGroups = (rawGroups) => {
      String(rawGroups ?? "")
        .split(".")
        .map(value => parseInt(value, 10))
        .filter(value => Number.isFinite(value) && value > 0)
        .forEach(value => values.push(value));
    };

    addRawGroups(saveObj?._raw?.[33] ?? saveObj?._raw?.["33"]);
    addRawGroups(saveObj?._raw?.[57] ?? saveObj?._raw?.["57"]);
    addRawGroups(saveObj?.groups);

    return [...new Set(values)];
  }


  _syncEditorObjectGroupCaches(saveObj, groupIds = null) {
    if (!saveObj || !this._level) return;

    const linkedId = Number.isInteger(saveObj._eeObjectId) ? saveObj._eeObjectId : window.editorSelectedObject;
    const groups = Array.isArray(groupIds) ? groupIds : this._getEditorObjectGroupIds(saveObj);
    const uniqueGroups = [...new Set(groups.map(value => parseInt(value, 10)).filter(value => Number.isFinite(value) && value > 0))];
    const sprites = (Number.isInteger(linkedId) && Array.isArray(this._level.objectSprites?.[linkedId]))
      ? this._level.objectSprites[linkedId].filter(Boolean)
      : [];
    const spriteSet = new Set(sprites);

    if (this._level._groupSprites) {
      for (const gid of Object.keys(this._level._groupSprites)) {
        const filtered = (this._level._groupSprites[gid] || []).filter(sprite => !spriteSet.has(sprite));
        if (filtered.length) this._level._groupSprites[gid] = filtered;
        else delete this._level._groupSprites[gid];
      }
    } else {
      this._level._groupSprites = {};
    }

    for (const sprite of sprites) {
      sprite._eeGroups = uniqueGroups.slice();
      if (sprite._origWorldX === undefined && sprite._eeWorldX !== undefined) sprite._origWorldX = sprite._eeWorldX;
      if (sprite._origBaseY === undefined && sprite._eeBaseY !== undefined) sprite._origBaseY = sprite._eeBaseY;
      for (const gid of uniqueGroups) {
        if (!this._level._groupSprites[gid]) this._level._groupSprites[gid] = [];
        this._level._groupSprites[gid].push(sprite);
      }
      if (this._level._getGroupOpacityForSprite && sprite.setAlpha) {
        const baseAlpha = sprite._eeOrigAlpha ?? 1;
        sprite.setAlpha(baseAlpha * this._level._getGroupOpacityForSprite(sprite));
      }
    }

    const colliders = Number.isInteger(linkedId) ? this._getEditorCollidersForObjectId(linkedId) : [];
    for (const collider of colliders) collider._eeGroups = uniqueGroups.slice();
    this._refreshEditorCollisionCaches();

    const updateTriggerList = (list) => {
      if (!Array.isArray(list)) return;
      for (const trigger of list) {
        if (trigger && trigger.uid === linkedId) trigger.groups = uniqueGroups.slice();
      }
    };

    updateTriggerList(this._level._colorTriggers);
    updateTriggerList(this._level._enterEffectTriggers);
    updateTriggerList(this._level._moveTriggers);
    updateTriggerList(this._level._alphaTriggers);
    updateTriggerList(this._level._rotateTriggers);
    updateTriggerList(this._level._pulseTriggers);
    updateTriggerList(this._level._spawnTriggers);

    if (this._level.updateTriggerEditorVisuals) this._level.updateTriggerEditorVisuals();
  }


  _setEditorObjectGroupIds(saveObj, groupIds) {
    if (!saveObj) return [];

    const groups = [...new Set((Array.isArray(groupIds) ? groupIds : [])
      .map(value => parseInt(value, 10))
      .filter(value => Number.isFinite(value) && value > 0))];
    const groupString = groups.join(".");

    saveObj.groups = groupString;
    saveObj._raw = saveObj._raw || {};
    saveObj._raw[57] = groupString;
    saveObj._raw["57"] = groupString;
    delete saveObj._raw[33];
    delete saveObj._raw["33"];

    this._syncEditorObjectGroupCaches(saveObj, groups);
    return groups;
  }


  _getEditorLayerOptions() {
    let maxLayer = 0;
    if (Array.isArray(window.levelObjects)) {
      for (const obj of window.levelObjects) {
        if (!obj || !obj.id) continue;
        const layer1 = this._getEditorObjectEditorLayer(obj);
        const layer2 = this._getEditorObjectEditorLayer2(obj);
        if (Number.isFinite(layer1) && layer1 > maxLayer) maxLayer = layer1;
        if (Number.isFinite(layer2) && layer2 > maxLayer) maxLayer = layer2;
      }
    }
    const options = [null];
    for (let layer = 0; layer <= maxLayer; layer++) options.push(layer);
    return options;
  }


  _getCurrentEditorPlacementLayer() {
    const layer = this._editorActiveLayer;
    return Number.isInteger(layer) ? layer : 0;
  }


  _getEditorObjectEditorLayer(saveObj) {
    const rawValue = saveObj?._raw?.[20] ?? saveObj?._raw?.["20"] ?? saveObj?.editorLayer ?? 0;
    const parsed = parseInt(rawValue, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }


  _getEditorObjectEditorLayer2(saveObj) {
    const rawValue = saveObj?._raw?.[61] ?? saveObj?._raw?.["61"] ?? saveObj?.editorLayer2 ?? 0;
    const parsed = parseInt(rawValue, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }


  _setEditorObjectEditorLayer(saveObj, value) {
    if (!saveObj) return;
    const parsed = parseInt(value ?? 0, 10);
    const layer = Math.max(0, Number.isFinite(parsed) ? parsed : 0);
    saveObj.editorLayer = layer;
    saveObj._raw = saveObj._raw || {};
    saveObj._raw[20] = String(layer);
    saveObj._raw["20"] = String(layer);
    this._applyEditorLayerMetadataToObject(saveObj);
    this._refreshEditorLayerSelectorVisual?.();
    this._applyEditorLayerFilter();
  }


  _setEditorObjectEditorLayer2(saveObj, value) {
    if (!saveObj) return;
    const parsed = parseInt(value ?? 0, 10);
    const layer = Math.max(0, Number.isFinite(parsed) ? parsed : 0);
    saveObj.editorLayer2 = layer;
    saveObj._raw = saveObj._raw || {};
    saveObj._raw[61] = String(layer);
    saveObj._raw["61"] = String(layer);
    this._applyEditorLayerMetadataToObject(saveObj);
    this._refreshEditorLayerSelectorVisual?.();
    this._applyEditorLayerFilter();
  }


  _applyEditorLayerMetadataToObject(saveObj) {
    if (!saveObj || !this._level?.objectSprites) return;
    const linkedId = Number.isInteger(saveObj._eeObjectId) ? saveObj._eeObjectId : window.editorSelectedObject;
    const sprites = Array.isArray(this._level.objectSprites?.[linkedId]) ? this._level.objectSprites[linkedId] : [];
    const layer1 = this._getEditorObjectEditorLayer(saveObj);
    const layer2 = this._getEditorObjectEditorLayer2(saveObj);
    for (const spr of sprites) {
      if (!spr) continue;
      spr._eeEditorLayer = layer1;
      spr._eeEditorLayer2 = layer2;
    }
    const colliders = this._getEditorCollidersForObjectId(linkedId);
    for (const collider of colliders) {
      collider._eeEditorLayer = layer1;
      collider._eeEditorLayer2 = layer2;
    }
  }


  _editorObjectMatchesActiveLayer(saveObj) {
    const activeLayer = this._editorActiveLayer;
    if (activeLayer === null || activeLayer === undefined) return true;
    if (!saveObj) return false;
    return this._getEditorObjectEditorLayer(saveObj) === activeLayer ||
      this._getEditorObjectEditorLayer2(saveObj) === activeLayer;
  }


  _editorObjectMatchesActiveLayerByObjectId(objectId) {
    return this._editorObjectMatchesActiveLayer(this._getEditorSaveObjectForObjectId(objectId));
  }


  _refreshEditorLayerSelectorVisual() {
    const options = this._getEditorLayerOptions();
    this._editorLayerOptions = options;
    const index = Math.max(0, Math.min(options.length - 1, this._editorActiveLayerIndex || 0));
    this._editorActiveLayerIndex = index;
    this._editorActiveLayer = options[index];
    const value = options[index];
    if (this._editorLayerInputText?.setText) this._editorLayerInputText.setText(value === null ? "All" : String(value));
    if (this._editorLayerInputBg) {
      this._editorLayerInputBg.clear();
      this._editorLayerInputBg.fillStyle(0x000000, 0.4);
      this._editorLayerInputBg.fillRoundedRect(-30, -22, 60, 43, 10);
    }
  }


  _setEditorActiveLayerIndex(index) {
    const options = this._getEditorLayerOptions();
    const nextIndex = Math.max(0, Math.min(options.length - 1, parseInt(index ?? 0, 10) || 0));
    this._editorLayerOptions = options;
    this._editorActiveLayerIndex = nextIndex;
    this._editorActiveLayer = options[nextIndex];
    this._refreshEditorLayerSelectorVisual();
    this._applyEditorLayerFilter();
  }


  _applyEditorLayerFilter() {
    if (this._editorPlaytestActive || !this._level?.objectSprites) return;

    const glowVisible = this._level?._isGlowVisible ? this._level._isGlowVisible() : !!window.showEditorGlow;

    for (let objectId = 0; objectId < this._level.objectSprites.length; objectId++) {
      const sprites = this._level.objectSprites[objectId];
      if (!sprites || !sprites.length) continue;
      const matches = this._editorObjectMatchesActiveLayerByObjectId(objectId);
      const targetAlphaMultiplier = matches ? 1 : 0.25;
      for (const spr of sprites) {
        if (!spr) continue;
        if (spr._editorLayerFilterBaseAlpha === undefined) {
          spr._editorLayerFilterBaseAlpha = spr.alpha ?? 1;
        }
        if (spr._eeIsGlowSprite && !glowVisible) {
          if (spr?.setVisible) spr.setVisible(false);
          else spr.visible = false;
          continue;
        }
        if (spr?.setVisible) spr.setVisible(true);
        else spr.visible = true;
        if (spr?.setAlpha) spr.setAlpha(spr._editorLayerFilterBaseAlpha * targetAlphaMultiplier);
        else spr.alpha = spr._editorLayerFilterBaseAlpha * targetAlphaMultiplier;
      }
    }
  }


  _getEditorZLayerOptions() {
    return [
      { label: "B5", value: -5 },
      { label: "B4", value: -3 },
      { label: "B3", value: -1 },
      { label: "B2", value: 1 },
      { label: "B1", value: 3 },
      { label: "T1", value: 5 },
      { label: "T2", value: 7 },
      { label: "T3", value: 9 },
      { label: "T4", value: 11 },
      { label: "Default", value: 0 }
    ];
  }


  _getEditorObjectZLayer(saveObj) {
    const rawValue = saveObj?._raw?.[24] ?? saveObj?._raw?.["24"] ?? saveObj?.zLayer ?? 0;
    const parsed = parseInt(rawValue, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }


  _getEditorObjectZOrder(saveObj) {
    const rawValue = saveObj?._raw?.[25] ?? saveObj?._raw?.["25"] ?? saveObj?.zOrder ?? 0;
    const parsed = parseInt(rawValue, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }


  _getEditorZDepth(zLayer, zOrder = 0) {
    const depthBase = {
      "-5": -12,
      "-3": -9,
      "-1": -6,
      0: 0,
      1: 3,
      3: 6,
      5: 9,
      7: 10.5,
      9: 12,
      11: 13.5
    };
    return (depthBase[zLayer] !== undefined ? depthBase[zLayer] : 0) + zOrder * 0.01;
  }


  _setEditorObjectZLayer(saveObj, zLayer) {
    if (!saveObj) return;

    const previousLayer = this._getEditorObjectZLayer(saveObj);
    const zOrder = this._getEditorObjectZOrder(saveObj);
    const oldBaseDepth = this._getEditorZDepth(previousLayer, zOrder);
    const nextLayer = parseInt(zLayer ?? 0, 10);
    const normalizedLayer = Number.isFinite(nextLayer) ? nextLayer : 0;
    const newBaseDepth = this._getEditorZDepth(normalizedLayer, zOrder);

    saveObj.zLayer = normalizedLayer;
    saveObj._raw = saveObj._raw || {};
    saveObj._raw[24] = String(normalizedLayer);
    saveObj._raw["24"] = String(normalizedLayer);

    const linkedId = Number.isInteger(saveObj._eeObjectId) ? saveObj._eeObjectId : window.editorSelectedObject;
    const sprites = Array.isArray(this._level?.objectSprites?.[linkedId]) ? this._level.objectSprites[linkedId] : [];

    for (const spr of sprites) {
      if (!spr) continue;
      const offset = Number.isFinite(spr._eeZDepth) ? spr._eeZDepth - oldBaseDepth : 0;
      const nextDepth = newBaseDepth + offset;
      spr._eeZDepth = nextDepth;
      if (spr.setDepth) spr.setDepth(nextDepth);
      else spr.depth = nextDepth;
    }
  }


  _setEditorObjectZOrder(saveObj, zOrder) {
    if (!saveObj) return;

    const zLayer = this._getEditorObjectZLayer(saveObj);
    const previousOrder = this._getEditorObjectZOrder(saveObj);
    const oldBaseDepth = this._getEditorZDepth(zLayer, previousOrder);
    const parsed = parseInt(zOrder ?? 0, 10);
    const normalizedOrder = Number.isFinite(parsed) ? parsed : 0;
    const newBaseDepth = this._getEditorZDepth(zLayer, normalizedOrder);

    saveObj.zOrder = normalizedOrder;
    saveObj._raw = saveObj._raw || {};
    saveObj._raw[25] = String(normalizedOrder);
    saveObj._raw["25"] = String(normalizedOrder);

    const linkedId = Number.isInteger(saveObj._eeObjectId) ? saveObj._eeObjectId : window.editorSelectedObject;
    const sprites = Array.isArray(this._level?.objectSprites?.[linkedId]) ? this._level.objectSprites[linkedId] : [];

    for (const spr of sprites) {
      if (!spr) continue;
      const offset = Number.isFinite(spr._eeZDepth) ? spr._eeZDepth - oldBaseDepth : 0;
      const nextDepth = newBaseDepth + offset;
      spr._eeZDepth = nextDepth;
      if (spr.setDepth) spr.setDepth(nextDepth);
      else spr.depth = nextDepth;
    }
  }


  _openSelectedEditorGroupPopup() {
    const saveObj = this._getSelectedEditorSaveObject();
    if (!saveObj) return;
    const selectedSaveObjs = (this._getSelectedEditorSaveObjects ? this._getSelectedEditorSaveObjects() : [saveObj]).filter(Boolean);
    if (!selectedSaveObjs.length) selectedSaveObjs.push(saveObj);

    this._closeEditorObjectOptionsPopup();

    const sw = screenWidth;
    const sh = screenHeight;
    const panelW = Math.min(860, sw - 60);
    const panelH = Math.max(615, sh - 80);
    const root = this.add.container(0, 0).setScrollFactor(0).setDepth(2550);
    this._editorObjectOptionsPopup = root;

    const blocker = this.add.rectangle(0, 0, sw, sh, 0x000000, 0.45).setOrigin(0).setInteractive();
    root.add(blocker);

    const inner = this.add.container(sw / 2, sh / 2);
    root.add(inner);

    const corner = this.textures.exists("GJ_square01") ? this.textures.get("GJ_square01").source[0].width * 0.325 : 24;
    inner.add(this._drawScale9(0, 0, panelW, panelH, "GJ_square01", corner, 0xffffff, 1));

    const stopInputEvent = (event) => {
      event?.preventDefault?.();
      event?.stopPropagation?.();
      event?.stopImmediatePropagation?.();
    };

    const buttonTexture = this.textures.exists("GJ_button_04")
      ? "GJ_button_04"
      : (this.textures.exists("GJ_button04") ? "GJ_button04" : "GJ_button01");
    const buttonBorder = this.textures.exists(buttonTexture) ? this.textures.get(buttonTexture).source[0].width * 0.28 : 22;

    const makeGoldButton = (parent, x, y, w, h, text, fontSize, callback, textureOverride = null) => {
      const grp = this.add.container(x, y);
      const textureKey = textureOverride || buttonTexture;
      const textureBorder = this.textures.exists(textureKey) ? this.textures.get(textureKey).source[0].width * 0.28 : buttonBorder;
      const bg = this.add.nineslice(0, 0, textureKey, null, w, h, textureBorder, textureBorder, textureBorder, textureBorder).setOrigin(0.5);
      const label = this.add.bitmapText(-3, -4, "goldFont", text, fontSize).setOrigin(0.5);
      const hit = this.add.zone(0, 0, w, h).setInteractive();
      grp.add([bg, label, hit]);
      parent.add(grp);
      this._makeCompositeBouncyButton(hit, [grp], 1, callback);
      return { root: grp, hit, label, bg };
    };

    const numericInputs = [];
    const inputW = 92;
    const inputH = 58;
    const inputRadius = 10;

    const blurAllNumericInputs = (commit = false) => {
      for (const entry of numericInputs) entry.blur(commit);
    };

    const makeNumericInput = ({ x, y, label, arrowFrame, initialValue, min = 0, max = 9999, allowNegative = false, onCommit }) => {
      inner.add(this.add.bitmapText(x, y - 52, "goldFont", label, 28).setOrigin(0.5));

      const bg = this.add.graphics();
      const text = this.add.bitmapText(x, y, "bigFont", "", 32).setOrigin(0.5).setTint(0xffffff);
      const hit = this.add.rectangle(x, y, inputW, inputH + 4, 0xffffff, 0.001).setOrigin(0.5).setInteractive();
      const leftArrow = this.add.image(x - 82, y + 1, "GJ_GameSheet03", arrowFrame).setScale(0.7).setInteractive();
      const rightArrow = this.add.image(x + 82, y + 1, "GJ_GameSheet03", arrowFrame).setScale(0.7).setFlipX(true).setInteractive();
      inner.add([bg, text, hit, leftArrow, rightArrow]);

      let focused = false;
      let valueText = String(initialValue ?? 0);
      let beforeFocus = valueText;

      const normalize = (raw) => {
        const parsed = parseInt(raw, 10);
        let next = Number.isFinite(parsed) ? parsed : 0;
        if (!allowNegative) next = Math.max(min, next);
        else next = Math.max(min, next);
        next = Math.min(max, next);
        return next;
      };

      const render = () => {
        bg.clear();
        bg.fillStyle(0x000000, 0.43);
        bg.fillRoundedRect(x - inputW / 2, y - inputH / 2, inputW, inputH, inputRadius);
        text.setText(`${focused ? valueText : String(normalize(valueText))}${focused ? "|" : ""}`);
      };

      const commit = () => {
        const next = normalize(valueText);
        valueText = String(next);
        onCommit?.(next);
        render();
      };

      const setValue = (value, commitValue = true) => {
        valueText = String(normalize(value));
        if (commitValue) onCommit?.(normalize(valueText));
        render();
      };

      const blur = (commitValue = false) => {
        if (!focused) return;
        if (commitValue) commit();
        focused = false;
        if (!numericInputs.some(input => input !== entry && input.focused())) this._editorTextInputFocused = false;
        render();
      };

      const cancel = () => {
        if (!focused) return;
        valueText = beforeFocus;
        focused = false;
        if (!numericInputs.some(input => input !== entry && input.focused())) this._editorTextInputFocused = false;
        render();
      };

      const focus = (pointer) => {
        blurAllNumericInputs(true);
        beforeFocus = valueText;
        focused = true;
        this._editorTextInputFocused = true;
        render();
        stopInputEvent(pointer?.event);
      };

      const isInside = (pointer) => {
        const inputScreenX = (sw / 2) + x;
        const inputScreenY = (sh / 2) + y;
        return Math.abs(pointer.x - inputScreenX) <= inputW / 2 &&
          Math.abs(pointer.y - inputScreenY) <= (inputH + 4) / 2;
      };

      const stepValue = (delta) => {
        blur(true);
        setValue(normalize(valueText) + delta, true);
      };

      hit.on("pointerdown", focus);
      this._makeBouncyButton(leftArrow, 0.7, () => stepValue(-1));
      this._makeBouncyButton(rightArrow, 0.7, () => stepValue(1));

      const entry = {
        hit,
        focused: () => focused,
        blur,
        cancel,
        isInside,
        handleKey: (event) => {
          if (!focused) return false;
          if (event.key === "Enter") {
            blur(true);
          } else if (event.key === "Backspace") {
            valueText = valueText.slice(0, -1);
            render();
          } else if (allowNegative && event.key === "-" && valueText.length === 0) {
            valueText = "-";
            render();
          } else if (/^[0-9]$/.test(event.key) && valueText.length < 5) {
            valueText += event.key;
            render();
          } else if (event.key.length !== 1) {
            return false;
          }
          return true;
        },
        getValue: () => normalize(valueText),
        setValue
      };

      numericInputs.push(entry);
      render();
      return entry;
    };

    const topInputY = -(panelH / 2) + 85;
    const topGap = 230;
    makeNumericInput({
      x: -topGap,
      y: topInputY,
      label: "Editor L",
      arrowFrame: "GJ_arrow_02_001.png",
      initialValue: this._getEditorObjectEditorLayer(saveObj),
      min: 0,
      max: 999,
      onCommit: (value) => this._setEditorObjectEditorLayer(saveObj, value)
    });
    makeNumericInput({
      x: 0,
      y: topInputY,
      label: "Editor L2",
      arrowFrame: "GJ_arrow_03_001.png",
      initialValue: this._getEditorObjectEditorLayer2(saveObj),
      min: 0,
      max: 999,
      onCommit: (value) => this._setEditorObjectEditorLayer2(saveObj, value)
    });
    makeNumericInput({
      x: topGap,
      y: topInputY,
      label: "Z Order",
      arrowFrame: "GJ_arrow_02_001.png",
      initialValue: this._getEditorObjectZOrder(saveObj),
      min: -999,
      max: 999,
      allowNegative: true,
      onCommit: (value) => this._setEditorObjectZOrder(saveObj, value)
    });

    const controlY = topInputY + 110;
    const controlX = 0;
    inner.add(this.add.bitmapText(controlX, controlY - 52, "goldFont", "Add Group ID", 32).setOrigin(0.5));

    let groupInputValue = 1;
    const groupInput = makeNumericInput({
      x: controlX,
      y: controlY,
      label: "",
      arrowFrame: "GJ_arrow_01_001.png",
      initialValue: 1,
      min: 1,
      max: 9999,
      onCommit: (value) => { groupInputValue = value; }
    });

    const getInputGroup = () => {
      const parsed = parseInt(groupInput.getValue() || groupInputValue || 1, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    };

    const setInputGroup = (value) => {
      groupInput.setValue(value, true);
      groupInputValue = groupInput.getValue();
    };

    const getNextFreeGroupId = () => {
      const usedGroups = new Set();

      const addUsedGroup = (value) => {
        const groupId = parseInt(value ?? 0, 10);
        if (Number.isFinite(groupId) && groupId > 0) usedGroups.add(groupId);
      };

      const addTriggerTargetGroups = (obj) => {
        if (!obj) return;
        const id = parseInt(obj.id ?? 0, 10);
        const raw = obj._raw || {};
        if ([901, 1007, 1268, 1346].includes(id)) {
          addUsedGroup(raw[51] ?? raw["51"]);
        }
        if (id === 1346) {
          addUsedGroup(raw[71] ?? raw["71"]);
        }
        if (id === 1006) {
          const targetType = parseInt(raw[52] ?? raw["52"] ?? 0, 10);
          if (targetType === 1) addUsedGroup(raw[51] ?? raw["51"]);
        }
      };

      if (Array.isArray(window.levelObjects)) {
        for (const obj of window.levelObjects) {
          if (!obj) continue;
          for (const groupId of this._getEditorObjectGroupIds(obj)) {
            addUsedGroup(groupId);
          }
          addTriggerTargetGroups(obj);
        }
      }

      let candidate = 1;
      while (usedGroups.has(candidate)) candidate++;
      return candidate;
    };

    makeGoldButton(inner, controlX - 240, controlY, 140, 50, "Next Free", 20, () => {
      blurAllNumericInputs(true);
      setInputGroup(getNextFreeGroupId());
    });
    makeGoldButton(inner, controlX + 205, controlY, 140, 50, "Add", 34, () => addCurrentGroup());

    const listW = panelW - 110;
    const listH = 145;
    const listX = 0;
    const listY = controlY + 60 + listH / 2;
    const listBg = this.add.graphics();
    listBg.fillStyle(0x000000, 0.2);
    listBg.fillRoundedRect(listX - listW / 2, listY - listH / 2, listW, listH, 20);
    inner.add(listBg);

    const listContainer = this.add.container(listX, listY - listH / 2 + 34);
    inner.add(listContainer);

    const getSelectedGroupObjects = () => {
      const objects = (this._getSelectedEditorSaveObjects ? this._getSelectedEditorSaveObjects() : selectedSaveObjs).filter(Boolean);
      return objects.length ? objects : selectedSaveObjs;
    };

    const getGroupEntries = () => {
      const objects = getSelectedGroupObjects();
      const counts = new Map();
      for (const obj of objects) {
        for (const groupId of this._getEditorObjectGroupIds(obj)) {
          counts.set(groupId, (counts.get(groupId) || 0) + 1);
        }
      }
      return {
        objects,
        total: objects.length,
        entries: [...counts.entries()]
          .map(([groupId, count]) => ({ groupId, count, partial: count < objects.length }))
          .sort((a, b) => a.groupId - b.groupId)
      };
    };

    const renderGroupList = () => {
      listContainer.removeAll(true);
      const { objects, total, entries } = getGroupEntries();

      if (!entries.length || !objects.length || !total) return;

      const columns = 5;
      const gapX = 16;
      const gapY = 14;
      const btnW = 100;
      const btnH = 40;
      const startX = -((columns - 1) * (btnW + gapX)) / 2;
      const startY = 10;
      const maxButtons = 10;
      const visibleGroups = entries.slice(0, maxButtons);

      const partialButtonTexture = this.textures.exists("GJ_button_05")
        ? "GJ_button_05"
        : (this.textures.exists("GJ_button05") ? "GJ_button05" : buttonTexture);

      visibleGroups.forEach((entry, index) => {
        const groupId = entry.groupId;
        const col = index % columns;
        const row = Math.floor(index / columns);
        const x = startX + col * (btnW + gapX);
        const y = startY + row * (btnH + gapY);
        makeGoldButton(listContainer, x, y, btnW, btnH, String(groupId), 28, () => {
          for (const obj of getSelectedGroupObjects()) {
            const nextGroups = this._getEditorObjectGroupIds(obj).filter(id => id !== groupId);
            this._setEditorObjectGroupIds(obj, nextGroups);
          }
          this._applyEditorLayerFilter?.();
          renderGroupList();
        }, entry.partial ? partialButtonTexture : buttonTexture);
      });
    };

    const addCurrentGroup = () => {
      blurAllNumericInputs(true);
      const newGroup = getInputGroup();
      const { objects, entries } = getGroupEntries();
      if (!objects.length) return;
      const existingEntry = entries.find(entry => entry.groupId === newGroup);
      if (existingEntry && existingEntry.count >= objects.length) return;

      for (const obj of objects) {
        const groups = this._getEditorObjectGroupIds(obj);
        if (!groups.includes(newGroup)) groups.push(newGroup);
        groups.sort((a, b) => a - b);
        this._setEditorObjectGroupIds(obj, groups);
      }

      this._applyEditorLayerFilter?.();
      setInputGroup(newGroup);
      renderGroupList();
    };

    const selectedLayerTexture = this.textures.exists("GJ_button_02") ? "GJ_button_02" : (this.textures.exists("GJ_button02") ? "GJ_button02" : buttonTexture);
    const layerDeselectedTexture = buttonTexture;
    const zLayerTitleY = listY + (listH / 2) + 30;
    const zLayerButtonY = zLayerTitleY + 55;
    const zLayerButtons = [];

    inner.add(this.add.bitmapText(0, zLayerTitleY, "goldFont", "Z Layer", 34).setOrigin(0.5));

    const makeZLayerButton = (x, y, w, h, label, value) => {
      const grp = this.add.container(x, y);
      const bg = this.add.nineslice(0, 0, layerDeselectedTexture, null, w, h, buttonBorder, buttonBorder, buttonBorder, buttonBorder).setOrigin(0.5);
      const fontSize = label === "Default" ? 20 : 23;
      const text = this.add.bitmapText(-2, -2, "bigFont", label, fontSize).setOrigin(0.5).setTint(0xffffff);
      const hit = this.add.zone(0, 0, w, h).setInteractive();
      grp.add([bg, text, hit]);
      inner.add(grp);

      const entry = { root: grp, bg, text, hit, value, w, h };
      zLayerButtons.push(entry);
      this._makeCompositeBouncyButton(hit, [grp], 1, () => {
        blurAllNumericInputs(true);
        this._setEditorObjectZLayer(saveObj, value);
        refreshZLayerButtons();
      });
      return entry;
    };

    const refreshZLayerButtons = () => {
      const currentLayer = this._getEditorObjectZLayer(saveObj);
      for (const entry of zLayerButtons) {
        const selected = entry.value === currentLayer;
        const nextTexture = selected ? selectedLayerTexture : layerDeselectedTexture;
        if (entry.bg?.setTexture) entry.bg.setTexture(nextTexture);
        if (entry.text?.setTint) entry.text.setTint(0xffffff);
      }
    };

    const squareLayerH = 48;
    const layerGapX = 10;
    const layerOptions = this._getEditorZLayerOptions();
    const defaultLayerW = 132;
    const layerUsableW = panelW - 92;
    const squareLayerW = Math.max(54, Math.floor((layerUsableW - defaultLayerW - layerGapX * (layerOptions.length - 1)) / (layerOptions.length - 1)));
    const layerWidths = layerOptions.map(option => option.label === "Default" ? defaultLayerW : squareLayerW);
    const layerTotalW = layerWidths.reduce((sum, value) => sum + value, 0) + layerGapX * (layerWidths.length - 1);
    let layerX = -layerTotalW / 2;
    layerOptions.forEach((option, index) => {
      const w = layerWidths[index];
      makeZLayerButton(layerX + w / 2, zLayerButtonY, w, squareLayerH, option.label, option.value);
      layerX += w + layerGapX;
    });

    this._editorGroupInputPointerDownHandler = (pointer) => {
      if (!this._editorObjectOptionsPopup) return;
      const focusedInput = numericInputs.find(entry => entry.focused());
      if (!focusedInput) return;
      if (focusedInput.isInside(pointer)) return;
      focusedInput.blur(true);
    };
    this.input.on("pointerdown", this._editorGroupInputPointerDownHandler);

    this._editorObjectOptionsKeyHandler = (event) => {
      if (!this._editorObjectOptionsPopup) return;

      if (event.key === "Escape") {
        const focusedInput = numericInputs.find(entry => entry.focused());
        if (focusedInput) focusedInput.cancel();
        else this._closeEditorObjectOptionsPopup();
        stopInputEvent(event);
        return;
      }

      const focusedInput = numericInputs.find(entry => entry.focused());
      if (!focusedInput) return;

      if (focusedInput.handleKey(event)) stopInputEvent(event);
    };
    window.addEventListener("keydown", this._editorObjectOptionsKeyHandler);

    renderGroupList();
    refreshZLayerButtons();
    this._makeEditorOkButton(inner, 0, (panelH / 2) - 46, "OK", () => {
      blurAllNumericInputs(true);
      this._closeEditorObjectOptionsPopup();
    });
  }

  _openSelectedEditorObjectOptions() {
    const saveObj = this._getSelectedEditorSaveObject();
    if (!saveObj) return;

    const objectDef = getObjectFromId(saveObj.id);
    if (!objectDef || objectDef.type !== triggerType) return;

    if (this._isEditorColorTriggerId(saveObj.id)) {
        this._openEditorColorTriggerOptionsPopup(saveObj);
    } else if (this._isEditorMoveTriggerId(saveObj.id)) {
        this._openEditorMoveTriggerOptionsPopup(saveObj);
    } else if (this._isEditorSpawnTriggerId(saveObj.id)) {
        this._openEditorSpawnTriggerOptionsPopup(saveObj);
    } else if (this._isEditorStartPositionId(saveObj.id)) {
        this._openEditorStartPositionOptionsPopup(saveObj);
    } else if (this._isEditorTextObjectId(saveObj.id)) {
        this._openEditorTextObjectOptionsPopup(saveObj);
    } else {
        this._openEditorComingSoonTriggerPopup(saveObj);
    }
  }


  _isEditorMoveTriggerId(id) {
    return parseInt(id ?? 0, 10) === 901;
  }


  _isEditorSpawnTriggerId(id) {
    return parseInt(id ?? 0, 10) === 1268;
  }


  _parseEditorSingleGroupId(value, fallback = 0) {
    const parts = String(value ?? "")
      .split(/[,.]/)
      .map(part => parseInt(part.trim(), 10))
      .filter(groupId => Number.isFinite(groupId) && groupId > 0);
    return parts.length ? parts[0] : fallback;
  }


  _getEditorTriggerTargetGroup(saveObj) {
    const raw = saveObj?._raw || {};
    return this._parseEditorSingleGroupId(raw[51] ?? raw["51"], 0);
  }


  _setEditorTriggerTargetGroup(saveObj, value) {
    if (!saveObj) return;
    const targetGroup = Math.max(0, this._parseEditorSingleGroupId(value, 0));
    saveObj._raw = saveObj._raw || {};
    saveObj._raw[51] = String(targetGroup);
    saveObj._raw["51"] = String(targetGroup);
    const linkedId = Number.isInteger(saveObj._eeObjectId) ? saveObj._eeObjectId : window.editorSelectedObject;
    const updateList = (list) => {
      if (!Array.isArray(list)) return;
      for (const trigger of list) {
        if (trigger && trigger.uid === linkedId) trigger.targetGroup = targetGroup;
      }
    };
    updateList(this._level?._moveTriggers);
    updateList(this._level?._alphaTriggers);
    updateList(this._level?._rotateTriggers);
    updateList(this._level?._pulseTriggers);
    updateList(this._level?._spawnTriggers);
    this._refreshSelectedTriggerTargetLabel();
    this._level?.updateTriggerEditorVisuals?.();
  }


  _getEditorTriggerBool(saveObj, key) {
    const raw = saveObj?._raw || {};
    return String(raw[key] ?? raw[String(key)] ?? "0") === "1";
  }


  _setEditorTriggerBool(saveObj, key, enabled) {
    if (!saveObj) return;
    const rawKey = String(key);
    const boolValue = enabled ? "1" : "0";
    saveObj._raw = saveObj._raw || {};
    saveObj._raw[key] = boolValue;
    saveObj._raw[rawKey] = boolValue;
    const linkedId = Number.isInteger(saveObj._eeObjectId) ? saveObj._eeObjectId : window.editorSelectedObject;
    const updateList = (list) => {
      if (!Array.isArray(list)) return;
      for (const trigger of list) {
        if (!trigger || trigger.uid !== linkedId) continue;
        if (rawKey === "11") trigger.touchTriggered = !!enabled;
        if (rawKey === "62") trigger.spawnTriggered = !!enabled;
        if (rawKey === "58") trigger.lockX = !!enabled;
        if (rawKey === "59") trigger.lockY = !!enabled;
        if (rawKey === "302") trigger.lockCameraX = !!enabled;
        if (rawKey === "303") trigger.lockCameraY = !!enabled;
      }
    };
    updateList(this._level?._colorTriggers);
    updateList(this._level?._enterEffectTriggers);
    updateList(this._level?._moveTriggers);
    updateList(this._level?._alphaTriggers);
    updateList(this._level?._rotateTriggers);
    updateList(this._level?._pulseTriggers);
    updateList(this._level?._spawnTriggers);
    this._level?.updateTriggerEditorVisuals?.();
  }


  _getEditorMoveTriggerOffset(saveObj, key) {
    const raw = saveObj?._raw || {};
    const parsed = parseFloat(raw[key] ?? raw[String(key)] ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  }


  _setEditorMoveTriggerOffset(saveObj, key, value) {
    if (!saveObj) return;
    const rawKey = String(key);
    const parsed = parseFloat(value ?? 0);
    const offset = Number.isFinite(parsed) ? parsed : 0;
    const formatted = String(Number(offset.toFixed(2))).replace(/\.0$/, "");
    saveObj._raw = saveObj._raw || {};
    saveObj._raw[key] = formatted;
    saveObj._raw[rawKey] = formatted;
    const linkedId = Number.isInteger(saveObj._eeObjectId) ? saveObj._eeObjectId : window.editorSelectedObject;
    if (Array.isArray(this._level?._moveTriggers)) {
      for (const trigger of this._level._moveTriggers) {
        if (!trigger || trigger.uid !== linkedId) continue;
        if (rawKey === "28") trigger.offsetX = offset * 2;
        if (rawKey === "29") trigger.offsetY = offset * 2;
      }
    }
  }


  _getEditorMoveTriggerDuration(saveObj) {
    const raw = saveObj?._raw || {};
    const parsed = parseFloat(raw[10] ?? raw["10"] ?? 0);
    return Phaser.Math.Clamp(Number.isFinite(parsed) ? parsed : 0, 0, 10);
  }


  _setEditorMoveTriggerDuration(saveObj, value) {
    if (!saveObj) return;
    const parsed = parseFloat(value ?? 0);
    const duration = Phaser.Math.Clamp(Number.isFinite(parsed) ? parsed : 0, 0, 10);
    const formatted = String(Number(duration.toFixed(2))).replace(/\.0$/, "");
    saveObj._raw = saveObj._raw || {};
    saveObj._raw[10] = formatted;
    saveObj._raw["10"] = formatted;
    const linkedId = Number.isInteger(saveObj._eeObjectId) ? saveObj._eeObjectId : window.editorSelectedObject;
    if (Array.isArray(this._level?._moveTriggers)) {
      for (const trigger of this._level._moveTriggers) {
        if (trigger && trigger.uid === linkedId) trigger.duration = duration;
      }
    }
  }


  _getEditorSpawnTriggerDelay(saveObj) {
    const raw = saveObj?._raw || {};
    const parsed = parseFloat(raw[63] ?? raw["63"] ?? 0);
    return Math.max(0, Number.isFinite(parsed) ? parsed : 0);
  }


  _setEditorSpawnTriggerDelay(saveObj, value) {
    if (!saveObj) return;
    const parsed = parseFloat(value ?? 0);
    const delay = Math.max(0, Number.isFinite(parsed) ? parsed : 0);
    const formatted = String(Number(delay.toFixed(4))).replace(/\.0$/, "");
    saveObj._raw = saveObj._raw || {};
    saveObj._raw[63] = formatted;
    saveObj._raw["63"] = formatted;
    const linkedId = Number.isInteger(saveObj._eeObjectId) ? saveObj._eeObjectId : window.editorSelectedObject;
    if (Array.isArray(this._level?._spawnTriggers)) {
      for (const trigger of this._level._spawnTriggers) {
        if (trigger && trigger.uid === linkedId) trigger.delay = delay;
      }
    }
  }


  _getEditorSpawnTriggerRandomDelay(saveObj) {
    const raw = saveObj?._raw || {};
    const parsed = parseFloat(raw[556] ?? raw["556"] ?? 0);
    return Math.max(0, Number.isFinite(parsed) ? parsed : 0);
  }


  _setEditorSpawnTriggerRandomDelay(saveObj, value) {
    if (!saveObj) return;
    const parsed = parseFloat(value ?? 0);
    const randomDelay = Phaser.Math.Clamp(Number.isFinite(parsed) ? parsed : 0, 0, 9999);
    const formatted = String(Number(randomDelay.toFixed(4))).replace(/\.0$/, "");
    saveObj._raw = saveObj._raw || {};
    saveObj._raw[556] = formatted;
    saveObj._raw["556"] = formatted;
    const linkedId = Number.isInteger(saveObj._eeObjectId) ? saveObj._eeObjectId : window.editorSelectedObject;
    if (Array.isArray(this._level?._spawnTriggers)) {
      for (const trigger of this._level._spawnTriggers) {
        if (trigger && trigger.uid === linkedId) trigger.randomDelay = randomDelay;
      }
    }
  }


  _openEditorMoveTriggerOptionsPopup(saveObj) {
    if (!saveObj) return;
    this._closeEditorObjectOptionsPopup();

    const sw = screenWidth;
    const sh = screenHeight;
    const panelW = 940;
    const panelH = 620;
    const root = this.add.container(0, 0).setScrollFactor(0).setDepth(2550);
    this._editorObjectOptionsPopup = root;

    const blocker = this.add.rectangle(0, 0, sw, sh, 0x000000, 0.45).setOrigin(0).setInteractive();
    root.add(blocker);

    const inner = this.add.container(sw / 2, sh / 2 + 6);
    root.add(inner);

    const corner = this.textures.exists("GJ_square01") ? this.textures.get("GJ_square01").source[0].width * 0.325 : 24;
    inner.add(this._drawScale9(0, 0, panelW, panelH, "GJ_square01", corner, 0xffffff, 1));
    inner.add(this.add.bitmapText(0, -(panelH / 2) + 50, "bigFont", "Setup Move Command", 42).setOrigin(0.5));

    const focusedInputs = [];
    const stopInputEvent = (event) => {
      event?.preventDefault?.();
      event?.stopPropagation?.();
      event?.stopImmediatePropagation?.();
    };
    const blurAll = (commit = false) => focusedInputs.forEach(input => input.blur(commit));
    const formatValue = (value, decimals = 2) => String(Number((Number(value) || 0).toFixed(decimals))).replace(/\.0$/, "");

    const makeStepperInput = ({ x, y, label, getValue, setValue, min = 0, max = 9999, allowNegative = false }) => {
      inner.add(this.add.bitmapText(x, y - 56, "goldFont", label, 27).setOrigin(0.5));
      const inputW = 102;
      const inputH = 58;
      const bg = this.add.graphics();
      const text = this.add.bitmapText(x, y, "bigFont", "", 32).setOrigin(0.5).setTint(0xffffff);
      const hit = this.add.rectangle(x, y, inputW, inputH + 4, 0xffffff, 0.001).setOrigin(0.5).setInteractive();
      const leftArrow = this.add.image(x - 88, y + 1, "GJ_GameSheet03", "edit_leftBtn_001.png").setScale(0.9).setInteractive();
      const rightArrow = this.add.image(x + 88, y + 1, "GJ_GameSheet03", "edit_leftBtn_001.png").setScale(0.9).setFlipX(true).setInteractive();
      inner.add([bg, text, hit, leftArrow, rightArrow]);
      let focused = false;
      let valueText = String(getValue());
      let beforeFocus = valueText;
      const normalize = (raw) => {
        const parsed = parseInt(raw, 10);
        let next = Number.isFinite(parsed) ? parsed : 0;
        next = Math.max(min, next);
        return Math.min(max, next);
      };
      const render = () => {
        bg.clear();
        bg.fillStyle(0x000000, 0.43);
        bg.fillRoundedRect(x - inputW / 2, y - inputH / 2, inputW, inputH, 10);
        if (!focused) valueText = String(normalize(getValue()));
        text.setText(`${focused ? valueText : String(normalize(getValue()))}${focused ? "|" : ""}`);
      };
      const commit = () => { setValue(normalize(valueText)); render(); };
      const blur = (commitValue = false) => {
        if (!focused) return;
        if (commitValue) commit();
        focused = false;
        if (!focusedInputs.some(input => input !== entry && input.focused())) this._editorTextInputFocused = false;
        render();
      };
      const cancel = () => {
        if (!focused) return;
        valueText = beforeFocus;
        focused = false;
        if (!focusedInputs.some(input => input !== entry && input.focused())) this._editorTextInputFocused = false;
        render();
      };
      const focus = (pointer) => {
        blurAll(true);
        valueText = String(normalize(getValue()));
        beforeFocus = valueText;
        focused = true;
        this._editorTextInputFocused = true;
        render();
        stopInputEvent(pointer?.event);
      };
      const isInside = (pointer) => Math.abs(pointer.x - (sw / 2 + x)) <= inputW / 2 && Math.abs(pointer.y - (sh / 2 + 6 + y)) <= (inputH + 4) / 2;
      const stepValue = (delta) => { blur(true); setValue(normalize(getValue()) + delta); render(); };
      hit.on("pointerdown", focus);
      this._makeBouncyButton(leftArrow, 0.9, () => stepValue(-1));
      this._makeBouncyButton(rightArrow, 0.9, () => stepValue(1));
      const entry = {
        focused: () => focused,
        blur,
        cancel,
        isInside,
        handleKey: (event) => {
          if (!focused) return false;
          if (event.key === "Enter") blur(true);
          else if (event.key === "Backspace") { valueText = valueText.slice(0, -1); render(); }
          else if (allowNegative && event.key === "-" && valueText.length === 0) { valueText = "-"; render(); }
          else if (/^[0-9]$/.test(event.key) && valueText.length < 5) { valueText += event.key; render(); }
          else if (event.key.length !== 1) return false;
          return true;
        },
        render
      };
      focusedInputs.push(entry);
      render();
      return entry;
    };

    const makeSliderInput = ({ x, y, label, min, max, inputMin = min, inputMax = max, getValue, setValue, labelStyle = "gold", layout = "vertical", width = 300 }) => {
      const inputW = 118;
      const inputH = 50;
      const isHorizontal = layout === "horizontal";
      const isTime = layout === "time";
      const inputX = isHorizontal ? x - 250 : x + 90;
      const inputY = y;
      const sliderX = isHorizontal ? x - 100 : x;
      const sliderY = isHorizontal ? y : y + 50;
      const labelX = isHorizontal ? x - 420 : (isTime ? x - 165 : x);
      const labelY = (isHorizontal || isTime) ? inputY : y - 55;
      
      const labelObj = labelStyle === "helvetica"
        ? this.add.text(labelX, labelY, label, { fontFamily: "Helvetica, Arial, sans-serif", fontSize: "24px", color: "#ffffff" }).setOrigin((isHorizontal || isTime) ? 0 : 0.5, 0.5)
        : this.add.bitmapText(labelX, labelY, "goldFont", label, 32).setOrigin((isHorizontal || isTime) ? 0 : 0.5, 0.5);
      
      inner.add(labelObj);
      
      const inputBg = this.add.graphics();
      const inputText = this.add.bitmapText(inputX, inputY, "bigFont", "", 28).setOrigin(0.5).setTint(0xffffff);
      const inputHit = this.add.rectangle(inputX, inputY, inputW + 8, inputH + 8, 0xffffff, 0.001).setOrigin(0.5).setInteractive();
      
      const grooveFrame = this.textures.getFrame("GJ_WebSheet", "slidergroove.png");
      const grooveH = grooveFrame ? grooveFrame.height : 34;
      
      const sliderScale = 0.7;
      const sliderW = (width - 8) * sliderScale; 
      const sliderStartX = sliderX - sliderW / 2 + 2;
      const sliceEdge = 16; 
      
      const sliderGroove = this.add.nineslice(
          sliderX, sliderY, 
          "GJ_WebSheet", "slidergroove.png", 
          width, grooveH, 
          sliceEdge, sliceEdge, 0, 0
      ).setScale(sliderScale);
      
      const sliderHit = this.add.rectangle(sliderX, sliderY, sliderW + 24, 34, 0xffffff, 0.001).setOrigin(0.5).setInteractive();
      const sliderThumb = this.add.image(sliderStartX, sliderY, "GJ_WebSheet", "sliderthumb.png").setScale(sliderScale).setInteractive({ draggable: true });
      
      inner.add([inputBg, inputText, inputHit, sliderGroove, sliderHit, sliderThumb]);
      
      let focused = false;
      let textValue = "";
      let beforeFocus = "";
      
      const sliderMin = Number.isFinite(Number(min)) ? Number(min) : 0;
      const sliderMax = Number.isFinite(Number(max)) ? Number(max) : sliderMin + 1;
      const textMin = Number.isFinite(Number(inputMin)) ? Number(inputMin) : sliderMin;
      const textMax = Number.isFinite(Number(inputMax)) ? Number(inputMax) : sliderMax;
      const pctForValue = (value) => Phaser.Math.Clamp((Number(value) - sliderMin) / (sliderMax - sliderMin), 0, 1);
      const valueForPct = (pct) => sliderMin + Phaser.Math.Clamp(pct, 0, 1) * (sliderMax - sliderMin);
      
      const render = () => {
        inputBg.clear();
        inputBg.fillStyle(0x000000, 0.43);
        inputBg.fillRoundedRect(inputX - inputW / 2, inputY - inputH / 2, inputW, inputH, 10);
        const value = getValue();
        if (!focused) textValue = formatValue(value);
        inputText.setText(`${focused ? textValue : formatValue(value)}${focused ? "|" : ""}`);
        sliderThumb.x = sliderStartX + pctForValue(value) * sliderW;
      };
      
      const commit = () => {
        const parsed = parseFloat(textValue || "0");
        setValue(Phaser.Math.Clamp(Number.isFinite(parsed) ? parsed : 0, textMin, textMax));
        render();
      };
      
      const blur = (commitValue = false) => {
        if (!focused) return;
        if (commitValue) commit();
        focused = false;
        if (!focusedInputs.some(input => input !== entry && input.focused())) this._editorTextInputFocused = false;
        render();
      };
      
      const cancel = () => {
        if (!focused) return;
        textValue = beforeFocus;
        focused = false;
        if (!focusedInputs.some(input => input !== entry && input.focused())) this._editorTextInputFocused = false;
        render();
      };
      
      const focus = (pointer) => {
        blurAll(true);
        textValue = formatValue(getValue());
        beforeFocus = textValue;
        focused = true;
        this._editorTextInputFocused = true;
        render();
        stopInputEvent(pointer?.event);
      };
      
      const isInside = (pointer) => Math.abs(pointer.x - (sw / 2 + inputX)) <= inputW / 2 && Math.abs(pointer.y - (sh / 2 + 6 + inputY)) <= (inputH + 8) / 2;
      
      const setFromPointerX = (localX) => {
        blur(true);
        const clampedX = Phaser.Math.Clamp(localX, sliderStartX, sliderStartX + sliderW);
        setValue(valueForPct((clampedX - sliderStartX) / sliderW));
        render();
      };
      
      inputHit.on("pointerdown", focus);
      sliderHit.on("pointerdown", (pointer) => { setFromPointerX(pointer.x - (sw / 2)); stopInputEvent(pointer?.event); });
      sliderThumb.on("dragstart", () => { this._isDraggingSlider = true; });
      sliderThumb.on("drag", (pointer, dragX) => setFromPointerX(dragX));
      sliderThumb.on("dragend", () => { this._isDraggingSlider = false; });
      
      const entry = {
        focused: () => focused,
        blur,
        cancel,
        isInside,
        handleKey: (event) => {
          if (!focused) return false;
          if (event.key === "Enter") blur(true);
          else if (event.key === "Backspace") { textValue = textValue.slice(0, -1); render(); }
          else if (event.key === "-" && textValue.length === 0 && min < 0) { textValue = "-"; render(); }
          else if ((/^[0-9]$/.test(event.key) || event.key === ".") && textValue.length < 7) {
            if (event.key !== "." || !textValue.includes(".")) { textValue += event.key; render(); }
          } else if (event.key.length !== 1) return false;
          return true;
        },
        render
      };
      
      focusedInputs.push(entry);
      render();
      return entry;
    };

    const targetInput = makeStepperInput({
      x: 280,
      y: 230,
      label: "Target Group ID",
      getValue: () => this._getEditorTriggerTargetGroup(saveObj),
      setValue: (value) => this._setEditorTriggerTargetGroup(saveObj, value),
      min: 0,
      max: 9999
    });

    const sliderEntries = [];
    sliderEntries.push(makeSliderInput({
      x: 0,
      y: -180,
      label: "Move X:",
      min: -100,
      max: 100,
      inputMin: -99999,
      inputMax: 99999,
      labelStyle: "helvetica",
      layout: "horizontal",
      width: 200,
      getValue: () => this._getEditorMoveTriggerOffset(saveObj, 28),
      setValue: (value) => this._setEditorMoveTriggerOffset(saveObj, 28, value)
    }));
    sliderEntries.push(makeSliderInput({
      x: 450,
      y: -180,
      label: "Move Y:",
      min: -100,
      max: 100,
      inputMin: -99999,
      inputMax: 99999,
      labelStyle: "helvetica",
      layout: "horizontal",
      width: 200,
      getValue: () => this._getEditorMoveTriggerOffset(saveObj, 29),
      setValue: (value) => this._setEditorMoveTriggerOffset(saveObj, 29, value)
    }));
    sliderEntries.push(makeSliderInput({
      x: -225,
      y: 60,
      label: "Move Time:",
      min: 0,
      max: 10,
      layout: "time",
      width: 400,
      getValue: () => this._getEditorMoveTriggerDuration(saveObj),
      setValue: (value) => this._setEditorMoveTriggerDuration(saveObj, value)
    }));

    const toggleRefreshers = [];
    const makeToggle = (x, y, label, key, peerKey = null, scale = 0.78) => {
      const row = this.add.container(x, y);
      const check = this.add.image(0, 0, "GJ_GameSheet03", "GJ_checkOff_001.png").setScale(scale).setInteractive();
      const text = this.add.bitmapText(40, -2, "bigFont", label, 22).setOrigin(0, 0.5).setInteractive();
      row.add([check, text]);
      inner.add(row);
      const refresh = () => {
        const checked = this._getEditorTriggerBool(saveObj, key);
        check.setTexture("GJ_GameSheet03", checked ? "GJ_checkOn_001.png" : "GJ_checkOff_001.png");
      };
      const toggle = () => {
        blurAll(true);
        const next = !this._getEditorTriggerBool(saveObj, key);
        if (next && peerKey !== null && peerKey !== undefined) this._setEditorTriggerBool(saveObj, peerKey, false);
        this._setEditorTriggerBool(saveObj, key, next);
        for (const fn of toggleRefreshers) fn();
      };
      this._makeBouncyButton(check, scale, toggle);
      text.on("pointerdown", toggle);
      toggleRefreshers.push(refresh);
      refresh();
      return { refresh };
    };

    makeToggle(-410, 200, "Touch\nTrigger", 11);
    makeToggle(-410, 260, "Spawn\nTrigger", 62);

    inner.add(this.add.bitmapText(-250, -130, "goldFont", "Lock X:", 26).setOrigin(0.5));
    makeToggle(-380, -80, "Player", 58, 302);
    makeToggle(-180, -80, "Camera", 302, 58);

    inner.add(this.add.bitmapText(200, -130, "goldFont", "Lock Y:", 26).setOrigin(0.5));
    makeToggle(80, -80, "Player", 59, 303);
    makeToggle(260, -80, "Camera", 303, 59);

    this._editorGroupInputPointerDownHandler = (pointer) => {
      if (!this._editorObjectOptionsPopup) return;
      const focusedInput = focusedInputs.find(entry => entry.focused());
      if (!focusedInput) return;
      if (focusedInput.isInside(pointer)) return;
      focusedInput.blur(true);
    };
    this.input.on("pointerdown", this._editorGroupInputPointerDownHandler);

    this._editorObjectOptionsKeyHandler = (event) => {
      if (!this._editorObjectOptionsPopup) return;
      if (event.key === "Escape") {
        const focusedInput = focusedInputs.find(entry => entry.focused());
        if (focusedInput) focusedInput.cancel();
        else this._closeEditorObjectOptionsPopup();
        stopInputEvent(event);
        return;
      }
      const focusedInput = focusedInputs.find(entry => entry.focused());
      if (!focusedInput) return;
      if (focusedInput.handleKey(event)) stopInputEvent(event);
    };
    window.addEventListener("keydown", this._editorObjectOptionsKeyHandler);

    targetInput.render?.();
    sliderEntries.forEach(entry => entry.render?.());
    this._makeEditorOkButton(inner, 0, (panelH / 2) - 48, "OK", () => {
      blurAll(true);
      this._closeEditorObjectOptionsPopup();
    });
  }


  _openEditorSpawnTriggerOptionsPopup(saveObj) {
    if (!saveObj) return;
    this._closeEditorObjectOptionsPopup();

    const sw = screenWidth;
    const sh = screenHeight;
    const panelW = 840;
    const panelH = 580;
    const root = this.add.container(0, 0).setScrollFactor(0).setDepth(2550);
    this._editorObjectOptionsPopup = root;

    const blocker = this.add.rectangle(0, 0, sw, sh, 0x000000, 0.45).setOrigin(0).setInteractive();
    root.add(blocker);

    const inner = this.add.container(sw / 2, sh / 2 + 6);
    root.add(inner);

    const corner = this.textures.exists("GJ_square01") ? this.textures.get("GJ_square01").source[0].width * 0.325 : 24;
    inner.add(this._drawScale9(0, 0, panelW, panelH, "GJ_square01", corner, 0xffffff, 1));
    inner.add(this.add.bitmapText(0, -(panelH / 2) + 40, "bigFont", "Spawn Group", 35).setOrigin(0.5));

    const focusedInputs = [];
    const stopInputEvent = (event) => {
      event?.preventDefault?.(); 
      event?.stopPropagation?.();
      event?.stopImmediatePropagation?.();
    };
    const blurAll = (commit = false) => focusedInputs.forEach(input => input.blur(commit));
    const formatValue = (value, decimals = 4) => String(Number((Number(value) || 0).toFixed(decimals))).replace(/\.0$/, "");

    const makeStepperInput = ({ x, y, label, getValue, setValue }) => {
      inner.add(this.add.bitmapText(x, y - 56, "goldFont", label, 27).setOrigin(0.5));
      const inputW = 102;
      const inputH = 58;
      const bg = this.add.graphics();
      const text = this.add.bitmapText(x, y, "bigFont", "", 32).setOrigin(0.5).setTint(0xffffff);
      const hit = this.add.rectangle(x, y, inputW, inputH + 4, 0xffffff, 0.001).setOrigin(0.5).setInteractive();
      const leftArrow = this.add.image(x - 88, y + 1, "GJ_GameSheet03", "edit_leftBtn_001.png").setScale(0.9).setInteractive();
      const rightArrow = this.add.image(x + 88, y + 1, "GJ_GameSheet03", "edit_leftBtn_001.png").setScale(0.9).setFlipX(true).setInteractive();
      inner.add([bg, text, hit, leftArrow, rightArrow]);
      let focused = false;
      let valueText = String(getValue());
      let beforeFocus = valueText;
      const normalize = (raw) => Math.max(0, Math.min(9999, parseInt(raw, 10) || 0));
      const render = () => {
        bg.clear();
        bg.fillStyle(0x000000, 0.43);
        bg.fillRoundedRect(x - inputW / 2, y - inputH / 2, inputW, inputH, 10);
        if (!focused) valueText = String(normalize(getValue()));
        text.setText(`${focused ? valueText : String(normalize(getValue()))}${focused ? "|" : ""}`);
      };
      const commit = () => { setValue(normalize(valueText)); render(); };
      const blur = (commitValue = false) => {
        if (!focused) return;
        if (commitValue) commit();
        focused = false;
        if (!focusedInputs.some(input => input !== entry && input.focused())) this._editorTextInputFocused = false;
        render();
      };
      const cancel = () => {
        if (!focused) return;
        valueText = beforeFocus;
        focused = false;
        if (!focusedInputs.some(input => input !== entry && input.focused())) this._editorTextInputFocused = false;
        render();
      };
      const focus = (pointer) => {
        blurAll(true);
        valueText = String(normalize(getValue()));
        beforeFocus = valueText;
        focused = true;
        this._editorTextInputFocused = true;
        render();
        stopInputEvent(pointer?.event);
      };
      const isInside = (pointer) => Math.abs(pointer.x - (sw / 2 + x)) <= inputW / 2 && Math.abs(pointer.y - (sh / 2 + 6 + y)) <= (inputH + 4) / 2;
      const stepValue = (delta) => { blur(true); setValue(normalize(getValue()) + delta); render(); };
      hit.on("pointerdown", focus);
      this._makeBouncyButton(leftArrow, 0.9, () => stepValue(-1));
      this._makeBouncyButton(rightArrow, 0.9, () => stepValue(1));
      const entry = {
        focused: () => focused,
        blur,
        cancel,
        isInside,
        handleKey: (event) => {
          if (!focused) return false;
          if (event.key === "Enter") blur(true);
          else if (event.key === "Backspace") { valueText = valueText.slice(0, -1); render(); }
          else if (/^[0-9]$/.test(event.key) && valueText.length < 5) { valueText += event.key; render(); }
          else if (event.key.length !== 1) return false;
          return true;
        },
        render
      };
      focusedInputs.push(entry);
      render();
      return entry;
    };

    const makeDelaySlider = ({ x, y, width, label, labelOffset = 400, min = 0, max = 10, inputMax = max, getValue, setValue, sliderMax = max }) => {
        const inputW = 118;
        const inputH = 50;

        const labelX = x - labelOffset;
        const inputX = x - 250;
        const inputY = y;
        const sliderX = x - 100;
        const sliderY = y;

        const labelObj = this.add.text(labelX, inputY, label, {
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "24px",
            color: "#ffffff"
        }).setOrigin(0, 0.5);

        inner.add(labelObj);

        const inputBg = this.add.graphics();
        const inputText = this.add.bitmapText(inputX, inputY, "bigFont", "", 28).setOrigin(0.5).setTint(0xffffff);
        const inputHit = this.add.rectangle(inputX, inputY, inputW + 8, inputH + 8, 0xffffff, 0.001).setOrigin(0.5).setInteractive();

        const grooveFrame = this.textures.getFrame("GJ_WebSheet", "slidergroove.png");
        const grooveH = grooveFrame ? grooveFrame.height : 34;

        const sliderScale = 0.7;
        const sliderW = (width - 8) * sliderScale;
        const sliderStartX = sliderX - sliderW / 2 + 2;
        const sliceEdge = 16;

        const sliderGroove = this.add.nineslice(
            sliderX,
            sliderY,
            "GJ_WebSheet",
            "slidergroove.png",
            width,
            grooveH,
            sliceEdge,
            sliceEdge,
            0,
            0
        ).setScale(sliderScale);

        const sliderHit = this.add.rectangle(sliderX, sliderY, sliderW + 24, 34, 0xffffff, 0.001).setOrigin(0.5).setInteractive();
        const sliderThumb = this.add.image(sliderStartX, sliderY, "GJ_WebSheet", "sliderthumb.png").setScale(sliderScale).setInteractive({ draggable: true });

        inner.add([inputBg, inputText, inputHit, sliderGroove, sliderHit, sliderThumb]);

        let focused = false;
        let textValue = "";
        let beforeFocus = "";

        const pctForValue = (value) => Phaser.Math.Clamp((Number(value) - min) / (sliderMax - min), 0, 1);
        const valueForPct = (pct) => min + Phaser.Math.Clamp(pct, 0, 1) * (sliderMax - min);

        const render = () => {
            inputBg.clear();
            inputBg.fillStyle(0x000000, 0.43);
            inputBg.fillRoundedRect(inputX - inputW / 2, inputY - inputH / 2, inputW, inputH, 10);

            const value = getValue();

            if (!focused) textValue = formatValue(value, 4);

            inputText.setText(`${focused ? textValue : formatValue(value, 4)}${focused ? "|" : ""}`);
            sliderThumb.x = sliderStartX + pctForValue(value) * sliderW;
        };

        const commit = () => {
            const parsed = parseFloat(textValue || "0");
            setValue(Phaser.Math.Clamp(Number.isFinite(parsed) ? parsed : 0, min, inputMax));
            render();
        };

        const blur = (commitValue = false) => {
            if (!focused) return;

            if (commitValue) commit();

            focused = false;

            if (!focusedInputs.some(input => input !== entry && input.focused())) {
            this._editorTextInputFocused = false;
            }

            render();
        };

        const cancel = () => {
            if (!focused) return;

            textValue = beforeFocus;
            focused = false;

            if (!focusedInputs.some(input => input !== entry && input.focused())) {
            this._editorTextInputFocused = false;
            }

            render();
        };

        const focus = (pointer) => {
            blurAll(true);

            textValue = formatValue(getValue(), 4);
            beforeFocus = textValue;
            focused = true;
            this._editorTextInputFocused = true;

            render();
            stopInputEvent(pointer?.event);
        };

        const isInside = (pointer) =>
            Math.abs(pointer.x - (sw / 2 + inputX)) <= inputW / 2 &&
            Math.abs(pointer.y - (sh / 2 + 6 + inputY)) <= (inputH + 8) / 2;

        const setFromPointerX = (localX) => {
            blur(true);

            const clampedX = Phaser.Math.Clamp(localX, sliderStartX, sliderStartX + sliderW);
            setValue(valueForPct((clampedX - sliderStartX) / sliderW));

            render();
        };

        inputHit.on("pointerdown", focus);

        sliderHit.on("pointerdown", (pointer) => {
            setFromPointerX(pointer.x - (sw / 2));
            stopInputEvent(pointer?.event);
        });

        sliderThumb.on("dragstart", () => {
            this._isDraggingSlider = true;
        });

        sliderThumb.on("drag", (pointer, dragX) => {
            setFromPointerX(dragX);
        });

        sliderThumb.on("dragend", () => {
            this._isDraggingSlider = false;
        });

        const entry = {
            focused: () => focused,
            blur,
            cancel,
            isInside,
            handleKey: (event) => {
            if (!focused) return false;

            if (event.key === "Enter") {
                blur(true);
            } else if (event.key === "Backspace") {
                textValue = textValue.slice(0, -1);
                render();
            } else if (event.key === "-" && textValue.length === 0 && min < 0) {
                textValue = "-";
                render();
            } else if ((/^[0-9]$/.test(event.key) || event.key === ".") && textValue.length < 9) {
                if (event.key !== "." || !textValue.includes(".")) {
                textValue += event.key;
                render();
                }
            } else if (event.key.length !== 1) {
                return false;
            }

            return true;
            },
            render
        };

        focusedInputs.push(entry);
        render();

        return entry;
    };

    const targetInput = makeStepperInput({
      x: 0,
      y: -100,
      label: "Group ID",
      getValue: () => this._getEditorTriggerTargetGroup(saveObj),
      setValue: (value) => this._setEditorTriggerTargetGroup(saveObj, value)
    });
    const delayInput = makeDelaySlider({
      x: 30,
      y: 70,
      width: 200,
      label: "Delay:",
      labelOffset: 400,
      min: 0,
      max: 10,
      inputMax: 10,
      sliderMax: 10,
      getValue: () => this._getEditorSpawnTriggerDelay(saveObj),
      setValue: (value) => this._setEditorSpawnTriggerDelay(saveObj, value)
    });
    const randomDelayInput = makeDelaySlider({
      x: 400,
      y: 70,
      width: 200,
      label: "+-",
      labelOffset: 350,
      min: 0,
      max: 9999,
      inputMax: 9999,
      sliderMax: 1,
      getValue: () => this._getEditorSpawnTriggerRandomDelay(saveObj),
      setValue: (value) => this._setEditorSpawnTriggerRandomDelay(saveObj, value)
    });

    const makeToggle = (x, y, label, key) => {
      const row = this.add.container(x, y);
      const check = this.add.image(0, 0, "GJ_GameSheet03", "GJ_checkOff_001.png").setScale(0.82).setInteractive();
      const text = this.add.bitmapText(42, -2, "bigFont", label, 23).setOrigin(0, 0.5).setInteractive();
      row.add([check, text]);
      inner.add(row);
      const refresh = () => {
        const checked = this._getEditorTriggerBool(saveObj, key);
        check.setTexture("GJ_GameSheet03", checked ? "GJ_checkOn_001.png" : "GJ_checkOff_001.png");
      };
      const toggle = () => {
        blurAll(true);
        this._setEditorTriggerBool(saveObj, key, !this._getEditorTriggerBool(saveObj, key));
        refresh();
      };
      this._makeBouncyButton(check, 0.82, toggle);
      text.on("pointerdown", toggle);
      refresh();
      return { refresh };
    };

    makeToggle(-370, 180, "Touch\nTrigger", 11);
    makeToggle(-370, 245, "Spawn\nTrigger", 62);

    this._editorGroupInputPointerDownHandler = (pointer) => {
      if (!this._editorObjectOptionsPopup) return;
      const focusedInput = focusedInputs.find(entry => entry.focused());
      if (!focusedInput) return;
      if (focusedInput.isInside(pointer)) return;
      focusedInput.blur(true);
    };
    this.input.on("pointerdown", this._editorGroupInputPointerDownHandler);

    this._editorObjectOptionsKeyHandler = (event) => {
      if (!this._editorObjectOptionsPopup) return;
      if (event.key === "Escape") {
        const focusedInput = focusedInputs.find(entry => entry.focused());
        if (focusedInput) focusedInput.cancel();
        else this._closeEditorObjectOptionsPopup();
        stopInputEvent(event);
        return;
      }
      const focusedInput = focusedInputs.find(entry => entry.focused());
      if (!focusedInput) return;
      if (focusedInput.handleKey(event)) stopInputEvent(event);
    };
    window.addEventListener("keydown", this._editorObjectOptionsKeyHandler);

    targetInput.render?.();
    delayInput.render?.();
    randomDelayInput.render?.();
    this._makeEditorOkButton(inner, 0, (panelH / 2) - 48, "OK", () => {
      blurAll(true);
      this._closeEditorObjectOptionsPopup();
    });
  }


  _isEditorColorTriggerTouchTriggered(saveObj) {
    return String(saveObj?._raw?.[11] ?? saveObj?._raw?.["11"] ?? "0") === "1";
  }


  _setEditorColorTriggerTouchTriggered(saveObj, enabled) {
    if (!saveObj) return;
    saveObj._raw = saveObj._raw || {};
    saveObj._raw[11] = enabled ? "1" : "0";
    saveObj._raw["11"] = saveObj._raw[11];
    if (enabled) {
        saveObj._raw[62] = "0";
        saveObj._raw["62"] = "0";
    }
    const linkedId = Number.isInteger(saveObj._eeObjectId) ? saveObj._eeObjectId : -1;
    if (Array.isArray(this._level?._colorTriggers)) {
        for (const trigger of this._level._colorTriggers) {
            if (trigger && trigger.uid === linkedId) {
                trigger.touchTriggered = !!enabled;
                if (enabled) trigger.spawnTriggered = false;
            }
        }
    }
    if (this._level?.updateTriggerEditorVisuals) this._level.updateTriggerEditorVisuals();
  }

  _isEditorTriggerSpawnTriggered(saveObj) {
    return String(saveObj?._raw?.[62] ?? saveObj?._raw?.["62"] ?? "0") === "1";
  }


  _setEditorTriggerSpawnTriggered(saveObj, enabled) {
    if (!saveObj) return;
    saveObj._raw = saveObj._raw || {};
    saveObj._raw[62] = enabled ? "1" : "0";
    saveObj._raw["62"] = saveObj._raw[62];
    if (enabled) {
        saveObj._raw[11] = "0";
        saveObj._raw["11"] = "0";
    }

    const linkedId = Number.isInteger(saveObj._eeObjectId) ? saveObj._eeObjectId : -1;
    const groups = this._level?._getLevelObjectGroupIds
      ? this._level._getLevelObjectGroupIds(saveObj)
      : String(saveObj.groups || saveObj._raw?.[57] || saveObj._raw?.["57"] || "").split(".").map(n => parseInt(n, 10)).filter(n => n > 0);

    const updateList = (list) => {
      if (!Array.isArray(list)) return;
      for (const trigger of list) {
        if (trigger && trigger.uid === linkedId) {
          trigger.spawnTriggered = !!enabled;
          trigger.groups = groups;
          if (enabled && trigger.touchTriggered !== undefined) trigger.touchTriggered = false;
        }
      }
    };

    updateList(this._level?._colorTriggers);
    updateList(this._level?._enterEffectTriggers);
    updateList(this._level?._moveTriggers);
    updateList(this._level?._alphaTriggers);
    updateList(this._level?._rotateTriggers);
    updateList(this._level?._pulseTriggers);
    updateList(this._level?._spawnTriggers);

    if (this._level?.updateTriggerEditorVisuals) this._level.updateTriggerEditorVisuals();
  }


  _openEditorColorTriggerOptionsPopup(saveObj) {
    if (!saveObj) return;
    this._closeEditorObjectOptionsPopup();

    const channel = this._getEditorColorTriggerTargetChannel(saveObj);
    const initialColor = this._getEditorObjectColor(saveObj, channel);
    const canRetarget = ![29, 30].includes(parseInt(saveObj.id ?? 0, 10));

    this._openEditorColorPickerPopup(
        channel,
        "Select Color",
        (color) => {
            this._setEditorObjectColor(saveObj, color);
        },
        {
            initialColor,
            commitColorChannel: false,
            panelW: 920,
            panelH: 620,
            contentYOffset: -50,
            pickerYOffset: -80,
            onBuildExtra: (inner, panelW, panelH) => {
                const controlX = (panelW / 2) - 160;
                const controlY = (panelH / 2) - 120;
                const labelY = controlY - 57;
                const inputW = 92;
                const inputH = 60;
                const inputRadius = 10;
                const arrowScale = 1.08;
                const plusScale = 1.0;

                const targetLabel = this.add.bitmapText(controlX, labelY, "goldFont", "Color ID", 35).setOrigin(0.5);
                const plusBtn = this.add.image(controlX + 120, labelY + 3, "GJ_GameSheet03", "GJ_plus2Btn_001.png").setScale(plusScale).setInteractive();
                const inputBg = this.add.graphics();
                const inputText = this.add.bitmapText(controlX, controlY, "bigFont", "", 35).setOrigin(0.5);
                const inputHit = this.add.rectangle(controlX, controlY, inputW, inputH + 4, 0xffffff, 0.001).setOrigin(0.5).setInteractive();
                inner.add([targetLabel, plusBtn, inputBg, inputText, inputHit]);

                const leftArrow = this.add.image(controlX - 86, controlY + 1, "GJ_GameSheet03", "edit_leftBtn_001.png")
                    .setScale(arrowScale)
                    .setInteractive();
                const rightArrow = this.add.image(controlX + 86, controlY + 1, "GJ_GameSheet03", "edit_leftBtn_001.png")
                    .setScale(arrowScale)
                    .setFlipX(true)
                    .setInteractive();
                inner.add([leftArrow, rightArrow]);
                if (!canRetarget) {
                    targetLabel.setVisible(false);
                    plusBtn.setVisible(false);
                    inputBg.setVisible(false);
                    inputText.setVisible(false);
                    inputHit.setVisible(false);
                    leftArrow.setVisible(false);
                    rightArrow.setVisible(false);
                }

                let targetInputFocused = false;
                let targetInput = "";
                let targetInputBeforeFocus = "";

                const stopInputEvent = (event) => {
                    event?.preventDefault?.();
                    event?.stopPropagation?.();
                    event?.stopImmediatePropagation?.();
                };

                const getChannel = () => this._getEditorColorTriggerTargetChannel(saveObj);

                const drawTargetInput = () => {
                    const channelId = getChannel();
                    const label = targetInputFocused
                        ? `${targetInput}|`
                        : this._getEditorColorChannelLabel(channelId);

                    inputText.setText(label || "Color Channel ID");
                    inputText.setTint((targetInputFocused || label) ? 0xffffff : 0x75aaf0);
                    inputBg.clear();
                    inputBg.fillStyle(0x000000, 0.43);
                    inputBg.fillRoundedRect(controlX - inputW / 2, controlY - inputH / 2, inputW, inputH, inputRadius);
                    this._refreshSelectedTriggerTargetLabel();
                };

                const setTargetChannel = (value) => {
                    this._setEditorColorTriggerTargetChannel(saveObj, value);
                    targetInput = String(this._getEditorColorTriggerTargetChannel(saveObj));
                    drawTargetInput();
                };

                const fadeX = 0;
                const fadeY = 140;
                const fadeLabel = this.add.bitmapText(fadeX - 70, fadeY, "goldFont", "Fade Time:", 32).setOrigin(0.5);
                const fadeInputW = 110;
                const fadeInputH = 55;
                const fadeInputBg = this.add.graphics();
                fadeInputBg.fillStyle(0x000000, 0.43);
                fadeInputBg.fillRoundedRect(fadeX + 100 - fadeInputW / 2, fadeY - fadeInputH / 2, fadeInputW, fadeInputH, 10);
                const fadeInputText = this.add.bitmapText(fadeX + 100, fadeY, "bigFont", "", 35).setOrigin(0.5);
                const fadeInputHit = this.add.rectangle(fadeX + 100, fadeY, fadeInputW + 8, fadeInputH + 8, 0xffffff, 0.001).setOrigin(0.5).setInteractive();

                const grooveFrame = this.textures.getFrame("GJ_WebSheet", "slidergroove.png");
                const grooveW = grooveFrame ? grooveFrame.width : 420;
                const sliderScale = 0.8;
                const sliderW = (grooveW - 8) * sliderScale;
                const sliderY = fadeY + 55;
                const sliderStartX = fadeX - sliderW / 2 + 2;
                const sliderGroove = this.add.image(fadeX, sliderY, "GJ_WebSheet", "slidergroove.png").setScale(sliderScale);
                const sliderHit = this.add.rectangle(fadeX, sliderY, sliderW + 24, 34, 0xffffff, 0.001).setOrigin(0.5).setInteractive();
                const sliderThumb = this.add.image(sliderStartX, sliderY, "GJ_WebSheet", "sliderthumb.png").setScale(sliderScale).setInteractive({ draggable: true });
                inner.add([fadeLabel, fadeInputBg, fadeInputText, fadeInputHit, sliderGroove, sliderHit, sliderThumb]);

                const touchRow = this.add.container((panelW / 2) - 350, fadeY + 120);
                const touchCheck = this.add.image(0, 0, "GJ_GameSheet03", "GJ_checkOff_001.png").setScale(0.82).setInteractive();
                const touchText = this.add.bitmapText(42, -2, "bigFont", "Touch\nTrigger", 24).setOrigin(0, 0.5).setInteractive();
                touchRow.add([touchCheck, touchText]);
                inner.add(touchRow);

                const refreshTouchTrigger = () => {
                    const checked = this._isEditorColorTriggerTouchTriggered(saveObj);
                    touchCheck.setTexture("GJ_GameSheet03", checked ? "GJ_checkOn_001.png" : "GJ_checkOff_001.png");
                };
                const toggleTouchTrigger = () => {
                    const checked = this._isEditorColorTriggerTouchTriggered(saveObj);
                    this._setEditorColorTriggerTouchTriggered(saveObj, !checked);
                    refreshTouchTrigger();
                    refreshSpawnTrigger?.();
                };
                this._makeBouncyButton(touchCheck, 0.82, toggleTouchTrigger);
                touchText.on("pointerdown", toggleTouchTrigger);
                refreshTouchTrigger();

                const spawnRow = this.add.container((panelW / 2) - 165, fadeY + 120);
                const spawnCheck = this.add.image(0, 0, "GJ_GameSheet03", "GJ_checkOff_001.png").setScale(0.82).setInteractive();
                const spawnText = this.add.bitmapText(42, -2, "bigFont", "Spawn\nTrigger", 24).setOrigin(0, 0.5).setInteractive();
                spawnRow.add([spawnCheck, spawnText]);
                inner.add(spawnRow);

                const refreshSpawnTrigger = () => {
                    const checked = this._isEditorTriggerSpawnTriggered(saveObj);
                    spawnCheck.setTexture("GJ_GameSheet03", checked ? "GJ_checkOn_001.png" : "GJ_checkOff_001.png");
                };
                const toggleSpawnTrigger = () => {
                    const checked = this._isEditorTriggerSpawnTriggered(saveObj);
                    this._setEditorTriggerSpawnTriggered(saveObj, !checked);
                    refreshSpawnTrigger();
                    refreshTouchTrigger();
                };
                this._makeBouncyButton(spawnCheck, 0.82, toggleSpawnTrigger);
                spawnText.on("pointerdown", toggleSpawnTrigger);
                refreshSpawnTrigger();

                let fadeInputFocused = false;
                let fadeInput = "";
                let fadeInputBeforeFocus = "";

                const formatFadeValue = (value) => {
                    const normalized = Math.max(0, Number(value) || 0);
                    return String(Number(normalized.toFixed(2))).replace(/\.0$/, "");
                };

                const getFadeTime = () => {
                    const raw = parseFloat(saveObj?._raw?.[10] ?? 0);
                    return Math.max(0, Number.isFinite(raw) ? raw : 0);
                };

                const setFadeTime = (value) => {
                    saveObj._raw = saveObj._raw || {};
                    saveObj._raw[10] = formatFadeValue(value);
                    drawFadeInput();
                };

                const drawFadeInput = () => {
                    const fadeValue = getFadeTime();
                    if (!fadeInputFocused) fadeInput = formatFadeValue(fadeValue);
                    fadeInputText.setText(`${fadeInputFocused ? fadeInput : formatFadeValue(fadeValue)}${fadeInputFocused ? "|" : ""}`);
                    const pct = Phaser.Math.Clamp(fadeValue, 0, 10) / 10;
                    sliderThumb.x = sliderStartX + (pct * sliderW);
                };

                const setFadeFromPointerX = (x) => {
                    const clampedX = Phaser.Math.Clamp(x, sliderStartX, sliderStartX + sliderW);
                    const pct = (clampedX - sliderStartX) / sliderW;
                    setFadeTime(pct * 10);
                };

                const blurFadeInput = (commit = false) => {
                    if (!fadeInputFocused) return;
                    if (commit) setFadeTime(parseFloat(fadeInput || "0"));
                    fadeInputFocused = false;
                    this._editorTextInputFocused = false;
                    drawFadeInput();
                };

                const cancelFadeInput = () => {
                    if (!fadeInputFocused) return;
                    fadeInput = fadeInputBeforeFocus;
                    fadeInputFocused = false;
                    this._editorTextInputFocused = false;
                    drawFadeInput();
                };

                fadeInputHit.on("pointerdown", (pointer) => {
                    blurTargetInput(true);
                    fadeInput = formatFadeValue(getFadeTime());
                    fadeInputBeforeFocus = fadeInput;
                    fadeInputFocused = true;
                    this._editorTextInputFocused = true;
                    drawFadeInput();
                    stopInputEvent(pointer?.event);
                });

                sliderHit.on("pointerdown", (pointer) => {
                    blurTargetInput(true);
                    blurFadeInput(true);
                    setFadeFromPointerX(pointer.x - (screenWidth / 2));
                    stopInputEvent(pointer?.event);
                });
                sliderThumb.on("dragstart", () => { this._isDraggingSlider = true; });
                sliderThumb.on("drag", (pointer, dragX) => setFadeFromPointerX(dragX));
                sliderThumb.on("dragend", () => { this._isDraggingSlider = false; });

                const blurTargetInput = (commit = false) => {
                    if (!targetInputFocused) return;
                    if (commit) {
                        const parsed = parseInt(targetInput || "0", 10);
                        if (parsed > 0) setTargetChannel(parsed);
                    }
                    targetInputFocused = false;
                    this._editorTextInputFocused = false;
                    drawTargetInput();
                };

                const cancelTargetInput = () => {
                    if (!targetInputFocused) return;
                    targetInput = targetInputBeforeFocus;
                    targetInputFocused = false;
                    this._editorTextInputFocused = false;
                    drawTargetInput();
                };

                inputHit.on("pointerdown", (pointer) => {
                    blurFadeInput(true);
                    targetInput = String(getChannel());
                    targetInputBeforeFocus = targetInput;
                    targetInputFocused = true;
                    this._editorTextInputFocused = true;
                    drawTargetInput();
                    stopInputEvent(pointer?.event);
                });

                this._makeBouncyButton(leftArrow, arrowScale, () => {
                    blurTargetInput(true);
                    blurFadeInput(true);
                    const current = getChannel();
                    if (current >= 1000) {
                        setTargetChannel(1);
                    } else {
                        setTargetChannel(Math.max(1, current - 1));
                    }
                });

                this._makeBouncyButton(rightArrow, arrowScale, () => {
                    blurTargetInput(true);
                    blurFadeInput(true);
                    const current = getChannel();
                    if (current >= 1000) {
                        setTargetChannel(1);
                    } else {
                        setTargetChannel(current + 1);
                    }
                });

                this._makeBouncyButton(plusBtn, plusScale, () => {
                    blurTargetInput(true);
                    blurFadeInput(true);
                    this._openEditorColorTriggerChannelPopup(saveObj, () => {
                        targetInput = String(getChannel());
                        drawTargetInput();
                    });
                });

                if (this._editorTriggerTargetInputKeyHandler) {
                    window.removeEventListener("keydown", this._editorTriggerTargetInputKeyHandler);
                    this._editorTriggerTargetInputKeyHandler = null;
                }

                this._editorTriggerTargetInputKeyHandler = (event) => {
                    if (!this._editorColorPickerPopup || (!targetInputFocused && !fadeInputFocused)) return;

                    if (targetInputFocused) {
                        if (event.key === "Escape") {
                            cancelTargetInput();
                        } else if (event.key === "Enter") {
                            blurTargetInput(true);
                        } else if (event.key === "Backspace") {
                            targetInput = targetInput.slice(0, -1);
                            drawTargetInput();
                        } else if (/^[0-9]$/.test(event.key) && targetInput.length < 4) {
                            targetInput += event.key;
                            drawTargetInput();
                        } else if (event.key.length !== 1) {
                            return;
                        }
                    } else if (fadeInputFocused) {
                        if (event.key === "Escape") {
                            cancelFadeInput();
                        } else if (event.key === "Enter") {
                            blurFadeInput(true);
                        } else if (event.key === "Backspace") {
                            fadeInput = fadeInput.slice(0, -1);
                            drawFadeInput();
                        } else if ((/^[0-9]$/.test(event.key) || event.key === ".") && fadeInput.length < 5) {
                            if (event.key !== "." || !fadeInput.includes(".")) {
                                fadeInput += event.key;
                                drawFadeInput();
                            }
                        } else if (event.key.length !== 1) {
                            return;
                        }
                    }

                    stopInputEvent(event);
                };

                window.addEventListener("keydown", this._editorTriggerTargetInputKeyHandler);
                drawFadeInput();
                drawTargetInput();
            }
        }
    );
  }

  _closeEditorTriggerChannelPopup() {
    this._editorTextInputFocused = false;

    if (this._editorTriggerChannelKeyHandler) {
        window.removeEventListener("keydown", this._editorTriggerChannelKeyHandler);
        this._editorTriggerChannelKeyHandler = null;
    }

    if (!this._editorTriggerChannelPopup) return;

    this._editorTriggerChannelPopup.destroy();
    this._editorTriggerChannelPopup = null;
  }


  _openEditorColorTriggerChannelPopup(saveObj, onChanged = null) {
    this._closeEditorTriggerChannelPopup();

    const sw = screenWidth;
    const sh = screenHeight;
    const panelW = 720;
    const panelH = 400;
    const root = this.add.container(0, 0).setScrollFactor(0).setDepth(2850);
    this._editorTriggerChannelPopup = root;

    const blocker = this.add.rectangle(0, 0, sw, sh, 0x000000, 0.36).setOrigin(0).setInteractive();
    root.add(blocker);

    const inner = this.add.container(sw / 2, sh / 2 + 8);
    root.add(inner);

    const corner = this.textures.exists("GJ_square01") ? this.textures.get("GJ_square01").source[0].width * 0.325 : 24;
    inner.add(this._drawScale9(0, 0, panelW, panelH, "GJ_square01", corner, 0xffffff, 1));
    inner.add(this.add.bitmapText(0, -(panelH / 2) + 46, "goldFont", "Special Color Select", 34).setOrigin(0.5));

    const fixedChannels = [
        { label: "BG", id: 1000 },
        { label: "G1", id: 1001 },
        { label: "G2", id: 1009 },
        { label: "Line", id: 1002 },
        { label: "3DL", id: 1003 },
        { label: "Obj", id: 1004 },
        { label: "MG", id: 1013 }
    ];

    const refreshSelection = () => {
        const current = this._getEditorColorTriggerTargetChannel(saveObj);
        for (const entry of buttonEntries) {
            const selected = entry.id === current;
            const selectedTexture = this.textures.exists("GJ_button_02")
                ? "GJ_button_02"
                : (this.textures.exists("GJ_button02") ? "GJ_button02" : entry.bg.texture.key);
            const deselectedTexture = this.textures.exists("GJ_button_04")
                ? "GJ_button_04"
                : (this.textures.exists("GJ_button04") ? "GJ_button04" : entry.bg.texture.key);
            const textureKey = selected ? selectedTexture : deselectedTexture;
            if (entry.bg.setTexture) entry.bg.setTexture(textureKey);
            entry.bg.clearTint?.();
            entry.text.clearTint?.();
        }
    };

    const chooseChannel = (id) => {
        this._setEditorColorTriggerTargetChannel(saveObj, id);
        refreshSelection();
        onChanged?.(id);
    };

    const makeChannelButton = (entry, x, y) => {
        const rootBtn = this.add.container(x, y);
        const buttonTexture = this.textures.exists("GJ_button_04")
            ? "GJ_button_04"
            : (this.textures.exists("GJ_button04") ? "GJ_button04" : "GJ_button01");
        const btnBorder = this.textures.exists(buttonTexture) ? this.textures.get(buttonTexture).source[0].width * 0.3 : 20;
        const bg = this.add.nineslice(0, 0, buttonTexture, null, 116, 62, btnBorder, btnBorder, btnBorder, btnBorder)
            .setOrigin(0.5)
            .setInteractive();
        const text = this.add.bitmapText(-2, -2, "bigFont", entry.label, 28).setOrigin(0.5);
        rootBtn.add([bg, text]);
        inner.add(rootBtn);
        this._makeCompositeBouncyButton(bg, rootBtn, 1, () => chooseChannel(entry.id));
        return { ...entry, root: rootBtn, bg, text };
    };

    const buttonEntries = fixedChannels.map((entry, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        return makeChannelButton(entry, -240 + col * 160, -38 + row * 82);
    });

    this._makeEditorOkButton(inner, 0, (panelH / 2) - 48, "OK", () => this._closeEditorTriggerChannelPopup());

    this._editorTriggerChannelKeyHandler = (event) => {
        if (!this._editorTriggerChannelPopup || event.key !== "Escape") return;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation?.();
        this._closeEditorTriggerChannelPopup();
    };
    window.addEventListener("keydown", this._editorTriggerChannelKeyHandler);

    refreshSelection();
  }

  _openEditorStartPositionOptionsPopup(saveObj) {
    if (!saveObj) return;
    this._closeEditorObjectOptionsPopup();

    const sw = screenWidth;
    const sh = screenHeight;
    const panelW = 720;
    const panelH = 320;
    const root = this.add.container(0, 0).setScrollFactor(0).setDepth(2550);
    this._editorObjectOptionsPopup = root;

    const blocker = this.add.rectangle(0, 0, sw, sh, 0x000000, 0.45).setOrigin(0).setInteractive();
    root.add(blocker);

    const inner = this.add.container(sw / 2, sh / 2 + 10);
    root.add(inner);

    const corner = this.textures.exists("GJ_square01") ? this.textures.get("GJ_square01").source[0].width * 0.325 : 24;
    inner.add(this._drawScale9(0, 0, panelW, panelH, "GJ_square01", corner, 0xffffff, 1));

    const settingsBtn = this.add.image(-(panelW / 2) + 58, -(panelH / 2) + 58, "GJ_GameSheet03", "GJ_optionsBtn_001.png")
        .setScale(0.64)
        .setInteractive();
    inner.add(settingsBtn);
    this._makeBouncyButton(settingsBtn, 0.64, () => this._openEditorStartPositionSettingsPopup(saveObj));

    const speedDefs = [
        { key: 1, label: "0.5x", objectId: 200 },
        { key: 0, label: "1x", objectId: 201 },
        { key: 2, label: "2x", objectId: 202 },
        { key: 3, label: "3x", objectId: 203 },
        { key: 4, label: "4x", objectId: 1334 }
    ];

    const modeDefs = [
        { key: 0, label: "Cube", frame: "gj_iconBtn_off_001.png", rotateFlip: false },
        { key: 1, label: "Ship", frame: "gj_shipBtn_off_001.png", rotateFlip: false },
        { key: 2, label: "Ball", frame: "gj_ballBtn_off_001.png", rotateFlip: false },
        { key: 3, label: "UFO", frame: "gj_birdBtn_off_001.png", rotateFlip: false },
        { key: 4, label: "Wave", frame: "gj_dartBtn_off_001.png", rotateFlip: false },
        { key: 5, label: "Robot", frame: "gj_robotBtn_off_001.png", rotateFlip: false },
        { key: 6, label: "Spider", frame: "gj_spiderBtn_off_001.png", rotateFlip: false },
        { key: 7, label: "Swing", frame: "gj_swingBtn_off_001.png", rotateFlip: false }
    ];

    const leftX = -165;
    const rightX = 165;

    inner.add(this.add.bitmapText(leftX, -74, "goldFont", "Speed:", 34).setOrigin(0.5));
    inner.add(this.add.bitmapText(rightX, -74, "goldFont", "Mode:", 34).setOrigin(0.5));

    let speedButtonObj = null;
    let modeButtonObj = null;

    const refreshSpeed = () => {
        if (speedButtonObj) speedButtonObj.root?.destroy();
        const speedKey = this._getEditorStartPositionValue(saveObj, "kA4", 0);
        const speedDef = speedDefs.find(s => s.key === speedKey) || speedDefs[1];
        const speedIndex = Math.max(0, speedDefs.findIndex(s => s.key === speedDef.key));
        speedButtonObj = this._makeCurrentSpeedPreview(inner, leftX, 20, speedDef.objectId, () => {
            this._openEditorHorizontalOptionPopup(
                "Select Speed",
                speedDefs,
                this._getEditorStartPositionValue(saveObj, "kA4", 0),
                (opt) => {
                    this._setEditorStartPositionValue(saveObj, "kA4", opt.key);
                    refreshSpeed();
                },
                (parent, opt, ox, oy, choose, optionIndex = 0) => this._makeCurrentSpeedPreview(parent, ox, oy, opt.objectId, choose, 89.6, optionIndex === 0 ? 1.05 : 1.2)
            );
        }, 67, speedIndex === 0 ? 1.05 : 1.2);
    };

    const refreshMode = () => {
        if (modeButtonObj) modeButtonObj.root?.destroy();
        const modeKey = this._getEditorStartPositionValue(saveObj, "kA2", 0);
        const modeDef = modeDefs.find(m => m.key === modeKey) || modeDefs[0];
        modeButtonObj = this._makeGamemodeIconButton(inner, rightX, 20, modeDef, () => {
            this._openEditorHorizontalOptionPopup(
                "Select Mode",
                modeDefs,
                this._getEditorStartPositionValue(saveObj, "kA2", 0),
                (opt) => {
                    this._setEditorStartPositionValue(saveObj, "kA2", opt.key);
                    refreshMode();
                },
                (parent, opt, ox, oy, choose) => this._makeGamemodeIconButton(parent, ox, oy, opt, choose)
            );
        });
    };

    refreshSpeed();
    refreshMode();

    this._makeEditorOkButton(inner, 0, (panelH / 2) - 48, "OK", () => this._closeEditorObjectOptionsPopup());
  }


  _openEditorStartPositionSettingsPopup(saveObj) {
    if (!saveObj) return;

    if (this._editorStartPositionSettingsPopup) {
        this._editorStartPositionSettingsPopup.destroy();
        this._editorStartPositionSettingsPopup = null;
    }

    const sw = screenWidth;
    const sh = screenHeight;
    const panelW = 520;
    const panelH = 420;
    const root = this.add.container(0, 0).setScrollFactor(0).setDepth(2850);
    this._editorStartPositionSettingsPopup = root;

    const blocker = this.add.rectangle(0, 0, sw, sh, 0x000000, 0.25).setOrigin(0).setInteractive();
    root.add(blocker);

    const inner = this.add.container(sw / 2, sh / 2 + 15).setScale(1);
    root.add(inner);

    const corner = this.textures.exists("GJ_square01") ? this.textures.get("GJ_square01").source[0].width * 0.325 : 24;
    inner.add(this._drawScale9(0, 0, panelW, panelH, "GJ_square01", corner, 0xffffff, 1));

    const closeBtn = this.add.image(
        -(panelW / 2) + 10,
        -(panelH / 2) + 10,
        "GJ_WebSheet",
        "GJ_closeBtn_001.png"
    ).setScale(0.8).setInteractive();
    inner.add(closeBtn);
    this._makeBouncyButton(closeBtn, 0.8, () => {
        if (this._editorStartPositionSettingsPopup) {
            this._editorStartPositionSettingsPopup.destroy();
            this._editorStartPositionSettingsPopup = null;
        }
    });

    const optionDefs = [
        { label: "Mini Mode", key: "kA3" },
        { label: "Flip Gravity", key: "kA11" },
        { label: "Dual Mode", key: "kA8" },
        { label: "Mirror Mode", key: "kA28" }
    ];

    const makeToggle = (label, key, y) => {
        const row = this.add.container(-150, y);
        const check = this.add.image(0, 0, "GJ_GameSheet03", "GJ_checkOff_001.png").setScale(0.9).setInteractive();
        const text = this.add.bitmapText(48, -2, "bigFont", label, 28).setOrigin(0, 0.5).setInteractive();
        row.add([check, text]);
        inner.add(row);

        const refresh = () => {
            const checked = this._getEditorStartPositionValue(saveObj, key, 0) === 1;
            check.setTexture("GJ_GameSheet03", checked ? "GJ_checkOn_001.png" : "GJ_checkOff_001.png");
        };

        const toggle = () => {
            const checked = this._getEditorStartPositionValue(saveObj, key, 0) === 1;
            this._setEditorStartPositionValue(saveObj, key, checked ? 0 : 1);
            refresh();
        };

        this._makeBouncyButton(check, 0.9, toggle);
        text.on("pointerdown", toggle);
        refresh();
        return row;
    };

    optionDefs.forEach((opt, i) => makeToggle(opt.label, opt.key, -130 + i * 80));
  }

  _openEditorTextObjectOptionsPopup(saveObj) {
    this._closeEditorObjectOptionsPopup();

    const sw = screenWidth;
    const sh = screenHeight;
    const panelW = 720;
    const panelH = 330;
    const root = this.add.container(0, 0).setScrollFactor(0).setDepth(2550);
    this._editorObjectOptionsPopup = root;

    const blocker = this.add.rectangle(0, 0, sw, sh, 0x000000, 0.45).setOrigin(0).setInteractive();
    root.add(blocker);

    const inner = this.add.container(sw / 2, sh / 2 + 10);
    root.add(inner);

    const corner = this.textures.exists("GJ_square01") ? this.textures.get("GJ_square01").source[0].width * 0.325 : 24;
    inner.add(this._drawScale9(0, 0, panelW, panelH, "GJ_square01", corner, 0xffffff, 1));
    inner.add(this.add.bitmapText(0, -(panelH / 2) + 46, "goldFont", "Edit Text", 42).setOrigin(0.5));

    const inputBg = this.add.graphics();
    inputBg.fillStyle(0x000000, 0.38);
    inputBg.fillRoundedRect(-270, -47, 540, 70, 15);
    inner.add(inputBg);

    const inputHit = this.add.zone(0, -12, 540, 70).setInteractive();
    inner.add(inputHit);

    let textValue = this._getEditorTextObjectText(saveObj);
    let focused = true;
    const textLabel = this.add.bitmapText(0, -12, "bigFont", "", 45).setOrigin(0.5).setCenterAlign();
    inner.add(textLabel);

    const render = () => {
        const shownText = (textValue || "") + (focused ? "|" : "");
        textLabel.setText(shownText || (focused ? "|" : ""));
    };

    const commit = () => {
        this._setEditorTextObjectText(saveObj, textValue);
    };

    const focusInput = (pointer, localX, localY, event) => {
        if (event?.stopPropagation) event.stopPropagation();
        focused = true;
        this._editorTextInputFocused = true;
        render();
    };

    inputHit.on("pointerdown", focusInput);
    textLabel.setInteractive(new Phaser.Geom.Rectangle(-270, -35, 540, 70), Phaser.Geom.Rectangle.Contains);
    textLabel.on("pointerdown", focusInput);

    this._editorTextInputFocused = true;
    this._editorObjectOptionsKeyHandler = (event) => {
        if (!this._editorObjectOptionsPopup || !focused) return;
        if (event.ctrlKey || event.metaKey || event.altKey) return;

        if (event.key === "Escape") {
            event.preventDefault();
            this._closeEditorObjectOptionsPopup();
            return;
        }

        if (event.key === "Enter") {
            event.preventDefault();
            commit();
            this._closeEditorObjectOptionsPopup();
            return;
        }

        if (event.key === "Backspace") {
            event.preventDefault();
            textValue = textValue.slice(0, -1);
            commit();
            render();
            return;
        }

        if (event.key && event.key.length === 1 && textValue.length < 80) {
            event.preventDefault();
            textValue += event.key;
            commit();
            render();
        }
    };
    window.addEventListener("keydown", this._editorObjectOptionsKeyHandler);

    render();
    this._makeEditorOkButton(inner, 0, (panelH / 2) - 48, "OK", () => {
        commit();
        this._closeEditorObjectOptionsPopup();
    });
  }


  _openEditorComingSoonTriggerPopup(saveObj) {
    this._closeEditorObjectOptionsPopup();

    const sw = screenWidth;
    const sh = screenHeight;
    const panelW = 680;
    const panelH = 300;
    const root = this.add.container(0, 0).setScrollFactor(0).setDepth(2550);
    this._editorObjectOptionsPopup = root;

    root.add(this.add.rectangle(0, 0, sw, sh, 0x000000, 0.45).setOrigin(0).setInteractive());
    const inner = this.add.container(sw / 2, sh / 2 + 10);
    root.add(inner);
    const corner = this.textures.exists("GJ_square01") ? this.textures.get("GJ_square01").source[0].width * 0.325 : 24;
    inner.add(this._drawScale9(0, 0, panelW, panelH, "GJ_square01", corner, 0xffffff, 1));
    inner.add(this.add.bitmapText(0, -35, "bigFont", "Coming soon!\n- Lasokar", 34).setOrigin(0.5).setCenterAlign());
    this._makeEditorOkButton(inner, 0, (panelH / 2) - 48, "OK", () => this._closeEditorObjectOptionsPopup());
  }

  _openEditorLevelSettingsPopup() {
    if (this._editorLevelSettingsPopup) return;

    const sw = screenWidth;
    const sh = screenHeight;
    const centerX = sw / 2;
    const centerY = sh / 2;
    const panelW = 1000;
    const panelH = 600;

    this._editorLevelSettingsPopup = this.add.container(0, 0).setScrollFactor(0).setDepth(2300);
    const dim = this.add.rectangle(0, 0, sw, sh, 0x000000, 0.55).setOrigin(0).setInteractive();
    this._editorLevelSettingsPopup.add(dim);
    const inner = this.add.container(centerX, centerY).setScale(1);
    this._editorLevelSettingsPopup.add(inner);

    const corner = this.textures.exists("GJ_square01") ? this.textures.get("GJ_square01").source[0].width * 0.325 : 24;
    const panel = this._drawScale9(0, 0, panelW, panelH, "GJ_square01", corner, 0xffffff, 1);
    inner.add(panel);

    const title = this.add.bitmapText(0, -(panelH / 2) + 42, "goldFont", "Select Color", 40).setOrigin(0.5);
    inner.add(title);

    const colorToHex = (color) => {
        return Phaser.Display.Color.GetColor(color.r, color.g, color.b);
    };

   const makeColorTarget = (label, channelId, x, y) => {
        const container = this.add.container(x, y);
        const buttonW = 50;
        const buttonH = 50;
        const radius = 8;

        const labelText = this.add.bitmapText(0, -45, "bigFont", label, 24).setOrigin(0.5);

        const buttonVisual = this.add.container(0, 0);
        buttonVisual._bouncyBaseScale = 1;

        const shadow = this.add.graphics();
        const swatch = this.add.graphics();

        buttonVisual.add([shadow, swatch]);

        const hitZone = this.add.zone(0, 0, buttonW, buttonH)
            .setOrigin(0.5)
            .setInteractive();

        container.add([labelText, buttonVisual, hitZone]);
        inner.add(container);

        const getBouncyBaseScale = () => (
            buttonVisual._bouncyBaseScale !== undefined ? buttonVisual._bouncyBaseScale : 1
        );

        hitZone.on("pointerdown", () => {
            const baseScale = getBouncyBaseScale();

            buttonVisual._pressed = true;
            this.tweens.killTweensOf(buttonVisual);

            this.tweens.add({
                targets: buttonVisual,
                scale: baseScale * 1.26,
                duration: 300,
                ease: "Bounce.Out"
            });
        });

        hitZone.on("pointerout", () => {
            if (buttonVisual._pressed) {
                buttonVisual._pressed = false;
                this.tweens.killTweensOf(buttonVisual);

                this.tweens.add({
                    targets: buttonVisual,
                    scale: getBouncyBaseScale(),
                    duration: 400,
                    ease: "Bounce.Out"
                });
            }
        });

        hitZone.on("pointerup", () => {
            if (buttonVisual._pressed) {
                buttonVisual._pressed = false;
                this.tweens.killTweensOf(buttonVisual);
                buttonVisual.setScale(getBouncyBaseScale());

                this._openEditorColorPickerPopup(
                    channelId,
                    "Select Color",
                    refresh
                );
            }
        });

        hitZone.on("pointerupoutside", () => {
            if (buttonVisual._pressed) {
                buttonVisual._pressed = false;
                this.tweens.killTweensOf(buttonVisual);

                this.tweens.add({
                    targets: buttonVisual,
                    scale: getBouncyBaseScale(),
                    duration: 400,
                    ease: "Bounce.Out"
                });
            }
        });

        const drawSwatch = (color) => {
            const hex = colorToHex(color);

            shadow.clear();
            shadow.fillStyle(0x000000, 0.35);
            shadow.fillRoundedRect(
                -(buttonW / 2) + 4,
                -(buttonH / 2) + 5,
                buttonW,
                buttonH,
                radius
            );

            swatch.clear();
            swatch.fillStyle(hex, 1);
            swatch.fillRoundedRect(
                -(buttonW / 2),
                -(buttonH / 2),
                buttonW,
                buttonH,
                radius
            );

            swatch.lineStyle(2, 0x000000, 1);
            swatch.strokeRoundedRect(
                -(buttonW / 2),
                -(buttonH / 2),
                buttonW,
                buttonH,
                radius
            );
        };

        const refresh = () => {
            const color = this._getEditorColorChannel(channelId);
            drawSwatch(color);
        };

        refresh();
    };

    makeColorTarget("BG:", 1000, -280, -170);
    makeColorTarget("G1:", 1001, -200, -170);
    makeColorTarget("G2:", 1009, -120, -170);
    makeColorTarget("Line:", 1002, -40, -170);
    makeColorTarget("3DL:", 1003, 40, -170);
    makeColorTarget("Obj:", 1004, 120, -170);
    makeColorTarget("MG:", 1013, 200, -170);
    makeColorTarget("MG2:", 1014, 280, -170);

    const speedDefs = [
        { key: 1, label: "0.5x", objectId: 200 },
        { key: 0, label: "1x", objectId: 201 },
        { key: 2, label: "2x", objectId: 202 },
        { key: 3, label: "3x", objectId: 203 },
        { key: 4, label: "4x", objectId: 1334 }
    ];

    const modeDefs = [
        { key: 0, label: "Cube", frame: "gj_iconBtn_off_001.png", rotateFlip: false },
        { key: 1, label: "Ship", frame: "gj_shipBtn_off_001.png", rotateFlip: false },
        { key: 2, label: "Ball", frame: "gj_ballBtn_off_001.png", rotateFlip: false },
        { key: 3, label: "UFO", frame: "gj_birdBtn_off_001.png", rotateFlip: false },
        { key: 4, label: "Wave", frame: "gj_dartBtn_off_001.png", rotateFlip: false },
        { key: 5, label: "Robot", frame: "gj_robotBtn_off_001.png", rotateFlip: false },
        { key: 6, label: "Spider", frame: "gj_spiderBtn_off_001.png", rotateFlip: false },
        { key: 7, label: "Swing", frame: "gj_swingBtn_off_001.png", rotateFlip: false }
    ];

    const makeArtDefs = (prefix, count) => {
        const defs = [];

        for (let i = 1; i <= count; i++) {
            defs.push({
                key: i,
                label: String(i),
                frame: `${prefix}Icon_${String(i).padStart(2, "0")}_001.png`
            });
        }

        return defs;
    };

    const bgArtDefs = makeArtDefs("bg", 59);
    const groundArtDefs = makeArtDefs("g", 22);

    const leftX = -(panelW / 2) + 90;

    const startSpeedLabel = this.add.bitmapText(leftX, -262, "goldFont", "Speed:", 30).setOrigin(0.5);
    inner.add(startSpeedLabel);

    let speedButtonObj = null;

    const refreshSpeedButton = () => {
        if (speedButtonObj) {
            speedButtonObj.root?.destroy();
            speedButtonObj = null;
        }

        const speedKey = this._getEditorStartValue("kA4", 0);
        const speedDef = speedDefs.find(s => s.key === speedKey) || speedDefs[0];
        const speedIndex = Math.max(0, speedDefs.findIndex(s => s.key === speedDef.key));

        speedButtonObj = this._makeCurrentSpeedPreview(
            inner,
            leftX + 5,
            -190,
            speedDef.objectId,
            () => {
                this._openEditorHorizontalOptionPopup(
                    "Select Speed",
                    speedDefs,
                    this._getEditorStartValue("kA4", 0),
                    (opt) => {
                        this._setEditorStartValueDraft("kA4", opt.key);
                        refreshSpeedButton();
                    },
                    (parent, opt, ox, oy, choose, optionIndex = 0) => {
                        return this._makeCurrentSpeedPreview(
                            parent,
                            ox,
                            oy,
                            opt.objectId,
                            choose,
                            89.6,
                            optionIndex === 0 ? 1.05 : 1.2
                        );
                    }
                );
            },
            60.8,
            speedIndex === 0 ? 1.05 : 1.2
        );
    };

    refreshSpeedButton();

    const modeLabel = this.add.bitmapText(leftX, -105, "goldFont", "Mode:", 30).setOrigin(0.5);
    inner.add(modeLabel);

    let modeButtonObj = null;

    const refreshModeButton = () => {
        if (modeButtonObj) {
            modeButtonObj.root?.destroy();
            modeButtonObj = null;
        }

        const modeKey = this._getEditorStartValue("kA2", 0);
        const modeDef = modeDefs.find(m => m.key === modeKey) || modeDefs[0];

        modeButtonObj = this._makeGamemodeIconButton(inner, leftX, -40, modeDef, () => {
            this._openEditorHorizontalOptionPopup(
                "Select Mode",
                modeDefs,
                this._getEditorStartValue("kA2", 0),
                (opt) => {
                    this._setEditorStartValueDraft("kA2", opt.key);
                    refreshModeButton();
                },
                (parent, opt, ox, oy, choose) => {
                    return this._makeGamemodeIconButton(parent, ox, oy, opt, choose);
                }
            );
        });
    };

    refreshModeButton();

    const editorOptionsLabel = this.add.bitmapText(leftX, 45, "goldFont", "Options:", 30).setOrigin(0.5);
    inner.add(editorOptionsLabel);

    const editorOptionsBtn = this.add.image(leftX, 112, "GJ_GameSheet03", "GJ_optionsBtn_001.png").setScale(0.7).setInteractive();

    inner.add(editorOptionsBtn);

    this._makeBouncyButton(editorOptionsBtn, 0.7, () => {
        this._openEditorStartOptionsPopup();
    });

    const rightX = (panelW / 2) - 90;

    const bgArtLabel = this.add.bitmapText(rightX, -262, "goldFont", "BG:", 30).setOrigin(0.5);
    inner.add(bgArtLabel);

    let bgArtButtonObj = null;

    const refreshBgArtButton = () => {
        if (bgArtButtonObj) {
            bgArtButtonObj.root?.destroy();
            bgArtButtonObj = null;
        }

        const bgKey = Phaser.Math.Clamp(this._getEditorArtValue("kA6", 1), 1, bgArtDefs.length);
        const bgDef = bgArtDefs.find(bg => bg.key === bgKey) || bgArtDefs[0];

        bgArtButtonObj = this._makeEditorAtlasIconButton(inner, rightX, -190, bgDef, () => {
            this._openEditorHorizontalOptionPopup(
                "Select Background",
                bgArtDefs,
                this._getEditorArtValue("kA6", 1),
                (opt) => {
                    this._setEditorArtValueDraft("kA6", opt.key);
                    refreshBgArtButton();
                },
                (parent, opt, ox, oy, choose) => {
                    return this._makeEditorAtlasIconButton(parent, ox, oy, opt, choose, 48);
                }
            );
        }, 90);
    };

    refreshBgArtButton();

    const groundArtLabel = this.add.bitmapText(rightX, -112, "goldFont", "G:", 30).setOrigin(0.5);
    inner.add(groundArtLabel);

    let groundArtButtonObj = null;

    const refreshGroundArtButton = () => {
        if (groundArtButtonObj) {
            groundArtButtonObj.root?.destroy();
            groundArtButtonObj = null;
        }

        const groundKey = Phaser.Math.Clamp(this._getEditorArtValue("kA7", 1), 1, groundArtDefs.length);
        const groundDef = groundArtDefs.find(g => g.key === groundKey) || groundArtDefs[0];

        groundArtButtonObj = this._makeEditorAtlasIconButton(inner, rightX, -40, groundDef, () => {
            this._openEditorHorizontalOptionPopup(
                "Select Ground",
                groundArtDefs,
                this._getEditorArtValue("kA7", 1),
                (opt) => {
                    this._setEditorArtValueDraft("kA7", opt.key);
                    refreshGroundArtButton();
                },
                (parent, opt, ox, oy, choose) => {
                    return this._makeEditorAtlasIconButton(parent, ox, oy, opt, choose, 48);
                }
            );
        }, 90);
    };

    refreshGroundArtButton();

    const songBgX = -315;
    const songBgY = 40;
    const songBgW = 630;
    const songBgH = 175;

    const songTabY = songBgY - 25;
    const songTabW = 110;
    const songTextY = songBgY + (songBgH / 2);

    const songTitle = this.add.bitmapText(0, songTabY - 2, "goldFont", "Select Song:", 40).setOrigin(1, 0.5);
    inner.add(songTitle);

    const songGroupW = songTitle.width + 42 + songTabW + 13 + songTabW;
    const songGroupLeft = -(songGroupW / 2);

    const songTitleX = songGroupLeft + songTitle.width;
    const normalTabX = songTitleX + 42 + (songTabW / 2);
    const customTabX = normalTabX + songTabW + 13;

    songTitle.setPosition(songTitleX, songTabY - 2);

    let songCategory = "normal";

    const {
        level: currentLevel
    } = this._getCurrentEditorLevelRecord();

    if ((this._editorPendingSongId ?? currentLevel?.songId ?? -1) > 0) {
        songCategory = "custom";
    }

    let normalIndex = 0;
    const activeSongId = this._editorPendingSongId ?? currentLevel?.songId ?? -1;

    if (activeSongId < 0) {
        normalIndex = Math.max(0, Math.abs(activeSongId) - 1);
    }

    let customInput = activeSongId > 0 ? String(activeSongId) : "";
    let customFocused = false;

    const makeSongTabButton = (x, label, callback) => {
        const tabRoot = this.add.container(x, songTabY);
        const tabBg = this.add.nineslice(0, 0, "GJ_button01", null, songTabW, 40, 18, 18, 18, 18).setInteractive();
        const tabText = this.add.bitmapText(-3, -3, "bigFont", label, 22).setOrigin(0.5);

        tabRoot.add([tabBg, tabText]);
        inner.add(tabRoot);

        this._makeCompositeBouncyButton(tabBg, tabRoot, 1, callback);

        return {
            root: tabRoot,
            bg: tabBg,
            text: tabText
        };
    };

    const normalTab = makeSongTabButton(normalTabX, "Normal", () => {
        const wasCustomSongTab = songCategory === "custom";

        songCategory = "normal";
        customFocused = false;
        this._editorTextInputFocused = false;

        if (wasCustomSongTab) {
            normalIndex = 0;
            commitNormalSongDraft();
        }

        updateSongUi();
    });

    const customTab = makeSongTabButton(customTabX, "Custom", () => {
        songCategory = "custom";
        customFocused = false;
        this._editorTextInputFocused = false;
        updateSongUi();
    });

    const songAreaBg = this.add.graphics();
    songAreaBg.fillStyle(0x000000, 0.28);
    songAreaBg.fillRoundedRect(songBgX, songBgY, songBgW, songBgH, 25);
    inner.add(songAreaBg);

    const customSongInputW = 335;
    const customSongInputH = 62;
    const customSongInputRadius = 12;
    const customSongInputBg = this.add.graphics();
    inner.add(customSongInputBg);

    const songText = this.add.bitmapText(0, songTextY, "bigFont", "", 50).setOrigin(0.5);
    inner.add(songText);

    const customSongInputHit = this.add.zone(0, songTextY, customSongInputW, customSongInputH)
        .setOrigin(0.5)
        .setInteractive();
    inner.add(customSongInputHit);

    const prevSong = this.add.image(-250, songTextY + 2, "GJ_GameSheet03", "edit_leftBtn_001.png").setScale(1.2).setFlipX(false).setInteractive();
    const nextSong = this.add.image(250, songTextY + 2, "GJ_GameSheet03", "edit_leftBtn_001.png").setScale(1.2).setFlipX(true).setInteractive();

    inner.add([prevSong, nextSong]);

    let customInputBeforeFocus = customInput;

    const stopInputEvent = (event) => {
        event?.preventDefault?.();
        event?.stopPropagation?.();
        event?.stopImmediatePropagation?.();
    };

    const blurCustomSongInput = (commit = false) => {
        if (!customFocused) return;

        customFocused = false;
        this._editorTextInputFocused = false;

        if (commit) {
            commitCustomSongDraft();
        }

        updateSongUi();
    };

    const cancelCustomSongInput = () => {
        if (!customFocused) return;

        customInput = customInputBeforeFocus;
        customFocused = false;
        this._editorTextInputFocused = false;
        updateSongUi();
    };

    const focusCustomSongInput = (pointer = null) => {
        if (songCategory !== "custom") return;

        customInputBeforeFocus = customInput;
        customFocused = true;
        this._editorTextInputFocused = true;
        updateSongUi();
        stopInputEvent(pointer?.event);
    };

    const fitSongTextToArrows = () => {
        const maxFontSize = songCategory === "custom"
            ? ((!customFocused && !customInput) ? 30 : 42)
            : 50;
        const minFontSize = 8;
        const padding = 18;
        let maxTextW = customSongInputW - 34;

        if (songCategory !== "custom") {
            const prevW = prevSong.displayWidth || prevSong.width || 0;
            const nextW = nextSong.displayWidth || nextSong.width || 0;

            const leftLimit = prevSong.x + (prevW / 2) + padding;
            const rightLimit = nextSong.x - (nextW / 2) - padding;
            maxTextW = Math.max(40, rightLimit - leftLimit);
        }

        songText.setScale(1);

        for (let size = maxFontSize; size >= minFontSize; size -= 2) {
            songText.setFontSize(size);

            if (songText.width <= maxTextW) {
                return;
            }
        }

        if (songText.width > maxTextW && songText.width > 0) {
            songText.setScale(maxTextW / songText.width);
        }
    };

    const setSongText = (value) => {
        songText.setText(value);
        fitSongTextToArrows();
    };

    const drawCustomSongInput = () => {
        customSongInputBg.clear();

        if (songCategory !== "custom") {
            customSongInputHit.setVisible(false);
            customSongInputHit.disableInteractive();
            return;
        }

        customSongInputHit.setVisible(true);
        customSongInputHit.setInteractive();

        customSongInputBg.fillStyle(0x000000, 0.42);
        customSongInputBg.fillRoundedRect(
            -(customSongInputW / 2),
            songTextY - (customSongInputH / 2),
            customSongInputW,
            customSongInputH,
            customSongInputRadius
        );
    };

    const updateSongUi = () => {
        const setTabVisual = (tab, selected) => {
            const selectedTexture = this.textures.exists("GJ_button01") ? "GJ_button01" : tab.bg.texture.key;
            const deselectedTexture = this.textures.exists("GJ_button04") ? "GJ_button04" : selectedTexture;

            tab.bg.setTexture(selected ? selectedTexture : deselectedTexture);
            tab.bg.clearTint();
            tab.text.clearTint();
        };

        setTabVisual(normalTab, songCategory === "normal");
        setTabVisual(customTab, songCategory === "custom");

        prevSong.setVisible(songCategory === "normal");
        nextSong.setVisible(songCategory === "normal");
        drawCustomSongInput();

        if (songCategory === "normal") {
            songText.setAlpha(1);
            songText.clearTint();

            const songs = window.allLevels || [];

            if (!songs.length) {
                setSongText("No normal songs loaded");
                return;
            }

            normalIndex = Phaser.Math.Wrap(normalIndex, 0, songs.length);

            const song = songs[normalIndex];
            const title = song?.[1] || `Song ${normalIndex + 1}`;

            setSongText(`${String(normalIndex + 1).padStart(2, "0")}: ${title}`);
        } else {
            const customPlaceholderVisible = !customFocused && !customInput;

            songText.setAlpha(1);
            if (customPlaceholderVisible) {
                songText.setTint(0x75aaf0);
            } else {
                songText.clearTint();
            }
            setSongText(
                customFocused
                    ? `${customInput}|`
                    : customInput
                        ? customInput
                        : "Newgrounds Song ID"
            );
        }
    };

    const commitNormalSongDraft = () => {
        const songs = window.allLevels || [];
        if (!songs.length) return;

        normalIndex = Phaser.Math.Wrap(normalIndex, 0, songs.length);

        const song = songs[normalIndex];
        const title = song?.[1] || `Song ${normalIndex + 1}`;

        this._setEditorSongDraft(-(normalIndex + 1), title);
    };

    const commitCustomSongDraft = () => {
        const id = parseInt(customInput || "0", 10);

        if (!id || id <= 0) return;

        this._setEditorSongDraft(id, `NG#${id}`);
    };

    this._makeBouncyButton(prevSong, 1.2, () => {
        const songs = window.allLevels || [];
        if (!songs.length) return;

        normalIndex = Phaser.Math.Wrap(normalIndex - 1, 0, songs.length);
        commitNormalSongDraft();
        updateSongUi();
    });

    this._makeBouncyButton(nextSong, 1.2, () => {
        const songs = window.allLevels || [];
        if (!songs.length) return;

        normalIndex = Phaser.Math.Wrap(normalIndex + 1, 0, songs.length);
        commitNormalSongDraft();
        updateSongUi();
    });

    customSongInputHit.on("pointerdown", (pointer) => {
        focusCustomSongInput(pointer);
    });

    dim.on("pointerdown", () => {
        blurCustomSongInput(false);
    });

    this._editorLevelSettingsKeyHandler = (event) => {
        if (!this._editorLevelSettingsPopup) return;
        if (songCategory !== "custom" || !customFocused) return;

        if (event.key === "Escape") {
            cancelCustomSongInput();
            stopInputEvent(event);
            return;
        }

        if (event.key === "Enter") {
            blurCustomSongInput(true);
            stopInputEvent(event);
            return;
        }

        if (event.key === "Backspace") {
            customInput = customInput.slice(0, -1);
            updateSongUi();
            stopInputEvent(event);
            return;
        }

        if (/^[0-9]$/.test(event.key) && customInput.length < 12) {
            customInput += event.key;
            updateSongUi();
            stopInputEvent(event);
            return;
        }

        if (event.key.length === 1 || ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(event.key)) {
            stopInputEvent(event);
        }
    };

    window.addEventListener("keydown", this._editorLevelSettingsKeyHandler);

    updateSongUi();

    this._makeEditorOkButton(inner, 0, (panelH / 2) - 45, "OK", () => {
        if (songCategory === "custom") {
            commitCustomSongDraft();
        }

        this._closeEditorLevelSettingsPopup();
    });
  }


  _initEditorPauseMenu() {
    this._editorMenuContainer = this.add.container(0, 0).setDepth(2000).setVisible(false);

    const bgDim = this.add.rectangle(0, 0, screenWidth, screenHeight, 0x000000, 0.6)
        .setOrigin(0)
        .setInteractive();
    this._editorMenuContainer.add(bgDim);

    const returnToLevelView = async (showLoading = false) => {
        this._showEditorPauseMenu(false);
        this._stopEditorPlaytest?.();

        const levelId = window.currentlevel?.[2] || window._onlineLevelId;
        if (levelId) {
            window._editorReturnToLevelViewId = levelId;
        }

        if (showLoading) {
            await this._showLoadingBuffer("Loading...");
        }

        window.isEditor = false;
        this.game.registry.remove("autoStartGame");
        this.scene.restart();
    };

    const buttonData = [
        { text: "Resume", cb: () => this._showEditorPauseMenu(false) },
        { 
            text: "Save and Play", 
            cb: async () => { 
                this._showEditorPauseMenu(false);
                this._stopEditorPlaytest?.();
                this._saveEditorLevel();
                const savedRecord = this._getCurrentEditorLevelRecord?.().level || null;
                window._createdLevelReturnToView = {
                    createdId: savedRecord?.createdId ?? window.currentlevel?.[2] ?? window._onlineLevelId,
                    snapshot: savedRecord ? { ...savedRecord } : null
                };
                await this._showLoadingBuffer("Loading...");
                window._editorReturnToLevelViewId = null;
                window.isEditor = false; 
                this.game.registry.set("autoStartGame", true); 
                this.scene.restart(); 
            } 
        },
        { 
            text: "Save and Exit", 
            cb: async () => { 
                this._saveEditorLevel();
                await returnToLevelView(true);
            } 
        },
        { text: "Save", cb: () => this._saveEditorLevel() },
        { text: "Exit", cb: () => { returnToLevelView(false); } }
    ];

    buttonData.forEach((data, i) => {
        const x = screenWidth / 2;
        const y = (screenHeight / 2) - 150 + (i * 70);
        
        const btnImg = this.add.nineslice(x, y, "GJ_button01", null, 450, 65, 24, 24, 24, 24 ).setScale(0.75).setInteractive();
        const label = this.add.bitmapText(x, y - 2, "goldFont", data.text, 40).setOrigin(0.5, 0.5).setScale(0.8);

        this._editorMenuContainer.add([btnImg, label]);

        this._makeCompositeBouncyButton(btnImg, [btnImg, label], 0.75, () => {
            data.cb();
        }, () => true);
    });

    const createToggle = (container, x, y, label, getVal, setVal, callback = null) => {
        const getTex = () => getVal() ? "GJ_checkOn_001.png" : "GJ_checkOff_001.png";
        const check = this.add.image(x - 120, y, "GJ_GameSheet03", getTex()).setScale(0.8).setInteractive();
        const txt = this.add.bitmapText(x - 70, y, "bigFont", label, 25).setOrigin(0, 0.5);
        container.add([check, txt]);

        this._makeBouncyButton(check, 0.8, () => {
            setVal(!getVal());
            check.setTexture("GJ_GameSheet03", getTex());
            if (callback) callback(getVal());
            this._saveSettings();
        });
    };

    createToggle(this._editorMenuContainer, 200, screenHeight - 60, "Show Glow", () => window.showEditorGlow, v => window.showEditorGlow = v,() => {
        this._level._updateGlowVisibility();
        this._buildObjectGrid?.();
    }
);
  }


  _showLoadingBuffer(statusText) {
    return new Promise((resolve) => {
        const overlay = this.add.graphics().setDepth(2000).setScrollFactor(0);
        overlay.fillStyle(0x000000, 1);
        overlay.fillRect(0, 0, screenWidth, screenHeight);

        const loadingText = this.add.bitmapText(
            screenWidth - 40, 
            screenHeight - 20, 
            "bigFont",
            statusText, 
            50
        ).setOrigin(1).setDepth(2001).setScrollFactor(0);

        setTimeout(() => {
            resolve();
        }, 2500);
    });
  }


  _showEditorPauseMenu(show) {
    this._editorMenuContainer.setVisible(show);
    window.isEditorPaused = show;
    window.isEditorPause = show;

    if (this._editorPlaytestControls && !this._editorPlaytestActive) {
        this._editorPlaytestControls.setVisible(true);
        this._editorPlaytestControls.setDepth(show ? 900 : 1500);
    }
};

_serializeLevel(levelData) {
  const settings = levelData.settings || "";
  const objectStrings = (levelData.objects || []).map(this._serializeObject).filter(Boolean);
  const decompressedString = [settings, ...objectStrings].join(";");
  const compressed = pako.gzip(decompressedString);

  let binaryString = "";
  for (let i = 0; i < compressed.length; i++) {
    binaryString += String.fromCharCode(compressed[i]);
  }

  let base64 = btoa(binaryString);

  return base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

_serializeObject(object) {
  if (!object || !object.id) {
    return "";
  }

  if (parseInt(object.id ?? 0, 10) === 749) {
    return "";
  }

  let objectData = { ...(object._raw || {}) };

  objectData[1] = String(object.id);
  objectData[2] = String(object.x ?? 0);
  objectData[3] = String(object.y ?? 0);
  objectData[4] = object.flipX ? "1" : "0";
  objectData[5] = object.flipY ? "1" : "0";
  objectData[6] = String(object.rot ?? 0);

  objectData[32] = String(object.scale ?? 1);

  objectData[20] = String(object.editorLayer ?? object._raw?.[20] ?? object._raw?.["20"] ?? 0);
  objectData[24] = String(object.zLayer ?? 0);
  objectData[25] = String(object.zOrder ?? 0);
  objectData[61] = String(object.editorLayer2 ?? object._raw?.[61] ?? object._raw?.["61"] ?? 0);

  const serializedGroups = this._getEditorObjectGroupIds ? this._getEditorObjectGroupIds(object).join(".") : (object.groups ?? "");
  objectData[57] = serializedGroups;
  delete objectData[33];
  delete objectData["33"];

  objectData[21] = String(object.color1 ?? 0);
  objectData[22] = String(object.color2 ?? 0);

  if (object.text !== undefined || objectData[31] !== undefined || objectData["31"] !== undefined) {
    const objectDef = typeof getObjectFromId === "function" ? getObjectFromId(parseInt(object.id ?? objectData[1] ?? 0, 10)) : null;
    const plainText = object.text !== undefined
      ? String(object.text ?? "")
      : _editorDecodeTextObjectString(objectData[31] ?? objectData["31"] ?? "");
    objectData[31] = objectDef?.textObject ? _editorEncodeTextObjectString(plainText) : plainText;
  }

  objectData["kA2"] = String(object.gameMode ?? 0);
  objectData["kA3"] = String(object.miniMode ?? 0);
  objectData["kA4"] = String(object.speed ?? 0);
  objectData["kA8"] = String(object.dualMode ?? object._raw?.["kA8"] ?? 0);
  objectData["kA28"] = String(object.mirrored ?? 0);
  objectData["kA11"] = object.flipGravity ? "1" : "0";

  if (parseInt(object.id ?? 0, 10) === 1346) {
    const parseGroupParts = (value) => String(value ?? "")
      .split(/[,.]/)
      .map(part => parseInt(part.trim(), 10))
      .filter(groupId => Number.isFinite(groupId) && groupId > 0);
    const targetParts = parseGroupParts(objectData[51] ?? objectData["51"]);
    const centerParts = parseGroupParts(objectData[71] ?? objectData["71"]);
    const targetGroup = targetParts[0] || 0;
    const centerGroup = centerParts[0] || 0;
    objectData[51] = String(targetGroup);
    objectData["51"] = String(targetGroup);
    if (centerGroup > 0) {
      objectData[71] = String(centerGroup);
      objectData["71"] = String(centerGroup);
    } else {
      delete objectData[71];
      delete objectData["71"];
    }
  }

  const parts = [];

  for (const key in objectData) {
    if (objectData[key] === undefined) continue;
    parts.push(key, String(objectData[key]));
  }

  return parts.join(",");
  }


  _saveEditorLevel() {
    const levelData = {
        objects: window.levelObjects,
        settings: window.settingslist
    };

    const newLevelString = this._serializeLevel(levelData);

    let createdLevels = JSON.parse(localStorage.getItem("created_levels") || "[]");
    let levelIndex = createdLevels.findIndex(l => l.createdId === window.currentlevel[2]);

    if (levelIndex !== -1) {
        createdLevels[levelIndex].levelString = newLevelString;
        createdLevels[levelIndex].lastModified = Date.now();

        if (this._editorPendingSongId !== undefined) {
            createdLevels[levelIndex].songId = this._editorPendingSongId;
            createdLevels[levelIndex].song = this._editorPendingSongName || createdLevels[levelIndex].song;
        }

        localStorage.setItem("created_levels", JSON.stringify(createdLevels));

        window._onlineLevelString = createdLevels[levelIndex].levelString;
        window._onlineLevelName = createdLevels[levelIndex].levelName;
        window._onlineLevelId = createdLevels[levelIndex].createdId;

        this._editorPendingSongId = undefined;
        this._editorPendingSongName = undefined;
    }
  }


  _initEditorTimeline() {
    const y = 40;
    this._timelineContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(1500);
    const width = screenWidth / 3;
    const groove = this.add.image(screenWidth / 2, y, "slidergroove2").setDisplaySize(width, 26);
    const thumb = this.add.image(screenWidth / 2, y, "GJ_moveBtn").setScale(0.4).setInteractive({ draggable: true });
    this._timelineContainer.add([groove, thumb]);
    this._timelineSlider = {width, groove, thumb, y };
    const startX = screenWidth / 2 - (width / 2);
    thumb.on("dragstart", () => {
        this._isDraggingSlider = true;
        thumb.setTexture("GJ_moveSBtn");
    });
    thumb.on("drag", (pointer, dragX) => {
        const minX = startX;
        const maxX = startX + width;
        thumb.x = Phaser.Math.Clamp(dragX, minX, maxX);
        const pct = (thumb.x - minX) / width;
        const levelWidth = this._getEditorLevelWidth();
        this._cameraX = pct * levelWidth;
        this._level.container.x = -this._cameraX;
        this._level.container.y = -this._cameraY;
        this._level.additiveContainer.x = -this._cameraX;
        this._level.additiveContainer.y = -this._cameraY;
        this._level.topContainer.x = -this._cameraX;
        this._level.topContainer.y = -this._cameraY;
        this._bg.tilePositionX = this._cameraX * 0.1;
    });
    thumb.on("dragend", () => {
        thumb.setTexture("GJ_moveBtn");
    });
  }


  _getEditorLevelWidth() {
    let furthestX = 0;

    for (const obj of window.levelObjects) {
        if (!obj) continue;

        const worldX = (obj.x - 15) * 2;

        if (worldX > furthestX) {
            furthestX = worldX;
        }
    }

    return Math.max(screenWidth, furthestX + screenWidth/2);
  }


  _updateEditorTimeline() {
    if (!this._timelineSlider) return;

    const {
        width,
        thumb,
    } = this._timelineSlider;

    const levelWidth = this._getEditorLevelWidth();

    const pct = Phaser.Math.Clamp(
        this._cameraX / levelWidth,
        0,
        1
    );

    const startX = screenWidth / 2 - (width / 2);

    thumb.x = startX + (pct * width);
  }

}

LevelEditor.methodNames = [
  "_handleEditorCamera",
  "_initEditorLogic",
  "_createEditorGui",
  "_refreshEditorPlaytestControls",
  "_setEditorPlaytestGuiVisible",
  "_setEditorLevelSectionsFullyVisible",
  "_resetEditorPlaytestSectionCulling",
  "_refreshEditorPlaytestGlowVisibility",
  "_getEditorPlaytestCameraYTarget",
  "_updateEditorPlaytestCameraY",
  "_updateEditorPlaytestBackground",
  "_setEditorZoomInstant",
  "_clearEditorPlaytestMarks",
  "_ensureEditorPlaytestTrail",
  "_drawEditorPlaytestTrailPoint",
  "_addEditorPlaytestDeathMark",
  "_resetEditorPlaytestLevelState",
  "_refreshEditorCollisionCaches",
  "_getEditorSaveIndexForObjectId",
  "_getEditorSaveObjectForObjectId",
  "_getEditorCollidersForObjectId",
  "_syncEditorColliderWithSaveObject",
  "_syncEditorCollidersForObjectId",
  "_hideEditorPlaytestGlowLayers",
  "_hideEditorPlaytestPlayer",
  "_syncEditorPlaytestPlayerVisual",
  "_getLatestEditorStartPosition",
  "_applyEditorPlaytestStartPosition",
  "_applyEditorPlaytestStartMode",
  "_startEditorPlaytest",
  "_toggleEditorPlaytestPause",
  "_stopEditorPlaytest",
  "_editorPlaytestPress",
  "_editorPlaytestRelease",
  "_updateEditorPlaytestInput",
  "_updateEditorPlaytest",
  "_adjustZoom",
  "_updateTabVisuals",
  "_getSheetForFrameThingy",
  "_getTextureRefForFrameThingy",
  "_createEditorObjectButtonPreview",
  "_buildObjectGrid",
  "_moveObject",
  "_rotateObject",
  "_flipObject",
  "_restoreEditorSelectionTint",
  "_getCurrentSelectedEditorObjectIds",
  "_selectEditorObjectsByIds",
  "_clearEditorSelection",
  "_selectEditorObjectByIndex",
  "_startEditorBoxSelect",
  "_updateEditorBoxSelect",
  "_finishEditorBoxSelect",
  "_duplicateSelectedObject",
  "_deleteSelectedObject",
  "_updateEditorActionButtons",
  "_updateEditorGrid",
  "_editorAction",
  "_setTeleportExitYOffset",
  "_refreshTeleportExitVisualsForSaveObject",
  "_applyTeleportExitPlacement",
  "_placeObject",
  "_selectObjectAtPointer",
  "_deleteObjectAtPointer",
  "_closeEditorLevelSettingsPopup",
  "_closeEditorHorizontalOptionPopup",
  "_closeEditorColorPickerPopup",
  "_closeEditorObjectOptionsPopup",
  "_editorSettingsToMap",
  "_editorMapToSettings",
  "_makeColorStringEntry",
  "_parseColorStringEntry",
  "_getEditorColorChannel",
  "_setEditorColorChannelDraft",
  "_setEditorStartValueDraft",
  "_getEditorStartValue",
  "_getEditorArtValue",
  "_setEditorArtValueDraft",
  "_getCurrentEditorLevelRecord",
  "_setEditorSongDraft",
  "_addSafeFrameImage",
  "_getColourPickerFrameData",
  "_getColourPickerTextureRef",
  "_addColourPickerImage",
  "_setPickerObjectColor",
  "_rgbToHsv",
  "_hsvToRgb",
  "_makeEditorOkButton",
  "_makeEditorVisualHitButton",
  "_makeCurrentSpeedPreview",
  "_makeGamemodeIconButton",
  "_makeEditorAtlasIconButton",
  "_openEditorStartOptionsPopup",
  "_applyLevelStartOptions",
  "_closeEditorStartOptionsPopup",
  "_openEditorHorizontalOptionPopup",
  "_openEditorColorPickerPopup",
  "_getEditorColorChannelLabel",
  "_isEditorColorTriggerId",
  "_isEditorStartPositionId",
  "_isEditorTextObjectId",
  "_getEditorTextObjectText",
  "_setEditorTextObjectText",
  "_refreshSelectedTextObjectVisual",
  "_getSelectedEditorSaveObject",
  "_getSelectedEditorSaveObjects",
  "_isSelectedEditorObjectTrigger",
  "_getEditorObjectColor",
  "_setEditorObjectColor",
  "_getEditorColorTriggerTargetChannel",
  "_setEditorColorTriggerTargetChannel",
  "_setEditorStartPositionValue",
  "_getEditorStartPositionValue",
  "_refreshSelectedTriggerTargetLabel",
  "_getEditorObjectGroupIds",
  "_syncEditorObjectGroupCaches",
  "_setEditorObjectGroupIds",
  "_getEditorZLayerOptions",
  "_getEditorObjectZLayer",
  "_getEditorObjectZOrder",
  "_getEditorZDepth",
  "_setEditorObjectZLayer",
  "_getEditorLayerOptions",
  "_getCurrentEditorPlacementLayer",
  "_getEditorObjectEditorLayer",
  "_getEditorObjectEditorLayer2",
  "_setEditorObjectEditorLayer",
  "_setEditorObjectEditorLayer2",
  "_applyEditorLayerMetadataToObject",
  "_editorObjectMatchesActiveLayer",
  "_editorObjectMatchesActiveLayerByObjectId",
  "_refreshEditorLayerSelectorVisual",
  "_setEditorActiveLayerIndex",
  "_applyEditorLayerFilter",
  "_setEditorObjectZOrder",
  "_openSelectedEditorGroupPopup",
  "_openSelectedEditorObjectOptions",
  "_isEditorMoveTriggerId",
  "_isEditorSpawnTriggerId",
  "_parseEditorSingleGroupId",
  "_getEditorTriggerTargetGroup",
  "_setEditorTriggerTargetGroup",
  "_getEditorTriggerBool",
  "_setEditorTriggerBool",
  "_getEditorMoveTriggerOffset",
  "_setEditorMoveTriggerOffset",
  "_getEditorMoveTriggerDuration",
  "_setEditorMoveTriggerDuration",
  "_getEditorSpawnTriggerDelay",
  "_setEditorSpawnTriggerDelay",
  "_getEditorSpawnTriggerRandomDelay",
  "_setEditorSpawnTriggerRandomDelay",
  "_openEditorMoveTriggerOptionsPopup",
  "_openEditorSpawnTriggerOptionsPopup",
  "_isEditorColorTriggerTouchTriggered",
  "_setEditorColorTriggerTouchTriggered",
  "_isEditorTriggerSpawnTriggered",
  "_setEditorTriggerSpawnTriggered",
  "_openEditorColorTriggerOptionsPopup",
  "_closeEditorTriggerChannelPopup",
  "_openEditorColorTriggerChannelPopup",
  "_openEditorStartPositionOptionsPopup",
  "_openEditorStartPositionSettingsPopup",
  "_openEditorTextObjectOptionsPopup",
  "_openEditorComingSoonTriggerPopup",
  "_openEditorLevelSettingsPopup",
  "_initEditorPauseMenu",
  "_showLoadingBuffer",
  "_showEditorPauseMenu",
  "_serializeLevel",
  "_serializeObject",
  "_saveEditorLevel",
  "_initEditorTimeline",
  "_getEditorLevelWidth",
  "_updateEditorTimeline"
];
window.LevelEditor = LevelEditor;
