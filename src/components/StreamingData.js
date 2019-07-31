import React, { Component } from "react";
import Muse from "./muse";
import styled from "styled-components";
import Button from '@material-ui/core/Button';
import { DataContext } from "../contexts/DataContext";


const Section = styled.div`
  width: 100%;
  height: ${props => props.height};
  display: flex;
  flex-direction: ${props => props.direction};
  justify-content: center;
  align-items: center;
`;

class StreamingData extends Component {
  static contextType = DataContext;
  constructor(props) {
    super(props);
    this.state = { isRunning: false, counter: 0 };
    var firstTrial = {
      af7: [],
      af8: [],
      tp9: [],
      tp10: []
    }
    var secondTrial = {
      af7: [],
      af8: [],
      tp9: [],
      tp10: []
    }
    var thirdTrial = {
      af7: [],
      af8: [],
      tp9: [],
      tp10: []
    }
    
    this.addScript = src => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.type = "text/javascript";
      document.head.appendChild(script);
    };

    this.processUpdate = (id, data) => {
      let {isRunning} = this.state
      let {counter} = this.state
      let thisArray = [];

      if (!isRunning) {
        return
      }
      
      switch (counter) {
        case 1:
          thisArray = firstTrial[id];
          break;
        case 3:
          thisArray = secondTrial[id];
          break;
        case 5:
          thisArray = thirdTrial[id];
          break;
        default:
          break;
      }

      data.forEach (el => {
          var curBufferSize = thisArray.length;
          if (curBufferSize > 2000) thisArray.shift();
          thisArray.push(el);
      });
      
  }

  this.getArray = (obj) => {
    var electrodeMap = ['af7', 'af8', 'tp9', 'tp10']
    var getArray = [];
    for (var i = 0; i < electrodeMap.length; i++){
      getArray.push(obj[electrodeMap[i]]);
    }

    return getArray;
  }


  this.init = ()  => {
    Muse.startMuse(this.processUpdate); 
    console.log(this.context);
  }

  this.updateData = () => {
    switch (this.state.counter) {
      case 1: 
        this.context.setTraining1(this.getArray(firstTrial));
        console.log(this.context);
        alert("Training set 1 has been uploaded. Click start again to upload training set 2.")
        break;
      case 3:
        this.context.setTraining2(this.getArray(secondTrial));
        console.log(this.context);
        alert("The model has been trained. Click start again to upload the testing set.");
        break;
      case 5:
        this.context.setTesting(this.getArray(thirdTrial));
        console.log(this.context);
        alert("The experiment is complete. Please hit reset if you wish to stream data again.");
        break;
      case 6:
        console.log(this.context);
       
        alert("You can't enter any more data. Please his reset if you wish to stream data again.");
        return;
      default:
        break;
    }
    var thisCounter = this.state.counter + 1;
    this.setState({counter: thisCounter});
    
    this.setState({isRunning: !this.state.isRunning})
  }

  
  }
componentDidMount() {

    // BCIDevice.pack
    this.addScript(
      "https://drive.google.com/uc?export=view&id=1jG7w2D0NZIAFJYgtd25FYHT6jcoOY9FJ"
    );

    // BCIDevice.build
    this.addScript(
      "https://drive.google.com/uc?export=view&id=1qLcumUvtlX0vuIeowpVE6qHPDDfS7DjY"
    );

  }

  render() {
    
    return (
     
        <Section direction={"column"} height={"60vh"}>
        <Button variant="contained" color="primary" onClick={() => this.init() }>Connect</Button>
        <br></br>
        <Button onClick ={() => {this.updateData();}} 
          variant = "contained" color="secondary">{!this.state.isRunning ? 'Start' : 'Stop'}
        </Button>
        
      </Section>
      
    );
  }
}

export default StreamingData;
