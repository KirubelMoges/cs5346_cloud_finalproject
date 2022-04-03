import React, {useState, useEffect} from 'react'
import { Button, Modal, Form, FormGroup } from 'react-bootstrap';
import WebCamVerificationScreen from './WebCamVerificationScreen';
import AWS_Rekognition_API_Repository from '../Api/Aws_rekognition_api'

const CreateAccountModal = (props) => {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [userImage, setUserImage] = useState(null)

    const [isLoading, setIsLoading] = useState(false)

    const rekognition_api = new AWS_Rekognition_API_Repository();



    const handleCreateAccount = async (e) => {
        // e.preventDefault();
        // setIsLoading(true);

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
        console.log(userImage)
    }, [userImage])


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
                        <Form.Control type="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}/>
                    </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <div >
                    <Button style={{margin: '5px'}} onClick={props.handleClose}>Cancel</Button>
                    <Button style={{margin: '5px'}} onClick={handleCreateAccount} >Submit</Button>
                </div>
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default CreateAccountModal