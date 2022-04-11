import React, {useState, useEffect} from 'react'
import { Button, Modal, Form, FormGroup, Spinner, Alert } from 'react-bootstrap';
import WebCamVerificationScreen from './WebCamVerificationScreen';

const ProductSearchWebModal = (props) => {
  const [productImage, setProductImage] = useState(null)


  const retakeImageButtonClicked = () => {
    
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

        <WebCamVerificationScreen setUserImage={setProductImage} retakeImageButtonClicked={retakeImageButtonClicked} />


        </Modal>
    </div>
  )
}

export default ProductSearchWebModal