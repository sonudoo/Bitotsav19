const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../setup').db;
const jwt = require('jsonwebtoken');
const secretKey = require('../setup').secretKey;
const adminPassword = "10204";
const request = require('request');
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
                else {
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
            req.body.addEventData.eventId = result.length + 1;
            req.body.addEventData.eventStatus = "Scheduled";
            req.body.addEventData.eventPosition1 = "NA";
            req.body.addEventData.eventPosition2 = "NA";
            req.body.addEventData.eventPosition3 = "NA";
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
    db.saps.find({ verified: true }, function (error, result) {
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


router.post('/getAllParticipants', (req, res) => {
    db.participants.find({ verified: true }, function (error, result) {
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

router.post('/getParticipantById', (req, res) => {
    if (req.body.id == undefined) {
        return res.sendStatus(403);
    }
    db.participants.find({ id: req.body.id }, function (error, result) {
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

router.post('/getTeamsList', (req, res) => {
    if (req.body.eventId == undefined) {
        return res.sendStatus(403);
    }
    db.teams.find({ eventId: parseInt(req.body.eventId) }, function (error, result) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                error: "An unknown error occured"
            }));
        }
        else {
            return res.send(JSON.stringify(result));
        }
    });
});

router.post('/sendSMS', (req, res) => {
    let url = `http://sms.digimiles.in/bulksms/bulksms?username=di78-pantheon&password=digimile&type=0&dlr=1&destination=${req.body.phno}&source=BITSAV&message=${req.body.msg}`;
    request(url, (error, response, body) => {
        if (error) {
            return res.send(JSON.stringify({
                success: false
            }));
        } else {
            return res.send(JSON.stringify({
                success: true
            }));
        }
    });
});

router.post('/resultAnnouncement', (req, res) => {
    if (req.body.eventId == undefined) {
        return res.sendStatus(403);
    }
    if (req.body.eventPosition1 == undefined) {
        return res.sendStatus(403);
    }
    if (req.body.eventPosition2 == undefined) {
        return res.sendStatus(403);
    }
    if (req.body.eventPosition3 == undefined) {
        return res.sendStatus(403);
    }
    db.events.find({ eventId: parseInt(req.body.eventId), eventPosition1: "NA", eventPosition2: "NA", eventPosition3: "NA" }, function(error, result){
        if (error) {
            res.send(JSON.stringify({
                success: false,
                error: "An unknown error occured"
            }));
        }
        else{
            if(result.length != 1){
                res.send(JSON.stringify({
                    success: false,
                    error: "The result for the event is already announced."
                }));
            }
            else{
                /**
                 * Need to include Points update, prize update and winning notifications to users which is refelcted in their panel as well.
                 */
                db.events.update({ eventId: parseInt(req.body.eventId), eventPosition1: "NA", eventPosition2: "NA", eventPosition3: "NA" },
                 { $set: {eventPosition1: req.body.eventPosition1, eventPosition2: req.body.eventPosition2, eventPosition3: req.body.eventPosition3 } }, function (error, result) {
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
            }
        }
    })
});

module.exports = router;