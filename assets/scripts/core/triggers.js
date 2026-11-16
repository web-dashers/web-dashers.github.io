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

class TriggerStepper {
  constructor(oldColor, newColor, triggerDuration) {
    this.from = {
      ...oldColor
    };
    this.to = {
      ...newColor
    };
    this.duration = triggerDuration;
    this.elapsed = 0;
    this.done = triggerDuration <= 0;
    this.current = triggerDuration <= 0 ? {
      ...newColor
    } : {
      ...oldColor
    };
  }
  step(timeMillis) {
    if (this.done) {
      return;
    }
    this.elapsed += timeMillis;
    let progress = this.duration > 0 ? Math.min(this.elapsed / this.duration, 1) : 1;
    if (progress >= 1) {
      this.current = {
        ...this.to
      };
      this.done = true;
    } else {
      this.current = {
        r: Math.round(this.from.r + (this.to.r - this.from.r) * progress),
        g: Math.round(this.from.g + (this.to.g - this.from.g) * progress),
        b: Math.round(this.from.b + (this.to.b - this.from.b) * progress)
      };
    }
  }
}
function channelHexToRgb(value) {
  const n = typeof value === "number" ? value : parseInt(String(value ?? "").replace(/^#/, ""), 16);
  if (!Number.isFinite(n)) return { r: 255, g: 255, b: 255 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHsv(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  let h = 0;
  if (diff !== 0) {
    if (max === r) h = 60 * (((g - b) / diff) % 6);
    else if (max === g) h = 60 * ((b - r) / diff + 2);
    else h = 60 * ((r - g) / diff + 4);
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : (diff / max) * 100, v: (max / 255) * 100 };
}
function hsvToRgb(h, s, v) {
  const sat = Math.max(0, Math.min(100, s)) / 100;
  const val = Math.max(0, Math.min(100, v)) / 100;
  const c = val * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = val - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}
function lightBgColor(bg, p1) {
  const max = Math.max(bg.r, bg.g, bg.b) / 255;
  const min = Math.min(bg.r, bg.g, bg.b) / 255;
  const base = rgbToHsv(bg.r, bg.g, bg.b);
  const sat = Math.max(0.0001, Math.min(1, (max === 0 ? 0 : (max - min) / max) - 0.2));
  const val = Math.max(0.0001, Math.min(1, max + 0.2));
  const c = val * sat;
  const h = base.h;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = val - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const target = { r: Math.trunc((r + m) * 255), g: Math.trunc((g + m) * 255), b: Math.trunc((b + m) * 255) };
  const sum = bg.r + bg.g + bg.b;
  if (sum >= 150) return target;
  const f = sum / 150;
  const mix = (a, t) => Math.trunc(Math.max(0, Math.min(255, (1 - f) * a + f * t)));
  return { r: mix(p1.r, target.r), g: mix(p1.g, target.g), b: mix(p1.b, target.b) };
}

function parseChannelHsv(value) {
  if (!value) return null;
  const parts = String(value).split("a");
  const num = (i, fallback) => {
    const n = parseFloat(parts[i]);
    return Number.isFinite(n) ? n : fallback;
  };
  return {
    h: num(0, 0),
    s: num(1, 1),
    v: num(2, 1),
    sAdd: parts[3] === "1",
    vAdd: parts[4] === "1"
  };
}
function applyChannelHsv(color, hsv) {
  if (!hsv) return { r: color.r, g: color.g, b: color.b };
  const base = rgbToHsv(color.r, color.g, color.b);
  let h = (base.h + hsv.h) % 360;
  if (h < 0) h += 360;
  const s = hsv.sAdd ? base.s / 100 + hsv.s : (base.s / 100) * hsv.s;
  const v = hsv.vAdd ? base.v / 100 + hsv.v : (base.v / 100) * hsv.v;
  return hsvToRgb(h, s * 100, v * 100);
}

class ColorManager {
  constructor() {
    this._initialColors = {};
    this._initialCopies = {};
    this._initialOpacity = {};
    this.reset();
  }
  setInitialOpacity(channelId, opacity) {
    if (!Number.isFinite(opacity)) return;
    this._initialOpacity[channelId] = opacity;
    this._opacity[channelId] = opacity;
  }
  setInitialColor(channelId, color) {
    this._initialColors[channelId] = { ...color };
    this._colors[channelId] = { ...color };
  }
  setInitialCopy(channelId, copy) {
    if (!copy || !(copy.source > 0)) return;
    this._initialCopies[channelId] = { ...copy };
    this._copies[channelId] = { ...copy };
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
      },
      1002: {
        r: 255,
        g: 255,
        b: 255
      },
      1003: {
        r: 255,
        g: 255,
        b: 255
      },
      1004: {
        r: 255,
        g: 255,
        b: 255
      }
    };
    for (let chId in this._initialColors) {
      this._colors[chId] = { ...this._initialColors[chId] };
    }
    this._copies = {};
    for (let chId in this._initialCopies) {
      this._copies[chId] = { ...this._initialCopies[chId] };
    }
    this._opacity = { ...this._initialOpacity };
    this._opacityActions = {};
    this._pulses = [];
    this._coloredChannels = new Set();
    this._actions = {};
  }
  startPulse(channel, pulse) {
    const fadeIn = Math.max(0, pulse.fadeIn || 0);
    const hold = Math.max(0, pulse.hold || 0);
    const fadeOut = Math.max(0, pulse.fadeOut || 0);
    this._pulses.push({
      channel: Number(channel),
      color: pulse.color,
      hsv: pulse.hsv || null,
      copySource: pulse.copySource > 0 ? Number(pulse.copySource) : 0,
      fadeIn,
      hold,
      fadeOut,
      total: Math.max(0.01, fadeIn + hold + fadeOut),
      elapsed: 0
    });
  }
  clearPulses() {
    this._pulses = [];
  }
  _applyPulses(index, color, depth) {
    const id = Number(index);
    let out = color;
    for (let i = 0; i < this._pulses.length; i++) {
      const p = this._pulses[i];
      if (p.channel !== id) continue;
      const t = p.elapsed;
      let intensity;
      if (t < p.fadeIn) intensity = t / p.fadeIn;
      else if (t < p.fadeIn + p.hold) intensity = 1;
      else intensity = p.fadeOut > 0 ? 1 - (t - p.fadeIn - p.hold) / p.fadeOut : 0;
      if (intensity <= 0) continue;
      if (intensity > 1) intensity = 1;
      const target = p.hsv
        ? applyChannelHsv(p.copySource > 0 && depth < 8 ? this.getColor(p.copySource, depth + 1) : out, p.hsv)
        : p.color;
      out = {
        r: Math.round(out.r + (target.r - out.r) * intensity),
        g: Math.round(out.g + (target.g - out.g) * intensity),
        b: Math.round(out.b + (target.b - out.b) * intensity)
      };
    }
    return out;
  }
  _resolveCopy(copy, depth) {
    return applyChannelHsv(this.getColor(copy.source, depth + 1), copy.hsv);
  }
  triggerColor(index, newColor, duration, copy = null, opacity = undefined) {
    this._coloredChannels.add(String(index));
    if (Number.isFinite(opacity)) {
      const to = Math.max(0, Math.min(1, opacity));
      if (duration <= 0) {
        this._opacity[index] = to;
        delete this._opacityActions[index];
      } else {
        this._opacityActions[index] = { from: this.getOpacity(index), to, duration, elapsed: 0 };
      }
    }
    let oldColor = {
      ...this._getBaseColor(index)
    };
    const hasCopy = copy && copy.source > 0 && Number(copy.source) !== Number(index);
    if (hasCopy) {
      this._copies[index] = { ...copy };
    } else {
      delete this._copies[index];
    }
    const target = hasCopy ? this._resolveCopy(copy, 0) : newColor;
    const action = new TriggerStepper(oldColor, target, duration);
    action.copy = hasCopy ? this._copies[index] : null;
    this._actions[index] = action;
    if (duration <= 0) {
      this._colors[index] = {
        ...target
      };
    }
  }
  step(timeMillis) {
    if (this._pulses.length) {
      for (let i = this._pulses.length - 1; i >= 0; i--) {
        const p = this._pulses[i];
        p.elapsed += timeMillis;
        if (p.elapsed >= p.total) this._pulses.splice(i, 1);
      }
    }
    for (let opIndex in this._opacityActions) {
      const op = this._opacityActions[opIndex];
      op.elapsed += timeMillis;
      const t = Math.min(op.elapsed / op.duration, 1);
      this._opacity[opIndex] = op.from + (op.to - op.from) * t;
      if (t >= 1) delete this._opacityActions[opIndex];
    }
    for (let actionIndex in this._actions) {
      let action = this._actions[actionIndex];
      if (action.copy) action.to = this._resolveCopy(action.copy, 0);
      action.step(timeMillis);
      this._colors[actionIndex] = {
        ...action.current
      };
      if (action.done) {
        delete this._actions[actionIndex];
      }
    }
  }
  getColor(index, depth = 0) {
    const base = this._getBaseColor(index, depth);
    return this._pulses.length ? this._applyPulses(index, base, depth) : base;
  }
  _getBaseColor(index, depth = 0) {
    const id = Number(index);
    if (id === 1010 && !this.hasColor(index)) return { r: 0, g: 0, b: 0 };
    if (id === 1011 && !this.hasColor(index)) return { r: 255, g: 255, b: 255 };
    const copy = this._copies[index];
    if (copy && depth < 8 && !(this._actions[index] && !this._actions[index].done)) {
      return this._resolveCopy(copy, depth);
    }
    const color = this._colors[index];
    if (color) return color;
    if (id === 1005) return channelHexToRgb(window.mainColor);
    if (id === 1006) return channelHexToRgb(window.secondaryColor);
    if (id === 1007) return lightBgColor(this.getColor(fs), depth < 8 ? this.getColor(1005, depth + 1) : channelHexToRgb(window.mainColor));
    if (id === 1) return channelHexToRgb(window.mainColor ?? 0xffffff);
    if (id === 2) return channelHexToRgb(window.secondaryColor ?? 0xffffff);
    if (id === 1009) return { ...this.getColor(gs, depth + 1) };
    return {
      r: 255,
      g: 255,
      b: 255
    };
  }
  getOpacity(index) {
    const op = this._opacity[index];
    return op === undefined ? 1 : op;
  }
  hasColor(index) {
    return this._coloredChannels.has(String(index));
  }
  getHex(index) {
    let color = this.getColor(index);
    return ((color.r << 16) | (color.g << 8) | color.b) >>> 0;
  }
}

function circleEffect(gameScene, xPos, yPos, radius, radius2, duration, filled = false, _0x550b4a /*idk what this is*/ = false, color = 16777215) {
  const graphics = gameScene.add.graphics().setScrollFactor(0).setDepth(55).setBlendMode(S);
  const targets = {
    r: radius,
    t: 0
  };
  gameScene.tweens.add({
    targets: targets,
    r: radius2,
    t: 1,
    duration: duration,
    ease: filled && !_0x550b4a ? "Quad.Out" : "Linear",
    onUpdate: () => {
      const alpha = _0x550b4a ? targets.t < 0.5 ? targets.t * 2 : (1 - targets.t) * 2 : 1 - targets.t;
      graphics.clear();
      if (filled) {
        graphics.fillStyle(color, Math.max(0, alpha));
        graphics.fillCircle(xPos, yPos, targets.r);
      } else {
        graphics.lineStyle(4, color, Math.max(0, alpha));
        graphics.strokeCircle(xPos, yPos, targets.r);
      }
    },
    onComplete: () => graphics.destroy()
  });
}
function particleEffect(gameScene, color1 = 16777215, color2 = 16777215) {
  if (window.enableLDM) return;
  const basePos = 200;
  const xPos = basePos + (screenWidth - 400) * Math.random();
  const yPos = basePos + Math.random() * 240;
  circleEffect(gameScene, xPos, yPos, 40, 140 + Math.random() * 60, 500, true, true, color2);
  gameScene.add.particles(xPos, yPos, "GJ_WebSheet", {
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
    tint: color1,
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