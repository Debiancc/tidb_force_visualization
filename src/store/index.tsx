import * as React from 'react'
import { TYPE } from '../utils/Constant'
import {
  ReactChild,
  ReactChildren,
  ReactElement,
  ReactInstance,
  ReactNode,
  ReactPropTypes,
} from 'react'

const initialValue = {
  nodeTypes: Object.keys(TYPE).map(key => {
    // @ts-ignore
    return { key, value: TYPE[key] }
  }),
}

export const Store = React.createContext(initialValue)

export const Provider = (props: any) => {
  return <Store.Provider value={initialValue}>{props.children}</Store.Provider>
}

export const withContext = <T extends {}>(Component: any) => {
  return (props: T) => {
    return (
      <Store.Consumer>
        {store => <Component {...props} {...store} />}
      </Store.Consumer>
    )
  }
}
