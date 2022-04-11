import React, {useState, useEffect} from 'react'
import { Button, Modal, Form, FormGroup, Spinner, Alert } from 'react-bootstrap';
import TwilioAPI from '../Api/TwilioAPI'

const TwilioModal = (props) => {

    const [code, setCode] = useState('')
    const [isWrongCode, setIsWrongCode] = useState(false)
    const [disableSubmitButton, setDisableSubmitButton] = useState(true)
    const [randomCode, setRandomCode] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    var randomGeneratedCode = '';
    var messageToUser = '';

    

    const sendMessageToUser = async () => {
        if(props.show) {
            randomGeneratedCode = Math.floor(Math.random() * 10000) + 1000;
            setRandomCode(randomGeneratedCode)
            messageToUser = `Mustang-Go Services: You authentication code is ${randomGeneratedCode}`
            console.log("T Modal Message: ", messageToUser)
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

    const onSubmitCodeButton = () => {
        setIsLoading(true)
        if(code == randomCode) {
            props.finishProcess()
            console.log("Code Twilio Confirmed!!")
        } else {
            setIsWrongCode(true)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        if(!code)
            setDisableSubmitButton(true)
        else
            setDisableSubmitButton(false)

    }, [code])

    const onCancelButton = () => {
        setIsWrongCode(false);
        setDisableSubmitButton(true);
        props.onCancelButton();
    }

    useEffect(() => {
        if(props.show)
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
                {isWrongCode? <Alert centered={true} variant="danger">Wrong Code! Please retry</Alert> : null}
                {isLoading? <Spinner animation="grow" /> : null}
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