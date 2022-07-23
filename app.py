from flask import Flask
from flask import render_template, jsonify
from flask import request
from flask_socketio import SocketIO
import os
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


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/log/<mode>", methods=['POST'])
def log(mode):
    message = request.form.get('message')
    if mode == "debug":
        print("DEBUG: ", message)
    elif mode == "error":
        print("ERROR: ", message)
    else:
        print(message)
    return "ok"


@app.route("/download", methods=['POST'])
def download():
    url = request.form.get('url')
    quality = request.form.get('quality')

    qualities = {
        '240p': 'bestvideo[height<=240]+bestaudio/best[height<=240]',
        '360p': 'bestvideo[height<=360]+bestaudio/best[height<=360]',
        '480p': 'bestvideo[height<=480]+bestaudio/best[height<=480]',
        '720p': 'bestvideo[height<=720]+bestaudio/best[height<=720]',  # 22
        '1080p': 'bestvideo[height<=1080]+bestaudio/best[height<=1080]',
        '1440p': 'bestvideo[height<=1440]+bestaudio/best[height<=1440]',
        '2160p': 'bestvideo[height<=2160]+bestaudio/best[height<=2160]'
    }
    if quality != 'audio':
        os.system(
            f"""youtube-dl -F "{qualities[quality]}" "{url}" --verbose""")
    else:
        os.system(
            f"""youtube-dl "{url}" -f "bestaudio/best" -ciw --extract-audio --audio-quality 0 --audio-format mp3 --verbose """)

    return "done"


@app.route("/add/url", methods=['POST'])
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
