const express = require('express');
const db = require('../setup').db;
const jwt = require('jsonwebtoken');
const secretKey = require('../setup').secretKey;
const adminPassword = "1020415";
const nodemailer = require('nodemailer');
const request = require('request');
const router = express.Router();

router.post('/login', (req, res) => {
    if (req.body.username === "admin" && req.body.password === adminPassword) {
        return res.send(JSON.stringify({
            success: true,
            token: jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 3),
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

router.post('/getAllFeeds', function (req, res) {
    db.announcements.find({}, function (error, result) {
        if (error) {
            res.status(502).send(JSON.stringify({
                success: false,
                error: "Database fetch error occured"
            }));
        }
        else {
            res.status(200).send(JSON.stringify(result));
        }
    });
});

router.post('/getAllBCTeams', function (req, res) {
    db.championships.find({}, function (error, result1) {
        if (error) {
            res.status(502).send(JSON.stringify({
                success: false,
                msg: "Database fetch error occured"
            }));
        }
        else {
            db.participants.find({ id: { $ne: "-1" } }, function (error, result2) {
                if (error) {
                    res.status(502).send(JSON.stringify({
                        success: false,
                        msg: "Database fetch error occured"
                    }));
                }
                else {
                    let map = {};
                    for (let i in result2) {
                        map[result2[i].id] = result2[i];
                    }
                    let result = [];
                    for (let i in result1) {
                        let tmp = {};
                        tmp['teamName'] = result1[i].teamName;
                        tmp['teamPoints'] = result1[i].teamPoints;
                        tmp.teamMembers = {};
                        for (let j in result1[i].teamMembers) {
                            tmp.teamMembers[result1[i].teamMembers[j].memberId] = map[result1[i].teamMembers[j].memberId].name;
                        }
                        result.push(tmp);
                    }
                    res.send(JSON.stringify(result));
                }
            })
        }
    })
});

router.post('/getBCTeamByName', function (req, res) {
    if (req.body.teamName == undefined) {
        return res.status(403).send(JSON.stringify({
            success: false,
            msg: "teamName is required"
        }))
    }
    db.championships.find({ teamName: req.body.teamName }, function (error, result1) {
        if (error) {
            res.status(502).send(JSON.stringify({
                success: false,
                msg: "Database fetch error occured"
            }));
        }
        else {
            if (result1.length != 1) {
                res.status(404).send(JSON.stringify({
                    success: false,
                    msg: "Team not found"
                }))
            }
            else {
                db.participants.find({ id: { $ne: "-1" } }, function (error, result2) {
                    if (error) {
                        res.status(502).send(JSON.stringify({
                            success: false,
                            msg: "Database fetch error occured"
                        }));
                    }
                    else {
                        let map = {};
                        for (let i in result2) {
                            map[result2[i].id] = result2[i];
                        }
                        let result = [];
                        for (let i in result1) {
                            let tmp = {};
                            tmp['teamName'] = result1[i].teamName;
                            tmp['teamPoints'] = result1[i].teamPoints;
                            tmp.teamMembers = {};
                            for (let j in result1[i].teamMembers) {
                                tmp.teamMembers[result1[i].teamMembers[j].memberId] = map[result1[i].teamMembers[j].memberId].name;
                            }
                            result.push(tmp);
                        }
                        res.send(JSON.stringify(result[0]));
                    }
                })
            }
        }
    })
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
            req.body.addEventData.eventPosition1 = {};
            req.body.addEventData.eventPosition2 = {};
            req.body.addEventData.eventPosition3 = {};
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
            let url = "https://fcm.googleapis.com/fcm/send";
            let headers = {
                "Content-Type": "application/json",
                "Authorization": "key=AAAAj8SmANU:APA91bF5PyTPMgTFL0kEKpfyGn-RFO0veqZRuJJfXxTODOgRwXALnLRymYhvMfB-NwoVm4i1E-AN_p9NLw8ifdYSPyUcu9w5wkzH7uUQOzYe0OCeZrAV5krsO7D05fVaVofDEJKCJzgY"
            }
            db.announcements.find({}, function (error, result) {
                if (error) {
                    res.send(JSON.stringify({
                        success: false,
                        msg: 'Database fetch error occured'
                    }));
                }
                else {
                    let timestamp = Date.now();
                    let data = {
                        id: result.length + 1,
                        title: "Update for " + req.body.updateEventData.eventName,
                        content: req.body.msg,
                        timestamp: timestamp,
                        type: "EVENT",
                        feedId: timestamp,
                        eventId: req.body.eventId
                    }
                    db.announcements.insert(data, function (error, result) {
                        if (error) {
                            res.send(JSON.stringify({
                                success: false,
                                error: "Database fetch error occured"
                            }));
                        }
                        else {
                            request({
                                headers: headers,
                                url: url,
                                method: 'POST',
                                json: {
                                    "to": '/topics/global',
                                    "time_to_live": 60 * 60 * 24,
                                    "data": {
                                        "title": "Update for " + req.body.updateEventData.eventName,
                                        "content": req.body.msg,
                                        "type": "EVENT",
                                        "timestamp": timestamp,
                                        "feedId": timestamp,
                                        "eventId": req.body.eventId
                                    }
                                }
                            }, function (error, response, body) {
                                if (error) {
                                    res.send(JSON.stringify({
                                        success: false,
                                        error: "API call error"
                                    }));
                                }
                                else {
                                    if (response.body.message_id != -1) {

                                        res.send(JSON.stringify({
                                            success: true
                                        }))
                                    }
                                    else {
                                        res.send(JSON.stringify({
                                            success: false,
                                            error: "API call error"
                                        }));
                                    }
                                }
                            })
                        }
                    })
                }
            })
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
    db.participants.find({}, function (error, result) {
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

router.post('/getParticipantByEmail', (req, res) => {
    if (req.body.email == undefined) {
        return res.sendStatus(403);
    }
    db.participants.find({ email: req.body.email }, function (error, result) {
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
    else if (req.body.eventId == "-1") {
        db.teams.find({}, function (error, result) {
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
    }
    else {
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
    }
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

router.post('/sendPM', (req, res) => {
    let url = "https://fcm.googleapis.com/fcm/send";
    let headers = {
        "Content-Type": "application/json",
        "Authorization": "key=AAAAj8SmANU:APA91bF5PyTPMgTFL0kEKpfyGn-RFO0veqZRuJJfXxTODOgRwXALnLRymYhvMfB-NwoVm4i1E-AN_p9NLw8ifdYSPyUcu9w5wkzH7uUQOzYe0OCeZrAV5krsO7D05fVaVofDEJKCJzgY"
    }
    db.fcm.find({ id: req.body.id }, function (error, result) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                error: "An unknown error occured"
            }));
        }
        else {
            if (result.length != 1) {
                res.send(JSON.stringify({
                    success: false,
                    error: "The message cannot be sent"
                }))
            }
            else {
                for (let i in result[0].tokens) {
                    let timestamp = Date.now();
                    request({
                        headers: headers,
                        url: url,
                        method: 'POST',
                        json: {
                            "to": result[0].tokens[i],
                            "time_to_live": 60 * 60 * 24,
                            "data": {
                                "title": req.body.title,
                                "content": req.body.msg,
                                "type": "PM",
                                "timestamp": timestamp,
                                "feedId": timestamp
                            }
                        }
                    }, function (error, response, body) {
                        if (error) {
                            res.send(JSON.stringify({
                                success: false,
                                error: "API call error"
                            }));
                        }
                        else {
                            if (response.body.success != 1) {
                                res.send(JSON.stringify({
                                    success: false,
                                    error: "Don't know what got hooked up."
                                }))
                            }
                        }
                    })
                }
                res.send(JSON.stringify({
                    success: true
                }))
            }
        }
    })
});

router.post('/sendAnnouncement', function (req, res) {
    let url = "https://fcm.googleapis.com/fcm/send";
    let headers = {
        "Content-Type": "application/json",
        "Authorization": "key=AAAAj8SmANU:APA91bF5PyTPMgTFL0kEKpfyGn-RFO0veqZRuJJfXxTODOgRwXALnLRymYhvMfB-NwoVm4i1E-AN_p9NLw8ifdYSPyUcu9w5wkzH7uUQOzYe0OCeZrAV5krsO7D05fVaVofDEJKCJzgY"
    }
    db.announcements.find({}, function (error, result) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                msg: 'Database fetch error occured'
            }));
        }
        else {
            let timestamp = Date.now();
            let data = {
                id: result.length + 1,
                title: req.body.title,
                content: req.body.msg,
                timestamp: timestamp,
                type: "ANNOUNCEMENT",
                feedId: timestamp
            }
            db.announcements.insert(data, function (error, result) {
                if (error) {
                    res.send(JSON.stringify({
                        success: false,
                        error: "Database fetch error occured"
                    }));
                }
                else {
                    request({
                        headers: headers,
                        url: url,
                        method: 'POST',
                        json: {
                            "to": '/topics/global',
                            "time_to_live": 60 * 60 * 24,
                            "data": {
                                "title": req.body.title,
                                "content": req.body.msg,
                                "type": "ANNOUNCEMENT",
                                "timestamp": timestamp,
                                "feedId": timestamp
                            }
                        }
                    }, function (error, response, body) {
                        if (error) {
                            res.send(JSON.stringify({
                                success: false,
                                error: "API call error"
                            }));
                        }
                        else {
                            if (response.body.message_id != -1) {

                                res.send(JSON.stringify({
                                    success: true
                                }))
                            }
                            else {
                                res.send(JSON.stringify({
                                    success: false,
                                    error: "API call error"
                                }));
                            }
                        }
                    })
                }
            })
        }
    })

})

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
    db.events.find({ eventId: parseInt(req.body.eventId), eventPosition1: {}, eventPosition2: {}, eventPosition3: {} }, function (error, event) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                error: "An unknown error occured"
            }));
        }
        else {
            if (event.length != 1) {
                res.send(JSON.stringify({
                    success: false,
                    error: "The result for the event is already announced."
                }));
            }
            else {
                event = event[0];

                let eventPosition1Members = [];
                let eventPosition2Members = [];
                let eventPosition3Members = [];

                db.teams.find({ eventId: parseInt(req.body.eventId), teamLeaderId: req.body.eventPosition1 }, function (error, result) {
                    if (error) {
                        res.send(JSON.stringify({
                            success: false,
                            error: "Database fetch error occured"
                        }));
                    }
                    else {

                        if (result.length == 0) {
                            res.send(JSON.stringify({
                                success: false,
                                error: "No such team 1 found"
                            }))
                        }
                        else {
                            console.log(eventPosition1Members);
                            eventPosition1Members.push(result[0].teamLeaderId);
                            for (let i in result[0].teamMembers) {
                                eventPosition1Members.push(result[0].teamMembers[i]);
                            }
                            db.teams.find({ eventId: parseInt(req.body.eventId), teamLeaderId: req.body.eventPosition2 }, function (error, result) {
                                if (error) {
                                    res.send(JSON.stringify({
                                        success: false,
                                        error: "Database fetch error occured"
                                    }));
                                }
                                else {
                                    if (result.length == 0) {
                                        res.send(JSON.stringify({
                                            success: false,
                                            error: "No such team 2 found"
                                        }))
                                    }
                                    else {
                                        eventPosition2Members.push(result[0].teamLeaderId);
                                        for (let i in result[0].teamMembers) {
                                            eventPosition2Members.push(result[0].teamMembers[i]);
                                        }
                                    }
                                    db.teams.find({ eventId: parseInt(req.body.eventId), teamLeaderId: req.body.eventPosition3 }, function (error, result) {
                                        if (error) {
                                            res.send(JSON.stringify({
                                                success: false,
                                                error: "Database fetch error occured"
                                            }));
                                        }
                                        else {
                                            if (result.length == 0) {
                                                res.send(JSON.stringify({
                                                    success: false,
                                                    error: "No such team 3 found"
                                                }))
                                            }
                                            else {
                                                eventPosition3Members.push(result[0].teamLeaderId);
                                                for (let i in result[0].teamMembers) {
                                                    eventPosition3Members.push(result[0].teamMembers[i]);
                                                }
                                                let eventPosition1Teams = new Set();
                                                let eventPosition2Teams = new Set();
                                                let eventPosition3Teams = new Set();

                                                db.participants.find({ id: { $ne: "-1" } }, function (error, result) {
                                                    if (error) {
                                                        res.send(JSON.stringify({
                                                            success: false,
                                                            error: "Database fetch error occured"
                                                        }));
                                                    }
                                                    else {
                                                        let map = {};
                                                        for (let i in result) {
                                                            map[result[i].id] = result[i];
                                                        }
                                                        for (let i in eventPosition1Members) {
                                                            eventPosition1Teams.add(map[eventPosition1Members[i]].teamName);
                                                        }
                                                        for (let i in eventPosition2Members) {
                                                            eventPosition2Teams.add(map[eventPosition2Members[i]].teamName);
                                                        }
                                                        for (let i in eventPosition3Members) {
                                                            eventPosition3Teams.add(map[eventPosition3Members[i]].teamName);
                                                        }
                                                        let team1 = null;
                                                        let team2 = null;
                                                        let team3 = null;
                                                        if (eventPosition1Teams.size == 1) {
                                                            eventPosition1Teams.forEach(team => {
                                                                if (team != "-1") {
                                                                    team1 = team;
                                                                }
                                                            });
                                                        }
                                                        if (eventPosition2Teams.size == 1) {
                                                            eventPosition2Teams.forEach(team => {
                                                                if (team != "-1") {
                                                                    team2 = team;
                                                                }
                                                            });
                                                        }
                                                        if (eventPosition3Teams.size == 1) {
                                                            eventPosition3Teams.forEach(team => {
                                                                if (team != "-1") {
                                                                    team3 = team;
                                                                }
                                                            });
                                                        }
                                                        if (team1 != null) {
                                                            db.championships.update({ teamName: team1 }, { $inc: { teamPoints: event.eventPoints1 } }, function (error, result) {
                                                                if (error) {
                                                                    res.send(JSON.stringify({
                                                                        success: false,
                                                                        error: "Database fetch error occured"
                                                                    }))
                                                                }
                                                            })
                                                        }
                                                        if (team2 != null && team2 != team1) {
                                                            db.championships.update({ teamName: team2 }, { $inc: { teamPoints: event.eventPoints2 } }, function (error, result) {
                                                                if (error) {
                                                                    res.send(JSON.stringify({
                                                                        success: false,
                                                                        error: "Database fetch error occured"
                                                                    }))
                                                                }
                                                            })
                                                        }
                                                        if (team3 != null && team3 != team1 && team3 != team2) {
                                                            db.championships.update({ teamName: team3 }, { $inc: { teamPoints: event.eventPoints3 } }, function (error, result) {
                                                                if (error) {
                                                                    res.send(JSON.stringify({
                                                                        success: false,
                                                                        error: "Database fetch error occured"
                                                                    }))
                                                                }
                                                            })
                                                        }
                                                        db.events.update({ eventId: parseInt(req.body.eventId), eventPosition1: {}, eventPosition2: {}, eventPosition3: {} },
                                                            {
                                                                $set: {
                                                                    eventPosition1: {
                                                                        teamLeader: req.body.eventPosition1,
                                                                        teamLeaderName: map[req.body.eventPosition1].name,
                                                                        championshipTeam: (team1 != null) ? team1 : "-1",
                                                                        points: (team1 != null) ? event.eventPoints1 : 0
                                                                    },
                                                                    eventPosition2: {
                                                                        teamLeader: req.body.eventPosition2,
                                                                        teamLeaderName: map[req.body.eventPosition2].name,
                                                                        championshipTeam: (team2 != null) ? team2 : "-1",
                                                                        points: (team2 != null && team2 != team1) ? event.eventPoints2 : 0
                                                                    },
                                                                    eventPosition3: {
                                                                        teamLeader: req.body.eventPosition3,
                                                                        teamLeaderName: map[req.body.eventPosition3].name,
                                                                        championshipTeam: (team3 != null) ? team3 : "-1",
                                                                        points: (team3 != null && team3 != team2 && team3 != team1) ? event.eventPoints3 : 0
                                                                    }
                                                                }
                                                            }, function (error, updateResult) {
                                                                if (error) {
                                                                    res.send(JSON.stringify({
                                                                        success: false,
                                                                        error: "An unknown error occured"
                                                                    }));
                                                                }
                                                                else {
                                                                    db.announcements.find({}, function (error, annoucenmentResult) {
                                                                        if (error) {
                                                                            res.send(JSON.stringify({
                                                                                success: false,
                                                                                msg: 'Database fetch error occured'
                                                                            }));
                                                                        }
                                                                        else {
                                                                            let timestamp = Date.now();
                                                                            let content = "1. " + req.body.eventPosition1 + " (" + map[req.body.eventPosition1].name + ")";
                                                                            if (team1 != null) {
                                                                                content += " - " + team1 + " - " + event.eventPoints1 + " pts";
                                                                            }
                                                                            content += "\n";
                                                                            content += "2. " + req.body.eventPosition2 + " (" + map[req.body.eventPosition2].name + ")";
                                                                            if (team2 != null) {
                                                                                content += " - " + team2 + " - ";
                                                                                if (team2 != team1) {
                                                                                    content += event.eventPoints2 + " pts";
                                                                                }
                                                                                else {
                                                                                    content += "0 pts";
                                                                                }
                                                                            }

                                                                            content += "\n";
                                                                            content += "3. " + req.body.eventPosition3 + " (" + map[req.body.eventPosition3].name + ")";
                                                                            if (team3 != null) {
                                                                                content += " - " + team3 + " - ";
                                                                                if (team3 != team2 && team3 != team1) {
                                                                                    content += event.eventPoints3 + " pts";
                                                                                }
                                                                                else {
                                                                                    content += "0 pts";
                                                                                }
                                                                            }

                                                                            content += "\n\nCongratulations to all the winners.";
                                                                            let url = "https://fcm.googleapis.com/fcm/send";
                                                                            let headers = {
                                                                                "Content-Type": "application/json",
                                                                                "Authorization": "key=AAAAj8SmANU:APA91bF5PyTPMgTFL0kEKpfyGn-RFO0veqZRuJJfXxTODOgRwXALnLRymYhvMfB-NwoVm4i1E-AN_p9NLw8ifdYSPyUcu9w5wkzH7uUQOzYe0OCeZrAV5krsO7D05fVaVofDEJKCJzgY"
                                                                            }
                                                                            let data = {
                                                                                id: annoucenmentResult.length + 1,
                                                                                title: "Result for event " + event.eventName,
                                                                                content: content,
                                                                                timestamp: timestamp,
                                                                                type: "RESULT",
                                                                                feedId: timestamp,
                                                                                eventId: parseInt(req.body.eventId)
                                                                            }
                                                                            db.announcements.insert(data, function (error, insertionResult) {
                                                                                if (error) {
                                                                                    res.send(JSON.stringify({
                                                                                        success: false,
                                                                                        error: "Database fetch error occured"
                                                                                    }));
                                                                                }
                                                                                else {
                                                                                    request({
                                                                                        headers: headers,
                                                                                        url: url,
                                                                                        method: 'POST',
                                                                                        json: {
                                                                                            "to": '/topics/global',
                                                                                            "time_to_live": 60 * 60 * 24,
                                                                                            "data": {
                                                                                                "title": "Result for event " + event.eventName,
                                                                                                "content": content,
                                                                                                "type": "RESULT",
                                                                                                "timestamp": timestamp,
                                                                                                "feedId": timestamp,
                                                                                                eventId: parseInt(req.body.eventId)
                                                                                            }
                                                                                        }
                                                                                    }, function (error, response, body) {
                                                                                        if (error) {
                                                                                            res.send(JSON.stringify({
                                                                                                success: false,
                                                                                                error: "API call error"
                                                                                            }));
                                                                                        }
                                                                                        else {
                                                                                            if (response.body.message_id != -1) {
                                                                                                var transporter = nodemailer.createTransport({
                                                                                                    service: 'gmail',
                                                                                                    auth: {
                                                                                                        user: 'webmaster@bitotsav.in',
                                                                                                        pass: 'Bitotsav2018!@'
                                                                                                    }
                                                                                                });

                                                                                                var mailOptions = {
                                                                                                    from: 'Bitotsav Team <webmaster@bitotsav.in>',
                                                                                                    to: map[req.body.eventPosition1].email,
                                                                                                    subject: 'Congratulations!',
                                                                                                    text: '',
                                                                                                    html: `
                                                                                                    <h2 align="center">Bitotsav</h2>
                                                                                                    <p>
                                                                                                    Hi,<br><br>
                                                                                                    We express our heartiest congratulations for securing 1st Position for the event ${event.eventName}. We request you to collect your certificates and prize money (if any) from the infocell.<br><br>
                                                                                                    In case you are registered for Bitotsav Championship, your points will be automatically updated.<br><br>
                                                                                                    Regards,<br>
                                                                                                    Web Team,<br>
                                                                                                    Bitotsav '19</p>`
                                                                                                };
                                                                                                transporter.sendMail(mailOptions, function (error, info) {
                                                                                                    if (error) {
                                                                                                        return res.status(500).send(JSON.stringify({
                                                                                                            success: false,
                                                                                                            msg: `Error sending Email. Please try again later`
                                                                                                        }));
                                                                                                    } else {
                                                                                                        var mailOptions = {
                                                                                                            from: 'Bitotsav Team <webmaster@bitotsav.in>',
                                                                                                            to: map[req.body.eventPosition2].email,
                                                                                                            subject: 'Congratulations!',
                                                                                                            text: '',
                                                                                                            html: `
                                                                                                            <h2 align="center">Bitotsav</h2>
                                                                                                            <p>
                                                                                                            Hi,<br><br>
                                                                                                            We express our heartiest congratulations for securing 2nd Position for the event ${event.eventName}. We request you to collect your certificates and prize money (if any) from the infocell.<br><br>
                                                                                                            In case you are registered for Bitotsav Championship, your points will be automatically updated.<br><br>
                                                                                                            Regards,<br>
                                                                                                            Web Team,<br>
                                                                                                            Bitotsav '19</p>`
                                                                                                        };

                                                                                                        transporter.sendMail(mailOptions, function (error, info) {
                                                                                                            if (error) {
                                                                                                                return res.status(500).send(JSON.stringify({
                                                                                                                    success: false,
                                                                                                                    msg: `Error sending Email. Please try again later`
                                                                                                                }));
                                                                                                            } else {
                                                                                                                var mailOptions = {
                                                                                                                    from: 'Bitotsav Team <webmaster@bitotsav.in>',
                                                                                                                    to: map[req.body.eventPosition3].email,
                                                                                                                    subject: 'Congratulations!',
                                                                                                                    text: '',
                                                                                                                    html: `
                                                                                                                    <h2 align="center">Bitotsav</h2>
                                                                                                                    <p>
                                                                                                                    Hi,<br><br>
                                                                                                                    We express our heartiest congratulations for securing 3rd Position for the event ${event.eventName}. We request you to collect your certificates and prize money (if any) from the infocell.<br><br>
                                                                                                                    In case you are registered for Bitotsav Championship, your points will be automatically updated.<br><br>
                                                                                                                    Regards,<br>
                                                                                                                    Web Team,<br>
                                                                                                                    Bitotsav '19</p>`
                                                                                                                };
                                                                                                                transporter.sendMail(mailOptions, function (error, info) {
                                                                                                                    if (error) {
                                                                                                                        return res.status(500).send(JSON.stringify({
                                                                                                                            success: false,
                                                                                                                            msg: `Error sending Email. Please try again later`
                                                                                                                        }));
                                                                                                                    } else {
                                                                                                                        res.send(JSON.stringify({
                                                                                                                            success: true
                                                                                                                        }))
                                                                                                                    }
                                                                                                                });
                                                                                                            }
                                                                                                        });
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                            else {
                                                                                                res.send(JSON.stringify({
                                                                                                    success: false,
                                                                                                    error: "API call error"
                                                                                                }));
                                                                                            }
                                                                                        }
                                                                                    })
                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                                }
                                                            });
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
    })
});

/**
 * Payment update
 */

router.post("/getPayment", function (req, res) {
    db.participants.find({ id: req.body.id }, function (error, result) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                error: "An unknown error occured"
            }))
        }
        else {
            if (result.length != 1) {
                res.send(JSON.stringify({
                    success: false,
                    error: "No such id found"
                }))
            }
            else {
                res.send(JSON.stringify({
                    success: true,
                    payment: result[0].payment
                }))
            }
        }
    })
})

router.post("/updatePayment", function (req, res) {
    db.participants.update({ id: req.body.id }, { $set: { payment: req.body.payment } }, function (error, result) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                error: "An unknown error occured"
            }))
        }
        else {
            res.send(JSON.stringify({
                success: true
            }))
        }
    })
})


module.exports = router;
