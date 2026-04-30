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
