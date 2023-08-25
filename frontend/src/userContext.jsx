import React from 'react';
// Reference on react context https://devtrium.com/posts/how-use-react-context-pro
import PropTypes from 'prop-types';

export const UserContext = React.createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = React.useState(() => {
    if (localStorage.token && localStorage.email) {
      return {
        token: localStorage.token,
        email: localStorage.email
      }
    } else {
      return {}
    }
  });
  const [listing, setListing] = React.useState([]);
  const [listingIsReady, setListingIsReady] = React.useState(false)
  const [searchDate, setSearchDate] = React.useState([]);

  return (
    <UserContext.Provider value={{ user, setUser, listing, setListing, searchDate, setSearchDate, listingIsReady, setListingIsReady }}>
      {children}
    </UserContext.Provider>
  );
};

UserContextProvider.propTypes = {
  children: PropTypes.node
};
