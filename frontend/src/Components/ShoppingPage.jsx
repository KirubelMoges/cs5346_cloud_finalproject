import React, {useState, useEffect} from 'react'
import LoggedInNavBar from './LoggedInNavBar'
import { Button, Modal, Form, FormGroup, Spinner, Alert, Table, Card, CardGroup  } from 'react-bootstrap';
import ProductSearchWebModal from './ProductSearchWebModal';
import ProductSearchVoiceModal from './ProductSearchVoiceModal';
import { UserActivity } from '../Api/UserActivity';
import ReceiptModal from './ReceiptModal';
const userActivity = new UserActivity()
const ShoppingPage = () => {

  const [showProductSearchWebModal, setShowProductSearchWebModal] = useState(false)
  const [showProductSearchVoiceModal, setShowProductSearchVoiceModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [subTotal, setSubTotal] = useState(0)

  const [userInfo, setUserInfo] = useState(null)

  const handleCloseProductSearchWebModal = () => setShowProductSearchWebModal(false)
  const handleShowProductSearchWebModal = () => setShowProductSearchWebModal(true)

  const handleCloseVoiceModal = () => setShowProductSearchVoiceModal(false)
  const handleShowVoiceModal = () => setShowProductSearchVoiceModal(true)

  const handleCloseReceiptModal = () => setShowReceiptModal(false)
  const handleShowReceiptModal = () => setShowReceiptModal(true)
 
  const [shoppingCart, setShopppingCart] = useState([])

  const onRemoveItemButton = (index) => {
    let cartCopy = [...shoppingCart];
    setSubTotal(subTotal - cartCopy[index].price)
    cartCopy.splice(index, 1)
    setShopppingCart(cartCopy)
  }

  const clearShoppingCart = () => {
    setShopppingCart([])
  }

  const addToCart = (item) => {
    let copyCart = [];
    if(shoppingCart) copyCart = [...shoppingCart]
    setSubTotal(subTotal + item.price)
    copyCart.push(item)
    setShopppingCart(copyCart)
  }

  const gatherUserInfo = async () => {
    await userActivity.getUserInfo().then((res) => setUserInfo(res))
  }

  const onFinishAndPayButton = () => {
    setShowReceiptModal(true)
  }

  useEffect(async () => {
    if(!userInfo)
      await gatherUserInfo()
  })

  return (
    <div>
        <LoggedInNavBar name={userInfo? userInfo['firstName'] + " " + userInfo['lastName'] + ", ~" + userInfo['age']: null} />
        <ProductSearchWebModal show={showProductSearchWebModal} handleClose={handleCloseProductSearchWebModal} addToCart={addToCart}/>
        <ProductSearchVoiceModal show={showProductSearchVoiceModal} handleClose={handleCloseVoiceModal} addToCart={addToCart}/>
        <ReceiptModal show={showReceiptModal} handleClose={handleCloseReceiptModal} userInfo={userInfo} 
        shoppingCart={shoppingCart} subTotal={subTotal} clearShoppingCart={clearShoppingCart}/>

        <div style={{display:'flex',justifyContent: 'center', marginTop: '5%'}}>
          <Button style={{margin: '1rem'}} onClick={handleShowProductSearchWebModal}> Vision-based Product Search </Button>
          <Button style={{margin: '1rem'}} onClick={handleShowVoiceModal}> Voice/Text-based Product Search </Button>
        </div>


        <div>
            <h2 style={{textAlign: 'center', marginTop: '5%'}}>Your Cart</h2>
            {shoppingCart?.length > 0? 
            <div style={{display:'flex', justifyContent: 'space-between', marginLeft: '21%', marginRight: '26%', marginTop: '2%'}}>
              <div>
                <Button variant='warning' disabled={true}>Sub-Total: ${subTotal}</Button>
              </div>
              <div>
                <Button variant='danger' onClick={clearShoppingCart}>Clear Cart</Button>
              </div>
              <div>
                <Button variant='success' onClick={onFinishAndPayButton}>Finish And Pay</Button>
              </div>
            </div>
              
            :
            null
            }
            
            {shoppingCart? 
              <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap' ,marginTop: '1%', marginLeft: '20%', 
                    marginRight: '25%', justifyContent: 'flex-start', border: '1px solid', marginBottom: '5%'}}>
              {shoppingCart.map((product, index) => {
                  return (
                    <Card key={index} style={{width: '18rem', margin: '1rem'}}>
                    <Card.Img variant="top" src={product.imgSrc} />
                    <Card.Body>
                      <Card.Title>{product.title}</Card.Title>
                      <Card.Text>
                        {product.description}
                      </Card.Text>
                      <Card.Text>
                        ${product.price}
                      </Card.Text>
                      <Button variant="danger" onClick={() => onRemoveItemButton(index)}>Remove</Button>
                    </Card.Body>
                  </Card>
                  )
                  })
                }
              </div>
            :
            <div>
              <h4 style={{textAlign: 'center', marginTop: '5%'}}>Empty :(</h4>
            </div>
            }
        </div>
    </div>
  )
}

export default ShoppingPage