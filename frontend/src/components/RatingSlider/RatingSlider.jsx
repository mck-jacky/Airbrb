import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import LinearProgress from '@mui/material/LinearProgress';
import { Typography } from '@mui/material';
import { Tooltip } from 'antd';

const RatingSlider = ({ type, value, displayValue = '', tooltipValue = '', sx }) => {
  const valueNumber = parseFloat(value)
  return (
    <Tooltip title={tooltipValue} placement="right">
      <Box sx={{ ...sx, width: '100%' }} >
        {type}
        <Box sx={{ float: 'right', width: '130px' }} >
          <LinearProgress
            variant="determinate"
            value={valueNumber}
            color='black'
            height='100'
            sx={{
              width: '80px',
              display: 'inline-block',
              top: -2,
              marginRight: '10px'
            }}
          />
          <Typography variant='subtitle2' sx={{ display: 'inline-block', fontSize: 12 }}>
              {displayValue}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
};

RatingSlider.propTypes = {
  type: PropTypes.string,
  value: PropTypes.number,
  displayValue: PropTypes.string,
  tooltipValue: PropTypes.string,
  sx: PropTypes.object
}

export default RatingSlider;
