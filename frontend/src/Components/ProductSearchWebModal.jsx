import React, {useState, useEffect} from 'react'
import { Button, Modal, Form, FormGroup, Spinner, Alert } from 'react-bootstrap';
import WebCamVerificationScreen from './WebCamVerificationScreen';
import AWS_API from '../Api/AWS_API';
import GCP_API from '../Api/GCP_API'
import PexelsAPI from '../Api/PexelsAPI'

const awsAPI = new AWS_API()
const gcpAPI = new GCP_API()
const pexelsAPI = new PexelsAPI()

const ProductSearchWebModal = (props) => {
  const [productImage, setProductImage] = useState(null)
  const [gcpConsumerGoods, setGcpConsumerGoods] = useState('')
  const CONSUMER_GOOD = "CONSUMER_GOOD"
  const PURCHASE_TYPE = "VISION"

  const extractConsumerGoodPhrases = (entityArray) => {

    let value = entityArray?.map((element) => {
        if(element.type === CONSUMER_GOOD) {
            return element.name
        }
    })
    return value
  }

  const retakeImageButtonClicked = () => {
    setProductImage(null)
    setGcpConsumerGoods('')
  }

  const onCaptureImage = async () => {

    try {
      let base64_image_string = String(productImage).replace('data:image/jpeg;base64,', '')
      const response = await awsAPI.detectLabels(base64_image_string)
      //console.log("DetectLabels Response: ", response)

      let labelsArray = response['data']['Labels']
      //console.log("Labels Array: ", labelsArray)
      let nameLabelArray = labelsArray.map((x) => x['Name'])


      //console.log("NameLabelArray: ", nameLabelArray)

      const res_gcp = await gcpAPI.processSpeech(nameLabelArray.join(', '))
      //console.log("res_gcp: ", res_gcp)
      let entities = res_gcp['data']['entities']
      //console.log("Entities: ", entities)
      
      let processedEntity = extractConsumerGoodPhrases(entities)
      let filteredEntity = processedEntity.filter(e => e != null);

      setGcpConsumerGoods(filteredEntity.join(', '))

      if(filteredEntity.length > 0) {

        try {
            let card = {}
            let term = filteredEntity[0]
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
            console.log("Error with UnSplashAPI in VoiceModal")
        }
    }


    } catch(e) {
      console.log("Error with DetectLabels in ProductSearchWebModal")
    }
  }

  useEffect(() => {
    if(productImage) onCaptureImage()
  }, [productImage])

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
              Vision-based Product Search
            </Modal.Title>
          </Modal.Header>

        <Modal.Body>
          <WebCamVerificationScreen setUserImage={setProductImage} userImage={productImage} retakeImageButtonClicked={retakeImageButtonClicked} />

          <Form.Group className="mb-3" controlId="consumerGoodsTag">
              <Form.Label>Consumer Good Tags, Powered by AWS Rekognition And GCP Natural Language AI</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder={gcpConsumerGoods} readOnly/>
          </Form.Group>
        </Modal.Body>
        </Modal>
    </div>
  )
}

export default ProductSearchWebModal