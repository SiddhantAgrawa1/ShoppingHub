import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import './css/about.css'

const Profile = () => {
    
    const [data,setData] = useState({
        status : 400,
        name : "",
        email : ""
    })

    const getDetails = async() => {
        // Fetching user details
        const response = await fetch('/auth')
        const user = await response.json()
        setData({
            status : 200,
            name : user.name +" " + user.data.lastname,
            email : user.data.email
        })
    }
    
    useEffect(() => {
        getDetails()
    },[])

    return(
        <>
        {
            data.status === 200 ? 
                <div className='about'>
                    <h1>Shopping Hub</h1>
                    <p>Your Name : {data.name}</p>
                    <p>Your Email : {data.email}</p>
                </div>
            :
            <Typography component="h1"  variant="h5" color="primary">Please login!</Typography>
        }
        </>
    )
}

export default Profile;
