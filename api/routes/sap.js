'use strict';

const express = require('express');
const router = express.Router();
const request = require("request");
const nodemailer = require('nodemailer');
const db = require('../setup').db;

router.post('/register', (req, res) => {
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
                db.sap.find({}, function (error, result) {
                    if (error) {
                        res.send(JSON.stringify({
                            success: false,
                            msg: "An unknown error occurred."
                        }));
                    }
                    let id = result.length + 1 + 10000;
                    let otp = Math.floor(100000 + Math.random() * 900000);
                    db.sap.insert({
                        id: id,
                        name: req.body.name,
                        email: req.body.email,
                        phno: req.body.phno,
                        college: req.body.college,
                        q1: req.body.q1,
                        q2: req.body.q2,
                        q3: req.body.q3,
                        q4: req.body.q4,
                        q5: req.body.q5,
                        otp: otp,
                        verified: false
                    }, function (error, result) {
                        if (error) {
                            res.send(JSON.stringify({
                                success: false,
                                msg: "An unknown error occurred."
                            }));
                        }
                        else {
                            let otpUrl = `http://sms.digimiles.in/bulksms/bulksms?username=di78-pantheon&password=digimile&type=0&dlr=1&destination=${req.body.phno}&source=BITSAV&message=Your SAP registration OTP is: ${otp}`;
                            request(otpUrl, (error, response, body) => {
                                if (error) {
                                    console.error(`Error: error sending OTP ${error}`);
                                    return res.send(JSON.stringify({
                                        success: false,
                                        msg: `Error sending OTP. Please try again later`,
                                    }));
                                } else {
                                    res.send(JSON.stringify({
                                        success: true,
                                        id: id
                                    }));
                                }
                            });
                        }
                    });
                })
            }
        });
    }
});


router.post('/verify', (req, res) => {
    req.checkBody('otp', 'OTP must be exactly 6 digits long').matches(/[0-9]{6,6}/, "i");
    if (req.body.id == "" ||
        req.body.id == undefined) {
        return res.send(JSON.stringify({
            success: false,
            error: "Missing SAP Id"
        }));
    }
    else if (req.validationErrors()) {
        let result = {
            success: false,
            error: req.validationErrors()
        };
        return res.send(JSON.stringify(result));
    }
    else {
        db.sap.find({ id: req.body.id, verified: false, otp: Number(req.body.otp) }, function (error, result) {
            if (error) {
                return res.send(JSON.stringify({
                    success: false,
                    msg: "An unknown error occurred."
                }));
            }
            if (result.length != 1) {
                return res.send(JSON.stringify({
                    success: false,
                    msg: "Incorrect OTP sent."
                }));
            }
            else {
                let email = result[0].email;
                db.sap.update({ id: req.body.id, verified: false, otp: Number(req.body.otp) },
                    { $set: { verified: true } },
                    function (error, result) {
                        if (error) {
                            return res.send(JSON.stringify({
                                success: false,
                                msg: "An unknown error occurred."
                            }));
                        }
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'webmaster@bitotsav.in',
                                pass: 'Bitotsav2018!@'
                            }
                        });

                        var mailOptions = {
                            from: 'Bitotsav Team <webmaster@bitotsav.in>',
                            to: email,
                            subject: 'Successfully Registered',
                            text: '',
                            html: `
                        <h2 align="center">Bitotsav</h2>
                        <p>
                        Hi,<br><br>
                        Congratulations!! You have been selected for the role of Student Ambassador of Bitotsav'19 from your college.
Team Bitotsav welcomes you on-board with great zeal and enthusiasm.
Your SAP ID is <b>BITOTSAV/SAP/${req.body.id}</b>. Kindly note this for future references.<br><br>

Kindly spare a few minutes to provide us with some necessary information about your college.<br><br>
<a href="https://docs.google.com/forms/d/e/1FAIpQLSdE2SQUSkpj2ieYnaQ47sQTqEXLFhAmf7gIyJACpkBnutw9Ng/viewform">
https://docs.google.com/forms/d/e/1FAIpQLSdE2SQUSkpj2ieYnaQ47sQTqEXLFhAmf7gIyJACpkBnutw9Ng/viewform
</a><br><br>
Below mentioned, are some of the many incentives for a Student Ambassador:<br><ul>
<li>The SAP gets an official certificate from BIT Mesra, Ranchi.</li>
<li>The SAP is given benefits in the registration fee and accommodation charges which is charged to every other participant coming at Bitotsav’ 19.</li>
<li>The SAP gets many goodies like Bitotsav’19 t-shirts, movie-tickets, gift coupons etc.</li>
<li>The SAP will get free registration and accommodation on successful registration of more than 20 people and 50% discount on his registration amount after successful registration of more than 10 people.</li>
</ul>
<br>
<u><b>Some of the Guidelines for a SAP are:</b></u><br><br>
As a Student Ambassador you would be working in the below mentioned facets.
Your tasks can broadly be divided into Online Activities and Offline Activities.
Likes, sharing and subscribing Facebook posts, YouTube Channel and Tweets come under Online Activities. Others like providing contacts, ideas and additional efforts come under Offline Activities. <br><br>
<u><b>Some general points to be noted:</b></u> Minimum conditions required to be officially recognized as a Student Ambassador and receive all the incentives from Bitotsav’18 includes continuous contribution in all the below mentioned sections.<br><ul>
<li>Each Ambassador on selection will be given a unique Ambassador’s id.</li>
<li>A college can have multiple Ambassadors.</li>
<li>The registrations will only be counted if the participants register with the Ambassador’s id.</li>
<li>Sharing and liking every post from the Bitotsav Facebook page. It must be noted that posts must be shared with ‘Everyone’ or with ‘Friends of Friends’ on the timeline.</li>
<li>Regular monitoring is done and for each share you fetch some points.</li>
<li>Every post shared should include #bitotsav_19, #colours_of_asias & #yourSAPID. Also,sharing, promoting and increasing subscription of “Bitotsav Official” YouTube channel is compulsory.</li>
<li>Promote the Bitotsav Twitter Handle and Instagram Profile.</li>
<li>There is also an award for Bitosav ’19 Shining Campus Ambassador which has additional special incentives like getting clicked with the night Artists, Winner’s picture to be announced and Displayed from the Bitotsav Stage during the nights, goodies etc.</li>
<li>Anyone found violating the guidelines or defaming Bitotsav in any way possible would bebanned from this program.</li>
</ul>
<br>
It is recommended to get connected with the members in the Contact Us page for better communication. Please follow the link below to join the WhatsApp group for SAP:<br>
<br>
<a href="https://chat.whatsapp.com/ITyOIsBmVU103K3tBR3IQ9">https://chat.whatsapp.com/ITyOIsBmVU103K3tBR3IQ9</a>
<br><br>
Regards,<br>
Publicity Team,<br> 
Bitotsav '19<br>
If the details are incorrect or this was not done by you please reach us at publicity@bitotsav.in<br>
<br>
Contact :<br>
Keshav : +91 9709316619<br>
Nishant : +91 8935900742<br>
Bhavya : +91 94627 34632<br>`
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                                return res.send(JSON.stringify({
                                    success: false,
                                    msg: `Error sending OTP. Please try again later`
                                }));
                            } else {
                                console.log('Email sent: ' + info.response);
                                return res.send(JSON.stringify({
                                    success: true
                                }));
                            }
                        });
                    }
                );
            }
        })
    }
});

module.exports = router;