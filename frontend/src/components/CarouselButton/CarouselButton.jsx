import React from 'react';
import PropTypes from 'prop-types';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// fix warning in antd carouseul custom arrow button
// Ref: https://stackoverflow.com/questions/63638782/how-to-solve-warning-react-does-not-recognize-the-currentslide-slidecount
export const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
  <button
    {...props}
    className={
      'slick-prev slick-arrow' +
      (currentSlide === 0 ? ' slick-disabled' : '')
    }
    aria-hidden='true'
    aria-disabled={currentSlide === 0}
    type='button'
  >
    Previous <ArrowBackIosIcon />
  </button>
);
SlickArrowLeft.propTypes = {
  currentSlide: PropTypes.number,
  slideCount: PropTypes.number,
  props: PropTypes.any
}

export const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
  <button
    {...props}
    className={
      'slick-next slick-arrow' +
      (currentSlide === slideCount - 1 ? ' slick-disabled' : '')
    }
    aria-hidden='true'
    aria-disabled={currentSlide === slideCount - 1}
    type='button'
  >
    Next <ArrowForwardIosIcon />
  </button>
);
SlickArrowRight.propTypes = {
  currentSlide: PropTypes.number,
  slideCount: PropTypes.number,
  props: PropTypes.any
}
