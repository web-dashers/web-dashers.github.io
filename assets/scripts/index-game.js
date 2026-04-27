// editable config stuff 

if (window.mainColor == null) {
  window.mainColor = parseInt(localStorage.getItem("iconMainColor") || "04FF00", 16);
}
if (window.secondaryColor == null) {
  window.secondaryColor = parseInt(localStorage.getItem("iconSecondaryColor") || "00FBFF", 16);
}
window.currentPlayer = localStorage.getItem("iconCurrentPlayer") || "player_01";
window.currentShip   = localStorage.getItem("iconCurrentShip")   || "ship_01";
window.currentBall   = localStorage.getItem("iconCurrentBall")   || "player_ball_01";
window.currentWave   = localStorage.getItem("iconCurrentWave")   || "dart_01";
window.currentSpider = localStorage.getItem("iconCurrentSpider") || "spider_01";
window.currentBird   = localStorage.getItem("iconCurrentBird")   || "bird_01";
window.currentlevel = [
	"stereo_madness", // internal level name
	"Stereo Madness", // proper level name
	"level_1",        // level id in assets/levels
	["RobTop", "Forever Bound"]   // person who made the song
];
window.orbClickScale = 2.0;
window.orbClickShrinkTime = 250;
window.orbParticleSize = 3.5;

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('id')) {
  window.levelID = urlParams.get('id');
}

// -------------------------------

function hexToHexadecimal(str) {
  return parseInt(str, 16);
}

function hexadecimalToHex(num) {
  return num.toString(16).padStart(6, '0');
}

let screenWidth = 1138;
const screenHeight = 640;
const a = 60;
const o = 180;
let centerX = screenWidth / 2 - 150;
function l(screenWidth) {
  this.screenWidth = screenWidth;
  centerX = screenWidth / 2 - 150;
}
const u = 1 / 240;
const SpeedPortal = {
  HALF: 9.30222544655,
  ONE_TIMES: 11.540004,
  TWO_TIMES: 14.3488938625,
  THREE_TIMES: 17.3333393414,
  FOUR_TIMES: 21.3333407279
}
let playerSpeed = SpeedPortal.ONE_TIMES;
const d = 0.9;
const p = 1.916398;
const f = 600;
const g = a;
const jumpPadType = "jump_pad";
const jumpRingType = "jump_ring";
const T = 460;
function b(y) {
  return T - y;
}
let S = Phaser.BlendModes.ADD;
let E = Phaser.BlendModes.NORMAL;
class A extends Phaser.Scene {
  constructor() {
    super({
      key: "BootScene"
    });
  }
preload() {
	if (window.gameCache) window.gameCache.init();
    (function (game) {
      if (game.renderer.type === Phaser.WEBGL) {
        let gl = game.renderer.gl;
        S = game.renderer.addBlendMode([gl.SRC_ALPHA, gl.ONE], gl.FUNC_ADD);
        E = game.renderer.addBlendMode([gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA], gl.FUNC_ADD);
      }
    })(this.game);
 
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const cx = W / 2;
    const cy = H / 2;
 
    this.add.rectangle(cx, cy, W, H, 0x000000);
 
    const barW = W * 0.55;
    const barH = 18;
    const barX = cx - barW / 2;
    const barY = cy + 20;
    const barBg = this.add.graphics();
    barBg.fillStyle(0x111133, 1);
    barBg.fillRoundedRect(barX - 2, barY - 2, barW + 4, barH + 4, 10);
    barBg.fillStyle(0x001133, 1);
    barBg.fillRoundedRect(barX, barY, barW, barH, 8);
 
    const barFill = this.add.graphics();
 
    const pctText = this.add.text(cx, barY + barH + 18, '0%', {
      fontSize: '14px', fontFamily: 'Arial', color: '#6699ff'
    }).setOrigin(0.5, 0);
 
    const loadingText = this.add.text(cx, barY - 24, 'Loading...', {
      fontSize: '15px', fontFamily: 'Arial', color: '#445588'
    }).setOrigin(0.5, 1);
 
    const consoleX = cx - barW / 2;
    const consoleY = barY + barH + 44;
    const consoleW = barW;
    const consoleH = 120;
    const consoleBg = this.add.graphics();
    consoleBg.fillStyle(0x000811, 1);
    consoleBg.fillRoundedRect(consoleX, consoleY, consoleW, consoleH, 6);
    consoleBg.lineStyle(1, 0x112244, 1);
    consoleBg.strokeRoundedRect(consoleX, consoleY, consoleW, consoleH, 6);
    const consoleText = this.add.text(consoleX + 8, consoleY + 8, '', {
      fontSize: '11px', fontFamily: 'monospace', color: '#3366aa',
      wordWrap: { width: consoleW - 16 }, lineSpacing: 3
    });
 
    const consoleLines = [];
    const fileBytesMap = {};
    let totalLoadedBytes = 0;
    let totalExpectedBytes = 0;
 
    const pushLine = (line) => {
      consoleLines.push(line);
      if (consoleLines.length > 8) consoleLines.shift();
      consoleText.setText(consoleLines.join('\n'));
    };
 
    this.load.on('fileprogress', (file) => {
      const prev = fileBytesMap[file.key] || { loaded: 0, total: 0 };
      const nowLoaded = file.bytesLoaded || 0;
      const nowTotal = file.bytesTotal || 0;
      totalLoadedBytes += nowLoaded - prev.loaded;
      if (nowTotal > prev.total) totalExpectedBytes += nowTotal - prev.total;
      fileBytesMap[file.key] = { loaded: nowLoaded, total: nowTotal };
      const remaining = Math.max(0, totalExpectedBytes - totalLoadedBytes);
      const remMB = (remaining / (1024 * 1024)).toFixed(2);
      const name = (file.url || file.key).split('/').pop();
      if (consoleLines.length === 0) consoleLines.push('');
      consoleLines[consoleLines.length - 1] = `> ${name}  (${remMB} MB left)`;
      consoleText.setText(consoleLines.join('\n'));
    });
 
    this.load.on('filecomplete', (key, type) => {
      const entry = fileBytesMap[key] || { loaded: 0, total: 0 };
      const sizeMB = (entry.total / (1024 * 1024)).toFixed(2);
      if (consoleLines.length > 0) consoleLines[consoleLines.length - 1] = `  ${key}  [${sizeMB} MB]`;
      pushLine('');
    });
 
    this.load.on("progress", (value) => {
      barFill.clear();
      const fillW = Math.max(0, barW * value);
      barFill.fillStyle(0x0044cc, 1);
      barFill.fillRoundedRect(barX, barY, fillW, barH, 8);
      barFill.fillStyle(0x4488ff, 0.5);
      barFill.fillRoundedRect(barX, barY, fillW, barH / 2, { tl: 8, tr: 8, bl: 0, br: 0 });
      pctText.setText(Math.floor(value * 100) + '%');
      loadingText.setText(value < 1 ? 'Loading...' : 'Ready!');
    });
    this.load.on("loaderror", error => {});
    if (window.gameCache) {
      const originalXhr = this.load.xhrLoader;
      this.load.xhrLoader = (file) => {
        const url = file.url;
        if (window.gameCache.isFileCached(url)) {
          const cached = window.gameCache.getCachedFile(url);
          if (cached) {
            return new Promise((resolve) => {
              setTimeout(() => {
                file.data = cached;
                resolve(file);
              }, 1);
            });
          }
        }
        return originalXhr.call(this.load, file).then((result) => {
          if (result && result.data) {
            window.gameCache.cacheFile(url, result.data);
          }
          return result;
        });
      };
    }
    this.load.atlas("GJ_WebSheet", "assets/sheets/GJ_WebSheet.png", "assets/sheets/GJ_WebSheet.json");
    this.load.once('filecomplete', (key) => {
      if (key === 'GJ_WebSheet') {
        this.add.image(cx, barY - 120, "GJ_WebSheet", "GJ_logo_001.png")
      }
    });
    this.load.atlas("GJ_GameSheet", "assets/sheets/GJ_GameSheet.png", "assets/sheets/GJ_GameSheet.json");
    this.load.atlas("GJ_GameSheet02", "assets/sheets/GJ_GameSheet02.png", "assets/sheets/GJ_GameSheet02.json");
    this.load.atlas("GJ_GameSheet03", "assets/sheets/GJ_GameSheet03.png", "assets/sheets/GJ_GameSheet03.json");
    this.load.atlas("GJ_GameSheet04", "assets/sheets/GJ_GameSheet04.png", "assets/sheets/GJ_GameSheet04.json");
    this.load.atlas("GJ_GameSheetEditor", "assets/sheets/GJ_GameSheetEditor.png", "assets/sheets/GJ_GameSheetEditor.json");
    this.load.atlas("GJ_GameSheetGlow", "assets/sheets/GJ_GameSheetGlow.png", "assets/sheets/GJ_GameSheetGlow.json");
    this.load.atlas("GJ_GameSheetIcons", "assets/sheets/GJ_GameSheetIcons.png", "assets/sheets/GJ_GameSheetIcons.json");
    this.load.atlas("GJ_LaunchSheet", "assets/sheets/GJ_LaunchSheet.png", "assets/sheets/GJ_LaunchSheet.json");
    this.load.atlas("player_ball_00", "assets/sheets/player_ball_00.png", "assets/sheets/player_ball_00.json");
    this.load.atlas("player_dart_00", "assets/sheets/player_dart_00.png", "assets/sheets/player_dart_00.json");
    this.load.image("bigFont", "assets/fonts/bigFont.png");
    this.load.text("bigFontFnt", "assets/fonts/bigFont.fnt");
    this.load.image("goldFont", "assets/fonts/goldFont.png");
    this.load.text("goldFontFnt", "assets/fonts/goldFont.fnt");
    this.load.image("game_bg_01", "assets/sprites/game_bg_01_001.png");
    this.load.image("sliderBar", "assets/sprites/sliderBar.png");
    this.load.image("square04_001", "assets/sprites/square04_001.png");
    this.load.image("GJ_square02", "assets/sprites/GJ_square02.png");
 
    for (let i = 1; i < 23; i++) {
      let index = i-1;
      i = String(i);
      if (i.length < 2) {
        i = "0"+i;
      }
      let paddedIndex = String(index);
      if (paddedIndex.length < 2) {
        paddedIndex = "0"+paddedIndex;
      }
      this.load.image("groundSquare_"+paddedIndex+"_001.png", "assets/game-ground/groundSquare_"+i+"_001.png");
    }
    
    for (let i = 1; i < 60; i++) {
      let index = i-1;
      i = String(i);
      if (i.length < 2) {
        i = "0"+i;
      }
      this.load.image("game_bg_"+index, "assets/game-bg/game_bg_"+i+"_001-hd.png");
    }
 
    this.load.audio("menu_music", "assets/music/menuLoop.mp3");
    this.load.audio("StayInsideMe", "assets/music/StayInsideMe.mp3");

    for (const lvlarray of window.allLevels){
      this.load.text(lvlarray[2], "assets/levels/"+lvlarray[2].split("_")[1]+".txt");
      this.load.audio(lvlarray[0], "assets/music/"+(lvlarray[4] ? lvlarray[4] : lvlarray[1].replaceAll(" ", ""))+".mp3");
    }
 
    this.load.audio("explode_11", "assets/sfx/explode_11.ogg");
    this.load.audio("endStart_02", "assets/sfx/endStart_02.ogg");
    this.load.audio("playSound_01", "assets/sfx/playSound_01.ogg");
    this.load.audio("quitSound_01", "assets/sfx/quitSound_01.ogg");
    this.load.audio("highscoreGet02", "assets/sfx/highscoreGet02.ogg");
  }
  create() {
    this.cache.text.get(window.currentlevel[2]);
    const bigFontData = this.cache.text.get("bigFontFnt");
    if (bigFontData) {
      loadFont(this, "bigFont", bigFontData);
    }
    const goldFontData = this.cache.text.get("goldFontFnt");
    if (goldFontData) {
      loadFont(this, "goldFont", goldFontData);
    }
    if (window.gameCache) {
      const stats = window.gameCache.getCacheStats();
      console.log('stats:', stats);
    }
    localStorage.setItem('webdash_assets_loaded', 'true');
    localStorage.setItem('webdash_last_load_time', Date.now().toString());
    this.scene.start("GameScene");
  }
}
function loadFont(scene, fontName, fontData) {
  const texture = scene.textures.get(fontName);
  const image = texture.source[0];
  const imageWidth = image.width;
  const imageHeight = image.height;
  const fontConfig = {
    font: fontName,
    size: 0,
    lineHeight: 0,
    chars: {}
  };
  const kerningPairs = [];
  for (const line of fontData.split("\n")) {
    const lineParts = line.trim().split(/\s+/);
    if (!lineParts.length) {
      continue;
    }
    const lineType = lineParts[0];
    const properties = {};
    for (let i = 1; i < lineParts.length; i++) {
      const equalIndex = lineParts[i].indexOf("=");
      if (equalIndex >= 0) {
        properties[lineParts[i].slice(0, equalIndex)] = lineParts[i].slice(equalIndex + 1).replace(/^"|"$/g, "");
      }
    }
    if (lineType === "info") {
      fontConfig.size = parseInt(properties.size, 10);
    } else if (lineType === "common") {
      fontConfig.lineHeight = parseInt(properties.lineHeight, 10);
    } else if (lineType === "char") {
      const charId = parseInt(properties.id, 10);
      const charX = parseInt(properties.x, 10);
      const charY = parseInt(properties.y, 10);
      const charWidth = parseInt(properties.width, 10);
      const charHeight = parseInt(properties.height, 10);
      const u0 = charX / imageWidth;
      const v0 = charY / imageHeight;
      const u1 = (charX + charWidth) / imageWidth;
      const v1 = (charY + charHeight) / imageHeight;
      fontConfig.chars[charId] = {
        x: charX,
        y: charY,
        width: charWidth,
        height: charHeight,
        centerX: Math.floor(charWidth / 2),
        centerY: Math.floor(charHeight / 2),
        xOffset: parseInt(properties.xoffset, 10),
        yOffset: parseInt(properties.yoffset, 10),
        xAdvance: parseInt(properties.xadvance, 10),
        data: {},
        kerning: {},
        u0: u0,
        v0: v0,
        u1: u1,
        v1: v1
      };
      if (charWidth !== 0 && charHeight !== 0) {
        const charCode = String.fromCharCode(charId);
        const frame = texture.add(charCode, 0, charX, charY, charWidth, charHeight);
        if (frame) {
          frame.setUVs(charWidth, charHeight, u0, v0, u1, v1);
        }
      }
    } else if (lineType === "kerning") {
      kerningPairs.push({
        first: parseInt(properties.first, 10),
        second: parseInt(properties.second, 10),
        amount: parseInt(properties.amount, 10)
      });
    }
  }
  for (const kerningPair of kerningPairs) {
    if (fontConfig.chars[kerningPair.second]) {
      fontConfig.chars[kerningPair.second].kerning[kerningPair.first] = kerningPair.amount;
    }
  }
  scene.cache.bitmapFont.add(fontName, {
    data: fontConfig,
    texture: fontName,
    frame: null
  });
}
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
const P = ["GJ_WebSheet", "GJ_GameSheet", "GJ_GameSheet02", "GJ_GameSheet03", "GJ_GameSheet04", "GJ_GameSheetEditor", "GJ_GameSheetGlow", "GJ_GameSheetIcons", "GJ_LaunchSheet", "player_ball_00", "player_dart_00"];
function R(scene, frameName) {
  for (let atlasName of P) {
    if (scene.textures.exists(atlasName)) {
      if (scene.textures.get(atlasName).has(frameName)) {
        return {
          atlas: atlasName,
          frame: frameName
        };
      }
    }
  }
  return null;
}
function L(scene, x, y, textureName) {
  let textureInfo = R(scene, textureName);
  if (textureInfo) {
    return scene.add.image(x, y, textureInfo.atlas, textureInfo.frame);
  } else if (scene.textures.exists(textureName)) {
    return scene.add.image(x, y, textureName);
  } else {
    return null;
  }
}
class Collider {
  constructor(objType, xPos, yPos, width, height, rotation = 0) {
    this.type = objType;
    this.x = xPos;
    this.y = yPos;
    this.w = width;
    this.h = height;
    this.activated = false;
    this.rotationDegrees = rotation;
    this.slopeAngleDeg = 0;
    this.slopeDir = 1;
    this.slopeIsFilled = false;
    this.slopeFlipY = false;
  }
  getSlopeSurfaceY(worldX) {
    if (this.type !== slopeType) return null;
    const halfW = this.w / 2;
    const left = this.x - halfW;
    const right = this.x + halfW;
    if (worldX < left || worldX > right) return null;
    const frac = (worldX - left) / (right - left);
    let surfaceFrac = this.slopeDir > 0 ? frac : (1 - frac);
    if (this.slopeFlipY) surfaceFrac = 1 - surfaceFrac;
    return (this.y - this.h / 2) + surfaceFrac * this.h;
  }
  getSlopeAngleRad() {
    let angleDeg = this.slopeAngleDeg;
    if (this.slopeDir < 0) angleDeg = -angleDeg;
    if (this.slopeFlipY) angleDeg = -angleDeg;
    return angleDeg * Math.PI / 180;
  }
}
function parseObject(objectString) {
  let objectParts = objectString.split(",");
  let objectData = {};
  for (let index = 0; index + 1 < objectParts.length; index += 2) {
    let key = objectParts[index];
    let value = objectParts[index + 1];
    objectData[key] = value;
  }
  let objectId = parseInt(objectData[1] || "0", 10);
  if (objectId === 0) {
    return null;
  } else {
    return {
      id: objectId,
      x: parseFloat(objectData[2] || "0"),
      y: parseFloat(objectData[3] || "0"),
      flipX: objectData[4] === "1",
      flipY: objectData[5] === "1",
      rot: parseFloat(objectData[6] || "0"),
      scale: parseFloat(objectData[32] || "1"),
      zLayer: parseInt(objectData[24] || "0", 10),
      zOrder: parseInt(objectData[25] || "0", 10),
      groups: objectData[57] || "",
      color1: parseInt(objectData[21] || "0", 10),
      color2: parseInt(objectData[22] || "0", 10),
      // Following are for startpos
      gameMode: parseInt(objectData['kA2'] ?? '0', 10),
      miniMode: parseInt(objectData['kA3'] ?? '0', 10),
      speed: parseInt(objectData['kA4'] ?? '0', 10),
      mirrored: parseInt(objectData['kA28'] ?? '0', 10),
      flipGravity: '1' === (objectData['kA11'] ?? '0'),
      _raw: objectData
    };
  }
}
function parseLevel(levelString) {
  let decompressedString = function (compressedString) {
    let getBase64 = function (compressedString) {
      let lessCluttered = compressedString.replace(/-/g, "+").replace(/_/g, "/");
      while (lessCluttered.length % 4 != 0) {
        lessCluttered += "=";
      }
      return lessCluttered;
    }(compressedString.trim());
    let decryptedString = atob(getBase64);
    let rawBytes = new Uint8Array(decryptedString.length);
    for (let byteStr = 0; byteStr < decryptedString.length; byteStr++) {
      rawBytes[byteStr] = decryptedString.charCodeAt(byteStr);
    }
    let inflatedBytes = pako.inflate(rawBytes);
    return new TextDecoder().decode(inflatedBytes);
  }(levelString);
  let stringParts = decompressedString.split(";");
  let settings = stringParts.length > 0 ? stringParts[0] : "";
  let objects = [];
  for (let id = 1; id < stringParts.length; id++) {
    if (stringParts[id].length === 0) {
      continue;
    }
    let object = parseObject(stringParts[id]);
    if (object) {
      objects.push(object);
    }
  }
  console.log(settings)
  return {
    settings: settings,
    objects: objects
  };
}
// from https://github.com/opstic/gdclone/blob/main/src/level/easing.rs
class Easing {
  static sample(type, rate, x) {
    if (x === 0 || x === 1) return x;
    switch (type) {
      case 0: return x;
      case 1: return this._easeInOut(x, rate);
      case 2: return this._easeIn(x, rate);
      case 3: return this._easeOut(x, rate);
      case 4: return this._elasticInOut(x, rate);
      case 5: return this._elasticIn(x, rate);
      case 6: return this._elasticOut(x, rate);
      case 7: return this._bounceInOut(x);
      case 8: return this._bounceIn(x);
      case 9: return this._bounceOut(x);
      case 10: return this._expInOut(x);
      case 11: return this._expIn(x);
      case 12: return this._expOut(x);
      case 13: return this._sineInOut(x);
      case 14: return this._sineIn(x);
      case 15: return this._sineOut(x);
      case 16: return this._backInOut(x);
      case 17: return this._backIn(x);
      case 18: return this._backOut(x);
      default: return x;
    }
  };
  static _easeInOut(x, r) { const t=x*2; return t<1 ? 0.5*Math.pow(t,r) : 1-0.5*Math.pow(2-t,r); };
  static _easeIn(x, r) { return Math.pow(x, r); };
  static _easeOut(x, r) { return Math.pow(x, 1/r); };
  static _elasticInOut(x, p) {
    let period = p||0.3*1.5; const s=period/4; const t=x-1;
    return t<0 ? -0.5*Math.pow(2,10*t)*Math.sin((t-s)*(2*Math.PI)/period)
               : Math.pow(2,-10*t)*Math.sin((t-s)*(2*Math.PI)/period)*0.5+1;
  };
  static _elasticIn(x, p) { const s=p/4; const t=x-1; return -Math.pow(2,10*t)*Math.sin((t-s)*(2*Math.PI)/p); };
  static _elasticOut(x, p) { const s=p/4; return Math.pow(2,-10*x)*Math.sin((x-s)*(2*Math.PI)/p)+1; };
  static _bounceTime(x) {
    if (x<1/2.75)          return 7.5625*x*x;
    else if (x<2/2.75)   { const t=x-1.5/2.75;  return 7.5625*t*t+0.75; }
    else if (x<2.5/2.75) { const t=x-2.25/2.75; return 7.5625*t*t+0.9375; }
    else                 { const t=x-2.625/2.75; return 7.5625*t*t+0.984375; }
  };
  static _bounceInOut(x) { return x<0.5 ? (1-this._bounceTime(1-x*2))*0.5 : this._bounceTime(x*2-1)*0.5+0.5; };
  static _bounceIn(x) { return 1-this._bounceTime(1-x); };
  static _bounceOut(x) { return this._bounceTime(x); };
  static _expInOut(x) { return x<0.5 ? 0.5*Math.pow(2,10*(x*2-1)) : 0.5*(-Math.pow(2,-10*(x*2-1))+2); };
  static _expIn(x) { return Math.pow(2,10*(x-1))-0.001; };
  static _expOut(x) { return -Math.pow(2,-10*x)+1; };
  static _sineInOut(x) { return -0.5*(Math.cos(x*Math.PI)-1); };
  static _sineIn(x) { return 1-Math.cos((x*Math.PI)/2); };
  static _sineOut(x) { return Math.sin((x*Math.PI)/2); };
  static _backInOut(x) {
    const ov=1.70158*1.525; const t=x*2;
    return t<1 ? (t*t*((ov+1)*t-ov))/2 : ((t-2)*(t-2)*((ov+1)*(t-2)+ov))/2+1;
  };
  static _backIn(x) { const ov=1.70158; return x*x*((ov+1)*x-ov); };
  static _backOut(x) { const ov=1.70158; const t=x-1; return t*t*((ov+1)*t+ov)+1; };
};

const solidType = "solid";
const hazardType = "hazard";
const decoType = "deco";
const coinType = "coin";
const portalType = "portal";
const padType = "pad";
const ringType = "ring";
const triggerType = "trigger";
const speedType = "speed";
const slopeType = "slope";
// ── Slope ID registry ──
const _SLOPE_DATA = {
  289:{gw:1,gh:1,angle:45,sq:false},291:{gw:2,gh:1,angle:22.5,sq:false},
  294:{gw:1,gh:1,angle:45,sq:false},295:{gw:2,gh:1,angle:22.5,sq:false},
  296:{gw:0.367,gh:0.433,angle:45,sq:true},297:{gw:0.967,gh:0.45,angle:45,sq:true},
  299:{gw:1,gh:1,angle:45,sq:false},301:{gw:2,gh:1,angle:22.5,sq:false},
  309:{gw:1,gh:1,angle:45,sq:false},311:{gw:2,gh:1,angle:22.5,sq:false},
  315:{gw:1,gh:1,angle:45,sq:false},317:{gw:2,gh:1,angle:22.5,sq:false},
  321:{gw:1,gh:1,angle:45,sq:false},323:{gw:2,gh:1,angle:22.5,sq:false},
  324:{gw:1,gh:1,angle:45,sq:true},325:{gw:1,gh:1,angle:45,sq:true},
  326:{gw:1,gh:1,angle:45,sq:false},327:{gw:2,gh:1,angle:22.5,sq:false},
  328:{gw:0.733,gh:0.733,angle:45,sq:true},329:{gw:1.433,gh:0.733,angle:22.5,sq:true},
  331:{gw:1,gh:1,angle:45,sq:false},333:{gw:2,gh:1,angle:22.5,sq:false},
  337:{gw:1,gh:1,angle:45,sq:false},339:{gw:2,gh:1,angle:22.5,sq:false},
  343:{gw:1,gh:1,angle:45,sq:false},345:{gw:2,gh:1,angle:22.5,sq:false},
  353:{gw:1,gh:1,angle:45,sq:false},355:{gw:2,gh:1,angle:22.5,sq:false},
  358:{gw:1,gh:1,angle:45,sq:true},
  363:{gw:1,gh:1,angle:45,sq:false},364:{gw:2,gh:1,angle:22.5,sq:false},
  366:{gw:1,gh:1,angle:45,sq:false},367:{gw:2,gh:1,angle:22.5,sq:false},
  371:{gw:1,gh:1,angle:45,sq:false},372:{gw:2,gh:1,angle:22.5,sq:false},
  483:{gw:1,gh:1,angle:45,sq:false},484:{gw:2,gh:1,angle:22.5,sq:false},
  492:{gw:1,gh:1,angle:45,sq:false},493:{gw:2,gh:1,angle:22.5,sq:false},
  651:{gw:1,gh:1,angle:45,sq:false},652:{gw:2,gh:1,angle:22.5,sq:false},
  665:{gw:1,gh:1,angle:45,sq:false},666:{gw:2,gh:1,angle:22.5,sq:false},
  681:{gw:1,gh:1,angle:45,sq:false},682:{gw:2,gh:1,angle:22.5,sq:false},
  683:{gw:1,gh:1,angle:45,sq:false},684:{gw:2,gh:1,angle:22.5,sq:false},
  685:{gw:0.85,gh:0.85,angle:45,sq:false},686:{gw:1.85,gh:0.933,angle:22.5,sq:false},
  687:{gw:1,gh:1,angle:45,sq:false},688:{gw:2,gh:1,angle:22.5,sq:false},
  689:{gw:1,gh:1,angle:45,sq:false},690:{gw:2,gh:1,angle:22.5,sq:false},
  691:{gw:1,gh:1,angle:45,sq:false},692:{gw:2,gh:1,angle:22.5,sq:false},
  693:{gw:1,gh:1,angle:45,sq:false},694:{gw:2,gh:1,angle:22.5,sq:false},
  695:{gw:1,gh:1,angle:45,sq:false},696:{gw:2,gh:1,angle:22.5,sq:false},
  697:{gw:1,gh:1,angle:45,sq:false},698:{gw:2,gh:1,angle:22.5,sq:false},
  699:{gw:0.85,gh:0.85,angle:45,sq:false},700:{gw:1.85,gh:0.933,angle:22.5,sq:false},
  701:{gw:1,gh:1,angle:45,sq:false},702:{gw:2,gh:1,angle:22.5,sq:false},
  703:{gw:1,gh:1,angle:45,sq:false},704:{gw:2,gh:1,angle:22.5,sq:false},
  705:{gw:0.767,gh:0.767,angle:45,sq:false},706:{gw:1.733,gh:0.883,angle:22.5,sq:false},
  707:{gw:1,gh:1,angle:45,sq:false},708:{gw:2,gh:1,angle:22.5,sq:false},
  709:{gw:1,gh:1,angle:45,sq:false},710:{gw:2,gh:1,angle:22.5,sq:false},
  711:{gw:1,gh:1,angle:45,sq:false},712:{gw:2,gh:1,angle:22.5,sq:false},
  713:{gw:1,gh:1,angle:45,sq:false},714:{gw:2,gh:1,angle:22.5,sq:false},
  715:{gw:1,gh:1,angle:45,sq:false},716:{gw:2,gh:1,angle:22.5,sq:false},
  726:{gw:1,gh:1,angle:45,sq:false},727:{gw:2,gh:1,angle:22.5,sq:false},
  728:{gw:1,gh:1,angle:45,sq:false},729:{gw:2,gh:1,angle:22.5,sq:false},
  730:{gw:1,gh:1,angle:45,sq:false},731:{gw:2,gh:1,angle:22.5,sq:false},
  732:{gw:1,gh:1,angle:45,sq:false},733:{gw:2,gh:1,angle:22.5,sq:false},
  762:{gw:0.617,gh:0.583,angle:45,sq:false},763:{gw:1.283,gh:0.6,angle:22.5,sq:false},
  764:{gw:1,gh:1,angle:45,sq:true},765:{gw:1,gh:1,angle:45,sq:true},766:{gw:1,gh:1,angle:45,sq:true},
  771:{gw:0.617,gh:0.583,angle:45,sq:false},772:{gw:1.283,gh:0.6,angle:22.5,sq:false},
  773:{gw:0.9,gh:0.817,angle:45,sq:true},774:{gw:1,gh:0.85,angle:45,sq:true},775:{gw:0.867,gh:0.35,angle:22.5,sq:true},
  826:{gw:1,gh:1,angle:45,sq:false},827:{gw:1,gh:1,angle:45,sq:false},
  828:{gw:2,gh:1,angle:22.5,sq:false},829:{gw:2,gh:1,angle:22.5,sq:false},
  830:{gw:1,gh:1,angle:45,sq:true},831:{gw:1,gh:1,angle:45,sq:true},832:{gw:1,gh:1,angle:45,sq:true},833:{gw:1,gh:1,angle:45,sq:true},
  877:{gw:1,gh:1,angle:45,sq:false},878:{gw:2,gh:1,angle:22.5,sq:false},
  886:{gw:1,gh:1,angle:45,sq:false},887:{gw:2,gh:1,angle:22.5,sq:false},
  888:{gw:1,gh:1,angle:45,sq:false},889:{gw:2,gh:1,angle:22.5,sq:false},
  895:{gw:1,gh:1,angle:45,sq:false},896:{gw:2,gh:1,angle:22.5,sq:false},
  960:{gw:0.617,gh:0.583,angle:45,sq:false},961:{gw:1.283,gh:0.6,angle:22.5,sq:false},
  964:{gw:1,gh:1,angle:45,sq:true},965:{gw:1,gh:1,angle:45,sq:true},966:{gw:1,gh:1,angle:45,sq:true},
  969:{gw:0.617,gh:0.583,angle:45,sq:false},970:{gw:1.283,gh:0.6,angle:22.5,sq:false},
  971:{gw:0.9,gh:0.817,angle:45,sq:true},972:{gw:1,gh:0.85,angle:45,sq:true},973:{gw:0.867,gh:0.35,angle:22.5,sq:true},
  1014:{gw:1,gh:1,angle:45,sq:false},1015:{gw:2,gh:1,angle:22.5,sq:false},
  1016:{gw:1,gh:1,angle:45,sq:true},1017:{gw:1.008,gh:1,angle:45,sq:true},1018:{gw:1,gh:0.517,angle:22.5,sq:true},
  1033:{gw:0.617,gh:0.583,angle:45,sq:false},1034:{gw:1.283,gh:0.6,angle:22.5,sq:false},
  1035:{gw:1,gh:1,angle:45,sq:true},1036:{gw:1,gh:1,angle:45,sq:true},
  1037:{gw:0.617,gh:0.583,angle:45,sq:false},1038:{gw:1.283,gh:0.6,angle:22.5,sq:false},
  1039:{gw:1,gh:1,angle:45,sq:true},1040:{gw:1,gh:1,angle:45,sq:true},
  1041:{gw:1,gh:1,angle:45,sq:false},1042:{gw:2,gh:1,angle:22.5,sq:false},
  1043:{gw:1,gh:1,angle:45,sq:false},1044:{gw:2,gh:1,angle:22.5,sq:false},
  1091:{gw:1,gh:1,angle:45,sq:false},1092:{gw:2,gh:1,angle:22.5,sq:false},
  1093:{gw:1,gh:1,angle:45,sq:true},1094:{gw:1,gh:1,angle:45,sq:true},1108:{gw:2,gh:1,angle:22.5,sq:false},
  1187:{gw:0.767,gh:0.767,angle:45,sq:false},1188:{gw:1.517,gh:0.767,angle:22.5,sq:false},
  1189:{gw:1,gh:1,angle:45,sq:true},1190:{gw:1,gh:1,angle:45,sq:true},
  1198:{gw:1,gh:1,angle:45,sq:false},1199:{gw:2,gh:1,angle:22.5,sq:false},
  1200:{gw:0.267,gh:0.267,angle:45,sq:true},1201:{gw:0.517,gh:0.267,angle:22.5,sq:true},
  1256:{gw:1,gh:1,angle:45,sq:false},1257:{gw:2,gh:1,angle:22.5,sq:false},
  1258:{gw:1,gh:1,angle:45,sq:false},1259:{gw:2,gh:1,angle:22.5,sq:false},
  1305:{gw:0.617,gh:0.583,angle:45,sq:false},1306:{gw:1.3,gh:0.6,angle:22.5,sq:false},
  1307:{gw:0.683,gh:0.6,angle:45,sq:true},1308:{gw:1,gh:0.617,angle:45,sq:true},1309:{gw:0.267,gh:0.117,angle:22.5,sq:true},
  1316:{gw:0.617,gh:0.583,angle:45,sq:false},1317:{gw:1.3,gh:0.6,angle:22.5,sq:false},
  1318:{gw:0.683,gh:0.6,angle:45,sq:true},1319:{gw:1,gh:0.617,angle:45,sq:true},1320:{gw:0.267,gh:0.117,angle:22.5,sq:true},
  1325:{gw:1,gh:1,angle:45,sq:true},1326:{gw:1,gh:1,angle:45,sq:true},
  1338:{gw:1,gh:1,angle:45,sq:false},1339:{gw:2,gh:1,angle:22.5,sq:false},
  1341:{gw:1,gh:1,angle:45,sq:false},1342:{gw:2,gh:1,angle:22.5,sq:false},
  1344:{gw:1,gh:1,angle:45,sq:false},1345:{gw:2,gh:1,angle:22.5,sq:false},
  1717:{gw:1,gh:1,angle:45,sq:false},1718:{gw:2,gh:1,angle:22.5,sq:false},
  1723:{gw:1,gh:1,angle:45,sq:false},1724:{gw:2,gh:1,angle:22.5,sq:false},
  1743:{gw:1,gh:1,angle:45,sq:false},1744:{gw:2,gh:1,angle:22.5,sq:false},
  1745:{gw:1,gh:1,angle:45,sq:false},1746:{gw:2,gh:1,angle:22.5,sq:false},
  1747:{gw:1,gh:1,angle:45,sq:false},1748:{gw:2,gh:1,angle:22.5,sq:false},
  1749:{gw:1,gh:1,angle:45,sq:false},1750:{gw:2,gh:1,angle:22.5,sq:false},
  1758:{gw:1,gh:1,angle:45,sq:false},1759:{gw:2,gh:1,angle:22.5,sq:false},
  1760:{gw:1,gh:1,angle:45,sq:false},1761:{gw:2,gh:1,angle:22.5,sq:false},
  1762:{gw:1,gh:1,angle:45,sq:false},1763:{gw:2,gh:1,angle:22.5,sq:false},
  1773:{gw:2,gh:1,angle:22.5,sq:false},1774:{gw:2,gh:1,angle:22.5,sq:false},
  1775:{gw:2,gh:1,angle:22.5,sq:false},1776:{gw:2,gh:1,angle:22.5,sq:false},
  1785:{gw:2,gh:1,angle:22.5,sq:false},1786:{gw:2,gh:1,angle:22.5,sq:false},
  1787:{gw:2,gh:1,angle:22.5,sq:false},1788:{gw:2,gh:1,angle:22.5,sq:false},
  1789:{gw:2,gh:1,angle:22.5,sq:false},1790:{gw:2,gh:1,angle:22.5,sq:false},
  1791:{gw:2,gh:1,angle:22.5,sq:false},1792:{gw:2,gh:1,angle:22.5,sq:false},
  1794:{gw:2,gh:1,angle:22.5,sq:false},1796:{gw:2,gh:1,angle:22.5,sq:false},
  1798:{gw:2,gh:1,angle:22.5,sq:false},1800:{gw:2,gh:1,angle:22.5,sq:false},
  1802:{gw:2,gh:1,angle:22.5,sq:false},1804:{gw:2,gh:1,angle:22.5,sq:false},
  1806:{gw:2,gh:1,angle:22.5,sq:false},1808:{gw:2,gh:1,angle:22.5,sq:false},
  1810:{gw:2,gh:1,angle:22.5,sq:false},
  1899:{gw:1,gh:1,angle:45,sq:false},1900:{gw:2,gh:1,angle:22.5,sq:false},
  1901:{gw:0.367,gh:0.433,angle:45,sq:true},1902:{gw:0.967,gh:0.45,angle:45,sq:true},
  1906:{gw:1,gh:1,angle:45,sq:false},1907:{gw:2,gh:1,angle:22.5,sq:false},
};
const flyPortal = "fly";
const cubePortal = "cube";
const portalWaveType = "portal_wave";
const portalUfoType = "portal_ufo";
const allObjects = window.allobjects();
if (!allObjects[1331]) {
  allObjects[1331] = {
    "can_color": false,
    "default_base_color_channel": 0,
    "frame": "portal_17_front_001.png",
    "glow_frame": "portal_17_front_glow_001.png",
    "gridH": 2.866666555404663,
    "gridW": 1.1333333253860474,
    "spritesheet": "GJ_GameSheet02-uhd",
    "type": "portal",
    "z": 10,
    "portalParticle": true,
    "portalParticleColor": 0x00ffff
  };
}

const _speedPortalIds = [200, 201, 202, 203, 1334];
for (const _spId of _speedPortalIds) {
  if (!allObjects[_spId] || allObjects[_spId].type !== "speed") {
    allObjects[_spId] = Object.assign({
      gridW: 1,
      gridH: 1,
    }, allObjects[_spId] || {}, { type: "speed" });
  }
}

const objsWithGlow = [1, 2, 3, 4, 6, 7, 83, 8, 39, 103, 392, 35, 36, 40, 140, 141, 62, 65, 66, 68, 195, 196, 1022, 1594];
for (let obj of objsWithGlow) {
  if (allObjects[obj]) {
    allObjects[obj].glow = true;
  }
}

window._animatedSprites = [];
window._animTimer = 0;
function getObjectFromId(id) {
  return allObjects[id] || null;
}
class us {
  constructor(scene, cameraXRef) {
    this._scene = scene;
    this._cameraXRef = cameraXRef;
    this.additiveContainer = scene.add.container(0, 0).setDepth(-1);
    this.container = scene.add.container(0, 0);
    this.topContainer = scene.add.container(0, 0).setDepth(13);
    this.objects = [];
    this.endXPos = 0;
    this._groundY = 0;
    this._ceilingY = null;
    this._flyGroundActive = false;
    this._groundAnimFrom = 0;
    this._groundAnimTo = 0;
    this._groundAnimTime = 0;
    this._groundAnimDuration = 0;
    this._groundAnimating = false;
    this._groundTargetValue = 0;
    this._flyFloorY = 0;
    this._flyCeilingY = null;
    this._flyVisualOnly = false;
    this.flyCameraTarget = null;
    this._colorTriggers = [];
    this._colorTriggerIdx = 0;
    this._audioScaleSprites = [];
    this._orbSprites = [];
    this._coinSprites = [];
    this._sawSprites = [];
    this._enterEffectTriggers = [];
    this._enterEffectTriggerIdx = 0;
    this._activeEnterEffect = 0;
    this._activeExitEffect = 0;
    this._moveTriggers = [];
    this._moveTriggerIdx = 0;
    this._activeMoveTweens = [];
    this._alphaTriggers = [];
    this._alphaTriggerIdx = 0;
    this._activeAlphaTweens = [];
    this._rotateTriggers = [];
    this._rotateTriggerIdx = 0;
    this._activeRotateTweens = [];
    this._pulseTriggers = [];
    this._pulseTriggerIdx = 0;
    this._activePulses = [];
    this._colorChannelSprites = {};
    this._groupSprites = {};
    this._groupOffsets = {};
    this._groupOpacity = {};
    this._groupColliders = {};
    this._sections = [];
    this._sectionContainers = [];
    this._collisionSections = [];
    this._nearbyBuffer = [];
    this._visMinSec = -1;
    this._visMaxSec = -1;
    this._groundStartScreenY = b(0);
    this._ceilingStartScreenY = 0;
    this._activeStartPosIndex = -1; 
    this._startPositions = [];
    this._buildGround();
  }
  getStartPositions() {
      return this._startPositions.slice().sort((a, b) => a.x - b.x);
  }

  fastForwardTriggers(targetX, colorManager) {
    const triggers = this._colorTriggers.sort((a, b) => a.x - b.x);

    for (let trigger of triggers) {
      if (trigger.x <= targetX) {
        colorManager.triggerColor(trigger.index, trigger.color, 0);
      } else {
        break;
      }
    }
  }
  loadLevel(levelData) {
    let {
      objects: levelObjects,
      settings: settingslist
    } = parseLevel(levelData);
    this._spawnLevelObjects(levelObjects);
    this._setUpSettings(settingslist);
  }
  _setUpSettings(settingsStr) {
    this._initialColors = {};
    this._backgroundId = null;
    this._groundId = null;
    if (!settingsStr) return;
    let pairs = settingsStr.split(",");
    window.settingsMap = {};
    for (let i = 0; i + 1 < pairs.length; i += 2) {
      settingsMap[pairs[i]] = pairs[i + 1];
    }
    let colorStr = settingsMap["kS38"];
    console.log(settingsMap)
    window._backgroundId = settingsMap["kA6"] ? settingsMap["kA6"] : "01";
    if (window._backgroundId.length < 2) {
      window._backgroundId = "0"+window._backgroundId;
    }
    window._groundId = settingsMap["kA7"] ? String(settingsMap["kA7"]) : "01";
    if (window._groundId.length < 2) {
      window._groundId = "0"+window._groundId;
    }
    if (colorStr) {
      let channels = colorStr.split("|");
      for (let ch of channels) {
        if (!ch) continue;
        let props = ch.split("_");
        let colorProps = {};
        for (let j = 0; j + 1 < props.length; j += 2) {
          colorProps[parseInt(props[j], 10)] = props[j + 1];
        }
        let channelId = parseInt(colorProps[6], 10);
        if (!isNaN(channelId)) {
          this._initialColors[channelId] = {
            r: parseInt(colorProps[1] || "255", 10),
            g: parseInt(colorProps[2] || "255", 10),
            b: parseInt(colorProps[3] || "255", 10)
          };
        }
      }
    }
    let parseColorEntry = (str) => {
      if (!str) return null;
      let props = str.split("_");
      let cp = {};
      for (let j = 0; j + 1 < props.length; j += 2) {
        cp[parseInt(props[j], 10)] = props[j + 1];
      }
      return {
        r: parseInt(cp[1] || "255", 10),
        g: parseInt(cp[2] || "255", 10),
        b: parseInt(cp[3] || "255", 10)
      };
    };
    if (!this._initialColors[1000] && settingsMap["kS29"]) {
      let col = parseColorEntry(settingsMap["kS29"]);
      if (col) this._initialColors[1000] = col;
    }
    if (!this._initialColors[1001] && settingsMap["kS30"]) {
      let col = parseColorEntry(settingsMap["kS30"]);
      if (col) this._initialColors[1001] = col;
    }
    console.log("level colors:", JSON.stringify(this._initialColors));
  }
  _buildGround() {
    const scene = this._scene;
    window._groundId = window._groundId ? window._groundId : "01";
    
      console.log(window._groundId)
    const groundFrame = scene.textures.getFrame("groundSquare_" + window._groundId + "_001.png");
    this._tileW = groundFrame ? groundFrame.width : 1012;
    this._groundTiles = [];
    this._ceilingTiles = [];
    let tileCount = Math.ceil(screenWidth / this._tileW) + 2;
    let groundY = b(0);
    const startX = -centerX;
    for (let i = 0; i < tileCount; i++) {
      let tileX = startX + i * this._tileW;
      let groundTile = scene.add.image(0, groundY, "groundSquare_" + window._groundId + "_001.png");
      groundTile.setOrigin(0, 0);
      groundTile.setTint(17578);
      groundTile.setDepth(20);
      groundTile._worldX = tileX;
      this._groundTiles.push(groundTile);
      let ceilingTile = scene.add.image(0, groundY, "groundSquare_" + window._groundId + "_001.png");
      ceilingTile.setOrigin(0, 1);
      ceilingTile.setFlipY(true);
      ceilingTile.setTint(17578);
      ceilingTile.setDepth(20);
      ceilingTile.setVisible(false);
      ceilingTile._worldX = tileX;
      this._ceilingTiles.push(ceilingTile);
    }
    this._maxGroundWorldX = startX + (tileCount - 1) * this._tileW;
    const floorLineFrame = scene.textures.getFrame("GJ_WebSheet", "floorLine_01_001.png");
    const floorLineWidth = floorLineFrame ? floorLineFrame.width : 888;
    const floorLineScale = screenWidth / floorLineWidth;
    this._groundLine = scene.add.image(screenWidth / 2, groundY - 1, "GJ_WebSheet", "floorLine_01_001.png").setOrigin(0.5, 0).setScale(floorLineScale, 1).setBlendMode(S).setDepth(21).setScrollFactor(0);
    this._ceilingLine = scene.add.image(screenWidth / 2, groundY + 1, "GJ_WebSheet", "floorLine_01_001.png").setOrigin(0.5, 1).setScale(floorLineScale, 1).setFlipY(true).setBlendMode(S).setDepth(21).setScrollFactor(0).setVisible(false);
    const shadowAlpha = 100 / 255;
    this._groundShadowL = scene.add.image(-1, groundY, "GJ_WebSheet", "groundSquareShadow_001.png").setOrigin(0, 0).setScrollFactor(0).setDepth(22).setAlpha(shadowAlpha).setScale(0.7, 1).setBlendMode(E);
    this._groundShadowR = scene.add.image(screenWidth + 1, groundY, "GJ_WebSheet", "groundSquareShadow_001.png").setOrigin(1, 0).setScrollFactor(0).setDepth(22).setAlpha(shadowAlpha).setScale(0.7, 1).setFlipX(true).setBlendMode(E);
    this._ceilingShadowL = scene.add.image(-1, groundY, "GJ_WebSheet", "groundSquareShadow_001.png").setOrigin(0, 1).setScrollFactor(0).setDepth(22).setAlpha(shadowAlpha).setScale(0.7, 1).setFlipY(true).setBlendMode(E).setVisible(false);
    this._ceilingShadowR = scene.add.image(screenWidth + 1, groundY, "GJ_WebSheet", "groundSquareShadow_001.png").setOrigin(1, 1).setScrollFactor(0).setDepth(22).setAlpha(shadowAlpha).setScale(0.7, 1).setFlipX(true).setFlipY(true).setBlendMode(E).setVisible(false);
  }
  applyGroundTexture() {
    const gId = window._groundId || "01";
    const texKey = "groundSquare_" + gId + "_001.png";
    if (!this._scene.textures.exists(texKey)) return;
    const groundFrame = this._scene.textures.getFrame(texKey);
    this._tileW = groundFrame ? groundFrame.width : this._tileW;
    for (let tile of this._groundTiles) {
      tile.setTexture(texKey);
    }
    for (let tile of this._ceilingTiles) {
      tile.setTexture(texKey);
    }
  }
  resizeScreen() {
    var newTile;
    var newCeilingTile;
    const scene = this._scene;
    const tileWidth = this._tileW;
    const requiredTileCount = Math.ceil(screenWidth / tileWidth) + 2;
    const groundY = b(0);
    while (this._groundTiles.length < requiredTileCount) {
      const newTileX = this._maxGroundWorldX + tileWidth;
      console.log(window._groundId)
      let newGroundTile = scene.add.image(0, groundY, "groundSquare_" + window._groundId + "_001.png");
      newGroundTile.setOrigin(0, 0).setTint(((newTile = this._groundTiles[0]) == null ? undefined : newTile.tintTopLeft) || 17578).setDepth(20);
      newGroundTile._worldX = newTileX;
      this._groundTiles.push(newGroundTile);
      let newCeilingTile = scene.add.image(0, groundY, "groundSquare_" + window._groundId + "_001.png");
      newCeilingTile.setOrigin(0, 1).setFlipY(true).setTint(((newCeilingTile = this._groundTiles[0]) == null ? undefined : newCeilingTile.tintTopLeft) || 17578).setDepth(20).setVisible(false);
      newCeilingTile._worldX = newTileX;
      this._ceilingTiles.push(newCeilingTile);
      this._maxGroundWorldX = newTileX;
    }
    const floorLineFrame = this._scene.textures.getFrame("GJ_WebSheet", "floorLine_01_001.png");
    const floorLineScale = screenWidth / (floorLineFrame ? floorLineFrame.width : 888);
    this._groundLine.x = screenWidth / 2;
    this._groundLine.setScale(floorLineScale, 1);
    this._ceilingLine.x = screenWidth / 2;
    this._ceilingLine.setScale(floorLineScale, 1);
    this._groundShadowR.x = screenWidth + 1;
    this._ceilingShadowR.x = screenWidth + 1;
  }
  updateGroundTiles(cameraY = 0) {
    const cameraX = this._cameraXRef.value;
    const tileWidth = this._tileW;
    let leftTileIndex;
    let rightTileIndex;
    let maxWorldX = this._maxGroundWorldX || -Infinity;
    const ceilingActive = !this._flyGroundActive && this._flyCeilingY !== null;
    if (this._flyVisualOnly && this._flyCeilingY !== null) {
      leftTileIndex = b(0) + cameraY;
      rightTileIndex = b(this._flyCeilingY) + cameraY;
    } else if (this._flyGroundActive && this._groundTargetValue > 0.001) {
      let groundTarget = this._groundTargetValue;
      let targetGroundY = 620;
      let targetCeilingY = 20;
      leftTileIndex = this._groundStartScreenY + (targetGroundY - this._groundStartScreenY) * groundTarget;
      rightTileIndex = this._ceilingStartScreenY + (targetCeilingY - this._ceilingStartScreenY) * groundTarget;
      let groundScreenY = b(0) + cameraY;
      if (leftTileIndex > groundScreenY) {
        leftTileIndex = groundScreenY;
      }
    } else {
      leftTileIndex = b(0) + cameraY;
      rightTileIndex = ceilingActive ? 20 : 0;
    }
    for (let i = 0; i < this._groundTiles.length; i++) {
      let groundTile = this._groundTiles[i];
      let ceilingTile = this._ceilingTiles[i];
      if (groundTile._worldX + tileWidth <= cameraX) {
        groundTile._worldX = maxWorldX + tileWidth;
        ceilingTile._worldX = groundTile._worldX;
        maxWorldX = groundTile._worldX;
        this._maxGroundWorldX = maxWorldX;
      }
      let tileScreenX = groundTile._worldX - cameraX;
      groundTile.x = tileScreenX;
      groundTile.y = leftTileIndex;
      ceilingTile.x = tileScreenX;
      ceilingTile.y = rightTileIndex;
      ceilingTile.setVisible(this._flyGroundActive && this._groundTargetValue > 0 || ceilingActive);
    }
    this._groundLine.y = leftTileIndex;
    if (this._flyGroundActive && this._groundTargetValue > 0 || ceilingActive) {
      this._ceilingLine.y = rightTileIndex;
      this._ceilingLine.setVisible(true);
    } else {
      this._ceilingLine.setVisible(false);
    }
    this._groundShadowL.y = leftTileIndex;
    this._groundShadowR.y = leftTileIndex;
    let ceilingVisible = this._flyGroundActive && this._groundTargetValue > 0 || ceilingActive;
    this._ceilingShadowL.y = rightTileIndex;
    this._ceilingShadowR.y = rightTileIndex;
    this._ceilingShadowL.setVisible(ceilingVisible);
    this._ceilingShadowR.setVisible(ceilingVisible);
  }
  shiftGroundTiles(shiftAmount) {
    for (let i = 0; i < this._groundTiles.length; i++) {
      this._groundTiles[i]._worldX += shiftAmount;
      this._ceilingTiles[i]._worldX += shiftAmount;
    }
    this._maxGroundWorldX += shiftAmount;
  }
  resetGroundTiles(cameraX) {
    const tileWidth = this._tileW;
    for (let i = 0; i < this._groundTiles.length; i++) {
      this._groundTiles[i]._worldX = cameraX + i * tileWidth;
      this._ceilingTiles[i]._worldX = cameraX + i * tileWidth;
    }
    this._maxGroundWorldX = cameraX + (this._groundTiles.length - 1) * tileWidth;
    this.resetGroundState();
  }
  resetGroundState() {
    this._flyGroundActive = false;
    this._groundTargetValue = 0;
    this._groundAnimating = false;
    this._groundY = 0;
    this._ceilingY = null;
    this._flyCeilingY = null;
    this._flyVisualOnly = false;
    this.flyCameraTarget = null;
  }
  _computeFlyBounds(centerY, height = f, isPortal = false) {
    let floorY;
    if (isPortal) {
      floorY = centerY - f / 2;
    } else {
      floorY = centerY - height / 2;
    }
    floorY = Math.floor(floorY / a) * a;
    floorY = Math.max(0, floorY);
    return {
      floorY: floorY,
      ceilingY: floorY + height
    };
  }
  setFlyMode(enabled, centerY, height = f, visualOnly = false) {
    if (enabled) {
      let bounds = this._computeFlyBounds(centerY, height, visualOnly);
      this._flyFloorY = bounds.floorY;
      this._flyCeilingY = bounds.ceilingY;
      this._flyVisualOnly = visualOnly;
      if (visualOnly) {
        this._flyGroundActive = true;
      } else {
        this._flyGroundActive = true;
      }
      let flyCenter = this._flyFloorY + height / 2;
      this.flyCameraTarget = flyCenter - 320 + o;
      if (this.flyCameraTarget < 0) {
        this.flyCameraTarget = 0;
      }
      let currentCameraY = this._scene && this._scene._cameraY || 0;
      this._groundStartScreenY = b(0) + currentCameraY;
      this._ceilingStartScreenY = 0;
      this._groundAnimFrom = this._groundTargetValue;
      this._groundAnimTo = 1;
      this._groundAnimTime = 0;
      this._groundAnimDuration = 0.5;
      this._groundAnimating = true;
    } else {
      this.flyCameraTarget = null;
      this._flyCeilingY = null;
      this._flyFloorY = null;
      this._flyVisualOnly = false;
      if (this._flyGroundActive) {
        this._groundAnimFrom = this._groundTargetValue;
        this._groundAnimTo = 0;
        this._groundAnimTime = 0;
        this._groundAnimDuration = 0.5;
        this._groundAnimating = true;
        this._flyGroundActive = false;
      } else {
        this._groundAnimating = false;
        this._groundTargetValue = 0;
      }
    }
  }
  stepGroundAnimation(deltaTime) {
    if (!this._groundAnimating) {
      return;
    }
    this._groundAnimTime += deltaTime;
    let progress = this._groundAnimDuration > 0 ? Math.min(this._groundAnimTime / this._groundAnimDuration, 1) : 1;
    this._groundTargetValue = this._groundAnimFrom + (this._groundAnimTo - this._groundAnimFrom) * progress;
    if (progress >= 1) {
      this._groundAnimating = false;
      this._groundTargetValue = this._groundAnimTo;
      if (this._groundAnimTo === 0) {
        this._flyGroundActive = false;
      }
    }
  }
  getFloorY() {
    if (this._flyGroundActive) {
      if (this._flyVisualOnly) {
        return 0;
      }
      return this._flyFloorY;
    } else {
      return 0;
    }
  }
  getCeilingY() {
    if (this._flyCeilingY !== null) {
      return this._flyCeilingY;
    } else {
      return null;
    }
  }
  _applyVisualProps(scene, sprite, frameName, objectData, colorData = null) {
    if (!sprite) {
      return;
    }
    let {
      dx: offsetX,
      dy: offsetY
    } = function (scene, frameName) {
      let textureInfo = R(scene, frameName);
      if (!textureInfo) {
        return {
          dx: 0,
          dy: 0
        };
      }
      let frame = scene.textures.get(textureInfo.atlas).get(textureInfo.frame);
      if (!frame) {
        return {
          dx: 0,
          dy: 0
        };
      }
      let customData = frame.customData || {};
      if (customData.gjSpriteOffset) {
        return {
          dx: customData.gjSpriteOffset.x || 0,
          dy: -(customData.gjSpriteOffset.y || 0)
        };
      }
      let realWidth = frame.realWidth;
      let realHeight = frame.realHeight;
      let frameWidth = frame.width;
      let frameHeight = frame.height;
      let sourceX = 0;
      let sourceY = 0;
      if (customData.spriteSourceSize) {
        sourceX = customData.spriteSourceSize.x || 0;
        sourceY = customData.spriteSourceSize.y || 0;
      }
      return {
        dx: realWidth / 2 - (sourceX + frameWidth / 2),
        dy: realHeight / 2 - (sourceY + frameHeight / 2)
      };
    }(scene, frameName);
    if (objectData.flipX) {
      sprite.setFlipX(true);
    }
    if (objectData.flipY) {
      sprite.setFlipY(true);
    }
    let totalRotation = (sprite.getData("gjBaseRotationDeg") || 0) + objectData.rot;
    if (totalRotation !== 0) {
      sprite.setAngle(totalRotation);
    }
    if (objectData.scale !== 1) {
      sprite.setScale(objectData.scale);
    }
    if (colorData) {
      if (colorData.tint !== undefined) {
        sprite.setTint(colorData.tint);
      } else if (colorData.black) {
        sprite.setTint(0);
      }
    }
  }
  _addVisualSprite(sprite, objectData = null) {
    if (sprite) {
      if (objectData && objectData.blend === "additive") {
        sprite.setBlendMode(S);
        sprite._eeLayer = 0;
      } else if (objectData && objectData._portalFront) {
        sprite._eeLayer = 2;
      } else if (objectData && objectData.z !== undefined && objectData.z < 0) {
        sprite._eeLayer = 0;
      } else {
        sprite._eeLayer = 1;
      }
    }
  }
  _getGlowFrameName(frameName) {
    if (frameName && frameName.endsWith("_001.png")) {
      return frameName.replace("_001.png", "_glow_001.png");
    } else {
      return null;
    }
  }
  _addGlowSprite(scene, x, y, frameName, objectData, worldX) {
    let glowFrameName = this._getGlowFrameName(frameName);
    if (!glowFrameName) {
      return;
    }
    if (!R(scene, glowFrameName) && !scene.textures.exists(glowFrameName)) {
      return;
    }
    let glowSprite = L(scene, x, y, glowFrameName);
    if (glowSprite) {
      this._applyVisualProps(scene, glowSprite, glowFrameName, objectData);
      glowSprite.setBlendMode(S);
      glowSprite._eeLayer = 0;
      if (worldX !== undefined) {
        glowSprite._eeWorldX = worldX;
        glowSprite._eeBaseY = y;
        this._addToSection(glowSprite);
      }
      return glowSprite;
    }
    return null;
  }
  _spawnLevelObjects(_0x35f1ae) {
    const scene = this._scene;
    let _0x443c50 = new Set();
    this._lastObjectX = 0;
    for (let levelObj of _0x35f1ae) {
      let objectDef = getObjectFromId(levelObj.id);
      if (objectDef && objectDef.type === triggerType) {
        if (levelObj.id === 29 || levelObj.id === 30) {
          this._colorTriggers.push({
            x: levelObj.x * 2,
            index: levelObj.id === 29 ? 1000 : 1001,
            color: {
              r: parseInt(levelObj._raw[7] ?? 255, 10),
              g: parseInt(levelObj._raw[8] ?? 255, 10),
              b: parseInt(levelObj._raw[9] ?? 255, 10)
            },
            duration: parseFloat(levelObj._raw[10] ?? 0),
            tintGround: levelObj._raw[14] === "1"
          });
        }
        if (objectDef.enterEffect) {
          this._enterEffectTriggers.push({
            x: levelObj.x * 2,
            effect: objectDef.enterEffect
          });
        }
        if (levelObj.id === 901) {
          const _raw = levelObj._raw;
          this._moveTriggers.push({
            x: levelObj.x * 2,
            duration: parseFloat(_raw[10] ?? 0),
            easingType: parseInt(_raw[30] ?? 0, 10),
            easingRate: parseFloat(_raw[85] ?? 2),
            targetGroup: parseInt(_raw[51] ?? 0, 10),
            offsetX: parseFloat(_raw[28] ?? 0) * 2,
            offsetY: parseFloat(_raw[29] ?? 0) * 2,
            lockX: _raw[58] === '1',
            lockY: _raw[59] === '1',
          });
        }
        if (levelObj.id === 1007) {
          const _raw = levelObj._raw;
          this._alphaTriggers.push({
            x: levelObj.x * 2,
            duration: parseFloat(_raw[10] ?? 0),
            targetGroup: parseInt(_raw[51] ?? 0, 10),
            targetOpacity: Math.max(0, Math.min(1, parseFloat(_raw[35] ?? 1))),
          });
        }
        if (levelObj.id === 899) {
          const _raw = levelObj._raw;
          const targetChannel = parseInt(_raw[23] ?? 0, 10);
          if (targetChannel > 0) {
            this._colorTriggers.push({
              x: levelObj.x * 2,
              index: targetChannel,
              color: {
                r: parseInt(_raw[7] ?? 255, 10),
                g: parseInt(_raw[8] ?? 255, 10),
                b: parseInt(_raw[9] ?? 255, 10)
              },
              duration: parseFloat(_raw[10] ?? 0),
              tintGround: _raw[14] === "1",
              opacity: parseFloat(_raw[35] ?? 1)
            });
          }
        }
        if (levelObj.id === 1346) {
          const _raw = levelObj._raw;
          this._rotateTriggers.push({
            x: levelObj.x * 2,
            targetGroup: parseInt(_raw[51] ?? 0, 10),
            degrees: parseFloat(_raw[68] ?? 0),
            duration: parseFloat(_raw[10] ?? 0),
            easingType: parseInt(_raw[30] ?? 0, 10),
            easingRate: parseFloat(_raw[85] ?? 2),
            lockRotation: _raw[70] === '1',
            times360: parseInt(_raw[69] ?? 0, 10),
            centerGroup: parseInt(_raw[71] ?? 0, 10),
          });
        }
        if (levelObj.id === 1006) {
          const _raw = levelObj._raw;
          const targetType = parseInt(_raw[52] ?? 0, 10);
          this._pulseTriggers.push({
            x: levelObj.x * 2,
            targetGroup: targetType === 1 ? parseInt(_raw[51] ?? 0, 10) : 0,
            targetChannel: targetType === 0 ? parseInt(_raw[51] ?? 0, 10) : 0,
            targetType: targetType,
            color: {
              r: parseInt(_raw[7] ?? 255, 10),
              g: parseInt(_raw[8] ?? 255, 10),
              b: parseInt(_raw[9] ?? 255, 10)
            },
            fadeIn: parseFloat(_raw[45] ?? 0),
            hold: parseFloat(_raw[46] ?? 0),
            fadeOut: parseFloat(_raw[47] ?? 0),
          });
        }
        if (levelObj.id === 31) {
          this._startPositions.push({
            x: 2 * levelObj.x,
            y: 2 * levelObj.y,
            gameMode: levelObj.gameMode,
            miniMode: levelObj.miniMode,
            speed: levelObj.speed,
            mirrored: levelObj.mirrored,
            gravityFlipped: levelObj.flipGravity
          });
        }
        continue;
      }
      let worldX = levelObj.x * 2;
      let worldY = levelObj.y * 2;
      if (worldX > this._lastObjectX) {
        this._lastObjectX = worldX;
      }
      let frameName = objectDef ? objectDef.frame : null;
      if (objectDef && objectDef.randomFrames) {
        frameName = objectDef.randomFrames[Math.floor(Math.random() * objectDef.randomFrames.length)];
      }
      if (frameName) {
        let spriteWorldX = worldX;
        let baseY = b(worldY);
        const _0x501fde = (objectDef.type === portalType || objectDef.type === speedType) && frameName.includes("_front_");
        // compute z-depth once for all sprites of this object
        const _zLayer = levelObj.zLayer || (objectDef.default_z_layer !== undefined ? objectDef.default_z_layer : 0);
        const _zOrd = levelObj.zOrder || (objectDef.default_z_order !== undefined ? objectDef.default_z_order : 0);
        const _depthBase = { '-3': -6, '-1': -3, 0: 0, 1: 3, 3: 6, 5: 9 };
        const _objZDepth = (_depthBase[_zLayer] !== undefined ? _depthBase[_zLayer] : 0) + _zOrd * 0.01;
        // color channel for this object
        let _col1 = levelObj.color1 || (objectDef.default_base_color_channel !== undefined ? objectDef.default_base_color_channel : 0);
        if (_col1 === 0 && (objectDef.type === solidType || objectDef.type === hazardType)) _col1 = 1;
        const _col2 = levelObj.color2 || (objectDef.default_detail_color_channel !== undefined ? objectDef.default_detail_color_channel : -1);
        const _canColor = objectDef.can_color !== false;
        const _registerColor = (spr, ch) => {
          if (ch > 0 && _canColor && spr && !spr._isSaw) {
            spr._eeColorChannel = ch;
            if (!this._colorChannelSprites[ch]) this._colorChannelSprites[ch] = [];
            this._colorChannelSprites[ch].push(spr);
          }
        };
        const _objGids = levelObj.groups
          ? levelObj.groups.split('.').map(Number).filter(n => n > 0)
          : null;
        const _registerToGroups = (spr, baseWorldX, baseY) => {
          if (!_objGids || !_objGids.length || !spr) return;
          spr._origWorldX = baseWorldX;
          spr._origBaseY = baseY;
          for (const _gid of _objGids) {
            if (!this._groupSprites[_gid]) this._groupSprites[_gid] = [];
            this._groupSprites[_gid].push(spr);
          }
        };
        if (_0x501fde) {
          const _0x32e8a1 = frameName.replace("_front_", "_back_");
          let backSprite = L(scene, spriteWorldX, baseY, _0x32e8a1);
          if (backSprite) {
            this._applyVisualProps(scene, backSprite, _0x32e8a1, levelObj);
            backSprite._eeLayer = 1;
            backSprite._eeWorldX = worldX;
            backSprite._eeBaseY = baseY;
            backSprite._eeZDepth = _objZDepth - 0.005;
            backSprite._eeOrigAlpha = 1;
            this._addToSection(backSprite);
            _registerToGroups(backSprite, worldX, baseY);
            _registerColor(backSprite, _col1);
          }
        }
        let _0xOrbGlow = null;
        if (objectDef.glow) {
          _0xOrbGlow = this._addGlowSprite(scene, spriteWorldX, baseY, frameName, levelObj, worldX);
          if (_0xOrbGlow) {
            _0xOrbGlow._eeZDepth = _objZDepth - 0.003;
            _0xOrbGlow._eeOrigAlpha = 1;
            _registerToGroups(_0xOrbGlow, worldX, baseY);
          }
        }
        const _0x36f679 = _0x501fde ? {
          ...objectDef,
          _portalFront: true
        } : objectDef;
        let sprite = L(scene, spriteWorldX, baseY, frameName);
        if (sprite) {
          this._applyVisualProps(scene, sprite, frameName, levelObj, objectDef);
          this._addVisualSprite(sprite, _0x36f679);
          sprite._eeWorldX = worldX;
          sprite._eeBaseY = baseY;
          sprite._eeZDepth = _objZDepth;
          sprite._eeOrigAlpha = 1;
          _registerColor(sprite, _col1);
          this._addToSection(sprite);
          if (_objGids && _objGids.length) {
            sprite._eeGroups = _objGids;
            _registerToGroups(sprite, sprite._eeWorldX, sprite._eeBaseY);
          }
          if (objectDef && objectDef.animFrames) {
            sprite._animFrames = objectDef.animFrames;
            sprite._animInterval = objectDef.animInterval || 100;
            sprite._animIdx = 0;
            sprite._animScene = scene;
            window._animatedSprites.push(sprite);
          }
          if (objectDef && objectDef.type === ringType) {
            sprite.setScale(0.75);
            sprite._eeAudioScale = true;
            this._orbSprites.push(sprite);
            if (_0xOrbGlow) {
              _0xOrbGlow.setScale(0.75);
              _0xOrbGlow._eeAudioScale = true;
              this._orbSprites.push(_0xOrbGlow);
            }
          }
          if (objectDef && objectDef.type === coinType) {
            sprite._coinWorldX = worldX;
            sprite._coinWorldY = worldY;
            sprite._coinBaseScale = sprite.scaleX || 1;
            this._coinSprites.push(sprite);
          }
          if (frameName && frameName.indexOf("sawblade") >= 0) {
            sprite.setTint(0x000000);
            sprite._isSaw = true;
            this._sawSprites.push(sprite);
            let _sawMirror = L(scene, spriteWorldX, baseY, frameName);
            if (_sawMirror) {
              this._applyVisualProps(scene, _sawMirror, frameName, levelObj, objectDef);
              _sawMirror.setTint(0x000000);
              _sawMirror.rotation = sprite.rotation + Math.PI;
              _sawMirror._isSaw = true;
              _sawMirror._eeWorldX = worldX;
              _sawMirror._eeBaseY = baseY;
              this._addToSection(_sawMirror);
              this._addVisualSprite(_sawMirror);
              this._sawSprites.push(_sawMirror);
              _registerToGroups(_sawMirror, worldX, baseY);
            }
          }
        } else {
          console.warn("No sprite found for object ID " + levelObj.id + " frame=" + frameName + " type=" + (objectDef ? objectDef.type : "null"));
        }
        if (objectDef && (objectDef.type === solidType || objectDef.type === hazardType)) {
          let _0x47077e = frameName.replace("_001.png", "_2_001.png");
          let overlaySprite = R(scene, _0x47077e) ? L(scene, spriteWorldX, baseY, _0x47077e) : null;
          if (overlaySprite) {
            this._applyVisualProps(scene, overlaySprite, _0x47077e, levelObj);
            this._addVisualSprite(overlaySprite);
            overlaySprite._eeWorldX = worldX;
            overlaySprite._eeBaseY = baseY;
            overlaySprite._eeZDepth = _objZDepth + 0.002;
            overlaySprite._eeOrigAlpha = 1;
            let _oc2 = _col2;
            if (_oc2 <= 0) _oc2 = 2;
            _registerColor(overlaySprite, _oc2);
            this._addToSection(overlaySprite);
            _registerToGroups(overlaySprite, worldX, baseY);
          }
        }
        if (objectDef.children) {
          for (let childDef of objectDef.children) {
            let _0x3b4e8c = childDef.dx || 0;
            let _0x172131 = childDef.dy || 0;
            if (childDef.localDx !== undefined || childDef.localDy !== undefined) {
              let _0x38902b = childDef.localDx || 0;
              let _0x256a8e = childDef.localDy || 0;
              if (levelObj.flipX) {
                _0x38902b = -_0x38902b;
              }
              if (levelObj.flipY) {
                _0x256a8e = -_0x256a8e;
              }
              let _0x3e62f2 = (levelObj.rot || 0) * Math.PI / 180;
              _0x3b4e8c = _0x38902b * Math.cos(_0x3e62f2) - _0x256a8e * Math.sin(_0x3e62f2);
              _0x172131 = _0x38902b * Math.sin(_0x3e62f2) + _0x256a8e * Math.cos(_0x3e62f2);
            }
            const _childWorldX = worldX + _0x3b4e8c;
            const _childBaseY = baseY + _0x172131;
            let childSprite = L(scene, spriteWorldX + _0x3b4e8c, baseY + _0x172131, childDef.frame);
            if (childSprite) {
              this._applyVisualProps(scene, childSprite, childDef.frame, levelObj, childDef);
              if (childDef.audioScale) {
                childSprite.setScale(0.1);
                childSprite.setAlpha(0.9);
                childSprite._eeAudioScale = true;
                this._audioScaleSprites.push(childSprite);
              }
              if ((childDef.z !== undefined ? childDef.z : -1) < 0) {
                childSprite._eeLayer = 1;
                childSprite._eeBehindParent = true;
              } else {
                this._addVisualSprite(childSprite, childDef);
              }
              childSprite._eeWorldX = _childWorldX;
              childSprite._eeBaseY = _childBaseY;
              childSprite._eeZDepth = _objZDepth + ((childDef.z !== undefined ? childDef.z : -1) < 0 ? -0.003 : 0.001);
              childSprite._eeOrigAlpha = 1;
              _registerColor(childSprite, _col1);
              this._addToSection(childSprite);
              _registerToGroups(childSprite, _childWorldX, _childBaseY);
              if (frameName && frameName.indexOf("sawblade") >= 0) {
                childSprite.setTint(0x000000);
                childSprite._isSaw = true;
                this._sawSprites.push(childSprite);
                let _childMirror = L(scene, spriteWorldX + _0x3b4e8c, baseY + _0x172131, childDef.frame);
                if (_childMirror) {
                  this._applyVisualProps(scene, _childMirror, childDef.frame, levelObj, childDef);
                  _childMirror.setTint(0x000000);
                  _childMirror.rotation = childSprite.rotation + Math.PI;
                  _childMirror._isSaw = true;
                  _childMirror._eeWorldX = _childWorldX;
                  _childMirror._eeBaseY = _childBaseY;
                  this._addToSection(_childMirror);
                  this._sawSprites.push(_childMirror);
                  _registerToGroups(_childMirror, _childWorldX, _childBaseY);
                }
              }
            }
          }
        }
      } else if (!objectDef) {
        _0x443c50.add(levelObj.id);
        if (levelObj.id === 1331) {
        }
        console.warn("Object ID " + levelObj.id + " has no definition in allObjects at x=" + worldX + " y=" + worldY);
      }
      if (objectDef && objectDef.portalParticle && frameName) {
        let _0x3a9438 = worldX;
        let _0x2e9079 = b(worldY);
        const _0x143187 = 2;
        let _0x5926ad = _0x3a9438 - _0x143187 * 5;
        let _0x1ebc69 = _0x2e9079;
        const _portalRot = (levelObj.rot || 0) * Math.PI / 180;
        const _0x388526 = {
          getRandomPoint: _0x4ad804 => {
            let _0x5b7fb4 = (Math.random() * 190 + 85) * Math.PI / 180;
            let _0x2bc56f = _0x143187 * 20 + Math.random() * 40 * _0x143187;
            let _rx = Math.cos(_0x5b7fb4) * _0x2bc56f;
            let _ry = Math.sin(_0x5b7fb4) * _0x2bc56f;
            _0x4ad804.x = _rx * Math.cos(_portalRot) - _ry * Math.sin(_portalRot);
            _0x4ad804.y = _rx * Math.sin(_portalRot) + _ry * Math.cos(_portalRot);
            return _0x4ad804;
          }
        };
        const _0x100649 = 20;
        let _0x1bed6b = scene.add.particles(_0x5926ad, _0x1ebc69, "GJ_WebSheet", {
          frame: "square.png",
          lifespan: {
            min: 200,
            max: 1000
          },
          speed: 0,
          scale: {
            start: 0.75,
            end: 0.125
          },
          alpha: {
            start: 0.5,
            end: 0
          },
          tint: objectDef.portalParticleColor,
          blendMode: Phaser.BlendModes.ADD,
          frequency: 20,
          maxParticles: 0,
          emitting: true,
          emitZone: {
            type: "random",
            source: _0x388526
          },
          emitCallback: _0x157c59 => {
            let _0x30a90b = -_0x157c59.x;
            let _0x3e98bf = -_0x157c59.y;
            let _0x42124a = Math.sqrt(_0x30a90b * _0x30a90b + _0x3e98bf * _0x3e98bf) || 1;
            let _0x1d5ab8 = _0x157c59.life / 1000;
            let _0x1e162a = (_0x42124a - _0x100649) / (_0x1d5ab8 || 0.3);
            _0x157c59.velocityX = _0x30a90b / _0x42124a * _0x1e162a;
            _0x157c59.velocityY = _0x3e98bf / _0x42124a * _0x1e162a;
          }
        });
        _0x1bed6b.setDepth(14);
        _0x1bed6b._eeLayer = 2;
        _0x1bed6b._eeWorldX = worldX;
        _0x1bed6b._eeBaseY = _0x1ebc69;
        this._addToSection(_0x1bed6b);
      }
      if (objectDef) {
        const _registerCollider = (col) => {
          col._baseX = col.x;
          col._baseY = col.y;
          col._origBaseX = col.x;
          col._origBaseY = col.y;
          if (levelObj.groups) {
            const _cgids = levelObj.groups.split('.').map(Number).filter(n => n > 0);
            col._eeGroups = _cgids;
            for (const _cgid of _cgids) {
              if (!this._groupColliders[_cgid]) this._groupColliders[_cgid] = [];
              this._groupColliders[_cgid].push(col);
            }
          }
        };
        if (objectDef.type === solidType && objectDef.gridW > 0 && objectDef.gridH > 0) {
          let _0x10e5ae = objectDef.gridW * a;
          let _0x11e08d = objectDef.gridH * a;
          let _0x4628ff = new Collider(solidType, worldX, worldY, _0x10e5ae, _0x11e08d, levelObj.rot || 0);
          _0x4628ff.objid = levelObj.id;
          _registerCollider(_0x4628ff);
          this.objects.push(_0x4628ff);
          this._addCollisionToSection(_0x4628ff);
        } else if (objectDef.type === hazardType) {
          let _0x3f8c4f = 0;
          let _0x2a123d = 0;
          if (objectDef.spriteW > 0 && objectDef.spriteH > 0 && objectDef.hitboxScaleX !== undefined && objectDef.hitboxScaleY !== undefined) {
            _0x3f8c4f = objectDef.spriteW * objectDef.hitboxScaleX * 2;
            _0x2a123d = objectDef.spriteH * objectDef.hitboxScaleY * 2;
          } else if (objectDef.gridW > 0 && objectDef.gridH > 0) {
            _0x3f8c4f = objectDef.gridW * 12;
            _0x2a123d = objectDef.gridH * 24;
          }
          const _hasHitboxRadius = objectDef.hitbox_radius !== undefined && objectDef.hitbox_radius !== null;
          const _worldHitboxRadius = _hasHitboxRadius ? objectDef.hitbox_radius * 2 : 0;
          if (_hasHitboxRadius && _0x3f8c4f === 0) {
            _0x3f8c4f = _worldHitboxRadius * 2;
            _0x2a123d = _worldHitboxRadius * 2;
          }
          if (_0x3f8c4f > 0 && _0x2a123d > 0) {
            let _0x3c84ad = new Collider(hazardType, worldX, worldY, _0x3f8c4f, _0x2a123d, levelObj.rot || 0);
            if (_hasHitboxRadius) _0x3c84ad.hitbox_radius = _worldHitboxRadius;
            _registerCollider(_0x3c84ad);
            this.objects.push(_0x3c84ad);
            this._addCollisionToSection(_0x3c84ad);
          }
        } else if (objectDef.type === portalType) {

          let _0xad0974 = objectDef.gridW * a;
          let _0x2c2226 = objectDef.gridH * a;
          const _0x5bcd81 = objectDef.sub || {
            10: "gravity_flip",
            11: "gravity_normal",
            12: "cube",
            13: "fly",
            45: "mirrora",
            46: "mirrorb",
            47: "ball",
            660: "wave",
            111: "ufo",
            1331: "spider",
            286: "dual_on",
            287: "dual_off",
          }[levelObj.id];
          if (levelObj.id === 111) {
          }
          const _0x25452a = {
            gravity_flip: "portal_gravity_down",
            gravity_normal: "portal_gravity_up",
            [flyPortal]: "portal_fly",
            fly: "portal_fly",
            [cubePortal]: "portal_cube",
            cube: "portal_cube",
            ball: "portal_ball",
            wave: portalWaveType,
            ufo: portalUfoType,
            spider: "portal_spider",
            mirrora: "portal_mirror_on",
            mirrorb: "portal_mirror_off",
            shrink: "portal_mini_on",
            grow: "portal_mini_off",
            dual_on: "portal_dual_on",
            dual_off: "portal_dual_off",
          }[_0x5bcd81] || null;
          if (levelObj.id === 111) {
            console.log("res - _0x5bcd81: " + _0x5bcd81 + ", _0x25452a: " + _0x25452a);
          }
          if (!_0x25452a) {
            console.warn("unknown portal sub-type: id=" + levelObj.id + " sub=" + objectDef.sub);
          }
          if (_0x25452a) {
            let _0x4bd7bc = new Collider(_0x25452a, worldX, worldY, _0xad0974, _0x2c2226, levelObj.rot || 0);
            _0x4bd7bc.portalY = worldY;
            _registerCollider(_0x4bd7bc);
            this.objects.push(_0x4bd7bc);
            this._addCollisionToSection(_0x4bd7bc);
            console.log("portal collision created: type=" + _0x25452a + " id=" + levelObj.id + " x=" + worldX + " y=" + worldY + " w=" + _0xad0974 + " h=" + _0x2c2226);
          } else {
            console.warn("portal ID " + levelObj.id + " has no matching sub-type (sub=" + objectDef.sub + ")");
          }
        } else if (objectDef.type === padType) {
          let padW = objectDef.gridW * a;
          let padH = objectDef.gridH * a;
          let padObj = new Collider(jumpPadType, worldX, worldY, padW, padH, levelObj.rot || 0);
          padObj.padId = levelObj.id;
          _registerCollider(padObj);
          this.objects.push(padObj);
          this._addCollisionToSection(padObj);
          console.log("pad collision created: id=" + levelObj.id + " x=" + worldX + " y=" + worldY);
        } else if (objectDef.type === ringType) {
          let orbW = objectDef.gridW * a;
          let orbH = objectDef.gridH * a;
          let orbObj = new Collider(jumpRingType, worldX, worldY, orbW, orbH, levelObj.rot || 0);
          orbObj.orbId = levelObj.id;
          orbObj.orbRotation = levelObj.rot || 0;
          orbObj._dashHoldTicks = 0;
          _registerCollider(orbObj);
          this.objects.push(orbObj);
          this._addCollisionToSection(orbObj);
          console.log("orb collision created: id=" + levelObj.id + " x=" + worldX + " y=" + worldY);
        } else if (objectDef.type === coinType) {
          let coinW = (objectDef.gridW || 1) * a;
          let coinH = (objectDef.gridH || 1) * a;
          let coinObj = new Collider(coinType, worldX, worldY, coinW, coinH, levelObj.rot || 0);
          coinObj.coinId = levelObj.id;
          _registerCollider(coinObj);
          this.objects.push(coinObj);
          this._addCollisionToSection(coinObj);
        } else if (objectDef.type === speedType) {
          let speedW = (objectDef.gridW || 1) * a;
          let speedH = (objectDef.gridH || 1) * a;
          let speedobject = new Collider(speedType, worldX, worldY, speedW, speedH, levelObj.rot || 0);
          speedobject.portalY = worldY;
          const speedMap = {
            200: SpeedPortal.HALF,
            201: SpeedPortal.ONE_TIMES,
            202: SpeedPortal.TWO_TIMES,
            203: SpeedPortal.THREE_TIMES,
            1334: SpeedPortal.FOUR_TIMES,
          };
          speedobject.speedValue = speedMap[levelObj.id] ?? SpeedPortal.ONE_TIMES;
          speedobject.speedId = levelObj.id;
          _registerCollider(speedobject);
          this.objects.push(speedobject);
          this._addCollisionToSection(speedobject);
          console.log("speed portal collision created: id=" + levelObj.id + " x=" + worldX + " y=" + worldY + " speed=" + speedobject.speedValue);
        }
      }
    }
    _0x443c50.size;
    if (_0x443c50.size > 0) {
      console.warn("" + _0x443c50.size + " unique object IDs had no definition in allObjects:", [..._0x443c50].join(", "));
    }
    let colTypeCounts = {};
    for (let obj of this.objects) {
      colTypeCounts[obj.type] = (colTypeCounts[obj.type] || 0) + 1;
    }
    console.log("colision objects by type:", JSON.stringify(colTypeCounts));
    this._colorTriggers.sort((_0x359c7f, _0x28dd8b) => _0x359c7f.x - _0x28dd8b.x);
    this._enterEffectTriggers.sort((_0x3e43f2, _0x5e3d9a) => _0x3e43f2.x - _0x5e3d9a.x);
    this._moveTriggers.sort((a, b) => a.x - b.x);
    this._alphaTriggers.sort((a, b) => a.x - b.x);
    this._rotateTriggers.sort((a, b) => a.x - b.x);
    this._pulseTriggers.sort((a, b) => a.x - b.x);
    // sort all section containers by z-depth for proper layering
    for (let si = 0; si < this._sectionContainers.length; si++) {
      const sc = this._sectionContainers[si];
      if (sc) {
        if (sc.normal && sc.normal.list && sc.normal.list.length > 1) sc.normal.sort('depth');
        if (sc.additive && sc.additive.list && sc.additive.list.length > 1) sc.additive.sort('depth');
      }
    }
    this.endXPos = Math.max(screenWidth + 1200, this._lastObjectX + 680);
  }
  createEndPortal(_0x41fbdb) {
    var _0x400605;
    if (this.endXPos <= 0) {
      return;
    }
    const _0x3b56d4 = this.endXPos;
    const _0x1c3aea = b(240);
    const _0x46064b = Math.round(16);
    this._endPortalContainer = _0x41fbdb.add.container(_0x3b56d4, _0x1c3aea);
    for (let _0x2a327c = 0; _0x2a327c < _0x46064b; _0x2a327c++) {
      const _0xacf7ef = _0x41fbdb.add.image(0, (_0x2a327c - Math.floor(_0x46064b / 2)) * a, "GJ_WebSheet", "square_02_001.png").setAngle(-90);
      this._endPortalContainer.add(_0xacf7ef);
    }
    this.container.add(this._endPortalContainer);
    this._endPortalShine = _0x41fbdb.add.image(_0x3b56d4 - 58, _0x1c3aea, "GJ_WebSheet", "gradientBar.png");
    const _0x3e25a9 = ((_0x400605 = _0x41fbdb.textures.getFrame("GJ_WebSheet", "gradientBar.png")) == null ? undefined : _0x400605.height) || 64;
    this._endPortalShine.setBlendMode(S);
    this._endPortalShine.setTint(window.mainColor);
    this._endPortalShine.setScale(1, 960 / _0x3e25a9);
    this.additiveContainer.add(this._endPortalShine);
    const _0x58cedb = _0x3b56d4 - 30;
    const _0x4f52b7 = {
      getRandomPoint: _0x4f04dd => {
        const _0x53ec71 = (85 + Math.random() * 190) * Math.PI / 180;
        const _0x42e60c = 320 + (Math.random() * 2 - 1) * 80;
        _0x4f04dd.x = Math.cos(_0x53ec71) * _0x42e60c;
        _0x4f04dd.y = Math.sin(_0x53ec71) * _0x42e60c;
        return _0x4f04dd;
      }
    };
    this._endPortalEmitter = _0x41fbdb.add.particles(_0x58cedb, _0x1c3aea, "GJ_WebSheet", {
      frame: "square.png",
      lifespan: {
        min: 200,
        max: 1000
      },
      speed: 0,
      scale: {
        start: 0.75,
        end: 0.125
      },
      alpha: {
        start: 1,
        end: 0
      },
      tint: window.mainColor,
      blendMode: Phaser.BlendModes.ADD,
      frequency: 10,
      maxParticles: 100,
      emitting: true,
      emitZone: {
        type: "random",
        source: _0x4f52b7
      },
      emitCallback: _0x2daff4 => {
        const _0x5e30d8 = -_0x2daff4.x;
        const _0x17ba71 = -_0x2daff4.y;
        const _0x3c5c52 = Math.sqrt(_0x5e30d8 * _0x5e30d8 + _0x17ba71 * _0x17ba71) || 1;
        const _0x279521 = (_0x3c5c52 - 20) / (_0x2daff4.life / 1000 || 0.3);
        _0x2daff4.velocityX = _0x5e30d8 / _0x3c5c52 * _0x279521;
        _0x2daff4.velocityY = _0x17ba71 / _0x3c5c52 * _0x279521;
      }
    });
    this._endPortalEmitter.setDepth(14);
    this.topContainer.add(this._endPortalEmitter);
    this._endPortalGameY = 240;
  }
  updateEndPortalY(_0x26f0ab, _0x43c4d1) {
    if (!this._endPortalContainer) {
      return;
    }
    const _0x50aa7d = 140 + _0x26f0ab;
    let _0x1be4c3;
    _0x1be4c3 = _0x43c4d1 ? _0x50aa7d : Math.max(240, _0x50aa7d);
    const _0x32e645 = b(_0x1be4c3);
    this._endPortalContainer.y = _0x32e645;
    this._endPortalShine.y = _0x32e645;
    this._endPortalEmitter.y = _0x32e645;
    this._endPortalGameY = _0x1be4c3;
  }
  checkColorTriggers(_0x2b00ce) {
    let _0x24b030 = [];
    while (this._colorTriggerIdx < this._colorTriggers.length) {
      let _0x39c924 = this._colorTriggers[this._colorTriggerIdx];
      if (!(_0x39c924.x <= _0x2b00ce)) {
        break;
      }
      _0x24b030.push(_0x39c924);
      this._colorTriggerIdx++;
    }
    return _0x24b030;
  }
  resetColorTriggers() {
    this._colorTriggerIdx = 0;
  }
  _addToSection(sliderWidth) {
    const _0x4ac40a = Math.max(0, Math.floor(sliderWidth._eeWorldX / 400));
    this._sections[_0x4ac40a] ||= [];
    this._sections[_0x4ac40a].push(sliderWidth);
    if (sliderWidth._eeZDepth !== undefined) {
      sliderWidth.depth = sliderWidth._eeZDepth;
    }
    const _0x14d5f7 = sliderWidth._eeLayer !== undefined ? sliderWidth._eeLayer : 1;
    if (_0x14d5f7 === 2) {
      this.topContainer.add(sliderWidth);
      return;
    }
    if (!this._sectionContainers[_0x4ac40a]) {
      const _0xc1a93d = {
        additive: this._scene.add.container(0, 0),
        normal: this._scene.add.container(0, 0)
      };
      this.additiveContainer.add(_0xc1a93d.additive);
      this.container.add(_0xc1a93d.normal);
      this._sectionContainers[_0x4ac40a] = _0xc1a93d;
    }
    const _0x2157d3 = this._sectionContainers[_0x4ac40a];
    if (_0x14d5f7 === 0) {
      _0x2157d3.additive.add(sliderWidth);
    } else if (sliderWidth._eeBehindParent) {
      _0x2157d3.normal.addAt(sliderWidth, 0);
    } else {
      _0x2157d3.normal.add(sliderWidth);
    }
  }
  _addCollisionToSection(_0x3dce4b) {
    const _0x5cad3c = Math.max(0, Math.floor(_0x3dce4b.x / 400));
    this._collisionSections[_0x5cad3c] ||= [];
    this._collisionSections[_0x5cad3c].push(_0x3dce4b);
  }
  _setSectionVisible(_0x2b0fa1, _0x488507) {
    const _0x141e9c = this._sectionContainers[_0x2b0fa1];
    if (_0x141e9c) {
      _0x141e9c.additive.visible = _0x488507;
      _0x141e9c.normal.visible = _0x488507;
    }
  }
  updateVisibility(_0xa5f1e1) {
    const _0x1dce22 = this._sectionContainers.length - 1;
    if (_0x1dce22 < 0) {
      return;
    }
    const particleScale = Math.max(0, Math.floor((_0xa5f1e1 - 200) / 400));
    const sliderHeight = Math.min(_0x1dce22, Math.floor((_0xa5f1e1 + screenWidth + 200) / 400));
    const _0x1800fc = this._visMinSec;
    const _0xc31046 = this._visMaxSec;
    if (_0x1800fc < 0) {
      for (let _0x47dbe1 = 0; _0x47dbe1 <= _0x1dce22; _0x47dbe1++) {
        this._setSectionVisible(_0x47dbe1, _0x47dbe1 >= particleScale && _0x47dbe1 <= sliderHeight);
      }
      this._visMinSec = particleScale;
      this._visMaxSec = sliderHeight;
      return;
    }
    if (particleScale !== _0x1800fc || sliderHeight !== _0xc31046) {
      if (particleScale > _0x1800fc) {
        for (let _0x7da5df = _0x1800fc; _0x7da5df <= Math.min(particleScale - 1, _0xc31046); _0x7da5df++) {
          this._setSectionVisible(_0x7da5df, false);
        }
      }
      if (sliderHeight < _0xc31046) {
        for (let _0x5b2d47 = Math.max(sliderHeight + 1, _0x1800fc); _0x5b2d47 <= _0xc31046; _0x5b2d47++) {
          this._setSectionVisible(_0x5b2d47, false);
        }
      }
      if (particleScale < _0x1800fc) {
        for (let _0x3caab6 = particleScale; _0x3caab6 <= Math.min(_0x1800fc - 1, sliderHeight); _0x3caab6++) {
          this._setSectionVisible(_0x3caab6, true);
        }
      }
      if (sliderHeight > _0xc31046) {
        for (let _0x347412 = Math.max(_0xc31046 + 1, particleScale); _0x347412 <= sliderHeight; _0x347412++) {
          this._setSectionVisible(_0x347412, true);
        }
      }
      this._visMinSec = particleScale;
      this._visMaxSec = sliderHeight;
    }
  }
  getNearbySectionObjects(_0x2e85c7) {
    const _0x55d1b7 = Math.max(0, Math.floor(_0x2e85c7 / 400));
    const _0x31c345 = Math.max(0, _0x55d1b7 - 1);
    const _0x5f1907 = Math.min(this._collisionSections.length - 1, _0x55d1b7 + 1);
    const _0x28a7c0 = this._nearbyBuffer;
    _0x28a7c0.length = 0;
    for (let _0xe2cbfa = _0x31c345; _0xe2cbfa <= _0x5f1907; _0xe2cbfa++) {
      const _0x2171db = this._collisionSections[_0xe2cbfa];
      if (_0x2171db) {
        for (let _0x5cdca9 = 0; _0x5cdca9 < _0x2171db.length; _0x5cdca9++) {
          _0x28a7c0.push(_0x2171db[_0x5cdca9]);
        }
      }
    }
    return _0x28a7c0;
  }
  checkEnterEffectTriggers(_0x5d0838) {
    while (this._enterEffectTriggerIdx < this._enterEffectTriggers.length) {
      let _0x937c72 = this._enterEffectTriggers[this._enterEffectTriggerIdx];
      if (!(_0x937c72.x <= _0x5d0838)) {
        break;
      }
      this._activeEnterEffect = _0x937c72.effect;
      this._activeExitEffect = _0x937c72.effect;
      this._enterEffectTriggerIdx++;
    }
  }
  checkMoveTriggers(playerX) {
    while (this._moveTriggerIdx < this._moveTriggers.length) {
      const trig = this._moveTriggers[this._moveTriggerIdx];
      if (trig.x > playerX) break;
      this._activeMoveTweens.push({
        trig,
        elapsed: 0,
        prevProgress: 0,
      });
      if (!this._groupOffsets[trig.targetGroup]) {
        this._groupOffsets[trig.targetGroup] = { x: 0, y: 0 };
      }
      this._moveTriggerIdx++;
    }
  }

  stepMoveTriggers(dt) {
    let i = 0;
    while (i < this._activeMoveTweens.length) {
      const anim = this._activeMoveTweens[i];
      const { trig } = anim;
      const dur = trig.duration > 0 ? trig.duration : 0;

      anim.elapsed += dt;
      const progress = dur > 0 ? Math.min(anim.elapsed / dur, 1) : 1;
      const prevProgress = anim.prevProgress;

      const curSample = Easing.sample(trig.easingType, trig.easingRate, progress);
      const prevSample = Easing.sample(trig.easingType, trig.easingRate, prevProgress);
      const amount = curSample - prevSample;

      anim.prevProgress = progress;

      const deltaX = trig.offsetX * amount;
      const deltaY = -(trig.offsetY * amount);

      const sprites = this._groupSprites[trig.targetGroup];
      const colliders = this._groupColliders[trig.targetGroup];
      if (sprites || colliders) {
        const off = this._groupOffsets[trig.targetGroup];
        off.x += deltaX;
        off.y += deltaY;
        if (sprites) {
          for (const spr of sprites) {
            if (!spr || !spr.active) continue;
            spr.x = spr._origWorldX + off.x;
            spr.y = spr._origBaseY + off.y;
            spr._eeWorldX = spr.x;
            spr._eeBaseY  = spr.y;
            if (spr._coinWorldX !== undefined) {
              spr._coinWorldX = (spr._origWorldX + off.x) / 2;
            }
            if (spr._coinWorldY !== undefined) {
              spr._coinWorldY = (460 - (spr._origBaseY + off.y)) / 2;
            }
          }
        }
        if (colliders) {
          for (const col of colliders) {
            col.x = col._origBaseX + off.x;
            col.y = col._origBaseY - off.y;
            col._baseX = col.x;
            col._baseY = col.y;
          }
        }
      }

      if (progress >= 1) {
        this._activeMoveTweens.splice(i, 1);
      } else {
        i++;
      }
    }
  }

  resetMoveTriggers() {
    this._moveTriggerIdx = 0;
    this._activeMoveTweens = [];
    this._groupOffsets = {};
    for (const gid in this._groupSprites) {
      for (const spr of this._groupSprites[gid]) {
        if (!spr || !spr.active) continue;
        spr.x = spr._origWorldX;
        spr.y = spr._origBaseY;
        spr._eeWorldX = spr._origWorldX;
        spr._eeBaseY = spr._origBaseY;
      }
    }
    for (const gid in this._groupColliders) {
      for (const col of this._groupColliders[gid]) {
        col.x = col._origBaseX;
        col.y = col._origBaseY;
        col._baseX = col._origBaseX;
        col._baseY = col._origBaseY;
      }
    }
  }

  checkAlphaTriggers(playerX) {
    while (this._alphaTriggerIdx < this._alphaTriggers.length) {
      const trig = this._alphaTriggers[this._alphaTriggerIdx];
      if (trig.x > playerX) break;
      const currentOpacity = this._groupOpacity[trig.targetGroup] ?? 1;
      this._activeAlphaTweens.push({
        trig,
        elapsed: 0,
        startOpacity: currentOpacity,
      });
      this._alphaTriggerIdx++;
    }
  }

  stepAlphaTriggers(dt) {
    let i = 0;
    while (i < this._activeAlphaTweens.length) {
      const anim = this._activeAlphaTweens[i];
      const { trig } = anim;
      const dur = trig.duration > 0 ? trig.duration : 0;

      anim.elapsed += dt;
      const progress = dur > 0 ? Math.min(anim.elapsed / dur, 1) : 1;

      const newOpacity = anim.startOpacity + (trig.targetOpacity - anim.startOpacity) * progress;
      this._groupOpacity[trig.targetGroup] = Math.max(0, Math.min(1, newOpacity));

      if (progress >= 1) {
        this._activeAlphaTweens.splice(i, 1);
      } else {
        i++;
      }
    }

    for (const gid in this._groupOpacity) {
      const sprites = this._groupSprites[gid];
      if (!sprites) continue;
      const op = this._groupOpacity[gid];
      for (const spr of sprites) {
        if (!spr || !spr.active) continue;
        if (spr._eeActive) continue;
        spr.setAlpha(op);
      }
    }
  }

  resetAlphaTriggers() {
    this._alphaTriggerIdx = 0;
    this._activeAlphaTweens = [];
    this._groupOpacity = {};
    for (const gid in this._groupSprites) {
      for (const spr of this._groupSprites[gid]) {
        if (!spr || !spr.active) continue;
        if (spr._eeActive) continue;
        spr.setAlpha(1);
        spr._eeOrigAlpha = 1;
      }
    }
  }

  checkRotateTriggers(playerX) {
    while (this._rotateTriggerIdx < this._rotateTriggers.length) {
      const trig = this._rotateTriggers[this._rotateTriggerIdx];
      if (trig.x > playerX) break;
      const totalDeg = trig.degrees + (trig.times360 * 360);
      this._activeRotateTweens.push({
        trig,
        elapsed: 0,
        prevProgress: 0,
        totalRad: totalDeg * Math.PI / 180,
      });
      this._rotateTriggerIdx++;
    }
  }
  stepRotateTriggers(dt) {
    let i = 0;
    while (i < this._activeRotateTweens.length) {
      const anim = this._activeRotateTweens[i];
      const { trig } = anim;
      const dur = trig.duration > 0 ? trig.duration : 0;
      anim.elapsed += dt;
      const progress = dur > 0 ? Math.min(anim.elapsed / dur, 1) : 1;
      const curSample = Easing.sample(trig.easingType, trig.easingRate, progress);
      const prevSample = Easing.sample(trig.easingType, trig.easingRate, anim.prevProgress);
      const deltaRot = (curSample - prevSample) * anim.totalRad;
      anim.prevProgress = progress;
      const sprites = this._groupSprites[trig.targetGroup];
      const colliders = this._groupColliders[trig.targetGroup];
      if (trig.centerGroup > 0) {
        const centerSprites = this._groupSprites[trig.centerGroup];
        if (centerSprites && centerSprites.length > 0) {
          let cx = 0, cy = 0, cn = 0;
          for (const cs of centerSprites) {
            if (!cs || !cs.active) continue;
            cx += cs.x; cy += cs.y; cn++;
          }
          if (cn > 0) {
            cx /= cn; cy /= cn;
            const cosD = Math.cos(deltaRot), sinD = Math.sin(deltaRot);
            if (sprites) {
              for (const spr of sprites) {
                if (!spr || !spr.active) continue;
                const dx = spr.x - cx, dy = spr.y - cy;
                spr.x = cx + dx * cosD - dy * sinD;
                spr.y = cy + dx * sinD + dy * cosD;
                spr._eeWorldX = spr.x;
                spr._eeBaseY = spr.y;
                if (spr._origWorldX !== undefined) { spr._origWorldX = spr.x; spr._origBaseY = spr.y; }
                if (!trig.lockRotation) spr.rotation += deltaRot;
              }
            }
            if (colliders) {
              for (const col of colliders) {
                const dx = col.x - cx, dy = col.y - cy;
                col.x = cx + dx * cosD - dy * sinD;
                col.y = cy + dx * sinD + dy * cosD;
                col._baseX = col.x; col._baseY = col.y;
                if (col._origBaseX !== undefined) { col._origBaseX = col.x; col._origBaseY = col.y; }
              }
            }
          }
        }
      } else {
        if (sprites) {
          for (const spr of sprites) {
            if (!spr || !spr.active) continue;
            spr.rotation += deltaRot;
          }
        }
      }
      if (progress >= 1) { this._activeRotateTweens.splice(i, 1); } else { i++; }
    }
  }
  resetRotateTriggers() {
    this._rotateTriggerIdx = 0;
    this._activeRotateTweens = [];
  }

  checkPulseTriggers(playerX) {
    while (this._pulseTriggerIdx < this._pulseTriggers.length) {
      const trig = this._pulseTriggers[this._pulseTriggerIdx];
      if (trig.x > playerX) break;
      const totalDur = trig.fadeIn + trig.hold + trig.fadeOut;
      this._activePulses.push({ trig, elapsed: 0, totalDuration: totalDur > 0 ? totalDur : 0.01 });
      this._pulseTriggerIdx++;
    }
  }
  stepPulseTriggers(dt, colorManager) {
    let i = 0;
    while (i < this._activePulses.length) {
      const pulse = this._activePulses[i];
      const { trig } = pulse;
      pulse.elapsed += dt;
      const { fadeIn, hold, fadeOut } = trig;
      let intensity = 0;
      const t = pulse.elapsed;
      if (t < fadeIn) { intensity = fadeIn > 0 ? t / fadeIn : 1; }
      else if (t < fadeIn + hold) { intensity = 1; }
      else if (t < fadeIn + hold + fadeOut) { intensity = fadeOut > 0 ? 1 - (t - fadeIn - hold) / fadeOut : 0; }
      if (trig.targetType === 1 && trig.targetGroup > 0) {
        const sprites = this._groupSprites[trig.targetGroup];
        if (sprites) {
          const pr = Math.round(trig.color.r * intensity);
          const pg = Math.round(trig.color.g * intensity);
          const pb = Math.round(trig.color.b * intensity);
          const pulseHex = (pr << 16) | (pg << 8) | pb;
          for (const spr of sprites) {
            if (!spr || !spr.active) continue;
            if (intensity > 0.01) { spr.setTint(pulseHex); spr._eePulsed = true; }
            else { spr.clearTint(); spr._eePulsed = false; }
          }
        }
      } else if (trig.targetType === 0 && trig.targetChannel > 0 && colorManager) {
        if (intensity > 0.01) {
          const baseColor = colorManager.getColor(trig.targetChannel);
          const pulsed = {
            r: Math.min(255, Math.round(baseColor.r + (trig.color.r - baseColor.r) * intensity)),
            g: Math.min(255, Math.round(baseColor.g + (trig.color.g - baseColor.g) * intensity)),
            b: Math.min(255, Math.round(baseColor.b + (trig.color.b - baseColor.b) * intensity)),
          };
          const pulseHex = (pulsed.r << 16) | (pulsed.g << 8) | pulsed.b;
          const chSprites = this._colorChannelSprites[trig.targetChannel];
          if (chSprites) {
            for (const spr of chSprites) {
              if (!spr || !spr.active) continue;
              spr.setTint(pulseHex); spr._eePulsed = true;
            }
          }
        }
      }
      if (pulse.elapsed >= pulse.totalDuration) {
        if (trig.targetType === 1 && trig.targetGroup > 0) {
          const sprites = this._groupSprites[trig.targetGroup];
          if (sprites) for (const spr of sprites) { if (spr && spr.active) { spr.clearTint(); spr._eePulsed = false; } }
        }
        if (trig.targetType === 0 && trig.targetChannel > 0) {
          const chSprites = this._colorChannelSprites[trig.targetChannel];
          if (chSprites) for (const spr of chSprites) { if (spr && spr.active) spr._eePulsed = false; }
        }
        this._activePulses.splice(i, 1);
      } else { i++; }
    }
  }
  resetPulseTriggers() {
    this._pulseTriggerIdx = 0;
    this._activePulses = [];
  }

  applyColorChannels(colorManager) {
    for (const chId in this._colorChannelSprites) {
      const sprites = this._colorChannelSprites[chId];
      if (!sprites || !sprites.length) continue;
      const hex = colorManager.getHex(parseInt(chId, 10));
      for (const spr of sprites) {
        if (!spr || !spr.active) continue;
        if (spr._eePulsed) continue;
        if (spr._isSaw) continue;
        if (spr._eeAudioScale) continue;
        spr.setTint(hex);
      }
    }
  }

  resetEnterEffectTriggers() {
    this._enterEffectTriggerIdx = 0;
    this._activeEnterEffect = 0;
    this._activeExitEffect = 0;
    for (let _0x17a21d = 0; _0x17a21d < this._sections.length; _0x17a21d++) {
      this._setSectionVisible(_0x17a21d, true);
      const _0x14a035 = this._sections[_0x17a21d];
      if (_0x14a035) {
        for (let _0x13e116 = 0; _0x13e116 < _0x14a035.length; _0x13e116++) {
          const visMinSection = _0x14a035[_0x13e116];
          visMinSection._eeActive = false;
          visMinSection.visible = true;
          visMinSection.x = visMinSection._eeWorldX;
          visMinSection.y = visMinSection._eeBaseY;
          if (!visMinSection._eeAudioScale) {
            visMinSection.setScale(1);
          }
          visMinSection.setAlpha(this._getGroupOpacityForSprite(visMinSection));
        }
      }
    }
  }
  _getGroupOpacityForSprite(spr) {
    const groups = spr && spr._eeGroups;
    if (!groups || !groups.length) return 1;
    let op = 1;
    for (const gid of groups) {
      const g = this._groupOpacity[gid];
      if (g !== undefined && g < op) op = g;
    }
    return op;
  }

  applyEnterEffects(_0x2f36ed) {
    const _0x221c93 = 400;
    const _0xa24372 = 140;
    const _0x5e9f2a = 200;
    const _0x29a51b = _0x2f36ed;
    const _0x548004 = _0x2f36ed + screenWidth;
    const _0x49c6d8 = _0x2f36ed + screenWidth / 2;
    const _0x2d8f53 = Math.max(0, Math.floor((_0x29a51b - _0xa24372) / _0x221c93));
    const _0x2b19db = Math.min(this._sections.length - 1, Math.floor((_0x548004 + _0xa24372) / _0x221c93));
    for (let _0x1bd44f = _0x2d8f53; _0x1bd44f <= _0x2b19db; _0x1bd44f++) {
      const _0x2cff29 = this._sections[_0x1bd44f];
      if (!_0x2cff29) {
        continue;
      }
      const _0x20a3bb = _0x1bd44f * _0x221c93;
      const _0x8f9d56 = _0x20a3bb >= _0x29a51b + _0xa24372 && _0x20a3bb + _0x221c93 <= _0x548004 - _0xa24372;
      for (let _0x54aba7 = 0; _0x54aba7 < _0x2cff29.length; _0x54aba7++) {
        const effectSprite = _0x2cff29[_0x54aba7];
        if (_0x8f9d56) {
          if (effectSprite._eeActive) {
            effectSprite._eeActive = false;
            effectSprite.y = effectSprite._eeBaseY;
            effectSprite.x = effectSprite._eeWorldX;
            if (!effectSprite._eeAudioScale) {
              effectSprite.setScale(1);
            }
            effectSprite.setAlpha(this._getGroupOpacityForSprite(effectSprite));
          }
          continue;
        }
        const _0xeded99 = effectSprite._eeWorldX;
        const _0x1b2883 = _0xeded99 > _0x49c6d8;
        let _0x289aa2;
        _0x289aa2 = _0x1b2883 ? Math.max(0, Math.min(1, (_0x548004 - _0xeded99) / _0xa24372)) : Math.max(0, Math.min(1, (_0xeded99 - _0x29a51b) / _0xa24372));
        if (_0x289aa2 >= 1) {
          if (effectSprite._eeActive) {
            effectSprite._eeActive = false;
            effectSprite.y = effectSprite._eeBaseY;
            effectSprite.x = effectSprite._eeWorldX;
            if (!effectSprite._eeAudioScale) {
              effectSprite.setScale(1);
            }
            effectSprite.setAlpha(this._getGroupOpacityForSprite(effectSprite));
          }
          continue;
        }
        effectSprite._eeActive = true;
        const _0x453353 = _0x1b2883 ? this._activeEnterEffect : this._activeExitEffect;
        const _0x20804e = 1 - _0x289aa2;
        let _0x50e6d9 = effectSprite._eeBaseY;
        let _0x17437c = effectSprite._eeWorldX;
        let _0x2128bf = _0x289aa2;
        let _0x127ace = 1;
        switch (_0x453353) {
          case 0:
            break;
          case 1:
            _0x50e6d9 = effectSprite._eeBaseY + _0x5e9f2a * _0x20804e;
            break;
          case 2:
            _0x50e6d9 = effectSprite._eeBaseY - _0x5e9f2a * _0x20804e;
            break;
          case 3:
            _0x17437c = effectSprite._eeWorldX - _0x5e9f2a * _0x20804e;
            break;
          case 4:
            _0x17437c = effectSprite._eeWorldX + _0x5e9f2a * _0x20804e;
            break;
          case 5:
            if (!effectSprite._eeAudioScale) {
              _0x127ace = _0x289aa2;
            }
            break;
          case 6:
            if (!effectSprite._eeAudioScale) {
              _0x127ace = 1 + _0x20804e * 0.75;
            }
        }
        if (effectSprite.x !== _0x17437c) {
          effectSprite.x = _0x17437c;
        }
        if (effectSprite.y !== _0x50e6d9) {
          effectSprite.y = _0x50e6d9;
        }
        const _eeFinalAlpha = _0x2128bf * this._getGroupOpacityForSprite(effectSprite);
        if (effectSprite.alpha !== _eeFinalAlpha) {
          effectSprite.alpha = _eeFinalAlpha;
        }
        if (!effectSprite._eeAudioScale && effectSprite.scaleX !== _0x127ace) {
          effectSprite.setScale(_0x127ace);
        }
      }
    }
  }
  setGroundColor(_0x3958eb) {
    for (let _0x46c21a of this._groundTiles) {
      _0x46c21a.setTint(_0x3958eb);
    }
    for (let _0x251562 of this._ceilingTiles) {
      _0x251562.setTint(_0x3958eb);
    }
  }
  updateAudioScale(_0x337bf7) {
    for (let _0x24afdb of this._audioScaleSprites) {
      _0x24afdb.setScale(_0x337bf7);
    }
    const _now = Date.now();
    const _clickMult = window.orbClickScale || 2.0;
    const _shrinkMs = window.orbClickShrinkTime || 250;
    for (let _0xOrbSpr of this._orbSprites) {
      const _baseScale = 0.75 + _0x337bf7 * 0.15;
      if (_0xOrbSpr._hitTime) {
        const _elapsed = _now - _0xOrbSpr._hitTime;
        if (_elapsed < 80) {
          const _t = _elapsed / 80;
          _0xOrbSpr.setScale(_baseScale + (_baseScale * (_clickMult - 1)) * _t);
        } else if (_elapsed < 80 + _shrinkMs) {
          const _t = (_elapsed - 80) / _shrinkMs;
          const _peak = _baseScale * _clickMult;
          _0xOrbSpr.setScale(_peak + (_baseScale - _peak) * _t);
        } else {
          _0xOrbSpr._hitTime = null;
          _0xOrbSpr.setScale(_baseScale);
        }
      } else {
        _0xOrbSpr.setScale(_baseScale);
      }
    }
  }
  resetVisibility() {
    this._visMinSec = -1;
    this._visMaxSec = -1;
  }
  resetObjects() {
    for (let _0x3d473e of this.objects) {
      _0x3d473e.activated = false;
    }
    for (let _0x5c5d9a of this._audioScaleSprites) {
      _0x5c5d9a.setScale(0.1);
    }
    for (let _cs of this._coinSprites) {
      if (_cs) {
        _cs.setVisible(true);
        _cs.setAlpha(1);
        _cs.setScale(_cs._coinBaseScale || 1);
        if (_cs._coinWorldY !== undefined) {
          _cs.y = b(_cs._coinWorldY);
        }
      }
    }
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
      if (gameObj.type === "hazard") {
        if (window.noClip) {
          continue;
        }
      }
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
                else if (_padId === 67) { _padVel = 6.4 * _grav; _padFlip = true; }
              } else if (this.p.isBall) {
                if (_padId === 35) { _padVel = 9.6 * _grav; }
                else if (_padId === 140) { _padVel = 6.72 * _grav; }
                else if (_padId === 1332) { _padVel = 12 * _grav; }
                else if (_padId === 67) { _padVel = 3.84 * _grav; _padFlip = true; }
              } else {
                if (_padId === 35) { _padVel = 16 * _grav; }
                else if (_padId === 140) { _padVel = 10.4 * _grav; }
                else if (_padId === 1332) { _padVel = 20 * _grav; }
                else if (_padId === 67) { _padVel = 6.4 * _grav; _padFlip = true; }
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
          const _needsClick = this.p.isFlying || this.p.isUfo ? this.p.upKeyDown : (_isDash ? this.p.upKeyDown : (this.p.queuedHold && this.p.upKeyDown));
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
              } else {
                if (this.p.isFlying) {
                  if (_orbId === 36) { _orbVel = _cubeJump; }
                  else if (_orbId === 141) { _orbVel = _cubeJump * 0.37; }
                  else if (_orbId === 1333) { _orbVel = _cubeJump; }
                  else if (_orbId === 84) { _orbVel = _cubeJump * 0.7; _flipAfter = true; }
                  else if (_orbId === 1022) { _orbVel = _cubeJump * 0.8; _flipBefore = true; }
                  else if (_orbId === 1330) { _orbVel = -28; }
                } else if (this.p.isBall) {
                  const _ballBase = _cubeJump * 0.7;
                  if (_orbId === 36) { _orbVel = _ballBase; }
                  else if (_orbId === 141) { _orbVel = _ballBase * 0.77; }
                  else if (_orbId === 1333) { _orbVel = _ballBase * 1.34; }
                  else if (_orbId === 84) { _orbVel = _ballBase; _flipAfter = true; }
                  else if (_orbId === 1022) { _orbVel = _ballBase * 0.8; _flipBefore = true; }
                  else if (_orbId === 1330) { _orbVel = -30; }
                } else {
                  if (_orbId === 36) { _orbVel = _cubeJump; }
                  else if (_orbId === 141) { _orbVel = _cubeJump * 0.72; }
                  else if (_orbId === 1333) { _orbVel = _cubeJump * 1.38; }
                  else if (_orbId === 84) { _orbVel = _cubeJump; _flipAfter = true; }
                  else if (_orbId === 1022) { _orbVel = _cubeJump * 0.8; _flipBefore = true; }
                  else if (_orbId === 1330) { _orbVel = -30; }
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
          if (window.noClip) continue;
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
          } else if (this.p.gravityFlipped && iscube && this.p.yVelocity < -0.5 && !window.noClip) {
            this.killPlayer();
            return;
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
const fs = 1000;
const gs = 1001;
class vs {
  constructor(_0x268d66, _0x3664f8, _0x4b756c) {
    this.from = {
      ..._0x268d66
    };
    this.to = {
      ..._0x3664f8
    };
    this.duration = _0x4b756c;
    this.elapsed = 0;
    this.done = _0x4b756c <= 0;
    this.current = _0x4b756c <= 0 ? {
      ..._0x3664f8
    } : {
      ..._0x268d66
    };
  }
  step(_0x4559d6) {
    if (this.done) {
      return;
    }
    this.elapsed += _0x4559d6;
    let _0xe145bf = this.duration > 0 ? Math.min(this.elapsed / this.duration, 1) : 1;
    if (_0xe145bf >= 1) {
      this.current = {
        ...this.to
      };
      this.done = true;
    } else {
      this.current = {
        r: Math.round(this.from.r + (this.to.r - this.from.r) * _0xe145bf),
        g: Math.round(this.from.g + (this.to.g - this.from.g) * _0xe145bf),
        b: Math.round(this.from.b + (this.to.b - this.from.b) * _0xe145bf)
      };
    }
  }
}
class ms {
  constructor() {
    this._initialColors = {};
    this.reset();
  }
  setInitialColor(channelId, color) {
    this._initialColors[channelId] = { ...color };
    this._colors[channelId] = { ...color };
  }
  reset() {
    this._colors = {
      [fs]: {
        r: 0,
        g: 102,
        b: 255
      },
      [gs]: {
        r: 0,
        g: 68,
        b: 170
      }
    };
    for (let chId in this._initialColors) {
      this._colors[chId] = { ...this._initialColors[chId] };
    }
    this._actions = {};
  }
  triggerColor(_0x917b29, _0x2cdda0, _0x10a755) {
    let _0x16f9f0 = {
      ...this.getColor(_0x917b29)
    };
    this._actions[_0x917b29] = new vs(_0x16f9f0, _0x2cdda0, _0x10a755);
    if (_0x10a755 <= 0) {
      this._colors[_0x917b29] = {
        ..._0x2cdda0
      };
    }
  }
  step(_0x15fa55) {
    for (let _0x2d0367 in this._actions) {
      let _0x26a8a0 = this._actions[_0x2d0367];
      _0x26a8a0.step(_0x15fa55);
      this._colors[_0x2d0367] = {
        ..._0x26a8a0.current
      };
      if (_0x26a8a0.done) {
        delete this._actions[_0x2d0367];
      }
    }
  }
  getColor(_0xb3f1d9) {
    return this._colors[_0xb3f1d9] || {
      r: 255,
      g: 255,
      b: 255
    };
  }
  getHex(_0x32378c) {
    let _0x25f448 = this.getColor(_0x32378c);
    return _0x25f448.r << 16 | _0x25f448.g << 8 | _0x25f448.b;
  }
}
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
    if (this._music.key !== expectedSongKey) {
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
      if (!this._menuActive && !this._paused && !this._levelSelectOverlay) {
        this._pushButton();
      }
    });
    this.input.on("pointerup", () => {
      if (!this._menuActive && !this._paused && !this._levelSelectOverlay) {
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
    cardHit.on("pointerdown", () => {
      cardHit._pressed = true;
      this.tweens.killTweensOf(cardBounceContainer, "scale");
      this.tweens.add({ targets: cardBounceContainer, scale: 1.26, duration: 300, ease: "Bounce.Out" });
    });
    cardHit.on("pointerout", () => {
      if (cardHit._pressed) {
        cardHit._pressed = false;
        this.tweens.killTweensOf(cardBounceContainer, "scale");
        this.tweens.add({ targets: cardBounceContainer, scale: 1, duration: 400, ease: "Bounce.Out" });
      }
    });
    cardHit.on("pointerup", () => {
      if (cardHit._pressed) {
        cardHit._pressed = false;
        this.tweens.killTweensOf(cardBounceContainer, "scale");
        cardBounceContainer.setScale(1);
        this._audio.playEffect("playSound_01", { volume: 1 });
        this._closeLevelSelect(true);
        this._audio.stopMusic();
        this.game.registry.set("autoStartGame", true);
        this.scene.restart();
      }
    });
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
    const switchLevel = (dir) => {
      if (!window.allLevels || window.allLevels.length === 0) return;

      if (_currentAnimUpdate) {
        this.events.off("preupdate", _currentAnimUpdate);
        _currentAnimUpdate = null;
        cardContainer.x = 0;
      }
      let idx = window.allLevels.findIndex(l => l[2] === window.currentlevel[2]);
      idx = (idx + dir + window.allLevels.length) % window.allLevels.length;
      window.currentlevel = [...window.allLevels[idx]];
      const newColors = this._parseLevelColors(window.currentlevel[2]);
      const dark = isEveryEnd(window.currentlevel[2]);
      const slideDist = cardW-200;
      const slideOutTarget = -dir * slideDist;
      const slideInStart = dir * slideDist;
      this.tweens.killTweensOf(cardContainer);
      let state = "out";
      let currentX = cardContainer.x;
      let vel = 0;
      const scrollAnimUpdate = (time,delta) => {
        const dt = Math.min(delta / 1000, 0.05);
        if (state === "out") {
          const speed = slideDist * 14; 
          currentX += (-dir) * speed * dt; 
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
            vel = (-dir) * slideDist * 6;
          }
        } else if (state === "in") {
          const tension = 300;
          const friction = 15;
          
          const force = -tension * (currentX - 0) - friction * vel;
          vel += force * dt;
          currentX += vel * dt;

          if (Math.abs(currentX) < 1 && Math.abs(vel) < 15) {
            currentX = 0;
            this.events.off("preupdate", scrollAnimUpdate);
            if (_currentAnimUpdate === scrollAnimUpdate) {
              _currentAnimUpdate = null;
            }
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
        solidWaveTrail: window.solidWave
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
        solidWaveTrail: false
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
    const _0x3cdf70b = this.add.bitmapText(xPos, yPos, "goldFont", "AntiMatter, breadbb, bog, aloaf", 40).setOrigin(0.5, 0.5).setScale(0.6);
    this._infoPopup.add(_0x3cdf70b);
    yPos += 35;
    const _0x3cdf70c = this.add.bitmapText(xPos, yPos, "goldFont", "PinkDev, rohanis0000, arbstro", 40).setOrigin(0.5, 0.5).setScale(0.6);
    this._infoPopup.add(_0x3cdf70c);
    yPos += 35;
    const _0x3cdf70d = this.add.bitmapText(xPos, yPos, "goldFont", "Lasokar", 40).setOrigin(0.5, 0.5).setScale(0.6);
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
      { text: "Online levels - BETA", scale: 0.65 },
      { text: "Practice Mode - BETA", scale: 0.65 },
      { text: "THESE 2 CAN BE VERY BUGGY.", scale: 0.65, color: 0xff6666 },
      { text: "UI tweaks.", scale: 0.65 },
      { text: "Correct Wave hitboxes.", scale: 0.65 },
      { text: "Move triggers now move orbs and etc.", scale: 0.6 },
      // { text: "Added slopes. - PinkDev", scale: 0.65, color: 0xff00ff }, (soon)
      { text: "Bug fixes.", scale: 0.65 },
      // message of the update day (from me :P)
      { text: "NEXT UPDATE FINNA BE MASSIVE :o", scale: 0.6, color: 0xaaddff },
      { text: "- rohanis0000", scale: 0.6, color: 0xaaddff },
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
function _s(_0xae9c8f, _0xe5190e, _0x399b97, _0x3f3165, _0x1f56bc, _0x560f20, _0xb730d4 = false, _0x550b4a = false, _0x4ee8d6 = 16777215) {
  const _0x18a510 = _0xae9c8f.add.graphics().setScrollFactor(0).setDepth(55).setBlendMode(S);
  const _0x3dff3a = {
    r: _0x3f3165,
    t: 0
  };
  _0xae9c8f.tweens.add({
    targets: _0x3dff3a,
    r: _0x1f56bc,
    t: 1,
    duration: _0x560f20,
    ease: _0xb730d4 && !_0x550b4a ? "Quad.Out" : "Linear",
    onUpdate: () => {
      const _0x25e581 = _0x3dff3a.t;
      const _0x344671 = _0x550b4a ? _0x25e581 < 0.5 ? _0x25e581 * 2 : (1 - _0x25e581) * 2 : 1 - _0x25e581;
      _0x18a510.clear();
      if (_0xb730d4) {
        _0x18a510.fillStyle(_0x4ee8d6, Math.max(0, _0x344671));
        _0x18a510.fillCircle(_0xe5190e, _0x399b97, _0x3dff3a.r);
      } else {
        _0x18a510.lineStyle(4, _0x4ee8d6, Math.max(0, _0x344671));
        _0x18a510.strokeCircle(_0xe5190e, _0x399b97, _0x3dff3a.r);
      }
    },
    onComplete: () => _0x18a510.destroy()
  });
}
function ws(_0x13c75c, _0x23c5aa = 16777215, _0x52bb5b = 16777215) {
  const _0x2076d4 = 200;
  const _0x4eb200 = _0x2076d4 + (screenWidth - 400) * Math.random();
  const _0x126811 = _0x2076d4 + Math.random() * 240;
  _s(_0x13c75c, _0x4eb200, _0x126811, 40, 140 + Math.random() * 60, 500, true, true, _0x52bb5b);
  _0x13c75c.add.particles(_0x4eb200, _0x126811, "GJ_WebSheet", {
    frame: "square.png",
    speed: {
      min: 520,
      max: 920
    },
    angle: {
      min: 0,
      max: 360
    },
    scale: {
      start: 0.4,
      end: 0.13
    },
    alpha: {
      start: 1,
      end: 0
    },
    lifespan: {
      min: 0,
      max: 500
    },
    stopAfter: 25,
    blendMode: S,
    tint: _0x23c5aa,
    x: {
      min: -20,
      max: 20
    },
    y: {
      min: -20,
      max: 20
    }
  }).setScrollFactor(0).setDepth(57);
}
function checkForAutoLoad() {
  const assetsLoaded = localStorage.getItem('webdash_assets_loaded') === 'true';
  const lastLoadTime = parseInt(localStorage.getItem('webdash_last_load_time') || '0');
  const now = Date.now();
  const hoursSinceLoad = (now - lastLoadTime) / (1000 * 60 * 60);
  if (assetsLoaded && hoursSinceLoad < 24 && window.gameCache.isCacheValid()) {
    const stats = window.gameCache.getCacheStats();
    if (stats.validEntries > 50) {
      console.log('auto loading from cache');
      return true;
    }
  }
  return false;
}
if (window.gameCache) {
  window.gameCache.init();
  const canAutoLoad = checkForAutoLoad();
  if (canAutoLoad) {
    const autoLoadIndicator = document.createElement('div');
    autoLoadIndicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #00ff00;
      color: #000;
      padding: 5px 10px;
      border-radius: 5px;
      font-family: Arial;
      font-size: 12px;
      z-index: 9999;
    `;
    autoLoadIndicator.textContent = 'turbo loading';
    document.body.appendChild(autoLoadIndicator);
    setTimeout(() => {
      if (autoLoadIndicator.parentNode) {
        autoLoadIndicator.parentNode.removeChild(autoLoadIndicator);
      }
    }, 3000);
  }
}
const Ss = {
  type: Phaser.AUTO,
  width: screenWidth,
  height: screenHeight,
  resolution: 1,
  fps: {
    smoothStep: true
  },
  backgroundColor: "#000000",
  parent: document.body,
  input: {
    windowEvents: false
  },
  render: {
    powerPreference: "high-performance"
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [A, xs]
};
new Phaser.Game(Ss);

window.clearGameCache = () => {
  if (window.gameCache) {
    window.gameCache.clearCache();
    localStorage.removeItem('webdash_assets_loaded');
    localStorage.removeItem('webdash_last_load_time');
    console.log('Game cache cleared');
    location.reload();
  }
};

window.getCacheInfo = () => {
  if (window.gameCache) {
    return window.gameCache.getCacheStats();
  }
  return null;
};
