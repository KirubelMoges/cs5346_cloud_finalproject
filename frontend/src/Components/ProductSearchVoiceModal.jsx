import React, {useEffect, useState} from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { Button, Modal, Form, FormGroup, Spinner, Alert, Table, Card, CardGroup,  } from 'react-bootstrap';

const ProductSearchVoiceModal = (props) => {

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();

      

    //   useEffect(() => {
    //     if(transcript) {
    //         console.log("Transacript: ", transcript)
    //     }
    //   }, [transcript])

      if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
      }

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
            <Modal.Header closeButton>
                <Modal.Title>
                    Voice-based Product Search
                </Modal.Title>
            </Modal.Header>
                <div style={{marginTop: '3%', marginLeft: '5%', marginRight: '5%'}}>
                    <Form>
                        <Form.Group style={{display: 'flex', justifyContent: 'center'}} className="mb-3" controlId="microphoneStatus">
                            <Form.Label>Microphone Status: {listening ? 'On' : 'Off'}</Form.Label>
                        </Form.Group>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Button variant='success' style={{margin: '1rem'}} onClick={SpeechRecognition.startListening}>Start</Button>
                            <Button variant='danger' style={{margin: '1rem'}} onClick={SpeechRecognition.stopListening}>Stop</Button>
                            <Button  style={{margin: '1rem'}} onClick={resetTranscript}>Reset</Button>
                        </div>
                        
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Transacript</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder={transcript} readOnly/>
                        </Form.Group>
                    </Form>
                </div>
        </Modal>
    </div>
  )
}

export default ProductSearchVoiceModal