import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../userContext';
import PropTypes from 'prop-types';
import { isLogin } from '../../helper';

function UserChecking ({ needLogin, specificUserId = '' }) {
  const userObj = useContext(UserContext);
  const isLoggedIn = isLogin(userObj);
  let canAccessComponent = (needLogin && isLoggedIn) || (!needLogin && !isLoggedIn);
  if (canAccessComponent && specificUserId) {
    canAccessComponent = specificUserId === userObj.user.email
  }
  return (
    canAccessComponent ? <></> : <Navigate to='/' />
  )
}

UserChecking.propTypes = {
  needLogin: PropTypes.bool,
  specificUserId: PropTypes.string
}

export default UserChecking;
