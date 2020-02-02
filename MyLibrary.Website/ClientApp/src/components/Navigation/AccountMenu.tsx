/* eslint-disable linebreak-style */
import React, { useContext } from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import PersonIcon from '@material-ui/icons/Person';
import { AppContext } from '../../Context';

export default function AccountMenu(): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const user = useContext(AppContext).userInfo;

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
      >
        <PersonIcon color="secondary" />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        open={open}
        onClose={handleClose}
      >
        <MenuItem style={{ display: user?.username !== undefined ? 'block' : 'none' }} onClick={handleClose}>My Account</MenuItem>
        <MenuItem style={{ display: user?.username !== undefined ? 'block' : 'none' }} onClick={handleClose}>Log out</MenuItem>
        <MenuItem style={{ display: user?.username === undefined ? 'block' : 'none' }} onClick={handleClose}>
          <NavLink to="/login">
                        Log in
          </NavLink>
        </MenuItem>
        <MenuItem style={{ display: user?.username === undefined ? 'block' : 'none' }} onClick={handleClose}>
                    Sign Up
        </MenuItem>
      </Menu>
    </div>
  );
}
