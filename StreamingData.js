import React, { Component } from "react";
import Muse from "./muse";
import styled from "styled-components";
import Button from '@material-ui/core/Button';
import { DataContext } from "../contexts/DataContext";
import SmoothieComponent, { TimeSeries } from 'react-smoothie'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader'; 
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box'
import LDAPlot from './LDAplot'
import logo from '../images/PNG/Brainee_192px.png'
import DataContextProvider from "../contexts/DataContext";




const Section = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: ${props => props.direction};
  justify-content: center;
  align-items: center;
`;

const StreamingSection = styled.div`
  width: 100%;
  height: 90px;
  display: flex;
  flex-direction: ${props => props.direction};
  justify-content: center;
  align-items: center;
`;

const ChildSection = styled.div`
  margin-right: 100px;
  margin-top: -75px;
`;

const ButtonSection = styled.div`
  margin-left: 400px;
  margin-top: -10px;
  display: flex;
  flex-direction: ${props => props.direction};
  justify-content: center;
`;

const SmoothieSection = styled.div`
  margin-top: -75px;
`;

const CardSection = styled.div`
  margin-left: 100px;
  margin-top: -50px;
  margin-right: -700px;
  width: 500px;
`;

const StartSection = styled.div`
  margin-top: -100px;
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: ${props => props.direction};
  justify-content: center;
  align-items: center;
`;

const SecondarySection = styled.div`
  margin-top: -10px;
  margin-left: 800px;
  height: 60%;


`;

class StreamingData extends Component {
  static contextType = DataContext;
  constructor(props) {
    super(props);
    this.state = { isRunning: false, counter: 0, isConnected: false };
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

    var storageArray = {
      af7: [],
      af8: [],
      tp9: [],
      tp10: []
    }

    var status;

    
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

      if (!isRunning && counter%2!==0){
        return
      }
     
      else{
        thisArray = storageArray[id];
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
    if (this.state.isConnected === true){
      return;
    }
    Muse.startMuse(this.processUpdate); 
    status="Device Connecting";
    this.setState({isConnected: !this.state.isConnected});
    console.log(this.context);
  }

  this.getStatus = () => {
    return status;
  }

  this.updateData = () => {
    switch (this.state.counter) {
      case 0:
        status="Collecting Training Set 1 Data"
        break;
      case 2:
        status="Collecting Training Set 2 Data"
        break;
      case 4:
        status="Collecting Testing Set Data"
        break;
      case 1: 
        status='Training Set 1 Uploaded \n [Click Start to collect Training Set 2 Data]'
        this.context.setTraining1(this.getArray(firstTrial));
        console.log(this.context);
        
        break;
      case 3:
        status='Training Set 2 Uploaded, click Start to collect Testing Set Data'
        this.context.setTraining2(this.getArray(secondTrial));
        console.log(this.context);
        break;
      case 5:
        status="Testing Set Uploaded, Experiment Finished"
        this.context.setTesting(this.getArray(thirdTrial));
        console.log(this.context);
        break;
      case 6:
        status="Experiment Finished"
        console.log(this.context);
       
        return;
      default:
        break;
    }
    var thisCounter = this.state.counter + 1;
    this.setState({counter: thisCounter});
    
    this.setState({isRunning: !this.state.isRunning})
  }

  this.timeSeries = (num) => {
    const ts1 = new TimeSeries({
    resetBounds: true,
    resetBoundsInterval: 3000,
});
 
setInterval(function() {
  var time = new Date().getTime();
  if (storageArray.af7.length === 0){
    ts1.append(time,0);
    //console.log(storageArray);
  }
  else{
      for (var i = 0; i < storageArray.af7.length; i++){
        ts1.append(time,storageArray.af7[i]);
      }
  } 
}, 250);

  if (num===1){
    return ts1;
  }
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
     <div>
       <Section direction={'row'}>
       <Typography variant="caption" style={{marginRight: '1400px', paddingTop: '5px'}}>
         <br />
         Experiment Name: Motor Imagery Version 1 <br />
         Patient Name: Devin Shah <br />
         Date: September 1, 2019 
          
         
       </Typography>
       
       <img src={logo} alt="Logo" style={{paddingTop: '25px'}}></img>
       </Section>
       
       <Card style={{marginTop: '30px'}}>
         <CardHeader 
            title="Live Data Streaming"
            titleTypographyProps={{variant: 'h6'}}
            
          />
          <br></br>
      <StreamingSection height={"40vh"} >
        <ChildSection>
          <Button variant="contained" onClick={() => this.init() }>{!this.state.isConnected ? 'Connect Device' : 'Disconnect Device'}</Button>
        </ChildSection>
        
     <SmoothieSection>
        <SmoothieComponent
        height={125}
        width={1500}
        labels= {{
          fillStyle: {g: 255}
        }}

        series={[
          {
            data: this.timeSeries(1),
            strokeStyle: { g: 255 },
            lineWidth: 2,
          }
        ]}  
      />
      </SmoothieSection>
      

      </StreamingSection>
      
          
        </Card>
<br></br>
        <Card style={{height: '16vh'}}>
          <CardHeader 
            title="Experimentation"
            titleTypographyProps={{variant: 'h6'}}
          />
        <StartSection direction={'row'}>
          <ButtonSection  >
      <Button onClick ={() => {this.updateData();}} style={{marginRight: "40px"}}
          variant = "contained">{!this.state.isRunning ? 'Start' : 'Stop'}
        </Button>
        <br></br>
        <Button variant="contained" color="#0069d9">Save</Button>
        </ButtonSection>
        
        <br></br>
        <Divider />
        <CardActions>
      <CardContent>
        <CardSection>
        <Typography style={{marginTop: '-10px'}}>
          Status
        </Typography>
        
        
        <Typography variant="body2" component="p">
      {this.getStatus()}
        </Typography>
        

        </CardSection>
        
      </CardContent>
      
    </CardActions>
<SecondarySection style={{borderLeft: '0.1em solid black', padding: '1em'}}>
    <Typography color="textSecondary" component="p" style={{marginRight: '300px', width: '700px'}}>

    <b>Instructions</b>: First connect your device in the above section. Once data starts streaming, click on the START button to begin the experiment. There are 3 phases to this - Training 1, Training 2 and then Testing. Each of these phases have to be started and stopped individually. Once the final Testing is done, the system will analyze your data. You can then SAVE it for that patient, and start a new experiment.
    
    </Typography>
    </SecondarySection>
  
        </StartSection>
        </Card>

        

      </div>

      

     
    );
  }
}

export default StreamingData;
