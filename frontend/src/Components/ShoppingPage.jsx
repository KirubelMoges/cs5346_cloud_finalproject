import React, {useState, useEffect} from 'react'
import LoggedInNavBar from './LoggedInNavBar'
import { Button, Modal, Form, FormGroup, Spinner, Alert, Table, Card, CardGroup  } from 'react-bootstrap';
import ProductSearchWebModal from './ProductSearchWebModal';
import ProductSearchVoiceModal from './ProductSearchVoiceModal';
import { UserActivity } from '../Api/UserActivity';
const userActivity = new UserActivity()
const ShoppingPage = () => {

  const [showProductSearchWebModal, setShowProductSearchWebModal] = useState(false)
  const [showProductSearchVoiceModal, setShowProductSearchVoiceModal] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  const handleCloseProductSearchWebModal = () => setShowProductSearchWebModal(false)
  const handleShowProductSearchWebModal = () => setShowProductSearchWebModal(true)

  const handleCloseVoiceModal = () => setShowProductSearchVoiceModal(false)
  const handleShowVoiceModal = () => setShowProductSearchVoiceModal(true)

  var cartItems = [{
    title: 'Product 1',
    description: 'Some quick example text to build on the card title and make up the bulk ofthe cards content.',
    Price: '$15',
    img: 'holder.js/100px180'
  },
  {
    title: 'Product 2',
    description: 'Some quick example text to build on the card title and make up the bulk ofthe cards content.',
    Price: '$15',
    img: 'holder.js/100px180'
  },
  {
    title: 'Product 3',
    description: 'Some quick example text to build on the card title and make up the bulk ofthe cards content.',
    Price: '$15',
    img: 'holder.js/100px180'
  },
  {
    title: 'Product 4',
    description: 'Some quick example text to build on the card title and make up the bulk ofthe cards content.',
    Price: '$15',
    img: 'holder.js/100px180'
  },
  {
    title: 'Product 5',
    description: 'Some quick example text to build on the card title and make up the bulk ofthe cards content.',
    Price: '$15',
    img: 'holder.js/100px180'
  },
  {
    title: 'Product 6',
    description: 'Some quick example text to build on the card title and make up the bulk ofthe cards content.',
    Price: '$15',
    img: 'holder.js/100px180'
  },
  {
    title: 'Product 7',
    description: 'Some quick example text to build on the card title and make up the bulk ofthe cards content.',
    Price: '$15',
    img: 'holder.js/100px180'
  },
  {
    title: 'Product 8',
    description: 'Some quick example text to build on the card title and make up the bulk ofthe cards content.',
    Price: '$15',
    img: 'holder.js/100px180'
  }]

  const [shoppingCart, setShopppingCart] = useState([])

  const onRemoveItemButton = (index) => {
    let cartCopy = [...shoppingCart];
    cartCopy.splice(index, 1)
    setShopppingCart(cartCopy)
  }

  const addToCart = (item) => {
    let copyCart = [];
    if(shoppingCart) copyCart = [...shoppingCart]
    console.log("Current Shopping Cart is: ", shoppingCart)
    console.log("Current Item is: ", item)
    copyCart.push(item)
    setShopppingCart(copyCart)
  }

  const gatherUserInfo = async () => {
    await userActivity.getUserInfo().then((res) => setUserInfo(res))
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

        <div style={{display:'flex',justifyContent: 'center', marginTop: '5%'}}>
          <Button style={{margin: '1rem'}} onClick={handleShowProductSearchWebModal}> Vision-based Product Search </Button>
          <Button style={{margin: '1rem'}} onClick={handleShowVoiceModal}> Voice-based Product Search </Button>
        </div>


        <div>
            <h2 style={{textAlign: 'center', marginTop: '5%'}}>Your Cart</h2>
            {shoppingCart?.length > 0? 
              <div style={{display: 'flex', justifyContent: 'flex-end', marginRight: '15%'}}>
                <Button variant='success'>Finish And Pay</Button>
              </div>
            :
            null
            }
            
            {shoppingCart? 
              <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap' ,marginTop: '3%', marginLeft: '18%', 
                    marginRight: '15%', justifyContent: 'flex-start', border: '1px solid', marginBottom: '5%'}}>
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

/*

              */