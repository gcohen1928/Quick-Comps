import { ColorModeScript } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports'


Amplify.configure(awsmobile)

const container = document.getElementById('root');
document.title = ('Quick Comps')
const root = ReactDOM.createRoot(container);

root.render(
  <StrictMode>
    <ColorModeScript />
    <App />
  </StrictMode>
);
