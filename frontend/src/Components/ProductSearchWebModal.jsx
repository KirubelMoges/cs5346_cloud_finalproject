import React, {useState, useEffect} from 'react'
import { Button, Modal, Form, FormGroup, Spinner, Alert } from 'react-bootstrap';
import WebCamVerificationScreen from './WebCamVerificationScreen';
import AWS_Rekognition_API_Repository from '../Api/Aws_rekognition_api';


const awsAPI = new AWS_Rekognition_API_Repository()

const ProductSearchWebModal = (props) => {
  const [productImage, setProductImage] = useState(null)


  const retakeImageButtonClicked = () => {
    setProductImage(null)
  }

  const onCaptureImage = async () => {

    try {
      let base64_image_string = String(productImage).replace('data:image/jpeg;base64,', '')
      const response = await awsAPI.detectLabels(base64_image_string)
      console.log("DetectLabels Response: ", response)

      let labelsArray = response['data']['Labels']
      console.log("Labels Array: ", labelsArray)
      let nameLabelArray = labelsArray.map((x) => x['Name'])


      console.log("NameLabelArray: ", nameLabelArray)



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
        </Modal.Body>
        </Modal>
    </div>
  )
}

export default ProductSearchWebModal