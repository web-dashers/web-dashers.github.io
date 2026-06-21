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
class ColorManager {
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
  triggerColor(index, newColor, duration) {
    let oldColor = {
      ...this.getColor(index)
    };
    this._actions[index] = new TriggerStepper(oldColor, newColor, duration);
    if (duration <= 0) {
      this._colors[index] = {
        ...newColor
      };
    }
  }
  step(timeMillis) {
    for (let actionIndex in this._actions) {
      let action = this._actions[actionIndex];
      action.step(timeMillis);
      this._colors[actionIndex] = {
        ...action.current
      };
      if (action.done) {
        delete this._actions[actionIndex];
      }
    }
  }
  getColor(index) {
    return this._colors[index] || {
      r: 255,
      g: 255,
      b: 255
    };
  }
  getHex(index) {
    let color = this.getColor(index);
    return color.r << 16 | color.g << 8 | color.b;
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
