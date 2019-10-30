/* Project: Brainee
*  Program Name: LDAplot.js (React Component)
*  Author: dshah3
*  Date Created: 7/21/19
*  Purpose: Linear Discriminant Analysis Plot with BCI.js
*  Revision History:
*  V1 contains basic LDA plot, V2 contains colored points, V3 contains separation of mental states
*/ 

import React, { Component } from 'react'
import Plot from "react-plotly.js"
//import React Context with all collected EEG Data from the trial
import { DataContext } from "../contexts/DataContext";
//math library
import bci from "bcijs/browser.js"

//LDAPlot component
export class LDAPlot extends Component {
  
  //establishes the context being used as DataContext, which has all recorded EEG data
  static contextType = DataContext;

  //linear discriminant line function, contains slope, y-intercept, point number, and both data arrays as parameters
  plotLine = (m,b,x,firstArray, secondArray) => {

    //checks if data from both training sessions has been collected
    if (firstArray.length>0 && secondArray.length>0) {
      //checks if calculated slope is less than one, indicating negative correlation
      if(m < 1){
        var x1 = 0;
        var x2 = 15;
        var y1 = m * (x1-m) + b;
        var y2 = m * (x2-m) + b;
      }else{
        var y1 = 0;
        var y2 = 20;
        var x1 = (y1 - b) / m;
        var x2 = (y2 - b) / m;
      }

      //for return access in later stages of analysis
      switch (x) {
          case 1:
            return x1;
          case 2:
            return y1;
          case 3:
            return x2;
          case 4:
            return y2;
          default:
            break;
        }
      }
    else{
      return;
    }
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

    getLDAPoints = (firstArray, secondArray,thirdArray,index) => {

      if (firstArray.length>0 && secondArray.length>0){
        var class1 = bci.transpose(firstArray);
        var class2 = bci.transpose(secondArray);
        var cspParams = bci.cspLearn(class1, class2);
        switch (index) {
          case 1:
            return(this.computeFeatures(cspParams, class1))
          case 2:
            return(this.computeFeatures(cspParams, class2));
          case 3:
            if (thirdArray.length>0){
              var class3 = bci.transpose(thirdArray);
              return(this.computeFeatures(cspParams, class3));
            }
            else{
              break;
            }
          default:
            break;
        }
      }
      else{
        return;
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
          var classB = this.computeFeatures(cspParams, class2)

          var {theta, b} = bci.ldaLearn(classA, classB);
    
          var m = -theta[0] / theta[1];
          b = -b / theta[1];

          var ldaSet1 = this.createXPoints(this.getLDAPoints(training1,training2,testing,1))
          var ldaSet2 =this.createYPoints(this.getLDAPoints(training1,training2,testing,1))
          var ldaSet3 = this.createXPoints(this.getLDAPoints(training1,training2,testing, 2))
          var ldaSet4 = this.createYPoints(this.getLDAPoints(training1, training2, testing, 2))
          

          var ldaLine1 = this.plotLine(m,b,1, training1, training2);
          var ldaLine2 = this.plotLine(m,b,2, training1, training2);
          var ldaLine3 = this.plotLine(m,b,3, training1, training2);
          var ldaLine4 = this.plotLine(m,b,4, training1, training2);
        }

        else{
          ldaLine1 = 0;
          ldaLine2 = 0;
          ldaLine3 = 0;
          ldaLine4 = 0;
        }

        if(training1.length>0 && training2.length>0 && testing.length>0){

          var ldaSet5 = this.createXPoints(this.getLDAPoints(training1, training2, testing, 3))
          var ldaSet6 = this.createYPoints(this.getLDAPoints(training1, training2, testing, 3))

          console.log(ldaSet5);

          var class1Array = [];
          var class2Array = [];
          var class3Array = [];
          var class4Array = [];

          for (var i = 0; i < ldaSet5.length; i++){
            if (((ldaSet6[i]-this.plotLine(m,b,3,training1, training2))/(ldaSet5[i]-this.plotLine(m,b,1,training1,training2)))<m){
              class1Array.push(ldaSet5[i]);
              class2Array.push(ldaSet6[i]);
            }
            else{
              class3Array.push(ldaSet5[i]);
              class4Array.push(ldaSet6[i]);

            }
          }

          console.log(class1Array);
          console.log(class2Array);
          console.log(class3Array);
          console.log(class4Array);

        }

        
        
        return (
            <Plot
              data={[
                {
                  x: ldaSet1,
                  y: ldaSet2,
                  type: 'scatter',
                  mode: 'markers',
                  marker: {color: 'red', size: 10},
                  name: 'Training Set 1'
                },

                {
                  x: ldaSet3,
                  y: ldaSet4,
                  type: 'scatter',
                  mode: 'markers',
                  marker: {color: 'blue', size: 10},
                  name: 'Training Set 2'
                },

                {
                  x: class1Array,
                  y: class2Array,
                  type: 'scatter',
                  mode: 'markers',
                  marker: {color: 'green', size: 10},
                  name: 'Testing Set 1'
                },

                {
                  x: class3Array,
                  y: class4Array,
                  type: 'scatter',
                  mode: 'markers',
                  marker: {color: 'orange', size: 10},
                  name: 'Testing Set 1'
                }

               
      
              ]}

                layout={{
                    width: 950,
                    height: 500,
                    title: '<b>Linear Discriminant Analysis</b>',
                    "titlefont": {
                      "size": 20,
                    },

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

                shapes: [{
                  type: 'line',
                    x0: ldaLine1,
                    y0: ldaLine2,
                    x1: ldaLine3,
                    y1: ldaLine4,
                    line: {
                      color: 'rgb(55,128,191)',
                      width: 3
                    }
                }]
                    
              }}
        />

        )

      }

    }
    export default LDAPlot
