class PlayerState {
  constructor() {
    this.reset();
  }
  reset() {
    this.y = 30;
    this.lastY = 30;
    this.lastGroundPosY = 30;
    this.yVelocity = 0;
    this.onGround = true;
    this.canJump = true;
    this.isJumping = false;
    this.gravityFlipped = false;
    this.isFlying = false;
    this.isBall = false;
    this.isWave = false;
    this.isUfo = false;
    this.isSpider = false;
    this.isBird = false;
    this.isDart = false;
    this.isRobot = false;
    this.isSwing = false;
    this.isJetpack = false;
    this.isMini = false;
    this.wasBoosted = false;
    this.pendingVelocity = null;
    this.collideTop = 0;
    this.collideBottom = 0;
    this.onCeiling = false;
    this.upKeyDown = false;
    this.upKeyPressed = false;
    this.queuedHold = false;
    this._orbActivationConsumedForPress = false;
    this.isDead = false;
    this.mirrored = false;
    this.isDashing = false;
    this.dashYVelocity = 0;
    this.isDual = false;
    this.ignorePortals = false;
    this._robotHold = false;
    this._robotHoldTimer = 0;
    this._spiderTeleportNoclipDeathPending = false;
  }
}

class StreakManager {
  constructor(_0x9c2356, _0x171c7f, _0x49d49a, _0xb01616, _0x5aac4b, _0x293ce3, _0x5c7bc5 = 16777215, _0x5a3e29 = 1) {
    this._color = _0x5c7bc5;
    this._opacity = _0x5a3e29;
    this._fadeDelta = 1 / _0x49d49a;
    this._minSegSq = _0xb01616 * _0xb01616;
    this._maxSeg = _0x293ce3;
    this._maxPoints = Math.floor(_0x49d49a * 60 + 2) * 5;
    this._stroke = _0x5aac4b;
    this._pts = [];
    this._posR = {
      x: 0,
      y: 0
    };
    this._posInit = false;
    this._active = false;
    const graphicsSettings = window.performanceOptimizer ? window.performanceOptimizer.getGraphicsSettings() : {
      enableGlow: true,
      blendMode: Phaser.BlendModes.ADD
    };
    
    this._gfx = _0x9c2356.add.graphics();
    this._gfx.setBlendMode(graphicsSettings.blendMode);
  }
  addToContainer(_0xa23240, _0x4b05db) {
    _0xa23240.add(this._gfx);
    this._gfx.setDepth(_0x4b05db);
  }
  setColor(newColor) {
    this._color = newColor
  }
  setPosition(_0x388397, _0x292e79) {
    this._posR.x = _0x388397;
    this._posR.y = _0x292e79;
    this._posInit = true;
  }
  start() {
    this._active = true;
  }
  stop() {
    this._active = false;
  }
  reset() {
    this._pts = [];
    this._posInit = false;
    this._gfx.clear();
  }
  update(_0x2acf4c) {
    if (!this._posInit) {
      this._gfx.clear();
      return;
    }
    const _0x1817b7 = _0x2acf4c * this._fadeDelta;
    let _0x56ab0b = 0;
    for (let _0x3ca060 = 0; _0x3ca060 < this._pts.length; _0x3ca060++) {
      this._pts[_0x3ca060].state -= _0x1817b7;
      if (this._pts[_0x3ca060].state > 0) {
        if (_0x56ab0b !== _0x3ca060) {
          this._pts[_0x56ab0b] = this._pts[_0x3ca060];
        }
        _0x56ab0b++;
      }
    }
    this._pts.length = _0x56ab0b;
    if (this._active && this._pts.length < this._maxPoints) {
      const _0x89a79d = this._pts.length;
      let _0x3d12ca = true;
      if (_0x89a79d > 0) {
        const _0x2748e4 = this._pts[_0x89a79d - 1];
        const _0x3a1a00 = this._posR.x - _0x2748e4.x;
        const _0x4c247a = this._posR.y - _0x2748e4.y;
        const _0x1f9fea = _0x3a1a00 * _0x3a1a00 + _0x4c247a * _0x4c247a;
        if (this._maxSeg > 0 && Math.sqrt(_0x1f9fea) > this._maxSeg) {
          this._pts.length = 0;
        } else if (_0x1f9fea < this._minSegSq) {
          _0x3d12ca = false;
        } else if (_0x89a79d > 1) {
          const _0x375c40 = this._pts[_0x89a79d - 2];
          const _0x14c0c1 = this._posR.x - _0x375c40.x;
          const _0x2d01f0 = this._posR.y - _0x375c40.y;
          if (_0x14c0c1 * _0x14c0c1 + _0x2d01f0 * _0x2d01f0 < this._minSegSq * 2) {
            _0x3d12ca = false;
          }
        }
      }
      if (_0x3d12ca) {
        this._pts.push({
          x: this._posR.x,
          y: this._posR.y,
          state: 1
        });
      }
    }
    this._gfx.clear();
    const _0x49dac5 = this._pts.length;
    if (!(_0x49dac5 < 2)) {
      for (let _0x27c164 = 0; _0x27c164 < _0x49dac5 - 1; _0x27c164++) {
        const _0x398b7b = this._pts[_0x27c164];
        const _0x3b4326 = this._pts[_0x27c164 + 1];
        const _0x1c4c9d = (_0x398b7b.state + _0x3b4326.state) * 0.5 * this._opacity;
        this._gfx.lineStyle(this._stroke, this._color, _0x1c4c9d);
        this._gfx.lineBetween(_0x398b7b.x, _0x398b7b.y, _0x3b4326.x, _0x3b4326.y);
      }
    }
  }
}
class WaveTrail {
  constructor(scene, color, glowColor) {
    this._color = color;
    this._glowColor = glowColor;
    this._pts = [];
    this._active = false;
    this._posInit = false;
    this._pos = { x: 0, y: 0 };
    this._maxAge = 0.6;
    this._minSegSq = 1.5 * 1.5;
    this._baseHalfW = 7;
    this._baseGlowHalfW = 14;
    this._halfW = this._baseHalfW;
    this._glowHalfW = this._baseGlowHalfW;
    this._gfx = scene.add.graphics();
    this._gfx.setBlendMode(Phaser.BlendModes.NORMAL);
    this._glowGfx = scene.add.graphics();
    this._glowGfx.setBlendMode(Phaser.BlendModes.ADD);
  }
  addToContainer(container, depth) {
    container.add(this._glowGfx);
    this._glowGfx.setDepth(depth - 1);
    container.add(this._gfx);
    this._gfx.setDepth(depth);
  }
  setPosition(x, y) { this._pos.x = x; this._pos.y = y; this._posInit = true; }
  setColor(color, glowColor = color) { this._color = color; this._glowColor = glowColor; }
  setMiniScale(isMini) {
    const scale = isMini ? 0.6 : 1;
    this._halfW = this._baseHalfW * scale;
    this._glowHalfW = this._baseGlowHalfW * scale;
  }
  start() { this._active = true; }
  stop()  { this._active = false; }
  reset() { this._pts = []; this._posInit = false; this._gfx.clear(); this._glowGfx.clear(); }

  _intersect(p1, p2, p3, p4) {
    const d1x = p2.x - p1.x, d1y = p2.y - p1.y;
    const d2x = p4.x - p3.x, d2y = p4.y - p3.y;
    const denom = d1x * d2y - d1y * d2x;
    if (Math.abs(denom) < 1e-6) return { x: p2.x, y: p2.y };
    const t = ((p3.x - p1.x) * d2y - (p3.y - p1.y) * d2x) / denom;
    const tc = Math.max(-3, Math.min(3, t));
    return { x: p1.x + d1x * tc, y: p1.y + d1y * tc };
  }

  _buildEdges(pts, halfW) {
    const n = pts.length;
    const upper = new Array(n);
    const lower = new Array(n);

    // precompute per-segment normals
    const segNx = new Array(n - 1);
    const segNy = new Array(n - 1);
    for (let i = 0; i < n - 1; i++) {
      const dx = pts[i + 1].x - pts[i].x;
      const dy = pts[i + 1].y - pts[i].y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      segNx[i] = -dy / len;
      segNy[i] = dx / len;
    }

    for (let i = 0; i < n; i++) {
      const p = pts[i];
      let nx, ny;

      if (i === 0) {
        nx = segNx[0]; ny = segNy[0];
      } else if (i === n - 1) {
        nx = segNx[n - 2]; ny = segNy[n - 2];
      } else {
        // miter: intersect the two offset edge lines for a sharp corner
        const n1x = segNx[i - 1], n1y = segNy[i - 1];
        const n2x = segNx[i],     n2y = segNy[i];

        // upper edge intersection
        const u1 = { x: pts[i - 1].x + n1x * halfW, y: pts[i - 1].y + n1y * halfW };
        const u2 = { x: p.x          + n1x * halfW, y: p.y          + n1y * halfW };
        const u3 = { x: p.x          + n2x * halfW, y: p.y          + n2y * halfW };
        const u4 = { x: pts[i + 1].x + n2x * halfW, y: pts[i + 1].y + n2y * halfW };
        const mu = this._intersect(u1, u2, u3, u4);

        // lower edge intersection
        const l1 = { x: pts[i - 1].x - n1x * halfW, y: pts[i - 1].y - n1y * halfW };
        const l2 = { x: p.x          - n1x * halfW, y: p.y          - n1y * halfW };
        const l3 = { x: p.x          - n2x * halfW, y: p.y          - n2y * halfW };
        const l4 = { x: pts[i + 1].x - n2x * halfW, y: pts[i + 1].y - n2y * halfW };
        const ml = this._intersect(l1, l2, l3, l4);

        upper[i] = mu;
        lower[i] = ml;
        continue;
      }

      upper[i] = { x: p.x + nx * halfW, y: p.y + ny * halfW };
      lower[i] = { x: p.x - nx * halfW, y: p.y - ny * halfW };
    }
    return { upper, lower };
  }

  _drawRibbon(gfx, pts, halfW, color, baseAlpha, antialias = false) {
    const n = pts.length;
    if (n < 2) return;

    const { upper, lower } = this._buildEdges(pts, halfW);
    if (antialias) {
      this._drawRibbon(gfx, pts, halfW + 0.5, color, baseAlpha * 0.5, false);
    }

    for (let i = 0; i < n - 1; i++) {
      const alpha = Math.max(0, (1 - (pts[i].age + pts[i+1].age) * 0.5)) * baseAlpha;
      if (alpha <= 0.01) continue;

      gfx.fillStyle(color, alpha);
      
      gfx.fillTriangle(
        upper[i].x, upper[i].y,
        upper[i+1].x, upper[i+1].y,
        lower[i].x, lower[i].y
      );
      gfx.fillTriangle(
        upper[i+1].x, upper[i+1].y,
        lower[i+1].x, lower[i+1].y,
        lower[i].x, lower[i].y
      );
    }
  }

  update(delta) {
    if (!this._posInit) { this._gfx.clear(); this._glowGfx.clear(); return; }
    const decay = (delta / 1000) / this._maxAge;

    let alive = 0;
    for (let i = 0; i < this._pts.length; i++) {
      this._pts[i].age += decay;
      if (this._pts[i].age < 1) this._pts[alive++] = this._pts[i];
    }
    this._pts.length = alive;

    if (this._active) {
      const n = this._pts.length;
      let add = true;
      if (n > 0) {
        const last = this._pts[n - 1];
        const dx = this._pos.x - last.x, dy = this._pos.y - last.y;
        if (dx*dx + dy*dy < this._minSegSq) add = false;
      }
      if (add) this._pts.push({ x: this._pos.x, y: this._pos.y, age: 0 });
    }

    this._gfx.clear();
    this._glowGfx.clear();
    if (this._pts.length < 2) return;

    const solid = window.solidWave === true;
    if (solid) {
      this._drawRibbon(this._gfx, this._pts, this._halfW, this._color, 1.0);
    } else {
      this._drawRibbon(this._glowGfx, this._pts, this._glowHalfW, this._glowColor, 0.22);
      this._drawRibbon(this._gfx, this._pts, this._halfW, this._color, 0.95);
      this._drawRibbon(this._gfx, this._pts, Math.round(this._halfW * 0.32), 0xffffff, 0.5);
    }
  }
}
function ds(scene, x, y, frameName, depth, isVisible) {
  let atlasData = getAtlasFrame(scene, frameName);
  if (!atlasData) {
    return null;
  }
  let image = scene.add.image(x, y, atlasData.atlas, atlasData.frame);
  image.setDepth(depth);
  image.setVisible(isVisible);
  return {
    sprite: image
  };
}

function _textureHasFrameSafe(scene, textureKey, frameName) {
  try {
    const texture = scene?.textures?.get(textureKey);
    return !!(texture && typeof texture.has === "function" && texture.has(frameName));
  } catch (err) {
    return false;
  }
}
function _makeAtlasLayer(scene, x, y, textureKey, frameName, depth, isVisible, tint = null, kind = "base") {
  if (!_textureHasFrameSafe(scene, textureKey, frameName)) {
    return null;
  }
  const image = scene.add.image(x, y, textureKey, frameName);
  image.setDepth(depth);
  image.setVisible(isVisible);
  if (tint !== null && tint !== undefined) image.setTint(tint);
  if (kind === "glow") image._glowEnabled = false;
  return {
    sprite: image,
    kind,
    frameName,
    textureKey
  };
}
function _parseAnimPair(value, fallbackX = 0, fallbackY = 0) {
  const match = String(value ?? "").match(/\{\s*([-+]?\d*\.?\d+)\s*,\s*([-+]?\d*\.?\d+)\s*\}/);
  if (!match) return { x: fallbackX, y: fallbackY };
  const x = parseFloat(match[1]);
  const y = parseFloat(match[2]);
  return {
    x: Number.isFinite(x) ? x : fallbackX,
    y: Number.isFinite(y) ? y : fallbackY
  };
}
function _spiderVariantFrameName(frameName, variant) {
  if (!frameName) return frameName;
  if (variant === "glow") return frameName.replace(/_001\.png$/, "_glow_001.png");
  if (variant === "overlay") return frameName.replace(/_001\.png$/, "_2_001.png");
  if (variant === "extra") return frameName.replace(/_001\.png$/, "_extra_001.png");
  return frameName;
}
function _mixTintTowardWhite(baseColor, amount) {
  const clamped = Math.max(0, Math.min(1, Number(amount) || 0));
  const color = Number.isFinite(Number(baseColor)) ? Number(baseColor) : 0xffffff;
  const r = (color >> 16) & 255;
  const g = (color >> 8) & 255;
  const b = color & 255;
  const rr = Math.round(r + (255 - r) * clamped);
  const gg = Math.round(g + (255 - g) * clamped);
  const bb = Math.round(b + (255 - b) * clamped);
  return (rr << 16) | (gg << 8) | bb;
}
function _mixColors(colorA, colorB, amount) {
  const t = Math.max(0, Math.min(1, Number(amount) || 0));
  const a = Number.isFinite(Number(colorA)) ? Number(colorA) : 0xffffff;
  const b = Number.isFinite(Number(colorB)) ? Number(colorB) : 0xffffff;
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  const rr = Math.round(ar + (br - ar) * t);
  const gg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return (rr << 16) | (gg << 8) | rb;
}

class PlayerObject {
  constructor(scene, _0x3f50cc, _0x2811e1) {
    this._scene = scene;
    this.p = _0x3f50cc;
    this._gameLayer = _0x2811e1;
    this._rotation = 0;
    this.rotateActionActive = false;
    this.rotateActionTime = 0;
    this.rotateActionDuration = 0;
    this.rotateActionStart = 0;
    this.rotateActionTotal = 0;
    this._lastLandObject = null;
    this._lastXOffset = 0;
    this._lastCameraX = 0;
    this._lastCameraY = 0;
    this._dashAnimationFrame = 0;
    this._dashAnimationTimer = 0;
    this._dashAnimationSprite = null;
    this._spiderDashEffectSprite = null;
    this._spiderDashEffectTimer = 0;
    this._spiderDashEffectDuration = 0.5;
    this._spiderTeleportCircles = [];
    this._robotJumpFlameSprite = null;
    this._robotJumpFlamePulse = 0;
    this._robotJumpFlameFadeInTimer = 0;
    this._robotJumpFlameActive = false;
    this._robotJumpFlameAnchorX = centerX;
    this._robotJumpFlameAnchorY = b(this.p.y);
    this._lastScreenX = centerX;
    this._lastScreenY = b(this.p.y);
    this._hitboxTrail = [];
    this._lastCollisionWorldX = null;
    this._lastCollisionWorldY = null;
    this._ignoreTeleportUntilClear = false;
    this._invertPlayerColors = false;
    this._deathBurstEmitter = null;
    this._deathFlashGraphics = null;
    this._deathFlashTween = null;
    this._deathAnimationPaused = false;
    this._createSprites();
    this._hitboxGraphics = scene.add.graphics().setScrollFactor(0).setDepth(20);
    this._initParticles(scene);
    scene.events.on("shutdown", () => this._cleanupExplosion());
    this.noclipStats = {
      totalFrames: 0,
      deathFrames: 0,
      accuracy: 100,
      deaths: 0
    };
  }
  _primaryColor() {
    return this._invertPlayerColors ? window.secondaryColor : window.mainColor;
  }
  _secondaryColor() {
    return this._invertPlayerColors ? window.mainColor : window.secondaryColor;
  }
  _tintForLayerKind(kind) {
    if (kind === "base") return this._primaryColor();
    if (kind === "overlay" || kind === "glow") return this._secondaryColor();
    return null;
  }
  setInvertedColors(inverted) {
    this._invertPlayerColors = !!inverted;
    this._applyPlayerTints();
  }
  _applyPlayerTints() {
    const applyLayer = (layer) => {
      if (!layer?.sprite) return;
      const tint = this._tintForLayerKind(layer.kind || "base");
      if (tint !== null && tint !== undefined) layer.sprite.setTint(tint);
      else if (layer.sprite.clearTint) layer.sprite.clearTint();
    };
    for (const layer of (this._allLayers || [])) applyLayer(layer);
    if (this._playerSpriteLayer?.sprite) this._playerSpriteLayer.sprite.setTint(this._primaryColor());
    if (this._playerGlowLayer?.sprite) this._playerGlowLayer.sprite.setTint(this._secondaryColor());
    if (this._playerOverlayLayer?.sprite) this._playerOverlayLayer.sprite.setTint(this._secondaryColor());
    if (this._shipSpriteLayer?.sprite) this._shipSpriteLayer.sprite.setTint(this._primaryColor());
    if (this._shipGlowLayer?.sprite) this._shipGlowLayer.sprite.setTint(this._secondaryColor());
    if (this._shipOverlayLayer?.sprite) this._shipOverlayLayer.sprite.setTint(this._secondaryColor());
    if (this._ballSpriteLayer?.sprite) this._ballSpriteLayer.sprite.setTint(this._primaryColor());
    if (this._ballGlowLayer?.sprite) this._ballGlowLayer.sprite.setTint(this._secondaryColor());
    if (this._ballOverlayLayer?.sprite) this._ballOverlayLayer.sprite.setTint(this._secondaryColor());
    if (this._waveSpriteLayer?.sprite) this._waveSpriteLayer.sprite.setTint(this._primaryColor());
    if (this._waveGlowLayer?.sprite) this._waveGlowLayer.sprite.setTint(this._secondaryColor());
    if (this._waveOverlayLayer?.sprite) this._waveOverlayLayer.sprite.setTint(this._secondaryColor());
    if (this._birdSpriteLayer?.sprite) this._birdSpriteLayer.sprite.setTint(this._primaryColor());
    if (this._birdGlowLayer?.sprite) this._birdGlowLayer.sprite.setTint(this._secondaryColor());
    if (this._birdOverlayLayer?.sprite) this._birdOverlayLayer.sprite.setTint(this._secondaryColor());
    if (this._particleEmitter) this._particleEmitter.tint = this._primaryColor();
    if (this._landEmitter1) this._landEmitter1.tint = this._primaryColor();
    if (this._landEmitter2) this._landEmitter2.tint = this._primaryColor();
    if (this._streak?.setColor) this._streak.setColor(this._secondaryColor());
    if (this._waveTrail?.setColor) this._waveTrail.setColor(this._primaryColor(), this._primaryColor());
  }
	  _makeportalguide(gameObj) {
	    if (!gameObj) return;
	    if (typeof this._activatePortalGuideGlow === "function") {
	        this._activatePortalGuideGlow(gameObj);
	    }
	  }
  _getActivationKey() {
    return this._activationKey || (this.p === this._scene?._state2 ? "dual" : "main");
  }
  _usesIndependentActivation(gameObj) {
    const type = String(gameObj?.type || "");
    return type.startsWith("portal_") || type === speedType || type === "speed" || type === jumpRingType;
  }
  _isObjectActivated(gameObj) {
    if (!gameObj) return false;
    if (!this._usesIndependentActivation(gameObj)) return !!gameObj.activated;
    return !!gameObj._activatedByPlayer?.[this._getActivationKey()];
  }
  _setObjectActivated(gameObj, activated = true) {
    if (!gameObj) return;
    if (!this._usesIndependentActivation(gameObj)) {
      gameObj.activated = !!activated;
      return;
    }
    if (!gameObj._activatedByPlayer) gameObj._activatedByPlayer = {};
    gameObj._activatedByPlayer[this._getActivationKey()] = !!activated;
    gameObj.activated = Object.values(gameObj._activatedByPlayer).some(Boolean);
  }
  _syncOtherDualGravityForBlueBoost() {
    const scene = this._scene;
    if (!scene?._isDual) return;
    if (this.p === scene._state && typeof scene._syncDualGlobalsFromPrimary === "function") {
      scene._syncDualGlobalsFromPrimary({ forceGravitySync: true });
    } else if (this.p === scene._state2 && typeof scene._syncDualGlobalsFromSecondary === "function") {
      scene._syncDualGlobalsFromSecondary({ forceGravitySync: true });
    }
  }
  _markActivatedOrbSprites(gameObj) {
    if (!gameObj) return;
    const objectId = Number.isInteger(gameObj._eeObjectId) ? gameObj._eeObjectId : -1;
    const targetY = typeof b === "function" ? b(gameObj.y) : gameObj.y;
    const now = Date.now();
    try {
      for (let _orbSpr of (this._gameLayer._orbSprites || [])) {
        if (!_orbSpr) continue;
        const sameObject = objectId >= 0 && _orbSpr._eeObjectId === objectId;
        const samePosition = _orbSpr._eeWorldX !== undefined &&
          Math.abs(_orbSpr._eeWorldX - gameObj.x) < 10 &&
          (_orbSpr._eeBaseY === undefined || Math.abs(_orbSpr._eeBaseY - targetY) < 10);
        if (sameObject || (objectId < 0 && samePosition)) {
          _orbSpr._hitTime = now;
        }
      }
    } catch(e) {}
  }
  _consumeOrbActivationInput() {
    this.p._orbActivationConsumedForPress = true;
    this.p.upKeyPressed = false;
    this.p.queuedHold = false;
  }
  _getDashHoldTicks(gameObj) {
    if (!gameObj) return 0;
    if (!gameObj._dashHoldTicksByPlayer) gameObj._dashHoldTicksByPlayer = {};
    return gameObj._dashHoldTicksByPlayer[this._getActivationKey()] || 0;
  }
  _setDashHoldTicks(gameObj, ticks) {
    if (!gameObj) return;
    if (!gameObj._dashHoldTicksByPlayer) gameObj._dashHoldTicksByPlayer = {};
    gameObj._dashHoldTicksByPlayer[this._getActivationKey()] = ticks;
    gameObj._dashHoldTicks = Math.max(0, ...Object.values(gameObj._dashHoldTicksByPlayer).map(Number).filter(Number.isFinite));
  }
	  _getSpiderIconBase() {
    const rawBase = String(window.currentSpider || "spider_01");
    const match = rawBase.match(/^spider_\d+/);
    return match ? match[0] : "spider_01";
  }
  _resolveSpiderIconFrame(frameName) {
    const base = this._getSpiderIconBase();
    const resolved = String(frameName || "").replace(/^spider_\d+/, base);
    if (_textureHasFrameSafe(this._scene, "GJ_GameSheetIcons", resolved)) return resolved;
    if (_textureHasFrameSafe(this._scene, "GJ_GameSheetIcons", frameName)) return frameName;
    return resolved;
  }
  _getSpiderAnimDesc() {
    if (this._spiderAnimDesc !== undefined) return this._spiderAnimDesc;
    let data = null;
    try {
      data = this._scene?.cache?.json?.get?.("Spider_AnimDesc") || null;
    } catch (err) {
      data = null;
    }
    if (!data && typeof window !== "undefined") data = window.Spider_AnimDesc || null;
    if (!data || !data.animationContainer) {
      this._spiderFrameGroups = {};
      return null;
    }
    this._spiderAnimDesc = data;
    this._spiderFrameGroups = {};
    if (this._spiderAnimDesc?.animationContainer) {
      const frameKeys = Object.keys(this._spiderAnimDesc.animationContainer);
      const sortBySuffix = (a, b) => {
        const aa = parseInt((String(a).match(/_(\d+)\.png$/) || [0, 0])[1], 10) || 0;
        const bb = parseInt((String(b).match(/_(\d+)\.png$/) || [0, 0])[1], 10) || 0;
        return aa - bb;
      };
      this._spiderFrameGroups.run = frameKeys.filter(k => /^Spider_run_\d+\.png$/.test(k)).sort(sortBySuffix);
      this._spiderFrameGroups.run2 = frameKeys.filter(k => /^Spider_run2_\d+\.png$/.test(k)).sort(sortBySuffix);
      this._spiderFrameGroups.walk = frameKeys.filter(k => /^Spider_walk_\d+\.png$/.test(k)).sort(sortBySuffix);
      this._spiderFrameGroups.fall = frameKeys.filter(k => /^Spider_fall_loop_\d+\.png$/.test(k)).sort(sortBySuffix);
      this._spiderFrameGroups.idle = frameKeys.filter(k => /^Spider_idle01_\d+\.png$/.test(k)).sort(sortBySuffix);
      this._spiderFrameGroups.idle2 = frameKeys.filter(k => /^Spider_idle02_\d+\.png$/.test(k)).sort(sortBySuffix);
    }
    return this._spiderAnimDesc;
  }
  _createSpiderLayerSet(scene, x, y, textureName, tag) {
    const resolvedBase = this._resolveSpiderIconFrame(textureName);
    const layers = [];
    const makeLayer = (variant, tint, depthOffset) => {
      const frame = this._resolveSpiderIconFrame(_spiderVariantFrameName(resolvedBase, variant));
      const layer = _makeAtlasLayer(scene, x, y, "GJ_GameSheetIcons", frame, 8 + tag * 0.1 + depthOffset, false, tint, variant);
      if (layer) layers.push(layer);
      return layer;
    };
    const glow = makeLayer("glow", this._secondaryColor(), -0.04);
    const base = makeLayer("base", this._primaryColor(), 0);
    const overlay = makeLayer("overlay", this._secondaryColor(), 0.04);
    const extra = makeLayer("extra", null, 0.08);
    return { tag, textureName, layers, glow, base, overlay, extra };
  }
  _initSpiderAnimationParts(scene, x, y) {
    this._spiderAnimTimer = 0;
    this._spiderAnimDesc = undefined;
    this._spiderPartsByTag = {};
    this._spiderLayers = [];
    const desc = this._getSpiderAnimDesc();
    const usedTextures = desc?.usedTextures || null;
    let entries = [];
    if (usedTextures) {
      entries = Object.values(usedTextures).slice().sort((a, b) => (parseInt(a.tag || "0", 10) || 0) - (parseInt(b.tag || "0", 10) || 0));
    }
    if (!entries.length) {
      entries = [
        { tag: "0", texture: "spider_01_02_001.png" },
        { tag: "1", texture: "spider_01_02_001.png" },
        { tag: "2", texture: "spider_01_04_001.png" },
        { tag: "3", texture: "spider_01_01_001.png" },
        { tag: "4", texture: "spider_01_03_001.png" },
        { tag: "5", texture: "spider_01_02_001.png" }
      ];
    }
    for (const entry of entries) {
      const tag = parseInt(entry.tag || "0", 10) || 0;
      const part = this._createSpiderLayerSet(scene, x, y, entry.texture, tag);
      if (!part.layers.length) continue;
      this._spiderPartsByTag[tag] = part;
      this._spiderLayers.push(...part.layers);
    }
  }
  _selectSpiderFrameKey(dt) {
    const desc = this._getSpiderAnimDesc();
    if (!desc?.animationContainer) return null;
    if (this.p._spiderTeleportAnimTimer > 0 && desc.animationContainer["Spider_jump_001.png"]) {
      this.p._spiderTeleportAnimTimer = Math.max(0, this.p._spiderTeleportAnimTimer - dt);
      return "Spider_jump_001.png";
    }
    const _speedPortalRef = (typeof SpeedPortal !== "undefined" && SpeedPortal) ? SpeedPortal : null;
    const _oneSpeed = Number(_speedPortalRef?.ONE_TIMES ?? 11.540004) || 11.540004;
    const _halfSpeed = Number(_speedPortalRef?.HALF ?? (_oneSpeed * 0.8)) || (_oneSpeed * 0.8);
    const _fourSpeed = Number(_speedPortalRef?.FOUR_TIMES ?? (_oneSpeed * 1.85)) || (_oneSpeed * 1.85);
    const _activeSpeed = Number.isFinite(Number(playerSpeed)) ? Number(playerSpeed) : _oneSpeed;
    let spiderAnimationSpeed = 1.75;
    if (_activeSpeed >= _oneSpeed) {
      const _fastT = Math.max(0, Math.min(1, (_activeSpeed - _oneSpeed) / Math.max(1e-6, _fourSpeed - _oneSpeed)));
      spiderAnimationSpeed = 1.75 + _fastT * 0.35;
    } else {
      const _slowT = Math.max(0, Math.min(1, (_oneSpeed - _activeSpeed) / Math.max(1e-6, _oneSpeed - _halfSpeed)));
      spiderAnimationSpeed = 1.75 - _slowT * 0.15;
    }
    this._spiderAnimTimer = (this._spiderAnimTimer || 0) + Math.max(0, dt || 0) * spiderAnimationSpeed;
    let group = null;
    if (!this.p.onGround && !this.p.onCeiling) {
      group = this._spiderFrameGroups?.fall;
    } else {
      group = this._spiderFrameGroups?.run;
    }
    if (!group || !group.length) group = this._spiderFrameGroups?.walk;
    if (!group || !group.length) group = this._spiderFrameGroups?.idle;
    if (!group || !group.length) return desc.animationContainer["Spider_idle_001.png"] ? "Spider_idle_001.png" : null;
    const fps = this.p.onGround || this.p.onCeiling ? 16 : 12;
    const idx = Math.floor(this._spiderAnimTimer * fps) % group.length;
    return group[idx];
  }
  _applySpiderFrame(frameKey, baseX, baseY, dt) {
    const desc = this._getSpiderAnimDesc();
    const frame = frameKey && desc?.animationContainer ? desc.animationContainer[frameKey] : null;
    if (!frame || !this._spiderPartsByTag) return false;
    const miniScale = this.p.isMini ? 0.6 : 1;
    const mirrorSign = this.p.mirrored ? -1 : 1;
    const gravitySign = this.p.gravityFlipped ? -1 : 1;
    const positionYSign = this.p.gravityFlipped ? 1 : -1;
    const seenTags = new Set();
    const robotFootTags = [2, 6];
    const robotFootPoints = [];
    const robotLegPoints = [];

    for (const spriteKey of Object.keys(frame)) {
      if (!spriteKey.startsWith("sprite_")) continue;
      const spriteData = frame[spriteKey];
      const tag = parseInt(spriteData.tag || "0", 10) || 0;
      const part = this._spiderPartsByTag[tag];
      if (!part) continue;
      seenTags.add(tag);
      const pos = _parseAnimPair(spriteData.position, 0, 0);
      const spiderLegTags = [0, 1, 4, 5];
      const isSpiderLegTag = spiderLegTags.includes(tag);
      const spiderLocalYOffset = tag === 3 ? 5 : (isSpiderLegTag ? -9 : 0);
      const spiderLocalXScale = isSpiderLegTag ? 1.8 : 1;
      const sc = _parseAnimPair(spriteData.scale, 1, 1);
      const fl = _parseAnimPair(spriteData.flipped, 0, 0);
      const zValue = parseFloat(spriteData.zValue || tag || "0") || 0;
      const rotDeg = parseFloat(spriteData.rotation || "0") || 0;
      const baseTexture = this._resolveSpiderIconFrame(spriteData.texture || part.textureName);
      const resolvedFrames = {
        glow: this._resolveSpiderIconFrame(_spiderVariantFrameName(baseTexture, "glow")),
        base: this._resolveSpiderIconFrame(baseTexture),
        overlay: this._resolveSpiderIconFrame(_spiderVariantFrameName(baseTexture, "overlay")),
        extra: this._resolveSpiderIconFrame(_spiderVariantFrameName(baseTexture, "extra"))
      };
      const commonX = baseX + pos.x * spiderLocalXScale * mirrorSign * miniScale;
      const commonY = baseY + (pos.y + spiderLocalYOffset) * positionYSign * miniScale;
      let commonRot = rotDeg * Math.PI / 180;
      if (this.p.mirrored) commonRot = -commonRot;
      if (this.p.gravityFlipped) commonRot = -commonRot;
      const baseScaleX = sc.x * (fl.x ? -1 : 1) * mirrorSign * miniScale;
      const baseScaleY = sc.y * (fl.y ? -1 : 1) * gravitySign * miniScale;

      const flashDuration = Math.max(0.001, Number(this.p._spiderFlashDuration || 0.5));
      const flashTime = (!this._scene?._editorPlaytestActive && this.p._spiderFlashTimer > 0)
        ? Math.max(0, Math.min(1, this.p._spiderFlashTimer / flashDuration))
        : 0;
      const flashAmount = flashTime * flashTime;

      const applyLayer = (layer, kind, depthOffset) => {
        if (!layer?.sprite) return;
        const frameName = resolvedFrames[kind];
        if (!_textureHasFrameSafe(this._scene, "GJ_GameSheetIcons", frameName)) {
          layer.sprite.setVisible(false);
          return;
        }
        layer.sprite.setTexture("GJ_GameSheetIcons", frameName);
        layer.sprite.x = commonX;
        layer.sprite.y = commonY;
        layer.sprite.rotation = commonRot;
        layer.sprite.scaleX = baseScaleX;
        layer.sprite.scaleY = baseScaleY;
        layer.sprite.setDepth(8 + zValue * 0.1 + depthOffset);

        const normalTint = this._tintForLayerKind(kind);
        if (flashAmount > 0) {
          layer.sprite.setTint(_mixTintTowardWhite(normalTint ?? 0xffffff, flashAmount));
        } else if (normalTint !== null && normalTint !== undefined) {
          layer.sprite.setTint(normalTint);
        } else if (typeof layer.sprite.clearTint === "function") {
          layer.sprite.clearTint();
        }

        layer.sprite.setVisible(kind === "glow" ? !!layer.sprite._glowEnabled : true);
      };
      applyLayer(part.glow, "glow", -0.04);
      applyLayer(part.base, "base", 0);
      applyLayer(part.overlay, "overlay", 0.04);
      applyLayer(part.extra, "extra", 0.08);
    }

    for (const tag of Object.keys(this._spiderPartsByTag)) {
      if (seenTags.has(parseInt(tag, 10))) continue;
      const part = this._spiderPartsByTag[tag];
      for (const layer of part.layers) layer?.sprite?.setVisible(false);
    }
    if (this.p._spiderFlashTimer > 0) {
      this.p._spiderFlashTimer = Math.max(0, this.p._spiderFlashTimer - Math.max(0, dt || 0));
    }
    return true;
  }
  _spawnSpiderTeleportEffects(oldGameY, newGameY) {
    if (this._scene?._editorPlaytestActive || !this.p.isSpider) return;
    const duration = 0.5;
    const circleDuration = 0.4;
    const teleportTint = _mixColors(0xffffff, this._primaryColor(), 0.42);
    const worldX = Number.isFinite(Number(this._scene?._playerWorldX)) ? Number(this._scene._playerWorldX) : 0;
    const oldWorldY = b(oldGameY);
    const newWorldY = b(newGameY);
    const midWorldY = (oldWorldY + newWorldY) * 0.5;
    const goingUpOnScreen = newWorldY < oldWorldY;
    const oldCircle = this._scene.add.circle(worldX, oldWorldY, 30, teleportTint, 0.45);
    oldCircle.setDepth(7.5);
    oldCircle.setBlendMode(S);
    oldCircle.setScale(0.85);
    this._gameLayer?.container?.add?.(oldCircle);
    this._spiderTeleportCircles.push(oldCircle);
    this._scene.tweens.add({
      targets: oldCircle,
      scaleX: 0.03,
      scaleY: 0.03,
      alpha: 0,
      duration: circleDuration * 750,
      ease: "Cubic.easeOut",
      onComplete: () => {
        const idx = this._spiderTeleportCircles.indexOf(oldCircle);
        if (idx >= 0) this._spiderTeleportCircles.splice(idx, 1);
        if (oldCircle?.destroy) oldCircle.destroy();
      }
    });

    const circle = this._scene.add.circle(worldX, newWorldY, 44, teleportTint, 1);
    circle.setDepth(7.55);
    circle.setBlendMode(S);
    circle.setScale(1.25);
    this._gameLayer?.container?.add?.(circle);
    this._spiderTeleportCircles.push(circle);
    this._scene.tweens.add({
      targets: circle,
      x: worldX + (this.p.mirrored ? 28 : -28),
      scaleX: 0.05,
      scaleY: 0.05,
      alpha: 0,
      duration: circleDuration * 1000,
      ease: "Cubic.easeOut",
      onComplete: () => {
        const idx = this._spiderTeleportCircles.indexOf(circle);
        if (idx >= 0) this._spiderTeleportCircles.splice(idx, 1);
        if (circle?.destroy) circle.destroy();
      }
    });

    if (this._spiderDashEffectSprite && _textureHasFrameSafe(this._scene, "GJ_GameSheet04", "spiderDash_001.png")) {
      this._spiderDashEffectTimer = duration;
      this._spiderDashEffectDuration = duration;
      this._spiderDashEffectSprite.setTexture("GJ_GameSheet04", "spiderDash_001.png");
      this._spiderDashEffectSprite.x = worldX;
      this._spiderDashEffectSprite.y = midWorldY;
      this._spiderDashEffectSprite.rotation = Phaser.Math.DegToRad(goingUpOnScreen ? 90 : -90);
      const baseLength = 400;
      const teleportDistance = Math.abs(newWorldY - oldWorldY);
      const dashLength = Math.max(0.12, teleportDistance / baseLength);
      this._spiderDashEffectSprite.scaleX = dashLength;
      this._spiderDashEffectSprite.scaleY = 0.8;
      this._spiderDashEffectSprite.setTint(teleportTint);
      this._spiderDashEffectSprite.setAlpha(1);
      this._spiderDashEffectSprite.setVisible(true);
    }
  }

  _updateSpiderTeleportEffects(dt) {
    if (!this.p.isSpider || this._scene?._editorPlaytestActive) {
      if (this._spiderDashEffectSprite) this._spiderDashEffectSprite.setVisible(false);
      if (this._spiderTeleportCircles?.length) {
        for (const circle of this._spiderTeleportCircles) if (circle?.destroy) circle.destroy();
        this._spiderTeleportCircles = [];
      }
      this._spiderDashEffectTimer = 0;
      return;
    }
    if (this.p.isDead && this._spiderTeleportCircles?.length) {
      for (const circle of this._spiderTeleportCircles) if (circle?.destroy) circle.destroy();
      this._spiderTeleportCircles = [];
    }
    if (!this._spiderDashEffectSprite || this._spiderDashEffectTimer <= 0) {
      if (this._spiderDashEffectSprite) this._spiderDashEffectSprite.setVisible(false);
      return;
    }
    const duration = Math.max(0.001, Number(this._spiderDashEffectDuration || 0.5));
    this._spiderDashEffectTimer = Math.max(0, this._spiderDashEffectTimer - Math.max(0, dt || 0));
    const progress = Math.max(0, Math.min(1, (duration - this._spiderDashEffectTimer) / duration));
    const frameIndex = Math.min(8, Math.max(1, Math.floor(progress * 8) + 1));
    const frameName = `spiderDash_${String(frameIndex).padStart(3, "0")}.png`;
    if (_textureHasFrameSafe(this._scene, "GJ_GameSheet04", frameName)) {
      this._spiderDashEffectSprite.setTexture("GJ_GameSheet04", frameName);
    }
    this._spiderDashEffectSprite.setAlpha(Math.max(0, 1 - progress));
    this._spiderDashEffectSprite.setVisible(this._spiderDashEffectTimer > 0);
  }

  _syncSpiderAnimation(baseX, baseY, dt) {
    if (this.p.isDead || !this.p.isSpider || !this._spiderLayers?.length) {
      this.setSpiderVisible(false);
      return;
    }
    const frameKey = this._selectSpiderFrameKey(dt);
    const applied = this._applySpiderFrame(frameKey, baseX, baseY, dt);
    if (!applied) {
      for (const layer of this._spiderLayers) {
        if (!layer?.sprite) continue;
        layer.sprite.x = baseX;
        layer.sprite.y = baseY;
        layer.sprite.rotation = this.p.mirrored ? -this._rotation : this._rotation;
        const miniScale = this.p.isMini ? 0.6 : 1;
        layer.sprite.scaleX = (this.p.mirrored ? -miniScale : miniScale);
        layer.sprite.scaleY = (this.p.gravityFlipped ? -miniScale : miniScale);
        layer.sprite.setVisible(layer.kind === "glow" ? !!layer.sprite._glowEnabled : true);
      }
    }
  }
  _getRobotIconBase() {
    const rawBase = String(window.currentRobot || "robot_01");
    const match = rawBase.match(/^robot_\d+/);
    return match ? match[0] : "robot_01";
  }
  _resolveRobotIconFrame(frameName) {
    const base = this._getRobotIconBase();
    const resolved = String(frameName || "").replace(/^robot_\d+/, base);
    if (_textureHasFrameSafe(this._scene, "GJ_GameSheetIcons", resolved)) return resolved;
    if (_textureHasFrameSafe(this._scene, "GJ_GameSheetIcons", frameName)) return frameName;
    return resolved;
  }
  _getRobotAnimDesc() {
    if (this._robotAnimDesc !== undefined) return this._robotAnimDesc;
    let data = null;
    try {
      data = this._scene?.cache?.json?.get?.("Robot_AnimDesc") || null;
    } catch (err) {
      data = null;
    }
    if (!data && typeof window !== "undefined") data = window.Robot_AnimDesc || null;
    if (!data || !data.animationContainer) {
      this._robotFrameGroups = {};
      return null;
    }
    this._robotAnimDesc = data;
    this._robotFrameGroups = {};
    const frameKeys = Object.keys(data.animationContainer);
    const sortBySuffix = (a, b) => {
      const aa = parseInt((String(a).match(/_(\d+)\.png$/) || [0, 0])[1], 10) || 0;
      const bb = parseInt((String(b).match(/_(\d+)\.png$/) || [0, 0])[1], 10) || 0;
      return aa - bb;
    };
    this._robotFrameGroups.run = frameKeys.filter(k => /^Robot_run_\d+\.png$/.test(k)).sort(sortBySuffix);
    this._robotFrameGroups.run2 = frameKeys.filter(k => /^Robot_run2_\d+\.png$/.test(k)).sort(sortBySuffix);
    this._robotFrameGroups.run3 = frameKeys.filter(k => /^Robot_run3_\d+\.png$/.test(k)).sort(sortBySuffix);
    this._robotFrameGroups.skip = frameKeys.filter(k => /^Robot_skip_\d+\.png$/.test(k)).sort(sortBySuffix);
    this._robotFrameGroups.jumpStart = frameKeys.filter(k => /^Robot_jump_start_\d+\.png$/.test(k)).sort(sortBySuffix);
    this._robotFrameGroups.jumpLoop = frameKeys.filter(k => /^Robot_jump_loop_\d+\.png$/.test(k)).sort(sortBySuffix);
    this._robotFrameGroups.fallStart = frameKeys.filter(k => /^Robot_fall_start_\d+\.png$/.test(k)).sort(sortBySuffix);
    this._robotFrameGroups.fallLoop = frameKeys.filter(k => /^Robot_fall_loop_\d+\.png$/.test(k)).sort(sortBySuffix);
    this._robotFrameGroups.idle = frameKeys.filter(k => /^Robot_idle_\d+\.png$/.test(k)).sort(sortBySuffix);
    this._robotFrameGroups.idle1 = frameKeys.filter(k => /^Robot_idle01_\d+\.png$/.test(k)).sort(sortBySuffix);
    this._robotFrameGroups.idle2 = frameKeys.filter(k => /^Robot_idle02_\d+\.png$/.test(k)).sort(sortBySuffix);
    return this._robotAnimDesc;
  }
  _createRobotLayerSet(scene, x, y, textureName, tag) {
    const resolvedBase = this._resolveRobotIconFrame(textureName);
    const layers = [];
    const makeLayer = (variant, tint, depthOffset) => {
      const frame = this._resolveRobotIconFrame(_spiderVariantFrameName(resolvedBase, variant));
      const layer = _makeAtlasLayer(scene, x, y, "GJ_GameSheetIcons", frame, 8 + tag * 0.1 + depthOffset, false, tint, variant);
      if (layer) layers.push(layer);
      return layer;
    };
    const glow = makeLayer("glow", this._secondaryColor(), -0.04);
    const base = makeLayer("base", this._primaryColor(), 0);
    const overlay = makeLayer("overlay", this._secondaryColor(), 0.04);
    const extra = makeLayer("extra", null, 0.08);
    return { tag, textureName, layers, glow, base, overlay, extra };
  }
  _initRobotAnimationParts(scene, x, y) {
    this._robotAnimTimer = 0;
    this._robotAnimState = "run";
    this._robotAnimDesc = undefined;
    this._robotPartsByTag = {};
    this._robotLayers = [];
    const desc = this._getRobotAnimDesc();
    const usedTextures = desc?.usedTextures || null;
    let entries = [];
    if (usedTextures) {
      entries = Object.values(usedTextures).slice().sort((a, b) => (parseInt(a.tag || "0", 10) || 0) - (parseInt(b.tag || "0", 10) || 0));
    }
    if (!entries.length) {
      entries = [
        { tag: "0", texture: "robot_01_03_001.png" },
        { tag: "1", texture: "robot_01_02_001.png" },
        { tag: "2", texture: "robot_01_04_001.png" },
        { tag: "3", texture: "robot_01_01_001.png" },
        { tag: "4", texture: "robot_01_03_001.png" },
        { tag: "5", texture: "robot_01_02_001.png" },
        { tag: "6", texture: "robot_01_04_001.png" }
      ];
    }
    for (const entry of entries) {
      const tag = parseInt(entry.tag || "0", 10) || 0;
      const part = this._createRobotLayerSet(scene, x, y, entry.texture, tag);
      if (!part.layers.length) continue;
      this._robotPartsByTag[tag] = part;
      this._robotLayers.push(...part.layers);
    }
  }
  _selectRobotFrameKey(dt) {
    const desc = this._getRobotAnimDesc();
    if (!desc?.animationContainer) return null;
    const _speedPortalRef = (typeof SpeedPortal !== "undefined" && SpeedPortal) ? SpeedPortal : null;
    const _oneSpeed = Number(_speedPortalRef?.ONE_TIMES ?? 11.540004) || 11.540004;
    const _halfSpeed = Number(_speedPortalRef?.HALF ?? (_oneSpeed * 0.8)) || (_oneSpeed * 0.8);
    const _fourSpeed = Number(_speedPortalRef?.FOUR_TIMES ?? (_oneSpeed * 1.85)) || (_oneSpeed * 1.85);
    const _activeSpeed = Number.isFinite(Number(playerSpeed)) ? Number(playerSpeed) : _oneSpeed;
    let robotAnimationSpeed = 1.75;
    if (_activeSpeed >= _oneSpeed) {
      const _fastT = Math.max(0, Math.min(1, (_activeSpeed - _oneSpeed) / Math.max(1e-6, _fourSpeed - _oneSpeed)));
      robotAnimationSpeed = 1.75 + _fastT * 0.35;
    } else {
      const _slowT = Math.max(0, Math.min(1, (_oneSpeed - _activeSpeed) / Math.max(1e-6, _oneSpeed - _halfSpeed)));
      robotAnimationSpeed = 1.75 - _slowT * 0.15;
    }
    robotAnimationSpeed *= 1.2;

    const grounded = this.p.onGround || this.p.onCeiling;
    const goingUp = this.p.gravityFlipped ? this.p.yVelocity < 0 : this.p.yVelocity > 0;
    const nextState = grounded ? "run" : (goingUp ? "jump" : "fall");
    if (this._robotAnimState !== nextState) {
      this._robotAnimState = nextState;
      this._robotAnimTimer = 0;
    }
    this._robotAnimTimer = (this._robotAnimTimer || 0) + Math.max(0, dt || 0) * robotAnimationSpeed;

    const pickFromStartThenLoop = (startGroup, loopGroup, fps) => {
      const start = startGroup || [];
      const loop = loopGroup || [];
      if (start.length) {
        const startDuration = start.length / fps;
        if (this._robotAnimTimer < startDuration || !loop.length) {
          return start[Math.min(start.length - 1, Math.floor(this._robotAnimTimer * fps))];
        }
        const loopTime = this._robotAnimTimer - startDuration;
        return loop[Math.floor(loopTime * fps) % loop.length];
      }
      if (loop.length) return loop[Math.floor(this._robotAnimTimer * fps) % loop.length];
      return null;
    };

    if (this.p.isDashing) {
      const group = this._robotFrameGroups.fallLoop;
      return group[Math.floor(this._robotAnimTimer * 16) % group.length];
    }
    if (nextState === "run") {
      const group = this._robotFrameGroups?.run?.length ? this._robotFrameGroups.run : (this._robotFrameGroups?.idle1 || this._robotFrameGroups?.idle || []);
      if (group?.length) return group[Math.floor(this._robotAnimTimer * 16) % group.length];
    } else if (nextState === "jump") {
      const frame = pickFromStartThenLoop(this._robotFrameGroups?.jumpStart, this._robotFrameGroups?.jumpLoop, 15);
      if (frame) return frame;
    } else {
      const frame = pickFromStartThenLoop(this._robotFrameGroups?.fallStart, this._robotFrameGroups?.fallLoop, 15);
      if (frame) return frame;
    }
    return desc.animationContainer["Robot_idle_001.png"] ? "Robot_idle_001.png" : null;
  }
  _applyRobotFrame(frameKey, baseX, baseY, dt) {
    const desc = this._getRobotAnimDesc();
    const frame = frameKey && desc?.animationContainer ? desc.animationContainer[frameKey] : null;
    if (!frame || !this._robotPartsByTag) return false;
    const miniScale = this.p.isMini ? 0.6 : 1;
    const mirrorSign = this.p.mirrored ? -1 : 1;
    const gravitySign = this.p.gravityFlipped ? -1 : 1;
    const positionYSign = this.p.gravityFlipped ? 1 : -1;
    const seenTags = new Set();
    const robotFootTags = [2, 6];
    const robotFootPoints = [];
    const robotLegPoints = [];

    for (const spriteKey of Object.keys(frame)) {
      if (!spriteKey.startsWith("sprite_")) continue;
      const spriteData = frame[spriteKey];
      const tag = parseInt(spriteData.tag || "0", 10) || 0;
      const part = this._robotPartsByTag[tag];
      if (!part) continue;
      seenTags.add(tag);
      const pos = _parseAnimPair(spriteData.position, 0, 0);
      const robotLegTags = [0, 2, 4, 6];
      const robotArmTags = [1, 5];
      const isRobotLegTag = robotLegTags.includes(tag);
      const isRobotArmTag = robotArmTags.includes(tag);
      const robotLocalYOffset = tag === 3 ? 5 : (isRobotArmTag ? -1 : (isRobotLegTag ? -9 : 0));
      const robotLocalXScale = (isRobotLegTag || isRobotArmTag) ? 1.8 : 1;
      const sc = _parseAnimPair(spriteData.scale, 1, 1);
      const fl = _parseAnimPair(spriteData.flipped, 0, 0);
      const zValue = parseFloat(spriteData.zValue || tag || "0") || 0;
      const rotDeg = parseFloat(spriteData.rotation || "0") || 0;
      const baseTexture = this._resolveRobotIconFrame(spriteData.texture || part.textureName);
      const resolvedFrames = {
        glow: this._resolveRobotIconFrame(_spiderVariantFrameName(baseTexture, "glow")),
        base: this._resolveRobotIconFrame(baseTexture),
        overlay: this._resolveRobotIconFrame(_spiderVariantFrameName(baseTexture, "overlay")),
        extra: this._resolveRobotIconFrame(_spiderVariantFrameName(baseTexture, "extra"))
      };
      const commonX = baseX + pos.x * robotLocalXScale * mirrorSign * miniScale;
      const commonY = baseY + (pos.y + robotLocalYOffset) * positionYSign * miniScale;
      let commonRot = rotDeg * Math.PI / 180;
      if (this.p.mirrored) commonRot = -commonRot;
      if (this.p.gravityFlipped) commonRot = -commonRot;
      const baseScaleX = sc.x * (fl.x ? -1 : 1) * mirrorSign * miniScale;
      const baseScaleY = sc.y * (fl.y ? -1 : 1) * gravitySign * miniScale;

      const applyLayer = (layer, kind, depthOffset) => {
        if (!layer?.sprite) return;
        const frameName = resolvedFrames[kind];
        if (!_textureHasFrameSafe(this._scene, "GJ_GameSheetIcons", frameName)) {
          layer.sprite.setVisible(false);
          return;
        }
        layer.sprite.setTexture("GJ_GameSheetIcons", frameName);
        layer.sprite.x = commonX;
        layer.sprite.y = commonY;
        layer.sprite.rotation = commonRot;
        layer.sprite.scaleX = baseScaleX;
        layer.sprite.scaleY = baseScaleY;
        layer.sprite.setDepth(8 + zValue * 0.1 + depthOffset);

        const normalTint = this._tintForLayerKind(kind);
        if (normalTint !== null && normalTint !== undefined) {
          layer.sprite.setTint(normalTint);
        } else if (typeof layer.sprite.clearTint === "function") {
          layer.sprite.clearTint();
        }
        layer.sprite.setVisible(kind === "glow" ? !!layer.sprite._glowEnabled : true);
      };
      applyLayer(part.glow, "glow", -0.04);
      applyLayer(part.base, "base", 0);
      applyLayer(part.overlay, "overlay", 0.04);
      applyLayer(part.extra, "extra", 0.08);

      const footSprite = part.base?.sprite || part.overlay?.sprite || part.extra?.sprite || part.glow?.sprite;
      if (footSprite && (robotFootTags.includes(tag) || isRobotLegTag)) {
        const footHalfHeight = Math.max(6 * miniScale, Math.abs(footSprite.displayHeight || (footSprite.height || 0) * baseScaleY) * 0.5);
        const footEdgeY = commonY + (this.p.gravityFlipped ? -footHalfHeight : footHalfHeight);
        const point = { x: commonX, y: footEdgeY };
        if (robotFootTags.includes(tag)) {
          robotFootPoints.push(point);
        } else if (isRobotLegTag) {
          robotLegPoints.push(point);
        }
      }
    }

    const flameAnchorPoints = robotFootPoints.length ? robotFootPoints : robotLegPoints;
    if (flameAnchorPoints.length) {
      let attachedFoot = flameAnchorPoints[0];
      for (const pt of flameAnchorPoints) {
        if (this.p.gravityFlipped ? pt.y < attachedFoot.y : pt.y > attachedFoot.y) {
          attachedFoot = pt;
        }
      }
      this._robotJumpFlameAnchorX = attachedFoot.x;
      this._robotJumpFlameAnchorY = attachedFoot.y;
    }
    for (const tag of Object.keys(this._robotPartsByTag)) {
      if (seenTags.has(parseInt(tag, 10))) continue;
      const part = this._robotPartsByTag[tag];
      for (const layer of part.layers) layer?.sprite?.setVisible(false);
    }
    return true;
  }
  _hideRobotJumpFlame() {
    if (!this._robotJumpFlameSprite) return;
    this._robotJumpFlameSprite.setVisible(false);
    this._robotJumpFlameSprite.setAlpha(0);
  }
  _updateRobotJumpFlame(dt) {
    if (!this._robotJumpFlameSprite) return;
    const goingUp = this.p.gravityFlipped ? this.p.yVelocity < -0.01 : this.p.yVelocity > 0.01;
    if (!this._robotJumpFlameActive || this.p.isDead || !this.p.isRobot || !goingUp || this.p.onGround || this._endAnimating) {
      this._robotJumpFlameActive = false;
      this._hideRobotJumpFlame();
      return;
    }
    const upwardVelocity = Math.max(0, this.p.gravityFlipped ? -this.p.yVelocity : this.p.yVelocity);
    const fadeThreshold = this.p.isMini ? 7 : 10;
    const fade = Math.max(0, Math.min(1, upwardVelocity / Math.max(0.001, fadeThreshold)));
    if (fade <= 0.02) {
      this._robotJumpFlameActive = false;
      this._hideRobotJumpFlame();
      return;
    }
    const miniScale = this.p.isMini ? 0.8 : 1.2;
    this._robotJumpFlameFadeInTimer = (this._robotJumpFlameFadeInTimer || 0) + Math.max(0, dt || 0);
    const fadeIn = Math.max(0, Math.min(1, this._robotJumpFlameFadeInTimer / 0.24));
    const visibleFade = Math.min(fade, fadeIn);
    this._robotJumpFlamePulse = (this._robotJumpFlamePulse || 0) + Math.max(0, dt || 0) * (Math.PI * 4);
    const pulse = (Math.sin(this._robotJumpFlamePulse) + 1) * 0.5;
    const stretchY = 0.8 + 0.4 * pulse;
    const overallScale = 0.82 * miniScale * visibleFade;
    this._robotJumpFlameSprite.setPosition(
      this._robotJumpFlameAnchorX,
      this._robotJumpFlameAnchorY
    );
    this._robotJumpFlameSprite.setScale(overallScale, overallScale * stretchY * (this.p.gravityFlipped ? -1 : 1));
    this._robotJumpFlameSprite.setAlpha(Math.max(0, Math.min(1, visibleFade)));
    this._robotJumpFlameSprite.setVisible(true);
  }
  _syncRobotAnimation(baseX, baseY, dt) {
    if (this.p.isDead || !this.p.isRobot || !this._robotLayers?.length) {
      this.setRobotVisible(false);
      return;
    }
    const frameKey = this._selectRobotFrameKey(dt);
    const applied = this._applyRobotFrame(frameKey, baseX, baseY, dt);
    if (!applied) {
      for (const layer of this._robotLayers) {
        if (!layer?.sprite) continue;
        layer.sprite.x = baseX;
        layer.sprite.y = baseY;
        layer.sprite.rotation = this.p.mirrored ? -this._rotation : this._rotation;
        const miniScale = this.p.isMini ? 0.6 : 1;
        layer.sprite.scaleX = (this.p.mirrored ? -miniScale : miniScale);
        layer.sprite.scaleY = (this.p.gravityFlipped ? -miniScale : miniScale);
        layer.sprite.setVisible(layer.kind === "glow" ? !!layer.sprite._glowEnabled : true);
      }
      this._robotJumpFlameAnchorX = baseX;
      this._robotJumpFlameAnchorY = baseY + (this.p.gravityFlipped ? (-8 * (this.p.isMini ? 0.6 : 1)) : (8 * (this.p.isMini ? 0.6 : 1)));
    }
  }

  _createSprites() {
    const spriteY = this._scene;
    const spriteX = b(this.p.y);
    const particleY = centerX;
    this._playerGlowLayer = ds(spriteY, particleY, spriteX, `${window.currentPlayer}_glow_001.png`, 9, false);
    this._playerSpriteLayer = ds(spriteY, particleY, spriteX, `${window.currentPlayer}_001.png`, 10, true);
    this._playerOverlayLayer = ds(spriteY, particleY, spriteX, `${window.currentPlayer}_2_001.png`, 8, true);
    this._playerExtraLayer = ds(spriteY, particleY, spriteX, `${window.currentPlayer}_extra_001.png`, 12, true);
    if (this._playerGlowLayer) {
      this._playerGlowLayer.sprite.setTint(this._secondaryColor());
      this._playerGlowLayer.sprite._glowEnabled = false;
    }
    if (this._playerSpriteLayer) {
      this._playerSpriteLayer.sprite.setTint(this._primaryColor());
    } else {
      let _0x3aecd9 = spriteY.add.rectangle(particleY, spriteX, g, g, this._primaryColor());
      _0x3aecd9.setDepth(10);
      this._playerSpriteLayer = {
        sprite: _0x3aecd9
      };
    }
    if (this._playerOverlayLayer) {
      this._playerOverlayLayer.sprite.setTint(this._secondaryColor());
    }
    this._shipGlowLayer = ds(spriteY, particleY, spriteX, `${window.currentShip}_glow_001.png`, 9, false);
    this._shipSpriteLayer = ds(spriteY, particleY, spriteX, `${window.currentShip}_001.png`, 10, false);
    this._shipOverlayLayer = ds(spriteY, particleY, spriteX, `${window.currentShip}_2_001.png`, 8, false);
    this._shipExtraLayer = ds(spriteY, particleY, spriteX, `${window.currentShip}_extra_001.png`, 12, false);
    if (this._shipGlowLayer) {
      this._shipGlowLayer.sprite.setTint(this._secondaryColor());
      this._shipGlowLayer.sprite._glowEnabled = false;
    }
    if (this._shipSpriteLayer) {
      this._shipSpriteLayer.sprite.setTint(this._primaryColor());
    } else {
      let _0x100643 = spriteY.add.polygon(particleY, spriteX, [{
        x: -72,
        y: 40
      }, {
        x: 72,
        y: 0
      }, {
        x: -72,
        y: -40
      }, {
        x: -40,
        y: 0
      }], this._primaryColor());
      _0x100643.setDepth(10).setVisible(false);
      this._shipSpriteLayer = {
        sprite: _0x100643
      };
    }
    if (this._shipOverlayLayer) {
      this._shipOverlayLayer.sprite.setTint(this._secondaryColor());
    }
    this._ballGlowLayer = ds(spriteY, particleY, spriteX, `${window.currentBall}_glow_001.png`, 9, false);
    this._ballSpriteLayer = ds(spriteY, particleY, spriteX, `${window.currentBall}_001.png`, 10, false);
    this._ballOverlayLayer = ds(spriteY, particleY, spriteX, `${window.currentBall}_2_001.png`, 8, false);
    if (this._ballGlowLayer) {
      this._ballGlowLayer.sprite.setTint(this._secondaryColor());
      this._ballGlowLayer.sprite._glowEnabled = false;
    }
    if (this._ballSpriteLayer) {
      this._ballSpriteLayer.sprite.setTint(this._primaryColor());
    }
    if (this._ballOverlayLayer) {
      this._ballOverlayLayer.sprite.setTint(this._secondaryColor());
    }
    this._waveGlowLayer = ds(spriteY, particleY, spriteX, `${window.currentWave}_glow_001.png`, 9, false);
    this._waveOverlayLayer = ds(spriteY, particleY, spriteX, `${window.currentWave}_2_001.png`, 8, false);
    this._waveExtraLayer = null;
    this._waveSpriteLayer = ds(spriteY, particleY, spriteX, `${window.currentWave}_001.png`, 10, false);
    if (this._waveGlowLayer) {
      this._waveGlowLayer.sprite.setTint(this._secondaryColor());
      this._waveGlowLayer.sprite._glowEnabled = false;
    }
    if (this._waveSpriteLayer) {
      this._waveSpriteLayer.sprite.setTint(this._primaryColor());
    }
    if (this._waveOverlayLayer) {
      this._waveOverlayLayer.sprite.setTint(this._secondaryColor());
    }
    this.playerSprite = this._playerSpriteLayer.sprite;
    this.shipSprite = this._shipSpriteLayer.sprite;
    this._playerLayers = [this._playerSpriteLayer, this._playerGlowLayer, this._playerOverlayLayer, this._playerExtraLayer];
    this._shipLayers = [this._shipSpriteLayer, this._shipGlowLayer, this._shipOverlayLayer, this._shipExtraLayer];
    this._ballLayers = [this._ballSpriteLayer, this._ballGlowLayer, this._ballOverlayLayer].filter(_0x37ad93 => !!_0x37ad93);
    this._waveLayers = [this._waveSpriteLayer, this._waveOverlayLayer, this._waveExtraLayer, this._waveGlowLayer].filter(_0x37ad93 => !!_0x37ad93);
    this._initSpiderAnimationParts(spriteY, particleY, spriteX);
    this._spiderSpriteLayer = this._spiderLayers.find(layer => layer.kind === "base") || null;
    this._spiderGlowLayer = this._spiderLayers.find(layer => layer.kind === "glow") || null;
    this._spiderOverlayLayer = this._spiderLayers.find(layer => layer.kind === "overlay") || null;
    this._spiderExtraLayer = this._spiderLayers.find(layer => layer.kind === "extra") || null;
    this._initRobotAnimationParts(spriteY, particleY, spriteX);
    this._robotSpriteLayer = this._robotLayers.find(layer => layer.kind === "base") || null;
    this._robotGlowLayer = this._robotLayers.find(layer => layer.kind === "glow") || null;
    this._robotOverlayLayer = this._robotLayers.find(layer => layer.kind === "overlay") || null;
    this._robotExtraLayer = this._robotLayers.find(layer => layer.kind === "extra") || null;
    this._birdSpriteLayer = ds(spriteY, particleY, spriteX, `${window.currentBird}_001.png`, 10, false);
    this._birdGlowLayer = ds(spriteY, particleY, spriteX, `${window.currentBird}_2_001.png`, 9, false);
    this._birdOverlayLayer = ds(spriteY, particleY, spriteX, `${window.currentBird}_3_001.png`, 8, false);
    this._birdExtraLayer = ds(spriteY, particleY, spriteX, `${window.currentBird}_extra_001.png`, 12, false);
    if (this._birdSpriteLayer) {
      this._birdSpriteLayer.sprite.setTint(this._primaryColor());
    }
    if (this._birdGlowLayer) {
      this._birdGlowLayer.sprite.setTint(this._secondaryColor());
      this._birdGlowLayer.sprite._glowEnabled = false;
    }
    if (this._birdOverlayLayer) {
      this._birdOverlayLayer.sprite.setTint(this._secondaryColor());
    }
    this._birdLayers = [this._birdSpriteLayer, this._birdGlowLayer, this._birdOverlayLayer, this._birdExtraLayer].filter(x => !!x);

    this._allLayers = [...this._playerLayers, ...this._ballLayers, ...this._waveLayers, ...this._shipLayers, ...this._spiderLayers, ...this._robotLayers, ...this._birdLayers];
    this._applyPlayerTints();
    
    this._dashAnimationSprite = spriteY.add.image(particleY, spriteX, "GJ_GameSheetGlow", "playerDash2_001.png");
    this._dashAnimationSprite.setDepth(7);
    this._dashAnimationSprite.setVisible(false);
    this._dashAnimationSprite.setTint(0xffffff);
    this._dashAnimationSprite.setBlendMode('ADD');
    this._spiderDashEffectSprite = null;
    if (_textureHasFrameSafe(spriteY, "GJ_GameSheet04", "spiderDash_001.png")) {
      this._spiderDashEffectSprite = spriteY.add.image(particleY, spriteX, "GJ_GameSheet04", "spiderDash_001.png");
      this._spiderDashEffectSprite.setDepth(7.7);
      this._spiderDashEffectSprite.setVisible(false);
      this._spiderDashEffectSprite.setAlpha(0);
      this._gameLayer?.container?.add?.(this._spiderDashEffectSprite);
      this._spiderDashEffectSprite.setBlendMode('ADD');
    }
    if (_textureHasFrameSafe(spriteY, "GJ_GameSheetIcons", "fireBoost_001.png")) {
      this._robotJumpFlameSprite = spriteY.add.image(particleY, spriteX, "GJ_GameSheetIcons", "fireBoost_001.png");
      this._robotJumpFlameSprite.setDepth(7.75);
      this._robotJumpFlameSprite.setVisible(false);
      this._robotJumpFlameSprite.setAlpha(0);
      this._robotJumpFlameSprite.setOrigin(0.5, 0);
      this._robotJumpFlameSprite.setBlendMode('ADD');
    }
  }
  _updateDashAnimation(deltaTime) {
    if (this._scene?._editorPlaytestActive) {
      if (this._dashAnimationSprite) this._dashAnimationSprite.setVisible(false);
      return;
    }

    if (!this._dashAnimationSprite) return;
    if (this.p.isDashing) {
      this._dashAnimationSprite.setVisible(true);
      this._dashAnimationTimer += deltaTime;
      if (this._dashAnimationTimer >= 16.67) {
        this._dashAnimationTimer = 0;
        this._dashAnimationFrame = (this._dashAnimationFrame % 12) + 1;
        const frameName = `playerDash2_${String(this._dashAnimationFrame).padStart(3, '0')}.png`;
        this._dashAnimationSprite.setFrame(frameName);
      }
    } else {
      this._dashAnimationSprite.setVisible(false);
      this._dashAnimationFrame = 0;
      this._dashAnimationTimer = 0;
    }
  }
  _initParticles(scene) {
    this._particleEmitter = scene.add.particles(0, 0, "GJ_WebSheet", {
      frame: "square.png",
      speed: {
        min: 110,
        max: 190
      },
      angle: {
        min: 225,
        max: 315
      },
      lifespan: {
        min: 150,
        max: 450
      },
      scale: {
        start: 0.5,
        end: 0
      },
      gravityY: 600,
      frequency: 1000 / 30,
      blendMode: "ADD",
      alpha: {
        start: 1,
        end: 0
      },
      tint: this._primaryColor()
    });
    this._particleEmitter.stop();
    this._particleEmitter.setDepth(9);
    this._gameLayer.container.add(this._particleEmitter);
    this._flyParticleEmitter = scene.add.particles(0, 0, "GJ_WebSheet", {
      frame: "square.png",
      speed: {
        min: 22,
        max: 38
      },
      angle: {
        min: 225,
        max: 315
      },
      lifespan: {
        min: 150,
        max: 450
      },
      scale: {
        start: 0.5,
        end: 0
      },
      gravityY: 600,
      frequency: 1000 / 30,
      blendMode: "ADD",
      tint: {
        start: 16737280,
        end: 16711680
      },
      alpha: {
        start: 1,
        end: 0
      }
    });
    this._flyParticleEmitter.stop();
    this._flyParticleEmitter.setDepth(9);
    this._gameLayer.container.add(this._flyParticleEmitter);
    this._flyParticle2Emitter = scene.add.particles(0, 0, "GJ_WebSheet", {
      frame: "square.png",
      speed: {
        min: 220,
        max: 380
      },
      angle: {
        min: 180,
        max: 360
      },
      lifespan: {
        min: 150,
        max: 450
      },
      scale: {
        start: 0.75,
        end: 0
      },
      gravityY: 600,
      frequency: 1000 / 30,
      blendMode: "ADD",
      tint: {
        start: 16760320,
        end: 16711680
      },
      alpha: {
        start: 1,
        end: 0
      }
    });
    this._flyParticle2Emitter.stop();
    this._flyParticle2Emitter.setDepth(9);
    this._gameLayer.container.add(this._flyParticle2Emitter);
    this._shipDragEmitter = scene.add.particles(0, 0, "GJ_WebSheet", {
      frame: "square.png",
      x: {
        min: -18,
        max: 18
      },
      speed: {
        min: 223.79999999999998,
        max: 343.79999999999995
      },
      angle: {
        min: 205,
        max: 295
      },
      lifespan: {
        min: 80,
        max: 220
      },
      scale: {
        start: 0.375,
        end: 0
      },
      gravityX: -700,
      gravityY: 600,
      frequency: 25,
      blendMode: "ADD",
      alpha: {
        start: 1,
        end: 0
      }
    });
    this._shipDragEmitter.stop();
    this._shipDragEmitter.setDepth(22);
    this._gameLayer.container.add(this._shipDragEmitter);
    this._shipDragActive = false;
    this._particleActive = false;
    this._flyParticle2Active = false;
    this._flyParticleActive = false;
    const _0x57911a = {
      frame: "square.png",
      speed: {
        min: 250,
        max: 350
      },
      angle: {
        min: 210,
        max: 330
      },
      lifespan: {
        min: 50,
        max: 600
      },
      scale: {
        start: 0.625,
        end: 0
      },
      gravityY: 1000,
      blendMode: "ADD",
      alpha: {
        start: 1,
        end: 0
      },
      tint: this._primaryColor(),
      emitting: false
    };
    this._landEmitter1 = scene.add.particles(0, 0, "GJ_WebSheet", {
      ..._0x57911a
    });
    this._landEmitter2 = scene.add.particles(0, 0, "GJ_WebSheet", {
      ..._0x57911a
    });
    this._aboveContainer = scene.add.container(0, 0);
    this._aboveContainer.setDepth(13);
    this._gameLayer.topContainer.add(this._landEmitter1);
    this._gameLayer.topContainer.add(this._landEmitter2);
    this._landIdx = false;
    this._streak = new StreakManager(this._scene, "streak_01", 0.231, 10, 8, 100, this._secondaryColor(), 0.7);
    this._streak.addToContainer(this._gameLayer.container, 8);
    this._waveTrail = new WaveTrail(this._scene, this._primaryColor(), this._primaryColor());
    this._waveTrail.addToContainer(this._gameLayer.container, 9);
  }
  _updateParticles(_0xc43238, _0x52b718, _0x5af874) {
    if (this._scene?._editorPlaytestActive) {
      this._particleEmitter.stop();
      this._particleActive = false;
      this._flyParticleEmitter.stop();
      this._flyParticleActive = false;
      this._flyParticle2Emitter.stop();
      this._flyParticle2Active = false;
      this._shipDragEmitter.stop();
      this._shipDragActive = false;
      this._streak.stop();
      this._streak.reset();
      this._waveTrail.stop();
      this._waveTrail.reset();
      return;
    }

    if (this.p.isDead) {
      return;
    }
    const _0x119eb7 = this._scene._playerWorldX;
    const _0x519d38 = b(this.p.y);
    this._particleEmitter.particleX = _0x119eb7 - 20;
    this._particleEmitter.particleY = _0x519d38 + (this.p.gravityFlipped ? (-26 + (this.p.isUfo ? -5 : 0)) : (26 + (this.p.isUfo ? 5 : 0)));
    const _0x4436ac = this.p.onGround && !this.p.isFlying && !this.p.isWave;
    if (_0x4436ac && !this._particleActive) {
      this._particleEmitter.start();
      this._particleActive = true;
    } else if (!_0x4436ac && this._particleActive) {
      this._particleEmitter.stop();
      this._particleActive = false;
    }
    {
      const _0xe76a85 = Math.cos(this._rotation);
      const _0x26ec65 = Math.sin(this._rotation);
      const _0x216018 = this.p.isWave ? 0 : (this.p.isUfo ? 0 : -24);
      const _0x2baeac = (this.p.isWave ? 4 : (this.p.isUfo ? 5 : 18)) * (this.p.gravityFlipped ? -1 : 1);
      const _0x75c380 = _0x119eb7 + _0x216018 * _0xe76a85 - _0x2baeac * _0x26ec65;
      const _0x2b31d7 = _0x519d38 + _0x216018 * _0x26ec65 + _0x2baeac * _0xe76a85;
      const _0x5d66f4 = (Math.random() * 2 - 1) * 2 * 2;
      this._flyParticleEmitter.particleX = _0x75c380;
      this._flyParticleEmitter.particleY = _0x2b31d7 + _0x5d66f4;
      this._flyParticle2Emitter.particleX = _0x75c380;
      this._flyParticle2Emitter.particleY = _0x2b31d7 + _0x5d66f4;
      this._streak.setPosition(this.p.isWave ? _0x75c380 : (this.p.isUfo ? _0x75c380 : _0x75c380 + 8), _0x2b31d7);
      this._waveTrail.setPosition(_0x119eb7, _0x519d38);
    }
    this._streak.update(_0x5af874);
    this._waveTrail.setMiniScale(this.p.isMini);
    this._waveTrail.update(_0x5af874);
    const _0x3d69d2 = this.p.isFlying || this.p.isUfo;
    if (_0x3d69d2 && !this._flyParticleActive) {
      this._flyParticleEmitter.start();
      this._flyParticleActive = true;
    } else if (!_0x3d69d2 && this._flyParticleActive) {
      this._flyParticleEmitter.stop();
      this._flyParticleActive = false;
    }
    const _0x169e30 = (this.p.isFlying && this.p.upKeyDown) || (this.p.isUfo && this.p.isJumping);
    if (_0x169e30 && !this._flyParticle2Active) {
      this._flyParticle2Emitter.start();
      this._flyParticle2Active = true;
    } else if (!_0x169e30 && this._flyParticle2Active) {
      this._flyParticle2Emitter.stop();
      this._flyParticle2Active = false;
    }
    const _0x2e5643 = _0xc43238 + this._scene._getMirrorXOffset(_0x119eb7 - _0xc43238);
    this._shipDragEmitter.x = _0x2e5643;
    this._shipDragEmitter.particleY = this.p.gravityFlipped ? b(this.p.y) + _0x52b718 + 10 : b(this.p.y) + _0x52b718 + 30;
    this._shipDragEmitter.setAngle(this.p.mirrored ? {
      min: 245,
      max: 335
    } : {
      min: 205,
      max: 295
    });
    this._shipDragEmitter.gravityX = this.p.mirrored ? 700 : -700;
    this._shipDragEmitter.setScale(1, 1);
    const _0x2ac9d0 = this.p.isFlying && this.p.onGround && (this.p.gravityFlipped ? this.p.onCeiling : !this.p.onCeiling);
    if (_0x2ac9d0 && !this._shipDragActive) {
      this._shipDragEmitter.start();
      this._shipDragActive = true;
    } else if (!_0x2ac9d0 && this._shipDragActive) {
      this._shipDragEmitter.stop();
      this._shipDragActive = false;
    }
  }
  setCubeVisible(_0x411813) {
    this._playerSpriteLayer.sprite.setVisible(_0x411813);
    if (this._playerGlowLayer) {
      this._playerGlowLayer.sprite.setVisible(_0x411813 && this._playerGlowLayer.sprite._glowEnabled);
    }
    if (this._playerOverlayLayer) {
      this._playerOverlayLayer.sprite.setVisible(_0x411813);
    }
    if (this._playerExtraLayer) {
      this._playerExtraLayer.sprite.setVisible(_0x411813);
    }
  }
  setShipVisible(_0x1c5620) {
    this._shipSpriteLayer.sprite.setVisible(_0x1c5620);
    if (this._shipGlowLayer) {
      this._shipGlowLayer.sprite.setVisible(_0x1c5620 && this._shipGlowLayer.sprite._glowEnabled);
    }
    if (this._shipOverlayLayer) {
      this._shipOverlayLayer.sprite.setVisible(_0x1c5620);
    }
    if (this._shipExtraLayer) {
      this._shipExtraLayer.sprite.setVisible(_0x1c5620);
    }
  }
  setBirdVisible(v) {
    for (const layer of (this._birdLayers || [])) {
      if (layer === this._birdGlowLayer) {
        layer.sprite.setVisible(v && layer.sprite._glowEnabled);
      } else {
        layer.sprite.setVisible(v);
      }
    }
  }
  setBallVisible(_0x5685cf) {
    if (this._ballSpriteLayer) {
      this._ballSpriteLayer.sprite.setVisible(_0x5685cf);
    }
    if (this._ballGlowLayer) {
      this._ballGlowLayer.sprite.setVisible(_0x5685cf && this._ballGlowLayer.sprite._glowEnabled);
    }
    if (this._ballOverlayLayer) {
      this._ballOverlayLayer.sprite.setVisible(_0x5685cf);
    }
  }
  setWaveVisible(_0x2d078b) {
    if (this._waveSpriteLayer) {
      this._waveSpriteLayer.sprite.setVisible(_0x2d078b);
    }
    if (this._waveOverlayLayer) {
      this._waveOverlayLayer.sprite.setVisible(_0x2d078b);
    }
    if (this._waveExtraLayer) {
      this._waveExtraLayer.sprite.setVisible(_0x2d078b);
    }
    if (this._waveGlowLayer) {
      this._waveGlowLayer.sprite.setVisible(_0x2d078b && this._waveGlowLayer.sprite._glowEnabled);
    }
  }
  setSpiderVisible(v) {
    for (const layer of (this._spiderLayers || [])) {
      if (!layer?.sprite) continue;
      if (layer.kind === "glow") {
        layer.sprite.setVisible(v && !!layer.sprite._glowEnabled);
      } else {
        layer.sprite.setVisible(v);
      }
    }
  }
  setRobotVisible(v) {
    for (const layer of (this._robotLayers || [])) {
      if (!layer?.sprite) continue;
      if (layer.kind === "glow") {
        layer.sprite.setVisible(v && !!layer.sprite._glowEnabled);
      } else {
        layer.sprite.setVisible(v);
      }
    }
    if (!v) {
      this._hideRobotJumpFlame();
    }
  }
  _primeRobotAnimationFrame(dt = 1 / 30) {
    if (!this.p.isRobot || this.p.isDead || !this._robotLayers?.length) return;
    const screenX = Number.isFinite(this._lastScreenX) ? this._lastScreenX : centerX;
    const screenY = Number.isFinite(this._lastScreenY) ? this._lastScreenY : b(this.p.y) + (this._scene?._cameraY || 0);
    const frameKey = this._selectRobotFrameKey(dt);
    const applied = this._applyRobotFrame(frameKey, screenX, screenY, dt);
    if (!applied) {
      const miniScale = this.p.isMini ? 0.6 : 1;
      for (const layer of (this._robotLayers || [])) {
        if (!layer?.sprite) continue;
        layer.sprite.x = screenX;
        layer.sprite.y = screenY;
        layer.sprite.rotation = this.p.mirrored ? -this._rotation : this._rotation;
        layer.sprite.scaleX = this.p.mirrored ? -miniScale : miniScale;
        layer.sprite.scaleY = this.p.gravityFlipped ? -miniScale : miniScale;
      }
    }
    this.setRobotVisible(true);
  }
  _primeSpiderAnimationFrame(dt = 1 / 30) {
    if (!this.p.isSpider || this.p.isDead || !this._spiderLayers?.length) return;
    const screenX = Number.isFinite(this._lastScreenX) ? this._lastScreenX : centerX;
    const screenY = Number.isFinite(this._lastScreenY) ? this._lastScreenY : b(this.p.y) + (this._scene?._cameraY || 0);
    const frameKey = this._selectSpiderFrameKey(dt);
    const applied = this._applySpiderFrame(frameKey, screenX, screenY, dt);
    if (!applied) {
      const miniScale = this.p.isMini ? 0.6 : 1;
      for (const layer of (this._spiderLayers || [])) {
        if (!layer?.sprite) continue;
        layer.sprite.x = screenX;
        layer.sprite.y = screenY;
        layer.sprite.rotation = this.p.mirrored ? -this._rotation : this._rotation;
        layer.sprite.scaleX = this.p.mirrored ? -miniScale : miniScale;
        layer.sprite.scaleY = this.p.gravityFlipped ? -miniScale : miniScale;
      }
    }
    this.setSpiderVisible(true);
  }
  syncSprites(cameraX, cameraY, _0x3afedf, mirrorOffset) {
    if (this._endAnimating) {
      return;
    }
    const _0x7f0705 = mirrorOffset !== undefined ? mirrorOffset : centerX;
    const _0x1a433c = b(this.p.y) + cameraY;
    const playerRotation = this._rotation;
    this._lastCameraX = cameraX;
    this._lastCameraY = cameraY;
    this._lastScreenX = _0x7f0705;
    this._lastScreenY = _0x1a433c;
    this._aboveContainer.x = -cameraX;
    this._aboveContainer.y = cameraY;
if (this.p.isFlying || this.p.isUfo) {
      const _0x3904f8 = 10;
      const _miniS = this.p.isMini ? 0.6 : 1;
      const playerOffset = this.p.gravityFlipped ? (-30 * _miniS) : (10 * _miniS);  
      const cosRotation = Math.cos(playerRotation);
      const sinRotation = Math.sin(playerRotation);
	    const mirrored = this.p.mirrored ? -1 : 1;
      const _0x1b1d28 = -_0x3904f8 * sinRotation * mirrored;
      const _0x185f91 = _0x3904f8 * cosRotation; 
      const _0x562424 = playerOffset * sinRotation * mirrored;
      const _0x3011c9 = -playerOffset * cosRotation;
      const _ufoMode = this.p.isUfo && !this.p.isFlying;
      if (this.p.isFlying) {
        for (const layer of this._shipLayers) {
          if (layer) {
            const _miniS = this.p.isMini ? 0.6 : 1;
            layer.sprite.x = _0x7f0705 + _0x1b1d28;
            layer.sprite.y = _0x1a433c + _0x185f91 + (this.p.gravityFlipped ? (-20 * _miniS) : 0)
            layer.sprite.rotation = this.p.mirrored ? -playerRotation : playerRotation;
            layer.sprite.scaleY = this.p.gravityFlipped ? -_miniS : _miniS;
            layer.sprite.scaleX = this.p.mirrored ? -_miniS : _miniS;
          }
        }
      }
	if (this.p.isUfo && !this.p.isDead) {
        for (const layer of this._birdLayers) {
          if (layer) {
            layer.sprite.setVisible(true);
            layer.sprite.x = _0x7f0705 + _0x1b1d28;
            layer.sprite.y = _0x1a433c + _0x185f91 + (this.p.gravityFlipped ? -15 : 5);
            layer.sprite.rotation = this.p.mirrored ? -playerRotation : playerRotation;
            const _miniS = this.p.isMini ? 0.6 : 1;
            layer.sprite.scaleY = this.p.gravityFlipped ? -_miniS : _miniS;
            layer.sprite.scaleX = this.p.mirrored ? -_miniS : _miniS;
          }
        }
      }
      
      for (const playerLayerItem of this._playerLayers) {
        if (playerLayerItem) {
          const _miniS = this.p.isMini ? 0.6 : 1;
          playerLayerItem.sprite.x = _0x7f0705 + _0x562424;
          playerLayerItem.sprite.y = (_0x1a433c + _0x3011c9) + (this.p.isMini ? (8 * _miniS) : 0) + (this.p.gravityFlipped ? (-20 * _miniS) : 0);
          playerLayerItem.sprite.rotation = this.p.mirrored ? -playerRotation : playerRotation;
          const _shipCubeS = _miniS * 0.55;
          playerLayerItem.sprite.scaleY = this.p.gravityFlipped ? -_shipCubeS : _shipCubeS;
          playerLayerItem.sprite.scaleX = this.p.mirrored ? -_shipCubeS : _shipCubeS;
        }
      }
      if (_ufoMode) {
        const _ufoTilt = Math.max(-0.05, Math.min(0.05, -(this.p.y - this.p.lastY) * 0.008));
        for (const layer of this._birdLayers) {
          if (layer) {
            layer.sprite.rotation = this.p.mirrored ? -_ufoTilt : _ufoTilt;
          }
        }
		  for (const playerLayerItem of this._playerLayers) {
          if (playerLayerItem) {
            playerLayerItem.sprite.rotation = this.p.mirrored ? -_ufoTilt : _ufoTilt;
          }
        }
      }
    } else {
      for (const layer of this._spiderLayers) {
        if (layer) {
          layer.sprite.setVisible(false);
        }
      }
      
      for (const playerLayer of this._allLayers) {
        if (playerLayer) {
            playerLayer.sprite.x = _0x7f0705;
            playerLayer.sprite.y = _0x1a433c;
            const isBallLayer = this._ballLayers.includes(playerLayer);
            playerLayer.sprite.rotation = isBallLayer ? playerRotation : (this.p.mirrored ? -playerRotation : playerRotation);
            let _miniS = this.p.isMini ? 0.6 : 1;
            if (this.p.isWave && this._waveLayers.includes(playerLayer)) {
              _miniS *= 0.94; //fix wave size
            }
            playerLayer.sprite.scaleY = (this.p.gravityFlipped ? -_miniS : _miniS);
            playerLayer.sprite.scaleX = (this.p.mirrored ? -_miniS : _miniS);
        }
      }
      for (const layer of this._spiderLayers) {
        if (layer) {
          layer.sprite.setVisible(false);
        }
      }
      
      for (const playerLayer of this._allLayers) {
        if (playerLayer) {
            playerLayer.sprite.x = _0x7f0705;
            playerLayer.sprite.y = _0x1a433c;
            const isBallLayer = this._ballLayers.includes(playerLayer);
            playerLayer.sprite.rotation = isBallLayer ? playerRotation : (this.p.mirrored ? -playerRotation : playerRotation);
            let _miniS = this.p.isMini ? 0.6 : 1;
            if (this.p.isWave && this._waveLayers.includes(playerLayer)) {
              _miniS *= 0.94; //fix wave size
            }
            playerLayer.sprite.scaleY = (this.p.gravityFlipped ? -_miniS : _miniS);
            playerLayer.sprite.scaleX = (this.p.mirrored ? -_miniS : _miniS);
        }
      }
    }
    if (this.p.isWave && this._waveSpriteLayer) {
      const _0x3f036a = this.p.mirrored ? 1 : -1;
      this._waveSpriteLayer.sprite.x += 1.5 * _0x3f036a;
      this._waveSpriteLayer.sprite.y -= 1;
    }
    if (this.p.isSpider && !this.p.isDead) {
      this.setCubeVisible(false);
      this.setBallVisible(false);
      this.setShipVisible(false);
      this.setWaveVisible(false);
      this.setBirdVisible(false);
      this.setRobotVisible(false);
      this._syncSpiderAnimation(_0x7f0705, _0x1a433c, _0x3afedf);
    } else {
      this.setSpiderVisible(false);
    }
    if (this.p.isRobot && !this.p.isDead) {
      this.setCubeVisible(false);
      this.setBallVisible(false);
      this.setShipVisible(false);
      this.setWaveVisible(false);
      this.setBirdVisible(false);
      this.setSpiderVisible(false);
      this._syncRobotAnimation(_0x7f0705, _0x1a433c, _0x3afedf);
      this._updateRobotJumpFlame(_0x3afedf);
    } else {
      this.setRobotVisible(false);
      this._hideRobotJumpFlame();
    }
    this._updateSpiderTeleportEffects(_0x3afedf);
    this._updateParticles(cameraX, cameraY, _0x3afedf);
    
    this._updateDashAnimation(_0x3afedf * 1000);
    if (this._dashAnimationSprite && this._dashAnimationSprite.visible) {
      this._dashAnimationSprite.x = _0x7f0705;
      this._dashAnimationSprite.y = _0x1a433c;
      const _miniS = this.p.isMini ? 0.6 : 1;
      this._dashAnimationSprite.scaleY = this.p.gravityFlipped ? -_miniS : _miniS;
      this._dashAnimationSprite.scaleX = _miniS;
    }

    if (!this._scene._slideIn){
      if (window.showHitboxes || this.p.isDead && window.hitboxesOnDeath) {
        this.drawHitboxes(this._hitboxGraphics, cameraX, cameraY);
      } else if (this._hitboxGraphics) {
        this._hitboxGraphics.clear();
      }
    }
  }
  _setGamemodeFlyBounds(...args) {
    if (this._scene?._isDual) return;
    this._gameLayer.setFlyMode(...args);
  }
  enterShipMode(_0xeb37c6 = null, fromCheckpoint = false) {
    if (this.p.isFlying) {
      return;
    }
    this.exitSpiderMode();
    this.exitRobotMode();
    this.exitBallMode();
    this.exitWaveMode();
    this.p.isFlying = true;
    this._scene.toggleGlitter(true);
    if (!fromCheckpoint){ // dont mess with y velocity if ur loading a checkpoint
      this.p.yVelocity *= 0.5;
    }
    this.p.onGround = false;
    this.p.canJump = false;
    this.p.isJumping = false;
    this.stopRotation();
    this._rotation = 0;
    this._particleEmitter.stop();
    this._flyParticle2Active = false;
    this._streak.reset();
    this._streak.start();
    this.setWaveVisible(false);
    this.setShipVisible(true);
    for (const layer of this._playerLayers) {
      if (layer) {
        layer.sprite.setScale(0.55);
      }
    }
    let spawnY = this.p.y;
    if (_0xeb37c6) {
      spawnY = _0xeb37c6.portalY !== undefined ? _0xeb37c6.portalY : _0xeb37c6.y;
    }
    this._setGamemodeFlyBounds(true, spawnY, f, false);
  }
  exitShipMode() {
    if (this.p.isFlying) {
      this.p.isFlying = false;
      this._scene.toggleGlitter(false);
      this.p.yVelocity *= 0.5;
      this.p.onGround = false;
      this.p.canJump = false;
      this.p.isJumping = false;
      this.stopRotation();
      this._rotation = 0;
      this._flyParticleEmitter.stop();
      this._flyParticleActive = false;
      this._flyParticle2Emitter.stop();
      this._flyParticle2Active = false;
      this._shipDragEmitter.stop();
      this._shipDragActive = false;
      this._particleActive = false;
      this._streak.stop();
      this._streak.reset();
      this.setShipVisible(false);
      this.setCubeVisible(!this.p.isBall && !this.p.isWave);
      this.setBallVisible(this.p.isBall);
      this.setWaveVisible(this.p.isWave);
      this.setSpiderVisible(false);
      for (const layer of this._playerLayers) {
        if (layer) {
          layer.sprite.setScale(1);
        }
      }
      this._setGamemodeFlyBounds(false, 0);
    }
  }
  enterBallMode(_0x36bb3d = null) {
    if (this.p.isBall) {
      return;
    }
    this.exitSpiderMode();
    this.exitRobotMode();
    this.exitWaveMode();
    this.p.isBall = true;
    this.p.onGround = false;
    this.p.canJump = false;
    this.p.isJumping = false;
    this.stopRotation();
    this._rotation = 0;
    this.setCubeVisible(false);
    this.setWaveVisible(false);
    this.setBallVisible(true);
    let _0x18df19 = this.p.y;
    if (_0x36bb3d) {
      _0x18df19 = _0x36bb3d.portalY !== undefined ? _0x36bb3d.portalY : _0x36bb3d.y;
    }
    this._setGamemodeFlyBounds(true, _0x18df19, f - a * 2, false);
  }
  exitBallMode() {
    if (!this.p.isBall) {
      return;
    }
    this.p.isBall = false;
    this.p.onGround = false;
    this.p.canJump = false;
    this.p.isJumping = false;
    this.stopRotation();
    this._rotation = 0;
    this.setBallVisible(false);
    this.setWaveVisible(false);
    this.setCubeVisible(true);
    this._setGamemodeFlyBounds(false, 0);
  }
  enterWaveMode(_0x5a10cc = null) {
    if (this.p.isWave) {
      return;
    }
    this.exitSpiderMode();
    this.exitRobotMode();
    this.exitShipMode();
    this.exitBallMode();
    this.p.isWave = true;
    this.p.yVelocity = 0;
    this.p.onGround = false;
    this.p.canJump = false;
    this.p.isJumping = false;
    this.stopRotation();
    this._rotation = 0;
    this._streak.reset();
    this._streak.start();
    this._waveTrail.reset();
    this._waveTrail.start();
    this.setCubeVisible(false);
    this.setBallVisible(false);
    this.setShipVisible(false);
    this.setWaveVisible(true);
    let _0x38b484 = this.p.y;
    if (_0x5a10cc) {
      _0x38b484 = _0x5a10cc.portalY !== undefined ? _0x5a10cc.portalY : _0x5a10cc.y;
    }
    this._setGamemodeFlyBounds(true, _0x38b484, f, false);
  }
  exitWaveMode() {
    if (!this.p.isWave) {
      return;
    }
    this.p.isWave = false;
    this.p.yVelocity = 0;
    this.p.onGround = false;
    this.p.canJump = false;
    this.p.isJumping = false;
    this.stopRotation();
    this._rotation = 0;
    this._streak.stop();
    this._streak.reset();
    this._waveTrail.stop();
    this._waveTrail.reset();
    this._hitboxTrail = [];
    this.setWaveVisible(false);
    this.setCubeVisible(!this.p.isBall && !this.p.isFlying);
    this.setBallVisible(this.p.isBall);
    this.setShipVisible(this.p.isFlying);
    this.setSpiderVisible(false);
    this._setGamemodeFlyBounds(false, 0);
  }
  enterSpiderMode(portal = null) {
    if (this.p.isSpider) return;
    const enteredFromPortal = !!portal;
    const portalYVelocity = enteredFromPortal ? this.p.yVelocity : null;
    this.exitShipMode();
    this.exitRobotMode();
    this.exitBallMode();
    this.exitWaveMode();
    const savedPortalYVelocity = Number.isFinite(portalYVelocity) ? portalYVelocity : null;
    this.p.isSpider = true;
    if (!enteredFromPortal) this.p.yVelocity = 0;
    this.p.onGround = !enteredFromPortal;
    this.p.onCeiling = !enteredFromPortal && !!this.p.gravityFlipped;
    this.p.canJump = !enteredFromPortal;
    this.p.isJumping = false;
    this.p._spiderTeleportPending = false;
    this.p._spiderTeleportAnimTimer = 0;
    this.p._spiderFlashTimer = 0;
    this.p._spiderFlashDuration = 0.5;
    this._spiderAnimTimer = (this._spiderAnimTimer || 0) + 0.18;
    this.stopRotation();
    this._rotation = 0;
    this.setCubeVisible(false);
    this.setBallVisible(false);
    this.setShipVisible(false);
    this.setWaveVisible(false);
    this.setSpiderVisible(true);
    let _y = this.p.y;
    if (portal) _y = portal.portalY !== undefined ? portal.portalY : portal.y;
    const spiderBlockSize = typeof a !== "undefined" ? a : 30;
    const spiderBaseHeight = typeof f !== "undefined" ? f : 480;
    const spiderFlyHeight = Math.max(spiderBlockSize, spiderBaseHeight - spiderBlockSize);
    this._setGamemodeFlyBounds(true, _y, spiderFlyHeight, false, spiderFlyHeight);
    if (savedPortalYVelocity !== null) this.p.yVelocity = savedPortalYVelocity;
    this._primeSpiderAnimationFrame(1 / 30);
  }
  exitSpiderMode() {
    if (!this.p.isSpider) return;
    this.p.isSpider = false;
    this.p.yVelocity = 0;
    this.p.onGround = false;
    this.p.canJump = false;
    this.p.isJumping = false;
    this.p._spiderTeleportPending = false;
    this.p._spiderTeleportAnimTimer = 0;
    this.p._spiderFlashTimer = 0;
    this.p._spiderFlashDuration = 0.5;
    this.stopRotation();
    this._rotation = 0;
    this.setSpiderVisible(false);
    if (this._spiderDashEffectSprite) this._spiderDashEffectSprite.setVisible(false);
    this._spiderDashEffectTimer = 0;
    this._hideRobotJumpFlame();
    this._robotJumpFlameActive = false;
    this._robotJumpFlamePulse = 0;
    this._robotJumpFlameFadeInTimer = 0;
    this.setCubeVisible(true);
    this._setGamemodeFlyBounds(false, 0);
  }
  enterRobotMode(portal = null) {
    if (this.p.isRobot) return;
    const enteredFromPortal = !!portal;
    const portalYVelocity = enteredFromPortal ? this.p.yVelocity : null;
    this.exitShipMode();
    this.exitBallMode();
    this.exitWaveMode();
    this.exitSpiderMode();
    this.exitUfoMode();
    const savedPortalYVelocity = Number.isFinite(portalYVelocity) ? portalYVelocity : null;
    this.p.isRobot = true;
    this.p._robotHold = false;
    this.p._robotHoldTimer = 0;
    this.p.onGround = !enteredFromPortal;
    this.p.onCeiling = !enteredFromPortal && !!this.p.gravityFlipped;
    this.p.canJump = !enteredFromPortal;
    this.p.isJumping = false;
    this.stopRotation();
    this._rotation = 0;
    this._robotAnimState = "run";
    this._robotAnimTimer = (this._robotAnimTimer || 0) + 0.12;
    this.setCubeVisible(false);
    this.setBallVisible(false);
    this.setShipVisible(false);
    this.setWaveVisible(false);
    this.setSpiderVisible(false);
    this.setBirdVisible(false);
    this.setRobotVisible(true);
    this._setGamemodeFlyBounds(false, 0);
    if (savedPortalYVelocity !== null) this.p.yVelocity = savedPortalYVelocity;
    this._primeRobotAnimationFrame(1 / 30);
  }
  exitRobotMode() {
    if (!this.p.isRobot) return;
    this.p.isRobot = false;
    this.p._robotHold = false;
    this.p._robotHoldTimer = 0;
    this._robotJumpFlameActive = false;
    this._hideRobotJumpFlame();
    this.p.onGround = false;
    this.p.canJump = false;
    this.p.isJumping = false;
    this.stopRotation();
    this._rotation = 0;
    this.setRobotVisible(false);
    this.setCubeVisible(!this.p.isBall && !this.p.isFlying && !this.p.isWave && !this.p.isUfo && !this.p.isSpider);
    this._setGamemodeFlyBounds(false, 0);
  }
  enterUfoMode(_portal = null, fromCheckpoint = false) {
    if (this.p.isUfo) return;
    this.exitSpiderMode();
    this.exitRobotMode();
    this.exitBallMode();
    this.exitWaveMode();
    this.exitShipMode();
    this.p.isUfo = true;
    this._scene.toggleGlitter(true);
    if (!fromCheckpoint){ // dont mess with y velocity if ur loading a checkpoint
      this.p.yVelocity *= 0.4;
    }
    this.p.onGround = false;
    this.p.canJump = false;
    this.p.isJumping = false;
    this.stopRotation();
    this._rotation = 0;
    this._particleEmitter.stop();
    this._streak.reset();
    this._streak.start();
    this.setBallVisible(false);
    this.setShipVisible(false);
    this.setWaveVisible(false);
    this.setSpiderVisible(false);
    this.setBirdVisible(true);
    this.setCubeVisible(true);
    for (const _layer of this._playerLayers) {
      if (_layer) {
        _layer.sprite.setScale(0.55);
      }
    }
    let _spawnY = this.p.y;
    if (_portal) {
      _spawnY = _portal.portalY !== undefined ? _portal.portalY : _portal.y;
    }
    this._setGamemodeFlyBounds(true, _spawnY, f, false);
  }
  exitUfoMode() {
    if (!this.p.isUfo) return;
    this.p.isUfo = false;
    this._scene.toggleGlitter(false);
    this.p.yVelocity *= 0.5;
    this.p.onGround = false;
    this.p.canJump = false;
    this.p.isJumping = false;
	this._streak.stop();
    this._streak.reset();
    this.stopRotation();
    this._rotation = 0;
    this._flyParticleEmitter.stop();
    this.setCubeVisible(!this.p.isBall && !this.p.isFlying);
    this.setBallVisible(this.p.isBall);
    this.setShipVisible(this.p.isFlying);
    this.setWaveVisible(this.p.isWave);
    this.setBirdVisible(false);
    this.setSpiderVisible(false);
    for (const _0xe1b715 of this._playerLayers) {
      if (_0xe1b715) {
        _0xe1b715.sprite.setScale(1);
      }
    }
    this._setGamemodeFlyBounds(false, 0);
  }
  hitGround() {
    const _0x4a38a5 = !this.p.onGround;
    if (!this.p.isFlying && !this.p.isWave && !this.p.isUfo) {
      this.p.lastGroundY = this.p.y;
    }
    this.p.yVelocity = 0;
    this.p.onGround = true;
    this.p.canJump = true;
    this.p.isJumping = false;
    this.p.queuedHold = false;
    if (this.p.isBall) {
      if (_0x4a38a5) {
        this._rotation = Math.round(this._rotation / Math.PI) * Math.PI;
      }
    } else if (this.p.isSpider) {
      if (_0x4a38a5) {
        this._rotation = Math.round(this._rotation / Math.PI) * Math.PI;
      }
    } else if (this.p.isWave) {
      this._rotation = 0;
    }
    this.stopRotation();
    if (_0x4a38a5 && !this.p.isFlying && !this.p.isWave && !this.p.isSpider && !this._scene?._editorPlaytestActive) {
      this._landIdx = !this._landIdx;
      const _0x31584b = this._landIdx ? this._landEmitter1 : this._landEmitter2;
      const _0x2248d5 = this._scene._playerWorldX;
      const _0x17e0bb = this.p.gravityFlipped ? b(this.p.y) - 30 : b(this.p.y) + 30;
      _0x31584b.explode(10, _0x2248d5, _0x17e0bb);
    }
  }
  killPlayer() {
    if (this.p.isDead) {
      return;
    }
    this.p.isDead = true;
    this._scene.toggleGlitter(false);
    this._particleEmitter.stop();
    this._particleActive = false;
    this._flyParticleEmitter.stop();
    this._flyParticleActive = false;
    this._flyParticle2Emitter.stop();
    this._flyParticle2Active = false;
    this._shipDragEmitter.stop();
    this._shipDragActive = false;
    this._streak.stop();
    this._streak.reset();
    this._waveTrail.stop();
    this._waveTrail.reset();
    this.setSpiderVisible(false);
    if (this._spiderTeleportCircles?.length) {
      for (const circle of this._spiderTeleportCircles) if (circle?.destroy) circle.destroy();
      this._spiderTeleportCircles = [];
    }

    if (this._scene?._editorPlaytestActive) {
      this.setCubeVisible(false);
      this.setShipVisible(false);
      this.setBallVisible(false);
      this.setWaveVisible(false);
      this.setBirdVisible(false);
      this.setSpiderVisible(false);
      this.setRobotVisible(false);
      if (this._dashAnimationSprite) this._dashAnimationSprite.setVisible(false);
      return;
    }

    const _0x3f4b84 = this._scene;
    const _0x3f0446 = _0x3f4b84._getMirrorXOffset(_0x3f4b84._playerWorldX - _0x3f4b84._cameraX);
    const _0x53ac5b = b(this.p.y) + this._lastCameraY;
    const _0x281e43 = 0.9;
    this._deathBurstEmitter = _0x3f4b84.add.particles(_0x3f0446, _0x53ac5b, "GJ_WebSheet", {
      frame: "square.png",
      speed: {
        min: 200,
        max: 800
      },
      angle: {
        min: 0,
        max: 360
      },
      scale: {
        start: 18 / 32,
        end: 0
      },
      alpha: {
        start: 1,
        end: 0
      },
      lifespan: {
        min: 50,
        max: 800
      },
      quantity: 100,
      stopAfter: 100,
      blendMode: S,
      tint: this._primaryColor(),
      x: {
        min: -20,
        max: 20
      },
      y: {
        min: -20,
        max: 20
      }
    }).setScrollFactor(0).setDepth(15);
    const _0x438d80 = _0x3f4b84.add.graphics().setScrollFactor(0).setDepth(15).setBlendMode(S);
    this._deathFlashGraphics = _0x438d80;
    const _0x4683eb = {
      t: 0
    };
    this._deathFlashTween = _0x3f4b84.tweens.add({
      targets: _0x4683eb,
      t: 1,
      duration: 500,
      ease: "Quad.Out",
      onUpdate: () => {
        const _0x39f32 = 18 + _0x4683eb.t * 144;
        const _0xc8c1 = 1 - _0x4683eb.t;
        _0x438d80.clear();
        _0x438d80.fillStyle(this._primaryColor(), _0xc8c1);
        _0x438d80.fillCircle(_0x3f0446, _0x53ac5b, _0x39f32);
      },
      onComplete: () => {
        if (this._deathFlashGraphics === _0x438d80) {
          this._deathFlashGraphics = null;
        }
        if (this._deathFlashTween) {
          this._deathFlashTween = null;
        }
        _0x438d80.destroy();
      }
    });
    this._createExplosionPieces(_0x3f0446, _0x53ac5b, _0x281e43);
    this.setCubeVisible(false);
    this.setShipVisible(false);
    this.setBallVisible(false);
    this.setWaveVisible(false);
    this.setBirdVisible(false);
    this.setSpiderVisible(false);
    this.setRobotVisible(false);
  }
  _createExplosionPieces(_0x49be85, _0x13b56e, _0x349a09) {
    const _0x44acaf = this._scene;
    const _0x4a9f23 = _0x349a09 * 40;
    const sliderBar = Math.round(_0x4a9f23 * 2);
    const _0x26dcbd = _0x44acaf.make.renderTexture({
      x: 0,
      y: 0,
      width: sliderBar,
      height: sliderBar,
      add: false
    });
    const _0x5c571a = [this._playerGlowLayer, this._playerOverlayLayer, this._ballGlowLayer, this._ballOverlayLayer, this._waveGlowLayer, this._waveOverlayLayer, this._waveExtraLayer, this._shipGlowLayer, this._shipOverlayLayer, this._spiderGlowLayer, this._spiderOverlayLayer, this._robotGlowLayer, this._robotOverlayLayer, this._playerSpriteLayer, this._playerExtraLayer, this._ballSpriteLayer, this._waveSpriteLayer, this._shipSpriteLayer, this._shipExtraLayer, this._spiderSpriteLayer, this._spiderExtraLayer, this._robotSpriteLayer, this._robotExtraLayer, this._birdSpriteLayer, this._birdGlowLayer, this._birdOverlayLayer, this._birdExtraLayer, ...(this._robotLayers || [])];
	  for (const _0x1f09e3 of _0x5c571a) {
      if (!_0x1f09e3) {
        continue;
      }
      if (!_0x1f09e3.sprite.visible) {
        continue;
      }
      const _0x53102a = _0x1f09e3.sprite;
      _0x26dcbd.draw(_0x53102a, sliderBar / 2 + (_0x53102a.x - _0x49be85), sliderBar / 2 + (_0x53102a.y - _0x13b56e));
    }
    const _0xd0201e = "__deathRT_" + Date.now();
    _0x26dcbd.saveTexture(_0xd0201e);
    const _0x5a2621 = _0x44acaf.textures.get(_0xd0201e);
    let _0x28c600 = 2 + Math.round(Math.random() * 2);
    let _0x247253 = 2 + Math.round(Math.random() * 2);
    const _0x5b9267 = Math.random();
    if (_0x5b9267 > 0.95) {
      _0x28c600 = 1;
    } else if (_0x5b9267 > 0.9) {
      _0x247253 = 1;
    }
    const _0x1e8c09 = 7.4779225920000005;
    const _0x422587 = _0x1e8c09 * 0.5;
    const _0x1e87b0 = _0x1e8c09 * 1;
    const _0x4dd9c4 = 0.45;
    const _0x5e8097 = sliderBar / _0x28c600;
    const _0x5af9d3 = sliderBar / _0x247253;
    const _0xe9c860 = [];
    const _0x3215fa = [];
    const _0x416e63 = [0];
    const _0x57d0dc = [0];
    let _0x44e1e1 = 0;
    let _0x38011e = 0;
    for (let _0x3f4d44 = 0; _0x3f4d44 < _0x28c600 - 1; _0x3f4d44++) {
      const _0x5b2c12 = Math.round(_0x5e8097 * (0.55 + Math.random() * _0x4dd9c4 * 2));
      _0xe9c860.push(_0x5b2c12);
      _0x44e1e1 += _0x5b2c12;
      _0x416e63.push(_0x44e1e1);
    }
    _0xe9c860.push(sliderBar - _0x44e1e1);
    for (let _0x325ce1 = 0; _0x325ce1 < _0x247253 - 1; _0x325ce1++) {
      const _0x37f0ad = Math.round(_0x5af9d3 * (0.55 + Math.random() * _0x4dd9c4 * 2));
      _0x3215fa.push(_0x37f0ad);
      _0x38011e += _0x37f0ad;
      _0x57d0dc.push(_0x38011e);
    }
    _0x3215fa.push(sliderBar - _0x38011e);
    this._explosionPieces = [];
    this._explosionContainer = _0x44acaf.add.container(_0x49be85, _0x13b56e).setDepth(16);
    let _0x156c8b = 0;
    for (let _0x4cd06e = 0; _0x4cd06e < _0x28c600; _0x4cd06e++) {
      const _0x5c6aa9 = _0xe9c860[_0x4cd06e];
      const _0x43a4e9 = _0x416e63[_0x4cd06e];
      for (let _0x5b14cf = 0; _0x5b14cf < _0x247253; _0x5b14cf++) {
        const _0x20847a = _0x3215fa[_0x5b14cf];
        const _0x20396e = _0x57d0dc[_0x5b14cf];
        if (_0x5c6aa9 <= 0 || _0x20847a <= 0) {
          continue;
        }
        _0x156c8b++;
        const _0x526d03 = "piece_" + _0x4cd06e + "_" + _0x5b14cf;
        _0x5a2621.add(_0x526d03, 0, _0x43a4e9, _0x20396e, _0x5c6aa9, _0x20847a);
        const _0xba83f5 = _0x44acaf.add.image(0, 0, _0xd0201e, _0x526d03);
        _0xba83f5.x = _0x43a4e9 + _0x5c6aa9 / 2 - sliderBar / 2;
        _0xba83f5.y = -(_0x20396e + _0x20847a / 2 - sliderBar / 2);
        this._explosionContainer.add(_0xba83f5);
        let _0x298d34 = null;
        if (_0x156c8b % 2 == 0) {
          const _0x367bdb = 200 + Math.random() * 200;
          const _0x5e5fa8 = _0xba83f5;
          _0x298d34 = _0x44acaf.add.particles(0, 0, "GJ_WebSheet", {
            frame: "square.png",
            speed: 0,
            scale: {
              start: 0.5,
              end: 0
            },
            alpha: {
              start: 1,
              end: 0
            },
            lifespan: _0x367bdb,
            frequency: 25,
            quantity: 1,
            emitting: true,
            blendMode: S,
            tint: this._primaryColor(),
            emitCallback: _0x2f7fc7 => {
              _0x2f7fc7.x = _0x5e5fa8.x + (Math.random() * 2 - 1) * 3 * 2;
              _0x2f7fc7.y = _0x5e5fa8.y + (Math.random() * 2 - 1) * 3 * 2;
            }
          });
          this._explosionContainer.addAt(_0x298d34, 0);
        }
        const _0x159cfa = {
          spr: _0xba83f5,
          particle: _0x298d34,
          xVel: (_0x422587 + (Math.random() * 2 - 1) * _0x1e87b0) * (this.p.mirrored ? -1 : 1),
          yVel: -(12 + (Math.random() * 2 - 1) * 6),
          timer: 1.4,
          fadeTime: 0.5,
          rotDelta: (Math.random() * 2 - 1) * 360 / 60,
          halfSize: Math.min(_0x5c6aa9, _0x20847a) / 2
        };
        this._explosionPieces.push(_0x159cfa);
      }
    }
    this._explosionGroundSY = b(0) + this._lastCameraY;
    this._explosionRT = _0x26dcbd;
    this._explosionTexKey = _0xd0201e;
  }
  updateExplosionPieces(_0x1c8c6d) {
    if (this._deathAnimationPaused) {
      return;
    }
    if (!this._explosionPieces || this._explosionPieces.length === 0) {
      return;
    }
    const _0x1ed0a8 = _0x1c8c6d / 1000;
    const _0x3e389c = Math.min(_0x1ed0a8 * 60 * 0.9, 2);
    const _0x59eafe = _0x3e389c * 0.5 * 2;
    const _0x5a7549 = this._explosionGroundSY - this._explosionContainer.y;
    let _0x4284b0 = 0;
    while (_0x4284b0 < this._explosionPieces.length) {
      const particleX = this._explosionPieces[_0x4284b0];
      particleX.timer -= _0x1ed0a8;
      if (particleX.timer > 0) {
        {
          particleX.yVel += _0x59eafe;
          particleX.xVel *= 0.98 + (1 - _0x3e389c) * 0.02;
          let _0x57034b = particleX.spr.x + particleX.xVel * _0x3e389c;
          let _0x4c0481 = particleX.spr.y + particleX.yVel * _0x3e389c;
          const _0x3f6377 = _0x5a7549 - particleX.halfSize;
          if (_0x4c0481 > _0x3f6377 && particleX.yVel > 0) {
            _0x4c0481 = _0x3f6377;
            particleX.yVel *= -0.8;
            if (Math.abs(particleX.yVel) < 3) {
              particleX.yVel = -3;
            }
          }
          particleX.spr.x = _0x57034b;
          particleX.spr.y = _0x4c0481;
          particleX.spr.angle += particleX.rotDelta * _0x3e389c;
          if (particleX.timer < particleX.fadeTime) {
            const _0x2d8b5f = particleX.timer / particleX.fadeTime;
            particleX.spr.setAlpha(_0x2d8b5f);
            if (particleX.particle) {
              particleX.particle.setAlpha(_0x2d8b5f);
            }
          }
        }
        _0x4284b0++;
      } else {
        if (particleX.particle) {
          particleX.particle.stop();
          particleX.particle.destroy();
        }
        particleX.spr.destroy();
        this._explosionPieces.splice(_0x4284b0, 1);
      }
    }
    if (this._explosionPieces.length === 0) {
      this._cleanupExplosion();
    }
  }
  setDeathAnimationPaused(paused) {
    const shouldPause = !!paused;
    this._deathAnimationPaused = shouldPause;

    if (this._deathBurstEmitter) {
      this._deathBurstEmitter.timeScale = shouldPause ? 0 : 1;
    }

    if (this._explosionPieces) {
      for (const piece of this._explosionPieces) {
        if (piece?.particle) {
          piece.particle.timeScale = shouldPause ? 0 : 1;
        }
      }
    }

    if (this._deathFlashTween) {
      if (shouldPause) {
        this._deathFlashTween.pause?.();
      } else {
        this._deathFlashTween.resume?.();
      }
    }
  }
  _cleanupExplosion() {
    if (this._deathFlashTween) {
      this._deathFlashTween.stop?.();
      this._deathFlashTween = null;
    }
    if (this._deathFlashGraphics) {
      this._deathFlashGraphics.destroy?.();
      this._deathFlashGraphics = null;
    }
    if (this._deathBurstEmitter) {
      this._deathBurstEmitter.stop?.();
      this._deathBurstEmitter.destroy?.();
      this._deathBurstEmitter = null;
    }
    this._deathAnimationPaused = false;

    if (this._explosionPieces) {
      for (const _0x59172d of this._explosionPieces) {
        if (_0x59172d.particle) {
          _0x59172d.particle.stop();
          _0x59172d.particle.destroy();
        }
        if (_0x59172d.spr) {
          _0x59172d.spr.destroy();
        }
      }
    }
    if (this._explosionContainer) {
      this._explosionContainer.destroy();
      this._explosionContainer = null;
    }
    if (this._explosionTexKey) {
      this._scene.textures.remove(this._explosionTexKey);
      this._explosionTexKey = null;
    }
    if (this._explosionRT) {
      this._explosionRT.destroy();
      this._explosionRT = null;
    }
    this._explosionPieces = null;
  }
  _getPortalShineFrames(portalCollider, type = 1) {
    const portalType = portalCollider?.type;

    if (portalType === speedType || portalType === "speed") {
      const speedShineMap = {
        200: "boost_01_shine_001.png",
        201: "boost_02_shine_001.png",
        202: "boost_03_shine_001.png",
        203: "boost_04_shine_001.png",
        1334: "boost_05_shine_001.png"
      };
      const speedFrame = speedShineMap[portalCollider?.speedId] || "boost_02_shine_001.png";
      return [{ frame: speedFrame, container: this._gameLayer.topContainer }];
    }

    const portalShineMap = {
      portal_mirror_on: "03",
      portal_mirror_off: "03",
      portal_mini_on: "04",
      portal_mini_off: "04",
      portal_dual_on: "05",
      portal_dual_off: "05",
      portal_teleport: "06"
    };

    const typeStr = portalShineMap[portalType] || ((type === 1) ? "02" : "01");
    return [
      { frame: `portalshine_${typeStr}_front_001.png`, container: this._gameLayer.topContainer },
      { frame: `portalshine_${typeStr}_back_001.png`, container: this._gameLayer.container }
    ];
  }

  _getPortalShineAtlasFrameData(scene, frameName) {
    if (!scene?.textures) return null;

    const requestedSheet = "GJ_GameSheet04";
    if (scene.textures.exists(requestedSheet)) {
      const texture = scene.textures.get(requestedSheet);
      const frameData = texture?.get?.(frameName);
      if (frameData && frameData.name !== "__MISSING") {
        return {
          atlasFrame: { atlas: requestedSheet, frame: frameName },
          atlasTexture: texture,
          frameData
        };
      }
    }

    if (typeof getAtlasFrame !== "function") return null;
    const atlasFrame = getAtlasFrame(scene, frameName);
    if (!atlasFrame) return null;
    const atlasTexture = scene.textures.get(atlasFrame.atlas);
    const frameData = atlasTexture?.get?.(atlasFrame.frame);
    if (!atlasTexture || !frameData || frameData.name === "__MISSING") return null;
    return { atlasFrame, atlasTexture, frameData };
  }

  _readPortalShineFrameRect(frameData, packedMeta = {}) {
    const customData = frameData?.customData || {};
    const frameRect = customData.frame || packedMeta.frame || {};
    const sourceSize = customData.sourceSize || packedMeta.sourceSize || {};
    const spriteSourceSize = customData.spriteSourceSize || packedMeta.spriteSourceSize || {};

    const frameX = Number(frameRect.x ?? frameData?.cutX ?? frameData?.x ?? 0) || 0;
    const frameY = Number(frameRect.y ?? frameData?.cutY ?? frameData?.y ?? 0) || 0;
    const frameW = Number(frameRect.w ?? frameRect.width ?? frameData?.realWidth ?? frameData?.width ?? frameData?.cutWidth ?? 0) || 0;
    const frameH = Number(frameRect.h ?? frameRect.height ?? frameData?.realHeight ?? frameData?.height ?? frameData?.cutHeight ?? 0) || 0;

    const drawW = Number(spriteSourceSize.w ?? spriteSourceSize.width ?? frameW) || frameW;
    const drawH = Number(spriteSourceSize.h ?? spriteSourceSize.height ?? frameH) || frameH;
    const drawX = Number(spriteSourceSize.x ?? 0) || 0;
    const drawY = Number(spriteSourceSize.y ?? 0) || 0;
    const sourceW = Number(sourceSize.w ?? sourceSize.width ?? frameData?.realWidth ?? (drawX + drawW)) || (drawX + drawW);
    const sourceH = Number(sourceSize.h ?? sourceSize.height ?? frameData?.realHeight ?? (drawY + drawH)) || (drawY + drawH);

    return { frameX, frameY, frameW, frameH, drawX, drawY, drawW, drawH, sourceW, sourceH };
  }

  _getPortalShinePackedFrameMeta(frameName) {
    const shineAtlasMeta = {
      "boost_01_shine_001.png": { rotated: false, frame: { x: 910, y: 1038, w: 64, h: 82 }, sourceSize: { w: 64, h: 82 }, spriteSourceSize: { x: 0, y: 0, w: 64, h: 82 } },
      "boost_02_shine_001.png": { rotated: true, frame: { x: 325, y: 1083, w: 61, h: 108 }, sourceSize: { w: 61, h: 108 }, spriteSourceSize: { x: 0, y: 0, w: 61, h: 108 } },
      "boost_03_shine_001.png": { rotated: true, frame: { x: 801, y: 1052, w: 96, h: 108 }, sourceSize: { w: 96, h: 108 }, spriteSourceSize: { x: 0, y: 0, w: 96, h: 108 } },
      "boost_04_shine_001.png": { rotated: true, frame: { x: 332, y: 957, w: 125, h: 108 }, sourceSize: { w: 125, h: 108 }, spriteSourceSize: { x: 0, y: 0, w: 125, h: 108 } },
      "boost_05_shine_001.png": { rotated: true, frame: { x: 937, y: 742, w: 128, h: 103 }, sourceSize: { w: 128, h: 103 }, spriteSourceSize: { x: 0, y: 0, w: 128, h: 103 } },
      "portalshine_03_front_001.png": { rotated: true, frame: { x: 971, y: 1, w: 72, h: 178 }, sourceSize: { w: 88, h: 178 }, spriteSourceSize: { x: 16, y: 0, w: 72, h: 178 } },
      "portalshine_04_front_001.png": { rotated: true, frame: { x: 1, y: 1092, w: 40, h: 174 }, sourceSize: { w: 50, h: 174 }, spriteSourceSize: { x: 10, y: 0, w: 40, h: 174 } },
      "portalshine_05_front_001.png": { rotated: true, frame: { x: 176, y: 1069, w: 66, h: 148 }, sourceSize: { w: 66, h: 148 }, spriteSourceSize: { x: 0, y: 0, w: 66, h: 148 } }
    };
    return shineAtlasMeta[frameName] || null;
  }

  _getCorrectedPortalShineTextureKey(scene, frameName) {
    const data = this._getPortalShineAtlasFrameData(scene, frameName);
    if (!data) return null;

    const { atlasFrame, atlasTexture, frameData } = data;
    const customData = frameData.customData || {};
    const packedMeta = this._getPortalShinePackedFrameMeta(frameName) || {};
    const frameRect = this._readPortalShineFrameRect(frameData, packedMeta);
    const isRotated = !!(frameData.rotated || customData.rotated || packedMeta.rotated);
    const hasTrim = frameRect.sourceW !== frameRect.drawW || frameRect.sourceH !== frameRect.drawH || frameRect.drawX !== 0 || frameRect.drawY !== 0;

    if (!isRotated && !hasTrim) return null;

    const fixedKey = `__portal_shine_fixed_${String(atlasFrame.atlas)}_${String(frameName).replace(/[^a-zA-Z0-9_]/g, "_")}`;
    if (scene.textures.exists(fixedKey)) return fixedKey;

    const sourceImage =
      (typeof atlasTexture.getSourceImage === "function" ? atlasTexture.getSourceImage() : null) ||
      atlasTexture.source?.[0]?.image ||
      atlasTexture.source?.[0]?.source;
    if (!sourceImage) return null;

    const outW = Math.max(1, Math.ceil(frameRect.sourceW));
    const outH = Math.max(1, Math.ceil(frameRect.sourceH));
    const canvasTexture = scene.textures.createCanvas(fixedKey, outW, outH);
    if (!canvasTexture) return null;

    const canvas = canvasTexture.getCanvas();
    const ctx = canvas?.getContext?.("2d");
    if (!ctx || frameRect.frameW <= 0 || frameRect.frameH <= 0 || frameRect.drawW <= 0 || frameRect.drawH <= 0) {
      scene.textures.remove(fixedKey);
      return null;
    }

    ctx.clearRect(0, 0, outW, outH);
    if (isRotated) {
      const frameRectUsesRotatedSize =
        Math.abs(frameRect.frameW - frameRect.drawH) < 0.5 &&
        Math.abs(frameRect.frameH - frameRect.drawW) < 0.5;
      const packedW = frameRectUsesRotatedSize ? frameRect.frameW : frameRect.frameH;
      const packedH = frameRectUsesRotatedSize ? frameRect.frameH : frameRect.frameW;
      ctx.save();
      ctx.translate(frameRect.drawX + frameRect.drawW / 2, frameRect.drawY + frameRect.drawH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.drawImage(
        sourceImage,
        frameRect.frameX,
        frameRect.frameY,
        packedW,
        packedH,
        -frameRect.drawH / 2,
        -frameRect.drawW / 2,
        frameRect.drawH,
        frameRect.drawW
      );
      ctx.restore();
    } else {
      ctx.drawImage(
        sourceImage,
        frameRect.frameX,
        frameRect.frameY,
        frameRect.frameW,
        frameRect.frameH,
        frameRect.drawX,
        frameRect.drawY,
        frameRect.drawW,
        frameRect.drawH
      );
    }

    canvasTexture.refresh();
    return fixedKey;
  }

  _createPortalShineSprite(scene, x, y, frameName, rotationDegrees = 0, flipX = false, flipY = false) {
    const correctedTextureKey = this._getCorrectedPortalShineTextureKey(scene, frameName);
    if (correctedTextureKey) {
      const correctedSprite = scene.add.image(x, y, correctedTextureKey).setAngle(rotationDegrees || 0);
      if (correctedSprite?.setFlipX) correctedSprite.setFlipX(!!flipX);
      if (correctedSprite?.setFlipY) correctedSprite.setFlipY(!!flipY);
      return correctedSprite;
    }

    let shineSprite = null;
    const data = this._getPortalShineAtlasFrameData(scene, frameName);
    if (data) {
      shineSprite = scene.add.image(x, y, data.atlasFrame.atlas, data.atlasFrame.frame);
    } else if (typeof addImageToScene === "function") {
      shineSprite = addImageToScene(scene, x, y, frameName);
    }

    if (!shineSprite) return null;

    const visualPropsObject = {
      rot: rotationDegrees || 0,
      flipX: !!flipX,
      flipY: !!flipY,
      scale: 1
    };

    if (this._gameLayer && typeof this._gameLayer._applyVisualProps === "function") {
      this._gameLayer._applyVisualProps(scene, shineSprite, frameName, visualPropsObject);
    } else {
      shineSprite.setAngle(rotationDegrees || 0);
    }

    return shineSprite;
  }

  _playPortalShine(_0x49e81f, type = 1) {
    const _0x4ed8ff = this._scene;
    const portalX = Number(_0x49e81f.portalX);
    const portalY = Number(_0x49e81f.portalY);
    const _0xf31b0d = Number.isFinite(portalX) ? portalX : _0x49e81f.x;
    const _0x3824c0 = b(Number.isFinite(portalY) ? portalY : _0x49e81f.y);
    const shineFrames = this._getPortalShineFrames(_0x49e81f, type);
    const flipX = !!(_0x49e81f.flipX || _0x49e81f.portalFlipX);
    const flipY = !!(_0x49e81f.flipY || _0x49e81f.portalFlipY);

    for (const shineDef of shineFrames) {
      const pieceSize = this._createPortalShineSprite(_0x4ed8ff, _0xf31b0d, _0x3824c0, shineDef.frame, _0x49e81f.rotationDegrees, flipX, flipY);
      if (!pieceSize) {
        continue;
      }
      pieceSize.setBlendMode(S);
      pieceSize.setAlpha(0);
      shineDef.container.add(pieceSize);
      _0x4ed8ff.tweens.add({
        targets: pieceSize,
        alpha: {
          from: 0,
          to: 1
        },
        duration: 50,
        onComplete: () => {
          _0x4ed8ff.tweens.add({
            targets: pieceSize,
            alpha: 0,
            duration: 400,
            onComplete: () => pieceSize.destroy()
          });
        }
      });
    }
  }
  _checkSnapJump(_0x1f801b) {
    const _0x483058 = [{
      dx: 240,
      dy: 60
    }, {
      dx: 300,
      dy: -60
    }, {
      dx: 180,
      dy: 120
    }];
    const _0x2b806a = this._lastLandObject;
    if (_0x2b806a && _0x2b806a !== _0x1f801b && _0x2b806a.type === solidType) {
      const _0x34ef27 = _0x2b806a.x;
      const _0x4652bb = _0x2b806a.y;
      const _0x5de781 = _0x1f801b.x;
      const _0x21ad88 = _0x1f801b.y;
      const _0x1b1831 = this.p.gravityFlipped ? -1 : 1;
      let _0x372d4e = false;
      for (const _0x31d5e4 of _0x483058) {
        if (Math.abs(_0x5de781 - (_0x34ef27 + _0x31d5e4.dx)) <= 2 && Math.abs(_0x21ad88 - (_0x4652bb + _0x31d5e4.dy * _0x1b1831)) <= 2) {
          _0x372d4e = true;
          break;
        }
      }
      if (_0x372d4e) {
        const _0x4ca454 = _0x1f801b.x + this._lastXOffset;
        const _0x48aba3 = this._scene._playerWorldX;
        let _0x5f2847;
        _0x5f2847 = Math.abs(_0x4ca454 - _0x48aba3) <= 2 ? _0x4ca454 : _0x4ca454 > _0x48aba3 ? _0x48aba3 + 2 : _0x48aba3 - 2;
        this._scene._playerWorldX = _0x5f2847;
      }
    }
    this._lastLandObject = _0x1f801b;
    this._lastXOffset = this._scene._playerWorldX - _0x1f801b.x;
  }
  _isFallingPastThreshold() {
    if (this.p.gravityFlipped) {
      return this.p.yVelocity > 0.25;
    } else {
      return this.p.yVelocity < -0.25;
    }
  }
  flipMod() {
    if (this.p.gravityFlipped) {
      return -1;
    } else {
      return 1;
    }
  }
  flipGravity(flipped, _0x11bbde = 0.5) {
      if (this.p.gravityFlipped === flipped) {
        return;
      }
      this.p.gravityFlipped = flipped;
      this.p.yVelocity *= _0x11bbde;
      this.p.onGround = false;
      this.p.canJump = false;
  }
  runRotateAction() {
    this.rotateActionActive = true;
    this.rotateActionTime = 0;
    const _miniDurScale = this.p.isMini ? (1 / 1.4) : 1;
    this.rotateActionDuration = (0.39 / d) * _miniDurScale;
    this.rotateActionStart = this._rotation;
    this.rotateActionTotal = Math.PI * this.flipMod();
  }
  updateDashRotation(dt) {
    const spinSpeed = Math.PI * 6.0 * this.flipMod();
    this._rotation += spinSpeed * dt;
  }
  stopRotation() {
    this.rotateActionActive = false;
  }
  updateRotateAction(_0x98044d) {
    if (!this.rotateActionActive) {
      return;
    }
    this.rotateActionTime += _0x98044d;
    if (this.rotateActionTime >= this.rotateActionDuration) {
      this.rotateActionActive = false;
    }
    let _0xb1cb91 = Math.min(this.rotateActionTime / this.rotateActionDuration, 1);
    this._rotation = this.rotateActionStart + this.rotateActionTotal * _0xb1cb91;
  }
  convertToClosestRotation() {
    let _0x5f531c = Math.PI / 2;
    return Math.round(this._rotation / _0x5f531c) * _0x5f531c;
  }
  slerp2D(startAngle, endAngle, t) {
    let halfStart = startAngle * 0.5;
    let halfEnd = endAngle * 0.5;
    let cosStart = Math.cos(halfStart);
    let sinStart = Math.sin(halfStart);
    let cosEnd = Math.cos(halfEnd);
    let sinEnd = Math.sin(halfEnd);
    let dot = (cosStart * cosEnd) + (sinStart * sinEnd);
    let weightStart, weightEnd;
    if (dot < 0.0) {
        dot = -dot;
        sinEnd = -sinEnd;
        cosEnd = -cosEnd;
    }
    if (1.0 - dot > 0.0001) {
        let theta = Math.acos(dot);
        let sinTheta = Math.sin(theta);
        weightStart = Math.sin(theta * (1.0 - t)) / sinTheta;
        weightEnd = Math.sin(theta * t) / sinTheta;
    } else {
        weightStart = 1.0 - t;
        weightEnd = t;
    }
    let interpSin = (sinStart * weightStart) + (sinEnd * weightEnd);
    let interpCos = (cosStart * weightStart) + (cosEnd * weightEnd);
    let out = Math.atan2(interpSin, interpCos);
    return out + out;
  }
  updateGroundRotation(_0x5c24f7) {
    if (this.p.isBall || this.p.isWave || this.p.isSpider || this.p.isRobot) {
      return;
    }
    let _0x183c2a = this.convertToClosestRotation();
    let _0x108955 = 0.47250000000000003;
    let _0x17a9a6 = Math.min(_0x5c24f7 * 1, _0x108955 * _0x5c24f7);
    this._rotation = this.slerp2D(this._rotation, _0x183c2a, _0x17a9a6);
  }
  updateBallRoll(_0x1dd8af, onSurface) {
    const gravityDir = this.p.gravityFlipped ? -1 : 1;
	  const rollDir = this.p.mirrored ? -gravityDir : gravityDir;
    const speedFactor = onSurface ? 0.5 : 0.35;
    const miniRollScale = this.p.isMini ? 1 / 0.8 : 1;
    this._rotation += _0x1dd8af / (g / 2) * gravityDir * speedFactor * miniRollScale;
  }
  updateShipRotation(_0x217ad3) {
    let _0x48f422 = -(this.p.y - this.p.lastY);
    let _0x58cb3a = _0x217ad3 * 10.3860036;
    if (_0x58cb3a * _0x58cb3a + _0x48f422 * _0x48f422 >= _0x217ad3 * 0.6) {
      let _0x5e6a2b = Math.atan2(_0x48f422, _0x58cb3a);
      let _0x2371ed = 0.15;
      let _0x1857d4 = Math.min(_0x217ad3 * 1, _0x2371ed * _0x217ad3);
      this._rotation = this.slerp2D(this._rotation, _0x5e6a2b, _0x1857d4);
    }
  }
  playerIsFalling() {
    if (this.p.gravityFlipped) {
      return this.p.yVelocity > p;
    } else {
      return this.p.yVelocity < p;
    }
  }
  updateJump(_0x3d1c6f) {
    if (this.p.pendingVelocity !== null) {
      this.p.yVelocity = this.p.pendingVelocity;
      this.p.pendingVelocity = null;
    }
    if (this.p.isDashing) {
      if (!this.p.upKeyDown || this.p.onGround) {
        this.p.isDashing = false;
        this.p.dashYVelocity = 0;
      } else {
        this.p.yVelocity = this.p.dashYVelocity;
        return;
      }
    }
    if (this.p.isFlying) {
      this._updateFlyJump(_0x3d1c6f);
    } else if (this.p.isWave) {
      this._updateWaveJump(_0x3d1c6f);
    } else if (this.p.isBall) {
      this._updateBallJump(_0x3d1c6f);
    } else if (this.p.isUfo) {
      this._updateUfoJump(_0x3d1c6f);
    } else if (this.p.isSpider) {
      this._updateSpiderJump(_0x3d1c6f);
    } else if (this.p.isRobot) {
      this._updateRobotJump(_0x3d1c6f);
    } else if (this.p.upKeyDown && this.p.canJump) {
      this.p.isJumping = true;
      this.p.onGround = false;
      this.p.canJump = false;
      this.p.upKeyPressed = false;
      this.p.queuedHold = false;
      this.p.yVelocity = this.flipMod() * 22.360064 * (this.p.isMini ? 0.8 : 1);
      this.runRotateAction();
    } else if (this.p.isJumping) {
      this.p.yVelocity -= p * _0x3d1c6f * this.flipMod();
      if (this.playerIsFalling()) {
        this.p.isJumping = false;
        this.p.onGround = false;
      }
    } else {
      if (this.playerIsFalling()) {
        this.p.canJump = false;
      }
      this.p.yVelocity -= p * _0x3d1c6f * this.flipMod();
      if (this.p.gravityFlipped) {
        this.p.yVelocity = Math.min(this.p.yVelocity, 30);
      } else {
        this.p.yVelocity = Math.max(this.p.yVelocity, -30);
      }
      if (this._isFallingPastThreshold() && !this.rotateActionActive) {
        this.runRotateAction();
      }
      if (this.playerIsFalling()) {
        let _0x47ed2a;
        _0x47ed2a = this.p.gravityFlipped ? this.p.yVelocity > p * 2 : this.p.yVelocity < -(p * 2);
        if (_0x47ed2a) {
          this.p.onGround = false;
        }
      }
    }
  }
  _shouldPrioritizeGroundOrbInput() {
    if (!(this.p.isBall || this.p.isSpider)) return false;
    if (!this.p.upKeyPressed) return false;
    if (!(this.p.canJump || this.p.onGround || this.p.onCeiling)) return false;
    return this._isTouchingAvailableOrbForInput(false);
  }
  _shouldPrioritizeUfoOrbInput() {
    return !!(this.p.isUfo && this.p.upKeyPressed && this._isTouchingAvailableOrbForInput(true));
  }
  _isTouchingAvailableOrbForInput(requireUnconsumedPress = true) {
    if (requireUnconsumedPress && this.p._orbActivationConsumedForPress) return false;

    const playerWorldX = this._scene?._playerWorldX ?? centerX;
    const playerSize = this.p.isMini ? 18 : 30;
    const nearbyObjects = this._gameLayer?.getNearbySectionObjects?.(playerWorldX) || [];

    for (const gameObj of nearbyObjects) {
      if (!gameObj || gameObj.type !== jumpRingType || this._isObjectActivated(gameObj)) continue;

      const hasCircleHitbox = gameObj.hitbox_radius !== undefined && gameObj.hitbox_radius !== null;
      if (hasCircleHitbox) {
        const dx = playerWorldX - gameObj.x;
        const dy = this.p.y - gameObj.y;
        const hitRadius = gameObj.hitbox_radius + playerSize;
        if ((dx * dx + dy * dy) <= hitRadius * hitRadius) {
          return true;
        }
        continue;
      }

      const rad = (gameObj.rotationDegrees || 0) * Math.PI / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const halfW = gameObj.w / 2;
      const halfH = gameObj.h / 2;
      const rotatedHalfWidth = Math.abs(halfW * cos) + Math.abs(halfH * sin);
      const rotatedHalfHeight = Math.abs(halfW * sin) + Math.abs(halfH * cos);
      const left = gameObj.x - rotatedHalfWidth;
      const right = gameObj.x + rotatedHalfWidth;
      const top = gameObj.y - rotatedHalfHeight;
      const bottom = gameObj.y + rotatedHalfHeight;

      if (!(playerWorldX + playerSize <= left) && !(playerWorldX - playerSize >= right) &&
          !(this.p.y + playerSize <= top) && !(this.p.y - playerSize >= bottom)) {
        return true;
      }
    }

    return false;
  }
  _updateFlyJump(_0x130c46) {
    const _shipMiniScale = this.p.isMini ? 1.176470588 : 1;
    let _0x203040 = 0.8;
    if (this.p.upKeyDown) {
      _0x203040 = -1;
    }
    if (!this.p.upKeyDown && !this.playerIsFalling()) {
      _0x203040 = 1.2;
    }
    let _0x2d237f = 0.4;
    if (this.p.upKeyDown && this.playerIsFalling()) {
      _0x2d237f = 0.5;
    }
    this.p.yVelocity -= p * _0x130c46 * this.flipMod() * _0x203040 * _0x2d237f * _shipMiniScale;
    if (this.p.upKeyDown) {
      this.p.onGround = false;
    }
    if (!this.p.wasBoosted) {
      if (this.p.gravityFlipped) {
        this.p.yVelocity = Math.max(this.p.yVelocity, -16 * _shipMiniScale);
        this.p.yVelocity = Math.min(this.p.yVelocity, 12.8 * _shipMiniScale);
      } else {
        this.p.yVelocity = Math.max(this.p.yVelocity, -12.8 * _shipMiniScale);
        this.p.yVelocity = Math.min(this.p.yVelocity, 16 * _shipMiniScale);
      }
    }
  }
_updateBallJump(_0x2fe319) {
    const _0x144266 = p * 0.6;
    let prioritizeOrb = this._shouldPrioritizeGroundOrbInput();

    if (!prioritizeOrb && this.p.upKeyPressed && this.p.canJump) {
      const _0x47d739 = this.flipMod();
      this.p.upKeyPressed = false;
      this.p.queuedHold = false;
      this.p.yVelocity = _0x47d739 * 22.360064 * (this.p.isMini ? 0.8 : 1);
      this.flipGravity(!this.p.gravityFlipped);
      this.p.onGround = false;
      this.p.canJump = false;
      this.p.yVelocity *= 0.6;
      return;
    }
    
    if (this.playerIsFalling()) {
      this.p.canJump = false;
    }
    this.p.yVelocity -= _0x144266 * _0x2fe319 * this.flipMod();
    if (this.p.gravityFlipped) {
      this.p.yVelocity = Math.min(this.p.yVelocity, 30);
    } else {
      this.p.yVelocity = Math.max(this.p.yVelocity, -30);
    }
    if (this.playerIsFalling()) {
      const _0x1439be = this.p.gravityFlipped ? this.p.yVelocity > p * 2 : this.p.yVelocity < -(p * 2);
      if (_0x1439be) {
        this.p.onGround = false;
      }
    }
  }
_updateWaveJump(dt) {
    const _baseSpeed = this.p.isMini ? 22.7700072 : 11.3850036;
    const _speedMod = (playerSpeed / 11.540004);
    const _waveVel = _baseSpeed * _speedMod;
    const isPushingUp = this.p.upKeyDown; 
    let _0x312a7f = (isPushingUp ? 1 : -1) * this.flipMod() * _waveVel;

    if (this.p.onGround || this.p.onCeiling) {
        const movingAwayFromCeiling = this.p.onCeiling && !isPushingUp;
        const movingAwayFromFloor = this.p.onGround && isPushingUp;

        if (movingAwayFromCeiling || movingAwayFromFloor) {
            this.p.onGround = false;
            this.p.onCeiling = false;
        } else {
            _0x312a7f = 0;
        }
    }

    this.p.yVelocity = _0x312a7f;
    this.p.canJump = false;
    this.p.isJumping = false;

    const _waveAngle = this.p.isMini ? (62 * Math.PI / 180) : Math.PI / 4;
    const _targetRotation = _0x312a7f === 0 ? 0 : _0x312a7f > 0 ? -_waveAngle : _waveAngle;
    const _turnRate = 0.55;
    const _0x5c24f7 = dt || 0;
    const _turnT = Math.min(1, _turnRate * _0x5c24f7);
    this._rotation = this.slerp2D(this._rotation, _targetRotation, _turnT);
}
  _updateRobotJump(dt) {
    const dtSec = dt > 1 ? dt / 1000 : dt;

    const robotMiniJumpScale = this.p.isMini ? (1 / 1.2) : 1;
    const robotJumpInit = 10.25 * robotMiniJumpScale;
    const robotHoldMax = 15.5;
    const robotHoldForce = p * 0.2 * robotMiniJumpScale;
    const robotGravityHold = p * 0.15;
    const robotGravityFall = p * 0.81;
    const robotReleaseCut = 0.9;
    const robotReleaseMinTime = 0;
    const robotMaxFall = 28;
    const robotMaxRise = 30 * robotMiniJumpScale;

    if (this.p.upKeyPressed && this.p.canJump) {
      this.p.upKeyPressed = false;
      this.p.isJumping = true;
      this.p.onGround = false;
      this.p.canJump = false;
      this.p.queuedHold = false;
      this.p.yVelocity = this.flipMod() * robotJumpInit;
      this.p._robotHold = true;
      this.p._robotHoldTimer = 0;
      this._robotJumpFlameActive = true;
      this._robotJumpFlamePulse = 0;
      this._robotJumpFlameFadeInTimer = 0;
      return;
    }

    if (this.p.isJumping) {
      if (this.p._robotHold) {
        this.p._robotHoldTimer += dtSec;

        if (this.p._robotHoldTimer >= robotHoldMax || !this.p.upKeyDown) {
          this.p._robotHold = false;

          const goingUp = this.p.gravityFlipped
            ? this.p.yVelocity < 0
            : this.p.yVelocity > 0;

          if (goingUp && this.p._robotHoldTimer > robotReleaseMinTime) {
            this.p.yVelocity *= robotReleaseCut;
          }
        } else {
          this.p.yVelocity += this.flipMod() * robotHoldForce * dtSec;
        }
      }

      if (this.p._robotHold) {
        this.p.yVelocity -= robotGravityHold * dtSec * this.flipMod();
      } else {
        this.p.yVelocity -= robotGravityFall * dtSec * this.flipMod();
      }

      if (this.playerIsFalling()) {
        this.p.isJumping = false;
        this.p._robotHold = false;
        this._robotJumpFlameActive = false;
      }
    } else {
      this.p.yVelocity -= robotGravityFall * dtSec * this.flipMod();
    }

    if (this.p.gravityFlipped) {
      this.p.yVelocity = Math.min(this.p.yVelocity, robotMaxRise);
      this.p.yVelocity = Math.max(this.p.yVelocity, -robotMaxFall);
    } else {
      this.p.yVelocity = Math.max(this.p.yVelocity, -robotMaxRise);
      this.p.yVelocity = Math.min(this.p.yVelocity, robotMaxFall);
    }

    if (this.playerIsFalling()) {
      this.p.canJump = false;
      this._robotJumpFlameActive = false;
    }
  }
  _updateUfoJump(_dt) {
    const _ufoJump = this.p.isMini ? 13.296 : 13.742;
    const _ufoThreshold = 3.832796;
    const _ufoFastGrav = this.p.isMini ? 0.634524 : 0.540121;
    const _ufoSlowGrav = this.p.isMini ? 0.421624 : 0.359973;
    const _ufoUpVel = this.p.yVelocity * this.flipMod();
    const _ufoGrav = _ufoUpVel > _ufoThreshold ? _ufoFastGrav : _ufoSlowGrav;
    this.p.yVelocity -= p * _ufoGrav * _dt * this.flipMod();
    if (this.p.upKeyPressed) {
      const prioritizeOrb = this._shouldPrioritizeUfoOrbInput();
      this.p.upKeyPressed = false;
      if (prioritizeOrb) {
        this.p.queuedHold = false;
      } else {
        this.p.yVelocity = _ufoJump * this.flipMod();
        this.p.onGround = false;
        this.p.canJump = false;
        this.p.isJumping = true;
        try {
          this._flyParticle2Emitter.explode(6, this._scene._playerWorldX, b(this.p.y) + (this.p.gravityFlipped ? -18 : 18));
        } catch(e) {}
      }
    }
    if (!this.p.wasBoosted) {
      const _ufoMaxUp = this.p.isMini ? 18.824 : 16;
      const _ufoMaxFall = this.p.isMini ? 15.058 : 12.8;
      if (this.p.gravityFlipped) {
        this.p.yVelocity = Math.max(this.p.yVelocity, -_ufoMaxUp);
        this.p.yVelocity = Math.min(this.p.yVelocity, _ufoMaxFall);
      } else {
        this.p.yVelocity = Math.max(this.p.yVelocity, -_ufoMaxFall);
        this.p.yVelocity = Math.min(this.p.yVelocity, _ufoMaxUp);
      }
    }
    if (this.p.upKeyDown) {
      this.p.onGround = false;
    }
    if (this.p.isJumping && this.playerIsFalling()) {
      this.p.isJumping = false;
    }
  }
  _getSpiderSearchBounds(obj) {
    const radius = Number(obj?.hitbox_radius);
    if (Number.isFinite(radius) && radius > 0) {
      return {
        left: obj.x - radius,
        right: obj.x + radius,
        lower: obj.y - radius,
        upper: obj.y + radius
      };
    }

    const rad = (obj.rotationDegrees || 0) * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const halfW = obj.w / 2;
    const halfH = obj.h / 2;
    const rotatedHalfWidth = Math.abs(halfW * cos) + Math.abs(halfH * sin);
    const rotatedHalfHeight = Math.abs(halfW * sin) + Math.abs(halfH * cos);
    return {
      left: obj.x - rotatedHalfWidth,
      right: obj.x + rotatedHalfWidth,
      lower: obj.y - rotatedHalfHeight,
      upper: obj.y + rotatedHalfHeight
    };
  }

  _findSpiderTeleportHazard(goingUp, playerWorldX, playerSize, targetCenterY) {
    if (!Number.isFinite(targetCenterY)) return null;

    const xPad = Math.max(9, playerSize - 5);
    const yPad = xPad;
    const startY = this.p.y;
    const fromY = Math.min(startY, targetCenterY);
    const toY = Math.max(startY, targetCenterY);
    const nearbyObjects = this._gameLayer.getNearbySectionObjects(playerWorldX);
    let nearestHazard = null;
    let nearestDistance = Infinity;

    for (const obj of nearbyObjects) {
      if (!obj || (obj.type !== hazardType && obj.type !== "hazard")) continue;
      const bounds = this._getSpiderSearchBounds(obj);
      if (playerWorldX + xPad <= bounds.left || playerWorldX - xPad >= bounds.right) continue;
      if (bounds.upper < fromY - yPad || bounds.lower > toY + yPad) continue;

      const entryY = goingUp
        ? Math.max(startY, bounds.lower)
        : Math.min(startY, bounds.upper);
      const distance = Math.abs(entryY - startY);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestHazard = { obj, bounds };
      }
    }

    return nearestHazard;
  }

  _findSpiderTeleportSurface(goingUp, playerWorldX, playerSize) {
    const xPad = Math.max(9, playerSize - 5);
    let bestSurface = null;

    if (goingUp) {
      const ceilingY = this._gameLayer.getCeilingY();
      if (ceilingY !== null && ceilingY > this.p.y) {
        bestSurface = ceilingY;
      }
    } else {
      const floorY = this._gameLayer.getFloorY();
      if (floorY !== null && floorY < this.p.y) {
        bestSurface = floorY;
      }
    }

    const nearbyObjects = this._gameLayer.getNearbySectionObjects(playerWorldX);
    for (const obj of nearbyObjects) {
      if (obj.type !== solidType && obj.type !== "solid") continue;
      const bounds = this._getSpiderSearchBounds(obj);
      if (playerWorldX + xPad <= bounds.left || playerWorldX - xPad >= bounds.right) continue;

      if (goingUp) {
        const undersideSurface = bounds.lower;
        if (undersideSurface <= this.p.y + 0.5) continue;
        if (bestSurface === null || undersideSurface < bestSurface) {
          bestSurface = undersideSurface;
        }
      } else {
        const topSurface = bounds.upper;
        if (topSurface >= this.p.y - 0.5) continue;
        if (bestSurface === null || topSurface > bestSurface) {
          bestSurface = topSurface;
        }
      }
    }

    return bestSurface;
  }

  _updateSpiderJump(dt) {
    const playerSize = this.p.isMini ? 18 : 30;
    const _miniGrav = this.p.isMini ? 1.4 : 1;
    const _gravAmt = p * 0.6 * _miniGrav;
    const canSpiderTeleport = this.p.canJump || this.p.onGround || this.p.onCeiling;

    let prioritizeOrb = this._shouldPrioritizeGroundOrbInput();

    if (!prioritizeOrb && this.p.upKeyPressed && canSpiderTeleport) {
      this.p.upKeyPressed = false;
      this.p.queuedHold = false;

      const playerWorldX = this._scene?._playerWorldX ?? centerX;
      const goingUp = !this.p.gravityFlipped;
      const nearestSurfaceY = this._findSpiderTeleportSurface(goingUp, playerWorldX, playerSize);

      if (nearestSurfaceY !== null && Number.isFinite(nearestSurfaceY)) {
        const oldSpiderTeleportY = this.p.y;
        const normalLandingY = goingUp ? nearestSurfaceY - playerSize : nearestSurfaceY + playerSize;
        const blockingHazard = this._findSpiderTeleportHazard(goingUp, playerWorldX, playerSize, normalLandingY);

        if (blockingHazard && !window.noClip) {
          const hazardCenterY = (blockingHazard.bounds.lower + blockingHazard.bounds.upper) / 2;
          this.p.y = Number.isFinite(hazardCenterY) ? hazardCenterY : normalLandingY;
          this._spawnSpiderTeleportEffects(oldSpiderTeleportY, this.p.y);
          this.p.yVelocity = 0;
          this.p.onGround = false;
          this.p.canJump = false;
          this.p.isJumping = false;
          this.killPlayer();
          return;
        }

        this.p.y = normalLandingY;
        if (goingUp) {
          this.flipGravity(true, 1.0);
          this.p.onCeiling = true;
        } else {
          this.flipGravity(false, 1.0);
          this.p.onCeiling = false;
        }
        if (blockingHazard && window.noClip) {
          this.p._spiderTeleportNoclipDeathPending = true;
          this.p.diedThisFrame = true;
        }
        this._spawnSpiderTeleportEffects(oldSpiderTeleportY, this.p.y);
        this.p.yVelocity = 0;
        this.p.onGround = true;
        this.p.canJump = true;
        this.p.isJumping = false;
      } else {
        this.flipGravity(goingUp, 1.0);
        this.p.yVelocity = 0;
        this.p.onGround = false;
        this.p.canJump = false;
        this.p.isJumping = false;
      }

      this.p._spiderTeleportAnimTimer = 0;
      this._spiderAnimTimer = (this._spiderAnimTimer || 0) + 0.12;
      if (!this._scene?._editorPlaytestActive) {
        this.p._spiderFlashDuration = 0.5;
        this.p._spiderFlashTimer = 0.5;
      }
      this.runRotateAction();
      return;
    }

    if (this.playerIsFalling()) {
      this.p.canJump = false;
    }
    this.p.yVelocity -= _gravAmt * dt * this.flipMod();
    if (this.p.gravityFlipped) {
      this.p.yVelocity = Math.min(this.p.yVelocity, 30);
    } else {
      this.p.yVelocity = Math.max(this.p.yVelocity, -30);
    }
    if (this.playerIsFalling()) {
      const _pastThreshold = this.p.gravityFlipped
        ? this.p.yVelocity > p * 2
        : this.p.yVelocity < -(p * 2);
      if (_pastThreshold) {
        this.p.onGround = false;
      }
    }
  }
  _isPortalCollisionType(colType) {
    const typeStr = String(colType || "");
    return typeStr.startsWith("portal_") || typeStr === speedType || typeStr === "speed";
  }

  _rotatedRectanglesOverlap(cx1, cy1, hw1, hh1, rotDeg1, cx2, cy2, hw2, hh2, rotDeg2 = 0) {
    const makeRect = (cx, cy, hw, hh, rotDeg) => {
      const rad = (Number(rotDeg) || 0) * Math.PI / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      return {
        cx,
        cy,
        hw,
        hh,
        ux: { x: cos, y: sin },
        uy: { x: -sin, y: cos }
      };
    };

    const a = makeRect(cx1, cy1, hw1, hh1, rotDeg1);
    const b = makeRect(cx2, cy2, hw2, hh2, rotDeg2);
    const axes = [a.ux, a.uy, b.ux, b.uy];
    const dx = b.cx - a.cx;
    const dy = b.cy - a.cy;

    for (const axis of axes) {
      const centerDistance = Math.abs(dx * axis.x + dy * axis.y);
      const radiusA =
        a.hw * Math.abs(axis.x * a.ux.x + axis.y * a.ux.y) +
        a.hh * Math.abs(axis.x * a.uy.x + axis.y * a.uy.y);
      const radiusB =
        b.hw * Math.abs(axis.x * b.ux.x + axis.y * b.ux.y) +
        b.hh * Math.abs(axis.x * b.uy.x + axis.y * b.uy.y);

      if (centerDistance >= radiusA + radiusB) {
        return false;
      }
    }

    return true;
  }

  _isPlayerTouchingPortalHitbox(portalObj, playerWorldX, playerWorldY, playerHalfSize, previousWorldX = null, previousWorldY = null) {
    if (!portalObj) return false;

    const portalHalfW = (Number(portalObj.w) || 0) / 2;
    const portalHalfH = (Number(portalObj.h) || 0) / 2;
    const playerHalf = Math.max(0, Number(playerHalfSize) || 0);

    if (portalHalfW <= 0 || portalHalfH <= 0 || playerHalf <= 0) {
      return false;
    }

    const portalCenterX = Number(portalObj.x) || 0;
    const portalCenterY = Number(portalObj.y) || 0;
    const portalRotation = -(Number(portalObj.rotationDegrees) || 0);
    const touchesAt = (worldX, worldY) => this._rotatedRectanglesOverlap(
      portalCenterX,
      portalCenterY,
      portalHalfW,
      portalHalfH,
      portalRotation,
      Number(worldX) || 0,
      Number(worldY) || 0,
      playerHalf,
      playerHalf,
      0
    );

    if (touchesAt(playerWorldX, playerWorldY)) return true;

    const prevX = Number(previousWorldX);
    const prevY = Number(previousWorldY);
    const curX = Number(playerWorldX);
    const curY = Number(playerWorldY);
    if (!Number.isFinite(prevX) || !Number.isFinite(prevY) || !Number.isFinite(curX) || !Number.isFinite(curY)) {
      return false;
    }

    const dx = curX - prevX;
    const dy = curY - prevY;
    const distance = Math.max(Math.abs(dx), Math.abs(dy));
    if (distance <= 0) return false;

    const rad = portalRotation * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const toLocal = (worldX, worldY) => {
      const lx = worldX - portalCenterX;
      const ly = worldY - portalCenterY;
      return {
        x: lx * cos + ly * sin,
        y: lx * -sin + ly * cos
      };
    };
    const start = toLocal(prevX, prevY);
    const end = toLocal(curX, curY);
    const segDx = end.x - start.x;
    const segDy = end.y - start.y;
    const expandedHalfW = portalHalfW + playerHalf;
    const expandedHalfH = portalHalfH + playerHalf;
    let tMin = 0;
    let tMax = 1;
    const clipAxis = (startValue, deltaValue, minValue, maxValue) => {
      if (Math.abs(deltaValue) < 1e-8) {
        return startValue >= minValue && startValue <= maxValue;
      }
      let t1 = (minValue - startValue) / deltaValue;
      let t2 = (maxValue - startValue) / deltaValue;
      if (t1 > t2) {
        const swap = t1;
        t1 = t2;
        t2 = swap;
      }
      tMin = Math.max(tMin, t1);
      tMax = Math.min(tMax, t2);
      return tMin <= tMax;
    };

    if (clipAxis(start.x, segDx, -expandedHalfW, expandedHalfW) &&
        clipAxis(start.y, segDy, -expandedHalfH, expandedHalfH)) {
      return true;
    }

    const steps = Math.min(12, Math.max(2, Math.ceil(distance / Math.max(1, playerHalf))));
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      if (touchesAt(prevX + dx * t, prevY + dy * t)) return true;
    }

    return false;
  }

  checkCollisions(_0x2f5078) {
    this.noclipStats.totalFrames++;
    this.p.diedThisFrame = false;
    if (this.p._spiderTeleportNoclipDeathPending) {
      this.p.diedThisFrame = true;
      this.p._spiderTeleportNoclipDeathPending = false;
    }
    if (!this.p.upKeyDown || (this.p.upKeyDown && !this.p.wasUpKeyDown)) {
      this.p._orbActivationConsumedForPress = false;
    }
    const playerSize = this.p.isMini ? 18 : 30;
    const waveHitSize = this.p.isMini ? 6 : 9;
    const pieceWidth = _0x2f5078 + centerX;
    const previousWorldX = Number.isFinite(this._lastCollisionWorldX) ? this._lastCollisionWorldX : pieceWidth;
    const playersY = this.p.y;
    const playersLastY = this.p.lastY;
    const previousCollisionWorldY = Number.isFinite(this._lastCollisionWorldY) ? this._lastCollisionWorldY : playersLastY;
    const gamemodeAddition = this.p.isFlying || this.p.isWave || this.p.isUfo ? 12 : 20;
    this.p.collideTop = 0;
    this.p.collideBottom = 0;
    this.p.onCeiling = false;
    this.p.touchingRing = false;
    let _0x30410f = false;
    let _boostedThisStep = false;
    let _teleportedThisStep = false;
    let _orbInputConsumedThisStep = false;
    let _touchingTeleportDuringRespawnIgnore = false;
    const _0x198534 = this._gameLayer.getNearbySectionObjects(pieceWidth);
    for (let gameObj of _0x198534) {
      let left = gameObj.x - gameObj.w / 2;
      let right = gameObj.x + gameObj.w / 2;
      let top = gameObj.y - gameObj.h / 2;
      let bottom = gameObj.y + gameObj.h / 2;
      const rad = gameObj.rotationDegrees * Math.PI / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const halfW = gameObj.w / 2;
      const halfH = gameObj.h / 2;
      const rotatedHalfWidth  = Math.abs(halfW * cos) + Math.abs(halfH * sin);
      const rotatedHalfHeight = Math.abs(halfW * sin) + Math.abs(halfH * cos);
      let rotatedLeft = gameObj.x - rotatedHalfWidth;
      let rotatedRight = gameObj.x + rotatedHalfWidth;
      let rotatedTop = gameObj.y - rotatedHalfHeight;
      let rotatedBottom = gameObj.y + rotatedHalfHeight;
      const _broadSize = this.p.isWave ? waveHitSize : playerSize;
      const _hasCircleHitbox = gameObj.hitbox_radius !== undefined && gameObj.hitbox_radius !== null;
      let _broadPhaseHit;
      if (_hasCircleHitbox) {
        const _dx = pieceWidth - gameObj.x;
        const _dy = playersY - gameObj.y;
        _broadPhaseHit = (_dx * _dx + _dy * _dy) <= (gameObj.hitbox_radius + _broadSize) * (gameObj.hitbox_radius + _broadSize);
      } else {
        _broadPhaseHit = !(pieceWidth + _broadSize <= rotatedLeft) && !(pieceWidth - _broadSize >= rotatedRight) && !(playersY + _broadSize <= rotatedTop) && !(playersY - _broadSize >= rotatedBottom);
      }
      const _colType = gameObj.type;
      if (!_broadPhaseHit && _colType === "portal_teleport") {
        _broadPhaseHit = this._isPlayerTouchingPortalHitbox(gameObj, pieceWidth, playersY, _broadSize, previousWorldX, previousCollisionWorldY);
      }
      if (_broadPhaseHit) {
        if (!_hasCircleHitbox && this._isPortalCollisionType(_colType)) {
          _broadPhaseHit = _colType === "portal_teleport"
            ? this._isPlayerTouchingPortalHitbox(gameObj, pieceWidth, playersY, _broadSize, previousWorldX, previousCollisionWorldY)
            : this._isPlayerTouchingPortalHitbox(gameObj, pieceWidth, playersY, _broadSize);
          if (!_broadPhaseHit) continue;
        }
        if (_colType === "portal_teleport" && this._ignoreTeleportUntilClear) {
          _touchingTeleportDuringRespawnIgnore = true;
          this._setObjectActivated(gameObj, true);
          continue;
        }
        if (this.p.ignorePortals && (_colType.startsWith("portal_") || _colType === "speed")) {
          if (_colType === "portal_teleport") _touchingTeleportDuringRespawnIgnore = true;
          this._setObjectActivated(gameObj, true);
          continue;
        }
        const makeportalguide = (_colType.startsWith("portal_") || _colType === "speed") && !this._isObjectActivated(gameObj) && window.enablePortalGuide !== false;
        if (_colType === "portal_teleport") {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj);
            let targetY = Number(gameObj.teleportTargetY);
            if (Number.isFinite(targetY)) {
              const targetX = Number(gameObj.teleportTargetX);
              const currentCeilingY = this._gameLayer?.getCeilingY?.();
              if (currentCeilingY !== null && currentCeilingY !== undefined) {
                const ceilingExitY = currentCeilingY - playerSize - 1;
                if (targetY >= ceilingExitY) targetY = ceilingExitY;
              }
              this._playPortalShine({
                ...gameObj,
                x: Number.isFinite(targetX) ? targetX : gameObj.x,
                portalX: Number.isFinite(targetX) ? targetX : gameObj.portalX,
                portalY: targetY,
                flipX: true,
                portalFlipX: true
              });
              this.p.y = targetY;
              this.p.lastY = targetY;
              this.p.lastGroundPosY = targetY;
              if (Math.abs(targetY - playersY) > 0.001) {
                this.p.onGround = false;
                this.p.canJump = false;
              }
              _boostedThisStep = true;
              _teleportedThisStep = true;
              this._lastCollisionWorldY = targetY;
              break;
            }
          }
        } else if (_colType === "portal_fly") {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj);
            this.exitRobotMode();
            this.exitBallMode();
            this.exitWaveMode();
            this.exitShipMode();
            this.exitUfoMode();
            this.enterShipMode(gameObj);
          }
        } else if (_colType === portalWaveType) {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj);
            this.exitRobotMode();
            this.exitBallMode();
            this.exitShipMode();
            this.exitWaveMode();
            this.exitUfoMode();
            this.enterWaveMode(gameObj);
          }
        } else if (_colType === portalUfoType) {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj);
            this.exitRobotMode();
            this.exitBallMode();
            this.exitWaveMode();
            this.exitShipMode();
            this.enterUfoMode(gameObj);
          }
        } else if (_colType === "portal_cube") {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj);
            this.exitSpiderMode();
            this.exitRobotMode();
            this.exitShipMode();
            this.exitBallMode();
            this.exitWaveMode();
            this.exitUfoMode();
          }
        } else if (_colType === "portal_ball") {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj);
            this.exitRobotMode();
            this.exitShipMode();
            this.exitWaveMode();
            this.exitUfoMode();
            this.exitBallMode();
            this.enterBallMode(gameObj);
          }
        } else if (_colType === "portal_robot") {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj);
            const _portalRobotYVelocity = this.p.yVelocity;
            this.exitShipMode();
            this.exitBallMode();
            this.exitWaveMode();
            this.exitUfoMode();
            this.exitSpiderMode();
            this.exitRobotMode();
            if (Number.isFinite(_portalRobotYVelocity)) this.p.yVelocity = _portalRobotYVelocity;
            this.enterRobotMode(gameObj);
          }
        } else if (_colType === "portal_spider") {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj);
            const _portalSpiderYVelocity = this.p.yVelocity;
            this.exitShipMode();
            this.exitRobotMode();
            this.exitBallMode();
            this.exitWaveMode();
            this.exitUfoMode();
            this.exitSpiderMode();
            if (Number.isFinite(_portalSpiderYVelocity)) this.p.yVelocity = _portalSpiderYVelocity;
            this.enterSpiderMode(gameObj);
          }
        } else if (_colType === "portal_gravity_down") {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj, 2);
            this.flipGravity(false, 0.5);
          }
        } else if (_colType === "portal_gravity_up") {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj, 2);
            this.flipGravity(true, 0.5);
          }
        } else if (_colType === "portal_gravity_toggle") {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj, 2);
            this.flipGravity(!this.p.gravityFlipped, 0.5);
          }
        } else if (_colType === "portal_mirror_on") {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj);
            if (!this._scene?._editorPlaytestActive) {
              this.p.mirrored = true;
            }
          }
        } else if (_colType === "portal_mirror_off") {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj);
            if (!this._scene?._editorPlaytestActive) {
              this.p.mirrored = false;
            }
          }
        } else if (_colType === "portal_mini_on") {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj);
            this.p.isMini = true;
          }
        } else if (_colType === "portal_mini_off") {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj);
            this.p.isMini = false;
          }
        } else if (_colType === "portal_dual_on") {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj);
            this._scene._enableDualMode();
          }
        } else if (_colType === "portal_dual_off") {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj);
            this._scene._disableDualMode();
          }
        } else if (_colType === speedType) {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            this._playPortalShine(gameObj);
            if (typeof gameObj.speedValue === "number") {
              playerSpeed = gameObj.speedValue;
            }
          }
    }
		if (makeportalguide) {
          this._makeportalguide(gameObj);
        } else if (_colType === jumpPadType) {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            const _padId = gameObj.padId;
            if (_padId === 67) {
              const now = Date.now();
              if (!window.lastbluepad) {
                window.lastbluepad = 0;
              }
              if (now - window.lastbluepad < 20) {
                continue;
              }
              window.lastbluepad = now;
            }
            const _grav = 2;
            const _fm = this.flipMod();
            let _padVel = 0;
            let _padFlip = false;
            let _padNextTickVel = null;
            if (_padId === 3005) {
              const _spFloor = this._gameLayer.getFloorY();
              const _spCeil = this._gameLayer.getCeilingY() || f;
              if (!this.p.gravityFlipped) {
                this.p.y = _spCeil - playerSize;
              } else {
                this.p.y = _spFloor + playerSize;
              }
              this.flipGravity(!this.p.gravityFlipped, 1.0);
              this._syncOtherDualGravityForBlueBoost();
              this.p.yVelocity = 0;
              this.p.onGround = false;
              this.p.canJump = false;
              this.p.isJumping = false;
              _boostedThisStep = true;
            } else {
              if (this.p.isFlying) {
                if (_padId === 35) { _padVel = 16 * _grav; _padNextTickVel = _fm * 8 * _grav; }
                else if (_padId === 140) { _padVel = 5.6 * _grav; }
                else if (_padId === 1332) { _padVel = 10.08 * _grav; }
                else if (_padId === 67) { _padVel = 15.0 * _grav; _padFlip = true; }
              } else if (this.p.isUfo) {
                if (_padId === 35) { _padVel = this.p.isMini ? 25.6 : 16; }
                else if (_padId === 140) { _padVel = this.p.isMini ? 10.237037 : 12.8; }
                else if (_padId === 1332) { _padVel = this.p.isMini ? 25.6 : 16; }
                else if (_padId === 67) { _padVel = this.p.isMini ? 20.48 : 25.6; _padFlip = true; }
              } else if (this.p.isBall || this.p.isSpider) {
                if (_padId === 35) { _padVel = 9.6 * _grav; }
                else if (_padId === 140) { _padVel = 6.72 * _grav; }
                else if (_padId === 1332) { _padVel = 12 * _grav; }
                else if (_padId === 67) { _padVel = 10.0 * _grav; _padFlip = true; }
                if (this.p.isMini) {
                  _padVel *= 0.8;
                }
              } else {
                if (_padId === 35) { _padVel = 16 * _grav; }
                else if (_padId === 140) { _padVel = 10.4 * _grav; }
                else if (_padId === 1332) { _padVel = 20 * _grav; }
                else if (_padId === 67) { _padVel = 15.0 * _grav; _padFlip = true; }
                if (!this.p.isUfo && !this.p.isSpider && !this.p.isRobot && this.p.isMini) {
                  _padVel *= 0.8;
                }
              }
              this.p.isJumping = true;
              this.p.onGround = false;
              this.p.canJump = false;
              this.p.yVelocity = _fm * _padVel;
              if (_padFlip) {
                this.flipGravity(!this.p.gravityFlipped);
                if (_padId === 67) this._syncOtherDualGravityForBlueBoost();
              }
              if (_padNextTickVel !== null) {
                this.p.pendingVelocity = _padNextTickVel;
              }
              this.runRotateAction();
              _boostedThisStep = true;
            }
          }
        } else if (_colType === jumpRingType) {
          const _orbId = gameObj.orbId;
          const _isDash = (_orbId === 1704 || _orbId === 1751);
          const justPressed = this.p.upKeyDown && !this.p.wasUpKeyDown;
          const _needsClick = !_orbInputConsumedThisStep && !this.p._orbActivationConsumedForPress && ((this.p.isFlying || this.p.isUfo) ? justPressed : (justPressed || (this.p.queuedHold && this.p.upKeyDown)));
          this.p.touchingRing = true;
          if (!this._isObjectActivated(gameObj) && _needsClick) {
            if (_isDash) {
              const dashHoldTicks = this._getDashHoldTicks(gameObj) + 1;
              this._setDashHoldTicks(gameObj, dashHoldTicks);
              if (dashHoldTicks < 2) {
                this._setObjectActivated(gameObj, true);
                _orbInputConsumedThisStep = true;
                this._consumeOrbActivationInput();
                const _dashAngleDeg = gameObj.orbRotation || 0;
                const _dashRad = _dashAngleDeg * Math.PI / 180;
                const _maxSin = Math.sin(70 * Math.PI / 180);
                const _rawSin = -Math.sin(_dashRad);
                const _dashSin = Math.max(-_maxSin, Math.min(_maxSin, _rawSin));
                const _dashSpeed = 18;
                const _dashVelY = _dashSin * _dashSpeed * this.flipMod();
                if (_orbId === 1751) {
                  this.flipGravity(!this.p.gravityFlipped);
                  this._syncOtherDualGravityForBlueBoost();
                }
                this.p.isDashing = true;
                this.p.dashYVelocity = _dashVelY;
                this.p.yVelocity = _dashVelY;
                this.p.onGround = false;
                this.p.canJump = false;
                this.p.isJumping = false;
                this.runRotateAction();
                _boostedThisStep = true;
                this._markActivatedOrbSprites(gameObj);
              }
            } else {
              this._setObjectActivated(gameObj, true);
              _orbInputConsumedThisStep = true;
              this._consumeOrbActivationInput();
              const _fm = this.flipMod();
              const _cubeJump = 22.360064;
              let _orbVel = 0;
              let _flipBefore = false;
              let _flipAfter = false;
              if (_orbId === 1594) {
                this.flipGravity(!this.p.gravityFlipped);
                this._syncOtherDualGravityForBlueBoost();
                _boostedThisStep = true;
              } else if (_orbId === 444) {
                const _spPlayerSize = this.p.isMini ? 18 : 30;
                const _spFloorY = this._gameLayer.getFloorY();
                const _spCeilY  = this._gameLayer.getCeilingY() || f;
                if (!this.p.gravityFlipped) {
                  this.p.y = _spCeilY - _spPlayerSize;
                  this.flipGravity(true, 1.0);
                } else {
                  this.p.y = _spFloorY + _spPlayerSize;
                  this.flipGravity(false, 1.0);
                }
                this._syncOtherDualGravityForBlueBoost();
                this.p.yVelocity = 0;
                this.p.onGround = false;
                this.p.canJump = false;
                this.p.isJumping = false;
                this.runRotateAction();
                _boostedThisStep = true;
                this._markActivatedOrbSprites(gameObj);
              } else if (this.p.isWave) {
                if (_orbId === 84 || _orbId === 1022) {
                  this.flipGravity(!this.p.gravityFlipped);
                  this._syncOtherDualGravityForBlueBoost();
                  _boostedThisStep = true;
                  this._markActivatedOrbSprites(gameObj);
                }
              } else {
                if (this.p.isFlying) {
                  if (_orbId === 36){ _orbVel = 16; }
                    else if (_orbId === 141) { _orbVel = _cubeJump * 0.37; }
                    else if (_orbId === 1333) { _orbVel = _cubeJump; }
                    else if (_orbId === 84) { _orbVel = _cubeJump * 0.4; _flipAfter = true; }
                    else if (_orbId === 1022) { _orbVel = _cubeJump * -0.7; _flipAfter = true; }
                    else if (_orbId === 1330) { _orbVel = -28; }
					      } else if (this.p.isSwing) {
                    const _swingBase = _cubeJump * 0.6;
                    const _spiderBase = _cubeJump * 0.7;
                    if (_orbId === 36) { _orbVel = _swingBase; }
                    else if (_orbId === 141) { _orbVel = _swingBase * 0.72; }
                    else if (_orbId === 1333) { _orbVel = _swingBase * 1.38; }
                    else if (_orbId === 84) { _orbVel = _swingBase * 0.4; _flipAfter = true; }
                    else if (_orbId === 1022) { _orbVel = _spiderBase * -1; _flipAfter = true; }
                    else if (_orbId === 1330) { _orbVel = -28; }
                } else if (this.p.isBall || this.p.isSpider) {
                    const _ballBase = _cubeJump * 0.7 * (this.p.isMini ? 0.8 : 1);
                    if (_orbId === 36) { _orbVel = _ballBase; }
                    else if (_orbId === 141) { _orbVel = _ballBase * 0.77; }
                    else if (_orbId === 1333) { _orbVel = _ballBase * 1.34; }
                    else if (_orbId === 84) { _orbVel = _ballBase * 0.4; _flipAfter = true; }
                    else if (_orbId === 1022) { _orbVel = _ballBase; _flipBefore = true; } // was: _ballBase * -1, _flipAfter = true
                    else if (_orbId === 1330) { _orbVel = -30; }
                } else if (this.p.isUfo) {
                    const _ufoYellowOrb = this.p.isMini ? 17.888 : 22.36;
                    const _ufoPinkOrb = this.p.isMini ? 7.674 : 9.592;
                    const _ufoBlueOrb = (this.p.isMini ? 7.155 : 8.944) * 2;
                    if (_orbId === 36) { _orbVel = _ufoYellowOrb; }
                    else if (_orbId === 141) { _orbVel = _ufoPinkOrb; }
                    else if (_orbId === 1333) { _orbVel = _cubeJump * 1.02; }
                    else if (_orbId === 84) { _orbVel = _ufoBlueOrb; _flipAfter = true; }
                    else if (_orbId === 1022) { _orbVel = -_ufoYellowOrb * 2; _flipAfter = true; }
                    else if (_orbId === 1330) { _orbVel = -22.4; }
                } else if (this.p.isRobot) {
                    if (_orbId === 36) { _orbVel = _cubeJump * 0.9; }
                    else if (_orbId === 141) { _orbVel = _cubeJump * 0.72; }
                    else if (_orbId === 1333) { _orbVel = _cubeJump * 1.28; }
                    else if (_orbId === 84) { _orbVel = _cubeJump * 0.4; _flipAfter = true; }
                    else if (_orbId === 1022) { _orbVel = _cubeJump * 0.9; _flipBefore = true; }
                    else if (_orbId === 1330) { _orbVel = -30; }
                } else {
                    const _cubeOrbJump = _cubeJump * (this.p.isMini ? 0.8 : 1);
                    if (_orbId === 36) { _orbVel = _cubeOrbJump; }
                    else if (_orbId === 141) { _orbVel = _cubeOrbJump * 0.72; }
                    else if (_orbId === 1333) { _orbVel = _cubeOrbJump * 1.38; }
                    else if (_orbId === 84) { _orbVel = _cubeOrbJump; _flipAfter = true; }
                    else if (_orbId === 1022) { _orbVel = _cubeOrbJump * 1; _flipBefore = true; }
                    else if (_orbId === 1330) { _orbVel = -18; }
                }
                this.p.isJumping = true;
                this.p.onGround = false;
                this.p.canJump = false;
                if (_flipBefore) {
                  this.flipGravity(!this.p.gravityFlipped);
                  this._syncOtherDualGravityForBlueBoost();
                  this.p.yVelocity = this.flipMod() * _orbVel;
                } else {
                  this.p.yVelocity = _fm * _orbVel;
                }
                if (_orbId === 1330) {
                  this.p.wasBoosted = false;
                }
                this.runRotateAction();
                _boostedThisStep = true;
                if (_flipAfter) {
                  this.flipGravity(!this.p.gravityFlipped);
                  this._syncOtherDualGravityForBlueBoost();
                }
                this._markActivatedOrbSprites(gameObj);
              }
            }
          } else if (_isDash && !this.p.upKeyDown) {
            this._setDashHoldTicks(gameObj, 0);
          }
        } else if (_colType === coinType) {
          if (!this._isObjectActivated(gameObj)) {
            this._setObjectActivated(gameObj, true);
            try {
              const _coinSpr = this._gameLayer._coinSprites.find(s => s && s.active && Math.abs(s._coinWorldX - gameObj.x) < 2 && Math.abs(s._coinWorldY - gameObj.y) < 2);
              if (_coinSpr && _coinSpr.scene) {
                const _startY = _coinSpr.y;
                _coinSpr.scene.tweens.add({
                  targets: _coinSpr,
                  y: _startY - 70,
                  scaleX: (_coinSpr.scaleX || 1) * 1.3,
                  scaleY: (_coinSpr.scaleY || 1) * 1.3,
                  duration: 180,
                  ease: 'Quad.Out',
                  onComplete: () => {
                    if (!_coinSpr.scene) return;
                    _coinSpr.scene.tweens.add({
                      targets: _coinSpr,
                      y: _startY + 600,
                      alpha: 0,
                      duration: 1200,
                      ease: 'Quad.In',
                      onComplete: () => {
                        try { _coinSpr.setVisible(false); } catch(e) {}
                      }
                    });
                  }
                });
              }
            } catch(e) {}
          }
        } else if (_colType === hazardType) {
          if (window.noClip) {
            this.p.diedThisFrame = true; 
            continue;
          }
          if (_hasCircleHitbox) {
            const _hdx = pieceWidth - gameObj.x;
            const _hdy = playersY - gameObj.y;
            const _hDistSq = _hdx * _hdx + _hdy * _hdy;
            const _hMinDist = gameObj.hitbox_radius + (this.p.isWave ? waveHitSize : playerSize);
            if (_hDistSq > _hMinDist * _hMinDist) continue;
          }
          this.killPlayer();
          return;
        } else if (_colType === solidType) {
          let _0x146a97 = playersY - playerSize + gamemodeAddition;
          let _0x869e42 = playersLastY - playerSize + gamemodeAddition;
          let _0x3e7199 = playersY + playerSize - gamemodeAddition;
          let _0x135a9d = playersLastY + playerSize - gamemodeAddition;
          const _0x55559d = 9;
          let iscolliding;
          if (_hasCircleHitbox) {
            const _sdx = pieceWidth - gameObj.x;
            const _sdy = playersY - gameObj.y;
            const _sDistSq = _sdx * _sdx + _sdy * _sdy;
            const _sTightRadius = gameObj.hitbox_radius + _0x55559d;
            iscolliding = _sDistSq <= _sTightRadius * _sTightRadius;
            left = gameObj.x - gameObj.hitbox_radius;
            right = gameObj.x + gameObj.hitbox_radius;
            top = gameObj.y - gameObj.hitbox_radius;
            bottom = gameObj.y + gameObj.hitbox_radius;
          } else {
            iscolliding = pieceWidth + _0x55559d > left && pieceWidth - _0x55559d < right && playersY + _0x55559d > top && playersY - _0x55559d < bottom;
          }
          const _0xLandBot = (this.p.yVelocity <= 0 || this.p.onGround) && (_0x146a97 >= bottom || _0x869e42 >= bottom);
          const _0xLandTop = (this.p.yVelocity >= 0 || this.p.onGround) && (_0x3e7199 <= top || _0x135a9d <= top);
          const isstandingOnAPlatform = this.p.gravityFlipped ? _0xLandTop : _0xLandBot;
          if (iscolliding && !isstandingOnAPlatform) {
            if (window.noClip) this.p.diedThisFrame = true;
            if (window.noClip || gameObj.objid === 143) continue
            this.killPlayer();
            return;
          }
          if (pieceWidth + playerSize - 5 > left && pieceWidth - playerSize + 5 < right) {
            if (!this.p.gravityFlipped && (_0x146a97 >= bottom || _0x869e42 >= bottom) && (this.p.yVelocity <= 0 || this.p.onGround)) {
              this.p.y = bottom + playerSize;
              this.hitGround();
              _0x30410f = true;
              this.p.collideBottom = bottom;
              if (!this.p.isFlying) {
                this._checkSnapJump(gameObj);
              }
              continue;
            }
            if (this.p.gravityFlipped && !this.p.isFlying && (_0x3e7199 <= top || _0x135a9d <= top) && (this.p.yVelocity >= 0 || this.p.onGround)) {
              this.p.y = top - playerSize;
              this.hitGround();
              _0x30410f = true;
              this.p.onCeiling = true;
              this.p.collideTop = top;
              if (!this.p.isFlying) {
                this._checkSnapJump(gameObj);
              }
              continue;
            }
            if (this.p.isUfo) {
              if (!this.p.gravityFlipped && (_0x3e7199 <= top || _0x135a9d <= top) && (this.p.yVelocity >= 0 || this.p.onGround)) {
                this.p.y = top - playerSize;
                this.hitGround();
                this.p.onCeiling = true;
                this.p.collideTop = top;
                continue;
              }
              if (this.p.gravityFlipped && (_0x146a97 >= bottom || _0x869e42 >= bottom) && (this.p.yVelocity <= 0 || this.p.onGround)) {
                this.p.y = bottom + playerSize;
                this.hitGround();
                _0x30410f = true;
                this.p.onCeiling = true;
                this.p.collideTop = bottom;
                continue;
              }
              continue;
            }
            if ((_0x3e7199 <= top || _0x135a9d <= top) && (this.p.yVelocity >= 0 || this.p.onGround) && this.p.isFlying) {
              this.p.y = top - playerSize;
              this.hitGround();
              this.p.onCeiling = true;
              this.p.collideTop = top;
              continue;
            }
            if (!this.p.gravityFlipped && (_0x3e7199 <= top || _0x135a9d <= top) && this.p.yVelocity >= 0) {
              if (iscolliding) {
                if (window.noClip) this.p.diedThisFrame = true;
                if (window.noClip || gameObj.objid === 143) continue;
                this.killPlayer();
                return;
              }
              continue;
            }
            if (this.p.gravityFlipped && (_0x146a97 >= bottom || _0x869e42 >= bottom) && (this.p.yVelocity <= 0 || this.p.onGround) && this.p.isFlying) {
              this.p.y = bottom + playerSize;
              this.hitGround();
              _0x30410f = true;
              this.p.onCeiling = true;
              this.p.collideTop = bottom;
              continue;
            }
          }
        }
      }
    }
    if (this.p.collideTop !== 0 && this.p.collideBottom !== 0) {
      if (Math.abs(this.p.collideTop - this.p.collideBottom) < 48) {
        if (window.noClip) this.p.diedThisFrame = true;
        if (!window.noClip) {
          this.killPlayer();
          return;
        }
      }
    }
    let _0x3020c8 = this._gameLayer.getFloorY();
    const iscube = !this.p.isFlying && !this.p.isBall && !this.p.isWave && !this.p.isUfo && !this.p.isSpider;
    const _effectiveSize = this.p.isWave ? waveHitSize : playerSize;
    if (!_0x30410f && !_boostedThisStep) {
      let gravCeilY = this._gameLayer.getCeilingY();

      if (!_0x30410f && !_boostedThisStep) {
        if (this.p.y <= _0x3020c8 + _effectiveSize) {
          if (!this.p.gravityFlipped || !iscube) {
            this.p.y = _0x3020c8 + _effectiveSize;
            this.hitGround();
            if (this.p.gravityFlipped) this.p.onCeiling = true;
          } else if (this.p.gravityFlipped && iscube && this.p.yVelocity < -0.5) {
            if (window.noClip) {
              this.p.diedThisFrame = true;
            } else {
              this.killPlayer();
              return;
            }
          }
        }

        if (gravCeilY !== null) {
          if (this.p.y >= gravCeilY - _effectiveSize) {
            if (this.p.gravityFlipped) {
              this.p.y = gravCeilY - _effectiveSize;
              this.hitGround();
              this.p.onCeiling = true;
            }
          }
        }
      }
      if (!this.p.gravityFlipped && !window.noClip && this.p.y < _0x3020c8 - 30) {
        this.p.y = _0x3020c8 + _effectiveSize;
        this.p.yVelocity = 0;
        this.hitGround();
      }
      if (this.p.gravityFlipped) {
        let gravCeilY = this._gameLayer.getCeilingY();
        if (gravCeilY !== null) {
          if (this.p.y >= gravCeilY - _effectiveSize) {
            this.p.y = gravCeilY - _effectiveSize;
            this.hitGround();
            this.p.onCeiling = true;
          }
          if (!window.noClip && this.p.y > gravCeilY + 30) {
            this.p.y = gravCeilY - _effectiveSize;
            this.p.yVelocity = 0;
            this.hitGround();
            this.p.onCeiling = true;
          }
        }
      }
    }
    let _0x496456 = this._gameLayer.getCeilingY();
    if (!_teleportedThisStep && _0x496456 !== null && this.p.y >= _0x496456 - _effectiveSize && !iscube) {
      this.p.y = _0x496456 - _effectiveSize;
      this.hitGround();
      this.p.onCeiling = true;
    }
    if (this.p.y > 1890*4) {
      this.killPlayer();
      return;
    }
    if (this._ignoreTeleportUntilClear && !_touchingTeleportDuringRespawnIgnore) {
      this._ignoreTeleportUntilClear = false;
    }
    if (this.p.isFlying || this.p.isWave || this.p.isUfo || this.p.isSpider) {
      const _0x354b7c = this.p.y <= _0x3020c8 + _effectiveSize;
      const _0xdc296 = _0x496456 !== null && this.p.y >= _0x496456 - _effectiveSize;
      if (!_0x30410f && !_0x354b7c && this.p.collideTop === 0 && !_0xdc296) {
        this.p.onGround = false;
      }
    }
    this._lastCollisionWorldX = pieceWidth;
    this._lastCollisionWorldY = this.p.y;
    this.p.wasUpKeyDown = this.p.upKeyDown;
    if (this.p.diedThisFrame == true && window.noClipAccuracy){
      this.noclipStats.deathFrames++;
      this._scene.tweens.killTweensOf(this._scene.noclipFlash);
      this._scene.tweens.add({
        targets: this._scene.noclipFlash,
        alpha: { from: 0.5, to: 0 },
        duration: 400,
        ease: 'Cubic.easeOut'
      });
      if (this.p.diedLastFrame == false){
        this.noclipStats.deaths++;
      }
    }
    if (this.noclipStats.totalFrames > 0) {
      const safeFrames = this.noclipStats.totalFrames - this.noclipStats.deathFrames;
      this.noclipStats.accuracy = (safeFrames / this.noclipStats.totalFrames) * 100;
    }
    this.p.diedLastFrame = this.p.diedThisFrame;
  }
  drawHitboxes(graphics, camX, camY) {
    graphics.clear();
    const playerSize = this.p.isMini ? 18 : 30;
    const hitboxsize = playerSize*2;
    const isFlipped = this.p.mirrored;
    const camXCenter = camX + centerX;
    const playerY = this.p.y;
    const nearbyObjects = this._gameLayer.getNearbySectionObjects(camXCenter);
    for (let nearObject of nearbyObjects) {
      let objXCenter = nearObject.x - camX;
      let objYCenter = b(nearObject.y) + camY;
      let hitboxColor = 65280;
      if (nearObject.type === hazardType) {
        hitboxColor = 16729156;
      } else if (nearObject.type === "portal_fly" || nearObject.type === "portal_cube" || nearObject.type === "portal_ball" || nearObject.type === "portal_robot" || nearObject.type === portalWaveType || nearObject.type === portalUfoType) {
        hitboxColor = 4491519;
      } else if (nearObject.type === "portal_gravity_down" || nearObject.type === "portal_gravity_up" || nearObject.type === "portal_gravity_toggle") {
        hitboxColor = 16776960;
      } else if (nearObject.type === "portal_mirror_on" || nearObject.type === "portal_mirror_off") {
        hitboxColor = 16744448;
      } else if (nearObject.type === "portal_mini_on" || nearObject.type === "portal_mini_off") {
        hitboxColor = 16711935;
      } else if (nearObject.type === jumpPadType) {
        hitboxColor = 16744192;
      } else if (nearObject.type === jumpRingType) {
        hitboxColor = 16711935;
      }
      const xPos = isFlipped ? screenWidth - objXCenter : objXCenter;
      graphics.lineStyle(2, hitboxColor, 0.7);
      if (nearObject.hitbox_radius !== undefined && nearObject.hitbox_radius !== null) {
        graphics.strokeCircle(xPos, objYCenter, nearObject.hitbox_radius);
      } else {
        let rot = Phaser.Math.DegToRad(nearObject.rotationDegrees);
        let cos = Math.cos(rot);
        let sin = Math.sin(rot);
        let negWidth = -nearObject.w / 2;
        let negHeight = -nearObject.h / 2;
        let posWidth =  nearObject.w / 2;
        let posHeight =  nearObject.h / 2;
        let points = [
          { x: negWidth, y: negHeight },
          { x: posWidth, y: negHeight },
          { x: posWidth, y: posHeight },
          { x: negWidth, y: posHeight }
        ];
        let rotations = points.map(p => ({
          x: xPos + (isFlipped ? -(p.x * cos - p.y * sin) : (p.x * cos - p.y * sin)),
          y: objYCenter + (isFlipped ? -(p.x * sin + p.y * cos) : (p.x * sin + p.y * cos))
        }));
        graphics.beginPath();
        graphics.moveTo(rotations[0].x, rotations[0].y);
        graphics.lineTo(rotations[1].x, rotations[1].y);
        graphics.lineTo(rotations[2].x, rotations[2].y);
        graphics.lineTo(rotations[3].x, rotations[3].y);
        graphics.closePath();
        graphics.strokePath();
      }
    }

    if (window.showHitboxTrail) {
      const hitboxTrail = Array.isArray(this._hitboxTrail) ? this._hitboxTrail : [];
      this._hitboxTrail = hitboxTrail;
      hitboxTrail.forEach((pos, index) => {
          const trailXRaw = pos.x - camX;
          const trailX = isFlipped ? screenWidth - trailXRaw : trailXRaw;
          const trailY = b(pos.y) + camY;
          const entrySize = pos.size ?? (this.p.isMini ? 18 : 30);
          const entryHitboxSize = entrySize * 2;
          graphics.lineStyle(1, hexToHexadecimal("ff0000"), 1);

          if (!pos.isWave){
            // outer box (red)
            graphics.lineStyle(1, hexToHexadecimal("ff0000"), 0.5);
            graphics.strokeRect(trailX - entrySize, trailY - entrySize, entryHitboxSize, entryHitboxSize);

            // inner circle (dark red)
            graphics.lineStyle(1, hexToHexadecimal("b30001"), 0.5);
            graphics.strokeCircle((trailX - entrySize) + entryHitboxSize / 2, (trailY - entrySize) + entryHitboxSize / 2, entryHitboxSize / 2);

            // box that rotates with the player (dark red)
            graphics.lineStyle(1, hexToHexadecimal("b30001"), 0.5);
            {
              const cx = (trailX - entrySize) + entryHitboxSize / 2;
              const cy = (trailY - entrySize) + entryHitboxSize / 2;
              const hw = entryHitboxSize / 2;
              const cos = Math.cos(pos.rotation ?? 0);
              const sin = Math.sin(pos.rotation ?? 0);
              const corners = [
                { x: cx - hw * cos + hw * sin, y: cy - hw * sin - hw * cos },
                { x: cx + hw * cos + hw * sin, y: cy + hw * sin - hw * cos },
                { x: cx + hw * cos - hw * sin, y: cy + hw * sin + hw * cos },
                { x: cx - hw * cos - hw * sin, y: cy - hw * sin + hw * cos },
              ];
              graphics.beginPath();
              graphics.moveTo(corners[0].x, corners[0].y);
              graphics.lineTo(corners[1].x, corners[1].y);
              graphics.lineTo(corners[2].x, corners[2].y);
              graphics.lineTo(corners[3].x, corners[3].y);
              graphics.closePath();
              graphics.strokePath();
            }

            graphics.lineStyle(1, hexToHexadecimal("0000ff"), 1);
          }

          // inner hitbox
          graphics.strokeRect(trailX - 9, trailY - 9, 18, 18);
      });
    }

    // comments so its easier for other people to read ts
    const _0x1e788a = b(playerY) + camY;
    const _playerDrawX = isFlipped ? screenWidth - centerX : centerX;
    graphics.lineStyle(1, hexToHexadecimal("ff0000"), 1);
    if (!this.p.isWave){
      // outer box (red)
      graphics.lineStyle(2, hexToHexadecimal("ff0000"), 0.8);
      graphics.strokeRect(_playerDrawX - playerSize, _0x1e788a - playerSize, hitboxsize, hitboxsize);
      // inner circle (dark red)
      graphics.lineStyle(2, hexToHexadecimal("b30001"), 0.8);
      graphics.strokeCircle((_playerDrawX - playerSize)+hitboxsize/2, (_0x1e788a - playerSize)+hitboxsize/2, hitboxsize/2);

      // box that rotates with the player (dark red)
      graphics.lineStyle(2, hexToHexadecimal("b30001"), 0.8);
      {
        const cx = (_playerDrawX - playerSize) + hitboxsize / 2;
        const cy = (_0x1e788a - playerSize) + hitboxsize / 2;
        const hw = hitboxsize / 2;
        const cos = Math.cos(this._rotation);
        const sin = Math.sin(this._rotation);
        const corners = [
          { x: cx - hw * cos + hw * sin, y: cy - hw * sin - hw * cos },
          { x: cx + hw * cos + hw * sin, y: cy + hw * sin - hw * cos },
          { x: cx + hw * cos - hw * sin, y: cy + hw * sin + hw * cos },
          { x: cx - hw * cos - hw * sin, y: cy - hw * sin + hw * cos },
        ];
        graphics.beginPath();
        graphics.moveTo(corners[0].x, corners[0].y);
        graphics.lineTo(corners[1].x, corners[1].y);
        graphics.lineTo(corners[2].x, corners[2].y);
        graphics.lineTo(corners[3].x, corners[3].y);
        graphics.closePath();
        graphics.strokePath();
      }

      graphics.lineStyle(2, hexToHexadecimal("0000ff"), 1);
    }
    // inner hitbox
    graphics.strokeRect(_playerDrawX - 9, _0x1e788a - 9, 18, 18);
  }
  playEndAnimation(_0x24408e, _0x281588, _0x54bbf4) {
    this._endAnimating = true;
    this._hitboxTrail = [];
    this._hitboxGraphics.clear();
    const _0x3729ef = this._scene;
    const _0x568b25 = _0x54bbf4 || 240;
    const _0x4a45d7 = _0x3729ef._playerWorldX;
    const _0x501b73 = this.p.y;
    const _0x457676 = _0x24408e + 100;
    const _0x3ade39 = _0x568b25 - 40;
    const _0x1295ea = _0x4a45d7;
    const _0x47ae60 = _0x501b73;
    const _0x1f2e19 = _0x4a45d7 + 80;
    const _0x8bc9f4 = _0x568b25 + 300;
    const _0x11b580 = [
      this._playerSpriteLayer, this._playerGlowLayer, this._playerOverlayLayer, this._playerExtraLayer,
      this._ballSpriteLayer, this._ballGlowLayer, this._ballOverlayLayer,
      this._waveSpriteLayer, this._waveOverlayLayer, this._waveExtraLayer, this._waveGlowLayer,
      this._shipSpriteLayer, this._shipGlowLayer, this._shipOverlayLayer, this._shipExtraLayer,
      ...(this._birdLayers || []),
      ...(this._spiderLayers || []),
      ...(this._robotLayers || [])
    ].filter(_0x3e9c62 => _0x3e9c62 && _0x3e9c62.sprite && _0x3e9c62.sprite.visible).map(_0x5cedeb => _0x5cedeb.sprite);
    this._startPercent = (this._scene._playerWorldX / this._scene._level.endXPos) * 100;
    this._particleEmitter.stop();
    this._flyParticleEmitter.stop();
    this._flyParticle2Emitter.stop();
    this._shipDragEmitter.stop();
    this.p.isDashing = false;
    this.p.dashYVelocity = 0;
    if (this._dashAnimationSprite) this._dashAnimationSprite.setVisible(false);
    this._dashAnimationFrame = 0;
    this._dashAnimationTimer = 0;
    if (this._spiderDashEffectSprite) this._spiderDashEffectSprite.setVisible(false);
    this._spiderDashEffectTimer = 0;
    this._hideRobotJumpFlame();
    this._robotJumpFlameActive = false;
    this._robotJumpFlamePulse = 0;
    this._robotJumpFlameFadeInTimer = 0;
    if (this._spiderTeleportCircles?.length) {
      for (const circle of this._spiderTeleportCircles) if (circle?.destroy) circle.destroy();
      this._spiderTeleportCircles = [];
    }
    const _0x154798 = this.p.isFlying;
    const _0x3a2c8e = this.p.isSpider;
    const _0x37f14a = this.p.isRobot;
    const _0x12bfe9 = _0x3a2c8e || _0x37f14a;
    const _0x3793a4 = [this._shipSpriteLayer, this._shipGlowLayer, this._shipOverlayLayer, this._shipExtraLayer];
    const _0xbd676f = [this._playerSpriteLayer, this._playerGlowLayer, this._playerOverlayLayer, this._playerExtraLayer];
    const _0x476284 = (_0x12bfe9 && Number.isFinite(this._lastScreenX)) ? this._lastScreenX : (_0x4a45d7 - _0x3729ef._cameraX);
    const _0x1ed1ce = (_0x12bfe9 && Number.isFinite(this._lastScreenY)) ? this._lastScreenY : (b(_0x501b73) + _0x3729ef._cameraY);
    const _0x4d5f0d = _0x476284;
    const _0x3e4581 = _0x1ed1ce;
    const _0x6f5a9d = _0x1f2e19 - _0x3729ef._cameraX;
    const _0x31cb6d = b(_0x8bc9f4) + _0x3729ef._cameraY;
    const _0x46e2df = _0x457676 - _0x3729ef._cameraX;
    const _0x23fbf2 = b(_0x3ade39) + _0x3729ef._cameraY;
    const _0x3fc5a5 = _0x11b580.map(_0x5c0e81 => {
      let _0x5cbb0a = 0;
      let _0x455d13 = 0;
      if (_0x12bfe9) {
        _0x455d13 = _0x5c0e81.x - _0x476284;
        _0x5cbb0a = _0x5c0e81.y - _0x1ed1ce;
      } else if (_0x154798) {
        const _0xff16eb = _0x3793a4.some(_0x40ef1e => _0x40ef1e && _0x40ef1e.sprite === _0x5c0e81);
        const _0x4fdb53 = _0xbd676f.some(_0x4ef5b5 => _0x4ef5b5 && _0x4ef5b5.sprite === _0x5c0e81);
        if (_0xff16eb) {
          _0x5cbb0a = 10;
        } else if (_0x4fdb53) {
          _0x5cbb0a = -10;
        }
      }
      return {
        spr: _0x5c0e81,
        localX: _0x455d13,
        localY: _0x5cbb0a,
        startRotation: _0x5c0e81.rotation || 0
      };
    });
    const _0x3e35e7 = this._streak;
    const _0x51c4a8 = {
      val: 0
    };
    _0x3729ef.tweens.add({
      targets: _0x51c4a8,
      val: 1,
      duration: 1000,
      ease: _0x23df59 => Math.pow(_0x23df59, 1.2),
      onUpdate: () => {
        const spriteWidth = _0x51c4a8.val;
        const _0x2478d6 = (1 - spriteWidth) ** 3 * _0x1295ea + (1 - spriteWidth) ** 2 * 3 * spriteWidth * _0x1295ea + (1 - spriteWidth) * 3 * spriteWidth ** 2 * _0x1f2e19 + spriteWidth ** 3 * _0x457676;
        const _0x148e69 = (1 - spriteWidth) ** 3 * _0x47ae60 + (1 - spriteWidth) ** 2 * 3 * spriteWidth * _0x47ae60 + (1 - spriteWidth) * 3 * spriteWidth ** 2 * _0x8bc9f4 + spriteWidth ** 3 * _0x3ade39;
        let _0x3d0365 = _0x2478d6 - _0x3729ef._cameraX;
        let _0x3790a9 = b(_0x148e69) + _0x3729ef._cameraY;
        if (_0x12bfe9) {
          _0x3d0365 = (1 - spriteWidth) ** 3 * _0x4d5f0d + (1 - spriteWidth) ** 2 * 3 * spriteWidth * _0x4d5f0d + (1 - spriteWidth) * 3 * spriteWidth ** 2 * _0x6f5a9d + spriteWidth ** 3 * _0x46e2df;
          _0x3790a9 = (1 - spriteWidth) ** 3 * _0x3e4581 + (1 - spriteWidth) ** 2 * 3 * spriteWidth * _0x3e4581 + (1 - spriteWidth) * 3 * spriteWidth ** 2 * _0x31cb6d + spriteWidth ** 3 * _0x23fbf2;
        }
        const _0x1cb4d3 = 1 - spriteWidth * spriteWidth;
        const _0x5c8b4a = _0x12bfe9 ? (Math.PI * 2 * Math.pow(spriteWidth, 1.5)) : 0;
        const _0x1d2e2f = _0x12bfe9 ? _0x5c8b4a : (_0x3fc5a5.length ? _0x3fc5a5[0].spr.rotation : 0);
        const _0xd3cb2a = Math.cos(_0x1d2e2f);
        const _0x2f86c2 = Math.sin(_0x1d2e2f);
        this._scene._interpolatedPercent = this._startPercent + (100 - this._startPercent) * spriteWidth;
        for (const _0x2b394a of _0x3fc5a5) {
          if (!_0x2b394a?.spr) continue;
          const _0x4cc974 = _0x2b394a.localX || 0;
          const _0x522a2c = _0x2b394a.localY || 0;
          const _0xbd4f26 = _0x4cc974 * _0xd3cb2a - _0x522a2c * _0x2f86c2;
          const _0x5b67fe = _0x4cc974 * _0x2f86c2 + _0x522a2c * _0xd3cb2a;
          _0x2b394a.spr.setPosition(_0x3d0365 + _0xbd4f26, _0x3790a9 + _0x5b67fe);
          if (_0x12bfe9) _0x2b394a.spr.rotation = (_0x2b394a.startRotation || 0) + _0x5c8b4a;
          _0x2b394a.spr.setAlpha(_0x1cb4d3);
        }
        _0x3e35e7.setPosition(_0x2478d6, b(_0x148e69));
        _0x3e35e7.update(_0x3729ef.game.loop.delta / 1000);
      },
      onComplete: () => {
        this._scene._interpolatedPercent = 100;
        for (const _0x4fce42 of _0x3fc5a5) {
          if (_0x4fce42?.spr) _0x4fce42.spr.setVisible(false);
        }
        _0x3e35e7.stop();
        _0x3e35e7.reset();
        _0x281588();
      }
    });
    if (!_0x12bfe9) {
      for (const _0x25f8c5 of _0x11b580) {
        _0x3729ef.tweens.add({
          targets: _0x25f8c5,
          angle: _0x25f8c5.angle + 360,
          duration: 1000,
          ease: _0x228c03 => Math.pow(_0x228c03, 1.5)
        });
      }
    }
  }
  reset() {
    this._cleanupExplosion();
    this._endAnimating = false;
    this._lastLandObject = null;
    this._lastXOffset = 0;
    this.stopRotation();
    this.rotateActionTime = 0;
    this._rotation = 0;
    this.p._robotHold = false;
    this.p._robotHoldTimer = 0;
    this._lastCameraX = 0;
    this._lastCameraY = 0;
    const _resetWorldX = Number(this._scene?._playerWorldX);
    const _resetWorldY = Number(this.p?.y);
    this._lastCollisionWorldX = Number.isFinite(_resetWorldX) ? _resetWorldX : null;
    this._lastCollisionWorldY = Number.isFinite(_resetWorldY) ? _resetWorldY : null;
    this._ignoreTeleportUntilClear = true;
    this.setCubeVisible(true);
    this.setShipVisible(false);
    this.setBallVisible(false);
    this.setWaveVisible(false);
	  this.setBirdVisible(false);
    this.setSpiderVisible(false);
    this.setRobotVisible(false);
    for (const _0x5a0fa9 of this._allLayers) {
      if (_0x5a0fa9) {
        _0x5a0fa9.sprite.setAlpha(1);
        if (_0x5a0fa9.sprite.scaleY < 0) {
          _0x5a0fa9.sprite.scaleY = Math.abs(_0x5a0fa9.sprite.scaleY);
        }
      }
    }
    for (const _0x1e656c of this._playerLayers) {
      if (_0x1e656c) {
        _0x1e656c.sprite.setScale(1);
      }
    }
    this._particleEmitter.stop();
    this._particleActive = false;
    this._flyParticleEmitter.stop();
    this._flyParticleActive = false;
    this._flyParticle2Emitter.stop();
    this._flyParticle2Active = false;
    this._shipDragEmitter.stop();
    this._shipDragActive = false;
    if (this._dashAnimationSprite) this._dashAnimationSprite.setVisible(false);
    this._dashAnimationFrame = 0;
    this._dashAnimationTimer = 0;
    if (this._spiderDashEffectSprite) this._spiderDashEffectSprite.setVisible(false);
    this._spiderDashEffectTimer = 0;
    this._hideRobotJumpFlame();
    this._robotJumpFlameActive = false;
    this._robotJumpFlamePulse = 0;
    this._robotJumpFlameFadeInTimer = 0;
    if (this._spiderTeleportCircles?.length) {
      for (const circle of this._spiderTeleportCircles) if (circle?.destroy) circle.destroy();
      this._spiderTeleportCircles = [];
    }
    this._streak.stop();
    this._streak.reset();
    this._waveTrail.stop();
    this._waveTrail.reset();
    this._hitboxTrail = [];
    if (this._hitboxGraphics?.clear) this._hitboxGraphics.clear();
  }
}
