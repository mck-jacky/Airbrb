import React from 'react';
import PropTypes from 'prop-types';

import useMediaQuery from '@mui/material/useMediaQuery';
import StarRateIcon from '@mui/icons-material/StarRate';
import { obtainFormattedNumber, obtainSvgRatingString } from '../../helper';
import { Box, Grid, Typography } from '@mui/material';
import RatingSlider from '../RatingSlider';

import { Empty } from 'antd';
import ReviewItem from '../ReviewItem';
import MediaQuery from '../MediaQuery';

const ReviewsBoard = ({ reviews, reviewRatings, ratingFilterValue }) => {
  const [reviewDisplayList, setReviewDisplayList] = React.useState([])
  const maxMediumMatches = useMediaQuery('(max-width:899px)');
  const maxSmallMatches = useMediaQuery('(max-width:599px)');

  const leftContainerStyle = maxSmallMatches ? { height: '50px' } : maxMediumMatches ? { height: '150px' } : {}
  const rightContainerStyle = maxSmallMatches ? { height: 'calc(80vh - 90px - 50px)' } : maxMediumMatches ? { height: 'calc(80vh - 90px - 150px)' } : { height: 'calc(80vh - 90px)' }

  React.useEffect(() => {
    const dList = []
    for (const review of reviews) {
      if ((ratingFilterValue === 0) || (ratingFilterValue > 0 && review.rating.overall === ratingFilterValue)) {
        dList.push(review)
      }
    }
    setReviewDisplayList(dList)
  }, [ratingFilterValue])

  return (
    <Box
      sx={{ flexGrow: 1, marginTop: '40px' }}
    >
      <Grid container spacing={2}>
        <Grid className='left-container' sx={leftContainerStyle} item xs={12} md={5} >
          <Box>
            <Typography variant='h7' mr={2} sx={{ fontWeight: 'bold' }} >
              <StarRateIcon sx={{ position: 'relative', top: '3px', height: '20px' }} />
                { obtainSvgRatingString(reviews) }
            </Typography>
            <Typography variant='h7' mr={2} sx={{ fontWeight: 'bold' }}>{obtainFormattedNumber(reviews.length)} reviews </Typography>
            <MediaQuery query={'(min-width: 600px)'} trueElement={(
              <Grid className='rating-left' id='rating-left' container spacing={2}>
                <Grid item xs={12} sm={6} md={12}>
                  <RatingSlider type='Cleanliness' value={reviewRatings.category.cleanliness / 5 * 100} displayValue={reviewRatings.category.cleanliness}/>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                  <RatingSlider type='Accuracy' value={reviewRatings.category.accuracy / 5 * 100} displayValue={reviewRatings.category.accuracy}/>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                  <RatingSlider type='Communication' value={reviewRatings.category.communication / 5 * 100} displayValue={reviewRatings.category.communication}/>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                  <RatingSlider type='Location' value={reviewRatings.category.location / 5 * 100} displayValue={reviewRatings.category.location}/>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                  <RatingSlider type='Check-In' value={reviewRatings.category.checkin / 5 * 100} displayValue={reviewRatings.category.checkin}/>
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                  <RatingSlider type='Value' value={reviewRatings.category.value / 5 * 100} displayValue={reviewRatings.category.value}/>
                </Grid>
              </Grid>
            )}
            falseElement={<></>} />
          </Box>
        </Grid>
        <Grid className='right-container' sx={{ ...rightContainerStyle, overflow: 'auto' }} item xs={12} md={7} >
          {
            ratingFilterValue !== 0 &&
            <Typography variant='h7' mr={2} sx={{ fontWeight: 'bold' }}>{ratingFilterValue}-Star reviews</Typography>
          }
          <MediaQuery query={'(max-width: 599px)'} trueElement={(
            <Grid className='rating-right' id='rating-right' container spacing={2} >
              <Grid item xs={12} sm={6} md={12}><RatingSlider type='Cleanliness' value={reviewRatings.category.cleanliness / 5 * 100} displayValue={reviewRatings.category.cleanliness}/></Grid>
              <Grid item xs={12} sm={6} md={12}><RatingSlider type='Accuracy' value={reviewRatings.category.accuracy / 5 * 100} displayValue={reviewRatings.category.accuracy}/></Grid>
              <Grid item xs={12} sm={6} md={12}><RatingSlider type='Communication' value={reviewRatings.category.communication / 5 * 100} displayValue={reviewRatings.category.communication}/></Grid>
              <Grid item xs={12} sm={6} md={12}><RatingSlider type='Location' value={reviewRatings.category.location / 5 * 100} displayValue={reviewRatings.category.location}/></Grid>
              <Grid item xs={12} sm={6} md={12}><RatingSlider type='Check-In' value={reviewRatings.category.checkin / 5 * 100} displayValue={reviewRatings.category.checkin}/></Grid>
              <Grid item xs={12} sm={6} md={12}><RatingSlider type='Value' value={reviewRatings.category.value / 5 * 100} displayValue={reviewRatings.category.value}/></Grid>
            </Grid>
            )}
            falseElement={<></>}
          />
        {
          reviewDisplayList.length === 0
            ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            : reviewDisplayList.map((review, index) => (
              <Box key={index} sx={{ marginBottom: '20px', position: 'relative' }}>
                <ReviewItem review={review} />
              </Box>
            ))
        }
        </Grid>
      </Grid>
    </Box>
  );
};

ReviewsBoard.propTypes = {
  reviews: PropTypes.array,
  reviewRatings: PropTypes.object,
  ratingFilterValue: PropTypes.number
}

export default ReviewsBoard;
