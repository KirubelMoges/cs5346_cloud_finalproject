import React, {useState} from 'react'
import NavBar from './NavBar'
import { Button, Modal } from 'react-bootstrap';
import CreateAccount from './CreateAccountModal';
import LogInModal from './LogInModal';
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const HomePage = () => {
    const [createAccountModal, setShowCreateAccountModal] = useState(false)
    const [loginModal, setShowLoginModal] = useState(false)
    const stripeTestPromise = loadStripe('pk_test_51HVJJsLuWigwOfjktskWjOFiFgVQemgUC1PuGP3fdM1U1sUnKaVtSWvbA8vlcezy76OBcpqtekF6xOjfJS2NYv2Y00GNCWK0bo')


    const handleCloseLoginModal = () => setShowLoginModal(false);
    const handleShowLoginModal = () => setShowLoginModal(true);

    const handleCloseCreateAccountModal = () => setShowCreateAccountModal(false);
    const handleShowCreateAccountModal = () => setShowCreateAccountModal(true);


  return (
    <div>
        <NavBar />
        <h3 style={{textAlign: 'center', marginTop: '10%'}}>Welcome to Mustang-Go Services Shopping!</h3>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: '10%'}}>
            <Button onClick={handleShowLoginModal}>Log In</Button>
            <Button style={{marginLeft: '5px'}} onClick={handleShowCreateAccountModal}>Create Account</Button>
        </div>


        <Elements stripe={stripeTestPromise}>
          <CreateAccount show={createAccountModal} handleClose={handleCloseCreateAccountModal}/>
	    	</Elements>
        
        
    </div>
  )
}

export default HomePage