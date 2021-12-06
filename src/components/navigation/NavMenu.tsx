import React, { useContext } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Link,
} from '@mui/material';
import { Business, Person } from '@mui/icons-material';
import AccountMenu from './AccountMenu';
import AdminMenu from './AdminMenu';
import { AppContext } from '../../Context';

export default function NavMenu(): JSX.Element {
  const context = useContext(AppContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link href="/" sx={{ textDecoration: 'none' }}>
            My Library
          </Link>
        </Typography>
        <Box style={{ display: context.isStandardUser() ? 'block' : 'none' }}>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
          >
            <Link
              sx={{
                color: '#000000',
                textDecoration: 'none',
              }}
              href="/authors"
            >
              <Person color="secondary" />
            </Link>
          </IconButton>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
          >
            <Link
              sx={{
                color: '#000000',
                textDecoration: 'none',
              }}
              href="/publishers"
            >
              <Business color="secondary" />
            </Link>
          </IconButton>
        </Box>
        <Box style={{ display: context.isAdmin() ? 'block' : 'none' }}>
          <AdminMenu />
        </Box>
        <AccountMenu />
      </Toolbar>
    </AppBar>
  );
}
