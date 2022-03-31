import React, {useState} from 'react'
import NavBar from './NavBar'
import { Button, Modal } from 'react-bootstrap';
import CreateAccount from './CreateAccountModal';
import LogInModal from './LogInModal';

const HomePage = () => {
    const [createAccountModal, setShowCreateAccountModal] = useState(false)
    const [loginModal, setShowLoginModal] = useState(false)

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

        <CreateAccount show={createAccountModal} handleClose={handleCloseCreateAccountModal}/>
        
    </div>
  )
}

export default HomePage