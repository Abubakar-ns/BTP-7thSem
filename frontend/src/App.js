
import React from 'react';
import Login from './login';
import Home from './home';
import {
  ThemeProvider,
  theme,
  ColorModeProvider,
  CSSReset,
  Box,
  Flex,
  IconButton,
  useColorMode,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Textarea,
  Select,
  Checkbox, 
  CheckboxGroup
} from '@chakra-ui/react'
function App() {
  const user="abc";
  return (
    <>
      {!user
       ?
        <Login/>
        : 
          <> 
          <Home/>
          </>
        } 
    </>
  );
}

export default App;
