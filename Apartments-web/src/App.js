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
import WithSubnavigation from './components/Navbar/navbar2';
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

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="top" fontSize="xl">
        <WithSubnavigation />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/scanning-tool" element={<ScanningTool />} />
                <Route path='/pricing' element={<Pricing />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Feedback primaryColor="#66BB6A" projectId="62976cc43a88130004177023" />
        <SmallCentered />
      </Box>
    </ChakraProvider>
  );
}

export default App;
