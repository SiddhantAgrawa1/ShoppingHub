import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useState, useEffect } from "react";
import Card from "./Card";
import './css/Home.css'

function Home() {
    const [ProductList, setProductList] = useState([]);
    useEffect(() => {
        fetch('/data')
        .then((response) => response.json())
        .then((data) => {
            setProductList([...data.data])
        })
    },[])

    return (
        <div className="Home">
            {
                ProductList.length > 0 ? 
                    ProductList.map((product) => {
                        return <Card key={product['id']} data={product} />
                    })
                : 
                <Box sx={{ display: 'flex'}}>
                    <CircularProgress size="4rem"/>
                </Box>
            }
        </div>
    );
}

export default Home;
