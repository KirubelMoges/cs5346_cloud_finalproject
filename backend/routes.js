
const AWS = require('aws-sdk');
const { MongoClient, ObjectId } = require("mongodb");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const amazonProduct = require('amazon-product-api');
const language = require('@google-cloud/language');
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
const {OperationHelper} = require('apac');
const axios = require('axios').default;
require('dotenv').config();


module.exports = function routes(app, logger) {

   const USER_COLLECTION_MONGODB = "users";
   const PRODUCT_COLLECTION_MONGODB = "products";
   const PURCHASE_HISTORY_COLLECTION_MONGODB = "purchase-history";
   const CART_COLLECTION_MONGODB = "cart"
   const MONGO_DATABASE_NAME = "mustangGoMongoDB";

   const twilio_accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
   const twilio_authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
   const system_twilio_phoneNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio Phone Number


   const twilioClient = require('twilio')(twilio_accountSid, twilio_authToken);
   const gcpNLPClient = new language.LanguageServiceClient();

   const parent = 'projects/my-project'; // Project for which to manage secrets.
   const secretId = 'foo'; // Secret ID.
   const payload = 'hello world!' // String source data.

   const secretManager = new SecretManagerServiceClient();

   console.log("Account ID Twilio: ", process.env.TWILIO_ACCOUNT_SID)

   // const googleNLPClient = new language.LanguageServiceClient({
   //    process.env.GOOGLE_CLIENT_ID,
   //    process.env.GOOGLE_CLIENt_SECRET
   // });


    const rekognition_collection_id = 'mustang-go-image-collection'

    const mongodb_uri = `mongodb+srv://admin:${process.env.mongodb_password}@mustanggomongodb.bjcmo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

    const mongoClient = new MongoClient(mongodb_uri);

    AWS.config.update({accessKeyId: process.env.aws_access_key_id, secretAccessKey: process.env.aws_secret_access_key, region: 'us-east-1'});

    const amazonProductAPI = amazonProduct.createClient({
      awsId: process.env.aws_access_key_id,
      awsSecret: process.env.aws_secret_access_key,
    });

    const rekognition = new AWS.Rekognition();
    const awsComprehend = new AWS.Comprehend()

    app.get('/', (req, res) => {
        res.status(200).send('Go to 0.0.0.0:3000.');
      });

   /**
   * @param {userImage} userImage - base64 encoded image of user
   * @returns {0, 1} - 0: no matches found or invalid input. 1: userFace pattern exists in collection
   */
    app.post('/searchuser', (req, res) => {
      let userImage = req.body['userImage'];

      //console.log("From Routes, Search Image: ", userImage)

     const imageBuffer = Buffer.from(decodeURIComponent(userImage), 'base64');

        var search_image_param = {
         "CollectionId": rekognition_collection_id,
         "FaceMatchThreshold": 90,
         "Image": { 
            "Bytes": imageBuffer,
         },
         "MaxFaces": 2,
      }
         rekognition.searchFacesByImage(search_image_param, function(err, data) {
            if (err) {
               res.status(400).json({
                  status: 0,
                  err
                });
            }
            else {
               //console.log(data);
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
     app.post('/indexFacialFeatureToCollection', (req, res) => {

      let userImage = req.body['userImage'];

     const imageBuffer = Buffer.from(decodeURIComponent(userImage), 'base64');

        var index_faces_param = {
         "CollectionId": rekognition_collection_id,
         "DetectionAttributes": [ "ALL" ],
         "Image": { 
            "Bytes": imageBuffer,
         },
         "MaxFaces": 1,
      }
         rekognition.indexFaces(index_faces_param, function(err, data) {
            if (err) {
               res.status(400).json({
                  status: 0,
                  err
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
      app.delete('/dropRekognitionCollection', (req, res) => {
         var delete_collection_params = {
            CollectionId: rekognition_collection_id
            };
            rekognition.deleteCollection(delete_collection_params, function(err, data) {
               if (err) {
                  res.status(400).json({
                     status: 0,
                     err
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
      app.delete('/deleteUserFeatureByFaceId', (req, res) => {
         let faceId = req.param('faceId')

         console.log("Backend: faceId: ", faceId)

         let params = {
               "CollectionId": rekognition_collection_id,
               "FaceIds": [ faceId ]
            };
            console.log("Rekognition Delete Face params: ", params)
            rekognition.deleteFaces(params, function(err, data) {
               if (err) {
                  console.log("AWS Error deleteing")
                  res.status(400).json({
                     status: 0,
                     err
                     });
               }
               else {
                  console.log("Success deleting: ", data);
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
       app.post('/detectfaces', async (req, res) => {
         
         let userImage = req.body['userImage'];

         const imageBuffer = Buffer.from(decodeURIComponent(userImage), 'base64');

         var detect_faces_params = {
            "Image": { 
               "Bytes": imageBuffer,
            }
         }
            rekognition.detectFaces(detect_faces_params, function(err, data) {
               if (err) {
                  res.status(400).json({
                     status: 0, 
                     err
                     });
               }
               else {
                  res.status(200).json({
                     status: 1,
                     data
                     });
               }
               });
         });

      /**
   * 
   * @param {productImage} productImage- base64 encoded image
   * @returns {0, 1} 
   */
       app.post('/detectLabels', async (req, res) => {
         
         let userImage = req.body['productImage'];

         const imageBuffer = Buffer.from(decodeURIComponent(userImage), 'base64');

         let params = {
            "Image": { 
               "Bytes": imageBuffer,
            }
         }
            rekognition.detectLabels(params, function(err, data) {
               if (err) {
                  res.status(400).json({
                     status: 0, 
                     err
                     });
               }
               else {
                  res.status(200).json({
                     status: 1,
                     data
                     });
               }
               });
         });

   
   /**
   * 
   * @param {Null} 
   * @returns {0, 1} - 0: Collection Not Created. 1: Collection created
   */
       app.post('/createRekognitionCollection', async (req, res) => {

         var params = {
            CollectionId: rekognition_collection_id
           };
            rekognition.createCollection(params, function(err, data) {
               if (err) {
                  res.status(400).json({
                     status: 0, 
                     err
                     });
               }
               else {
                  res.status(200).json({
                     status: 1,
                     data
                     });
               }
               });
         });

   /**
   * 
   * @param {userInfo} - templated content about the user that created an account
   * @returns {0, 1} - 0: Failed to store info . 1: User info successfully stored in mongodb
   */
       app.post('/addUserInfo', async (req, res) => {

         let userInfo = req.body['userInfo']
         console.log("Backend MongoDB userInfo: ", userInfo)

         try {
            console.log("Connecting MongoDB backend")
            await mongoClient.connect()

            const database = mongoClient.db(MONGO_DATABASE_NAME);

            console.log("Adding userInfo MongoDB backend")
            const data = await database.collection(USER_COLLECTION_MONGODB).insertOne(userInfo)

            console.log("MongoDB Done. Sending Back...")
            res.status(200).json({
               status: 1,
               data
               });

            } catch(err) {
               res.status(400).json({
                  status: 0, 
                  err
                  });
            } finally {

               await mongoClient.close()
            }
         
         });

   /**
   * 
   * @param {faceId} - String faceId
   * @returns {0, 1} - 0: Failed to get info. 1: UserInfo Found!
   */
       app.get('/getUserInfoByFaceId', async (req, res) => {

         let faceId = req.param('faceId')

         if(!faceId) {
            res.status(400).json({
               status: 0, 
               err: {"message":"Empty Parameter, faceId"}
               });
         }
         console.log("Backend: getUserInfo: ", {faceId})

         try {
            await mongoClient.connect()

            const database = mongoClient.db(MONGO_DATABASE_NAME);

            const data = await database.collection(USER_COLLECTION_MONGODB).findOne({faceId})

            console.log("Success /getUserInfoByFaceId: ", {data})
            res.status(200).json({
               status: 1,
               data
               });

            } catch(err) {
               console.log("Fail /getUserInfoByFaceId: ", {err})
               res.status(400).json({
                  status: 0, 
                  err
                  });
            } finally {

               await mongoClient.close()
            }
         
         });

      /**
   * 
   * @param {None} - 
   * @returns {0, 1} - 0: Failed to get info. 1: UserInfo Found!
   */
       app.get('/getAllUserDocuments', async (req, res) => {

         try {
            await mongoClient.connect()

            const database = mongoClient.db(MONGO_DATABASE_NAME);

            const data = await database.collection(USER_COLLECTION_MONGODB).find().toArray()

            res.status(200).json({
               status: 1,
               data
               });

            } catch(err) {
               res.status(400).json({
                  status: 0, 
                  err
                  });
            } finally {

               await mongoClient.close()
            }
         
         });

   /**
   * 
   * @param {documentId} - 
   * @returns {0, 1} - 0: Failed to get info. 1: UserInfo Found!
   */
          app.get('/getUserById', async (req, res) => {

            let id = req.param('id')
            console.log("id is: ", id)
            try {
               await mongoClient.connect()
   
               const database = mongoClient.db(MONGO_DATABASE_NAME);
   
               const data = await database.collection(USER_COLLECTION_MONGODB).findOne({"_id": ObjectId(id)})
   
               res.status(200).json({
                  status: 1,
                  data
                  });
   
               } catch(err) {
                  res.status(400).json({
                     status: 0, 
                     err
                     });
               } finally {
   
                  await mongoClient.close()
               }
            
            });

      /**
   * 
   * @param {documentId} - 
   * @returns {0, 1} - 0: Failed to get info. 1: Done
   */
       app.delete('/deleteUserById', async (req, res) => {

         let id = req.param('id')
         console.log("DeleteUserById: ", {id})
         try {
            await mongoClient.connect()

            const database = mongoClient.db(MONGO_DATABASE_NAME);

            const data1 = await database.collection(USER_COLLECTION_MONGODB).findOneAndDelete({"_id": ObjectId(id)})
            const data2 = await database.collection(PURCHASE_HISTORY_COLLECTION_MONGODB).deleteMany({"_id": ObjectId(id)})
            const data = {data1, data2}
            res.status(200).json({
               status: 1,
               data
               });

            } catch(err) {
               res.status(400).json({
                  status: 0, 
                  err
                  });
            } finally {

               await mongoClient.close()
            }
         
         });

   /**
   * 
   * @param {productInfo} - templated content about product info
   * @returns {0, 1} - 0: Failed to product info . 1: product info successfully stored in mongodb
   */
       app.post('/addProductInfo', async (req, res) => {

         let productInfo = req.body['productInfo']

         try {

            await mongoClient.connect()

            const data = await database.collection(PRODUCT_COLLECTION_MONGODB).insertOne(productInfo)

            res.status(200).json({
               status: 1,
               data
               });

         } catch(err) {
            res.status(400).json({
               status: 0, 
               err
               });
         } finally {

            await mongoClient.close()
         }
         

         });

      /**
   * 
   * @param {userInfo} - templated content about a users purchase history
   * @returns {0, 1} - 0: Failed to store info . 1: Purchase info successfully stored in mongodb
   */
       app.post('/addPurchaseInfo', async (req, res) => {

         let purchaseInfo = req.body['purchaseInfo']

         try {

            await mongoClient.connect()

            const data = await database.collection(PURCHASE_HISTORY_COLLECTION_MONGODB).insertOne(purchaseInfo)

            res.status(200).json({
               status: 1,
               data
               });

         } catch(err) {
            res.status(400).json({
               status: 0, 
               err
               });
         } finally {

            await mongoClient.close()
         }
         
         });

   
         /**
   * 
   * @param {messageContent} - message
   * @returns {0, 1} - 0: Failed . 1: Success
   */
         app.post('/twilioMessage', async (req, res) => {

         const {messageContent} = req.body
         messageContent.from = system_twilio_phoneNumber

         try {
            twilioClient.messages
            .create(messageContent)
            .then(
               message => {console.log(message.sid)
                  res.status(200).json({
                     status: 1,
                     data
                     });
               
               })
         } catch(err) {
            console.log("Error Sending Twilio Message: ", err)
            res.status(400).json({
               status: 0, 
               err
               });
         }
         
         });

            /**
   * 
   * @param {userCardInfo} - message
   * @returns {0, 1} - 0: Failed . 1: Success
   */
         app.post('/payment', async (req, res) => {

            let content = req.body['content']
            let amount = content.amount * 100
            let customer = content.stripeCustomerId

            try {
               const data = await stripe.charges.create({
                  amount: amount,
                  currency: "USD",
                  customer: customer,
                  description: "Mustang-Go Services",
                  source: "tok_mastercard"
               }, {
                  apiKey: process.env.STRIPE_SECRET_KEY
                })


               res.status(200).json({
                  status: 1,
                  data
                  });

            } catch(err) {
               res.status(400).json({
                  status: 0, 
                  err
                  });
            }
         
         });


   /**
   * 
   * @param {} - message
   * @returns {0, 1} - 0: Failed . 1: Success
   */
         app.post('/initialPaymentInfo', async (req, res) => {

            let { source, email } = req.body["userPaymentInfo"]

            try {
               const data = await stripe.customers.create({source, email},{
                  apiKey: process.env.STRIPE_SECRET_KEY
                });

               res.status(200).json({
                  status: 1,
                  data
                  });

            } catch(err) {
               console.log("Sending bad request ", err)
               res.status(400).json({
                  status: 0, 
                  err
                  });
            }
      });

      /**
   * 
   * @param {keyWord} - message
   * @returns {0, 1} - 0: Failed . 1: Success
   */
       app.post('/productSearch', async (req, res) => {

         let keyWord = req.body["keyWord"]

         try {
            console.log("Amazon Product Search API ", keyWord)
            const data = await amazonProductAPI.itemSearch(keyWord)

            res.status(200).json({
               status: 1,
               data
               });

         } catch(err) {
            console.log("Sending bad request ", err)
            res.status(400).json({
               status: 0, 
               err
               });
         }
   });


   /**
   * 
   * @param {sentence} - message
   * @returns {0, 1} - 0: Failed . 1: Success
   */
          app.post('/processSpeechGCP', async (req, res) => {

            let sentence = req.body["sentence"]

            const document = {
               content: sentence,
               type: 'PLAIN_TEXT',
             };

            try {

               const data = await gcpNLPClient.analyzeEntities({document});

               res.status(200).json({
                  status: 1,
                  data
                  });
   
            } catch(err) {
               console.log("Sending bad request ", err)
               res.status(400).json({
                  status: 0, 
                  err
                  });
            }
      });



   /**
   * 
   * @param {sentence} - message
   * @returns {0, 1} - 0: Failed . 1: Success
   */
       app.post('/processSpeechAWS', async (req, res) => {

         let sentence = req.body["sentence"]

          let params = {
            "LanguageCode": "en",  /* required */
            "Text": sentence /* required */
          }

         try {

            awsComprehend.detectKeyPhrases(params, function(err, data) {
               if (err) {
                  res.status(400).json({
                     status: 0, 
                     err
                     });
               }
               else {
                  res.status(200).json({
                     status: 1,
                     data
                     });
               }
               });

         } catch(err) {
            res.status(400).json({
               status: 0, 
               err
               });
         }
   });



   /**
   * 
   * @param {query} - message
   * @returns {0, 1} - 0: Failed . 1: Success
   */
       app.get('/searchPexels', async (req, res) => {

         let query = req.param('query')

         let config = {
            headers: {
              'Authorization': `${process.env.REACT_APP_PEXELS_API_KEY}`,
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          };

         try {
            const {data} = await axios.get(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, config);
            res.status(200).json({
               status: 1,
               data
               });

         } catch(err) {
            console.log("Pexels Error is: ", err)
            res.status(400).json({
               status: 0, 
               err
               });
         }
   });


}