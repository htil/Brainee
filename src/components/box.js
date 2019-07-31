import React from "react";
//import ReactDOM from "react-dom";
//import posed from "react-pose";
import styled from "styled-components";

const BoxComponent = styled.div`
  background-color: ${props => (props.color ? "blue" : "red")};
  display: flex;
  height: 100px;
  width: 100px;
  visibility: ${props => (props.isVisible ? "visible" : "hidden")};
  right: ${props => props.right + "px"};
  margin-right: 10px;
`;

class Box extends React.Component {
  state = { isVisible: true };

  componentDidMount() {
    setInterval(() => {
      this.setState({ isVisible: !this.state.isVisible });
    }, this.props.freq);
  }

  render() {
    const { isVisible } = this.state;
    return (
      <BoxComponent color={this.props.color} isVisible={isVisible}>
        <h1>{this.props.title}</h1>
      </BoxComponent>
    );
  }
}

export default Box;
