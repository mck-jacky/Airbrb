import React from 'react';
import PropTypes from 'prop-types';

const Location = ({ address }) => {
  return (
    <div className="mapouter" data-testid='location'>
      <div className="gmap_canvas">
        <iframe
        width="100%"
        height="500"
        id="gmap_canvas"
        src={'https://maps.google.com/maps?q=' + address + '&t=&z=11&ie=UTF8&iwloc=&output=embed'}
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0">
        </iframe>
      </div>
    </div>
  );
};

Location.propTypes = {
  address: PropTypes.string
}

export default Location;
