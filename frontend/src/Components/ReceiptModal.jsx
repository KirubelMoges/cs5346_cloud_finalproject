import React, {useState, useEffect, useContext} from 'react'
import { Button, Modal, Form, FormGroup, Spinner, Alert } from 'react-bootstrap';
import StripeAPI from '../Api/StripeAPI';
import TwilioAPI from '../Api/TwilioAPI';

const twilioApi = new TwilioAPI()
const stripeAPI = new StripeAPI();

const ReceiptModal = (props) => {

    const [isLoading, setIsLoading] = useState(false)
    const [isSomethingWrong, setIsSomethingWrong] = useState(false)
    const [transactionId, setTransactionId] = useState('')
    const [complete, setComplete] = useState(false)
    const PURCHASE_TYPE_VISION = "VISION"
    const PURCHASE_TYPE_VOICE = "VOICE"

    const chargeCustomer = async () => {
        let content = {
            amount: props.subTotal,
            customer: props.userInfo.stripeCustomerId
        }

        try {

            const res_stripe = await stripeAPI.chargeCustomer(content)
            setTransactionId(res_stripe['data']['id'])
            return true;
        } catch(e) {
            console.error("Error Generating Receipt")
            setIsLoading(false)
            setIsSomethingWrong(true)
            return false
        }
    }

    const generateReceipt = async () => {

        setIsSomethingWrong(false)
        setIsLoading(true)
        setComplete(false)

        let charged = await chargeCustomer();

        if(charged) {

            let visionPurchasedItems = props.shoppingCart?.map((item) => {
                if(item.purchaseType === PURCHASE_TYPE_VISION)
                    return item.title
            })
    
            let voicePurchasedItems = props.shoppingCart?.map((item) => {
                if(item.purchaseType === PURCHASE_TYPE_VOICE)
                    return item.title
            })

            voicePurchasedItems = voicePurchasedItems.filter(e => e != null);
            visionPurchasedItems = visionPurchasedItems.filter(e => e != null);
    
            let messageToUser = 
            `Hi, ${props.userInfo.firstName}!
            Your Shopping Summary: Vision-Based Purchases: ${visionPurchasedItems?.length > 0? visionPurchasedItems.join(', ') : "NONE"}
            Voice-Based Purchases: ${voicePurchasedItems?.length > 0? voicePurchasedItems.join(', ') : "NONE"}. Voice-Based purchases will be shipped to: 
            ${props.userInfo?.street + ", " + props.userInfo?.city + ", " + props.userInfo?.state}! Your Card has been charged $${props.subTotal}. Transaction ConfirmationId: ${transactionId}. Thank you for visiting Mustang-Go Services!
            `
    
            let content = {
                messageContent: {
                    body: messageToUser,
                    from: '',
                    to: props.userInfo.phoneNumber
                }
            }

            try {
                setIsLoading(false)
                setComplete(true)
                props.clearShoppingCart()
                const res_twilio = await twilioApi.sendMessage(content)
            } catch(e) {
                console.error("Error Sending purchase message to user!")
                setIsSomethingWrong(true)
                return
            }

        } else {
            setIsSomethingWrong(true)
        }
        
        
        setIsLoading(false)
    }

    useEffect(() => {
        if(props.userInfo && props.show) {
            generateReceipt()
        } 
    }, [props.userInfo, props.show])

  return (
    <div>
        <Modal
        show={props.show} 
        onHide={props.handleClose} 
        animation={true} 
        centered={true}
        scrollable={true}
        size='sm'
        fullscreen='lg-down'
        >

        <Modal.Header closeButton>
            <Modal.Title>
                Receipt
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                {isLoading? <Spinner animation="grow" /> : null}
                {complete? <h5>Receipt Sent! Thank you!</h5> : null}
            </div>
            
            {isSomethingWrong? <Alert variant="danger">Something went Wrong!</Alert> : null}
        </Modal.Body>

        <Modal.Footer>

        </Modal.Footer>

        </Modal>
    </div>
  )
}

export default ReceiptModal