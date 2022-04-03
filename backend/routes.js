
const { json } = require('body-parser');
var AWS = require('aws-sdk');
var uuid = require('uuid');

module.exports = function routes(app) {

    var bucketName = 'mustang-go-user-image-cluster'

    console.log("Region: ", AWS.config.region);

    AWS.config.getCredentials(function(err) {
        if (err) console.log(err.stack);
        // credentials not loaded
        else {
        console.log("Access key:", AWS.config.credentials.accessKeyId);
        }
    });

    var rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});

    var params = {
        CollectionId: 'mustang-go-user-images', /* required */
      };
      rekognition.createCollection(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
        } // an error occurred
        else     {
            console.log(data);}           // successful response
      });

    app.get('/', (req, res) => {
        res.status(200).send('Go to 0.0.0.0:3000.');
      });

}