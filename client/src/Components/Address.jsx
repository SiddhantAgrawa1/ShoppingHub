import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link, redirect } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';

function Copyright(props) {
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			{'Copyright © '}
			<Link to="/" style={{color : "#303030"}}>
				Shopping Hub
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

const theme = createTheme();

export default function Address({data}) {
	
	const [formValidator,setFormValidator] = React.useState({
		address : true,
		pincode : true,
		country : true,
	})

	const [checkDetails, setDetails] = useState(" ");
	const navigate = useNavigate();

	const validate = (data) => {
		const address = data.get("address");
		const pincode = data.get("pincode");
		const country = data.get("country");
		let isValid = true;
		
		if (address === ''){
			setFormValidator((data) => ({...data,address:"This field is required"}))
			isValid = false;
		}else setFormValidator((data) => ({...data,address:""}))

		if (pincode === ''){
			setFormValidator((data) => ({...data,pincode:"This field is required"}))
			isValid = false;
		}else if(!(/^[0-9]+$/.test(pincode))){
			setFormValidator((data) => ({...data,pincode: "Enter valid firstname"}));
			isValid = false;
		}else setFormValidator((data) => ({...data,pincode:""}))

		if (country === ''){
			setFormValidator((data) => ({...data,country:"This field is required"}))
			isValid = false;
		}else setFormValidator((data) => ({...data,country:""}))

		return [isValid,address,pincode,country];
	}


	const handlePayment = async(event) => {

		event.preventDefault();
		const Formdata = new FormData(event.currentTarget);
		console.log(validate(Formdata));
		const [isValid,address,pincode,country] = validate(Formdata)
		console.log(isValid);

		if (isValid)
		{
			try{
				console.log(data)
				const response = await fetch('/orders', {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({product : data, address : [address,pincode,country]})
				})
				const temp = await response.json()
				console.log(temp);
				setDetails("");
				const res = await initPayment(temp.data)
				console.log(res);
			}catch(error){
				console.log(error)
				
			}
		}
		
	}

	const initPayment = async(Data) => {
		const options = {
			key : "rzp_test_EBmmWzwI8SR6vB",
			amount : data['dprice'],
			currency  :"INR",
			name : data['name'],
			description : "Test Transaction",
			order_id : Data['id'],
			handler : async(response) => {
				try {
					const verification = await fetch('/verify', {
						method: 'POST',
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({response:response})
					})
					console.log(verification);
	
				} catch (error) {
					console.log(error);
				}
			},
			theme : {
				color : "#3399cc"
			}
		}
		const rzrp = new window.Razorpay(options)
		rzrp.open();
	}
	
		
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
				
					<Typography component="h1" variant="h5">
						Address Details
					</Typography>
					{checkDetails == " " ? null : <label style={{"color" : "red", "fontSize" : "1.4rem"}}>{checkDetails}</label>}
					<Box component="form" noValidate onSubmit={handlePayment} sx={{ mt: 3 }}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									autoComplete="given-name"
									name="address"
									required
									fullWidth
									id="address"
									label="address"
									autoFocus
								/>
								{formValidator.address == true ? null : <label style={{"color" : "red"}}>{formValidator.address}</label>}
							</Grid>
							<Grid item xs={12}>
								<TextField
                  					type="number"
									required
									fullWidth
									id="pincode"
									label="pincode"
									name="pincode"
									autoComplete="pincode"
								/>
								{formValidator.pincode == true ? null : <label style={{"color" : "red"}}>{formValidator.pincode}</label>}
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="country"
									label="country"
									type="text"
									id="country"
									autoComplete="country"
								/>
								{formValidator.country == true ? null : <label style={{"color" : "red"}}>{formValidator.country}</label>}
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Buy Now
						</Button>
					</Box>
				</Box>
				<Copyright sx={{ mt: 5 }} />
			</Container>
		</ThemeProvider>
	);
}
