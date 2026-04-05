// editable config stuff

if (window.mainColor == null) {
  window.mainColor = parseInt("fb2651", 16);
}
if (window.secondaryColor == null) {
  window.secondaryColor = parseInt("ffffff", 16);
}
window.currentPlayer = "player_01";
window.currentShip = "ship_44";
window.currentBall = "player_ball_23"
window.currentWave = "dart_01"
window.currentlevel = [
	"stereo_madness", // internal level name
	"Stereo Madness", // proper level name
	"level_1",        // level id in assets/levels
	"Forever Bound"   // person who made the song
];
window.showHitboxes = false;
window.noClip = false; // experimental

// -------------------------------

function t(_0x5ebeba) {
  if (_0x5ebeba && _0x5ebeba.__esModule && Object.prototype.hasOwnProperty.call(_0x5ebeba, "default")) {
    return _0x5ebeba.default;
  } else {
    return _0x5ebeba;
  }
}
var e;
var i = { exports: {} };

const s = t(e ? i.exports : (e = 1, i.exports = (() => {
  return window.Phaser;
})()));

let r = Math.round(10240 / 9);
const n = 640;
const a = 60;
const o = 180;
let h = r / 2 - 150;
function l(_0x2b5712) {
  r = _0x2b5712;
  h = _0x2b5712 / 2 - 150;
}
const u = 1 / 240;
const c = 11.540004;
const d = 0.9;
const p = 1.916398;
const f = 600;
const g = a;
const jumpPadType = "jump_pad";
const jumpRingType = "jump_ring";
const T = 460;
function b(_0x3ed2c6) {
  return T - _0x3ed2c6;
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
    (function (_0x3b96aa) {
      if (_0x3b96aa.renderer.type === Phaser.WEBGL) {
        let _0x47cabb = _0x3b96aa.renderer.gl;
        S = _0x3b96aa.renderer.addBlendMode([_0x47cabb.SRC_ALPHA, _0x47cabb.ONE], _0x47cabb.FUNC_ADD);
        E = _0x3b96aa.renderer.addBlendMode([_0x47cabb.DST_COLOR, _0x47cabb.ONE_MINUS_SRC_ALPHA], _0x47cabb.FUNC_ADD);
      }
    })(this.game);
    let _0x236029 = this.cameras.main.width;
    let _0x2a5a43 = this.cameras.main.height;
    let _0xa68e08 = _0x236029 * 0.6;
    let _0x1840c0 = this.add.rectangle(_0x236029 / 2, _0x2a5a43 / 2, _0xa68e08, 8, 65280).setOrigin(0.5, 0.5);
    _0x1840c0.scaleX = 0;
    this.load.on("progress", _0x374839 => {
      _0x1840c0.scaleX = _0x374839;
    });
    this.load.on("loaderror", _0x550fba => {});
    this.load.atlas("GJ_WebSheet", "assets/sheets/GJ_WebSheet.png", "assets/sheets/GJ_WebSheet.json");
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

    this.load.text("level_1", "assets/levels/1.txt");
    this.load.audio("stereo_madness", "assets/music/StereoMadness.mp3");

    this.load.text("level_2", "assets/levels/2.txt");
    this.load.audio("back_on_track", "assets/music/BackOnTrack.mp3");

    this.load.text("level_3", "assets/levels/3.txt");
    this.load.audio("polargeist", "assets/music/Polargeist.mp3");

    this.load.text("level_4", "assets/levels/4.txt");
    this.load.audio("dry_out", "assets/music/DryOut.mp3");

    this.load.text("level_5", "assets/levels/5.txt");
    this.load.audio("base_after_base", "assets/music/BaseAfterBase.mp3");

    this.load.text("level_6", "assets/levels/6.txt");
    this.load.audio("cant_let_go", "assets/music/CantLetGo.mp3");

    this.load.text("level_7", "assets/levels/7.txt");
    this.load.audio("jumper", "assets/music/Jumper.mp3");

    this.load.text("level_8", "assets/levels/8.txt");
    this.load.audio("time_machine", "assets/music/TimeMachine.mp3");

    this.load.text("level_9", "assets/levels/9.txt");
    this.load.audio("cycles", "assets/music/Cycles.mp3");

    this.load.text("level_10", "assets/levels/10.txt");
    this.load.audio("xstep", "assets/music/xStep.mp3");

    this.load.text("level_11", "assets/levels/11.txt");
    this.load.audio("clutterfunk", "assets/music/Clutterfunk.mp3");

    this.load.text("level_12", "assets/levels/12.txt");
    this.load.audio("theory_of_everything", "assets/music/TheoryOfEverything.mp3");

    this.load.text("level_13", "assets/levels/13.txt");
    this.load.audio("electroman_adventures", "assets/music/ElectromanAdventures.mp3");

    this.load.text("level_14", "assets/levels/14.txt");
    this.load.audio("clubstep", "assets/music/Clubstep.mp3");

    this.load.text("level_15", "assets/levels/15.txt");
    this.load.audio("electrodynamix", "assets/music/Electrodynamix.mp3");

    this.load.text("level_16", "assets/levels/16.txt");
    this.load.audio("hexagon_force", "assets/music/HexagonForce.mp3");

    this.load.text("level_17", "assets/levels/17.txt");
    this.load.audio("blast_processing", "assets/music/BlastProcessing.mp3");

    this.load.text("level_18", "assets/levels/18.txt");
    this.load.audio("theory_of_everything_2", "assets/music/TheoryOfEverything2.mp3");

    this.load.text("level_19", "assets/levels/19.txt");
    this.load.audio("geometrical_dominator", "assets/music/GeometricalDominator.mp3");

    this.load.text("level_20", "assets/levels/20.txt");
    this.load.audio("deadlocked", "assets/music/Deadlocked.mp3");

    this.load.text("level_21", "assets/levels/21.txt");
    this.load.audio("fingerdash", "assets/music/Fingerdash.mp3");

    this.load.text("level_22", "assets/levels/22.txt");
    this.load.audio("dash", "assets/music/Dash.mp3");

    this.load.text("level_99", "assets/levels/99.txt");
    this.load.audio("every_end", "assets/music/EveryEnd.mp3");

    this.load.text("level_100", "assets/levels/100.txt");
    this.load.audio("bloodbath", "assets/music/Bloodbath.mp3");

    this.load.text("level_137409445", "assets/levels/137409445.txt");
    this.load.audio("three_step", "assets/music/ThreeStep.mp3");

    this.load.text("level_5703070", "assets/levels/5703070.txt");
    this.load.audio("the_nightmare", "assets/music/Polargeist.mp3");

    this.load.audio("explode_11", "assets/sfx/explode_11.ogg");
    this.load.audio("endStart_02", "assets/sfx/endStart_02.ogg");
    this.load.audio("playSound_01", "assets/sfx/playSound_01.ogg");
    this.load.audio("quitSound_01", "assets/sfx/quitSound_01.ogg");
    this.load.audio("highscoreGet02", "assets/sfx/highscoreGet02.ogg");
  }
  create() {
    this.cache.text.get(window.currentlevel[2]);
    const _0x1362a5 = this.cache.text.get("bigFontFnt");
    if (_0x1362a5) {
      C(this, "bigFont", _0x1362a5);
    }
    const _0x9a7483 = this.cache.text.get("goldFontFnt");
    if (_0x9a7483) {
      C(this, "goldFont", _0x9a7483);
    }
    this.scene.start("GameScene");
  }
}
function C(_0x4e6e71, _0x5059cd, _0x3a0583) {
  const _0x4adbf2 = _0x4e6e71.textures.get(_0x5059cd);
  const _0x39d5fe = _0x4adbf2.source[0];
  const _0x177755 = _0x39d5fe.width;
  const _0x69dcd6 = _0x39d5fe.height;
  const _0x4bb3ff = {
    font: _0x5059cd,
    size: 0,
    lineHeight: 0,
    chars: {}
  };
  const _0x42b370 = [];
  for (const _0x4e81a8 of _0x3a0583.split("\n")) {
    const _0x4234e6 = _0x4e81a8.trim().split(/\s+/);
    if (!_0x4234e6.length) {
      continue;
    }
    const _0x485488 = _0x4234e6[0];
    const _0x2e29f1 = {};
    for (let _0x47b3a1 = 1; _0x47b3a1 < _0x4234e6.length; _0x47b3a1++) {
      const _0x4f1697 = _0x4234e6[_0x47b3a1].indexOf("=");
      if (_0x4f1697 >= 0) {
        _0x2e29f1[_0x4234e6[_0x47b3a1].slice(0, _0x4f1697)] = _0x4234e6[_0x47b3a1].slice(_0x4f1697 + 1).replace(/^"|"$/g, "");
      }
    }
    if (_0x485488 === "info") {
      _0x4bb3ff.size = parseInt(_0x2e29f1.size, 10);
    } else if (_0x485488 === "common") {
      _0x4bb3ff.lineHeight = parseInt(_0x2e29f1.lineHeight, 10);
    } else if (_0x485488 === "char") {
      const _0x1e73d6 = parseInt(_0x2e29f1.id, 10);
      const _0xa9d8ad = parseInt(_0x2e29f1.x, 10);
      const _0x38c0bc = parseInt(_0x2e29f1.y, 10);
      const _0x33bab4 = parseInt(_0x2e29f1.width, 10);
      const _0x5ab709 = parseInt(_0x2e29f1.height, 10);
      const _0xd0e50c = _0xa9d8ad / _0x177755;
      const _0x581858 = _0x38c0bc / _0x69dcd6;
      const _0x40168d = (_0xa9d8ad + _0x33bab4) / _0x177755;
      const _0x467b92 = (_0x38c0bc + _0x5ab709) / _0x69dcd6;
      _0x4bb3ff.chars[_0x1e73d6] = {
        x: _0xa9d8ad,
        y: _0x38c0bc,
        width: _0x33bab4,
        height: _0x5ab709,
        centerX: Math.floor(_0x33bab4 / 2),
        centerY: Math.floor(_0x5ab709 / 2),
        xOffset: parseInt(_0x2e29f1.xoffset, 10),
        yOffset: parseInt(_0x2e29f1.yoffset, 10),
        xAdvance: parseInt(_0x2e29f1.xadvance, 10),
        data: {},
        kerning: {},
        u0: _0xd0e50c,
        v0: _0x581858,
        u1: _0x40168d,
        v1: _0x467b92
      };
      if (_0x33bab4 !== 0 && _0x5ab709 !== 0) {
        const _0x30b963 = String.fromCharCode(_0x1e73d6);
        const _0xe070ca = _0x4adbf2.add(_0x30b963, 0, _0xa9d8ad, _0x38c0bc, _0x33bab4, _0x5ab709);
        if (_0xe070ca) {
          _0xe070ca.setUVs(_0x33bab4, _0x5ab709, _0xd0e50c, _0x581858, _0x40168d, _0x467b92);
        }
      }
    } else if (_0x485488 === "kerning") {
      _0x42b370.push({
        first: parseInt(_0x2e29f1.first, 10),
        second: parseInt(_0x2e29f1.second, 10),
        amount: parseInt(_0x2e29f1.amount, 10)
      });
    }
  }
  for (const _0x48e531 of _0x42b370) {
    if (_0x4bb3ff.chars[_0x48e531.second]) {
      _0x4bb3ff.chars[_0x48e531.second].kerning[_0x48e531.first] = _0x48e531.amount;
    }
  }
  _0x4e6e71.cache.bitmapFont.add(_0x5059cd, {
    data: _0x4bb3ff,
    texture: _0x5059cd,
    frame: null
  });
}
class M {
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
    this.wasBoosted = false;
    this.pendingVelocity = null;
    this.collideTop = 0;
    this.collideBottom = 0;
    this.onCeiling = false;
    this.upKeyDown = false;
    this.upKeyPressed = false;
    this.isDead = false;
    this.mirrored = false;
  }
}
const P = ["GJ_WebSheet", "GJ_GameSheet", "GJ_GameSheet02", "GJ_GameSheet03", "GJ_GameSheet04", "GJ_GameSheetEditor", "GJ_GameSheetGlow", "GJ_GameSheetIcons", "GJ_LaunchSheet", "player_ball_00", "player_dart_00"];
function R(_0xfe584, _0x2da093) {
  for (let _0x15819b of P) {
    if (_0xfe584.textures.exists(_0x15819b)) {
      if (_0xfe584.textures.get(_0x15819b).has(_0x2da093)) {
        return {
          atlas: _0x15819b,
          frame: _0x2da093
        };
      }
    }
  }
  return null;
}
function L(_0x56b804, _0x310a42, _0x71aad, _0x4272eb) {
  let _0x4a4e1f = R(_0x56b804, _0x4272eb);
  if (_0x4a4e1f) {
    return _0x56b804.add.image(_0x310a42, _0x71aad, _0x4a4e1f.atlas, _0x4a4e1f.frame);
  } else if (_0x56b804.textures.exists(_0x4272eb)) {
    return _0x56b804.add.image(_0x310a42, _0x71aad, _0x4272eb);
  } else {
    return null;
  }
}
class O {
  constructor(objType, xPos, yPos, width, height, rotation = 0) {
    this.type = objType;
    this.x = xPos;
    this.y = yPos;
    this.w = width;
    this.h = height;
    this.activated = false;
    this.rotationDegrees = rotation;
  }
}
function F(_0x549766) {
  let _0x251608 = _0x549766.length;
  while (--_0x251608 >= 0) {
    _0x549766[_0x251608] = 0;
  }
}
const D = 256;
const k = 286;
const I = 30;
const B = 15;
const N = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]);
const X = new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]);
const Y = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]);
const U = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
const z = new Array(576);
F(z);
const G = new Array(60);
F(G);
const W = new Array(512);
F(W);
const V = new Array(256);
F(V);
const H = new Array(29);
F(H);
const j = new Array(I);
function q(_0x307b47, _0x789fa6, _0x3f395e, _0x21c0e4, _0x5b8f62) {
  this.static_tree = _0x307b47;
  this.extra_bits = _0x789fa6;
  this.extra_base = _0x3f395e;
  this.elems = _0x21c0e4;
  this.max_length = _0x5b8f62;
  this.has_stree = _0x307b47 && _0x307b47.length;
}
let K;
let Z;
let J;
function Q(_0x4fd045, _0x2b9fbb) {
  this.dyn_tree = _0x4fd045;
  this.max_code = 0;
  this.stat_desc = _0x2b9fbb;
}
F(j);
const $ = _0xb9568e => _0xb9568e < 256 ? W[_0xb9568e] : W[256 + (_0xb9568e >>> 7)];
const tt = (_0x5c19b7, _0x54daf2) => {
  _0x5c19b7.pending_buf[_0x5c19b7.pending++] = _0x54daf2 & 255;
  _0x5c19b7.pending_buf[_0x5c19b7.pending++] = _0x54daf2 >>> 8 & 255;
};
const et = (_0x5ead20, _0x3da7df, _0x2234f0) => {
  if (_0x5ead20.bi_valid > 16 - _0x2234f0) {
    _0x5ead20.bi_buf |= _0x3da7df << _0x5ead20.bi_valid & 65535;
    tt(_0x5ead20, _0x5ead20.bi_buf);
    _0x5ead20.bi_buf = _0x3da7df >> 16 - _0x5ead20.bi_valid;
    _0x5ead20.bi_valid += _0x2234f0 - 16;
  } else {
    _0x5ead20.bi_buf |= _0x3da7df << _0x5ead20.bi_valid & 65535;
    _0x5ead20.bi_valid += _0x2234f0;
  }
};
const it = (_0x642173, _0x1f3fba, _0x394021) => {
  et(_0x642173, _0x394021[_0x1f3fba * 2], _0x394021[_0x1f3fba * 2 + 1]);
};
const st = (_0x1e4d1b, _0x3ef2a4) => {
  let _0x306312 = 0;
  do {
    _0x306312 |= _0x1e4d1b & 1;
    _0x1e4d1b >>>= 1;
    _0x306312 <<= 1;
  } while (--_0x3ef2a4 > 0);
  return _0x306312 >>> 1;
};
const rt = (_0x399b03, _0x258fad, _0xe57e01) => {
  const _0x8d102b = new Array(16);
  let _0x34ed87;
  let _0x53fb08;
  let _0x5cbc9e = 0;
  for (_0x34ed87 = 1; _0x34ed87 <= B; _0x34ed87++) {
    _0x5cbc9e = _0x5cbc9e + _0xe57e01[_0x34ed87 - 1] << 1;
    _0x8d102b[_0x34ed87] = _0x5cbc9e;
  }
  for (_0x53fb08 = 0; _0x53fb08 <= _0x258fad; _0x53fb08++) {
    let _0xe7b8e5 = _0x399b03[_0x53fb08 * 2 + 1];
    if (_0xe7b8e5 !== 0) {
      _0x399b03[_0x53fb08 * 2] = st(_0x8d102b[_0xe7b8e5]++, _0xe7b8e5);
    }
  }
};
function parseObject(objectString) {
  let objectParts = objectString.split(",");
  let _0x20f60e = {};
  for (let index = 0; index + 1 < objectParts.length; index += 2) {
    let _0x323e77 = parseInt(objectParts[index], 10);
    let _0x557e5c = objectParts[index + 1];
    _0x20f60e[_0x323e77] = _0x557e5c;
  }
  let _0x382b1e = parseInt(_0x20f60e[1] || "0", 10);
  if (_0x382b1e === 0) {
    return null;
  } else {
    return {
      id: _0x382b1e,
      x: parseFloat(_0x20f60e[2] || "0"),
      y: parseFloat(_0x20f60e[3] || "0"),
      flipX: _0x20f60e[4] === "1",
      flipY: _0x20f60e[5] === "1",
      rot: parseFloat(_0x20f60e[6] || "0"),
      scale: parseFloat(_0x20f60e[32] || "1"),
      zLayer: parseInt(_0x20f60e[24] || "0", 10),
      zOrder: parseInt(_0x20f60e[25] || "0", 10),
      groups: _0x20f60e[57] || "",
      color1: parseInt(_0x20f60e[21] || "0", 10),
      color2: parseInt(_0x20f60e[22] || "0", 10),
      _raw: _0x20f60e
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
const solidType = "solid";
const hazardType = "hazard";
const decoType = "deco";
const portalType = "portal";
const padType = "pad";
const ringType = "ring";
const triggerType = "trigger";
const speedType = "speed";
const flyPortal = "fly";
const cubePortal = "cube";
const portalWaveType = "portal_wave";
const allObjects = window.allobjects();
const objsWithGlow = [1, 2, 3, 4, 6, 7, 83, 8, 39, 103, 392, 35, 36, 40, 140, 141, 62, 65, 66, 68, 195, 196];
for (let obj of objsWithGlow) {
  if (allObjects[obj]) {
    allObjects[obj].glow = true;
  }
}
function getObjectFromId(id) {
  return allObjects[id] || null;
}
class us {
  constructor(_0x46dab3, _0x35fa95) {
    this._scene = _0x46dab3;
    this._cameraXRef = _0x35fa95;
    this.additiveContainer = _0x46dab3.add.container(0, 0).setDepth(-1);
    this.container = _0x46dab3.add.container(0, 0);
    this.topContainer = _0x46dab3.add.container(0, 0).setDepth(13);
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
    this._enterEffectTriggers = [];
    this._enterEffectTriggerIdx = 0;
    this._activeEnterEffect = 0;
    this._activeExitEffect = 0;
    this._sections = [];
    this._sectionContainers = [];
    this._collisionSections = [];
    this._nearbyBuffer = [];
    this._visMinSec = -1;
    this._visMaxSec = -1;
    this._groundStartScreenY = b(0);
    this._ceilingStartScreenY = 0;
    this._buildGround();
  }
  loadLevel(_0x335f1b) {
    let {
      objects: _0x1b4349,
      settings: settingslist
    } = parseLevel(_0x335f1b);
    this._spawnLevelObjects(_0x1b4349);
    this._setUpSettings(settingslist);
  }
  _setUpSettings(settingsStr) {
    this._initialColors = {};
    this._backgroundId = null;
    this._groundId = null;
    if (!settingsStr) return;
    let pairs = settingsStr.split(",");
    let settingsMap = {};
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
    const _0x73ae12 = this._scene;
    window._groundId = window._groundId ? window._groundId : "01";
    
      console.log(window._groundId)
    const _0x3bff90 = _0x73ae12.textures.getFrame("groundSquare_" + window._groundId + "_001.png");
    this._tileW = _0x3bff90 ? _0x3bff90.width : 1012;
    this._groundTiles = [];
    this._ceilingTiles = [];
    let _0x5bf5f8 = Math.ceil(r / this._tileW) + 2;
    let _0x428d85 = b(0);
    const _0x239f13 = -h;
    for (let _0x3a0baf = 0; _0x3a0baf < _0x5bf5f8; _0x3a0baf++) {
      let _0x4cea14 = _0x239f13 + _0x3a0baf * this._tileW;
      let _0x929a9b = _0x73ae12.add.image(0, _0x428d85, "groundSquare_" + window._groundId + "_001.png");
      _0x929a9b.setOrigin(0, 0);
      _0x929a9b.setTint(17578);
      _0x929a9b.setDepth(20);
      _0x929a9b._worldX = _0x4cea14;
      this._groundTiles.push(_0x929a9b);
      let _0x1b177f = _0x73ae12.add.image(0, _0x428d85, "groundSquare_" + window._groundId + "_001.png");
      _0x1b177f.setOrigin(0, 1);
      _0x1b177f.setFlipY(true);
      _0x1b177f.setTint(17578);
      _0x1b177f.setDepth(20);
      _0x1b177f.setVisible(false);
      _0x1b177f._worldX = _0x4cea14;
      this._ceilingTiles.push(_0x1b177f);
    }
    this._maxGroundWorldX = _0x239f13 + (_0x5bf5f8 - 1) * this._tileW;
    const _0x42704c = _0x73ae12.textures.getFrame("GJ_WebSheet", "floorLine_01_001.png");
    const _0x37a2ff = _0x42704c ? _0x42704c.width : 888;
    const _0x578262 = r / _0x37a2ff;
    this._groundLine = _0x73ae12.add.image(r / 2, _0x428d85 - 1, "GJ_WebSheet", "floorLine_01_001.png").setOrigin(0.5, 0).setScale(_0x578262, 1).setBlendMode(S).setDepth(21).setScrollFactor(0);
    this._ceilingLine = _0x73ae12.add.image(r / 2, _0x428d85 + 1, "GJ_WebSheet", "floorLine_01_001.png").setOrigin(0.5, 1).setScale(_0x578262, 1).setFlipY(true).setBlendMode(S).setDepth(21).setScrollFactor(0).setVisible(false);
    const _0x4ff823 = 100 / 255;
    this._groundShadowL = _0x73ae12.add.image(-1, _0x428d85, "GJ_WebSheet", "groundSquareShadow_001.png").setOrigin(0, 0).setScrollFactor(0).setDepth(22).setAlpha(_0x4ff823).setScale(0.7, 1).setBlendMode(E);
    this._groundShadowR = _0x73ae12.add.image(r + 1, _0x428d85, "GJ_WebSheet", "groundSquareShadow_001.png").setOrigin(1, 0).setScrollFactor(0).setDepth(22).setAlpha(_0x4ff823).setScale(0.7, 1).setFlipX(true).setBlendMode(E);
    this._ceilingShadowL = _0x73ae12.add.image(-1, _0x428d85, "GJ_WebSheet", "groundSquareShadow_001.png").setOrigin(0, 1).setScrollFactor(0).setDepth(22).setAlpha(_0x4ff823).setScale(0.7, 1).setFlipY(true).setBlendMode(E).setVisible(false);
    this._ceilingShadowR = _0x73ae12.add.image(r + 1, _0x428d85, "GJ_WebSheet", "groundSquareShadow_001.png").setOrigin(1, 1).setScrollFactor(0).setDepth(22).setAlpha(_0x4ff823).setScale(0.7, 1).setFlipX(true).setFlipY(true).setBlendMode(E).setVisible(false);
  }
  resizeScreen() {
    var _0xdc60af;
    var _0x493047;
    const _0x1f0ac2 = this._scene;
    const _0x495be2 = this._tileW;
    const _0x546bad = Math.ceil(r / _0x495be2) + 2;
    const _0x4f87d5 = b(0);
    while (this._groundTiles.length < _0x546bad) {
      const _0x596be1 = this._maxGroundWorldX + _0x495be2;
      console.log(window._groundId)
      let _0x32bd97 = _0x1f0ac2.add.image(0, _0x4f87d5, "groundSquare_" + window._groundId + "_001.png");
      _0x32bd97.setOrigin(0, 0).setTint(((_0xdc60af = this._groundTiles[0]) == null ? undefined : _0xdc60af.tintTopLeft) || 17578).setDepth(20);
      _0x32bd97._worldX = _0x596be1;
      this._groundTiles.push(_0x32bd97);
      let _0x6e7d76 = _0x1f0ac2.add.image(0, _0x4f87d5, "groundSquare_" + window._groundId + "_001.png");
      _0x6e7d76.setOrigin(0, 1).setFlipY(true).setTint(((_0x493047 = this._groundTiles[0]) == null ? undefined : _0x493047.tintTopLeft) || 17578).setDepth(20).setVisible(false);
      _0x6e7d76._worldX = _0x596be1;
      this._ceilingTiles.push(_0x6e7d76);
      this._maxGroundWorldX = _0x596be1;
    }
    const _0x51125e = this._scene.textures.getFrame("GJ_WebSheet", "floorLine_01_001.png");
    const _0x1c38c3 = r / (_0x51125e ? _0x51125e.width : 888);
    this._groundLine.x = r / 2;
    this._groundLine.setScale(_0x1c38c3, 1);
    this._ceilingLine.x = r / 2;
    this._ceilingLine.setScale(_0x1c38c3, 1);
    this._groundShadowR.x = r + 1;
    this._ceilingShadowR.x = r + 1;
  }
  updateGroundTiles(_0x14aed2 = 0) {
    const _0x3d0974 = this._cameraXRef.value;
    const _0x40fc27 = this._tileW;
    let _0x12b0b9;
    let _0x3453a2;
    let _0x5bf36e = this._maxGroundWorldX || -Infinity;
    const _0x4e05bc = !this._flyGroundActive && this._flyCeilingY !== null;
    if (this._flyVisualOnly && this._flyCeilingY !== null) {
      _0x12b0b9 = b(0) + _0x14aed2;
      _0x3453a2 = b(this._flyCeilingY) + _0x14aed2;
    } else if (this._flyGroundActive && this._groundTargetValue > 0.001) {
      let _0x3ce536 = this._groundTargetValue;
      let _0x3f1d55 = 620;
      let _0x178745 = 20;
      _0x12b0b9 = this._groundStartScreenY + (_0x3f1d55 - this._groundStartScreenY) * _0x3ce536;
      _0x3453a2 = this._ceilingStartScreenY + (_0x178745 - this._ceilingStartScreenY) * _0x3ce536;
      let _0x518952 = b(0) + _0x14aed2;
      if (_0x12b0b9 > _0x518952) {
        _0x12b0b9 = _0x518952;
      }
    } else {
      _0x12b0b9 = b(0) + _0x14aed2;
      _0x3453a2 = _0x4e05bc ? 20 : 0;
    }
    for (let _0x2c7b79 = 0; _0x2c7b79 < this._groundTiles.length; _0x2c7b79++) {
      let _0x2d1a71 = this._groundTiles[_0x2c7b79];
      let _0x20a50b = this._ceilingTiles[_0x2c7b79];
      if (_0x2d1a71._worldX + _0x40fc27 <= _0x3d0974) {
        _0x2d1a71._worldX = _0x5bf36e + _0x40fc27;
        _0x20a50b._worldX = _0x2d1a71._worldX;
        _0x5bf36e = _0x2d1a71._worldX;
        this._maxGroundWorldX = _0x5bf36e;
      }
      let _0x1ff1b3 = _0x2d1a71._worldX - _0x3d0974;
      _0x2d1a71.x = _0x1ff1b3;
      _0x2d1a71.y = _0x12b0b9;
      _0x20a50b.x = _0x1ff1b3;
      _0x20a50b.y = _0x3453a2;
      _0x20a50b.setVisible(this._flyGroundActive && this._groundTargetValue > 0 || _0x4e05bc);
    }
    this._groundLine.y = _0x12b0b9;
    if (this._flyGroundActive && this._groundTargetValue > 0 || _0x4e05bc) {
      this._ceilingLine.y = _0x3453a2;
      this._ceilingLine.setVisible(true);
    } else {
      this._ceilingLine.setVisible(false);
    }
    this._groundShadowL.y = _0x12b0b9;
    this._groundShadowR.y = _0x12b0b9;
    let _0x539bc2 = this._flyGroundActive && this._groundTargetValue > 0 || _0x4e05bc;
    this._ceilingShadowL.y = _0x3453a2;
    this._ceilingShadowR.y = _0x3453a2;
    this._ceilingShadowL.setVisible(_0x539bc2);
    this._ceilingShadowR.setVisible(_0x539bc2);
  }
  shiftGroundTiles(_0x47a8b8) {
    for (let _0x33fd12 = 0; _0x33fd12 < this._groundTiles.length; _0x33fd12++) {
      this._groundTiles[_0x33fd12]._worldX += _0x47a8b8;
      this._ceilingTiles[_0x33fd12]._worldX += _0x47a8b8;
    }
    this._maxGroundWorldX += _0x47a8b8;
  }
  resetGroundTiles(_0x460241) {
    const _0x4e210f = this._tileW;
    for (let _0x33c028 = 0; _0x33c028 < this._groundTiles.length; _0x33c028++) {
      this._groundTiles[_0x33c028]._worldX = _0x460241 + _0x33c028 * _0x4e210f;
      this._ceilingTiles[_0x33c028]._worldX = _0x460241 + _0x33c028 * _0x4e210f;
    }
    this._maxGroundWorldX = _0x460241 + (this._groundTiles.length - 1) * _0x4e210f;
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
  _computeFlyBounds(_0x804885, _0x4dbd1c = f, _0x354ea0 = false) {
    let _0x4dd75a;
    if (_0x354ea0) {
      _0x4dd75a = _0x804885 - f / 2;
    } else {
      _0x4dd75a = _0x804885 - _0x4dbd1c / 2;
    }
    _0x4dd75a = Math.floor(_0x4dd75a / a) * a;
    _0x4dd75a = Math.max(0, _0x4dd75a);
    return {
      floorY: _0x4dd75a,
      ceilingY: _0x4dd75a + _0x4dbd1c
    };
  }
  setFlyMode(_0x4a6d9a, _0x3a58e7, _0x8d8ff0 = f, _0x47bce0 = false) {
    if (_0x4a6d9a) {
      let _0x5b3ec5 = this._computeFlyBounds(_0x3a58e7, _0x8d8ff0, _0x47bce0);
      this._flyFloorY = _0x5b3ec5.floorY;
      this._flyCeilingY = _0x5b3ec5.ceilingY;
      this._flyVisualOnly = _0x47bce0;
      if (_0x47bce0) {
        this._flyGroundActive = true;
      } else {
        this._flyGroundActive = true;
      }
      let _0x15ff58 = this._flyFloorY + _0x8d8ff0 / 2;
      this.flyCameraTarget = _0x15ff58 - 320 + o;
      if (this.flyCameraTarget < 0) {
        this.flyCameraTarget = 0;
      }
      let _0x3be4f1 = this._scene && this._scene._cameraY || 0;
      this._groundStartScreenY = b(0) + _0x3be4f1;
      this._ceilingStartScreenY = 0;
      this._groundAnimFrom = this._groundTargetValue;
      this._groundAnimTo = 1;
      this._groundAnimTime = 0;
      this._groundAnimDuration = 0.5;
      this._groundAnimating = true;
    } else {
      this.flyCameraTarget = null;
      this._flyCeilingY = null;
      this._flyVisualOnly = false;
      if (this._flyGroundActive) {
        this._groundAnimFrom = this._groundTargetValue;
        this._groundAnimTo = 0;
        this._groundAnimTime = 0;
        this._groundAnimDuration = 0.5;
        this._groundAnimating = true;
      } else {
        this._groundAnimating = false;
        this._groundTargetValue = 0;
      }
    }
  }
  stepGroundAnimation(_0x4a003d) {
    if (!this._groundAnimating) {
      return;
    }
    this._groundAnimTime += _0x4a003d;
    let _0x4c9adc = this._groundAnimDuration > 0 ? Math.min(this._groundAnimTime / this._groundAnimDuration, 1) : 1;
    this._groundTargetValue = this._groundAnimFrom + (this._groundAnimTo - this._groundAnimFrom) * _0x4c9adc;
    if (_0x4c9adc >= 1) {
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
  _applyVisualProps(_0x4feeca, _0x2d433c, _0x590e4f, _0x5eb2df, _0x450956 = null) {
    if (!_0x2d433c) {
      return;
    }
    let {
      dx: _0x4aea8a,
      dy: _0x545b71
    } = function (_0x221968, _0xce6477) {
      let _0x3a4f77 = R(_0x221968, _0xce6477);
      if (!_0x3a4f77) {
        return {
          dx: 0,
          dy: 0
        };
      }
      let _0x225d39 = _0x221968.textures.get(_0x3a4f77.atlas).get(_0x3a4f77.frame);
      if (!_0x225d39) {
        return {
          dx: 0,
          dy: 0
        };
      }
      let _0x30be73 = _0x225d39.customData || {};
      if (_0x30be73.gjSpriteOffset) {
        return {
          dx: _0x30be73.gjSpriteOffset.x || 0,
          dy: -(_0x30be73.gjSpriteOffset.y || 0)
        };
      }
      let _0x535a10 = _0x225d39.realWidth;
      let _0x796c4 = _0x225d39.realHeight;
      let _0x62367d = _0x225d39.width;
      let _0x244756 = _0x225d39.height;
      let _0x58bd9c = 0;
      let _0xedc3c7 = 0;
      if (_0x30be73.spriteSourceSize) {
        _0x58bd9c = _0x30be73.spriteSourceSize.x || 0;
        _0xedc3c7 = _0x30be73.spriteSourceSize.y || 0;
      }
      return {
        dx: _0x535a10 / 2 - (_0x58bd9c + _0x62367d / 2),
        dy: _0x796c4 / 2 - (_0xedc3c7 + _0x244756 / 2)
      };
    }(_0x4feeca, _0x590e4f);
    if (_0x5eb2df.flipX) {
      _0x2d433c.setFlipX(true);
    }
    if (_0x5eb2df.flipY) {
      _0x2d433c.setFlipY(true);
    }
    let _0x249260 = (_0x2d433c.getData("gjBaseRotationDeg") || 0) + _0x5eb2df.rot;
    if (_0x249260 !== 0) {
      _0x2d433c.setAngle(_0x249260);
    }
    if (_0x5eb2df.scale !== 1) {
      _0x2d433c.setScale(_0x5eb2df.scale);
    }
    if (_0x450956) {
      if (_0x450956.tint !== undefined) {
        _0x2d433c.setTint(_0x450956.tint);
      } else if (_0x450956.black) {
        _0x2d433c.setTint(0);
      }
    }
  }
  _addVisualSprite(_0x2edd38, _0x55b8b6 = null) {
    if (_0x2edd38) {
      if (_0x55b8b6 && _0x55b8b6.blend === "additive") {
        _0x2edd38.setBlendMode(S);
        _0x2edd38._eeLayer = 0;
      } else if (_0x55b8b6 && _0x55b8b6._portalFront) {
        _0x2edd38._eeLayer = 2;
      } else if (_0x55b8b6 && _0x55b8b6.z !== undefined && _0x55b8b6.z < 0) {
        _0x2edd38._eeLayer = 0;
      } else {
        _0x2edd38._eeLayer = 1;
      }
    }
  }
  _getGlowFrameName(_0x40f97f) {
    if (_0x40f97f && _0x40f97f.endsWith("_001.png")) {
      return _0x40f97f.replace("_001.png", "_glow_001.png");
    } else {
      return null;
    }
  }
  _addGlowSprite(_0x2fb4ca, _0xad3348, _0x5d6f6f, _0x3d09ed, _0x330e58, _0x3f8eef) {
    let _0xa6570d = this._getGlowFrameName(_0x3d09ed);
    if (!_0xa6570d) {
      return;
    }
    if (!R(_0x2fb4ca, _0xa6570d) && !_0x2fb4ca.textures.exists(_0xa6570d)) {
      return;
    }
    let _0x3a5f29 = L(_0x2fb4ca, _0xad3348, _0x5d6f6f, _0xa6570d);
    if (_0x3a5f29) {
      this._applyVisualProps(_0x2fb4ca, _0x3a5f29, _0xa6570d, _0x330e58);
      _0x3a5f29.setBlendMode(S);
      _0x3a5f29._eeLayer = 0;
      if (_0x3f8eef !== undefined) {
        _0x3a5f29._eeWorldX = _0x3f8eef;
        _0x3a5f29._eeBaseY = _0x5d6f6f;
        this._addToSection(_0x3a5f29);
      }
    }
  }
  _spawnLevelObjects(_0x35f1ae) {
    const _0xd15974 = this._scene;
    let _0x443c50 = new Set();
    this._lastObjectX = 0;
    for (let _0x1b937f of _0x35f1ae) {
      let _0x24471f = getObjectFromId(_0x1b937f.id);
      if (_0x24471f && _0x24471f.type === triggerType) {
        if (_0x1b937f.id === 29 || _0x1b937f.id === 30) {
          this._colorTriggers.push({
            x: _0x1b937f.x * 2,
            index: _0x1b937f.id === 29 ? 1000 : 1001,
            color: {
              r: parseInt(_0x1b937f._raw[7] ?? 255, 10),
              g: parseInt(_0x1b937f._raw[8] ?? 255, 10),
              b: parseInt(_0x1b937f._raw[9] ?? 255, 10)
            },
            duration: parseFloat(_0x1b937f._raw[10] ?? 0),
            tintGround: _0x1b937f._raw[14] === "1"
          });
        }
        if (_0x24471f.enterEffect) {
          this._enterEffectTriggers.push({
            x: _0x1b937f.x * 2,
            effect: _0x24471f.enterEffect
          });
        }
        continue;
      }
      let _0x173c58 = _0x1b937f.x * 2;
      let _0x7ab528 = _0x1b937f.y * 2;
      if (_0x173c58 > this._lastObjectX) {
        this._lastObjectX = _0x173c58;
      }
      let _0x4c7589 = _0x24471f ? _0x24471f.frame : null;
      if (_0x24471f && _0x24471f.randomFrames) {
        _0x4c7589 = _0x24471f.randomFrames[Math.floor(Math.random() * _0x24471f.randomFrames.length)];
      }
      if (_0x4c7589) {
        let _0x2ddc05 = _0x173c58;
        let _0x1b10a0 = b(_0x7ab528);
        const _0x501fde = (_0x24471f.type === portalType || _0x24471f.type === speedType) && _0x4c7589.includes("_front_");
        if (_0x501fde) {
          const _0x32e8a1 = _0x4c7589.replace("_front_", "_back_");
          let _0x517b49 = L(_0xd15974, _0x2ddc05, _0x1b10a0, _0x32e8a1);
          if (_0x517b49) {
            this._applyVisualProps(_0xd15974, _0x517b49, _0x32e8a1, _0x1b937f);
            _0x517b49._eeLayer = 1;
            _0x517b49._eeWorldX = _0x173c58;
            _0x517b49._eeBaseY = _0x1b10a0;
            this._addToSection(_0x517b49);
          }
        }
        if (_0x24471f.glow) {
          this._addGlowSprite(_0xd15974, _0x2ddc05, _0x1b10a0, _0x4c7589, _0x1b937f, _0x173c58);
        }
        const _0x36f679 = _0x501fde ? {
          ..._0x24471f,
          _portalFront: true
        } : _0x24471f;
        let _0x554e0e = L(_0xd15974, _0x2ddc05, _0x1b10a0, _0x4c7589);
        if (_0x554e0e) {
          this._applyVisualProps(_0xd15974, _0x554e0e, _0x4c7589, _0x1b937f, _0x24471f);
          this._addVisualSprite(_0x554e0e, _0x36f679);
          _0x554e0e._eeWorldX = _0x173c58;
          _0x554e0e._eeBaseY = _0x1b10a0;
          this._addToSection(_0x554e0e);
        } else {
          console.warn("No sprite found for object ID " + _0x1b937f.id + " frame=" + _0x4c7589 + " type=" + (_0x24471f ? _0x24471f.type : "null"));
        }
        if (_0x24471f && (_0x24471f.type === solidType || _0x24471f.type === hazardType)) {
          let _0x47077e = _0x4c7589.replace("_001.png", "_2_001.png");
          let _0xe3eaec = R(_0xd15974, _0x47077e) ? L(_0xd15974, _0x2ddc05, _0x1b10a0, _0x47077e) : null;
          if (_0xe3eaec) {
            this._applyVisualProps(_0xd15974, _0xe3eaec, _0x47077e, _0x1b937f);
            this._addVisualSprite(_0xe3eaec);
            _0xe3eaec._eeWorldX = _0x173c58;
            _0xe3eaec._eeBaseY = _0x1b10a0;
            this._addToSection(_0xe3eaec);
          }
        }
        if (_0x24471f.children) {
          for (let _0x2ca803 of _0x24471f.children) {
            let _0x3b4e8c = _0x2ca803.dx || 0;
            let _0x172131 = _0x2ca803.dy || 0;
            if (_0x2ca803.localDx !== undefined || _0x2ca803.localDy !== undefined) {
              let _0x38902b = _0x2ca803.localDx || 0;
              let _0x256a8e = _0x2ca803.localDy || 0;
              if (_0x1b937f.flipX) {
                _0x38902b = -_0x38902b;
              }
              if (_0x1b937f.flipY) {
                _0x256a8e = -_0x256a8e;
              }
              let _0x3e62f2 = (_0x1b937f.rot || 0) * Math.PI / 180;
              _0x3b4e8c = _0x38902b * Math.cos(_0x3e62f2) - _0x256a8e * Math.sin(_0x3e62f2);
              _0x172131 = _0x38902b * Math.sin(_0x3e62f2) + _0x256a8e * Math.cos(_0x3e62f2);
            }
            let _0x42173e = L(_0xd15974, _0x2ddc05 + _0x3b4e8c, _0x1b10a0 + _0x172131, _0x2ca803.frame);
            if (_0x42173e) {
              this._applyVisualProps(_0xd15974, _0x42173e, _0x2ca803.frame, _0x1b937f, _0x2ca803);
              if (_0x2ca803.audioScale) {
                _0x42173e.setScale(0.1);
                _0x42173e.setAlpha(0.9);
                _0x42173e._eeAudioScale = true;
                this._audioScaleSprites.push(_0x42173e);
              }
              if ((_0x2ca803.z !== undefined ? _0x2ca803.z : -1) < 0) {
                _0x42173e._eeLayer = 1;
                _0x42173e._eeBehindParent = true;
              } else {
                this._addVisualSprite(_0x42173e, _0x2ca803);
              }
              _0x42173e._eeWorldX = _0x173c58 + _0x3b4e8c;
              _0x42173e._eeBaseY = _0x1b10a0 + _0x172131;
              this._addToSection(_0x42173e);
            }
          }
        }
      } else if (!_0x24471f) {
        _0x443c50.add(_0x1b937f.id);
        console.warn("Object ID " + _0x1b937f.id + " has no definition in allObjects at x=" + _0x173c58 + " y=" + _0x7ab528);
      }
      if (_0x24471f && _0x24471f.portalParticle && _0x4c7589) {
        let _0x3a9438 = _0x173c58;
        let _0x2e9079 = b(_0x7ab528);
        const _0x143187 = 2;
        let _0x5926ad = _0x3a9438 - _0x143187 * 5;
        let _0x1ebc69 = _0x2e9079;
        const _0x388526 = {
          getRandomPoint: _0x4ad804 => {
            let _0x5b7fb4 = (Math.random() * 190 + 85) * Math.PI / 180;
            let _0x2bc56f = _0x143187 * 20 + Math.random() * 40 * _0x143187;
            _0x4ad804.x = Math.cos(_0x5b7fb4) * _0x2bc56f;
            _0x4ad804.y = Math.sin(_0x5b7fb4) * _0x2bc56f;
            return _0x4ad804;
          }
        };
        const _0x100649 = 20;
        let _0x1bed6b = _0xd15974.add.particles(_0x5926ad, _0x1ebc69, "GJ_WebSheet", {
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
          tint: _0x24471f.portalParticleColor,
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
        _0x1bed6b._eeWorldX = _0x173c58;
        _0x1bed6b._eeBaseY = _0x1ebc69;
        this._addToSection(_0x1bed6b);
      }
      if (_0x24471f) {
        if (_0x24471f.type === solidType && _0x24471f.gridW > 0 && _0x24471f.gridH > 0) {
          let _0x10e5ae = _0x24471f.gridW * a;
          let _0x11e08d = _0x24471f.gridH * a;
          let _0x4628ff = new O(solidType, _0x173c58, _0x7ab528, _0x10e5ae, _0x11e08d, _0x1b937f.rot || 0);
          this.objects.push(_0x4628ff);
          this._addCollisionToSection(_0x4628ff);
        } else if (_0x24471f.type === hazardType) {
          let _0x3f8c4f = 0;
          let _0x2a123d = 0;
          if (_0x24471f.spriteW > 0 && _0x24471f.spriteH > 0 && _0x24471f.hitboxScaleX !== undefined && _0x24471f.hitboxScaleY !== undefined) {
            _0x3f8c4f = _0x24471f.spriteW * _0x24471f.hitboxScaleX * 2;
            _0x2a123d = _0x24471f.spriteH * _0x24471f.hitboxScaleY * 2;
          } else if (_0x24471f.gridW > 0 && _0x24471f.gridH > 0) {
            _0x3f8c4f = _0x24471f.gridW * 12;
            _0x2a123d = _0x24471f.gridH * 24;
          }
          if (_0x3f8c4f > 0 && _0x2a123d > 0) {
            let _0x3c84ad = new O(hazardType, _0x173c58, _0x7ab528, _0x3f8c4f, _0x2a123d, _0x1b937f.rot || 0);
            this.objects.push(_0x3c84ad);
            this._addCollisionToSection(_0x3c84ad);
          }
        } else if (_0x24471f.type === portalType) {

          let _0xad0974 = 90;
          let _0x2c2226 = _0x24471f.gridH * a;
          const _0x5bcd81 = _0x24471f.sub || {
            10: "gravity_flip",
            11: "gravity_normal",
            12: "cube",
            13: "fly",
            45: "mirrora",
            46: "mirrorb",
            47: "ball",
            660: "wave",
          }[_0x1b937f.id];
          const _0x25452a = {
            gravity_flip: "portal_gravity_down",
            gravity_normal: "portal_gravity_up",
            [flyPortal]: "portal_fly",
            fly: "portal_fly",
            [cubePortal]: "portal_cube",
            cube: "portal_cube",
            ball: "portal_ball",
            wave: portalWaveType,
            mirrora: "portal_mirror_on",
            mirrorb: "portal_mirror_off"
          }[_0x5bcd81] || null;
          if (!_0x25452a) {
            console.warn("unknown portal sub-type: id=" + _0x1b937f.id + " sub=" + _0x24471f.sub);
          }
          if (_0x25452a) {
            let _0x4bd7bc = new O(_0x25452a, _0x173c58, _0x7ab528, _0xad0974, _0x2c2226, _0x1b937f.rot || 0);
            _0x4bd7bc.portalY = _0x7ab528;
            this.objects.push(_0x4bd7bc);
            this._addCollisionToSection(_0x4bd7bc);
            console.log("portal collision created: type=" + _0x25452a + " id=" + _0x1b937f.id + " x=" + _0x173c58 + " y=" + _0x7ab528 + " w=" + _0xad0974 + " h=" + _0x2c2226);
          } else {
            console.warn("portal ID " + _0x1b937f.id + " has no matching sub-type (sub=" + _0x24471f.sub + ")");
          }
        } else if (_0x24471f.type === padType) {
          let padW = _0x24471f.gridW * a;
          let padH = Math.max(_0x24471f.gridH, 10);
          let padObj = new O(jumpPadType, _0x173c58, _0x7ab528, padW, padH, _0x1b937f.rot || 0);
          padObj.padId = _0x1b937f.id;
          this.objects.push(padObj);
          this._addCollisionToSection(padObj);
          console.log("pad collision created: id=" + _0x1b937f.id + " x=" + _0x173c58 + " y=" + _0x7ab528);
        } else if (_0x24471f.type === ringType) {
          let orbW = _0x24471f.gridW * a * 0.8;
          let orbH = _0x24471f.gridH * a * 0.8;
          let orbObj = new O(jumpRingType, _0x173c58, _0x7ab528, orbW, orbH, _0x1b937f.rot || 0);
          orbObj.orbId = _0x1b937f.id;
          orbObj.orbRotation = _0x1b937f.rot || 0;
          orbObj._dashHoldTicks = 0;
          this.objects.push(orbObj);
          this._addCollisionToSection(orbObj);
          console.log("orb collision created: id=" + _0x1b937f.id + " x=" + _0x173c58 + " y=" + _0x7ab528);
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
    this.endXPos = Math.max(r + 1200, this._lastObjectX + 680);
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
  _addToSection(_0x4413d3) {
    const _0x4ac40a = Math.max(0, Math.floor(_0x4413d3._eeWorldX / 400));
    this._sections[_0x4ac40a] ||= [];
    this._sections[_0x4ac40a].push(_0x4413d3);
    const _0x14d5f7 = _0x4413d3._eeLayer !== undefined ? _0x4413d3._eeLayer : 1;
    if (_0x14d5f7 === 2) {
      this.topContainer.add(_0x4413d3);
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
      _0x2157d3.additive.add(_0x4413d3);
    } else if (_0x4413d3._eeBehindParent) {
      _0x2157d3.normal.addAt(_0x4413d3, 0);
    } else {
      _0x2157d3.normal.add(_0x4413d3);
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
    const _0x5b29dd = Math.max(0, Math.floor((_0xa5f1e1 - 140) / 400));
    const _0x3b33db = Math.min(_0x1dce22, Math.floor((_0xa5f1e1 + r + 140) / 400));
    const _0x1800fc = this._visMinSec;
    const _0xc31046 = this._visMaxSec;
    if (_0x1800fc < 0) {
      for (let _0x47dbe1 = 0; _0x47dbe1 <= _0x1dce22; _0x47dbe1++) {
        this._setSectionVisible(_0x47dbe1, _0x47dbe1 >= _0x5b29dd && _0x47dbe1 <= _0x3b33db);
      }
      this._visMinSec = _0x5b29dd;
      this._visMaxSec = _0x3b33db;
      return;
    }
    if (_0x5b29dd !== _0x1800fc || _0x3b33db !== _0xc31046) {
      if (_0x5b29dd > _0x1800fc) {
        for (let _0x7da5df = _0x1800fc; _0x7da5df <= Math.min(_0x5b29dd - 1, _0xc31046); _0x7da5df++) {
          this._setSectionVisible(_0x7da5df, false);
        }
      }
      if (_0x3b33db < _0xc31046) {
        for (let _0x5b2d47 = Math.max(_0x3b33db + 1, _0x1800fc); _0x5b2d47 <= _0xc31046; _0x5b2d47++) {
          this._setSectionVisible(_0x5b2d47, false);
        }
      }
      if (_0x5b29dd < _0x1800fc) {
        for (let _0x3caab6 = _0x5b29dd; _0x3caab6 <= Math.min(_0x1800fc - 1, _0x3b33db); _0x3caab6++) {
          this._setSectionVisible(_0x3caab6, true);
        }
      }
      if (_0x3b33db > _0xc31046) {
        for (let _0x347412 = Math.max(_0xc31046 + 1, _0x5b29dd); _0x347412 <= _0x3b33db; _0x347412++) {
          this._setSectionVisible(_0x347412, true);
        }
      }
      this._visMinSec = _0x5b29dd;
      this._visMaxSec = _0x3b33db;
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
  resetEnterEffectTriggers() {
    this._enterEffectTriggerIdx = 0;
    this._activeEnterEffect = 0;
    this._activeExitEffect = 0;
    for (let _0x17a21d = 0; _0x17a21d < this._sections.length; _0x17a21d++) {
      this._setSectionVisible(_0x17a21d, true);
      const _0x14a035 = this._sections[_0x17a21d];
      if (_0x14a035) {
        for (let _0x13e116 = 0; _0x13e116 < _0x14a035.length; _0x13e116++) {
          const _0x1e8f9f = _0x14a035[_0x13e116];
          _0x1e8f9f._eeActive = false;
          _0x1e8f9f.visible = true;
          _0x1e8f9f.x = _0x1e8f9f._eeWorldX;
          _0x1e8f9f.y = _0x1e8f9f._eeBaseY;
          if (!_0x1e8f9f._eeAudioScale) {
            _0x1e8f9f.setScale(1);
          }
          _0x1e8f9f.setAlpha(1);
        }
      }
    }
  }
  applyEnterEffects(_0x2f36ed) {
    const _0x221c93 = 400;
    const _0xa24372 = 140;
    const _0x5e9f2a = 200;
    const _0x29a51b = _0x2f36ed;
    const _0x548004 = _0x2f36ed + r;
    const _0x49c6d8 = _0x2f36ed + r / 2;
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
        const _0x2ae6ed = _0x2cff29[_0x54aba7];
        if (_0x8f9d56) {
          if (_0x2ae6ed._eeActive) {
            _0x2ae6ed._eeActive = false;
            _0x2ae6ed.y = _0x2ae6ed._eeBaseY;
            _0x2ae6ed.x = _0x2ae6ed._eeWorldX;
            if (!_0x2ae6ed._eeAudioScale) {
              _0x2ae6ed.setScale(1);
            }
            _0x2ae6ed.setAlpha(1);
          }
          continue;
        }
        const _0xeded99 = _0x2ae6ed._eeWorldX;
        const _0x1b2883 = _0xeded99 > _0x49c6d8;
        let _0x289aa2;
        _0x289aa2 = _0x1b2883 ? Math.max(0, Math.min(1, (_0x548004 - _0xeded99) / _0xa24372)) : Math.max(0, Math.min(1, (_0xeded99 - _0x29a51b) / _0xa24372));
        if (_0x289aa2 >= 1) {
          if (_0x2ae6ed._eeActive) {
            _0x2ae6ed._eeActive = false;
            _0x2ae6ed.y = _0x2ae6ed._eeBaseY;
            _0x2ae6ed.x = _0x2ae6ed._eeWorldX;
            if (!_0x2ae6ed._eeAudioScale) {
              _0x2ae6ed.setScale(1);
            }
            _0x2ae6ed.setAlpha(1);
          }
          continue;
        }
        _0x2ae6ed._eeActive = true;
        const _0x453353 = _0x1b2883 ? this._activeEnterEffect : this._activeExitEffect;
        const _0x20804e = 1 - _0x289aa2;
        let _0x50e6d9 = _0x2ae6ed._eeBaseY;
        let _0x17437c = _0x2ae6ed._eeWorldX;
        let _0x2128bf = _0x289aa2;
        let _0x127ace = 1;
        switch (_0x453353) {
          case 0:
            break;
          case 1:
            _0x50e6d9 = _0x2ae6ed._eeBaseY + _0x5e9f2a * _0x20804e;
            break;
          case 2:
            _0x50e6d9 = _0x2ae6ed._eeBaseY - _0x5e9f2a * _0x20804e;
            break;
          case 3:
            _0x17437c = _0x2ae6ed._eeWorldX - _0x5e9f2a * _0x20804e;
            break;
          case 4:
            _0x17437c = _0x2ae6ed._eeWorldX + _0x5e9f2a * _0x20804e;
            break;
          case 5:
            if (!_0x2ae6ed._eeAudioScale) {
              _0x127ace = _0x289aa2;
            }
            break;
          case 6:
            if (!_0x2ae6ed._eeAudioScale) {
              _0x127ace = 1 + _0x20804e * 0.75;
            }
        }
        if (_0x2ae6ed.x !== _0x17437c) {
          _0x2ae6ed.x = _0x17437c;
        }
        if (_0x2ae6ed.y !== _0x50e6d9) {
          _0x2ae6ed.y = _0x50e6d9;
        }
        if (_0x2ae6ed.alpha !== _0x2128bf) {
          _0x2ae6ed.alpha = _0x2128bf;
        }
        if (!_0x2ae6ed._eeAudioScale && _0x2ae6ed.scaleX !== _0x127ace) {
          _0x2ae6ed.setScale(_0x127ace);
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
    this._gfx = _0x9c2356.add.graphics();
    this._gfx.setBlendMode(Phaser.BlendModes.ADD);
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
function ds(_0x415536, _0x592bc1, _0x4d69dc, _0xfb965c, _0x43d3fd, _0x5bbdf1) {
  let _0x221d10 = R(_0x415536, _0xfb965c);
  if (!_0x221d10) {
    return null;
  }
  let _0x38da45 = _0x415536.add.image(_0x592bc1, _0x4d69dc, _0x221d10.atlas, _0x221d10.frame);
  _0x38da45.setDepth(_0x43d3fd);
  _0x38da45.setVisible(_0x5bbdf1);
  return {
    sprite: _0x38da45
  };
}
class ps {
  constructor(_0x5b73d2, _0x3f50cc, _0x2811e1) {
    this._scene = _0x5b73d2;
    this.p = _0x3f50cc;
    this._gameLayer = _0x2811e1;
    this._rotation = 0;
    this.rotateActionActive = false;
    this.rotateActionTime = 0;
    this.rotateActionDuration = 0;
    this.rotateActionStart = 0;
    this.rotateActionTotal = 0;
    this._showHitboxes = true;
    this._lastLandObject = null;
    this._lastXOffset = 0;
    this._lastCameraX = 0;
    this._lastCameraY = 0;
    this._createSprites();
    this._hitboxGraphics = _0x5b73d2.add.graphics().setScrollFactor(0).setDepth(20);
    this._initParticles(_0x5b73d2);
    _0x5b73d2.events.on("shutdown", () => this._cleanupExplosion());
  }
  _createSprites() {
    const _0x1872a7 = this._scene;
    const _0x28689a = b(this.p.y);
    const _0xf42f36 = h;
    this._playerGlowLayer = ds(_0x1872a7, _0xf42f36, _0x28689a, `${window.currentPlayer}_glow_001.png`, 9, false);
    this._playerSpriteLayer = ds(_0x1872a7, _0xf42f36, _0x28689a, `${window.currentPlayer}_001.png`, 10, true);
    this._playerOverlayLayer = ds(_0x1872a7, _0xf42f36, _0x28689a, `${window.currentPlayer}_2_001.png`, 8, true);
    this._playerExtraLayer = ds(_0x1872a7, _0xf42f36, _0x28689a, `${window.currentPlayer}_extra_001.png`, 12, true);
    if (this._playerGlowLayer) {
      this._playerGlowLayer.sprite.setTint(window.secondaryColor);
      this._playerGlowLayer.sprite._glowEnabled = false;
    }
    if (this._playerSpriteLayer) {
      this._playerSpriteLayer.sprite.setTint(window.mainColor);
    } else {
      let _0x3aecd9 = _0x1872a7.add.rectangle(_0xf42f36, _0x28689a, g, g, window.mainColor);
      _0x3aecd9.setDepth(10);
      this._playerSpriteLayer = {
        sprite: _0x3aecd9
      };
    }
    if (this._playerOverlayLayer) {
      this._playerOverlayLayer.sprite.setTint(window.secondaryColor);
    }
    this._shipGlowLayer = ds(_0x1872a7, _0xf42f36, _0x28689a, `${window.currentShip}_glow_001.png`, 9, false);
    this._shipSpriteLayer = ds(_0x1872a7, _0xf42f36, _0x28689a, `${window.currentShip}_001.png`, 10, false);
    this._shipOverlayLayer = ds(_0x1872a7, _0xf42f36, _0x28689a, `${window.currentShip}_2_001.png`, 8, false);
    this._shipExtraLayer = ds(_0x1872a7, _0xf42f36, _0x28689a, `${window.currentShip}_extra_001.png`, 12, false);
    if (this._shipGlowLayer) {
      this._shipGlowLayer.sprite.setTint(window.secondaryColor);
      this._shipGlowLayer.sprite._glowEnabled = false;
    }
    if (this._shipSpriteLayer) {
      this._shipSpriteLayer.sprite.setTint(window.mainColor);
    } else {
      let _0x100643 = _0x1872a7.add.polygon(_0xf42f36, _0x28689a, [{
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
    this._ballGlowLayer = ds(_0x1872a7, _0xf42f36, _0x28689a, `${window.currentBall}_glow_001.png`, 9, false);
    this._ballSpriteLayer = ds(_0x1872a7, _0xf42f36, _0x28689a, `${window.currentBall}_001.png`, 10, false);
    this._ballOverlayLayer = ds(_0x1872a7, _0xf42f36, _0x28689a, `${window.currentBall}_2_001.png`, 8, false);
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
    this._waveGlowLayer = ds(_0x1872a7, _0xf42f36, _0x28689a, "player_dart_00_glow_001.png", 9, false);
    this._waveOverlayLayer = ds(_0x1872a7, _0xf42f36, _0x28689a, "player_dart_00_2_001.png", 8, false);
    this._waveExtraLayer = null;
    this._waveSpriteLayer = ds(_0x1872a7, _0xf42f36, _0x28689a, "player_dart_00_001.png", 10, false);
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
    this._allLayers = [...this._playerLayers, ...this._ballLayers, ...this._waveLayers, ...this._shipLayers];
  }
  _initParticles(_0x538533) {
    this._particleEmitter = _0x538533.add.particles(0, 0, "GJ_WebSheet", {
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
    this._flyParticleEmitter = _0x538533.add.particles(0, 0, "GJ_WebSheet", {
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
    this._flyParticle2Emitter = _0x538533.add.particles(0, 0, "GJ_WebSheet", {
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
    this._shipDragEmitter = _0x538533.add.particles(0, 0, "GJ_WebSheet", {
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
    this._landEmitter1 = _0x538533.add.particles(0, 0, "GJ_WebSheet", {
      ..._0x57911a
    });
    this._landEmitter2 = _0x538533.add.particles(0, 0, "GJ_WebSheet", {
      ..._0x57911a
    });
    this._aboveContainer = _0x538533.add.container(0, 0);
    this._aboveContainer.setDepth(13);
    this._aboveContainer.add(this._landEmitter1);
    this._aboveContainer.add(this._landEmitter2);
    this._landIdx = false;
    this._streak = new cs(this._scene, "streak_01", 0.231, 10, 8, 100, window.secondaryColor, 0.7);
    this._streak.addToContainer(this._gameLayer.container, 8);
  }
  _updateParticles(_0xc43238, _0x52b718, _0x5af874) {
    if (this.p.isDead) {
      return;
    }
    const _0x119eb7 = this._scene._playerWorldX;
    const _0x519d38 = b(this.p.y);
    this._particleEmitter.particleX = _0x119eb7 - 20;
    this._particleEmitter.particleY = _0x519d38 + (this.p.gravityFlipped ? -26 : 26);
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
      const _0x216018 = this.p.isWave ? 0 : -24;
      const _0x2baeac = this.p.isWave ? 16 : 18;
      const _0x75c380 = _0x119eb7 + _0x216018 * _0xe76a85 - _0x2baeac * _0x26ec65;
      const _0x2b31d7 = _0x519d38 + _0x216018 * _0x26ec65 + _0x2baeac * _0xe76a85;
      const _0x5d66f4 = (Math.random() * 2 - 1) * 2 * 2;
      this._flyParticleEmitter.particleX = _0x75c380;
      this._flyParticleEmitter.particleY = _0x2b31d7 + _0x5d66f4;
      this._flyParticle2Emitter.particleX = _0x75c380;
      this._flyParticle2Emitter.particleY = _0x2b31d7 + _0x5d66f4;
      this._streak.setPosition(this.p.isWave ? _0x75c380 : _0x75c380 + 8, _0x2b31d7);
    }
    this._streak.update(_0x5af874);
    const _0x3d69d2 = this.p.isFlying;
    if (_0x3d69d2 && !this._flyParticleActive) {
      this._flyParticleEmitter.start();
      this._flyParticleActive = true;
    } else if (!_0x3d69d2 && this._flyParticleActive) {
      this._flyParticleEmitter.stop();
      this._flyParticleActive = false;
    }
    const _0x169e30 = this.p.isFlying && this.p.upKeyDown;
    if (_0x169e30 && !this._flyParticle2Active) {
      this._flyParticle2Emitter.start();
      this._flyParticle2Active = true;
    } else if (!_0x169e30 && this._flyParticle2Active) {
      this._flyParticle2Emitter.stop();
      this._flyParticle2Active = false;
    }
    this._shipDragEmitter.x = h;
    this._shipDragEmitter.particleY = this.p.gravityFlipped ? b(this.p.y) + _0x52b718 - 30 : b(this.p.y) + _0x52b718 + 30;
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
  syncSprites(cameraX, cameraY, _0x3afedf, mirrorOffset) {
    if (this._endAnimating) {
      return;
    }
    const _0x7f0705 = mirrorOffset !== undefined ? mirrorOffset : h;
    const _0x1a433c = b(this.p.y) + cameraY;
    const _0x2907d3 = this._rotation;
    this._lastCameraX = cameraX;
    this._lastCameraY = cameraY;
    this._aboveContainer.x = -cameraX;
    this._aboveContainer.y = cameraY;
    if (this.p.isFlying) {
      const _0x3904f8 = 10;
      const _0x285611 = Math.cos(_0x2907d3);
      const _0x501bf9 = Math.sin(_0x2907d3);
      const _0x1b1d28 = -_0x3904f8 * _0x501bf9;
      const _0x185f91 = _0x3904f8 * _0x285611;
      const _0x562424 = _0x3904f8 * _0x501bf9;
      const _0x3011c9 = -_0x3904f8 * _0x285611;
      for (const _0x5dc75c of this._shipLayers) {
        if (_0x5dc75c) {
          _0x5dc75c.sprite.x = _0x7f0705 + _0x1b1d28;
          _0x5dc75c.sprite.y = _0x1a433c + _0x185f91;
          _0x5dc75c.sprite.rotation = this.p.mirrored ? -_0x2907d3 : _0x2907d3;
          _0x5dc75c.sprite.scaleY = this.p.gravityFlipped ? -Math.abs(_0x5dc75c.sprite.scaleY) : Math.abs(_0x5dc75c.sprite.scaleY);
          _0x5dc75c.sprite.scaleX = this.p.mirrored ? -Math.abs(_0x5dc75c.sprite.scaleX) : Math.abs(_0x5dc75c.sprite.scaleX);
        }
      }
      for (const _0x536f40 of this._playerLayers) {
        if (_0x536f40) {
          _0x536f40.sprite.x = _0x7f0705 + _0x562424;
          _0x536f40.sprite.y = _0x1a433c + _0x3011c9;
          _0x536f40.sprite.rotation = this.p.mirrored ? -_0x2907d3 : _0x2907d3;
          _0x536f40.sprite.scaleY = this.p.gravityFlipped ? -Math.abs(_0x536f40.sprite.scaleY) : Math.abs(_0x536f40.sprite.scaleY);
          _0x536f40.sprite.scaleX = this.p.mirrored ? -Math.abs(_0x536f40.sprite.scaleX) : Math.abs(_0x536f40.sprite.scaleX);
        }
      }
    } else {
      for (const _0x2c61a1 of this._allLayers) {
        if (_0x2c61a1) {
          _0x2c61a1.sprite.x = _0x7f0705;
          _0x2c61a1.sprite.y = _0x1a433c;
          _0x2c61a1.sprite.rotation = this.p.mirrored ? -_0x2907d3 : _0x2907d3;
          _0x2c61a1.sprite.scaleY = this.p.gravityFlipped ? -Math.abs(_0x2c61a1.sprite.scaleY) : Math.abs(_0x2c61a1.sprite.scaleY);
          _0x2c61a1.sprite.scaleX = this.p.mirrored ? -Math.abs(_0x2c61a1.sprite.scaleX) : Math.abs(_0x2c61a1.sprite.scaleX);
        }
      }
    }
    if (this.p.isWave && this._waveSpriteLayer) {
      const _0x3f036a = this.p.mirrored ? 1 : -1;
      this._waveSpriteLayer.sprite.x += 1.5 * _0x3f036a;
      this._waveSpriteLayer.sprite.y -= 1;
    }
    this._updateParticles(cameraX, cameraY, _0x3afedf);
    if (window.showHitboxes) {
      this.drawHitboxes(this._hitboxGraphics, cameraX, cameraY);
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
    this._rotation = Math.round(this._rotation / Math.PI) * Math.PI;
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
    this._rotation = Math.round(this._rotation / Math.PI) * Math.PI;
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
    this.setWaveVisible(false);
    this.setCubeVisible(!this.p.isBall && !this.p.isFlying);
    this.setBallVisible(this.p.isBall);
    this.setShipVisible(this.p.isFlying);
    this._gameLayer.setFlyMode(false, 0);
  }
  hitGround() {
    const _0x4a38a5 = !this.p.onGround;
    if (!this.p.isFlying && !this.p.isWave) {
      this.p.lastGroundY = this.p.y;
    }
    this.p.yVelocity = 0;
    this.p.onGround = true;
    this.p.canJump = true;
    this.p.isJumping = false;
    if (this.p.isBall) {
      this._rotation = Math.round(this._rotation / Math.PI) * Math.PI;
    } else if (this.p.isWave) {
      this._rotation = 0;
    }
    this.stopRotation();
    if (_0x4a38a5 && !this.p.isFlying && !this.p.isWave) {
      this._landIdx = !this._landIdx;
      const _0x31584b = this._landIdx ? this._landEmitter1 : this._landEmitter2;
      const _0x2248d5 = this._lastCameraX + h;
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
    const _0x3f0446 = _0x3f4b84._playerWorldX - _0x3f4b84._cameraX;
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
  }
  _createExplosionPieces(_0x49be85, _0x13b56e, _0x349a09) {
    const _0x44acaf = this._scene;
    const _0x4a9f23 = _0x349a09 * 40;
    const _0x24dcea = Math.round(_0x4a9f23 * 2);
    const _0x26dcbd = _0x44acaf.make.renderTexture({
      x: 0,
      y: 0,
      width: _0x24dcea,
      height: _0x24dcea,
      add: false
    });
    const _0x5c571a = [this._playerGlowLayer, this._playerOverlayLayer, this._ballGlowLayer, this._ballOverlayLayer, this._waveGlowLayer, this._waveOverlayLayer, this._waveExtraLayer, this._shipGlowLayer, this._shipOverlayLayer, this._playerSpriteLayer, this._playerExtraLayer, this._ballSpriteLayer, this._waveSpriteLayer, this._shipSpriteLayer, this._shipExtraLayer];
    for (const _0x1f09e3 of _0x5c571a) {
      if (!_0x1f09e3 || !_0x1f09e3.sprite.visible) {
        continue;
      }
      const _0x53102a = _0x1f09e3.sprite;
      _0x26dcbd.draw(_0x53102a, _0x24dcea / 2 + (_0x53102a.x - _0x49be85), _0x24dcea / 2 + (_0x53102a.y - _0x13b56e));
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
    const _0x5e8097 = _0x24dcea / _0x28c600;
    const _0x5af9d3 = _0x24dcea / _0x247253;
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
    _0xe9c860.push(_0x24dcea - _0x44e1e1);
    for (let _0x325ce1 = 0; _0x325ce1 < _0x247253 - 1; _0x325ce1++) {
      const _0x37f0ad = Math.round(_0x5af9d3 * (0.55 + Math.random() * _0x4dd9c4 * 2));
      _0x3215fa.push(_0x37f0ad);
      _0x38011e += _0x37f0ad;
      _0x57d0dc.push(_0x38011e);
    }
    _0x3215fa.push(_0x24dcea - _0x38011e);
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
        _0xba83f5.x = _0x43a4e9 + _0x5c6aa9 / 2 - _0x24dcea / 2;
        _0xba83f5.y = -(_0x20396e + _0x20847a / 2 - _0x24dcea / 2);
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
          xVel: _0x422587 + (Math.random() * 2 - 1) * _0x1e87b0,
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
      const _0x3fac01 = this._explosionPieces[_0x4284b0];
      _0x3fac01.timer -= _0x1ed0a8;
      if (_0x3fac01.timer > 0) {
        {
          _0x3fac01.yVel += _0x59eafe;
          _0x3fac01.xVel *= 0.98 + (1 - _0x3e389c) * 0.02;
          let _0x57034b = _0x3fac01.spr.x + _0x3fac01.xVel * _0x3e389c;
          let _0x4c0481 = _0x3fac01.spr.y + _0x3fac01.yVel * _0x3e389c;
          const _0x3f6377 = _0x5a7549 - _0x3fac01.halfSize;
          if (_0x4c0481 > _0x3f6377 && _0x3fac01.yVel > 0) {
            _0x4c0481 = _0x3f6377;
            _0x3fac01.yVel *= -0.8;
            if (Math.abs(_0x3fac01.yVel) < 3) {
              _0x3fac01.yVel = -3;
            }
          }
          _0x3fac01.spr.x = _0x57034b;
          _0x3fac01.spr.y = _0x4c0481;
          _0x3fac01.spr.angle += _0x3fac01.rotDelta * _0x3e389c;
          if (_0x3fac01.timer < _0x3fac01.fadeTime) {
            const _0x2d8b5f = _0x3fac01.timer / _0x3fac01.fadeTime;
            _0x3fac01.spr.setAlpha(_0x2d8b5f);
            if (_0x3fac01.particle) {
              _0x3fac01.particle.setAlpha(_0x2d8b5f);
            }
          }
        }
        _0x4284b0++;
      } else {
        if (_0x3fac01.particle) {
          _0x3fac01.particle.stop();
          _0x3fac01.particle.destroy();
        }
        _0x3fac01.spr.destroy();
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
  _playPortalShine(_0x49e81f) {
    console.log(_0x49e81f)
    const _0x4ed8ff = this._scene;
    const _0xf31b0d = _0x49e81f.x;
    const _0x3824c0 = b(_0x49e81f.portalY);
    const _0x19c6b0 = ["portalshine_02_front_001.png", "portalshine_02_back_001.png"];
    const _0x5d636a = [this._gameLayer.topContainer, this._gameLayer.container];
    for (let _0x34fd8c = 0; _0x34fd8c < 2; _0x34fd8c++) {
      const _0x4bfe30 = R(_0x4ed8ff, _0x19c6b0[_0x34fd8c]);
      if (!_0x4bfe30) {
        continue;
      }
      const _0x34645e = _0x4ed8ff.add.image(_0xf31b0d, _0x3824c0, _0x4bfe30.atlas, _0x4bfe30.frame);
      _0x34645e.setBlendMode(S);
      _0x34645e.setAlpha(0);
      _0x34645e.angle = _0x49e81f.rotationDegrees;
      _0x5d636a[_0x34fd8c].add(_0x34645e);
      _0x4ed8ff.tweens.add({
        targets: _0x34645e,
        alpha: {
          from: 0,
          to: 1
        },
        duration: 50,
        onComplete: () => {
          _0x4ed8ff.tweens.add({
            targets: _0x34645e,
            alpha: 0,
            duration: 400,
            onComplete: () => _0x34645e.destroy()
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
    if (this.flipCooldown == null || this.flipCooldown < Date.now()) {
      this.flipCooldown = Date.now() + 100;
      console.log("flipGravity called: flipped=" + flipped + " current=" + this.p.gravityFlipped);
      if (this.p.gravityFlipped === flipped) {
        return;
      }
      this.p.gravityFlipped = flipped;
      this.p.yVelocity *= _0x11bbde;
      this.p.onGround = false;
      this.p.canJump = false;
      this.p.isJumping = false;
    }
  }
  runRotateAction() {

    this.rotateActionActive = true;
    this.rotateActionTime = 0;
    this.rotateActionDuration = 0.39 / d;
    this.rotateActionStart = this._rotation;
    this.rotateActionTotal = Math.PI * this.flipMod();
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
  slerp2D(_0x11f190, _0xf2c7b9, _0x8b3942) {
    let _0x4ee783 = _0xf2c7b9 - _0x11f190;
    while (_0x4ee783 > Math.PI) {
      _0x4ee783 -= Math.PI * 2;
    }
    while (_0x4ee783 < -Math.PI) {
      _0x4ee783 += Math.PI * 2;
    }
    return _0x11f190 + _0x4ee783 * _0x8b3942;
  }
  updateGroundRotation(_0x5c24f7) {
    if (this.p.isBall || this.p.isWave) {
      return;
    }
    let _0x183c2a = this.convertToClosestRotation();
    let _0x108955 = 0.47250000000000003;
    let _0x17a9a6 = Math.min(_0x5c24f7 * 1, _0x108955 * _0x5c24f7);
    this._rotation = this.slerp2D(this._rotation, _0x183c2a, _0x17a9a6);
  }
  updateBallRoll(_0x1dd8af) {
    const _0x136f29 = this.p.gravityFlipped ? -1 : 1;
    this._rotation += _0x1dd8af / (g / 2) * _0x136f29;
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
      return this.p.yVelocity > 3.832796;
    } else {
      return this.p.yVelocity < 3.832796;
    }
  }
  updateJump(_0x3d1c6f) {
    if (this.p.pendingVelocity !== null) {
      this.p.yVelocity = this.p.pendingVelocity;
      this.p.pendingVelocity = null;
    }
    if (this.p.isFlying) {
      this._updateFlyJump(_0x3d1c6f);
    } else if (this.p.isWave) {
      this._updateWaveJump();
    } else if (this.p.isBall) {
      this._updateBallJump(_0x3d1c6f);
    } else if (this.p.upKeyDown && this.p.canJump) {
      this.p.isJumping = true;
      this.p.onGround = false;
      this.p.canJump = false;
      this.p.upKeyPressed = false;
      this.p.yVelocity = this.flipMod() * 22.360064;
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
        _0x47ed2a = this.p.gravityFlipped ? this.p.yVelocity > p * 4 : this.p.yVelocity < -(p * 4);
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
    const _0x144266 = p * 0.6;
    this.runRotateAction();
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
      const _0x1439be = this.p.gravityFlipped ? this.p.yVelocity > p * 4 : this.p.yVelocity < -(p * 4);
      if (_0x1439be) {
        this.p.onGround = false;
      }
    }
  }
  _updateWaveJump() {
    const _0x1a4d8f = 10.3860036;
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
    this._rotation = _0x312a7f === 0 ? 0 : _0x312a7f > 0 ? -Math.PI / 4 : Math.PI / 4;
  }
  checkCollisions(_0x2f5078) {
    const _0x6bfa06 = 30;
    const _0x3c691e = _0x2f5078 + h;
    const _0x8e0d28 = this.p.y;
    const _0x37040a = this.p.lastY;
    const _0x11ee2f = this.p.isFlying || this.p.isWave ? 12 : 20;
    this.p.collideTop = 0;
    this.p.collideBottom = 0;
    this.p.onCeiling = false;
    let _0x30410f = false;
    let _boostedThisStep = false;
    const _0x198534 = this._gameLayer.getNearbySectionObjects(_0x3c691e);
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
      if (!(_0x3c691e + 30 <= rotatedLeft) && !(_0x3c691e - 30 >= rotatedRight) && !(_0x8e0d28 + _0x6bfa06 <= rotatedTop) && !(_0x8e0d28 - _0x6bfa06 >= rotatedBottom)) {
        const _colType = gameObj.type;
        if (_colType === "portal_fly") {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this.exitBallMode();
            this.exitWaveMode();
            this.enterShipMode(gameObj);
          }
        } else if (_colType === portalWaveType) {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this.enterWaveMode(gameObj);
          }
        } else if (_colType === "portal_cube") {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this.exitShipMode();
            this.exitBallMode();
            this.exitWaveMode();
          }
        } else if (_colType === "portal_ball") {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this.exitShipMode();
            this.exitWaveMode();
            this.enterBallMode(gameObj);
          }
        } else if (_colType === "portal_gravity_down") {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this.flipGravity(false, this.p.isBall ? 0.5: 0.5);
          }
        } else if (_colType === "portal_gravity_up") {
          if (!gameObj.activated) {
            gameObj.activated = true;
            this._playPortalShine(gameObj);
            this.flipGravity(true, this.p.isBall ? 0.5: 0.5);
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
        } else if (_colType === jumpPadType) {
          if (!gameObj.activated) {
            gameObj.activated = true;
            const _padId = gameObj.padId;
            const _grav = p;
            const _fm = this.flipMod();
            let _padVel = 0;
            let _padFlip = false;
            let _padNextTickVel = null;
            if (_padId === 3005) {
              const _spFloor = this._gameLayer.getFloorY();
              const _spCeil = this._gameLayer.getCeilingY() || f;
              if (!this.p.gravityFlipped) {
                this.p.y = _spCeil - 30;
              } else {
                this.p.y = _spFloor + 30;
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
          const _needsClick = _isDash ? this.p.upKeyDown : this.p.upKeyPressed;
          if (!gameObj.activated && _needsClick) {
            if (_isDash) {
              gameObj._dashHoldTicks = (gameObj._dashHoldTicks || 0) + 1;
              if (_orbId === 1704 && gameObj._dashHoldTicks < 2) {
              } else if (_orbId === 1751 && gameObj._dashHoldTicks < 2) {
                gameObj.activated = true;
                this.p.yVelocity *= 0.5;
                this.flipGravity(!this.p.gravityFlipped);
                this.p.upKeyPressed = false;
                _boostedThisStep = true;
              } else {
                gameObj.activated = true;
                const _dashAngleDeg = gameObj.orbRotation || 0;
                let _clampedAngle = _dashAngleDeg;
                if (_clampedAngle > 270) { _clampedAngle -= 360; }
                if (_clampedAngle >= 90 && _clampedAngle <= 270) { _clampedAngle = 180 - _clampedAngle; }
                _clampedAngle = Math.max(-70, Math.min(70, _clampedAngle));
                const _dashRad = _clampedAngle * Math.PI / 180;
                const _dashSpeed = Math.abs(this.p.yVelocity) > 0.1 ? Math.abs(this.p.yVelocity) : 10.3860036;
                this.p.yVelocity = Math.sin(_dashRad) * _dashSpeed * this.flipMod();
                if (_orbId === 1751) {
                  this.flipGravity(!this.p.gravityFlipped);
                }
                this.p.onGround = false;
                this.p.canJump = false;
                this.p.upKeyPressed = false;
                _boostedThisStep = true;
              }
            } else {
              gameObj.activated = true;
              const _grav = p;
              const _fm = this.flipMod();
              const _cubeJump = 22.360064;
              let _orbVel = 0;
              let _flipAfter = false;
              if (_orbId === 1594) {
                this.flipGravity(!this.p.gravityFlipped);
                this.p.upKeyPressed = false;
                _boostedThisStep = true;
              } else {
                if (this.p.isFlying) {
                  if (_orbId === 36) { _orbVel = 8 * _grav; }
                  else if (_orbId === 141) { _orbVel = _cubeJump * 0.37; }
                  else if (_orbId === 1333) { _orbVel = _cubeJump; }
                  else if (_orbId === 84) { _orbVel = _cubeJump * 0.4; _flipAfter = true; }
                  else if (_orbId === 1022) { _orbVel = _cubeJump * -0.7; _flipAfter = true; }
                  else if (_orbId === 1330) { _orbVel = -14 * _grav; }
                } else if (this.p.isBall) {
                  const _ballBase = _cubeJump * 0.7;
                  if (_orbId === 36) { _orbVel = _ballBase; }
                  else if (_orbId === 141) { _orbVel = _ballBase * 0.77; }
                  else if (_orbId === 1333) { _orbVel = _ballBase * 1.34; }
                  else if (_orbId === 84) { _orbVel = _ballBase * 0.4; _flipAfter = true; }
                  else if (_orbId === 1022) { _orbVel = _ballBase * -1; _flipAfter = true; }
                  else if (_orbId === 1330) { _orbVel = -15 * _grav; }
                } else {
                  if (_orbId === 36) { _orbVel = _cubeJump; }
                  else if (_orbId === 141) { _orbVel = _cubeJump * 0.72; }
                  else if (_orbId === 1333) { _orbVel = _cubeJump * 1.38; }
                  else if (_orbId === 84) { _orbVel = _cubeJump * 0.4; _flipAfter = true; }
                  else if (_orbId === 1022) { _orbVel = _cubeJump * -1; _flipAfter = true; }
                  else if (_orbId === 1330) { _orbVel = -15 * _grav; }
                }
                this.p.isJumping = true;
                this.p.onGround = false;
                this.p.canJump = false;
                this.p.upKeyPressed = false;
                this.p.yVelocity = _fm * _orbVel;
                if (_orbId === 1330 && this.p.isFlying) {
                  this.p.wasBoosted = false;
                } else if (_orbId === 1330) {
                  this.p.wasBoosted = false;
                }
                this.runRotateAction();
                _boostedThisStep = true;
                if (_flipAfter) {
                  this.flipGravity(!this.p.gravityFlipped);
                }
              }
            }
          } else if (_isDash && !this.p.upKeyDown) {
            gameObj._dashHoldTicks = 0;
          }
        } else if (_colType === hazardType) {
          if (!window.noClip){
            this.killPlayer();
          }
          return;
        } else if (_colType === solidType) {
          let _0x146a97 = _0x8e0d28 - _0x6bfa06 + _0x11ee2f;
          let _0x869e42 = _0x37040a - _0x6bfa06 + _0x11ee2f;
          let _0x3e7199 = _0x8e0d28 + _0x6bfa06 - _0x11ee2f;
          let _0x135a9d = _0x37040a + _0x6bfa06 - _0x11ee2f;
          const _0x55559d = 9;
          const _0x3c1654 = _0x3c691e + _0x55559d > left && _0x3c691e - _0x55559d < right && _0x8e0d28 + _0x55559d > top && _0x8e0d28 - _0x55559d < bottom;
          const _0xLandBot = (this.p.yVelocity <= 0 || this.p.onGround) && (_0x146a97 >= bottom || _0x869e42 >= bottom);
          const _0xLandTop = (this.p.yVelocity >= 0 || this.p.onGround) && (_0x3e7199 <= top || _0x135a9d <= top);
          const _0x2841ea = this.p.gravityFlipped ? _0xLandTop : _0xLandBot;
          if (_0x3c1654 && !_0x2841ea) {
            if (!window.noClip){
              this.killPlayer();
            }
            return;
          }
          if (_0x3c691e + 30 - 5 > left && _0x3c691e - 30 + 5 < right) {
            if (!this.p.gravityFlipped && (_0x146a97 >= bottom || _0x869e42 >= bottom) && (this.p.yVelocity <= 0 || this.p.onGround)) {
              this.p.y = bottom + _0x6bfa06;
              this.hitGround();
              _0x30410f = true;
              this.p.collideBottom = bottom;
              if (!this.p.isFlying) {
                this._checkSnapJump(gameObj);
              }
              continue;
            }
            if (this.p.gravityFlipped && !this.p.isFlying && (_0x3e7199 <= top || _0x135a9d <= top) && (this.p.yVelocity >= 0 || this.p.onGround)) {
              this.p.y = top - _0x6bfa06;
              this.hitGround();
              _0x30410f = true;
              this.p.onCeiling = true;
              this.p.collideTop = top;
              if (!this.p.isFlying) {
                this._checkSnapJump(gameObj);
              }
              continue;
            }
            if ((_0x3e7199 <= top || _0x135a9d <= top) && (this.p.yVelocity >= 0 || this.p.onGround) && this.p.isFlying) {
              this.p.y = top - _0x6bfa06;
              this.hitGround();
              this.p.onCeiling = true;
              this.p.collideTop = top;
              continue;
            }
            if (!this.p.gravityFlipped && (_0x3e7199 <= top || _0x135a9d <= top) && this.p.yVelocity >= 0) {
              this.p.yVelocity = 0;
              this.p.y = top - _0x6bfa06;
              this.p.collideTop = top;
              continue;
            }
            if (this.p.gravityFlipped && !this.p.isFlying && (_0x146a97 >= bottom || _0x869e42 >= bottom) && this.p.yVelocity <= 0) {
              this.p.yVelocity = 0;
              this.p.y = bottom + _0x6bfa06;
              this.p.collideBottom = bottom;
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
        }
        return;
      }
    }
    let _0x3020c8 = this._gameLayer.getFloorY();
    if (!_0x30410f && !_boostedThisStep) {
      if (!this.p.gravityFlipped && this.p.y <= _0x3020c8 + 30) {
        this.p.y = _0x3020c8 + 30;
        this.hitGround();
      }
      if (this.p.gravityFlipped && !this.p.isFlying) {
        let gravCeilY = this._gameLayer.getCeilingY();
        if (gravCeilY === null) {
          gravCeilY = f;
        }
        if (this.p.y >= gravCeilY - 30) {
          this.p.y = gravCeilY - 30;
          this.hitGround();
          this.p.onCeiling = true;
        }
      }
    }
    let _0x496456 = this._gameLayer.getCeilingY();
    if (_0x496456 !== null && this.p.y >= _0x496456 - 30) {
      this.p.y = _0x496456 - 30;
      this.hitGround();
      this.p.onCeiling = true;
    }
    if (this.p.isFlying || this.p.isWave) {
      const _0x354b7c = this.p.y <= _0x3020c8 + 30;
      const _0xdc296 = _0x496456 !== null && this.p.y >= _0x496456 - 30;
      if (!_0x30410f && !_0x354b7c && this.p.collideTop === 0 && !_0xdc296) {
        this.p.onGround = false;
      }
    }
  }
  drawHitboxes(_0x691b2a, _0x52bd8a, _0x5aece4) {
    _0x691b2a.clear();
    if (/*!this._showHitboxes*/false) {
      return;
    }
    const _0x5dd446 = 30;
    const _0xce3c85 = 30;
    const _0x2cf1c7 = _0x52bd8a + h;
    const _0x5e3ebe = this.p.y;
    const _0x51832d = this.p.isFlying || this.p.isWave ? 12 : 20;
    const _0x286071 = this._gameLayer.getNearbySectionObjects(_0x2cf1c7);
    for (let _0x42ccb8 of _0x286071) {
      let _0x52deab = _0x42ccb8.x - _0x52bd8a;
      let _0x3e179d = b(_0x42ccb8.y) + _0x5aece4;
      let _0x17cd1a = 65280;
      if (_0x42ccb8.type === hazardType) {
        _0x17cd1a = 16729156;
      } else if (_0x42ccb8.type === "portal_fly" || _0x42ccb8.type === "portal_cube" || _0x42ccb8.type === "portal_ball" || _0x42ccb8.type === portalWaveType) {
        _0x17cd1a = 4491519;
      } else if (_0x42ccb8.type === "portal_gravity_down" || _0x42ccb8.type === "portal_gravity_up") {
        _0x17cd1a = 16776960;
      } else if (_0x42ccb8.type === "portal_mirror_on" || _0x42ccb8.type === "portal_mirror_off") {
        _0x17cd1a = 16744448;
      } else if (_0x42ccb8.type === jumpPadType) {
        _0x17cd1a = 16744192;
      } else if (_0x42ccb8.type === jumpRingType) {
        _0x17cd1a = 16711935;
      }
      _0x691b2a.lineStyle(2, _0x17cd1a, 0.7);
      _0x691b2a.strokeRect(_0x52deab - _0x42ccb8.w / 2, _0x3e179d - _0x42ccb8.h / 2, _0x42ccb8.w, _0x42ccb8.h);
    }
    const _0x7a132d = h;
    const _0x1e788a = b(_0x5e3ebe) + _0x5aece4;
    _0x691b2a.lineStyle(2, 65535, 0.8);
    _0x691b2a.strokeRect(_0x7a132d - _0x5dd446, _0x1e788a - _0xce3c85, g, g);
    _0x691b2a.lineStyle(2, 16776960, 0.8);
    _0x691b2a.strokeRect(_0x7a132d - _0x5dd446 + 5, _0x1e788a - _0xce3c85, 50, g);
    _0x691b2a.lineStyle(2, 16711680, 0.8);
    _0x691b2a.strokeRect(_0x7a132d - _0x5dd446, _0x1e788a - _0xce3c85 + 5, g, 50);
    let _0x1eec42 = b(_0x5e3ebe - _0xce3c85 + _0x51832d) + _0x5aece4;
    let _0xf6f69b = b(_0x5e3ebe + _0xce3c85 - _0x51832d) + _0x5aece4;
    _0x691b2a.lineStyle(2, 16746496, 0.9);
    _0x691b2a.lineBetween(_0x7a132d - _0x5dd446 - 8, _0x1eec42, _0x7a132d + _0x5dd446 + 8, _0x1eec42);
    _0x691b2a.lineBetween(_0x7a132d - _0x5dd446 - 8, _0xf6f69b, _0x7a132d + _0x5dd446 + 8, _0xf6f69b);
    _0x691b2a.lineStyle(2, 16777215, 1);
    _0x691b2a.strokeRect(_0x7a132d - 9, _0x1e788a - 9, 36, 18);
  }
  setShowHitboxes(_0x2133d2) {
    this._showHitboxes = /*_0x2133d2*/ true;
  }
  playEndAnimation(_0x24408e, _0x281588, _0x54bbf4) {
    this._endAnimating = true;
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
        const _0x3eda1c = _0x51c4a8.val;
        const _0x2478d6 = (1 - _0x3eda1c) ** 3 * _0x1295ea + (1 - _0x3eda1c) ** 2 * 3 * _0x3eda1c * _0x1295ea + (1 - _0x3eda1c) * 3 * _0x3eda1c ** 2 * _0x1f2e19 + _0x3eda1c ** 3 * _0x457676;
        const _0x148e69 = (1 - _0x3eda1c) ** 3 * _0x47ae60 + (1 - _0x3eda1c) ** 2 * 3 * _0x3eda1c * _0x47ae60 + (1 - _0x3eda1c) * 3 * _0x3eda1c ** 2 * _0x8bc9f4 + _0x3eda1c ** 3 * _0x3ade39;
        const _0x3d0365 = _0x2478d6 - _0x3729ef._cameraX;
        const _0x3790a9 = b(_0x148e69) + _0x3729ef._cameraY;
        const _0x1cb4d3 = 1 - _0x3eda1c * _0x3eda1c;
        const _0x1d2e2f = _0x3fc5a5[0].spr.rotation;
        const _0xd3cb2a = Math.cos(_0x1d2e2f);
        const _0x2f86c2 = Math.sin(_0x1d2e2f);
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
  constructor(_0x3627e5) {
    this._scene = _0x3627e5;
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
  startMusic() {
    if (this._music) {
      this._music.stop();
      this._music.destroy();
    }
    this._music = this._scene.sound.add(window.currentlevel[0], {
      loop: true,
      volume: this._effectiveVolume()
    });
    this._music.play();
    this._setupAnalyser();
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
    const _0x3b9c6b = this._scene._sfxVolume !== undefined ? this._scene._sfxVolume : 1;
    _0x20f8e7.volume = (_0x20f8e7.volume || 1) * _0x3b9c6b;
    this._scene.sound.play(_0x344122, _0x20f8e7);
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
    this._menuCameraX = -h;
    this._prevCameraX = -h;
    this._bg = this.add.tileSprite(0, 0, r, n, "game_bg_01").setOrigin(0, 0).setScrollFactor(0).setDepth(-10);
    const _0x15d27a = this.textures.get("game_bg_01").source[0].height;
    this._bgInitY = _0x15d27a - n - o;
    this._cameraX = -h;
    this._cameraY = 0;
    this._cameraXRef = {
      get value() {
        return this._v;
      },
      _v: -h
    };
    this._state = new M();
    this._level = new us(this, this._cameraXRef);
    this._player = new ps(this, this._state, this._level);
    this._colorManager = new ms();
    if (this._audio == null) {
      this._audio = new ys(this);
    }
    let _0x591888 = this.cache.text.get(window.currentlevel[2]);
    if (_0x591888) {
      this._level.loadLevel(_0x591888);
    }
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
        _0x3c2a3e.x = this._glitterCenterX + (Math.random() * 2 - 1) * (r / 1.8);
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
      url: "https://store.steampowered.com/app/322170/Geometry_Dash"
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
    this._menuFsBtn = this.add.image(33, 33, "GJ_WebSheet", _0x28fa5b ? "toggleFullscreenOff_001.png" : "toggleFullscreenOn_001.png").setScrollFactor(0).setDepth(30).setScale(0.64).setAlpha(0.8).setTint(Phaser.Display.Color.GetColor(0, Math.round(102), 255)).setInteractive();
    this._expandHitArea(this._menuFsBtn, 1.5);
    this._makeBouncyButton(this._menuFsBtn, 0.64, () => {
      const _0x26b7c = !this.scale.isFullscreen;
      this._menuFsBtn.setTexture("GJ_WebSheet", _0x26b7c ? "toggleFullscreenOff_001.png" : "toggleFullscreenOn_001.png");
      this._expandHitArea(this._menuFsBtn, 1.5);
      this._toggleFullscreen();
    }, () => this._menuActive);
    this._menuInfoBtn = this.add.image(r - 30 - 3, 33, "GJ_WebSheet", "GJ_infoIcon_001.png").setScrollFactor(0).setDepth(30).setScale(0.64).setAlpha(0.8).setTint(Phaser.Display.Color.GetColor(255, 255, 255)).setInteractive();
    this._expandHitArea(this._menuInfoBtn, 1.5);
    this._makeBouncyButton(this._menuInfoBtn, 0.64, () => {
      this._buildInfoPopup();
    }, () => this._menuActive && !this._infoPopup);
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
      this._audio.stopMusic();
      this._audio.playEffect("playSound_01", {
        volume: 1
      });
      this._startGame();
      this._levelLabel.setVisible(false)
      this._leftBtn.setVisible(false)
      this._rightBtn.setVisible(false)
      this._percentageLabel.setVisible(true)
      this._percentageLabel.setDepth(1000)
    }, () => this._menuActive && !this._playBtnPressed);
    this._positionMenuItems();
    this._spaceWasDown = false;
    this._spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this._upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this._wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this._leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this._rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this._aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this._dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this._percentageLabel = this.add.bitmapText(r / 2, 20, "bigFont", "0.00%", 30).setOrigin(0.5, 0.5).setVisible(false);
    this._pauseBtn = this.add.image(r - 30, 30, "GJ_WebSheet", "GJ_pauseBtn_clean_001.png").setScrollFactor(0).setDepth(30).setAlpha(75 / 255).setVisible(false);
    this._pauseBtn.setInteractive();
    this._expandHitArea(this._pauseBtn, 2);
    this._pauseBtn.on("pointerdown", () => this._pauseGame());
    this._escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this._escKey.on("down", () => {
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
      if (!this._menuActive && !this._slideIn) {
        this._restartLevel();
      }
    });
    this._paused = false;
    this._pauseContainer = null;
    this._sfxVolume = localStorage.getItem("userSfxVol") ?? 1;
    this.input.on("pointerdown", () => {
      if (!this._menuActive && !this._paused) {
        this._pushButton();
      }
    });
    this.input.on("pointerup", () => {
      if (!this._menuActive && !this._paused) {
        this._releaseButton();
      }
    });
    window.addEventListener("pointerup", () => this._releaseButton());
    window.addEventListener("touchend", () => this._releaseButton());
    this.scale.on("enterfullscreen", () => this._onFullscreenChange(true));
    this.scale.on("leavefullscreen", () => this._onFullscreenChange(false));
    this._buildHUD();
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
    this._levelLabel = this.add.bitmapText(r - 165, 400, "bigFont", window.currentlevel[1], 30).setOrigin(0.5, 0.5);
    this._levelLabel.setScale(Math.min(1, 220 / this._levelLabel.width));
    
    this._leftBtn = this.add.image(r - 300, 400, "GJ_GameSheet03", "edit_leftBtn_001.png").setScrollFactor(0).setDepth(30).setInteractive();
    this._rightBtn = this.add.image(r - 30, 400, "GJ_GameSheet03", "edit_leftBtn_001.png").setScrollFactor(0).setDepth(30).setInteractive();
    this._rightBtn.setRotation(Math.PI);
    window.scene = this.scene;
    window.rightbuttoncallback = function() {
      let names = [
        "Stereo Madness", "Back on Track", "Polargeist", "Dry Out", "Base After Base", "Cant Let Go", "Jumper", "Time Machine",
        "Cycles", "xStep", "Clutterfunk", "Theory of Everything", "Electroman Adventures", "Clubstep", "Electrodynamix", "Hexagon Force",
        "Blast Processing", "Theory of Everything 2", "Geometrical Dominator", "Deadlocked", "Fingerdash"
      ]
      let index = Number(window.currentlevel[2].split("_")[1]) - 1
      index++
      if (index >= names.length) index = 98
      window.currentlevel = [
        index != 98 ? names[index].toLowerCase().replace(/ /g, "_") : "every_end",
        index != 98 ? names[index] : "Every End",
        `level_${index+1}`,
        index != 98 ? "RobTop" : "MindCap & More"
      ]
      window.scene.restart();
    };
    window.leftbuttoncallback = function() {
      let names = [
        "Stereo Madness", "Back on Track", "Polargeist", "Dry Out", "Base After Base", "Cant Let Go", "Jumper", "Time Machine",
        "Cycles", "xStep", "Clutterfunk", "Theory of Everything", "Electroman Adventures", "Clubstep", "Electrodynamix", "Hexagon Force",
        "Blast Processing", "Theory of Everything 2", "Geometrical Dominator", "Deadlocked", "Fingerdash"
      ]
      let index = Number(window.currentlevel[2].split("_")[1]) - 1
      if (index === 98) {
        index = names.length - 1
      } else {
        index--
        if (index < 0) index = 0
      }
      window.currentlevel = [
        names[index].toLowerCase().replace(/ /g, "_"),
        names[index],
        `level_${index + 1}`,
        "RobTop"
      ]
      window.scene.restart();
    };
    this._makeBouncyButton(this._leftBtn, 1, () => {window.leftbuttoncallback()}, () => this._menuActive);
    this._makeBouncyButton(this._rightBtn, 1, () => {window.rightbuttoncallback()}, () => this._menuActive);
    if (!this._audio.isplaying()) {
      this._audio.startMenuMusic();
    }
  }
  _buildHUD() {
    this._attemptsLabel = this.add.bitmapText(0, 0, "bigFont", "Attempt 1", 65).setOrigin(0.5, 0.5).setVisible(false);
    this._level.topContainer.add(this._attemptsLabel);
    this._positionAttemptsLabel();
    this._fpsText = this.add.text(r - 20, 10, "", {
      fontSize: "28px",
      fill: "#ff0000",
      fontFamily: "Arial"
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(999).setVisible(false);
    this._fpsAccum = 0;
    this._fpsFrames = 0;
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H).on("down", () => {
      this._fpsText.setVisible(!this._fpsText.visible);
    });
  }
  toggleGlitter(_0x34c21a) {
    if (_0x34c21a) {
      this._glitterEmitter.start();
    } else {
      this._glitterEmitter.stop();
    }
  }
  _setParticleTimeScale(_0x41fa6a) {
    const _0x2a8756 = _0x3d71c7 => {
      if (_0x3d71c7 && _0x3d71c7.type === "ParticleEmitter") {
        _0x3d71c7.timeScale = _0x41fa6a;
      }
      if (_0x3d71c7 && _0x3d71c7.list) {
        _0x3d71c7.list.forEach(_0x2a8756);
      }
    };
    _0x2a8756(this._level.container);
    _0x2a8756(this._level.topContainer);
    if (this._glitterEmitter) {
      this._glitterEmitter.timeScale = _0x41fa6a;
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
      if (this._pauseContainer) {
        this._pauseContainer.destroy();
        this._pauseContainer = null;
      }
    }
  }
  _buildPauseOverlay() {
    const _0x13af33 = r / 2;
    const _0xf70e04 = 320;
    const _0x4eb71b = r - 40;
    this._pauseContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(100);
    const _0x505665 = this.add.rectangle(_0x13af33, _0xf70e04, r, n, 0, 75 / 255);
    _0x505665.setInteractive();
    this._pauseContainer.add(_0x505665);
    const _0x103191 = this.textures.get("square04_001").source[0].width * 0.325;
    const _0x954813 = this._drawScale9(_0x13af33, _0xf70e04, _0x4eb71b, 600, "square04_001", _0x103191, 0, 150 / 255);
    this._pauseContainer.add(_0x954813);
    const _0x3874ed = this.scale.isFullscreen;
    const _0x426993 = this.add.image(_0x13af33 - _0x4eb71b / 2 + 40, 60, "GJ_WebSheet", _0x3874ed ? "toggleFullscreenOff_001.png" : "toggleFullscreenOn_001.png").setScale(0.64).setInteractive();
    this._expandHitArea(_0x426993, 2.5);
    this._pauseContainer.add(_0x426993);
    this._makeBouncyButton(_0x426993, 0.64, () => {
      const _0x23c9e5 = !this.scale.isFullscreen;
      _0x426993.setTexture("GJ_WebSheet", _0x23c9e5 ? "toggleFullscreenOff_001.png" : "toggleFullscreenOn_001.png");
      this._expandHitArea(_0x426993, 2.5);
      this._toggleFullscreen();
    });
    this._pauseContainer.add(this.add.bitmapText(_0x13af33, 65, "bigFont", window.currentlevel[1], 40).setOrigin(0.5, 0.5));
    const _0x21dacf = 170;
    const _0x46bab2 = this._bestPercent || 0;
    const _0x38b8d1 = this.add.image(_0x13af33, _0x21dacf, "GJ_WebSheet", "GJ_progressBar_001.png").setTint(0).setAlpha(125 / 255);
    this._pauseContainer.add(_0x38b8d1);
    const _0x1d49a9 = this.textures.getFrame("GJ_WebSheet", "GJ_progressBar_001.png");
    const _0xb5ab6f = _0x1d49a9 ? _0x1d49a9.width : 680;
    const _0x1e6502 = _0x1d49a9 ? _0x1d49a9.height : 40;
    const _0x3782ca = Math.max(1, Math.floor(_0xb5ab6f * (_0x46bab2 / 100)));
    const _0x3d0987 = this.add.image(0, 0, "GJ_WebSheet", "GJ_progressBar_001.png").setTint(65280).setScale(0.992, 0.86).setOrigin(0, 0.5).setCrop(0, 0, _0x3782ca, _0x1e6502);
    _0x3d0987.setPosition(_0x13af33 - _0xb5ab6f * 0.992 / 2, _0x21dacf);
    this._pauseContainer.add(_0x3d0987);
    this._pauseContainer.add(this.add.bitmapText(_0x13af33, _0x21dacf, "bigFont", _0x46bab2 + "%", 30).setOrigin(0.5, 0.5).setScale(0.7));
    this._pauseContainer.add(this.add.bitmapText(_0x13af33, 130, "bigFont", "Normal Mode", 30).setOrigin(0.5, 0.5).setScale(0.78));
    const _0x4791ac = [{
      frame: "GJ_replayBtn_001.png",
      action: () => {
        this._resumeGame();
        this._restartLevel();
      }
    }, {
      frame: "GJ_playBtn2_001.png",
      action: () => this._resumeGame()
    }, {
      frame: "GJ_menuBtn_001.png",
      action: () => {
        this._audio.playEffect("quitSound_01");
        this._audio.stopMusic();
        this._resumeGame();
        this.scene.restart();
      }
    }];
    const _0x25aa59 = _0x4791ac.map(_0x120c08 => {
      const _0x44c01c = this.textures.getFrame("GJ_WebSheet", _0x120c08.frame);
      if (_0x44c01c) {
        return _0x44c01c.width;
      } else {
        return 246;
      }
    });
    let _0x599a9b = _0x13af33 - (_0x25aa59.reduce((_0x53adf8, _0x10ae31) => _0x53adf8 + _0x10ae31, 0) + (_0x4791ac.length - 1) * 40) / 2;
    for (let _0x18feee = 0; _0x18feee < _0x4791ac.length; _0x18feee++) {
      const _0x17809c = _0x4791ac[_0x18feee];
      const _0x228482 = _0x25aa59[_0x18feee];
      const _0x7f0786 = this.add.image(_0x599a9b + _0x228482 / 2, 330, "GJ_WebSheet", _0x17809c.frame).setInteractive();
      this._pauseContainer.add(_0x7f0786);
      this._makeBouncyButton(_0x7f0786, 1, _0x17809c.action);
      _0x599a9b += _0x228482 + 40;
    }
    const _0x1008ae = 500;
    const _0x22b43a = 0.7;
    const _0x41925a = this.textures.getFrame("GJ_WebSheet", "slidergroove.png");
    const _0x372782 = _0x41925a ? _0x41925a.width : 420;
    const _0xe34699 = (_0x422be3, _0x4b32e0, _0xaaab25, _0x169b87) => {
      this._pauseContainer.add(this.add.image(_0x422be3 - 180 - 5, _0x1008ae, "GJ_WebSheet", _0x4b32e0).setScale(1.2));
      const _0x51c57b = (_0x372782 - 8) * _0x22b43a;
      const _0x34d1c1 = _0x422be3 - _0x372782 * _0x22b43a / 2 + 2.8;
      const _0xe86505 = _0xaaab25 * _0x51c57b;
      const _0x43dbf4 = this.add.tileSprite(_0x34d1c1, _0x1008ae, _0xe86505 > 0 ? _0xe86505 : 1, 11.2, "sliderBar").setOrigin(0, 0.5).setVisible(_0xe86505 > 0);
      this._pauseContainer.add(_0x43dbf4);
      const _0x4de88c = this.add.image(_0x422be3, _0x1008ae, "GJ_WebSheet", "slidergroove.png").setScale(_0x22b43a);
      this._pauseContainer.add(_0x4de88c);
      const _0x106f98 = _0x34d1c1 + _0xaaab25 * _0x51c57b;
      const _0x441360 = this.add.image(_0x106f98, _0x1008ae, "GJ_WebSheet", "sliderthumb.png").setScale(_0x22b43a).setInteractive({
        draggable: true,
        useHandCursor: true
      });
      this._pauseContainer.add(_0x441360);
      _0x441360.on("pointerdown", () => _0x441360.setTexture("GJ_WebSheet", "sliderthumbsel.png"));
      _0x441360.on("pointerup", () => _0x441360.setTexture("GJ_WebSheet", "sliderthumb.png"));
      _0x441360.on("pointerout", () => _0x441360.setTexture("GJ_WebSheet", "sliderthumb.png"));
      _0x441360.on("drag", (_0x1ac7f7, _0x35b64c) => {
        _0x441360.x = Math.max(_0x34d1c1, Math.min(_0x34d1c1 + _0x51c57b, _0x35b64c));
        const _0x4a1663 = (_0x441360.x - _0x34d1c1) / _0x51c57b;
        const _0x2bc46f = _0x4a1663 < 0.03 ? 0 : _0x4a1663;
        _0x43dbf4.width = Math.max(1, _0x2bc46f * _0x51c57b);
        _0x43dbf4.setVisible(_0x2bc46f > 0);
        _0x169b87(_0x2bc46f);
      });
    };
    _0xe34699(_0x13af33 - 200, "gj_songIcon_001.png", this._audio.getUserMusicVolume(), _0x3ebce2 => this._audio.setUserMusicVolume(_0x3ebce2));
    _0xe34699(_0x13af33 + 200, "GJ_sfxIcon_001.png", this._sfxVolume, _0x3224fb => {
      this._sfxVolume = _0x3224fb;
      localStorage.setItem("userSfxVol", _0x3224fb);
    });
  }
  _buildInfoPopup() {
    if (this._infoPopup) {
      return;
    }
    const xPos = r / 2;
    const _0x4c3182 = 320;
    const _0xe2830b = 336;
    this._infoPopup = this.add.container(0, 0).setScrollFactor(0).setDepth(200);
    const _0x249eb7 = this.add.rectangle(xPos, _0x4c3182, r, n, 0, 100 / 255);
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
    yPos += 70;
    const _0x22e4c7 = this.add.bitmapText(xPos, yPos, "goldFont", "Made by RobTop Games", 40).setOrigin(0.5, 0.5).setScale(0.6);
    this._infoPopup.add(_0x22e4c7);
    yPos += 60;
    const _0x3cdf70a = this.add.bitmapText(xPos, yPos, "goldFont", "Modded by: AntiMatter, breadbb", 40).setOrigin(0.5, 0.5).setScale(0.6);
    this._infoPopup.add(_0x3cdf70a);
    yPos += 30;
    const _0x3cdf70b = this.add.bitmapText(xPos, yPos, "goldFont", "bog, and aloaf", 40).setOrigin(0.5, 0.5).setScale(0.6);
    this._infoPopup.add(_0x3cdf70b);
    yPos += 30;
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
  _expandHitArea(_0x122213, _0x37180a) {
    const _0x46ea45 = _0x122213.width;
    const _0x43b461 = _0x122213.height;
    const _0x960250 = _0x46ea45 * (_0x37180a - 1) / 2;
    const _0x3f88a1 = _0x43b461 * (_0x37180a - 1) / 2;
    _0x122213.input.hitArea.setTo(-_0x960250, -_0x3f88a1, _0x46ea45 + _0x960250 * 2, _0x43b461 + _0x3f88a1 * 2);
  }
  _makeBouncyButton(_0x4b8c6e, _0x57b645, _0x2f13d0, _0xda0c21) {
    const _0x396ca0 = _0x57b645 * 1.26;
    _0x4b8c6e.on("pointerdown", () => {
      if (!_0xda0c21 || !!_0xda0c21()) {
        _0x4b8c6e._pressed = true;
        this.tweens.killTweensOf(_0x4b8c6e, "scale");
        this.tweens.add({
          targets: _0x4b8c6e,
          scale: _0x396ca0,
          duration: 300,
          ease: "Bounce.Out"
        });
      }
    });
    _0x4b8c6e.on("pointerout", () => {
      if (_0x4b8c6e._pressed) {
        _0x4b8c6e._pressed = false;
        this.tweens.killTweensOf(_0x4b8c6e, "scale");
        this.tweens.add({
          targets: _0x4b8c6e,
          scale: _0x57b645,
          duration: 400,
          ease: "Bounce.Out"
        });
      }
    });
    _0x4b8c6e.on("pointerup", () => {
      if (_0x4b8c6e._pressed) {
        _0x4b8c6e._pressed = false;
        this.tweens.killTweensOf(_0x4b8c6e, "scale");
        _0x4b8c6e.setScale(_0x57b645);
        _0x2f13d0();
      }
    });
    return _0x4b8c6e;
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
  _drawScale9(_0x147730, _0x4c8cbf, _0x58d136, _0x1ac13a, _0x24a44b, _0x143641, _0x590eba, _0x206735) {
    const _0x4080b2 = this.add.container(_0x147730, _0x4c8cbf);
    const _0x2522df = this.textures.get(_0x24a44b);
    const _0x401ec1 = _0x2522df.source[0];
    const _0x3f82ec = _0x401ec1.width;
    const _0x294746 = _0x401ec1.height;
    const _0x2b09f1 = _0x58d136 - _0x143641 * 2;
    const _0x990515 = _0x1ac13a - _0x143641 * 2;
    const _0x1d065e = [{
      sx: 0,
      sy: 0,
      sw: _0x143641,
      sh: _0x143641,
      dx: -_0x58d136 / 2,
      dy: -_0x1ac13a / 2,
      dw: _0x143641,
      dh: _0x143641
    }, {
      sx: _0x143641,
      sy: 0,
      sw: _0x3f82ec - _0x143641 * 2,
      sh: _0x143641,
      dx: -_0x58d136 / 2 + _0x143641,
      dy: -_0x1ac13a / 2,
      dw: _0x2b09f1,
      dh: _0x143641
    }, {
      sx: _0x3f82ec - _0x143641,
      sy: 0,
      sw: _0x143641,
      sh: _0x143641,
      dx: _0x58d136 / 2 - _0x143641,
      dy: -_0x1ac13a / 2,
      dw: _0x143641,
      dh: _0x143641
    }, {
      sx: 0,
      sy: _0x143641,
      sw: _0x143641,
      sh: _0x294746 - _0x143641 * 2,
      dx: -_0x58d136 / 2,
      dy: -_0x1ac13a / 2 + _0x143641,
      dw: _0x143641,
      dh: _0x990515
    }, {
      sx: _0x143641,
      sy: _0x143641,
      sw: _0x3f82ec - _0x143641 * 2,
      sh: _0x294746 - _0x143641 * 2,
      dx: -_0x58d136 / 2 + _0x143641,
      dy: -_0x1ac13a / 2 + _0x143641,
      dw: _0x2b09f1,
      dh: _0x990515
    }, {
      sx: _0x3f82ec - _0x143641,
      sy: _0x143641,
      sw: _0x143641,
      sh: _0x294746 - _0x143641 * 2,
      dx: _0x58d136 / 2 - _0x143641,
      dy: -_0x1ac13a / 2 + _0x143641,
      dw: _0x143641,
      dh: _0x990515
    }, {
      sx: 0,
      sy: _0x294746 - _0x143641,
      sw: _0x143641,
      sh: _0x143641,
      dx: -_0x58d136 / 2,
      dy: _0x1ac13a / 2 - _0x143641,
      dw: _0x143641,
      dh: _0x143641
    }, {
      sx: _0x143641,
      sy: _0x294746 - _0x143641,
      sw: _0x3f82ec - _0x143641 * 2,
      sh: _0x143641,
      dx: -_0x58d136 / 2 + _0x143641,
      dy: _0x1ac13a / 2 - _0x143641,
      dw: _0x2b09f1,
      dh: _0x143641
    }, {
      sx: _0x3f82ec - _0x143641,
      sy: _0x294746 - _0x143641,
      sw: _0x143641,
      sh: _0x143641,
      dx: _0x58d136 / 2 - _0x143641,
      dy: _0x1ac13a / 2 - _0x143641,
      dw: _0x143641,
      dh: _0x143641
    }];
    for (let _0x24f653 = 0; _0x24f653 < _0x1d065e.length; _0x24f653++) {
      const _0x1fa377 = _0x1d065e[_0x24f653];
      const _0xade586 = "_s9_" + _0x24f653;
      if (!_0x2522df.has(_0xade586)) {
        _0x2522df.add(_0xade586, 0, _0x1fa377.sx, _0x1fa377.sy, _0x1fa377.sw, _0x1fa377.sh);
      }
      const _0x1145e5 = this.add.image(_0x1fa377.dx, _0x1fa377.dy, _0x24a44b, _0xade586).setOrigin(0, 0).setDisplaySize(_0x1fa377.dw, _0x1fa377.dh);
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
    
    this._menuActive = false;
    this._slideIn = true;
    if (this._menuGlitter) {
      this._menuGlitter.destroy();
      this._menuGlitter = null;
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
    if (this._robLogo) {
      this.tweens.add({
        targets: this._robLogo,
        y: n + this._robLogo.height,
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
          y: n + _0xaa3a95.height,
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
    this._cameraX = -h;
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
    this._attemptsLabel.setVisible(this._attempts > 1);
    this._positionAttemptsLabel();
  }
  _pushButton() {
    if (this._menuActive) {
      this._audio.playEffect("playSound_01", {
        volume: 1
      });
      this._startGame();
      return;
    }
    if (!this._slideIn && !this._state.isDead) {
      this._state.upKeyDown = true;
      this._state.upKeyPressed = true;
      if (!this._state.isFlying && !this._state.isWave && this._state.canJump) {
        this._player.updateJump(0);
        this._totalJumps++;
      }
    }
  }
  _releaseButton() {
    this._state.upKeyDown = false;
    this._state.upKeyPressed = false;
  }
  _positionMenuItems() {
    const _0x1e5db8 = r / 2;
    if (this._logo) {
      this._logo.x = _0x1e5db8;
    }
    if (this._menuInfoBtn) {
      this._menuInfoBtn.x = r - 30 - 3;
    }
    if (this._copyrightText) {
      this._copyrightText.x = r - 20;
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
      const _0x285ef7 = r - 130;
      const _0x4a8263 = 555;
      const _0x23d03e = 210;
      for (let _0x1bdfae = 0; _0x1bdfae < this._downloadBtns.length; _0x1bdfae++) {
        this._downloadBtns[_0x1bdfae].setPosition(_0x285ef7 - _0x1bdfae * _0x23d03e, _0x4a8263);
      }
    }
  }
  _positionAttemptsLabel() {
    let _0xdbdd91 = this._cameraX + r / 2;
    if (this._attempts > 1) {
      _0xdbdd91 += 100;
    }
    this._attemptsLabel.setPosition(_0xdbdd91, 150);
  }
  _resetGameplayState() {
    this._cameraX = -h;
    this._cameraY = 0;
    this._cameraXRef._v = -h;
    this._prevCameraX = -h;
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
    this._resetGameplayState();
    this._state.reset();
    this._player.reset();
    this._glitterEmitter.stop();
    this._level.resetObjects();
    this._level.shiftGroundTiles(this._cameraX - _0x2ba78a);
    this._level.resetGroundState();
    this._level.resetColorTriggers();
    this._level.resetEnterEffectTriggers();
    this._level.resetVisibility();
    this._colorManager.reset();
    this._audio.reset();
    this._audio.startMusic();
    this._paused = false;
    if (this._pauseContainer) {
      this._pauseContainer.destroy();
      this._pauseContainer = null;
    }
    this._pauseBtn.setVisible(true).setAlpha(75 / 255);
    this._attemptsLabel.setText("Attempt " + this._attempts);
    this._attemptsLabel.setVisible(true);
    this._positionAttemptsLabel();
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
      l(Math.round(n * _0x5bc34b));
    }
    this.scale.setGameSize(r, n);
    this.scale.refresh();
    this._bg.setSize(r, n);
    this._pauseBtn.x = r - 30;
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
      this._cameraX = this._playerWorldX - h;
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
    let _0x29ed62 = this._cameraY;
    let _0x1a27be = _0x29ed62;
    if (this._level.flyCameraTarget !== null) {
      _0x1a27be = this._level.flyCameraTarget;
    } else {
      let _0x2bc8fb = this._state.y;
      let _0x259956 = 140;
      let _0x5025ec = 80;
      let _0x1f7976 = _0x29ed62 - o + 320;
      if (_0x2bc8fb > _0x1f7976 + _0x259956) {
        _0x1a27be = _0x2bc8fb - 320 - _0x259956 + o;
      } else if (_0x2bc8fb < _0x1f7976 - _0x5025ec) {
        _0x1a27be = _0x2bc8fb - 320 + _0x5025ec + o;
      }
    }
    if (_0x1a27be < 0) {
      _0x1a27be = 0;
    }
    if (_0xc7c517 !== 0) {
      _0x29ed62 += (_0x1a27be - _0x29ed62) / (10 / _0xc7c517);
      if (_0x29ed62 < 0) {
        _0x29ed62 = 0;
      }
      this._cameraY = _0x29ed62;
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
  update(_0x54fa47, _0xaf2ffd) {
    this._fpsAccum += _0xaf2ffd;
    this._fpsFrames++;
    if (this._fpsAccum >= 250) {
      this._fpsText.setText(Math.round(this._fpsFrames * 1000 / this._fpsAccum));
      this._fpsAccum = 0;
      this._fpsFrames = 0;
    }
    if (this._paused) {
      this._deltaBuffer = 0;
      return;
    }
    if (this._menuActive) {
      if ((this._spaceKey.isDown || this._upKey.isDown || this._wKey.isDown) && !this._spaceWasDown) {
        this._spaceWasDown = true;
        this._audio.playEffect("playSound_01", {
          volume: 1
        });
        this._levelLabel.setVisible(false)
        this._leftBtn.setVisible(false)
        this._rightBtn.setVisible(false)
        this._percentageLabel.setVisible(true)
        this._startGame();
        return;
      }
      if (this._leftKey.isDown || this._rightKey.isDown || this._aKey.isDown || this._dKey.isDown) {
        if (this._leftKey.isDown || this._aKey.isDown) {
          window.leftbuttoncallback();
        } else {
          window.rightbuttoncallback();
        }
      }
      this._spaceWasDown = this._spaceKey.isDown || this._upKey.isDown || this._wKey.isDown;
      const _0x1e9cf4 = Math.min(_0xaf2ffd / 1000 * 60, 2);
      const _0x2e19f3 = 0.25;
      this._menuCameraX = (this._menuCameraX || 0) + _0x1e9cf4 * c * d * _0x2e19f3;
      const _0x38afac = this._cameraX;
      this._cameraX = this._menuCameraX;
      this._updateBackground();
      this._cameraX = _0x38afac;
      this._prevCameraX = this._menuCameraX;
      this._cameraXRef._v = this._menuCameraX;
      this._level.stepGroundAnimation(_0xaf2ffd / 1000);
      this._level.updateGroundTiles(this._cameraY);
      return;
    }
    if (this._slideIn) {
      const _0x3c9318 = this._quantizeDelta(_0xaf2ffd);
      this._playerWorldX += _0x3c9318 * c * d;
      const _0x4f81e7 = 0.25;
      this._slideGroundX = (this._slideGroundX || this._cameraX) + _0x3c9318 * c * d * _0x4f81e7;
      this._cameraXRef._v = this._slideGroundX;
      const _0x95cc4f = this._playerWorldX - this._cameraX;
      this._player.updateGroundRotation(_0x3c9318 * d);
      this._player.syncSprites(this._cameraX, this._cameraY, _0xaf2ffd / 1000, this._getMirrorXOffset(_0x95cc4f));
      this._level.additiveContainer.x = -this._cameraX;
      this._level.additiveContainer.y = this._cameraY;
      this._level.container.x = -this._cameraX;
      this._level.container.y = this._cameraY;
      this._level.topContainer.x = -this._cameraX;
      this._level.topContainer.y = this._cameraY;
      this._level.updateVisibility(this._cameraX);
      this._updateBackground();
      this._level.stepGroundAnimation(_0xaf2ffd / 1000);
      this._level.updateGroundTiles(this._cameraY);
      this._applyMirrorEffect();
      if (this._playerWorldX >= 0) {
        this._slideIn = false;
        this._deltaBuffer = 0;
        this._playerWorldX = 0;
        this._cameraX = this._playerWorldX - h;
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
      }
      return;
    }
    let _0x368ad9 = this._spaceKey.isDown || this._upKey.isDown || this._wKey.isDown;
    if (_0x368ad9 && !this._spaceWasDown) {
      this._pushButton();
    } else if (!_0x368ad9 && this._spaceWasDown) {
      this._releaseButton();
    }
    this._spaceWasDown = _0x368ad9;
    if (!!this.input.activePointer.isDown && !this._state.upKeyDown && !this._state.isDead) {
      this._state.upKeyDown = true;
    }
    this._level.updateEndPortalY(this._cameraY, this._state.isFlying || this._state.isWave);
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
        const _0x3eb8cf = this._endCamTween;
        this._cameraX = _0x3eb8cf.fromX + (_0x3eb8cf.toX - _0x3eb8cf.fromX) * _0x3eb8cf.p;
        this._cameraY = _0x3eb8cf.fromY + (_0x3eb8cf.toY - _0x3eb8cf.fromY) * _0x3eb8cf.p;
      }
      this._cameraXRef._v = this._cameraX;
      this._level.additiveContainer.x = -this._cameraX;
      this._level.additiveContainer.y = this._cameraY;
      this._level.container.x = -this._cameraX;
      this._level.container.y = this._cameraY;
      this._level.topContainer.x = -this._cameraX;
      this._level.topContainer.y = this._cameraY;
      this._updateBackground();
      this._level.stepGroundAnimation(_0xaf2ffd / 1000);
      this._level.updateGroundTiles(this._cameraY);
      this._applyMirrorEffect();
      return;
    }
    if (this._state.isDead) {
      if (!this._deathSoundPlayed) {
        this._audio.stopMusic();
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
        if (this._lastPercent > this._bestPercent) {
          this._bestPercent = this._lastPercent;
          this._hadNewBest = true;
          this._showNewBest();
        }
      }
      this._player.updateExplosionPieces(_0xaf2ffd);
      this._deathTimer += _0xaf2ffd;
      let _0x237728 = this._hadNewBest ? 1400 : 1000;
      if (this._deathTimer > _0x237728) {
        this._restartLevel();
      }
      return;
    }
    this._playTime += _0xaf2ffd / 1000;
    this._audio.update(_0xaf2ffd / 1000);
    this._level.updateAudioScale(this._audio.getMeteringValue());
    let _0x30fa5d = this._quantizeDelta(_0xaf2ffd);
    let _0x5efc2d = _0x30fa5d > 0 ? Math.max(1, Math.round(_0x30fa5d * 4)) : 0;
    if (_0x5efc2d > 60) {
      _0x5efc2d = 60;
    }
    let _0x426602 = _0x5efc2d > 0 ? _0x30fa5d / _0x5efc2d : 0;
    let _0x5caeb1 = _0x426602 * d;
    let _0x5dfd5a = _0x426602 * c * d;
    const _0x23505e = this._state.y;
    for (let _0x26d5d6 = 0; _0x26d5d6 < _0x5efc2d; _0x26d5d6++) {
      this._state.lastY = this._state.y;
      this._player.updateJump(_0x5caeb1);
      this._state.y += this._state.yVelocity * _0x5caeb1;
      this._player.checkCollisions(this._playerWorldX - h);
      this._playerWorldX += _0x5dfd5a;
      if (!this._state.isFlying && !this._state.isWave) {
        if (this._state.onGround) {
          if (this._state.isBall) {
            this._player.updateBallRoll(_0x5dfd5a);
          } else {
            this._player.updateGroundRotation(_0x5caeb1);
          }
        } else if (this._player.rotateActionActive) {
          this._player.updateRotateAction(u);
        }
      }
    }
    this._state.lastY = _0x23505e;
    if (!this._endCameraOverride) {
      const _0xe48698 = this._playerWorldX - h;
      if (this._level.endXPos > 0) {
        const _0x24670d = this._level.endXPos - r;
        if (_0xe48698 >= _0x24670d - 200) {
          this._endCameraOverride = true;
          this._cameraX = _0xe48698;
          const _0x2e3f0a = -140 + (this._level._endPortalGameY || 240);
          const _0x34bdb9 = 1.8;
          const _0x41f777 = _0x2aca75 => _0x2aca75 < 0.5 ? Math.pow(_0x2aca75 * 2, _0x34bdb9) / 2 : 1 - Math.pow((1 - _0x2aca75) * 2, _0x34bdb9) / 2;
          this._endCamTween = {
            p: 0,
            fromX: this._cameraX,
            toX: _0x24670d,
            fromY: this._cameraY,
            toY: _0x2e3f0a
          };
          this.tweens.add({
            targets: this._endCamTween,
            p: 1,
            duration: 1200,
            ease: _0x41f777
          });
        } else {
          this._cameraX = _0xe48698;
        }
      } else {
        this._cameraX = _0xe48698;
      }
    }
    if (this._endCameraOverride && this._endCamTween) {
      const _0x490838 = this._endCamTween;
      this._cameraX = _0x490838.fromX + (_0x490838.toX - _0x490838.fromX) * _0x490838.p;
      this._cameraY = _0x490838.fromY + (_0x490838.toY - _0x490838.fromY) * _0x490838.p;
    }
    this._cameraXRef._v = this._cameraX;
    if (!this._endCameraOverride) {
      this._updateCameraY(_0x30fa5d);
    }
    this._level.additiveContainer.x = -this._cameraX;
    this._level.additiveContainer.y = this._cameraY;
    this._level.container.x = -this._cameraX;
    this._level.container.y = this._cameraY;
    this._level.topContainer.x = -this._cameraX;
    this._level.topContainer.y = this._cameraY;
    let _0x5464ab = this._playerWorldX;
    for (let _0x2001f6 of this._level.checkColorTriggers(_0x5464ab)) {
      this._colorManager.triggerColor(_0x2001f6.index, _0x2001f6.color, _0x2001f6.duration);
      if (_0x2001f6.tintGround) {
        this._colorManager.triggerColor(gs, _0x2001f6.color, _0x2001f6.duration);
      }
    }
    this._colorManager.step(_0xaf2ffd / 1000);
    this._bg.setTint(this._colorManager.getHex(fs));
    this._level.setGroundColor(this._colorManager.getHex(gs));
    this._level.updateVisibility(this._cameraX);
    this._level.checkEnterEffectTriggers(_0x5464ab);
    this._level.applyEnterEffects(this._cameraX);
    this._glitterCenterX = this._cameraX + r / 2;
    this._glitterCenterY = T - this._cameraY;
    this._updateBackground();
    this._level.stepGroundAnimation(_0xaf2ffd / 1000);
    this._level.updateGroundTiles(this._cameraY);
    if (this._state.isFlying) {
      this._player.updateShipRotation(_0x30fa5d);
    }
    const _0x259e68 = this._playerWorldX - this._cameraX;
    this._player.syncSprites(this._cameraX, this._cameraY, _0xaf2ffd / 1000, this._getMirrorXOffset(_0x259e68));
    this._applyMirrorEffect();
    this._percentageLabel.setText(`${(this._playerWorldX / (this._level.endXPos || 6000) * 100).toFixed(2)}%`)
  }
  _applyMirrorEffect() {
    const isMirrored = this._state.mirrored;
    const containers = [this._level.additiveContainer, this._level.container, this._level.topContainer];
    if (isMirrored) {
      for (const c of containers) {
        c.scaleX = -1;
        c.x = this._cameraX + r;
      }
    } else {
      for (const c of containers) {
        if (c.scaleX !== 1) c.scaleX = 1;
      }
    }
    this._bg.setFlipX(isMirrored);
  }
  _getMirrorXOffset(xOffset) {
    return this._state.mirrored ? r - xOffset : xOffset;
  }
  _showNewBest() {
    let _0x9f2437 = r / 2;
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
    const _0x356782 = this._level.endXPos - this._cameraX;
    const _0x2d967b = b(this._endPortalGameY) + this._cameraY;
    for (let _0x481f7c = 0; _0x481f7c < 5; _0x481f7c++) {
      this.time.delayedCall(_0x481f7c * 50, () => _s(this, _0x356782, _0x2d967b, 10, r, 500, false, true, window.mainColor));
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
      const _0x232789 = Math.round(Math.sqrt(r ** 2 + 102400)) + _0x29d856 * 32.5;
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
        const _0xf33b0d = _0x3f5321.add.graphics().setScrollFactor(0).setDepth(-1).setBlendMode(S).setPosition(_0x8f5267, _0x2f1e2d).setAngle(_0x34147c).setAlpha(_0x28e7b3).setVisible(false);
        const _0x496d96 = {
          h: 1,
          w: _0x2cc21f
        };
        _0x3f5321.time.delayedCall(Math.max(0, _0x1a79fc), () => {
          _0xf33b0d.setVisible(true);
          _0x3f5321.tweens.add({
            targets: _0x496d96,
            h: _0x232789,
            w: _0x6eb03a,
            duration: _0x2e9531,
            ease: "Quad.Out",
            onUpdate: () => {
              const _0x2db3d7 = _0x2cc21f + (_0x496d96.w - _0x2cc21f) / 4;
              _0xf33b0d.clear();
              _0xf33b0d.fillStyle(_0x4b5e5b, 1);
              _0xf33b0d.beginPath();
              _0xf33b0d.moveTo(-_0x2db3d7 / 2, 0);
              _0xf33b0d.lineTo(_0x2db3d7 / 2, 0);
              _0xf33b0d.lineTo(_0x496d96.w / 2, _0x496d96.h);
              _0xf33b0d.lineTo(-_0x496d96.w / 2, _0x496d96.h);
              _0xf33b0d.closePath();
              _0xf33b0d.fillPath();
            }
          });
        });
        if (_0x1a79fc > _0x594d69) {
          _0x594d69 = _0x1a79fc;
        }
        _0x116c8c.push(_0xf33b0d);
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
    const _0x56628c = r / 2;
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
    _s(this, _0x2eadf2, _0x380b24, 10, r, 800, true, false, window.mainColor);
    _s(this, _0x56628c, 250, 10, 1000, 800, true, false, window.mainColor);
    for (let _0x579e05 = 0; _0x579e05 < 5; _0x579e05++) {
      this.time.delayedCall(_0x579e05 * 50, () => _s(this, _0x2eadf2, _0x380b24, 10, r, 500, false, true, window.mainColor));
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
    const _0x384f9e = r / 2;
    const _0x1aa656 = 320;
    this._endLayerOverlay = this.add.rectangle(_0x384f9e, _0x1aa656, r, n, 0, 0).setScrollFactor(0).setDepth(200).setInteractive();
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
    const _0x2a115c = (r - _0x595215) / 2;
    this._endLayerInternal.add(this.add.rectangle(_0x2a115c + 356, 310, _0x595215, _0x950c8d, 0, 180 / 255));
    const _0x43f2e3 = this.textures.getFrame("GJ_WebSheet", "GJ_table_side_001.png");
    const _0x3feccc = _0x43f2e3 ? _0x950c8d / _0x43f2e3.height : 1;
    this._endLayerInternal.add(this.add.image(_0x2a115c - 40, 80, "GJ_WebSheet", "GJ_table_side_001.png").setOrigin(0, 0).setScale(1, _0x3feccc));
    this._endLayerInternal.add(this.add.image(_0x2a115c + _0x595215 + 40, 80, "GJ_WebSheet", "GJ_table_side_001.png").setOrigin(1, 0).setFlipX(true).setScale(1, _0x3feccc));
    const _0x33b564 = this.add.image(_0x2a115c + 356, 70, "GJ_WebSheet", "GJ_table_top_001.png");
    this._endLayerInternal.add(_0x33b564);
    this._endLayerInternal.add(this.add.image(_0x2a115c + 356, 560, "GJ_WebSheet", "GJ_table_bottom_001.png"));
    const _0x3e9c79 = _0x33b564.y - 65;
    this._endLayerInternal.add(this.add.image(_0x384f9e - 312, _0x3e9c79, "GJ_WebSheet", "chain_01_001.png").setOrigin(0.5, 1));
    this._endLayerInternal.add(this.add.image(_0x384f9e + 312, _0x3e9c79, "GJ_WebSheet", "chain_01_001.png").setOrigin(0.5, 1));
    this._endLayerInternal.add(this.add.image(_0x384f9e, 170, "GJ_WebSheet", "GJ_levelComplete_001.png").setScale(0.8));
    const _0x45b6e4 = 0.8;
    let _0xe44f6d = 250;
    const _0x2de55e = this.add.bitmapText(_0x384f9e, _0xe44f6d, "goldFont", "Attempts: " + this._attempts, 40).setOrigin(0.5, 0.5).setScale(_0x45b6e4);
    this._endLayerInternal.add(_0x2de55e);
    _0xe44f6d += 48;
    this._endLayerInternal.add(this.add.bitmapText(_0x384f9e, _0xe44f6d, "goldFont", "Jumps: " + this._totalJumps, 40).setOrigin(0.5, 0.5).setScale(_0x45b6e4));
    _0xe44f6d += 48;
    const _0x596450 = Math.floor(this._playTime);
    const _0x30687e = Math.floor(_0x596450 / 3600);
    const _0x52f8ee = Math.floor(_0x596450 % 3600 / 60);
    const _0x2591d0 = _0x596450 % 60;
    let _0x2be782;
    _0x2be782 = _0x30687e > 0 ? String(_0x30687e).padStart(2, "0") + ":" + String(_0x52f8ee).padStart(2, "0") + ":" + String(_0x2591d0).padStart(2, "0") : String(_0x52f8ee).padStart(2, "0") + ":" + String(_0x2591d0).padStart(2, "0");
    const _0x241209 = _0xe44f6d;
    this._endLayerInternal.add(this.add.bitmapText(_0x384f9e, _0xe44f6d, "goldFont", "Time: " + _0x2be782, 40).setOrigin(0.5, 0.5).setScale(_0x45b6e4));
    const _0x452429 = ["Awesome!", "Good\nJob!", "Well\nDone!", "Impressive!", "Amazing!", "Incredible!", "Skillful!", "Brilliant!", "Not\nbad!", "Warp\nSpeed!", "Challenge\nBreaker!", "Reflex\nMaster!", "I am\nspeechless...", "You are...\nThe One!", "How is this\npossible!?", "You beat\nme..."];
    const _0x165c06 = _0x452429[Math.floor(Math.random() * _0x452429.length)];
    const _0x45540f = 225;
    this._endLayerInternal.add(this.add.bitmapText(_0x384f9e + _0x45540f, _0x241209, "bigFont", _0x165c06, 40).setOrigin(0.5, 0.5).setScale(0.8).setCenterAlign());
    this._endLayerInternal.add(this.add.image(_0x384f9e - _0x45540f, 352.5, "GJ_WebSheet", "getIt_001.png").setScale(1 / 1.5));
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
      const _0x4c7fb8 = this.add.image(_0x384f9e + _0x1e3f82, 437.5, "GJ_WebSheet", _0xd7310b.key + ".png").setScale(_0x55a82e).setInteractive();
      this._endLayerInternal.add(_0x4c7fb8);
      this._makeBouncyButton(_0x4c7fb8, _0x55a82e, () => window.open(_0xd7310b.url, "_blank"));
    }
    _0x2de55e.width;
    this._endStarX = _0x384f9e + _0x45540f;
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
      const _0xdde774 = this.add.image(_0x384f9e + _0x2d4335.dx, 555, "GJ_WebSheet", _0x2d4335.frame).setInteractive();
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
  const _0x4eb200 = _0x2076d4 + (r - 400) * Math.random();
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
const Ss = {
  type: s.AUTO,
  width: r,
  height: n,
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
    mode: s.Scale.FIT,
    autoCenter: s.Scale.CENTER_BOTH
  },
  scene: [A, xs]
};
new s.Game(Ss);
