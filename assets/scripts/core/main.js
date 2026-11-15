function checkForAutoLoad() {
  const assetsLoaded = localStorage.getItem('webdash_assets_loaded') === 'true';
  const lastLoadTime = parseInt(localStorage.getItem('webdash_last_load_time') || '0');
  const now = Date.now();
  const hoursSinceLoad = (now - lastLoadTime) / (1000 * 60 * 60);
  if (assetsLoaded && hoursSinceLoad < 24 && window.gameCache.isCacheValid()) {
    const stats = window.gameCache.getCacheStats();
    if (stats.validEntries > 50) {
      console.log('auto loading from cache');
      return true;
    }
  }
  return false;
}
if (window.gameCache) {
  window.gameCache.init();
  const canAutoLoad = checkForAutoLoad();
  if (canAutoLoad) {
    const autoLoadIndicator = document.createElement('div');
    autoLoadIndicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #00ff00;
      color: #000;
      padding: 5px 10px;
      border-radius: 5px;
      font-family: Arial;
      font-size: 12px;
      z-index: 9999;
    `;
    autoLoadIndicator.textContent = 'turbo loading';
    document.body.appendChild(autoLoadIndicator);
    setTimeout(() => {
      if (autoLoadIndicator.parentNode) {
        autoLoadIndicator.parentNode.removeChild(autoLoadIndicator);
      }
    }, 3000);
  }
}
l(getDynamicScreenWidth());
const phaserConfig = {
  type: Phaser.AUTO,
  width: screenWidth,
  height: screenHeight,
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
    powerPreference: "default",
    roundPixels: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, GameScene]
};
(() => {
  const frameProto = Phaser.Textures.Frame.prototype;
  const insetFrameUVs = frame => {
    const src = frame.source;
    if (!src || !src.width || !src.height || frame.name === "__BASE") return;
    if (frame.width >= src.width && frame.height >= src.height) return;
    const du = 0.5 / src.width;
    const dv = 0.5 / src.height;
    const cu = (frame.u0 + frame.u1) / 2;
    const cv = (frame.v0 + frame.v1) / 2;
    frame.u0 += frame.u0 < cu ? du : -du;
    frame.u1 += frame.u1 < cu ? du : -du;
    frame.v0 += frame.v0 < cv ? dv : -dv;
    frame.v1 += frame.v1 < cv ? dv : -dv;
  };
  for (const method of ["updateUVs", "updateUVsInverted"]) {
    const original = frameProto[method];
    if (typeof original !== "function") continue;
    frameProto[method] = function (...args) {
      const result = original.apply(this, args);
      insetFrameUVs(this);
      return result;
    };
  }
})();
new Phaser.Game(phaserConfig);

window.clearGameCache = () => {
  if (window.gameCache) {
    window.gameCache.clearCache();
    localStorage.removeItem('webdash_assets_loaded');
    localStorage.removeItem('webdash_last_load_time');
    console.log('Game cache cleared');
    location.reload();
  }
};

window.getCacheInfo = () => {
  if (window.gameCache) {
    return window.gameCache.getCacheStats();
  }
  return null;
};
