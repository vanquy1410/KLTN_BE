// src/routers/event.routers.js
const { Router } = require("express");
const eventController = require("../controllers/Event.controller");

const router = Router();

router.get("/findAllEvents", eventController.findAllEvents);
router.get("/getOneEvent/:EventName", eventController.getOneEvent);
router.post("/addEvent", eventController.addEvent);
router.put("/updateEventByName/:EventName", eventController.updateEventByName);
router.delete("/deleteEvent/:id", eventController.deleteEvent);

module.exports = router;