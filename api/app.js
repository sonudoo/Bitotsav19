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