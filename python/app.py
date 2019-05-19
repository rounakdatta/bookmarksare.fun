from flask import Flask, render_template, request, send_file, flash, redirect, session, abort, url_for, jsonify
import json
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

def cookieParser(cookieJsonArray=[]):
    cookies = ""
    for item in cookieJsonArray:
        cookies += item['name'] + "=" + item['value'] + "; "
    
    return cookies

def headersConstructor(cookies="", extraParams={}):
    headers = {}
    headers['cookie'] = cookies
    headers['accept-language'] = 'en-US,en;q=0.9'
    headers['user-agent'] = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36'
    headers['accept-encoding'] = 'gzip, deflate, br'

    for paramKey, paramVal in extraParams.items():
        headers[paramKey] = paramVal

    return headers


@app.route('/', methods=['GET'])
def index():
    return 'OK'

@app.route('/send/medium/cookie/json', methods=['GET', 'POST'])
def sentMediumCookieJson():
    if request.method == 'GET':
        return render_template('cookieReceiver.html', web='medium')

    mediumCookieJsonArray = json.loads(request.form['mediumCookie'])
    mediumHeaderDict = headersConstructor(cookieParser(mediumCookieJsonArray), {
        "referer": "https://medium.com/",
        "authority": "medium.com",
        "accept": "application/json",
        "content-type": "application/json",
        "x-obvious-cid": "web"
    })

    mediumPrivateBookmarksUrl = "https://medium.com/me/list/bookmarks"
    mediumBookmarksResultsJson = requests.request("GET", mediumPrivateBookmarksUrl, headers=mediumHeaderDict)

    print(mediumBookmarksResultsJson.text)
    
    return 'mediumProcessed'

@app.route('/send/quora/cookie/json', methods=['GET', 'POST'])
def sentQuoraCookieJson():
    if request.method == 'GET':
        return render_template('cookieReceiver.html', web='quora')

    quoraCookieJsonArray = json.loads(request.form['quoraCookie'])
    quoraHeaderDict = headersConstructor(cookieParser(quoraCookieJsonArray), {
        "authority": "www.quora.com",
        'upgrade-insecure-requests': "1",
        'accept': "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        'referer': "https://www.quora.com/",
        'Host': "www.quora.com",
        'Connection': "keep-alive"
    })

    quoraPrivateBookmarksUrl = "https://www.quora.com/bookmarks"
    quoraBookmarksResultsJson = requests.request("GET", quoraPrivateBookmarksUrl, headers=quoraHeaderDict)

    print(quoraBookmarksResultsJson.text)
    
    return 'quoraProcessed'

@app.route('/send/pocket/cookie/json', methods=['GET', 'POST'])
def sentPocketCookieJson():
    if request.method == 'GET':
        return render_template('cookieReceiver.html', web='pocket')

    pocketCookieJsonArray = json.loads(request.form['pocketCookie'])
    pocketHeaderDict = headersConstructor(cookieParser(pocketCookieJsonArray), {
        'Referer': "https://getpocket.com/a/queue/",
        'Accept': "application/json, text/javascript, */*; q=0.01",
        'Origin': "https://getpocket.com",
        'X-Requested-With': "XMLHttpRequest",
        'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
        'Host': "getpocket.com",
        'content-length': "165",
        'Connection': "keep-alive"
    })

    pocketPrivateBookmarksUrl = "https://getpocket.com/a/x/get.php"
    pocketPayload = "offset=0&count=10000&state=queue&favorite=&sort=oldest&search=&tag=&view=grid&appsInfo=summary&forcegroups=1&forceshares=1&formCheck=5a64869717157b51a2bb41dc51ba50f6"
    pocketBookmarksResultsJson = requests.request("POST", pocketPrivateBookmarksUrl, data=pocketPayload, headers=pocketHeaderDict)

    print(pocketBookmarksResultsJson.text)
    
    return 'pocketProcessed'

@app.route('/send/githubStars/cookie/json', methods=['GET', 'POST'])
def sentGithubStarsCookieJson():
    if request.method == 'GET':
        return render_template('cookieReceiver.html', web='githubStars')

    githubStarsUsername = request.form['githubStarsCookie']
    githubStarsHeaderDict = headersConstructor(extraParams={
        'Accept': "*/*",
        'Host': "api.github.com",
        'Connection': "keep-alive"
    })

    githubStarsPrivateBookmarksUrl = "https://api.github.com/users/{}/starred".format(githubStarsUsername)

    githubStarsJsonArray = []

    githubStarPageCounter = 1
    while True:
        githubStarsPayload = {"page": githubStarPageCounter}
        githubStarsBookmarksResultsJson = requests.request("GET", githubStarsPrivateBookmarksUrl, params=githubStarsPayload, headers=githubStarsHeaderDict)

        payloadJsonArray = json.loads(githubStarsBookmarksResultsJson.text)
        if payloadJsonArray == []:
            break
        
        for jsonItem in payloadJsonArray:
            githubStarsJsonArray.append(jsonItem)
        githubStarPageCounter += 1

    print(githubStarsJsonArray)
    
    return 'githubStarsProcessed'

@app.route('/send/gistStars/cookie/json', methods=['GET', 'POST'])
def sentGistStarsCookieJson():
    if request.method == 'GET':
        return render_template('cookieReceiver.html', web='gistStars')

    gistStarsUsername = request.form['gistStarsCookie']
    gistStarsHeaderDict = headersConstructor(extraParams={
        'Accept': "*/*",
        'Host': "gist.github.com",
        'Connection': "keep-alive"
    })

    gistStarsPrivateBookmarksUrl = "https://gist.github.com/{}/starred".format(gistStarsUsername)

    gistStarsArray = []

    gistStarsPageCounter = 1
    while True:
        gistStarsPayload = {"page": gistStarsPageCounter}
        gistStarsBookmarksResultsJson = requests.request("GET", gistStarsPrivateBookmarksUrl, params=gistStarsPayload, headers=gistStarsHeaderDict)

        payloadSoup = BeautifulSoup(gistStarsBookmarksResultsJson.text, features="html.parser")
        allGists = payloadSoup.find_all("a", class_="link-overlay")
        
        if allGists == []:
            break

        for gist in allGists:
            gistStarsArray.append(gist)
        gistStarsPageCounter += 1

    print(gistStarsArray)
    
    return 'gistStarsProcessed'

@app.route('/send/bookmarks/cookie/json', methods=['GET', 'POST'])
def sentBookmarksCookieJson():
    if request.method == 'GET':
        return render_template('cookieReceiver.html', web='bookmarks')

    retrievalStatus = False
    processingStatus = False

    try:
        bookmarkFile = request.files['file']
        retrievalStatus = True
    except Exception as e:
        retrievalStatus = e

    try:
        bookmarkSoup = BeautifulSoup(bookmarkFile.read(), features='html.parser')
        allBookmarks = bookmarkSoup.find_all("a")
        processingStatus = True
    except Exception as e:
        processingStatus = e
    
    return jsonify({"retrival": retrievalStatus, "processing": processingStatus})

if __name__ == '__main__':
    app.run(port=1234, debug=True)