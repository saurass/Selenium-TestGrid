var express = require("express");
var router = express.Router();
var triggerController = require("../controllers/trigger")

// POST - create tinyUrl
router.post("/start", triggerController.start);
router.post("/stop", triggerController.stop);

module.exports = router;