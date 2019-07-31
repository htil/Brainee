import React, { Component } from 'react'
import Plot from "react-plotly.js"
import { DataContext } from "../contexts/DataContext";
import bci from "bcijs/browser.js"

export class LDAPlot extends Component {
    static contextType = DataContext;

    every50 = (array, whichArray) => {
        for (var i = 0; i < array.length; i+=50){
            whichArray.push(array[i]);
        }
        return whichArray;
    }

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

    getCSPPoints = (firstArray, secondArray,thirdArray,index) => {

      if (firstArray.length>0 && secondArray.length>0){
        var cspParams = bci.cspLearn(bci.transpose(firstArray), bci.transpose(secondArray));
        var classA = this.computeFeatures(cspParams, bci.transpose(firstArray));
        var classB = this.computeFeatures(cspParams, bci.transpose(secondArray));
        var cspClassify = bci.cspProject(cspParams, bci.transpose(firstArray), 2);
        var cspClassify2 = bci.cspProject(cspParams, bci.transpose(secondArray), 2);
        
        var cspArray = [];
        var cspArray2 = [];
        var cspArray3 = [];

        switch(index){
            case 1:
                return (this.every50(cspClassify, cspArray))
            case 2:
                return (this.every50(cspClassify2, cspArray2))
            case 3:
                if (thirdArray.length>0){
                    var cspClassify3 = bci.cspProject(cspParams, bci.transpose(thirdArray), 2);
                    return (this.every50(cspClassify3, cspArray3))
                }
                else{
                    break;
                }
            default:
                break;
        }

      }
    }        

    createXPoints = (randomData) => {
      if (randomData === undefined){
        return;
      }
      var thisArray = [];
      for (var i = 0; i < randomData.length; i++){
          for (var j = 0; j < randomData[i].length; j++){
              thisArray.push(Math.abs(randomData[i][0]));
  
          }
      }
      return thisArray;
    }
  
  createYPoints = (randomData) => {
    if (randomData === undefined){
      return;
    }
      var thisArray = [];
      for (var i = 0; i < randomData.length; i++){
          for (var j = 0; j < randomData[i].length; j++){
              thisArray.push(Math.abs(randomData[i][1]));
              
          }
      }
      return thisArray;
    }

    render() {
        
        const { training1, training2, testing } = this.context;

        if (training1.length>0 && training2.length>0){
          var class1 = bci.transpose(training1);
          var class2 = bci.transpose(training2);
          var cspParams = bci.cspLearn(class1, class2);
          var classA = this.computeFeatures(cspParams, class1);
          var classB = this.computeFeatures(cspParams, class2);
        


          var cspSet1 = this.createXPoints(this.getCSPPoints(training1,training2,testing,1))
          var cspSet2 =this.createYPoints(this.getCSPPoints(training1,training2,testing,1))
          var cspSet3 = this.createXPoints(this.getCSPPoints(training1,training2,testing, 2))
          var cspSet4 = this.createYPoints(this.getCSPPoints(training1, training2, testing, 2))
          
        }

        if(training1.length>0 && training2.length>0 && testing.length>0){

            var cspSet5 = this.createXPoints(this.getCSPPoints(training1, training2, testing, 3))
            var cspSet6 = this.createYPoints(this.getCSPPoints(training1, training2, testing, 3))
        }
        
        return (
            <Plot
              data={[
                {
                  x: cspSet1,
                  y: cspSet2,
                  type: 'scatter',
                  mode: 'markers',
                  marker: {color: 'red', size: 10},
                },

                {
                  x: cspSet3,
                  y: cspSet4,
                  type: 'scatter',
                  mode: 'markers',
                  marker: {color: 'blue', size: 10},
                },

                {
                  x: cspSet5,
                  y: cspSet6,
                  type: 'scatter',
                  mode: 'markers',
                  marker: {color: 'green', size: 10}
                }
      
              ]}

                layout={{
                    width: 950,
                    height: 500,
                    title: 'Common Spatial Pattern',

                xaxis: {
                    range: [2,15],
                title: {
                    text: 'Frequency'
                }
              },

                yaxis: {
                    range: [7,20],
                title: {
                    text: 'Amplitude'
                }
              },

                    
              }}
        />

        )

      }

    }
    export default LDAPlot
