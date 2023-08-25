import React from 'react';
import { render, screen } from '@testing-library/react';
import StackIcon from './StackIcon'
import ShallowRenderer from 'react-test-renderer/shallow'

describe('StackIcon', () => {
  it('is in the document', () => {
    render(<StackIcon ele1='Element1' ele2='Element2' />)
    const component = screen.getByTestId('stackicon')
    expect(component).toBeInTheDocument();
  })

  it('has element 1', () => {
    render(<StackIcon ele1='Element1' ele2='Element2' />)
    const component = screen.getByTestId('stackicon')
    expect(component).toContainHTML('<span>Element1</span');
  })

  it('has element 2', () => {
    render(<StackIcon ele1='Element1' ele2='Element2' />)
    const component = screen.getByTestId('stackicon')
    expect(component).toContainHTML('<span>Element2</span');
  })

  it('has to match the snapshot', () => {
    const renderer = ShallowRenderer.createRenderer()
    renderer.render(<StackIcon ele1='Element1' ele2='Element2' />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
