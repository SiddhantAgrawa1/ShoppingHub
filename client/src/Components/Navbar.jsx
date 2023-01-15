import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {Link} from 'react-router-dom'
import './css/Navbar.css';
import { useState, useEffect } from 'react';
// import { getTableRowUtilityClass } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [islogin, setlogin] = useState(false);
  const [name,setName] = useState("");

  const auth = async () => {
    const response = await fetch('/auth')
    const data = await response.json()
    if(response.status === 200) {
      setlogin(true)
      setName(data.name)
      console.log("response name", data.name)
    }
    else 
      setlogin(false)
  }

  useEffect(() => {  
    auth()
  },[])

  const logout = async () => {
		const response = await fetch('/signout');
		if(response.status === 200){
			alert("Please sign in to buy new items")
      setlogin(false)
    }
		else
			alert("Please after some time")

  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
	auth();
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <ThemeProvider theme={darkTheme}>
    <AppBar position="static" color="primary">

      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Cursive',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ShoppingHub
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem key="1" onClick={handleCloseNavMenu}>
                <Link to='/'>Home</Link>
              </MenuItem>
              <MenuItem key="2" onClick={handleCloseNavMenu}>
                <Link to='/contact'>Contact</Link>
              </MenuItem>
              <MenuItem key="3" onClick={handleCloseNavMenu}>
                <Link to='/about'>About</Link>
              </MenuItem>
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Cursive',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ShoppingHub
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <MenuItem key="1" onClick={handleCloseNavMenu}>
                <Link to='/'>Home</Link>
              </MenuItem>
              <MenuItem key="2" onClick={handleCloseNavMenu}>
                <Link to='/contact'>Contact</Link>
              </MenuItem>
              <MenuItem key="3" onClick={handleCloseNavMenu}>
                <Link to='/about'>About</Link>
              </MenuItem>
          </Box>

          {islogin === true? <Typography mx="8px">Hello {name} </Typography>  : null}
          <Box sx={{ flexGrow: 0}}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key="1">
                <Link to='/profile'>Profile</Link>
              </MenuItem>
              <MenuItem key="2">
                <Link to='/cart'>Cart</Link>
              </MenuItem>
              <MenuItem key="3">
                <Link to='/order'>Orders</Link>
              </MenuItem>
              { islogin === false ? 
              <div>
              <MenuItem key="4">
                <Link to='/Signin'>Sign in</Link>
              </MenuItem>
              <MenuItem key="5">
                <Link to='/Signup'>Sign up</Link>
                </MenuItem>
              </div>
              :
              <MenuItem key="6">
                <Link to='/' onClick={logout}>Sign out</Link>
              </MenuItem>}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    </ThemeProvider>
  );
}
export default ResponsiveAppBar;