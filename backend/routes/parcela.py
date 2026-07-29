from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from flask import Blueprint

fatura_db = Blueprint("fatura", __name__)