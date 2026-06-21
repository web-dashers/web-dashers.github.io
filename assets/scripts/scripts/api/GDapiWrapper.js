window.ApiWrapper = class ApiWrapper {
	static proxyurl = "https://proxy.corsfix.com/?"
	static setProxy(string) {
		this.proxyurl = string
	}
	static getProxy() {
		return this.proxyurl;
	}
	static async downloadSong(id) {
		let data = `songID=${id}&secret=Wmfd2893gb7`
		let response = await fetch(window._gdProxyUrl + "/getGJSongInfo.php", {
			method: "POST",
			body: data
		});
		let text = await response.text();
		let url = decodeURIComponent(text?.split("~|~10~|~")[1]?.split("~|~")[0]);
		let audioresponse = await fetch(this.proxyurl + url);
		let blob = await audioresponse.blob();
		return window.URL.createObjectURL(blob);
	}
    static async downloadSfx(id){
		let audioresponse = await fetch(this.proxyurl + "https://geometrydashfiles.b-cdn.net/sfx/s"+id+".ogg");
		let blob = await audioresponse.blob();
		return window.URL.createObjectURL(blob);
    }
	static async downloadLevel(id) {
		let data = `levelID=${id}&secret=Wmfd2893gb7`
		let response = await fetch(window._gdProxyUrl + "/downloadGJLevel22.php", {
			method: "POST",
			body: data
		});
		let text = await response.text();

		function parseresponse(text) {
			let parts = text.split(":");
			let data = {};

			for (let i = 0; i < parts.length; i += 2) {
				let key = parts[i];
				let value = parts[i + 1];
				data[key] = value;
			}
			return data;
		}
		let parsed = parseresponse(text);
		return new LevelObject(parsed["1"], parsed["2"], atob(parsed["3"] || ""), parsed["4"], parsed["5"], parsed["6"], parsed["8"], parsed["9"], parsed["10"], parsed["11"], parsed["12"], parsed["13"], parsed["14"], parsed["15"], parsed["16"], parsed["17"] === "1", parsed["18"], parsed["19"], parsed["25"] === "1", parsed["26"], parsed["27"], parsed["28"], parsed["29"], parsed["30"], parsed["31"] === "1", parsed["35"], parsed["36"], parsed["37"], parsed["38"] === "1", parsed["39"], parsed["40"] === "1", parsed["41"], parsed["42"], parsed["43"], parsed["44"] === "1", parsed["45"], parsed["46"], parsed["47"], parsed["48"], parsed["52"]?.split(",") || [], parsed["53"]?.split(",") || [], parsed["54"], parsed["57"]);
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
