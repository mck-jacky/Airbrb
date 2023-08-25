import React from 'react';
import { render, screen } from '@testing-library/react';
import Textfield from './Textfield';
import ShallowRenderer from 'react-test-renderer/shallow'

describe('Textfield', () => {
  it('is in the document', () => {
    render(<Textfield id='login-password' label='password' name='password' />)
    const component = screen.getByTestId('textfield')
    expect(component).toBeInTheDocument();
  })

  it('has text', function () {
    render(<Textfield id='login-password' label='password' name='password' />)
    const component = screen.getByTestId('textfield')
    expect(component).toHaveTextContent('password')
  });

  it('has no initial value', function () {
    const { container } = render(<Textfield id='login-password' label='password' name='password' />)
    const input = container.querySelector('input')
    expect(input).toHaveValue('')
  })

  it('has to match the snapshot', () => {
    const renderer = ShallowRenderer.createRenderer()
    renderer.render(<Textfield id='login-password' label='password' name='password' />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
