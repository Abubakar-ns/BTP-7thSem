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
    VStack
  } from '@chakra-ui/react'
  import PathfindingVisualizer from './PathFindingVisualizer/PathFindingVisualizer';
  import Navbar from './Navbar';
export default class Home extends Component{
    constructor(props){ 
        super(props) 
            
        // Set initial state 
        this.state = {room : 8} 
            
        // Binding this keyword 
        this.updateState1 = this.updateState1.bind(this) 
        this.updateState2 = this.updateState2.bind(this) 
        this.updateState3 = this.updateState3.bind(this) 
      } 
        
      updateState1(){ 
        // Changing state 
        this.setState({room : 4}) 
      } 
      updateState2(){ 
        // Changing state 
        this.setState({room : 6}) 
      } 
      updateState3(){ 
        // Changing state 
        this.setState({room : 8}) 
      } 
          
      render(){ 
        return ( 
          <>   
            <Navbar/>
            <Flex>
            <Text m={2}>Select Layout: </Text>
            {/* Set click handler */} 
            <Button
            backgroundColor={"#0e8566"} 
            color={"white"}
             onClick={this.updateState1}
             ml={2}> 
             4*4
            </Button> 
            <Button 
            backgroundColor={"#0e8566"} 
            color={"white"}
            onClick={this.updateState2}
            ml={2}> 
              6*6
            </Button> 
            <Button 
            backgroundColor={"#0e8566"} 
            color={"white"}
            onClick={this.updateState3}
            ml={2}> 
              8*8
            </Button> 
            </Flex>
            <PathfindingVisualizer room={this.state.room}/>
          </> 
        ) 
      } 
    
}