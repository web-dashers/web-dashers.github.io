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
const storedUseDirectInternet = localStorage.getItem("gd_useDirectInternet");
window.useDirectInternet = storedUseDirectInternet === null ? true : storedUseDirectInternet === "true";
window.getGdApiBase = function () {
  if (window.useDirectInternet) return "https://www.boomlings.com/database";
  return (window._gdProxyUrl || "").replace(/\/$/, "");
};
window.getGdApiUrl = function (path) {
  const base = window.getGdApiBase();
  if (!base) return null;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
};
window.fetchGdApi = async function (path, options = {}) {
  const directUrl = window.useDirectInternet ? window.getGdApiUrl(path) : null;
  const proxyBase = (window._gdProxyUrl || "").replace(/\/$/, "");
  const proxyUrl = proxyBase ? `${proxyBase}${path.startsWith("/") ? "" : "/"}${path}` : null;
  const urls = [];
  if (directUrl) urls.push(directUrl);
  if (proxyUrl && proxyUrl !== directUrl) urls.push(proxyUrl);
  let lastError = null;
  for (const url of urls) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("No GD API endpoint available");
};
window.getGdAudioUrl = function (songUrl) {
  if (window.useDirectInternet) return songUrl;
  const proxyBase = (window._gdProxyUrl || "").replace(/\/$/, "");
  return proxyBase ? `${proxyBase}/audio-proxy?url=${encodeURIComponent(songUrl)}` : songUrl;
};
window.fetchGdAudio = async function (songUrl, options = {}) {
  const directUrl = window.useDirectInternet ? songUrl : null;
  const proxyBase = (window._gdProxyUrl || "").replace(/\/$/, "");
  const proxyUrl = proxyBase ? `${proxyBase}/audio-proxy?url=${encodeURIComponent(songUrl)}` : null;
  const urls = [];
  if (directUrl) urls.push(directUrl);
  if (proxyUrl && proxyUrl !== directUrl) urls.push(proxyUrl);
  let lastError = null;
  for (const url of urls) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("No audio endpoint available");
};
window.currentlevel = [
	"stereo_madness", // internal level name
	"Stereo Madness", // proper level name
	"level_1",        // level id in assets/levels
	["RobTop", "Forever Bound"]   // person who made the song
];
window.iconPreloadAll = false;
window.orbClickScale = 2.0;
window.orbClickShrinkTime = 250;
window.orbParticleSize = 3.5;

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('id')) {
  window.levelID = urlParams.get('id');
}

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
function l(newWidth) {
  screenWidth = newWidth;
  centerX = screenWidth / 2 - 150;
}
function getDynamicScreenWidth() {
  const w = window.innerWidth || 1138;
  const h = window.innerHeight || 640;
  return Math.round(Math.min(1494, Math.max(1024, screenHeight * (w / h))));
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

const fs = 1000;
const gs = 1001;


window.ICON_COUNTS = { icon: 485, ship: 169, ball: 119, wave: 96, ufo: 149, robot: 68, spider: 69 };

const ICON_BASE_RE = /^((?:player_ball|player|ship|dart|bird|spider|robot)_\d{2,3})(?:_.*)?_001\.png$/;
window._iconAtlasFailed  = window._iconAtlasFailed  || new Set();
window._iconAtlasPending = window._iconAtlasPending || new Set();

function iconBaseOf(frameName) {
  const m = ICON_BASE_RE.exec(String(frameName || ""));
  return m ? m[1] : null;
}
function iconAtlasKey(frameName) {
  const b = iconBaseOf(frameName);
  return b ? "icon_" + b : null;
}
function iconAtlasPath(base) {
  return "assets/icons/" + base + "-hd";
}
function getEquippedIconBases() {
  const robot = window.currentRobot || localStorage.getItem("iconCurrentRobot") || "robot_01";
  const list = [window.currentPlayer, window.currentShip, window.currentBall,
                window.currentWave, window.currentBird, window.currentSpider, robot];
  const out = [];
  for (const v of list) {
    const b = iconBaseOf(String(v || "") + "_001.png");
    if (b && !out.includes(b)) out.push(b);
  }
  return out;
}
function _plistNode(el) {
  switch (el.tagName) {
    case "dict": {
      const o = {};
      const kids = Array.from(el.children);
      for (let i = 0; i + 1 < kids.length; i += 2) o[kids[i].textContent] = _plistNode(kids[i + 1]);
      return o;
    }
    case "array":   return Array.from(el.children).map(_plistNode);
    case "integer": return parseInt(el.textContent, 10);
    case "real":    return parseFloat(el.textContent);
    case "true":    return true;
    case "false":   return false;
    default:        return el.textContent;
  }
}
function _plistNums(s) {
  return (String(s).match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
}
function _plistFrames(plist) {
  const fmt = (plist.metadata && plist.metadata.format) || 3;
  const out = [];
  for (const name of Object.keys(plist.frames || {})) {
    const d = plist.frames[name];
    let x, y, w, h, rotated, ox, oy, srcW, srcH;
    if (fmt >= 3) {
      [x, y] = _plistNums(d.textureRect);
      [w, h] = _plistNums(d.spriteSize);
      rotated = !!d.textureRotated;
      [ox, oy] = _plistNums(d.spriteOffset);
      [srcW, srcH] = _plistNums(d.spriteSourceSize);
    } else {
      [x, y, w, h] = _plistNums(d.frame);
      rotated = !!d.rotated;
      [ox, oy] = _plistNums(d.offset);
      [srcW, srcH] = _plistNums(d.sourceSize);
    }
    out.push({
      name, x, y, w, h, rotated, srcW, srcH,
      sx: Math.round((srcW - w) / 2 + ox),
      sy: Math.round((srcH - h) / 2 - oy),
    });
  }
  return out;
}
function _packIconFrames(frames, minW) {
  const pad = 2;
  const maxW = Math.max(minW || 0, ...frames.map(f => f.w + pad * 2));
  frames.sort((a, b) => b.h - a.h || (a.name < b.name ? -1 : 1));
  let x = pad, y = pad, rowH = 0;
  for (const f of frames) {
    if (x + f.w + pad > maxW) { x = pad; y += rowH + pad; rowH = 0; }
    f.dx = x; f.dy = y;
    x += f.w + pad;
    rowH = Math.max(rowH, f.h);
  }
  return { w: maxW, h: y + rowH + pad };
}
function _buildIconAtlasFromPlist(scene, base) {
  const xml = scene.cache.xml.get("iconplist_" + base);
  const img = scene.textures.get("iconimg_" + base).getSourceImage();
  const plist = _plistNode(xml.documentElement.firstElementChild);
  const frames = _plistFrames(plist);
  if (!frames.length) throw new Error("no frames in plist");
  const size = _packIconFrames(frames, img.width);
  const canvas = document.createElement("canvas");
  canvas.width = size.w; canvas.height = size.h;
  const ctx = canvas.getContext("2d");
  for (const f of frames) {
    if (f.rotated) {
      ctx.save();
      ctx.translate(f.dx, f.dy + f.h);
      ctx.rotate(-Math.PI / 2);
      ctx.drawImage(img, f.x, f.y, f.h, f.w, 0, 0, f.h, f.w);
      ctx.restore();
    } else {
      ctx.drawImage(img, f.x, f.y, f.w, f.h, f.dx, f.dy, f.w, f.h);
    }
  }
  const tex = scene.textures.addCanvas("icon_" + base, canvas);
  if (!tex) throw new Error("texture key already exists");
  for (const f of frames) {
    const fr = tex.add(f.name, 0, f.dx, f.dy, f.w, f.h);
    if (fr && (f.w !== f.srcW || f.h !== f.srcH || f.sx || f.sy)) {
      fr.setTrim(f.srcW, f.srcH, f.sx, f.sy, f.w, f.h);
    }
  }
}
function _cleanupIconTemps(scene, base) {
  const pk = "iconplist_" + base, ik = "iconimg_" + base;
  if (scene.cache.xml.exists(pk)) scene.cache.xml.remove(pk);
  if (scene.textures.exists(ik)) scene.textures.remove(ik);
}
function _tryBuildIconAtlas(scene, base) {
  if (scene.textures.exists("icon_" + base)) return;
  if (window._iconAtlasFailed.has(base)) { _cleanupIconTemps(scene, base); return; }
  if (!scene.cache.xml.exists("iconplist_" + base) || !scene.textures.exists("iconimg_" + base)) return;
  try {
    _buildIconAtlasFromPlist(scene, base);
  } catch (e) {
    console.warn("icon atlas failed:", base, e);
    window._iconAtlasFailed.add(base);
  }
  window._iconAtlasPending.delete(base);
  _cleanupIconTemps(scene, base);
}
function _ensureIconLoaderHooks(scene) {
  const loader = scene.load;
  if (loader._iconHooks) return;
  loader._iconHooks = true;
  loader.on("loaderror", (file) => {
    const m = /^icon(?:plist|img)_(.+)$/.exec(file && file.key);
    if (!m) return;
    window._iconAtlasFailed.add(m[1]);
    window._iconAtlasPending.delete(m[1]);
    _cleanupIconTemps(scene, m[1]);
  });
  loader.on("filecomplete", (key) => {
    const m = /^icon(?:plist|img)_(.+)$/.exec(key);
    if (m) _tryBuildIconAtlas(scene, m[1]);
  });
}
function getAllIconBases() {
  const c = Object.assign({ icon: 485, ship: 169, ball: 119, wave: 96, ufo: 149, robot: 68, spider: 69 }, window.ICON_COUNTS || {});
  const prefixes = { icon: "player", ship: "ship", ball: "player_ball", wave: "dart", ufo: "bird", robot: "robot", spider: "spider" };
  const seen = new Set(getEquippedIconBases());
  const out = Array.from(seen);
  for (const k of Object.keys(prefixes)) {
    for (let i = 1; i <= (c[k] || 0); i++) {
      const b = prefixes[k] + "_" + String(i).padStart(2, "0");
      if (!seen.has(b)) { seen.add(b); out.push(b); }
    }
  }
  return out;
}
function queueIconAtlases(scene, bases) {
  _ensureIconLoaderHooks(scene);
  for (const base of bases) {
    const key = "icon_" + base;
    if (scene.textures.exists(key) || window._iconAtlasFailed.has(base) || window._iconAtlasPending.has(base)) continue;
    window._iconAtlasPending.add(base);
    scene.load.xml("iconplist_" + base, iconAtlasPath(base) + ".plist");
    scene.load.image("iconimg_" + base, iconAtlasPath(base) + ".png");
  }
}
function loadIconAtlases(scene, bases, onDone) {
  const need = bases.filter(b => !scene.textures.exists("icon_" + b) && !window._iconAtlasFailed.has(b));
  const loader = scene.load;
  loader.maxParallelDownloads = Math.max(loader.maxParallelDownloads || 0, 64);
  const onFileError = (file) => {
    const m = /^icon(?:plist|img)_(.+)$/.exec(file && file.key);
    if (m) { window._iconAtlasFailed.add(m[1]); window._iconAtlasPending.delete(m[1]); }
  };
  loader.on("loaderror", onFileError);
  const finish = () => {
    loader.off("loaderror", onFileError);
    for (const b of need) {
      if (!scene.textures.exists("icon_" + b)) window._iconAtlasFailed.add(b);
      window._iconAtlasPending.delete(b);
      _cleanupIconTemps(scene, b);
    }
    if (onDone) onDone();
  };
  queueIconAtlases(scene, need);
  const waiting = need.some(b => !scene.textures.exists("icon_" + b) && window._iconAtlasPending.has(b));
  if (!waiting) { finish(); return; }
  loader.once("complete", finish);
  if (!loader.isLoading()) loader.start();
}
function iconAtlasReady(scene, base) {
  return scene.textures.exists("icon_" + base);
}

const atlasList = [
  "GJ_WebSheet",
  "GJ_GameSheet",
  "GJ_GameSheet02",
  "GJ_GameSheet03",
  "GJ_GameSheet04",
  "GJ_GameSheetEditor",
  "GJ_GameSheetGlow",
  "GJ_GameSheetIcons",
  "GJ_LaunchSheet",
  "player_ball_00",
  "player_dart_00",
  "GJ_ParticleSheet-uhd",
  "GJ_ParticleSheet",
  "PixelSheet_01-hd",
  "FireSheet_01-hd",
  "Wavesheet",
];
function getAtlasFrame(scene, frameName) {
  const _iconKey = iconAtlasKey(frameName);
  if (_iconKey && scene.textures.exists(_iconKey)) {
    return scene.textures.get(_iconKey).has(frameName) ? { atlas: _iconKey, frame: frameName } : null;
  }
  if (frameName.startsWith("player_")) {
    const playerAtlasPriority = ["GJ_GameSheet03", "GJ_GameSheet", "GJ_GameSheet02", "GJ_GameSheet04", "GJ_GameSheetEditor", "GJ_GameSheetGlow", "GJ_GameSheetIcons", "GJ_WebSheet", "GJ_LaunchSheet", "player_ball_00", "player_dart_00"];
    for (let atlasName of playerAtlasPriority) {
      if (scene.textures.exists(atlasName)) {
        if (scene.textures.get(atlasName).has(frameName)) {
          return {
            atlas: atlasName,
            frame: frameName
          };
        }
      }
    }
  }
  for (let atlasName of atlasList) {
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
function addImageToScene(scene, x, y, textureName) {
  let textureInfo = getAtlasFrame(scene, textureName);
  if (textureInfo) {
    return scene.add.image(x, y, textureInfo.atlas, textureInfo.frame);
  } else if (scene.textures.exists(textureName)) {
    return scene.add.image(x, y, textureName);
  } else {
    return null;
  }
}

const CUSTOM_CUBE_KEY      = "custom_cube_icon";
const CUSTOM_CUBE_HD_KEY   = "custom_cube_icon_hd";
const CUSTOM_CUBE_GAME_PX  = 60;

window.customCubeIconSrc = localStorage.getItem("customCubeIconSrc") || null;

function _customCubeToCanvas(img, size) {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  const side = Math.min(w, h);
  let cur = document.createElement("canvas");
  cur.width = cur.height = side;
  let ctx = cur.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, (w - side) / 2, (h - side) / 2, side, side, 0, 0, side, side);
  while (cur.width / 2 >= size) {
    const next = document.createElement("canvas");
    next.width = next.height = Math.floor(cur.width / 2);
    const nctx = next.getContext("2d");
    nctx.imageSmoothingEnabled = true;
    nctx.imageSmoothingQuality = "high";
    nctx.drawImage(cur, 0, 0, next.width, next.height);
    cur = next;
  }
  const out = document.createElement("canvas");
  out.width = out.height = size;
  const octx = out.getContext("2d");
  octx.imageSmoothingEnabled = true;
  octx.imageSmoothingQuality = "high";
  octx.drawImage(cur, 0, 0, size, size);
  return out;
}

window.setCustomCubeIcon = function(src) {
  return new Promise((resolve, reject) => {
    if (!src) { return reject(new Error("No source provided")); }
    const scene = window._gameScene;
    if (!scene) { return reject(new Error("No game scene")); }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        if (scene.textures.exists(CUSTOM_CUBE_KEY))    scene.textures.remove(CUSTOM_CUBE_KEY);
        if (scene.textures.exists(CUSTOM_CUBE_HD_KEY)) scene.textures.remove(CUSTOM_CUBE_HD_KEY);
        scene.textures.addImage(CUSTOM_CUBE_HD_KEY, img);
        scene.textures.addCanvas(CUSTOM_CUBE_KEY, _customCubeToCanvas(img, CUSTOM_CUBE_GAME_PX));
      } catch (err) {
        return reject(err);
      }
      window.customCubeIconSrc = src;
      try { localStorage.setItem("customCubeIconSrc", src); } catch (e) {}
      _applyCustomCubeIcon(scene);
      resolve();
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
};

window.clearCustomCubeIcon = function() {
  window.customCubeIconSrc = null;
  localStorage.removeItem("customCubeIconSrc");
  const scene = window._gameScene;
  if (scene) {
    _removeCustomCubeIcon(scene);
  }
};

function _applyCustomCubeIcon(scene) {
  const player = scene._player;
  if (!player || !scene.textures.exists(CUSTOM_CUBE_KEY)) return;
  const sprite = player._playerSpriteLayer && player._playerSpriteLayer.sprite;
  if (!sprite || !sprite.setTexture) return;
  sprite.setTexture(CUSTOM_CUBE_KEY);
  sprite.setTint(0xffffff);
  sprite._customCubeIcon = true;
  sprite._defaultMiniIconFrame = null;
  for (const l of [player._playerGlowLayer, player._playerOverlayLayer, player._playerExtraLayer]) {
    if (l && l.sprite) l.sprite.setVisible(false);
  }
}

function _removeCustomCubeIcon(scene) {
  const player = scene._player;
  const sprite = player && player._playerSpriteLayer && player._playerSpriteLayer.sprite;
  if (!sprite || !sprite._customCubeIcon) return;
  const cubeVisible = sprite.visible;
  const found = getAtlasFrame(scene, `${window.currentPlayer}_001.png`);
  if (found) {
    sprite.setTexture(found.atlas, found.frame);
    sprite.setTint(window.mainColor);
  }
  sprite._customCubeIcon = false;
  sprite._defaultMiniIconFrame = null;
  if (player._playerOverlayLayer && player._playerOverlayLayer.sprite) {
    player._playerOverlayLayer.sprite.setTint(window.secondaryColor);
  }
  if (typeof player.setCubeVisible === "function") player.setCubeVisible(cubeVisible);
}
