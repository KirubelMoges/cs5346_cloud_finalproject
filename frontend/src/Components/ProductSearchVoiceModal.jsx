import React, {useEffect, useState} from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { Button, Modal, Form, FormGroup, Spinner, Alert, Table, Card, CardGroup,  } from 'react-bootstrap';
import AWS_API from '../Api/AWS_API'
import GCP_API from '../Api/GCP_API'
import PexelsAPI from '../Api/PexelsAPI'

const awsAPI = new AWS_API()
const gcpAPI = new GCP_API()
const pexelsAPI = new PexelsAPI()


const ProductSearchVoiceModal = (props) => {

    const [processedTranscript, setProcessedTranscript] = useState('')
    const [userProductDescription, setUserProductDescription] = useState('')
    const [consumerProducts, setConsumerProducts] = useState([])
    const [awsKeyPhrases, setAwsKeyPhrases] = useState('')
    const [gcpConsumerGoods, setGcpConsumerGoods] = useState('')
    const CONSUMER_GOOD = "CONSUMER_GOOD";
    const PURCHASE_TYPE = "VOICE";

    const addText = () => {
        onTranscriptAvailable(userProductDescription)
    }

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
      } = useSpeechRecognition();

      const extractConsumerGoodPhrases = (entityArray) => {

        let value = entityArray?.map((element) => {
            if(element.type === CONSUMER_GOOD) {
                return element.name
            }
        })
        return value
      }

      const extractKeyPhrases = (phraseArray) => {
          let value = phraseArray?.map((element) => {
              return element.Text
          })
          return value
      }

      const resetValues = () => {
          resetTranscript()
          setConsumerProducts([])
          setGcpConsumerGoods('')
          setAwsKeyPhrases('')
      }

      const onStartButton = () => {
        resetValues();
        SpeechRecognition.startListening();
    }

      const onTranscriptAvailable = async (transcript) => {
        
        try {
            const res_aws = await awsAPI.processSpeech(transcript)
            const res_gcp = await gcpAPI.processSpeech(transcript)
            // console.log("res_aws: ", res_aws)
            // console.log("res_gcp: ", res_gcp)
            let processedEntity = extractConsumerGoodPhrases(res_gcp['data'][0]['entities'])
            let filteredEntity = processedEntity.filter(e => e != null);
            let processedPhraseArray = extractKeyPhrases(res_aws['data']['KeyPhrases'])
            // console.log("Processed Phrase Array: ", processedPhraseArray)
            // console.log("Filtered Array: ", filteredEntity)


            setAwsKeyPhrases(processedPhraseArray)
            setGcpConsumerGoods(filteredEntity)
            let voiceSearchResult = []
            for(let i = 0; i < processedPhraseArray?.length; i++)
            {
                for(let j = 0; j < filteredEntity?.length; j++)
                {
                    if(processedPhraseArray[i].includes(filteredEntity[j]) && !voiceSearchResult.includes(processedPhraseArray[i])) {
                        voiceSearchResult.push(processedPhraseArray[i])
                        processedPhraseArray.splice(i, 1)
                        filteredEntity.splice(j, 1)
                    }
                }
            }


            if(processedPhraseArray.length> 0 && processedPhraseArray[0].includes(filteredEntity[0]))
                {
                    voiceSearchResult.push(processedPhraseArray[0])
                }
                else {
                    voiceSearchResult.push(filteredEntity)
                }
            setConsumerProducts(voiceSearchResult.join(', '))

            if(voiceSearchResult) {
                voiceSearchResult.forEach( async (term) => {
                    if(term.length > 0) {

                        try {
                            let card = {}
                            const res_pexels = await pexelsAPI.searchForImages(term)

                            let imgSrc = res_pexels['data']['photos'][0]['src']['original']
                            let description = res_pexels['data']['photos'][0]['alt']
                            let title = term 
                            let price = Math.round(Math.random() * 400)

                            card.description = description;
                            card.title = title;
                            card.price = price;
                            card.imgSrc = imgSrc;
                            card.purchaseType = PURCHASE_TYPE
                            
                            props.addToCart(card)

                        } catch(e) {
                            console.log("Error with PexelsAPI in VoiceModal")
                        }
                    }
                })
            }
            
        } catch(e) {
            console.error("Error in ProductSearchVoiceModal while using AWS ProcessSpeech(): ", e)
        }
      }

      useEffect(() => {
        if(transcript && !listening) {
            onTranscriptAvailable(transcript)
        }
      }, [transcript, listening])

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

            <Modal.Body>
                <div style={{marginTop: '3%', marginLeft: '5%', marginRight: '5%'}}>
                        <Form>
                            <Form.Group style={{display: 'flex', justifyContent: 'center'}} className="mb-3" controlId="microphoneStatus">
                                <Form.Label>Microphone Status: {listening ? 'On' : 'Off'}</Form.Label>
                            </Form.Group>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <Button variant='success' style={{margin: '1rem'}} onClick={onStartButton}>Start</Button>
                                <Button variant='danger' style={{margin: '1rem'}} onClick={SpeechRecognition.stopListening}>Stop</Button>
                                <Button  style={{margin: '1rem'}} onClick={resetValues}>Reset</Button>
                                <Button variant='warning'  style={{margin: '1rem'}} onClick={addText}>Add Text</Button>
                            </div>


                            <Form.Group className="mb-3" controlId="transcript">
                                <Form.Label>Write Product Description:</Form.Label>
                                <Form.Control as="textarea" rows={3} value={userProductDescription} onChange={e => setUserProductDescription(e.target.value)}/>
                            </Form.Group>
                            
                            <Form.Group className="mb-3" controlId="transcript">
                                <Form.Label>Voice Transacript</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder={transcript} readOnly/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="keyPhrases">
                                <Form.Label>Key Phrases Powered by AWS Comprehend</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder={awsKeyPhrases} readOnly/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="consumerGoodsTag">
                                <Form.Label>Consumer Good Tags, Powered by GCP Natural Language AI</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder={gcpConsumerGoods} readOnly/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="consumerGoods">
                                <Form.Label>Extracted Consumer Products</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder={consumerProducts} readOnly/>
                            </Form.Group>
                        </Form>
                    </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default ProductSearchVoiceModal