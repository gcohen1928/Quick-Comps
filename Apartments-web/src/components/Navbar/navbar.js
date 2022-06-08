import React, {useState} from 'react'
import { Auth } from "aws-amplify";
import { Route, Redirect } from "react-router-dom";
import PublicNav from './navbar2';
import AuthNav from './authnav';

const Navbar = ({ component }) => {
  const [isAuthenticated, setLoggedIn] = useState(true);
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    (async () => {
      let user = null;
      try {
        user = await Auth.currentAuthenticatedUser();
        if (user) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (e) {
        setLoggedIn(false);
      }
    })();
  });

  return (
  
        isAuthenticated ? (
           <AuthNav />
        ) : (
          <PublicNav />
        )
  );
};

export default Navbar;