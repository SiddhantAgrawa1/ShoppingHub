import { useState, useEffect } from "react";
import './css/Home.css'
import Typography from '@mui/material/Typography';
import './css/Card.css';
import Address from './Address';
import { useNavigate } from "react-router-dom";


function Cart() {

    const [address, setAddress] = useState({
        status : false,
        address : {},
    });

    const [CartList, setCartList] = useState([]);
    
    const cart = async () => {
        const response = await fetch('/cart')
        const data = await response.json()
        
        if(data.status === 200)
            setCartList([...data.data.cartlist])
        else   
            setCartList([]);
    }

    useEffect(() => {   
        cart()
    },[])
    
    const buynow = async(data) => {
        setAddress({
            status : true,
            address : data
        })
    }

    const remove = async(data) => {
        const response = await fetch('/removefromcart',{
            method : 'POST', 
            headers : {
                'Content-Type' : 'application/json'
            }, 
            body : JSON.stringify({id : data.id})
        })
        const resp = await response.json()
        console.log(resp)
        if (resp.status == 200){
            alert("Item removed");
            cart()
        }else{
            alert("Unable to remove item");
        }
            
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
                                            <button onClick={() => remove(data)}>Remove</button>
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
