const { Converter } = require("ffmpeg-stream")
const { createReadStream, createWriteStream, writeFile, readdir, unlink } = require("fs")
const { WebDriver } = require('selenium-webdriver');
const _http = require('selenium-webdriver/http');
const S3 = require("../controllers/s3controller");
const { resolve } = require('path');
var glob = require("glob")


function recordEngine() {

	var driver = null;
	var dirName = 'tmp';
	var processMap = {};

	function startRecording(sessionId) {
		if(processMap[sessionId] != undefined) {
			return;
		}
		processMap[sessionId] = {};

		let url = process.env.SELENIUM_URL;

		processMap[sessionId]["driver"] = new WebDriver(
		    sessionId,
		    new _http.Executor(Promise.resolve(url)
		        .then(
		            url => new _http.HttpClient(url, null, null))
		    )
		);

		processMap[sessionId]["imgCount"] = 0;
		
		processMap[sessionId]["intervalId"] = setInterval(() => {
			processMap[sessionId]["driver"].takeScreenshot().then(
			    function(image, err) {
			    	processMap[sessionId]["imgCount"] = processMap[sessionId]["imgCount"] + 1;
			    	let count = processMap[sessionId]["imgCount"];
			        require('fs').writeFile(`${dirName}/${sessionId}_${count}.png`, image, 'base64', () => {});
			    }
			).catch(() => {})
		}, 500)
	}

	function stopRecording(sessionId) {
		let targetIntervalId = processMap[sessionId].intervalId;
		clearInterval(targetIntervalId);
		setTimeout(function() {
			processAndUploadVideo(sessionId, processMap[sessionId]["imgCount"]);
			delete processMap[sessionId];
		}, 10000)
	}

	function processAndUploadVideo(sessionId, imgCount) {
		var frames = [];

		for(var i = 1; i <= imgCount; i++) {
			frames.push(`tmp/${sessionId}_${i}.png`);
		}

		const conv = new Converter() // create converter
		const input = conv.input({f: 'image2pipe', r: 5}) // create input writable stream
		conv.output(`tmp-vid/${sessionId}.mp4`, {vcodec: 'libx264', pix_fmt: 'yuv420p', vf: "pad=ceil(iw/2)*2:ceil(ih/2)*2", vb: "20M"}) // output to file

		// for every frame create a function that returns a promise
		frames.map(filename => () =>
		  new Promise((fulfill, reject) =>
		      createReadStream(filename)
		      .on('end', fulfill) // fulfill promise on frame end
		      .on('error', reject) // reject promise on error
		      .pipe(input, {end: false}) // pipe to converter, but don't end the input yet
		  )
		)
		// reduce into a single promise, run sequentially
		.reduce((prev, next) => prev.then(next), Promise.resolve())
		// end converter input
		.then(() => {
			input.end();
		})

		conv.run().then(() => {
			deleteImages(sessionId);
			uploadThisVideo(sessionId);
		})
	}

	const deleteImages = (sessionId) => {
	    
		// options is optional
		glob(`tmp/${sessionId}_*.png`, function (er, files) {
		    for (const file of files) {
		        unlink(file, () => {});
		    }
		})
	}

	function uploadThisVideo(sessionId) {
		setTimeout(() => {
			S3.saveFile(`tmp-vid/${sessionId}.mp4`, `selenium-tests/${sessionId}.mp4`)
		}, 5000)
	}

	return {startRecording, stopRecording};

}

module.exports = recordEngine