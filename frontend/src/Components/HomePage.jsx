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

    const [stripePromise, setStripePromise] = useState(() => loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY))

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


        <Elements stripe={stripePromise}>
          <CreateAccount show={createAccountModal} handleClose={handleCloseCreateAccountModal}/>
	    	</Elements>
        
        <LogInModal show={loginModal} handleClose={handleCloseLoginModal} />
    </div>
  )
}

export default HomePage