import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ShallowRenderer from 'react-test-renderer/shallow'
import Location from './Location'

afterEach(() => {
  cleanup();
})

describe('Location', () => {
  it('is in the document', () => {
    render(<Location address='UNSW,Sydney,NSW' />)
    const component = screen.getByTestId('location')
    expect(component).toBeInTheDocument();
  })

  it('has iframe', () => {
    render(<Location address='UNSW,Sydney,NSW' />)
    const component = screen.getByTestId('location')
    expect(component).toContainHTML('<iframe ')
  })

  it('has map src', () => {
    render(<Location address='UNSW,Sydney,NSW' />)
    const component = screen.getByTestId('location')
    expect(component).toContainHTML('src="https://maps.google.com/maps?q=UNSW,Sydney,NSW')
  })

  it('has to match the snapshot', () => {
    const renderer = ShallowRenderer.createRenderer()
    renderer.render(<Location address='UNSW,Sydney,NSW' />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
