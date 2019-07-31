import React, { Component, createContext } from 'react';

export const DataContext = createContext();

class DataContextProvider extends Component {
    state = {
        training1: [],
        training2: [],
        testing: [],  
    }

    setTraining1 = (property) =>  {
        this.setState({
            training1: property
        });
    };


    setTraining2 = (property) =>  {
        this.setState({
            training2: property
        });
    };

    setTesting = (property) =>  {
        this.setState({
            testing: property
        });
    };

    render() {
        return (
            <DataContext.Provider value={{...this.state, setTraining1: this.setTraining1, setTraining2: this.setTraining2, setTesting: this.setTesting}}>
                {this.props.children}
            </DataContext.Provider>
        )
    }
}

export default DataContextProvider;