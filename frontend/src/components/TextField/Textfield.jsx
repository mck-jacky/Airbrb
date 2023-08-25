import React from 'react'
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';

const Textfield = ({ id, label, name, autoFocus, type }) => {
  return (
    <TextField data-testid='textfield'
      margin="normal"
      required
      fullWidth
      id={id}
      label={label}
      name={name}
      inputProps={{ 'aria-label': { name } }}
      autoFocus={autoFocus}
      type={type}
    />
  )
}

Textfield.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  autoFocus: PropTypes.bool,
  type: PropTypes.string,
}

export default Textfield
