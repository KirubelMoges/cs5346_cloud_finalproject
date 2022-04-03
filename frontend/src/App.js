import React, {useState, useContext} from "react";
import HomePage from "./Components/HomePage";
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { UserContext } from './utils/context';

const App = () => {

  //const userRepository = new UserRepository();
  //const [context, setContext] = useState(userRepository.currentUser());

  const [context, setContext] = useState();
 
  return (
    <UserContext.Provider value={[context, setContext]}>
      <Router>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
          </Routes>
      </Router>
    </UserContext.Provider>
  );
};


export default App;