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
const fs = require('fs');

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
            const bitId = "BT19/" + result[0].counter;
            const updatedUserInfo = {
                id: "BT19/" + result[0].counter,
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
                                    fs.readFile('collegeList.json', 'utf8', function readFileCallback(err, data){
                                        if (err){
                                            console.log(err);
                                        } else {
                                            obj = JSON.parse(data); //now it an object
                                            if(!obj.colleges.includes(req.body.college)){
                                                obj.colleges.push(req.body.college); //add some data
                                            }
                                            json = JSON.stringify(obj); //convert it back to json
                                            fs.writeFile('collegeList.json', json, 'utf8', function (err) {
                                                if (err) console.log(err);
                                                console.log('College File Updated!');
                                            }); // write it back
                                        }
                                    });
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

// Stage 1 of Registration
router.post('/register',(req,res) => {
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
                                                        teamName: "-1",
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
        }
    });
});



// Participant Login route
router.post('/participantLogin', (req, res) =>{
    db.participants
    .find({email: req.body.email}, function(error, user) {
        if(error){
            console.log(err);
            return res.status(500).send(JSON.stringify({
                success: false
            }));
        }
        if(user.length<1){
            res.status(200).send(JSON.stringify({
                success: false,
                msg: "You are not registered yet."
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
                            msg: 'Wrong Password.'
                        }));
                    }
                }
            });
        }
    });
});

//Get Events for registration
router.get('/getEvents', (req, res) => {
    db.events
    .find({
        eventStatus: "Scheduled"
    }, function(error, result){
        if (error) {
            return res.status(500).send(JSON.stringify({
                success: false,
                msg: "An unknown error occurred."
            }));
        }
        let data = [];
        for(let i=0;i<result.length;i++){
            data[i]={
                eventId: result[i].eventId,
                eventName: result[i].eventName,
                mini: result[i].eventMinimumMembers,
                maxx: result[i].eventMaximumMembers
            };
        }
        res.status(200).send(JSON.stringify({
            success: true,
            data: data
        }));
    });
});

// Participant Authentication
const checkAuth = function (req, res, next) {
    const token = req.headers.token.split(' ')[1];
    if (token == undefined) {
        return res.status(200).send(JSON.stringify({
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
        if(error){
            console.log(err);
            return res.status(500).send(JSON.stringify({
                success: false
            }));
        }
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
                    phno: user[0].phno,
                    teamName: user[0].teamName
                }
            }));
        }
    });
});

// Update Participant Password
router.post('/updatePassword', checkAuth, (req, res) => {
    db.participants
    .find({email: req.userData.email}, function(error, result){
        if(error){
            console.log(err);
            res.status(500).send(JSON.stringify({
                success: false
            }));
        }
        bcrypt.compare(req.body.oldPassword, req.userData.password, (err, resul) => {
            if(err){
                console.log(err);
                return res.status(500).send(JSON.stringify({
                    success: false
                }));
            }
            if(resul){
                bcrypt.hash(req.body.newPassword, 10, (err, hash) =>{
                    if(err){
                        console.log(err);
                        res.status(500).send(JSON.stringify({
                            success: false
                        }));
                    }
                    else{
                        db.participants
                        .update({ email: req.userData.email }, { $set: { password: hash } }, function (error, result) {
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
            }
            else{
                return res.status(200).send(JSON.stringify({
                    success: false,
                    msg: 'Wrong Password.'
                }));
            }
        });
    });
});

// Event Registration
router.post('/eventRegistration', checkAuth, (req, res) => {

    const memberArr = JSON.parse(req.body.members);
    if(memberArr.length == 0){
        db.participants.update({ email : req.userData.email }, {
            $push : {
                events: {
                    "eventId" : parseInt(req.body.eventId),
                    "teamLeader" : req.body.leaderId
                }
            }
        }, (error, result) => {
            if(error) {
                res.status(500).send(JSON.stringify({
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
                        return res.status(500).send(JSON.stringify({
                            success: false,
                            msg: "An unknown error occurred."
                        }));
                    }
                    console.log(result);
                    res.status(200).send(JSON.stringify({
                        success: true,
                        msg: "Team Registered Successfully"
                    }));
                });

            }
        });
    }
    let validatedMembers = 0;
    for(let j=0;j<memberArr.length;j++){
        db.participants.find({email : memberArr[j].memberEmail}, (error, result) => {
            if (error) {
                res.status(500).send(JSON.stringify({
                    success: false,
                    msg: "Some Error Occured!!"
                }));
            } else {
                if(result.length<1){
                    res.status(200).send(JSON.stringify({
                        success: false,
                        msg: `Email ${memberArr[j].memberEmail} has not registered.`
                    }));
                }
                else if(result[0].id !== memberArr[j].memberId ){
                    res.status(200).send(JSON.stringify({
                        success: false,
                        msg: "Incorrect Bitotsav ID"
                    }));
                } else if (result[0].college !== req.body.leaderCollege){
                    res.status(200).send(JSON.stringify({
                        success: false,
                        msg: `Member ${memberArr[j].memberId} does not belong to the same college`
                    }));
                } else {
                    for(let k=0;k<result[0].events.length;k++){
                        if(result[0].events[k].eventId == req.body.eventId){
                            return res.status(200).send(JSON.stringify({
                                success: false,
                                msg: `Member ${memberArr[j].memberId} is already registered to the event ${req.body.eventId}`
                            }));
                        }
                    }
                    validatedMembers = validatedMembers + 1;
                    if(validatedMembers == memberArr.length){
                        db.participants.update({email: req.body.leaderEmail}, {
                            $push : {
                                events :  {
                                    "eventId" : parseInt(req.body.eventId),
                                    "teamLeader" : req.body.leaderId
                                }
                            }
                        }, (error, result) => {
                            if (error) {
                                res.status(500).send(JSON.stringify({
                                    success: false,
                                    msg: "Some error occurred"
                                }));
                            } else {
                                console.log('Team Leader registered');
                                // update for all the members
                                let updatedMembers = 0;
                                for(let i=0;i<memberArr.length;i++){
                                    db.participants.update({ email : memberArr[i].memberEmail }, {
                                        $push : {
                                            events: {
                                                "eventId" : parseInt(req.body.eventId),
                                                "teamLeader" : req.body.leaderId
                                            }
                                        }
                                    }, (error, result) => {
                                        if(error) {
                                            res.status(500).send(JSON.stringify({
                                                success: false,
                                                msg: "Some error occurred"
                                            }));
                                        } else {
                                            updatedMembers = updatedMembers + 1;
                                            if(updatedMembers == memberArr.length){
                                                const teamM = memberArr.map(member => member.memberId);
                                                const newTeam = {
                                                    eventId: parseInt(req.body.eventId),
                                                    teamLeaderId: req.body.leaderId,
                                                    teamMembers: teamM
                                                }
                                                db.teams
                                                .insert(newTeam, function (error, result) {
                                                    if (error) {
                                                        return res.status(500).send(JSON.stringify({
                                                            success: false,
                                                            msg: "An unknown error occurred."
                                                        }));
                                                    }
                                                    console.log(result);
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
    let bitotsavID = "BT19/"+req.params.bitId;
    let eventID = parseInt(req.params.eventId);
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
                if(team[0].teamMembers.length == 0){
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
                        return res.status(200).send(JSON.stringify({
                            success: true,
                            msg: 'Team De-Registered successfully'
                        }));
                    });
                }
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

//Bitotsav Championship registration
router.post('/championship', checkAuth, (req, res) => {
    const memberCheck = 0;
    const memberUpdated = 0;
    const memberArr = JSON.parse(req.body.teamMembers);
    db.championships
    .find({teamName: req.body.teamName},function(error, team){
        if(error){
            console.log(err);
            return res.status(500).send(JSON.stringify({
                success: false
            }));
        }
        if(team.length>=1){
            return res.status(200).send(JSON.stringify({
                success: false,
                msg: `${req.body.teamName} is already in use.`
            }));
        }
        const teamM = memberArr.map(member => member.memberEmail);
        for(let i=0;i<teamM.length;i++){
            db.participants
            .find({email: teamM[i]},function(error, member){
                if(error){
                    console.log(err);
                    return res.status(500).send(JSON.stringify({
                        success: false
                    }));
                }
                if(member.length<1){
                    return res.status(200).send(JSON.stringify({
                        success: false,
                        msg: `${teamM[i]} is not registered.`
                    }));
                }
                else if(member[0].teamName !== "-1"){
                    return res.status(200).send(JSON.stringify({
                        success: false,
                        msg: `${teamM[i]} is already in a team.`
                    }));
                }
                else if (member[0].college !== req.body.leaderCollege){
                    return res.status(200).send(JSON.stringify({
                        success: false,
                        msg: "Team members must be of the same college."
                    }));
                }
                memberCheck = memberCheck + 1;
                if(memberCheck == teamM.length){
                    for(let j=0;j<teamM.length;j++){
                        db.participants
                        .update({email: teamM[j]},{
                            $set: {
                                teamName: req.body.teamName
                            }
                        },function(error, result){
                            if(error){
                                console.log(err);
                                return res.status(500).send(JSON.stringify({
                                    success: false
                                }));
                            }
                            memberUpdated = memberUpdated + 1;
                            if(memberUpdated == teamM.length){
                                const newTeam = {
                                    teamName: req.body.teamName,
                                    teamLeader: req.body.teamLeader,
                                    teamMembers: memberArr,
                                    teamPoints: 0
                                };
                                db.championships
                                .insert(newTeam, function (error, result) {
                                    if (error) {
                                        return res.status(500).send(JSON.stringify({
                                            success: false,
                                            msg: "An unknown error occurred."
                                        }));
                                    }
                                    console.log(result);
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
module.exports = router;
