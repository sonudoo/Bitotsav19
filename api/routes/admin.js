const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../setup').db;
const jwt = require('jsonwebtoken');
const secretKey = require('../setup').secretKey;
const adminPassword = "10204";
const router = express.Router();

router.post('/login', (req, res) => {
    if (req.body.username === "admin" && req.body.password === adminPassword) {
        return res.send(JSON.stringify({
            success: true,
            token: jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
                data: {
                    username: "admin",
                    password: adminPassword,
                    key: secretKey
                }
            }, secretKey)
        }));

    }
    else {
        return res.send(JSON.stringify({
            success: false
        }));
    }
});

router.post('/verifyToken', (req, res) => {
    if (req.body.token == undefined) {
        res.send(JSON.stringify({
            success: false
        }));
    }
    else {
        jwt.verify(req.body.token, secretKey, function (error, data) {
            if (error) {
                res.send(JSON.stringify({
                    success: false
                }));
            }
            else {
                data = data.data;
                if (data.username != "admin" || data.password != adminPassword || data.key != secretKey) {
                    res.send(JSON.stringify({
                        success: false
                    }));
                }
                else {
                    res.send(JSON.stringify({
                        success: true
                    }));
                }
            }
        })
    }
});

const checkToken = function (req, res, next) {
    if (req.body.token == undefined) {
        return res.sendStatus(403);
    }
    else {
        jwt.verify(req.body.token, secretKey, function (error, data) {
            if (error) {
                return res.sendStatus(403);
            }
            else {
                data = data.data;
                if (data.username != "admin" || data.password != adminPassword || data.key != secretKey) {
                    return res.sendStatus(403);
                }
                else{
                    next();
                }
            }
        })
    }
}

router.use(checkToken);

router.post('/getAllEvents', (req, res) => {
    db.events.find({}, function (error, result) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                error: error
            }));
        }
        else {
            res.send(JSON.stringify(result));
        }
    });
});

router.post('/getEventById', (req, res) => {
    if (req.body.eventId == undefined) {
        return res.sendStatus(403);
    }
    db.events.find({ eventId: parseInt(req.body.eventId) }, function (error, result) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                error: "An unknown error occured"
            }));
        }
        else {
            if (result.length != 1) {
                return res.sendStatus(404);
            }
            else {
                return res.send(JSON.stringify(result[0]));
            }
        }
    });
});

router.post('/addEvent', (req, res) => {
    db.events.find({}, function (error, result) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                error: "An unknown error occured"
            }));
        }
        else {
            req.body.eventId = result.length + 1;
            db.events.insert(req.body.addEventData, function (error, result) {
                if (error) {
                    res.send(JSON.stringify({
                        success: false,
                        error: error
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
});

router.post('/updateEvent', (req, res) => {
    if (req.body.eventId == undefined) {
        return res.sendStatus(403);
    }
    db.events.update({ eventId: parseInt(req.body.eventId) }, { $set: req.body.updateEventData }, function (error, result) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                error: "An unknown error occured"
            }));
        }
        else {
            return res.send(JSON.stringify({
                success: true
            }));
        }
    });
});

router.post('/getAllSAPS', (req, res) => {
    db.saps.find({verified: true}, function (error, result) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                error: error
            }));
        }
        else {
            res.send(JSON.stringify(result));
        }
    });
});

router.post('/getSAPById', (req, res) => {
    if (req.body.id == undefined) {
        return res.sendStatus(403);
    }
    db.saps.find({ id: parseInt(req.body.id) }, function (error, result) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                error: "An unknown error occured"
            }));
        }
        else {
            if (result.length != 1) {
                return res.sendStatus(404);
            }
            else {
                return res.send(JSON.stringify(result[0]));
            }
        }
    });
});

module.exports = router;