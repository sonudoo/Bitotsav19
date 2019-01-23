const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../setup').db;
const jwt = require('jsonwebtoken');
const secretKey = require('../setup').secretKey;
const adminPassword = "10204";
const nodemailer = require('nodemailer');
const request = require('request');
const router = express.Router();
const bcrypt = require("bcryptjs");
const collegeList = require("../collegeList.json");


/**
 * Event routes
 */

router.get('/getAllEvents', function (req, res) {
    db.events.find({}, function (error, result) {
        if (error) {
            res.status(502).send(JSON.stringify({
                success: false,
                msg: "Database fetch error occured"
            }));
        }
        else {
            for (let i in result) {
                delete result[i]['_id'];
                delete result[i]['eventFacultyAdvisor'];
                delete result[i]['eventRequirement'];
            }
            res.send(JSON.stringify(result));
        }
    })
});

router.post('/getEventById', function (req, res) {
    db.events.find({ eventId: req.body.eventId }, function (error, result) {
        if (error) {
            res.status(502).send(JSON.stringify({
                success: false,
                msg: "Database fetch error occured"
            }));
        }
        else {
            if (result.length != 1) {
                res.status(404).send(JSON.stringify({
                    success: false,
                    msg: "No such event found"
                }))
            }
            else {
                delete result[0]['_id'];
                delete result[0]['eventFacultyAdvisor'];
                delete result[0]['eventRequirement'];

                res.send(JSON.stringify(result[0]));
            }

        }
    })
});


router.get('/getAllBCTeams', function (req, res) {
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
                    let result = [];
                    for (let i in result1) {

                        let tmp = {};
                        tmp['teamName'] = result1[i].teamName;
                        tmp['teamPoints'] = result1[i].teamPoints;
                        tmp.teamMembers = {};
                        for (let j in result1[i].teamMembers) {
                            tmp.teamMembers[result1[i].teamMembers[j].memberId] = result2[parseInt(result1[i].teamMembers[j].memberId.split("/")[1]) - 10000].name;
                        }
                        result.push(tmp);
                    }
                    res.send(JSON.stringify(result));
                }
            })
        }
    })
});

/**
 * User routes
 */

router.get('/getCollegeList', (req, res) => {
    res.status(200).send(JSON.stringify(collegeList));
});

// Step 1

router.post('/register', (req, res) => {
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
            db.participants.find({ email: req.body.email }, function (error, user) {
                if (error) {
                    return res.status(502).send(JSON.stringify({
                        success: false,
                        msg: "Database fetch error occurred"
                    }));
                }
                if (user.length >= 1 && user[0].otpVerified == true && user[0].id !== "-1") {
                    res.status(409).send(JSON.stringify({
                        success: false,
                        msg: "The email Id is already registered"
                    }));
                }
                else {
                    let phoneOtpsent = Math.floor(100000 + Math.random() * 900000);
                    let emailOtpsent = Math.floor(100000 + Math.random() * 900000);

                    //sending email otp
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'webmaster@bitotsav.in',
                            pass: 'Bitotsav2018!@'
                        }
                    });

                    var mailOptions = {
                        from: 'Bitotsav Team <webmaster@bitotsav.in>',
                        to: req.body.email,
                        subject: 'Email Verification',
                        text: '',
                        html: `
                        <h2 align="center">Bitotsav</h2>
                        <p>
                        Hi,<br><br>
                        Your Email OTP is ${emailOtpsent}.<br><br>
                        Regards,<br>
                        Web Team,<br>
                        Bitotsav '19</p>`
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            return res.status(502).send(JSON.stringify({
                                success: false,
                                msg: `Error sending Email. Please try again later`
                            }));
                        } else {
                            //sending phone otp
                            let otpUrl = `http://sms.digimiles.in/bulksms/bulksms?username=di78-pantheon&password=digimile&type=0&dlr=1&destination=${req.body.phno}&source=BITSAV&message=Your Bitotsav'19 registration OTP is: ${phoneOtpsent}`;
                            request(otpUrl, (error, response, body) => {
                                if (error) {
                                    return res.status(502).send(JSON.stringify({
                                        success: false,
                                        msg: `Error sending OTP. Please try again later`,
                                    }));
                                } else {
                                    db.participants.find({ email: req.body.email }, function (error, participant) {
                                        if (error) {
                                            return res.status(502).send(JSON.stringify({
                                                success: false
                                            }));
                                        }
                                        if (participant.length == 0) {
                                            //new participant
                                            bcrypt.hash(req.body.password, 10, (err, hash) => {
                                                if (err) {
                                                    res.status(502).send(JSON.stringify({
                                                        success: false,
                                                        msg: "Encryption error occured"
                                                    }));
                                                }
                                                else {
                                                    const newParticipant = {
                                                        id: "-1",
                                                        name: req.body.name,
                                                        email: req.body.email,
                                                        phno: req.body.phno,
                                                        gender: "",
                                                        college: "",
                                                        rollno: "",
                                                        source: "",
                                                        year: 0,
                                                        password: hash,
                                                        teamName: "-1",
                                                        events: [],
                                                        payment: {
                                                            day1: false,
                                                            day2: false,
                                                            day3: false,
                                                            day4: false
                                                        },
                                                        emailOtp: emailOtpsent,
                                                        phoneOtp: phoneOtpsent,
                                                        otpVerified: false,
                                                        verified: false
                                                    };
                                                    db.participants.insert(newParticipant, function (error, result) {
                                                        if (error) {
                                                            return res.status(502).send(JSON.stringify({
                                                                success: false,
                                                                msg: "Database fetch error occurred"
                                                            }));
                                                        }
                                                        res.status(200).send(JSON.stringify({
                                                            success: true,
                                                            msg: "OTP sent successfully"
                                                        }));
                                                    });
                                                }
                                            });
                                        }
                                        else {
                                            //participant tried registering before but got an error while doing it
                                            bcrypt.hash(req.body.password, 10, (err, hash) => {
                                                if (err) {
                                                    console.log(err);
                                                    res.status(500).send(JSON.stringify({
                                                        success: false,
                                                        msg: "Encryption error occured"
                                                    }));
                                                } else {
                                                    db.participants
                                                        .update({
                                                            email: participant[0].email
                                                        }, {
                                                                $set: {
                                                                    name: req.body.name,
                                                                    email: req.body.email,
                                                                    password: hash,
                                                                    phno: req.body.phno,
                                                                    emailOtp: emailOtpsent,
                                                                    phoneOtp: phoneOtpsent
                                                                }
                                                            }, function (error, result) {
                                                                if (error) {
                                                                    return res.status(502).send(JSON.stringify({
                                                                        success: false,
                                                                        msg: "Database fetch error occured."
                                                                    }));
                                                                }
                                                                res.status(200).send(JSON.stringify({
                                                                    success: true,
                                                                    msg: "OTP sent successfully"
                                                                }));
                                                            });
                                                }
                                            });

                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});


// Stage 2 of Registration
router.post('/verify', (req, res) => {
    db.participants.find({ email: req.body.email }, function (error, result) {
        if (error) {
            return res.status(502).send(JSON.stringify({
                success: false
            }));
        }
        if (result.length == 1) {
            if (result[0].emailOtp != req.body.emailOtp && result[0].phoneOtp != req.body.phoneOtp) {
                res.status(403).send(JSON.stringify({
                    success: false,
                    msg: "Both Phone OTP and E-mail OTP are incorrect!!"
                }));
            } else if (result[0].emailOtp == req.body.emailOtp && result[0].phoneOtp != req.body.phoneOtp) {
                res.status(403).send(JSON.stringify({
                    success: false,
                    msg: "Incorrect Phone OTP!!"
                }));
            } else if (result[0].emailOtp != req.body.emailOtp && result[0].phoneOtp == req.body.phoneOtp) {
                res.status(403).send(JSON.stringify({
                    success: false,
                    msg: "Incorrect Email OTP!!"
                }));
            } else {
                db.participants.update({ email: req.body.email }, { $set: { otpVerified: true } }, function (error, result) {
                    if (error) {
                        res.status(502).send(JSON.stringify({
                            success: false,
                            msg: "Database fetch error occured"
                        }));
                    }
                    else {
                        return res.status(200).send(JSON.stringify({
                            success: true
                        }));
                    }
                });
            }
        } else {
            res.status(400).send(JSON.stringify({
                status: "fail",
                msg: "Payload modified. User Not found."
            }));
        }
    });
});


// Stage 3 of Registration
router.post('/saveparticipant', (req, res) => {
    db.counters.find({}, (error, result) => {
        if (error) {
            res.status(502).send(JSON.stringify({
                success: false,
                msg: "Database fetch error occured."
            }));
        } else {
            const bitId = "BT19/" + result[0].counter;
            const updatedUserInfo = {
                id: "BT19/" + result[0].counter,
                gender: req.body.gender,
                college: req.body.college,
                rollno: req.body.rollno,
                source: req.body.source,
                year: req.body.year
            }
            db.counters.update({}, { $set: { counter: parseInt(result[0].counter + 1) } }, function (error, result) {
                if (error) {
                    res.status(502).send(JSON.stringify({
                        success: false,
                        msg: "Database fetch error occured."
                    }));
                }
                else {
                    db.participants.update({ email: req.body.email }, { $set: updatedUserInfo }, function (error, result) {
                        if (error) {
                            res.status(502).send(JSON.stringify({
                                success: false,
                                msg: "Database fetch error occured."
                            }));
                        }
                        else {
                            //sending confirmation email
                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'webmaster@bitotsav.in',
                                    pass: 'Bitotsav2018!@'
                                }
                            });

                            var mailOptions = {
                                from: 'Bitotsav Team <webmaster@bitotsav.in>',
                                to: req.body.email,
                                subject: "Bitotsav'19 Registration",
                                text: '',
                                html: `
                                <h2 align="center">Bitotsav</h2>
                                <p>
                                Hi,<br><br>
                                You have successfully registered in Bitotsav 2019.<br>
                                Your Bitotsav ID is ${updatedUserInfo.id}.<br>
                                Login Details:<br>
                                Email : ${req.body.email}<br>
                                Password : ${req.body.password}<br><br>
                                Regards,<br>
                                Web Team,<br>
                                Bitotsav '19</p>`
                            };
                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    return res.status(502).send(JSON.stringify({
                                        success: false,
                                        msg: `Error sending Conformation Email. Please try again later`
                                    }));
                                } else {
                                    return res.status(200).send(JSON.stringify({
                                        success: true,
                                        msg: "You are registered successfully",
                                        data: bitId
                                    }));
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.post('/login', (req, res) => {
    db.participants.find({ email: req.body.email }, function (error, user) {
        if (error) {
            return res.status(502).send(JSON.stringify({
                success: false
            }));
        }
        if (user.length < 1) {
            res.status(403).send(JSON.stringify({
                success: false,
                msg: "You are not registered yet."
            }));
        }
        else if (user[0].otpVerified == false || user[0].id == "-1") {
            res.status(403).send(JSON.stringify({
                success: false,
                msg: 'You have not been successfully registered.'
            }));
        }
        else {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(502).send(JSON.stringify({
                        success: false,
                        msg: "Database fetch error occured."
                    }));
                } else {
                    if (result) {
                        return res.status(200).send(JSON.stringify({
                            success: true,
                            token: jwt.sign({
                                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 3),
                                data: {
                                    email: user[0].email,
                                    password: user[0].password,
                                    id: user[0].id,
                                    key: secretKey
                                }
                            }, secretKey)
                        }));
                    } else {
                        return res.status(403).send(JSON.stringify({
                            success: false,
                            msg: 'Wrong Password.'
                        }));
                    }
                }
            });
        }
    });
});

const checkAuth = function (req, res, next) {
    const token = req.headers.token.split(' ')[1];
    if (token == undefined) {
        return res.status(403).send(JSON.stringify({
            success: false,
            msg: "Authentication Failed. Please Log In."
        }));;
    }
    else {
        jwt.verify(token, secretKey, function (error, data) {
            if (error) {
                return res.status(403).send(JSON.stringify({
                    success: false,
                    msg: "Token modified. Decryption error"
                }));
            }
            else {
                req.userData = data.data;
                next();
            }
        });
    }
}

router.get('/getParticipantDetails', checkAuth, (req, res) => {
    db.participants.find({ email: req.userData.email }, function (error, user) {
        if (error) {
            return res.status(502).send(JSON.stringify({
                success: false,
                msg: "Database fetch error occured."
            }));
        }
        if (user.length < 1) {
            res.status(404).send(JSON.stringify({
                success: false,
                msg: "No such participant present"
            }));
        }
        else {
            res.status(200).send(JSON.stringify({
                email: user[0].email,
                name: user[0].name,
                gender: user[0].gender,
                college: user[0].college,
                id: user[0].id,
                year: user[0].year,
                payment: user[0].payment,
                events: user[0].events,
                rollno: user[0].rollno,
                phno: user[0].phno,
                teamName: user[0].teamName
            }));
        }
    });
});

router.post('/getTeamDetails', function (req, res) {
    if (req.body.eventId == undefined || req.body.teamLeaderId == undefined) {
        res.status(403).send(JSON.stringify({
            success: false,
            msg: "Event Id or Team Leader Id is missing."
        }));
    }
    else {
        db.teams.find({ eventId: parseInt(req.body.eventId), teamLeaderId: req.body.teamLeaderId }, function (error, result1) {
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
                        msg: "No such team found in the database"
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
                            result1 = result1[0];
                            let teamMembers = {};
                            teamMembers[req.body.teamLeader] = result2[parseInt(req.body.teamLeader.split("/")[1]) - 10000].name;
                            for (let i in result1.teamMembers.length) {
                                teamMembers[result1.teamMembers[i]] = result2[parseInt(result1.teamMembers[i].split("/")[1]) - 10000].name;
                            }
                            res.status(200).send(JSON.stringify({
                                success: true,
                                teamMembers: teamMembers
                            }))
                        }
                    });
                }

            }
        })
    }
})

router.post('/eventRegistration', checkAuth, (req, res) => {

    const memberArr = JSON.parse(req.body.members);
    if (memberArr.length == 0) {
        db.participants.update({ email: req.userData.email }, {
            $push: {
                events: {
                    "eventId": parseInt(req.body.eventId),
                    "teamLeader": req.body.leaderId
                }
            }
        }, (error, result) => {
            if (error) {
                res.status(502).send(JSON.stringify({
                    success: false,
                    msg: "Some error occurred"
                }));
            } else {
                const newTeam = {
                    eventId: parseInt(req.body.eventId),
                    teamLeaderId: req.body.leaderId,
                    teamMembers: []
                }
                db.teams
                    .insert(newTeam, function (error, result) {
                        if (error) {
                            return res.status(502).send(JSON.stringify({
                                success: false,
                                msg: "An unknown error occurred."
                            }));
                        }
                        res.status(200).send(JSON.stringify({
                            success: true,
                            msg: "Team Registered Successfully"
                        }));
                    });

            }
        });
    }
    let validatedMembers = 0;
    for (let j = 0; j < memberArr.length; j++) {
        db.participants.find({ email: memberArr[j].memberEmail }, (error, result) => {
            if (error) {
                res.status(502).send(JSON.stringify({
                    success: false,
                    msg: "Some Error Occured!!"
                }));
            } else {
                if (result.length < 1) {
                    res.status(404).send(JSON.stringify({
                        success: false,
                        msg: `Email ${memberArr[j].memberEmail} has not registered.`
                    }));
                }
                else if (result[0].id !== memberArr[j].memberId) {
                    res.status(404).send(JSON.stringify({
                        success: false,
                        msg: "Incorrect Bitotsav ID"
                    }));
                } else if (result[0].college !== req.body.leaderCollege) {
                    res.status(405).send(JSON.stringify({
                        success: false,
                        msg: `Member ${memberArr[j].memberId} does not belong to the same college`
                    }));
                } else {
                    for (let k = 0; k < result[0].events.length; k++) {
                        if (result[0].events[k].eventId == req.body.eventId) {
                            return res.status(409).send(JSON.stringify({
                                success: false,
                                msg: `Member ${memberArr[j].memberId} is already registered to the event ${req.body.eventId}`
                            }));
                        }
                    }
                    validatedMembers = validatedMembers + 1;
                    if (validatedMembers == memberArr.length) {
                        db.participants.update({ email: req.body.leaderEmail }, {
                            $push: {
                                events: {
                                    "eventId": parseInt(req.body.eventId),
                                    "teamLeader": req.body.leaderId
                                }
                            }
                        }, (error, result) => {
                            if (error) {
                                res.status(502).send(JSON.stringify({
                                    success: false,
                                    msg: "Some error occurred"
                                }));
                            } else {
                                // update for all the members
                                let updatedMembers = 0;
                                for (let i = 0; i < memberArr.length; i++) {
                                    db.participants.update({ email: memberArr[i].memberEmail }, {
                                        $push: {
                                            events: {
                                                "eventId": parseInt(req.body.eventId),
                                                "teamLeader": req.body.leaderId
                                            }
                                        }
                                    }, (error, result) => {
                                        if (error) {
                                            res.status(502).send(JSON.stringify({
                                                success: false,
                                                msg: "Some error occurred"
                                            }));
                                        } else {
                                            updatedMembers = updatedMembers + 1;
                                            if (updatedMembers == memberArr.length) {
                                                const teamM = memberArr.map(member => member.memberId);
                                                const newTeam = {
                                                    eventId: parseInt(req.body.eventId),
                                                    teamLeaderId: req.body.leaderId,
                                                    teamMembers: teamM
                                                }
                                                db.teams
                                                    .insert(newTeam, function (error, result) {
                                                        if (error) {
                                                            return res.status(502).send(JSON.stringify({
                                                                success: false,
                                                                msg: "An unknown error occurred."
                                                            }));
                                                        }
                                                        res.status(200).send(JSON.stringify({
                                                            success: true,
                                                            msg: "Team Registered Successfully"
                                                        }));
                                                    });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            }
        });
    }
});

// Event De-Registration
router.get('/eventDeregistration/:eventId/:bitId', checkAuth, (req, res) => {
    let bitotsavID = "BT19/" + req.params.bitId;
    let eventID = parseInt(req.params.eventId);
    let countMembers = 0;
    db.participants
        .update({
            email: req.userData.email,
            events: {
                $elemMatch: {
                    eventId: eventID,
                    teamLeader: bitotsavID
                }
            }
        }, {
                $pull: { events: { eventId: eventID } }
            }, function (error, result) {
                if (error) {
                    res.status(502).send(JSON.stringify({
                        success: false
                    }));
                }
                db.teams
                    .find({
                        eventId: eventID,
                        teamLeaderId: bitotsavID
                    }, function (err, team) {
                        if (err) {
                            res.status(502).send(JSON.stringify({
                                success: false
                            }));
                        }
                        if (team.length < 1) {
                            res.status(403).send(JSON.stringify({
                                success: false,
                                msg: "You are not registered in this event or you are not the Team Leader."
                            }));
                        }
                        else {
                            if (team[0].teamMembers.length == 0) {
                                db.teams
                                    .remove({
                                        eventId: eventID,
                                        teamLeaderId: bitotsavID
                                    }, function (err, result) {
                                        if (err) {
                                            return res.status(502).send(JSON.stringify({
                                                success: false
                                            }));
                                        }
                                        return res.status(200).send(JSON.stringify({
                                            success: true,
                                            msg: 'Team De-Registered successfully'
                                        }));
                                    });
                            }
                            for (let i = 0; i < team[0].teamMembers.length; i++) {
                                const memberId = team[0].teamMembers[i];
                                db.participants
                                    .update({
                                        id: memberId
                                    }, {
                                            $pull: { events: { eventId: eventID } }
                                        }, function (error, result) {
                                            if (error) {
                                                return res.status(502).send(JSON.stringify({
                                                    success: false
                                                }));
                                            }
                                            countMembers = countMembers + 1;
                                            if (countMembers == team[0].teamMembers.length) {
                                                db.teams
                                                    .remove({
                                                        eventId: eventID,
                                                        teamLeaderId: bitotsavID
                                                    }, function (err, result) {
                                                        if (err) {
                                                            return res.status(502).send(JSON.stringify({
                                                                success: false
                                                            }));
                                                        }
                                                        res.status(200).send(JSON.stringify({
                                                            success: true,
                                                            msg: 'Team De-Registered successfully'
                                                        }));
                                                    });
                                            }
                                        });
                            }
                        }
                    });
            });
});

//Bitotsav Championship registration
router.post('/championship', checkAuth, (req, res) => {
    let memberCheck = 0;
    let memberUpdated = 0;
    const memberArr = JSON.parse(req.body.teamMembers);
    db.championships
        .find({ teamName: req.body.teamName }, function (error, team) {
            if (error) {
                return res.status(502).send(JSON.stringify({
                    success: false
                }));
            }
            if (team.length >= 1) {
                return res.status(409).send(JSON.stringify({
                    success: false,
                    msg: `${req.body.teamName} is already in use.`
                }));
            }
            for (let i = 0; i < memberArr.length; i++) {
                db.participants
                    .find({ email: memberArr[i].memberEmail }, function (error, member) {
                        if (error) {
                            return res.status(502).send(JSON.stringify({
                                success: false
                            }));
                        }
                        if (member.length < 1) {
                            return res.status(404).send(JSON.stringify({
                                success: false,
                                msg: `${memberArr[i].memberEmail} is not registered.`
                            }));
                        }
                        else if (member[0].teamName !== "-1") {
                            return res.status(409).send(JSON.stringify({
                                success: false,
                                msg: `${memberArr[i].memberEmail} is already in a team.`
                            }));
                        }
                        else if (member[0].college !== req.body.leaderCollege) {
                            return res.status(405).send(JSON.stringify({
                                success: false,
                                msg: "Team members must be of the same college."
                            }));
                        }
                        else if (member[0].id !== memberArr[i].memberId) {
                            return res.status(404).send(JSON.stringify({
                                success: false,
                                msg: "Incorrect Bitotsav ID."
                            }));
                        }
                        memberCheck = memberCheck + 1;
                        if (memberCheck == memberArr.length) {
                            for (let j = 0; j < memberArr.length; j++) {
                                db.participants
                                    .update({ email: memberArr[j].memberEmail }, {
                                        $set: {
                                            teamName: req.body.teamName
                                        }
                                    }, function (error, result) {
                                        if (error) {
                                            return res.status(502).send(JSON.stringify({
                                                success: false
                                            }));
                                        }
                                        memberUpdated = memberUpdated + 1;
                                        if (memberUpdated == memberArr.length) {
                                            const newTeam = {
                                                teamName: req.body.teamName,
                                                teamLeader: req.body.teamLeader,
                                                teamMembers: memberArr,
                                                teamPoints: 0
                                            };
                                            db.championships
                                                .insert(newTeam, function (error, result) {
                                                    if (error) {
                                                        return res.status(502).send(JSON.stringify({
                                                            success: false,
                                                            msg: "An unknown error occurred."
                                                        }));
                                                    }
                                                    res.status(200).send(JSON.stringify({
                                                        success: true,
                                                        msg: "Team Registered for Bitotsav Championship!"
                                                    }));
                                                });
                                        }
                                    });
                            }
                        }
                    });
            }
        });
});

router.post('/addStarEvent', checkAuth, (req, res) => {
    if(req.body.eventId == undefined){
        res.status(403).send(JSON.stringify({
            success: false,
            msg: "eventId is required"
        }))
    }
    else{
        db.participants.find({id: req.userData.id}, function(error, result){
            if(error){
                res.status(502).send(JSON.stringify({
                    success: false,
                    msg: "Database fetch error occurred"
                }));
            }
            else{
                if(result.length != 1){
                    res.status(403).send(JSON.stringify({
                        success: false,
                        msg: "Unauthorized"
                    }))
                }
                else{
                    result = result[0];
                    if(result.starred == undefined){
                        result.starred = [req.body.eventId];
                    }
                    else{
                        if (result.starred.indexOf(req.body.eventId) > -1) {
                            return res.status(409).send(JSON.stringify({
                                success: false,
                                msg: "Event is already starred"
                            }));
                        }
                        else{  
                            result.starred.push(req.body.eventId);
                        }
                    }
                    db.participants.update({id: req.userData.id}, result, function(error, updateResult){
                        if(error){
                            res.status(502).send(JSON.stringify({
                                success: false,
                                msg: "Database fetch error occured"
                            }))
                        }
                        else{
                            res.status(200).send(JSON.stringify({
                                success: true
                            }))
                        }
                    })
                }
            }
        })
    }
})

router.post('/removeStarEvent', checkAuth, (req, res) => {
    if(req.body.eventId == undefined){
        res.status(403).send(JSON.stringify({
            success: false,
            msg: "eventId is required"
        }))
    }
    else{
        db.participants.find({id: req.userData.id}, function(error, result){
            if(error){
                res.status(502).send(JSON.stringify({
                    success: false,
                    msg: "Database fetch error occurred"
                }));
            }
            else{
                if(result.length != 1){
                    res.status(403).send(JSON.stringify({
                        success: false,
                        msg: "Unauthorized"
                    }))
                }
                else{
                    result = result[0];
                    if(result.starred == undefined){
                        res.status(404).send(JSON.stringify({
                            success: false,
                            msg: "The event was not found in starred events"
                        }))
                    }
                    else{
                        let idx = result.starred.indexOf(req.body.eventId);
                        if (idx > -1) {
                            result.starred.splice(idx, 1);
                            db.participants.update({id: req.userData.id}, result, function(error, updateResult){
                                if(error){
                                    res.status(502).send(JSON.stringify({
                                        success: false,
                                        msg: "Database fetch error occured"
                                    }))
                                }
                                else{
                                    res.status(200).send(JSON.stringify({
                                        success: true
                                    }))
                                }
                            })
                        }
                        else{  
                            res.status(404).send(JSON.stringify({
                                success: false,
                                msg: "The event was not found in starred events"
                            }))
                        }
                    }
                }
            }
        })
    }
})

router.post('/addFCMToken', checkAuth, (req, res) => {
    if (req.body.token == undefined) {
        return res.status(403).send(JSON.stringify({
            success: false,
            msg: "Token is required"
        }));
    }
    db.fcm.find({ id: req.userData.id }, function (error, result) {
        if (error) {
            res.status(502).send(JSON.stringify({
                success: false,
                msg: "Database fetch error occurred"
            }));
        }
        else {
            if (result.length == 0) {
                db.fcm.insert({ id: req.userData.id, tokens: [req.body.token] }, function (error, result) {
                    if (error) {
                        res.status(502).send(JSON.stringify({
                            success: false,
                            msg: "Database fetch error occurred"
                        }));
                    }
                    else {
                        res.status(200).send(JSON.stringify({
                            success: true
                        }))
                    }
                });
            }
            else {
                if (result[0].tokens.indexOf(req.body.token) > -1) {
                    return res.status(409).send(JSON.stringify({
                        success: false,
                        msg: "Token already exists"
                    }));
                }
                result[0].tokens.push(req.body.token);
                db.fcm.update({ id: req.userData.id }, { $set: { tokens: result[0].tokens } }, function (error, result) {
                    if (error) {
                        res.status(502).send(JSON.stringify({
                            success: false,
                            msg: "Database fetch error occurred"
                        }));
                    }
                    else {
                        res.status(200).send(JSON.stringify({
                            success: true
                        }))
                    }
                })
            }
        }
    })
})


router.post('/removeFCMToken', checkAuth, (req, res) => {
    if (req.body.token == undefined) {
        return res.status(403).send(JSON.stringify({
            success: false,
            msg: "Token is required"
        }));
    }
    db.fcm.find({ id: req.userData.id }, function (error, result) {
        if (error) {
            res.status(502).send(JSON.stringify({
                success: false,
                msg: "Database fetch error occurred"
            }));
        }
        else {
            if (result.length == 0) {
                res.status(404).send(JSON.stringify({
                    success: false,
                    msg: "No such token exists"
                }));
            }
            else {
                let idx = result[0].tokens.indexOf(req.body.token)
                if (idx > -1) {
                    result[0].tokens.splice(idx, 1);

                    db.fcm.update({ id: req.userData.id }, { $set: { tokens: result[0].tokens } }, function (error, result) {
                        if (error) {
                            res.status(502).send(JSON.stringify({
                                success: false,
                                msg: "Database fetch error occurred"
                            }));
                        }
                        else {
                            res.status(200).send(JSON.stringify({
                                success: true
                            }))
                        }
                    })
                }
                else {
                    return res.status(404).send(JSON.stringify({
                        success: false,
                        msg: "Token not found"
                    }));
                }
            }
        }
    })
})

/**
 * Feeds routes
 */

router.get('/getAllFeeds', function (req, res) {
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


router.post('/getFeedsAfter', function (req, res) {
    db.announcements.find({ timestamp: { $gt: req.body.timestamp } }, function (error, result) {
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



module.exports = router;