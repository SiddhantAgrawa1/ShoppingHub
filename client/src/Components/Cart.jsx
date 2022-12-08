import { useState, useEffect } from "react";
// import Card from "./Card";
import './css/Home.css'
import Typography from '@mui/material/Typography';
import './css/Card.css';

function Cart() {
    const [CartList, setCartList] = useState([]);
    
    useEffect(() => {
        const cart = async () => {
            const response = await fetch('/cart')
            const data = await response.json()
            // console.log("data : ",data)
            if(data.status === 200)
                setCartList([...data.data.cartlist])
            else   
                setCartList([]);
        }
        cart()
    },[])
    
    const buynow = async(data) => {
        // alert("Item added to the cart")
        const response = await fetch('/order',{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                product : data
            })
        })
        // console.log(response);
        if(response.status === 200)
            alert("Order placed successfully!");
        else
            alert("Please log in first!");
    }


    return (
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
    );
}

export default Cart;
