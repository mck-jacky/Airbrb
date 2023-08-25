import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const StackIcon = ({ ele1, ele2 }) => {
  return (
    <Box
      data-testid='stackicon'
      sx={{
        position: 'relative'
      }}
    >
      <span>
        {ele1}
      </span>
      <Box
        sx={{
          position: 'absolute',
          fontSize: 14,
          top: 0,
          left: 20
        }}
      >
        <span>
          {ele2}
        </span>
      </Box>
    </Box>
  );
};

StackIcon.propTypes = {
  ele1: PropTypes.node,
  ele2: PropTypes.node
}

export default StackIcon;
