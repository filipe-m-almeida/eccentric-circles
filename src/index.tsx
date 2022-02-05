import React from "react";
import ReactDOM from "react-dom";
import {LeftCircle, RightCircle} from "./circle.tsx";
import style from "./circle.css";

class EccentricCircles extends React.Component {
  constructor() {
    super();
    this.state = {
      gap: 0,
      depth: 0.4,
      lastX: 0,
      originalGap: 0,
      left: 0,
      top: 0,
      bo: true,
      saturation: 0
    }
  }
  render() {
    return <div className={style.outer} style={{left: this.state.left, top: this.state.top}}>
      <div id="left">
        <LeftCircle gap={this.state.gap} depth={this.state.depth} bo={this.state.bo} saturation={this.state.saturation}/>
        </div>
      <div className={style.middle} style={{width : this.state.gap}}>
      </div>
      <div id="right">
        <RightCircle gap={this.state.gap} depth={this.state.depth} bo={this.state.bo} saturation={this.state.saturation}/>
      </div>
    </div>;
  }

componentWillMount() {
  document.addEventListener("keydown", this.handleKey.bind(this));
  document.addEventListener("touchstart", this.touchStart.bind(this));
  document.addEventListener("touchmove", this.touchMove.bind(this));
}

componentWillUnMount() {
  document.removeEventListener("keydown", this.handleKey.bind(this));
}

setLeft(left: number) {
  this.setState({left: left});
}

setTop(top: number) {
  this.setState({top: top});
}

setGap(gap : number) {
  this.setState({gap: gap});
  console.log("gap = " + this.state.gap.toFixed(1));
}

incGap() {
  this.setGap(this.state.gap + 10);
}

decGap() {
  this.setGap(Math.max(0, this.state.gap - 10));
}

rel(state, rel, min : number, max: number) {
  let value = this.state[state] + rel;

  if (is_defined(min)) {
    value = Math.max(value, min);
  }

  if (is_defined(max)) {
    value = Math.min(value, max);
  }

  this.setState({[state]: value});
  console.log(`${state}: ${this.state[state]}`);
}

/*
var keybindings = {
  "d": _ => this.incGap(),
  "a": _ => this.decGap(),
  "w": _ => {this.rel("depth", 0.1)},
  "s": _ => this.rel("depth", -0.1),
  "ArrowLeft": _ => this.rel("left", -10),
  "ArrowRight": _ => this.rel("left", 10),
  "ArrowTop": _ => this.rel("top", -10),
  "ArrowTop": _ => this.rel("top", 10)
}
*/

handleKey(evt: KeyboardEvent) {
//    evt = evt || window.event;

    switch(evt.key) {
      case "d":
        this.incGap();
        break;
      case "a":
        this.decGap();
      break;
      case "w":
        this.rel("depth", 0.1);
        break;
      case "s":
        this.rel("depth", -0.1);
      break;
      case "ArrowLeft":
        this.rel("left", -10);
      break;
      case "ArrowRight":
        this.rel("left", 10);
      break;
      case "ArrowUp":
        this.rel("top", -10);
      break;
      case "ArrowDown":
        this.rel("top", 10);
      break;
      case " ":
        this.setState({bo: !this.state.bo});
        console.log("state = " + this.state.bo);
      break;
      case "2":
        this.rel("saturation", 10, 0, 255);
        break;
      case "1":
        this.rel("saturation", -10, 0, 255);
        break;
    }
}

// TODO(filipe): This is broken with the CSS transition
touchStart(evt: TouchEvent) {
  this.state.lastX = evt.touches[0].pageX;
  this.state.originalGap = this.state.gap;
}

touchMove(evt: TouchEvent) {
  let delta = evt.touches[0].pageX - this.state.lastX;
  this.setGap(this.state.originalGap + delta);
}

}

ReactDOM.render(
  <EccentricCircles/>,
  document.getElementById("root")
);

function is_defined(value : any) {
  return (!(typeof value === 'undefined'));
}