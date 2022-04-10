import React, { useEffect, useState, useContext, } from 'react';
import { Spinner } from 'react-bootstrap';
import HomePage from './HomePage'
import { UserActivity } from '../Api/UserActivity';
import ShoppingPage from './ShoppingPage'

const HomePageController = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        const userActivity = new UserActivity();
        const isLoggedIn = userActivity.isUserLoggedIn();
        console.log("Is logged in? ", isLoggedIn)
        isLoggedIn? setLoggedIn(true) : setLoggedIn(false)
      });

      
    return loggedIn ? <ShoppingPage /> : <HomePage />;
}

export default HomePageController