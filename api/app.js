'use strict';
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const cors = require('cors');
const request = require('request');
const JSZip = require("jszip");
const fs = require("fs");
const db = require('./setup').db;


/**
 * Include all the routes
 */
const sapOpsHandler = require('./routes/sap');
const adminOpsHandler = require('./routes/admin');
const eventsOpsHandler = require('./routes/events');
const participantsOpsHandler = require('./routes/participants');
const appOpsHandler = require('./routes/app');
const contactOpsHandler = require('./routes/contact');



const app = express();

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());

/**
 * CORS middleware. This is important for letting the UI and APIs on separate domain.
 */
app.use(cors());

/**
 * Use all routes here
 */

app.use('/api/sap', sapOpsHandler);
app.use('/api/admin', adminOpsHandler);
app.use('/api/events', eventsOpsHandler);
app.use('/api/participants', participantsOpsHandler);
app.use('/api/app', appOpsHandler);
app.use('/api/contact', contactOpsHandler);

app.get('/api/likes', function (req, res) {
    let url = 'https://www.facebook.com/plugins/fan.php?id=bitotsav';
    var headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0'
    };
    request({ url: url, headers: headers }, function (error, resp, body) {
        if (error) {
            return res.send("49538");
        }
        try {
            body = body.slice(body.indexOf("_1drq"), body.length);
            body = body.slice(0, body.indexOf("</div>"));
            body = body.slice(body.indexOf(">") + 1, body.length - 5);
            body = body.replace(",", "");
            let c = parseInt(body);
            res.send(body);
        }
        catch (error) {
            res.send("49538");
        }

    });
})

app.get('/event/:id', function (req, res){
    db.events.find({eventId: parseInt(req.params.id)}, function(error, result){
        if(error){
            res.send(JSON.stringify({
                success: false,
                msg: "Database fetch error occured"
            }))
        }
        else{
            if(result.length != 1){
                res.send(JSON.stringify({
                    success: false,
                    msg: "No such event found"
                }));
            }
            else{
                let event = result[0];
                let data = `
                <!doctype html>
                    <html lang="en">
                    <head>
                        <!-- Required meta tags -->
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

                        <!-- Bootstrap CSS -->
                        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

                        <title>${event.eventName}</title>
                    </head>
                    <body>
                    <div class="container-fluid">
                        <h3 style="text-align: center;">${event.eventName}</h3>
                        <hr>
                        <h6>Day</h6>
                        <p>${event.eventDay}</p>
                        <h6>Time</h6>
                        <p>${event.eventTime}</p>
                        <h6>Venue</h6>
                        <p>${event.eventVenue}</p>
                        <h6>Description</h6>
                        <p>${event.eventDescription}</p>
                        
                        <h6>Rules</h6>
                        <ul>`
                let rules = event.eventRules.split("\n");
                for(let i in rules){
                    data += "<li>"+rules[i]+"</li>";
                }
                data += `
                </div>
                <br>
                <div class="text-center">
                    <a class="btn btn-primary" href="https://bitotsav.in/">Back to Home</a>
                </div>
                <br>
                        <!-- Optional JavaScript -->
                        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
                        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
                        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
                        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
                    </body>
                    </html>
                `;
                res.send(data);
            }
        }
    })
})

app.get('/api/backup/:password', function (req, res) {

    if (req.params.password != "1020415") {
        return res.send(JSON.stringify({
            success: false,
            msg: "Authentication failure"
        }))
    }

    let zip = new JSZip();
    db.participants.find({}, function (error, result) {
        if (error) {
            res.send(JSON.stringify({
                success: false,
                msg: "Database fetch error occured"
            }))
        }
        else {
            zip.file("participants.json", JSON.stringify(result));
            db.counters.find({}, function (error, result) {
                if (error) {
                    res.send(JSON.stringify({
                        success: false,
                        msg: "Database fetch error occured"
                    }))
                }
                else {
                    zip.file("counters.json", JSON.stringify(result));
                    db.events.find({}, function (error, result) {
                        if (error) {
                            res.send(JSON.stringify({
                                success: false,
                                msg: "Database fetch error occured"
                            }))
                        }
                        else {
                            zip.file("events.json", JSON.stringify(result));
                            db.teams.find({}, function (error, result) {
                                if (error) {
                                    res.send(JSON.stringify({
                                        success: false,
                                        msg: "Database fetch error occured"
                                    }))
                                }
                                else {
                                    zip.file("teams.json", JSON.stringify(result));
                                    db.championships.find({}, function (error, result) {
                                        if (error) {
                                            res.send(JSON.stringify({
                                                success: false,
                                                msg: "Database fetch error occured"
                                            }))
                                        }
                                        else {
                                            zip.file("championships.json", JSON.stringify(result));
                                            db.contact.find({}, function (error, result) {
                                                if (error) {
                                                    res.send(JSON.stringify({
                                                        success: false,
                                                        msg: "Database fetch error occured"
                                                    }))
                                                }
                                                else {
                                                    zip.file("contact.json", JSON.stringify(result));
                                                    db.fcm.find({}, function (error, result) {
                                                        if (error) {
                                                            res.send(JSON.stringify({
                                                                success: false,
                                                                msg: "Database fetch error occured"
                                                            }))
                                                        }
                                                        else {
                                                            zip.file("fcm.json", JSON.stringify(result));
                                                            db.saps.find({}, function (error, result) {
                                                                if (error) {
                                                                    res.send(JSON.stringify({
                                                                        success: false,
                                                                        msg: "Database fetch error occured"
                                                                    }))
                                                                }
                                                                else {
                                                                    zip.file("saps.json", JSON.stringify(result));
                                                                    db.announcements.find({}, function (error, result) {
                                                                        if (error) {
                                                                            res.send(JSON.stringify({
                                                                                success: false,
                                                                                msg: "Database fetch error occured"
                                                                            }))
                                                                        }
                                                                        else {
                                                                            zip.file("announcements.json", JSON.stringify(result));
                                                                            
                                                                            zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).pipe(res)
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
                        }
                    });
                }
            });
        }
    });
})

/**
 * Listen indefinitely on port 3000
 */
app.listen(3000, () => {
    console.log('API Server up at port 3000...');
})