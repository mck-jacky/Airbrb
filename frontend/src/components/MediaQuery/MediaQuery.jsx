import PropTypes from 'prop-types';
import { useMediaQuery } from '@mui/material';

const MediaQuery = ({ query, trueElement, falseElement }) => {
  const matches = useMediaQuery(query)
  return (matches
    ? trueElement
    : falseElement
  );
};

MediaQuery.propTypes = {
  query: PropTypes.string,
  trueElement: PropTypes.any,
  falseElement: PropTypes.any
}

export default MediaQuery;
