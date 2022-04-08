import React, {useState, useEffect} from 'react'
import { Button, Modal, Form, FormGroup, Spinner, Alert } from 'react-bootstrap';
import WebCamVerificationScreen from './WebCamVerificationScreen';
import AWS_Rekognition_API_Repository from '../Api/Aws_rekognition_api'
import * as TEMPLATE from './templates/Template'
import TwilioModal from './TwilioModal';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import MongoAPI from '../Api/MongoAPI';

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import StripeAPI from '../Api/StripeAPI';

const rekognition_api = new AWS_Rekognition_API_Repository();
const mongoAPI = new MongoAPI()
const stripeAPI = new StripeAPI()

const CreateAccountModal = (props) => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [userImage, setUserImage] = useState(null)

    const [streetAddress, setStreetAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setCityState] = useState('')
    const [country, setCountry] = useState('')
    const [fullAddress, setFullAddress] = useState('')
    
    const stripe = useStripe()
    const elements = useElements()


    const [isLoading, setIsLoading] = useState(false)
    const [disableSubmitButton, setDisableSubmitButton] = useState(false)
    const [multipleFacesDetected, setMultipleFacesDetected] = useState(false)
    const [isOnlyOneFaceDetected, setIsOnlyOneFaceDetected] = useState(false)
    const [isUserAlreadyExists, setIsUserAlreadyExists] = useState(false)
    const [isCodeConfirmed, setIsCodeConfirmed] = useState(false)

    const [showTwilioModal, setShowTwilioModal] = useState(false)
    const [someWentWrong, setSomethingWentWrong] = useState(false)

    const handleCloseTwilioModal = () => setShowTwilioModal(false);
    const handleShowTwilioModal = () => setShowTwilioModal(true);

    const clearUserData = () => {
        setFirstName('')
        setLastName('')
        setPhoneNumber('')
        setEmail('')
        retakeImageButtonClicked()
    };

    const retakeImageButtonClicked = () => {
        setUserImage(null)
        setIsLoading(false)
        setDisableSubmitButton(true)
        setIsUserAlreadyExists(false)
        setIsCodeConfirmed(false)
        setShowTwilioModal(false)
        setSomethingWentWrong(false)
        setMultipleFacesDetected(false)
        setIsOnlyOneFaceDetected(false)
    }

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

    const parseFullAddress = () => {
        if(fullAddress) {
            let {label} = fullAddress;
            setStreetAddress(label.split(',')[0])
            setCity(label.split(',')[1])
            setCityState(label.split(',')[2])
            setCountry(label.split(',')[3])
        }
    }

    const handleCreateAccount = async (e) => {

        const card = elements.getElement(CardElement);
        const ownerInfo = {email, name: firstName + ' ' + lastName}
        const res_source = await stripe.createSource(card)
        const source = res_source["source"]["id"]
        console.log("Source Frontend: ", res_source)
        console.log("Source id: ", res_source["source"]["id"])

        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        })
        let userPaymentInfo = {source, email}
        console.log("paymentMethod: ", paymentMethod)

        try {
            const res_stripe = await stripeAPI.createCustomerPaymentProfile(userPaymentInfo);
            console.log("res_stripe: ", res_stripe)
        } catch(e) {
            console.log("Error with creating account stripe frontend ", e)
        }
        

        e.preventDefault();
        parseFullAddress()
        setIsLoading(true);

        let base64_image_string = String(userImage).replace('data:image/jpeg;base64,', '')
        const res = await rekognition_api.searchUser(base64_image_string);

        console.log('Search User: ', res)
        console.log("Face: ", res.data.FaceMatches.length)

        if(res.status == 1 && res.data.FaceMatches.length > 0) {
            console.log("CreateAccount Route 1")
            setIsOnlyOneFaceDetected(false);
            setIsUserAlreadyExists(true);
        } 
        else if (res.status == 1 && res.data.FaceMatches.length == 0) {
            handleShowTwilioModal(true)
            
        } else if (res.status == 0){
            console.log("CreateAccount Route 3")
            setSomethingWentWrong(true)
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

    const finishHandleCreateAccount = async () => {

        let base64_image_string = String(userImage).replace('data:image/jpeg;base64,', '')
        const res_addFace = await rekognition_api.addFacialFeature(base64_image_string);

        if(res_addFace.status == 1) {

            const faceRecords = res_addFace["data"]["FaceRecords"]; 
            const faceId = faceRecords[0]["Face"]["FaceId"];
            const gender = faceRecords[0]["FaceDetail"]["Gender"]["Value"];
            const age = (faceRecords[0]["FaceDetail"]["AgeRange"]["High"] + faceRecords[0]["FaceDetail"]["AgeRange"]["Low"]) / 2;

            
            const userInfo = TEMPLATE.USER_INFO_TEMPLATE;
            userInfo.faceId = faceId;
            userInfo.sex = gender;
            userInfo.age = age;
            userInfo.firstName = firstName;
            userInfo.lastName = lastName;
            userInfo.email = email;
            userInfo.phoneNumber = phoneNumber;
            userInfo.street = streetAddress;
            userInfo.city = city;
            userInfo.state = state;
            userInfo.country = country

            console.log("Person Data: ", userInfo)

            // const res_mongo = await mongoAPI.addUserInfo(userInfo)
            // console.log("CreateAccount Mongo Response: ", res_mongo)

            // if(res_mongo.status) {

            // } else {
            //     setSomethingWentWrong(true)
            // }


        } else if (res_addFace.status == 0) {
            setSomethingWentWrong(true)
        }
    }

    useEffect(() => {
        // console.log(userImage)

        if(userImage) {
            onCaptureUserImage()
        } else {
            //Reset multipleFaceDetected state to false when user wants to retake image after warning
            resetImageState()
        }

    }, [userImage])

    useEffect(() => {

        if(isCodeConfirmed) {
            finishHandleCreateAccount();
        }

    }, [isCodeConfirmed])

    useEffect(() => {
        if(firstName.length < 1 || lastName.length < 1 || phoneNumber.length != 10 || email.length < 1 || userImage == null || multipleFacesDetected || !isOnlyOneFaceDetected )
            setDisableSubmitButton(true)
        else
            setDisableSubmitButton(false)

    }, [firstName, lastName, phoneNumber, email])

  return (
    <div>
        {someWentWrong? <Alert variant="danger">Something went Wrong! Please press cancel and restart</Alert> : null}
        {isUserAlreadyExists? <Alert variant="danger">Looks like you already have an account. Please log in!</Alert> : null}

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
                <><Alert variant='danger'>Hmm looks like you already have a profile! Please Log in</Alert></>
                :
                <></>
                }

                <TwilioModal show={showTwilioModal} handleClose={handleCloseTwilioModal} phoneNumber={phoneNumber} setIsCodeConfirmed={setIsCodeConfirmed} 
                onCancelButton={onCancelButton} finishHandleCreateAccount={finishHandleCreateAccount}/>
            </Modal.Header>

            <Modal.Body>
                <WebCamVerificationScreen setUserImage={setUserImage} userImage={userImage} retakeImageButtonClicked={retakeImageButtonClicked}/>

                    <Form.Group className="mb-3" controlId="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" value={firstName} onChange={e => setFirstName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" value={lastName} onChange={e => setLastName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="phoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="test" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} 
                        
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="fullAddress">
                        <Form.Label>Type Address here:</Form.Label>
                        <GooglePlacesAutocomplete
                            selectProps={{
                            fullAddress,
                            onChange: setFullAddress
                            }}
                            
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="payment">
                        <Form.Label>Card Payment Details</Form.Label>

                        <CardElement />
            
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