import React from 'react'
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

const FormButton = ({ text, name = '' }) => {
  return (
    <Button data-testid='form-button'
      type="submit"
      name={name}
      fullWidth
      variant="contained"
      color="primary"
      aria-label={text}
      sx={{ mt: 3, mb: 2 }}
    >
      {text}
    </Button>
  )
}

FormButton.propTypes = {
  text: PropTypes.string,
  name: PropTypes.string
}

export default FormButton
