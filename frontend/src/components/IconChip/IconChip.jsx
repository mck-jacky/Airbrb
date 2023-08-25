import React from 'react';
import PropTypes from 'prop-types';
import { Chip, Stack, styled } from '@mui/material';

const StyledChip = styled(Chip)({
  border: 0,
  cursor: 'pointer'
});

const IconChip = ({ icon, label }) => {
  return (
    <Stack direction="row" spacing={1}>
      <StyledChip icon={icon} label={label} variant="outlined" />
    </Stack>
  );
}

IconChip.propTypes = {
  icon: PropTypes.element,
  label: PropTypes.string
}

export default IconChip;
