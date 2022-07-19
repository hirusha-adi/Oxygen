from flask import Flask, render_template, request
app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/log/debug", methods=['POST'])
@app.route("/log/error", methods=['POST'])
def log_debug():
    message = request.form.get('message')
    print(message)
    return "ok"


if __name__ == "__main__":
    app.run('0.0.0.0', port=8090, debug=True)
