from flask import Flask
from flask import render_template, jsonify
from flask import request
from flask_socketio import SocketIO

from youtubesearchpython import VideosSearch
from youtube_dl import YoutubeDL

app = Flask(__name__)


class Utils:
    def getVideInfo(url):
        result = {}

        result['count'] = 1

        # YoutubeDL - Get basic info
        youtube_dl_opts = {'verbose': True}
        with YoutubeDL(youtube_dl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=False)
            result['url'] = url
            result['id'] = info_dict.get("id", None)
            result['title'] = info_dict.get('title', None)

        # If a youtube video - Get Information
        if ('youtube.com' in result['url']) or ('youtu.be' in result['url']):
            result['site'] = 'youtube'
            data = VideosSearch(result['title'], limit=1)
            res = data.result()['result']
            video = res[0]
            result['published'] = video['publishedTime']
            result['duration'] = video['duration']
            result['duration_human'] = video['accessibility']['duration']
            result['views'] = video['viewCount']['text']
            result['thumbnail'] = video['thumbnails'][-1]['url']
            result['description'] = video['descriptionSnippet'][0]['text']
            result['by'] = {}
            result['by']['name'] = video['channel']['name']
            result['by']['id'] = video['channel']['id']
            result['by']['image'] = video['channel']['thumbnails'][0]['url']

        return result


@ app.route("/")
def index():
    return render_template("index.html")


@ app.route("/log/<mode>", methods=['POST'])
def log(mode):
    message = request.form.get('message')
    if mode == "debug":
        print("DEBUG: ", message)
    elif mode == "error":
        print("ERROR: ", message)
    else:
        print(message)
    return "ok"


@ app.route("/add/url", methods=['POST'])
def add_url():
    url = request.form.get('url')
    result = Utils.getVideInfo(url=url)
    return jsonify(result)


if __name__ == "__main__":
    app.run(
        '0.0.0.0',
        port=8090,
        debug=True
    )
