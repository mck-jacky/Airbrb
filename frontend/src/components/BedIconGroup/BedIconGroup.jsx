import React from 'react';
import PropTypes from 'prop-types';

import KingBedOutlinedIcon from '@mui/icons-material/KingBedOutlined';
import SingleBedIcon from '@mui/icons-material/SingleBed';

const BedIconGroup = ({ room }) => {
  let kingIconCount = room.king ? room.king : 0
  kingIconCount += room.queen ? room.queen : 0
  kingIconCount += room.double ? room.double : 0
  const singleIconCount = room.single ? room.single : 0
  const rows = []
  for (let i = 0; i < kingIconCount; i++) {
    rows.push(<KingBedOutlinedIcon key={'king' + i} fontSize='medium' />)
  }
  for (let i = 0; i < singleIconCount; i++) {
    rows.push(<SingleBedIcon key={'single' + i} fontSize='medium' />)
  }
  return <>{rows}</>
}

BedIconGroup.propTypes = {
  room: PropTypes.object
}

export default BedIconGroup;
