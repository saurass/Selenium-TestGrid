const fs = require("fs");
const AWS = require('aws-sdk');;
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_IAM_KEY,
    secretAccessKey: process.env.AWS_IAM_SECRET
});

exports.saveFile = (filePath, fileKey) => {
    return new Promise((resolve, reject) => {
        s3.upload({
            Bucket: process.env.AWS_S3_BUCKET,
            Body: fs.createReadStream(filePath),
            Key: fileKey
        }, (err, data) => {
            resolve(data);
        });
    })
}