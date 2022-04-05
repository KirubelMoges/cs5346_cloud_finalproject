
const { json } = require('body-parser');
var AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: "../.env" });

module.exports = function routes(app, logger) {

    var rekognition_collection_id = 'mustang-go-image-collection'

    AWS.config.update({region: 'us-east-1', accessKeyId: process.env.aws_access_key_id, secretAccessKey: process.env.aws_secret_access_key});

    var rekognition = new AWS.Rekognition();

    app.get('/', (req, res) => {
        res.status(200).send('Go to 0.0.0.0:3000.');
      });

   /**
   * @param {userImage} userImage - base64 encoded image of user
   * @returns {0, 1} - 0: no matches found or invalid input. 1: userFace pattern exists in collection
   */
    app.get('/searchimage', (req, res) => {
      let userImage = req.body['userImage'];

     const imageBuffer = Buffer.from(decodeURIComponent(userImage), 'base64');

        var search_image_param = {
         "CollectionId": rekognition_collection_id,
         "FaceMatchThreshold": 70,
         "Image": { 
            "Bytes": imageBuffer,
         },
         "MaxFaces": 2,
      }
         rekognition.searchFacesByImage(search_image_param, function(err, data) {
            if (err) {
               res.status(400).json({
                  status: 0
                });
            }
            else {
               console.log(data);
               res.status(200).json({
                  status: 1,
                  data
                });
            }
          });
    });


    /**
   * @param {userImage} userImage - base64 encoded image of user
   * @returns {0, 1} - 0: feature not added or invalid input. 1: user image feature extracted & added to collection
   */
     app.post('/addImageFeatureToCollection', (req, res) => {
      let userImage = req.body['userImage'];

     const imageBuffer = Buffer.from(decodeURIComponent(userImage), 'base64');

        var index_faces_param = {
         "CollectionId": rekognition_collection_id,
         "Image": { 
            "Bytes": imageBuffer,
         },
         "MaxFaces": 1,
      }
         rekognition.indexFaces(index_faces_param, function(err, data) {
            if (err) {
               res.status(400).json({
                  status: 0
                });
            }
            else {
               console.log(data);
               res.status(200).json({
                  status: 1,
                  data
                });
            }
          });
    });

   /**
   * @param {None} - base64 encoded image of user
   * @returns {0, 1} - 0: Collection not dropped. 1: Collection dropped
   */
      app.delete('/dropCollection', (req, res) => {
         var delete_collection_params = {
            CollectionId: rekognition_collection_id
            };
            rekognition.deleteCollection(delete_collection_params, function(err, data) {
               if (err) {
                  res.status(400).json({
                     status: 0
                     });
               }
               else {
                  console.log(data);
                  res.status(200).json({
                     status: 1,
                     data
                     });
               }
               });
         });


   /**
   * 
   * @param {faceId} faceId- base64 encoded image of user
   * @returns {0, 1} - 0: User feature deletion failed or invalid format. 1: User face feature deleted
   */
      app.delete('/deleteUserFeature', (req, res) => {
         let faceId = req.body['faceId']

         var delete_user_feature_params = {
               "CollectionId": rekognition_collection_id,
               "FaceIds": [ faceId ]
            };
            rekognition.deleteFaces(delete_user_feature_params, function(err, data) {
               if (err) {
                  res.status(400).json({
                     status: 0
                     });
               }
               else {
                  console.log(data);
                  res.status(200).json({
                     status: 1,
                     data
                     });
               }
               });
         });

      /**
   * 
   * @param {userImage} userImage- base64 encoded image of user
   * @returns {0, 1} - 0: Wrong format or more than 1 facial feature detected. 1: only 1 facial feature detected
   */
       app.get('/detectfaces', async (req, res) => {

         console.log("Request: ", req)
         
         let userImage = req.body['userImage'];

         console.log("Routes detect Faces called...", userImage)

         const imageBuffer = Buffer.from(decodeURIComponent(userImage), 'base64');

         var detect_faces_params = {
            "Image": { 
               "Bytes": imageBuffer,
            }
         }
            rekognition.detectFaces(detect_faces_params, function(err, data) {
               if (err) {
                  res.status(400).json({
                     status: 0
                     });
               }
               else {
                  console.log(data);
                  res.status(200).json({
                     status: 1,
                     data
                     });
               }
               });
         });
}