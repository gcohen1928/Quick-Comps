import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import Navbar from './components/Navbar/navbar'
import SplitScreen from './components/Home/home-screen';
import SmallCentered from './components/Footer/footer';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/layout";
import Home from "./pages/home";
import ScanningTool from './pages/scanning-tool';
import Feedback from "feeder-react-feedback";
import "feeder-react-feedback/dist/feeder-react-feedback.css"; // import stylesheet
import Pricing from './pages/pricing';
import './App.css'
import LogIn from './pages/login';
import Amplify from 'aws-amplify';
import { COGNITO } from './configs/aws-configs'
import { Switch } from 'react-router'
import { ReactNotifications } from 'react-notifications-component'
import SignUp from './pages/signup';
import Verification from './pages/verification';

Amplify.configure({
  aws_cognito_region: COGNITO.REGION,
  aws_user_pools_id: COGNITO.USER_POOL_ID,
  aws_user_pools_web_client_id: COGNITO.APP_CLIENT_ID,
});


function App() {
  return (
    <ChakraProvider theme={theme}>
      <ReactNotifications />
      <Box textAlign="top" fontSize="xl">
        <BrowserRouter>
        <Navbar />
          <Routes>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/scanning-tool" element={<ScanningTool />} />
            <Route path='/pricing' element={<Pricing />} />
            <Route path='/log-in' element={<LogIn />} />
            <Route path='/sign-up' element={<SignUp />} />
          </Routes>
        </BrowserRouter>
        <Feedback primaryColor="#66BB6A" projectId="62976cc43a88130004177023" />
        <SmallCentered />
      </Box>
    </ChakraProvider>
  );
}

export default App;
