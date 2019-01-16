const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../setup').db;
const jwt = require('jsonwebtoken');
const secretKey = require('../setup').secretKey;
const nodemailer = require('nodemailer');
const request = require('request');
const router = express.Router();
const bcrypt = require("bcryptjs");
const collegeList = require("../collegeList.json");


router.post("/getEventByCategory",(req,res) => {
    db.events.find({eventCategory:req.body.category},{eventFacultyAdvisor:0,eventRequirements:0,eventStatus:0},function(err,Eventsdb){
        if(err){
            return res.status(500).send(JSON.stringify({
                success: false
            }));
        }
        else {
            return res.send(Eventsdb);
        }
    })
});

router.post("/getEventById", (req, res) => {
    db.events.find({eventId: parseInt(req.body.eventId)}, function(error, result){
        if(error){
            res.send(JSON.stringify({
                success: false
            }));
        }
        else{
            return res.send(JSON.stringify(result));
        }
    })
})


module.exports = router;