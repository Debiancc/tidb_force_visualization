import React from 'react'
import { render } from 'enzyme'
import { expect } from 'chai'
import Tips from '../src/component/Tips'

describe('<Tips />', () => {
  it('Should has 8 types', () => {
    const wrapper = render(<Tips />)
    expect(wrapper.find('.row')).to.have.lengthOf(8)
  })
})
