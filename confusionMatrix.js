import React, { Component } from 'react'
import { DataContext } from "../contexts/DataContext";
import { makeStyles } from '@material-ui/core/styles';
import bci from "bcijs/browser.js"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import styled from "styled-components";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'


const Section = styled.div`
  width: 100%;
  height: 150px;
  display: flex;
  flex-direction: ${props => props.direction};
  justify-content: center;
  align-items: center;
`;

var bac = 0;
var cm = [[0,0],[0,0]]



export class confusionMatrix extends Component {
    static contextType = DataContext;

    

    computeFeatures = (cspParams, eeg) => {
        let epochSize = 64; // About a fourth of a second per feature
          let trialLength = 150; // Each set of 750 samples is from a different trial
          let features = bci.windowApply(eeg, trial => { 
              
              return bci.windowApply(trial, epoch => {
                  let cspSignals = bci.cspProject(cspParams, epoch, 2);
                  
                  return bci.features.logvar(cspSignals, 'columns');
              }, epochSize, epochSize / 2);
          }, trialLength, trialLength);
      
          // Concat the features from each trial
          return [].concat(...features);
      }


    render() {
        const { training1, training2, testing } = this.context;

        if (training1.length>0 && training2.length>0 && testing.length>0){

            let cspParams = bci.cspLearn(bci.transpose(training1), bci.transpose(training2));
            let featuresTraining1 = this.computeFeatures(cspParams, bci.transpose(training1));
            let featuresTraining2 = this.computeFeatures(cspParams, bci.transpose(training2));
            let ldaParams = bci.ldaLearn(featuresTraining1, featuresTraining2);
            let rightTesting = this.computeFeatures(cspParams, bci.transpose(testing));
            let leftTesting = this.computeFeatures(cspParams, bci.transpose(training1));

            let classify = (feature) => {
                let projection = bci.ldaProject(ldaParams, feature);
                // Filter out values between -0.5 and 0.5 as unknown classes
                if(projection < -1) return 0;
                if(projection > 1) return 1;
                return -1;
            }

            
            let rightPredictions = rightTesting.map(classify).filter(value => value !== -1);
            let leftPredictions = leftTesting.map(classify).filter(value => value !== -1);

            let leftActual = new Array(leftPredictions.length).fill(0);
            let rightActual = new Array(rightPredictions.length).fill(1);


            let predictions = leftPredictions.concat(rightPredictions);
            let actual = leftActual.concat(rightActual);


            cm = bci.confusionMatrix(predictions, actual);

            bac = bci.balancedAccuracy(cm);

        }

        else{
            console.log('Cool')
        }

        

        

        return (
            <div>
               <Grid style={{width: '950px', marginLeft: '900px', height: '500px', marginTop: '-500px'}}>
               <Typography gutterBottom variant="h5" component="div" >
                  <Box style={{marginLeft: '375px'}} fontWeight="fontWeightBold" m={1}>
                    Confusion Matrix
                </Box>
                </Typography>
                <br />
                   <Section direction={'row'}>
                   <Grid >
                    <Paper style={{height: '150px', width: '150px'}}>
                        <Typography style={{fontSize: '3em', paddingTop: '45px'}} align='center'>{cm[0][0]}</Typography>
                    </Paper>
                   </Grid>
                   <Grid >
                   <Paper style={{height: '150px', width: '150px'}}>
                        <Typography style={{paddingTop: '45px', fontSize: '3em'}} align='center'>{cm[0][1]}</Typography>
                    </Paper>
                   </Grid>
                   </Section>
                   <Section direction={'row'}>
                   <Grid >
                   <Paper style={{height: '150px', width: '150px'}}>
                        <Typography style={{paddingTop: '45px', fontSize: '3em'}} align='center'>{cm[1][0]}</Typography>
                    </Paper>
                   </Grid>
                   <Grid >
                   <Paper style={{height: '150px', width: '150px'}}>
                        <Typography style={{paddingTop: '45px', fontSize: '3em'}} align='center'>{cm[1][1]}</Typography>
                    </Paper>
                   </Grid>
                   </Section>
                   <br />
                   <Typography gutterBottom variant="subtitle1" style={{marginLeft: '400px'}}>
                  Balanced Accuracy: {(bac.toFixed(2)*100)}%
                </Typography>
               </Grid>
            </div>
        )
    }
}

export default confusionMatrix
