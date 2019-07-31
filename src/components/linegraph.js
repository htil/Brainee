import React from "react";
//import ReactDOM from "react-dom";
//import posed from "react-pose";
import styled from "styled-components";
import { TimeSeries } from "pondjs";
import {
  Resizable,
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  BarChart,
  styler
} from "react-timeseries-charts";

import data from "./data";

const Container = styled.div`
  width: 80vw;
  height: 50vh;
`;

class LineGraph extends React.Component {
  state = { points: [] };

  componentDidMount() {
    //onsole.log(data);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.someValue !== prevState.someValue) {
      // create points object
      return null;
    }
  }

  render() {
    let { channel } = this.props;
    var points = this.props.data[channel] ? this.props.data[channel] : false;

    if (!points) return <Container />;
    const series = new TimeSeries({
      name: "sensor_data",
      columns: ["time", "sensor"],
      points
    });

    const style = styler([
      {
        key: "sensor",
        color: "#A5C8E1",
        selected: "#2CB1CF"
      }
    ]);

    return (
      <Container>
        <Resizable>
          <ChartContainer timeRange={series.range()}>
            <ChartRow height="150">
              <YAxis
                id="uV"
                label="uV (vals)"
                min={this.props.range * -1}
                max={this.props.range}
                format=".2f"
                width="70"
              />
              <Charts>
                <LineChart
                  axis="uV"
                  style={style}
                  columns={["sensor"]}
                  series={series}
                  interpolation="curveBasis"
                />
              </Charts>
            </ChartRow>
          </ChartContainer>
        </Resizable>
      </Container>
    );
  }
}

export default LineGraph;
