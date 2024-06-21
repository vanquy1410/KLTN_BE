const Event = require("../models/Event.models");
const mongoose = require('mongoose');
const findAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        console.log("found events", events);
        res.status(200).json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

const getOneEvent = async (req, res) => {
    const { EventName } = req.params;
    try {
        const event = await Event.findOne({ EventName: EventName });
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

const addEvent = async (req, res) => {
    const { EventName, Format, Location, StartTime, EndTime, Participants, Description } = req.body;
    try {
        const event = new Event({
            EventName: EventName,
            Format: Format,
            Location: Location,
            StartTime: StartTime,
            EndTime: EndTime,
            Participants: Participants,
            Description: Description
        });
        await event.save();
        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

const updateEventByName = async (req, res) => {
    const { EventName } = req.params;
    const { Format, Location, StartTime, EndTime, Participants, Description } = req.body;
    
    try {
        const event = await Event.findOne({ EventName: EventName });
        
        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }
        
        if (Format !== undefined) {
            event.Format = Format;
        }
        if (Location !== undefined) {
            event.Location = Location;
        }
        if (StartTime !== undefined) {
            event.StartTime = StartTime;
        }
        if (EndTime !== undefined) {
            event.EndTime = EndTime;
        }
        if (Participants !== undefined) {
            event.Participants = Participants;
        }
        if (Description !== undefined) {
            event.Description = Description;
        }
        
        await event.save();
        
        res.status(200).json(event);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

const deleteEvent = async (req, res) => {
    const { id } = req.params; // Assuming the parameter name is 'id'
    try {
        // Ensure the id is a valid ObjectID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const result = await Event.findOneAndDelete({ _id: id });
        if (!result) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

const registerEvent = async (id) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Get the event details
        const event = await Event.findOne({ id: id }).session(session);
        if (!event) throw new Error('Event not found');

        // Update the event status and delete it (example logic, adjust as needed)
        await Event.updateOne({ id: id }, { trangThai: 0 }).session(session);
        await Event.deleteOne({ id: id }).session(session);

        // Insert the event into the DangKySuKien table
        const newEventRegistration = new DangKySuKien({
            id: id,
            EventName: event.EventName,
            Format: event.Format,
            Location: event.Location,
            Participants: event.Participants,
            Description: event.Description,
            NgayDangKy: new Date(),
            TrangThaiDangKy: 'Đã đăng ký',
            trangThai: 0
        });
        await newEventRegistration.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        console.log('Event registered successfully!');
    } catch (error) {
        // Rollback the transaction on error
        await session.abortTransaction();
        console.error('Event registration failed:', error);
        throw error; // Rethrow if you want to handle it further up
    } finally {
        session.endSession();
    }
};
module.exports = {
    findAllEvents,
    getOneEvent,
    addEvent,
    updateEventByName,
    deleteEvent,
    registerEvent,
};