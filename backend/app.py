from flask import Flask
from flask_cors import CORS

from routes.compra import compra_bp
from routes.home import home_bp
from routes.criacao import criacao_bp
from routes.fatura import fatura_db

app = Flask(__name__)
CORS(app)

app.register_blueprint(compra_bp)
app.register_blueprint(home_bp)
app.register_blueprint(criacao_bp)
app.register_blueprint(fatura_db)

if __name__ == "__main__":
    app.run(debug=True)