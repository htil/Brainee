import React, { Component } from 'react'
import Plot from "react-plotly.js"
import { DataContext } from "../contexts/DataContext";
import bci from "bcijs/browser.js"

export class pie extends Component {
    static contextType = DataContext;

    createPercentages = (array) => {
        var percentageArray = [];
        var zeroCounter = 0;
        var oneCounter = 0;
        for (var i = 0; i < array.length; i++){
            if (array[i] === 0){
                zeroCounter++;
            }
            else{
                oneCounter++;
            }
        }
        percentageArray.push(zeroCounter/array.length);
        percentageArray.push(oneCounter/array.length);

        return percentageArray;
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
  



    render() {
        const { training1, training2, testing } = this.context;

        if (training1.length>0 && training2.length>0 && testing.length>0){
            
            var cspParams = bci.cspLearn(bci.transpose(training1), bci.transpose(training2));
            var classA = this.computeFeatures(cspParams, bci.transpose(training1));
            var classB = this.computeFeatures(cspParams, bci.transpose(training2));
            var classC = this.computeFeatures(cspParams, bci.transpose(testing));
            var ldaParams = bci.ldaLearn(classA, classB);
            var ldaClassify = bci.ldaClassify(ldaParams, classC);

        }

        else{
            ldaClassify=[]
        }
        return (
            <Plot 
            data={[
                {
                    values: this.createPercentages(ldaClassify),
                    type: 'pie',
                    labels: ['Classified in Training Set 1','Classified in Training Set 2'],
                    marker: {
                        colors: ['rgb(225, 165, 0)', 'rgb(0, 230, 0)']
                    }

                },
            ]}

            layout={{
                width: 800,
                height: 500,
                title: '<b>Linear Discriminant Analysis Results</b>',
                    "titlefont": {
                      "size": 20,
                    },
            }}
            />
        )
    }
}

export default pie
