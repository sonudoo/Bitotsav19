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
            res.send(JSON.stringify({
                success: false,
                msg: "Database fetch error occured"
            }));
        }
        else {
            for (let i in result) {
                delete result[i]['_id'];
                delete result[i]['eventFacultyAdvisor'];
                delete result[i]['eventRequirement'];
                delete result[i]['eventPosition1'];
                delete result[i]['eventPosition2'];
                delete result[i]['eventPosition3'];
            }
            res.send(JSON.stringify(result));
        }
    })
});

router.post('/getEventById', function (req, res) {
    db.events.find({ eventId: req.body.eventId }, function (error, result) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                msg: "Database fetch error occured"
            }));
        }
        else {
            if (result.length != 1) {
                res.send(JSON.stringify({
                    success: false,
                    msg: "No such event found"
                }))
            }
            else {
                delete result[0]['_id'];
                delete result[0]['eventFacultyAdvisor'];
                delete result[0]['eventRequirement'];
                delete result[0]['eventPosition1'];
                delete result[0]['eventPosition2'];
                delete result[0]['eventPosition3'];

                res.send(JSON.stringify(result[0]));
            }

        }
    })
});


router.get('/getAllBCTeams', function (req, res) {
    db.championship.find({}, function (error, result) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                msg: "Database fetch error occured"
            }));
        }
        else {
            res.send(JSON.stringify(result));
        }
    })
});

/**
 * User routes
 */

router.get('/getCollegeList', (req, res) => {
    res.status(200).send(JSON.stringify({
        success: true,
        collegeList: collegeList
    }));
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
            return res.status(200).send(JSON.stringify({
                success: false,
                msg: "Captcha validation failed"
            }));
        }
        else {
            db.participants.find({ email: req.body.email }, function (error, user) {
                if (error) {
                    console.log(err);
                    return res.status(500).send(JSON.stringify({
                        success: false
                    }));
                }
                if (user.length >= 1 && user[0].otpVerified == true && user[0].id !== "-1") {
                    res.status(200).send(JSON.stringify({
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
                            console.log(error);
                            return res.status(500).send(JSON.stringify({
                                success: false,
                                msg: `Error sending Email. Please try again later`
                            }));
                        } else {
                            console.log('Email sent: ' + info.response);

                            //sending phone otp
                            let otpUrl = `http://sms.digimiles.in/bulksms/bulksms?username=di78-pantheon&password=digimile&type=0&dlr=1&destination=${req.body.phno}&source=BITSAV&message=Your Bitotsav'19 registration OTP is: ${phoneOtpsent}`;
                            request(otpUrl, (error, response, body) => {
                                if (error) {
                                    return res.status(500).send(JSON.stringify({
                                        success: false,
                                        msg: `Error sending OTP. Please try again later`,
                                    }));
                                } else {
                                    db.participants.find({ email: req.body.email }, function (error, participant) {
                                        if (error) {
                                            console.log(err);
                                            return res.status(500).send(JSON.stringify({
                                                success: false
                                            }));
                                        }
                                        if (participant.length == 0) {
                                            //new participant
                                            bcrypt.hash(req.body.password, 10, (err, hash) => {
                                                if (err) {
                                                    console.log(err);
                                                    res.status(500).send(JSON.stringify({
                                                        success: false
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
                                                            return res.status(500).send(JSON.stringify({
                                                                success: false,
                                                                msg: "An unknown error occurred."
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
                                                        success: false
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
                                                                    return res.status(500).send(JSON.stringify({
                                                                        success: false,
                                                                        msg: "An unknown error occurred."
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
            console.log(err);
            return res.status(500).send(JSON.stringify({
                success: false
            }));
        }
        if (result.length == 1) {
            if (result[0].emailOtp != req.body.emailOtp && result[0].phoneOtp != req.body.phoneOtp) {
                res.status(200).send(JSON.stringify({
                    success: false,
                    msg: "Both Phone OTP and E-mail OTP are incorrect!!"
                }));
            } else if (result[0].emailOtp == req.body.emailOtp && result[0].phoneOtp != req.body.phoneOtp) {
                res.status(200).send(JSON.stringify({
                    success: false,
                    msg: "Incorrect Phone OTP!!"
                }));
            } else if (result[0].emailOtp != req.body.emailOtp && result[0].phoneOtp == req.body.phoneOtp) {
                res.status(200).send(JSON.stringify({
                    success: false,
                    msg: "Incorrect Email OTP!!"
                }));
            } else {
                db.participants.update({ email: req.body.email }, { $set: { otpVerified: true } }, function (error, result) {
                    if (error) {
                        res.status(500).send(JSON.stringify({
                            success: false,
                            msg: "An unknown error occured"
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
            res.status(500).send(JSON.stringify({
                success: false,
                msg: "An unknown error occured"
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
                    res.status(500).send(JSON.stringify({
                        success: false,
                        msg: "An unknown error occured"
                    }));
                }
                else {
                    db.participants.update({ email: req.body.email }, { $set: updatedUserInfo }, function (error, result) {
                        if (error) {
                            res.status(500).send(JSON.stringify({
                                success: false,
                                msg: "An unknown error occured"
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
                                    console.log(error);
                                    return res.status(500).send(JSON.stringify({
                                        success: false,
                                        msg: `Error sending Conformation Email. Please try again later`
                                    }));
                                } else {
                                    console.log('Confirmation Email sent: ' + info.response);
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
            console.log(err);
            return res.status(500).send(JSON.stringify({
                success: false
            }));
        }
        if (user.length < 1) {
            res.status(200).send(JSON.stringify({
                success: false,
                msg: "You are not registered yet."
            }));
        }
        else if (user[0].otpVerified == false || user[0].id == "-1") {
            res.status(200).send(JSON.stringify({
                success: false,
                msg: 'You have not been successfully registered.'
            }));
        }
        else {
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(500).send(JSON.stringify({
                        success: false,
                        msg: "An unknown error occurred."
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
                        return res.status(200).send(JSON.stringify({
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
        return res.status(200).send(JSON.stringify({
            success: false,
            msg: "Authentication Failed. Please Log In."
        }));;
    }
    else {
        jwt.verify(token, secretKey, function (error, data) {
            if (error) {
                return res.status(500).send(JSON.stringify({
                    success: false,
                    msg: "An unknown error occurred."
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
            console.log(err);
            return res.status(500).send(JSON.stringify({
                success: false
            }));
        }
        if (user.length < 1) {
            res.status(200).send(JSON.stringify({
                success: false,
                msg: "No such participant present"
            }));
        }
        else {
            res.status(200).send(JSON.stringify({
                success: true,
                data: {
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
                }
            }));
        }
    });
});

router.post('/addFCMToken', checkAuth, (req, res) => {
    if (req.body.token == undefined) {
        return res.sendStatus(403);
    }
    db.fcm.find({ id: req.userData.id }, function (error, result) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                msg: "Database fetch error occurred"
            }));
        }
        else {
            if (result.length == 0) {
                db.fcm.insert({ id: req.userData.id, tokens: [req.body.token] }, function (error, result) {
                    if (error) {
                        res.send(JSON.stringify({
                            success: false,
                            msg: "Database fetch error occurred"
                        }));
                    }
                    else {
                        res.send(JSON.stringify({
                            success: true
                        }))
                    }
                });
            }
            else {
                if (result[0].tokens.indexOf(req.body.token) > -1) {
                    return res.send(JSON.stringify({
                        success: false,
                        msg: "Token already exists"
                    }));
                }
                result[0].tokens.push(req.body.token);
                db.fcm.update({ id: req.userData.id }, { $set: { tokens: result[0].tokens } }, function (error, result) {
                    if (error) {
                        res.send(JSON.stringify({
                            success: false,
                            msg: "Database fetch error occurred"
                        }));
                    }
                    else {
                        res.send(JSON.stringify({
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
        return res.sendStatus(403);
    }
    db.fcm.find({ id: req.userData.id }, function (error, result) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                msg: "Database fetch error occurred"
            }));
        }
        else {
            if (result.length == 0) {
                res.send(JSON.stringify({
                    success: false,
                    msg: "No such token exists"
                }));
            }
            else {
                let idx = result[0].tokens.indexOf(req.body.token)
                if (idx > -1) {
                    result[0].tokens.splice( idx, 1 );

                    db.fcm.update({ id: req.userData.id }, { $set: { tokens: result[0].tokens } }, function (error, result) {
                        if (error) {
                            res.send(JSON.stringify({
                                success: false,
                                msg: "Database fetch error occurred"
                            }));
                        }
                        else {
                            res.send(JSON.stringify({
                                success: true
                            }))
                        }
                    })
                }
                else{
                    return res.send(JSON.stringify({
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
            res.send(JSON.stringify({
                success: false,
                error: "Database fetch error occured"
            }));
        }
        else {
            res.send(JSON.stringify(result));
        }
    });
});


router.post('/getFeedsAfter', function (req, res) {
    db.announcements.find({ timestamp: { $gt: req.body.timestamp } }, function (error, result) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                error: "Database fetch error occured"
            }));
        }
        else {
            res.send(JSON.stringify(result));
        }
    });
});



module.exports = router;