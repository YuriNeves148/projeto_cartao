from flask import Flask, request, jsonify
from flask import Blueprint

raiz_db = Blueprint("raiz", __name__)

@raiz_db.route("/")
def raiz():
    retorno = {"raiz":"pasta raiz"}
    print(retorno)
    return jsonify(retorno)

if __name__ == "__main__":
    app.run(debug=True, port=5000) 