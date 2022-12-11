import React from 'react'
import logo from './components/logo.jpeg';
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
  CheckboxGroup,
  Image,
} from '@chakra-ui/react'
import { BrowserRouter as Router, Route,Routes } from "react-router-dom";
import axios from "axios"
import { useState, useRef, useContext } from 'react';
import Home from './home';

export default function LogIn() {
  const signin=()=>{
    console.log('signin');
    <Route path="/home" element={<Home/>}/>
  }
    return (
      <Flex minHeight="100vh" width="full" align="center" justifyContent="center" >
            <Box
                borderWidth={1}
                p={4}
                width="full"
                maxWidth="500px"
                boxShadow="lg"
                backgroundColor={"#f7f7f7"}
            >
                <Flex flex={1} flexDirection="column">
                  <Flex justifyContent="center">
                  <Image
                    alt={"Login Image"}
                    boxSize="200px"
                    objectFit={"cover"}
                    src={logo}
                    />
                  </Flex>
                    
                
                <Flex flex={1} flexDirection="column">
                    <FormControl id="first-name" mb="2" isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input placeholder="First Name" />
                    </FormControl>
                    <FormControl id="mobile-number" mb="2" isRequired>
                    <FormLabel>Mobile Number</FormLabel>
                    <Input placeholder="----"/>
                    </FormControl>
                </Flex>
                <Flex>
                <Button 
                width="full"
                p={4}
                backgroundColor={"#0e8566"} 
                color={"white"}
                onClick={signin}
                >
                Submit
                </Button>
                </Flex>
                </Flex>
                
            </Box>
        </Flex>
      )
}
