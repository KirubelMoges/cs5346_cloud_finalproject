import React, {useState, useEffect} from 'react'
import { Button, Modal, Form, FormGroup, Spinner, Alert } from 'react-bootstrap';
import TwilioAPI from '../Api/TwilioAPI'

const TwilioModal = (props) => {

    const [code, setCode] = useState('')
    const [isWrongCode, setIsWrongCode] = useState(false)
    const [disableSubmitButton, setDisableSubmitButton] = useState(true)

    const randomGeneratedCode = Math.floor(Math.random() * 10000) + 1000;
    const messageToUser = `Mustang-Go Services: You authentication code is ${randomGeneratedCode}`

    

    const sendMessageToUser = async () => {
        if(props.show) {
            console.log("sendMessage Called: ")
            const twilioApi = new TwilioAPI()
            const content = {
                messageContent: {
                    body: messageToUser,
                    from: '',
                    to: props.phoneNumber
                }
            }
            const response = await twilioApi.sendMessage(content)
        }
    }

    const onSubmitCodeButton = async () => {
        if(code == randomGeneratedCode) {
            props.setIsCodeConfirmed(true)
            props.finishHandleCreateAccount()
            console.log("Code Twilio Confirmed YAY!!")
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

    const onCancelButton = () => {
        setIsWrongCode(false)
        props.onCancelButton()
    }

    useEffect(() => {
        sendMessageToUser()
    }, [props.show])

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
                    <Button style={{margin: '5px'}} onClick={onCancelButton}>Cancel</Button>
                    <Button style={{margin: '5px'}} onClick={onSubmitCodeButton} disabled={disableSubmitButton}>Submit Code</Button>
            </Modal.Footer>
        </Modal>
    </div>
  )
}

export default TwilioModal