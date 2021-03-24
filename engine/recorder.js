var { spawn } = require('child_process');
const md5 = require("md5");
const S3 = require("../controllers/s3controller");

function recordEngine() {

	var child = null;
	var dirName = 'tmp';
	var build = 1;

	var processMap = {};

	function startRecording(buildNumber, testName) {
		build = buildNumber
		var cmd = "ffmpeg";
		var md5Hash = md5(`${buildNumber}${testName}`);
		if(processMap[md5Hash] == undefined) {
			var args = ['-y', '-r', '12', '-f', 'mjpeg', '-i', process.env.MJPEG_URL, `${dirName}/${md5Hash}.mkv`];
			child = spawn(cmd, args);
			child.buildNumber = buildNumber;
			child.testName = testName;
			processMap[md5Hash] = child;
		}
		return md5Hash;
	}

	function stopRecording(md5Hash) {
		if(processMap[md5Hash] != undefined) {
			var tmpChild = processMap[md5Hash];
			tmpChild.stdin.pause();
			setTimeout(function() {
				tmpChild.kill();
				delete processMap[md5Hash];
				uploadThisVideo(md5Hash);
			}, 5000)
		}
		return "done";
	}

	function uploadThisVideo(md5Hash) {
		S3.saveFile(`tmp/${md5Hash}.mkv`, `selenium-tests/${md5Hash}.mkv`)
	}

	return {startRecording, stopRecording};

}

module.exports = recordEngine