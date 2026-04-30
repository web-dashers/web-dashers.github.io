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
    this.isDead = false;
    this.mirrored = false;
    this.isDashing = false;
    this.dashYVelocity = 0;
    this.isDual = false;
  }
}

class cs {
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
    this._halfW = 7;
    this._glowHalfW = 14;
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
    const segNx = new Array(n - 1);
    const segNy = new Array(n - 1);
    for (let i = 0; i < n - 1; i++) {
      const dx = pts[i+1].x - pts[i].x;
      const dy = pts[i+1].y - pts[i].y;
      const len = Math.sqrt(dx*dx + dy*dy) || 1;
      segNx[i] = -dy / len;
      segNy[i] = dx / len;
    }
    const MITER_LIMIT_SQ = 4;
    for (let i = 0; i < n; i++) {
      const px = pts[i].x, py = pts[i].y;
      if (i === 0) {
        upper[0] = { x: px + segNx[0] * halfW, y: py + segNy[0] * halfW };
        lower[0] = { x: px - segNx[0] * halfW, y: py - segNy[0] * halfW };
      } else if (i === n - 1) {
        upper[i] = { x: px + segNx[i-1] * halfW, y: py + segNy[i-1] * halfW };
        lower[i] = { x: px - segNx[i-1] * halfW, y: py - segNy[i-1] * halfW };
      } else {
        const nx = segNx[i-1] + segNx[i];
        const ny = segNy[i-1] + segNy[i];
        const nlen = Math.sqrt(nx*nx + ny*ny);
        if (nlen < 1e-6) {
          upper[i] = { x: px + segNx[i-1] * halfW, y: py + segNy[i-1] * halfW };
          lower[i] = { x: px - segNx[i-1] * halfW, y: py - segNy[i-1] * halfW };
        } else {
          const mnx = nx / nlen, mny = ny / nlen;
          const dot = mnx * segNx[i-1] + mny * segNy[i-1];
          const scale = dot > 1e-4 ? Math.min(halfW / dot, halfW * 2) : halfW;
          upper[i] = { x: px + mnx * scale, y: py + mny * scale };
          lower[i] = { x: px - mnx * scale, y: py - mny * scale };
        }
      }
    }
    return { upper, lower };
  }

  _drawRibbon(gfx, pts, halfW, color, baseAlpha) {
    const n = pts.length;
    if (n < 2) return;
    const { upper, lower } = this._buildEdges(pts, halfW);
    for (let i = 0; i < n - 1; i++) {
      const alpha = Math.max(0, ((1 - pts[i].age) + (1 - pts[i+1].age)) * 0.5) * baseAlpha;
      if (alpha <= 0.01) continue;
      gfx.fillStyle(color, alpha);
      gfx.fillPoints([upper[i], upper[i+1], lower[i+1], lower[i]], true);
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
      this._drawRibbon(this._gfx, this._pts, this._halfW, window.mainColor, 1.0);
    } else {
      this._drawRibbon(this._glowGfx, this._pts, this._glowHalfW, this._glowColor, 0.22);
      this._drawRibbon(this._gfx, this._pts, this._halfW, this._color, 0.95);
      this._drawRibbon(this._gfx, this._pts, Math.round(this._halfW * 0.32), 0xffffff, 0.5);
    }
  }
}
function ds(scene, _0x592bc1, _0x4d69dc, _0xfb965c, _0x43d3fd, _0x5bbdf1) {
  let _0x221d10 = R(scene, _0xfb965c);
  if (!_0x221d10) {
    return null;
  }
  let _0x38da45 = scene.add.image(_0x592bc1, _0x4d69dc, _0x221d10.atlas, _0x221d10.frame);
  _0x38da45.setDepth(_0x43d3fd);
  _0x38da45.setVisible(_0x5bbdf1);
  return {
    sprite: _0x38da45
  };
}

class ps {
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
  _createSprites() {
    const spriteY = this._scene;
    const spriteX = b(this.p.y);
    const particleY = centerX;
    this._playerGlowLayer = ds(spriteY, particleY, spriteX, `${window.currentPlayer}_glow_001.png`, 9, false);
    this._playerSpriteLayer = ds(spriteY, particleY, spriteX, `${window.currentPlayer}_001.png`, 10, true);
    this._playerOverlayLayer = ds(spriteY, particleY, spriteX, `${window.currentPlayer}_2_001.png`, 8, true);
    this._playerExtraLayer = ds(spriteY, particleY, spriteX, `${window.currentPlayer}_extra_001.png`, 12, true);
    if (this._playerGlowLayer) {
      this._playerGlowLayer.sprite.setTint(window.secondaryColor);
      this._playerGlowLayer.sprite._glowEnabled = false;
    }
    if (this._playerSpriteLayer) {
      this._playerSpriteLayer.sprite.setTint(window.mainColor);
    } else {
      let _0x3aecd9 = spriteY.add.rectangle(particleY, spriteX, g, g, window.mainColor);
      _0x3aecd9.setDepth(10);
      this._playerSpriteLayer = {
        sprite: _0x3aecd9
      };
    }
    if (this._playerOverlayLayer) {
      this._playerOverlayLayer.sprite.setTint(window.secondaryColor);
    }
    this._shipGlowLayer = ds(spriteY, particleY, spriteX, `${window.currentShip}_glow_001.png`, 9, false);
    this._shipSpriteLayer = ds(spriteY, particleY, spriteX, `${window.currentShip}_001.png`, 10, false);
    this._shipOverlayLayer = ds(spriteY, particleY, spriteX, `${window.currentShip}_2_001.png`, 8, false);
    this._shipExtraLayer = ds(spriteY, particleY, spriteX, `${window.currentShip}_extra_001.png`, 12, false);
    if (this._shipGlowLayer) {
      this._shipGlowLayer.sprite.setTint(window.secondaryColor);
      this._shipGlowLayer.sprite._glowEnabled = false;
    }
    if (this._shipSpriteLayer) {
      this._shipSpriteLayer.sprite.setTint(window.mainColor);
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
      }], window.mainColor);
      _0x100643.setDepth(10).setVisible(false);
      this._shipSpriteLayer = {
        sprite: _0x100643
      };
    }
    if (this._shipOverlayLayer) {
      this._shipOverlayLayer.sprite.setTint(window.secondaryColor);
    }
    this._ballGlowLayer = ds(spriteY, particleY, spriteX, `${window.currentBall}_glow_001.png`, 9, false);
    this._ballSpriteLayer = ds(spriteY, particleY, spriteX, `${window.currentBall}_001.png`, 10, false);
    this._ballOverlayLayer = ds(spriteY, particleY, spriteX, `${window.currentBall}_2_001.png`, 8, false);
    if (this._ballGlowLayer) {
      this._ballGlowLayer.sprite.setTint(window.secondaryColor);
      this._ballGlowLayer.sprite._glowEnabled = false;
    }
    if (this._ballSpriteLayer) {
      this._ballSpriteLayer.sprite.setTint(window.mainColor);
    }
    if (this._ballOverlayLayer) {
      this._ballOverlayLayer.sprite.setTint(window.secondaryColor);
    }
    this._waveGlowLayer = ds(spriteY, particleY, spriteX, "player_dart_00_glow_001.png", 9, false);
    this._waveOverlayLayer = ds(spriteY, particleY, spriteX, "player_dart_00_2_001.png", 8, false);
    this._waveExtraLayer = null;
    this._waveSpriteLayer = ds(spriteY, particleY, spriteX, "player_dart_00_001.png", 10, false);
    if (this._waveGlowLayer) {
      this._waveGlowLayer.sprite.setTint(window.secondaryColor);
      this._waveGlowLayer.sprite._glowEnabled = false;
      this._waveGlowLayer.sprite.setScale(0.42);
    }
    if (this._waveSpriteLayer) {
      this._waveSpriteLayer.sprite.setTint(window.mainColor);
      this._waveSpriteLayer.sprite.setScale(0.42);
    }
    if (this._waveOverlayLayer) {
      this._waveOverlayLayer.sprite.setTint(window.secondaryColor);
      this._waveOverlayLayer.sprite.setScale(0.42);
    }
    this.playerSprite = this._playerSpriteLayer.sprite;
    this.shipSprite = this._shipSpriteLayer.sprite;
    this._playerLayers = [this._playerSpriteLayer, this._playerGlowLayer, this._playerOverlayLayer, this._playerExtraLayer];
    this._shipLayers = [this._shipSpriteLayer, this._shipGlowLayer, this._shipOverlayLayer, this._shipExtraLayer];
    this._ballLayers = [this._ballSpriteLayer, this._ballGlowLayer, this._ballOverlayLayer].filter(_0x37ad93 => !!_0x37ad93);
    this._waveLayers = [this._waveSpriteLayer, this._waveOverlayLayer, this._waveExtraLayer, this._waveGlowLayer].filter(_0x37ad93 => !!_0x37ad93);
    const _spiderBase = `${window.currentSpider}_01`;
    this._spiderSpriteLayer  = ds(spriteY, particleY, spriteX, `${_spiderBase}_001.png`,       10, false);
    this._spiderGlowLayer    = ds(spriteY, particleY, spriteX, `${_spiderBase}_glow_001.png`,  9,  false);
    this._spiderOverlayLayer = ds(spriteY, particleY, spriteX, `${_spiderBase}_2_001.png`,     8,  false);
    this._spiderExtraLayer   = ds(spriteY, particleY, spriteX, `${_spiderBase}_extra_001.png`, 12, false);
    if (this._spiderSpriteLayer)  this._spiderSpriteLayer.sprite.setTint(window.mainColor);
    if (this._spiderOverlayLayer) this._spiderOverlayLayer.sprite.setTint(window.secondaryColor);
    if (this._spiderGlowLayer)    { this._spiderGlowLayer.sprite.setTint(window.secondaryColor); this._spiderGlowLayer.sprite._glowEnabled = false; }
    this._spiderLayers = [this._spiderSpriteLayer, this._spiderGlowLayer, this._spiderOverlayLayer, this._spiderExtraLayer].filter(x => !!x);
    this._birdSpriteLayer = ds(spriteY, particleY, spriteX, `${window.currentBird}_001.png`, 10, false);
    this._birdGlowLayer = ds(spriteY, particleY, spriteX, `${window.currentBird}_2_001.png`, 9, false);
    this._birdOverlayLayer = ds(spriteY, particleY, spriteX, `${window.currentBird}_3_001.png`, 8, false);
    this._birdExtraLayer = ds(spriteY, particleY, spriteX, `${window.currentBird}_extra_001.png`, 12, false);
    if (this._birdSpriteLayer) {
      this._birdSpriteLayer.sprite.setTint(window.mainColor);
    }
    if (this._birdGlowLayer) {
      this._birdGlowLayer.sprite.setTint(window.secondaryColor);
      this._birdGlowLayer.sprite._glowEnabled = false;
    }
    if (this._birdOverlayLayer) {
      this._birdOverlayLayer.sprite.setTint(window.secondaryColor);
    }
    this._birdLayers = [this._birdSpriteLayer, this._birdGlowLayer, this._birdOverlayLayer, this._birdExtraLayer].filter(x => !!x);

    this._allLayers = [...this._playerLayers, ...this._ballLayers, ...this._waveLayers, ...this._shipLayers, ...this._spiderLayers, ...this._birdLayers];
    
    this._dashAnimationSprite = spriteY.add.image(particleY, spriteX, "GJ_GameSheetGlow", "playerDash2_001.png");
    this._dashAnimationSprite.setDepth(7);
    this._dashAnimationSprite.setVisible(false);
    this._dashAnimationSprite.setTint(0xffffff);
    this._dashAnimationSprite.setBlendMode('ADD');
  }
  _updateDashAnimation(deltaTime) {
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
      tint: window.mainColor
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
      tint: window.mainColor,
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
    this._streak = new cs(this._scene, "streak_01", 0.231, 10, 8, 100, window.secondaryColor, 0.7);
    this._streak.addToContainer(this._gameLayer.container, 8);
    this._waveTrail = new WaveTrail(this._scene, window.secondaryColor, window.secondaryColor);
    this._waveTrail.addToContainer(this._gameLayer.container, 9);
  }
  _updateParticles(_0xc43238, _0x52b718, _0x5af874) {
    if (this.p.isDead) {
      return;
    }
    const _0x119eb7 = this._scene._playerWorldX;
    const _0x519d38 = b(this.p.y);
    this._particleEmitter.particleX = _0x119eb7 - 20;
    this._particleEmitter.particleY = _0x519d38 + (this.p.gravityFlipped ? (-26 + (this.p.isUfo ? -5 : 0)) : (26 + (this.p.isUfo ? 5 : 0)));
    const _0x4436ac = this.p.onGround && !this.p.isFlying && !this.p.isWave && !this.p.isSpider;
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
      this._waveTrail.setPosition(_0x75c380, _0x2b31d7);
    }
    this._streak.update(_0x5af874);
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
    this._shipDragEmitter.setScale(this.p.gravityFlipped ? { x: -1, y: 1 } : { x: 1, y: 1 });
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
      if (layer === this._spiderGlowLayer) {
        layer.sprite.setVisible(v && layer.sprite._glowEnabled);
      } else {
        layer.sprite.setVisible(v);
      }
    }
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
    this._aboveContainer.x = -cameraX;
    this._aboveContainer.y = cameraY;
if (this.p.isFlying || this.p.isUfo) {
      const _0x3904f8 = 10;
      const playerOffset = this.p.gravityFlipped ? -30 : 10; 
      const _0x285611 = Math.cos(playerRotation);
      const _0x501bf9 = Math.sin(playerRotation);
      const _0x1b1d28 = -_0x3904f8 * _0x501bf9;
      const _0x185f91 = _0x3904f8 * _0x285611; 
      const _0x562424 = playerOffset * _0x501bf9;
      const _0x3011c9 = -playerOffset * _0x285611;
      const _ufoMode = this.p.isUfo && !this.p.isFlying;
      if (this.p.isFlying) {
        for (const layer of this._shipLayers) {
          if (layer) {
            layer.sprite.x = _0x7f0705 + _0x1b1d28;
            layer.sprite.y = _0x1a433c + _0x185f91 + (this.p.gravityFlipped ? -20 : 0);
            layer.sprite.rotation = this.p.mirrored ? -playerRotation : playerRotation;
            const _miniS = this.p.isMini ? 0.6 : 1;
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
          playerLayerItem.sprite.x = _0x7f0705 + _0x562424;
          playerLayerItem.sprite.y = (_0x1a433c + _0x3011c9)+(this.p.isMini?8:0) + (this.p.gravityFlipped ? -20 : 0);
          playerLayerItem.sprite.rotation = this.p.mirrored ? -playerRotation : playerRotation;
          const _miniS = this.p.isMini ? 0.6 : 1;
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
              _miniS *= 0.42; //fix wave size
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
              _miniS *= 0.42; //fix wave size
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
      if (window.showHitboxes) {
        this.drawHitboxes(this._hitboxGraphics, cameraX, cameraY);
      } else if (this._hitboxGraphics) {
        this._hitboxGraphics.clear();
      }
    }
  }
  enterShipMode(_0xeb37c6 = null) {
    if (this.p.isFlying) {
      return;
    }
    this.exitBallMode();
    this.exitWaveMode();
    this.p.isFlying = true;
    this._scene.toggleGlitter(true);
    this.p.yVelocity *= 0.5;
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
    for (const _0xc1f7c3 of this._playerLayers) {
      if (_0xc1f7c3) {
        _0xc1f7c3.sprite.setScale(0.55);
      }
    }
    let _0x17d728 = this.p.y;
    if (_0xeb37c6) {
      _0x17d728 = _0xeb37c6.portalY !== undefined ? _0xeb37c6.portalY : _0xeb37c6.y;
    }
    this._gameLayer.setFlyMode(true, _0x17d728, f, false);
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
      for (const _0xe1b715 of this._playerLayers) {
        if (_0xe1b715) {
          _0xe1b715.sprite.setScale(1);
        }
      }
      this._gameLayer.setFlyMode(false, 0);
    }
  }
  enterBallMode(_0x36bb3d = null) {
    if (this.p.isBall) {
      return;
    }
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
    this._gameLayer.setFlyMode(true, _0x18df19 + a, f - a * 2, true);
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
    this._gameLayer.setFlyMode(false, 0);
  }
  enterWaveMode(_0x5a10cc = null) {
    if (this.p.isWave) {
      return;
    }
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
    this._gameLayer.setFlyMode(true, _0x38b484, f, false);
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
    this.setWaveVisible(false);
    this.setCubeVisible(!this.p.isBall && !this.p.isFlying);
    this.setBallVisible(this.p.isBall);
    this.setShipVisible(this.p.isFlying);
    this.setSpiderVisible(false);
    this._gameLayer.setFlyMode(false, 0);
  }
  enterSpiderMode(portal = null) {
    if (this.p.isSpider) return;
    this.exitShipMode();
    this.exitBallMode();
    this.exitWaveMode();
    this.p.isSpider = true;
    this.p.yVelocity = 0;
    this.p.onGround = false;
    this.p.canJump = false;
    this.p.isJumping = false;
    this.p._spiderTeleportPending = false;
    this.stopRotation();
    this._rotation = 0;
    // use cube icon for spider mode (spider icon not ready yet)
    this.setCubeVisible(true);
    this.setBallVisible(false);
    this.setShipVisible(false);
    this.setWaveVisible(false);
    this.setSpiderVisible(false);
    let _y = this.p.y;
    if (portal) _y = portal.portalY !== undefined ? portal.portalY : portal.y;
    this._gameLayer.setFlyMode(true, _y + a, f - a * 2, true);
  }
  exitSpiderMode() {
    if (!this.p.isSpider) return;
    this.p.isSpider = false;
    this.p.yVelocity = 0;
    this.p.onGround = false;
    this.p.canJump = false;
    this.p.isJumping = false;
    this.p._spiderTeleportPending = false;
    this.stopRotation();
    this._rotation = 0;
    this.setSpiderVisible(false);
    this.setCubeVisible(true);
    this._gameLayer.setFlyMode(false, 0);
  }
  enterUfoMode(_portal = null) {
    if (this.p.isUfo) return;
    this.exitBallMode();
    this.exitWaveMode();
    this.exitShipMode();
    this.p.isUfo = true;
    this._scene.toggleGlitter(true);
    this.p.yVelocity *= 0.4;
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
    this._gameLayer.setFlyMode(true, _spawnY, f, false);
  }
  exitUfoMode() {
    if (!this.p.isUfo) return;
    this.p.isUfo = false;
    this._scene.toggleGlitter(false);
    this.p.yVelocity *= 0.5;
    this.p.onGround = false;
    this.p.canJump = false;
    this.p.isJumping = false;
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
    this._gameLayer.setFlyMode(false, 0);
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
    if (_0x4a38a5 && !this.p.isFlying && !this.p.isWave && !this.p.isSpider) {
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
    const _0x3f4b84 = this._scene;
    const _0x3f0446 = _0x3f4b84._getMirrorXOffset(_0x3f4b84._playerWorldX - _0x3f4b84._cameraX);
    const _0x53ac5b = b(this.p.y) + this._lastCameraY;
    const _0x281e43 = 0.9;
    _0x3f4b84.add.particles(_0x3f0446, _0x53ac5b, "GJ_WebSheet", {
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
      tint: window.mainColor,
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
    const _0x4683eb = {
      t: 0
    };
    _0x3f4b84.tweens.add({
      targets: _0x4683eb,
      t: 1,
      duration: 500,
      ease: "Quad.Out",
      onUpdate: () => {
        const _0x39f32 = 18 + _0x4683eb.t * 144;
        const _0xc8c1 = 1 - _0x4683eb.t;
        _0x438d80.clear();
        _0x438d80.fillStyle(window.mainColor, _0xc8c1);
        _0x438d80.fillCircle(_0x3f0446, _0x53ac5b, _0x39f32);
      },
      onComplete: () => _0x438d80.destroy()
    });
    this._createExplosionPieces(_0x3f0446, _0x53ac5b, _0x281e43);
    this.setCubeVisible(false);
    this.setShipVisible(false);
    this.setBallVisible(false);
    this.setWaveVisible(false);
    this.setBirdVisible(false);
    this.setSpiderVisible(false);
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
    const _0x5c571a = [this._playerGlowLayer, this._playerOverlayLayer, this._ballGlowLayer, this._ballOverlayLayer, this._waveGlowLayer, this._waveOverlayLayer, this._waveExtraLayer, this._shipGlowLayer, this._shipOverlayLayer, this._playerSpriteLayer, this._playerExtraLayer, this._ballSpriteLayer, this._waveSpriteLayer, this._shipSpriteLayer, this._shipExtraLayer, this._birdSpriteLayer, this._birdGlowLayer, this._birdOverlayLayer, this._birdExtraLayer];
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
            tint: window.mainColor,
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
  _cleanupExplosion() {
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
  _playPortalShine(_0x49e81f, type = 1) {
    const _0x4ed8ff = this._scene;
    const _0xf31b0d = _0x49e81f.x;
    const _0x3824c0 = b(_0x49e81f.portalY);

    const typeStr = (type === 1) ? "02" : "01";
    const _0x19c6b0 = [
      `portalshine_${typeStr}_front_001.png`,
      `portalshine_${typeStr}_back_001.png`
    ];

    const _0x5d636a = [this._gameLayer.topContainer, this._gameLayer.container];
    for (let _0x34fd8c = 0; _0x34fd8c < 2; _0x34fd8c++) {
      const _0x4bfe30 = R(_0x4ed8ff, _0x19c6b0[_0x34fd8c]);
      if (!_0x4bfe30) {
        continue;
      }
      const pieceSize = _0x4ed8ff.add.image(_0xf31b0d, _0x3824c0, _0x4bfe30.atlas, _0x4bfe30.frame);
      pieceSize.setBlendMode(S);
      pieceSize.setAlpha(0);
      pieceSize.angle = _0x49e81f.rotationDegrees;
      _0x5d636a[_0x34fd8c].add(pieceSize);
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
      console.log("flipGravity called: flipped=" + flipped + " current=" + this.p.gravityFlipped);
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
    if (this.p.isBall || this.p.isWave || this.p.isSpider) {
      return;
    }
    let _0x183c2a = this.convertToClosestRotation();
    let _0x108955 = 0.47250000000000003;
    let _0x17a9a6 = Math.min(_0x5c24f7 * 1, _0x108955 * _0x5c24f7);
    this._rotation = this.slerp2D(this._rotation, _0x183c2a, _0x17a9a6);
  }
  updateBallRoll(_0x1dd8af, onSurface) {
    const _0x136f29 = this.p.gravityFlipped ? -1 : 1;
    const speedFactor = onSurface ? 0.5 : 0.35;
    this._rotation += _0x1dd8af / (g / 2) * _0x136f29 * speedFactor;
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
      this._updateWaveJump();
    } else if (this.p.isBall) {
      this._updateBallJump(_0x3d1c6f);
    } else if (this.p.isUfo) {
      this._updateUfoJump(_0x3d1c6f);
    } else if (this.p.isSpider) {
      this._updateSpiderJump(_0x3d1c6f);
    } else if (this.p.upKeyDown && this.p.canJump && !this.p.touchingRing) {
      this.p.isJumping = true;
      this.p.onGround = false;
      this.p.canJump = false;
      this.p.upKeyPressed = false;
      this.p.queuedHold = false;
      this.p.yVelocity = this.flipMod() * 22.360064;
      this.runRotateAction();
    } else if (this.p.isJumping) {
      const _miniGrav = this.p.isMini ? 1.4 : 1;
      this.p.yVelocity -= p * _0x3d1c6f * this.flipMod() * _miniGrav;
      if (this.playerIsFalling()) {
        this.p.isJumping = false;
        this.p.onGround = false;
      }
    } else {
      if (this.playerIsFalling()) {
        this.p.canJump = false;
      }
      const _miniGrav = this.p.isMini ? 1.4 : 1;
      this.p.yVelocity -= p * _0x3d1c6f * this.flipMod() * _miniGrav;
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
  _updateFlyJump(_0x130c46) {
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
    this.p.yVelocity -= p * _0x130c46 * this.flipMod() * _0x203040 * _0x2d237f;
    if (this.p.upKeyDown) {
      this.p.onGround = false;
    }
    if (!this.p.wasBoosted) {
      if (this.p.gravityFlipped) {
        this.p.yVelocity = Math.max(this.p.yVelocity, -16);
        this.p.yVelocity = Math.min(this.p.yVelocity, 12.8);
      } else {
        this.p.yVelocity = Math.max(this.p.yVelocity, -12.8);
        this.p.yVelocity = Math.min(this.p.yVelocity, 16);
      }
    }
  }
_updateBallJump(_0x2fe319) {
  const _miniGrav = this.p.isMini ? 1.4 : 1;
  const _0x144266 = p * 0.6 * _miniGrav;
  if (this.p.upKeyPressed && this.p.canJump) {
    const _0x47d739 = this.flipMod();
    this.p.upKeyPressed = false;
    this.p.yVelocity = _0x47d739 * 22.360064;
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
  _updateWaveJump() {
    const _0x1a4d8f = (this.p.isMini ? 22.7720072 : 11.3860036) * (playerSpeed / 11.540004);
    let _0x312a7f = (this.p.upKeyDown ? 1 : -1) * this.flipMod() * _0x1a4d8f;
    if (this.p.onGround) {
      const _0x41866f = this.p.onCeiling ? _0x312a7f < 0 : _0x312a7f > 0;
      if (_0x41866f) {
        this.p.onGround = false;
      } else {
        _0x312a7f = 0;
      }
    }
    this.p.canJump = false;
    this.p.isJumping = false;
    this.p.yVelocity = _0x312a7f;
    const _waveAngle = this.p.isMini ? Math.atan(0.5) : Math.PI / 4;
    this._rotation = _0x312a7f === 0 ? 0 : _0x312a7f > 0 ? -_waveAngle : _waveAngle;
  }
  _updateUfoJump(_dt) {
    const _miniGrav = this.p.isMini ? 1.35 : 1;
    const _gravStrength = p * 0.55 * _miniGrav;
    this.p.yVelocity -= _gravStrength * _dt * this.flipMod();
    if (this.p.upKeyPressed) {
      this.p.upKeyPressed = false;
      const _burstVel = 14.5 * this.flipMod();
      this.p.yVelocity = _burstVel;
      this.p.onGround = false;
      this.p.canJump = false;
      this.p.isJumping = true;
      try {
        this._flyParticle2Emitter.explode(6, this._scene._playerWorldX, b(this.p.y) + (this.p.gravityFlipped ? -18 : 18));
      } catch(e) {}
    }
    if (!this.p.wasBoosted) {
      if (this.p.gravityFlipped) {
        this.p.yVelocity = Math.max(this.p.yVelocity, -14.5);
        this.p.yVelocity = Math.min(this.p.yVelocity, 11);
      } else {
        this.p.yVelocity = Math.max(this.p.yVelocity, -11);
        this.p.yVelocity = Math.min(this.p.yVelocity, 14.5);
      }
    }
    if (this.p.upKeyDown) {
      this.p.onGround = false;
    }
    if (this.p.isJumping && this.playerIsFalling()) {
      this.p.isJumping = false;
    }
  }
  _updateSpiderJump(dt) {
    const playerSize = this.p.isMini ? 18 : 30;
    const _miniGrav = this.p.isMini ? 1.4 : 1;
    const _gravAmt = p * 0.6 * _miniGrav;
    if (this.p.upKeyPressed && this.p.canJump) {
      this.p.upKeyPressed = false;
      this.p.queuedHold = false;
      const _floorY = this._gameLayer.getFloorY();
      const _ceilY  = this._gameLayer.getCeilingY();
      let nearestSurfaceY;
      if (!this.p.gravityFlipped) {
        nearestSurfaceY = _ceilY !== null ? _ceilY : Infinity;
        const playerWorldX = this._scene._playerWorldX;
        const nearbyObjects = this._gameLayer.getNearbySectionObjects(playerWorldX);
        for (const obj of nearbyObjects) {
          if (obj.type === "solid" && obj.y < this.p.y) {
            const objTop = obj.y - obj.h / 2;
            if (objTop > nearestSurfaceY || nearestSurfaceY === null) {
              nearestSurfaceY = objTop;
            }
          }
        }
      } else {
        nearestSurfaceY = _floorY;
        const playerWorldX = this._scene._playerWorldX;
        const nearbyObjects = this._gameLayer.getNearbySectionObjects(playerWorldX);
        for (const obj of nearbyObjects) {
          if (obj.type === "solid" && obj.y > this.p.y) {
            const objBottom = obj.y + obj.h / 2;
            if (objBottom < nearestSurfaceY || nearestSurfaceY === null) {
              nearestSurfaceY = objBottom;
            }
          }
        }
      }
      
      if (!this.p.gravityFlipped) {
        if (isFinite(nearestSurfaceY)) {
          this.p.y = nearestSurfaceY - playerSize;
          this.flipGravity(true, 1.0);
          this.p.yVelocity = 0;
        } else {
          this.p.yVelocity = playerSpeed;
        }
      } else {
        if (isFinite(nearestSurfaceY)) {
          this.p.y = nearestSurfaceY + playerSize;
          this.flipGravity(false, 1.0);
          this.p.yVelocity = 0;
        } else {
          this.p.yVelocity = -playerSpeed;
        }
      }
      this.p.onGround = false;
      this.p.canJump = false;
      this.p.isJumping = false;
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
  checkCollisions(_0x2f5078) {
    this.noclipStats.totalFrames++;
    this.p.diedThisFrame = false;
    const playerSize = this.p.isMini ? 18 : 30;
    const waveHitSize = this.p.isMini ? 6 : 9;
    const pieceWidth = _0x2f5078 + centerX;
    const playersY = this.p.y;
    const playersLastY = this.p.lastY;
    const gamemodeAddition = this.p.isFlying || this.p.isWave || this.p.isUfo ? 12 : 20;
    this.p.collideTop = 0;
    this.p.collideBottom = 0;
    this.p.onCeiling = false;
    this.p.touchingRing = false;
    let _0x30410f = false;
    let _boostedThisStep = false;
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
      if (_broadPhaseHit) {
        const _colType = gameObj.type;
        if (_colType === "portal_fly") {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this.exitBallMode();
            this.exitWaveMode();
            this.exitShipMode();
            this.exitUfoMode();
            this.enterShipMode(gameObj);
          }
        } else if (_colType === portalWaveType) {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this.exitBallMode();
            this.exitShipMode();
            this.exitWaveMode();
            this.exitUfoMode();
            this.enterWaveMode(gameObj);
          }
        } else if (_colType === portalUfoType) {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this.exitBallMode();
            this.exitWaveMode();
            this.exitShipMode();
            this.enterUfoMode(gameObj);
          }
        } else if (_colType === "portal_cube") {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this.exitShipMode();
            this.exitBallMode();
            this.exitWaveMode();
            this.exitUfoMode();
          }
        } else if (_colType === "portal_ball") {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this.exitShipMode();
            this.exitWaveMode();
            this.exitUfoMode();
            this.exitBallMode();
            this.enterBallMode(gameObj);
          }
        } else if (_colType === "portal_spider") {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this.exitShipMode();
            this.exitBallMode();
            this.exitWaveMode();
            this.exitUfoMode();
            this.exitSpiderMode();
            this.enterSpiderMode(gameObj);
          }
        } else if (_colType === "portal_gravity_down") {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj, 2);
            this.flipGravity(false, 0.5);
          }
        } else if (_colType === "portal_gravity_up") {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj, 2);
            this.flipGravity(true, 0.5);
          }
        } else if (_colType === "portal_mirror_on") {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this.p.mirrored = true;
          }
        } else if (_colType === "portal_mirror_off") {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this.p.mirrored = false;
          }
        } else if (_colType === "portal_mini_on") {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this.p.isMini = true;
          }
        } else if (_colType === "portal_mini_off") {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this.p.isMini = false;
          }
        } else if (_colType === "portal_dual_on") {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this._scene._enableDualMode();
          }
        } else if (_colType === "portal_dual_off") {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this._scene._disableDualMode();
          }
        } else if (_colType === speedType) {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            if (typeof gameObj.speedValue === "number") {
              playerSpeed = gameObj.speedValue;
            }
          }
        } else if (_colType === jumpPadType) {
          if (!gameObj.activated) {
            gameObj.activated = true;
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
              } else if (this.p.isBall) {
                if (_padId === 35) { _padVel = 9.6 * _grav; }
                else if (_padId === 140) { _padVel = 6.72 * _grav; }
                else if (_padId === 1332) { _padVel = 12 * _grav; }
                else if (_padId === 67) { _padVel = 10.0 * _grav; _padFlip = true; }
              } else {
                if (_padId === 35) { _padVel = 16 * _grav; }
                else if (_padId === 140) { _padVel = 10.4 * _grav; }
                else if (_padId === 1332) { _padVel = 20 * _grav; }
                else if (_padId === 67) { _padVel = 15.0 * _grav; _padFlip = true; }
              }
              this.p.isJumping = true;
              this.p.onGround = false;
              this.p.canJump = false;
              this.p.yVelocity = _fm * _padVel;
              if (_padFlip) {
                this.flipGravity(!this.p.gravityFlipped);
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
          const _needsClick = (this.p.isFlying || this.p.isUfo) ? justPressed : (_isDash ? this.p.upKeyDown : (justPressed || (this.p.queuedHold && this.p.upKeyDown)));
          this.p.touchingRing = true;
          if (!gameObj.activated && _needsClick) {
            if (_isDash) {
              gameObj._dashHoldTicks = (gameObj._dashHoldTicks || 0) + 1;
              if (gameObj._dashHoldTicks < 2) {
                gameObj.activated = true;
                const _dashAngleDeg = gameObj.orbRotation || 0;
                let _clampedAngle = _dashAngleDeg;
                if (_clampedAngle > 270) { _clampedAngle -= 360; }
                if (_clampedAngle >= 90 && _clampedAngle <= 270) { _clampedAngle = 180 - _clampedAngle; }
                _clampedAngle = Math.max(-70, Math.min(70, _clampedAngle));
                const _dashRad = _clampedAngle * Math.PI / 180;
                const _dashSpeed = 18;
                const _dashVelY = Math.sin(_dashRad) * _dashSpeed * this.flipMod();
                if (_orbId === 1751) {
                  this.flipGravity(!this.p.gravityFlipped);
                }
                this.p.isDashing = true;
                this.p.dashYVelocity = _dashVelY;
                this.p.yVelocity = _dashVelY;
                this.p.onGround = false;
                this.p.canJump = false;
                this.p.isJumping = false;
                this.p.upKeyPressed = false;
                this.p.queuedHold = false;
                this.runRotateAction();
                _boostedThisStep = true;
                try {
                  for (let _orbSpr of (this._gameLayer._orbSprites || [])) {
                    if (_orbSpr && _orbSpr._eeWorldX !== undefined && Math.abs(_orbSpr._eeWorldX - gameObj.x) < 10) {
                      _orbSpr._hitTime = Date.now();
                    }
                  }
                } catch(e) {}
              }
            } else {
              gameObj.activated = true;
              const _fm = this.flipMod();
              const _cubeJump = 22.360064;
              let _orbVel = 0;
              let _flipBefore = false;
              let _flipAfter = false;
              if (_orbId === 1594) {
                this.flipGravity(!this.p.gravityFlipped);
                this.p.upKeyPressed = false;
                this.p.queuedHold = false;
                _boostedThisStep = true;
              } else if (_orbId === 444) {
                const _spPlayerSize = this.p.isMini ? 18 : 30;
                const _spFloorY = this._gameLayer.getFloorY();
                const _spCeilY  = this._gameLayer.getCeilingY() || f;
                this.p.upKeyPressed = false;
                this.p.queuedHold = false;
                if (!this.p.gravityFlipped) {
                  this.p.y = _spCeilY - _spPlayerSize;
                  this.flipGravity(true, 1.0);
                } else {
                  this.p.y = _spFloorY + _spPlayerSize;
                  this.flipGravity(false, 1.0);
                }
                this.p.yVelocity = 0;
                this.p.onGround = false;
                this.p.canJump = false;
                this.p.isJumping = false;
                this.runRotateAction();
                _boostedThisStep = true;
                try {
                  for (let _orbSpr of (this._gameLayer._orbSprites || [])) {
                    if (_orbSpr && _orbSpr._eeWorldX !== undefined && Math.abs(_orbSpr._eeWorldX - gameObj.x) < 10) {
                      _orbSpr._hitTime = Date.now();
                    }
                  }
                } catch(e) {}
              } else if (this.p.isWave) {
                if (_orbId === 84 || _orbId === 1022) {
                  this.flipGravity(!this.p.gravityFlipped);
                  this.p.upKeyPressed = false;
                  this.p.queuedHold = false;
                  _boostedThisStep = true;
                  try {
                    for (let _orbSpr of (this._gameLayer._orbSprites || [])) {
                      if (_orbSpr && _orbSpr._eeWorldX !== undefined && Math.abs(_orbSpr._eeWorldX - gameObj.x) < 10) {
                        _orbSpr._hitTime = Date.now();
                      }
                    }
                  } catch(e) {}
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
                } else if (this.p.isBall) {
                  const _ballBase = _cubeJump * 0.7;
                  if (_orbId === 36) { _orbVel = _ballBase; }
                  else if (_orbId === 141) { _orbVel = _ballBase * 0.77; }
                  else if (_orbId === 1333) { _orbVel = _ballBase * 1.34; }
                  else if (_orbId === 84) { _orbVel = _ballBase * 0.4; _flipAfter = true; }
                  else if (_orbId === 1022) { _orbVel = _ballBase * -1; _flipAfter = true; }
                  else if (_orbId === 1330) { _orbVel = -30; }
                } else if (this.p.isUfo) {
                  if (_orbId === 36) { _orbVel = 16; }
                  else if (_orbId === 141) { _orbVel = _cubeJump * 0.42; }
                  else if (_orbId === 1333) { _orbVel = _cubeJump * 1.02; }
                  else if (_orbId === 84) { _orbVel = _cubeJump * 0.4; _flipAfter = true; }
                  else if (_orbId === 1022) { _orbVel = -16; _flipAfter = true; }
                  else if (_orbId === 1330) { _orbVel = -22.4; }
                } else if (this.p.isRobot) {
                  if (_orbId === 36) { _orbVel = _cubeJump * 0.9; }
                  else if (_orbId === 141) { _orbVel = _cubeJump * 0.72; }
                  else if (_orbId === 1333) { _orbVel = _cubeJump * 1.28; }
                  else if (_orbId === 84) { _orbVel = _cubeJump * 0.4; _flipAfter = true; }
                  else if (_orbId === 1022) { _orbVel = _cubeJump * -1; _flipAfter = true; }
                  else if (_orbId === 1330) { _orbVel = -30; }
                } else if (this.p.isSpider) {
                  const _spiderBase = _cubeJump * 0.7;
                  if (_orbId === 36) { _orbVel = _spiderBase; }
                  else if (_orbId === 141) { _orbVel = _spiderBase * 0.77; }
                  else if (_orbId === 1333) { _orbVel = _spiderBase * 1.34; }
                  else if (_orbId === 84) { _orbVel = _spiderBase * 0.4; _flipAfter = true; }
                  else if (_orbId === 1022) { _orbVel = _spiderBase * -1; _flipAfter = true; }
                  else if (_orbId === 1330) { _orbVel = -30; }
                } else {
                  if (_orbId === 36) { _orbVel = _cubeJump; }
                  else if (_orbId === 141) { _orbVel = _cubeJump * 0.72; }
                  else if (_orbId === 1333) { _orbVel = _cubeJump * 1.38; }
                  else if (_orbId === 84) { _orbVel = _cubeJump; _flipAfter = true; }
                  else if (_orbId === 1022) { _orbVel = _cubeJump * 0.8; _flipBefore = true; }
                  else if (_orbId === 1330) { _orbVel = -18; }
                }
                this.p.isJumping = true;
                this.p.onGround = false;
                this.p.canJump = false;
                this.p.upKeyPressed = false;
                this.p.queuedHold = false;
                if (_flipBefore) {
                  this.flipGravity(!this.p.gravityFlipped);
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
                }
                try {
                  for (let _orbSpr of (this._gameLayer._orbSprites || [])) {
                    if (_orbSpr && _orbSpr._eeWorldX !== undefined && Math.abs(_orbSpr._eeWorldX - gameObj.x) < 10) {
                      _orbSpr._hitTime = Date.now();
                    }
                  }
                } catch(e) {}
              }
            }
          } else if (_isDash && !this.p.upKeyDown) {
            gameObj._dashHoldTicks = 0;
          }
        } else if (_colType === coinType) {
          if (!gameObj.activated) {
            gameObj.activated = true;
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
    if (_0x496456 !== null && this.p.y >= _0x496456 - _effectiveSize && !iscube) {
      this.p.y = _0x496456 - _effectiveSize;
      this.hitGround();
      this.p.onCeiling = true;
    }
    if (this.p.y > 1890*4) {
      this.killPlayer();
      return;
    }
    if (this.p.isFlying || this.p.isWave || this.p.isUfo || this.p.isSpider) {
      const _0x354b7c = this.p.y <= _0x3020c8 + _effectiveSize;
      const _0xdc296 = _0x496456 !== null && this.p.y >= _0x496456 - _effectiveSize;
      if (!_0x30410f && !_0x354b7c && this.p.collideTop === 0 && !_0xdc296) {
        this.p.onGround = false;
      }
    }
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
      } else if (nearObject.type === "portal_fly" || nearObject.type === "portal_cube" || nearObject.type === "portal_ball" || nearObject.type === portalWaveType || nearObject.type === portalUfoType) {
        hitboxColor = 4491519;
      } else if (nearObject.type === "portal_gravity_down" || nearObject.type === "portal_gravity_up") {
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
      if (!this._hitboxTrail) this._hitboxTrail = [];
      
      if (!this.p.isDead) {
          this._hitboxTrail.push({ x: this._scene._playerWorldX, y: this.p.y });
          if (this._hitboxTrail.length > 100) this._hitboxTrail.shift();
      }

      this._hitboxTrail.forEach((pos, index) => {
          const trailXRaw = pos.x - camX;
          const trailX = isFlipped ? screenWidth - trailXRaw : trailXRaw;
          const trailY = b(pos.y) + camY;
          graphics.lineStyle(1, hexToHexadecimal("ff0000"), 1);

          if (!this.p.isWave){
            // outer box (red)
            graphics.lineStyle(1, hexToHexadecimal("ff0000"), 0.5);
            graphics.strokeRect(trailX - playerSize, trailY - playerSize, hitboxsize, hitboxsize);

            // inner circle (dark red)
            graphics.lineStyle(1, hexToHexadecimal("b30001"), 0.5);
            graphics.strokeCircle((trailX - playerSize) + hitboxsize / 2, (trailY - playerSize) + hitboxsize / 2, hitboxsize / 2);

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
    const _0x11b580 = [this._playerSpriteLayer, this._playerGlowLayer, this._playerOverlayLayer, this._playerExtraLayer, this._ballSpriteLayer, this._ballGlowLayer, this._ballOverlayLayer, this._waveSpriteLayer, this._waveOverlayLayer, this._waveExtraLayer, this._waveGlowLayer, this._shipSpriteLayer, this._shipGlowLayer, this._shipOverlayLayer, this._shipExtraLayer].filter(_0x3e9c62 => _0x3e9c62 && _0x3e9c62.sprite.visible).map(_0x5cedeb => _0x5cedeb.sprite);
    this._startPercent = (this._scene._playerWorldX / this._scene._level.endXPos) * 100;
    this._particleEmitter.stop();
    this._flyParticleEmitter.stop();
    this._flyParticle2Emitter.stop();
    this._shipDragEmitter.stop();
    const _0x154798 = this.p.isFlying;
    const _0x3793a4 = [this._shipSpriteLayer, this._shipGlowLayer, this._shipOverlayLayer, this._shipExtraLayer];
    const _0xbd676f = [this._playerSpriteLayer, this._playerGlowLayer, this._playerOverlayLayer, this._playerExtraLayer];
    const _0x3fc5a5 = _0x11b580.map(_0x5c0e81 => {
      let _0x5cbb0a = 0;
      if (_0x154798) {
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
        localY: _0x5cbb0a
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
        const _0x3d0365 = _0x2478d6 - _0x3729ef._cameraX;
        const _0x3790a9 = b(_0x148e69) + _0x3729ef._cameraY;
        const _0x1cb4d3 = 1 - spriteWidth * spriteWidth;
        const _0x1d2e2f = _0x3fc5a5[0].spr.rotation;
        const _0xd3cb2a = Math.cos(_0x1d2e2f);
        const _0x2f86c2 = Math.sin(_0x1d2e2f);
        this._scene._interpolatedPercent = this._startPercent + (100 - this._startPercent) * spriteWidth;
        for (const _0x2b394a of _0x3fc5a5) {
          const _0xbd4f26 = -_0x2b394a.localY * _0x2f86c2;
          const _0x5b67fe = _0x2b394a.localY * _0xd3cb2a;
          _0x2b394a.spr.setPosition(_0x3d0365 + _0xbd4f26, _0x3790a9 + _0x5b67fe);
          _0x2b394a.spr.setAlpha(_0x1cb4d3);
        }
        _0x3e35e7.setPosition(_0x2478d6, b(_0x148e69));
        _0x3e35e7.update(_0x3729ef.game.loop.delta / 1000);
      },
      onComplete: () => {
        this._scene._interpolatedPercent = 100;
        for (const _0x4fce42 of _0x3fc5a5) {
          _0x4fce42.spr.setVisible(false);
        }
        _0x3e35e7.stop();
        _0x3e35e7.reset();
        _0x281588();
      }
    });
    for (const _0x25f8c5 of _0x11b580) {
      _0x3729ef.tweens.add({
        targets: _0x25f8c5,
        angle: _0x25f8c5.angle + 360,
        duration: 1000,
        ease: _0x228c03 => Math.pow(_0x228c03, 1.5)
      });
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
    this._lastCameraX = 0;
    this._lastCameraY = 0;
    this.setCubeVisible(true);
    this.setShipVisible(false);
    this.setBallVisible(false);
    this.setWaveVisible(false);
	this.setBirdVisible(false);
    this.setSpiderVisible(false);
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
    this._streak.stop();
    this._streak.reset();
    this._waveTrail.stop();
    this._waveTrail.reset();
  }
}
