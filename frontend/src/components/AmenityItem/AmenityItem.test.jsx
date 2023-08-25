import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ShallowRenderer from 'react-test-renderer/shallow'
import AmenityItem from './AmenityItem'

afterEach(() => {
  cleanup();
})

const amenityMap = {
  essentials: 'RestaurantOutlinedIcon',
  'air-conditioning': 'AcUnitOutlinedIcon',
  'hair-dryer': 'DryOutlinedIcon',
  iron: 'IronOutlinedIcon',
  dryer: 'StadiumOutlinedIcon',
  TV: 'ConnectedTvOutlinedIcon',
  'indoor-fireplace': 'FireplaceOutlinedIcon',
  'private-entrance': 'HttpsOutlinedIcon',
  kitchen: 'CountertopsOutlinedIcon',
  heating: 'HvacOutlinedIcon',
  hangers: 'CheckroomOutlinedIcon',
  washer: 'LocalLaundryServiceOutlinedIcon',
  'hot-water': 'WavesOutlinedIcon',
  'cable-TV': 'TvOutlinedIcon',
  'private-bathroom': 'BathtubOutlinedIcon',
  'private-living-room': 'ChairOutlinedIcon'
}

describe('AmenityItem', () => {
  it('is in the document', () => {
    render(<AmenityItem amenity='essentials' />)
    const component = screen.getByTestId('amenity-item')
    expect(component).toBeInTheDocument();
  })

  it('has div', () => {
    render(<AmenityItem amenity='essentials' />)
    const component = screen.getByTestId('amenity-item')
    expect(component).toContainHTML('<p ')
  })

  for (const key of Object.keys(amenityMap)) {
    it('has icon', () => {
      render(<AmenityItem amenity={key} />)
      const component = screen.getByTestId(amenityMap[key])
      expect(component).toBeInTheDocument();
    })
  }

  for (const key of Object.keys(amenityMap)) {
    it('has title', () => {
      render(<AmenityItem amenity={key} />)
      const component = screen.getByTestId('amenity-item-title')
      expect(component).toBeInTheDocument();
      expect(component).toHaveTextContent(key)
    })
  }

  it('has to match the snapshot', () => {
    const renderer = ShallowRenderer.createRenderer()
    renderer.render(<AmenityItem amenity='essentials' />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
