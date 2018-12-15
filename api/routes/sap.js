'use strict';

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const request = require("request");
const secretKey = require('../setup').secretKey;
const db = require('../setup').db;

router.post('/sap', (req, res) => {
    req.checkBody('name', 'Incorrect Name Entered').matches(/^[a-zA-Z .]+$/, "i");
    req.checkBody('email', 'Incorrect Email Entered').matches(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "i");
    req.checkBody('phno', 'Phone numbers must be exactly 10 digits long').matches(/[0-9]{10}/, "i");
    req.checkBody('college', 'Phone numbers must be exactly 10 digits long').matches(/^[a-zA-Z .,]+$/, "i");
    if (req.body.q1 == "" ||
        req.body.q2 == "" ||
        req.body.q3 == "" ||
        req.body.q4 == "" ||
        req.body.q5 == "" ||
        req.body.q1 == undefined ||
        req.body.q2 == undefined ||
        req.body.q3 == undefined ||
        req.body.q4 == undefined ||
        req.body.q5 == undefined) {
        res.send(JSON.stringify({
            success: false,
            error: "Missing answers"
        }));
    }
    else if (req.validationErrors()) {
        let result = {
            success: false,
            error: req.validationErrors()
        };
        res.send(JSON.stringify(result));
    }
    else {
        var recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
        recaptcha_url += "secret=" + "6LcW6YEUAAAAAGeeSe5bs4TJKaoItsig6vPTHoNm" + "&";
        recaptcha_url += "response=" + req.body["g-recaptcha-response"] + "&";
        recaptcha_url += "remoteip=" + req.connection.remoteAddress;
        request(recaptcha_url, function (error, resp, body) {
            body = JSON.parse(body);
            if (body.success !== undefined && !body.success) {
                return res.send(JSON.stringify({
                    success: false,
                    error: "Captcha validation failed"
                }));
            }
            else {
                db.sap.insert({
                    name: req.body.name,
                    email: req.body.email,
                    phno: req.body.phno,
                    college: req.body.college,
                    q1: req.body.q1,
                    q2: req.body.q2,
                    q3: req.body.q3,
                    q4: req.body.q4,
                    q5: req.body.q5
                }, function (error, result) {
                    if (error) {
                        res.send(JSON.stringify({
                            success: false,
                            msg: error.toString()
                        }));
                    }
                    else {
                        res.send(JSON.stringify({
                            success: true
                        }));
                    }
                });
            }
        });
    }
});

module.exports = router;