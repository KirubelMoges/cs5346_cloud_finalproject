import React, { useEffect, useState, useContext, } from 'react';
import { Spinner } from 'react-bootstrap';
import HomePage from './HomePage'
import { UserActivity } from '../Api/UserActivity';
import ShoppingPage from './ShoppingPage'
import { UserContext } from '../utils/context';

const HomePageController = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userContext, setUserContext] = useContext(UserContext);
    useEffect(() => {
        const userActivity = new UserActivity();
        const isLoggedIn = userActivity.isUserLoggedIn();
        isLoggedIn? setLoggedIn(true) : setLoggedIn(false)
      });

      
    return loggedIn ? <ShoppingPage /> : <HomePage />;
}

export default HomePageController