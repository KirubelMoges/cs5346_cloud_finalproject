import React, {useState, useEffect} from 'react'
import { Button, Modal, Form, FormGroup, Spinner, Alert } from 'react-bootstrap';
import TwilioAPI from '../Api/TwilioAPI'

const TwilioModal = (props) => {

    const [code, setCode] = useState(null)
    const [isWrongCode, setIsWrongCode] = useState(false)
    const [disableSubmitButton, setDisableSubmitButton] = useState(true)

    const randomGeneratedCode = Math.random(100000) + 1000;
    const messageToUser = `Mustang-Go Services: You authentication code is ${randomGeneratedCode}`

    const twilioApi = new TwilioAPI()

    const content = {
        messageContent: {
            body: messageToUser,
            from: '',
            to: props.phoneNumber
        }
    }

    const onSubmitCodeButton = async () => {
        const response = await twilioApi.sendMessage(content)

        console.log("Twilio.jsx Response: ", response)
        if(code == randomGeneratedCode) {
            props.setIsCodeConfirmed(true)
        } else {
            setIsWrongCode(true)
        }
    }

    useEffect(() => {
        if(!code)
            setDisableSubmitButton(true)
        else
            setDisableSubmitButton(false)

    }, [code])

  return (
    <div>
        <Modal
        show={props.show} 
        onHide={props.handleClose} 
        animation={true} 
        centered={true}
        scrollable={true}
        size='lg'
        fullscreen='lg-down'
        >
            <Modal.Header>
                <Modal.Title>Phone Verification</Modal.Title>
                {isWrongCode? <Alert variant="danger">Wrong Code! Please retry</Alert> : null}
            </Modal.Header>

            <Modal.Body>
                <Form.Group className="mb-3" controlId="code">
                            <Form.Label>Enter the code you just received on your phone #</Form.Label>
                            <Form.Control type="code" value={code} onChange={e => setCode(e.target.value)}
                                                    onKeyPress={(event) => {
                                                        if (!/[0-9]/.test(event.key)) {
                                                          event.preventDefault();
                                                        }
                                                      }}/>
                        </Form.Group>
                </Modal.Body>
            <Modal.Footer>
                    <Button style={{margin: '5px'}} onClick={props.onCancelButton}>Cancel</Button>
                    <Button style={{margin: '5px'}} onClick={onSubmitCodeButton} disabled={disableSubmitButton}>Submit Code</Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default TwilioModal