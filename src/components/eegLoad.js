import React, { Component } from 'react'

export class eegLoad extends Component {

    constructor(){
        this.bufferSize = 2000;
        this.weight = 0.9;
        this.weight2 = 0.95;
        this.weight3 = 0.99;
        this.buffer = [];
        
        this.dataArray = {
            af7: {buffer: [], date: []},
            af8: {buffer: [], date: []},
            tp9: {buffer: [], date: []},
            tp10: {buffer: [], date: []}
        }
      
        this.i = -1;
        this.processUpdate = function(sample, id, index) {
            if (sample.electrode !== id) return;

            sample.data.forEach(el => {
                var curBufferSize = this.dataArray[index]["buffer"].length;
                if (curBufferSize > this.bufferSize) this.dataArray[index]["buffer"].shift();
                this.dataArray[index]["buffer"].push(el)

            }); 

        }
        this.bciDevice = new BCIDevice(
            (sample) => {
            this.processUpdate(sample, ScalpElectrodes.AF7, "af7");
            this.processUpdate(sample, ScalpElectrodes.AF8, "af8");
            this.processUpdate(sample, ScalpElectrodes.TP9, "tp9");
            this.processUpdate(sample, ScalpElectrodes.TP10, "tp10");
            
        }
    );         
}
    connect(){
        this.bciDevice.connect();
    }

    disconnect() {
        this.bciDevice.disconnect();
    }
    setBufferSize(x){
        this.bufferSize = x;
    }
    setWeight(x){
        this.weight = x;
    }

    getArrayLength() {
        return this.dataArray['af7']['buffer'].length;
    }
    

    getElementofArray(index,channel,i){
        return this.dataArray[index][channel][i];
    }

    getBuffer(index){
        return this.dataArray[index]["buffer"];
    }

    setElementofArray(index,channel,content){
        this.dataArray[index][channel].push(content);
    }

    getBuffedArray(){
        var buffedArray = [];
        buffedArray.push( this.getBuffer('af7'),  this.getBuffer('af8'), this.getBuffer('tp9'), this.getBuffer('tp10'));
        return buffedArray;
    }

    render() {
        return (
            <div>
                
            </div>
        )
    }
}

export default eegLoad
