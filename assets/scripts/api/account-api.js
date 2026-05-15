window.AccountAPI = {
  currentUser: null,

  _url(path) {
    return `${window._apiBase}${path}`;
  },

  async checkSession() {
    try {
      const res = await fetch(this._url('/api/auth/me'), { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        this.currentUser = data.user;
      } else {
        this.currentUser = null;
      }
    } catch {
      this.currentUser = null;
    }
    return this.currentUser;
  },

  async login(username, password) {
    const res = await fetch(this._url('/api/auth/login'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    this.currentUser = data.user;
    return data.user;
  },

  async register(username, email, password) {
    const res = await fetch(this._url('/api/auth/register'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email: email || undefined, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    this.currentUser = data.user;
    return data.user;
  },

  async logout() {
    try {
      await fetch(this._url('/api/auth/logout'), { method: 'POST', credentials: 'include' });
    } catch {}
    this.currentUser = null;
  },

  async getCloudSave() {
    const res = await fetch(this._url('/api/saves'), { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load save');
    return data.save;
  },

  async setCloudSave(saveData) {
    const res = await fetch(this._url('/api/saves'), {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ save: saveData }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save');
  },

  collectLocalData() {
    const keys = [
      'gd_settings', 'gd_totalAttempts', 'gd_totalJumps', 'gd_totalDeaths',
      'gd_completedLevels', 'created_levels', 'iconMainColor', 'iconSecondaryColor',
      'iconCurrentPlayer', 'iconCurrentShip', 'iconCurrentBall', 'iconCurrentWave',
      'iconCurrentSpider', 'iconCurrentBird', 'userMusicVol', 'userSfxVol',
      'menuMusicEnabled',
    ];
    const save = {};
    for (const key of keys) {
      const val = localStorage.getItem(key);
      if (val !== null) save[key] = val;
    }
    const bestPercents = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('bestPercent_') || k.startsWith('practiceBestPercent_'))) {
        bestPercents[k] = localStorage.getItem(k);
      }
    }
    save._bestPercents = bestPercents;
    return save;
  },

  applyLocalData(save) {
    if (!save) return;
    const keys = [
      'gd_settings', 'gd_totalAttempts', 'gd_totalJumps', 'gd_totalDeaths',
      'gd_completedLevels', 'created_levels', 'iconMainColor', 'iconSecondaryColor',
      'iconCurrentPlayer', 'iconCurrentShip', 'iconCurrentBall', 'iconCurrentWave',
      'iconCurrentSpider', 'iconCurrentBird', 'userMusicVol', 'userSfxVol',
      'menuMusicEnabled',
    ];
    for (const key of keys) {
      if (save[key] !== undefined) localStorage.setItem(key, save[key]);
    }
    if (save._bestPercents) {
      for (const [k, v] of Object.entries(save._bestPercents)) {
        localStorage.setItem(k, v);
      }
    }
  },
};

// Check session silently on page load so currentUser is populated before
// the player opens the settings screen.
window.AccountAPI.checkSession().catch(() => {});
