import React from 'react';
import { render, screen } from '@testing-library/react';
import FormButton from './FormButton';
import ShallowRenderer from 'react-test-renderer/shallow'

describe('FormButton', () => {
  it('is in the document', () => {
    render(<FormButton text="123" />)
    const component = screen.getByTestId('form-button')
    expect(component).toBeInTheDocument();
  })

  it('has same text', function () {
    render(<FormButton text="123" />)
    const component = screen.getByTestId('form-button')
    expect(component).toHaveTextContent('123')
  });

  it('has to match the snapshot', () => {
    const renderer = ShallowRenderer.createRenderer()
    renderer.render(<FormButton text="123" />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
