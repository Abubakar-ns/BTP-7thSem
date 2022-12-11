import React, {Component} from 'react';
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
    Spacer,
    ButtonGroup
  } from '@chakra-ui/react'
  import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
export default class Navbar extends Component{
      render(){ 
        return ( 
            <Flex minWidth='max-content' alignItems='center' gap='2'>
            <Box p='2'>
              <Heading size='md'>Chakra App</Heading>
            </Box>
            <Spacer />
            <ButtonGroup gap='2' mt={2} mr={2}>
              <Button colorScheme='teal'>
              <WarningIcon w={8} h={8} color="red.500" />
                Create Alert</Button>
              <Button colorScheme='teal'>Log Out</Button>
            </ButtonGroup>
          </Flex>
        ) 
      } 
   
}