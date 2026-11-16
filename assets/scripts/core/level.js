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
    this.hypoAx = 0; this.hypoAy = 0;
    this.hypoBx = 0; this.hypoBy = 0;
    this.rightAx = 0; this.rightAy = 0;
    this.slopeSolidBelow = true;
  }
  getSlopeSurfaceY(worldX) {
    if (this.type !== slopeType) return null;
    const ax = this.x + this.hypoAx, ay = this.y + this.hypoAy;
    const bx = this.x + this.hypoBx, by = this.y + this.hypoBy;
    const lo = ax <= bx ? { x: ax, y: ay } : { x: bx, y: by };
    const hi = ax <= bx ? { x: bx, y: by } : { x: ax, y: ay };
    if (hi.x - lo.x < 0.01) return null;
    if (worldX < lo.x || worldX > hi.x) return null;
    const t = (worldX - lo.x) / (hi.x - lo.x);
    return lo.y + t * (hi.y - lo.y);
  }
  getSlopeAngleRad() {
    if (this.type !== slopeType) return 0;
    return Math.atan2(this.hypoBy - this.hypoAy, this.hypoBx - this.hypoAx);
  }
  usesFloorLanding(gravityFlipped) {
    return this.isSolidBelowSurface(gravityFlipped);
  }
  isSolidBelowSurface(gravityFlipped) {
    return this.slopeSolidBelow !== gravityFlipped;
  }
  isSlopeSolidAt(worldX, worldY, gravityFlipped = false) {
    if (this.type !== slopeType) return false;
    const halfW = this.w / 2;
    const halfH = this.h / 2;
    const left = this.x - halfW;
    const right = this.x + halfW;
    const bboxBottom = this.y - halfH;
    const bboxTop = this.y + halfH;
    if (worldX < left || worldX > right || worldY < bboxBottom || worldY > bboxTop) {
      return false;
    }
    if (this.slopeIsFilled) {
      return true;
    }
    const surfaceY = this.getSlopeSurfaceY(worldX);
    if (surfaceY === null) return false;
    return this.isSolidBelowSurface(gravityFlipped) ? worldY < surfaceY : worldY > surfaceY;
  }
  getSlopeBackWallSide(gravityFlipped = false) {
    let leftWall = this.slopeDir > 0;
    if (!this.isSolidBelowSurface(gravityFlipped)) leftWall = !leftWall;
    return leftWall ? "left" : "right";
  }
}
const ldm_object = new Set([
  503,505,504,1888,1887,1012,1013,1011,1886,1762,1763,1761,1269,1760,1270,1271,1274,1272,1273,1764,1765,1766,1767,1769,1292,1758,1291,1293,1759,1051,1058,1060,1752,1050,1052,1059,1061
]);
 
function _decodeTextObjectString(value) {
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
 
function _encodeTextObjectString(value) {
  const bytes = new TextEncoder().encode(String(value ?? ""));
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
 
const LEGACY_COLOR_TRIGGER_CHANNELS = {
  105: 1004,
  221: 1,
  717: 2,
  718: 3,
  743: 4,
  744: 1003,
  899: 1,
  900: 1009,
  915: 1002
};

const LEGACY_19_COLOR_CHANNELS = {
  1: 1005,
  2: 1006,
  3: 1,
  4: 2,
  5: 1007,
  6: 3,
  7: 4,
  8: 1003
};

function parseObject(objectString) {
  let objectParts = objectString.split(",");
  let objectData = {};
  for (let index = 0; index + 1 < objectParts.length; index += 2) {
    let key = objectParts[index];
    let value = objectParts[index + 1];
    objectData[key] = value;
  }
  let objectId = parseInt(objectData[1] || "0", 10);
  const readScale = (raw) => {
    const value = parseFloat(raw);
    return Number.isFinite(value) && value !== 0 ? value : null;
  };
  const uniformScale = readScale(objectData[32]) ?? 1;
  const objectScaleX = readScale(objectData[128]) ?? uniformScale;
  const objectScaleY = readScale(objectData[129]) ?? uniformScale;
  let objectColor1 = parseInt(objectData[21] || "0", 10);
  let objectColor2 = parseInt(objectData[22] || "0", 10);
  const legacyColorId = LEGACY_19_COLOR_CHANNELS[parseInt(objectData[19] || "0", 10)];
  if (legacyColorId !== undefined) {
    objectColor1 = legacyColorId;
    objectColor2 = 0;
  }
  const rawGroupValues = [];
  const readFloat = (key, fallback) => {
    const value = parseFloat(objectData[key]);
    return Number.isFinite(value) ? value : fallback;
  };
  const addRawGroups = (rawValue) => {
    String(rawValue ?? "")
      .split(".")
      .map(value => parseInt(value, 10))
      .filter(value => Number.isFinite(value) && value > 0)
      .forEach(value => rawGroupValues.push(value));
  };
  addRawGroups(objectData[33]);
  addRawGroups(objectData[57]);
  const groupString = [...new Set(rawGroupValues)].join(".");

  const baseRotation = readFloat(6, 0);
  const rotationX = readFloat(131, baseRotation);
  const rotationY = readFloat(132, baseRotation);

  const warp = ((rotationY - rotationX) % 360 + 540) % 360 - 180;
  const rotation = rotationX + warp / 2;

  if (objectId === 0) {
    return null;
  } else {
    return {
      id: objectId,
      x: parseFloat(objectData[2] || "0"),
      y: parseFloat(objectData[3] || "0"),
      flipX: objectData[4] === "1",
      flipY: objectData[5] === "1",
      rot: rotation,
      scale: objectData[32] !== undefined ? uniformScale : (objectScaleX + objectScaleY) / 2,
      scaleX: objectScaleX,
      scaleY: objectScaleY,
      warp: warp,
      editorLayer: parseInt(objectData[20] || "0", 10),
      zLayer: parseInt(objectData[24] || "0", 10),
      zOrder: parseInt(objectData[25] || "0", 10),
      editorLayer2: parseInt(objectData[61] || "0", 10),
      groups: groupString,
      color1: objectColor1,
      color2: objectColor2,
      text: _decodeTextObjectString(objectData[31] ?? objectData["31"] ?? ""),
      gameMode: parseInt(objectData['kA2'] ?? '0', 10),
      miniMode: parseInt(objectData['kA3'] ?? '0', 10),
      speed: parseInt(objectData['kA4'] ?? '0', 10),
      dualMode: parseInt(objectData['kA8'] ?? '0', 10),
      mirrored: parseInt(objectData['kA28'] ?? '0', 10),
      flipGravity: '1' === (objectData['kA11'] ?? '0'),
      _raw: objectData
    };
  }
}
function parseLevel(levelString) {
  let decompressedString = null;
  try{
    decompressedString = function (compressedString) {
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
  } catch(InvalidCharacterError) {
    decompressedString = levelString;
  }
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
  return {
    settings: settings,
    objects: objects
  };
 
}
function getBackgroundTextureIndex(backgroundSetting) {
  const parsedBackgroundId = parseInt(String(backgroundSetting ?? "1"), 10);
  const gdBackgroundId = isNaN(parsedBackgroundId) || parsedBackgroundId <= 1 ? 1 : parsedBackgroundId;
  return gdBackgroundId - 1;
}
 
function getBackgroundDisplayId(backgroundSetting) {
  const parsedBackgroundId = parseInt(String(backgroundSetting ?? "1"), 10);
  const gdBackgroundId = isNaN(parsedBackgroundId) || parsedBackgroundId <= 1 ? 1 : parsedBackgroundId;
  return String(gdBackgroundId).padStart(2, "0");
}
 
function getGroundTextureId(groundSetting) {
  const parsedGroundId = parseInt(String(groundSetting ?? "1"), 10);
  const textureIndex = isNaN(parsedGroundId) || parsedGroundId <= 1 ? 0 : parsedGroundId - 1;
  return String(textureIndex).padStart(2, "0");
}
 
const PERSP_LINE_FRAME_OFFSET_Y = { block008_topcolor_15: -9.5 };
const PERSP_LINE_OBJECT_OFFSET_Y = { 507: 0, 508: 0 };
function hasInvisibleObjectVisual(objectDef) {
  if (!objectDef) return false;
  const hasInvisibleFrame = frame => typeof frame === "string"
    && (frame.startsWith("invis_") || frame.startsWith("invisibleOutline_"));
  return hasInvisibleFrame(objectDef.frame)
    || hasInvisibleFrame(objectDef.glow_frame)
    || (objectDef.children || []).some(child => hasInvisibleFrame(child?.frame));
}
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
const dBlockType = "dblock";
const sBlockType = "sblock";
const J_BLOCK_OBJECT_ID = 1813;
const S_BLOCK_OBJECT_ID = 1829;
const H_BLOCK_OBJECT_ID = 1859;
const LETTER_BLOCK_IDS = new Set([J_BLOCK_OBJECT_ID, S_BLOCK_OBJECT_ID, H_BLOCK_OBJECT_ID]);
const _SLOPE_DATA = {
  289:{gw:1,gh:1,angle:45,sq:false,dir:1}, 291:{gw:2,gh:1,angle:22.5,sq:false,dir:-1},
  294:{gw:1,gh:1,angle:45,sq:false},295:{gw:2,gh:1,angle:22.5,sq:false},
  296:{gw:0.367,gh:0.433,angle:45,sq:true},297:{gw:0.967,gh:0.45,angle:45,sq:true},
  299:{gw:1,gh:1,angle:45,sq:false},301:{gw:2,gh:1,angle:22.5,sq:false},
  305:{gw:1,gh:1,angle:45,sq:false},307:{gw:2,gh:1,angle:22.5,sq:false},
  349:{gw:1,gh:1,angle:45,sq:false},351:{gw:2,gh:1,angle:22.5,sq:false},
  673:{gw:1,gh:1,angle:45,sq:false},674:{gw:2,gh:1,angle:22.5,sq:false},
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
 
function _resolveSlopeDir(objectDef, flipX, objId) {
  const frames = [];
  if (objectDef) {
    if (objectDef.frame) frames.push(objectDef.frame);
    if (objectDef.children) {
      for (const child of objectDef.children) {
        if (child.frame) frames.push(child.frame);
      }
    }
  }
  const text = frames.join(" ");
  let dir = 1;

  /*
  if (/slope_02[^0-9]|slope_04|slope_06|slope_02[bcd]_|pit_0[14]_slope_02|plank_01_slope_02|slope_square_02|slope_square_04|slope_square_05/.test(text)) {
    dir = -1;
  }
  */
  
  if (flipX) dir = -dir;
  return dir;
}
 
function _resolveSlopeOrientation(objectDef, levelObj) {
  let dir = _resolveSlopeDir(objectDef, levelObj.flipX, levelObj.id);
  let flipY = !!levelObj.flipY;
  const rot90 = Math.round((((levelObj.rot || 0) % 360) + 360) % 360 / 90) % 4;
  if (rot90 === 1) {
    const nextDir = flipY ? 1 : -1;
    flipY = dir < 0;
    dir = nextDir;
  } else if (rot90 === 2) {
    dir = -dir;
    flipY = !flipY;
  } else if (rot90 === 3) {
    const nextDir = flipY ? -1 : 1;
    flipY = !(dir < 0);
    dir = nextDir;
  }
  return { dir, flipY };
}
 
function _gdSlopeType(flipX, flipY, rotationDegrees) {
  const rot = (parseInt(rotationDegrees, 10) || 0) % 360;
  const fx = !!flipX, fy = !!flipY;
  const r0 = rot === 0;
  const r180 = Math.abs(rot) === 180;
  const r90 = rot === 90 || rot === -270;
  const r270 = rot === -90 || rot === 270;
  if (!fx && !fy) return r0 ? 0 : r90 ? 4 : r180 ? 3 : r270 ? 5 : null;
  if (!fx && fy)  return r0 ? 1 : r90 ? 7 : r180 ? 2 : r270 ? 6 : null;
  if (fx && !fy)  return r0 ? 2 : r90 ? 6 : r180 ? 1 : r270 ? 7 : null;
  return            r0 ? 3 : r90 ? 5 : r180 ? 0 : r270 ? 4 : null;
}

function _gdSlopeSolidAbove(type) {
  return type !== null && type < 7 && ((0x6a >> type) & 1) !== 0;
}
function _gdSlopeWallOnLeft(type) {
  return type !== null && ((type - 2) >>> 0 < 3 || type === 6);
}

const _SLOPE_DECO_RANGES = [
  [681, 708], [713, 716], [730, 763], [771, 772], [826, 829], [877, 878],
  [888, 961], [969, 970], [1014, 1015], [1033, 1034], [1037, 1038],
  [1041, 1092], [1108, 1188], [1198, 1199], [1256, 1306], [1316, 1317],
  [1758, 1900]
];

function _isDecorationSlopeId(id) {
  const n = parseInt(id, 10);
  if (!Number.isFinite(n)) return false;
  for (const [lo, hi] of _SLOPE_DECO_RANGES) {
    if (n >= lo && n <= hi) return true;
  }
  return false;
}

function gdObjectScale(levelObj) {
  const uniform = Number(levelObj?.scale);
  const fallback = Number.isFinite(uniform) ? uniform : 1;
  const scaleX = Number(levelObj?.scaleX);
  const scaleY = Number(levelObj?.scaleY);
  return {
    x: Number.isFinite(scaleX) ? scaleX : fallback,
    y: Number.isFinite(scaleY) ? scaleY : fallback
  };
}

function gdObjectWarp(levelObj) {
  const warp = Number(levelObj?.warp);
  return Number.isFinite(warp) ? warp : 0;
}

function gdWarpAxes(rotationDeg, warpDeg) {
  const toRad = Math.PI / 180;
  return {
    rotX: (rotationDeg - warpDeg / 2) * toRad,
    rotY: (rotationDeg + warpDeg / 2) * toRad
  };
}

function gdTransformLocalPoint(x, y, rotationDeg, scaleX, scaleY, warpDeg) {
  const { rotX, rotY } = gdWarpAxes(rotationDeg, warpDeg);
  return {
    x: Math.cos(rotY) * scaleX * x - Math.sin(rotX) * scaleY * y,
    y: Math.sin(rotY) * scaleX * x + Math.cos(rotX) * scaleY * y
  };
}

const _gdWarpLinear = new Phaser.GameObjects.Components.TransformMatrix();
const _gdWarpParent = new Phaser.GameObjects.Components.TransformMatrix();

function _gdWarpParentMatrix(sprite, camera, parentMatrix) {
  const warp = sprite._gdWarp;
  const rotX = warp.rotationX;
  const rotY = warp.rotationY;

  _gdWarpLinear.setTransform(
    Math.cos(rotY) * warp.scaleX, Math.sin(rotY) * warp.scaleX,
    -Math.sin(rotX) * warp.scaleY, Math.cos(rotX) * warp.scaleY,
    0, 0
  );

  let originX = sprite.x;
  let originY = sprite.y;
  if (camera.roundPixels) {
    originX = Math.floor(originX);
    originY = Math.floor(originY);
  }

  if (parentMatrix) _gdWarpParent.copyFrom(parentMatrix);
  else _gdWarpParent.loadIdentity();

  _gdWarpParent.translate(originX, originY);
  _gdWarpParent.multiply(_gdWarpLinear, _gdWarpParent);
  _gdWarpParent.translate(-originX, -originY);
  return _gdWarpParent;
}

function gdApplyEffectScale(sprite, factor) {
  const nextX = factor * (sprite._eeBaseScaleX ?? 1);
  const nextY = factor * (sprite._eeBaseScaleY ?? 1);
  if (sprite.scaleX !== nextX || sprite.scaleY !== nextY) sprite.setScale(nextX, nextY);
}

function applyGDObjectTransform(sprite, rotationDeg, scaleX, scaleY, warpDeg) {
  if (!sprite) return sprite;

  if (!warpDeg) {
    if (rotationDeg) sprite.setAngle(rotationDeg);
    if (scaleX !== 1 || scaleY !== 1) sprite.setScale(scaleX, scaleY);
    sprite._eeBaseScaleX = scaleX;
    sprite._eeBaseScaleY = scaleY;
    return sprite;
  }

  sprite._eeBaseScaleX = 1;
  sprite._eeBaseScaleY = 1;

  const { rotX, rotY } = gdWarpAxes(rotationDeg, warpDeg);
  sprite._gdWarp = { rotationX: rotX, rotationY: rotY, scaleX: scaleX, scaleY: scaleY };

  if (sprite._gdWarpHooked) return sprite;
  sprite._gdWarpHooked = true;

  const drawWebGL = sprite.renderWebGL;
  const drawCanvas = sprite.renderCanvas;

  sprite.renderWebGL = function (renderer, src, camera, parentMatrix) {
    drawWebGL.call(this, renderer, src, camera, _gdWarpParentMatrix(src, camera, parentMatrix));
  };
  sprite.renderCanvas = function (renderer, src, camera, parentMatrix) {
    drawCanvas.call(this, renderer, src, camera, _gdWarpParentMatrix(src, camera, parentMatrix));
  };

  return sprite;
}

function rotateSlopePoint(localX, localY, rotDeg) {
  const theta = -rotDeg * Math.PI / 180;
  const cosT = Math.cos(theta), sinT = Math.sin(theta);
  return { x: localX * cosT - localY * sinT, y: localX * sinT + localY * cosT };
}

function _createSlopeCollider(levelObj, objectDef, worldX, worldY) {
  const slopeData = _SLOPE_DATA[levelObj.id];
  if (!slopeData) return null;
  if (slopeData.sq) return null;
  if (_isDecorationSlopeId(levelObj.id)) return null;
  const _scaleRaw = Number(levelObj.scale);
  const _scale = Number.isFinite(_scaleRaw) && _scaleRaw > 0 ? _scaleRaw : 1;
  const _scaleX = Math.abs(Number(levelObj.scaleX)) || _scale;
  const _scaleY = Math.abs(Number(levelObj.scaleY)) || _scale;
  const hw0 = (slopeData.gw * a * _scaleX) / 2;
  const hh0 = (slopeData.gh * a * _scaleY) / 2;
  let vRight = { x: hw0, y: -hh0 };
  let vLo = { x: -hw0, y: -hh0 };
  let vHi = { x: hw0, y: hh0 };
  const fx = levelObj.flipX ? -1 : 1;
  const fy = levelObj.flipY ? -1 : 1;
  const flip = pt => ({ x: pt.x * fx, y: pt.y * fy });
  vRight = flip(vRight); vLo = flip(vLo); vHi = flip(vHi);
  const rotDeg = levelObj.rot || 0;
  vRight = rotateSlopePoint(vRight.x, vRight.y, rotDeg);
  vLo = rotateSlopePoint(vLo.x, vLo.y, rotDeg);
  vHi = rotateSlopePoint(vHi.x, vHi.y, rotDeg);
  const snap = pt => ({ x: Math.round(pt.x * 1e6) / 1e6, y: Math.round(pt.y * 1e6) / 1e6 });
  vRight = snap(vRight); vLo = snap(vLo); vHi = snap(vHi);
  const xs = [vRight.x, vLo.x, vHi.x];
  const ys = [vRight.y, vLo.y, vHi.y];
  const w = Math.max(...xs) - Math.min(...xs);
  const h = Math.max(...ys) - Math.min(...ys);
  const collider = new Collider(slopeType, worldX, worldY, w, h, 0);
  collider.objid = levelObj.id;
  collider.hypoAx = vLo.x; collider.hypoAy = vLo.y;
  collider.hypoBx = vHi.x; collider.hypoBy = vHi.y;
  collider.rightAx = vRight.x; collider.rightAy = vRight.y;
  const hypoDx = vHi.x - vLo.x;
  collider.slopeSolidBelow = Math.abs(hypoDx) < 0.01
    ? vRight.x < vLo.x
    : vRight.y < (vLo.y + ((vRight.x - vLo.x) / hypoDx) * (vHi.y - vLo.y));
  const rot90 = Math.round(((rotDeg % 360) + 360) % 360 / 90) % 4;
  const steep = rot90 === 1 || rot90 === 3;
  collider.slopeAngleDeg = steep ? (90 - slopeData.angle) : slopeData.angle;
  const { dir } = _resolveSlopeOrientation(objectDef, levelObj);
  collider.slopeDir = dir;
  collider.slopeFlipY = !collider.slopeSolidBelow;
  collider.slopeIsFilled = slopeData.sq;
  collider.slopeType = _gdSlopeType(levelObj.flipX, levelObj.flipY, levelObj.rot);
  collider.gdSolidAbove = _gdSlopeSolidAbove(collider.slopeType);
  collider.gdWallOnLeft = _gdSlopeWallOnLeft(collider.slopeType);
  return collider;
}

const flyPortal = "fly";
const cubePortal = "cube";
const portalWaveType = "portal_wave";
const portalUfoType = "portal_ufo";
const allObjects = window.allobjects();
for (const [objId, objectDef] of Object.entries(allObjects || {})) {
  if (!objectDef || typeof objectDef !== "object") continue;
  const animFrames = objectDef.animFrames;
  if (Array.isArray(animFrames) && animFrames.length && objectDef.frame && !/_color_/.test(objectDef.frame)
    && animFrames.every(f => /_color_\d+\.png$/.test(f))) {
    const basePrefix = objectDef.frame.replace(/_\d+\.png$/, "");
    const colorPrefix = animFrames[0].replace(/_color_\d+\.png$/, "");
    if (basePrefix === colorPrefix) {
      const ownFrame = f => typeof f === "string" && f.startsWith(basePrefix + "_");
      objectDef.children = (objectDef.children || []).filter(c => !ownFrame(c && c.frame));
      objectDef.children.unshift({
        frame: animFrames[animFrames.length - 1],
        localDy: 0,
        tint: 65280,
        z: -1,
        animFrames: animFrames.slice(),
        animInterval: objectDef.animInterval
      });
      objectDef.animFrames = animFrames.map(f => f.replace(/_color_(\d+\.png)$/, "_$1"));
    }
  }
  if (objectDef.glow === true || (objectDef.glow_frame && objectDef.glow_frame !== "none")) {
    objectDef.glow = true;
  }
}
if (!allObjects[745]) {
  allObjects[745] = {
    "can_color": false,
    "default_base_color_channel": 0,
    "frame": "portal_16_front_001.png",
    "glow_frame": "portal_16_front_glow_001.png",
    "gridH": 2.866666555404663,
    "gridW": 1.1333333253860474,
    "spritesheet": "GJ_GameSheet02-uhd",
    "type": "portal",
    "z": 10,
    "portalParticle": true,
    "portalParticleColor": 0xffff00
  };
}
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

const GD_SPEED_PIXELS_PER_SECOND = {
  HALF: 502.38,
  ONE_TIMES: 623.16,
  TWO_TIMES: 774.84,
  THREE_TIMES: 936.0,
  FOUR_TIMES: 1152.0
};

function getSpeedPixelsPerSecondFromKey(speedKey) {
  const speedValues = [
    GD_SPEED_PIXELS_PER_SECOND.ONE_TIMES,
    GD_SPEED_PIXELS_PER_SECOND.HALF,
    GD_SPEED_PIXELS_PER_SECOND.TWO_TIMES,
    GD_SPEED_PIXELS_PER_SECOND.THREE_TIMES,
    GD_SPEED_PIXELS_PER_SECOND.FOUR_TIMES
  ];
  const parsed = parseInt(speedKey ?? 0, 10);
  return speedValues[parsed] ?? GD_SPEED_PIXELS_PER_SECOND.ONE_TIMES;
}

function getSpeedPixelsPerSecondForPortalId(id) {
  const speedMap = {
    200: GD_SPEED_PIXELS_PER_SECOND.HALF,
    201: GD_SPEED_PIXELS_PER_SECOND.ONE_TIMES,
    202: GD_SPEED_PIXELS_PER_SECOND.TWO_TIMES,
    203: GD_SPEED_PIXELS_PER_SECOND.THREE_TIMES,
    1334: GD_SPEED_PIXELS_PER_SECOND.FOUR_TIMES
  };
  return speedMap[parseInt(id ?? 0, 10)] ?? null;
}

function getSpeedPortalValueForId(id) {
  const speedMap = {
    200: SpeedPortal.HALF,
    201: SpeedPortal.ONE_TIMES,
    202: SpeedPortal.TWO_TIMES,
    203: SpeedPortal.THREE_TIMES,
    1334: SpeedPortal.FOUR_TIMES
  };
  return speedMap[parseInt(id ?? 0, 10)] ?? null;
}

function calculateSongOffsetForX(targetX, startSpeedKey = 0, sourceObjects = null) {
  const targetWorldX = Math.max(0, Number(targetX) || 0);
  const objects = Array.isArray(sourceObjects) ? sourceObjects : [];
  const speedEvents = [];

  for (const obj of objects) {
    if (!obj) continue;
    const speedPixelsPerSecond = getSpeedPixelsPerSecondForPortalId(obj.id);
    if (speedPixelsPerSecond === null) continue;

    const raw = obj._raw || {};
    const rawX = Number(raw[2] ?? raw["2"] ?? obj.x ?? 0);
    if (!Number.isFinite(rawX)) continue;

    const worldX = rawX * 2;
    if (worldX < 0 || worldX > targetWorldX) continue;
    speedEvents.push({ x: worldX, speedPixelsPerSecond });
  }

  speedEvents.sort((a, b) => a.x - b.x);

  let currentX = 0;
  let currentPixelsPerSecond = getSpeedPixelsPerSecondFromKey(startSpeedKey);
  let offsetSeconds = 0;

  const addSegment = (nextX) => {
    const dx = Math.max(0, nextX - currentX);
    offsetSeconds += dx / Math.max(0.000001, currentPixelsPerSecond);
    currentX = nextX;
  };

  for (const event of speedEvents) {
    const nextX = Math.max(0, Math.min(targetWorldX, event.x));
    addSegment(nextX);
    currentPixelsPerSecond = event.speedPixelsPerSecond;
  }

  addSegment(targetWorldX);
  return Math.max(0, offsetSeconds);
}

window.calculateGeometryDashSongOffsetForX = calculateSongOffsetForX;

const objsWithGlow = [1, 2, 3, 4, 6, 7, 83, 84, 1332, 67, 8, 39, 103, 392, 35, 36, 40, 140, 141, 62, 65, 66, 68, 195, 196, 1022, 1594, 91, 122, 116, 118, 117, 119, 121, 162,];
for (let obj of objsWithGlow) {
  if (allObjects[obj]) {
    allObjects[obj].glow = true;
  }
}

window._animatedSprites = [];
window._animTimer = 0;
const SECRET_COIN_OBJECT_ID = 142;
const USER_COIN_OBJECT_ID = 1329;
const SECRET_COIN_MAX_PER_LEVEL = 3;
const SECRET_COIN_ANIM_FRAMES = [
  "secretCoin_b_01_001.png",
  "secretCoin_b_01_002.png",
  "secretCoin_b_01_003.png",
  "secretCoin_b_01_004.png"
];
const USER_COIN_ANIM_FRAMES = [
  "secretCoin_2_b_01_001.png",
  "secretCoin_2_b_01_002.png",
  "secretCoin_2_b_01_003.png",
  "secretCoin_2_b_01_004.png"
];
const GD_UNIT_TO_PIXELS = 2;
const SHAKE_MAX_STRENGTH = 100;
const SHAKE_MAX_OFFSET = SHAKE_MAX_STRENGTH * GD_UNIT_TO_PIXELS;
function getObjectFromId(id) {
  return allObjects[id] || null;
}

const EMPTY_TRIGGER_LIST = Object.freeze([]);
window.LevelObject = class LevelObject {
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
    this._flyVisualFloorInset = 0;
    this._flyVisualCeilingInset = 0;
    this.flyCameraTarget = null;
    this._colorTriggers = [];
    this._colorTriggerIdx = 0;
    this._touchColorTriggers = [];
    this._touchColorTriggerActivated = new Set();
    this._touchSpawnTriggerActivated = new Set();
    this._touchMoveTriggerActivated = new Set();
    this._touchAlphaTriggerActivated = new Set();
    this._audioScaleSprites = [];
    this._editorTriggerVisuals = [];
    this._orbSprites = [];
    this._audioPulseSprites = [];
    this._coinSprites = [];
    this._secretCoinRunCollected = new Set();
    this._secretCoinCompleted = new Set();
    this._secretCoinSlotCount = 0;
    this._userCoinRunCollected = new Set();
    this._userCoinCompleted = new Set();
    this._userCoinSlotCount = 0;
    this._sawSprites = [];
    this._glowSpriteKeys = new Set();
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
    this._stopTriggers = [];
    this._stopTriggerIdx = 0;
    this._touchStopTriggerActivated = new Set();
    this._followPlayerYTriggers = [];
    this._followPlayerYTriggerIdx = 0;
    this._activeFollowPlayerYTweens = [];
    this._touchFollowPlayerYTriggerActivated = new Set();
    this._followTriggers = [];
    this._followTriggerIdx = 0;
    this._activeFollowTweens = [];
    this._touchFollowTriggerActivated = new Set();
    this._toggleTriggers = [];
    this._toggleTriggerIdx = 0;
    this._touchToggleTriggerActivated = new Set();
    this._animationTriggers = [];
    this._animationTriggerIdx = 0;
    this._touchAnimationTriggerActivated = new Set();
    this._groupToggledOff = {};
    this._shakeTriggers = [];
    this._shakeTriggerIdx = 0;
    this._touchShakeTriggerActivated = new Set();
    this._playerVisTriggers = [];
    this._playerVisTriggerIdx = 0;
    this._touchPlayerVisActivated = new Set();
    this.playerHidden = false;
    this._shakeState = null;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
    this._beastSprites = [];
    this._onDeathTriggers = [];
    this._onDeathTriggerIdx = 0;
    this._armedOnDeathTriggers = [];
    this._touchOnDeathTriggerActivated = new Set();
    this._touchTriggers = [];
    this._touchTriggerIdx = 0;
    this._activeTouchTriggers = [];
    this._touchTouchTriggerActivated = new Set();
    this._pickupTriggers = [];
    this._pickupTriggerIdx = 0;
    this._touchPickupTriggerActivated = new Set();
    this._countTriggers = [];
    this._collisionBlocks = [];
    this._collisionTriggers = [];
    this._collisionTriggerIdx = 0;
    this._activeCollisionTriggers = [];
    this._countTriggerIdx = 0;
    this._activeCountTriggers = [];
    this._touchCountTriggerActivated = new Set();
    this._instantCountTriggers = [];
    this._instantCountTriggerIdx = 0;
    this._touchInstantCountTriggerActivated = new Set();
    this._itemCounts = {};
    this._pulseTriggers = [];
    this._pulseTriggerIdx = 0;
    this._activePulses = [];
    this._spawnTriggers = [];
    this._spawnTriggerIdx = 0;
    this._activeSpawnDelays = [];
    this._colorChannelSprites = {};
    this._ground2Tint = 0xffffff;
    this._groupSprites = {};
    this._resetobject = {};
    this._resetremovedobject = {};
    this._groupOffsets = {};
    this._groupRotations = {};
    this._groupOpacity = {};
    this._groupColliders = {};
    this._sections = [];
    this.objectSprites = [];
    this._sectionContainers = [];
    this._flatDepth = false;
    this._flatContainers = null;
    this._flatNeedsSort = false;
    this._spawnOrderCounter = 0;
    this._collisionSections = [];
    this._nearbyBuffer = [];
    this._visMinSec = -1;
    this._visMaxSec = -1;
    this._groundStartScreenY = b(0);
    this._ceilingStartScreenY = 0;
    this._activeStartPosIndex = -1; 
    this._startPositions = [];
    this._debugIdTextsList = [];
    this._debugIdEntries = [];
    this._debugIdEntriesByIndex = new Map();
    this._debugIdTextByIndex = new Map();
    this._debugIdLastCameraX = null;
    this._debugIdLastScreenWidth = null;
    this._invisibleBlockEntries = [];
    this._activeInvisibleBlocks = new Set();
    this._buildGround();
  }
  getStartPositions() {
      return this._startPositions.slice().sort((a, b) => a.x - b.x);
  }

  _breakblock(linkedObjectId) {
    if (!Number.isInteger(linkedObjectId)) return false;

    const spriteList = this.objectSprites?.[linkedObjectId];
    if (Array.isArray(spriteList)) {
      for (const sprite of [...spriteList]) {
        if (!sprite) continue;
        if (sprite._eeDebugIdEntry) sprite._eeDebugIdEntry.removed = true;
        if (sprite._eeInvisibleBlockEntry) {
          sprite._eeInvisibleBlockEntry.removed = true;
          this._activeInvisibleBlocks.delete(sprite._eeInvisibleBlockEntry);
        }
        if (sprite._eeIsGlowSprite && Array.isArray(this._glowSprites)) {
          const glowIdx = this._glowSprites.indexOf(sprite);
          if (glowIdx !== -1) this._glowSprites.splice(glowIdx, 1);
        }
        if (typeof sprite.destroy === "function") {
          sprite.destroy();
        }
      }
      delete this.objectSprites[linkedObjectId];
    }
    const debugEntry = this._debugIdEntriesByIndex?.get(linkedObjectId);
    if (debugEntry) debugEntry.removed = true;
    this._debugIdTextByIndex?.delete(linkedObjectId);
    if (this._debugIdTextsList?.length) {
      this._debugIdTextsList = this._debugIdTextsList.filter(text => text?._eeObjectId !== linkedObjectId);
    }

    if (Array.isArray(this._glowSprites)) {
      for (const glow of [...this._glowSprites]) {
        if (glow && glow._eeObjectId === linkedObjectId) {
          if (typeof glow.destroy === "function") glow.destroy();
          const glowIdx = this._glowSprites.indexOf(glow);
          if (glowIdx !== -1) this._glowSprites.splice(glowIdx, 1);
        }
      }
    }

    if (this._glowSpriteKeys) {
      const remainingGlowKeys = new Set();
      for (const glow of this._glowSprites || []) {
        if (!glow || !glow.texture || !glow.frame) continue;
        const key = `${glow._eeWorldX ?? glow.x}:${glow._eeBaseY ?? glow.y}:${glow.texture.key}/${glow.frame.name || glow.frame.textureFrame || glow.frame.key || glow.frame}`;
        if (key) remainingGlowKeys.add(key);
      }
      this._glowSpriteKeys = remainingGlowKeys;
    }

    const collidersToRemove = [];
    for (const collider of this.objects || []) {
      if (collider && collider._eeObjectId === linkedObjectId) {
        collidersToRemove.push(collider);
      }
    }

    for (const collider of collidersToRemove) {
      if (!collider) continue;
      const sectionIndex = Number.isInteger(collider._eeCollisionSectionIndex) ? collider._eeCollisionSectionIndex : null;
      if (sectionIndex !== null && Array.isArray(this._collisionSections?.[sectionIndex])) {
        const section = this._collisionSections[sectionIndex];
        const idx = section.indexOf(collider);
        if (idx !== -1) section.splice(idx, 1);
      }

      const objectsIdx = this.objects.indexOf(collider);
      if (objectsIdx !== -1) this.objects.splice(objectsIdx, 1);

      const groupIds = Array.isArray(collider._eeGroups) ? collider._eeGroups : [];
      for (const groupId of groupIds) {
        const groupColliders = this._groupColliders?.[groupId];
        if (Array.isArray(groupColliders)) {
          const groupIdx = groupColliders.indexOf(collider);
          if (groupIdx !== -1) groupColliders.splice(groupIdx, 1);
          if (!groupColliders.length) delete this._groupColliders[groupId];
        }
      }
    }

    const restoreLevelObj = this._resetobject?.[linkedObjectId];
    if (restoreLevelObj) {
      this._resetremovedobject[linkedObjectId] = restoreLevelObj;
      delete this._resetobject[linkedObjectId];
    }

    return true;
  }

  _resetremovedobjects() {
    if (!this._resetremovedobject || !Object.keys(this._resetremovedobject).length) {
      return;
    }

    const entries = Object.entries(this._resetremovedobject);
    this._resetremovedobject = {};
    for (const [, levelObj] of entries) {
      if (!levelObj) continue;
      if (parseInt(levelObj.id ?? 0, 10) !== 143) continue;
      this._spawnObject(levelObj);
    }
  }

  getSongOffsetForX(targetX, options = {}) {
      const sourceObjects = Array.isArray(options.sourceObjects)
        ? options.sourceObjects
        : (Array.isArray(window.levelObjects) ? window.levelObjects : (this._sourceLevelObjects || []));
      const startSpeedKey = options.startSpeedKey ?? window.settingsMap?.["kA4"] ?? 0;
      return calculateSongOffsetForX(targetX, startSpeedKey, sourceObjects);
  }

  _isTriggerSpawnTriggered(levelObj) {
    return String(levelObj?._raw?.[62] ?? levelObj?._raw?.["62"] ?? "0") === "1";
  }

  _getTeleportPortalYOffset(levelObj) {
    const raw = levelObj?._raw || {};
    const hasOffset = raw[54] !== undefined || raw["54"] !== undefined;
    const parsed = parseFloat(hasOffset ? (raw[54] ?? raw["54"]) : 90);
    return Number.isFinite(parsed) ? parsed : 90;
  }

  _normalizeTeleportPortals(levelObjects) {
    if (!Array.isArray(levelObjects)) return [];

    const normalized = [];
    const standaloneExitPortals = [];

    for (const obj of levelObjects) {
      if (!obj) continue;
      if (parseInt(obj.id ?? 0, 10) === 749) {
        standaloneExitPortals.push(obj);
      } else {
        normalized.push(obj);
      }
    }

    for (const exitObj of standaloneExitPortals) {
      const exitX = parseFloat(exitObj.x ?? exitObj._raw?.[2] ?? exitObj._raw?.["2"] ?? 0) || 0;
      let enterObj = null;
      let bestDistance = Infinity;

      for (const candidate of normalized) {
        if (!candidate || parseInt(candidate.id ?? 0, 10) !== 747) continue;
        const candidateX = parseFloat(candidate.x ?? candidate._raw?.[2] ?? candidate._raw?.["2"] ?? 0) || 0;
        const distance = Math.abs(candidateX - exitX);
        if (distance < bestDistance) {
          bestDistance = distance;
          enterObj = candidate;
        }
      }

      if (enterObj) {
        const enterY = parseFloat(enterObj.y ?? enterObj._raw?.[3] ?? enterObj._raw?.["3"] ?? 0) || 0;
        const exitY = parseFloat(exitObj.y ?? exitObj._raw?.[3] ?? exitObj._raw?.["3"] ?? enterY) || enterY;
        const yOffset = exitY - enterY;
        enterObj._raw = enterObj._raw || {};
        enterObj._raw[54] = String(yOffset);
        enterObj._raw["54"] = String(yOffset);
      }
    }

    return normalized.filter(Boolean);
  }

  _getLevelObjectGroupIds(levelObj) {
    const values = [];
    const addRawGroups = (rawGroups) => {
      String(rawGroups ?? "")
        .split(".")
        .map(value => parseInt(value, 10))
        .filter(value => Number.isFinite(value) && value > 0)
        .forEach(value => values.push(value));
    };

    addRawGroups(levelObj?._raw?.[33] ?? levelObj?._raw?.["33"]);
    addRawGroups(levelObj?._raw?.[57] ?? levelObj?._raw?.["57"]);
    addRawGroups(levelObj?.groups);

    return [...new Set(values)];
  }

  _parseSingleTriggerGroupId(value, fallback = 0) {
    const parts = String(value ?? "")
      .split(/[,.]/)
      .map(part => parseInt(part.trim(), 10))
      .filter(groupId => Number.isFinite(groupId) && groupId > 0);
    return parts.length ? parts[0] : fallback;
  }

  _parseRotateTriggerGroups(raw) {
    const targetRaw = raw?.[51] ?? raw?.["51"] ?? 0;
    const centerRaw = raw?.[71] ?? raw?.["71"] ?? 0;
    const targetParts = String(targetRaw ?? "")
      .split(/[,.]/)
      .map(part => parseInt(part.trim(), 10))
      .filter(groupId => Number.isFinite(groupId) && groupId > 0);
    const centerParts = String(centerRaw ?? "")
      .split(/[,.]/)
      .map(part => parseInt(part.trim(), 10))
      .filter(groupId => Number.isFinite(groupId) && groupId > 0);
    const targetGroup = targetParts.length ? targetParts[0] : 0;
    const centerGroup = centerParts.length ? centerParts[0] : 0;
    return { targetGroup, centerGroup };
  }

  _makeTriggerBase(levelObj, linkedObjectId) {
    return {
      uid: linkedObjectId,
      spawnTriggered: this._isTriggerSpawnTriggered(levelObj),
      groups: this._getLevelObjectGroupIds(levelObj)
    };
  }

  _triggerHasGroup(trigger, groupId) {
    const target = parseInt(groupId ?? 0, 10);
    return target > 0 && Array.isArray(trigger?.groups) && trigger.groups.includes(target);
  }

  fastForwardTriggers(targetX, colorManager) {
    const triggers = this._colorTriggers.sort((a, b) => a.x - b.x);

    for (let trigger of triggers) {
      if (trigger.touchTriggered || !this._isTriggerSaveObjectLive(trigger.uid)) continue;
      if (trigger.x <= targetX) {
        colorManager.triggerColor(trigger.index, trigger.color, 0, trigger.copy, trigger.opacity);
        this.setChannelBlending(trigger.index, !!trigger.blending);
      } else {
        break;
      }
    }

    if (Array.isArray(this._toggleTriggers)) {
      for (let trigger of this._toggleTriggers) {
        if (trigger.touchTriggered || trigger.spawnTriggered || !this._isTriggerSaveObjectLive(trigger.uid)) continue;
        if (trigger.x <= targetX) {
          this._executeToggleTrigger(trigger);
        } else {
          break;
        }
      }
    }

    this.checkAnimationTriggers(targetX);

    if (Array.isArray(this._pickupTriggers)) {
      this.checkPickupTriggers(targetX, colorManager);
    }
    if (Array.isArray(this._countTriggers)) {
      this.checkCountTriggers(targetX, colorManager);
    }
    if (Array.isArray(this._collisionTriggers)) {
      this.checkCollisionTriggers(targetX);
    }
    if (Array.isArray(this._instantCountTriggers)) {
      this.checkInstantCountTriggers(targetX, colorManager);
    }
    if (Array.isArray(this._onDeathTriggers)) {
      this.checkOnDeathTriggers(targetX);
    }
    if (Array.isArray(this._touchTriggers)) {
      this.checkTouchTriggers(targetX);
    }
  }
  loadLevel(levelData) {
    let {
      objects: levelObjects,
      settings: settingslist
    } = parseLevel(levelData);
    levelObjects = this._normalizeTeleportPortals(levelObjects);
    let secretCoinCount = 0;
    let userCoinCount = 0;
    const isOfficialLevel = this._isOfficialLevel();
    levelObjects = levelObjects.filter(levelObj => {
      const objectId = parseInt(levelObj?.id ?? 0, 10);
      if (objectId === SECRET_COIN_OBJECT_ID && !isOfficialLevel) return false;
      if (objectId === USER_COIN_OBJECT_ID && isOfficialLevel) return false;
      if (objectId === USER_COIN_OBJECT_ID) {
        if (userCoinCount >= SECRET_COIN_MAX_PER_LEVEL) return false;
        userCoinCount++;
        return true;
      }
      if (objectId !== SECRET_COIN_OBJECT_ID) return true;
      if (secretCoinCount >= SECRET_COIN_MAX_PER_LEVEL) return false;
      secretCoinCount++;
      return true;
    });
    window._animatedSprites.length = 0;
    this._cullableEmitters = [];
    this._secretCoinRunCollected.clear();
    this._secretCoinCompleted = this._loadSecretCoinProgress();
    this._secretCoinSlotCount = 0;
    this._userCoinRunCollected.clear();
    this._userCoinCompleted = window.isEditor ? new Set() : this._loadUserCoinProgress();
    this._userCoinSlotCount = 0;
    this._sourceLevelObjects = levelObjects;
    this._setUpSettings(settingslist);
    this._flatDepth = !window.enableLDM && !window.isEditor;
    this._channelBlendingInitial = { ...(this._channelBlending || {}) };
    this._spawnLevelObjects(levelObjects);
    this.checkToggleTriggers?.(0);
    this.checkPickupTriggers?.(0);
    this.checkCountTriggers?.(0);
    this.checkCollisionTriggers?.(0);
    this.checkInstantCountTriggers?.(0);
    this.checkOnDeathTriggers?.(0);
    this.checkTouchTriggers?.(0);
    window.levelObjects = levelObjects;
    window.settingslist = settingslist;
  }

  _isOfficialLevel() {
    const levelId = window.currentlevel?.[2];
    return !!levelId && Array.isArray(window.allLevels) && window.allLevels.some(level => level?.[2] === levelId);
  }

  _isStoredUserLevel() {
    return String(window.currentlevel?.[2] || "").startsWith("local_");
  }

  _secretCoinProgressKey() {
    return `gd_secretCoins_${window.currentlevel?.[2] || "level_1"}`;
  }

  _userCoinProgressKey() {
    return `gd_userCoins_${window.currentlevel?.[2] || "level_1"}`;
  }

  _loadSecretCoinProgress() {
    if (!this._isOfficialLevel()) return new Set();
    try {
      const saved = JSON.parse(localStorage.getItem(this._secretCoinProgressKey()) || "[]");
      return new Set(Array.isArray(saved) ? saved.slice(0, SECRET_COIN_MAX_PER_LEVEL).map(String) : []);
    } catch (_error) {
      return new Set();
    }
  }

  _loadUserCoinProgress() {
    if (window.isEditor || this._isOfficialLevel()) return new Set();
    try {
      const saved = JSON.parse(localStorage.getItem(this._userCoinProgressKey()) || "[]");
      return new Set(Array.isArray(saved) ? saved.slice(0, SECRET_COIN_MAX_PER_LEVEL).map(String) : []);
    } catch (_error) {
      return new Set();
    }
  }

  resetUserCoinsForEditor() {
    this._userCoinRunCollected.clear();
    this._userCoinCompleted.clear();
    for (const sprite of this._coinSprites) {
      if (sprite?._userCoinId === undefined) continue;
      this._setUserCoinAnimation(sprite, false);
      sprite.setVisible(true).setAlpha(1);
    }
    for (const collider of this.objects) {
      if (collider?.userCoinId !== undefined) {
        collider._userCoinCompleted = false;
        collider.activated = false;
      }
    }
  }

  resetCoinsForEditorCompletion() {
    this._editorEndSecretCoinSlots = new Set(
      this._coinSprites
        .filter(sprite => sprite?._secretCoinSlot !== undefined && this._secretCoinRunCollected.has(String(sprite._secretCoinId)))
        .map(sprite => sprite._secretCoinSlot)
        .filter(slot => Number.isInteger(slot))
    );
    this._editorEndUserCoinSlots = new Set(
      this._coinSprites
        .filter(sprite => sprite?._userCoinSlot !== undefined && this._userCoinRunCollected.has(String(sprite._userCoinId)))
        .map(sprite => sprite._userCoinSlot)
        .filter(slot => Number.isInteger(slot))
    );
    this._secretCoinRunCollected.clear();
    this._userCoinRunCollected.clear();
    this._secretCoinCompleted.clear();
    this._userCoinCompleted.clear();
    for (const sprite of this._coinSprites) {
      if (sprite?._secretCoinId !== undefined) this._setSecretCoinAnimation(sprite, false);
      if (sprite?._userCoinId !== undefined) this._setUserCoinAnimation(sprite, false);
      if (sprite) sprite.setVisible(true).setAlpha(1);
    }
    for (const collider of this.objects) {
      if (collider?.secretCoinId !== undefined || collider?.userCoinId !== undefined) {
        collider._secretCoinCompleted = false;
        collider._userCoinCompleted = false;
        collider.activated = false;
      }
    }
  }

  _setSecretCoinAnimation(sprite, collected) {
    if (!sprite) return;
    sprite._animFrames = collected ? SECRET_COIN_ANIM_FRAMES : [
      "secretCoin_01_001.png",
      "secretCoin_01_002.png",
      "secretCoin_01_003.png",
      "secretCoin_01_004.png"
    ];
    sprite._animIdx = 0;
    const frameInfo = getAtlasFrame(this._scene, sprite._animFrames[0]);
    if (frameInfo) sprite.setTexture(frameInfo.atlas, frameInfo.frame);
    sprite._secretCoinCompleted = !!collected;
  }

  _setUserCoinAnimation(sprite, collected) {
    if (!sprite) return;
    sprite._animFrames = collected ? USER_COIN_ANIM_FRAMES : [
      "secretCoin_2_01_001.png",
      "secretCoin_2_01_002.png",
      "secretCoin_2_01_003.png",
      "secretCoin_2_01_004.png"
    ];
    sprite._animIdx = 0;
    const frameInfo = getAtlasFrame(this._scene, sprite._animFrames[0]);
    if (frameInfo) sprite.setTexture(frameInfo.atlas, frameInfo.frame);
    sprite._userCoinCompleted = !!collected;
  }

  tryCollectSecretCoin(collider) {
    if (collider?.secretCoinId === undefined || this._secretCoinCompleted.has(String(collider.secretCoinId))) return false;
    if (this._secretCoinRunCollected.size >= SECRET_COIN_MAX_PER_LEVEL) return false;
    this._secretCoinRunCollected.add(String(collider.secretCoinId));
    return true;
  }

  tryCollectUserCoin(collider) {
    if (collider?.userCoinId === undefined || this._userCoinCompleted.has(String(collider.userCoinId))) return false;
    if (this._userCoinRunCollected.size >= SECRET_COIN_MAX_PER_LEVEL) return false;
    this._userCoinRunCollected.add(String(collider.userCoinId));
    return true;
  }

  commitSecretCoins() {
    if (!this._isOfficialLevel()) return;
    const saved = this._loadSecretCoinProgress();
    const newlyCollected = [...this._secretCoinRunCollected]
      .filter(id => !saved.has(id))
      .slice(0, SECRET_COIN_MAX_PER_LEVEL - saved.size);
    for (const id of newlyCollected) saved.add(id);
    if (!newlyCollected.length) return;

    localStorage.setItem(this._secretCoinProgressKey(), JSON.stringify([...saved].slice(0, SECRET_COIN_MAX_PER_LEVEL)));
    const collectedSlots = this._coinSprites
      .filter(sprite => sprite?._secretCoinId !== undefined && saved.has(String(sprite._secretCoinId)))
      .map(sprite => sprite._secretCoinSlot)
      .filter(slot => Number.isInteger(slot))
      .slice(0, SECRET_COIN_MAX_PER_LEVEL);
    localStorage.setItem(`${this._secretCoinProgressKey()}_slots`, JSON.stringify(collectedSlots));
    this._secretCoinCompleted = saved;
    this._scene._totalsecretcoins = (this._scene._totalsecretcoins || 0) + newlyCollected.length;
    window._totalsecretcoins = this._scene._totalsecretcoins;
    localStorage.setItem("gd_totalsecretcoins", String(this._scene._totalsecretcoins));
    for (const sprite of this._coinSprites) {
      if (sprite?._secretCoinId !== undefined && saved.has(String(sprite._secretCoinId))) {
        this._setSecretCoinAnimation(sprite, true);
        sprite.setVisible(true).setAlpha(1);
      }
    }
  }

  commitUserCoins() {
    if (window.isEditor || this._isOfficialLevel() || this._isStoredUserLevel()) return;
    const saved = this._loadUserCoinProgress();
    const newlyCollected = [...this._userCoinRunCollected]
      .filter(id => !saved.has(id))
      .slice(0, SECRET_COIN_MAX_PER_LEVEL - saved.size);
    for (const id of newlyCollected) saved.add(id);
    if (!newlyCollected.length) return;

    localStorage.setItem(this._userCoinProgressKey(), JSON.stringify([...saved].slice(0, SECRET_COIN_MAX_PER_LEVEL)));
    const collectedSlots = this._coinSprites
      .filter(sprite => sprite?._userCoinId !== undefined && saved.has(String(sprite._userCoinId)))
      .map(sprite => sprite._userCoinSlot)
      .filter(slot => Number.isInteger(slot))
      .slice(0, SECRET_COIN_MAX_PER_LEVEL);
    localStorage.setItem(`${this._userCoinProgressKey()}_slots`, JSON.stringify(collectedSlots));
    this._userCoinCompleted = saved;
    this._scene._totalusercoins = (this._scene._totalusercoins || 0) + newlyCollected.length;
    window._totalusercoins = this._scene._totalusercoins;
    localStorage.setItem("gd_totalusercoins", String(this._scene._totalusercoins));
    for (const sprite of this._coinSprites) {
      if (sprite?._userCoinId !== undefined && saved.has(String(sprite._userCoinId))) {
        this._setUserCoinAnimation(sprite, true);
        sprite.setVisible(true).setAlpha(1);
      }
    }
  }
  _setUpSettings(settingsStr) {
    this._initialColors = {};
    this._initialCopies = {};
    this._initialOpacity = {};
    this._channelBlending = { 1007: true };
    this._backgroundId = null;
    this._groundId = null;
    if (!settingsStr) return;
    let pairs = settingsStr.split(",");
    window.settingsMap = {};
    for (let i = 0; i + 1 < pairs.length; i += 2) {
      settingsMap[pairs[i]] = pairs[i + 1];
    }
    let colorStr = settingsMap["kS38"];
    window._backgroundId = getBackgroundDisplayId(settingsMap["kA6"]);
    window._groundId = getGroundTextureId(settingsMap["kA7"]);
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
        if (channelId === 1005 || channelId === 1006) {
          this._channelBlending[channelId] = colorProps[5] === "1";
          continue;
        }
        if (channelId === 1007) continue;
        if (!isNaN(channelId)) {
          this._initialColors[channelId] = {
            r: parseInt(colorProps[1] || "255", 10),
            g: parseInt(colorProps[2] || "255", 10),
            b: parseInt(colorProps[3] || "255", 10)
          };
          this._channelBlending[channelId] = colorProps[5] === "1";
          const channelOpacity = parseFloat(colorProps[7]);
          if (Number.isFinite(channelOpacity) && channelOpacity !== 1) {
            this._initialOpacity[channelId] = Math.max(0, Math.min(1, channelOpacity));
          }
          const copySource = parseInt(colorProps[9] || "0", 10);
          if (copySource > 0 && copySource !== channelId) {
            this._initialCopies[channelId] = {
              source: copySource,
              hsv: parseChannelHsv(colorProps[10])
            };
          }
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
    const legacyHeaderChannels = {
      kS29: 1000,
      kS30: 1001,
      kS31: 1002,
      kS32: 1004,
      kS33: 1,
      kS34: 2,
      kS35: 3,
      kS36: 4,
      kS37: 1003
    };
    for (const headerKey in legacyHeaderChannels) {
      const channelId = legacyHeaderChannels[headerKey];
      if (this._initialColors[channelId] || !settingsMap[headerKey]) continue;
      const col = parseColorEntry(settingsMap[headerKey]);
      if (col) {
        this._initialColors[channelId] = col;
        const entryProps = {};
        const legacyParts = settingsMap[headerKey].split("_");
        for (let propIndex = 0; propIndex + 1 < legacyParts.length; propIndex += 2) {
          entryProps[parseInt(legacyParts[propIndex], 10)] = legacyParts[propIndex + 1];
        }
        this._channelBlending[channelId] = entryProps[5] === "1";
      }
    }
    this._legacyColorLevel = !settingsMap["kS38"] && !!settingsMap["kS29"];
    if (this._legacyColorLevel) this._channelBlending[1002] = true;
  }
  _buildGround() {
    if (window.isEditor) return; // not dealing with ts rn
    const scene = this._scene;
    window._groundId = window._groundId ? window._groundId : "00";
    
    const groundFrame = scene.textures.getFrame("groundSquare_" + window._groundId + "_001.png");
    this._tileW = groundFrame ? groundFrame.width : 1012;
    this._groundTiles = [];
    this._ceilingTiles = [];
    this._ground2Tiles = [];
    this._ceiling2Tiles = [];
    const ground2TexKey = "groundSquare_" + window._groundId + "_2_001.png";
    const hasGround2 = scene.textures.exists(ground2TexKey);
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
      if (hasGround2) {
        let ground2Tile = scene.add.image(0, groundY, ground2TexKey);
        ground2Tile.setOrigin(0, 0);
        ground2Tile.setTint(this._ground2Tint);
        ground2Tile.setDepth(20.5);
        ground2Tile._worldX = tileX;
        this._ground2Tiles.push(ground2Tile);
      }
      let ceilingTile = scene.add.image(0, groundY, "groundSquare_" + window._groundId + "_001.png");
      ceilingTile.setOrigin(0, 1);
      ceilingTile.setFlipY(true);
      ceilingTile.setTint(17578);
      ceilingTile.setDepth(20);
      ceilingTile.setVisible(false);
      ceilingTile._worldX = tileX;
      this._ceilingTiles.push(ceilingTile);
      if (hasGround2) {
        let ceiling2Tile = scene.add.image(0, groundY, ground2TexKey);
        ceiling2Tile.setOrigin(0, 1);
        ceiling2Tile.setFlipY(true);
        ceiling2Tile.setTint(this._ground2Tint);
        ceiling2Tile.setDepth(20.5);
        ceiling2Tile.setVisible(false);
        ceiling2Tile._worldX = tileX;
        this._ceiling2Tiles.push(ceiling2Tile);
      }
    }
    this._maxGroundWorldX = startX + (tileCount - 1) * this._tileW;
    this._groundShift = ((startX % this._tileW) + this._tileW) % this._tileW;
    const floorLineFrame = scene.textures.getFrame("GJ_WebSheet", "floorLine_01_001.png");
    const floorLineWidth = floorLineFrame ? floorLineFrame.width : 888;
    const floorLineScale = (screenWidth + SHAKE_MAX_OFFSET * 2) / floorLineWidth;
    this._groundLine = scene.add.image(screenWidth / 2, groundY - 1, "GJ_WebSheet", "floorLine_01_001.png").setOrigin(0.5, 0).setScale(floorLineScale, 1).setBlendMode(S).setDepth(21).setScrollFactor(0);
    this._ceilingLine = scene.add.image(screenWidth / 2, groundY + 1, "GJ_WebSheet", "floorLine_01_001.png").setOrigin(0.5, 1).setScale(floorLineScale, 1).setFlipY(true).setBlendMode(S).setDepth(21).setScrollFactor(0).setVisible(false);
    const shadowAlpha = 100 / 255;
    this._groundShadowL = scene.add.image(-1, groundY, "GJ_WebSheet", "groundSquareShadow_001.png").setOrigin(0, 0).setScrollFactor(0).setDepth(22).setAlpha(shadowAlpha).setScale(0.7, 1).setBlendMode(E);
    this._groundShadowR = scene.add.image(screenWidth + 1, groundY, "GJ_WebSheet", "groundSquareShadow_001.png").setOrigin(1, 0).setScrollFactor(0).setDepth(22).setAlpha(shadowAlpha).setScale(0.7, 1).setFlipX(true).setBlendMode(E);
    this._ceilingShadowL = scene.add.image(-1, groundY, "GJ_WebSheet", "groundSquareShadow_001.png").setOrigin(0, 1).setScrollFactor(0).setDepth(22).setAlpha(shadowAlpha).setScale(0.7, 1).setFlipY(true).setBlendMode(E).setVisible(false);
    this._ceilingShadowR = scene.add.image(screenWidth + 1, groundY, "GJ_WebSheet", "groundSquareShadow_001.png").setOrigin(1, 1).setScrollFactor(0).setDepth(22).setAlpha(shadowAlpha).setScale(0.7, 1).setFlipX(true).setFlipY(true).setBlendMode(E).setVisible(false);
  }
  applyGroundTexture() {
    if (window.isEditor) return; // not dealing with ts rn
    const gId = window._groundId || "00";
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

    const ground2TexKey = "groundSquare_" + gId + "_2_001.png";
    const hasGround2 = this._scene.textures.exists(ground2TexKey);
    this._ground2Tiles = this._ground2Tiles || [];
    this._ceiling2Tiles = this._ceiling2Tiles || [];

    if (hasGround2) {
      for (let i = 0; i < this._groundTiles.length; i++) {
        const groundTile = this._groundTiles[i];
        const ceilingTile = this._ceilingTiles[i];
        if (!groundTile || !ceilingTile) continue;

        if (!this._ground2Tiles[i]) {
          const ground2Tile = this._scene.add.image(groundTile.x || 0, groundTile.y || b(0), ground2TexKey);
          ground2Tile.setOrigin(0, 0);
          ground2Tile.setTint(this._ground2Tint);
          ground2Tile.setDepth(20.5);
          ground2Tile._worldX = groundTile._worldX;
          this._ground2Tiles[i] = ground2Tile;
        } else {
          this._ground2Tiles[i].setTexture(ground2TexKey);
          this._ground2Tiles[i].setTint(this._ground2Tint);
        }
        this._ground2Tiles[i].setVisible(true);

        if (!this._ceiling2Tiles[i]) {
          const ceiling2Tile = this._scene.add.image(ceilingTile.x || 0, ceilingTile.y || b(0), ground2TexKey);
          ceiling2Tile.setOrigin(0, 1);
          ceiling2Tile.setFlipY(true);
          ceiling2Tile.setTint(this._ground2Tint);
          ceiling2Tile.setDepth(20.5);
          ceiling2Tile.setVisible(false);
          ceiling2Tile._worldX = ceilingTile._worldX;
          this._ceiling2Tiles[i] = ceiling2Tile;
        } else {
          this._ceiling2Tiles[i].setTexture(ground2TexKey);
          this._ceiling2Tiles[i].setFlipY(true);
          this._ceiling2Tiles[i].setTint(this._ground2Tint);
        }
        this._ceiling2Tiles[i].setVisible(false);
      }
    } else {
      for (let tile of this._ground2Tiles || []) {
        if (tile) tile.setVisible(false);
      }
      for (let tile of this._ceiling2Tiles || []) {
        if (tile) tile.setVisible(false);
      }
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
      let newGroundTile = scene.add.image(0, groundY, "groundSquare_" + window._groundId + "_001.png");
      newGroundTile.setOrigin(0, 0).setTint(((newTile = this._groundTiles[0]) == null ? undefined : newTile.tintTopLeft) || 17578).setDepth(20);
      newGroundTile._worldX = newTileX;
      this._groundTiles.push(newGroundTile);
      const ground2TexKey = "groundSquare_" + window._groundId + "_2_001.png";
      if (scene.textures.exists(ground2TexKey)) {
        let newGround2Tile = scene.add.image(0, groundY, ground2TexKey);
        newGround2Tile.setOrigin(0, 0).setTint(this._ground2Tint).setDepth(20.5);
        newGround2Tile._worldX = newTileX;
        this._ground2Tiles.push(newGround2Tile);
      }
      let newCeilingTile = scene.add.image(0, groundY, "groundSquare_" + window._groundId + "_001.png");
      newCeilingTile.setOrigin(0, 1).setFlipY(true).setTint(((newTile = this._groundTiles[0]) == null ? undefined : newTile.tintTopLeft) || 17578).setDepth(20).setVisible(false);
      newCeilingTile._worldX = newTileX;
      this._ceilingTiles.push(newCeilingTile);
      if (scene.textures.exists(ground2TexKey)) {
        let newCeiling2Tile = scene.add.image(0, groundY, ground2TexKey);
        newCeiling2Tile.setOrigin(0, 1).setFlipY(true).setTint(this._ground2Tint).setDepth(20.5).setVisible(false);
        newCeiling2Tile._worldX = newTileX;
        this._ceiling2Tiles.push(newCeiling2Tile);
      }
      this._maxGroundWorldX = newTileX;
    }
    const floorLineFrame = this._scene.textures.getFrame("GJ_WebSheet", "floorLine_01_001.png");
    const floorLineScale = (screenWidth + SHAKE_MAX_OFFSET * 2) / (floorLineFrame ? floorLineFrame.width : 888);
    this._groundLine.x = screenWidth / 2;
    this._groundLine.setScale(floorLineScale, 1);
    this._ceilingLine.x = screenWidth / 2;
    this._ceilingLine.setScale(floorLineScale, 1);
    this._groundShadowR.x = screenWidth + 1;
    this._ceilingShadowR.x = screenWidth + 1;
  }
  updateGroundTiles(cameraY = 0) {
    const cameraX = this._cameraXRef.value;
    const shakeX = this.shakeOffsetX || 0;
    const shakeY = this.shakeOffsetY || 0;
    const tileWidth = this._tileW;
    let leftTileIndex;
    let rightTileIndex;
    let maxWorldX = -Infinity;
    const ceilingActive = !this._flyGroundActive && this._flyCeilingY !== null;
    if (this._flyVisualOnly && this._flyCeilingY !== null) {
      leftTileIndex = b(0) + cameraY;
      rightTileIndex = b(this._flyCeilingY) + cameraY;
    } else if (this._flyGroundActive && this._groundTargetValue > 0.001) {
      let groundTarget = this._groundTargetValue;
      const visualFloorInset = Number.isFinite(Number(this._flyVisualFloorInset)) ? Number(this._flyVisualFloorInset) : 0;
      const visualCeilingInset = Number.isFinite(Number(this._flyVisualCeilingInset)) ? Number(this._flyVisualCeilingInset) : 0;
      let targetGroundY = 620 - visualFloorInset;
      let targetCeilingY = 20 + visualCeilingInset;
      let groundScreenY = b(0) + cameraY;
      let ceilingScreenY = 0;
      leftTileIndex = groundScreenY + (targetGroundY - groundScreenY) * groundTarget;
      rightTileIndex = ceilingScreenY + (targetCeilingY - ceilingScreenY) * groundTarget;
      if (leftTileIndex > groundScreenY) {
        leftTileIndex = groundScreenY;
      }
    } else {
      leftTileIndex = b(0) + cameraY;
      rightTileIndex = ceilingActive ? 20 : 0;
    }
    const ground2TexKey = "groundSquare_" + (window._groundId || "00") + "_2_001.png";
    const hasGround2 = this._scene.textures.exists(ground2TexKey);
    const tileCount = this._groundTiles.length;
    const groundShift = this._groundShift || 0;
    const firstColumn = Math.floor((cameraX - SHAKE_MAX_OFFSET - groundShift) / tileWidth);
    for (let i = 0; i < tileCount; i++) {
      let groundTile = this._groundTiles[i];
      let ceilingTile = this._ceilingTiles[i];
      const column = firstColumn + ((((i - firstColumn) % tileCount) + tileCount) % tileCount);
      groundTile._worldX = column * tileWidth + groundShift;
      ceilingTile._worldX = groundTile._worldX;
      if (groundTile._worldX > maxWorldX) maxWorldX = groundTile._worldX;
      this._maxGroundWorldX = maxWorldX;
      let tileScreenX = groundTile._worldX - cameraX + shakeX;
      groundTile.x = tileScreenX;
      groundTile.y = leftTileIndex + shakeY;
      const ground2Tile = this._ground2Tiles?.[i];
      if (ground2Tile) {
        ground2Tile.x = tileScreenX;
        ground2Tile.y = leftTileIndex + shakeY;
        ground2Tile.setVisible(hasGround2);
      }
      ceilingTile.x = tileScreenX;
      ceilingTile.y = rightTileIndex + shakeY;
      const ceilingVisibleForTile = this._flyGroundActive && this._groundTargetValue > 0 || ceilingActive;
      ceilingTile.setVisible(ceilingVisibleForTile);
      const ceiling2Tile = this._ceiling2Tiles?.[i];
      if (ceiling2Tile) {
        ceiling2Tile.x = tileScreenX;
        ceiling2Tile.y = rightTileIndex + shakeY;
        ceiling2Tile.setVisible(hasGround2 && ceilingVisibleForTile);
      }
    }
    this._groundLine.x = screenWidth / 2 + shakeX;
    this._groundLine.y = leftTileIndex + shakeY;
    this._ceilingLine.x = screenWidth / 2 + shakeX;
    if (this._flyGroundActive && this._groundTargetValue > 0 || ceilingActive) {
      this._ceilingLine.y = rightTileIndex + shakeY;
      this._ceilingLine.setVisible(true);
    } else {
      this._ceilingLine.setVisible(false);
    }
    this._groundShadowL.y = leftTileIndex + shakeY;
    this._groundShadowR.y = leftTileIndex + shakeY;
    let ceilingVisible = this._flyGroundActive && this._groundTargetValue > 0 || ceilingActive;
    this._ceilingShadowL.y = rightTileIndex + shakeY;
    this._ceilingShadowR.y = rightTileIndex + shakeY;
    this._ceilingShadowL.setVisible(ceilingVisible);
    this._ceilingShadowR.setVisible(ceilingVisible);
  }
  shiftGroundTiles(shiftAmount) {
    for (let i = 0; i < this._groundTiles.length; i++) {
      this._groundTiles[i]._worldX += shiftAmount;
      this._ceilingTiles[i]._worldX += shiftAmount;
      if (this._ground2Tiles?.[i]) this._ground2Tiles[i]._worldX += shiftAmount;
      if (this._ceiling2Tiles?.[i]) this._ceiling2Tiles[i]._worldX += shiftAmount;
    }
    this._maxGroundWorldX += shiftAmount;
    this._groundShift = ((((this._groundShift || 0) + shiftAmount) % this._tileW) + this._tileW) % this._tileW;
  }
  resetGroundTiles(cameraX) {
    const tileWidth = this._tileW;
    for (let i = 0; i < this._groundTiles.length; i++) {
      this._groundTiles[i]._worldX = cameraX + i * tileWidth;
      this._ceilingTiles[i]._worldX = cameraX + i * tileWidth;
      if (this._ground2Tiles?.[i]) this._ground2Tiles[i]._worldX = cameraX + i * tileWidth;
      if (this._ceiling2Tiles?.[i]) this._ceiling2Tiles[i]._worldX = cameraX + i * tileWidth;
    }
    this._maxGroundWorldX = cameraX + (this._groundTiles.length - 1) * tileWidth;
    this._groundShift = ((cameraX % tileWidth) + tileWidth) % tileWidth;
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
    this._flyVisualFloorInset = 0;
    this._flyVisualCeilingInset = 0;
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
  setFlyMode(enabled, centerY, height = f, visualOnly = false, cameraHeight = height) {
    if (enabled) {
      let bounds = this._computeFlyBounds(centerY, height, visualOnly);
      this._flyFloorY = bounds.floorY;
      this._flyCeilingY = bounds.ceilingY;
      this._flyVisualOnly = visualOnly;
      const cameraSpan = Number.isFinite(Number(cameraHeight)) ? Number(cameraHeight) : height;
      const defaultFlySpan = Number.isFinite(Number(typeof f !== "undefined" ? f : cameraSpan)) ? Number(typeof f !== "undefined" ? f : cameraSpan) : cameraSpan;
      const visualSpanShrink = Math.max(0, defaultFlySpan - cameraSpan);
      this._flyVisualFloorInset = visualOnly ? 0 : visualSpanShrink / 2;
      this._flyVisualCeilingInset = visualOnly ? 0 : visualSpanShrink / 2;
      if (visualOnly) {
        this._flyGroundActive = true;
      } else {
        this._flyGroundActive = true;
      }
      let flyCenter = this._flyFloorY + cameraSpan / 2;
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
      this._flyVisualFloorInset = 0;
      this._flyVisualCeilingInset = 0;
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
      let textureInfo = getAtlasFrame(scene, frameName);
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
    const lineFrameKey = frameName.replace(/(_glow)?_001\.png$/, "");
    let isPerspLine = false;
    if (PERSP_LINE_FRAME_OFFSET_Y[lineFrameKey] !== undefined) {
      offsetY = PERSP_LINE_FRAME_OFFSET_Y[lineFrameKey];
      isPerspLine = true;
    } else if ((frameName === "persp_outline_03_001.png" || frameName === "persp_outline_02_001.png") && PERSP_LINE_OBJECT_OFFSET_Y[objectData.id] !== undefined) {
      offsetY = PERSP_LINE_OBJECT_OFFSET_Y[objectData.id];
      isPerspLine = true;
    }
    if (objectData.flipX) {
      sprite.setFlipX(true);
      offsetX = -offsetX;
    }
    if (objectData.flipY) {
      sprite.setFlipY(true);
      offsetY = -offsetY;
    }
    let totalRotation = (sprite.getData("gjBaseRotationDeg") || 0) + objectData.rot;
    const objectScale = gdObjectScale(objectData);
    const objectWarp = gdObjectWarp(objectData);
    if (totalRotation !== 0 || objectScale.x !== 1 || objectScale.y !== 1 || objectWarp !== 0) {
      const placed = gdTransformLocalPoint(
        offsetX, offsetY, totalRotation, objectScale.x, objectScale.y, objectWarp
      );
      offsetX = placed.x;
      offsetY = placed.y;
    }
    if (isPerspLine) {
      sprite._eeVisOffX = offsetX;
      sprite._eeVisOffY = offsetY;
    }
    sprite.x += offsetX;
    sprite.y += offsetY;
    applyGDObjectTransform(sprite, totalRotation, objectScale.x, objectScale.y, objectWarp);
    sprite._eeObjScaleX = sprite._eeBaseScaleX;
    sprite._eeObjScaleY = sprite._eeBaseScaleY;
    if (colorData) {
      const blackDefault = colorData.black === true || colorData.tint === 0;
      if (colorData.tint !== undefined) {
        sprite.setTint(colorData.tint);
      }
      if (blackDefault) {
        sprite.setTint(0);
        sprite._isBlack = true;
        sprite._canColor = colorData.can_color === true;
        sprite._blackDefault = sprite._canColor && !(Number(objectData?.color1) > 0);
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
  _getPerspChildOffsets(scene, objectDef) {
    const cache = this._perspOffsetCache || (this._perspOffsetCache = new Map());
    if (cache.has(objectDef)) return cache.get(objectDef);
    let result = null;
    const children = objectDef.children || [];
    const perspIndexes = [];
    children.forEach((childDef, index) => {
      if (childDef && /^persp_/.test(childDef.frame || "") && childDef.localDx === undefined) perspIndexes.push(index);
    });
    const fillIndexes = perspIndexes.filter(i => !/^persp_outline_/.test(children[i].frame) && children[i].localDy !== undefined);
    if (perspIndexes.length !== 2 && (fillIndexes.length === 3 || fillIndexes.length === 4)) {
      const run = fillIndexes.length === 4 ? 2 : 1;
      result = {};
      for (const i of fillIndexes) result[i] = children[i].localDy * run;
    }
    if (perspIndexes.length === 2) {
      const widthOf = (frameName) => {
        const info = frameName && frameName !== "none" ? getAtlasFrame(scene, frameName) : null;
        const frame = info ? scene.textures.get(info.atlas).get(info.frame) : null;
        return frame ? frame.realWidth : 0;
      };
      const leftWidth = widthOf(children[perspIndexes[0]].frame);
      const rightWidth = widthOf(children[perspIndexes[1]].frame);
      const parentWidth = widthOf(objectDef.frame);
      if (leftWidth > 0 && rightWidth > 0 && (!parentWidth || Math.abs(leftWidth + rightWidth - parentWidth) <= 2)) {
        result = { [perspIndexes[0]]: -leftWidth / 2, [perspIndexes[1]]: rightWidth / 2 };
      }
    }
    cache.set(objectDef, result);
    return result;
  }
  _getGlowFrameName(frameName, objectData = null, objectDef = null) {
    const glowSource = objectDef || objectData || {};
    if (glowSource.glow_frame && glowSource.glow_frame !== "none") {
      return glowSource.glow_frame;
    } else if (objectData && objectData.glow_frame && objectData.glow_frame !== "none") {
      return objectData.glow_frame;
    } else if (frameName && frameName.endsWith("_001.png")) {
      return frameName.replace("_001.png", "_glow_001.png");
    } else {
      return null;
    }
  }
  _hasGlow(objectDef = null, objectData = null) {
    if (objectData && objectData._raw && String(objectData._raw[96] ?? objectData._raw["96"] ?? "0") === "1") return false;
    const source = objectDef || objectData || {};
    if (!source) return false;
    return !!(
      source.glow === true ||
      (source.glow_frame && source.glow_frame !== "none") ||
      (source._raw && source._raw.glow_frame && source._raw.glow_frame !== "none")
    );
  }
  _isGlowVisible = () => {
      return !window.enableLDM && window.showGlow !== false && (!window.isEditor || window.showEditorGlow);
  };
  _getGlowAlphaMultiplier = () => {
      const override = Number(window.glowOpacity);
      return Number.isFinite(override) ? Math.max(0, Math.min(1, override)) : 0.425;
  };
  _updateGlowVisibility = () => {
      if (!this._glowSprites) return;
      const glowVisible = this._isGlowVisible();
      for (const glow of this._glowSprites) {
          glow.setVisible(glowVisible);
      }
  };
  _addGlowSprite(scene, x, y, frameName, objectData, worldX, colorData = null, objectDef = null, forceUnique = false) {
    let glowFrameName = this._getGlowFrameName(frameName, objectData, objectDef);
    if (!glowFrameName || glowFrameName === frameName) {
      return;
    }
    const rotation = Number.isFinite(objectData?.rot) ? Number(objectData.rot) : 0;
    let glowKey = `${worldX ?? x}:${y}:${glowFrameName}:${Number(Math.round(rotation * 1000))}`;
    if (this._glowSpriteKeys.has(glowKey)) {
      if (!forceUnique) {
        return;
      }
      let suffix = 1;
      while (this._glowSpriteKeys.has(`${glowKey}|${suffix}`)) suffix++;
      glowKey = `${glowKey}|${suffix}`;
    }
    let glowSprite = addImageToScene(scene, x, y, glowFrameName);
    if (glowSprite) {
      this._glowSpriteKeys.add(glowKey);
      this._applyVisualProps(scene, glowSprite, glowFrameName, objectData);
      const colorSource = colorData || objectDef || null;
      const blackDefault = colorSource?.black === true || colorSource?.tint === 0;
      if (colorSource?.tint !== undefined) {
        glowSprite.setTint(colorSource.tint);
      }
      if (blackDefault) {
        glowSprite.setTint(0);
        glowSprite._isBlack = true;
        glowSprite._canColor = colorSource.can_color === true;
        glowSprite._blackDefault = glowSprite._canColor && !(Number(objectData?.color1) > 0);
      }
      glowSprite.setBlendMode(Phaser.BlendModes.ADD);
      glowSprite.setAlpha(this._getGlowAlphaMultiplier());
      glowSprite._eeOrigAlpha = glowSprite.alpha;
      glowSprite._eeLayer = 0;
      if (!this._glowSprites) {
        this._glowSprites = [];
      }
      this._glowSprites.push(glowSprite);
      glowSprite._eeIsGlowSprite = true;
      glowSprite.setVisible(this._isGlowVisible());
      if (worldX !== undefined) {
        glowSprite._eeWorldX = worldX;
        glowSprite._eeBaseY = y;
        this._addToSection(glowSprite);
      }
      return glowSprite;
    }
    return null;
  }
  _syncGlowColor(glowSprite, objectSprite) {
    if (!glowSprite || !objectSprite) return;
    glowSprite.setTint(objectSprite.tintTopLeft);
    glowSprite._isBlack = objectSprite._isBlack === true;
    glowSprite._canColor = objectSprite._canColor === true;
    glowSprite._blackDefault = objectSprite._blackDefault === true;
    glowSprite._SawColor = objectSprite._SawColor;
    glowSprite._isSaw = objectSprite._isSaw === true;
  }
  _textureHasFrame(scene, frameName) {
    if (!frameName) return false;
    if (typeof getAtlasFrame === "function" && getAtlasFrame(scene, frameName)) return true;
    return !!(scene?.textures?.exists && scene.textures.exists(frameName));
  }
  _getTriggerFrameName(scene, objectDef, levelObj) {
    const candidates = [];
    if (objectDef?.frame) candidates.push(objectDef.frame);
    if (objectDef?.randomFrames && objectDef.randomFrames.length) candidates.push(objectDef.randomFrames[0]);
    if (objectDef?.editorFrame) candidates.push(objectDef.editorFrame);
    if (objectDef?.icon) candidates.push(objectDef.icon);

    const id = parseInt(levelObj?.id ?? 0, 10);
    if (Number.isFinite(id) && id > 0) {
      candidates.push(
        `trigger_${id}_001.png`,
        `edit_trigger_${id}_001.png`,
        `edit_e${id}_001.png`,
        `object_${id}_001.png`
      );
    }

    for (const frameName of candidates) {
      if (this._textureHasFrame(scene, frameName)) return frameName;
    }
    return candidates.find(Boolean) || null;
  }
  _getTriggerTargetLabel(levelObj) {
    const raw = levelObj?._raw || {};
    const id = parseInt(levelObj?.id ?? 0, 10);
    const colorChannelLabel = (channelId) => {
      const parsed = parseInt(channelId ?? 0, 10);
      const labels = {
        1000: "BG",
        1001: "G1",
        1002: "L",
        1003: "3DL",
        1004: "Obj",
        1009: "G2",
        1013: "MG"
      };
      return labels[parsed] || String(Math.max(0, Number.isFinite(parsed) ? parsed : 0));
    };
    const readInt = (key, fallback = 0) => {
      const parsed = parseInt(raw[key] ?? raw[String(key)] ?? fallback, 10);
      return Number.isFinite(parsed) ? parsed : fallback;
    };
    const targetLabel = () => String(Math.max(0, this._parseSingleTriggerGroupId(raw[51] ?? raw["51"], 0)));

    if (id === 29) return "BG";
    if (id === 30) return "G1";

    const colorTriggerIds = new Set([105, 744, 899, 900, 915]);
    if (colorTriggerIds.has(id)) return colorChannelLabel(readInt(23, 1));
    if ([901, 1007, 1268].includes(id)) return targetLabel();

    if (id === 1346) return targetLabel();

    if (id === 1006) return targetLabel();

    return "";
  }
  _setTriggerEditorVisualVisible(visual, visible) {
    if (!visual) return;
    if (visual.container?.setVisible) visual.container.setVisible(visible);
  }
  _spawnTriggerEditorVisual(levelObj, objectDef, linkedObjectId) {
    const scene = this._scene;
    if (!scene || !this.topContainer || !levelObj) return;

    const worldX = levelObj.x * 2;
    const baseY = b(levelObj.y * 2);
    const isStartPositionTrigger = [31, 34].includes(parseInt(levelObj.id ?? 0, 10));
    const triggerContainer = scene.add.container(worldX, 0);
    triggerContainer.setDepth(995);
    triggerContainer._eeLayer = 2;
    triggerContainer._eeWorldX = worldX;
    triggerContainer._eeBaseY = baseY;
    triggerContainer._eeZDepth = 995;
    triggerContainer._eeEditorTrigger = true;
    triggerContainer._eeObjectId = linkedObjectId;
    triggerContainer._eeEditorLayer = parseInt(levelObj.editorLayer ?? levelObj._raw?.[20] ?? levelObj._raw?.["20"] ?? 0, 10) || 0;
    triggerContainer._eeEditorLayer2 = parseInt(levelObj.editorLayer2 ?? levelObj._raw?.[61] ?? levelObj._raw?.["61"] ?? 0, 10) || 0;

    const isTouchTrigger = objectDef?.type === triggerType && String(levelObj?._raw?.[11] ?? levelObj?._raw?.["11"] ?? "0") === "1";
    const isSpawnTriggeredTrigger = objectDef?.type === triggerType && this._isTriggerSpawnTriggered(levelObj);
    let lineGfx = null;
    let hitboxGfx = null;
    if (!isStartPositionTrigger) {
      lineGfx = scene.add.graphics();
      lineGfx.lineStyle(2, 0x1dffff, 1);
      lineGfx.lineBetween(0, -50000, 0, 50000);
      lineGfx._eeEditorTriggerLine = true;
      lineGfx.setVisible(!isTouchTrigger && !isSpawnTriggeredTrigger);

      hitboxGfx = scene.add.graphics();
      hitboxGfx.lineStyle(2, 0x1dffff, 1);
      hitboxGfx.strokeRect(-30, baseY - 30, 60, 60);
      hitboxGfx._eeEditorTriggerHitbox = true;
      hitboxGfx.setVisible(isTouchTrigger && !isSpawnTriggeredTrigger);
    }

    const frameName = this._getTriggerFrameName(scene, objectDef, levelObj);
    let triggerSprite = null;
    if (frameName && this._textureHasFrame(scene, frameName)) {
      triggerSprite = addImageToScene(scene, 0, baseY, frameName);
      if (triggerSprite) {
        this._applyVisualProps(scene, triggerSprite, frameName, levelObj, objectDef);
        triggerSprite.setAlpha(0.95);
        triggerSprite._eeEditorTriggerSprite = true;
      }
    }

    const labelText = this._getTriggerTargetLabel(levelObj);
    const labelY = baseY + 10;
    let label = null;
    if (labelText) {
      if (scene.cache?.bitmapFont?.has && scene.cache.bitmapFont.has("bigFont")) {
        label = scene.add.bitmapText(0, labelY, "bigFont", labelText, 56).setOrigin(0.5).setScale(0.55);
      } else {
        label = scene.add.text(0, labelY, labelText, {
          fontFamily: "Pusab, Arial, sans-serif",
          fontSize: "40px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 6
        }).setOrigin(0.5);
      }
      if (label?.setTint) label.setTint(0xffffff);
      label._eeEditorTriggerLabel = true;
    }

    const parts = [];
    if (lineGfx) parts.push(lineGfx);
    if (hitboxGfx) parts.push(hitboxGfx);
    if (triggerSprite) parts.push(triggerSprite);
    if (label) parts.push(label);
    triggerContainer.add(parts);

    const tintTargets = [triggerSprite, label].filter(Boolean);
    triggerContainer.setTint = (tint) => {
      for (const target of tintTargets) {
        if (target?.setTint) target.setTint(tint);
      }
      return triggerContainer;
    };
    triggerContainer.clearTint = () => {
      for (const target of tintTargets) {
        if (target?.clearTint) target.clearTint();
      }
      if (label?.setTint) label.setTint(0xffffff);
      return triggerContainer;
    };
    triggerContainer.setFlipX = (value) => {
      if (triggerSprite?.setFlipX) triggerSprite.setFlipX(value);
      triggerContainer.flipX = !!value;
      return triggerContainer;
    };
    triggerContainer.setFlipY = (value) => {
      if (triggerSprite?.setFlipY) triggerSprite.setFlipY(value);
      triggerContainer.flipY = !!value;
      return triggerContainer;
    };
    triggerContainer._eeTriggerSprite = triggerSprite;
    triggerContainer._eeTriggerLabel = label;
    triggerContainer._eeTriggerLine = lineGfx;
    triggerContainer._eeTriggerHitbox = hitboxGfx;
    triggerContainer.getBounds = () => {
      const boundsTarget = triggerSprite || label;
      if (boundsTarget?.getBounds) return boundsTarget.getBounds();
      return new Phaser.Geom.Rectangle(triggerContainer.x - 20, baseY - 20, 40, 40);
    };

    this.topContainer.add(triggerContainer);
    const visual = { container: triggerContainer, line: lineGfx, hitbox: hitboxGfx, sprite: triggerSprite, label, saveObj: levelObj };
    this._editorTriggerVisuals.push(visual);
    this._setTriggerEditorVisualVisible(visual, !!window.isEditor);

    if (Number.isInteger(linkedObjectId)) {
      if (!this.objectSprites[linkedObjectId]) this.objectSprites[linkedObjectId] = [];
      this.objectSprites[linkedObjectId].push(triggerContainer);
    }
  }
  updateTriggerEditorVisuals() {
    const visible = !!window.isEditor;
    if (!this._editorTriggerVisuals) return;
    if (!visible && this._editorTriggerVisualsHidden === this._editorTriggerVisuals.length) return;
    this._editorTriggerVisualsHidden = visible ? -1 : this._editorTriggerVisuals.length;
    for (const visual of this._editorTriggerVisuals) {
      const saveObj = visual?.saveObj;
      const isTouchTrigger = saveObj && String(saveObj?._raw?.[11] ?? saveObj?._raw?.["11"] ?? "0") === "1";
      const isSpawnTriggeredTrigger = saveObj && this._isTriggerSpawnTriggered(saveObj);
      if (visual?.line?.setVisible) visual.line.setVisible(!isTouchTrigger && !isSpawnTriggeredTrigger);
      if (visual?.hitbox?.setVisible) visual.hitbox.setVisible(!!isTouchTrigger && !isSpawnTriggeredTrigger);
      this._setTriggerEditorVisualVisible(visual, visible);
    }
  }
  _getTextObjectText(levelObj, objectDef = null) {
    const raw = levelObj?._raw || {};
    const textValue = levelObj?.text ?? _decodeTextObjectString(raw[31] ?? raw["31"] ?? objectDef?.defaultText ?? "A");
    return String(textValue ?? "");
  }

  _spawnTextObject(levelObj, objectDef, linkedObjectId) {
    const scene = this._scene;
    if (!scene || !levelObj) return null;

    const worldX = levelObj.x * 2;
    const worldY = b(levelObj.y * 2);
    const rawText = this._getTextObjectText(levelObj, objectDef);
    const baseSize = Number.isFinite(Number(objectDef?.textSize)) ? Number(objectDef.textSize) : 36;
    const textSize = Math.max(1, Math.round(baseSize));
    let textSprite = null;

    if (scene.cache?.bitmapFont?.has && scene.cache.bitmapFont.has("bigFont")) {
      textSprite = scene.add.bitmapText(worldX, worldY, "bigFont", rawText, textSize).setOrigin(0.5);
    } else {
      textSprite = scene.add.text(worldX, worldY, rawText, {
        fontFamily: "Pusab, Arial, sans-serif",
        fontSize: `${textSize}px`,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6
      }).setOrigin(0.5);
    }

    const textScale = gdObjectScale(levelObj);
    applyGDObjectTransform(
      textSprite,
      levelObj.rot || 0,
      textScale.x * (levelObj.flipX ? -1 : 1),
      textScale.y * (levelObj.flipY ? -1 : 1),
      gdObjectWarp(levelObj)
    );
    textSprite._eeObjScaleX = textSprite._eeBaseScaleX;
    textSprite._eeObjScaleY = textSprite._eeBaseScaleY;

    const depthBase = { "-5": -12, "-3": -9, "-1": -6, 0: 0, 1: 3, 3: 6, 5: 9, 7: 10.5, 9: 12, 11: 13.5 };
    const zLayer = parseInt(levelObj.zLayer ?? objectDef?.default_z_layer ?? 3, 10) || 0;
    const zOrder = parseInt(levelObj.zOrder ?? objectDef?.default_z_order ?? 0, 10) || 0;
    const zDepth = (depthBase[zLayer] ?? 0) + zOrder * 0.001;
    textSprite.setDepth(zDepth);
    textSprite._eeLayer = 1;
    textSprite._eeWorldX = worldX;
    textSprite._eeBaseY = worldY;
    textSprite._eeOrigWorldX = worldX;
    textSprite._eeOrigBaseY = worldY;
    textSprite._eeZDepth = zDepth;
    textSprite._eeOrigAlpha = 1;
    textSprite._eeTextObject = true;
    textSprite._eeObjectId = linkedObjectId;
    textSprite._eeEditorLayer = parseInt(levelObj.editorLayer ?? levelObj._raw?.[20] ?? levelObj._raw?.["20"] ?? 0, 10) || 0;
    textSprite._eeEditorLayer2 = parseInt(levelObj.editorLayer2 ?? levelObj._raw?.[61] ?? levelObj._raw?.["61"] ?? 0, 10) || 0;

    const colorChannel = parseInt(levelObj.color1 || objectDef?.default_base_color_channel || 0, 10) || 0;
    if (colorChannel > 0 && objectDef?.can_color !== false) {
      textSprite._eeColorChannel = colorChannel;
      if (!this._colorChannelSprites[colorChannel]) this._colorChannelSprites[colorChannel] = [];
      this._colorChannelSprites[colorChannel].push(textSprite);
    }

    if (levelObj.groups) {
      const groupIds = [...new Set(String(levelObj.groups).split(".").map(Number).filter(n => n > 0))];
      if (groupIds.length) {
        textSprite._eeGroups = groupIds;
        textSprite._origWorldX = worldX;
        textSprite._origBaseY = worldY;
        textSprite._eeMoveBaseWorldX = worldX;
        textSprite._eeMoveBaseBaseY = worldY;
        textSprite._eeInitialWorldX = worldX;
        textSprite._eeInitialBaseY = worldY;
        textSprite._eeInitialRotationRad = textSprite.rotation || 0;
        for (const groupId of groupIds) {
          if (!this._groupSprites[groupId]) this._groupSprites[groupId] = [];
          this._groupSprites[groupId].push(textSprite);
        }
      }
    }

    this._addToSection(textSprite);

    if (Number.isInteger(linkedObjectId)) {
      if (!this.objectSprites[linkedObjectId]) this.objectSprites[linkedObjectId] = [];
      this.objectSprites[linkedObjectId].push(textSprite);
    }

    return textSprite;
  }

  _spawnTeleportExitPortalVisual(scene, enterObj, enterDef, linkedObjectId, registerObjectSprite, registerToGroups, registerColor, objZDepth, col1) {
    if (parseInt(enterObj?.id ?? 0, 10) !== 747) return;

    const offsetY = this._getTeleportPortalYOffset(enterObj);
    const exitDefSource = getObjectFromId(749) || allObjects[749] || enterDef;
    if (!exitDefSource) return;

    const frameName = exitDefSource.frame || enterDef?.frame;
    if (!frameName) return;

    const enterX = parseFloat(enterObj.x ?? enterObj._raw?.[2] ?? enterObj._raw?.["2"] ?? 0) || 0;
    const enterY = parseFloat(enterObj.y ?? enterObj._raw?.[3] ?? enterObj._raw?.["3"] ?? 0) || 0;
    const exitY = enterY + offsetY;
    const exitRot = parseFloat(enterObj.rot ?? enterObj._raw?.[6] ?? enterObj._raw?.["6"] ?? 0) || 0;
    const worldX = enterX * 2;
    const worldY = exitY * 2;
    const baseY = b(worldY);

    const exitLevelObj = {
      ...enterObj,
      id: 749,
      y: exitY,
      rot: exitRot,
      flipX: true,
      _generatedTeleportExit: true,
      _raw: {
        ...(enterObj._raw || {}),
        1: "749",
        "1": "749",
        2: String(enterX),
        "2": String(enterX),
        3: String(exitY),
        "3": String(exitY),
        4: "1",
        "4": "1",
        6: String(exitRot),
        "6": String(exitRot)
      }
    };

    const exitDef = { ...exitDefSource, _portalFront: true, _generatedTeleportExit: true };
    let portalBackSprite = null;

    if (frameName.includes("_front_")) {
      const backFrame = frameName.replace("_front_", "_back_");
      portalBackSprite = addImageToScene(scene, worldX, baseY, backFrame);
      if (portalBackSprite) {
        this._applyVisualProps(scene, portalBackSprite, backFrame, exitLevelObj, exitDefSource);
        portalBackSprite._eeLayer = 1;
        portalBackSprite._eeWorldX = worldX;
        portalBackSprite._eeBaseY = baseY;
        portalBackSprite._eeZDepth = objZDepth - 0.004;
        portalBackSprite._eeOrigAlpha = 1;
        portalBackSprite._eeGeneratedTeleportExit = true;
        this._addToSection(portalBackSprite);
        registerToGroups(portalBackSprite, worldX, baseY);
        registerColor(portalBackSprite, col1);
        registerObjectSprite(portalBackSprite);
      }
    }

    const sprite = addImageToScene(scene, worldX, baseY, frameName);
    if (!sprite) return;

    this._applyVisualProps(scene, sprite, frameName, exitLevelObj, exitDefSource);
    if (portalBackSprite) {
      portalBackSprite.x = sprite.x;
      portalBackSprite.y = sprite.y;
    }
    this._addVisualSprite(sprite, exitDef);
    sprite._eeWorldX = worldX;
    sprite._eeBaseY = baseY;
    sprite._eeZDepth = objZDepth + 0.004;
    sprite._eeOrigAlpha = 1;
    sprite._eeGeneratedTeleportExit = true;
    registerColor(sprite, col1);
    this._addToSection(sprite);
    registerToGroups(sprite, worldX, baseY);
    registerObjectSprite(sprite);
  }

  _spawnObject(levelObj) {
  this.objectSprites = this.objectSprites || [];

  const scene = this._scene;
  const objectDef = getObjectFromId(levelObj.id);

  if (parseInt(levelObj?.id ?? 0, 10) === 749 && !levelObj?._generatedTeleportExit) {
    return objectDef || allObjects[749] || null;
  }
  if (window.enableLDM && ldm_object.has(parseInt(levelObj?.id ?? 0, 10))) {
    return null;
  }

  if (objectDef && objectDef.type === triggerType) {
    if (this._nextObjectId === undefined) {
      this._nextObjectId = 0;
    }
    const linkedObjectId = this._nextObjectId++;
    levelObj._eeObjectId = linkedObjectId;
    if (levelObj._raw) delete levelObj._raw._eeObjectId;
    const triggerBase = this._makeTriggerBase(levelObj, linkedObjectId);

    if (levelObj.id === 29 || levelObj.id === 30) {
      this._colorTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        uid: linkedObjectId,
        touchTriggered: String(levelObj._raw?.[11] ?? levelObj._raw?.["11"] ?? "0") === "1",
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
        ...triggerBase,
        x: levelObj.x * 2,
        effect: objectDef.enterEffect
      });
    }

    if (levelObj.id === 901) {
      const _raw = levelObj._raw;
      this._moveTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        touchTriggered: String(_raw?.[11] ?? _raw?.["11"] ?? "0") === "1",
        duration: parseFloat(_raw[10] ?? 0),
        easingType: parseInt(_raw[30] ?? 0, 10),
        easingRate: parseFloat(_raw[85] ?? 2),
        targetGroup: parseInt(_raw[51] ?? 0, 10),
        offsetX: parseFloat(_raw[28] ?? 0) * 2,
        offsetY: parseFloat(_raw[29] ?? 0) * 2,
        lockX: String(_raw?.[58] ?? _raw?.["58"] ?? "0") === "1",
        lockY: String(_raw?.[59] ?? _raw?.["59"] ?? "0") === "1",
        lockCameraX: String(_raw?.[302] ?? _raw?.["302"] ?? "0") === "1",
        lockCameraY: String(_raw?.[303] ?? _raw?.["303"] ?? "0") === "1"
      });
    }

    if (levelObj.id === 1007) {
      const _raw = levelObj._raw;
      this._alphaTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        duration: parseFloat(_raw[10] ?? 0),
        targetGroup: parseInt(_raw[51] ?? 0, 10),
        targetOpacity: Math.max(0, Math.min(1, parseFloat(_raw[35] ?? 1)))
      });
    }

    if (LEGACY_COLOR_TRIGGER_CHANNELS[levelObj.id] !== undefined) {
      const _raw = levelObj._raw;
      const targetChannel = parseInt(_raw[23] ?? LEGACY_COLOR_TRIGGER_CHANNELS[levelObj.id], 10) || LEGACY_COLOR_TRIGGER_CHANNELS[levelObj.id];
      const copySource = parseInt(_raw[50] ?? 0, 10);
      if (targetChannel > 0) {
        this._colorTriggers.push({
          ...triggerBase,
          x: levelObj.x * 2,
          y: levelObj.y * 2,
          uid: linkedObjectId,
          touchTriggered: String(_raw?.[11] ?? _raw?.["11"] ?? "0") === "1",
          index: targetChannel,
          color: {
            r: parseInt(_raw[7] ?? 255, 10),
            g: parseInt(_raw[8] ?? 255, 10),
            b: parseInt(_raw[9] ?? 255, 10)
          },
          duration: parseFloat(_raw[10] ?? 0),
          tintGround: _raw[14] === "1",
          blending: String(_raw[17] ?? "0") === "1",
          opacity: parseFloat(_raw[35] ?? 1),
          copy: copySource > 0 ? { source: copySource, hsv: parseChannelHsv(_raw[49]) } : null
        });
      }
    }

    if (levelObj.id === 1346) {
      const _raw = levelObj._raw;
      const rotateGroups = this._parseRotateTriggerGroups(_raw);
      this._rotateTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        targetGroup: rotateGroups.targetGroup,
        degrees: parseFloat(_raw[68] ?? 0),
        duration: parseFloat(_raw[10] ?? 0),
        easingType: parseInt(_raw[30] ?? 0, 10),
        easingRate: parseFloat(_raw[85] ?? 2),
        lockRotation: _raw[70] === "1",
        times360: parseInt(_raw[69] ?? 0, 10),
        centerGroup: rotateGroups.centerGroup
      });
    }

    if (levelObj.id === 1006) {
      const _raw = levelObj._raw;
      const targetType = parseInt(_raw[52] ?? 0, 10);
      this._pulseTriggers.push({
        ...triggerBase,
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
        hsv: String(_raw[48] ?? "0") === "1" ? parseChannelHsv(_raw[49]) : null,
        copySource: parseInt(_raw[50] ?? 0, 10) || 0
      });
    }

    if (levelObj.id === 1268) {
      const _raw = levelObj._raw;
      this._spawnTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        touchTriggered: String(_raw?.[11] ?? _raw?.["11"] ?? "0") === "1",
        targetGroup: parseInt(_raw[51] ?? 0, 10),
        delay: Math.max(0, parseFloat(_raw[63] ?? 0) || 0),
        randomDelay: Math.max(0, parseFloat(_raw[556] ?? _raw["556"] ?? 0) || 0)
      });
    }

    if (levelObj.id === 1616) {
      const _raw = levelObj._raw;
      this._stopTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        touchTriggered: String(_raw?.[11] ?? _raw?.["11"] ?? "0") === "1",
        targetGroup: parseInt(_raw[51] ?? 0, 10)
      });
    }

    if (levelObj.id === 1814) {
      const _raw = levelObj._raw;
      this._followPlayerYTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        touchTriggered: String(_raw?.[11] ?? _raw?.["11"] ?? "0") === "1",
        targetGroup: parseInt(_raw[51] ?? 0, 10),
        speed: Math.max(0, parseFloat(_raw[90] ?? 1)),
        delay: Math.max(0, parseFloat(_raw[91] ?? 0)),
        offset: parseFloat(_raw[92] ?? 0) * 2,
        maxSpeed: Math.max(0, parseFloat(_raw[105] ?? 0)) * 2,
        duration: Math.max(0, parseFloat(_raw[10] ?? 0))
      });
    }

    if (levelObj.id === 1347) {
      const _raw = levelObj._raw;
      this._followTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        touchTriggered: String(_raw?.[11] ?? _raw?.["11"] ?? "0") === "1",
        targetGroup: parseInt(_raw[51] ?? 0, 10),
        followGroup: parseInt(_raw[71] ?? 0, 10),
        xMod: parseFloat(_raw[72] ?? 1),
        yMod: parseFloat(_raw[73] ?? 1),
        duration: Math.max(0, parseFloat(_raw[10] ?? 0))
      });
    }

    if (levelObj.id === 1816) {
      const _raw = levelObj._raw;
      const blockScale = Number(levelObj.scale) || 1;
      this._collisionBlocks.push({
        blockId: parseInt(_raw[80] ?? 0, 10) || 0,
        dynamic: String(_raw[94] ?? "0") === "1",
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        half: 30 * blockScale,
        _eeGroups: triggerBase.groups
      });
    }

    if (levelObj.id === 1815) {
      const _raw = levelObj._raw;
      this._collisionTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        touchTriggered: String(_raw?.[11] ?? _raw?.["11"] ?? "0") === "1",
        blockA: parseInt(_raw[80] ?? 0, 10) || 0,
        blockB: parseInt(_raw[95] ?? 0, 10) || 0,
        targetGroup: parseInt(_raw[51] ?? 0, 10),
        activate: String(_raw[56] ?? "0") === "1",
        onExit: String(_raw[93] ?? "0") === "1"
      });
    }

    if (levelObj.id === 1049) {
      const _raw = levelObj._raw;
      this._toggleTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        touchTriggered: String(_raw?.[11] ?? _raw?.["11"] ?? "0") === "1",
        targetGroup: parseInt(_raw[51] ?? 0, 10),
        activate: String(_raw[56] ?? "0") === "1"
      });
    }

    if (levelObj.id === 1520) {
      const _raw = levelObj._raw;
      const shakeStrength = Math.max(0, Math.min(SHAKE_MAX_STRENGTH, parseFloat(_raw[75] ?? 0)));
      this._shakeTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        touchTriggered: String(_raw?.[11] ?? _raw?.["11"] ?? "0") === "1",
        duration: Math.max(0, parseFloat(_raw[10] ?? 0)),
        strength: shakeStrength * GD_UNIT_TO_PIXELS,
        interval: Math.max(0, parseFloat(_raw[84] ?? 0))
      });
    }

    if (levelObj.id === 1612 || levelObj.id === 1613) {
      const _raw = levelObj._raw;
      this._playerVisTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        touchTriggered: String(_raw?.[11] ?? _raw?.["11"] ?? "0") === "1",
        hide: levelObj.id === 1612
      });
    }

    if (levelObj.id === 1585) {
      const _raw = levelObj._raw;
      this._animationTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        touchTriggered: String(_raw?.[11] ?? _raw?.["11"] ?? "0") === "1",
        targetGroup: parseInt(_raw[51] ?? 0, 10),
        animateId: parseInt(_raw[76] ?? 0, 10)
      });
    }

    if (levelObj.id === 1812) {
      const _raw = levelObj._raw;
      this._onDeathTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        touchTriggered: String(_raw?.[11] ?? _raw?.["11"] ?? "0") === "1",
        targetGroup: parseInt(_raw[51] ?? 0, 10),
        activate: String(_raw[56] ?? "1") === "1"
      });
    }

    if (levelObj.id === 1595) {
      const _raw = levelObj._raw;
      this._touchTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        touchTriggered: String(_raw?.[11] ?? _raw?.["11"] ?? "0") === "1",
        targetGroup: parseInt(_raw[51] ?? 0, 10),
        toggleType: parseInt(_raw[56] ?? 0, 10),
        dualTouch: String(_raw[81] ?? "0") === "1",
        holdMode: String(_raw[82] ?? "0") === "1",
        dualAction: parseInt(_raw[198] ?? 0, 10),
        specialMode: parseInt(_raw[89] ?? 0, 10)
      });
    }

    if (levelObj.id === 1817 && (levelObj._raw?.[80] !== undefined || levelObj._raw?.["80"] !== undefined)) {
      const _raw = levelObj._raw;
      this._pickupTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        touchTriggered: String(_raw?.[11] ?? _raw?.["11"] ?? "0") === "1",
        itemId: parseInt(_raw[80] ?? 0, 10),
        count: parseInt(_raw[77] ?? 1, 10)
      });
    }

    if (levelObj.id === 1611) {
      const _raw = levelObj._raw;
      this._countTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        touchTriggered: String(_raw?.[11] ?? _raw?.["11"] ?? "0") === "1",
        targetGroup: parseInt(_raw[51] ?? 0, 10),
        itemId: parseInt(_raw[80] ?? 0, 10),
        targetCount: parseInt(_raw[77] ?? 0, 10),
        activate: String(_raw[56] ?? "1") === "1",
        multiActivate: String(_raw?.[104] ?? _raw?.["104"] ?? "0") === "1"
      });
    }

    if (levelObj.id === 1811) {
      const _raw = levelObj._raw;
      this._instantCountTriggers.push({
        ...triggerBase,
        x: levelObj.x * 2,
        y: levelObj.y * 2,
        touchTriggered: String(_raw?.[11] ?? _raw?.["11"] ?? "0") === "1",
        targetGroup: parseInt(_raw[51] ?? 0, 10),
        itemId: parseInt(_raw[80] ?? 0, 10),
        targetCount: parseInt(_raw[77] ?? 0, 10),
        activate: String(_raw[56] ?? "1") === "1",
        comparison: parseInt(_raw[88] ?? 0, 10)
      });
    }

    if ([31, 34].includes(levelObj.id)) {
      this._startPositions.push({
        x: 2 * levelObj.x,
        y: 2 * levelObj.y,
        gameMode: levelObj.gameMode,
        miniMode: levelObj.miniMode,
        speed: levelObj.speed,
        dualMode: levelObj.dualMode,
        mirrored: levelObj.mirrored,
        gravityFlipped: levelObj.flipGravity
      });
    }

    if (objectDef.textObject) {
      this._spawnTextObject(levelObj, objectDef, linkedObjectId);
      return objectDef;
    }

    this._spawnTriggerEditorVisual(levelObj, objectDef, linkedObjectId);
    return objectDef;
  }

  if (this._nextObjectId === undefined) {
    this._nextObjectId = 0;
  }
  const linkedObjectId = this._nextObjectId++;
  levelObj._eeObjectId = linkedObjectId;
  if (levelObj._raw) delete levelObj._raw._eeObjectId;
  this._resetobject[linkedObjectId] = levelObj;
  let hasCollisionEntry = false;

  const worldX = levelObj.x * 2;
  const worldY = levelObj.y * 2;

  if (worldX > this._lastObjectX) {
    this._lastObjectX = worldX;
  }

  let frameName = objectDef ? objectDef.frame : null;
  if (objectDef && objectDef.randomFrames) {
    frameName = objectDef.randomFrames[Math.floor(Math.random() * objectDef.randomFrames.length)];
  }

  const objectId = parseInt(levelObj.id ?? 0, 10);
  const invisibleBlockEntry = hasInvisibleObjectVisual(objectDef)
    ? { x: worldX, y: worldY, sprites: [], alpha: 0, removed: false }
    : null;
  if (invisibleBlockEntry) this._invisibleBlockEntries.push(invisibleBlockEntry);
  const secretCoinSlot = objectId === SECRET_COIN_OBJECT_ID ? this._secretCoinSlotCount++ : null;
  const userCoinSlot = objectId === USER_COIN_OBJECT_ID ? this._userCoinSlotCount++ : null;
  const sawObjectIds = new Set([183, 184, 185, 186, 187, 188, 397, 398, 399, 678, 679, 680, 740, 741, 742, 1619, 1620, 1708, 1709, 1710, 1734, 1735, 1736, 85, 86, 87, 97, 137, 138, 139, 154, 155, 156, 180, 181, 182, 1019, 1020, 1021, 1058, 1059, 1060, 1061, 1752, 396, 395, 222, 223, 224, 997, 998, 999, 1000, 1055, 1056, 1057, 394, 375, 376, 377, 378, 677, 676, 675]);
  const fastSawObjectIds = new Set([186, 187, 188, 89, 88, 98, 183, 185, 184, 397, 398, 399, 678, 679, 680, 740, 741, 742, 1619, 1620, 1705, 1706, 1707, 1708, 1709, 1710, 1734, 1735, 1736]);
  const isSawObjectId = sawObjectIds.has(objectId);
  const isFastSawObjectId = fastSawObjectIds.has(objectId);

  const registerObjectSprite = (spr) => {
    if (!spr) return;
    spr._eeObjectId = linkedObjectId;
    if (invisibleBlockEntry) {
      spr._eeInvisibleBlockEntry = invisibleBlockEntry;
      spr._eeApproachAlpha = 0;
      spr.setAlpha(0);
      invisibleBlockEntry.sprites.push(spr);
    }
    spr._eeDontFade = String(levelObj._raw?.[64] ?? levelObj._raw?.["64"] ?? "0") === "1";
    spr._eeDontEnter = String(levelObj._raw?.[67] ?? levelObj._raw?.["67"] ?? "0") === "1";
    spr._eeEditorLayer = parseInt(levelObj.editorLayer ?? levelObj._raw?.[20] ?? levelObj._raw?.["20"] ?? 0, 10) || 0;
    spr._eeEditorLayer2 = parseInt(levelObj.editorLayer2 ?? levelObj._raw?.[61] ?? levelObj._raw?.["61"] ?? 0, 10) || 0;
    if (!this.objectSprites[linkedObjectId]) this.objectSprites[linkedObjectId] = [];
    this.objectSprites[linkedObjectId].push(spr);
  };

  const registerAnimatedSprite = (spr, visualDef) => {
    if (!spr || !visualDef?.animFrames?.length) return;
    spr._animFrames = visualDef.animFrames;
    spr._animInterval = visualDef.animInterval || 100;
    spr._animIdx = 0;
    spr._animScene = scene;
    spr._lastAnimSwap = (window._animTimer || 0) - Math.random() * spr._animInterval;
    window._animatedSprites.push(spr);
  };

  const issawsprite = (spr) => {
    if (!spr) return;
    if (!spr._eeSawRegistered) {
      spr._eeSawRegistered = true;
      this._sawSprites.push(spr);
    }
    if (spr._SawRandom1 !== undefined || spr._SawRandom2 !== undefined) {
      if (!this._animatedsawsprite) this._animatedsawsprite = [];
      if (!spr._animatedsaw) {
        spr._animatedsaw = true;
        this._animatedsawsprite.push(spr);
      }
    }
  };

  if (frameName) {
    const spriteWorldX = worldX;
    const baseY = b(worldY);
    const isPortalFront =
      (objectDef.type === portalType || objectDef.type === speedType) &&
      frameName.includes("_front_");

    const zLayer =
      levelObj.zLayer || (objectDef.default_z_layer !== undefined ? objectDef.default_z_layer : 0);
    const zOrd =
      levelObj.zOrder || (objectDef.default_z_order !== undefined ? objectDef.default_z_order : 0);
    const depthBase = { "-5": -12, "-3": -9, "-1": -6, 0: 0, 1: 3, 3: 6, 5: 9, 7: 10.5, 9: 12, 11: 13.5 };
    const objZDepth = (depthBase[zLayer] !== undefined ? depthBase[zLayer] : 0) + zOrd * 0.01;

    let col1 = levelObj.color1 || (objectDef.default_base_color_channel !== undefined ? objectDef.default_base_color_channel : 0);
    if (!levelObj.color1 && !this._legacyColorLevel && objectDef.modern_base_color_channel !== undefined) col1 = objectDef.modern_base_color_channel;
    if (col1 === 0 && (objectDef.type === solidType || objectDef.type === hazardType)) col1 = 1004;

    const col2 = levelObj.color2 || (objectDef.default_detail_color_channel !== undefined ? objectDef.default_detail_color_channel : -1);
    const hasDetailChannel = Number(objectDef.default_detail_color_channel) > 0 && Number(col2) > 0;
    const isDetailChild = (childDef) => hasDetailChannel && childDef && childDef.black !== true && childDef.tint !== undefined && childDef.tint !== 0;
    const explicitCol1 = Number(levelObj.color1) > 0;
    const canColor = objectDef.can_color !== false || explicitCol1;

    const objRaw = levelObj._raw || {};
    const objHsv1 = String(objRaw[41] ?? "0") === "1" && objRaw[43] ? parseChannelHsv(objRaw[43]) : null;
    const objHsv2 = String(objRaw[42] ?? "0") === "1" && objRaw[44] ? parseChannelHsv(objRaw[44]) : null;
    const registerColor = (spr, ch, forceParentColor = false) => {
      if (!spr || spr._cantColor || (spr._isBlack && !spr._canColor)) return;
      if (ch > 0 && (canColor || spr._canColor) && spr) {
        const sprHsv = (hasDetailChannel && Number(ch) === Number(col2) && Number(col2) !== Number(col1)) ? objHsv2 : (Number(ch) === Number(col1) ? objHsv1 : null);
        if (Number(ch) === 1012 && Number(col1) > 0 && Number(col1) !== 1012) {
          spr._eeLighter = true;
          ch = col1;
        }
        spr._eeColorChannel = ch;
        if (sprHsv) spr._eeHsv = sprHsv;
        if (!this._colorChannelSprites[ch]) this._colorChannelSprites[ch] = [];
        this._colorChannelSprites[ch].push(spr);
        if (spr._eeBaseBlend === undefined) spr._eeBaseBlend = spr.blendMode;
        if (spr._eeLayerBase === undefined) spr._eeLayerBase = depthBase[zLayer] !== undefined ? depthBase[zLayer] : 0;
        if ((this._channelBlending && this._channelBlending[ch]) || (ch >= 1005 && ch <= 1007)) {
          spr.setBlendMode(window.S ?? S);
          spr._eeChannelAdditive = true;
        }
        if (forceParentColor && spr._SawColor === undefined) {
          spr._SawColor = ch;
        }
      }
    };

    const objGids = levelObj.groups
      ? levelObj.groups.split(".").map(Number).filter(n => n > 0)
      : null;

    const registerToGroups = (spr, baseWorldX, baseBaseY) => {
      if (!objGids || !objGids.length || !spr) return;
      const uniqueObjGids = [...new Set(objGids.map(gid => parseInt(gid, 10)).filter(gid => Number.isFinite(gid) && gid > 0))];
      spr._eeGroups = uniqueObjGids;
      spr._origWorldX = baseWorldX;
      spr._origBaseY = baseBaseY;
      spr._eeMoveBaseWorldX = baseWorldX;
      spr._eeMoveBaseBaseY = baseBaseY;
      if (spr._eeInitialWorldX === undefined) spr._eeInitialWorldX = baseWorldX;
      if (spr._eeInitialBaseY === undefined) spr._eeInitialBaseY = baseBaseY;
      if (spr._eeInitialRotationRad === undefined) spr._eeInitialRotationRad = spr.rotation || 0;
      for (const gid of uniqueObjGids) {
        if (!this._groupSprites[gid]) this._groupSprites[gid] = [];
        this._groupSprites[gid].push(spr);
      }
    };

    let portalBackSprite = null;
    if (isPortalFront) {
      const backFrame = frameName.replace("_front_", "_back_");
      portalBackSprite = addImageToScene(scene, spriteWorldX, baseY, backFrame);
      if (portalBackSprite) {
        this._applyVisualProps(scene, portalBackSprite, backFrame, levelObj);
        portalBackSprite._eeLayer = 1;
        portalBackSprite._eeWorldX = worldX;
        portalBackSprite._eeBaseY = baseY;
        portalBackSprite._eeZDepth = objZDepth - 0.005;
        portalBackSprite._eeOrigAlpha = 1;
        this._addToSection(portalBackSprite);
        registerToGroups(portalBackSprite, worldX, baseY);
        registerColor(portalBackSprite, col1);
        registerObjectSprite(portalBackSprite);
      }
    }

    let orbGlow = null;
    if (this._hasGlow(objectDef, levelObj)) {
      orbGlow = this._addGlowSprite(scene, spriteWorldX, baseY, frameName, levelObj, worldX, null, objectDef);
      if (orbGlow) {
        orbGlow._eeZDepth = objZDepth - 0.003;
        orbGlow._eeOrigAlpha = orbGlow.alpha ?? 1;
        registerColor(orbGlow, col1, !!isSawObjectId);
        registerToGroups(orbGlow, worldX, baseY);
        registerObjectSprite(orbGlow);
      }
    }

    const visualDef = isPortalFront ? { ...objectDef, _portalFront: true } : objectDef;
    const sprite = addImageToScene(scene, spriteWorldX, baseY, frameName);

    if (sprite) {
      this._applyVisualProps(scene, sprite, frameName, levelObj, objectDef);
      if (portalBackSprite) {
        portalBackSprite.x = sprite.x;
        portalBackSprite.y = sprite.y;
      }
      this._addVisualSprite(sprite, visualDef);
      sprite._eeWorldX = worldX;
      sprite._eeBaseY = baseY;
      sprite._eeZDepth = objZDepth;
      sprite._eeOrigAlpha = objectDef?.alpha ?? 1;
      if (sprite._eeOrigAlpha !== 1) sprite.setAlpha(sprite._eeOrigAlpha);
      if (objectDef?.type === dBlockType || LETTER_BLOCK_IDS.has(parseInt(levelObj.id, 10))) {
        sprite._eeEditorOnly = true;
        sprite.setVisible(!!window.isEditor);
      }
      if (isSawObjectId) {
        sprite._isSaw = true;
        const isDecorativeSaw = objectDef?.type === decoType && frameName?.includes("sawblade");
        if (sprite._Sawrotationspeed === undefined) {
          const base = isFastSawObjectId ? 0.0063 : 0.0032;
          const boostedBase = isDecorativeSaw ? base * 1.15 : base;
          sprite._Sawrotationspeed = (Math.random() < 0.5 ? -1 : 1) * (boostedBase + (Math.random() * boostedBase * 0.2 - boostedBase * 0.1));
        }
        sprite._SawRandom1 = Math.random() * Math.PI * 2;
        sprite._SawRandom2 = isDecorativeSaw ? (isFastSawObjectId ? 0.00075 : 0.00045) : (isFastSawObjectId ? 0.00065 : 0.0004);
        sprite._Sawoffset = 0;
        issawsprite(sprite);
      }
      registerColor(sprite, col1, !!isSawObjectId);
      this._addToSection(sprite);
      registerObjectSprite(sprite);

      if (objGids && objGids.length) {
        sprite._eeGroups = objGids;
        registerToGroups(sprite, sprite._eeWorldX, sprite._eeBaseY);
      }

      registerAnimatedSprite(sprite, objectDef);

      if (objectDef && objectDef.type === padType) {
        if (this.objects && this.objects.length) {
          const lastCollider = this.objects[this.objects.length - 1];
          if (lastCollider && lastCollider._padParticleEmitter) {
            sprite._padParticleEmitter = lastCollider._padParticleEmitter;
            lastCollider._padParticleEmitter._padSprite = sprite;
          }
        }
      }

      if (objectDef && objectDef.type === ringType) {
        sprite.setScale(0.75 * (Number(levelObj.scale) || 1));
        sprite._eeBaseScale = 0.75 * (Number(levelObj.scale) || 1);
        sprite._eeAudioScale = true;
        sprite._orbId = levelObj.id;
        this._orbSprites.push(sprite);
        if (frameName.indexOf("dropRing") >= 0 || frameName.indexOf("gravJumpRing") >= 0) {
          sprite._isSaw = true;
          if (isFastSawObjectId) sprite._Sawrotationspeed = 0.0065;
          issawsprite(sprite);
        }

        if (orbGlow) {
          orbGlow.setScale(0.75 * (Number(levelObj.scale) || 1));
          orbGlow._eeBaseScale = 0.75 * (Number(levelObj.scale) || 1);
          orbGlow._eeAudioScale = true;
          orbGlow._orbId = levelObj.id;
          this._orbSprites.push(orbGlow);
        }
      }

      if (objectDef && objectDef.audioPulse) {
        this._audioPulseSprites.push(sprite);
        if (orbGlow) this._audioPulseSprites.push(orbGlow);
      }

      if (objectDef && objectDef.type === coinType) {
        sprite._coinWorldX = worldX;
        sprite._coinWorldY = worldY;
        sprite._coinBaseScale = sprite.scaleX || 1;
        if (objectId === SECRET_COIN_OBJECT_ID) {
          sprite._secretCoinId = linkedObjectId;
          sprite._secretCoinSlot = secretCoinSlot;
          this._setSecretCoinAnimation(sprite, this._secretCoinCompleted.has(String(linkedObjectId)));
        }
        if (objectId === USER_COIN_OBJECT_ID) {
          sprite._userCoinId = linkedObjectId;
          sprite._userCoinSlot = userCoinSlot;
          this._setUserCoinAnimation(sprite, this._userCoinCompleted.has(String(linkedObjectId)));
        }
        this._coinSprites.push(sprite);
      }

      if (orbGlow && (isSawObjectId || frameName.indexOf("sawblade") >= 0)) {
        orbGlow._isSaw = true;
        if (sprite._Sawrotationspeed !== undefined) {
          orbGlow._Sawrotationspeed = sprite._Sawrotationspeed;
          orbGlow._SawRandom1 = sprite._SawRandom1;
          orbGlow._SawRandom2 = sprite._SawRandom2;
        } else {
          const isDecorativeSaw = objectDef?.type === decoType && frameName?.includes("sawblade");
          const base = isFastSawObjectId ? 0.0065 : 0.0034;
          const boostedBase = isDecorativeSaw ? base * 1.15 : base;
          orbGlow._Sawrotationspeed = (Math.random() < 0.5 ? -1 : 1) * (boostedBase + (Math.random() * boostedBase * 0.2 - boostedBase * 0.1));
          orbGlow._SawRandom1 = Math.random() * Math.PI * 2;
          orbGlow._SawRandom2 = isDecorativeSaw ? (isFastSawObjectId ? 0.00075 : 0.00045) : (isFastSawObjectId ? 0.00065 : 0.0004);
        }
        orbGlow._Sawoffset = orbGlow.rotation - sprite.rotation;
        issawsprite(orbGlow);
      }

      if (frameName.indexOf("sawblade") >= 0) {
        sprite.setTint(0x000000);
        sprite._isBlack = true;
        sprite._isSaw = true;
        const isDecorativeSaw = objectDef?.type === decoType && frameName?.includes("sawblade");
        if (isFastSawObjectId || isDecorativeSaw) {
          const targetSpeed = (isFastSawObjectId ? 0.0065 : 0.0034) * (isDecorativeSaw ? 1.15 : 1);
          sprite._Sawrotationspeed = targetSpeed;
        }
        issawsprite(sprite);

        const sawMirror = addImageToScene(scene, spriteWorldX, baseY, frameName);
          if (sawMirror) {
          this._applyVisualProps(scene, sawMirror, frameName, levelObj, objectDef);
          sawMirror.setTint(0x000000);
          sawMirror._isBlack = true;
          sawMirror.rotation = sprite.rotation + Math.PI;
          sawMirror._isSaw = true;
          sawMirror._eeZDepth = sprite._eeZDepth;
          sawMirror._eeLayer = sprite._eeLayer ?? 1;
          sawMirror._eeBehindParent = true;
          if (sprite._Sawrotationspeed !== undefined) {
            sawMirror._Sawrotationspeed = sprite._Sawrotationspeed;
            sawMirror._SawRandom1 = sprite._SawRandom1;
            sawMirror._SawRandom2 = sprite._SawRandom2;
            sawMirror._Sawoffset = sawMirror.rotation - sprite.rotation;
          } else {
            const base = isFastSawObjectId ? 0.0065 : 0.0034;
            const boostedBase = isDecorativeSaw ? base * 1.15 : base;
            sawMirror._Sawrotationspeed = (Math.random() < 0.5 ? -1 : 1) * (boostedBase + (Math.random() * boostedBase * 0.2 - boostedBase * 0.1));
            sawMirror._SawRandom1 = Math.random() * Math.PI * 2;
            sawMirror._SawRandom2 = isDecorativeSaw ? (isFastSawObjectId ? 0.00075 : 0.00045) : (isFastSawObjectId ? 0.0007 : 0.0004);
          }
          registerColor(sawMirror, col1, true);
          sawMirror._eeWorldX = worldX;
          sawMirror._eeBaseY = baseY;
          this._addToSection(sawMirror);
          this._addVisualSprite(sawMirror);
          issawsprite(sawMirror);
          registerToGroups(sawMirror, worldX, baseY);
          registerObjectSprite(sawMirror);
        }
      }

      if (orbGlow) this._syncGlowColor(orbGlow, sprite);
    }

    if (objectDef && (objectDef.type === solidType || objectDef.type === hazardType)) {
      const overlayFrame = frameName.replace("_001.png", "_2_001.png");
      const overlaySprite = getAtlasFrame(scene, overlayFrame) ? addImageToScene(scene, spriteWorldX, baseY, overlayFrame) : null;

      if (overlaySprite) {
        this._applyVisualProps(scene, overlaySprite, overlayFrame, levelObj);
        this._addVisualSprite(overlaySprite);
        overlaySprite._eeWorldX = worldX;
        overlaySprite._eeBaseY = baseY;
        overlaySprite._eeZDepth = objZDepth + 0.002;
        overlaySprite._eeOrigAlpha = 1;

        let oc2 = col2;
        if (oc2 <= 0) oc2 = 2;
        registerColor(overlaySprite, oc2);

        this._addToSection(overlaySprite);
        registerToGroups(overlaySprite, worldX, baseY);
        registerObjectSprite(overlaySprite);
      }
    }

    if (objectDef.children) {
      const perspChildDx = this._getPerspChildOffsets(scene, objectDef);
      let childIndex = -1;
      for (const childDef of objectDef.children) {
        childIndex++;
        const isEditorGuideChild = !!(window.isEditor && (childDef.portalGuide || childDef.orbGuide));
        if (isEditorGuideChild) {
          continue;
        }

        const parentScaleX = Number.isFinite(Number(levelObj.scaleX)) ? Number(levelObj.scaleX) : (Number(levelObj.scale) || 1);
        const parentScaleY = Number.isFinite(Number(levelObj.scaleY)) ? Number(levelObj.scaleY) : (Number(levelObj.scale) || 1);
        let childDx = (childDef.dx || 0) * parentScaleX;
        let childDy = (childDef.dy || 0) * parentScaleY;
        const autoDx = perspChildDx ? perspChildDx[childIndex] : undefined;

        if (childDef.localDx !== undefined || childDef.localDy !== undefined || autoDx !== undefined) {
          let localDx = (autoDx !== undefined ? autoDx : (childDef.localDx || 0)) * parentScaleX;
          let localDy = (childDef.localDy || 0) * parentScaleY;

          if (levelObj.flipX) {
            localDx = -localDx;
          }
          if (levelObj.flipY) {
            localDy = -localDy;
          }

          const childScale = gdObjectScale(levelObj);
          const placed = gdTransformLocalPoint(
            localDx, localDy, levelObj.rot || 0,
            childScale.x, childScale.y, gdObjectWarp(levelObj)
          );
          childDx = placed.x;
          childDy = placed.y;
        }

        const childWorldX = worldX + childDx;
        const childBaseY = baseY + childDy;
        const childSprite = addImageToScene(scene, spriteWorldX + childDx, baseY + childDy, childDef.frame);

        if (childSprite) {
          const flipX = !!levelObj.flipX;
          const flipY = !!levelObj.flipY;
          let childrotated = (levelObj.rot || 0) + (childDef.rot || 0);

          if (flipX !== flipY) {
            childrotated = (levelObj.rot || 0) - (childDef.rot || 0);
          }

          if (childDef.frame === "portal_01_extra_2_001.png" || childDef.frame === "portal_02_extra_2_001.png") {
            childrotated = 0;
          } 
          else if (childDef.frame === "blockOutline_14new_001.png" || childDef.frame === "blockOutline_15new_001.png") {
            let childRotOffset = 0;
            if (childDef.frame === "blockOutline_14new_001.png") childRotOffset = -45;
            else if (childDef.frame === "blockOutline_15new_001.png") childRotOffset = -26.565;
            if (flipX) childRotOffset = -childRotOffset;
            if (flipY) childRotOffset = -childRotOffset;
            childrotated += childRotOffset;
          }

          const childObjectData = { ...levelObj, rot: childrotated };
          const childVisualDef = {
            ...childDef,
            can_color: (childDef.black === true || childDef.tint === 0)
              ? (childDef.can_color ?? objectDef.can_color)
              : childDef.can_color
          };
           this._applyVisualProps(scene, childSprite, childDef.frame, childObjectData, childVisualDef);
           childSprite._cantColor = childDef.Cant_Color === true;
          registerAnimatedSprite(childSprite, childDef);
          if (childDef.can_color === true) childSprite._canColor = true;
          
          const showguide = childDef.portalGuide ? (!window.isEditor && window.enablePortalGuide !== false) : true;
          const showguide2 = childDef.orbGuide ? (!window.isEditor && window.enableOrbGuide !== false) : true;
          childSprite.setVisible(showguide && showguide2);
          if (childDef.portalGuide) childSprite._eePortalGuide = true;
          if (childDef.orbGuide) childSprite._eeOrbGuide = true;

          if (childDef.audioScale) {
            childSprite.setScale(0.1);
            childSprite.setAlpha(0.9);
            childSprite._eeAudioScale = true;
            if (childDef.can_color === true) childSprite._eeAudioTintable = true;
            this._audioScaleSprites.push(childSprite);
          }

          const childVisualSource = { ...childDef };
          if (childDef.portalGuide) {
            childVisualSource._portalFront = true;
          }
          if (childVisualSource.blend === undefined) {
            childVisualSource.blend = objectDef && objectDef.blend;
          }
          if (objectId === 15 || objectId === 16 || objectId === 17) {
            childSprite._rodballchild = true;
            childSprite._Rodobjectid = objectId;
          }
          const childZ = childDef.z !== undefined ? childDef.z : -1;
          if (childZ < 0) {
            childSprite._eeLayer = 1;
            childSprite._eeBehindParent = true;
            if (childVisualSource.blend === "additive") {
              childSprite.setBlendMode(S);
            }
          } else {
            this._addVisualSprite(childSprite, childVisualSource);
          }

          childSprite._eeWorldX = childWorldX;
          childSprite._eeBaseY = childBaseY;
          const guidelayer = childDef.portalGuide ? 0 : ((childDef.z !== undefined ? childDef.z : -1));
          childSprite._eeZDepth = objZDepth + Math.max(-10, Math.min(10, guidelayer)) * 0.0008;
          childSprite._eeOrigAlpha = objectDef?.alpha ?? 1;
          if (childSprite._eeOrigAlpha !== 1) childSprite.setAlpha(childSprite._eeOrigAlpha);
          if (isSawObjectId) {
            childSprite._isSaw = true;
              if (sprite._Sawrotationspeed !== undefined) {
                childSprite._Sawrotationspeed = sprite._Sawrotationspeed;
                childSprite._SawRandom1 = sprite._SawRandom1;
                childSprite._SawRandom2 = sprite._SawRandom2;
              }
            childSprite._Sawoffset = childSprite.rotation - (sprite.rotation || 0);
            issawsprite(childSprite);
          }
          const childColorChannel = childDef.color_channel !== undefined ? childDef.color_channel : (isDetailChild(childDef) ? Number(col2) : col1);
          registerColor(childSprite, childColorChannel, !!isSawObjectId);
          this._addToSection(childSprite);
          registerToGroups(childSprite, childWorldX, childBaseY);
          registerObjectSprite(childSprite);
          const childGlowEnabled = this._hasGlow(childDef, childObjectData) || this._hasGlow(objectDef, levelObj);
          if (childGlowEnabled) {
            const childGlowSprite = this._addGlowSprite(scene, spriteWorldX + childDx, baseY + childDy, childDef.frame, childObjectData, childWorldX, null, childVisualDef);
            if (childGlowSprite) {
              childGlowSprite.rotation = childSprite.rotation;
              childGlowSprite.x = childSprite.x;
              childGlowSprite.y = childSprite.y;
              childGlowSprite._eeZDepth = childSprite._eeZDepth - 0.003;
              childGlowSprite._eeOrigAlpha = childGlowSprite.alpha ?? 1;
              childGlowSprite._eeWorldX = childWorldX;
              childGlowSprite._eeBaseY = childBaseY;
              childGlowSprite._eeLayer = childSprite._eeLayer ?? 1;
              childGlowSprite._eeBehindParent = true;
              childGlowSprite._cantColor = childDef.Cant_Color === true;
              if (isSawObjectId) {
                childGlowSprite._isSaw = true;
                if (sprite._Sawrotationspeed !== undefined) {
                  childGlowSprite._Sawrotationspeed = sprite._Sawrotationspeed;
                  childGlowSprite._SawRandom1 = sprite._SawRandom1;
                  childGlowSprite._SawRandom2 = sprite._SawRandom2;
                } else {
                  const base = isFastSawObjectId ? 0.0065 : 0.0034;
                  childGlowSprite._Sawrotationspeed = (Math.random() < 0.5 ? -1 : 1) * (base + (Math.random() * base * 0.2 - base * 0.1));
                  childGlowSprite._SawRandom1 = Math.random() * Math.PI * 2;
                  childGlowSprite._SawRandom2 = isFastSawObjectId ? 0.00065 : 0.0004;
                }
                childGlowSprite._Sawoffset = childGlowSprite.rotation - (sprite.rotation || 0);
                issawsprite(childGlowSprite);
              }
              this._syncGlowColor(childGlowSprite, childSprite);
              registerColor(childGlowSprite, childColorChannel, !!isSawObjectId);
              registerToGroups(childGlowSprite, childWorldX, childBaseY);
              registerObjectSprite(childGlowSprite);
            }
          }

          if (objectDef && objectDef.type === ringType && childDef.orbGuide) {
            childSprite.setScale(0.75 * (Number(levelObj.scale) || 1));
            childSprite._eeBaseScale = 0.75 * (Number(levelObj.scale) || 1);
            childSprite._orbId = levelObj.id;
            childSprite._eeOrbGuide = true;
            childSprite._OrbGuideGrav = !!(childDef.frame && /grav(?:ring|JumpRing)/.test(childDef.frame));
            childSprite._OrbGuideRotation = childSprite.rotation || 0;
            this._orbSprites.push(childSprite);
          }

          if (frameName.indexOf("sawblade") >= 0) {
            childSprite.setTint(0x000000);
            childSprite._isBlack = true;
            childSprite._isSaw = true;
            if (sprite._Sawrotationspeed !== undefined) {
              childSprite._Sawrotationspeed = sprite._Sawrotationspeed;
              childSprite._SawRandom1 = sprite._SawRandom1;
              childSprite._SawRandom2 = sprite._SawRandom2;
            }
            issawsprite(childSprite);

            const childMirror = addImageToScene(scene, spriteWorldX + childDx, baseY + childDy, childDef.frame);
              if (childMirror) {
              this._applyVisualProps(scene, childMirror, childDef.frame, childObjectData, childVisualDef);
              childMirror.setTint(0x000000);
              childMirror._isBlack = true;
              childMirror.rotation = childSprite.rotation + Math.PI;
              childMirror._isSaw = true;
              childMirror._eeZDepth = childSprite._eeZDepth;
              childMirror._eeLayer = childSprite._eeLayer ?? 1;
              childMirror._eeBehindParent = true;
              if (childSprite._Sawrotationspeed !== undefined) {
                childMirror._Sawrotationspeed = childSprite._Sawrotationspeed;
                childMirror._SawRandom1 = childSprite._SawRandom1;
                childMirror._SawRandom2 = childSprite._SawRandom2;
              }
              childMirror._Sawoffset = childMirror.rotation - childSprite.rotation;
              
              registerColor(childMirror, col1, true);
              childMirror._eeWorldX = childWorldX;
              childMirror._eeBaseY = childBaseY;
              this._addToSection(childMirror);
              issawsprite(childMirror);
              registerToGroups(childMirror, childWorldX, childBaseY);
              registerObjectSprite(childMirror);
            }
          }
        }
      }
    }
    if (parseInt(levelObj.id ?? 0, 10) === 747) {
      this._spawnTeleportExitPortalVisual(scene, levelObj, objectDef, linkedObjectId, registerObjectSprite, registerToGroups, registerColor, objZDepth, col1);
    }

    if (window.BeastAnim && window.BeastAnim.IDS.includes(parseInt(levelObj.id ?? 0, 10))) {
      window.BeastAnim.spawn(this, scene, levelObj, objectDef, worldX, baseY, objZDepth, col1, linkedObjectId, registerObjectSprite, registerToGroups, registerColor);
    }
  }

  if (objectDef && objectDef.portalParticle && frameName && !window.enableLDM && !window.isEditor && !scene?._editorPlaytestActive) {
    const particleWorldX = worldX;
    const particleWorldY = b(worldY);
    const radiusFactor = 2;
    const particleX = particleWorldX - radiusFactor * 5;
    const particleY = particleWorldY;
    const portalRot = (levelObj.rot || 0) * Math.PI / 180;

    const source = {
      getRandomPoint: p => {
        const angle = (Math.random() * 190 + 85) * Math.PI / 180;
        const dist = radiusFactor * 20 + Math.random() * 40 * radiusFactor;
        const rx = Math.cos(angle) * dist;
        const ry = Math.sin(angle) * dist;
        p.x = rx * Math.cos(portalRot) - ry * Math.sin(portalRot);
        p.y = rx * Math.sin(portalRot) + ry * Math.cos(portalRot);
        return p;
      }
    };

    const maxDistance = 20;
    const particles = scene.add.particles(particleX, particleY, "GJ_WebSheet", {
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
        source: source
      },
      emitCallback: particle => {
        const vx = -particle.x;
        const vy = -particle.y;
        const len = Math.sqrt(vx * vx + vy * vy) || 1;
        const lifeSeconds = particle.life / 1000;
        const speed = (len - maxDistance) / (lifeSeconds || 0.3);
        particle.velocityX = vx / len * speed;
        particle.velocityY = vy / len * speed;
      }
    });

    particles.setDepth(14);
    particles._eeLayer = 2;
    particles._eeWorldX = worldX;
    particles._eeBaseY = particleY;
    this._addToSection(particles);
    (this._cullableEmitters ||= []).push(particles);
  }

  if (objectDef) {
    const registerCollider = col => {
      col._baseX = col.x;
      col._baseY = col.y;
      col._baseRotationDegrees = col.rotationDegrees || 0;
      col._origBaseX = col.x;
      col._origBaseY = col.y;
      col._origRotationDegrees = col.rotationDegrees || 0;
      col._eeMoveBaseX = col.x;
      col._eeMoveBaseY = col.y;
      col._eeInitialBaseX = col.x;
      col._eeInitialBaseY = col.y;
      col._eeInitialRotationDegrees = col.rotationDegrees || 0;
      col._eeObjectId = linkedObjectId;
      col._eeEditorLayer = parseInt(levelObj.editorLayer ?? levelObj._raw?.[20] ?? levelObj._raw?.["20"] ?? 0, 10) || 0;
      col._eeEditorLayer2 = parseInt(levelObj.editorLayer2 ?? levelObj._raw?.[61] ?? levelObj._raw?.["61"] ?? 0, 10) || 0;

      if (!this.objectSprites[linkedObjectId]) {
        this.objectSprites[linkedObjectId] = [];
      }

      if (levelObj.groups) {
        const cgids = [...new Set(levelObj.groups.split(".").map(Number).filter(n => n > 0))];
        col._eeGroups = cgids;
        for (const cgid of cgids) {
          if (!this._groupColliders[cgid]) this._groupColliders[cgid] = [];
          this._groupColliders[cgid].push(col);
        }
      }
    };

    const noTouch = String(levelObj._raw?.[121] ?? levelObj._raw?.["121"] ?? "0") === "1";
    const hitScale = gdObjectScale(levelObj);
    const hitScaleX = Math.abs(hitScale.x);
    const hitScaleY = Math.abs(hitScale.y);
    const hitScaleMean = (hitScaleX + hitScaleY) / 2;

    const slopeCollider = noTouch ? null : _createSlopeCollider(levelObj, objectDef, worldX, worldY);
    if (slopeCollider) {
      registerCollider(slopeCollider);
      this.objects.push(slopeCollider);
      hasCollisionEntry = true;
      this._addCollisionToSection(slopeCollider);
    } else if (!noTouch && objectDef.type === solidType && objectDef.gridW > 0 && objectDef.gridH > 0) {
      const w = objectDef.gridW * a * hitScaleX;
      const h = objectDef.gridH * a * hitScaleY;
      const collider = new Collider(solidType, worldX, worldY, w, h, levelObj.rot || 0);
      collider.objid = levelObj.id;
      registerCollider(collider);
      this.objects.push(collider);
      hasCollisionEntry = true;
      this._addCollisionToSection(collider);
    } else if (!noTouch && objectDef.type === dBlockType && objectDef.gridW > 0 && objectDef.gridH > 0) {
      const w = objectDef.gridW * a * hitScaleX;
      const h = objectDef.gridH * a * hitScaleY;
      const collider = new Collider(dBlockType, worldX, worldY, w, h, levelObj.rot || 0);
      collider.objid = levelObj.id;
      registerCollider(collider);
      this.objects.push(collider);
      hasCollisionEntry = true;
      this._addCollisionToSection(collider);
    } else if (!noTouch && parseInt(levelObj.id, 10) === S_BLOCK_OBJECT_ID && objectDef.gridW > 0 && objectDef.gridH > 0) {
      const w = objectDef.gridW * a * hitScaleX;
      const h = objectDef.gridH * a * hitScaleY;
      const collider = new Collider(sBlockType, worldX, worldY, w, h, levelObj.rot || 0);
      collider.objid = levelObj.id;
      registerCollider(collider);
      this.objects.push(collider);
      hasCollisionEntry = true;
      this._addCollisionToSection(collider);
    } else if (!noTouch && objectDef.type === hazardType) {
      let hitW = 0;
      let hitH = 0;

      if (
        objectDef.spriteW > 0 &&
        objectDef.spriteH > 0 &&
        objectDef.hitboxScaleX !== undefined &&
        objectDef.hitboxScaleY !== undefined
      ) {
        hitW = objectDef.spriteW * objectDef.hitboxScaleX * 2 * hitScaleX;
        hitH = objectDef.spriteH * objectDef.hitboxScaleY * 2 * hitScaleY;
      } else if (objectDef.gridW > 0 && objectDef.gridH > 0) {
        hitW = objectDef.gridW * 12 * hitScaleX;
        hitH = objectDef.gridH * 24 * hitScaleY;
      }

      const hasHitboxRadius = objectDef.hitbox_radius !== undefined && objectDef.hitbox_radius !== null;
      const worldHitboxRadius = hasHitboxRadius ? objectDef.hitbox_radius * 2 * hitScaleMean : 0;

      if (hasHitboxRadius && hitW === 0) {
        hitW = worldHitboxRadius * 2;
        hitH = worldHitboxRadius * 2;
      }

      if (hitW > 0 && hitH > 0) {
        const collider = new Collider(hazardType, worldX, worldY, hitW, hitH, levelObj.rot || 0);
        if (hasHitboxRadius) collider.hitbox_radius = worldHitboxRadius;
        registerCollider(collider);
        this.objects.push(collider);
        hasCollisionEntry = true;
        this._addCollisionToSection(collider);
      }
    } else if (objectDef.type === portalType) {
      const portalW = objectDef.gridW * a * hitScaleX;
      const portalH = objectDef.gridH * a * hitScaleY;
      const portalSub = objectDef.sub || {
        10: "gravity_flip",
        11: "gravity_normal",
        12: "cube",
        13: "fly",
        45: "mirrora",
        46: "mirrorb",
        47: "ball",
        660: "wave",
        111: "ufo",
        745: "robot",
        1331: "spider",
        747: "teleport",
        286: "dual_on",
        287: "dual_off"
      }[levelObj.id];

      const portalColliderType = {
        gravity_flip: "portal_gravity_down",
        gravity_normal: "portal_gravity_up",
        gravity_toggle: "portal_gravity_toggle",
        [flyPortal]: "portal_fly",
        fly: "portal_fly",
        [cubePortal]: "portal_cube",
        cube: "portal_cube",
        ball: "portal_ball",
        wave: portalWaveType,
        ufo: portalUfoType,
        robot: "portal_robot",
        spider: "portal_spider",
        teleport: "portal_teleport",
        mirrora: "portal_mirror_on",
        mirrorb: "portal_mirror_off",
        shrink: "portal_mini_on",
        grow: "portal_mini_off",
        dual_on: "portal_dual_on",
        dual_off: "portal_dual_off"
      }[portalSub] || null;

      if (portalColliderType) {
        const portalRot = parseFloat(levelObj.rot || 0) || 0;
        const portalRotRad = portalRot * Math.PI / 180;
        const isTeleportPortal = portalColliderType === "portal_teleport";
        const hitboxShift = isTeleportPortal ? -30 * hitScaleX : 0;
        const colliderX = worldX - Math.cos(portalRotRad) * hitboxShift;
        const colliderY = worldY + Math.sin(portalRotRad) * hitboxShift;
        const collider = new Collider(portalColliderType, colliderX, colliderY, portalW, portalH, portalRot);
        collider.particleColor = objectDef.portalParticleColor;
        collider.portalX = worldX;
        collider.portalY = worldY;
        if (isTeleportPortal) {
          const yOffset = this._getTeleportPortalYOffset(levelObj);
          collider.teleportTargetX = worldX;
          collider.teleportTargetY = worldY + yOffset * 2;
          collider.teleportYOffset = yOffset * 2;
        }
        registerCollider(collider);
        this.objects.push(collider);
        hasCollisionEntry = true;
        this._addCollisionToSection(collider);
      }
    } else if (objectDef.type === padType) {
      const padW = objectDef.gridW * a * hitScaleX;
      const padH = objectDef.gridH * a * hitScaleY;
      const padObj = new Collider(jumpPadType, worldX, worldY, padW, padH, levelObj.rot || 0);
      padObj.padId = levelObj.id;
      registerCollider(padObj);
      this.objects.push(padObj);
      hasCollisionEntry = true;
      this._addCollisionToSection(padObj);
      const _padId = parseInt(levelObj.id ?? 0, 10);
      if ([35, 67, 140, 1332, 3005].includes(_padId) && !window.enableLDM && !window.isEditor && !scene?._editorPlaytestActive) {
        const _padW = objectDef.gridW * a;
        let _padTint = 0xffffff;
        if (levelObj.color1 > 0 && scene._colorManager) {
          _padTint = scene._colorManager.getHex(levelObj.color1);
        } else if (_padId === 35) {
          _padTint = 0xffcc00;
        } else if (_padId === 67) {
          _padTint = 0x00ffff;
        } else if (_padId === 1332) {
          _padTint = 0xff3344;
        } else if (_padId === 140) {
          _padTint = 0xff33aa;
        } else if (_padId === 3005) {
          _padTint = 0xa833ff;
        }
        const rotDeg = ((levelObj.rot || 0) % 360 + 360) % 360;
        const isUpsideDown = normRot => normRot === 180 || (levelObj.flipY && normRot === 0);
        let minAngle = 255, maxAngle = 285;
        let gravY = -500, gravX = 0;
        let offsetY = -2, offsetX = 0;
        if (isUpsideDown(rotDeg)) {
          minAngle = 60;
          maxAngle = 120;
          gravY = 500;
          offsetY = 2;
        } else if (rotDeg === 90) {
          minAngle = -30;
          maxAngle = 30;
          gravY = 0;
          gravX = 500;
          offsetX = 2;
        } else if (rotDeg === 270) {
          minAngle = 150;
          maxAngle = 210;
          gravY = 0;
          gravX = -500;
          offsetX = -2;
        }
        const _padEmitter = scene.add.particles(worldX + offsetX, b(worldY) + offsetY, "GJ_WebSheet", {
          frame: "square.png",
          lifespan: { min: 250, max: 450 },
          speed: { min: 180, max: 220 },
          angle: { min: minAngle, max: maxAngle },
          x: rotDeg === 90 || rotDeg === 270 ? 0 : { min: -_padW / 2, max: _padW / 2 },
          y: rotDeg === 90 || rotDeg === 270 ? { min: -_padW / 2, max: _padW / 2 } : 0,
          scale: { start: 0.5, end: 0 },
          alpha: { start: 0.85, end: 0 },
          gravityX: gravX,
          gravityY: gravY,
          frequency: 24,
          tint: _padTint,
          blendMode: Phaser.BlendModes.ADD,
          emitting: true
        });
        _padEmitter.setDepth(12);
        _padEmitter._eeMirrorFollow = true;
        _padEmitter.setScrollFactor(0);
        padObj._padParticleEmitter = _padEmitter;
        padObj.emitters = [_padEmitter];
        (this._cullableEmitters ||= []).push(_padEmitter);
        if (levelObj.color1 > 0) {
          if (!this._colorChannelSprites[levelObj.color1]) this._colorChannelSprites[levelObj.color1] = [];
          this._colorChannelSprites[levelObj.color1].push(_padEmitter);
        }
        const objGids = levelObj.groups ? String(levelObj.groups).split(".").map(Number).filter(n => n > 0) : null;
        if (objGids && objGids.length) {
          _padEmitter._eeGroups = objGids;
          for (const gid of objGids) {
            if (!this._groupSprites[gid]) this._groupSprites[gid] = [];
            this._groupSprites[gid].push(_padEmitter);
          }
        }
        this.topContainer.add(_padEmitter);
      }
    } else if (objectDef.type === ringType) {
      const orbW = objectDef.gridW * a * hitScaleX;
      const orbH = objectDef.gridH * a * hitScaleY;
      const orbObj = new Collider(jumpRingType, worldX, worldY, orbW, orbH, levelObj.rot || 0);
      orbObj.orbId = levelObj.id;
      orbObj.multiActivate = String(levelObj._raw?.[99] ?? levelObj._raw?.["99"] ?? "") === "1";
      orbObj.orbRotation = levelObj.rot || 0;
      orbObj._dashHoldTicks = 0;
      registerCollider(orbObj);
      this.objects.push(orbObj);
      hasCollisionEntry = true;
      this._addCollisionToSection(orbObj);
    } else if (objectDef.type === coinType) {
      const coinW = (objectDef.gridW || 1) * a * hitScaleX;
      const coinH = (objectDef.gridH || 1) * a * hitScaleY;
      const coinObj = new Collider(coinType, worldX, worldY, coinW, coinH, levelObj.rot || 0);
      coinObj.coinId = levelObj.id;
      if (objectId === SECRET_COIN_OBJECT_ID) {
        coinObj.secretCoinId = linkedObjectId;
        coinObj.secretCoinSlot = secretCoinSlot;
        coinObj._secretCoinCompleted = this._secretCoinCompleted.has(String(linkedObjectId));
      }
      if (objectId === USER_COIN_OBJECT_ID) {
        coinObj.userCoinId = linkedObjectId;
        coinObj.userCoinSlot = userCoinSlot;
        coinObj._userCoinCompleted = this._userCoinCompleted.has(String(linkedObjectId));
      }
      registerCollider(coinObj);
      this.objects.push(coinObj);
      hasCollisionEntry = true;
      this._addCollisionToSection(coinObj);
    } else if (objectDef.type === speedType) {
      const speedW = (objectDef.gridW || 1) * a * hitScaleX;
      const speedH = (objectDef.gridH || 1) * a * hitScaleY;
      const speedObj = new Collider(speedType, worldX, worldY, speedW, speedH, levelObj.rot || 0);
      speedObj.portalY = worldY;

      const speedMap = {
        200: SpeedPortal.HALF,
        201: SpeedPortal.ONE_TIMES,
        202: SpeedPortal.TWO_TIMES,
        203: SpeedPortal.THREE_TIMES,
        1334: SpeedPortal.FOUR_TIMES
      };

      speedObj.speedValue = speedMap[levelObj.id] ?? SpeedPortal.ONE_TIMES;
      speedObj.speedId = levelObj.id;
      registerCollider(speedObj);
      this.objects.push(speedObj);
      hasCollisionEntry = true;
      this._addCollisionToSection(speedObj);
    }

    if (!hasCollisionEntry) {
      this.objects.push({
        type: objectDef.type || decoType,
        activated: false,
        x: 0,
        y: 0
      });
    }
  }

  return objectDef;
}

  _spawnLevelObjects(_0x35f1ae) {
    const unknownObjectIds = new Set();
    this._invisibleBlockEntries.length = 0;
    this._activeInvisibleBlocks.clear();
    this._lastObjectX = 0;
    this._nextObjectId = 0;

    for (const levelObj of _0x35f1ae) {
      const objectDef = this._spawnObject(levelObj);
      if (!objectDef) {
        unknownObjectIds.add(levelObj.id);
      }
    }
    this._invisibleBlockEntries.sort((a, b) => a.x - b.x);

    unknownObjectIds.size;
    if (unknownObjectIds.size > 0) {
    }

    const colTypeCounts = {};
    for (const obj of this.objects) {
      colTypeCounts[obj.type] = (colTypeCounts[obj.type] || 0) + 1;
    }

    this._colorTriggers.sort((a, b) => a.x - b.x);
    this._enterEffectTriggers.sort((a, b) => a.x - b.x);
    this._moveTriggers.sort((a, b) => a.x - b.x);
    this._alphaTriggers.sort((a, b) => a.x - b.x);
    this._rotateTriggers.sort((a, b) => a.x - b.x);
    this._stopTriggers.sort((a, b) => a.x - b.x);
    this._followPlayerYTriggers.sort((a, b) => a.x - b.x);
    this._followTriggers.sort((a, b) => a.x - b.x);
    this._toggleTriggers.sort((a, b) => a.x - b.x);
    this._shakeTriggers.sort((a, b) => a.x - b.x);
    this._playerVisTriggers.sort((a, b) => a.x - b.x);
    this._onDeathTriggers.sort((a, b) => a.x - b.x);
    this._touchTriggers.sort((a, b) => a.x - b.x);
    this._animationTriggers.sort((a, b) => a.x - b.x);
    this._pickupTriggers.sort((a, b) => a.x - b.x);
    this._countTriggers.sort((a, b) => a.x - b.x);
    this._instantCountTriggers.sort((a, b) => a.x - b.x);
    this._pulseTriggers.sort((a, b) => a.x - b.x);
    this._collisionTriggers.sort((a, b) => a.x - b.x);
    this._buildTouchColorTriggers();

    for (let si = 0; si < this._sectionContainers.length; si++) {
      const sc = this._sectionContainers[si];
      if (sc) {
        if (sc.normal && sc.normal.list && sc.normal.list.length > 1) sc.normal.sort("depth");
        if (sc.additive && sc.additive.list && sc.additive.list.length > 1) sc.additive.sort("depth");
      }
    }

    this.endXPos = Math.max(screenWidth + 1200, this._lastObjectX + 680);

    if (window.createObjectIds) {
      this._debugIdEntries = [];
      this._debugIdEntriesByIndex.clear();
      _0x35f1ae.forEach((levelObj, index) => {
        if (!levelObj || levelObj.id === undefined) return;
        if (window.enableLDM && ldm_object.has(parseInt(levelObj.id, 10))) return;
        const entry = {
          index,
          id: String(levelObj.id),
          x: levelObj.x * 2,
          y: typeof b === 'function' ? b(levelObj.y * 2) : levelObj.y * 2,
          removed: false
        };
        this._debugIdEntries.push(entry);
        this._debugIdEntriesByIndex.set(index, entry);
      });
      this._debugIdEntries.sort((a, b) => a.x - b.x || a.index - b.index);
    }
  }
  createEndPortal(_0x41fbdb) {
    if (window.isEditor) return; // not dealing with ts rn
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
    if (window.enableLDM) {
      this._endPortalGameY = 240;
      return;
    }
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
    if (this._endPortalEmitter) {
      this._endPortalEmitter.y = _0x32e645;
    }
    this._endPortalGameY = _0x1be4c3;
  }
  _isTriggerSaveObjectLive(uid) {
    const objects = window.levelObjects;
    if (!Number.isInteger(uid) || !Array.isArray(objects)) return true;
    let cache = this._liveObjectIdCache;
    if (!cache || cache.src !== objects || cache.len !== objects.length) {
      const ids = new Set();
      for (const obj of objects) {
        if (obj && Number.isInteger(obj._eeObjectId)) ids.add(obj._eeObjectId);
      }
      cache = this._liveObjectIdCache = { src: objects, len: objects.length, ids };
    }
    if (cache.ids.has(uid)) return true;
    const live = objects.some(obj => obj && Number.isInteger(obj._eeObjectId) && obj._eeObjectId === uid);
    if (live) cache.ids.add(uid);
    return live;
  }

  _isTriggerToggledOff(trig) {
    const off = this._groupToggledOff;
    const groups = trig?.groups;
    if (!off || !Array.isArray(groups)) return false;
    for (let i = 0; i < groups.length; i++) {
      if (off[groups[i]]) return true;
    }
    return false;
  }

  checkColorTriggers(_0x2b00ce) {
    let _0x24b030 = null;
    while (this._colorTriggerIdx < this._colorTriggers.length) {
      let _0x39c924 = this._colorTriggers[this._colorTriggerIdx];
      if (!(_0x39c924.x <= _0x2b00ce)) {
        break;
      }
      if (this._isTriggerSaveObjectLive(_0x39c924.uid) && !_0x39c924.touchTriggered && !_0x39c924.spawnTriggered) {
        (_0x24b030 ||= []).push(_0x39c924);
      }
      this._colorTriggerIdx++;
    }
    return _0x24b030 || EMPTY_TRIGGER_LIST;
  }
  checkTouchColorTriggers(playerX, playerY) {
    let triggered = null;
    const px = Number(playerX) || 0;
    const py = Number(playerY) || 0;
    this._touchColorTriggerActivated ||= new Set();

    const playerHalfSize = (typeof playerSize === "number" ? playerSize : 20);
    const halfHitbox = 30 + playerHalfSize;

    if (this._touchColorTriggerSrcLen !== this._colorTriggers.length) this._buildTouchColorTriggers();
    for (const trig of this._touchColorTriggers) {
      if (trig.spawnTriggered || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const uid = trig.uid ?? `${trig.x},${trig.y},${trig.index}`;
      if (this._touchColorTriggerActivated.has(uid)) continue;
      if (Math.abs(px - trig.x) <= halfHitbox && Math.abs(py - (trig.y ?? 0)) <= halfHitbox) {
        this._touchColorTriggerActivated.add(uid);
        (triggered ||= []).push(trig);
      }
    }

    return triggered || EMPTY_TRIGGER_LIST;
  }
  _buildTouchColorTriggers() {
    this._touchColorTriggers = this._colorTriggers.filter(t => t && t.touchTriggered && !t.spawnTriggered);
    this._touchColorTriggerSrcLen = this._colorTriggers.length;
  }
  resetColorTriggers() {
    this._colorDirty = true;
    this._colorTriggerIdx = 0;
    this._touchColorTriggerActivated = new Set();
  }
  _getSectionIndexForWorldX(worldX) {
    return Math.max(0, Math.floor((Number(worldX) || 0) / 400));
  }
  _getFlatContainers() {
    if (!this._flatContainers) {
      this._flatContainers = {
        additive: this._scene.add.container(0, 0),
        normal: this._scene.add.container(0, 0)
      };
      this._flatContainers.additive._eeMirrorGroup = true;
      this._flatContainers.normal._eeMirrorGroup = true;
      this.additiveContainer.add(this._flatContainers.additive);
      this.container.add(this._flatContainers.normal);
    }
    return this._flatContainers;
  }
  _sortFlatContainers() {
    const fc = this._flatContainers;
    this._flatNeedsSort = false;
    if (!fc) return;
    const byDepth = (a, b) => (a.depth - b.depth) || ((a._eeSpawnOrder || 0) - (b._eeSpawnOrder || 0));
    if (fc.normal.list.length > 1) fc.normal.list.sort(byDepth);
    if (fc.additive.list.length > 1) fc.additive.list.sort(byDepth);
  }
  _isFlatSectionShown(sectionIndex) {
    return this._visMinSec >= 0 && sectionIndex >= this._visMinSec && sectionIndex <= this._visMaxSec;
  }
  _getFlatTarget(spr, shown) {
    const layer = spr._eeLayer !== undefined ? spr._eeLayer : 1;
    if (layer === 2) return null;
    if (shown) {
      const fc = this._getFlatContainers();
      return fc.normal;
    }
    const home = this._ensureSectionContainer(spr._eeSectionIndex);
    return layer === 0 ? home.additive : home.normal;
  }
  _placeFlatSprite(spr, shown) {
    if (!spr.scene) return;
    const target = this._getFlatTarget(spr, shown);
    if (!target || spr.parentContainer === target) return;
    target.add(spr);
    if (shown) this._flatNeedsSort = true;
  }
  _isSpriteHidden(spr) {
    return !!(spr && (spr._eeCulled || (spr.parentContainer && !spr.parentContainer.visible)));
  }
  _ensureSectionContainer(sectionIndex) {
    if (!this._sectionContainers[sectionIndex]) {
      const sectionContainer = {
        additive: this._scene.add.container(0, 0),
        normal: this._scene.add.container(0, 0)
      };
      const sectionVisible = !this._flatDepth && (this._visMinSec === undefined || this._visMinSec < 0 || (sectionIndex >= this._visMinSec && sectionIndex <= this._visMaxSec));
      sectionContainer.additive.visible = sectionVisible;
      sectionContainer.normal.visible = sectionVisible;
      sectionContainer.additive._eeMirrorGroup = true;
      sectionContainer.normal._eeMirrorGroup = true;
      this.additiveContainer.add(sectionContainer.additive);
      this.container.add(sectionContainer.normal);
      this._sectionContainers[sectionIndex] = sectionContainer;
    }
    return this._sectionContainers[sectionIndex];
  }
  _spriteDepth(spr) {
    const z = spr._eeZDepth;
    if (!spr._eeChannelAdditive || spr._eeLayerBase === undefined) return z;
    const base = spr._eeLayerBase;
    return base - 0.5 + (z - base) * 0.24;
  }
  setChannelBlending(ch, on) {
    if (!(ch > 0) || ch >= 1000) return;
    this._channelBlending ||= {};
    if (!!this._channelBlending[ch] === on) return;
    this._channelBlending[ch] = on;
    const sprites = this._colorChannelSprites?.[ch];
    if (!sprites) return;
    const add = window.S ?? S;
    for (const spr of sprites) {
      if (!spr || !spr.scene) continue;
      spr._eeChannelAdditive = on;
      spr.setBlendMode(on ? add : (spr._eeBaseBlend ?? 0));
      if (spr._eeZDepth !== undefined) spr.depth = this._spriteDepth(spr);
    }
  }
  resetChannelBlending() {
    if (!this._channelBlendingInitial) return;
    const current = this._channelBlending || {};
    const keys = new Set([...Object.keys(current), ...Object.keys(this._channelBlendingInitial)]);
    for (const k of keys) this.setChannelBlending(Number(k), !!this._channelBlendingInitial[k]);
  }
  _addToSection(sliderWidth) {
    const _0x4ac40a = this._getSectionIndexForWorldX(sliderWidth._eeWorldX);
    this._sections[_0x4ac40a] ||= [];
    this._sections[_0x4ac40a].push(sliderWidth);
    sliderWidth._eeSectionIndex = _0x4ac40a;
    sliderWidth._eeSpawnOrder = this._spawnOrderCounter++;
    if (sliderWidth._eeZDepth !== undefined) {
      sliderWidth.depth = this._spriteDepth(sliderWidth);
    }
    const _0x14d5f7 = sliderWidth._eeLayer !== undefined ? sliderWidth._eeLayer : 1;
    if (_0x14d5f7 === 2) {
      this.topContainer.add(sliderWidth);
      return;
    }
    const _0x2157d3 = this._ensureSectionContainer(_0x4ac40a);
    if (_0x14d5f7 === 0) {
      _0x2157d3.additive.add(sliderWidth);
    } else if (sliderWidth._eeBehindParent) {
      _0x2157d3.normal.addAt(sliderWidth, 0);
    } else {
      _0x2157d3.normal.add(sliderWidth);
    }
    if (this._flatDepth && this._isFlatSectionShown(_0x4ac40a)) {
      this._placeFlatSprite(sliderWidth, true);
    }
  }
  _refreshSpriteSection(sprite) {
    if (!sprite || sprite._eeWorldX === undefined) return;
    const nextSection = this._getSectionIndexForWorldX(sprite._eeWorldX);
    let prevSection = Number.isInteger(sprite._eeSectionIndex) ? sprite._eeSectionIndex : -1;
    if (prevSection < 0 && Array.isArray(this._sections)) {
      for (let i = 0; i < this._sections.length; i++) {
        const section = this._sections[i];
        if (Array.isArray(section) && section.includes(sprite)) {
          prevSection = i;
          break;
        }
      }
    }
    if (prevSection === nextSection) {
      sprite._eeSectionIndex = nextSection;
      return;
    }
    if (prevSection >= 0 && Array.isArray(this._sections?.[prevSection])) {
      const section = this._sections[prevSection];
      const idx = section.indexOf(sprite);
      if (idx !== -1) section.splice(idx, 1);
    }
    this._sections[nextSection] ||= [];
    if (!this._sections[nextSection].includes(sprite)) this._sections[nextSection].push(sprite);
    sprite._eeSectionIndex = nextSection;
    this._colorDirty = true;
    if (this._flatDepth) {
      this._placeFlatSprite(sprite, this._isFlatSectionShown(nextSection));
      return;
    }

    const layer = sprite._eeLayer !== undefined ? sprite._eeLayer : 1;
    if (layer === 2) {
      if (sprite.parentContainer !== this.topContainer) this.topContainer.add(sprite);
      return;
    }

    const sectionContainer = this._ensureSectionContainer(nextSection);
    const targetContainer = layer === 0 ? sectionContainer.additive : sectionContainer.normal;
    if (sprite.parentContainer === targetContainer) return;
    if (layer !== 0 && sprite._eeBehindParent) targetContainer.addAt(sprite, 0);
    else targetContainer.add(sprite);
  }
  _addCollisionToSection(_0x3dce4b) {
    const _0x5cad3c = Math.max(0, Math.floor(_0x3dce4b.x / 400));
    this._collisionSections[_0x5cad3c] ||= [];
    this._collisionSections[_0x5cad3c].push(_0x3dce4b);
    _0x3dce4b._eeCollisionSectionIndex = _0x5cad3c;
  }
  _refreshCollisionSection(_0x3dce4b) {
    if (!_0x3dce4b) return;
    const _0x5cad3c = Math.max(0, Math.floor(_0x3dce4b.x / 400));
    let _0x2b0fa1 = Number.isInteger(_0x3dce4b._eeCollisionSectionIndex) ? _0x3dce4b._eeCollisionSectionIndex : -1;
    if (_0x2b0fa1 < 0 && Array.isArray(this._collisionSections)) {
      for (let i = 0; i < this._collisionSections.length; i++) {
        const section = this._collisionSections[i];
        if (Array.isArray(section) && section.includes(_0x3dce4b)) {
          _0x2b0fa1 = i;
          break;
        }
      }
    }
    if (_0x2b0fa1 === _0x5cad3c) {
      _0x3dce4b._eeCollisionSectionIndex = _0x5cad3c;
      return;
    }
    if (_0x2b0fa1 >= 0 && Array.isArray(this._collisionSections?.[_0x2b0fa1])) {
      const section = this._collisionSections[_0x2b0fa1];
      const idx = section.indexOf(_0x3dce4b);
      if (idx !== -1) section.splice(idx, 1);
    }
    this._collisionSections[_0x5cad3c] ||= [];
    if (!this._collisionSections[_0x5cad3c].includes(_0x3dce4b)) this._collisionSections[_0x5cad3c].push(_0x3dce4b);
    _0x3dce4b._eeCollisionSectionIndex = _0x5cad3c;
  }
  _setSectionVisible(_0x2b0fa1, _0x488507) {
    if (this._flatDepth) {
      const section = this._sections[_0x2b0fa1];
      if (!section) return;
      const moving = new Set();
      const sources = new Set();
      for (let i = 0; i < section.length; i++) {
        const spr = section[i];
        if (!spr || !spr.scene) continue;
        const target = this._getFlatTarget(spr, _0x488507);
        if (!target || spr.parentContainer === target) continue;
        moving.add(spr);
        if (spr.parentContainer) sources.add(spr.parentContainer);
      }
      if (!moving.size) return;
      for (const src of sources) {
        const list = src.list;
        let w = 0;
        for (let r = 0; r < list.length; r++) {
          if (!moving.has(list[r])) list[w++] = list[r];
        }
        list.length = w;
      }
      for (const spr of moving) {
        const target = this._getFlatTarget(spr, _0x488507);
        const src = spr.parentContainer;
        if (src) spr.off(Phaser.GameObjects.Events.DESTROY, src.onChildDestroyed, src);
        else spr.removeFromDisplayList();
        spr.once(Phaser.GameObjects.Events.DESTROY, target.onChildDestroyed, target);
        spr.parentContainer = target;
        target.list.push(spr);
      }
      if (_0x488507) this._flatNeedsSort = true;
      return;
    }
    const _0x141e9c = this._sectionContainers[_0x2b0fa1];
    if (_0x141e9c) {
      _0x141e9c.additive.visible = _0x488507;
      _0x141e9c.normal.visible = _0x488507;
    }
  }
  _cullEmitters(cameraX) {
    const emitters = this._cullableEmitters;
    if (!emitters || !emitters.length) return;
    const minX = cameraX - 400;
    const maxX = cameraX + screenWidth + 400;
    for (let i = 0; i < emitters.length; i++) {
      const em = emitters[i];
      if (!em || !em.scene) continue;
      const x = em._eeWorldX ?? em.x;
      const toggledOff = em._eeToggledOffGroups && em._eeToggledOffGroups.size > 0;
      const wantActive = !toggledOff && x >= minX && x <= maxX;
      if (em.active !== wantActive) em.active = wantActive;
    }
  }
  updateVisibility(_0xa5f1e1) {
    this.updateTriggerEditorVisuals();
    this._cullEmitters(_0xa5f1e1);
    if (window.enableLDM) {
      try {
        if (this._endPortalEmitter && typeof this._endPortalEmitter.stop === 'function') {
          this._endPortalEmitter.stop();
        }
      } catch (e) {}
      try {
        if (Array.isArray(this._sections)) {
          for (const sec of this._sections) {
            if (!Array.isArray(sec)) continue;
            for (const obj of sec) {
              if (!obj) continue;
              try {
                if (typeof obj.stop === 'function') obj.stop();
                if (obj.emitters && Array.isArray(obj.emitters)) {
                  for (const em of obj.emitters) {
                    try { if (typeof em.stop === 'function') em.stop(); } catch (e) {}
                  }
                }
              } catch (e) {}
            }
          }
        }
      } catch (e) {}
      try { if (this._glowSprites) for (const g of this._glowSprites) g.setVisible(false); } catch(e) {}
    }
    if (this._flatNeedsSort) this._sortFlatContainers();
    const _0x1dce22 = this._sectionContainers.length - 1;
    if (_0x1dce22 < 0) {
      return;
    }
    let cd = Number(window.cullDistance);
    if (!Number.isFinite(cd)) cd = 3;
    cd = Math.max(0, Math.min(3, Math.floor(cd)));

    let particleScale, sliderHeight;
    if (cd === 3) {
      particleScale = Math.max(0, Math.floor((_0xa5f1e1 - 200) / 400));
      sliderHeight = Math.min(_0x1dce22, Math.floor((_0xa5f1e1 + screenWidth + 200) / 400));
    } else if (cd === 0) {
      particleScale = _0x1dce22 + 1;
      sliderHeight = -1;
    } else {
      const margin = cd === 2 ? 100 : 0;
      particleScale = Math.max(0, Math.floor((_0xa5f1e1 - margin) / 400));
      sliderHeight = Math.min(_0x1dce22, Math.floor((_0xa5f1e1 + screenWidth + margin) / 400));
    }
    const _0x1800fc = this._visMinSec;
    const _0xc31046 = this._visMaxSec;
    if (_0x1800fc < 0) {
      for (let _0x47dbe1 = 0; _0x47dbe1 <= _0x1dce22; _0x47dbe1++) {
        this._setSectionVisible(_0x47dbe1, _0x47dbe1 >= particleScale && _0x47dbe1 <= sliderHeight);
      }
      this._visMinSec = particleScale;
      this._visMaxSec = sliderHeight;
      if (this._flatNeedsSort) this._sortFlatContainers();
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
      if (this._flatNeedsSort) this._sortFlatContainers();
    }
  }
  updateObjectDebugIds() {
    const activeTexts = this._debugIdTextByIndex;
    const destroyLabel = (index, text) => {
      const spriteList = this.objectSprites?.[index];
      if (Array.isArray(spriteList)) {
        const spriteIndex = spriteList.indexOf(text);
        if (spriteIndex !== -1) spriteList.splice(spriteIndex, 1);
        if (!spriteList.length) delete this.objectSprites[index];
      }
      text.destroy();
      activeTexts.delete(index);
    };
    if (!window.showObjectIds || window.enableLDM || !window.createObjectIds) {
      if (activeTexts.size) {
        for (const [index, text] of activeTexts) destroyLabel(index, text);
        this._debugIdTextsList = [];
      }
      this._debugIdLastCameraX = null;
      this._debugIdLastScreenWidth = null;
      return;
    }
    const cameraX = Number(this._cameraXRef?.value ?? this._cameraXRef?._v ?? this._scene?._cameraX ?? 0) || 0;
    if (this._debugIdLastCameraX !== null
      && Math.abs(cameraX - this._debugIdLastCameraX) < 100
      && this._debugIdLastScreenWidth === screenWidth) return;
    this._debugIdLastCameraX = cameraX;
    this._debugIdLastScreenWidth = screenWidth;
    const minX = cameraX - 200;
    const maxX = cameraX + screenWidth + 200;
    for (const [index, text] of activeTexts) {
      const entry = text._eeDebugIdEntry;
      if (!entry || entry.removed || entry.x < minX || entry.x > maxX) destroyLabel(index, text);
    }
    let low = 0, high = this._debugIdEntries.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (this._debugIdEntries[mid].x < minX) low = mid + 1;
      else high = mid;
    }
    const scene = this._scene;
    const worldContainer = this.container || this._container;
    if (!scene || !worldContainer) return;
    for (let i = low; i < this._debugIdEntries.length && this._debugIdEntries[i].x <= maxX; i++) {
      const entry = this._debugIdEntries[i];
      if (entry.removed || activeTexts.has(entry.index)) continue;
      const idText = scene.add.text(entry.x, entry.y, entry.id, {
        fontFamily: 'monospace',
        fontSize: '30px',
        fill: '#00ff00',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5).setDepth(999);
      idText._eeObjectId = entry.index;
      idText._eeDebugIdEntry = entry;
      worldContainer.add(idText);
      if (!this.objectSprites[entry.index]) this.objectSprites[entry.index] = [];
      this.objectSprites[entry.index].push(idText);
      activeTexts.set(entry.index, idText);
    }
    this._debugIdTextsList = [...activeTexts.values()];
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
          const col = _0x2171db[_0x5cdca9];
          if (col && !col.disabled && col.active !== false) {
            _0x28a7c0.push(col);
          }
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
      if (!_0x937c72.spawnTriggered) {
        this._activeEnterEffect = _0x937c72.effect;
        this._activeExitEffect = _0x937c72.effect;
      }
      this._enterEffectTriggerIdx++;
    }
  }
  _getMoveTriggerPlayerPosition() {
    const scene = this._scene || {};
    const playerX = Number(scene._playerWorldX ?? this._cameraXRef?._v ?? 0) || 0;
    const playerY = Number(scene._state?.y ?? 0) || 0;
    const cameraX = Number(this._cameraXRef?.value ?? this._cameraXRef?._v ?? scene._cameraX ?? 0) || 0;
    const cameraY = Number(scene._cameraY ?? 0) || 0;
    return { x: playerX, y: playerY, playerX, playerY, cameraX, cameraY };
  }


  _dedupeGroupList(cacheKey, list) {
    if (!list || !list.length) return null;
    const cache = this[cacheKey] || (this[cacheKey] = new WeakMap());
    let entry = cache.get(list);
    if (!entry || entry.len !== list.length) {
      entry = { len: list.length, items: [...new Set(list)].filter(Boolean) };
      cache.set(list, entry);
    }
    return entry.items;
  }

  _getUniqueGroupSprites(groupId) {
    const sprites = this._dedupeGroupList("_groupSpriteDedupe", this._groupSprites?.[groupId]);
    if (!sprites) return [];
    return sprites.filter(spr => spr.active);
  }

  _getAllGroupSprites(groupId) {
    const sprites = this._dedupeGroupList("_groupSpriteDedupe", this._groupSprites?.[groupId]);
    return sprites ? sprites.slice() : [];
  }

  _getUniqueGroupColliders(groupId) {
    const colliders = this._dedupeGroupList("_groupColliderDedupe", this._groupColliders?.[groupId]);
    return colliders ? colliders.slice() : [];
  }

  _getObjectGroupIds(obj) {
    const groups = obj?._eeGroups;
    if (!Array.isArray(groups) || !groups.length) return [];
    if (obj._eeGroupIdsSrc === groups && obj._eeGroupIdsLen === groups.length) return obj._eeGroupIds;
    const ids = [...new Set(groups.map(gid => parseInt(gid, 10)).filter(gid => Number.isFinite(gid) && gid > 0))];
    obj._eeGroupIdsSrc = groups;
    obj._eeGroupIdsLen = groups.length;
    obj._eeGroupIds = ids;
    return ids;
  }

  _getDirtyGroupSet() {
    if (this._deferGroupTransforms) return this._pendingTransformGroups || (this._pendingTransformGroups = new Set());
    const scratch = this._dirtyGroupScratch || (this._dirtyGroupScratch = new Set());
    scratch.clear();
    return scratch;
  }

  beginGroupTransformBatch() {
    this._deferGroupTransforms = true;
    if (this._pendingTransformGroups) this._pendingTransformGroups.clear();
  }

  flushGroupTransformBatch() {
    this._deferGroupTransforms = false;
    const pending = this._pendingTransformGroups;
    if (!pending || !pending.size) return;
    this._applyGroupTransforms(pending);
    pending.clear();
  }

  _applyGroupTransforms(groupIds) {
    if (this._deferGroupTransforms && groupIds === this._pendingTransformGroups) return;
    if (!groupIds.size) return;
    const sprites = this._transformSpriteScratch || (this._transformSpriteScratch = new Set());
    const colliders = this._transformColliderScratch || (this._transformColliderScratch = new Set());
    sprites.clear();
    colliders.clear();
    for (const gid of groupIds) {
      const groupSprites = this._dedupeGroupList("_groupSpriteDedupe", this._groupSprites?.[gid]);
      if (groupSprites) for (const spr of groupSprites) sprites.add(spr);
      const groupColliders = this._dedupeGroupList("_groupColliderDedupe", this._groupColliders?.[gid]);
      if (groupColliders) for (const col of groupColliders) colliders.add(col);
    }
    const centerCache = this._groupCenterScratch || (this._groupCenterScratch = new Map());
    centerCache.clear();
    this._groupCenterCache = centerCache;
    try {
      for (const spr of sprites) this._applyGroupedSpriteTransform(spr);
      for (const col of colliders) this._applyGroupedColliderTransform(col);
    } finally {
      this._groupCenterCache = null;
      sprites.clear();
      colliders.clear();
    }
  }


  _getCombinedGroupOffset(obj, out = null) {
    const result = out || { x: 0, y: 0 };
    result.x = 0;
    result.y = 0;
    const ids = this._getObjectGroupIds(obj);
    const offsets = this._groupOffsets;
    if (!offsets) return result;
    for (let i = 0; i < ids.length; i++) {
      const off = offsets[ids[i]];
      if (!off) continue;
      result.x += Number(off.x) || 0;
      result.y += Number(off.y) || 0;
    }
    return result;
  }

  _getGroupCenter(groupId) {
    const cache = this._groupCenterCache;
    if (cache) {
      const cached = cache.get(groupId);
      if (cached) return cached;
    }
    const sprites = this._dedupeGroupList("_groupSpriteDedupe", this._groupSprites?.[groupId]) || [];
    let cx = 0, cy = 0, n = 0;
    for (const cs of sprites) {
      if (!cs || !cs.active) continue;
      const off = this._getCombinedGroupOffset(cs, this._groupOffsetScratch || (this._groupOffsetScratch = { x: 0, y: 0 }));
      cx += (cs._eeInitialWorldX !== undefined ? cs._eeInitialWorldX : (cs._eeWorldX ?? cs.x)) + off.x;
      cy += (cs._eeInitialBaseY !== undefined ? cs._eeInitialBaseY : (cs._eeBaseY ?? cs.y)) + off.y;
      n++;
    }
    const center = n > 0 ? { cx: cx / n, cy: cy / n } : { cx: 0, cy: 0 };
    if (cache) cache.set(groupId, center);
    return center;
  }

  _applyGroupedSpriteTransform(spr) {
    if (!spr || !spr.active) return;
    const initialX = spr._eeInitialWorldX !== undefined ? spr._eeInitialWorldX : (spr._origWorldX ?? spr.x);
    const initialY = spr._eeInitialBaseY !== undefined ? spr._eeInitialBaseY : (spr._origBaseY ?? spr.y);
    const ids = this._getObjectGroupIds(spr);
    const offsets = this._groupOffsets;
    let moveX = 0, moveY = 0;
    if (offsets) {
      for (let i = 0; i < ids.length; i++) {
        const off = offsets[ids[i]];
        if (!off) continue;
        moveX += Number(off.x) || 0;
        moveY += Number(off.y) || 0;
      }
    }
    let finalX = initialX + moveX;
    let finalY = initialY + moveY;
    let hasRotation = false;
    let finalRot = spr._eeInitialRotationRad !== undefined ? spr._eeInitialRotationRad : 0;
    const rotations = this._groupRotations;
    for (let i = 0; rotations && i < ids.length; i++) {
      const gid = ids[i];
      const rotData = rotations[gid];
      if (!rotData || rotData.totalRad === 0) continue;
      hasRotation = true;
      if (!rotData.lockRotation) finalRot += rotData.totalRad;
      if (rotData.centerGroupId > 0) {
        const { cx, cy } = this._getGroupCenter(rotData.centerGroupId);
        const dx = finalX - cx;
        const dy = finalY - cy;
        const cosR = Math.cos(rotData.totalRad);
        const sinR = Math.sin(rotData.totalRad);
        finalX = cx + dx * cosR - dy * sinR;
        finalY = cy + dx * sinR + dy * cosR;
      }
    }
    if (!spr._beastManaged) {
      let visX = spr._eeVisOffX || 0;
      let visY = spr._eeVisOffY || 0;
      if (hasRotation && (visX || visY)) {
        const dRot = finalRot - (spr._eeInitialRotationRad !== undefined ? spr._eeInitialRotationRad : 0);
        const cosD = Math.cos(dRot);
        const sinD = Math.sin(dRot);
        const rvx = visX * cosD - visY * sinD;
        visY = visX * sinD + visY * cosD;
        visX = rvx;
      }
      spr.x = finalX + visX;
      spr.y = finalY + visY;
      if (hasRotation) spr.rotation = finalRot;
    }
    spr._eeWorldX = finalX;
    spr._eeBaseY = finalY;
    if (spr._eeSectionIndex !== this._getSectionIndexForWorldX(finalX)) this._refreshSpriteSection(spr);
    if (spr._coinWorldX !== undefined) spr._coinWorldX = spr.x / 2;
    if (spr._coinWorldY !== undefined) spr._coinWorldY = (460 - spr.y) / 2;
  }

  _applyGroupedColliderTransform(col) {
    if (!col) return;
    const initialX = col._eeInitialBaseX !== undefined ? col._eeInitialBaseX : (col._origBaseX ?? col.x);
    const initialY = col._eeInitialBaseY !== undefined ? col._eeInitialBaseY : (col._origBaseY ?? col.y);
    const initialRotDeg = col._eeInitialRotationDegrees !== undefined ? col._eeInitialRotationDegrees : 0;
    const ids = this._getObjectGroupIds(col);
    const offsets = this._groupOffsets;
    let moveX = 0, moveY = 0;
    if (offsets) {
      for (let i = 0; i < ids.length; i++) {
        const off = offsets[ids[i]];
        if (!off) continue;
        moveX += Number(off.x) || 0;
        moveY += Number(off.y) || 0;
      }
    }
    let finalX = initialX + moveX;
    let finalY = initialY - moveY;
    let hasRotation = false;
    let finalRotDeg = initialRotDeg;
    const rotations = this._groupRotations;
    for (let i = 0; rotations && i < ids.length; i++) {
      const gid = ids[i];
      const rotData = rotations[gid];
      if (!rotData || rotData.totalRad === 0) continue;
      hasRotation = true;
      if (!rotData.lockRotation) finalRotDeg += rotData.totalRad * 180 / Math.PI;
      if (rotData.centerGroupId > 0) {
        const { cx, cy } = this._getGroupCenter(rotData.centerGroupId);
        const collisionCy = this._screenYToCollisionY(cy);
        const dx = finalX - cx;
        const dy = finalY - collisionCy;
        const collisionRot = -rotData.totalRad;
        const cosR = Math.cos(collisionRot);
        const sinR = Math.sin(collisionRot);
        finalX = cx + dx * cosR - dy * sinR;
        finalY = collisionCy + dx * sinR + dy * cosR;
      }
    }
    col.x = finalX;
    col.y = finalY;
    col._baseX = finalX;
    col._baseY = finalY;
    if (hasRotation) {
      col.rotationDegrees = finalRotDeg;
      col._baseRotationDegrees = finalRotDeg;
      if (col._origRotationDegrees !== undefined) col._origRotationDegrees = finalRotDeg;
    }
    if (col._eeCollisionSectionIndex !== Math.max(0, Math.floor(finalX / 400))) this._refreshCollisionSection(col);
  }

  _ensureSpriteMoveBase(spr) {
    if (!spr) return;
    if (spr._eeMoveBaseWorldX === undefined) {
      spr._eeMoveBaseWorldX = Number.isFinite(Number(spr._origWorldX)) ? Number(spr._origWorldX) : (Number.isFinite(Number(spr._eeInitialWorldX)) ? Number(spr._eeInitialWorldX) : Number(spr.x) || 0);
    }
    if (spr._eeMoveBaseBaseY === undefined) {
      spr._eeMoveBaseBaseY = Number.isFinite(Number(spr._origBaseY)) ? Number(spr._origBaseY) : (Number.isFinite(Number(spr._eeInitialBaseY)) ? Number(spr._eeInitialBaseY) : Number(spr.y) || 0);
    }
    spr._origWorldX = spr._eeMoveBaseWorldX;
    spr._origBaseY = spr._eeMoveBaseBaseY;
  }

  _applyGroupedSpriteMoveOffset(spr) {
    this._applyGroupedSpriteTransform(spr);
  }

  _syncSpriteMoveBaseFromCurrent(spr) {}

  _ensureColliderMoveBase(col) {
    if (!col) return;
    if (col._eeMoveBaseX === undefined) {
      col._eeMoveBaseX = Number.isFinite(Number(col._origBaseX)) ? Number(col._origBaseX) : (Number.isFinite(Number(col._eeInitialBaseX)) ? Number(col._eeInitialBaseX) : Number(col.x) || 0);
    }
    if (col._eeMoveBaseY === undefined) {
      col._eeMoveBaseY = Number.isFinite(Number(col._origBaseY)) ? Number(col._origBaseY) : (Number.isFinite(Number(col._eeInitialBaseY)) ? Number(col._eeInitialBaseY) : Number(col.y) || 0);
    }
    col._origBaseX = col._eeMoveBaseX;
    col._origBaseY = col._eeMoveBaseY;
  }

  _applyGroupedColliderMoveOffset(col) {
    this._applyGroupedColliderTransform(col);
  }

  _syncColliderMoveBaseFromCurrent(col) {}

  _startMoveTriggerTween(trig) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    const pos = this._getMoveTriggerPlayerPosition();
    this._activeMoveTweens.push({
      trig,
      elapsed: 0,
      prevProgress: 0,
      prevPlayerX: pos.playerX,
      prevPlayerY: pos.playerY,
      prevCameraX: pos.cameraX,
      prevCameraY: pos.cameraY,
    });
    if (!this._groupOffsets[trig.targetGroup]) {
      this._groupOffsets[trig.targetGroup] = { x: 0, y: 0 };
    }
  }

  checkMoveTriggers(playerX) {
    while (this._moveTriggerIdx < this._moveTriggers.length) {
      const trig = this._moveTriggers[this._moveTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered && !trig.touchTriggered) this._startMoveTriggerTween(trig);
      this._moveTriggerIdx++;
    }
  }

  checkTouchMoveTriggers(playerX, playerY) {
    const px = Number(playerX) || 0;
    const py = Number(playerY) || 0;
    this._touchMoveTriggerActivated ||= new Set();

    const playerHalfSize = (typeof playerSize === "number" ? playerSize : 20);
    const halfHitbox = 30 + playerHalfSize;

    for (const trig of this._moveTriggers) {
      if (!trig || !trig.touchTriggered || trig.spawnTriggered || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const uid = trig.uid ?? `${trig.x},${trig.y},${trig.targetGroup}`;
      if (this._touchMoveTriggerActivated.has(uid)) continue;
      if (Math.abs(px - trig.x) <= halfHitbox && Math.abs(py - (trig.y ?? 0)) <= halfHitbox) {
        this._touchMoveTriggerActivated.add(uid);
        this._startMoveTriggerTween(trig);
      }
    }
  }

  stepMoveTriggers(dt) {
    const dirtyGroups = this._getDirtyGroupSet();
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

      const followPos = (trig.lockX || trig.lockY || trig.lockCameraX || trig.lockCameraY) ? this._getMoveTriggerPlayerPosition() : null;
      const deltaX = trig.lockX
        ? (followPos.playerX - anim.prevPlayerX)
        : (trig.lockCameraX ? (followPos.cameraX - anim.prevCameraX) : (trig.offsetX * amount));
      const deltaY = trig.lockY
        ? -(followPos.playerY - anim.prevPlayerY)
        : (trig.lockCameraY ? -(followPos.cameraY - anim.prevCameraY) : -(trig.offsetY * amount));
      if (followPos) {
        anim.prevPlayerX = followPos.playerX;
        anim.prevPlayerY = followPos.playerY;
        anim.prevCameraX = followPos.cameraX;
        anim.prevCameraY = followPos.cameraY;
      }

      if (!this._groupOffsets[trig.targetGroup]) {
        this._groupOffsets[trig.targetGroup] = { x: 0, y: 0 };
      }
      const off = this._groupOffsets[trig.targetGroup];
      off.x += deltaX;
      off.y += deltaY;
      dirtyGroups.add(trig.targetGroup);

      if (progress >= 1) {
        this._activeMoveTweens.splice(i, 1);
      } else {
        i++;
      }
    }
    this._applyGroupTransforms(dirtyGroups);
  }

  resetMoveTriggers() {
    this._moveTriggerIdx = 0;
    this._activeMoveTweens = [];
    this._touchMoveTriggerActivated = new Set();
    this._groupOffsets = {};
    this._groupRotations = {};

    const seenSprites = new Set();
    for (const gid in this._groupSprites) {
      for (const spr of this._groupSprites[gid]) {
        if (!spr || seenSprites.has(spr)) continue;
        seenSprites.add(spr);
        const baseX = spr._eeInitialWorldX !== undefined ? spr._eeInitialWorldX : (spr._origWorldX ?? spr.x);
        const baseY = spr._eeInitialBaseY !== undefined ? spr._eeInitialBaseY : (spr._origBaseY ?? spr.y);
        spr._eeMoveBaseWorldX = baseX;
        spr._eeMoveBaseBaseY = baseY;
        spr._origWorldX = baseX;
        spr._origBaseY = baseY;
        spr.x = baseX + (spr._eeVisOffX || 0);
        spr.y = baseY + (spr._eeVisOffY || 0);
        spr._eeWorldX = baseX;
        spr._eeBaseY = baseY;
        this._refreshSpriteSection(spr);
      }
    }

    const seenColliders = new Set();
    for (const gid in this._groupColliders) {
      for (const col of this._groupColliders[gid]) {
        if (!col || seenColliders.has(col)) continue;
        seenColliders.add(col);
        const baseX = col._eeInitialBaseX !== undefined ? col._eeInitialBaseX : (col._origBaseX ?? col.x);
        const baseY = col._eeInitialBaseY !== undefined ? col._eeInitialBaseY : (col._origBaseY ?? col.y);
        col._eeMoveBaseX = baseX;
        col._eeMoveBaseY = baseY;
        col._origBaseX = baseX;
        col._origBaseY = baseY;
        col.x = baseX;
        col.y = baseY;
        col._baseX = baseX;
        col._baseY = baseY;
        this._refreshCollisionSection(col);
      }
    }
  }

  _startAlphaTriggerTween(trig) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    const currentOpacity = this._groupOpacity[trig.targetGroup] ?? 1;
    this._activeAlphaTweens.push({
      trig,
      elapsed: 0,
      startOpacity: currentOpacity,
    });
  }

  _startRotateTriggerTween(trig) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    const totalDeg = trig.degrees + (trig.times360 * 360);
    this._activeRotateTweens.push({
      trig,
      elapsed: 0,
      prevProgress: 0,
      totalRad: totalDeg * Math.PI / 180,
    });
  }

  _screenYToCollisionY(screenY) {
    if (typeof b === "function") return b(screenY);
    return 460 - (Number(screenY) || 0);
  }


  _applyRotateTriggerColliderDelta(col, deltaRot, centerX = null, centerY = null, lockRotation = false) {
    if (!col) return;
    const hasCenter = Number.isFinite(centerX) && Number.isFinite(centerY);
    if (hasCenter) {
      const collisionCenterX = Number(centerX) || 0;
      const collisionCenterY = this._screenYToCollisionY(Number(centerY) || 0);
      const dx = col.x - collisionCenterX;
      const dy = col.y - collisionCenterY;
      const collisionDelta = -deltaRot;
      const cosD = Math.cos(collisionDelta);
      const sinD = Math.sin(collisionDelta);
      col.x = collisionCenterX + dx * cosD - dy * sinD;
      col.y = collisionCenterY + dx * sinD + dy * cosD;
      col._baseX = col.x;
      col._baseY = col.y;
      this._syncColliderMoveBaseFromCurrent(col);
    }
    if (!lockRotation) {
      const deltaDeg = deltaRot * 180 / Math.PI;
      col.rotationDegrees = (Number(col.rotationDegrees) || 0) + deltaDeg;
      col._baseRotationDegrees = col.rotationDegrees;
      if (col._origRotationDegrees !== undefined) col._origRotationDegrees = col.rotationDegrees;
    }
    this._refreshCollisionSection(col);
  }

  _startPulseTrigger(trig) {
    if (window.enableLDM) return;
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    const pulseCm = this._scene && this._scene._colorManager;
    if (trig.targetType === 0 && trig.targetChannel > 0 && pulseCm && typeof pulseCm.startPulse === "function") {
      pulseCm.startPulse(trig.targetChannel, trig);
      return;
    }
    const totalDur = trig.fadeIn + trig.hold + trig.fadeOut;
    this._activePulses.push({ trig, elapsed: 0, totalDuration: totalDur > 0 ? totalDur : 0.01 });
  }

  _queueSpawnTrigger(trig) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    const targetGroup = parseInt(trig.targetGroup ?? 0, 10);
    if (!Number.isFinite(targetGroup) || targetGroup <= 0) return;
    const baseDelay = Math.max(0, Number(trig.delay) || 0);
    const randomDelay = Math.max(0, Number(trig.randomDelay) || 0);
    const randomizedDelay = randomDelay > 0
      ? Math.max(0, baseDelay + ((Math.random() * 2) - 1) * randomDelay)
      : baseDelay;
    for (const pending of this._activeSpawnDelays) {
      if (pending.targetGroup === targetGroup && Math.abs((pending.delay - pending.elapsed) - randomizedDelay) < 1e-6) return;
    }
    this._activeSpawnDelays.push({
      targetGroup,
      delay: randomizedDelay,
      elapsed: 0
    });
  }

  checkSpawnTriggers(playerX) {
    while (this._spawnTriggerIdx < this._spawnTriggers.length) {
      const trig = this._spawnTriggers[this._spawnTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered && !trig.touchTriggered) this._queueSpawnTrigger(trig);
      this._spawnTriggerIdx++;
    }
  }

  _activateSpawnedGroup(groupId, colorManager) {
    const targetGroup = parseInt(groupId ?? 0, 10);
    if (!Number.isFinite(targetGroup) || targetGroup <= 0) return;

    const spawnMatches = (list) => (Array.isArray(list) ? list : [])
      .filter(trig => trig && trig.spawnTriggered && this._triggerHasGroup(trig, targetGroup) && !this._isTriggerToggledOff(trig) && this._isTriggerSaveObjectLive(trig.uid));

    for (const trig of spawnMatches(this._colorTriggers)) {
      if (colorManager && typeof colorManager.triggerColor === "function") {
        colorManager.triggerColor(trig.index, trig.color, trig.duration, trig.copy, trig.opacity);
      }
      this.setChannelBlending(trig.index, !!trig.blending);
    }
    for (const trig of spawnMatches(this._enterEffectTriggers)) {
      this._activeEnterEffect = trig.effect;
      this._activeExitEffect = trig.effect;
    }
    for (const trig of spawnMatches(this._moveTriggers)) this._startMoveTriggerTween(trig);
    for (const trig of spawnMatches(this._alphaTriggers)) this._startAlphaTriggerTween(trig);
    for (const trig of spawnMatches(this._rotateTriggers)) this._startRotateTriggerTween(trig);
    for (const trig of spawnMatches(this._stopTriggers)) this._executeStopTrigger(trig);
    for (const trig of spawnMatches(this._followPlayerYTriggers)) this._startFollowPlayerYTween(trig);
    for (const trig of spawnMatches(this._followTriggers)) this._startFollowTriggerTween(trig);
    for (const trig of spawnMatches(this._toggleTriggers)) this._executeToggleTrigger(trig);
    for (const trig of spawnMatches(this._animationTriggers)) this._executeAnimationTrigger(trig);
    for (const trig of spawnMatches(this._shakeTriggers)) this._executeShakeTrigger(trig);
    for (const trig of spawnMatches(this._playerVisTriggers)) this.playerHidden = trig.hide;
    for (const trig of spawnMatches(this._pulseTriggers)) this._startPulseTrigger(trig);
    for (const trig of spawnMatches(this._spawnTriggers)) this._queueSpawnTrigger(trig);
    for (const trig of spawnMatches(this._onDeathTriggers)) this._armOnDeathTrigger(trig);
    for (const trig of spawnMatches(this._touchTriggers)) this._armTouchTrigger(trig);
    for (const trig of spawnMatches(this._pickupTriggers)) this._executePickupTrigger(trig, colorManager);
    for (const trig of spawnMatches(this._countTriggers)) this._armCountTrigger(trig, colorManager);
    for (const trig of spawnMatches(this._instantCountTriggers)) this._executeInstantCountTrigger(trig, colorManager);
    for (const trig of spawnMatches(this._collisionTriggers)) this._armCollisionTrigger(trig);
  }

  checkTouchSpawnTriggers(playerX, playerY) {
    const px = Number(playerX) || 0;
    const py = Number(playerY) || 0;
    this._touchSpawnTriggerActivated ||= new Set();

    const playerHalfSize = (typeof playerSize === "number" ? playerSize : 20);
    const halfHitbox = 30 + playerHalfSize;

    for (const trig of this._spawnTriggers) {
      if (!trig || !trig.touchTriggered || trig.spawnTriggered || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const uid = trig.uid ?? `${trig.x},${trig.y},${trig.targetGroup}`;
      if (this._touchSpawnTriggerActivated.has(uid)) continue;
      if (Math.abs(px - trig.x) <= halfHitbox && Math.abs(py - (trig.y ?? 0)) <= halfHitbox) {
        this._touchSpawnTriggerActivated.add(uid);
        this._queueSpawnTrigger(trig);
      }
    }
  }

  stepSpawnTriggers(dt, colorManager) {
    let i = 0;
    let guard = 0;
    while (i < this._activeSpawnDelays.length && guard++ < 256) {
      const item = this._activeSpawnDelays[i];
      item.elapsed += dt;
      if (item.elapsed >= item.delay) {
        this._activeSpawnDelays.splice(i, 1);
        this._activateSpawnedGroup(item.targetGroup, colorManager);
      } else {
        i++;
      }
      if (i >= this._activeSpawnDelays.length) {
        for (let k = 0; k < this._activeSpawnDelays.length; k++) {
          const pending = this._activeSpawnDelays[k];
          if (pending && pending.delay <= pending.elapsed) {
            i = 0;
            break;
          }
        }
      }
    }
  }

  resetSpawnTriggers() {
    this._spawnTriggerIdx = 0;
    this._activeSpawnDelays = [];
    this._touchSpawnTriggerActivated = new Set();
  }

  checkAlphaTriggers(playerX) {
    while (this._alphaTriggerIdx < this._alphaTriggers.length) {
      const trig = this._alphaTriggers[this._alphaTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered && !trig.touchTriggered) this._startAlphaTriggerTween(trig);
      this._alphaTriggerIdx++;
    }
  }

  checkTouchAlphaTriggers(playerX, playerY) {
    const px = Number(playerX) || 0;
    const py = Number(playerY) || 0;
    this._touchAlphaTriggerActivated ||= new Set();

    const playerHalfSize = (typeof playerSize === "number" ? playerSize : 20);
    const halfHitbox = 30 + playerHalfSize;

    for (const trig of this._alphaTriggers) {
      if (!trig || !trig.touchTriggered || trig.spawnTriggered || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const uid = trig.uid ?? `${trig.x},${trig.y},${trig.targetGroup}`;
      if (this._touchAlphaTriggerActivated.has(uid)) continue;
      if (Math.abs(px - trig.x) <= halfHitbox && Math.abs(py - (trig.y ?? 0)) <= halfHitbox) {
        this._touchAlphaTriggerActivated.add(uid);
        this._startAlphaTriggerTween(trig);
      }
    }
  }

  stepAlphaTriggers(dt) {
    let changed = this._alphaForceApply === true || this._alphaAppliedSrc !== this._groupOpacity;
    let i = 0;
    while (i < this._activeAlphaTweens.length) {
      const anim = this._activeAlphaTweens[i];
      const { trig } = anim;
      const dur = trig.duration > 0 ? trig.duration : 0;

      anim.elapsed += dt;
      const progress = dur > 0 ? Math.min(anim.elapsed / dur, 1) : 1;

      const newOpacity = anim.startOpacity + (trig.targetOpacity - anim.startOpacity) * progress;
      const clamped = Math.max(0, Math.min(1, newOpacity));
      if (this._groupOpacity[trig.targetGroup] !== clamped) changed = true;
      this._groupOpacity[trig.targetGroup] = clamped;

      if (progress >= 1) {
        this._activeAlphaTweens.splice(i, 1);
      } else {
        i++;
      }
    }

    const glowMultiplier = this._getGlowAlphaMultiplier();
    if (glowMultiplier !== this._alphaAppliedGlowMultiplier) changed = true;
    if (!changed) return;
    this._alphaForceApply = false;
    this._alphaAppliedSrc = this._groupOpacity;
    this._alphaAppliedGlowMultiplier = glowMultiplier;

    for (const gid in this._groupOpacity) {
      const sprites = this._groupSprites[gid];
      if (!sprites) continue;
      const op = this._groupOpacity[gid];
      for (const spr of sprites) {
        if (!spr || !spr.active) continue;
        if (spr._eeActive) continue;
        const baseAlpha = spr._eeOrigAlpha ?? 1;
        const targetAlpha = baseAlpha * op * (spr._eeIsGlowSprite ? glowMultiplier : 1) * (spr._eeApproachAlpha ?? 1);
        if (typeof spr.setAlpha === "function") spr.setAlpha(targetAlpha);
        if (spr._padParticleEmitter) {
          if (typeof spr._padParticleEmitter.setAlpha === "function") spr._padParticleEmitter.setAlpha(targetAlpha);
          if (typeof spr._padParticleEmitter.setVisible === "function") spr._padParticleEmitter.setVisible(targetAlpha > 0.01);
        }
      }
    }
  }

  resetAlphaTriggers() {
    this._alphaForceApply = true;
    this._alphaTriggerIdx = 0;
    this._activeAlphaTweens = [];
    this._touchAlphaTriggerActivated = new Set();
    this._groupOpacity = {};
    for (const gid in this._groupSprites) {
      for (const spr of this._groupSprites[gid]) {
        if (!spr || !spr.active) continue;
        if (spr._eeActive) continue;
        const baseAlpha = spr._eeOrigAlpha ?? 1;
        const targetAlpha = baseAlpha * (spr._eeIsGlowSprite ? this._getGlowAlphaMultiplier() : 1) * (spr._eeApproachAlpha ?? 1);
        if (typeof spr.setAlpha === "function") spr.setAlpha(targetAlpha);
        if (spr._padParticleEmitter) {
          if (typeof spr._padParticleEmitter.setAlpha === "function") spr._padParticleEmitter.setAlpha(1);
          if (typeof spr._padParticleEmitter.setVisible === "function") spr._padParticleEmitter.setVisible(true);
        }
      }
    }
  }

  checkRotateTriggers(playerX) {
    while (this._rotateTriggerIdx < this._rotateTriggers.length) {
      const trig = this._rotateTriggers[this._rotateTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered) this._startRotateTriggerTween(trig);
      this._rotateTriggerIdx++;
    }
  }

  stepRotateTriggers(dt) {
    const dirtyGroups = this._getDirtyGroupSet();
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

      if (!this._groupRotations[trig.targetGroup]) {
        this._groupRotations[trig.targetGroup] = { totalRad: 0, centerGroupId: trig.centerGroup || 0, lockRotation: !!trig.lockRotation };
      }
      const rotState = this._groupRotations[trig.targetGroup];
      rotState.totalRad += deltaRot;
      rotState.centerGroupId = trig.centerGroup || 0;
      rotState.lockRotation = !!trig.lockRotation;
      dirtyGroups.add(trig.targetGroup);

      if (progress >= 1) {
        this._activeRotateTweens.splice(i, 1);
      } else {
        i++;
      }
    }
    this._applyGroupTransforms(dirtyGroups);
  }

  _executeStopTrigger(trig) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    const targetGroup = parseInt(trig.targetGroup ?? 0, 10);
    if (!Number.isFinite(targetGroup) || targetGroup <= 0) return;

    this._activeMoveTweens = this._activeMoveTweens.filter(anim => anim?.trig?.targetGroup !== targetGroup);
    this._activeRotateTweens = this._activeRotateTweens.filter(anim => anim?.trig?.targetGroup !== targetGroup);
    this._activeFollowPlayerYTweens = this._activeFollowPlayerYTweens.filter(anim => anim?.trig?.targetGroup !== targetGroup);
    this._activeFollowTweens = this._activeFollowTweens.filter(anim => anim?.trig?.targetGroup !== targetGroup);
  }

  checkStopTriggers(playerX) {
    while (this._stopTriggerIdx < this._stopTriggers.length) {
      const trig = this._stopTriggers[this._stopTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered && !trig.touchTriggered) this._executeStopTrigger(trig);
      this._stopTriggerIdx++;
    }
  }

  checkTouchStopTriggers(playerX, playerY) {
    const px = Number(playerX) || 0;
    const py = Number(playerY) || 0;
    this._touchStopTriggerActivated ||= new Set();

    const playerHalfSize = (typeof playerSize === "number" ? playerSize : 20);
    const halfHitbox = 30 + playerHalfSize;

    for (const trig of this._stopTriggers) {
      if (!trig || !trig.touchTriggered || trig.spawnTriggered || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const uid = trig.uid ?? `${trig.x},${trig.y},${trig.targetGroup}`;
      if (this._touchStopTriggerActivated.has(uid)) continue;
      if (Math.abs(px - trig.x) <= halfHitbox && Math.abs(py - (trig.y ?? 0)) <= halfHitbox) {
        this._touchStopTriggerActivated.add(uid);
        this._executeStopTrigger(trig);
      }
    }
  }

  resetStopTriggers() {
    this._stopTriggerIdx = 0;
    this._touchStopTriggerActivated = new Set();
  }

  _startFollowPlayerYTween(trig) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    const targetGroup = parseInt(trig.targetGroup ?? 0, 10);
    if (!Number.isFinite(targetGroup) || targetGroup <= 0) return;
    if (!this._groupOffsets[targetGroup]) {
      this._groupOffsets[targetGroup] = { x: 0, y: 0 };
    }
    const sprites = this._getUniqueGroupSprites(targetGroup);
    let groupInitialGDY = 0, n = 0;
    for (const spr of sprites) {
      if (!spr) continue;
      const initialScreenY = spr._eeInitialBaseY !== undefined ? spr._eeInitialBaseY : (spr._origBaseY ?? spr.y);
      groupInitialGDY += (typeof b === "function" ? b(initialScreenY) : (460 - initialScreenY));
      n++;
    }
    if (n === 0) {
      const colliders = this._getUniqueGroupColliders(targetGroup);
      for (const col of colliders) {
        if (!col) continue;
        const initialWorldY = col._eeInitialBaseY !== undefined ? col._eeInitialBaseY : (col._origBaseY ?? col.y);
        groupInitialGDY += Number(initialWorldY) || 0;
        n++;
      }
    }
    groupInitialGDY = n > 0 ? groupInitialGDY / n : 0;
    this._activeFollowPlayerYTweens.push({
      trig,
      elapsed: 0,
      history: [],
      groupInitialGDY
    });
  }

  checkFollowPlayerYTriggers(playerX) {
    while (this._followPlayerYTriggerIdx < this._followPlayerYTriggers.length) {
      const trig = this._followPlayerYTriggers[this._followPlayerYTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered && !trig.touchTriggered) this._startFollowPlayerYTween(trig);
      this._followPlayerYTriggerIdx++;
    }
  }

  checkTouchFollowPlayerYTriggers(playerX, playerY) {
    const px = Number(playerX) || 0;
    const py = Number(playerY) || 0;
    this._touchFollowPlayerYTriggerActivated ||= new Set();

    const playerHalfSize = (typeof playerSize === "number" ? playerSize : 20);
    const halfHitbox = 30 + playerHalfSize;

    for (const trig of this._followPlayerYTriggers) {
      if (!trig || !trig.touchTriggered || trig.spawnTriggered || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const uid = trig.uid ?? `${trig.x},${trig.y},${trig.targetGroup}`;
      if (this._touchFollowPlayerYTriggerActivated.has(uid)) continue;
      if (Math.abs(px - trig.x) <= halfHitbox && Math.abs(py - (trig.y ?? 0)) <= halfHitbox) {
        this._touchFollowPlayerYTriggerActivated.add(uid);
        this._startFollowPlayerYTween(trig);
      }
    }
  }

  stepFollowPlayerYTriggers(dt) {
    if (!this._activeFollowPlayerYTweens || !this._activeFollowPlayerYTweens.length) return;
    const dirtyGroups = this._getDirtyGroupSet();
    const pos = this._getMoveTriggerPlayerPosition();
    const currentPy = pos.playerY;

    let i = 0;
    while (i < this._activeFollowPlayerYTweens.length) {
      const anim = this._activeFollowPlayerYTweens[i];
      const { trig } = anim;
      anim.elapsed += dt;

      anim.history.push({ time: anim.elapsed, y: currentPy });
      const targetTime = anim.elapsed - trig.delay;
      while (anim.history.length > 2 && anim.history[1].time <= targetTime) {
        anim.history.shift();
      }
      let targetPlayerY = anim.history[0]?.y ?? currentPy;
      if (anim.history.length >= 2 && anim.history[0].time <= targetTime && targetTime <= anim.history[1].time) {
        const t0 = anim.history[0].time;
        const t1 = anim.history[1].time;
        const span = t1 - t0;
        const alpha = span > 0 ? (targetTime - t0) / span : 0;
        targetPlayerY = anim.history[0].y + (anim.history[1].y - anim.history[0].y) * alpha;
      }

      if (!this._groupOffsets[trig.targetGroup]) {
        this._groupOffsets[trig.targetGroup] = { x: 0, y: 0 };
      }
      const off = this._groupOffsets[trig.targetGroup];

      const currentGDY = anim.groupInitialGDY - off.y;
      const targetGDY = targetPlayerY + trig.offset;
      const diffGD = targetGDY - currentGDY;

      const rate = Math.min(1.0, Math.max(0.0, dt * 60.0 * trig.speed));
      let stepGD = diffGD * rate;
      if (trig.maxSpeed > 0) {
        const maxStep = trig.maxSpeed * dt * 60.0;
        if (Math.abs(stepGD) > maxStep) {
          stepGD = Math.sign(stepGD) * maxStep;
        }
      }

      off.y -= stepGD;

      dirtyGroups.add(trig.targetGroup);

      if (trig.duration > 0 && anim.elapsed >= trig.duration) {
        this._activeFollowPlayerYTweens.splice(i, 1);
      } else {
        i++;
      }
    }
    this._applyGroupTransforms(dirtyGroups);
  }

  resetFollowPlayerYTriggers() {
    this._followPlayerYTriggerIdx = 0;
    this._activeFollowPlayerYTweens = [];
    this._touchFollowPlayerYTriggerActivated = new Set();
  }

  _startFollowTriggerTween(trig) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    const targetGroup = parseInt(trig.targetGroup ?? 0, 10);
    const followGroup = parseInt(trig.followGroup ?? 0, 10);
    if (!Number.isFinite(targetGroup) || targetGroup <= 0 || !Number.isFinite(followGroup) || followGroup <= 0) return;

    const baseFollowOff = this._groupOffsets[followGroup] ? { ...this._groupOffsets[followGroup] } : { x: 0, y: 0 };
    this._activeFollowTweens.push({
      trig,
      elapsed: 0,
      lastFollowX: baseFollowOff.x,
      lastFollowY: baseFollowOff.y
    });
    if (!this._groupOffsets[targetGroup]) {
      this._groupOffsets[targetGroup] = { x: 0, y: 0 };
    }
  }

  checkFollowTriggers(playerX) {
    while (this._followTriggerIdx < this._followTriggers.length) {
      const trig = this._followTriggers[this._followTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered && !trig.touchTriggered) this._startFollowTriggerTween(trig);
      this._followTriggerIdx++;
    }
  }

  checkTouchFollowTriggers(playerX, playerY) {
    const px = Number(playerX) || 0;
    const py = Number(playerY) || 0;
    this._touchFollowTriggerActivated ||= new Set();

    const playerHalfSize = (typeof playerSize === "number" ? playerSize : 20);
    const halfHitbox = 30 + playerHalfSize;

    for (const trig of this._followTriggers) {
      if (!trig || !trig.touchTriggered || trig.spawnTriggered || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const uid = trig.uid ?? `${trig.x},${trig.y},${trig.targetGroup},${trig.followGroup}`;
      if (this._touchFollowTriggerActivated.has(uid)) continue;
      if (Math.abs(px - trig.x) <= halfHitbox && Math.abs(py - (trig.y ?? 0)) <= halfHitbox) {
        this._touchFollowTriggerActivated.add(uid);
        this._startFollowTriggerTween(trig);
      }
    }
  }

  stepFollowTriggers(dt) {
    if (!this._activeFollowTweens || !this._activeFollowTweens.length) return;
    const dirtyGroups = this._getDirtyGroupSet();

    let i = 0;
    while (i < this._activeFollowTweens.length) {
      const anim = this._activeFollowTweens[i];
      const { trig } = anim;
      anim.elapsed += dt;

      const curFollowOff = this._groupOffsets[trig.followGroup] || { x: 0, y: 0 };
      const deltaX = (curFollowOff.x - anim.lastFollowX) * trig.xMod;
      const deltaY = (curFollowOff.y - anim.lastFollowY) * trig.yMod;

      anim.lastFollowX = curFollowOff.x;
      anim.lastFollowY = curFollowOff.y;

      if (!this._groupOffsets[trig.targetGroup]) {
        this._groupOffsets[trig.targetGroup] = { x: 0, y: 0 };
      }
      const off = this._groupOffsets[trig.targetGroup];
      off.x += deltaX;
      off.y += deltaY;

      dirtyGroups.add(trig.targetGroup);

      if (trig.duration > 0 && anim.elapsed >= trig.duration) {
        this._activeFollowTweens.splice(i, 1);
      } else {
        i++;
      }
    }
    this._applyGroupTransforms(dirtyGroups);
  }

  resetFollowTriggers() {
    this._followTriggerIdx = 0;
    this._activeFollowTweens = [];
    this._touchFollowTriggerActivated = new Set();
  }

  _executeToggleTrigger(trig) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    const targetGroup = parseInt(trig.targetGroup ?? 0, 10);
    if (!Number.isFinite(targetGroup) || targetGroup <= 0) return;
    const activate = !!trig.activate;
    this._alphaForceApply = true;
    this._colorDirty = true;
    this._groupToggledOff ||= {};
    if (activate) {
      delete this._groupToggledOff[targetGroup];
    } else {
      this._groupToggledOff[targetGroup] = true;
    }

    const sprites = this._getAllGroupSprites(targetGroup);
    const colliders = this._getUniqueGroupColliders(targetGroup);

    for (const spr of sprites) {
      if (!spr) continue;
      spr._eeToggledOffGroups ||= new Set();
      if (activate) {
        spr._eeToggledOffGroups.delete(targetGroup);
      } else {
        spr._eeToggledOffGroups.add(targetGroup);
      }
      const guideHidden = (spr._eePortalGuide && window.enablePortalGuide === false) || (spr._eeOrbGuide && window.enableOrbGuide === false) || spr._beastStaticHidden === true;
      const isVisible = !guideHidden && spr._eeToggledOffGroups.size === 0;
      if (typeof spr.setVisible === "function") spr.setVisible(isVisible);
      spr.active = isVisible;
    }

    for (const col of colliders) {
      if (!col) continue;
      col._eeToggledOffGroups ||= new Set();
      if (activate) {
        col._eeToggledOffGroups.delete(targetGroup);
      } else {
        col._eeToggledOffGroups.add(targetGroup);
      }
      const isEnabled = col._eeToggledOffGroups.size === 0;
      col.disabled = !isEnabled;
      col.active = isEnabled;
    }
  }

  checkToggleTriggers(playerX) {
    while (this._toggleTriggerIdx < this._toggleTriggers.length) {
      const trig = this._toggleTriggers[this._toggleTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered && !trig.touchTriggered) this._executeToggleTrigger(trig);
      this._toggleTriggerIdx++;
    }
  }

  checkAnimationTriggers(playerX) {
    while (this._animationTriggerIdx < this._animationTriggers.length) {
      const trig = this._animationTriggers[this._animationTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered && !trig.touchTriggered) this._executeAnimationTrigger(trig);
      this._animationTriggerIdx++;
    }
  }

  checkTouchAnimationTriggers(playerX, playerY) {
    const px = Number(playerX) || 0;
    const py = Number(playerY) || 0;
    this._touchAnimationTriggerActivated ||= new Set();
    const playerHalfSize = (typeof playerSize === "number" ? playerSize : 20);
    const halfHitbox = 30 + playerHalfSize;
    for (const trig of this._animationTriggers) {
      if (!trig || !trig.touchTriggered || trig.spawnTriggered || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const uid = trig.uid ?? `${trig.x},${trig.y},${trig.animateId}`;
      if (this._touchAnimationTriggerActivated.has(uid)) continue;
      if (Math.abs(px - trig.x) <= halfHitbox && Math.abs(py - (trig.y ?? 0)) <= halfHitbox) {
        this._touchAnimationTriggerActivated.add(uid);
        this._executeAnimationTrigger(trig);
      }
    }
  }

  _executeAnimationTrigger(trig) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    if (!Number.isFinite(trig.targetGroup) || trig.targetGroup <= 0) return;
    const sprites = this._groupSprites[trig.targetGroup];
    if (!Array.isArray(sprites)) return;
    const records = new Set();
    for (const spr of sprites) {
      if (spr && spr._beastRecord) records.add(spr._beastRecord);
    }
    const states = [];
    for (const record of records) {
      if (record && record.state) states.push(record.state);
    }
    if (typeof window.BeastAnim.commandMany === "function") {
      window.BeastAnim.commandMany(states, trig.animateId);
    } else {
      for (const state of states) window.BeastAnim.command(state, trig.animateId);
    }
  }

  resetAnimationTriggers() {
    this._animationTriggerIdx = 0;
    this._touchAnimationTriggerActivated = new Set();
    for (const beast of this._beastSprites) {
      if (beast.state) window.BeastAnim.defaultBase(beast.state);
    }
  }

  checkTouchToggleTriggers(playerX, playerY) {
    const px = Number(playerX) || 0;
    const py = Number(playerY) || 0;
    this._touchToggleTriggerActivated ||= new Set();

    const playerHalfSize = (typeof playerSize === "number" ? playerSize : 20);
    const halfHitbox = 30 + playerHalfSize;

    for (const trig of this._toggleTriggers) {
      if (!trig || !trig.touchTriggered || trig.spawnTriggered || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const uid = trig.uid ?? `${trig.x},${trig.y},${trig.targetGroup}`;
      if (this._touchToggleTriggerActivated.has(uid)) continue;
      if (Math.abs(px - trig.x) <= halfHitbox && Math.abs(py - (trig.y ?? 0)) <= halfHitbox) {
        this._touchToggleTriggerActivated.add(uid);
        this._executeToggleTrigger(trig);
      }
    }
  }

  resetToggleTriggers() {
    this._toggleTriggerIdx = 0;
    this._touchToggleTriggerActivated = new Set();
    this._groupToggledOff = {};

    const seenSprites = new Set();
    for (const gid in this._groupSprites) {
      for (const spr of this._groupSprites[gid]) {
        if (!spr || seenSprites.has(spr)) continue;
        seenSprites.add(spr);
        if (spr._eeToggledOffGroups) spr._eeToggledOffGroups.clear();
        const guideHidden = (spr._eePortalGuide && window.enablePortalGuide === false) || (spr._eeOrbGuide && window.enableOrbGuide === false) || spr._beastStaticHidden === true;
        if (typeof spr.setVisible === "function") spr.setVisible(!guideHidden);
        spr.active = !guideHidden;
      }
    }

    const seenColliders = new Set();
    for (const gid in this._groupColliders) {
      for (const col of this._groupColliders[gid]) {
        if (!col || seenColliders.has(col)) continue;
        seenColliders.add(col);
        if (col._eeToggledOffGroups) col._eeToggledOffGroups.clear();
        col.disabled = false;
        col.active = true;
      }
    }
  }

  _executeShakeTrigger(trig) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    const dur = Math.max(0, Number(trig.duration) || 0);
    const str = Math.max(0, Number(trig.strength) || 0);
    if (dur <= 0 || str <= 0) return;
    const iv = Math.max(0, Number(trig.interval) || 0);
    this._shakeState = {
      strength: str,
      endTime: (this._scene?.time?.now ?? 0) + dur * 1000,
      interval: iv,
      lastStepTime: -Infinity
    };
  }

  applyShakeToOffsets(nowMs) {
    const s = this._shakeState;
    if (!s) return;
    if (nowMs > s.endTime) {
      this._shakeState = null;
      this.shakeOffsetX = 0;
      this.shakeOffsetY = 0;
      return;
    }
    if (nowMs - s.lastStepTime >= s.interval * 1000) {
      this.shakeOffsetX = (Math.random() * 2 - 1) * s.strength;
      this.shakeOffsetY = (Math.random() * 2 - 1) * s.strength;
      s.lastStepTime = nowMs;
    }
  }

  checkShakeTriggers(playerX) {
    while (this._shakeTriggerIdx < this._shakeTriggers.length) {
      const trig = this._shakeTriggers[this._shakeTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered && !trig.touchTriggered) this._executeShakeTrigger(trig);
      this._shakeTriggerIdx++;
    }
  }

  checkTouchShakeTriggers(playerX, playerY) {
    const px = Number(playerX) || 0;
    const py = Number(playerY) || 0;
    this._touchShakeTriggerActivated ||= new Set();

    const playerHalfSize = (typeof playerSize === "number" ? playerSize : 20);
    const halfHitbox = 30 + playerHalfSize;

    for (const trig of this._shakeTriggers) {
      if (!trig || !trig.touchTriggered || trig.spawnTriggered || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const uid = trig.uid ?? `${trig.x},${trig.y},${trig.duration}`;
      if (this._touchShakeTriggerActivated.has(uid)) continue;
      if (Math.abs(px - trig.x) <= halfHitbox && Math.abs(py - (trig.y ?? 0)) <= halfHitbox) {
        this._touchShakeTriggerActivated.add(uid);
        this._executeShakeTrigger(trig);
      }
    }
  }

  checkPlayerVisibilityTriggers(playerX) {
    while (this._playerVisTriggerIdx < this._playerVisTriggers.length) {
      const trig = this._playerVisTriggers[this._playerVisTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered && !trig.touchTriggered) this.playerHidden = trig.hide;
      this._playerVisTriggerIdx++;
    }
  }

  checkTouchPlayerVisibilityTriggers(playerX, playerY) {
    const px = Number(playerX) || 0;
    const py = Number(playerY) || 0;
    const playerHalfSize = (typeof playerSize === "number" ? playerSize : 20);
    const halfHitbox = 30 + playerHalfSize;
    for (const trig of this._playerVisTriggers) {
      if (!trig || !trig.touchTriggered || trig.spawnTriggered || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const uid = trig.uid ?? `${trig.x},${trig.y},${trig.hide}`;
      if (this._touchPlayerVisActivated.has(uid)) continue;
      if (Math.abs(px - trig.x) <= halfHitbox && Math.abs(py - (trig.y ?? 0)) <= halfHitbox) {
        this._touchPlayerVisActivated.add(uid);
        this.playerHidden = trig.hide;
      }
    }
  }

  resetPlayerVisibilityTriggers() {
    this._playerVisTriggerIdx = 0;
    this._touchPlayerVisActivated = new Set();
    this.playerHidden = false;
  }

  resetShakeTriggers() {
    this._shakeTriggerIdx = 0;
    this._touchShakeTriggerActivated = new Set();
    this._shakeState = null;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
  }

  isGroupToggledOff(groupId) {
    const targetGroup = parseInt(groupId ?? 0, 10);
    return targetGroup > 0 && Boolean(this._groupToggledOff?.[targetGroup]);
  }

  _armOnDeathTrigger(trig) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    if (!this._armedOnDeathTriggers.includes(trig)) {
      this._armedOnDeathTriggers.push(trig);
    }
  }

  _executeOnDeathTrigger(trig, colorManager) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    if (trig.activate) {
      this._activateSpawnedGroup(trig.targetGroup, colorManager);
      this._executeToggleTrigger({ targetGroup: trig.targetGroup, activate: true });
    } else {
      this._executeToggleTrigger({ targetGroup: trig.targetGroup, activate: false });
    }
  }

  triggerOnDeath(colorManager) {
    for (const trig of this._armedOnDeathTriggers) {
      this._executeOnDeathTrigger(trig, colorManager);
    }
  }

  checkOnDeathTriggers(playerX) {
    while (this._onDeathTriggerIdx < this._onDeathTriggers.length) {
      const trig = this._onDeathTriggers[this._onDeathTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered && !trig.touchTriggered) {
        this._armOnDeathTrigger(trig);
      }
      this._onDeathTriggerIdx++;
    }
  }

  checkTouchOnDeathTriggers(playerX, playerY) {
    const px = Number(playerX) || 0;
    const py = Number(playerY) || 0;
    this._touchOnDeathTriggerActivated ||= new Set();
    const playerHalfSize = (typeof playerSize === "number" ? playerSize : 20);
    const halfHitbox = 30 + playerHalfSize;
    for (const trig of this._onDeathTriggers) {
      if (!trig || !trig.touchTriggered || trig.spawnTriggered || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const uid = trig.uid ?? `${trig.x},${trig.y},${trig.targetGroup}`;
      if (this._touchOnDeathTriggerActivated.has(uid)) continue;
      if (Math.abs(px - trig.x) <= halfHitbox && Math.abs(py - (trig.y ?? 0)) <= halfHitbox) {
        this._touchOnDeathTriggerActivated.add(uid);
        this._armOnDeathTrigger(trig);
      }
    }
  }

  resetOnDeathTriggers() {
    this._onDeathTriggerIdx = 0;
    this._armedOnDeathTriggers = [];
    this._touchOnDeathTriggerActivated = new Set();
  }

  _armTouchTrigger(trig) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    if (!this._activeTouchTriggers.includes(trig)) {
      this._activeTouchTriggers.push(trig);
    }
  }

  checkTouchTriggers(playerX) {
    while (this._touchTriggerIdx < this._touchTriggers.length) {
      const trig = this._touchTriggers[this._touchTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered && !trig.touchTriggered) {
        this._armTouchTrigger(trig);
      }
      this._touchTriggerIdx++;
    }
  }

  checkTouchTouchTriggers(playerX, playerY) {
    const px = Number(playerX) || 0;
    const py = Number(playerY) || 0;
    this._touchTouchTriggerActivated ||= new Set();
    const playerHalfSize = (typeof playerSize === "number" ? playerSize : 20);
    const halfHitbox = 30 + playerHalfSize;
    for (const trig of this._touchTriggers) {
      if (!trig || !trig.touchTriggered || trig.spawnTriggered || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const uid = trig.uid ?? `${trig.x},${trig.y},${trig.targetGroup}`;
      if (this._touchTouchTriggerActivated.has(uid)) continue;
      if (Math.abs(px - trig.x) <= halfHitbox && Math.abs(py - (trig.y ?? 0)) <= halfHitbox) {
        this._touchTouchTriggerActivated.add(uid);
        this._armTouchTrigger(trig);
      }
    }
  }

  stepTouchTriggers(p1Holding, p1Pressed, p2Holding, p2Pressed, colorManager) {
    for (const trig of this._activeTouchTriggers) {
      if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const isHolding = Boolean(p1Holding || p2Holding);
      const isPressed = Boolean(p1Pressed || p2Pressed);
      if (trig.holdMode) {
        if (isHolding && !trig._holding) {
          trig._holding = true;
          if (trig.toggleType === 2) {
            this._executeToggleTrigger({ targetGroup: trig.targetGroup, activate: false });
          } else {
            this._activateSpawnedGroup(trig.targetGroup, colorManager);
            this._executeToggleTrigger({ targetGroup: trig.targetGroup, activate: true });
          }
        } else if (!isHolding && trig._holding) {
          trig._holding = false;
          if (trig.toggleType === 2) {
            this._activateSpawnedGroup(trig.targetGroup, colorManager);
            this._executeToggleTrigger({ targetGroup: trig.targetGroup, activate: true });
          } else {
            this._executeToggleTrigger({ targetGroup: trig.targetGroup, activate: false });
          }
        }
      } else {
        if (isPressed) {
          if (trig.toggleType === 1) {
            this._activateSpawnedGroup(trig.targetGroup, colorManager);
            this._executeToggleTrigger({ targetGroup: trig.targetGroup, activate: true });
          } else if (trig.toggleType === 2) {
            this._executeToggleTrigger({ targetGroup: trig.targetGroup, activate: false });
          } else {
            const isCurrentlyOff = Boolean(this._groupToggledOff?.[trig.targetGroup]);
            if (isCurrentlyOff) {
              this._activateSpawnedGroup(trig.targetGroup, colorManager);
              this._executeToggleTrigger({ targetGroup: trig.targetGroup, activate: true });
            } else {
              this._executeToggleTrigger({ targetGroup: trig.targetGroup, activate: false });
            }
          }
        }
      }
    }
  }

  isTouchTriggerDualMode() {
    for (const trig of this._touchTriggers) {
      if (trig && trig.dualTouch) return true;
    }
    return false;
  }

  resetTouchTriggers() {
    this._touchTriggerIdx = 0;
    for (const trig of this._activeTouchTriggers) {
      if (trig) trig._holding = false;
    }
    this._activeTouchTriggers = [];
    this._touchTouchTriggerActivated = new Set();
  }

  _executePickupTrigger(trig, colorManager) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    const itemId = parseInt(trig.itemId ?? 0, 10);
    if (!itemId) return;
    const count = parseInt(trig.count ?? 1, 10);
    this._itemCounts[itemId] = (this._itemCounts[itemId] || 0) + count;
    this._checkCountTriggers(itemId, colorManager);
  }

  checkPickupTriggers(playerX, colorManager) {
    while (this._pickupTriggerIdx < this._pickupTriggers.length) {
      const trig = this._pickupTriggers[this._pickupTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered && !trig.touchTriggered) {
        this._executePickupTrigger(trig, colorManager);
      }
      this._pickupTriggerIdx++;
    }
  }

  checkTouchPickupTriggers(playerX, playerY, colorManager) {
    const px = Number(playerX) || 0;
    const py = Number(playerY) || 0;
    this._touchPickupTriggerActivated ||= new Set();
    const playerHalfSize = (typeof playerSize === "number" ? playerSize : 20);
    const halfHitbox = 30 + playerHalfSize;
    for (const trig of this._pickupTriggers) {
      if (!trig || !trig.touchTriggered || trig.spawnTriggered || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const uid = trig.uid ?? `${trig.x},${trig.y},${trig.itemId}`;
      if (this._touchPickupTriggerActivated.has(uid)) continue;
      if (Math.abs(px - trig.x) <= halfHitbox && Math.abs(py - (trig.y ?? 0)) <= halfHitbox) {
        this._touchPickupTriggerActivated.add(uid);
        this._executePickupTrigger(trig, colorManager);
      }
    }
  }

  resetPickupTriggers() {
    this._pickupTriggerIdx = 0;
    this._touchPickupTriggerActivated = new Set();
    this._itemCounts = {};
  }

  _armCountTrigger(trig, colorManager) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    if (!this._activeCountTriggers.includes(trig)) {
      this._activeCountTriggers.push(trig);
    }
    this._evaluateCountTrigger(trig, colorManager);
  }

  _evaluateCountTrigger(trig, colorManager) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    const current = this._itemCounts[trig.itemId] || 0;
    if (current >= trig.targetCount) {
      if (trig.activate) {
        this._activateSpawnedGroup(trig.targetGroup, colorManager);
        this._executeToggleTrigger({ targetGroup: trig.targetGroup, activate: true });
      } else {
        this._executeToggleTrigger({ targetGroup: trig.targetGroup, activate: false });
      }
      if (!trig.multiActivate) {
        const idx = this._activeCountTriggers.indexOf(trig);
        if (idx !== -1) this._activeCountTriggers.splice(idx, 1);
      }
    }
  }

  _checkCountTriggers(itemId, colorManager) {
    for (let i = this._activeCountTriggers.length - 1; i >= 0; i--) {
      const trig = this._activeCountTriggers[i];
      if (!trig || (itemId !== undefined && trig.itemId !== itemId)) continue;
      this._evaluateCountTrigger(trig, colorManager);
    }
  }

  checkCountTriggers(playerX, colorManager) {
    while (this._countTriggerIdx < this._countTriggers.length) {
      const trig = this._countTriggers[this._countTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered && !trig.touchTriggered) {
        this._armCountTrigger(trig, colorManager);
      }
      this._countTriggerIdx++;
    }
  }

  checkTouchCountTriggers(playerX, playerY, colorManager) {
    const px = Number(playerX) || 0;
    const py = Number(playerY) || 0;
    this._touchCountTriggerActivated ||= new Set();
    const playerHalfSize = (typeof playerSize === "number" ? playerSize : 20);
    const halfHitbox = 30 + playerHalfSize;
    for (const trig of this._countTriggers) {
      if (!trig || !trig.touchTriggered || trig.spawnTriggered || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const uid = trig.uid ?? `${trig.x},${trig.y},${trig.targetGroup}`;
      if (this._touchCountTriggerActivated.has(uid)) continue;
      if (Math.abs(px - trig.x) <= halfHitbox && Math.abs(py - (trig.y ?? 0)) <= halfHitbox) {
        this._touchCountTriggerActivated.add(uid);
        this._armCountTrigger(trig, colorManager);
      }
    }
  }

  resetCountTriggers() {
    this._countTriggerIdx = 0;
    this._activeCountTriggers = [];
    this._touchCountTriggerActivated = new Set();
  }

  _armCollisionTrigger(trig) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    if (!trig.blockA || !trig.blockB || !(trig.targetGroup > 0)) return;
    if (this._activeCollisionTriggers.some(entry => entry.trig === trig)) return;
    this._activeCollisionTriggers.push({ trig, colliding: false });
  }

  checkCollisionTriggers(playerX) {
    while (this._collisionTriggerIdx < this._collisionTriggers.length) {
      const trig = this._collisionTriggers[this._collisionTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered && !trig.touchTriggered) this._armCollisionTrigger(trig);
      this._collisionTriggerIdx++;
    }
  }

  _isCollisionBlockEnabled(block) {
    const off = this._groupToggledOff;
    if (!off) return true;
    const ids = this._getObjectGroupIds(block);
    for (let i = 0; i < ids.length; i++) if (off[ids[i]]) return false;
    return true;
  }

  _collisionBlocksTouch(idA, idB) {
    const scratch = this._collisionScratch || (this._collisionScratch = { x: 0, y: 0 });
    const blocks = this._collisionBlocks;
    for (let i = 0; i < blocks.length; i++) {
      const a = blocks[i];
      if (a.blockId !== idA || !this._isCollisionBlockEnabled(a)) continue;
      this._getCombinedGroupOffset(a, scratch);
      const ax = a.x + scratch.x;
      const ay = a.y + scratch.y;
      for (let j = 0; j < blocks.length; j++) {
        const b = blocks[j];
        if (b === a || b.blockId !== idB || (!a.dynamic && !b.dynamic) || !this._isCollisionBlockEnabled(b)) continue;
        this._getCombinedGroupOffset(b, scratch);
        const reach = a.half + b.half;
        if (Math.abs(ax - (b.x + scratch.x)) < reach && Math.abs(ay - (b.y + scratch.y)) < reach) return true;
      }
    }
    return false;
  }

  updateCollisionTriggers() {
    const active = this._activeCollisionTriggers;
    if (!active || !active.length) return;
    for (let i = 0; i < active.length; i++) {
      const entry = active[i];
      const trig = entry.trig;
      if (this._isTriggerToggledOff(trig)) continue;
      const touching = this._collisionBlocksTouch(trig.blockA, trig.blockB);
      if (touching === entry.colliding) continue;
      entry.colliding = touching;
      if (touching !== trig.onExit) {
        this._executeToggleTrigger({ targetGroup: trig.targetGroup, activate: trig.activate });
      }
    }
  }

  resetCollisionTriggers() {
    this._collisionTriggerIdx = 0;
    this._activeCollisionTriggers = [];
  }

  _executeInstantCountTrigger(trig, colorManager) {
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
    const current = this._itemCounts[trig.itemId] || 0;
    let matched = false;
    if (trig.comparison === 1) {
      matched = current > trig.targetCount;
    } else if (trig.comparison === 2) {
      matched = current < trig.targetCount;
    } else {
      matched = current === trig.targetCount;
    }
    if (matched) {
      if (trig.activate) {
        this._activateSpawnedGroup(trig.targetGroup, colorManager);
        this._executeToggleTrigger({ targetGroup: trig.targetGroup, activate: true });
      } else {
        this._executeToggleTrigger({ targetGroup: trig.targetGroup, activate: false });
      }
    }
  }

  checkInstantCountTriggers(playerX, colorManager) {
    while (this._instantCountTriggerIdx < this._instantCountTriggers.length) {
      const trig = this._instantCountTriggers[this._instantCountTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered && !trig.touchTriggered) {
        this._executeInstantCountTrigger(trig, colorManager);
      }
      this._instantCountTriggerIdx++;
    }
  }

  checkTouchInstantCountTriggers(playerX, playerY, colorManager) {
    const px = Number(playerX) || 0;
    const py = Number(playerY) || 0;
    this._touchInstantCountTriggerActivated ||= new Set();
    const playerHalfSize = (typeof playerSize === "number" ? playerSize : 20);
    const halfHitbox = 30 + playerHalfSize;
    for (const trig of this._instantCountTriggers) {
      if (!trig || !trig.touchTriggered || trig.spawnTriggered || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const uid = trig.uid ?? `${trig.x},${trig.y},${trig.targetGroup}`;
      if (this._touchInstantCountTriggerActivated.has(uid)) continue;
      if (Math.abs(px - trig.x) <= halfHitbox && Math.abs(py - (trig.y ?? 0)) <= halfHitbox) {
        this._touchInstantCountTriggerActivated.add(uid);
        this._executeInstantCountTrigger(trig, colorManager);
      }
    }
  }

  resetInstantCountTriggers() {
    this._instantCountTriggerIdx = 0;
    this._touchInstantCountTriggerActivated = new Set();
  }

  resetRotateTriggers() {
    this._rotateTriggerIdx = 0;
    this._activeRotateTweens = [];
    this._groupRotations = {};
    const seenSprites = new Set();
    for (const gid in this._groupSprites) {
      for (const spr of this._groupSprites[gid]) {
        if (!spr || !spr.active || seenSprites.has(spr)) continue;
        seenSprites.add(spr);
        if (spr._eeInitialWorldX !== undefined) {
          spr.x = spr._eeInitialWorldX + (spr._eeVisOffX || 0);
          spr._eeWorldX = spr._eeInitialWorldX;
          spr._origWorldX = spr._eeInitialWorldX;
          spr._eeMoveBaseWorldX = spr._eeInitialWorldX;
        }
        if (spr._eeInitialBaseY !== undefined) {
          spr.y = spr._eeInitialBaseY + (spr._eeVisOffY || 0);
          spr._eeBaseY = spr._eeInitialBaseY;
          spr._origBaseY = spr._eeInitialBaseY;
          spr._eeMoveBaseBaseY = spr._eeInitialBaseY;
        }
        if (spr._eeInitialRotationRad !== undefined) spr.rotation = spr._eeInitialRotationRad;
        this._refreshSpriteSection(spr);
      }
    }

    const seenColliders = new Set();
    for (const gid in this._groupColliders) {
      for (const col of this._groupColliders[gid]) {
        if (!col || seenColliders.has(col)) continue;
        seenColliders.add(col);
        if (col._eeInitialBaseX !== undefined) {
          col.x = col._eeInitialBaseX;
          col._baseX = col._eeInitialBaseX;
          col._origBaseX = col._eeInitialBaseX;
          col._eeMoveBaseX = col._eeInitialBaseX;
        }
        if (col._eeInitialBaseY !== undefined) {
          col.y = col._eeInitialBaseY;
          col._baseY = col._eeInitialBaseY;
          col._origBaseY = col._eeInitialBaseY;
          col._eeMoveBaseY = col._eeInitialBaseY;
        }
        if (col._eeInitialRotationDegrees !== undefined) {
          col.rotationDegrees = col._eeInitialRotationDegrees;
          col._baseRotationDegrees = col._eeInitialRotationDegrees;
          col._origRotationDegrees = col._eeInitialRotationDegrees;
        }
        this._refreshCollisionSection(col);
      }
    }
  }

  checkPulseTriggers(playerX) {
    if (window.enableLDM) return;
    while (this._pulseTriggerIdx < this._pulseTriggers.length) {
      const trig = this._pulseTriggers[this._pulseTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered) this._startPulseTrigger(trig);
      this._pulseTriggerIdx++;
    }
  }
  stepPulseTriggers(dt, colorManager) {
    if (window.enableLDM) return;
    if (!this._activePulses.length) return;
    const groupOps = this._pulseGroupOps || (this._pulseGroupOps = new Map());
    const channelOps = this._pulseChannelOps || (this._pulseChannelOps = new Map());
    groupOps.clear();
    channelOps.clear();
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
      const finished = pulse.elapsed >= pulse.totalDuration;
      if (trig.targetType === 1 && trig.targetGroup > 0) {
        if (this._groupSprites[trig.targetGroup]) {
          groupOps.delete(trig.targetGroup);
          groupOps.set(trig.targetGroup, finished || intensity <= 0.01 ? null : { trig, intensity: Math.min(1, intensity) });
        }
      } else if (trig.targetType === 0 && trig.targetChannel > 0 && colorManager) {
        let op = channelOps.get(trig.targetChannel);
        if (!op) {
          op = this._takePulseOp(trig.targetChannel);
          channelOps.set(trig.targetChannel, op);
        }
        if (intensity > 0.01) {
          const baseColor = colorManager.getColor(trig.targetChannel);
          const r = Math.min(255, Math.round(baseColor.r + (trig.color.r - baseColor.r) * intensity));
          const g = Math.min(255, Math.round(baseColor.g + (trig.color.g - baseColor.g) * intensity));
          const b = Math.min(255, Math.round(baseColor.b + (trig.color.b - baseColor.b) * intensity));
          op.hex = (r << 16) | (g << 8) | b;
          op.pulsed = true;
        }
        if (finished) op.pulsed = false;
      } else if (finished && trig.targetType === 0 && trig.targetChannel > 0) {
        let op = channelOps.get(trig.targetChannel);
        if (!op) {
          op = this._takePulseOp(trig.targetChannel);
          channelOps.set(trig.targetChannel, op);
        }
        op.pulsed = false;
      }
      if (finished) {
        this._activePulses.splice(i, 1);
      } else { i++; }
    }
    if (groupOps.size) this._colorDirty = true;
    const pulseBaseByChannel = new Map();
    for (const [groupId, op] of groupOps) {
      const sprites = this._groupSprites[groupId];
      if (!sprites) continue;
      for (const spr of sprites) {
        if (!spr || !spr.active || spr._cantColor || typeof spr.setTint !== "function") continue;
        const ch = spr._eeColorChannel;
        if (!op) {
          if (!spr._eePulsed) continue;
          spr._eePulsed = false;
          if (ch && colorManager) this._applyChannelTint(spr, ch, colorManager.getHex(ch), colorManager);
          else if (spr._isBlack) spr.setTint(0);
          else spr.clearTint();
          continue;
        }
        let base;
        if (ch && colorManager) {
          base = pulseBaseByChannel.get(ch);
          if (!base) {
            base = colorManager.getColor(ch);
            pulseBaseByChannel.set(ch, base);
          }
        } else {
          base = spr._isBlack ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 };
        }
        const { trig, intensity } = op;
        const target = trig.hsv
          ? applyChannelHsv(trig.copySource > 0 && colorManager ? colorManager.getColor(trig.copySource) : base, trig.hsv)
          : trig.color;
        const r = Math.round(base.r + (target.r - base.r) * intensity);
        const g = Math.round(base.g + (target.g - base.g) * intensity);
        const b = Math.round(base.b + (target.b - base.b) * intensity);
        spr.setTint((r << 16) | (g << 8) | b);
        spr._eePulsed = true;
      }
    }
    const canLimitToVisible = this._visMinSec >= 0 && this._visMaxSec >= this._visMinSec;
    let visibleOps = null;
    if (canLimitToVisible) {
      for (const [channel, op] of channelOps) {
        if (op.hex === null || !op.pulsed) continue;
        if (!visibleOps) {
          visibleOps = this._pulseVisibleOps || (this._pulseVisibleOps = new Map());
          visibleOps.clear();
        }
        visibleOps.set(String(channel), op);
        channelOps.delete(channel);
      }
    }
    if (visibleOps) {
      this._ensureColorChannelIndex();
      const stamp = this._colorIndexStamp;
      this._forEachVisibleColorSprite((spr) => {
        if (!spr || spr._eeTintStamp !== stamp || !spr.active) return;
        if (this._isSpriteHidden(spr)) return;
        const chans = spr._eeTintChannels;
        for (let i = 0; i < chans.length; i++) {
          const op = visibleOps.get(chans[i]);
          if (!op) continue;
          if (typeof spr.setTint === "function") spr.setTint(op.hex);
          spr._eePulsed = true;
        }
      });
    }
    for (const [channel, op] of channelOps) {
      if (!op.pulsed) this._colorDirty = true;
      const chSprites = this._colorChannelSprites[channel];
      if (!chSprites) continue;
      for (const spr of chSprites) {
        if (!spr || !spr.active) continue;
        if (op.hex !== null && typeof spr.setTint === "function") {
          if (!op.pulsed || !this._isSpriteHidden(spr)) spr.setTint(op.hex);
        }
        if (op.hex !== null || !op.pulsed) spr._eePulsed = op.pulsed;
      }
    }
  }
  _takePulseOp(channel) {
    const pool = this._pulseOpPool || (this._pulseOpPool = new Map());
    let op = pool.get(channel);
    if (!op) {
      op = { hex: null, pulsed: false };
      pool.set(channel, op);
    }
    op.hex = null;
    op.pulsed = false;
    return op;
  }

  resetPulseTriggers() {
    this._colorDirty = true;
    this._scene?._colorManager?.clearPulses?.();
    this._pulseTriggerIdx = 0;
    this._activePulses = [];
    for (const gid in this._groupSprites || {}) {
      for (const spr of this._groupSprites[gid] || []) {
        if (!spr || !spr._eePulsed) continue;
        if (typeof spr.clearTint === "function") spr.clearTint();
        spr._eePulsed = false;
      }
    }
  }

  applyColorChannels(colorManager, onlyVisible = false) {
    if (onlyVisible && this._visMinSec >= 0 && this._visMaxSec >= this._visMinSec) {
      this._applyVisibleColorChannels(colorManager);
      return;
    }
    for (const chId in this._colorChannelSprites) {
      const sprites = this._colorChannelSprites[chId];
      if (!sprites || !sprites.length) continue;
      const hex = colorManager.getHex(parseInt(chId, 10));
      for (const spr of sprites) {
        if (!spr || !spr.active) continue;
        if (onlyVisible && this._isSpriteHidden(spr)) continue;
        this._applyChannelTint(spr, chId, hex, colorManager);
        this._applyChannelAlpha(spr, colorManager);
      }
    }
  }

  _applyChannelAlpha(spr, colorManager) {
    if (!spr || spr._eeActive || spr._eeAudioScale || spr._beastManaged) return;
    const ch = spr._eeColorChannel;
    if (!ch || !colorManager || typeof colorManager.getOpacity !== "function") return;
    const chOp = colorManager.getOpacity(ch);
    if (chOp === 1 && !spr._eeChannelAlphaApplied) return;
    spr._eeChannelAlphaApplied = true;
    const alpha = this._getGroupOpacityForSprite(spr);
    if (spr.alpha !== alpha) spr.alpha = alpha;
  }

  _applyChannelTint(spr, chId, hex, colorManager) {
    if (spr._cantColor) return;
    if (spr._eePulsed) return;
    if (spr._eeAudioScale && !spr._eeAudioTintable) return;
    if (spr._isSaw && spr._SawColor !== undefined) {
      spr.setTint(colorManager.getHex(spr._SawColor));
      return;
    }
    if (spr._isSaw) return;
    if (spr._isBlack && !spr._canColor) return;
    if (spr._blackDefault && typeof colorManager.hasColor === "function" && !colorManager.hasColor(chId)) return;
    if (spr._eeLighter) hex = this._lighterHex(hex);
    if (spr._eeHsv) hex = this._applyObjectHsv(spr, hex);
    if (typeof spr.setTint === "function") spr.setTint(hex);
  }

  _lighterHex(hex) {
    this._lighterCache ||= new Map();
    const cached = this._lighterCache.get(hex);
    if (cached !== undefined) return cached;
    const r = (hex >> 16) & 255, g = (hex >> 8) & 255, b = hex & 255;
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const h = rgbToHsv(r, g, b).h;
    const sat = Math.max(0.0001, Math.min(1, (max === 0 ? 0 : (max - min) / max) * 0.65));
    const val = Math.max(0.0001, Math.min(1, max + 0.15));
    const c = val * sat;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = val - c;
    let rr = 0, gg = 0, bb = 0;
    if (h < 60) { rr = c; gg = x; }
    else if (h < 120) { rr = x; gg = c; }
    else if (h < 180) { gg = c; bb = x; }
    else if (h < 240) { gg = x; bb = c; }
    else if (h < 300) { rr = x; bb = c; }
    else { rr = c; bb = x; }
    const out = (Math.trunc((rr + m) * 255) << 16) | (Math.trunc((gg + m) * 255) << 8) | Math.trunc((bb + m) * 255);
    if (this._lighterCache.size > 4096) this._lighterCache.clear();
    this._lighterCache.set(hex, out);
    return out;
  }

  _applyObjectHsv(spr, hex) {
    if (spr._eeHsvIn === hex) return spr._eeHsvOut;
    const shifted = applyChannelHsv({ r: (hex >> 16) & 255, g: (hex >> 8) & 255, b: hex & 255 }, spr._eeHsv);
    const clamp = v => Math.max(0, Math.min(255, Math.round(v)));
    const out = (clamp(shifted.r) << 16) | (clamp(shifted.g) << 8) | clamp(shifted.b);
    spr._eeHsvIn = hex;
    spr._eeHsvOut = out;
    return out;
  }

  _ensureColorChannelIndex() {
    const channels = this._colorChannelSprites;
    let total = 0;
    for (const chId in channels) total += channels[chId] ? channels[chId].length : 0;
    if (this._colorIndexSrc === channels && this._colorIndexTotal === total) return;
    const stamp = (this._colorIndexStamp || 0) + 1;
    const unsectioned = [];
    const watch = new Set();
    for (const chId in channels) {
      const sprites = channels[chId];
      if (!sprites) continue;
      watch.add(chId);
      for (const spr of sprites) {
        if (!spr) continue;
        if (spr._eeTintStamp !== stamp) {
          spr._eeTintStamp = stamp;
          spr._eeTintChannels = [];
          if (!Number.isInteger(spr._eeSectionIndex)) unsectioned.push(spr);
        }
        spr._eeTintChannels.push(chId);
        if (spr._SawColor !== undefined) watch.add(String(spr._SawColor));
      }
    }
    this._colorIndexStamp = stamp;
    this._colorIndexSrc = channels;
    this._colorIndexTotal = total;
    this._unsectionedColorSprites = unsectioned;
    this._colorWatchChannels = [...watch];
    this._colorDirty = true;
  }

  _forEachVisibleColorSprite(callback) {
    for (let i = this._visMinSec; i <= this._visMaxSec; i++) {
      const section = this._sections[i];
      if (!section) continue;
      for (let j = 0; j < section.length; j++) callback(section[j]);
    }
    const unsectioned = this._unsectionedColorSprites;
    for (let i = 0; i < unsectioned.length; i++) callback(unsectioned[i]);
  }

  _colorsNeedApply(colorManager) {
    let dirty = this._colorDirty === true;
    if (this._colorAppliedMin !== this._visMinSec || this._colorAppliedMax !== this._visMaxSec) dirty = true;
    let full = dirty;
    const changed = this._colorChangedChannels || (this._colorChangedChannels = []);
    changed.length = 0;
    const lastHex = this._colorLastHex || (this._colorLastHex = {});
    const lastHas = this._colorLastHas || (this._colorLastHas = {});
    const lastOp = this._colorLastOp || (this._colorLastOp = {});
    const canCheckHas = typeof colorManager.hasColor === "function";
    const watch = this._colorWatchChannels;
    for (let i = 0; i < watch.length; i++) {
      const chId = watch[i];
      const hex = colorManager.getHex(parseInt(chId, 10));
      const has = canCheckHas ? colorManager.hasColor(chId) : false;
      const op = colorManager.getOpacity ? colorManager.getOpacity(chId) : 1;
      if (lastHex[chId] !== hex || lastHas[chId] !== has || lastOp[chId] !== op) {
        lastHex[chId] = hex;
        lastHas[chId] = has;
        lastOp[chId] = op;
        dirty = true;
        changed.push(chId);
      }
    }
    this._colorFramesSinceApply = (this._colorFramesSinceApply || 0) + 1;
    if (this._colorFramesSinceApply >= 30) {
      dirty = true;
      full = true;
    }
    if (!this._visibleColorByChannel || this._visibleColorStamp !== this._colorIndexStamp) full = true;
    this._colorFullApply = full;
    return dirty;
  }

  _applyVisibleColorChannels(colorManager) {
    this._ensureColorChannelIndex();
    if (!this._colorsNeedApply(colorManager)) return;
    this._colorDirty = false;
    this._colorFramesSinceApply = 0;
    this._colorAppliedMin = this._visMinSec;
    this._colorAppliedMax = this._visMaxSec;
    const stamp = this._colorIndexStamp;
    const hexByChannel = {};
    const tintSprite = (spr) => {
      if (!spr || spr._eeTintStamp !== stamp || !spr.active) return;
      if (this._isSpriteHidden(spr)) return;
      const chans = spr._eeTintChannels;
      for (let i = 0; i < chans.length; i++) {
        const chId = chans[i];
        let hex = hexByChannel[chId];
        if (hex === undefined) hex = hexByChannel[chId] = colorManager.getHex(parseInt(chId, 10));
        this._applyChannelTint(spr, chId, hex, colorManager);
      }
      this._applyChannelAlpha(spr, colorManager);
    };
    if (!this._colorFullApply) {
      const byChannel = this._visibleColorByChannel;
      const changed = this._colorChangedChannels;
      const done = this._colorPartialSeen || (this._colorPartialSeen = new Set());
      done.clear();
      for (let i = 0; i < changed.length; i++) {
        const list = byChannel[changed[i]];
        if (!list) continue;
        for (let j = 0; j < list.length; j++) {
          const spr = list[j];
          if (done.has(spr)) continue;
          done.add(spr);
          tintSprite(spr);
        }
      }
      return;
    }
    const byChannel = {};
    const addTo = (chId, spr) => {
      const key = String(chId);
      (byChannel[key] || (byChannel[key] = [])).push(spr);
    };
    this._forEachVisibleColorSprite((spr) => {
      if (!spr || spr._eeTintStamp !== stamp || !spr.active) return;
      const chans = spr._eeTintChannels;
      for (let i = 0; i < chans.length; i++) addTo(chans[i], spr);
      if (spr._SawColor !== undefined) addTo(spr._SawColor, spr);
      tintSprite(spr);
    });
    this._visibleColorByChannel = byChannel;
    this._visibleColorStamp = stamp;
  }
  resetEnterEffectTriggers() {
    this._enterEffectTriggerIdx = 0;
    this._activeEnterEffect = 0;
    this._activeExitEffect = 0;
    for (let _0x17a21d = 0; _0x17a21d < this._sections.length; _0x17a21d++) {
      if (!this._flatDepth) this._setSectionVisible(_0x17a21d, true);
      const _0x14a035 = this._sections[_0x17a21d];
      if (_0x14a035) {
        for (let _0x13e116 = 0; _0x13e116 < _0x14a035.length; _0x13e116++) {
          const visMinSection = _0x14a035[_0x13e116];
          visMinSection._eeActive = false;
          const showtheportalthing = !visMinSection._eePortalGuide || (!window.isEditor && window.enablePortalGuide !== false);
          const showtheorbthing = !visMinSection._eeOrbGuide || (!window.isEditor && window.enableOrbGuide !== false);
          const showthebeastthing = visMinSection._beastStaticHidden !== true;
          const showeditoronly = !visMinSection._eeEditorOnly || !!window.isEditor;
          visMinSection.visible = showtheportalthing && showtheorbthing && showthebeastthing && showeditoronly;
          if (visMinSection._beastManaged) {
            visMinSection._eeEffectOffsetX = 0;
            visMinSection._eeEffectOffsetY = 0;
            visMinSection._eeEffectScale = 1;
            visMinSection.setAlpha(this._getGroupOpacityForSprite(visMinSection));
            continue;
          }
          visMinSection.x = visMinSection._eeWorldX + (visMinSection._eeVisOffX || 0);
          visMinSection.y = visMinSection._eeBaseY + (visMinSection._eeVisOffY || 0);
          if (!visMinSection._eeAudioScale) {
            this._setEffectScale(visMinSection, 1);
          }
          visMinSection.setAlpha(this._getGroupOpacityForSprite(visMinSection));
        }
      }
    }
  }
  _setEffectScale(spr, multiplier) {
    const baseUniform = Number(spr._eeBaseScale);
    const baseX = baseUniform > 0 ? baseUniform : (spr._eeObjScaleX ?? 1);
    const baseY = baseUniform > 0 ? baseUniform : (spr._eeObjScaleY ?? 1);
    const pulse = spr._eePulseMult || 1;
    spr._eeEffectMult = multiplier;
    const targetX = baseX * multiplier * pulse;
    const targetY = baseY * multiplier * pulse;
    if (spr.scaleX !== targetX || spr.scaleY !== targetY) spr.setScale(targetX, targetY);
  }
  _getGroupOpacityForSprite(spr) {
    const groups = spr && spr._eeGroups;
    const opacities = this._groupOpacity;
    let op = 1;
    if (groups && groups.length && opacities) {
      for (let i = 0; i < groups.length; i++) {
        const g = opacities[groups[i]];
        if (g !== undefined && g < op) op = g;
      }
    }
    const chCm = spr && spr._eeColorChannel && this._scene && this._scene._colorManager;
    if (chCm && typeof chCm.getOpacity === "function") {
      op *= chCm.getOpacity(spr._eeColorChannel);
    }
    if (spr && spr._eeIsGlowSprite) {
      op *= this._getGlowAlphaMultiplier();
    } else if (spr && spr._eeOrigAlpha !== undefined && spr._eeOrigAlpha !== 1) {
      op *= spr._eeOrigAlpha;
    }
    if (spr && spr._eeApproachAlpha !== undefined) op *= spr._eeApproachAlpha;
    return op;
  }

  _updateInvisibleBlockOpacity() {
    const entries = this._invisibleBlockEntries;
    if (!entries.length) return;
    const scene = this._scene;
    const playerX = Number(scene?._playerWorldX);
    if (!Number.isFinite(playerX)) return;
    const fadeDistance = Math.max(1, screenWidth / 2.5);
    const activeDistance = fadeDistance + 100;
    const minX = playerX - activeDistance;
    const maxX = playerX + activeDistance;
    const setOpacity = (entry, alpha) => {
      if (Math.abs(entry.alpha - alpha) < 0.001) return;
      entry.alpha = alpha;
      for (const sprite of entry.sprites) {
        if (!sprite?.active) continue;
        sprite._eeApproachAlpha = alpha;
        sprite.setAlpha(this._getGroupOpacityForSprite(sprite));
      }
    };
    for (const entry of this._activeInvisibleBlocks) {
      if (entry.removed || entry.x < minX || entry.x > maxX) {
        setOpacity(entry, 0);
        this._activeInvisibleBlocks.delete(entry);
      }
    }
    let low = 0;
    let high = entries.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (entries[mid].x < minX) low = mid + 1;
      else high = mid;
    }
    for (let i = low; i < entries.length && entries[i].x <= maxX; i++) {
      const entry = entries[i];
      if (entry.removed) continue;
      const distanceX = Math.abs(entry.x - playerX);
      const opacity = Math.max(0, Math.min(1, distanceX / fadeDistance));
      this._activeInvisibleBlocks.add(entry);
      setOpacity(entry, opacity);
    }
  }

  applyEnterEffects(_0x2f36ed) {
    this._updateInvisibleBlockOpacity();
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
            if (effectSprite._beastManaged) {
              effectSprite._eeEffectOffsetX = 0;
              effectSprite._eeEffectOffsetY = 0;
              effectSprite._eeEffectScale = 1;
            } else {
              effectSprite.y = effectSprite._eeBaseY + (effectSprite._eeVisOffY || 0);
              effectSprite.x = effectSprite._eeWorldX + (effectSprite._eeVisOffX || 0);
              if (!effectSprite._eeAudioScale) {
                this._setEffectScale(effectSprite, 1);
              }
            }
            effectSprite.setAlpha(this._getGroupOpacityForSprite(effectSprite));
          }
          continue;
        }
        const _0xeded99 = effectSprite._eeWorldX;
        const _0x1b2883 = _0xeded99 > _0x49c6d8;
        let _0x289aa2;
        _0x289aa2 = _0x1b2883 ? Math.max(0, Math.min(1, (_0x548004 - _0xeded99) / _0xa24372)) : Math.max(0, Math.min(1, (_0xeded99 - _0x29a51b) / _0xa24372));
        const _eeFadeK = effectSprite._eeDontFade ? 1 : _0x289aa2;
        const _eeEnterK = effectSprite._eeDontEnter ? 1 : _0x289aa2;
        if (_eeFadeK >= 1 && _eeEnterK >= 1) {
          if (effectSprite._eeActive) {
            effectSprite._eeActive = false;
            if (effectSprite._beastManaged) {
              effectSprite._eeEffectOffsetX = 0;
              effectSprite._eeEffectOffsetY = 0;
              effectSprite._eeEffectScale = 1;
            } else {
              effectSprite.y = effectSprite._eeBaseY + (effectSprite._eeVisOffY || 0);
              effectSprite.x = effectSprite._eeWorldX + (effectSprite._eeVisOffX || 0);
              if (!effectSprite._eeAudioScale) {
                this._setEffectScale(effectSprite, 1);
              }
            }
            effectSprite.setAlpha(this._getGroupOpacityForSprite(effectSprite));
          }
          continue;
        }
        effectSprite._eeActive = true;
        const _0x453353 = _0x1b2883 ? this._activeEnterEffect : this._activeExitEffect;
        const _0x20804e = 1 - _eeEnterK;
        const visOffX = effectSprite._eeVisOffX || 0;
        const visOffY = effectSprite._eeVisOffY || 0;
        let _0x50e6d9 = effectSprite._eeBaseY + visOffY;
        let _0x17437c = effectSprite._eeWorldX + visOffX;
        let _0x2128bf = _eeFadeK;
        let _0x127ace = 1;
        switch (_0x453353) {
          case 0:
            break;
          case 1:
            _0x50e6d9 = effectSprite._eeBaseY + visOffY + _0x5e9f2a * _0x20804e;
            break;
          case 2:
            _0x50e6d9 = effectSprite._eeBaseY + visOffY - _0x5e9f2a * _0x20804e;
            break;
          case 3:
            _0x17437c = effectSprite._eeWorldX + visOffX - _0x5e9f2a * _0x20804e;
            break;
          case 4:
            _0x17437c = effectSprite._eeWorldX + visOffX + _0x5e9f2a * _0x20804e;
            break;
          case 5:
            if (!effectSprite._eeAudioScale) {
              _0x127ace = _eeEnterK;
            }
            break;
          case 6:
            if (!effectSprite._eeAudioScale) {
              _0x127ace = 1 + _0x20804e * 0.75;
            }
        }
        if (effectSprite._beastManaged) {
          effectSprite._eeEffectOffsetX = _0x17437c - effectSprite._eeWorldX;
          effectSprite._eeEffectOffsetY = _0x50e6d9 - effectSprite._eeBaseY;
          effectSprite._eeEffectScale = _0x127ace;
        } else {
          if (effectSprite.x !== _0x17437c) {
            effectSprite.x = _0x17437c;
          }
          if (effectSprite.y !== _0x50e6d9) {
            effectSprite.y = _0x50e6d9;
          }
          if (!effectSprite._eeAudioScale) {
            this._setEffectScale(effectSprite, _0x127ace);
          }
        }
        const _eeFinalAlpha = _0x2128bf * this._getGroupOpacityForSprite(effectSprite);
        if (effectSprite.alpha !== _eeFinalAlpha) {
          effectSprite.alpha = _eeFinalAlpha;
        }
      }
    }
  }
  setGroundColor(_0x3958eb) {
    if (window.isEditor) return; // not dealing with ts rn
    if (this._groundTint === _0x3958eb) return;
    this._groundTint = _0x3958eb;
    for (let _0x46c21a of this._groundTiles) {
      _0x46c21a.setTint(_0x3958eb);
    }
    for (let _0x251562 of this._ceilingTiles) {
      _0x251562.setTint(_0x3958eb);
    }
  }
  setGround2Color(_0x3958eb) {
    if (window.isEditor) return; // not dealing with ts rn
    this._ground2Tint = _0x3958eb;
    for (let _0x46c21a of this._ground2Tiles || []) {
      _0x46c21a.setTint(_0x3958eb);
    }
    for (let _0x251562 of this._ceiling2Tiles || []) {
      _0x251562.setTint(_0x3958eb);
    }
  }
  updateAudioScale(_0x337bf7, cameraX = -Infinity, viewportWidth = Infinity) {
    const _meterValue = Number.isFinite(Number(_0x337bf7)) ? Number(_0x337bf7) : 0;
    const _maxaudioScale = 1.5; //added this cuz god DAMN whe the game lags they get big.
    const _pulseTarget = Math.min(1.2, Math.max(0, _meterValue));
    this._pulseMeter = this._pulseMeter === undefined ? _pulseTarget : this._pulseMeter + (_pulseTarget - this._pulseMeter) * (_pulseTarget > this._pulseMeter ? 0.5 : 0.3);
    const _smoothMeter = this._pulseMeter;
    const _targetAudioScale = Math.round(Math.min(_maxaudioScale, Math.max(0, _smoothMeter * 0.8)) * 1000) / 1000;
    const _minVisibleX = cameraX - 200;
    const _maxVisibleX = cameraX + viewportWidth + 200;
    for (let _0x24afdb of this._audioScaleSprites) {
      if (!_0x24afdb || !_0x24afdb.active) continue;
      const _worldX = _0x24afdb._eeWorldX;
      if (Number.isFinite(_worldX) && (_worldX < _minVisibleX || _worldX > _maxVisibleX)) continue;
      if (_0x24afdb._eeLastAudioScale !== _targetAudioScale) {
        gdApplyEffectScale(_0x24afdb, _targetAudioScale);
        _0x24afdb._eeLastAudioScale = _targetAudioScale;
      }
    }
    const _pulse = Math.round((0.82 + _smoothMeter * 0.25) * 1000) / 1000;
    for (const spr of this._audioPulseSprites) {
      if (!spr || !spr.active) continue;
      const _worldX = spr._eeWorldX;
      if (Number.isFinite(_worldX) && (_worldX < _minVisibleX || _worldX > _maxVisibleX)) continue;
      if (spr._eePulseMult === _pulse) continue;
      spr._eePulseMult = _pulse;
      const effect = spr._eeEffectMult ?? 1;
      spr.setScale((spr._eeObjScaleX ?? 1) * effect * _pulse, (spr._eeObjScaleY ?? 1) * effect * _pulse);
    }
    const _now = Date.now();
    const _clickMult = window.orbClickScale || 2.0;
    const _shrinkMs = window.orbClickShrinkTime || 250;
    const _pulseMult = Math.min(2.0, 1 + _smoothMeter * 0.2);
    for (let _0xOrbSpr of this._orbSprites) {
      if (!_0xOrbSpr || !_0xOrbSpr.active) continue;
      const _worldX = _0xOrbSpr._eeWorldX;
      if (Number.isFinite(_worldX) && (_worldX < _minVisibleX || _worldX > _maxVisibleX)) continue;
      const _orbBase = Number(_0xOrbSpr._eeBaseScale) > 0 ? Number(_0xOrbSpr._eeBaseScale) : 0.75;
      const _baseScale = Math.min(_maxaudioScale, _orbBase * _pulseMult);
      let _targetScale = _baseScale;
      if (_0xOrbSpr._hitTime) {
        const _elapsed = _now - _0xOrbSpr._hitTime;
        if (_elapsed < 80) {
          const _t = _elapsed / 80;
          _targetScale = _baseScale + (_baseScale * (_clickMult - 1)) * _t;
        } else if (_elapsed < 80 + _shrinkMs) {
          const _t = (_elapsed - 80) / _shrinkMs;
          const _peak = _baseScale * _clickMult;
          _targetScale = _peak + (_baseScale - _peak) * _t;
        } else {
          _0xOrbSpr._hitTime = null;
        }
      }
      if (_0xOrbSpr._eeLastOrbScale !== _targetScale) {
        _0xOrbSpr.setScale(_targetScale);
        _0xOrbSpr._eeLastOrbScale = _targetScale;
      }
    }
  }
  resetVisibility() {
    this._visMinSec = -1;
    this._visMaxSec = -1;
  }
  _setRodframe(attemptNumber = 1) {
    const frames = ["rod_ball_01_001.png", "rod_ball_02_001.png", "rod_ball_03_001.png"];
    const frameName = frames[Math.floor(Math.random() * frames.length)];

    for (const spriteList of this.objectSprites || []) {
      if (!Array.isArray(spriteList)) continue;
      for (const sprite of spriteList) {
        if (!sprite || !sprite._rodballchild || sprite._Rodobjectid === undefined) continue;
        const frameInfo = typeof getAtlasFrame === "function" ? getAtlasFrame(this._scene, frameName) : null;
        if (frameInfo) {
          sprite.setTexture(frameInfo.atlas, frameInfo.frame);
        } else if (this._scene?.textures?.exists?.(frameName)) {
          sprite.setTexture(frameName);
        } else {
          continue;
        }
        sprite._rodcurrentframe = frameName;
      }
    }
  }
  resetObjects() {
    this._resetremovedobjects();
    for (let _0x3d473e of this.objects) {
      if (!_0x3d473e) {
        continue;
      }
      _0x3d473e.activated = false;
      if (_0x3d473e._activatedByPlayer) {
        delete _0x3d473e._activatedByPlayer;
      }
      if (_0x3d473e._dashHoldTicks !== undefined) {
        _0x3d473e._dashHoldTicks = 0;
      }
      if (_0x3d473e._dashHoldTicksByPlayer) {
        delete _0x3d473e._dashHoldTicksByPlayer;
      }
      if (_0x3d473e.secretCoinId !== undefined) {
        _0x3d473e.activated = false;
      }
      if (_0x3d473e.userCoinId !== undefined) {
        _0x3d473e.activated = false;
      }
      if (_0x3d473e._padParticleEmitter) {
        if (typeof _0x3d473e._padParticleEmitter.start === "function") {
          _0x3d473e._padParticleEmitter.start();
        }
      }
    }
    this._secretCoinRunCollected.clear();
    this._userCoinRunCollected.clear();
    for (const staticSpr of (this.objectSprites || []).flat()) {
      if (staticSpr && staticSpr._beastStaticHidden) {
        staticSpr.setVisible(false);
      }
    }
    for (let _0x5c5d9a of this._audioScaleSprites) {
      gdApplyEffectScale(_0x5c5d9a, 0.1);
    }
        for (const objectSpriteList of this.objectSprites || []) {
      if (!objectSpriteList) continue;
      for (const sprite of objectSpriteList) {
        if (sprite && sprite._isPortalGuide && sprite._portalOriginalFrame) {
          const originalFrameInfo = getAtlasFrame(this._scene, sprite._portalOriginalFrame);
          if (originalFrameInfo) {
            sprite.setTexture(originalFrameInfo.atlas, originalFrameInfo.frame);
          }
          sprite._portalGuideActive = false;
        }
      }
    }
    for (let _cs of this._coinSprites) {
      if (_cs) {
        this._scene?.tweens?.killTweensOf(_cs);
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