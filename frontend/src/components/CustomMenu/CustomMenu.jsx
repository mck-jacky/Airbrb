import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, Divider } from '@mui/material';
import { DownCircleOutlined, UpCircleOutlined } from '@ant-design/icons';
import MediaQuery from '../MediaQuery';

const CustomMenu = ({ menuList }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <MediaQuery query={'(min-width: 740px)'} trueElement={(
      <Box>
        {menuList.map((item, index) => {
          if (item.title === '-') {
            return <span key={index}></span>
          } else {
            return <Button key={index} name={item.controlName} color="inherit" sx={{ color: '#FFFFFF' }} onClick={item.action} >{item.component}</Button>
          }
        })}
      </Box>
    )}
    falseElement={(
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          color= 'white'
        >
          {open
            ? <UpCircleOutlined style={{ fontSize: '150%' }} />
            : <DownCircleOutlined style={{ fontSize: '150%' }} />
          }
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {
            menuList.map((item, index) => {
              if (item.title === '-') {
                return <Divider key={index} />
              } else {
                return <MenuItem key={index} name={item.controlName} onClick={() => { setAnchorEl(null); item.action(); }}>{item.component}</MenuItem>
              }
            })
          }
        </Menu>
      </div>
    )}
    />
  )
}

CustomMenu.propTypes = {
  menuList: PropTypes.array
}

export default CustomMenu;
