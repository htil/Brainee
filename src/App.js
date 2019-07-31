import React from "react";
import  DataContextProvider from "./contexts/DataContext";
import StreamingData from "./components/StreamingData"
import LDAPlot from './components/LDAplot.js'
import CSPPlot from './components/CSPplot.js'


function App() {
     return (
      
      <DataContextProvider>
        <StreamingData />
        <LDAPlot />
        <CSPPlot />
      </DataContextProvider>
    
     
    
    );
  }

export default App;
