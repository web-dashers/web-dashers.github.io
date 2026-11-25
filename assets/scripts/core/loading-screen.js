(function () {
  if (window === window.top) return;
  const key = "lol_rekt";
  let host = "";
  try {
    host = new URL(document.referrer).hostname.toLowerCase();
  } catch (e) {}
  const domains = ["webdashers.net", "web-dashers.com", "webdashers.org", "webdashers.cc", "webdashers.online"];
  const match = d => host === d || host.endsWith("." + d);
  const oldStyle = ["webdashers.net", "webdashers.cc"].some(match);
  if (!domains.some(match) && sessionStorage.getItem(key) !== "1") return;
  sessionStorage.setItem(key, "1");
  const show = () => {
    const msg = "This site is a scam trying to make money off other people's work!! Please play Web Dashers using the real website instead.";
    document.open();
    document.write(
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Official Web Dashers</title><style>' +
      'html,body{margin:0;width:100%;height:100%;background:#000}' +
      'body{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:35px;user-select:none;-webkit-user-select:none;font-family:"Comic Sans MS","Comic Sans",cursive}' +
      '@keyframes rainbow{0%{color:red}16%{color:orange}33%{color:yellow}50%{color:lime}66%{color:cyan}83%{color:magenta}100%{color:red}}' +
      '.official-text{animation:rainbow 1s linear infinite;font-size:30px;font-weight:bold;text-align:center;margin-top:25px}' +
      '.official-url{color:white;font-size:26px;font-weight:bold;text-align:center;overflow-wrap:anywhere;user-select:text;-webkit-user-select:text;cursor:text}' +
      'a{animation:rainbow 1s linear infinite;font-size:30px;font-weight:bold;text-align:center;margin-top:25px}' +
      'img{width:60%;max-width:400px;height:auto;pointer-events:none}' +
      '.overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:2147483647;display:flex;align-items:center;justify-content:center}' +
      '.popup{background:#fff;color:#111;border-radius:12px;padding:30px;max-width:420px;width:80%;text-align:center;font-size:18px;box-shadow:0 0 30px #000}' +
      '.popup button{margin-top:20px;padding:12px 35px;background:#222;color:white;border:0;border-radius:6px;font:bold 16px "Comic Sans MS",cursive;cursor:pointer}' +
      '</style></head><body>' +
      (oldStyle
        ? '<a href="https://web-dashers.github.io/" target="_top">CLICK HERE TO PLAY REAL WEB DASHERS!</a>'
        : '<div class="official-text">USE THIS LINK TO PLAY REAL WEB DASHERS:</div><div class="official-url">https://web-dashers.github.io</div>') +
      '<img src="https://media1.tenor.com/m/HXNFeI6ZG9oAAAAd/fanum-throws.gif">' +
      (oldStyle
        ? ''
        : '<div class="overlay" id="warning"><div class="popup">This site is a scam trying to make money off other people&#39;s work!! Please play Web Dashers using the real website instead.<div><button onclick="document.getElementById(\'warning\').remove()">OK</button></div></div></div>') +
      '</body></html>'
    );
    document.close();
    if (oldStyle) alert(msg);
    try {
      window.frameElement?.requestFullscreen?.().catch(() => {});
    } catch (e) {}
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", show, { once: true });
  else show();
})();
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
      "Rohan was here",
      "Warp Speed",
      "So, what's up?",
      "Hold on, reading the manual",
      "I don't know how this works...",
      "Why u have to be mad?",
      "It is only game...",
      "Unlock new icons and colors by completing achievements",
      "y=mx+b",
      "Nicest game ever!",
      "S-slopes!~",
      "Anything but slopes",
      "Laggiest game ever.",
      "GeometFree Dash!",
      "I AM a fricking dasher.",
      "web dash is steal all your level",
      "Have you ever wanted levels free?"
    ];
    const sliderOriginX = cx - 105;
    const sliderOriginY = cy + 110;
    let sliderFill = null

    this.load.image("game_bg_01", "assets/game-sprites/game-bg/game_bg_01_001-hd.png");
    this.load.image("sliderBar", "assets/ui-graphics/sprites/sliderBar.png");
    this.load.image("sliderBar2", "assets/ui-graphics/sprites/sliderBar2.png");
    this.load.image("GJ_MenuBeta", "assets/ui-graphics/sprites/GJ_MenuBeta.png");
    this.load.image("Phaserlogo", "assets/ui-graphics/sprites/Phaserlogo.png");
    this.load.image("gravityLine_001", "assets/ui-graphics/sprites/gravityLine_001.png");
    this.load.atlas("GJ_WebSheet", "assets/ui-graphics/sheets/GJ_WebSheet.png", "assets/ui-graphics/sheets/GJ_WebSheet.json");
    this.load.atlas("GJ_LaunchSheet", "assets/ui-graphics/sheets/GJ_LaunchSheet.png", "assets/ui-graphics/sheets/GJ_LaunchSheet.json");
    this.load.image("goldFont", "assets/fonts/goldFont.png");
    this.load.text("goldFontFnt", "assets/fonts/goldFont.fnt");
    
    this.load.once("complete", () => {
      window.BeastAnim.loadDescs(this);
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
      const gjLogo = this.add.image(cx, cy, "GJ_WebSheet", "GJ_logo_001.png").setOrigin(0.5).setScale(1.1);
      const Logo = this.add.image(W - 123, 610, "Phaserlogo").setScale(0.115).setInteractive();
      this.children.bringToTop(robtopLogo);
      this.children.bringToTop(gjLogo);
      this.children.bringToTop(Logo);
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

      this.load.atlas("GJ_GameSheet", "assets/ui-graphics/sheets/GJ_GameSheet.png", "assets/ui-graphics/sheets/GJ_GameSheet.json");
      this.load.atlas("GJ_GameSheet02", "assets/ui-graphics/sheets/GJ_GameSheet02.png", "assets/ui-graphics/sheets/GJ_GameSheet02.json");
      this.load.atlas("SecretSheet", "assets/ui-graphics/sheets/SecretSheet.png", "assets/ui-graphics/sheets/SecretSheet.json");
      this.load.atlas("GJ_GameSheet03", "assets/ui-graphics/sheets/GJ_GameSheet03.png", "assets/ui-graphics/sheets/GJ_GameSheet03.json");
      this.load.atlas("GJ_GameSheet04", "assets/ui-graphics/sheets/GJ_GameSheet04.png", "assets/ui-graphics/sheets/GJ_GameSheet04.json");
      this.load.atlas("GJ_EditorSheet01", "assets/ui-graphics/sheets/GJ_EditorSheet01.png", "assets/ui-graphics/sheets/GJ_EditorSheet01.json");
      this.load.atlas("GJ_GameSheetEditor", "assets/ui-graphics/sheets/GJ_GameSheetEditor.png", "assets/ui-graphics/sheets/GJ_GameSheetEditor.json");
      this.load.atlas("GJ_GameSheetGlow", "assets/ui-graphics/sheets/GJ_GameSheetGlow.png", "assets/ui-graphics/sheets/GJ_GameSheetGlow.json");
      this.load.atlas("GJ_GameSheetIcons", "assets/ui-graphics/sheets/GJ_GameSheetIcons.png", "assets/ui-graphics/sheets/GJ_GameSheetIcons.json");
      queueIconAtlases(this, window.iconPreloadAll === false ? getEquippedIconBases() : getAllIconBases());
      this.load.atlas("Wavesheet", "assets/ui-graphics/sheets/Wavesheet.png", "assets/ui-graphics/sheets/Wavesheet.json");
      this.load.json("Spider_AnimDesc", "assets/ui-graphics/sheets/Spider_AnimDesc.json");
      this.load.json("Robot_AnimDesc", "assets/ui-graphics/sheets/Robot_AnimDesc.json");
      window.BeastAnim.preload(this);
      this.load.atlas("GJ_LaunchSheet", "assets/ui-graphics/sheets/GJ_LaunchSheet.png", "assets/ui-graphics/sheets/GJ_LaunchSheet.json");
      this.load.atlas("player_ball_00", "assets/ui-graphics/sheets/player_ball_00.png", "assets/ui-graphics/sheets/player_ball_00.json");
      this.load.atlas("player_dart_00", "assets/ui-graphics/sheets/player_dart_00.png", "assets/ui-graphics/sheets/player_dart_00.json");
      this.load.atlas("CCControlColourPickerSpriteSheet-uhd", "assets/ui-graphics/sheets/CCControlColourPickerSpriteSheet-uhd.png", "assets/ui-graphics/sheets/CCControlColourPickerSpriteSheet-uhd.json");
      this.load.atlas("PixelSheet_01-hd", "assets/ui-graphics/sheets/PixelSheet_01.png", "assets/ui-graphics/sheets/PixelSheet_01.json");
      this.load.atlas("FireSheet_01-hd", "assets/ui-graphics/sheets/FireSheet_01-hd.png", "assets/ui-graphics/sheets/FireSheet_01-hd.json");
      this.load.atlas("GJ_ParticleSheet-uhd", "assets/ui-graphics/sheets/GJ_ParticleSheet.png", "assets/ui-graphics/sheets/GJ_ParticleSheet.json");
      this.load.image("bigFont", "assets/fonts/bigFont.png");
      this.load.text("bigFontFnt", "assets/fonts/bigFont.fnt");
      this.load.image("square04_001", "assets/ui-graphics/sprites/square04_001.png");
      this.load.image("GJ_square02", "assets/ui-graphics/sprites/GJ_square02.png");
      this.load.image("GJ_square01", "assets/ui-graphics/sprites/GJ_square01.png");
      this.load.image("GJ_square05", "assets/ui-graphics/sprites/GJ_square05.png");
      this.load.image("GJ_square07", "assets/ui-graphics/sprites/GJ_square07.png");
      this.load.image("GJ_square04", "assets/ui-graphics/sprites/GJ_square04.png");
      this.load.image("GJ_square06", "assets/ui-graphics/sprites/GJ_square06.png");
      this.load.image("GJ_square67", "assets/ui-graphics/sprites/GJ_square67.png");
      this.load.image("square01_001", "assets/ui-graphics/sprites/square01_001.png");
      this.load.image("loadingCircle", "assets/ui-graphics/sprites/loadingCircle.png");
      this.load.image("GJ_button01", "assets/ui-graphics/sprites/GJ_button_01.png");
      this.load.image("GJ_button02", "assets/ui-graphics/sprites/GJ_button_02.png");
      this.load.image("GJ_button03", "assets/ui-graphics/sprites/GJ_button_03.png");
      this.load.image("GJ_button04", "assets/ui-graphics/sprites/GJ_button_04.png");
      this.load.image("GJ_button05", "assets/ui-graphics/sprites/GJ_button_05.png");
      this.load.image("GJ_button06", "assets/ui-graphics/sprites/GJ_button_06.png");
      this.load.image("ImportanIcon", "assets/ui-graphics/sprites/ImportanIcon.png");
      this.load.image("tutorial_01", "assets/ui-graphics/sprites/tutorial_01.png");
      this.load.image("tutorial_02", "assets/ui-graphics/sprites/tutorial_02.png");
      this.load.image("tutorial_03", "assets/ui-graphics/sprites/tutorial_03.png");
      this.load.image("tutorial_04", "assets/ui-graphics/sprites/tutorial_04.png");
      this.load.image("tutorial_05", "assets/ui-graphics/sprites/tutorial_05.png");
      this.load.image("tab1", "assets/ui-graphics/sprites/tab1.png");
      this.load.image("tab2", "assets/ui-graphics/sprites/tab2.png");
      this.load.image("tab3", "assets/ui-graphics/sprites/tab3.png");
      this.load.image("tab4", "assets/ui-graphics/sprites/tab4.png");
      this.load.image("tab5", "assets/ui-graphics/sprites/tab5.png");
      this.load.image("tab6", "assets/ui-graphics/sprites/tab6.png");
      this.load.image("tab7", "assets/ui-graphics/sprites/tab7.png");
      this.load.image("tab8", "assets/ui-graphics/sprites/tab8.png");
      this.load.image("GJ_moveBtn", "assets/ui-graphics/sprites/GJ_moveBtn.png");
      this.load.image("GJ_moveSBtn", "assets/ui-graphics/sprites/GJ_moveSBtn.png");
      this.load.image("slidergroove2", "assets/ui-graphics/sprites/slidergroove2.png");
      this.load.image("macroBot", "assets/ui-graphics/sprites/macroBot.png");
      this.load.image("importMacro", "assets/ui-graphics/sprites/importMacro.png");
      this.load.image("playbackMacro", "assets/ui-graphics/sprites/playbackMacro.png");
      this.load.image("stopPlayback", "assets/ui-graphics/sprites/stopPlayback.png");
      this.load.image("recordMacro", "assets/ui-graphics/sprites/recordMacro.png");
      this.load.image("stopRecord", "assets/ui-graphics/sprites/stopRecord.png");

      for (let i = 1; i < 23; i++) {
        let index = i - 1;
        i = String(i);
        if (i.length < 2) i = "0" + i;
        let paddedIndex = String(index);
        if (paddedIndex.length < 2) paddedIndex = "0" + paddedIndex;
        this.load.image("groundSquare_" + paddedIndex + "_001.png", "assets/game-sprites/game-ground/groundSquare_" + i + "_001.png");
        this.load.image("groundSquare_" + paddedIndex + "_2_001.png", "assets/game-sprites/game-ground/groundSquare_" + i + "_2_001.png");
      }

      for (let i = 1; i < 60; i++) {
        let index = i - 1;
        i = String(i);
        if (i.length < 2) i = "0" + i;
        this.load.image("game_bg_" + index, "assets/game-sprites/game-bg/game_bg_" + i + "_001-hd.png");
      }

      this.load.audio("menu_music", "assets/sound/music/menuLoop.mp3");
      this.load.audio("StayInsideMe", "assets/sound/music/StayInsideMe.mp3");
      this.load.audio("secretLoop", "assets/sound/music/secretLoop.mp3");
      this.load.audio("secretLoop2", "assets/sound/music/secretLoop02.mp3");

      /*for (const lvlarray of window.allLevels) {
        this.load.text(lvlarray[2], "assets/levels/" + lvlarray[2].split("_")[1] + ".txt");
        this.load.audio(lvlarray[0], "assets/sound/music/" + (lvlarray[4] ? lvlarray[4] : lvlarray[1].replaceAll(" ", "")) + ".mp3");
      }*/

      this.load.audio("explode_11", "assets/sound/sfx/explode_11.ogg");
      this.load.audio("endStart_02", "assets/sound/sfx/endStart_02.ogg");
      this.load.audio("gold02", "assets/sound/sfx/gold02.ogg");
      this.load.audio("playSound_01", "assets/sound/sfx/playSound_01.ogg");
      this.load.audio("quitSound_01", "assets/sound/sfx/quitSound_01.ogg");
      this.load.audio("highscoreGet02", "assets/sound/sfx/highscoreGet02.ogg");

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