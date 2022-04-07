import React, {useState, useEffect} from 'react'
import { Button, Modal, Form, FormGroup, Spinner, Alert } from 'react-bootstrap';
import WebCamVerificationScreen from './WebCamVerificationScreen';
import AWS_Rekognition_API_Repository from '../Api/Aws_rekognition_api'

const CreateAccountModal = (props) => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [userImage, setUserImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [disableSubmitButton, setDisableSubmitButton] = useState(false)
    const [multipleFacesDetected, setMultipleFacesDetected] = useState(false)
    const [isOnlyOneFaceDetected, setIsOnlyOneFaceDetected] = useState(false)
    const [isUserAlreadyExists, setIsUserAlreadyExists] = useState(false)

    const rekognition_api = new AWS_Rekognition_API_Repository();

    const clearUserData = () => {
        setFirstName('')
        setLastName('')
        setPhoneNumber('')
        setEmail('')
        setUserImage(null)
    };

    const onCaptureUserImage = async () => {
        setIsUserAlreadyExists(false)
        let base64_image_string = String(userImage).replace('data:image/jpeg;base64,', '')
        const res = await rekognition_api.detectFaces(base64_image_string);

        if(res.status && res.data.FaceDetails.length > 1) {
            setMultipleFacesDetected(true)
        }
        else if(res.status && res.data.FaceDetails.length == 1) {
            setIsOnlyOneFaceDetected(true)
        }
        else if(res.status && res.data.FaceDetails.length == 0) {
            setMultipleFacesDetected(false)
            setIsOnlyOneFaceDetected(false)
        }
    }

    const resetImageState = () => {
        setMultipleFacesDetected(false)
        setIsOnlyOneFaceDetected(false)
    }

    const onCancelButton = () => {
        props.handleClose();
        clearUserData()
    }



    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const res = await rekognition_api.searchUser(userImage);

        console.log('Search User: ', res)

        if(res.status && res.data.FaceMatches.length > 0) {
            setIsUserAlreadyExists(true)
            clearUserData()
            setIsLoading(false);
            return
        } 
        else if (res.status && res.data.FaceMatches.length == 1) {
            const res_addFace = await rekognition_api.addFace(userImage);


            if(res_addFace.status) {
                const {FaceRecords} = res_addFace;
                const faceId = FaceRecords[0]["Face"]["FaceId"];
                const gender = FaceRecords[0]["FaceDetails"]["Gender"]["Value"];
                const age = (FaceRecords[0]["FaceDetails"]["AgeRange"]["High"] + FaceRecords[0]["FaceDetails"]["AgeRange"]["Low"]) / 2;

                console.log("Person Data: ", {faceId, gender, age})
            }
        }

        
        


        setIsLoading(false);

        // if(res) setIsLoading(false);

        // if (!res.success) {
        //     setErrors(res);
        //   } else {
        //     setUserContext(userRepository.currentUser());
        //     history.push('/');

        //     session
        //   }
    }

    useEffect(() => {
        // console.log(userImage)

        if(userImage) {
            onCaptureUserImage()
        } else {
            //Reset multipleFaceDetected state to false when user wants to retake image after warning
            console.log("User image is: ", userImage)
            resetImageState()
        }

    }, [userImage])

    useEffect(() => {
        if(firstName.length < 1 || lastName.length < 1 || phoneNumber.length < 1 || email.length < 1 || userImage == null || multipleFacesDetected || !isOnlyOneFaceDetected )
            setDisableSubmitButton(true)
        else
            setDisableSubmitButton(false)

    }, [firstName, lastName, phoneNumber, email])


  return (
    <div>
        <Modal
        show={props.show} 
        onHide={props.handleClose} 
        animation={true} 
        centered={true}
        scrollable={true}
        size='xl'
        fullscreen='lg-down'
        
        >
            <Modal.Header>
                <Modal.Title>Create Account</Modal.Title>
                {multipleFacesDetected? 

                <> <Alert variant="warning">Oops! Only one face is allowed per image! Please retake image!</Alert> </> 
                
                :
                isOnlyOneFaceDetected? 
                <> <Alert variant='success'>Perfect shot!</Alert></> : null}
                {isLoading? <Spinner animation="grow" /> : null}

                {isUserAlreadyExists?
                <><Alert variant='warning'>Hmm looks like you already have a profile! Please Log in</Alert></>
                :
                <></>
                }
            </Modal.Header>

            <Modal.Body>
                <WebCamVerificationScreen setUserImage={setUserImage} userImage={userImage}/>

                    <Form.Group className="mb-3" controlId="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="firstName" value={firstName} onChange={e => setFirstName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="lastName" value={lastName} onChange={e => setLastName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="phoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} 
                        
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        
                        />
                    </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <div >
                    <Button style={{margin: '5px'}} onClick={onCancelButton}>Cancel</Button>
                    <Button style={{margin: '5px'}} onClick={handleCreateAccount} disabled={disableSubmitButton}>Submit</Button>
                </div>
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default CreateAccountModal