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

function parseObject(objectString) {
  let objectParts = objectString.split(",");
  let objectData = {};
  for (let index = 0; index + 1 < objectParts.length; index += 2) {
    let key = objectParts[index];
    let value = objectParts[index + 1];
    objectData[key] = value;
  }
  let objectId = parseInt(objectData[1] || "0", 10);
  const rawGroupValues = [];
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
      editorLayer: parseInt(objectData[20] || "0", 10),
      zLayer: parseInt(objectData[24] || "0", 10),
      zOrder: parseInt(objectData[25] || "0", 10),
      editorLayer2: parseInt(objectData[61] || "0", 10),
      groups: groupString,
      color1: parseInt(objectData[21] || "0", 10),
      color2: parseInt(objectData[22] || "0", 10),
      text: _decodeTextObjectString(objectData[31] ?? objectData["31"] ?? ""),
      // Following are for startpos
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
    this._touchColorTriggerActivated = new Set();
    this._touchSpawnTriggerActivated = new Set();
    this._touchMoveTriggerActivated = new Set();
    this._audioScaleSprites = [];
    this._editorTriggerVisuals = [];
    this._orbSprites = [];
    this._coinSprites = [];
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
    this._pulseTriggers = [];
    this._pulseTriggerIdx = 0;
    this._activePulses = [];
    this._spawnTriggers = [];
    this._spawnTriggerIdx = 0;
    this._activeSpawnDelays = [];
    this._colorChannelSprites = {};
    this._ground2Tint = 0xffffff;
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
    this._debugIdTextsList = [];
    this._buildGround();
  }
  getStartPositions() {
      return this._startPositions.slice().sort((a, b) => a.x - b.x);
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
    levelObjects = this._normalizeTeleportPortals(levelObjects);
    this._sourceLevelObjects = levelObjects;
    this._spawnLevelObjects(levelObjects);
    this._setUpSettings(settingslist);
    window.levelObjects = levelObjects;
    window.settingslist = settingslist;
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
      newCeilingTile.setOrigin(0, 1).setFlipY(true).setTint(((newCeilingTile = this._groundTiles[0]) == null ? undefined : newCeilingTile.tintTopLeft) || 17578).setDepth(20).setVisible(false);
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
      const ground2Tile = this._ground2Tiles?.[i];
      if (ground2Tile) {
        ground2Tile.x = tileScreenX;
        ground2Tile.y = leftTileIndex;
        ground2Tile.setVisible(hasGround2);
      }
      ceilingTile.x = tileScreenX;
      ceilingTile.y = rightTileIndex;
      const ceilingVisibleForTile = this._flyGroundActive && this._groundTargetValue > 0 || ceilingActive;
      ceilingTile.setVisible(ceilingVisibleForTile);
      const ceiling2Tile = this._ceiling2Tiles?.[i];
      if (ceiling2Tile) {
        ceiling2Tile.x = tileScreenX;
        ceiling2Tile.y = rightTileIndex;
        ceiling2Tile.setVisible(hasGround2 && ceilingVisibleForTile);
      }
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
      if (this._ground2Tiles?.[i]) this._ground2Tiles[i]._worldX += shiftAmount;
      if (this._ceiling2Tiles?.[i]) this._ceiling2Tiles[i]._worldX += shiftAmount;
    }
    this._maxGroundWorldX += shiftAmount;
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
    if (objectData.flipX) {
      sprite.setFlipX(true);
      offsetX = -offsetX;
    }
    if (objectData.flipY) {
      sprite.setFlipY(true);
      offsetY = -offsetY;
    }
    let totalRotation = (sprite.getData("gjBaseRotationDeg") || 0) + objectData.rot;
    if (totalRotation !== 0) {
      sprite.setAngle(totalRotation);
      let rad = totalRotation * Math.PI / 180;
      let cosR = Math.cos(rad);
      let sinR = Math.sin(rad);
      let rx = offsetX * cosR - offsetY * sinR;
      let ry = offsetX * sinR + offsetY * cosR;
      offsetX = rx;
      offsetY = ry;
    }
    sprite.x += offsetX;
    sprite.y += offsetY;
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
  _getGlowFrameName(frameName, objectData = null) {
    if (objectData && objectData.glow_frame && objectData.glow_frame !== "none") {
      return objectData.glow_frame;
    } else if (frameName && frameName.endsWith("_001.png")) {
      return frameName.replace("_001.png", "_glow_001.png");
    } else {
      return null;
    }
  }
  _isGlowVisible = () => {
      return window.showGlow !== false && (!window.isEditor || window.showEditorGlow);
  };
  _getGlowAlphaMultiplier = () => {
      return window.glowOpacity !== undefined ? window.glowOpacity : 0.5;
  };
  _updateGlowVisibility = () => {
      if (!this._glowSprites) return;
      const glowVisible = this._isGlowVisible();
      for (const glow of this._glowSprites) {
          glow.setVisible(glowVisible);
      }
  };
  _addGlowSprite(scene, x, y, frameName, objectData, worldX, colorData = null) {
    let glowFrameName = this._getGlowFrameName(frameName, objectData);
    if (!glowFrameName || glowFrameName === frameName) {
      return;
    }
    if (!getAtlasFrame(scene, glowFrameName) && !scene.textures.exists(glowFrameName)) {
      return;
    }
    const glowKey = `${worldX ?? x}:${y}:${glowFrameName}`;
    if (this._glowSpriteKeys.has(glowKey)) {
      return;
    }
    this._glowSpriteKeys.add(glowKey);
    let glowSprite = addImageToScene(scene, x, y, glowFrameName);
    if (glowSprite) {
      this._applyVisualProps(scene, glowSprite, glowFrameName, objectData);
      if (colorData?.tint !== undefined) {
        glowSprite.setTint(colorData.tint);
      } else if (colorData?.black) {
        glowSprite.setTint(0);
      }
      glowSprite.setBlendMode(Phaser.BlendModes.ADD);
      glowSprite.setAlpha(this._getGlowAlphaMultiplier());
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

    const scale = Number.isFinite(Number(levelObj.scale)) ? Number(levelObj.scale) : 1;
    textSprite.setScale(scale * (levelObj.flipX ? -1 : 1), scale * (levelObj.flipY ? -1 : 1));
    textSprite.setAngle(levelObj.rot || 0);

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
        duration: parseFloat(_raw[10] ?? 0),
        targetGroup: parseInt(_raw[51] ?? 0, 10),
        targetOpacity: Math.max(0, Math.min(1, parseFloat(_raw[35] ?? 1)))
      });
    }

    if ([105, 744, 899, 900, 915].includes(levelObj.id)) {
      const _raw = levelObj._raw;
      const targetChannel = parseInt(_raw[23] ?? 0, 10);
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
          opacity: parseFloat(_raw[35] ?? 1)
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
        fadeOut: parseFloat(_raw[47] ?? 0)
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

  const registerObjectSprite = (spr) => {
    if (!spr) return;
    spr._eeObjectId = linkedObjectId;
    spr._eeEditorLayer = parseInt(levelObj.editorLayer ?? levelObj._raw?.[20] ?? levelObj._raw?.["20"] ?? 0, 10) || 0;
    spr._eeEditorLayer2 = parseInt(levelObj.editorLayer2 ?? levelObj._raw?.[61] ?? levelObj._raw?.["61"] ?? 0, 10) || 0;
    if (!this.objectSprites[linkedObjectId]) this.objectSprites[linkedObjectId] = [];
    this.objectSprites[linkedObjectId].push(spr);
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
    if (col1 === 0 && (objectDef.type === solidType || objectDef.type === hazardType)) col1 = 1;

    const col2 = levelObj.color2 || (objectDef.default_detail_color_channel !== undefined ? objectDef.default_detail_color_channel : -1);
    const canColor = objectDef.can_color !== false;

    const registerColor = (spr, ch) => {
      if (ch > 0 && canColor && spr && !spr._isSaw) {
        spr._eeColorChannel = ch;
        if (!this._colorChannelSprites[ch]) this._colorChannelSprites[ch] = [];
        this._colorChannelSprites[ch].push(spr);
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
    if (objectDef.glow) {
      orbGlow = this._addGlowSprite(scene, spriteWorldX, baseY, frameName, levelObj, worldX);
      if (orbGlow) {
        orbGlow._eeZDepth = objZDepth - 0.003;
        orbGlow._eeOrigAlpha = 1;
        registerColor(orbGlow, col1);
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
      sprite._eeOrigAlpha = 1;
      registerColor(sprite, col1);
      this._addToSection(sprite);
      registerObjectSprite(sprite);

      if (objGids && objGids.length) {
        sprite._eeGroups = objGids;
        registerToGroups(sprite, sprite._eeWorldX, sprite._eeBaseY);
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
        sprite._orbId = levelObj.id;
        this._orbSprites.push(sprite);
        if (frameName.indexOf("dropRing") >= 0 || frameName.indexOf("gravJumpRing") >= 0) {
          sprite._isSaw = true;
          this._sawSprites.push(sprite);
        }

        if (orbGlow) {
          orbGlow.setScale(0.75);
          orbGlow._eeAudioScale = true;
          orbGlow._orbId = levelObj.id;
          this._orbSprites.push(orbGlow);
        }
      }

      if (objectDef && objectDef.type === coinType) {
        sprite._coinWorldX = worldX;
        sprite._coinWorldY = worldY;
        sprite._coinBaseScale = sprite.scaleX || 1;
        this._coinSprites.push(sprite);
      }

      if (frameName.indexOf("sawblade") >= 0) {
        sprite.setTint(0x000000);
        sprite._isSaw = true;
        this._sawSprites.push(sprite);

        const sawMirror = addImageToScene(scene, spriteWorldX, baseY, frameName);
        if (sawMirror) {
          this._applyVisualProps(scene, sawMirror, frameName, levelObj, objectDef);
          sawMirror.setTint(0x000000);
          sawMirror.rotation = sprite.rotation + Math.PI;
          sawMirror._isSaw = true;
          sawMirror._eeWorldX = worldX;
          sawMirror._eeBaseY = baseY;
          this._addToSection(sawMirror);
          this._addVisualSprite(sawMirror);
          this._sawSprites.push(sawMirror);
          registerToGroups(sawMirror, worldX, baseY);
          registerObjectSprite(sawMirror);
        }
      }
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
      for (const childDef of objectDef.children) {
        let childDx = childDef.dx || 0;
        let childDy = childDef.dy || 0;

        if (childDef.localDx !== undefined || childDef.localDy !== undefined) {
          let localDx = childDef.localDx || 0;
          let localDy = childDef.localDy || 0;

          if (levelObj.flipX) {
            localDx = -localDx;
          }
          if (levelObj.flipY) {
            localDy = -localDy;
          }

          const rot = (levelObj.rot || 0) * Math.PI / 180;
          childDx = localDx * Math.cos(rot) - localDy * Math.sin(rot);
          childDy = localDx * Math.sin(rot) + localDy * Math.cos(rot);
        }

        const childWorldX = worldX + childDx;
        const childBaseY = baseY + childDy;
        const childSprite = addImageToScene(scene, spriteWorldX + childDx, baseY + childDy, childDef.frame);

        if (childSprite) {
          const childObjectData = (childDef.frame === "portal_01_extra_2_001.png" || childDef.frame === "portal_02_extra_2_001.png")
            ? { ...levelObj, rot: 0 }
            : levelObj;
          this._applyVisualProps(scene, childSprite, childDef.frame, childObjectData, childDef);
          const showguide = childDef.portalGuide ? (window.enablePortalGuide !== false) : true;
          const showguide2 = childDef.orbGuide ? (window.enableOrbGuide !== false) : true;
          childSprite.setVisible(showguide && showguide2);
          if (childDef.portalGuide) childSprite._eePortalGuide = true;
          if (childDef.orbGuide) childSprite._eeOrbGuide = true;

          if (childDef.audioScale) {
            childSprite.setScale(0.1);
            childSprite.setAlpha(0.9);
            childSprite._eeAudioScale = true;
            this._audioScaleSprites.push(childSprite);
          }

           const bortalstuff = childDef.portalGuide ? { ...childDef, _portalFront: true } : childDef;
          if ((childDef.z !== undefined ? childDef.z : -1) < 0) {
            childSprite._eeLayer = 1;
            childSprite._eeBehindParent = true;
          } else {
            this._addVisualSprite(childSprite, bortalstuff);
          }

          childSprite._eeWorldX = childWorldX;
          childSprite._eeBaseY = childBaseY;
          const guidelayer = childDef.portalGuide ? 0 : ((childDef.z !== undefined ? childDef.z : -1));
          childSprite._eeZDepth = objZDepth + guidelayer;
          childSprite._eeOrigAlpha = 1;
          registerColor(childSprite, col1);
          this._addToSection(childSprite);
          registerToGroups(childSprite, childWorldX, childBaseY);
          registerObjectSprite(childSprite);

          if (objectDef && objectDef.type === ringType && childDef.orbGuide) {
            childSprite.setScale(0.75);
            childSprite._orbId = levelObj.id;
            this._orbSprites.push(childSprite);
          }

          if (frameName.indexOf("sawblade") >= 0) {
            childSprite.setTint(0x000000);
            childSprite._isSaw = true;
            this._sawSprites.push(childSprite);

            const childMirror = addImageToScene(scene, spriteWorldX + childDx, baseY + childDy, childDef.frame);
            if (childMirror) {
              this._applyVisualProps(scene, childMirror, childDef.frame, levelObj, childDef);
              childMirror.setTint(0x000000);
              childMirror.rotation = childSprite.rotation + Math.PI;
              childMirror._isSaw = true;
              childMirror._eeWorldX = childWorldX;
              childMirror._eeBaseY = childBaseY;
              this._addToSection(childMirror);
              this._sawSprites.push(childMirror);
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
  }

  if (objectDef && objectDef.portalParticle && frameName && !window.isEditor && !scene?._editorPlaytestActive) {
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

    if (objectDef.type === solidType && objectDef.gridW > 0 && objectDef.gridH > 0) {
      const w = objectDef.gridW * a;
      const h = objectDef.gridH * a;
      const collider = new Collider(solidType, worldX, worldY, w, h, levelObj.rot || 0);
      collider.objid = levelObj.id;
      registerCollider(collider);
      this.objects.push(collider);
      hasCollisionEntry = true;
      this._addCollisionToSection(collider);
    } else if (objectDef.type === hazardType) {
      let hitW = 0;
      let hitH = 0;

      if (
        objectDef.spriteW > 0 &&
        objectDef.spriteH > 0 &&
        objectDef.hitboxScaleX !== undefined &&
        objectDef.hitboxScaleY !== undefined
      ) {
        hitW = objectDef.spriteW * objectDef.hitboxScaleX * 2;
        hitH = objectDef.spriteH * objectDef.hitboxScaleY * 2;
      } else if (objectDef.gridW > 0 && objectDef.gridH > 0) {
        hitW = objectDef.gridW * 12;
        hitH = objectDef.gridH * 24;
      }

      const hasHitboxRadius = objectDef.hitbox_radius !== undefined && objectDef.hitbox_radius !== null;
      const worldHitboxRadius = hasHitboxRadius ? objectDef.hitbox_radius * 2 : 0;

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
      const portalW = objectDef.gridW * a;
      const portalH = objectDef.gridH * a;
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
        const hitboxShift = isTeleportPortal ? -30 : 0;
        const colliderX = worldX - Math.cos(portalRotRad) * hitboxShift;
        const colliderY = worldY + Math.sin(portalRotRad) * hitboxShift;
        const collider = new Collider(portalColliderType, colliderX, colliderY, portalW, portalH, portalRot);
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
      const padW = objectDef.gridW * a;
      const padH = objectDef.gridH * a;
      const padObj = new Collider(jumpPadType, worldX, worldY, padW, padH, levelObj.rot || 0);
      padObj.padId = levelObj.id;
      registerCollider(padObj);
      this.objects.push(padObj);
      hasCollisionEntry = true;
      this._addCollisionToSection(padObj);
    } else if (objectDef.type === ringType) {
      const orbW = objectDef.gridW * a;
      const orbH = objectDef.gridH * a;
      const orbObj = new Collider(jumpRingType, worldX, worldY, orbW, orbH, levelObj.rot || 0);
      orbObj.orbId = levelObj.id;
      orbObj.orbRotation = levelObj.rot || 0;
      orbObj._dashHoldTicks = 0;
      registerCollider(orbObj);
      this.objects.push(orbObj);
      hasCollisionEntry = true;
      this._addCollisionToSection(orbObj);
    } else if (objectDef.type === coinType) {
      const coinW = (objectDef.gridW || 1) * a;
      const coinH = (objectDef.gridH || 1) * a;
      const coinObj = new Collider(coinType, worldX, worldY, coinW, coinH, levelObj.rot || 0);
      coinObj.coinId = levelObj.id;
      registerCollider(coinObj);
      this.objects.push(coinObj);
      hasCollisionEntry = true;
      this._addCollisionToSection(coinObj);
    } else if (objectDef.type === speedType) {
      const speedW = (objectDef.gridW || 1) * a;
      const speedH = (objectDef.gridH || 1) * a;
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
    this._lastObjectX = 0;
    this._nextObjectId = 0;

    for (const levelObj of _0x35f1ae) {
      const objectDef = this._spawnObject(levelObj);
      if (!objectDef) {
        unknownObjectIds.add(levelObj.id);
      }
    }

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
    this._pulseTriggers.sort((a, b) => a.x - b.x);

    for (let si = 0; si < this._sectionContainers.length; si++) {
      const sc = this._sectionContainers[si];
      if (sc) {
        if (sc.normal && sc.normal.list && sc.normal.list.length > 1) sc.normal.sort("depth");
        if (sc.additive && sc.additive.list && sc.additive.list.length > 1) sc.additive.sort("depth");
      }
    }

    this.endXPos = Math.max(screenWidth + 1200, this._lastObjectX + 680);

    if (window.createObjectIds) {
      const scene = this._scene;
      const worldContainer = this.container || this._container;

      if (worldContainer) {
        this._debugIdTextsList = [];

        _0x35f1ae.forEach((levelObj, index) => {
          if (!levelObj || levelObj.id === undefined) return;

          const worldX = levelObj.x * 2;
          const textY = typeof b === 'function' ? b(levelObj.y * 2) : levelObj.y * 2;

          const idText = scene.add.text(worldX, textY, String(levelObj.id), {
            fontFamily: 'monospace',
            fontSize: '30px',
            fill: '#00ff00', 
            stroke: '#000000',
            strokeThickness: 3
          });
          idText.setOrigin(0.5);
          idText.setDepth(999); 
          idText.setVisible(window.showObjectIds);

          worldContainer.add(idText);

          idText.preUpdate = () => {
            idText.x = worldX;
            idText.y = textY;
          };

          scene.sys.updateList.add(idText);
          this._debugIdTextsList.push(idText);

          if (!this.objectSprites[index]) this.objectSprites[index] = [];
          this.objectSprites[index].push(idText);
        });
      }
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
  _isTriggerSaveObjectLive(uid) {
    if (!Number.isInteger(uid) || !Array.isArray(window.levelObjects)) return true;
    return window.levelObjects.some(obj => obj && Number.isInteger(obj._eeObjectId) && obj._eeObjectId === uid);
  }

  checkColorTriggers(_0x2b00ce) {
    let _0x24b030 = [];
    while (this._colorTriggerIdx < this._colorTriggers.length) {
      let _0x39c924 = this._colorTriggers[this._colorTriggerIdx];
      if (!(_0x39c924.x <= _0x2b00ce)) {
        break;
      }
      if (this._isTriggerSaveObjectLive(_0x39c924.uid) && !_0x39c924.touchTriggered && !_0x39c924.spawnTriggered) {
        _0x24b030.push(_0x39c924);
      }
      this._colorTriggerIdx++;
    }
    return _0x24b030;
  }
  checkTouchColorTriggers(playerX, playerY) {
    const triggered = [];
    const px = Number(playerX) || 0;
    const py = Number(playerY) || 0;
    this._touchColorTriggerActivated ||= new Set();

    const playerHalfSize = (typeof playerSize === "number" ? playerSize : 20);
    const halfHitbox = 30 + playerHalfSize;

    for (const trig of this._colorTriggers) {
      if (!trig || !trig.touchTriggered || trig.spawnTriggered || !this._isTriggerSaveObjectLive(trig.uid)) continue;
      const uid = trig.uid ?? `${trig.x},${trig.y},${trig.index}`;
      if (this._touchColorTriggerActivated.has(uid)) continue;
      if (Math.abs(px - trig.x) <= halfHitbox && Math.abs(py - (trig.y ?? 0)) <= halfHitbox) {
        this._touchColorTriggerActivated.add(uid);
        triggered.push(trig);
      }
    }

    return triggered;
  }
  resetColorTriggers() {
    this._colorTriggerIdx = 0;
    this._touchColorTriggerActivated = new Set();
  }
  _getSectionIndexForWorldX(worldX) {
    return Math.max(0, Math.floor((Number(worldX) || 0) / 400));
  }
  _ensureSectionContainer(sectionIndex) {
    if (!this._sectionContainers[sectionIndex]) {
      const sectionContainer = {
        additive: this._scene.add.container(0, 0),
        normal: this._scene.add.container(0, 0)
      };
      const sectionVisible = this._visMinSec === undefined || this._visMinSec < 0 || (sectionIndex >= this._visMinSec && sectionIndex <= this._visMaxSec);
      sectionContainer.additive.visible = sectionVisible;
      sectionContainer.normal.visible = sectionVisible;
      this.additiveContainer.add(sectionContainer.additive);
      this.container.add(sectionContainer.normal);
      this._sectionContainers[sectionIndex] = sectionContainer;
    }
    return this._sectionContainers[sectionIndex];
  }
  _addToSection(sliderWidth) {
    const _0x4ac40a = this._getSectionIndexForWorldX(sliderWidth._eeWorldX);
    this._sections[_0x4ac40a] ||= [];
    this._sections[_0x4ac40a].push(sliderWidth);
    sliderWidth._eeSectionIndex = _0x4ac40a;
    if (sliderWidth._eeZDepth !== undefined) {
      sliderWidth.depth = sliderWidth._eeZDepth;
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
    const _0x141e9c = this._sectionContainers[_0x2b0fa1];
    if (_0x141e9c) {
      _0x141e9c.additive.visible = _0x488507;
      _0x141e9c.normal.visible = _0x488507;
    }
  }
  updateVisibility(_0xa5f1e1) {
    this.updateTriggerEditorVisuals();
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
  updateObjectDebugIds() {
    if (window.showObjectIds) {
      if (this._debugIdTextsList && this._debugIdTextsList.length > 0) {
        for (const idText of this._debugIdTextsList) {
          if (idText) idText.setVisible(true);
        }
      }
    } else {
      if (this._debugIdTextsList && this._debugIdTextsList.length > 0 ) {
        for (const idText of this._debugIdTextsList) {
          if (idText) idText.setVisible(false);
        }
      }
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


  _getUniqueGroupSprites(groupId) {
    const sprites = this._groupSprites?.[groupId];
    if (!sprites || !sprites.length) return [];
    return [...new Set(sprites)].filter(spr => spr && spr.active);
  }

  _getUniqueGroupColliders(groupId) {
    const colliders = this._groupColliders?.[groupId];
    if (!colliders || !colliders.length) return [];
    return [...new Set(colliders)].filter(Boolean);
  }

  _getObjectGroupIds(obj) {
    const groups = Array.isArray(obj?._eeGroups) ? obj._eeGroups : [];
    return [...new Set(groups.map(gid => parseInt(gid, 10)).filter(gid => Number.isFinite(gid) && gid > 0))];
  }

  _getCombinedGroupOffset(obj) {
    const result = { x: 0, y: 0 };
    for (const gid of this._getObjectGroupIds(obj)) {
      const off = this._groupOffsets?.[gid];
      if (!off) continue;
      result.x += Number(off.x) || 0;
      result.y += Number(off.y) || 0;
    }
    return result;
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
    if (!spr || !spr.active) return;
    this._ensureSpriteMoveBase(spr);
    const off = this._getCombinedGroupOffset(spr);
    spr.x = spr._eeMoveBaseWorldX + off.x;
    spr.y = spr._eeMoveBaseBaseY + off.y;
    spr._eeWorldX = spr.x;
    spr._eeBaseY = spr.y;
    this._refreshSpriteSection(spr);
    if (spr._coinWorldX !== undefined) {
      spr._coinWorldX = spr.x / 2;
    }
    if (spr._coinWorldY !== undefined) {
      spr._coinWorldY = (460 - spr.y) / 2;
    }
  }

  _syncSpriteMoveBaseFromCurrent(spr) {
    if (!spr || !spr.active) return;
    const off = this._getCombinedGroupOffset(spr);
    const wx = spr._eeWorldX !== undefined ? spr._eeWorldX : spr.x;
    const wy = spr._eeBaseY !== undefined ? spr._eeBaseY : spr.y;
    spr._eeMoveBaseWorldX = wx - off.x;
    spr._eeMoveBaseBaseY = wy - off.y;
    spr._origWorldX = spr._eeMoveBaseWorldX;
    spr._origBaseY = spr._eeMoveBaseBaseY;
  }

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
    if (!col) return;
    this._ensureColliderMoveBase(col);
    const off = this._getCombinedGroupOffset(col);
    col.x = col._eeMoveBaseX + off.x;
    col.y = col._eeMoveBaseY - off.y;
    col._baseX = col.x;
    col._baseY = col.y;
    this._refreshCollisionSection(col);
  }

  _syncColliderMoveBaseFromCurrent(col) {
    if (!col) return;
    const off = this._getCombinedGroupOffset(col);
    col._eeMoveBaseX = col.x - off.x;
    col._eeMoveBaseY = col.y + off.y;
    col._origBaseX = col._eeMoveBaseX;
    col._origBaseY = col._eeMoveBaseY;
  }

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

      const sprites = this._getUniqueGroupSprites(trig.targetGroup);
      const colliders = this._getUniqueGroupColliders(trig.targetGroup);
      for (const spr of sprites) {
        this._applyGroupedSpriteMoveOffset(spr);
      }
      for (const col of colliders) {
        this._applyGroupedColliderMoveOffset(col);
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
    this._touchMoveTriggerActivated = new Set();
    this._groupOffsets = {};

    const seenSprites = new Set();
    for (const gid in this._groupSprites) {
      for (const spr of this._groupSprites[gid]) {
        if (!spr || !spr.active || seenSprites.has(spr)) continue;
        seenSprites.add(spr);
        const baseX = spr._eeInitialWorldX !== undefined ? spr._eeInitialWorldX : (spr._origWorldX ?? spr.x);
        const baseY = spr._eeInitialBaseY !== undefined ? spr._eeInitialBaseY : (spr._origBaseY ?? spr.y);
        spr._eeMoveBaseWorldX = baseX;
        spr._eeMoveBaseBaseY = baseY;
        spr._origWorldX = baseX;
        spr._origBaseY = baseY;
        spr.x = baseX;
        spr.y = baseY;
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
    if (!trig || !this._isTriggerSaveObjectLive(trig.uid)) return;
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
      .filter(trig => trig && trig.spawnTriggered && this._triggerHasGroup(trig, targetGroup) && this._isTriggerSaveObjectLive(trig.uid));

    for (const trig of spawnMatches(this._colorTriggers)) {
      if (colorManager && typeof colorManager.triggerColor === "function") {
        colorManager.triggerColor(trig.index, trig.color, trig.duration);
      }
    }
    for (const trig of spawnMatches(this._enterEffectTriggers)) {
      this._activeEnterEffect = trig.effect;
      this._activeExitEffect = trig.effect;
    }
    for (const trig of spawnMatches(this._moveTriggers)) this._startMoveTriggerTween(trig);
    for (const trig of spawnMatches(this._alphaTriggers)) this._startAlphaTriggerTween(trig);
    for (const trig of spawnMatches(this._rotateTriggers)) this._startRotateTriggerTween(trig);
    for (const trig of spawnMatches(this._pulseTriggers)) this._startPulseTrigger(trig);
    for (const trig of spawnMatches(this._spawnTriggers)) this._queueSpawnTrigger(trig);
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
      if (i >= this._activeSpawnDelays.length && this._activeSpawnDelays.some(pending => pending && pending.delay <= pending.elapsed)) {
        i = 0;
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
      if (!trig.spawnTriggered) this._startAlphaTriggerTween(trig);
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
        spr.setAlpha(spr._eeIsGlowSprite ? op * this._getGlowAlphaMultiplier() : op);
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
        spr.setAlpha(spr._eeIsGlowSprite ? this._getGlowAlphaMultiplier() : 1);
        spr._eeOrigAlpha = 1;
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
      const sprites = this._getUniqueGroupSprites(trig.targetGroup);
      const colliders = this._getUniqueGroupColliders(trig.targetGroup);
      if (trig.centerGroup > 0) {
        const centerSprites = this._getUniqueGroupSprites(trig.centerGroup);
        if (centerSprites && centerSprites.length > 0) {
          let cx = 0, cy = 0, cn = 0;
          for (const cs of centerSprites) {
            if (!cs || !cs.active) continue;
            cx += cs._eeWorldX !== undefined ? cs._eeWorldX : cs.x;
            cy += cs._eeBaseY !== undefined ? cs._eeBaseY : cs.y;
            cn++;
          }
          if (cn > 0) {
            cx /= cn; cy /= cn;
            const cosD = Math.cos(deltaRot), sinD = Math.sin(deltaRot);
            if (sprites) {
              for (const spr of sprites) {
                if (!spr || !spr.active) continue;
                const bx = spr._eeWorldX !== undefined ? spr._eeWorldX : spr.x;
                const by = spr._eeBaseY !== undefined ? spr._eeBaseY : spr.y;
                const dx = bx - cx, dy = by - cy;
                spr._eeWorldX = cx + dx * cosD - dy * sinD;
                spr._eeBaseY = cy + dx * sinD + dy * cosD;
                spr.x = spr._eeWorldX;
                spr.y = spr._eeBaseY;
                this._syncSpriteMoveBaseFromCurrent(spr);
                if (!trig.lockRotation) spr.rotation += deltaRot;
                this._refreshSpriteSection(spr);
              }
            }
            if (colliders) {
              for (const col of colliders) {
                this._applyRotateTriggerColliderDelta(col, deltaRot, cx, cy, !!trig.lockRotation);
              }
            }
          }
        }
      } else {
        if (sprites && !trig.lockRotation) {
          for (const spr of sprites) {
            if (!spr || !spr.active) continue;
            spr.rotation += deltaRot;
          }
        }
        if (colliders) {
          for (const col of colliders) {
            this._applyRotateTriggerColliderDelta(col, deltaRot, null, null, !!trig.lockRotation);
          }
        }
      }
      if (progress >= 1) { 
        this._activeRotateTweens.splice(i, 1); 
      } else { 
        i++; 
      }
    }
  }

  resetRotateTriggers() {
    this._rotateTriggerIdx = 0;
    this._activeRotateTweens = [];
    const seenSprites = new Set();
    for (const gid in this._groupSprites) {
      for (const spr of this._groupSprites[gid]) {
        if (!spr || !spr.active || seenSprites.has(spr)) continue;
        seenSprites.add(spr);
        if (spr._eeInitialWorldX !== undefined) {
          spr.x = spr._eeInitialWorldX;
          spr._eeWorldX = spr._eeInitialWorldX;
          spr._origWorldX = spr._eeInitialWorldX;
          spr._eeMoveBaseWorldX = spr._eeInitialWorldX;
        }
        if (spr._eeInitialBaseY !== undefined) {
          spr.y = spr._eeInitialBaseY;
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
    while (this._pulseTriggerIdx < this._pulseTriggers.length) {
      const trig = this._pulseTriggers[this._pulseTriggerIdx];
      if (trig.x > playerX) break;
      if (!trig.spawnTriggered) this._startPulseTrigger(trig);
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
          const showtheportalthing = !visMinSection._eePortalGuide || (window.enablePortalGuide !== false);
          const showtheorbthing = !visMinSection._eeOrbGuide || (window.enableOrbGuide !== false);
          visMinSection.visible = showtheportalthing && showtheorbthing;
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
    let op = 1;
    if (groups && groups.length) {
      for (const gid of groups) {
        const g = this._groupOpacity[gid];
        if (g !== undefined && g < op) op = g;
      }
    }
    if (spr && spr._eeIsGlowSprite) {
      op *= this._getGlowAlphaMultiplier();
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
    if (window.isEditor) return; // not dealing with ts rn
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
    }
    for (let _0x5c5d9a of this._audioScaleSprites) {
      _0x5c5d9a.setScale(0.1);
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
