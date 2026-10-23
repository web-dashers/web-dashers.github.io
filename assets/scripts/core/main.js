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

//hook rendering to increase canvas resolution
function installRenderResolution(game) {
  const renderer = game.renderer;
  const originalRender = renderer.render;
  const savedMatrix = new Float32Array(6);
  let scaleX = 1;
  let scaleY = 1;

  //resize canvas without changing game coordinates
  game.events.on(Phaser.Core.Events.PRE_RENDER, () => {
    const { width, height } = game.scale.gameSize;
    const renderWidth = Math.round(width * window.renderScale);
    const renderHeight = Math.round(height * window.renderScale);
    const canvasMatches = game.canvas.width === renderWidth && game.canvas.height === renderHeight;
    const rendererMatches = renderer.width === renderWidth && renderer.height === renderHeight;
    if (canvasMatches && rendererMatches) return;

    scaleX = renderWidth / width;
    scaleY = renderHeight / height;
    if (game.canvas.width !== renderWidth) game.canvas.width = renderWidth;
    if (game.canvas.height !== renderHeight) game.canvas.height = renderHeight;
    renderer.resize(renderWidth, renderHeight);
  });

  renderer.render = function (scene, children, camera) {
    if (scaleX === 1 && scaleY === 1) {
      return originalRender.call(this, scene, children, camera);
    }

    //save logical camera before scaling it for rendering
    const matrix = camera.matrix.matrix;
    const x = camera._x;
    const y = camera._y;
    const width = camera._width;
    const height = camera._height;
    for (let i = 0; i < 6; i++) savedMatrix[i] = matrix[i];

    //matrix entries alternate between horizontal and vertical components
    for (let i = 0; i < 6; i += 2) {
      matrix[i] *= scaleX;
      matrix[i + 1] *= scaleY;
    }
    camera._x *= scaleX;
    camera._y *= scaleY;
    camera._width *= scaleX;
    camera._height *= scaleY;

    try {
      return originalRender.call(this, scene, children, camera);
    } finally {
      //restore logical coordinates for input & gp
      matrix.set(savedMatrix);
      camera._x = x;
      camera._y = y;
      camera._width = width;
      camera._height = height;
    }
  };
}

const phaserConfig = {
  type: Phaser.AUTO,
  width: screenWidth,
  height: screenHeight,
  pixelArt: false,
  antialias: window.graphicsQuality !== "sharp",
  antialiasGL: true,
  roundPixels: false,
  callbacks: { postBoot: installRenderResolution },
  fps: {
    smoothStep: true
  },
  backgroundColor: "#000000",
  parent: document.body,
  input: {
    windowEvents: false
  },
  render: {
    powerPreference: "default"
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, GameScene]
};
const webDashersGame = new Phaser.Game(phaserConfig);

window.getPerformanceInfo = () => {
  const game = webDashersGame;
  const scene = game.scene.getScene("GameScene");
  const gl = game.renderer.gl;
  const debug = gl?.getExtension("WEBGL_debug_renderer_info");
  const level = scene?._level;
  return {
    fps: Math.round(game.loop.actualFps),
    renderer: game.renderer.type === Phaser.WEBGL ? "WebGL" : "Canvas",
    gpu: gl ? gl.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : gl.RENDERER) : null,
    canvas: [game.canvas.width, game.canvas.height],
    logicalSize: [game.scale.gameSize.width, game.scale.gameSize.height],
    renderScale: window.renderScale,
    level: window.currentlevel?.[1],
    ldm: !!window.enableLDM,
    objects: level?.objects.length,
    activeLevelEmitters: level?._levelParticleEmitters.filter(emitter => emitter.active).length,
    browser: navigator.userAgent
  };
};

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
