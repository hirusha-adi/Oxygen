from flask import Flask, render_template
app = Flask()


@app.roue("/")
def index():
    render_template("index.html")


app.run()
