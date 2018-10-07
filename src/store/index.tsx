import * as React from 'react'
import { TYPE } from '../utils/Constant'
import { Component, ReactElement, StatelessComponent } from 'react'

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

interface Store {
  [key: string]: any
}

export const withContext = <T extends Store>(
  Component: StatelessComponent<T>
) => {
  return (props: T): any => {
    return (
      <Store.Consumer>
        {store => <Component {...props} {...store} />}
      </Store.Consumer>
    )
  }
}
