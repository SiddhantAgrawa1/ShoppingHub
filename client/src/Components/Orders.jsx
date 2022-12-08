import { useState, useEffect } from "react";
// import Card from "./Card";
import './css/Home.css'
import Typography from '@mui/material/Typography';

function Orders() {
    const [OrderList, setOrderList] = useState([]);
    
    useEffect(() => {
        const order = async () => {
            const response = await fetch('/order')
            const data = await response.json()
            // console.log("data : ",data)
            if(data.status === 200)
                setOrderList([...data.data.orderlist])
            else   
                setOrderList([]);
        }
        order()
    },[])
    
    const cancelOrder = () => {
        console.log("Order cancelled");
    }


    return (
        <div className="Home">
            {
                OrderList.length > 0 ? 
                    OrderList.map((data,index) => {
                        return (
                        <div className='card' key={index}>
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
                                <button onClick={() => cancelOrder()}>Cancel Order</button>
                            </div>
                        </div>)
                    })
                : <Typography component="h1"  variant="h5" color="primary">Please add some products!</Typography>
            }
        </div>
    );
}

export default Orders;
