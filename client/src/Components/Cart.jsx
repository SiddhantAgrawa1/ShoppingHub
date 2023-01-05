import { useState, useEffect } from "react";
import './css/Home.css'
import Typography from '@mui/material/Typography';
import './css/Card.css';
import Address from './Address';

function Cart() {
    const [address, setAddress] = useState({
        status : false,
        address : {},
    });

    const [CartList, setCartList] = useState([]);
    
    useEffect(() => {
        const cart = async () => {
            const response = await fetch('/cart')
            const data = await response.json()
            
            if(data.status === 200)
                setCartList([...data.data.cartlist])
            else   
                setCartList([]);
        }
        cart()
    },[])
    
    const buynow = async(data) => {
        setAddress({
            status : true,
            address : data
        })
    }


    return (
        <>
        {
            address.status === false ?    
                <div className="Home">
                    {
                        CartList.length > 0 ? 
                            CartList.map((data,index) => {
                                // console.log(data);
                                return (
                                    <div key={index} className='card'>
                                        <div>
                                            <img src={require(`${data['imgsrc']}`)}/>
                                        </div>
                                        <div id='name'>{data['name']}</div>
                                        <div id='price'>
                                            <span id='oprice'>${data['oprice']} </span>
                                            <span id='dprice'>${data['dprice']}</span>
                                        </div>
                                        <div>
                                        <span id='discount'>Flat {data['discount']} off</span>
                                        </div>
                                        <div>
                                            <button onClick={() => buynow(data)}>Buy Now</button>
                                        </div>
                                    </div>
                                )
                            })
                        : <Typography component="h1"  variant="h5" color="primary">Please add some products!</Typography>
                    }
                </div> 
            : <Address data={address.address}/>        
        }
        </>
    );
}

export default Cart;
