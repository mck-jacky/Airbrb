import React from 'react';
import PropTypes from 'prop-types';

import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';
import BathtubOutlinedIcon from '@mui/icons-material/BathtubOutlined';
import ChairOutlinedIcon from '@mui/icons-material/ChairOutlined';
import CheckroomOutlinedIcon from '@mui/icons-material/CheckroomOutlined';
import ConnectedTvOutlinedIcon from '@mui/icons-material/ConnectedTvOutlined';
import CountertopsOutlinedIcon from '@mui/icons-material/CountertopsOutlined';
import DryOutlinedIcon from '@mui/icons-material/DryOutlined';
import FireplaceOutlinedIcon from '@mui/icons-material/FireplaceOutlined';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import HvacOutlinedIcon from '@mui/icons-material/HvacOutlined';
import IronOutlinedIcon from '@mui/icons-material/IronOutlined';
import LocalLaundryServiceOutlinedIcon from '@mui/icons-material/LocalLaundryServiceOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import StadiumOutlinedIcon from '@mui/icons-material/StadiumOutlined';
import TvOutlinedIcon from '@mui/icons-material/TvOutlined';
import WavesOutlinedIcon from '@mui/icons-material/WavesOutlined';
import { Typography } from '@mui/material';

const AmenityItem = ({ amenity }) => {
  const amenityStyles = {
    fontSize: 20,
    position: 'relative',
    top: 5,
    marginRight: '8px'
  };

  let iconComponent = <></>
  if (amenity === 'essentials') {
    iconComponent = <RestaurantOutlinedIcon sx={amenityStyles} />
  } else if (amenity === 'air-conditioning') {
    iconComponent = <AcUnitOutlinedIcon sx={amenityStyles} />
  } else if (amenity === 'hair-dryer') {
    iconComponent = <DryOutlinedIcon sx={amenityStyles} />
  } else if (amenity === 'iron') {
    iconComponent = <IronOutlinedIcon sx={amenityStyles} />
  } else if (amenity === 'dryer') {
    iconComponent = <StadiumOutlinedIcon sx={amenityStyles} />
  } else if (amenity === 'TV') {
    iconComponent = <ConnectedTvOutlinedIcon sx={amenityStyles} />
  } else if (amenity === 'indoor-fireplace') {
    iconComponent = <FireplaceOutlinedIcon sx={amenityStyles} />
  } else if (amenity === 'private-entrance') {
    iconComponent = <HttpsOutlinedIcon sx={amenityStyles} />
  } else if (amenity === 'kitchen') {
    iconComponent = <CountertopsOutlinedIcon sx={amenityStyles} />
  } else if (amenity === 'heating') {
    iconComponent = <HvacOutlinedIcon sx={amenityStyles} />
  } else if (amenity === 'hangers') {
    iconComponent = <CheckroomOutlinedIcon sx={amenityStyles} />
  } else if (amenity === 'washer') {
    iconComponent = <LocalLaundryServiceOutlinedIcon sx={amenityStyles} />
  } else if (amenity === 'hot-water') {
    iconComponent = <WavesOutlinedIcon sx={amenityStyles} />
  } else if (amenity === 'cable-TV') {
    iconComponent = <TvOutlinedIcon sx={amenityStyles} />
  } else if (amenity === 'private-bathroom') {
    iconComponent = <BathtubOutlinedIcon sx={amenityStyles} />
  } else if (amenity === 'private-living-room') {
    iconComponent = <ChairOutlinedIcon sx={amenityStyles} />
  }

  return (
    <>
    <Typography data-testid='amenity-item'>
      {iconComponent}
      <span data-testid='amenity-item-title'>{amenity}</span>
    </Typography>
    </>
  )
}

AmenityItem.propTypes = {
  amenity: PropTypes.string
}

export default AmenityItem;
