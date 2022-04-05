import React, {useState, useEffect} from 'react'
import { Button, Modal, Form, FormGroup, Spinner } from 'react-bootstrap';
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

    const rekognition_api = new AWS_Rekognition_API_Repository();

    const clearUserData = () => {
        setFirstName('')
        setLastName('')
        setPhoneNumber('')
        setEmail('')
        setUserImage(null)
    };

    const onCaptureUserImage = async () => {
        let base64_image_string = String(userImage).replace('data:image/jpeg;base64,', '')
       const res = await rekognition_api.detectFaces(base64_image_string);

       console.log("CreateModal Rek Response: ", res)
    }

    const onCancelButton = () => {
        props.handleClose();
        clearUserData()
    }



    const handleCreateAccount = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // const res = await rekognition_api.searchUser(userImage);

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
        }

    }, [userImage])

    useEffect(() => {
        if(firstName.length < 1 || lastName.length < 1 || phoneNumber.length < 1 || email.length < 1 || userImage == null )
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
                {isLoading? <Spinner animation="grow" /> : null}
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