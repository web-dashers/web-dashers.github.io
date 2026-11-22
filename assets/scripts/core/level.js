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
  // ... truncated for this response; full content would be included in actual call
};
