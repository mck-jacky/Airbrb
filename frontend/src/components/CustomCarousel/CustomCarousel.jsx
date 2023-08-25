import { Carousel } from 'antd';

import { styled } from '@mui/system'

const CustomCarousel = styled(Carousel)({
  '.slick-prev': {
    color: 'white',
    left: '10px',
    zIndex: '1'
  },
  '.slick-prev path': {
    fill: '#FFF',
    stroke: '#FFF',
    strokeWidth: '2px',
  },
  '.slick-next': {
    color: 'white',
    right: '10px',
    zIndex: '1',
  },
  '.slick-next path': {
    fill: '#FFF',
    stroke: '#FFF',
    strokeWidth: '2px',
  },
  '.slick-prev:hover path': {
    fill: '#FFF',
    stroke: '#FFF',
    strokeWidth: '1px',
  },
  '.slick-next:hover path': {
    fill: '#FFF',
    stroke: '#FFF',
    strokeWidth: '1px',
  },
  '.slick-prev:focus': {
    color: 'white'
  },
  '.slick-next:focus': {
    color: 'white'
  },
  '.slick-dots li button': {
    width: '8px',
    height: '8px',
    borderRadius: '100%',
    border: '1px white solid',
  },
  '.slick-dots li.slick-active button': {
    width: '9px',
    height: '9px',
    borderRadius: '100%',
    background: '#FF5A5F',
  }
})

export default CustomCarousel;
