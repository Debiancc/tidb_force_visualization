import {
  Data,
  getColor,
  getRadius,
  LinkData,
  NodeData,
  SvgChild
} from "../utils/Constant";
import * as d3 from "d3";

/**
 * Render class
 * 对d3.force布局做了一些对开发友好的封装
 * 使得外部只需要操作instance.data里面的数据，调用reflow完成刷新
 * [fixed]后续优化方向可以使用observable监听data写入动作，隐式完成reflow
 */
export default class Render {
  constructor(svgSelector: string, data: Data, width: number, height: number) {
    this.data = this.watch<Data>(data);
    this.width = width;
    this.height = height;
    this.svgElement = d3.select(svgSelector);
    this.simulation = this.initLayout();
    this.svgChilds = this.initNode();
  }

  public readonly simulation: d3.Simulation<NodeData, undefined>;
  public data: Data;

  private readonly svgChilds: SvgChild;
  private readonly svgElement: d3.Selection<SVGElement, null, HTMLElement, any>;
  private readonly width: number;
  private readonly height: number;

  private watch = <T extends {}>(obj: T): T => {
    return new Proxy(obj, {
      get: (target, key, receiver) => {
        const value = Reflect.get(target, key, receiver);
        if (Array.isArray(value)) {
          return this.watch(value);
        }
        return value;
      },
      set: (target, key, value, receiver) => {
        this.reflow();
        return Reflect.set(target, key, value, receiver);
      }
    });
  };

  private initNode = () => {
    return {
      link: this.svgElement
        .append<SVGGElement>("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 1)
        .selectAll("line")
        .data(this.data.links)
        .enter()
        .append<SVGLineElement>("line")
        .attr("stroke-width", d => d.value),

      node: this.svgElement
        .append<SVGGElement>("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll<SVGCircleElement, NodeData>("circle")
        .data<NodeData>(this.data.nodes)
        .enter()
        .append<SVGCircleElement>("circle")
        .attr("r", getRadius)
        .attr("fill", getColor)
        .attr("class", (d, index) => {
          const id = this.data.nodes[index].id.split("-");
          id.pop();
          return id.join("-");
        })
        .call(
          d3
            .drag<SVGCircleElement, NodeData>()
            .on("start", d => {
              if (!d3.event.active) this.simulation.alphaTarget(1).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on("drag", function(d) {
              d.fx = d3.event.x;
              d.fy = d3.event.y;
            })
            .on("end", d => {
              if (!d3.event.active) this.simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            })
        )
        .on("click", (self, index, nodes) => {
          if (!d3.event.active) this.simulation.alphaTarget(1).restart();
          // @ts-ignore
          self.fx = nodes[0].__data__.x;
          // @ts-ignore
          self.fy = nodes[0].__data__.y;
        })
    };
  };

  private initLayout = () => {
    return d3
      .forceSimulation<NodeData>(this.data.nodes)
      .force(
        "link",
        d3
          .forceLink<NodeData, LinkData>(this.data.links)
          .id(d => d.id)
          .distance(20)
      )
      .force("charge_force", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(this.width / 2, this.height / 2))
      .on("tick", () => {
        if (!this.svgChilds.link || !this.svgChilds.node) return;
        const self = this;
        this.svgChilds.link
          .attr("x1", d => d.source.x || 0)
          .attr("y1", d => d.source.y || 0)
          .attr("x2", d => d.target.x || 0)
          .attr("y2", d => d.target.y || 0);
        this.svgChilds.node
          .attr("cx", function(d) {
            return (d.x = Math.max(
              this.r.baseVal.value,
              Math.min(self.width - this.r.baseVal.value, d.x || 0)
            ));
          })
          .attr("cy", function(d) {
            return (d.y = Math.max(
              this.r.baseVal.value,
              Math.min(self.height - this.r.baseVal.value, d.y || 0)
            ));
          });
      });
  };

  public reflow = () => {
    this.svgChilds.node = this.svgChilds.node.data<NodeData>(
      this.data.nodes,
      function(d) {
        return d.id;
      }
    );
    this.svgChilds.node.exit<NodeData>().remove();
    this.svgChilds.node = this.svgChilds.node
      .enter()
      .append<SVGCircleElement>("circle")
      .attr("fill", getColor)
      .attr("r", getRadius)
      .merge(this.svgChilds.node);

    this.svgChilds.link = this.svgChilds.link.data(this.data.links, function(
      d
    ) {
      return d.source.id + "-" + d.target.id;
    });
    this.svgChilds.link.exit().remove();
    this.svgChilds.link = this.svgChilds.link
      .enter()
      .append<SVGLineElement>("line")
      .merge(this.svgChilds.link);

    this.simulation.nodes(this.data.nodes);
    this.simulation.force(
      "link",
      d3
        .forceLink<NodeData, LinkData>(this.data.links)
        .id(d => d.id)
        .distance(20)
    );
    this.simulation.alpha(1).restart();
    return this;
  };
}
