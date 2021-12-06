/* eslint-disable linebreak-style */
import {
  IconButton, Menu, MenuItem, Box, Typography, Link,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import Axios from 'axios';
import React, { useContext, useState } from 'react';
import { AppContext } from '../../Context';
import userManager from '../../util/userManager';

export default function AccountMenu(): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const context = useContext(AppContext);

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
    <Box>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
      >
        <Person color="secondary" />
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
        <Link
          sx={{
            color: '#000000',
            textDecoration: 'none',
          }}
          href="/account"
        >
          <MenuItem style={{ display: context.userInfo?.username !== undefined ? 'block' : 'none' }} onClick={handleClose}>
            My Account
          </MenuItem>
        </Link>
        <MenuItem
          style={{ display: context.userInfo?.username !== undefined ? 'block' : 'none' }}
          onClick={() => {
            logOut();
            context.clearUserInfo();
            handleClose();
          }}
        >
          <Link
            sx={{
              color: '#000000',
              textDecoration: 'none',
            }}
            href="/"
          >
            Log out
          </Link>
        </MenuItem>
        <MenuItem style={{ display: context.userInfo?.username === undefined ? 'block' : 'none' }} onClick={userManager.signinRedirect}>
          <Typography>Log in</Typography>
        </MenuItem>
        <MenuItem style={{ display: context.userInfo?.username === undefined ? 'block' : 'none' }} onClick={handleClose}>
          <Link
            sx={{
              color: '#000000',
              textDecoration: 'none',
            }}
            href="/register"
          >
            Sign Up
          </Link>
        </MenuItem>
      </Menu>
    </Box>
  );
}
