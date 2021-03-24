const recordEngine = require("../engine/recss.js")()

exports.start = (req, res) => {
	var {sessionId} = req.body;
	recordEngine.startRecording(sessionId);
	res.json({"token": sessionId});
	console.log("start Recording", sessionId);
}

exports.stop = (req, res) => {
	res.json({"tinyurl": "stop"});
	var {sessionId} = req.body;
	recordEngine.stopRecording(sessionId);
	console.log("stop Recording", sessionId);
}