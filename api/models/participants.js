const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: {
        type: String,
        default: "-1"
    },
    name: {
      type: String,
      required: true,
      default: ""
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phno: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      default: ""
    },
    college: {
      type: String,
      default: ""
    },
    rollno: {
      type: String,
      default: ""
    },
    source: {
      type: String,
      default: ""
    },
    year: {
      type: Number
    },
    password: {
      type: String,
      required: true
    },
    events: [{
        eventId: {
            type: Number,
            required: true
        },
        teamLeader: {
            type: String,
            required: true
        }
    }],
    payment: {
        day1: {
            type: Boolean,
            default: false
        },
        day2: {
            type: Boolean,
            default: false
        },
        day3: {
            type: Boolean,
            default: false
        },
        day4: {
            type: Boolean,
            default: false
        }
    },
    emailOtp: {
      type: Number,
      default: -1
    },
    phoneOtp: {
      type: Number,
      default: -1
    },
    otpVerified: {
      type: Boolean,
      default: false
    },
    verified: {
      type: Boolean,
      default: false
    }
});

module.exports = mongoose.model("participants", ParticipantSchema);
