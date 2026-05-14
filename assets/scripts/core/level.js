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
  return {
    settings: settings,
    objects: objects
  };
}

function getGroundTextureId(groundSetting) {
  const parsedGroundId = parseInt(String(groundSetting ?? "0"), 10);
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
    window._backgroundId = settingsMap["kA6"] ? settingsMap["kA6"] : "01";
    if (window._backgroundId.length < 2) {
      window._backgroundId = "0"+window._backgroundId;
    }
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
    const scene = this._scene;
    window._groundId = window._groundId ? window._groundId : "00";
    
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
    if (!getAtlasFrame(scene, glowFrameName) && !scene.textures.exists(glowFrameName)) {
      return;
    }
    let glowSprite = addImageToScene(scene, x, y, glowFrameName);
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
          let backSprite = addImageToScene(scene, spriteWorldX, baseY, _0x32e8a1);
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
        let sprite = addImageToScene(scene, spriteWorldX, baseY, frameName);
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
            sprite._orbId = levelObj.id;
            this._orbSprites.push(sprite);
            if (_0xOrbGlow) {
              _0xOrbGlow.setScale(0.75);
              _0xOrbGlow._eeAudioScale = true;
              _0xOrbGlow._orbId = levelObj.id;
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
            let _sawMirror = addImageToScene(scene, spriteWorldX, baseY, frameName);
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
        }
        if (objectDef && (objectDef.type === solidType || objectDef.type === hazardType)) {
          let _0x47077e = frameName.replace("_001.png", "_2_001.png");
          let overlaySprite = getAtlasFrame(scene, _0x47077e) ? addImageToScene(scene, spriteWorldX, baseY, _0x47077e) : null;
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
            let childSprite = addImageToScene(scene, spriteWorldX + _0x3b4e8c, baseY + _0x172131, childDef.frame);
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
                let _childMirror = addImageToScene(scene, spriteWorldX + _0x3b4e8c, baseY + _0x172131, childDef.frame);
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
          }
          if (!_0x25452a) {
          }
          if (_0x25452a) {
            let _0x4bd7bc = new Collider(_0x25452a, worldX, worldY, _0xad0974, _0x2c2226, levelObj.rot || 0);
            _0x4bd7bc.portalY = worldY;
            _registerCollider(_0x4bd7bc);
            this.objects.push(_0x4bd7bc);
            this._addCollisionToSection(_0x4bd7bc);
          } else {
          }
        } else if (objectDef.type === padType) {
          let padW = objectDef.gridW * a;
          let padH = objectDef.gridH * a;
          let padObj = new Collider(jumpPadType, worldX, worldY, padW, padH, levelObj.rot || 0);
          padObj.padId = levelObj.id;
          _registerCollider(padObj);
          this.objects.push(padObj);
          this._addCollisionToSection(padObj);
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
        }
      }
    }
    _0x443c50.size;
    if (_0x443c50.size > 0) {
    }
    let colTypeCounts = {};
    for (let obj of this.objects) {
      colTypeCounts[obj.type] = (colTypeCounts[obj.type] || 0) + 1;
    }
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
      if (_0x3d473e._dashHoldTicks !== undefined) {
        _0x3d473e._dashHoldTicks = 0;
      }
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
