const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    EventName: {
        type: String,
        required: true
    },
    Format: {
        type: String,
        required: true
    },
    Location: {
        type: String,
        required: true
    },
    StartTime: {
        type: Date,
        required: true
    },
    EndTime: {
        type: Date,
        required: true
    },
    Participants: {
        type: Number,
        required: true
    },
    Description: {
        type: String,
        required: true
    }
});

const Event = mongoose.model("Event", EventSchema, "Event");
console.log("Event model created");

module.exports = Event;