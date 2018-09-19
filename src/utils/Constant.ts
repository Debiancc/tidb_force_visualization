import { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";
import * as d3 from "d3";

export enum TYPE {
  TIKV_INSTANCE = "tikv_instance",
  PD_INSTANCE = "pd_instance",
  TIDB_INSTANCE = "tidb_instance",
  LEADER_REGION = "leader_region",
  FOLLOW_REGION = "follow_region",
  UNUSED_REGION = "unused_region",
  CLIENT = "client",
  TIDB_CLUSTERS = "tidb_clusters",
  PD_CLUSTERS = "pd_clusters"
}

export interface Data {
  links: LinkData[];
  nodes: NodeData[];
}

export interface SvgChild {
  link: d3.Selection<SVGLineElement, LinkData, SVGGElement, null>;
  node: d3.Selection<SVGCircleElement, NodeData, SVGGElement, null>;
}

export interface NodeData extends SimulationNodeDatum {
  id: string;
  type: TYPE;
}

export interface LinkData extends SimulationLinkDatum<NodeData> {
  source: NodeData;
  target: NodeData;
  value: number;
}

export interface AdjList {
  [key: string]: boolean;
}

export const getColor = (node?: NodeData | any, type?: TYPE | any) => {
  switch (node ? node.type : type) {
    case TYPE.TIKV_INSTANCE:
      return "blue";
    case TYPE.PD_INSTANCE:
    case TYPE.PD_CLUSTERS:
      return "orange";
    case TYPE.TIDB_INSTANCE:
    case TYPE.TIDB_CLUSTERS:
      return "pink";
    case TYPE.LEADER_REGION:
      return "rgb(37, 78, 119)";
    case TYPE.FOLLOW_REGION:
      return "rgb(172, 213, 242)";
    case TYPE.UNUSED_REGION:
      return "rgb(237, 237, 237)";
    case TYPE.CLIENT:
    default:
      return "red";
  }
};

export const getRadius = ({ type }: NodeData): number => {
  switch (type) {
    case TYPE.TIKV_INSTANCE:
      return 10;
    case TYPE.PD_INSTANCE:
      return 10;
    case TYPE.TIDB_INSTANCE:
      return 10;
    case TYPE.FOLLOW_REGION:
    case TYPE.LEADER_REGION:
    case TYPE.UNUSED_REGION:
      return 8;
    case TYPE.CLIENT:
    default:
      return 12;
  }
};
