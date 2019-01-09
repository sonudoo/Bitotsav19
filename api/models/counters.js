const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    counter: {
        type: Number,
        default: "10003"
    }
});

module.exports = mongoose.model("counters", counterSchema);
