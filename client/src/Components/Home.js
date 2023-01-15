import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useState, useEffect } from "react";
import Card from "./Card";
import './css/Home.css'
import Address from './Address';


function Home() {
    const [ProductList, setProductList] = useState([]);
    const [address, setAddress] = useState({
        status : false,
        address : {},
    });

    useEffect(() => {
        fetch('/data')
            .then((response) => response.json())
            .then((data) => {
                setProductList([...data.data])
            })
    }, [])

    return (
        <>
            {
                address.status === false ?
                    <div className="Home">
                        {
                            ProductList.length > 0 ?
                                ProductList.map((product) => {
                                    return <Card key={product['id']} data={product} setAddress={setAddress} />
                                })
                                :
                                <Box sx={{ display: 'flex' }}>
                                    <CircularProgress size="4rem" />
                                </Box>
                        }
                    </div>
                    : <Address data={address.address}/>
            }
        </>
    );
}

export default Home;
