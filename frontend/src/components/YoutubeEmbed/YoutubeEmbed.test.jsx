import React from 'react';
import { render, screen } from '@testing-library/react';
import YoutubeEmbed from './YoutubeEmbed'
import ShallowRenderer from 'react-test-renderer/shallow'

describe('YoutubeEmbed', () => {
  it('is in the document', () => {
    render(<YoutubeEmbed embedId='abcd' />)
    const component = screen.getByTestId('youtube-embed')
    expect(component).toBeInTheDocument();
  })

  it('has iframe', () => {
    render(<YoutubeEmbed embedId='abcd' />)
    const component = screen.getByTestId('youtube-embed')
    expect(component).toContainHTML('<iframe ')
  })

  it('has correct src', () => {
    render(<YoutubeEmbed embedId='abcd' />)
    const component = screen.getByTestId('youtube-embed')
    expect(component).toContainHTML('src="https://www.youtube.com/embed/abcd"')
  })

  it('has correct properties', () => {
    render(<YoutubeEmbed embedId='abcd' />)
    const component = screen.getByTestId('youtube-embed')
    expect(component).toContainHTML('width="100%')
    expect(component).toContainHTML('height="300')
    expect(component).toContainHTML('frameborder="0"')
    expect(component).toContainHTML('allowfullscreen=""')
    expect(component).toContainHTML('title="Embedded youtube"')
  })

  it('has to match the snapshot', () => {
    const renderer = ShallowRenderer.createRenderer()
    renderer.render(<YoutubeEmbed embedId='abcd' />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
