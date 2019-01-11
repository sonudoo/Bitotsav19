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


// Get the College List
router.get('/getCollegeList', (req, res) => {
    res.status(200).send(JSON.stringify({
        success: true,
        collegeList: collegeList
    }));
});

// Stage 2 of Registration
router.post('/verifyOTP', (req, res) => {
    db.participants
    .find({ email: req.body.email }, function(error, result) {
        if(error){
            console.log(err);
            return res.status(500).send(JSON.stringify({
                success: false
            }));
        }
        if(result.length>=1){
            if(result[0].emailOtp != req.body.emailOtp && result[0].phoneOtp != req.body.phoneOtp){
                res.status(200).send(JSON.stringify({
                    success: false,
                    msg: "Both Phone OTP and E-mail OTP are incorrect!!"
                }));
            } else if(result[0].emailOtp == req.body.emailOtp && result[0].phoneOtp != req.body.phoneOtp){
                res.status(200).send(JSON.stringify({
                    success: false,
                    msg: "Incorrect Phone OTP!!"
                }));
            } else if(result[0].emailOtp != req.body.emailOtp && result[0].phoneOtp == req.body.phoneOtp){
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
                        console.log('OTP verified.')
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
            const updatedUserInfo = {
                id: "BT18/" + result[0].counter,
                gender : req.body.gender,
                college: req.body.college,
                rollno: req.body.rollno,
                source: req.body.source,
                year: req.body.year
            }
            db.counters.update({}, { $set : { counter : parseInt(result[0].counter + 1) } }, function (error, result) {
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
                                        msg: "You are registered successfully"
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

// Stage 1 of Registration
router.post('/register',(req,res) => {
    db.participants
    .find({email: req.body.email},function(error,user){
        if(error){
            console.log(err);
            return res.status(500).send(JSON.stringify({
                success: false
            }));
        }
        if(user.length>=1 && user[0].otpVerified == true && user[0].id !== "-1"){
            res.status(200).send(JSON.stringify({
                success: false,
                msg: "The email id is already registered"
            }));
        }
        else{
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
                            console.error(`Error: error sending OTP ${error}`);
                            return res.status(500).send(JSON.stringify({
                                success: false,
                                msg: `Error sending OTP. Please try again later`,
                            }));
                        } else {
                            console.log('Phone OTP sent');
                            db.participants
                            .find({email : req.body.email},function(error,participant){
                                if(error){
                                    console.log(err);
                                    return res.status(500).send(JSON.stringify({
                                        success: false
                                    }));
                                }
                                if(participant.length == 0){
                                    //new participant
                                    bcrypt.hash(req.body.password, 10, (err, hash) =>{
                                        if(err){
                                            console.log(err);
                                            res.status(500).send(JSON.stringify({
                                                success: false
                                            }));
                                        }
                                        else{
                                            const newParticipant = {
                                                id:"-1",
                                                name: req.body.name,
                                                email: req.body.email,
                                                phno: req.body.phno,
                                                gender: "",
                                                college: "",
                                                rollno: "",
                                                source: "",
                                                year: 0,
                                                password: hash,
                                                events:[],
                                                payment:{
                                                    day1: false,
                                                    day2: false,
                                                    day3: false,
                                                    day4: false
                                                },
                                                emailOtp: emailOtpsent,
                                                phoneOtp: phoneOtpsent,
                                                otpVerified: false,
                                                verified:false
                                            };
                                            db.participants
                                            .insert(newParticipant, function (error, result) {
                                                if (error) {
                                                    return res.status(500).send(JSON.stringify({
                                                        success: false,
                                                        msg: "An unknown error occurred."
                                                    }));
                                                }
                                                console.log(result);
                                                res.status(200).send(JSON.stringify({
                                                    success: true,
                                                    msg: "OTP sent successfully"
                                                }));
                                            });
                                        }
                                    });
                                }
                                else{
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
                                                console.log(result);
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
});



// Participant Login route
router.post('/participantLogin', (req, res) =>{
    db.participants
    .find({email: req.body.email}, function(error, user) {
        if(user.length<1){
            res.status(200).send(JSON.stringify({
                success: false,
                msg: "No such participant"
            }));
        }
        else if(user[0].otpVerified == false || user[0].id == "-1"){
            res.status(200).send(JSON.stringify({
                success: false,
                msg: 'You have not been successfully registered.'
            }));
        }
        else{
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err) {
                    return res.status(500).send(JSON.stringify({
                        success: false,
                        msg: "An unknown error occurred."
                    }));
                } else{
                    if (result) {
                        return res.status(200).send(JSON.stringify({
                            success: true,
                            token: jwt.sign({
                                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 3),
                                data: {
                                    email: user[0].email,
                                    password: user[0].password,
                                    key: secretKey
                                }
                            }, secretKey)
                        }));
                    } else {
                        return res.status(200).send(JSON.stringify({
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
        } else {
            res.send(JSON.stringify({
                success: false
            }));
        }
    });
});

// Participant Authentication
const checkAuth = function (req, res, next) {
    const token = req.headers.token.split(' ')[1];
    if (token == undefined) {
        return res.status(403).send(JSON.stringify({
            success: false,
            msg: "Authentication Failed.Please Log In."
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

// Participant profile route
router.get('/dashboard', checkAuth, (req, res) => {
    db.participants
    .find({email: req.userData.email}, function(error, user){
        if(user.length<1){
            res.status(200).send(JSON.stringify({
                success: false,
                msg: "No such participant present"
            }));
        }
        else{
            res.status(200).send(JSON.stringify({
                success: true,
                data: {
                    email: user[0].email,
                    name: user[0].name,
                    gender: user[0].gender,
                    college: user[0].college,
                    id: user[0].id,
                    year: user[0].year,
                    payment : user[0].payment,
                    events: user[0].events,
                    rollno: user[0].rollno,
                    phno: user[0].phno
                }
            }));
        } else {
            const updatedUserInfo = {
                id: "BT18/" + result[0].counter,
                gender : req.body.gender,
                college: req.body.college,
                rollno: req.body.rollno,
                source: req.body.source,
                year: req.body.year
            }
            db.counters.update({}, { $set : { counter : parseInt(result[0].counter + 1) } }, function (error, result) {
                if (error) {
                    res.send(JSON.stringify({
                        success: false,
                        error: "An unknown error occured"
                    }));
                }
                else {
                    db.participants.update({ email: req.body.email }, { $set: updatedUserInfo }, function (error, result) {
                        if (error) {
                            res.send(JSON.stringify({
                                success: false,
                                error: "An unknown error occured"
                            }));
                        }
                        else {
                            return res.send(JSON.stringify({
                                success: true,
                                message: result
                            }));
                        }
                    });
                }
            });
        }
    });
});

// Update Participant Password
router.post('/updatePassword', checkAuth, (req, res) => {
    bcrypt.hash(req.body.newPassword, 10, (err, hash) =>{
        if(err){
            console.log(err);
            res.status(500).send(JSON.stringify({
                success: false
            }));
        }
        else{
            db.participants
            .update({ email: req.body.email }, { $set: { password: hash } }, function (error, result) {
                if (error) {
                    return res.status(500).send(JSON.stringify({
                        success: false,
                        msg: "An unknown error occurred."
                    }));
                }
                res.status(200).send(JSON.stringify({
                    success: true,
                    msg: "Password Updated Successfully!!"
                }));
            });
        }
    });
});

//Event Registration
router.post('/eventRegistration', checkAuth, (req, res) => {

});

//Event De-Registration
router.get('/eventDeregistration/:eventId/:bitId', checkAuth, (req, res) => {
    let bitotsavID = req.params.bitId;
    let eventID = req.params.eventId;
    let countMembers = 0;
    db.participants
    .update({
        email: req.userData.email,
        events: {
            $elemMatch:{
                eventId: eventID,
                teamLeader: bitotsavID
            }
        }
    }, {
        $pull: { events: { eventId: eventID } }
    }, function(error, result){
        if(error){
            console.log(err);
            res.status(500).send(JSON.stringify({
                success: false
            }));
        }
        console.log('Team Leader De-Registered');
        db.teams
        .find({
            eventId: eventID,
            teamLeaderId: bitotsavID
        }, function(err, team){
            if(err){
                console.log(err);
                res.status(500).send(JSON.stringify({
                    success: false
                }));
            }
            if(team.length<1){
                res.status(200).send(JSON.stringify({
                    success: false,
                    msg: "You are not registered in this event or you are not the Team Leader."
                }));
            }
            else{
                for(let i=0;i<team[0].teamMembers.length;i++){
                    const memberId = team[0].teamMembers[i];
                    db.participants
                    .update({
                        id: memberId
                    }, {
                        $pull: { events: { eventId: eventID } }
                    }, function(error, result){
                        if(error){
                            console.log(err);
                            return res.status(500).send(JSON.stringify({
                                success: false
                            }));
                        }
                        countMembers = countMembers + 1;
                        if(countMembers == team[0].teamMembers.length){
                            console.log('Team members De-Registered');
                            db.teams
                            .remove({
                                eventId: eventID,
                                teamLeaderId: bitotsavID
                            }, function(err, result){
                                if(err){
                                    console.log(err);
                                    return res.status(500).send(JSON.stringify({
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
