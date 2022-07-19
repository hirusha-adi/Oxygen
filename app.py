from flask import Flask, render_template, request
app = Flask(__name__)


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


if __name__ == "__main__":
    app.run(
        '0.0.0.0',
        port=8090,
        debug=True
    )
