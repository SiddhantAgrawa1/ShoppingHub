import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {useState} from 'react'

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link to='/' style={{color : "#303030"}}>
        Shopping Hub
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {

	const navigate = useNavigate();
	const [formValidator,setFormValidator] = React.useState({
		email : true,
		password : true
	})
	const [checkSignin, setSignin] = useState(" ")
	
	const validator = (data) => {
		const email = data.get('email');
		const password = data.get('password')
		let isValid = true;

		if (email == ''){
			setFormValidator((data) => ({...data,email:"This field is required"}))
			isValid = false;
		}else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)){
			setFormValidator((data) => ({...data,email:"Enter valid email address"}));
			isValid = false;
		}else setFormValidator((data) => ({...data,email:""}))

		if (password == ''){
			setFormValidator((data) => ({...data,password:"This field is required"}))
			isValid = false;
		}else if(password.length < 8){
			setFormValidator((data) => ({...data,password:"Password must be 8 character long"}));
			isValid = false;
		}else setFormValidator((data) => ({...data,password:""}))

		return [isValid,email,password];
	}

	const handleSubmit = async(event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const [isValid,email,password] = validator(data)

		if (isValid)
		{
			const response = await fetch('/signin',{
				method : 'POST',
				headers : {
					"Content-Type" : "application/json"
				},
				body : JSON.stringify({email,password})
			})
			const resp = await response.json()
			console.log(resp);
			if(resp.status == 200){
				console.log("SignIn done successfully")
				setSignin("")
				navigate('/')
			}else setSignin("OOPs! Something went wrong");
		}
	};


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            {/* <LockOutlinedIcon /> */}
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
		  {checkSignin == " " ? null : <label style={{"color" : "red"}}>{checkSignin}</label>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
			{formValidator.email == true ? null : <label style={{"color" : "red"}}>{formValidator.email}</label>}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
			{formValidator.password == true ? null : <label style={{"color" : "red"}}>{formValidator.password}</label>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}