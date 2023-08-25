import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Box, Rating, Typography } from '@mui/material';

const ReviewItem = ({ review, additionalStyle }) => {
  return (
    <Box data-testid='review-item'>
      <AccountCircleOutlinedIcon sx={{ fontSize: 44, position: 'relative', top: 8, left: -5 }} />
      <Box sx={{ display: 'inline-block' }}>
        <Typography sx={{ fontSize: 14 }} >
          <b>{review.user}</b>
        </Typography>
        <Box sx={{ fontSize: '11px', color: '#666666' }} >
          {moment(review.postedOn, 'YYYYMMDDTHHmmss').format('MMMM YYYY')}
        </Box>
      </Box>
      <Rating name="read-only" value={review.rating.overall} precision={0.5} readOnly sx={{ float: 'right', top: '20px', right: '20px' }} />
      <Typography sx={{
        fontSize: 14,
        lineHeight: 1.3,
        paddingTop: 2,
        paddingRight: 2,
        ...additionalStyle
      }}>
        {review.comment}
      </Typography>
    </Box>
  );
};

ReviewItem.propTypes = {
  review: PropTypes.object,
  additionalStyle: PropTypes.object
}

export default ReviewItem;
