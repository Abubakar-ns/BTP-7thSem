import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import { StateProvider } from './StateProvider';
import { ChakraProvider } from "@chakra-ui/react"
// import reducer, { initialState } from './reducer';
import { ColorModeScript,CSSReset } from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  {/* <StateProvider initialState={initialState} reducer={reducer}> */}
  <ChakraProvider theme={extendTheme({
      styles: {
        global: (props) => ({
          body: {
            bg: mode('white', 'rgba(42,47,50,1)')(props),
            color: mode('black', 'white')(props),
          },
        }),
      },
    })}>
        <ColorModeScript initialColorMode="light"/>
        <App/>
      </ChakraProvider>
  {/* </StateProvider> */}
</React.StrictMode>,
document.getElementById('root')
);
