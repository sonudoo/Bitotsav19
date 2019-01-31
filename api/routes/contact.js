const express = require('express');
const db = require('../setup').db;
const router = express.Router();
const request = require('request');

router.post("/add", (req, res) => {
    var recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
    recaptcha_url += "secret=" + "6LcW6YEUAAAAAGeeSe5bs4TJKaoItsig6vPTHoNm" + "&";
    recaptcha_url += "response=" + req.body["g-recaptcha-response"] + "&";
    recaptcha_url += "remoteip=" + req.connection.remoteAddress;
    request(recaptcha_url, function (error, resp, body) {
        body = JSON.parse(body);
        if (body.success !== undefined && !body.success) {
            return res.status(403).send(JSON.stringify({
                success: false,
                msg: "Captcha validation failed"
            }));
        }
        else {
            db.contact.insert({
                name: req.body.name,
                email: req.body.email,
                subject: req.body.subject,
                message: req.body.message
            }, function(error, result){
                if(error){
                    res.status(502).send(JSON.stringify({
                        success: false,
                        error: "Database fetch error occured"
                    }));
                }
                else{
                    res.status(200).send(JSON.stringify({
                        success: true
                    }));
                }
            });
        }
    });
});

module.exports = router;