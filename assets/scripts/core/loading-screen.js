function loadFont(scene, fontName, fontData) {
  const texture = scene.textures.get(fontName);
  const image = texture.source[0];
  const imageWidth = image.width;
  const imageHeight = image.height;
  const fontConfig = {
    font: fontName,
    size: 0,
    lineHeight: 0,
    chars: {}
  };
  const kerningPairs = [];
  for (const line of fontData.split("\n")) {
    const lineParts = line.trim().split(/\s+/);
    if (!lineParts.length) continue;
    const lineType = lineParts[0];
    const properties = {};
    for (let i = 1; i < lineParts.length; i++) {
      const equalIndex = lineParts[i].indexOf("=");
      if (equalIndex >= 0) {
        properties[lineParts[i].slice(0, equalIndex)] = lineParts[i].slice(equalIndex + 1).replace(/^"|"$/g, "");
      }
    }
    if (lineType === "info") {
      fontConfig.size = parseInt(properties.size, 10);
    } else if (lineType === "common") {
      fontConfig.lineHeight = parseInt(properties.lineHeight, 10);
    } else if (lineType === "char") {
      const charId = parseInt(properties.id, 10);
      const charX = parseInt(properties.x, 10);
      const charY = parseInt(properties.y, 10);
      const charWidth = parseInt(properties.width, 10);
      const charHeight = parseInt(properties.height, 10);
      const u0 = charX / imageWidth;
      const v0 = charY / imageHeight;
      const u1 = (charX + charWidth) / imageWidth;
      const v1 = (charY + charHeight) / imageHeight;
      fontConfig.chars[charId] = {
        x: charX, y: charY, width: charWidth, height: charHeight,
        centerX: Math.floor(charWidth / 2), centerY: Math.floor(charHeight / 2),
        xOffset: parseInt(properties.xoffset, 10),
        yOffset: parseInt(properties.yoffset, 10),
        xAdvance: parseInt(properties.xadvance, 10),
        data: {}, kerning: {},
        u0, v0, u1, v1
      };
      if (charWidth !== 0 && charHeight !== 0) {
        const charCode = String.fromCharCode(charId);
        const frame = texture.add(charCode, 0, charX, charY, charWidth, charHeight);
        if (frame) frame.setUVs(charWidth, charHeight, u0, v0, u1, v1);
      }
    } else if (lineType === "kerning") {
      kerningPairs.push({
        first: parseInt(properties.first, 10),
        second: parseInt(properties.second, 10),
        amount: parseInt(properties.amount, 10)
      });
    }
  }
  for (const kerningPair of kerningPairs) {
    if (fontConfig.chars[kerningPair.second]) {
      fontConfig.chars[kerningPair.second].kerning[kerningPair.first] = kerningPair.amount;
    }
  }
  scene.cache.bitmapFont.add(fontName, { data: fontConfig, texture: fontName, frame: null });
}

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    if (window.gameCache) window.gameCache.init();
    (function (game) {
      if (game.renderer.type === Phaser.WEBGL) {
        try {
          let gl = game.renderer.gl;
          if (gl && gl.isContextLost()) {
            console.warn('WebGL context lost now using blend modes');
            window.S = Phaser.BlendModes.ADD;
            window.E = Phaser.BlendModes.MULTIPLY;
          } else {
            window.S = game.renderer.addBlendMode([gl.SRC_ALPHA, gl.ONE], gl.FUNC_ADD);
            window.E = game.renderer.addBlendMode([gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA], gl.FUNC_ADD);
          }
        } catch (e) {
          window.S = Phaser.BlendModes.ADD;
          window.E = Phaser.BlendModes.MULTIPLY;
        }
      } else {
        console.log('using Canvas renderer setting blend modes');
        window.S = Phaser.BlendModes.ADD;
        window.E = Phaser.BlendModes.MULTIPLY;
      }
      if (game.canvas) {
        game.canvas.addEventListener('webglcontextlost', (e) => {
          console.warn('WebGL context lost');
          e.preventDefault();
          window.S = Phaser.BlendModes.ADD;
          window.E = Phaser.BlendModes.MULTIPLY;
        });
        
        game.canvas.addEventListener('webglcontextrestored', (e) => {
          console.log('WebGL context is back');
          if (game.renderer.type === Phaser.WEBGL && game.renderer.gl) {
            try {
              let gl = game.renderer.gl;
              window.S = game.renderer.addBlendMode([gl.SRC_ALPHA, gl.ONE], gl.FUNC_ADD);
              window.E = game.renderer.addBlendMode([gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA], gl.FUNC_ADD);
            } catch (e) {
              console.warn('failed to bring back WebGL blend modes:', e);
              window.S = Phaser.BlendModes.ADD;
              window.E = Phaser.BlendModes.MULTIPLY;
            }
          }
        });
      }
    })(this.game);

    const W = this.cameras.main.width;
    const H = this.cameras.main.height;
    const cx = W / 2;
    const cy = H / 2;

    const LOADING_MESSAGES = [
      "Only one?",
      "Listen to the music to help time your jumps",
      "Back for more are ya?",
      "Use practice mode to learn the layout of a level",
      "If at first you don't succeed, try, try again...",
      "Customize your character's icon and color!",
      "You can download all songs from the level select page!",
      "Spikes are not your friends. don't forget to jump",
      "Build your own levels using the level editor",
      "Go online to play other players levels!",
      "Can you beat them all?",
      "Here be dragons...",
      "Pro tip: Don't crash",
      "Hold down to keep jumping",
      "The spikes whisper to me...",
      "Looking for pixels",
      "Loading awesome soundtracks...",
      "What if the spikes are the good guys?",
      "Pro tip: Jump",
      "Does anyone even read this?",
      "Collecting scrap metal",
      "Waiting for planets to align",
      "Starting the flux capacitor",
      "Wandering around aimlessly",
      "Where did I put that coin...",
      "Loading the progressbar",
      "Calculating chance of success",
      "Hiding secrets",
      "Drawing pretty pictures",
      "Programmer is sleeping, please wait",
      "Web is Love, Dasher is Life",
      "Play, Crash, Rage, Quit, Repeat",
      "Only one button required to crash",
      "Such wow, very amaze.",
      "Fus Ro DASH!",
      "Loading Rage Cannon",
      "Counting to 1337",
      "It's all in the timing",
      "Fake spikes are fake",
      "Spikes... OF DOOM!",
      "Why don't you go outside?",
      "Loading will be finished... soon",
      "This seems like a good place to hide a secret...",
      "The vault Keeper's name is 'Spooky'...",
      "Hop the big guy doesn't wakt up...",
      "Shhhh! You're gonna wake the big one!",
      "I have been expecting you.",
      "A wild WebDasher appeared!",
      "So many secrets...",
      "Hiding rocket launcher",
      "It's Over 9000!",
      "Programming amazing AI",
      "Hiding secret vault",
      "Spooky doesn't get out much",
      "WebDasher was here",
      "Warp Speed",
      "So, what's up?",
      "Hold on, reading the manual",
      "I don't know how this works...",
      "Why u have to be mad?",
      "It is only game...",
      "Unlock new icons and colors by completing achievements"
    ];
    const sliderOriginX = cx - 105;
    const sliderOriginY = cy + 110;
    let sliderFill = null

    this.load.image("game_bg_01", "assets/game-bg/game_bg_01_001-hd.png");
    this.load.image("sliderBar", "assets/sprites/sliderBar.png");
    this.load.atlas("GJ_WebSheet", "assets/sheets/GJ_WebSheet.png", "assets/sheets/GJ_WebSheet.json");
    this.load.atlas("GJ_LaunchSheet", "assets/sheets/GJ_LaunchSheet.png", "assets/sheets/GJ_LaunchSheet.json");
    this.load.image("goldFont", "assets/fonts/goldFont.png");
    this.load.text("goldFontFnt", "assets/fonts/goldFont.fnt");
    
    this.load.once("complete", () => {
      const tex = this.textures.get("game_bg_01");
      const s = Math.max(W / tex.source[0].width, H / tex.source[0].height);
      const bg = this.add.image(cx, cy, "game_bg_01").setScale(s).setTint(0x0066ff);
      this.children.sendToBack(bg);
      sliderFill = this.add.tileSprite(sliderOriginX - 100, sliderOriginY - 2, 0, 14, "sliderBar");
      sliderFill.setOrigin(0, 0.5);
      this.add.image(sliderOriginX + 105, sliderOriginY, "GJ_WebSheet", "slidergroove.png").setOrigin(0.5, 0.5);
      const goldFontData = this.cache.text.get("goldFontFnt");
      if (goldFontData && !this.cache.bitmapFont.has("goldFont")) {
        loadFont(this, "goldFont", goldFontData);
      }
      const msg = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
      this.add.bitmapText(cx, cy + 187, "goldFont", msg, 30).setOrigin(0.5);
      const robtopLogo = this.add.image(cx, cy - 120, "GJ_LaunchSheet", "RobTopLogoBig_001.png").setOrigin(0.5).setScale(0.8);
      const gjLogo = this.add.image(cx, cy, "GJ_WebSheet", "gj_logo.png").setOrigin(0.5);
      this.children.bringToTop(robtopLogo);
      this.children.bringToTop(gjLogo);
      if (window.gameCache) {
        const originalXhr = this.load.xhrLoader;
        this.load.xhrLoader = (file) => {
          const url = file.url;
          if (window.gameCache.isFileCached(url)) {
            const cached = window.gameCache.getCachedFile(url);
            if (cached) {
              return new Promise((resolve) => {
                setTimeout(() => { file.data = cached; resolve(file); }, 1);
              });
            }
          }
          return originalXhr.call(this.load, file).then((result) => {
            if (result && result.data) window.gameCache.cacheFile(url, result.data);
            return result;
          });
        };
      }

      this.load.atlas("GJ_GameSheet", "assets/sheets/GJ_GameSheet.png", "assets/sheets/GJ_GameSheet.json");
      this.load.atlas("GJ_GameSheet02", "assets/sheets/GJ_GameSheet02.png", "assets/sheets/GJ_GameSheet02.json");
      this.load.atlas("GJ_GameSheet03", "assets/sheets/GJ_GameSheet03.png", "assets/sheets/GJ_GameSheet03.json");
      this.load.atlas("GJ_GameSheet04", "assets/sheets/GJ_GameSheet04.png", "assets/sheets/GJ_GameSheet04.json");
      this.load.atlas("GJ_GameSheetEditor", "assets/sheets/GJ_GameSheetEditor.png", "assets/sheets/GJ_GameSheetEditor.json");
      this.load.atlas("GJ_GameSheetGlow", "assets/sheets/GJ_GameSheetGlow.png", "assets/sheets/GJ_GameSheetGlow.json");
      this.load.atlas("GJ_GameSheetIcons", "assets/sheets/GJ_GameSheetIcons.png", "assets/sheets/GJ_GameSheetIcons.json");
      this.load.atlas("GJ_LaunchSheet", "assets/sheets/GJ_LaunchSheet.png", "assets/sheets/GJ_LaunchSheet.json");
      this.load.atlas("player_ball_00", "assets/sheets/player_ball_00.png", "assets/sheets/player_ball_00.json");
      this.load.atlas("player_dart_00", "assets/sheets/player_dart_00.png", "assets/sheets/player_dart_00.json");
      this.load.image("bigFont", "assets/fonts/bigFont.png");
      this.load.text("bigFontFnt", "assets/fonts/bigFont.fnt");
      this.load.image("square04_001", "assets/sprites/square04_001.png");
      this.load.image("GJ_square02", "assets/sprites/GJ_square02.png");
      this.load.image("GJ_square01", "assets/sprites/GJ_square01.png");
      this.load.image("square01_001", "assets/sprites/square01_001.png");
      this.load.image("loadingCircle", "assets/sprites/loadingCircle.png");
      this.load.image("GJ_button01", "assets/sprites/GJ_button_01.png");
      this.load.image("GJ_button02", "assets/sprites/GJ_button_02.png");

      for (let i = 1; i < 23; i++) {
        let index = i - 1;
        i = String(i);
        if (i.length < 2) i = "0" + i;
        let paddedIndex = String(index);
        if (paddedIndex.length < 2) paddedIndex = "0" + paddedIndex;
        this.load.image("groundSquare_" + paddedIndex + "_001.png", "assets/game-ground/groundSquare_" + i + "_001.png");
      }

      for (let i = 1; i < 60; i++) {
        let index = i - 1;
        i = String(i);
        if (i.length < 2) i = "0" + i;
        this.load.image("game_bg_" + index, "assets/game-bg/game_bg_" + i + "_001-hd.png");
      }

      this.load.audio("menu_music", "assets/music/menuLoop.mp3");
      this.load.audio("StayInsideMe", "assets/music/StayInsideMe.mp3");

      for (const lvlarray of window.allLevels) {
        this.load.text(lvlarray[2], "assets/levels/" + lvlarray[2].split("_")[1] + ".txt");
        this.load.audio(lvlarray[0], "assets/music/" + (lvlarray[4] ? lvlarray[4] : lvlarray[1].replaceAll(" ", "")) + ".mp3");
      }

      this.load.audio("explode_11", "assets/sfx/explode_11.ogg");
      this.load.audio("endStart_02", "assets/sfx/endStart_02.ogg");
      this.load.audio("playSound_01", "assets/sfx/playSound_01.ogg");
      this.load.audio("quitSound_01", "assets/sfx/quitSound_01.ogg");
      this.load.audio("highscoreGet02", "assets/sfx/highscoreGet02.ogg");

      this.load.on("progress", (value) => {
        if (sliderFill) sliderFill.width = value * 380;
      });
      this.load.on("loaderror", () => {});
      this.load.once("complete", () => {
        if (sliderFill) sliderFill.width = 380;
        this.time.delayedCall(200, () => {
          const bigFontData = this.cache.text.get("bigFontFnt");
          if (bigFontData) loadFont(this, "bigFont", bigFontData);
          const gfd = this.cache.text.get("goldFontFnt");
          if (gfd && !this.cache.bitmapFont.has("goldFont")) loadFont(this, "goldFont", gfd);
          if (window.gameCache) console.log('stats:', window.gameCache.getCacheStats());
          localStorage.setItem('webdash_assets_loaded', 'true');
          localStorage.setItem('webdash_last_load_time', Date.now().toString());
          this.scene.start("GameScene");
        });
      });

      this.load.start();
    });
  }
  create() {
  }
}
