import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import './css/about.css'

const Profile = () => {
    
    const [data,setData] = useState({
        status : 400,
        name : "",
        email : ""
    })

    const auth = async() => {
        const response = await fetch('/auth')
        const temp = await response.json()
        console.log(temp)
        setData({
            status : 200,
            name : temp.name +" " + temp.data.lastname,
            email : temp.data.email
        })
    }
    
    useEffect(() => {
        auth()
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
            <Typography component="h1"  variant="h5" color="primary">Please add some products!</Typography>
        }
        </>
    )
}

export default Profile;
