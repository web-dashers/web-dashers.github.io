
> [!NOTE]
> This project is still in development, and is not yet complete. Please be patient with us as we work on it, and please report any bugs you find to the Discord server (specifically on the #`bug-report` forum) or the Issues page on this repository. Thank you for your support!

<div align="center">
  <img  
  alt="Web Dashers" 
  src="./wd_branding/wordmark/wordmark_1080.png" 
  />
  <p>
  <strong>A modded Geometry Dash demo with extra features added!</strong>
  </p>
  <img 
    width="279" 
    height="89" 
    alt="PlayOnline" 
    src="https://github.com/user-attachments/assets/830fc500-f289-4b96-9686-4fbb5b9af3f5" 
    />
  &nbsp;
  <a 
  href="https://discord.gg/h6xYNUBFnq" 
  target="_blank">
    <img 
    width="279" 
    height="89" 
    alt="JoinTheDiscord" 
    src="https://github.com/user-attachments/assets/285a9de1-e72a-491a-9dd4-3d31887e73b2" 
    />
  </a>
</div>

---

## Features currently implemented:
- **Main Menu** - A mostly fully working main menu with all 2.1 levels.
- **Online Levels** - You can play online levels, and create your own!
- **Icon Kit** - A working Icon Kit with different colors and icons to choose from! (Currently not including 2.2 icons.)
- **Different Gamemodes** - Just about every gamemode is implemented currently, with the exception of the Swing.
- **Extra Settings** - You can enable and disable things like Noclip or Show Hitboxes from the settings menu, along with other settings, like the level percentage!

## Things currently in development:
- **Practice Mode** - Although an early version of Practice mode is already in the game, we hope to make a completely working Practice Mode with no bugs at all.
- **Level Editor** - We wish to add a fully working level editor, with all of the objects in Geometry Dash to choose from, and more! Currently, the editor is very run down and still needs a big amount of it's features to be added.
- **Slopes** - Slopes are almost done, but we need to get their physics correct with other speed portals. 

<sub> beg pinkdev to please finish slopes faster he is taking too long<sub>

## What we hope to see added in the future:
- **All Gamemodes** - Currently, every gamemode except the Swing has been implemented. There is a chance it will, and will not be added.
- **All Objects Working** - In the current state of Web Dashers, you might notice some objects seem to be bugged, such as a lack of animations, and coloring being incorrect.

### Come try out the WIP Web Dashers demo at:
**Web Dashers on Base44** — open the app in your Base44 workspace and play it from its preview link (the app is served on port 3000).

## Hosting

Web Dashers is hosted on **Base44**. The platform runs this repository through
[`docker-compose.base44.yml`](./docker-compose.base44.yml), a static development
server on port 3000 that reads the clone from disk (see [`AGENTS.md`](./AGENTS.md)),
and exposes it as the app's preview link. There is no GitHub Pages deployment any
more: the embed metadata in `index.html` is relative, and the game's scripts talk to
their own origin instead of a hardcoded hosted backend.

### Firebase Hosting (public site)

The repository is also configured for [Firebase Hosting](https://firebase.google.com/docs/hosting)
so the game can be published as a real public site: [`firebase.json`](./firebase.json)
serves the repository root (`index.html` + `assets/`) with the same caching policy as
the Base44 dev server — media cached for a few minutes, scripts and level data
revalidated, markup never cached — and keeps the repo's own tooling files out of the
upload. [`.firebaserc`](./.firebaserc) holds the project id (`web-dashers` by default;
change it to your own project, since Firebase project ids are globally unique).

```sh
npx firebase-tools login
npx firebase-tools use --add          # create or pick the project
npx firebase-tools deploy --only hosting
```

The site is then served at `https://<project-id>.web.app`. Three things to know:

- Hosting serves static files only: there is no `/api`, so `/api/auth/*` and
  `/api/saves` do not exist on it and the game runs signed out with local saves, the
  same way it behaves in the preview. A real account backend has to be deployed
  separately and pointed at from `assets/scripts/utils/api-config.js`.
- A cold load pulls ~27 MB of textures and music. Firebase's free Spark plan caps
  transfer (about 360 MB/day when this was written), which is roughly a dozen full
  loads, so busy periods need Blaze (pay as you go) or lighter assets.
- Once the public address is settled, update the anti-clone notice in
  `assets/scripts/core/loading-screen.js` (see [`AGENTS.md`](./AGENTS.md)).

Two `web-dashers.github.io` references remain and are not hosting dependencies: the
GitHub repository link in the game's social footer (the repository is actually named
that) and the anti-clone notice in `assets/scripts/core/loading-screen.js`, which
tells players framed by a clone site where the official game lives. Update that
notice with the project's final public address when it is settled.

The account / cloud-save API (`/api/auth/*`, `/api/saves`) is a separate service and
is **not** part of this repository. Where it is not deployed, the preview answers
those routes locally and the game runs fully, signed out, with local saves.

<sub> Last updated: 8/7/2026

---
> - <sub>Special thanks to all of the people that help the project by contributing, and Please support us by starring the repo, as it helps us out a ton!!<sub>
> - <sub>Also, please report bugs found to the Discord server or the Issues page on github, just please dont be annoying about it, and don't make bug reports about bugs already being worked on or ones that are already known about.<sub>
