import React from 'react';
import { render, screen } from '@testing-library/react';
import ShallowRenderer from 'react-test-renderer/shallow'
import ReviewItem from './ReviewItem'

const reviewObj = {
  user: 'Tom',
  postedOn: '20221113T112233',
  rating: 3.5,
  comment: 'This is a good comment'
}

describe('ReviewItem', () => {
  it('is in the document', () => {
    render(<ReviewItem review={reviewObj} additionalStyle={{}} />)
    const component = screen.getByTestId('review-item')
    // screen.debug()
    expect(component).toBeInTheDocument();
  })

  it('has svg', () => {
    render(<ReviewItem review={reviewObj} additionalStyle={{}} />)
    const component = screen.getByTestId('review-item')
    expect(component).toContainHTML('<svg');
  })

  it('has review user name', () => {
    render(<ReviewItem review={reviewObj} additionalStyle={{}} />)
    const component = screen.getByTestId('review-item')
    expect(component).toContainHTML('<b>Tom</b>');
  })

  it('has rating', () => {
    render(<ReviewItem review={reviewObj} additionalStyle={{}} />)
    const component = screen.getByTestId('review-item')
    expect(component).toContainHTML('3.5');
  })

  it('has comment date', () => {
    render(<ReviewItem review={reviewObj} additionalStyle={{}} />)
    const component = screen.getByTestId('review-item')
    expect(component).toContainHTML('November 2022');
  })

  it('has comment', () => {
    render(<ReviewItem review={reviewObj} additionalStyle={{}} />)
    const component = screen.getByTestId('review-item')
    expect(component).toContainHTML('This is a good comment');
  })

  it('has to match the snapshot', () => {
    const renderer = ShallowRenderer.createRenderer()
    renderer.render(<ReviewItem review={reviewObj} additionalStyle={{}} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
