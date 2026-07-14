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


// Fixed full-screen flex wrapper as the Phaser parent.  Flexbox centering is
// completely immune to anything ScaleManager writes to canvas inline styles,
// so the game stays centered through scene restarts and resize callbacks.
var _gameWrapper = document.createElement('div');
_gameWrapper.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#000;pointer-events:none;';
document.body.appendChild(_gameWrapper);

const phaserConfig = {
  type: Phaser.AUTO,
  width: screenWidth,
  height: screenHeight,
  fps: { smoothStep: true },
  backgroundColor: "#000000",
  parent: _gameWrapper,
  input: { windowEvents: false },
  render: { powerPreference: "default" },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.NO_CENTER
  },
  scene: [BootScene, GameScene]
};
const _phaserGame = new Phaser.Game(phaserConfig);

// Re-enable pointer events on the canvas (wrapper has pointer-events:none).
_phaserGame.events.once('ready', function () {
  _phaserGame.canvas.style.pointerEvents = 'auto';
});

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
