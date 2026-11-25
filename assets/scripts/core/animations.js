const BEAST_ANIM_OBJECT_IDS = [918, 1327, 1328, 1584, 2012];

const BEAST_ANIM_NAME_BY_ID = {
  918: "GJBeast01",
  1327: "GJBeast02",
  1328: "GJBeast03",
  1584: "GJBeast04",
  2012: "GJBeast05"
};

const BEAST_ANIM_DEFAULT_ANIM_ID = { 918: 0, 1327: 0, 1328: 0, 1584: 0, 2012: 0 };
const BEAST_ANIM_DEFS = {
  GJBeast01: {
    defaultAnimation: "bite",
    animations: {
      bite: { delay: 0.025, frames: 16, looped: true },
      attack01: { delay: 0.025, frames: 3, looped: false },
      attack01_loop: { delay: 0.025, frames: 7, looped: true },
      attack01_end: { delay: 0.04, frames: 6, looped: false },
      idle01: { delay: 0.05, frames: 8, looped: true }
    }
  },
  GJBeast02: {
    defaultAnimation: "idle01",
    animations: {
      idle01: { delay: 0.06, frames: 9, looped: false },
      idle02: { delay: 0.06, frames: 9, looped: false }
    }
  },
  GJBeast03: {
    defaultAnimation: "idle01",
    animations: {
      idle01: { delay: 0.06, frames: 9, looped: false },
      idle02: { delay: 0.06, frames: 9, looped: false }
    }
  },
  GJBeast04: {
    defaultAnimation: "idle01",
    animations: {
      idle01: { delay: 0.06, frames: 14, looped: false },
      idle02: { delay: 0.06, frames: 14, looped: false },
      idle03: { delay: 0.06, frames: 14, looped: false },
      attack01: { delay: 0.06, frames: 9, looped: false },
      attack02: { delay: 0.06, frames: 3, looped: false },
      attack02_loop: { delay: 0.05, frames: 6, looped: true },
      attack02_end: { delay: 0.06, frames: 5, looped: false },
      sleep: { delay: 0.06, frames: 9, looped: false },
      sleep_loop: { delay: 0.05, frames: 13, looped: true },
      sleep_end: { delay: 0.06, frames: 9, looped: false }
    }
  },
  GJBeast05: {
    defaultAnimation: "idle01",
    animations: {
      idle01: { delay: 0.06, frames: 13, looped: false },
      idle02: { delay: 0.06, frames: 12, looped: false },
      idle03: { delay: 0.06, frames: 9, looped: false },
      toAttack01: { delay: 0.045, frames: 8, looped: false },
      attack01: { delay: 0.06, frames: 13, looped: true },
      attack02: { delay: 0.06, frames: 13, looped: false },
      toAttack03: { delay: 0.045, frames: 8, looped: false },
      attack03: { delay: 0.04, frames: 4, looped: true },
      fromAttack03: { delay: 0.05, frames: 9, looped: false }
    }
  }
};

const BEAST_ANIM_NAMES_BY_ID = {
  918: ["bite", "attack01", "attack01_end", "idle01", "attack01_loop"],
  1584: ["idle01", "idle02", "idle03", "attack01", "attack02", "attack02_end", "sleep", "sleep_loop", "sleep_end", "attack02_loop"],
  2012: ["idle01", "idle02", "toAttack01", "attack01", "attack02", "toAttack03", "attack03", "idle03", "fromAttack03"]
};

const BEAST_ANIM_EYES = {
  918: { frame: "GJBeast01_03_001.png", parent: "GJBeast01_01_001.png" }
};

const BEAST_ANIM_SECONDARY_TAGS = {
  1327: [0],
  1328: [0],
  1584: [0],
  2012: [1, 2]
};

const BEAST_ANIM_30FPS_DELAY = 1 / 30;

const BEAST_ANIM_UNIT_SCALE = 2;

const BEAST_ANIM_TWEEN_TIME = 0.15;

const BEAST_ANIM_START_DELAY_MAX = 0.4;

function beastAnimAnimDef(animName, base) {
  const defs = BEAST_ANIM_DEFS[animName];
  return (defs && defs.animations && defs.animations[base]) || null;
}

function beastAnimDelay(state) {
  const def = beastAnimAnimDef(state.animName, state.base);
  return def && Number.isFinite(def.delay) && def.delay > 0 ? def.delay : BEAST_ANIM_30FPS_DELAY;
}

function beastAnimFrameCount(state) {
  const def = beastAnimAnimDef(state.animName, state.base);
  const group = state.desc.groups[state.animName + "_" + state.base];
  const available = group ? group.length : 0;
  if (def && Number.isFinite(def.frames) && def.frames > 0) return Math.min(def.frames, available);
  return available;
}

function beastAnimIsLoopingBase(state, base) {
  const def = beastAnimAnimDef(state.animName, base);
  if (def) return !!def.looped;
  return typeof base === "string" && /_loop$/.test(base);
}

function beastAnimRandomizeTimer(state) {
  if (!state) return;
  state.rng = Math.random();
  state.timer = state.rng * beastAnimDelay(state);
}

const beastAnimCache = {};

function beastAnimParsePair(str, defX, defY) {
  if (typeof str !== "string") return { x: defX, y: defY };
  const m = str.match(/\{\s*([^,]+)\s*,\s*([^}]+)\s*\}/);
  if (!m) return { x: defX, y: defY };
  return { x: parseFloat(m[1]) || 0, y: parseFloat(m[2]) || 0 };
}

function beastAnimReadSceneDesc(descKey) {
  try {
    const sceneRef = window.scene;
    const scene = sceneRef && sceneRef.systems && sceneRef.systems.scene ? sceneRef.systems.scene : sceneRef;
    if (scene && scene.cache && scene.cache.json) return scene.cache.json.get(descKey) || null;
  } catch (err) {}
  return null;
}

function beastAnimGetDesc(animName) {
  const key = animName;
  if (beastAnimCache[key] !== undefined) return beastAnimCache[key];
  let data = null;
  try {
    if (typeof window !== "undefined") data = window[animName + "_AnimDesc"] || null;
    if (!data) {
      data = beastAnimReadSceneDesc(animName + "_AnimDesc");
      if (data && typeof window !== "undefined") window[animName + "_AnimDesc"] = data;
    }
  } catch (err) { data = null; }
  
  if (!data || !data.animationContainer) {
    beastAnimCache[key] = null;
    return null;
  }
  const groups = {};
  const container = data.animationContainer;
  for (const frameKey of Object.keys(container)) {
    const m = frameKey.match(/^(.*?)_(\d+)\.png$/);
    if (!m) continue;
    const base = m[1];
    if (!groups[base]) groups[base] = [];
    groups[base].push(frameKey);
  }
  for (const base of Object.keys(groups)) {
    groups[base].sort((a, b) => {
      const na = parseInt((a.match(/_(\d+)\.png$/) || [0, 0])[1], 10) || 0;
      const nb = parseInt((b.match(/_(\d+)\.png$/) || [0, 0])[1], 10) || 0;
      return na - nb;
    });
  }
  const frames = {};
  for (const frameKey of Object.keys(container)) {
    const frame = container[frameKey];
    const parts = [];
    const texSet = {};
    for (const partKey of Object.keys(frame)) {
      if (!partKey.startsWith("sprite_")) continue;
      const part = frame[partKey];
      const pos = beastAnimParsePair(part.position, 0, 0);
      const sc = beastAnimParsePair(part.scale, 1, 1);
      const fl = beastAnimParsePair(part.flipped, 0, 0);
      parts.push({
        texture: part.texture,
        x: pos.x,
        y: pos.y,
        sx: sc.x * (fl.x ? -1 : 1),
        sy: sc.y * (fl.y ? -1 : 1),
        rot: (parseFloat(part.rotation || "0") || 0) * Math.PI / 180,
        z: parseFloat(part.zValue || "0") || 0
      });
      texSet[part.texture] = true;
    }
    frames[frameKey] = { parts, texSet };
  }
  const desc = { raw: data, groups, container, frames };
  beastAnimCache[key] = desc;
  return desc;
}


function beastAnimFrameExists(animName, base) {
  const desc = beastAnimGetDesc(animName);
  return !!(desc && desc.groups[animName + "_" + base] && desc.groups[animName + "_" + base].length);
}

function beastAnimResolveBase(id) {
  return BEAST_ANIM_NAME_BY_ID[id] || null;
}

function beastAnimAnimNameForCommand(id, animIdx) {
  const names = BEAST_ANIM_NAMES_BY_ID[id];
  if (names && animIdx >= 0 && animIdx < names.length) return names[animIdx];
  return null;
}

function beastAnimCreateState(objectId) {
  const animName = beastAnimResolveBase(objectId);
  if (!animName) return null;
  const desc = beastAnimGetDesc(animName);
  if (!desc) return null;
  const state = {
    objectId,
    animName,
    desc,
    animId: 0,
    base: null,
    frameIdx: 0,
    timer: 0,
    rng: Math.random()
  };
  beastAnimDefaultBase(state);
  return state;
}

function beastAnimSetBase(state, base, animId) {
  const group = state.desc.groups[state.animName + "_" + base];
  if (!group || !group.length) return false;
  state.base = base;
  state.group = group;
  state.delay = beastAnimDelay(state);
  state.total = beastAnimFrameCount(state);
  state.looped = beastAnimIsLoopingBase(state, base);
  state.frameIdx = 0;
  state.timer = 0;
  if (animId !== undefined) state.animId = animId;
  return true;
}
function beastAnimFinishAction(state) {
  const id = state.objectId;
  const rnd = Math.random();
  switch (id) {
    case 918: {
      const prev = state.base;
      if (prev === "attack01") {
        if (beastAnimFrameExists(state.animName, "attack01_loop")) {
          beastAnimSetBase(state, "attack01_loop", 4);
          beastAnimRandomizeTimer(state);
          return;
        }
        beastAnimSetBase(state, "bite", 0);
        beastAnimRandomizeTimer(state);
        return;
      }
      if (prev === "bite") return;
      beastAnimSetBase(state, "idle01", 3);
      beastAnimRandomizeTimer(state);
      return;
    }
    case 1327: {
      if (rnd <= 0.75) beastAnimSetBase(state, "idle01", 0);
      else beastAnimSetBase(state, "idle02", 0);
      beastAnimRandomizeTimer(state);
      return;
    }
    case 1328: {
      if (rnd <= 0.9) beastAnimSetBase(state, "idle01", 0);
      else beastAnimSetBase(state, "idle02", 0);
      beastAnimRandomizeTimer(state);
      return;
    }
    case 1584: {
      const prev = state.base;
      if (prev === "attack02") {
        if (beastAnimFrameExists(state.animName, "attack02_loop")) {
          beastAnimSetBase(state, "attack02_loop", 9);
          beastAnimRandomizeTimer(state);
          return;
        }
      }
      if (prev === "sleep") {
        if (beastAnimFrameExists(state.animName, "sleep_loop")) {
          beastAnimSetBase(state, "sleep_loop", 7);
          beastAnimRandomizeTimer(state);
          return;
        }
      }
      if (prev === "sleep_loop") {
        if (beastAnimFrameExists(state.animName, "sleep_end")) {
          beastAnimSetBase(state, "sleep_end", 8);
          beastAnimRandomizeTimer(state);
          return;
        }
      }
      if (prev === "sleep_end") {
        beastAnimSetBase(state, "idle01", 0);
        beastAnimRandomizeTimer(state);
        return;
      }
      if (prev === "attack02_loop" || prev === "attack02_end") {
        beastAnimSetBase(state, "idle01", 0);
        beastAnimRandomizeTimer(state);
        return;
      }
      if (prev === "attack01") {
        beastAnimSetBase(state, "idle01", 0);
        beastAnimRandomizeTimer(state);
        return;
      }
      if (rnd <= 0.75) beastAnimSetBase(state, "idle01", 0);
      else beastAnimSetBase(state, "idle02", 0);
      beastAnimRandomizeTimer(state);
      return;
    }
    case 2012: {
      const prev = state.base;
      if (prev === "toAttack03") {
        beastAnimSetBase(state, "attack03", 6);
        beastAnimRandomizeTimer(state);
        return;
      }
      if (prev === "fromAttack03" || prev === "attack02" || prev === "toAttack01") {
        beastAnimSetBase(state, "attack01", 3);
        beastAnimRandomizeTimer(state);
        return;
      }
      if (prev === "attack01" || prev === "attack03") {
          if (rnd <= 0.75) beastAnimSetBase(state, "idle01", 0);
          else beastAnimSetBase(state, "idle02", 0);
          beastAnimRandomizeTimer(state);
          return;
        }
      if (prev === "idle01") {
        if (rnd <= 0.75) beastAnimSetBase(state, "idle01", 0);
        else beastAnimSetBase(state, "idle02", 1);
        beastAnimRandomizeTimer(state);
        return;
      }
      beastAnimSetBase(state, "idle01", 0);
      beastAnimRandomizeTimer(state);
      return;
    }
  }
  beastAnimSetBase(state, "idle01", 0);
  beastAnimRandomizeTimer(state);
}

function beastAnimCommand(state, animIdx, startDelayOverride) {
  const base = beastAnimAnimNameForCommand(state.objectId, animIdx);
  if (!base || !beastAnimFrameExists(state.animName, base)) return false;
  const startDelay = Number.isFinite(startDelayOverride)
    ? Math.max(0, Math.min(startDelayOverride, BEAST_ANIM_START_DELAY_MAX))
    : Math.random() * BEAST_ANIM_START_DELAY_MAX;
  if (startDelay > 0) {
    state.pendingCommand = { base, animIdx, delay: startDelay };
    return true;
  }
  state.pendingCommand = null;
  beastAnimSetBase(state, base, animIdx);
  beastAnimRandomizeTimer(state);
  return true;
}

function beastAnimCommandMany(states, animIdx) {
  if (!Array.isArray(states) || !states.length) return;
  const n = states.length;
  for (let i = 0; i < n; i++) {
    const stagger = n > 1 ? (i + Math.random()) / n : Math.random();
    beastAnimCommand(states[i], animIdx, stagger * BEAST_ANIM_START_DELAY_MAX);
  }
}

function beastAnimDefaultBase(state) {
  state.pendingCommand = null;
  const id = state.objectId;
  const defs = BEAST_ANIM_DEFS[state.animName];
  const defaultAnim = defs && defs.defaultAnimation;
  if (defaultAnim && beastAnimSetBase(state, defaultAnim)) {
    const total = beastAnimFrameCount(state);
    if (total > 1) state.frameIdx = Math.floor(Math.random() * total);
    beastAnimRandomizeTimer(state);
    return;
  }
  const def = BEAST_ANIM_DEFAULT_ANIM_ID[id];
  if (def !== undefined) {
    const base = beastAnimAnimNameForCommand(id, def);
    if (base && beastAnimSetBase(state, base, def)) {
      beastAnimRandomizeTimer(state);
      return;
    }
  }
  beastAnimSetBase(state, "idle01", 0);
  const defGroup = state.desc.groups[state.animName + "_idle01"];
  if (defGroup && defGroup.length > 1) {
    state.frameIdx = Math.floor(Math.random() * defGroup.length);
  }
  beastAnimRandomizeTimer(state);
}

function beastAnimAdvance(state, dt) {
  if (!state || !state.base) return;
  if (state.group === undefined) beastAnimSetBase(state, state.base);
  if (!Number.isFinite(state.timer)) state.timer = 0;
  if (!Number.isFinite(state.frameIdx)) state.frameIdx = 0;
  if (!Number.isFinite(dt) || dt <= 0) return;
  if (dt > 0.1) dt = 0.1;
  if (state.pendingCommand) {
    state.pendingCommand.delay -= dt;
    if (state.pendingCommand.delay <= 0) {
      const pending = state.pendingCommand;
      state.pendingCommand = null;
      beastAnimSetBase(state, pending.base, pending.animIdx);
      beastAnimRandomizeTimer(state);
      return;
    }
  }
  state.timer += dt;
  let guard = 0;
  while (guard++ < 240) {
    const delay = state.delay;
    if (state.timer < delay) break;
    state.timer -= delay;
    state.frameIdx++;
    const total = state.total;
    if (!total) {
      beastAnimDefaultBase(state);
      break;
    }
    if (state.frameIdx >= total) {
      if (state.looped) {
        state.frameIdx = 0;
        continue;
      }
      beastAnimFinishAction(state);
      break;
    }
  }
}


const BEAST_ANIM_DESC_KEYS = Object.keys(BEAST_ANIM_DEFS);

function beastAnimPreload(scene) {
  for (const name of BEAST_ANIM_DESC_KEYS) {
    scene.load.json(name + "_AnimDesc", "assets/ui-graphics/sheets/" + name + "_AnimDesc.json");
  }
}

function beastAnimLoadDescs(scene) {
  for (const name of BEAST_ANIM_DESC_KEYS) {
    const key = name + "_AnimDesc";
    window[key] = scene.cache.json.get(key) || window[key] || null;
  }
}

function beastAnimSpawn(level, scene, levelObj, objectDef, worldX, baseY, objZDepth, col1, linkedObjectId, registerObjectSprite, registerToGroups, registerColor) {
  const objectId = parseInt(levelObj.id ?? 0, 10);
  const state = beastAnimCreateState(objectId);
  if (!state) return;
  const col2 = levelObj.color2 || (objectDef.default_detail_color_channel !== undefined ? objectDef.default_detail_color_channel : -1);
  const objScale = Number(levelObj.scale) || 1;
  const flipX = !!levelObj.flipX;
  const flipY = !!levelObj.flipY;
  const objRot = (levelObj.rot || 0) * Math.PI / 180;
  const rotCos = Math.cos(objRot);
  const rotSin = Math.sin(objRot);
  const groupMap = {};
  const detailTextures = {};
  const detailTags = BEAST_ANIM_SECONDARY_TAGS[objectId] || null;
  for (const frameKey of Object.keys(state.desc.container)) {
    const frame = state.desc.container[frameKey];
    for (const partKey of Object.keys(frame)) {
      if (!partKey.startsWith("sprite_")) continue;
      const entry = frame[partKey];
      const tex = entry.texture;
      if (!tex || !tex.endsWith(".png")) continue;
      groupMap[tex] = true;
      if (detailTags && detailTags.indexOf(Number(entry.tag)) !== -1) detailTextures[tex] = true;
    }
  }
  const eyeDef = BEAST_ANIM_EYES[objectId] || null;
  const childrenByFrame = new Map();
  for (const childDef of (objectDef.children || [])) {
    if (childDef && childDef.frame) childrenByFrame.set(childDef.frame, childDef);
  }
  const slotTextures = {};
  const slotChildDef = {};
  for (const frameKey of Object.keys(state.desc.container)) {
    const frame = state.desc.container[frameKey];
    for (const partKey of Object.keys(frame)) {
      if (!partKey.startsWith("sprite_")) continue;
      const partTex = frame[partKey].texture;
      if (!partTex || !partTex.endsWith(".png")) continue;
      if (!slotTextures[partKey]) slotTextures[partKey] = [];
      if (!slotTextures[partKey].includes(partTex)) slotTextures[partKey].push(partTex);
      const slotChild = childrenByFrame.get(partTex);
      if (slotChild && !slotChildDef[partKey]) slotChildDef[partKey] = slotChild;
    }
  }
  const detailPartDef = {};
  for (const partKey of Object.keys(slotChildDef)) {
    for (const partTex of slotTextures[partKey] || []) {
      if (!detailPartDef[partTex]) detailPartDef[partTex] = slotChildDef[partKey];
    }
  }
  const detailChannel = Number(col2) > 0 ? Number(col2) : 1011;
  let eyeSprite = null;
  const hiddenStatics = [];
  const staticSprites = level.objectSprites[linkedObjectId] || [];
  for (const staticSpr of staticSprites) {
    if (!staticSpr || staticSpr._beastPartOf) continue;
    const staticFrame = staticSpr.frame && staticSpr.frame.name;
    if (!staticFrame) continue;
    if (eyeDef && staticFrame === eyeDef.frame) {
      eyeSprite = staticSpr;
      staticSpr._beastManaged = true;
      staticSpr._eeZDepth = objZDepth + 0.009;
      staticSpr.depth = staticSpr._eeZDepth;
      continue;
    }
    const baseFrame = staticFrame.replace("_glow_001.png", "_001.png");
    if (!groupMap[staticFrame] && !groupMap[baseFrame]) continue;
    staticSpr.setVisible(false);
    staticSpr.active = false;
    staticSpr._beastStaticHidden = true;
    hiddenStatics.push(staticSpr);
  }
  const partSprites = {};
  const partGlows = {};
  const beastGlowEnabled = level._hasGlow(objectDef, levelObj);
  for (const tex of Object.keys(groupMap)) {
    const spr = addImageToScene(scene, worldX, baseY, tex);
    if (!spr) continue;
    spr.setOrigin(0.5, 0.5);
    spr.x = worldX;
    spr.y = baseY;
    spr._eeLayer = 1;
    spr._eeWorldX = worldX;
    spr._eeBaseY = baseY;
    spr._eeZDepth = objZDepth + 0.005;
    spr._eeOrigAlpha = 1;
    spr._beastPartOf = objectId;
    spr._beastManaged = true;
    const childDef = detailPartDef[tex];
    const colorDef = childDef
      ? { ...childDef, can_color: childDef.can_color ?? objectDef.can_color }
      : objectDef;
    const detailPart = detailTextures[tex] === true;
    if (!detailPart && colorDef.tint !== undefined) spr.setTint(colorDef.tint);
    const partBlackDefault = !detailPart && (colorDef.black === true || colorDef.tint === 0 || objectDef.black === true);
    if (partBlackDefault) {
      spr.setTint(0);
      spr._isBlack = true;
      spr._canColor = colorDef.can_color === true;
      spr._blackDefault = spr._canColor && !(Number(levelObj.color1) > 0);
    }
    level._addToSection(spr);
    registerColor(spr, detailPart ? detailChannel : col1);
    registerToGroups(spr, worldX, baseY);
    registerObjectSprite(spr);
    partSprites[tex] = spr;
    if (beastGlowEnabled) {
      // Mirror the part's static color (tint / black default) so the glow is colored with the part.
      const glowColorDef = detailPart ? null : colorDef;
      const glowSpr = level._addGlowSprite(scene, worldX, baseY, tex, { ...levelObj, rot: 0 }, worldX, glowColorDef, null, true);
      if (glowSpr) {
        level._syncGlowColor(glowSpr, spr);
        glowSpr._eeOrigAlpha = glowSpr.alpha;
        glowSpr._eeZDepth = objZDepth + 0.002;
        glowSpr._beastPartOf = objectId;
        glowSpr._beastManaged = true;
        registerColor(glowSpr, detailPart ? detailChannel : col1);
        registerToGroups(glowSpr, worldX, baseY);
        partGlows[tex] = glowSpr;
      }
    }
  }
  if (!Object.keys(partSprites).length) return;
  const beastRecord = {
    objectId,
    state,
    partSprites,
    anchorSprite: partSprites[Object.keys(partSprites)[0]],
    partGlows,
    hiddenStatics,
    eye: eyeSprite,
    eyeParent: eyeDef ? eyeDef.parent : null,
    worldX,
    baseY,
    scale: objScale,
    flipX,
    flipY,
    rotCos,
    rotSin
  };
  for (const tex in partSprites) partSprites[tex]._beastRecord = beastRecord;
  level._beastSprites.push(beastRecord);
  beastAnimDefaultBase(state);
}

function beastAnimUpdate(scene, deltaTime) {
  const level = scene._level;
  if (!level || !level._beastSprites || !level._beastSprites.length) return;
      const dtSec = Number.isFinite(deltaTime) ? deltaTime / 1000 : 0;
      for (const beast of level._beastSprites) {
        if (!beast || !beast.state) continue;
        if (beast.hiddenStatics) {
          for (const hiddenSpr of beast.hiddenStatics) {
            if (hiddenSpr.visible) hiddenSpr.setVisible(false);
            if (hiddenSpr.active) hiddenSpr.active = false;
          }
        }
        if (!beast.state.desc) continue;
        if (!beast.state.base) beastAnimDefaultBase(beast.state);
        beastAnimAdvance(beast.state, dtSec);
        const st = beast.state;
        const group = st.group;
        if (!group || !group.length) continue;
        const frameKey = group[Math.min(st.frameIdx, group.length - 1)];
        const frame = st.desc.frames[frameKey];
        if (!frame) continue;
        const anchorContainer = beast.anchorSprite ? beast.anchorSprite.parentContainer : null;
        if (anchorContainer && !anchorContainer.visible) continue;
        const flipSignX = beast.flipX ? -1 : 1;
        const anchorSpr = beast.anchorSprite && beast.anchorSprite.active ? beast.anchorSprite : null;
        let rigOffX = 0;
        let rigOffY = 0;
        let rigRot = 0;
        if (anchorSpr && anchorSpr._eeGroups && anchorSpr._eeGroups.length && level._getCombinedGroupOffset) {
          const groupMove = level._getCombinedGroupOffset(anchorSpr, scene._beastOffsetScratch || (scene._beastOffsetScratch = { x: 0, y: 0 }));
          rigOffX = Number(groupMove.x) || 0;
          rigOffY = Number(groupMove.y) || 0;
          for (const gid of anchorSpr._eeGroups) {
            const rotData = level._groupRotations ? level._groupRotations[gid] : null;
            if (!rotData || !rotData.totalRad) continue;
            rigRot += rotData.totalRad;
            if (rotData.centerGroupId > 0 && level._getGroupCenter) {
              const pivot = level._getGroupCenter(rotData.centerGroupId);
              const pivotDX = beast.worldX + rigOffX - pivot.cx;
              const pivotDY = beast.baseY + rigOffY - pivot.cy;
              const pivotCos = Math.cos(rotData.totalRad);
              const pivotSin = Math.sin(rotData.totalRad);
              rigOffX = pivot.cx + pivotDX * pivotCos - pivotDY * pivotSin - beast.worldX;
              rigOffY = pivot.cy + pivotDX * pivotSin + pivotDY * pivotCos - beast.baseY;
            }
          }
        }
        const rigCos = rigRot ? Math.cos(rigRot) : 1;
        const rigSin = rigRot ? Math.sin(rigRot) : 0;
        if (beast.lastFrameKey !== frameKey) {
          beast.lastFrameKey = frameKey;
          for (const tex in beast.partSprites) {
            if (frame.texSet[tex]) continue;
            const idleSpr = beast.partSprites[tex];
            idleSpr.scaleX = 0;
            idleSpr.scaleY = 0;
            const idleGlow = beast.partGlows ? beast.partGlows[tex] : null;
            if (idleGlow) {
              idleGlow.scaleX = 0;
              idleGlow.scaleY = 0;
            }
          }
        }
        if (beast.baseRot === undefined) beast.baseRot = Math.atan2(beast.rotSin, beast.rotCos);
        const unitScale = BEAST_ANIM_UNIT_SCALE * beast.scale;
        const flipSignY = beast.flipY ? -1 : 1;
        const angleSign = beast.flipX !== beast.flipY ? -1 : 1;
        const angleBase = beast.baseRot + rigRot;
        const scaleSignX = flipSignX * beast.scale;
        const scaleSignY = flipSignY * beast.scale;
        const parts = frame.parts;
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          const spr = beast.partSprites[part.texture];
          if (!spr) continue;
          const localX = part.x * unitScale * flipSignX;
          const localY = -part.y * unitScale * flipSignY;
          const rigLocalX = localX * rigCos - localY * rigSin;
          const rigLocalY = localX * rigSin + localY * rigCos;
          const worldX = beast.worldX + rigOffX + (rigLocalX * beast.rotCos - rigLocalY * beast.rotSin);
          const worldY = beast.baseY + rigOffY + (rigLocalX * beast.rotSin + rigLocalY * beast.rotCos);
          const effectDX = spr._eeEffectOffsetX || 0;
          const effectDY = spr._eeEffectOffsetY || 0;
          const effectScale = spr._eeEffectScale === undefined ? 1 : spr._eeEffectScale;
          spr._eeEffectOffsetX = 0;
          spr._eeEffectOffsetY = 0;
          spr._eeEffectScale = 1;
          const angle = part.rot * angleSign + angleBase;
          spr.x = worldX + effectDX;
          spr.y = worldY + effectDY;
          spr.rotation = angle;
          const partScaleX = part.sx * scaleSignX * effectScale;
          const partScaleY = part.sy * scaleSignY * effectScale;
          spr.scaleX = partScaleX;
          spr.scaleY = partScaleY;
          spr._eeZDepthBase = spr._eeZDepthBase ?? spr._eeZDepth;
          const zDepth = spr._eeZDepthBase + part.z * 0.001;
          if (spr._eeZDepth !== zDepth || spr.depth !== zDepth) {
            spr._eeZDepth = zDepth;
            spr.depth = zDepth;
          }
          const glowSpr = beast.partGlows ? beast.partGlows[part.texture] : null;
          if (glowSpr) {
            glowSpr.x = worldX + effectDX;
            glowSpr.y = worldY + effectDY;
            glowSpr.rotation = angle;
            glowSpr.scaleX = partScaleX;
            glowSpr.scaleY = partScaleY;
            const glowDepth = zDepth - 0.001;
            if (glowSpr._eeZDepth !== glowDepth || glowSpr.depth !== glowDepth) {
              glowSpr._eeZDepth = glowDepth;
              glowSpr.depth = glowDepth;
            }
          }
          if (beast.eye && beast.eyeParent === part.texture) {
            beast.eye.x = worldX + effectDX;
            beast.eye.y = worldY + effectDY;
            beast.eye.rotation = angle;
            beast.eye.scaleX = partScaleX;
            beast.eye.scaleY = partScaleY;
          }
        }
      }
}

window.BeastAnim = {
  IDS: BEAST_ANIM_OBJECT_IDS,
  EYES: BEAST_ANIM_EYES,
  eyeFor: function (objectId) { return BEAST_ANIM_EYES[objectId] || null; },
  SECONDARY_TAGS: BEAST_ANIM_SECONDARY_TAGS,
  secondaryTagsFor: function (objectId) { return BEAST_ANIM_SECONDARY_TAGS[objectId] || null; },
  TWEEN_TIME: BEAST_ANIM_TWEEN_TIME,
  UNIT_SCALE: BEAST_ANIM_UNIT_SCALE,
  getDesc: beastAnimGetDesc,
  frameExists: beastAnimFrameExists,
  isLoopingBase: beastAnimIsLoopingBase,
  animDef: beastAnimAnimDef,
  delayFor: beastAnimDelay,
  frameCount: beastAnimFrameCount,
  createState: beastAnimCreateState,
  setBase: beastAnimSetBase,
  defaultBase: beastAnimDefaultBase,
  command: beastAnimCommand,
  commandMany: beastAnimCommandMany,
  advance: beastAnimAdvance,
  animNameForCommand: beastAnimAnimNameForCommand,
  resolveBase: beastAnimResolveBase,
  parsePair: beastAnimParsePair,
  preload: beastAnimPreload,
  loadDescs: beastAnimLoadDescs,
  spawn: beastAnimSpawn,
  update: beastAnimUpdate
};