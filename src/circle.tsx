import React from "react";
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import style from "./circle.css";

class Circle extends React.Component {
  constructor() {
      super();
  }

  render() {
    return <svg
    version="1.1"
    baseProfile="full"
    height="134" width="134">

    <circle className={style.big} stroke={this.props.color}/>
    <g transform={`translate(${this.props.translate * this.props.depth}, 0)`}>
      <circle className={style.small} stroke={this.props.color}/>
      <text className={style.label} x="70" y="70" stroke={this.props.color} fill={this.props.color}> Clear </text>
  <text className={style.width} x="70" y={this.props.labelY} stroke={this.props.color} fill={this.props.color}> {this.props.gap} </text>
  </g>
</svg>;

  }
}
Circle.propTypes = {
  gap: PropTypes.number,
  labelY: PropTypes.number,
  color: PropTypes.string,
  bo: PropTypes.bool
};

export class LeftCircle extends React.Component {
  constructor() {
    super();
  }

  static getDerivedStateFromProps(props, current_state) {
    var color = props.bo ? "red" : "blue";
      return {
        color: color,
      }
  }


  render() {
    const { color } = this.state;

    return <Circle {...this.props} translate={-10} labelY={50} color={color}/>;
  }
}

export class RightCircle extends React.Component {
  constructor() {
    super();
  }

  static getDerivedStateFromProps(props, current_state) {
    var color = props.bo ? "blue" : "red";
      return {
        color: color,
      }
  }


  render() {
    const { color } = this.state;

    return <Circle {...this.props} translate={10} labelY={90} color={color}/>;
  }
}
