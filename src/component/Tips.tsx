import React from "react";
import { getColor, getRadius, TYPE } from "../utils/Constant";

export default () => (
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
);
