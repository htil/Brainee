/* Project: Brainee
*  Program Name: App.js (React Framework)
*  Author: dshah3
*  Date Created: 7/20/19
*  Purpose: Base for React App, contains basic layout of components in the interface
*  Revision History:
*  V1 contains basic layout components, updated to V1.1 contains a few extra buttons under components
*/ 

//import statements for Material-UI libraries and other nested components in React app
import React from "react";
import DataContextProvider from "./contexts/DataContext";
import StreamingData from "./components/StreamingData"
import LDAPlot from './components/LDAplot.js'
import CSPPlot from './components/CSPplot.js'
//import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader'; 
import PiePlot from "./components/pie.js"
import styled from "styled-components";
import CM from "./components/confusionMatrix.js"
import Button from '@material-ui/core/Button';

//Styled div for components
const Section = styled.div`
  margin-right: 20px;
  margin-top: -20px;
`;

//Styled div for buttons
const ButtonSection = styled.div`
  margin-left: 410px;
`;

//main app function, altering head would cause program failure
function App() {
  return (
    //DataContextProvider is the React Context wrapper that stores all locally collected brain data
    <DataContextProvider>
      <StreamingData />
      <br></br>
      <Card>
        {/*Header above the Analysis Section of the app*/}
        <CardHeader 
          title="Analysis"
          titleTypographyProps={{variant: 'h6'}} 
        />
        {/*Main component layout using styled div in the row direction*/}
        <Section direction={'row'}>
          <LDAPlot />
          <PiePlot />
        </Section>
        {/*Button layout under components*/}
        <ButtonSection direction={'row'}>
          <Button variant="contained" >Learn More</Button>
          <Button variant="contained" style={{marginLeft: '775px'}}>Learn More</Button>
        </ButtonSection>

        <br />
        <br />
        {/*Second set of main component layouts using styled div in the row direction*/}
        <Section direction={'row'}>
          <CSPPlot />
          <CM />
        </Section>
        {/*Button layout under secondary components*/}
        <ButtonSection direction={'row'}>
          <Button variant="contained" >Learn More</Button>
          <Button variant="contained" style={{marginLeft: '775px'}}>Learn More</Button>
        </ButtonSection>

        <br />
        <br />
        <br />

      </Card>
    </DataContextProvider>

    );
  }

//initialization of React App
export default App;
