import React, { Component } from 'react'
import { DataContext } from '../contexts/DataContext';

class consoleLogToggle extends Component {
    //static contextType = DataContext;
    render() {
        //const { addData } = this.context;
        return (
           <button onClick={() => alert("Why the hell is it so slow!")}>Toggle the Hello Message</button> 
        )
    }
}

export default consoleLogToggle;
