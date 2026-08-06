from flask import Flask
from flask_cors import CORS

from routes.compra import compra_bp
from routes.home import home_bp
from routes.criacao import criacao_bp
from routes.individual import individual_db
from routes.raiz import raiz_db

app = Flask(__name__)
CORS(app)

app.register_blueprint(compra_bp)
app.register_blueprint(home_bp)
app.register_blueprint(criacao_bp)
app.register_blueprint(individual_db)
app.register_blueprint(raiz_db)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)