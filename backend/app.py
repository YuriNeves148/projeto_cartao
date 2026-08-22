from flask import Flask, request, render_template
from flask_cors import CORS

from routes.compra import compra_bp
from routes.home import home_bp
from routes.criacao import criacao_bp
from routes.individual import individual_db
from routes.login import login_db
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)
CORS(app)


app.register_blueprint(compra_bp)
app.register_blueprint(home_bp)
app.register_blueprint(criacao_bp)
app.register_blueprint(individual_db)
app.register_blueprint(login_db)

@app.route("/")
def login():
    return render_template("login.html")

@app.route("/app")
def pagina_principal():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)