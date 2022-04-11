import React, {useState, useEffect} from 'react'
import LoggedInNavBar from './LoggedInNavBar'
import { Button, Modal, Form, FormGroup, Spinner, Alert, Table, Card, CardGroup  } from 'react-bootstrap';
import ProductSearchWebModal from './ProductSearchWebModal';
const ShoppingPage = () => {

  const [showProductSearchWebModal, setShowProductSearchWebModal] = useState(false)

  const handleCloseProductSearchWebModal = () => setShowProductSearchWebModal(false)
  const handleShowProductSearchWebModal = () => setShowProductSearchWebModal(true)

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

  const [shoppingItems, setShopppingItems] = useState(cartItems)

  const onRemoveItemButton = (index) => {
    let cartCopy = [...shoppingItems];
    cartCopy.splice(index, 1)
    setShopppingItems(cartCopy)
  }

  return (
    <div>
        <LoggedInNavBar />
        <ProductSearchWebModal show={showProductSearchWebModal} handleClose={handleCloseProductSearchWebModal}/>

        <div style={{justifyContent: 'center', marginLeft: '38%', marginTop: '3%'}}>
          <Button style={{margin: '1rem'}} onClick={handleShowProductSearchWebModal}> Vision-based Product Search </Button>
          <Button style={{margin: '1rem'}}> Voice-based Product Search </Button>
        </div>


        <div>
            <h2 style={{textAlign: 'center', marginTop: '8%'}}>Your Cart</h2>
            {shoppingItems? 
              <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap' ,marginTop: '3%', marginLeft: '18%', 
                    marginRight: '15%', justifyContent: 'center', border: '1px solid', marginBottom: '5%'}}>
              {shoppingItems.map((product, index) => {
                  return (
                    <Card key={index} style={{width: '18rem', margin: '1rem'}}>
                    <Card.Img variant="top" src="holder.js/100px180" />
                    <Card.Body>
                      <Card.Title>{product.title}</Card.Title>
                      <Card.Text>
                        {product.description}
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