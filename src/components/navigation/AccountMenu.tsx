/* eslint-disable linebreak-style */
import {
  IconButton, Menu, MenuItem, makeStyles,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import Axios from 'axios';
import React, { useContext, useState } from 'react';
import { AppContext } from '../../Context';
import userManager from '../../util/userManager';

const useStyles = makeStyles(() => ({
  navLink: {
    color: '#000000',
    textDecoration: 'none',
  },
}));

export default function AccountMenu(): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const context = useContext(AppContext);
  const classes = useStyles();

  const logOut = () => {
    Axios.post('/api/user/logout');
  };

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
        <a className={classes.navLink} href="/account">
          <MenuItem style={{ display: context.userInfo?.username !== undefined ? 'block' : 'none' }} onClick={handleClose}>
            My Account
          </MenuItem>
        </a>
        <MenuItem
          style={{ display: context.userInfo?.username !== undefined ? 'block' : 'none' }}
          onClick={() => {
            logOut();
            context.clearUserInfo();
            handleClose();
          }}
        >
          <a className={classes.navLink} href="/">
            Log out
          </a>
        </MenuItem>
        <MenuItem style={{ display: context.userInfo?.username === undefined ? 'block' : 'none' }} onClick={userManager.signinRedirect}>
            <span>Log in</span>
        </MenuItem>
        <MenuItem style={{ display: context.userInfo?.username === undefined ? 'block' : 'none' }} onClick={handleClose}>
          <a className={classes.navLink} href="/register">
            Sign Up
          </a>
        </MenuItem>
      </Menu>
    </div>
  );
}
