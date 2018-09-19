import React from "react";
import * as d3 from "d3";
import mockInput from "../test/mock/data.json";
import { getColor, NodeData, TYPE, Data, getRadius } from "./utils/Constant";
import { random } from "lodash";
import Render from "./render/index";
import "normalize.css";
import "../style/index.scss";

interface Props {}

interface State {}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.data = {
      links: mockInput.links.map(d => Object.create(d)),
      nodes: mockInput.nodes.map(d => Object.create(d))
    };
  }

  public data: Data;
  public renderHelper?: Render;

  componentDidMount() {
    const width = 1000;
    const height = 600;
    this.renderHelper = new Render("svg", this.data, width, height);
  }

  handleAddRegionButtonClick = () => {
    const newNode = { id: `region-${+new Date()}`, type: TYPE.UNUSED_REGION };
    const targetNode = this.data.nodes.find(x => x.id === "TiKV-2");
    if (!targetNode) {
      throw new Error("Could not found TiKV-3 node, please check mock.json");
    }
    this.data.nodes.push(newNode);
    this.data.links.push({ source: newNode, target: targetNode, value: 5 });
    this.renderHelper && this.renderHelper.reflow();
  };

  handleRaftingButtonClick = () => {
    const node = d3
      .selectAll<SVGCircleElement, NodeData>(".TiKV-1-Region")
      .classed("rafting", true);
    setTimeout(() => {
      node.classed("rafting", false);

      // TODO using enum maybe better than using switch case
      const leaderRegionColor = getColor(null, TYPE.LEADER_REGION);
      const followRegionColor = getColor(null, TYPE.FOLLOW_REGION);
      const randomLeaderIndex = random(0, node.size());

      node.attr("fill", function(d, index, nodes) {
        const curFill = nodes[index].getAttribute("fill");
        if (curFill === leaderRegionColor) return followRegionColor;
        if (index === randomLeaderIndex) return leaderRegionColor;
        return curFill;
      });
    }, 1024 * 5);
  };

  render() {
    return (
      <React.Fragment>
        <div className="operation">
          <button onClick={this.handleAddRegionButtonClick}>Add Region</button>
          <button onClick={this.handleRaftingButtonClick}>Rafting</button>
        </div>

        <div className="tips">
          {Object.keys(TYPE).map(type => {
            // @ts-ignore
            const _type = TYPE[type];
            const color = getColor(null, _type);
            const radius = getRadius(null, _type);
            const pointStyle = {
              width: radius * 2,
              height: radius * 2,
              backgroundColor: color
            };
            return (
              <div className="row" key={`tips-row-${type}`}>
                <div className="point">
                  <div style={pointStyle} />
                </div>
                <div className="text">{type}</div>
              </div>
            );
          })}
        </div>

        <svg width="1000" height="600" />
      </React.Fragment>
    );
  }
}

//TODO for debugger, need remove
// @ts-ignore
window.d3 = d3;
