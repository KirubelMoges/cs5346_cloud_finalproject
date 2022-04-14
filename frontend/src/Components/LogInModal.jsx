import React, {useState, useEffect} from 'react';
import { Button, Modal, Alert, Spinner } from 'react-bootstrap';
import WebCamVerificationScreen from './WebCamVerificationScreen';
import {UserActivity} from '../Api/UserActivity'
import AWS_Rekognition_API_Repository from '../Api/Aws_rekognition_api'
import MongoAPI from '../Api/MongoAPI';
import TwilioModal from './TwilioModal';
import {useNavigate} from 'react-router-dom';

const rekognition_api = new AWS_Rekognition_API_Repository();
const userActivity = new UserActivity();
const mongoAPI = new MongoAPI()

const LogInModal = (props) => {

  const [userImage, setUserImage] = useState(null)
  const [isMultipleFacesDetected, setMultipleFacesDetected] = useState(false)
  const [isOnlyOneFaceDetected, setIsOnlyOneFaceDetected] = useState(false)
  const [isNoAccountFound, setIsNoAccountFound] = useState(false)
  const [isNoFaceDetected, setIsNoFaceDetected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [someWentWrong, setSomethingWentWrong] = useState(false)
  const [disableLoginButton, setDisableLoginButton] = useState(true)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [docId, setDocId] = useState(null)

  const navigate = useNavigate();

  const [showTwilioModal, setShowTwilioModal] = useState(false)

  const handleCloseTwilioModal = () => setShowTwilioModal(false);
  const handleShowTwilioModal = () => setShowTwilioModal(true);

  const retakeImageButtonClicked = () => {
    setUserImage(null)
    resetImageState()
  }

  const resetImageState = () => {
    setMultipleFacesDetected(false)
    setIsOnlyOneFaceDetected(false)
    setSomethingWentWrong(false)
    setIsNoFaceDetected(false)
    setIsLoading(false)
    setDisableLoginButton(true)
    setIsNoAccountFound(false)
    setPhoneNumber(null)
    setShowTwilioModal(false)
    setDocId(null)
  }

  const onCaptureUserImage = async () => {

    try {
      let base64_image_string = String(userImage).replace('data:image/jpeg;base64,', '')
      const res = await rekognition_api.detectFaces(base64_image_string);

      if(res.status && res.data.FaceDetails.length > 1) {
          setMultipleFacesDetected(true)
      }
      else if(res.status && res.data.FaceDetails.length == 1) {
          setIsOnlyOneFaceDetected(true)
          setDisableLoginButton(false)
      }
      else if(res.status && res.data.FaceDetails.length == 0) {
          setMultipleFacesDetected(false)
          setIsOnlyOneFaceDetected(false)
          setIsNoFaceDetected(true)
      }
    } catch(e) {
      console.log("Error while detecting faces in AWS Rekognition in LoginModal")

    }
  }

  const onLogIn = async () => {
    setIsLoading(true)
    try {
      let base64_image_string = String(userImage).replace('data:image/jpeg;base64,', '')
      const res = await rekognition_api.searchUser(base64_image_string);

      console.log('Search User LogIn Modal: ', res)
      console.log("Face: ", res.data.FaceMatches.length)

      if(res.status == 1 && res.data.FaceMatches.length > 0) {
          setIsOnlyOneFaceDetected(false);

          const faceId = res["data"]["FaceMatches"][0]["Face"]["FaceId"]

          console.log("FaceId in Login Modal is: ", faceId)
          const res_mongo = await mongoAPI.getUserInfoByFaceId(faceId)

          if(!res_mongo['data']) {
            //If faceId is in collection, but userInfo is not in mongdDB
            setIsNoAccountFound(true)
            const res_aws = await rekognition_api.deleteUserByFaceId(faceId)
            setIsLoading(false)
            return
          }

          setPhoneNumber(res_mongo['data']['phoneNumber'])
          setDocId(res_mongo['data']['_id'])

          setShowTwilioModal(true)
          
      } 
      else if (res.status == 1 && res.data.FaceMatches.length == 0) {
        setIsNoAccountFound(true)
      } 
    } catch(e) {
        console.log("Error while implementing AWS Rekognition SearchUser API")
        setSomethingWentWrong(true)
        setIsLoading(false);
    }
    setIsLoading(false);
    
  }

  const finishLoginProcess = () => {

    userActivity.logInUser(docId)
    retakeImageButtonClicked()
  }

  const onCancelButton = () => {
    retakeImageButtonClicked()
}

  const closeModal = () => {
    retakeImageButtonClicked()
    props.handleClose()
  }

  useEffect(() => {
    if(userImage) {
        onCaptureUserImage()
    } 
}, [userImage])

  return (
    <div>
        <Modal
        show={props.show} 
        onHide={closeModal} 
        animation={true} 
        centered={true}
        scrollable={true}
        size='xl'
        fullscreen='lg-down'
        
        >
          <Modal.Header closeButton>
            <Modal.Title>
                Log In
            </Modal.Title>
            {isMultipleFacesDetected? <Alert variant="warning">Oops! Only one face is allowed per image! Please retake image!</Alert>
              :
              isOnlyOneFaceDetected? <Alert variant='success'>Perfect shot!</Alert>: null}
              {isLoading? <Spinner animation="grow" /> : null}
              {isNoFaceDetected? <Alert variant='danger'>No Face Detected!</Alert>: null}
              {someWentWrong? <Alert variant="danger">Something went Wrong! Review you input or restart!</Alert> : null}
              {isNoAccountFound? <Alert variant='danger'>Account Doesn't Exist! Please Create Account!</Alert> : null}
          </Modal.Header>

          <Modal.Body>
            <WebCamVerificationScreen setUserImage={setUserImage} userImage={userImage} retakeImageButtonClicked={retakeImageButtonClicked}/>
            <div style={{textAlign: 'center'}}>
              <br/>
              <Button variant='success' disabled={disableLoginButton} onClick={onLogIn}>Log In</Button>
            </div>

            <TwilioModal show={showTwilioModal} onCancelButton={onCancelButton} phoneNumber={phoneNumber}
            finishProcess={finishLoginProcess} handleClose={handleCloseTwilioModal}/>
          </Modal.Body>

          <Modal.Footer>

          </Modal.Footer>
        </Modal>
    </div>
  )
}

export default LogInModal