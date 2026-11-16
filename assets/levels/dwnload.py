import requests

headers = {
    "User-Agent": ""
}

levelid = LEVELID
data = {
    "levelID": levelid,
    "secret": "Wmfd2893gb7"
}

url = "https://www.boomlings.com/database/downloadGJLevel22.php"

req = requests.post(url=url, data=data, headers=headers)
with open("assets/levels/"+str(levelid) + ".txt", "w") as f:
    f.write(req.text.split(":4:")[1].split(":")[0])