import React from 'react'
import { getColor, getRadius, TYPE } from '../utils/Constant'
import { withContext } from '../store'

interface Props {
  nodeTypes: { key: string; value: string }[]
}

export default withContext<Props>((props: Props, context: any) => {
  debugger
  return (
    <div className="tips">
      {props.nodeTypes.map(({ key, value }) => {
        // @ts-ignore
        const color = getColor(null, value)
        const radius = getRadius(null, value)
        const pointStyle = {
          width: radius * 2,
          height: radius * 2,
          backgroundColor: color,
        }
        return (
          <div className="row" key={`tips-row-${key}`}>
            <div className="point">
              <div style={pointStyle} />
            </div>
            <div className="text">{key}</div>
          </div>
        )
      })}
    </div>
  )
})
