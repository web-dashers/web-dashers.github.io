// Helper for robust fetch with error handling and user feedback
async function safeFetch(url, options, errorMsg) {
	try {
		const res = await fetch(url, options);
		if (!res.ok) throw new Error(`${errorMsg} (status ${res.status})`);
		return res;
	} catch (err) {
		alert(errorMsg + '\n' + (err.message || err));
		throw err;
	}
}

function getProxyCandidates() {
	const candidates = [];
	if (window._gdProxyUrl) {
		candidates.push(window._gdProxyUrl.replace(/\/$/, ""));
	}
	if (Array.isArray(window._gdFallbackProxyUrls)) {
		for (const url of window._gdFallbackProxyUrls) {
			if (url) candidates.push(url.replace(/\/$/, ""));
		}
	}
	return [...new Set(candidates)];
}

async function proxyFetch(path, options, errorMsg) {
	const proxies = getProxyCandidates();
	if (!proxies.length) {
		throw new Error(errorMsg + " No proxy is configured.");
	}
	let lastError;
	for (const proxy of proxies) {
		const url = proxy + path;
		try {
			const res = await fetch(url, options);
			if (!res.ok) throw new Error(`${errorMsg} (HTTP ${res.status})`);
			return res;
		} catch (err) {
			lastError = err;
		}
	}
	throw lastError || new Error(errorMsg);
}

window.ApiWrapper = class ApiWrapper {
	static setProxy(string) {
		this.proxyurl = string
	}
	static getProxy() {
		return this.proxyurl;
	}
	static async downloadSong(id) {
		let data = `songID=${id}&secret=Wmfd2893gb7`;
		const proxy = (window._gdProxyUrl || "").replace(/\/$/, "");
		if (!proxy) {
			throw new Error("No song proxy configured.");
		}
		let response = await safeFetch(proxy + "/getGJSongInfo.php", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: data
}, "Failed to fetch song info from server.");
		let text = await response.text();
		let url = decodeURIComponent(text?.split("~|~10~|")[1]?.split("~|~")[0]);
		let audioresponse = await safeFetch(url, {}, "Failed to fetch song audio.");
		let blob = await audioresponse.blob();
		return window.URL.createObjectURL(blob);
	}
	static async downloadSfx(id){
		let audioresponse = await safeFetch("https://geometrydashfiles.b-cdn.net/sfx/s"+id+".ogg", {}, "Failed to fetch SFX.");
		let blob = await audioresponse.blob();
		return window.URL.createObjectURL(blob);
	}
	static async downloadLevel(id) {
		console.log("DOWNLOAD LEVEL CALLED WITH ID:", id);
		let data = `levelID=${id}&inc=1&extras=1&secret=Wmfd2893gb7`;
	let response = await proxyFetch("/downloadGJLevel22.php", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
	 "User-Agent": ""
  },
  body: data
}, "Failed to fetch level data from server.");
		let text = await response.text();
		console.log("LEVEL RAW:", text);

		
function parseresponse(text) {
    const data = {};
    let i = 0;

    while (i < text.length) {
        let keyEnd = text.indexOf(":", i);
        if (keyEnd === -1) break;

        let key = text.substring(i, keyEnd);
        i = keyEnd + 1;

        let valueEnd = text.indexOf(":", i);

        // handle last value correctly
        if (valueEnd === -1) {
            data[key] = text.substring(i);
            break;
        }

        data[key] = text.substring(i, valueEnd);
        i = valueEnd + 1;
    }

    return data;
}

		let parsed = parseresponse(text);
		return new LevelObject(parsed["1"], parsed["2"], parsed["3"] ? atob(parsed["3"]) : "", parsed["4"], parsed["5"], parsed["6"], parsed["8"], parsed["9"], parsed["10"], parsed["11"], parsed["12"], parsed["13"], parsed["14"], parsed["15"], parsed["16"], parsed["17"] === "1", parsed["18"], parsed["19"], parsed["25"] === "1", parsed["26"], parsed["27"], parsed["28"], parsed["29"], parsed["30"], parsed["31"] === "1", parsed["35"], parsed["36"], parsed["37"], parsed["38"] === "1", parsed["39"], parsed["40"] === "1", parsed["41"], parsed["42"], parsed["43"], parsed["44"] === "1", parsed["45"], parsed["46"], parsed["47"], parsed["48"], parsed["52"]?.split(",") || [], parsed["53"]?.split(",") || [], parsed["54"], parsed["57"]);
	}
}


class LevelObject {
	constructor(levelID, levelName, description, levelString, version, playerID, difficultyDenominator, difficultyNumerator, downloads, setCompletes, officialSong, gameVersion, likes, levelLength, dislikes, demon, stars, featureScore, auto, recordString, password, uploadDate, updateDate, copiedID, twoPlayer, customSongID, extraString, coins, verifiedCoins, starsRequested, lowDetailMode, dailyNumber, epic, demonDifficulty, isGauntlet, objects, editorTime, editorTimeCopies, settingsString, songIDs, sfxIDs, songSize, verificationTime) {
		this.levelID = levelID;
		this.levelName = levelName;
		this.description = description;
		this.levelString = levelString;
		this.version = version;
		this.playerID = playerID;
		this.difficultyDenominator = difficultyDenominator;
		this.difficultyNumerator = difficultyNumerator;
		this.downloads = downloads;
		this.setCompletes = setCompletes;
		this.officialSong = officialSong;
		this.gameVersion = gameVersion;
		this.likes = likes;
		this.levelLength = levelLength;
		this.dislikes = dislikes;
		this.demon = demon;
		this.stars = stars;
		this.featureScore = featureScore;
		this.auto = auto;
		this.recordString = recordString;
		this.password = password;
		this.uploadDate = uploadDate;
		this.updateDate = updateDate;
		this.copiedID = copiedID;
		this.twoPlayer = twoPlayer;
		this.customSongID = customSongID;
		this.extraString = extraString;
		this.coins = coins;
		this.verifiedCoins = verifiedCoins;
		this.starsRequested = starsRequested;
		this.lowDetailMode = lowDetailMode;
		this.dailyNumber = dailyNumber;
		this.epic = epic;
		this.demonDifficulty = demonDifficulty;
		this.isGauntlet = isGauntlet;
		this.objects = objects;
		this.editorTime = editorTime;
		this.editorTimeCopies = editorTimeCopies;
		this.settingsString = settingsString;
		this.songIDs = songIDs;
		this.sfxIDs = sfxIDs;
		this.songSize = songSize;
		this.verificationTime = verificationTime;
	}
}
