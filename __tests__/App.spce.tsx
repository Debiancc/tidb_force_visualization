import React from 'react'
import { render } from 'enzyme'
import { expect } from 'chai'
import App from '../src/app'

describe('<App />', () => {
  it('Should be have svg container', () => {
    const wrapper = render(<App />)
    expect(wrapper.find('svg')).to.be.exist
  })
})
