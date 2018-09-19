import * as d3 from "d3";
import mockInput from "../test/mock/data.json";
import { getColor, NodeData, TYPE, Data } from "./utils/Constant";
import { random } from "lodash";
import Render from "./render";
import "../style/index.scss";

const app = (e: Event | undefined) => {
  const data: Data = {
    links: mockInput.links.map(d => Object.create(d)),
    nodes: mockInput.nodes.map(d => Object.create(d))
  };
  const width = 1000;
  const height = 600;

  const render = new Render("svg", data, width, height);

  const addRegionButton = document.getElementById("js-add-region");
  const toRaftingButton = document.getElementById("js-to-rafting");
  if (addRegionButton && toRaftingButton) {
    // const reflowLayout = ;

    addRegionButton.addEventListener("click", function() {
      const newNode = { id: `region-${+new Date()}`, type: TYPE.UNUSED_REGION };
      const targetNode = data.nodes.find(x => x.id === "TiKV-2");
      if (!targetNode) {
        throw new Error("Could not found TiKV-3 node, please check mock.json");
      }
      data.nodes.push(newNode);
      data.links.push({ source: newNode, target: targetNode, value: 5 });
      render.reflow();
    });

    toRaftingButton.addEventListener("click", function() {
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
    });
  }
};

//TODO for debugger, need remove
// @ts-ignore
window.d3 = d3;

try {
  // @ts-ignore
  window.onload = app(event);
} catch (e) {
  console.error(e);
}
