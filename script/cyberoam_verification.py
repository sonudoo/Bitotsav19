import json
import ssl
from urllib.parse import quote_plus, urlencode
from urllib.request import Request, urlopen

import requests
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from pymongo import MongoClient

app = Flask(__name__, static_url_path="")
CORS(app)

dbPass = quote_plus("Bitotsav2019!@")
dbName = quote_plus("bitotsav")

url = "https://172.16.1.1:8090/login.xml"
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def getDb():
    client = MongoClient(
        f"mongodb://{dbName}:{dbPass}@bitotsav.in:27017/bitotsav?authSource=bitotsav"
    )
    db = client.get_database()
    return db


def login():
    # Enter cyberoam credential here
    username = "YOUR_USERNAME_HERE"
    password = "YOUR_PASSWORD_HERE"
    data = {"username": username, "password": password, "mode": "191"}
    res = str(urlopen(Request(url, urlencode(data).encode()), context=ctx).read())


def logout(username):
    data = {"username": username, "mode": "193"}
    res = str(urlopen(Request(url, urlencode(data).encode()), context=ctx).read())


def verifyCredentials(username, password):
    data = {"username": username, "password": password, "mode": "191"}
    res = str(urlopen(Request(url, urlencode(data).encode()), context=ctx).read())

    if (
        len(res.split("<message><![CDATA[You have successfully logged in]]></message>"))
        > 1
    ):
        # Login successful
        logout(username)
        login()
        return True
    else:
        return False


def authenticateParticipant(email, password):
    url = "https://bitotsav.in/api/app/login"

    payload = {"email": str(email), "password": str(password)}
    headers = {"Content-Type": "application/json"}

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        return True
    else:
        return False


def isDigit(char):
    if ord("0") <= ord(char) and ord(char) <= ord("9"):
        return True
    else:
        return False


def getFirstLastFromString(value):
    first = ""
    last = ""
    for char in value:
        if isDigit(char):
            first += char
            if len(first) == 5:
                break
        else:
            first = ""
    for char in reversed(value):
        if isDigit(char):
            last = char + last
            if len(last) == 2:
                break
        else:
            last = ""
    return (first, last)


# endpoint to root
@app.route("/", methods=["GET"])
def home():
    return app.send_static_file("index.html")


@app.route("/verifyParticipant", methods=["POST"])
def verifyParticipant():
    request_json = request.json
    try:
        email = request_json["email"]
        bitotsavPassword = request_json["bitotsavPassword"]
        username = request_json["username"]
        cyberoamPassword = request_json["cyberoamPassword"]
    except:
        return jsonify({"success": False, "msg": "All parameters not present"}), 400

    # Authenticate user through /login
    if not authenticateParticipant(email, bitotsavPassword):
        return (
            jsonify({"success": False, "msg": "Incorrect email and/or password"}),
            403,
        )

    db = getDb()
    participant = db.get_collection("participants").find_one({"email": email})
    if participant is None:
        return jsonify({"success": False, "msg": "User not found"}), 404
    if (
        participant["payment"]["day1"] == True
        and participant["payment"]["day3"] == True
        and participant["payment"]["day3"] == True
    ):
        return jsonify({"success": False, "msg": "Participant already verified"}), 408
    participantRoll = participant["rollno"]
    rollFirst, rollLast = getFirstLastFromString(participantRoll)
    userFirst, userLast = getFirstLastFromString(username)

    if not (userFirst == rollFirst and userLast == rollLast):
        return jsonify({"success": False, "msg": "Cannot match roll number"}), 403

    # print(participantRoll)
    if verifyCredentials(username, cyberoamPassword):
        # Verified
        try:
            # print("Updating db..")
            getDb().get_collection("participants").update_one(
                {"email": email},
                {
                    "$set": {
                        "payment.day1": True,
                        "payment.day2": True,
                        "payment.day3": True,
                        "paymemt.accommodation": True
                    }
                },
            )
            # print("Db updated..")
            return jsonify({"success": True}), 200
        except Exception as e:
            # print(e)
            return jsonify({"success": False, "msg": "Something went wrong."}), 502
    else:
        return (
            jsonify({"success": False, "msg": "Could not verify cyberoam credentials"}),
            403,
        )
    return jsonify(participantRoll)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
